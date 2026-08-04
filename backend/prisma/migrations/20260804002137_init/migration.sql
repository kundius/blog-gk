-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL,
    "filename_disk" TEXT,
    "filename_download" TEXT NOT NULL,
    "title" TEXT,
    "type" TEXT,
    "filesize" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT,
    "alias" TEXT NOT NULL,
    "seo_title" TEXT,
    "seo_keywords" TEXT,
    "seo_description" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "date_created" TIMESTAMPTZ(6),
    "date_updated" TIMESTAMPTZ(6),
    "alias" TEXT,
    "name" TEXT NOT NULL,
    "content" TEXT,
    "excerpt" TEXT,
    "category" UUID NOT NULL,
    "thumbnail" UUID,
    "ingredients" JSONB,
    "portion_count" TEXT,
    "cooking_time" TEXT,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "hits_count" INTEGER NOT NULL DEFAULT 0,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "seo_title" TEXT,
    "seo_keywords" TEXT,
    "seo_description" TEXT,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "alias" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles_tags" (
    "id" SERIAL NOT NULL,
    "article" UUID,
    "tag" UUID,
    "sort" INTEGER,

    CONSTRAINT "articles_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles_files" (
    "id" SERIAL NOT NULL,
    "article" UUID,
    "file" UUID,
    "sort" INTEGER,

    CONSTRAINT "articles_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "albums" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "thumbnail" UUID,
    "seo_title" TEXT,
    "seo_keywords" TEXT,
    "seo_description" TEXT,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "albums_files" (
    "id" SERIAL NOT NULL,
    "album" UUID,
    "file" UUID,
    "sort" INTEGER,

    CONSTRAINT "albums_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    "date_created" TIMESTAMPTZ(6),
    "date_updated" TIMESTAMPTZ(6),
    "content" TEXT,
    "raw" TEXT,
    "author_name" TEXT,
    "author_email" TEXT,
    "parent" UUID,
    "article" UUID,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT,
    "alias" TEXT NOT NULL,
    "seo_title" TEXT,
    "seo_keywords" TEXT,
    "seo_description" TEXT,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscribers" (
    "id" UUID NOT NULL,
    "date_created" TIMESTAMPTZ(6),
    "email" TEXT NOT NULL,

    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_alias_key" ON "categories"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "articles_alias_key" ON "articles"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "tags_alias_key" ON "tags"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "albums_alias_key" ON "albums"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "pages_alias_key" ON "pages"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_email_key" ON "subscribers"("email");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_category_fkey" FOREIGN KEY ("category") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_thumbnail_fkey" FOREIGN KEY ("thumbnail") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles_tags" ADD CONSTRAINT "articles_tags_article_fkey" FOREIGN KEY ("article") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles_tags" ADD CONSTRAINT "articles_tags_tag_fkey" FOREIGN KEY ("tag") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles_files" ADD CONSTRAINT "articles_files_article_fkey" FOREIGN KEY ("article") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles_files" ADD CONSTRAINT "articles_files_file_fkey" FOREIGN KEY ("file") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_thumbnail_fkey" FOREIGN KEY ("thumbnail") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums_files" ADD CONSTRAINT "albums_files_album_fkey" FOREIGN KEY ("album") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums_files" ADD CONSTRAINT "albums_files_file_fkey" FOREIGN KEY ("file") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_fkey" FOREIGN KEY ("parent") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_article_fkey" FOREIGN KEY ("article") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Полнотекстовый поиск по статьям
CREATE FUNCTION make_tsvector(name text, content text) RETURNS tsvector
    LANGUAGE plpgsql
    IMMUTABLE
    AS $$
BEGIN
  RETURN (setweight(to_tsvector('russian', name), 'A') ||
    setweight(to_tsvector('russian', content), 'B'));
END
$$;

CREATE INDEX idx_fts_articles ON articles
    USING gin (make_tsvector((name)::text, content));

