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

function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default async function AdminDashboardPage() {
  void (await requireStaffActor("orders:read"));
  const counts = await getOrderStatusCounts();
  const analytics = await getSalesAnalytics();
  const { orders: recentOrders } = await getOrders({ page: 1, perPage: 5 });

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <AdminHeader
        title="Dashboard Operasional"
        description="Pantau pesanan masuk secara real-time, status pembayaran, dan pengiriman gudang"
      />

      {/* Revenue — real data only */}
      <section
        aria-labelledby="revenue-heading"
        className="admin-panel overflow-hidden"
      >
        <div className="border-b border-supporting-200 px-5 py-4">
          <h2
            id="revenue-heading"
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-supporting-400"
          >
            Omzet Masuk
          </h2>
        </div>
        <RevenueChartHero analytics={analytics} />
      </section>

      {/* Operational metrics */}
      <section aria-labelledby="metrics-heading">
        <h2
          id="metrics-heading"
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-supporting-400"
        >
          Ringkasan Metrik
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="admin-panel p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-supporting-400">
              Total Omzet Masuk
            </p>
            <p className="mt-3 font-mono text-xl leading-none tracking-tight text-supporting-900">
              {formatIDR(counts.totalRevenue)}
            </p>
            <p className="mt-2 text-xs text-supporting-500">
              {counts.totalOrders} total transaksi tercatat
            </p>
          </div>
          <div className="admin-panel p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-supporting-400">
              Perlu Diproses / Dikemas
            </p>
            <p className="mt-3 font-mono text-xl leading-none tracking-tight text-supporting-900">
              {String(counts.fulfillmentReady)}
            </p>
            <p className="mt-2 text-xs text-supporting-500">
              Siap dikemas di gudang
            </p>
          </div>
          <div className="admin-panel p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-supporting-400">
              Menunggu Pembayaran
            </p>
            <p className="mt-3 font-mono text-xl leading-none tracking-tight text-supporting-900">
              {String(counts.paymentPending)}
            </p>
            <p className="mt-2 text-xs text-supporting-500">
              QRIS / VA / Konfirmasi CS
            </p>
          </div>
          <div className="admin-panel p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-supporting-400">
              Pesanan Bermasalah
            </p>
            <p className="mt-3 font-mono text-xl leading-none tracking-tight text-supporting-900">
              {String(counts.blocked)}
            </p>
            <p className="mt-2 text-xs text-supporting-500">
              Dibatalkan atau gagal
            </p>
          </div>
        </div>
      </section>

      {/* Work queues */}
      <section aria-labelledby="queues-heading">
        <h2
          id="queues-heading"
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-supporting-400"
        >
          Antrean Kerja &amp; Verifikasi
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <WorkQueueCard
            title="Perlu Pengemasan & Pengiriman"
            count={counts.fulfillmentReady}
            description="Pesanan terbayar yang siap diproses dan dikirim via ekspedisi"
            href="/admin/orders?status=processing"
            icon="01"
            variant={counts.fulfillmentReady > 0 ? "warning" : "default"}
          />
          <WorkQueueCard
            title="Verifikasi Pembayaran"
            count={counts.paymentPending}
            description="Pesanan pending yang menunggu bukti transfer atau konfirmasi otomatis"
            href="/admin/orders?paymentStatus=pending"
            icon="02"
            variant={counts.paymentPending > 0 ? "warning" : "default"}
          />
          <WorkQueueCard
            title="Pesanan Dibatalkan / Gagal"
            count={counts.blocked}
            description="Pesanan yang kedaluwarsa atau dibatalkan oleh pelanggan"
            href="/admin/orders?status=cancelled"
            icon="03"
          />
        </div>
      </section>

      {/* Recent orders */}
      <section
        aria-labelledby="recent-heading"
        className="admin-panel overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-supporting-200 px-5 py-4">
          <div>
            <h2
              id="recent-heading"
              className="text-sm font-medium text-supporting-900"
            >
              Pesanan Masuk Terbaru
            </h2>
            <p className="mt-0.5 text-xs text-supporting-500">
              Daftar pesanan aktif dari toko Pena Ameen
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-medium text-primary-800 transition-colors hover:text-accent-700"
          >
            Lihat Semua Pesanan →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <span
              aria-hidden="true"
              className="mx-auto mb-4 block h-px w-12 bg-supporting-300"
            />
            <p className="text-sm text-supporting-500">
              Belum ada pesanan masuk. Pesanan baru akan langsung muncul di
              sini.
            </p>
          </div>
        ) : (
          <ul>
            {recentOrders.map((ord) => (
              <li
                key={ord.id}
                className="flex flex-wrap items-start justify-between gap-5 border-b border-supporting-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-supporting-50"
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-sm font-medium text-supporting-900">
                      {ord.orderNumber}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        ord.paymentStatus === "paid"
                          ? "border-primary-200 bg-primary-50 text-primary-800"
                          : "border-accent-200 bg-accent-50 text-accent-800"
                      }`}
                    >
                      {ord.paymentStatus === "paid"
                        ? "Terbayar"
                        : "Menunggu Bayar"}
                    </span>
                    <span className="rounded-full bg-supporting-100 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-supporting-600">
                      {ord.status}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-supporting-600">
                    <span className="font-medium text-supporting-900">
                      Pesanan dari {ord.customerName}
                    </span>{" "}
                    <span className="text-supporting-500">
                      ({ord.customerEmail})
                    </span>{" "}
                    ·{" "}
                    <span className="text-supporting-700">
                      {ord.items.length} Macam Produk (
                      {ord.items.reduce((s, i) => s + (i.quantity || 1), 0)}{" "}
                      pcs)
                    </span>
                    :{" "}
                    {ord.items
                      .map((i) => `${i.quantity}x ${i.productName}`)
                      .join(", ")}
                  </p>

                  <p className="text-[11px] text-supporting-400">
                    {new Date(ord.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-5">
                  <div className="text-right">
                    <span className="block text-[10px] uppercase tracking-[0.14em] text-supporting-400">
                      Total Tagihan
                    </span>
                    <span className="font-mono text-sm font-medium text-supporting-900">
                      {formatIDR(ord.totalAmount)}
                    </span>
                  </div>
                  <Link
                    href={`/admin/orders/${ord.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary-950 px-4 py-2 text-xs font-medium text-background-100 transition-colors hover:bg-primary-900"
                  >
                    Detail &amp; Proceso →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Quick actions */}
      <section aria-labelledby="actions-heading">
        <h2
          id="actions-heading"
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-supporting-400"
        >
          Aksi Cepat
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            {
              href: "/admin/products/new",
              title: "Tambah Produk Baru",
              desc: "Buat katalog buku atau paket belajar baru",
            },
            {
              href: "/admin/orders",
              title: "Kelola Seluruh Pesanan",
              desc: "Lihat riwayat transaksi dan input nomor resi",
            },
            {
              href: "/admin/settings/access",
              title: "Akses & Tim Staff",
              desc: "Kelola hak akses administrator dan operator",
            },
          ].map((action, index) => (
            <Link
              key={action.href}
              href={action.href}
              className="group admin-panel p-5 transition-all duration-200 hover:-translate-y-0.5"
            >
              <span className="text-[10px] font-semibold tracking-[0.2em] text-accent-600">
                {`0${index + 1}`}
              </span>
              <h3 className="mt-3 text-sm font-medium text-supporting-900">
                {action.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-supporting-500">
                {action.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
