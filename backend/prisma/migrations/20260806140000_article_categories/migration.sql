-- CreateTable
CREATE TABLE "articles_categories" (
    "id" SERIAL NOT NULL,
    "article" UUID,
    "category" UUID,
    "sort" INTEGER,

    CONSTRAINT "articles_categories_pkey" PRIMARY KEY ("id")
);

-- Backfill memberships from existing primary category
INSERT INTO "articles_categories" ("article", "category", "sort")
SELECT "id", "category", 0 FROM "articles";

-- AddForeignKey
ALTER TABLE "articles_categories" ADD CONSTRAINT "articles_categories_article_fkey" FOREIGN KEY ("article") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles_categories" ADD CONSTRAINT "articles_categories_category_fkey" FOREIGN KEY ("category") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;


