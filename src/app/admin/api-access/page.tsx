import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { ApiAccessControl } from "@/presentation/components/admin/ApiAccessControl";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getPublicApiSettings } from "@/lib/admin/api-settings";

export default async function AdminApiAccessPage() {
  void (await requireStaffActor("access:read"));
  const settings = getPublicApiSettings();

  return (
    <div className="space-y-6 max-w-6xl">
      <AdminHeader
        title="API Access & Integrasi"
        description="Kontrol mutlak seluruh integrasi payment gateway Midtrans, kurir RajaOngkir, otomatisasi email, dan webhook"
      />
      <p className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        Nilai rahasia (API keys) ditampilkan tersamarkan dan disimpan terenkripsi.
        Masukkan nilai baru untuk menggantinya; biarkan nilai tersamarkan untuk
        mempertahankan konfigurasi saat ini.
      </p>

      <ApiAccessControl initialSettings={settings} />
    </div>
  );
}
