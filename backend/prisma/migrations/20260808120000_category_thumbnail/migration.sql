-- Превью (изображение) для категорий.
ALTER TABLE "categories" ADD COLUMN "thumbnail" UUID;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_thumbnail_fkey" FOREIGN KEY ("thumbnail") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Превью для разделов кулинарии: репрезентативные фото из статей разделов.
-- Условие EXISTS: в shadow-БД файлы не воспроизводятся из миграций, поэтому
-- при полном пересоздании БД обновление просто не сработает (без нарушения FK).
UPDATE "categories" SET "thumbnail" = '91cc1732-c3aa-4fe8-b5cd-2bc6a832469e' WHERE "alias" = 'first-courses' AND EXISTS (SELECT 1 FROM "files" WHERE "id" = '91cc1732-c3aa-4fe8-b5cd-2bc6a832469e');
UPDATE "categories" SET "thumbnail" = '82e5973a-6d55-433a-adbc-0b90ea7392cd' WHERE "alias" = 'second-courses' AND EXISTS (SELECT 1 FROM "files" WHERE "id" = '82e5973a-6d55-433a-adbc-0b90ea7392cd');
UPDATE "categories" SET "thumbnail" = 'ed0375aa-13a4-4aa0-9f22-0a2c01e916a9' WHERE "alias" = 'vypechka' AND EXISTS (SELECT 1 FROM "files" WHERE "id" = 'ed0375aa-13a4-4aa0-9f22-0a2c01e916a9');
UPDATE "categories" SET "thumbnail" = '4d88ec2f-86bd-4f5d-ab2f-14c48eb52bca' WHERE "alias" = 'salaty-i-zakuski' AND EXISTS (SELECT 1 FROM "files" WHERE "id" = '4d88ec2f-86bd-4f5d-ab2f-14c48eb52bca');
UPDATE "categories" SET "thumbnail" = 'b50ad4bb-6f63-4193-9706-13fe1b81f27b' WHERE "alias" = 'sladkij-stol' AND EXISTS (SELECT 1 FROM "files" WHERE "id" = 'b50ad4bb-6f63-4193-9706-13fe1b81f27b');
UPDATE "categories" SET "thumbnail" = '889579e8-ec77-493d-ab8e-3ead37c2402f' WHERE "alias" = 'zagotovki' AND EXISTS (SELECT 1 FROM "files" WHERE "id" = '889579e8-ec77-493d-ab8e-3ead37c2402f');
