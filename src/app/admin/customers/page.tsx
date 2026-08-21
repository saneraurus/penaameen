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
        description="Customer context terbatas untuk operasi dan support."
      />
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Data pelanggan hanya ditampilkan untuk kebutuhan operasional. Password,
        payment credential, dan data yang tidak diperlukan tidak tersedia.
      </div>
      <form className="rounded-2xl border border-gray-200 bg-white p-4">
        <input
          name="search"
          defaultValue={search}
          placeholder="Cari nama, email, atau telepon"
          className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm"
        />
      </form>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs uppercase text-gray-500">
              <th className="p-4">Customer</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Addresses</th>
              <th className="p-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b last:border-0">
                <td className="p-4">
                  <div className="font-semibold">{customer.name}</div>
                  <div className="text-xs text-gray-500">{customer.email}</div>
                </td>
                <td className="p-4">{customer.orderCount}</td>
                <td className="p-4">{customer.addressCount}</td>
                <td className="p-4 text-xs text-gray-500">
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
