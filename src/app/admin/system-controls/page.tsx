import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { SystemControlsPanel } from "@/presentation/components/admin/SystemControlsPanel";
import { requireStaffActor } from "@/application/auth/clerk-auth";

export default async function AdminSystemControlsPage() {
  void (await requireStaffActor("system:control"));

  return (
    <div className="space-y-6 max-w-3xl">
      <AdminHeader
        title="Emergency Controls"
        description="Kontrol darurat terproteksi: pause otomasi, matikan auto-send, hentikan proses webhook, dan hentikan email keluar"
      />
      <SystemControlsPanel />
    </div>
  );
}