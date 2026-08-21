import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const [products, categories, methods, articles] = await Promise.all([
  prisma.product.count(),
  prisma.category.count(),
  prisma.method.count(),
  prisma.article.count(),
]);
console.log(JSON.stringify({ products, categories, methods, articles }));
await prisma.$disconnect();
