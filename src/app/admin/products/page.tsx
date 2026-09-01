import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import {
  DataTable,
  Pagination,
} from "@/presentation/components/admin/DataTable";
import { ProductStatusButton } from "@/presentation/components/admin/ProductStatusButton";
import { ProductsTabs } from "@/presentation/components/admin/ProductsTabs";
import Link from "next/link";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import {
  getProducts,
  getProductCategories,
  getSheetProducts,
  getSheetProductCategories,
  type AdminProduct,
} from "@/lib/admin/products";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    perPage?: string;
    search?: string;
    category?: string;
    status?: string;
  }>;
}) {
  void (await requireStaffActor("catalog:read"));
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const perPage = Math.min(100, Math.max(1, Number(params.perPage) || 25));
  const search = params.search || "";
  const category = params.category || "";
  const status = params.status || "";

  const options = {
    page,
    perPage,
    search,
    category,
    status,
  };
  const { products, total } =
    (await getSheetProducts(options)) ?? (await getProducts(options));

  const categories =
    (await getSheetProductCategories()) ?? (await getProductCategories());
  const totalPages = Math.ceil(total / perPage);

  const columns = [
    {
      key: "name",
      header: "Produk",
      className: "w-72",
      render: (product: AdminProduct) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/products/${product.id}`}
            className="font-medium text-supporting-900 hover:text-primary-600 line-clamp-1"
          >
            {product.name}
          </Link>
        </div>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      render: (product: AdminProduct) => (
        <span className="text-xs text-supporting-600 bg-supporting-100 px-2 py-0.5 rounded-md">
          {product.category}
        </span>
      ),
    },
    {
      key: "price",
      header: "Harga",
      className: "w-36",
      render: (product: AdminProduct) => (
        <span className="font-mono font-medium text-supporting-900 text-xs">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(product.price)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "w-36",
      render: (product: AdminProduct) => {
        const statusConfigs: Record<
          AdminProduct["status"],
          { label: string; bg: string; text: string; border: string }
        > = {
          published: {
            label: "✓ Published",
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            border: "border-emerald-200",
          },
          draft: {
            label: "⏳ Draft",
            bg: "bg-amber-50",
            text: "text-amber-700",
            border: "border-amber-200",
          },
          archived: {
            label: "📦 Archived",
            bg: "bg-supporting-100",
            text: "text-supporting-600",
            border: "border-supporting-200",
          },
        };
        const cfg = statusConfigs[product.status] || statusConfigs.published;
        return (
          <span
            className={`px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}
          >
            {cfg.label}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Aksi & Visibilitas",
      className: "w-56",
      render: (product: AdminProduct) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/products/${product.id}`}
            className="px-2.5 py-1 text-xs font-semibold border border-supporting-300 rounded-lg hover:bg-supporting-50 text-supporting-700 transition-colors"
          >
            Edit
          </Link>
          <ProductStatusButton
            productId={product.id}
            currentStatus={product.status}
          />
        </div>
      ),
    },
  ] as import("@/presentation/components/admin/DataTable").Column<AdminProduct>[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <AdminHeader
          title="Products"
          description="Kelola katalog produk, harga, stok, dan SEO"
        />
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-950 px-4 py-2 text-xs font-semibold text-background-100 tracking-tight transition-colors hover:bg-primary-900"
        >
          + Tambah Produk
        </Link>
      </div>

      <ProductsTabs />

      <div className="admin-panel overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-supporting-200 px-5 py-4">
          <form className="flex flex-1 flex-wrap gap-3">
            <input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Cari produk..."
              className="flex-1 min-w-[180px] rounded-lg border border-supporting-200 bg-supporting-50 px-3.5 py-2 text-xs tracking-tight text-supporting-900 placeholder:text-supporting-400 focus:border-primary-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-800 transition-colors"
            />
            <select
              name="category"
              defaultValue={category}
              className="rounded-lg border border-supporting-200 bg-supporting-50 px-3 py-2 text-xs font-semibold tracking-tight text-supporting-800 focus:border-primary-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-800 transition-colors"
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              name="status"
              defaultValue={status}
              className="rounded-lg border border-supporting-200 bg-supporting-50 px-3 py-2 text-xs font-semibold tracking-tight text-supporting-800 focus:border-primary-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-800 transition-colors"
            >
              <option value="">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-supporting-300 px-4 py-2 text-xs font-semibold text-supporting-800 tracking-tight transition-colors hover:bg-supporting-50"
            >
              Filter
            </button>
          </form>
        </div>

        <DataTable
          columns={columns}
          data={products}
          keyAccessor={(p) => p.id}
          emptyMessage="Tidak ada produk ditemukan"
          rowClassName={(p) => (p.status === "archived" ? "opacity-50" : "")}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/admin/products"
          />
        )}
      </div>
    </div>
  );
}
