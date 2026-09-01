import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getAdminFulfillmentQueue } from "@/lib/admin/commerce-operations";

export default async function AdminFulfillmentPage() {
  await requireStaffActor("fulfillment:read");
  const fulfillment = await getAdminFulfillmentQueue();
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Fulfillment & Shipping"
        description="Queue fulfillment tanpa membuat tracking atau shipment palsu."
      />
      <div className="admin-panel border-accent-200 bg-accent-50 px-4 py-3 text-xs text-accent-800">
        Create shipment dan print label diblokir sampai provider sandbox,
        package rules, origin, dan SOP fulfillment tervalidasi.
      </div>
      <div className="admin-panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-supporting-200 text-[11px] uppercase tracking-[0.12em] text-supporting-400">
              <th className="px-5 py-3 font-semibold">Order</th>
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Shipping</th>
              <th className="px-5 py-3 font-semibold">Items</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-supporting-100">
            {fulfillment.map((item) => (
              <tr
                key={item.id}
                className="transition-colors hover:bg-supporting-50"
              >
                <td className="px-5 py-3.5 text-sm font-medium text-supporting-900">
                  {item.orderNumber}
                </td>
                <td className="px-5 py-3.5 text-sm text-supporting-800">
                  {item.customerName}
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] border-supporting-200 bg-supporting-50 text-supporting-700">
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-supporting-600">
                  {item.trackingNumber || "Tracking belum tersedia"}
                  <br />
                  {item.shippingMethod || "Service belum dipilih"}
                </td>
                <td className="px-5 py-3.5 text-sm text-supporting-800">
                  {item.itemCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
