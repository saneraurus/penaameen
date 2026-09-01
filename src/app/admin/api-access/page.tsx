import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { ApiAccessControl } from "@/presentation/components/admin/ApiAccessControl";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getPublicApiSettings } from "@/lib/admin/api-settings";

export const dynamic = "force-dynamic";

export default async function AdminApiAccessPage() {
  void (await requireStaffActor("access:read"));
  const settings = getPublicApiSettings();

  return (
    <div className="space-y-6 max-w-6xl">
      <AdminHeader
        title="API Access & Integrasi"
        description="Kontrol mutlak seluruh integrasi payment gateway Midtrans, kurir RajaOngkir, otomatisasi email, dan webhook"
      />
      <div className="admin-panel border-accent-200 bg-accent-50 px-4 py-3 text-xs text-accent-800">
        Nilai rahasia (API keys) ditampilkan tersamarkan dan disimpan
        terenkripsi. Masukkan nilai baru untuk menggantinya; biarkan nilai
        tersamarkan untuk mempertahankan konfigurasi saat ini.
      </div>

      <ApiAccessControl initialSettings={settings} />
    </div>
  );
}
