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
          className="inline-flex items-center gap-1.5 rounded-lg border border-supporting-300 px-4 py-2 text-xs font-semibold text-supporting-800 tracking-tight transition-colors hover:bg-supporting-50"
        >
          ← Kembali ke Daftar Produk
        </Link>
      </div>

      <ProductEditForm product={product} categories={categories} />
    </div>
  );
}
