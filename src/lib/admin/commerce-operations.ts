import { prisma } from "@/lib/prisma";

export async function getAdminCustomers(search = "") {
  const users = await prisma.user.findMany({
    ...(search
      ? {
          where: {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
              { phone: { contains: search, mode: "insensitive" as const } },
            ],
          },
        }
      : {}),
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const ids = users.map((user) => user.id);
  const [orderCounts, addressCounts] = await Promise.all([
    prisma.order.groupBy({
      by: ["userId"],
      where: { userId: { in: ids } },
      _count: { _all: true },
    }),
    prisma.address.groupBy({
      by: ["userId"],
      where: { userId: { in: ids } },
      _count: { _all: true },
    }),
  ]);
  const orderCountByUser = new Map(
    orderCounts.map((row) => [row.userId, row._count._all]),
  );
  const addressCountByUser = new Map(
    addressCounts.map((row) => [row.userId, row._count._all]),
  );

  return users.map((user) => ({
    id: user.id,
    name: user.name || "Pelanggan tanpa nama",
    email: user.email,
    phone: user.phone,
    orderCount: orderCountByUser.get(user.id) ?? 0,
    addressCount: addressCountByUser.get(user.id) ?? 0,
    createdAt: user.createdAt.toISOString(),
  }));
}

export async function getAdminPaymentQueue() {
  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["PENDING_PAYMENT", "PAID", "PROCESSING", "REFUNDED"] },
    },
    include: { user: true },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.user.name || order.user.email,
    customerEmail: order.user.email,
    amount: Number(order.total),
    status: order.status,
    provider: order.casakuTransactionId
      ? "Casaku"
      : order.midtransOrderId
        ? "Midtrans"
        : "Not started",
    providerReference: order.casakuTransactionId || order.midtransOrderId,
    paidAt: order.paidAt?.toISOString() || null,
    updatedAt: order.updatedAt.toISOString(),
  }));
}

export async function getAdminFulfillmentQueue() {
  const orders = await prisma.order.findMany({
    where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
    include: { user: true, items: { include: { product: true } } },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.user.name || order.user.email,
    status: order.status,
    shippingMethod: order.shippingMethod,
    trackingNumber: order.trackingNumber,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    hasShippingRate: Boolean(order.shippingRate),
    updatedAt: order.updatedAt.toISOString(),
  }));
}
