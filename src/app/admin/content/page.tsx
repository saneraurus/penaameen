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

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            Articles & Guides
          </h3>
          <span className="px-4 py-2 bg-amber-50 text-amber-800 text-xs font-semibold rounded-xl border border-amber-200">
            CMS belum aktif
          </span>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
          Data artikel saat ini masih berasal dari sumber statis/migrasi. Tidak
          ada aksi publikasi yang tersedia sampai model konten, workflow
          editorial, dan data sumber disetujui.
        </div>
        <div className="divide-y divide-gray-100 text-xs opacity-75">
          {articles.map((item) => (
            <div
              key={item.id}
              className="py-3 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-gray-500 mt-0.5">
                  {item.date.toLocaleDateString("id-ID")} • status aktif
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full font-semibold uppercase text-[10px] ${"bg-emerald-50 text-emerald-700"}`}
              >
                published
              </span>
            </div>
          ))}
          {articles.length === 0 && (
            <p className="py-6 text-gray-500">
              Belum ada artikel aktif di database.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
