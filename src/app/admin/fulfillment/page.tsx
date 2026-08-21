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
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Create shipment dan print label diblokir sampai provider sandbox,
        package rules, origin, dan SOP fulfillment tervalidasi.
      </div>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase text-gray-500">
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Status</th>
              <th className="p-4">Shipping</th>
              <th className="p-4">Items</th>
            </tr>
          </thead>
          <tbody>
            {fulfillment.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="p-4 font-semibold">{item.orderNumber}</td>
                <td className="p-4">{item.customerName}</td>
                <td className="p-4">{item.status}</td>
                <td className="p-4 text-xs">
                  {item.trackingNumber || "Tracking belum tersedia"}
                  <br />
                  {item.shippingMethod || "Service belum dipilih"}
                </td>
                <td className="p-4">{item.itemCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
