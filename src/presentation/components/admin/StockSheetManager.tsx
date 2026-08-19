"use client";

import { useCallback, useEffect, useState } from "react";

type StockStatus = "published" | "draft" | "archived";

interface StockProduct {
  sku: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  stock: number;
  status: StockStatus;
  slug: string;
  description: string;
  image: string;
  tags: string;
  updatedAt: string;
}

interface StockMovement {
  time: string;
  sku: string;
  name: string;
  delta: number;
  stockAfter: number;
  type: "CREATED" | "ADJUSTED" | "STATUS" | "DELETED";
  reason: string;
  by: string;
  source: string;
}

interface StockSheetHealth {
  configured: boolean;
  connected: boolean;
  spreadsheetId: string | null;
  productSheetName: string | null;
  movementSheetName: string | null;
  error: string | null;
}

type ModalState =
  | { kind: "create" }
  | { kind: "edit"; product: StockProduct }
  | { kind: "adjust"; product: StockProduct }
  | { kind: "delete"; product: StockProduct }
  | null;

const emptyProductForm = {
  sku: "",
  name: "",
  category: "",
  price: "",
  salePrice: "",
  stock: "0",
  status: "published" as StockStatus,
  description: "",
  image: "",
  tags: "",
};

const statusConfigs: Record<
  StockStatus,
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

const movementTypeLabels: Record<StockMovement["type"], string> = {
  CREATED: "Produk Baru",
  ADJUSTED: "Penyesuaian Stok",
  STATUS: "Ubah Status",
  DELETED: "Dihapus",
};

function formatIdr(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function StockSheetManager() {
  const [products, setProducts] = useState<StockProduct[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [health, setHealth] = useState<StockSheetHealth | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "movements">(
    "products",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/inventory", { cache: "no-store" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Gagal memuat data stok");
      }
      const data = await res.json();
      setProducts(data.products ?? []);
      setHealth(data.health ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat data stok");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMovements = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/inventory/movements", {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setMovements(data.movements ?? []);
      }
    } catch {
      setMovements([]);
    }
  }, []);

  useEffect(() => {
    void loadData();
    void loadMovements();
  }, [loadData, loadMovements]);

  const showNotice = (kind: "success" | "error", text: string) => {
    setNotice({ kind, text });
    window.setTimeout(() => setNotice(null), 5000);
  };

  async function runAction(
    action: () => Promise<Response>,
    successText: string,
    refresh: () => void,
  ) {
    setBusy(true);
    try {
      const res = await action();
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.error || "Operasi gagal");
      }
      showNotice("success", successText);
      refresh();
    } catch (e) {
      showNotice("error", e instanceof Error ? e.message : "Operasi gagal");
    } finally {
      setBusy(false);
    }
  }

  const refreshAll = useCallback(() => {
    void loadData();
    void loadMovements();
  }, [loadData, loadMovements]);

  async function handleCreate(form: typeof emptyProductForm) {
    await runAction(
      () =>
        fetch("/api/admin/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sku: form.sku,
            name: form.name,
            category: form.category,
            price: Number(form.price),
            salePrice: form.salePrice ? Number(form.salePrice) : undefined,
            stock: Number(form.stock),
            status: form.status,
            description: form.description,
            image: form.image,
            tags: form.tags,
          }),
        }),
      "Produk berhasil ditambahkan ke spreadsheet",
      refreshAll,
    );
    if (!notice || notice.kind !== "error") setModal(null);
  }

  async function handleEdit(
    product: StockProduct,
    form: typeof emptyProductForm,
  ) {
    await runAction(
      () =>
        fetch(`/api/admin/inventory/${encodeURIComponent(product.sku)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            category: form.category,
            price: Number(form.price),
            salePrice: form.salePrice ? Number(form.salePrice) : undefined,
            stock: Number(form.stock),
            status: form.status,
            description: form.description,
            image: form.image,
            tags: form.tags,
          }),
        }),
      "Produk berhasil diperbarui di spreadsheet",
      refreshAll,
    );
    if (!notice || notice.kind !== "error") setModal(null);
  }

  async function handleAdjust(
    product: StockProduct,
    delta: number,
    reason: string,
  ) {
    await runAction(
      () =>
        fetch(`/api/admin/inventory/${encodeURIComponent(product.sku)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ delta, reason }),
        }),
      `Stok "${product.name}" berhasil disesuaikan`,
      refreshAll,
    );
    if (!notice || notice.kind !== "error") setModal(null);
  }

  async function handleDelete(product: StockProduct, reason: string) {
    await runAction(
      () =>
        fetch(`/api/admin/inventory/${encodeURIComponent(product.sku)}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason }),
        }),
      `Produk "${product.name}" berhasil dihapus dari spreadsheet`,
      refreshAll,
    );
    if (!notice || notice.kind !== "error") setModal(null);
  }

  const notConfigured = health && !health.configured;

  return (
    <div className="space-y-6">
      {notice && (
        <div
          role="status"
          className={`px-4 py-3 rounded-xl border text-sm font-medium ${
            notice.kind === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {notice.text}
        </div>
      )}

      {notConfigured && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-amber-900">
            Google Sheets belum dikonfigurasi
          </h3>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            Tambahkan kredensial service account di environment agar fitur
            Manage Stocks aktif:
          </p>
          <ul className="text-xs text-amber-800 mt-2 space-y-1 list-disc list-inside">
            <li>
              <code className="font-mono bg-amber-100 px-1 rounded">
                GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON
              </code>{" "}
              — isi dengan JSON service account Google (Sheets API aktif).
            </li>
            <li>
              Bagikan spreadsheet STOCK PENAAMEEN ke{" "}
              <code className="font-mono bg-amber-100 px-1 rounded">
                client_email
              </code>{" "}
              service account (akses Editor).
            </li>
            <li>
              <code className="font-mono bg-amber-100 px-1 rounded">
                GOOGLE_SHEETS_SPREADSHEET_ID
              </code>{" "}
              sudah diatur ke ID spreadsheet default.
            </li>
          </ul>
        </div>
      )}

      {health?.configured && !health.connected && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-red-900">
            Tidak dapat terhubung ke Google Sheets
          </h3>
          <p className="text-xs text-red-800 mt-1">{health.error}</p>
          <p className="text-xs text-red-700 mt-2">
            Pastikan service account sudah dibagikan ke spreadsheet dengan akses
            Editor, lalu coba muat ulang halaman ini.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Manage Stocks — Google Sheets
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {health?.connected
              ? `Terhubung ke spreadsheet (tab: ${health.productSheetName} / ${health.movementSheetName}). Semua perubahan tercatat otomatis di spreadsheet.`
              : "Data produk & stok dikelola langsung melalui spreadsheet Google Sheets."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ kind: "create" })}
          disabled={!health?.configured || busy}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Tambah Produk
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Tab kelola stok"
        className="inline-flex items-center gap-1 p-1 bg-gray-100 border border-gray-200 rounded-xl"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "products"}
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "products"
              ? "bg-white text-primary-700 shadow-sm border border-gray-200"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Produk & Stok
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "movements"}
          onClick={() => setActiveTab("movements")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === "movements"
              ? "bg-white text-primary-700 shadow-sm border border-gray-200"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Mutasi Stok ({movements.length})
        </button>
      </div>

      {activeTab === "products" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-gray-500">
              Memuat data stok dari spreadsheet...
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-600 font-medium">{error}</p>
              <button
                type="button"
                onClick={() => void loadData()}
                className="mt-3 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Muat Ulang
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              {health?.configured
                ? "Belum ada produk di spreadsheet. Klik “+ Tambah Produk” untuk menambahkan produk pertama."
                : "Spreadsheet belum dikonfigurasi."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3 font-semibold">SKU</th>
                    <th className="px-4 py-3 font-semibold">Produk</th>
                    <th className="px-4 py-3 font-semibold">Kategori</th>
                    <th className="px-4 py-3 font-semibold">Harga</th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Stok
                    </th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const cfg = statusConfigs[product.status];
                    const lowStock = product.stock <= 5;
                    return (
                      <tr
                        key={product.sku}
                        className={`border-b border-gray-100 last:border-0 ${
                          product.status === "archived" ? "opacity-50" : ""
                        }`}
                      >
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">
                          {product.sku}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-gray-400 line-clamp-1">
                            {product.slug}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs font-medium text-gray-900">
                          {formatIdr(product.price)}
                          {product.salePrice != null && (
                            <span className="block text-[11px] text-emerald-600">
                              {formatIdr(product.salePrice)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg ${
                              product.stock === 0
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : lowStock
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() =>
                                setModal({ kind: "adjust", product })
                              }
                              disabled={busy}
                              className="px-2.5 py-1 text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors disabled:opacity-50"
                            >
                              +/− Stok
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setModal({ kind: "edit", product })
                              }
                              disabled={busy}
                              className="px-2.5 py-1 text-xs font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setModal({ kind: "delete", product })
                              }
                              disabled={busy}
                              className="px-2.5 py-1 text-xs font-semibold border border-red-200 rounded-lg hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "movements" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {movements.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              Belum ada mutasi stok tercatat.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3 font-semibold">Waktu</th>
                    <th className="px-4 py-3 font-semibold">SKU</th>
                    <th className="px-4 py-3 font-semibold">Produk</th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Delta
                    </th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Stok Setelah
                    </th>
                    <th className="px-4 py-3 font-semibold">Jenis</th>
                    <th className="px-4 py-3 font-semibold">Alasan</th>
                    <th className="px-4 py-3 font-semibold">Oleh</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement, index) => (
                    <tr
                      key={`${movement.time}-${movement.sku}-${index}`}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(movement.time)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">
                        {movement.sku}
                      </td>
                      <td className="px-4 py-3 text-gray-900 line-clamp-1">
                        {movement.name}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`font-mono text-xs font-bold ${
                            movement.delta > 0
                              ? "text-emerald-600"
                              : movement.delta < 0
                                ? "text-red-600"
                                : "text-gray-500"
                          }`}
                        >
                          {movement.delta > 0
                            ? `+${movement.delta}`
                            : movement.delta}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-xs text-gray-700">
                        {movement.stockAfter}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                          {movementTypeLabels[movement.type] ?? movement.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 line-clamp-1 max-w-52">
                        {movement.reason}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 line-clamp-1 max-w-40">
                        {movement.by}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {modal && (
        <StockModal
          modal={modal}
          busy={busy}
          onClose={() => setModal(null)}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onAdjust={handleAdjust}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

interface StockModalProps {
  modal: Exclude<ModalState, null>;
  busy: boolean;
  onClose: () => void;
  onCreate: (form: typeof emptyProductForm) => void;
  onEdit: (product: StockProduct, form: typeof emptyProductForm) => void;
  onAdjust: (product: StockProduct, delta: number, reason: string) => void;
  onDelete: (product: StockProduct, reason: string) => void;
}

function StockModal({
  modal,
  busy,
  onClose,
  onCreate,
  onEdit,
  onAdjust,
  onDelete,
}: StockModalProps) {
  const [form, setForm] = useState(() =>
    modal.kind === "edit"
      ? {
          sku: modal.product.sku,
          name: modal.product.name,
          category: modal.product.category,
          price: String(modal.product.price),
          salePrice:
            modal.product.salePrice != null
              ? String(modal.product.salePrice)
              : "",
          stock: String(modal.product.stock),
          status: modal.product.status,
          description: modal.product.description,
          image: modal.product.image,
          tags: modal.product.tags,
        }
      : emptyProductForm,
  );
  const [delta, setDelta] = useState("1");
  const [reason, setReason] = useState("");

  const updateForm = (field: keyof typeof emptyProductForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = () => {
    if (modal.kind === "create") {
      onCreate(form);
    } else if (modal.kind === "edit") {
      onEdit(modal.product, form);
    } else if (modal.kind === "adjust") {
      onAdjust(modal.product, Number(delta) || 0, reason);
    } else if (modal.kind === "delete") {
      onDelete(modal.product, reason);
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={
        modal.kind === "create"
          ? "Tambah produk baru"
          : modal.kind === "edit"
            ? "Edit produk"
            : modal.kind === "adjust"
              ? "Sesuaikan stok"
              : "Hapus produk"
      }
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">
            {modal.kind === "create"
              ? "Tambah Produk Baru"
              : modal.kind === "edit"
                ? `Edit: ${modal.product.name}`
                : modal.kind === "adjust"
                  ? `Sesuaikan Stok: ${modal.product.name}`
                  : `Hapus: ${modal.product.name}`}
          </h3>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          {(modal.kind === "create" || modal.kind === "edit") && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="stock-sku" className={labelClass}>
                    SKU *
                  </label>
                  <input
                    id="stock-sku"
                    value={form.sku}
                    onChange={(e) => updateForm("sku", e.target.value)}
                    disabled={modal.kind === "edit"}
                    placeholder="mis. ACM-001"
                    className={`${inputClass} ${modal.kind === "edit" ? "bg-gray-100 text-gray-500" : ""}`}
                  />
                </div>
                <div>
                  <label htmlFor="stock-category" className={labelClass}>
                    Kategori *
                  </label>
                  <input
                    id="stock-category"
                    value={form.category}
                    onChange={(e) => updateForm("category", e.target.value)}
                    placeholder="mis. Metode Belajar"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="stock-name" className={labelClass}>
                  Nama Produk *
                </label>
                <input
                  id="stock-name"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="mis. Buku Metode Al-Barqy"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="stock-price" className={labelClass}>
                    Harga (Rp) *
                  </label>
                  <input
                    id="stock-price"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => updateForm("price", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="stock-sale-price" className={labelClass}>
                    Harga Jual (Rp)
                  </label>
                  <input
                    id="stock-sale-price"
                    type="number"
                    min={0}
                    value={form.salePrice}
                    onChange={(e) => updateForm("salePrice", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="stock-qty" className={labelClass}>
                    Stok *
                  </label>
                  <input
                    id="stock-qty"
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => updateForm("stock", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="stock-status" className={labelClass}>
                  Status
                </label>
                <select
                  id="stock-status"
                  value={form.status}
                  onChange={(e) => updateForm("status", e.target.value)}
                  className={inputClass}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label htmlFor="stock-description" className={labelClass}>
                  Deskripsi
                </label>
                <textarea
                  id="stock-description"
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="stock-image" className={labelClass}>
                    URL Gambar
                  </label>
                  <input
                    id="stock-image"
                    value={form.image}
                    onChange={(e) => updateForm("image", e.target.value)}
                    placeholder="/images/..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="stock-tags" className={labelClass}>
                    Tag (pisahkan dengan koma)
                  </label>
                  <input
                    id="stock-tags"
                    value={form.tags}
                    onChange={(e) => updateForm("tags", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          )}

          {(modal.kind === "adjust" || modal.kind === "delete") && (
            <>
              <div className="text-sm text-gray-700">
                Stok saat ini:{" "}
                <span className="font-bold text-gray-900">
                  {modal.product.stock}
                </span>
              </div>
              {modal.kind === "adjust" && (
                <div>
                  <label htmlFor="stock-delta" className={labelClass}>
                    Jumlah perubahan (negatif = pengurangan) *
                  </label>
                  <input
                    id="stock-delta"
                    type="number"
                    value={delta}
                    onChange={(e) => setDelta(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}
              <div>
                <label
                  htmlFor={
                    modal.kind === "adjust"
                      ? "stock-reason"
                      : "stock-delete-reason"
                  }
                  className={labelClass}
                >
                  Alasan *
                </label>
                <textarea
                  id={
                    modal.kind === "adjust"
                      ? "stock-reason"
                      : "stock-delete-reason"
                  }
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="mis. Penambahan stok dari gudang / stok rusak"
                  className={inputClass}
                />
              </div>
              {modal.kind === "delete" && (
                <p className="text-xs text-red-600">
                  Baris produk di spreadsheet akan dikosongkan. Riwayat tetap
                  tercatat di tab Mutasi Stok.
                </p>
              )}
            </>
          )}
        </div>

        <div className="p-5 border-t border-gray-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors disabled:opacity-50 ${
              modal.kind === "delete"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-primary-600 hover:bg-primary-700"
            }`}
          >
            {busy
              ? "Menyimpan..."
              : modal.kind === "delete"
                ? "Ya, Hapus"
                : modal.kind === "adjust"
                  ? "Simpan Penyesuaian"
                  : modal.kind === "create"
                    ? "Tambahkan Produk"
                    : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
