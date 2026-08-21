import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getRedirectInventoryHealth } from "@/lib/seo/redirect-inventory";

export default async function AdminRedirectsPage() {
  await requireStaffActor("seo:read");
  const inventory = getRedirectInventoryHealth();
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Redirect Governance"
        description="Migration-safe old-to-new URL review."
      />
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <strong>BLOCKED:</strong> {inventory.detail} Tidak ada redirect yang
        dibuat otomatis dan URL existing tidak diubah.
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <p className="text-xs uppercase text-gray-500">Validated redirects</p>
        <p className="mt-2 font-mono text-2xl">
          {inventory.validated}/{inventory.total}
        </p>
      </div>
    </div>
  );
}
