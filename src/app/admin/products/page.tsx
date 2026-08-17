import { AdminHeader } from "@/presentation/components/admin/AdminHeader";
import { DataTable, Pagination } from "@/presentation/components/admin/DataTable";
import Link from "next/link";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getProducts, getProductCategories, type AdminProduct } from "@/lib/admin/products";

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

  const { products, total } = await getProducts({
    page,
    perPage,
    search,
    category,
    status,
  });

  const categories = await getProductCategories();
  const totalPages = Math.ceil(total / perPage);

  const columns = [
    {
      key: "name",
      header: "Product",
      className: "w-64",
      render: (product: AdminProduct) => (
        <Link
          href={`/admin/products/${product.id}`}
          className="font-medium text-gray-900 hover:text-primary-600"
        >
          {product.name}
        </Link>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (product: AdminProduct) => product.category,
    },
    {
      key: "price",
      header: "Price",
      className: "w-48",
      render: (product: AdminProduct) => (
        <span className="font-mono text-gray-900">
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
      className: "w-40",
      render: (product: AdminProduct) => {
        const statusColors = {
          published: "bg-green-100 text-green-700",
          draft: "bg-yellow-100 text-yellow-700",
          archived: "bg-gray-100 text-gray-700",
        };
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              statusColors[product.status] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {product.status}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-48",
      render: (product: AdminProduct) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/products/${product.id}`}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Edit
          </Link>
          {product.status !== "archived" && (
            <button
              className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Archive
            </button>
          )}
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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4">
          <form className="flex gap-4 flex-1">
            <input
              type="search"
              name="search"
              value={search}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              name="category"
              value={category}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              name="status"
              value={status}
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
            onPageChange={(newPage) => {
              const params = new URLSearchParams(window.location.search);
              params.set("page", String(newPage));
              window.location.search = params.toString();
            }}
            showPerPage
            perPage={perPage}
            onPerPageChange={(newPerPage) => {
              const params = new URLSearchParams(window.location.search);
              params.set("perPage", String(newPerPage));
              params.set("page", "1");
              window.location.search = params.toString();
            }}
          />
        )}
      </div>
    </div>
  );
}