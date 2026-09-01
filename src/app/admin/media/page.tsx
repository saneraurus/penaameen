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
      <div className="admin-panel border-accent-200 bg-accent-50 px-4 py-3 text-xs text-accent-800">
        Publish dan upload media baru belum tersedia. Rights ownership masih
        `UNKNOWN` dan tidak boleh dianggap approved.
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="admin-panel p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-supporting-400">
            Source
          </p>
          <p className="mt-2.5 text-sm font-medium text-supporting-900">
            {gallery.source}
          </p>
        </div>
        <div className="admin-panel p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-supporting-400">
            Files
          </p>
          <p className="mt-2.5 font-mono text-lg leading-none tracking-tight text-supporting-900">
            {gallery.filesPresent}/{gallery.total}
          </p>
        </div>
        <div className="admin-panel p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-supporting-400">
            Rights
          </p>
          <p className="mt-2.5 text-sm font-medium text-supporting-900">
            {gallery.rightsState.toUpperCase()}
          </p>
        </div>
      </div>
      <p className="text-xs text-supporting-500">{gallery.detail}</p>
    </div>
  );
}
