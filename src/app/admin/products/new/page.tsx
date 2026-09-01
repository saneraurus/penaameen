import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import Link from "next/link";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getProductCategories } from "@/lib/admin/products";
import { ProductCreateForm } from "@/presentation/components/admin/ProductCreateForm";

export default async function AdminNewProductPage() {
  void (await requireStaffActor("catalog:write"));
  const categories = await getProductCategories();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-2 text-xs text-supporting-500">
        <Link
          href="/admin/products"
          className="font-medium text-primary-800 hover:text-accent-700 transition-colors"
        >
          ← Kembali ke Daftar Produk
        </Link>
      </div>

      <AdminHeader
        title="Tambah Produk Baru"
        description="Terbitkan paket buku baru, metode belajar, atau materi edukasi ke katalog Pena Ameen"
      />

      <ProductCreateForm categories={categories} />
    </div>
  );
}
