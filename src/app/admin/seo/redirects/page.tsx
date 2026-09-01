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
      <div className="admin-panel border-accent-200 bg-accent-50 px-4 py-3 text-xs text-accent-800">
        <strong>BLOCKED:</strong> {inventory.detail} Tidak ada redirect yang
        dibuat otomatis dan URL existing tidak diubah.
      </div>
      <div className="admin-panel p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-supporting-400">
          Validated redirects
        </p>
        <p className="mt-2.5 font-mono text-lg leading-none tracking-tight text-supporting-900">
          {inventory.validated}/{inventory.total}
        </p>
      </div>
    </div>
  );
}
