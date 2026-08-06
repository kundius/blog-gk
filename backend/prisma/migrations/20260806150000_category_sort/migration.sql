-- AlterTable
ALTER TABLE "categories" ADD COLUMN "sort" INTEGER;

-- Кулинария — на первое место
UPDATE "categories" SET "sort" = 1 WHERE "alias" = 'cooking';

-- Остальные категории — в алфавитном порядке после неё
UPDATE "categories" AS c
SET "sort" = sub.rn
FROM (
    SELECT "id", ROW_NUMBER() OVER (ORDER BY "name") + 1 AS rn
    FROM "categories"
    WHERE "sort" IS NULL
) AS sub
WHERE c."id" = sub."id";
