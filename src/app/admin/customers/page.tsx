import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getAdminCustomers } from "@/lib/admin/commerce-operations";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  await requireStaffActor("customers:read");
  const search = (await searchParams).search || "";
  const customers = await getAdminCustomers(search);

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Customers"
        description="Data pelanggan hanya ditampilkan untuk kebutuhan operasional. Password, payment credential, dan data sensitif tidak tersedia."
      />

      <div className="admin-panel border-accent-200 bg-accent-50 px-4 py-3 text-xs text-accent-800">
        Data pelanggan hanya ditampilkan untuk kebutuhan operasional.
      </div>

      <div className="admin-panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-supporting-200 text-[11px] uppercase tracking-[0.12em] text-supporting-400">
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Orders</th>
              <th className="px-5 py-3 font-semibold">Addresses</th>
              <th className="px-5 py-3 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-supporting-100">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="transition-colors hover:bg-supporting-50"
              >
                <td className="px-5 py-3.5">
                  <div className="text-sm font-medium text-supporting-900">
                    {customer.name}
                  </div>
                  <div className="text-xs text-supporting-500">
                    {customer.email}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-supporting-800">
                  {customer.orderCount}
                </td>
                <td className="px-5 py-3.5 text-sm text-supporting-800">
                  {customer.addressCount}
                </td>
                <td className="px-5 py-3.5 text-xs text-supporting-500">
                  {new Date(customer.createdAt).toLocaleDateString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
