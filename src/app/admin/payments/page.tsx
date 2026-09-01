import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getAdminPaymentQueue } from "@/lib/admin/commerce-operations";

export default async function AdminPaymentsPage() {
  await requireStaffActor("payments:read");
  const payments = await getAdminPaymentQueue();
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Payment Review"
        description="Payment state dari provider/evidence yang tersedia."
      />
      <div className="admin-panel border-accent-200 bg-accent-50 px-4 py-3 text-xs text-accent-800">
        Refund dan manual verification tidak tersedia dari halaman ini sampai
        evidence provider dan SOP finance tervalidasi.
      </div>
      <div className="admin-panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-supporting-200 text-[11px] uppercase tracking-[0.12em] text-supporting-400">
              <th className="px-5 py-3 font-semibold">Order</th>
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Provider</th>
              <th className="px-5 py-3 font-semibold text-right">Amount</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-supporting-100">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="transition-colors hover:bg-supporting-50"
              >
                <td className="px-5 py-3.5 text-sm font-medium text-supporting-900">
                  {payment.orderNumber}
                </td>
                <td className="px-5 py-3.5 text-sm text-supporting-800">
                  {payment.customerName}
                </td>
                <td className="px-5 py-3.5 text-xs text-supporting-600">
                  {payment.provider}
                  {payment.providerReference && (
                    <span className="ml-1.5 font-mono text-supporting-400">
                      {payment.providerReference}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-sm text-supporting-900">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(payment.amount)}
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] border-supporting-200 bg-supporting-50 text-supporting-700">
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
