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
            className="font-medium text-gray-900 hover:text-primary-600 line-clamp-1"
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
        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
          {product.category}
        </span>
      ),
    },
    {
      key: "price",
      header: "Harga",
      className: "w-36",
      render: (product: AdminProduct) => (
        <span className="font-mono font-medium text-gray-900 text-xs">
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
            bg: "bg-gray-100",
            text: "text-gray-600",
            border: "border-gray-200",
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
            className="px-2.5 py-1 text-xs font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
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
      <div className="flex items-center justify-between gap-4">
        <AdminHeader
          title="Products"
          description="Manage product catalog, pricing, inventory, and SEO"
        />
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Add Product
        </Link>
      </div>

      <ProductsTabs />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4">
          <form className="flex gap-4 flex-1">
            <input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              name="category"
              defaultValue={category}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              name="status"
              defaultValue={status}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Filter
            </button>
          </form>
        </div>

        <DataTable
          columns={columns}
          data={products}
          keyAccessor={(p) => p.id}
          emptyMessage="No products found"
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
