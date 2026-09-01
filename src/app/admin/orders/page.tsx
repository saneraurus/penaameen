import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { AdminOrdersManager } from "@/presentation/components/admin/AdminOrdersManager";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getOrders } from "@/lib/admin/orders";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    perPage?: string;
    search?: string;
    status?: string;
    paymentStatus?: string;
    fulfillmentStatus?: string;
  }>;
}) {
  void (await requireStaffActor("orders:read"));
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const perPage = Math.min(100, Math.max(1, Number(params.perPage) || 25));
  const search = params.search || "";
  const status = params.status || "";
  const paymentStatus = params.paymentStatus || "";
  const fulfillmentStatus = params.fulfillmentStatus || "";

  const { orders, total } = await getOrders({
    page,
    perPage,
    search,
    status,
    paymentStatus,
    fulfillmentStatus,
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <AdminHeader
          title="Manajemen Pesanan"
          description="Kelola pesanan pelanggan, rincian produk, verifikasi pembayaran, dan cetak resi pengiriman otomatis"
        />
      </div>

      {/* Filter Bar */}
      <div className="admin-panel p-3">
        <form className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Cari nomor pesanan, nama pelanggan, email..."
            className="flex-1 min-w-[200px] rounded-lg border border-supporting-200 bg-supporting-50 px-3.5 py-2 text-xs tracking-tight text-supporting-900 placeholder:text-supporting-400 focus:border-primary-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-800 transition-colors"
          />

          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border border-supporting-200 bg-supporting-50 px-3 py-2 text-xs font-semibold tracking-tight text-supporting-800 focus:border-primary-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-800 transition-colors"
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu Bayar</option>
            <option value="processing">Sedang Diproses</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>

          <select
            name="paymentStatus"
            defaultValue={paymentStatus}
            className="rounded-lg border border-supporting-200 bg-supporting-50 px-3 py-2 text-xs font-semibold tracking-tight text-supporting-800 focus:border-primary-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-800 transition-colors"
          >
            <option value="">Semua Pembayaran</option>
            <option value="paid">Terbayar (Paid)</option>
            <option value="pending">Pending</option>
            <option value="failed">Gagal / Expired</option>
          </select>

          <select
            name="fulfillmentStatus"
            defaultValue={fulfillmentStatus}
            className="rounded-lg border border-supporting-200 bg-supporting-50 px-3 py-2 text-xs font-semibold tracking-tight text-supporting-800 focus:border-primary-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-800 transition-colors"
          >
            <option value="">Semua Pengiriman</option>
            <option value="unfulfilled">Belum Dikemas</option>
            <option value="fulfilled">Sedang Dikemas</option>
            <option value="shipped">Dalam Pengiriman</option>
            <option value="delivered">Diterima Pelanggan</option>
          </select>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-950 px-5 py-2 text-xs font-semibold text-background-100 tracking-tight transition-colors hover:bg-primary-900 cursor-pointer"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Interactive Orders List with Dropdowns and Print Resi */}
      <AdminOrdersManager
        initialOrders={orders}
        total={total}
        currentPage={page}
        perPage={perPage}
      />
    </div>
  );
}
