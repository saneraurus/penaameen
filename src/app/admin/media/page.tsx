import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getGalleryHealth } from "@/lib/media/gallery-health";

export default async function AdminMediaPage() {
  await requireStaffActor("media:read");
  const gallery = getGalleryHealth();
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Media Health"
        description="Validasi asset lokal, metadata aksesibilitas, dan rights review."
      />
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        Publish dan upload media baru belum tersedia. Rights ownership masih
        `UNKNOWN` dan tidak boleh dianggap approved.
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5">
          <p className="text-xs uppercase text-gray-500">Source</p>
          <p className="mt-2 font-semibold">{gallery.source}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <p className="text-xs uppercase text-gray-500">Files</p>
          <p className="mt-2 font-mono text-2xl">
            {gallery.filesPresent}/{gallery.total}
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <p className="text-xs uppercase text-gray-500">Rights</p>
          <p className="mt-2 font-semibold">
            {gallery.rightsState.toUpperCase()}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-600">{gallery.detail}</p>
    </div>
  );
}
