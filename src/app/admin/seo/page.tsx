import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { requireStaffActor } from "@/application/auth/clerk-auth";

export default async function AdminSeoPage() {
  void (await requireStaffActor("seo:read"));

  return (
    <div className="space-y-6">
      <AdminHeader
        title="SEO & Metadata Health"
        description="Monitor canonical tags, OpenGraph previews, and search indexability"
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase">
            Indexed Pages
          </span>
          <p className="text-2xl font-bold text-emerald-600 mt-1 font-mono">
            UNKNOWN
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Belum ada inventaris URL dan redirect tervalidasi
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase">
            Schema.org Structured Data
          </span>
          <p className="text-2xl font-bold text-blue-600 mt-1 font-mono">
            UNKNOWN
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Validasi structured data belum terhubung ke health check
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 uppercase">
            Sitemap Status
          </span>
          <p className="text-2xl font-bold text-purple-600 mt-1 font-mono">
            UNKNOWN
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Status sitemap perlu diverifikasi di environment target
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-semibold text-gray-900">
          SEO Recommendations
        </h3>
        <ul className="divide-y divide-gray-100 text-xs">
          <li className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">
                Ensure all product images include descriptive alt text
              </p>
              <p className="text-gray-500">
                Audit alt text belum memiliki sumber data tervalidasi
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">
              Review
            </span>
          </li>
          <li className="py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">
                Verify 301 redirects for legacy WordPress URLs
              </p>
              <p className="text-gray-500">
                Redirect inventory belum tersedia untuk diverifikasi
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">
              Blocked
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
