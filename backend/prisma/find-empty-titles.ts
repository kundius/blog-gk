import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { writeFileSync } from "node:fs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const BATCH_SIZE = 100;

// ── HTML context extraction ──────────────────────────────────────────────────

function extractImageContext(
  html: string,
  filenameDisk: string,
): { rawContext: string | null; isRecipeStep: boolean; imgSnippet: string } {
  const escaped = filenameDisk.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Match ALL <img> tags (gallery-image and regular)
  const imgRegex = new RegExp(
    `<img\\b[^>]*src="[^"]*\\/files\\/${escaped}"[^>]*>`,
    "gi",
  );
  const imgMatch = imgRegex.exec(html);
  if (!imgMatch) return { rawContext: null, isRecipeStep: false, imgSnippet: "" };

  const imgSnippet = imgMatch[0];
  const imgPos = imgMatch.index;

  // Check if inside recipe-step
  const beforeImg = html.substring(0, imgPos);
  const isRecipeStep = /<div[^>]*class="recipe-step__body"/.test(beforeImg);

  let searchArea: string;
  if (isRecipeStep) {
    const stepStart = beforeImg.lastIndexOf('<div class="recipe-step"');
    if (stepStart >= 0) {
      const stepBodyStart = html.indexOf('class="recipe-step__body"', stepStart);
      let depth = 0;
      let i = stepBodyStart;
      let stepEnd = -1;
      while (i < html.length) {
        if (html.substring(i).startsWith("<div")) depth++;
        if (html.substring(i).startsWith("</div")) {
          depth--;
          if (depth === 0) { stepEnd = i + 6; break; }
        }
        i++;
      }
      searchArea = stepEnd > 0
        ? html.substring(stepStart, stepEnd)
        : html.substring(stepStart);
    } else {
      const windowSize = 1500;
      const start = Math.max(0, imgPos - windowSize);
      const end = Math.min(html.length, imgPos + imgSnippet.length + windowSize);
      searchArea = html.substring(start, end);
    }
  } else {
    const windowSize = 1500;
    const start = Math.max(0, imgPos - windowSize);
    const end = Math.min(html.length, imgPos + imgSnippet.length + windowSize);
    searchArea = html.substring(start, end);
  }

  // Extract text from block elements
  const texts: string[] = [];
  const blockRegex = /<(?:p|li|h[2-6])[^>]*>([\s\S]*?)<\/(?:p|li|h[2-6])>/gi;
  let m: RegExpExecArray | null;
  while ((m = blockRegex.exec(searchArea)) !== null) {
    const text = m[1].replace(/<[^>]*>/g, "").trim();
    if (text.length > 5) texts.push(text);
  }

  if (texts.length === 0) return { rawContext: null, isRecipeStep, imgSnippet };

  // Find closest text to img
  const imgLocalPos = isRecipeStep ? imgPos : imgPos - Math.max(0, imgPos - 1500);
  let best = texts[0];
  let bestDist = Infinity;
  for (const t of texts) {
    const tPos = searchArea.indexOf(t);
    const dist = Math.abs(tPos - imgLocalPos);
    if (dist < bestDist) { bestDist = dist; best = t; }
  }

  return { rawContext: best, isRecipeStep, imgSnippet };
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // Load files with null title
  const files = await prisma.file.findMany({
    where: { title: null },
    select: {
      id: true,
      filenameDisk: true,
      filenameDownload: true,
      type: true,
    },
    take: BATCH_SIZE,
    orderBy: { createdAt: "desc" },
  });

  if (files.length === 0) {
    console.log("No files with null title found.");
    return;
  }

  console.log(`Found ${files.length} files with null title`);

  // Load lookup data
  const [articles, categories, albums, collections] = await Promise.all([
    prisma.article.findMany({
      select: { id: true, name: true, thumbnailId: true, content: true },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, thumbnailId: true },
    }),
    prisma.album.findMany({
      select: {
        id: true,
        name: true,
        thumbnailId: true,
        photos: { select: { fileId: true } },
      },
    }),
    prisma.collection.findMany({
      select: { id: true, name: true, thumbnailId: true },
    }),
  ]);

  // Build lookup maps
  const articleByThumb = new Map<string, (typeof articles)[number]>();
  for (const a of articles) {
    if (a.thumbnailId) articleByThumb.set(a.thumbnailId, a);
  }

  const categoryByThumb = new Map<string, (typeof categories)[number]>();
  for (const c of categories) {
    if (c.thumbnailId) categoryByThumb.set(c.thumbnailId, c);
  }

  const albumByThumb = new Map<string, (typeof albums)[number]>();
  for (const a of albums) {
    if (a.thumbnailId) albumByThumb.set(a.thumbnailId, a);
  }

  const collectionByThumb = new Map<string, (typeof collections)[number]>();
  for (const c of collections) {
    if (c.thumbnailId) collectionByThumb.set(c.thumbnailId, c);
  }

  const albumByFileId = new Map<string, (typeof albums)[number]>();
  for (const a of albums) {
    for (const p of a.photos) {
      if (p.fileId) albumByFileId.set(p.fileId, a);
    }
  }

  // Pre-build content index: filenameDisk -> articles
  const contentByFile = new Map<string, (typeof articles)[number][]>();
  for (const article of articles) {
    if (!article.content) continue;
    const refs = article.content.matchAll(/\/files\/([a-f0-9-]+\.[.a-z]+)/gi);
    for (const ref of refs) {
      const disk = ref[1];
      const existing = contentByFile.get(disk);
      if (existing) existing.push(article);
      else contentByFile.set(disk, [article]);
    }
  }

  // Process each file
  const results: {
    fileId: string;
    filenameDisk: string | null;
    filenameDownload: string;
    context: {
      type: string;
      entityName: string | null;
      rawContext: string | null;
      isRecipeStep: boolean;
      articleId: string | null;
      imgSnippet: string;
    };
  }[] = [];

  for (const file of files) {
    // Thumbnail?
    const article = articleByThumb.get(file.id);
    if (article) {
      results.push({
        fileId: file.id,
        filenameDisk: file.filenameDisk,
        filenameDownload: file.filenameDownload,
        context: {
          type: "thumbnail",
          entityName: article.name,
          rawContext: null,
          isRecipeStep: false,
          articleId: null,
          imgSnippet: "",
        },
      });
      continue;
    }

    const category = categoryByThumb.get(file.id);
    if (category) {
      results.push({
        fileId: file.id,
        filenameDisk: file.filenameDisk,
        filenameDownload: file.filenameDownload,
        context: {
          type: "thumbnail",
          entityName: category.name,
          rawContext: null,
          isRecipeStep: false,
          articleId: null,
          imgSnippet: "",
        },
      });
      continue;
    }

    const albumThumb = albumByThumb.get(file.id);
    if (albumThumb) {
      results.push({
        fileId: file.id,
        filenameDisk: file.filenameDisk,
        filenameDownload: file.filenameDownload,
        context: {
          type: "thumbnail",
          entityName: albumThumb.name,
          rawContext: null,
          isRecipeStep: false,
          articleId: null,
          imgSnippet: "",
        },
      });
      continue;
    }

    const collection = collectionByThumb.get(file.id);
    if (collection) {
      results.push({
        fileId: file.id,
        filenameDisk: file.filenameDisk,
        filenameDownload: file.filenameDownload,
        context: {
          type: "thumbnail",
          entityName: collection.name,
          rawContext: null,
          isRecipeStep: false,
          articleId: null,
          imgSnippet: "",
        },
      });
      continue;
    }

    // Album photo?
    const albumPhoto = albumByFileId.get(file.id);
    if (albumPhoto) {
      results.push({
        fileId: file.id,
        filenameDisk: file.filenameDisk,
        filenameDownload: file.filenameDownload,
        context: {
          type: "album_photo",
          entityName: albumPhoto.name,
          rawContext: null,
          isRecipeStep: false,
          articleId: null,
          imgSnippet: "",
        },
      });
      continue;
    }

    // Content-embedded image?
    if (file.filenameDisk && file.type?.startsWith("image/")) {
      const matchingArticles = contentByFile.get(file.filenameDisk);
      if (matchingArticles && matchingArticles.length > 0) {
        const art = matchingArticles[0]; // first found
        const { rawContext, isRecipeStep, imgSnippet } = extractImageContext(
          art.content!,
          file.filenameDisk,
        );
        results.push({
          fileId: file.id,
          filenameDisk: file.filenameDisk,
          filenameDownload: file.filenameDownload,
          context: {
            type: isRecipeStep ? "content_step" : "content_inline",
            entityName: art.name,
            rawContext,
            isRecipeStep,
            articleId: art.id,
            imgSnippet,
          },
        });
        continue;
      }
    }

    // Unknown — skip (will be handled by translit fallback if needed)
  }

  // Output
  writeFileSync("empty-titles-context.json", JSON.stringify(results, null, 2), "utf-8");
  console.log(`Wrote ${results.length} entries to empty-titles-context.json`);

  // Summary
  const byType: Record<string, number> = {};
  for (const r of results) byType[r.context.type] = (byType[r.context.type] || 0) + 1;
  console.log("By type:", JSON.stringify(byType, null, 2));
}

main()
  .catch((error) => { console.error(error); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
