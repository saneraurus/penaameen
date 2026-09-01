import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getContentSeoHealth } from "@/lib/seo/content-health";

export default async function AdminSeoPage() {
  void (await requireStaffActor("seo:read"));
  const health = await getContentSeoHealth();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="SEO & Metadata Health"
        description="Monitor canonical tags, OpenGraph previews, and search indexability"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="admin-panel p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-supporting-400">
            Indexed Pages
          </p>
          <p className="mt-2.5 font-mono text-lg leading-none tracking-tight text-supporting-900">
            {health.indexedPages.count}
          </p>
          <p className="mt-1.5 text-xs text-supporting-500">
            URL aktif dari product/content source
          </p>
        </div>

        <div className="admin-panel p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-supporting-400">
            Schema.org Structured Data
          </p>
          <p className="mt-2.5 font-mono text-lg leading-none tracking-tight text-primary-800">
            {health.structuredData.state.toUpperCase()}
          </p>
          <p className="mt-1.5 text-xs text-supporting-500">
            Validasi structured data belum terhubung ke health check
          </p>
        </div>

        <div className="admin-panel p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-supporting-400">
            Sitemap Status
          </p>
          <p className="mt-2.5 font-mono text-lg leading-none tracking-tight text-accent-700">
            {health.sitemap.state.toUpperCase()}
          </p>
          <p className="mt-1.5 text-xs text-supporting-500">
            {health.sitemap.url} tersedia dari metadata runtime
          </p>
        </div>
      </div>

      <div className="admin-panel overflow-hidden">
        <div className="border-b border-supporting-200 px-5 py-4">
          <h3 className="text-sm font-medium text-supporting-900">
            SEO Recommendations
          </h3>
        </div>
        <ul className="divide-y divide-supporting-100">
          <li className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-supporting-900">
                Ensure all product images include descriptive alt text
              </p>
              <p className="mt-0.5 text-xs text-supporting-500">
                {health.products.imagesComplete}/{health.products.total} produk
                memiliki image source
              </p>
            </div>
            <span className="inline-flex rounded-full border border-primary-200 bg-primary-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-800">
              Review
            </span>
          </li>
          <li className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-supporting-900">
                Verify 301 redirects for legacy WordPress URLs
              </p>
              <p className="mt-0.5 text-xs text-supporting-500">
                {health.redirects.detail}
              </p>
            </div>
            <span className="inline-flex rounded-full border border-accent-200 bg-accent-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-800">
              Blocked
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
