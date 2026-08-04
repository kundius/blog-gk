-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "parent" UUID;

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "blurhash" TEXT;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_fkey" FOREIGN KEY ("parent") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
