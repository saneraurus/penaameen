import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { NotificationsPanel } from "@/presentation/components/admin/NotificationsPanel";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getNotificationDeliveryHealth } from "@/lib/notifications/delivery-health";

export default async function AdminNotificationsPage() {
  void (await requireStaffActor("notifications:read"));
  const health = getNotificationDeliveryHealth();

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminHeader
        title="Notification Center"
        description="Pesanan baru, webhook gagal, stok menipis, dan sinyal operasional lain"
      />
      <NotificationsPanel />
      <div className="admin-panel border-accent-200 bg-accent-50 px-4 py-3 text-xs text-accent-800">
        Notification store: <strong>{health.store.state}</strong>. Email:{" "}
        <strong>{health.email.state}</strong>. {health.email.detail}
      </div>
    </div>
  );
}
