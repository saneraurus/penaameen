import { getContentSeoHealth } from "@/lib/seo/content-health";
import { getGalleryHealth } from "@/lib/media/gallery-health";
import { getRedirectInventoryHealth } from "@/lib/seo/redirect-inventory";
import { getNotificationDeliveryHealth } from "@/lib/notifications/delivery-health";
import { prisma } from "@/lib/prisma";

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getOperationalAnalytics() {
  const today = startOfDay(new Date());
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const [
    orderStatus,
    recentOrders,
    paidOrders,
    customerCount,
    zeroStockCount,
    unreadNotifications,
    criticalNotifications,
  ] = await Promise.all([
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.order.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    }),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
      _count: { _all: true },
      _sum: { total: true },
    }),
    prisma.user.count(),
    prisma.product.count({ where: { isActive: true, stock: 0 } }),
    prisma.notification.count({ where: { readAt: null } }),
    prisma.notification.count({
      where: { readAt: null, severity: "critical" },
    }),
  ]);

  const trendMap = new Map<string, number>();
  for (let offset = 0; offset < 7; offset += 1) {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + offset);
    trendMap.set(dayKey(date), 0);
  }
  for (const order of recentOrders) {
    const key = dayKey(order.createdAt);
    trendMap.set(key, (trendMap.get(key) ?? 0) + 1);
  }

  const statusCounts = Object.fromEntries(
    orderStatus.map((item) => [item.status, item._count._all]),
  );

  const [content, notification] = await Promise.all([
    getContentSeoHealth(),
    Promise.resolve(getNotificationDeliveryHealth()),
  ]);

  return {
    state: "partial" as const,
    provider: "not_selected" as const,
    consent: "not_configured" as const,
    kpis: {
      orders: {
        state: "unknown" as const,
        detail:
          "Analytics provider and approved KPI policy are not configured.",
      },
      revenue: {
        state: "unknown" as const,
        detail: "Authoritative finance data is not an analytics KPI source.",
      },
      conversion: {
        state: "unknown" as const,
        detail: "Consent and funnel measurement policy are not approved.",
      },
    },
    operational: {
      commerce: {
        state: "verified" as const,
        customerCount,
        zeroStockCount,
        orderStatusCounts: statusCounts,
        paidOrderCount: paidOrders._count._all,
        paidOrderTotal:
          paidOrders._sum.total === null ? null : Number(paidOrders._sum.total),
        orderTrend7d: Array.from(trendMap, ([date, orders]) => ({
          date,
          orders,
        })),
      },
      notifications: {
        ...notification,
        unreadCount: unreadNotifications,
        criticalUnreadCount: criticalNotifications,
      },
      content,
      gallery: getGalleryHealth(),
      redirects: getRedirectInventoryHealth(),
    },
  };
}
