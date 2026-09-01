"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductCreateFormProps {
  categories: string[];
}

export function ProductCreateForm({ categories }: ProductCreateFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: categories[0] || "Al-Barqy",
    price: "",
    salePrice: "",
    stockQuantity: "50",
    sku: "",
    image: "/images/penaameen/products/home-learning.jpg",
    status: "published" as "published" | "draft" | "archived",
    description: "",
    shortDescription: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setFormData((prev) => ({
      ...prev,
      name,
      slug:
        prev.slug === "" ||
        prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
          ? generatedSlug
          : prev.slug,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setErrorMessage("Nama produk dan harga wajib diisi");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          salePrice: formData.salePrice
            ? Number(formData.salePrice)
            : undefined,
          stockQuantity: Number(formData.stockQuantity) || 0,
        }),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Gagal menambahkan produk");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan saat menambahkan produk");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-panel p-6 md:p-8 space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-medium flex items-center justify-between shadow-xs">
          <span>⚠️ {errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-700 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
            Nama Produk *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="cth: Paket Buku Belajar Membaca Cepat"
            required
            className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
            Slug URL *
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="paket-buku-belajar-membaca-cepat"
            required
            className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
            SKU / Kode Produk
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="cth: PA-0020"
            className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
            Kategori *
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            list="category-options"
            required
            className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
          <datalist id="category-options">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
            <option value="Metode Al-Barqy" />
            <option value="Metode ACM" />
            <option value="Buku Aktivitas" />
            <option value="Flashcard" />
          </datalist>
        </div>

        <div>
          <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
            Status Publikasi *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          >
            <option value="published">
              ✓ Published (Langsung Tampil di Toko)
            </option>
            <option value="draft">⏳ Draft (Disimpan Belum Tampil)</option>
            <option value="archived">📦 Archived (Diarsipkan)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
            Harga Produk (IDR) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="cth: 125000"
            required
            className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
            Jumlah Stok Awal
          </label>
          <input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            placeholder="50"
            className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
            Path / URL Gambar Produk
          </label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="/images/penaameen/products/home-learning.jpg"
            className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
            Deskripsi Ringkas (Cuplikan)
          </label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            rows={2}
            placeholder="Ringkasan singkat produk untuk kartu katalog..."
            className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-supporting-700 uppercase tracking-wider mb-1.5">
            Deskripsi Lengkap Produk
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Rincian lengkap isi buku, metodologi pembelajaran, dan keunggulan produk..."
            className="w-full px-4 py-2.5 bg-supporting-50 border border-supporting-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-supporting-100 flex items-center justify-end gap-3">
        <Link
          href="/admin/products"
          className="px-5 py-2.5 border border-supporting-300 text-supporting-700 text-xs font-semibold rounded-xl hover:bg-supporting-50 transition-colors"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isSaving ? "Menyimpan..." : "✓ Terbitkan & Simpan Produk"}
        </button>
      </div>
    </form>
  );
}
