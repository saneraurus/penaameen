import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { NotificationsPanel } from "@/presentation/components/admin/NotificationsPanel";
import { requireStaffActor } from "@/application/auth/clerk-auth";

export default async function AdminNotificationsPage() {
  void (await requireStaffActor("notifications:read"));

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminHeader
        title="Notification Center"
        description="Pesanan baru, webhook gagal, stok menipis, dan sinyal operasional lain"
      />
      <NotificationsPanel />
    </div>
  );
}
