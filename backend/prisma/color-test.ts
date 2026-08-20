import {
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Readable } from "node:stream";
import { writeFile, mkdir } from "node:fs/promises";
import sharp from "sharp";

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

const PHOTOS = [
  "044158a4-659e-4acf-992a-ee4296950e5e..jpg",
  "c16b7744-1545-4751-9b46-b82d000fe2cb..jpg",
];

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

async function main() {
  await mkdir("/tmp/photo-test3", { recursive: true });

  const variants: [string, (buf: Buffer) => sharp.Sharp][] = [
    [
      "K_sat_gamma_sharpen",
      (buf) =>
        sharp(buf)
          .modulate({ saturation: 1.5, brightness: 1.05 })
          .gamma(1.15)
          .sharpen({ sigma: 0.8 })
          .jpeg({ quality: 90 }),
    ],
    [
      "L_sat_linear_soft",
      (buf) =>
        sharp(buf)
          .modulate({ saturation: 1.5, brightness: 1.05 })
          .linear(1.03, 5)
          .sharpen({ sigma: 0.8 })
          .jpeg({ quality: 90 }),
    ],
    [
      "M_sat_bright_sharpen",
      (buf) =>
        sharp(buf)
          .modulate({ saturation: 1.5, brightness: 1.1 })
          .sharpen({ sigma: 0.8 })
          .jpeg({ quality: 90 }),
    ],
    [
      "N_full_soft",
      (buf) =>
        sharp(buf)
          .modulate({ saturation: 1.45, brightness: 1.08 })
          .gamma(1.1)
          .linear(1.03, 3)
          .sharpen({ sigma: 0.7 })
          .jpeg({ quality: 90 }),
    ],
    [
      "O_shadow_lift",
      (buf) =>
        sharp(buf)
          .modulate({ saturation: 1.5, brightness: 1.1 })
          .linear(1.0, 10)
          .sharpen({ sigma: 0.8 })
          .jpeg({ quality: 90 }),
    ],
  ];

  for (const fileKey of PHOTOS) {
    const slug = fileKey.replace(/\.\.jpg$/, "").slice(0, 8);
    const raw = await getBuffer(fileKey);
    await writeFile(`/tmp/photo-test3/${slug}_original.jpg`, raw);
    console.log(`${slug}_original: ${raw.length} bytes`);

    for (const [name, factory] of variants) {
      const { data } = await factory(raw).toBuffer({ resolveWithObject: true });
      await writeFile(`/tmp/photo-test3/${slug}_${name}.jpg`, data);
      console.log(`${slug}_${name}: ${data.length} bytes`);
    }
    console.log("");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
