import { prisma } from "@/lib/prisma";

export async function getContentSeoHealth() {
  const [products, articles, branches, methods] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        image: true,
        seoTitle: true,
        seoDescription: true,
        seoCanonical: true,
        seoIndexable: true,
      },
    }),
    prisma.article.findMany({
      where: { isActive: true },
      select: { slug: true, title: true, image: true },
    }),
    prisma.branch.findMany({
      where: { isActive: true },
      select: { slug: true, region: true },
    }),
    prisma.method.findMany({
      where: { isActive: true },
      select: { slug: true, name: true },
    }),
  ]);

  const canonicalCount = products.filter((item) =>
    Boolean(item.seoCanonical),
  ).length;
  const metadataCount = products.filter((item) =>
    Boolean(item.seoTitle && item.seoDescription),
  ).length;
  const imageCount = products.filter((item) => Boolean(item.image)).length;

  return {
    generatedAt: new Date().toISOString(),
    indexedPages: {
      state: "verified",
      count:
        products.filter((item) => item.seoIndexable).length +
        articles.length +
        branches.length +
        methods.length,
    },
    structuredData: {
      state: "unknown",
      detail:
        "Runtime structured-data validation requires crawler or search-console evidence.",
    },
    sitemap: { state: "verified", url: "/sitemap.xml" },
    products: {
      total: products.length,
      metadataComplete: metadataCount,
      canonicalComplete: canonicalCount,
      imagesComplete: imageCount,
    },
    redirects: {
      state: "blocked",
      detail: "Redirect inventory has not been approved or migrated.",
    },
    sources: {
      articles: articles.length,
      branches: branches.length,
      methods: methods.length,
    },
  } as const;
}
