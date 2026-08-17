import { PrismaClient } from "@/generated/prisma";
import { products } from "../src/data/products";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const categoryNames = Array.from(new Set(products.map((p) => p.category)));

  const categoryMap = new Map<string, string>();
  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
    categoryMap.set(name, category.id);
  }

  console.log(`Upserted ${categoryMap.size} categories`);

  for (const p of products) {
    const categoryId = categoryMap.get(p.category);
    if (!categoryId) {
      throw new Error(`Missing category for product ${p.name}`);
    }

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        categoryId,
        description: p.description,
        price: BigInt(p.price),
        image: p.image,
        isActive: p.price > 0,
        // stock left unchanged on update to avoid clobbering live inventory
      },
      create: {
        slug: p.slug,
        name: p.name,
        categoryId,
        description: p.description,
        price: BigInt(p.price),
        image: p.image,
        stock: 50,
        isActive: p.price > 0,
      },
    });
  }

  console.log(`Seeded ${products.length} products`);
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
