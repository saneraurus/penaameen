import "dotenv/config";
import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { products } from "../src/data/products";
import { articles } from "../src/data/articles";
import { branches } from "../src/data/branches";
import { methods } from "../src/data/methods";
import { historyMilestones } from "../src/data/history";
import { testimonials } from "../src/data/testimonials";
import { hashPassword } from "../src/lib/admin/auth";

const prisma = new PrismaClient({
  adapter: new PrismaPg(new Pool({ connectionString: process.env["DATABASE_URL"] })),
});

async function main() {
  console.log("Seeding database...");

  // --- Seed default administrator account ---
  console.log("Seeding default admin...");
  await prisma.adminUser.upsert({
    where: { username: "ihsan" },
    update: {
      passwordHash: hashPassword("AdminPena123"),
      role: "admin",
      fullName: "Ihsan (Admin)",
      isActive: true,
    },
    create: {
      username: "ihsan",
      passwordHash: hashPassword("AdminPena123"),
      role: "admin",
      fullName: "Ihsan (Admin)",
      isActive: true,
    },
  });
  console.log("Upserted default admin: ihsan");

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

  // --- Editorial content ---
  console.log("Seeding articles...");
  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        date: new Date(a.date),
        category: a.category,
        image: a.image,
        readTime: a.readTime,
        isActive: true,
      },
      create: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        date: new Date(a.date),
        category: a.category,
        image: a.image,
        readTime: a.readTime,
        isActive: true,
      },
    });
  }

  console.log("Seeding branches...");
  for (const b of branches) {
    await prisma.branch.upsert({
      where: { slug: b.slug },
      update: {
        region: b.region,
        city: b.city,
        address: b.address,
        contact: b.contact,
        isActive: true,
      },
      create: {
        slug: b.slug,
        region: b.region,
        city: b.city,
        address: b.address,
        contact: b.contact,
        isActive: true,
      },
    });
  }

  console.log("Seeding methods...");
  for (const m of methods) {
    await prisma.method.upsert({
      where: { slug: m.slug },
      update: {
        name: m.name,
        tagline: m.tagline,
        officialReference: m.officialReference,
        officialDomain: m.officialDomain,
        description: m.description,
        philosophy: m.philosophy,
        suitableFor: m.suitableFor,
        image: m.image,
        targetDuration: m.targetDuration,
        composition: m.composition,
        keyStats: m.keyStats,
        advantages: m.advantages,
        steps: m.steps,
        comparison: m.comparison,
        benefits: m.benefits,
        faqs: m.faqs,
        relatedProductSlugs: m.relatedProductSlugs,
        seo: m.seo,
        isActive: true,
      },
      create: {
        slug: m.slug,
        name: m.name,
        tagline: m.tagline,
        officialReference: m.officialReference,
        officialDomain: m.officialDomain,
        description: m.description,
        philosophy: m.philosophy,
        suitableFor: m.suitableFor,
        image: m.image,
        targetDuration: m.targetDuration,
        composition: m.composition,
        keyStats: m.keyStats,
        advantages: m.advantages,
        steps: m.steps,
        comparison: m.comparison,
        benefits: m.benefits,
        faqs: m.faqs,
        relatedProductSlugs: m.relatedProductSlugs,
        seo: m.seo,
        isActive: true,
      },
    });
  }

  console.log("Seeding history milestones...");
  for (let i = 0; i < historyMilestones.length; i++) {
    const h = historyMilestones[i];
    await prisma.historyMilestone.upsert({
      where: { id: h.id },
      update: {
        period: h.period,
        navLabel: h.navLabel,
        eyebrow: h.eyebrow,
        title: h.title,
        summary: h.summary,
        narrative: h.narrative,
        highlights: h.highlights,
        image: h.image,
        imageAlt: h.imageAlt,
        caption: h.caption,
        sortOrder: i,
      },
      create: {
        id: h.id,
        period: h.period,
        navLabel: h.navLabel,
        eyebrow: h.eyebrow,
        title: h.title,
        summary: h.summary,
        narrative: h.narrative,
        highlights: h.highlights,
        image: h.image,
        imageAlt: h.imageAlt,
        caption: h.caption,
        sortOrder: i,
      },
    });
  }

  console.log("Seeding testimonials...");
  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        role: t.role,
        location: t.location,
        avatar: t.avatar,
        rating: t.rating,
        date: t.date,
        productUsed: t.productUsed,
        category: t.category,
        title: t.title,
        content: t.content,
        highlight: t.highlight,
        verifiedBuyer: t.verifiedBuyer,
        image: t.image ?? "",
        label: t.label,
        isActive: true,
      },
      create: {
        slug: t.slug,
        name: t.name,
        role: t.role,
        location: t.location,
        avatar: t.avatar,
        rating: t.rating,
        date: t.date,
        productUsed: t.productUsed,
        category: t.category,
        title: t.title,
        content: t.content,
        highlight: t.highlight,
        verifiedBuyer: t.verifiedBuyer,
        image: t.image ?? "",
        label: t.label,
        isActive: true,
      },
    });
  }

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
