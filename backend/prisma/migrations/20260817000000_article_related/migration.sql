-- Похожие статьи: связка «многие-ко-многим» между статьями с порядком сортировки.

-- CreateTable
CREATE TABLE "articles_related" (
    "id" SERIAL NOT NULL,
    "article" UUID,
    "related_article" UUID,
    "sort" INTEGER,

    CONSTRAINT "articles_related_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "articles_related" ADD CONSTRAINT "articles_related_article_fkey" FOREIGN KEY ("article") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles_related" ADD CONSTRAINT "articles_related_related_article_fkey" FOREIGN KEY ("related_article") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
