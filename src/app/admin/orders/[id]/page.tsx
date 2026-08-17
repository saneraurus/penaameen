import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import {
  DataTable,
  type Column,
} from "@/presentation/components/admin/DataTable";
import { OrderActionButton } from "@/presentation/components/admin/OrderActionButton";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import {
  getOrderById,
  type AdminOrder,
  type OrderTransition,
} from "@/lib/admin/orders";

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

const AVAILABLE_TRANSITIONS: Record<AdminOrder["status"], OrderTransition[]> = {
  pending: ["mark_paid", "mark_processing", "cancel"],
  processing: [
    "mark_completed",
    "mark_fulfilled",
    "mark_shipped",
    "cancel",
    "refund",
  ],
  completed: ["mark_delivered", "refund"],
  cancelled: [],
  refunded: [],
};

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
      <div className="space-y-6">
        <AdminHeader title="Order Not Found" />
        <p className="text-gray-600">The requested order does not exist.</p>
      </div>
    );
  }

  const transitions = AVAILABLE_TRANSITIONS[order.status] ?? [];

  const itemColumns: Column<AdminOrder["items"][number]>[] = [
    {
      key: "productName",
      header: "Product",
      render: (item) => (
        <span className="font-medium text-gray-900">{item.productName}</span>
      ),
    },
    {
      key: "quantity",
      header: "Qty",
      render: (item) => <span className="text-gray-700">{item.quantity}</span>,
    },
    {
      key: "unitPrice",
      header: "Unit Price",
      render: (item) => (
        <span className="font-mono text-gray-700">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(item.unitPrice)}
        </span>
      ),
    },
    {
      key: "totalPrice",
      header: "Total",
      render: (item) => (
        <span className="font-mono font-medium text-gray-900">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(item.totalPrice)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Order ${order.orderNumber}`}
        description={`Placed by ${order.customerName} on ${new Date(order.createdAt).toLocaleDateString("id-ID")}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
            <DataTable
              columns={itemColumns}
              data={order.items}
              keyAccessor={(i) => i.id}
              emptyMessage="No items"
            />
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
              <span className="text-gray-600">
                Total ({order.itemCount} items)
              </span>
              <span className="font-mono font-semibold text-gray-900">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(order.totalAmount)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Shipping Address
            </h2>
            {order.shippingAddress && (
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>
                  {order.shippingAddress.address1}
                  {order.shippingAddress.address2
                    ? `, ${order.shippingAddress.address2}`
                    : ""}
                </p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p>{order.shippingAddress.phone}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-700"}`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Payment</span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${PAYMENT_STYLES[order.paymentStatus] ?? "bg-gray-100 text-gray-700"}`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Fulfillment</span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${FULFILLMENT_STYLES[order.fulfillmentStatus] ?? "bg-gray-100 text-gray-700"}`}
              >
                {order.fulfillmentStatus}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Actions
            </h2>
            {transitions.length === 0 ? (
              <p className="text-sm text-gray-500">
                No actions available for this status.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {transitions.map((t) => (
                  <OrderActionButton
                    key={t}
                    orderId={order.id}
                    transition={t}
                    variant={
                      t === "cancel" || t === "refund" ? "danger" : "primary"
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {order.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Notes
              </h2>
              <p className="text-sm text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
