import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { ApiAccessControl } from "@/presentation/components/admin/ApiAccessControl";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getApiSettings } from "@/lib/admin/api-settings";

export default async function AdminApiAccessPage() {
  void (await requireStaffActor("access:read"));
  const settings = getApiSettings();

  return (
    <div className="space-y-6 max-w-6xl">
      <AdminHeader
        title="API Access & Integrasi"
        description="Kontrol mutlak seluruh integrasi payment gateway Midtrans, kurir RajaOngkir, otomatisasi email, dan webhook"
      />

      <ApiAccessControl initialSettings={settings} />
    </div>
  );
}
