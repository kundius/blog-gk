-- DropForeignKey
ALTER TABLE "articles_tags" DROP CONSTRAINT "articles_tags_article_fkey";

-- DropForeignKey
ALTER TABLE "articles_tags" DROP CONSTRAINT "articles_tags_tag_fkey";

-- DropTable
DROP TABLE "articles_tags";

-- DropTable
DROP TABLE "tags";
