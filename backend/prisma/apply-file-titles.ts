import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { readFileSync, existsSync } from "node:fs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const INPUT_FILE = "applied-titles.json";

interface TitleEntry {
  fileId: string;
  title: string;
  articleId: string | null;
  filenameDisk: string | null;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeRegexReplacement(s: string): string {
  return s.replace(/[$&\\]/g, "\\$&");
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (!existsSync(INPUT_FILE)) {
    console.error(`Input file ${INPUT_FILE} not found.`);
    process.exit(1);
  }

  const entries: TitleEntry[] = JSON.parse(readFileSync(INPUT_FILE, "utf-8"));
  console.log(`Loaded ${entries.length} entries from ${INPUT_FILE}`);

  let filesUpdated = 0;
  let altsUpdated = 0;
  let errors = 0;

  for (const entry of entries) {
    try {
      // Update file title
      await prisma.file.update({
        where: { id: entry.fileId },
        data: { title: entry.title },
      });
      filesUpdated++;

      // Update alt in article content if applicable
      if (entry.articleId && entry.filenameDisk) {
        const article = await prisma.article.findUnique({
          where: { id: entry.articleId },
          select: { id: true, content: true },
        });

        if (article?.content) {
          const escaped = entry.filenameDisk.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const safeTitle = escapeHtml(escapeRegexReplacement(entry.title));

          // Match <img> tags with this filenameDisk in src that HAVE alt=""
          const imgRegex = new RegExp(
            `(<img\\b[^>]*src="[^"]*\\/files\\/${escaped}"[^>]*?)alt="[^"]*"`,
            "gi",
          );

          let newContent = article.content.replace(imgRegex, `$1alt="${safeTitle}"`);

          // If no match, the <img> might lack alt attribute — add it
          if (newContent === article.content) {
            const addAltRegex = new RegExp(
              `(<img\\b[^>]*src="[^"]*\\/files\\/${escaped}"[^>]*?)(\\s*/?>)`,
              "gi",
            );
            newContent = article.content.replace(addAltRegex, `$1 alt="${safeTitle}"$2`);
          }

          if (newContent !== article.content) {
            await prisma.article.update({
              where: { id: entry.articleId },
              data: { content: newContent },
            });
            altsUpdated++;
          }
        }
      }
    } catch (err) {
      console.error(`Failed to process ${entry.fileId}: ${err}`);
      errors++;
    }
  }

  console.log(`\nDone.`);
  console.log(`  Files updated: ${filesUpdated}/${entries.length}`);
  console.log(`  Alt attributes updated in HTML: ${altsUpdated}`);
  console.log(`  Errors: ${errors}`);
}

main()
  .catch((error) => { console.error(error); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
