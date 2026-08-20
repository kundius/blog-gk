import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
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

async function computeBlurhash(buffer: Buffer): Promise<string | undefined> {
  try {
    const thumb = await sharp(buffer)
      .resize(64, 64, { fit: "inside" })
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });
    return encode(
      new Uint8ClampedArray(thumb.data),
      thumb.info.width,
      thumb.info.height,
      4,
      4,
    );
  } catch {
    return undefined;
  }
}

async function enhance(buffer: Buffer): Promise<{
  data: Buffer;
  width: number;
  height: number;
  blurhash?: string;
}> {
  const processed = await sharp(buffer)
    .modulate({ saturation: 1.45, brightness: 1.08 })
    .gamma(1.1)
    .linear(1.03, 3)
    .sharpen({ sigma: 0.7 })
    .jpeg({ quality: 90 })
    .toBuffer({ resolveWithObject: true });

  const blurhash = await computeBlurhash(processed.data);

  return {
    data: processed.data,
    width: processed.info.width ?? 0,
    height: processed.info.height ?? 0,
    blurhash,
  };
}

async function main(): Promise<void> {
  const force = process.argv.includes("--force");

  const articles = await prisma.article.findMany({
    where: {
      dateCreated: { gte: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000) },
      thumbnailId: { not: null },
    },
    select: {
      id: true,
      name: true,
      thumbnailId: true,
      thumbnail: {
        select: {
          id: true,
          filenameDisk: true,
          filenameDownload: true,
          type: true,
          title: true,
          createdAt: true,
        },
      },
    },
  });

  console.log(`Found ${articles.length} articles with thumbnails`);

  let enhanced = 0;
  let skipped = 0;
  let failed = 0;

  for (const article of articles) {
    if (!article.thumbnail || !article.thumbnail.filenameDisk || !article.thumbnailId) {
      skipped++;
      continue;
    }

    if (!article.thumbnail.type?.startsWith("image/")) {
      console.log(`SKIP [${article.id}] ${article.name} — not an image`);
      skipped++;
      continue;
    }

    try {
      const existing = await prisma.file.findFirst({
        where: { description: article.thumbnailId! },
      });

      if (existing && !force) {
        if (article.thumbnailId !== existing.id) {
          await prisma.article.update({
            where: { id: article.id },
            data: { thumbnailId: existing.id },
          });
          console.log(`LINK [${article.id}] ${article.name} — already enhanced, linked`);
        } else {
          console.log(`SKIP [${article.id}] ${article.name} — already linked`);
        }
        skipped++;
        continue;
      }

      const originalBuffer = await getBuffer(article.thumbnail.filenameDisk);
      const result = await enhance(originalBuffer);

      const filenameDisk = `processed/${article.thumbnailId}.jpg`;
      await putBuffer(filenameDisk, result.data, "image/jpeg");

      let enhancedFile;
      if (existing) {
        enhancedFile = await prisma.file.update({
          where: { id: existing.id },
          data: {
            filesize: result.data.length,
            width: result.width,
            height: result.height,
            blurhash: result.blurhash,
          },
        });
      } else {
        enhancedFile = await prisma.file.create({
          data: {
            filenameDisk,
            filenameDownload: article.thumbnail.filenameDownload,
            title: `${article.thumbnail.title ?? article.thumbnail.filenameDownload} (улучшено)`,
            description: article.thumbnailId!,
            type: "image/jpeg",
            filesize: result.data.length,
            width: result.width,
            height: result.height,
            blurhash: result.blurhash,
            createdAt: article.thumbnail.createdAt,
          },
        });
      }

      await prisma.article.update({
        where: { id: article.id },
        data: { thumbnailId: enhancedFile.id },
      });

      enhanced++;
      console.log(`OK   [${article.id}] ${article.name} → ${filenameDisk}`);
    } catch (err) {
      failed++;
      console.error(`FAIL [${article.id}] ${article.name}: ${err}`);
    }
  }

  console.log(`\nDone. enhanced=${enhanced}, skipped=${skipped}, failed=${failed}`);
}

main()
  .catch((error) => { console.error(error); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
