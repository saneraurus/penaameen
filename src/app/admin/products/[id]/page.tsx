import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getProductById, getProductCategories } from "@/lib/admin/products";
import { ProductEditForm } from "@/presentation/components/admin/ProductEditForm";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  void (await requireStaffActor("catalog:read"));
  const { id } = await params;
  const product = await getProductById(id);
  const categories = await getProductCategories();

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <AdminHeader
          title={`Edit: ${product.name}`}
          description={`SKU: ${product.sku || "-"} • Kategori: ${product.category} • Status: ${product.status.toUpperCase()}`}
        />
        <Link
          href="/admin/products"
          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          ← Kembali ke Daftar Produk
        </Link>
      </div>

      <ProductEditForm product={product} categories={categories} />
    </div>
  );
}