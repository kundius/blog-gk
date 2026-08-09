-- Подборки статей: сущность (обложка, флаг «на главной», SEO) и
-- связка «многие-ко-многим» со статьями и порядком сортировки.

-- CreateTable
CREATE TABLE "collections" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" UUID,
    "show_on_home" BOOLEAN NOT NULL DEFAULT false,
    "seo_title" TEXT,
    "seo_keywords" TEXT,
    "seo_description" TEXT,
    "date_created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_updated" TIMESTAMPTZ(6),

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections_articles" (
    "id" SERIAL NOT NULL,
    "collection" UUID,
    "article" UUID,
    "sort" INTEGER,

    CONSTRAINT "collections_articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collections_alias_key" ON "collections"("alias");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_thumbnail_fkey" FOREIGN KEY ("thumbnail") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections_articles" ADD CONSTRAINT "collections_articles_collection_fkey" FOREIGN KEY ("collection") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections_articles" ADD CONSTRAINT "collections_articles_article_fkey" FOREIGN KEY ("article") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
