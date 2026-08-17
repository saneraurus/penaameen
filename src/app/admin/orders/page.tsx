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
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
        <form className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Cari nomor pesanan, nama pelanggan, email..."
            className="flex-1 min-w-[240px] px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />

          <select
            name="status"
            defaultValue={status}
            className="px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            className="px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Semua Pembayaran</option>
            <option value="paid">Terbayar (Paid)</option>
            <option value="pending">Pending</option>
            <option value="failed">Gagal / Expired</option>
          </select>

          <select
            name="fulfillmentStatus"
            defaultValue={fulfillmentStatus}
            className="px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Semua Pengiriman</option>
            <option value="unfulfilled">Belum Dikemas</option>
            <option value="fulfilled">Sedang Dikemas</option>
            <option value="shipped">Dalam Pengiriman</option>
            <option value="delivered">Diterima Pelanggan</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
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
