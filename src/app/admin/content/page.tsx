import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { prisma } from "@/lib/prisma";

export default async function AdminContentPage() {
  void (await requireStaffActor("content:read"));
  const articles = await prisma.article.findMany({
    where: { isActive: true },
    orderBy: { date: "desc" },
    take: 50,
    select: { id: true, title: true, date: true },
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Content Management"
        description="Manage educational articles, parenting blogs, and promotional banners"
      />

      <div className="admin-panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-supporting-200 px-5 py-4">
          <div>
            <h3 className="text-sm font-medium text-supporting-900">
              Articles &amp; Guides
            </h3>
            <p className="mt-0.5 text-xs text-supporting-500">
              Daftar artikel aktif dari database
            </p>
          </div>
          <span className="inline-flex rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-800">
            CMS belum aktif
          </span>
        </div>

        <div className="admin-panel border-accent-200 bg-accent-50 mx-5 mt-4 mb-4 px-4 py-3 text-xs text-accent-800">
          Data artikel saat ini masih berasal dari sumber statis/migrasi. Tidak
          ada aksi publikasi yang tersedia sampai model konten, workflow
          editorial, dan data sumber disetujui.
        </div>
        <div className="divide-y divide-supporting-100">
          {articles.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-supporting-50"
            >
              <div>
                <p className="text-sm font-medium text-supporting-900">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-supporting-500">
                  {item.date.toLocaleDateString("id-ID")} • status aktif
                </p>
              </div>
              <span
                className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] border-primary-200 bg-primary-50 text-primary-800`}
              >
                published
              </span>
            </div>
          ))}
          {articles.length === 0 && (
            <p className="px-5 py-8 text-sm text-supporting-500">
              Belum ada artikel aktif di database.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
