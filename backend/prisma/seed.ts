import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const soups = await prisma.category.upsert({
    where: { alias: "soups" },
    update: {},
    create: {
      name: "Супы",
      alias: "soups",
      content: "Горячие и холодные супы на любой вкус.",
      seoTitle: "Супы — рецепты",
    },
  });

  const desserts = await prisma.category.upsert({
    where: { alias: "desserts" },
    update: {},
    create: { name: "Десерты", alias: "desserts" },
  });

  const fast = await prisma.tag.upsert({
    where: { alias: "fast" },
    update: {},
    create: { name: "Быстро", alias: "fast" },
  });

  const cozy = await prisma.tag.upsert({
    where: { alias: "cozy" },
    update: {},
    create: { name: "Уютно", alias: "cozy" },
  });

  const borsch = await prisma.article.upsert({
    where: { alias: "borsch" },
    update: {},
    create: {
      name: "Борщ классический",
      alias: "borsch",
      status: "published",
      content: "Наваристый борщ на говяжьем бульоне со свежей капустой.",
      excerpt: "Классический домашний борщ.",
      categoryId: soups.id,
      ingredients: [
        { name: "Свёкла", amount: "2 шт" },
        { name: "Капуста", amount: "300 г" },
        { name: "Говядина", amount: "500 г" },
      ],
      portionCount: "6",
      cookingTime: "2 часа",
      seoTitle: "Борщ классический — пошаговый рецепт",
      dateCreated: new Date(),
      tags: { create: [{ tagId: cozy.id, sort: 0 }] },
    },
  });

  await prisma.article.upsert({
    where: { alias: "creme-brulee" },
    update: {},
    create: {
      name: "Крем-брюле",
      alias: "creme-brulee",
      status: "published",
      content: "Нежный заварной крем с хрустящей карамельной корочкой.",
      excerpt: "Французский десерт, который тает во рту.",
      categoryId: desserts.id,
      ingredients: [
        { name: "Сливки 33%", amount: "400 мл" },
        { name: "Желтки", amount: "4 шт" },
        { name: "Сахар", amount: "80 г" },
      ],
      portionCount: "4",
      cookingTime: "45 минут",
      dateCreated: new Date(),
      tags: { create: [{ tagId: fast.id, sort: 0 }] },
    },
  });

  await prisma.page.upsert({
    where: { alias: "about" },
    update: {},
    create: {
      name: "О проекте",
      alias: "about",
      content: "Кулинарный блог о домашней еде.",
      seoTitle: "О проекте",
    },
  });

  await prisma.subscriber.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: { email: "demo@example.com" },
  });

  await prisma.comment.create({
    data: {
      status: "published",
      content: "Спасибо, очень вкусно!",
      authorName: "Гость",
      articleId: borsch.id,
      dateCreated: new Date(),
    },
  });

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
