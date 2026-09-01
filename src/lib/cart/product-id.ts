import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";

export async function resolveProductId(
  identifier: string,
  client: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<string | null> {
  const product = await client.product.findFirst({
    where: {
      OR: [{ id: identifier }, { sku: identifier }, { slug: identifier }],
      isActive: true,
    },
    select: { id: true },
  });

  return product?.id ?? null;
}
