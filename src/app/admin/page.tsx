import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { WorkQueueCard } from "@/presentation/components/admin/WorkQueueCard";
import { RevenueChartHero } from "@/presentation/components/admin/RevenueChartHero";
import Link from "next/link";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import {
  getOrderStatusCounts,
  getOrders,
  getSalesAnalytics,
} from "@/lib/admin/orders";

export default async function AdminDashboardPage() {
  void (await requireStaffActor("orders:read"));
  const counts = await getOrderStatusCounts();
  const analytics = await getSalesAnalytics();
  const { orders: recentOrders } = await getOrders({ page: 1, perPage: 5 });

  return (
    <div className="space-y-8 max-w-7xl">
      <AdminHeader
        title="Dashboard Operasional"
        description="Pantau pesanan masuk secara real-time, status pembayaran, dan pengiriman gudang"
      />

      {/* Hero Revenue Interactive Graph - 100% Absolute Real Data */}
      <RevenueChartHero analytics={analytics} />

      {/* Top Highlights Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
              Total Omzet Masuk
            </span>
            <span className="text-xl">💰</span>
          </div>
          <p className="text-2xl font-bold font-mono mt-2">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(counts.totalRevenue)}
          </p>
          <p className="text-xs text-emerald-100/90 mt-1">
            Dari {counts.totalOrders} total transaksi tercatat
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Perlu Diproses / Dikemas
            </span>
            <span className="text-xl">📦</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl font-bold text-gray-900 font-mono">
              {counts.fulfillmentReady}
            </p>
            <span className="text-xs font-semibold text-indigo-600">
              Pesanan
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Siap dikemas di gudang</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Menunggu Pembayaran
            </span>
            <span className="text-xl">⏳</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl font-bold text-amber-600 font-mono">
              {counts.paymentPending}
            </p>
            <span className="text-xs font-semibold text-amber-600">
              Menunggu
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            QRIS / VA / Konfirmasi CS
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Pesanan Bermasalah
            </span>
            <span className="text-xl">⚠️</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl font-bold text-gray-900 font-mono">
              {counts.blocked}
            </p>
            <span className="text-xs font-semibold text-gray-500">Item</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Dibatalkan atau gagal</p>
        </div>
      </div>

      {/* Work Queues Section */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Antrean Kerja & Verifikasi
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <WorkQueueCard
            title="Perlu Pengemasan & Pengiriman"
            count={counts.fulfillmentReady}
            description="Pesanan terbayar yang siap diproses dan dikirim via ekspedisi"
            href="/admin/orders?status=processing"
            icon="📦"
            variant={counts.fulfillmentReady > 0 ? "warning" : "default"}
          />
          <WorkQueueCard
            title="Verifikasi Pembayaran"
            count={counts.paymentPending}
            description="Pesanan pending yang menunggu bukti transfer atau konfirmasi otomatis"
            href="/admin/orders?paymentStatus=pending"
            icon="💳"
            variant={counts.paymentPending > 0 ? "warning" : "default"}
          />
          <WorkQueueCard
            title="Pesanan Dibatalkan / Gagal"
            count={counts.blocked}
            description="Pesanan yang kedaluwarsa atau dibatalkan oleh pelanggan"
            href="/admin/orders?status=cancelled"
            icon="❌"
          />
        </div>
      </div>

      {/* Recent Orders Live Feed */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              Pesanan Masuk Terbaru (Real-Time)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Daftar pesanan aktif dari toko Pena Ameen
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Lihat Semua Pesanan →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            Belum ada pesanan masuk. Pesanan baru akan langsung muncul di sini.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-gray-900">
                      {ord.orderNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                        ord.paymentStatus === "paid"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {ord.paymentStatus === "paid"
                        ? "✓ Terbayar"
                        : "Menunggu Bayar"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    <span className="font-bold text-gray-900">
                      Pesanan dari {ord.customerName}
                    </span>{" "}
                    <span className="text-gray-500">({ord.customerEmail})</span>{" "}
                    •{" "}
                    <span className="font-semibold text-primary-700">
                      {ord.items.length} Macam Produk (
                      {ord.items.reduce((s, i) => s + (i.quantity || 1), 0)}{" "}
                      pcs)
                    </span>
                    :{" "}
                    {ord.items
                      .map((i) => `${i.quantity}x ${i.productName}`)
                      .join(", ")}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {new Date(ord.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">
                      Total Tagihan
                    </span>
                    <span className="font-mono font-bold text-base text-gray-900">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(ord.totalAmount)}
                    </span>
                  </div>
                  <Link
                    href={`/admin/orders/${ord.id}`}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
                  >
                    Detail & Proses →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Aksi Cepat
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/products/new"
            className="p-5 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-xs transition-all"
          >
            <div className="text-2xl mb-2">➕</div>
            <h3 className="font-semibold text-gray-900 text-sm">
              Tambah Produk Baru
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Buat katalog buku atau paket belajar baru
            </p>
          </Link>
          <Link
            href="/admin/orders"
            className="p-5 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-xs transition-all"
          >
            <div className="text-2xl mb-2">🧾</div>
            <h3 className="font-semibold text-gray-900 text-sm">
              Kelola Seluruh Pesanan
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Lihat riwayat transaksi dan input nomor resi
            </p>
          </Link>
          <Link
            href="/admin/settings/access"
            className="p-5 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-xs transition-all"
          >
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-semibold text-gray-900 text-sm">
              Akses & Tim Staff
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Kelola hak akses administrator dan operator
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
