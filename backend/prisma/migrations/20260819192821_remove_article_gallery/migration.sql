/*
  Warnings:

  - You are about to drop the `articles_files` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "articles_files" DROP CONSTRAINT "articles_files_article_fkey";

-- DropForeignKey
ALTER TABLE "articles_files" DROP CONSTRAINT "articles_files_file_fkey";

-- DropIndex
DROP INDEX "articles_categories_article_idx";

-- DropIndex
DROP INDEX "articles_categories_category_idx";

-- DropTable
DROP TABLE "articles_files";
