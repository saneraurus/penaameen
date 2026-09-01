// src/lib/assistant/admin-knowledge.ts

import { prisma } from "@/lib/prisma";
import { getApiSettings } from "@/lib/admin/api-settings";
import { getSystemControls } from "@/lib/admin/system-controls";

export interface LiveAdminKnowledgeData {
  orderCounts: Record<string, number>;
  todayOrderCount: number;
  todayRevenue: number;
  last7DaysRevenue: number;
  thisMonthRevenue: number;
  recentOrdersNeedingAction: Array<{
    orderNumber: string;
    status: string;
    total: number;
    customer: string;
    items: string;
    createdAt: string;
    trackingNumber: string | null;
  }>;
  criticalStockProducts: Array<{
    name: string;
    sku: string;
    stock: number;
    price: number;
  }>;
  totalActiveProducts: number;
  totalRegisteredCustomers: number;
  recentUnreadNotifications: Array<{
    title: string;
    message: string;
    severity: string;
    createdAt: string;
  }>;
  recentStaffAuditLogs: Array<{
    action: string;
    targetType: string;
    targetId: string;
    actorEmail: string;
    occurredAt: string;
  }>;
  apiProviderStatus: Record<string, string>;
  systemControls: Array<{ label: string; value: boolean }>;
}

export async function buildLiveAdminKnowledge(): Promise<string> {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOf7DaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    // 1. Fetch Orders breakdown & revenue
    const [
      allOrders,
      lowStockProducts,
      totalProducts,
      totalUsers,
      notifications,
      auditLogs,
    ] = await Promise.all([
      prisma.order.findMany({
        where: {
          createdAt: { gte: startOfMonth },
        },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.product.findMany({
        where: {
          isActive: true,
          stock: { lte: 10 },
        },
        select: { name: true, sku: true, stock: true, price: true },
        orderBy: { stock: "asc" },
        take: 10,
      }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.notification.findMany({
        where: { readAt: null },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.auditLog.findMany({
        orderBy: { occurredAt: "desc" },
        take: 6,
      }),
    ]);

    const safeOrders = Array.isArray(allOrders) ? allOrders : [];
    const safeLowStock = Array.isArray(lowStockProducts)
      ? lowStockProducts
      : [];
    const safeNotifications = Array.isArray(notifications) ? notifications : [];
    const safeAuditLogs = Array.isArray(auditLogs) ? auditLogs : [];

    // Aggregate Orders & Revenue
    const orderCounts: Record<string, number> = {
      PENDING_PAYMENT: 0,
      PAID: 0,
      PROCESSING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
      REFUNDED: 0,
    };

    let todayOrderCount = 0;
    let todayRevenue = 0;
    let last7DaysRevenue = 0;
    let thisMonthRevenue = 0;

    const recentOrdersNeedingAction: LiveAdminKnowledgeData["recentOrdersNeedingAction"] =
      [];

    for (const order of safeOrders) {
      if (!order) continue;
      const orderDate = new Date(order.createdAt || Date.now());
      const totalNum = Number(order.total || 0);
      const statusKey = order.status || "PENDING_PAYMENT";

      orderCounts[statusKey] = (orderCounts[statusKey] || 0) + 1;

      // Revenue counts for PAID / PROCESSING / SHIPPED / DELIVERED
      const isPaid =
        order.status === "PAID" ||
        order.status === "PROCESSING" ||
        order.status === "SHIPPED" ||
        order.status === "DELIVERED";

      if (orderDate >= startOfToday) {
        todayOrderCount++;
        if (isPaid) todayRevenue += totalNum;
      }
      if (orderDate >= startOf7DaysAgo && isPaid) {
        last7DaysRevenue += totalNum;
      }
      if (isPaid) {
        thisMonthRevenue += totalNum;
      }

      // Orders needing fulfillment action (PAID or PROCESSING)
      if (order.status === "PAID" || order.status === "PROCESSING") {
        const itemSummary = Array.isArray(order.items)
          ? order.items
              .map(
                (i) => `${i?.product?.name || "Produk"} x${i?.quantity || 1}`,
              )
              .join(", ")
          : "-";

        recentOrdersNeedingAction.push({
          orderNumber: order.orderNumber || "-",
          status: order.status,
          total: totalNum,
          customer: order.user?.name || order.user?.email || "Pelanggan",
          items: itemSummary,
          createdAt: orderDate.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          trackingNumber: order.trackingNumber || null,
        });
      }
    }

    // 2. System controls & API settings
    let apiSettings: ReturnType<typeof getApiSettings> | null = null;
    try {
      apiSettings = getApiSettings();
    } catch {
      apiSettings = null;
    }
    const systemControls = await getSystemControls().catch(() => []);

    const apiStatusSummary: Record<string, string> = {
      buatqris: apiSettings?.buatqris?.enabled ? "Aktif (Primary)" : "Nonaktif",
      midtrans: apiSettings?.midtrans?.serverKey
        ? "Terkonfigurasi"
        : "Belum diisi",
      casaku: apiSettings?.casaku?.enabled ? "Aktif / Siap" : "Mode Fallback",
      rajaongkir: apiSettings?.rajaongkir?.apiKey ? "Aktif" : "Belum diisi",
      clerkAuth: apiSettings?.clerkAuth?.publishableKey
        ? "Aktif"
        : "Belum diisi",
    };

    // Format Knowledge Prompt Output
    return `=== LIVE DATABASE SNAPSHOT (ADMIN PANEL OPERASIONAL REALTIME) ===
Waktu Server: ${now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} WIB

1. RINGKASAN OMSET & PENJUALAN:
- Omset Hari Ini: Rp${todayRevenue.toLocaleString("id-ID")} (${todayOrderCount} pesanan masuk hari ini)
- Omset 7 Hari Terakhir: Rp${last7DaysRevenue.toLocaleString("id-ID")}
- Omset Bulan Ini (${now.toLocaleDateString("id-ID", { month: "long" })}): Rp${thisMonthRevenue.toLocaleString("id-ID")}

2. STATUS & DISTRIBUSI PESANAN (Bulan Ini):
- Menunggu Pembayaran (PENDING_PAYMENT): ${orderCounts.PENDING_PAYMENT || 0} pesanan
- Pembayaran Lunas (PAID - Butuh Kemas): ${orderCounts.PAID || 0} pesanan
- Sedang Dikemas (PROCESSING - Butuh Resi): ${orderCounts.PROCESSING || 0} pesanan
- Dalam Pengiriman (SHIPPED): ${orderCounts.SHIPPED || 0} pesanan
- Selesai (DELIVERED): ${orderCounts.DELIVERED || 0} pesanan
- Dibatalkan (CANCELLED): ${orderCounts.CANCELLED || 0} pesanan

3. DAFTAR PESANAN MENDESAK YANG BUTUH TINDAKAN (PAID / PROCESSING):
${
  recentOrdersNeedingAction.length > 0
    ? recentOrdersNeedingAction
        .slice(0, 5)
        .map(
          (o) =>
            `- No: ${o.orderNumber} | Customer: ${o.customer} | Total: Rp${o.total.toLocaleString("id-ID")} | Status: ${o.status} | Item: ${o.items} | Tanggal: ${o.createdAt}`,
        )
        .join("\n")
    : "- Tidak ada pesanan tertunda yang butuh tindakan saat ini (semua tuntas)."
}

4. STATUS STOK KRITIS & INVENTORI:
- Total Produk Aktif di Katalog: ${totalProducts || 0} SKU
- Produk Stok Habis / Menipis (<= 5 unit):
${
  safeLowStock.length > 0
    ? safeLowStock
        .map(
          (p) =>
            `- ${p?.name || "Produk"} (SKU: ${p?.sku || "-"}) -> Sisa Stok: ${p?.stock ?? 0} pcs | Harga: Rp${Number(p?.price || 0).toLocaleString("id-ID")}`,
        )
        .join("\n")
    : "- Semua produk memiliki stok aman (> 5 pcs)."
}

5. NOTIFIKASI ADMIN BELUM DIBACA (${safeNotifications.length} notifikasi):
${
  safeNotifications.length > 0
    ? safeNotifications
        .map(
          (n) =>
            `- [${(n?.severity || "INFO").toUpperCase()}] ${n?.title || "Notifikasi"}: ${n?.message || "-"} (${new Date(n?.createdAt || Date.now()).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })})`,
        )
        .join("\n")
    : "- Tidak ada notifikasi baru yang belum dibaca."
}

6. AKTIVITAS STAF / AUDIT LOG TERAKHIR:
${
  safeAuditLogs.length > 0
    ? safeAuditLogs
        .map(
          (a) =>
            `- Staf: ${a?.actorEmail || "System"} | Aksi: ${a?.action || "-"} (${a?.targetType || "-"}:${a?.targetId || "-"}) | Status: ${a?.outcome || "-"} | Waktu: ${new Date(a?.occurredAt || Date.now()).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`,
        )
        .join("\n")
    : "- Belum ada log aktivitas terbaru."
}

7. TOTAL CUSTOMER TERDAFTAR:
- ${totalUsers} akun pengguna terdaftar di sistem.

8. STATUS INTEGRASI LAYANAN & SYSTEM CONTROLS:
- Pembayaran QRIS Casaku: ${apiStatusSummary.casaku}
- Pembayaran Midtrans: ${apiStatusSummary.midtrans}
- Ongkir RajaOngkir: ${apiStatusSummary.rajaongkir}
- Otentikasi Clerk: ${apiStatusSummary.clerkAuth}
- Kontrol Darurat Aktif: ${
      systemControls
        .filter((c) => c.value)
        .map((c) => c.label)
        .join(", ") ||
      "Semua otomasi berjalan normal (tidak ada tombol darurat aktif)."
    }
=== END LIVE DATABASE SNAPSHOT ===`;
  } catch (error) {
    console.error("Error building live admin knowledge:", error);
    return `=== LIVE DATABASE SNAPSHOT ===
Database sedang tidak dapat diakses secara penuh. Terjadi kendala saat membaca data live admin: ${error instanceof Error ? error.message : "Database connection error"}.
Silakan cek halaman admin terkait secara langsung (/admin/orders, /admin/products, /admin/notifications).
=== END LIVE DATABASE SNAPSHOT ===`;
  }
}
