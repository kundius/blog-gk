import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import sharp from "sharp";
import { encode } from "blurhash";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const s3 = new S3Client({
  region: process.env.S3_REGION ?? "us-east-1",
  endpoint: process.env.S3_ENDPOINT || undefined,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
  },
});

const BUCKET = process.env.S3_BUCKET ?? "";
const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 900;

async function getBuffer(key: string): Promise<Buffer> {
  const result = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
  );
  const body = result.Body;
  if (!body) throw new Error("Empty S3 body");
  const chunks: Buffer[] = [];
  const stream = body instanceof Readable ? body : Readable.from(body as never);
  for await (const chunk of stream) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

async function putBuffer(key: string, body: Buffer, contentType: string): Promise<void> {
  await s3.send(
    new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType }),
  );
}

async function removeBuffer(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

async function processImage(buffer: Buffer): Promise<{
  data: Buffer;
  width: number;
  height: number;
  blurhash?: string;
}> {
  const processed = await sharp(buffer)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: "cover" })
    .modulate({ saturation: 1.06, brightness: 1.02 })
    .linear(1.05, -8)
    .sharpen({ sigma: 1.1, m1: 1, m2: 2 })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });

  let blurhash: string | undefined;
  try {
    const thumb = await sharp(processed.data)
      .resize(64, 64, { fit: "inside" })
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });
    blurhash = encode(
      new Uint8ClampedArray(thumb.data),
      thumb.info.width,
      thumb.info.height,
      4,
      4,
    );
  } catch {
    blurhash = undefined;
  }

  return {
    data: processed.data,
    width: processed.info.width ?? TARGET_WIDTH,
    height: processed.info.height ?? TARGET_HEIGHT,
    blurhash,
  };
}

async function main(): Promise<void> {
  const force = process.argv.includes("--force");

  const categories = await prisma.category.findMany({
    where: force ? {} : { thumbnailId: null },
  });

  console.log(`Categories to process: ${categories.length}`);
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const category of categories) {
    try {
      const article = await prisma.article.findFirst({
        where: {
          status: "published",
          thumbnail: { isNot: null },
          categoryId: category.id,
        },
        include: { thumbnail: true },
        orderBy: [{ hitsCount: "desc" }, { dateCreated: "desc" }],
      });

      const source = article?.thumbnail;
      if (!source || !source.filenameDisk) {
        console.log(`  [skip] ${category.name} (${category.alias}): no recipe photo`);
        skipped += 1;
        continue;
      }

      const raw = await getBuffer(source.filenameDisk);
      const { data, width, height, blurhash } = await processImage(raw);

      const filenameDisk = `${randomUUID()}.jpg`;
      await putBuffer(filenameDisk, data, "image/jpeg");

      const file = await prisma.file.create({
        data: {
          filenameDisk,
          filenameDownload: `category-${category.alias}.jpg`,
          title: category.name,
          description: `Авто-превью категории из рецепта «${article.name}»`,
          type: "image/jpeg",
          filesize: data.length,
          width,
          height,
          blurhash: blurhash ?? null,
        },
      });

      await prisma.category.update({
        where: { id: category.id },
        data: { thumbnailId: file.id },
      });

      created += 1;
      console.log(`  [ok]   ${category.name} (${category.alias}) <- «${article.name}»`);
    } catch (error) {
      failed += 1;
      console.error(`  [err]  ${category.name} (${category.alias}):`, (error as Error).message);
    }
  }

  console.log(`\nDone. created=${created}, skipped=${skipped}, failed=${failed}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
