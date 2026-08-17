import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { OrderDetailView } from "@/presentation/components/admin/OrderDetailView";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getOrderById } from "@/lib/admin/orders";
import Link from "next/link";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaffActor("orders:read");
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    return (
      <div className="space-y-6 max-w-5xl">
        <AdminHeader title="Pesanan Tidak Ditemukan" />
        <p className="text-gray-600">
          Pesanan yang diminta tidak ada di sistem.
        </p>
        <Link
          href="/admin/orders"
          className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 inline-block"
        >
          ← Kembali ke Daftar Pesanan
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <OrderDetailView order={order} />
    </div>
  );
}
