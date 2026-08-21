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
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Refund dan manual verification tidak tersedia dari halaman ini sampai
        evidence provider dan SOP finance tervalidasi.
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="rounded-2xl border border-gray-200 bg-white p-5"
          >
            <div className="flex justify-between">
              <strong>{payment.orderNumber}</strong>
              <span className="text-xs font-semibold">{payment.status}</span>
            </div>
            <p className="mt-2 text-sm">{payment.customerName}</p>
            <p className="text-xs text-gray-500">
              {payment.provider} {payment.providerReference || ""}
            </p>
            <p className="mt-3 font-mono">
              Rp {payment.amount.toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
