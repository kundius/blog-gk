-- Add КБЖУ nutrition fields to articles
ALTER TABLE "articles" ADD COLUMN "calories" TEXT;
ALTER TABLE "articles" ADD COLUMN "protein" TEXT;
ALTER TABLE "articles" ADD COLUMN "fat" TEXT;
ALTER TABLE "articles" ADD COLUMN "carbs" TEXT;