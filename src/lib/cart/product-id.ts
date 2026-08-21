import { prisma } from "@/lib/prisma";

export async function resolveProductId(
  identifier: string,
): Promise<string | null> {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: identifier }, { sku: identifier }, { slug: identifier }],
      isActive: true,
    },
    select: { id: true },
  });

  return product?.id ?? null;
}
