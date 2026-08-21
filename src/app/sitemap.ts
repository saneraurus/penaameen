import type { MetadataRoute } from "next";
import { getArticles, getBranches, getMethods } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_BASE_URL || "http://localhost:3000";
  const [articles, branches, methods] = await Promise.all([
    getArticles(),
    getBranches(),
    getMethods(),
  ]);
  const staticRoutes = [
    "/",
    "/produk",
    "/artikel",
    "/cabang",
    "/metode",
    "/tentang",
    "/sejarah",
    "/kontak",
    "/galeri-kegiatan",
  ];
  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: "weekly" as const,
    })),
    ...articles.map((item) => ({
      url: `${base}/artikel/${item.slug}`,
      changeFrequency: "monthly" as const,
    })),
    ...branches.map((item) => ({
      url: `${base}/cabang/${item.slug}`,
      changeFrequency: "monthly" as const,
    })),
    ...methods.map((item) => ({
      url: `${base}/metode/${item.slug}`,
      changeFrequency: "monthly" as const,
    })),
  ];
}
