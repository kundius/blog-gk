import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const baking = await prisma.category.upsert({
    where: { alias: "baking" },
    update: { parentId: null },
    create: {
      name: "Выпечка",
      alias: "baking",
      content: "Домашняя выпечка: торты, печенье и пироги.",
      seoTitle: "Выпечка — рецепты",
    },
  });

  const entrees = await prisma.category.upsert({
    where: { alias: "entrees" },
    update: { parentId: null },
    create: {
      name: "Первые и вторые блюда",
      alias: "entrees",
      content: "Супы, горячее и повседневные блюда.",
      seoTitle: "Первые и вторые блюда — рецепты",
    },
  });

  const desserts = await prisma.category.upsert({
    where: { alias: "desserts" },
    update: {
      parentId: null,
      content: "Сладкие десерты к чаю.",
      seoTitle: "Десерты — рецепты",
    },
    create: {
      name: "Десерты",
      alias: "desserts",
      content: "Сладкие десерты к чаю.",
      seoTitle: "Десерты — рецепты",
    },
  });

  const cookies = await prisma.category.upsert({
    where: { alias: "cookies" },
    update: { parentId: baking.id },
    create: {
      name: "Печенье",
      alias: "cookies",
      parentId: baking.id,
      seoTitle: "Печенье — рецепты",
    },
  });

  const cakes = await prisma.category.upsert({
    where: { alias: "cakes" },
    update: { parentId: baking.id },
    create: {
      name: "Торты",
      alias: "cakes",
      parentId: baking.id,
      seoTitle: "Торты — рецепты",
    },
  });

  const soups = await prisma.category.upsert({
    where: { alias: "soups" },
    update: { parentId: entrees.id },
    create: {
      name: "Супы",
      alias: "soups",
      parentId: entrees.id,
      content: "Горячие и холодные супы на любой вкус.",
      seoTitle: "Супы — рецепты",
    },
  });

  const mainDishes = await prisma.category.upsert({
    where: { alias: "main-dishes" },
    update: { parentId: entrees.id },
    create: {
      name: "Вторые блюда",
      alias: "main-dishes",
      parentId: entrees.id,
      seoTitle: "Вторые блюда — рецепты",
    },
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
      seoTitle: "Крем-брюле — пошаговый рецепт",
      dateCreated: new Date(Date.now() - 24 * 60 * 60 * 1000),
      tags: { create: [{ tagId: fast.id, sort: 0 }] },
    },
  });

  await prisma.article.upsert({
    where: { alias: "chocolate-cookies" },
    update: {},
    create: {
      name: "Шоколадное печенье",
      alias: "chocolate-cookies",
      status: "published",
      content: "Хрустящее шоколадное печенье, которое тает во рту.",
      excerpt: "Печенье к чаю за полчаса.",
      categoryId: cookies.id,
      ingredients: [
        { name: "Мука", amount: "250 г" },
        { name: "Какао", amount: "2 ст. л" },
        { name: "Масло", amount: "150 г" },
      ],
      portionCount: "20",
      cookingTime: "30 минут",
      seoTitle: "Шоколадное печенье — пошаговый рецепт",
      dateCreated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
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
