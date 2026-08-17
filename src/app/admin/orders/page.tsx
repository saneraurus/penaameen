import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import {
  DataTable,
  Pagination,
} from "@/presentation/components/admin/DataTable";
import Link from "next/link";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getOrders, type AdminOrder } from "@/lib/admin/orders";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-700",
  refunded: "bg-red-100 text-red-700",
};

const PAYMENT_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-red-100 text-red-700",
  partially_refunded: "bg-orange-100 text-orange-700",
};

const FULFILLMENT_STYLES: Record<string, string> = {
  unfulfilled: "bg-gray-100 text-gray-700",
  partial: "bg-yellow-100 text-yellow-700",
  fulfilled: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
};

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

  const totalPages = Math.ceil(total / perPage);

  const columns = [
    {
      key: "orderNumber",
      header: "Order",
      className: "w-32",
      render: (order: AdminOrder) => (
        <Link
          href={`/admin/orders/${order.id}`}
          className="font-medium text-gray-900 hover:text-primary-600"
        >
          {order.orderNumber}
        </Link>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      render: (order: AdminOrder) => (
        <div>
          <div className="text-gray-900">{order.customerName}</div>
          <div className="text-xs text-gray-500">{order.customerEmail}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "w-32",
      render: (order: AdminOrder) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-700"}`}
        >
          {order.status}
        </span>
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment",
      className: "w-36",
      render: (order: AdminOrder) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${PAYMENT_STYLES[order.paymentStatus] ?? "bg-gray-100 text-gray-700"}`}
        >
          {order.paymentStatus}
        </span>
      ),
    },
    {
      key: "fulfillmentStatus",
      header: "Fulfillment",
      className: "w-36",
      render: (order: AdminOrder) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${FULFILLMENT_STYLES[order.fulfillmentStatus] ?? "bg-gray-100 text-gray-700"}`}
        >
          {order.fulfillmentStatus}
        </span>
      ),
    },
    {
      key: "totalAmount",
      header: "Total",
      className: "w-40",
      render: (order: AdminOrder) => (
        <span className="font-mono text-gray-900">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(order.totalAmount)}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      className: "w-40",
      render: (order: AdminOrder) => (
        <span className="text-gray-600">
          {new Date(order.createdAt).toLocaleDateString("id-ID")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-24",
      render: (order: AdminOrder) => (
        <Link
          href={`/admin/orders/${order.id}`}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          View
        </Link>
      ),
    },
  ] as import("@/presentation/components/admin/DataTable").Column<AdminOrder>[];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Orders"
        description="Manage customer orders, payments, and fulfillment"
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4">
          <form className="flex gap-4 flex-1">
            <input
              type="search"
              name="search"
              value={search}
              placeholder="Search order #, customer..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              name="status"
              value={status}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              name="paymentStatus"
              value={paymentStatus}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Payment</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="partially_refunded">Partial Refund</option>
            </select>
            <select
              name="fulfillmentStatus"
              value={fulfillmentStatus}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Fulfillment</option>
              <option value="unfulfilled">Unfulfilled</option>
              <option value="partial">Partial</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Filter
            </button>
          </form>
        </div>

        <DataTable
          columns={columns}
          data={orders}
          keyAccessor={(o) => o.id}
          emptyMessage="No orders found"
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              const sp = new URLSearchParams(window.location.search);
              sp.set("page", String(newPage));
              window.location.search = sp.toString();
            }}
            showPerPage
            perPage={perPage}
            onPerPageChange={(newPerPage) => {
              const sp = new URLSearchParams(window.location.search);
              sp.set("perPage", String(newPerPage));
              sp.set("page", "1");
              window.location.search = sp.toString();
            }}
          />
        )}
      </div>
    </div>
  );
}
