import { prisma } from "@/lib/prisma";
import type { Article } from "@/data/articles";
import type { Branch } from "@/data/branches";
import type { Method } from "@/data/methods";
import type { HistoryMilestone } from "@/data/history";
import type { Testimonial } from "@/data/testimonials";

export async function getArticles(): Promise<Article[]> {
  const rows = await prisma.article.findMany({
    where: { isActive: true },
    orderBy: { date: "desc" },
  });
  return rows.map(
    (r) =>
      ({
        ...r,
        date: r.date.toISOString().slice(0, 10),
      }) as unknown as Article,
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const r = await prisma.article.findUnique({ where: { slug } });
  if (!r) return null;
  return {
    ...r,
    date: r.date.toISOString().slice(0, 10),
  } as unknown as Article;
}

export async function getBranches(): Promise<Branch[]> {
  const rows = await prisma.branch.findMany({
    where: { isActive: true },
    orderBy: { region: "asc" },
  });
  return rows.map((r) => ({ ...r }) as unknown as Branch);
}

export async function getBranchBySlug(slug: string): Promise<Branch | null> {
  const r = await prisma.branch.findUnique({ where: { slug } });
  return r ? ({ ...r } as unknown as Branch) : null;
}

export async function getMethods(): Promise<Method[]> {
  const rows = await prisma.method.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
  return rows.map((r) => ({ ...r }) as unknown as Method);
}

export async function getMethodBySlug(slug: string): Promise<Method | null> {
  const r = await prisma.method.findUnique({ where: { slug } });
  return r ? ({ ...r } as unknown as Method) : null;
}

export async function getHistoryMilestones(): Promise<HistoryMilestone[]> {
  const rows = await prisma.historyMilestone.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((r) => ({ ...r }) as unknown as HistoryMilestone);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({ ...r }) as unknown as Testimonial);
}
