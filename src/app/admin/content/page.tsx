import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { requireStaffActor } from "@/application/auth/clerk-auth";

export default async function AdminContentPage() {
  void (await requireStaffActor("content:read"));

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
          <button
            type="button"
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            + Write Article
          </button>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {[
            {
              title:
                "Cara Efektif Mengajarkan Anak Membaca Tanpa Mengeja (Metode ACM)",
              status: "published",
              date: "14 Agu 2026",
              views: "1.4k",
            },
            {
              title:
                "Panduan Lengkap Mengenalkan Huruf Hijaiyah dengan Metode Al-Barqy",
              status: "published",
              date: "08 Agu 2026",
              views: "980",
            },
            {
              title:
                "5 Aktivitas Menyenangkan Melatih Motorik Halus Anak Usia Dini",
              status: "draft",
              date: "17 Agu 2026",
              views: "-",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="py-3 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-gray-500 mt-0.5">
                  {item.date} • {item.views} pembaca
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full font-semibold uppercase text-[10px] ${
                  item.status === "published"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
