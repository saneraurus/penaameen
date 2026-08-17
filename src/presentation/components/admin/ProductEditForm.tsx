"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { AdminProduct } from "@/lib/admin/products";

interface ProductEditFormProps {
  product: AdminProduct;
  categories: string[];
}

export function ProductEditForm({ product, categories }: ProductEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: product.name,
    slug: product.slug,
    category: product.category,
    price: product.price,
    salePrice: product.salePrice || "",
    stockQuantity: product.stockQuantity ?? 50,
    sku: product.sku || "",
    image: product.image || "/images/penaameen/products/home-learning.jpg",
    status: product.status,
    description: product.description,
    shortDescription: product.shortDescription || "",
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stockQuantity" ? Number(value) : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setToastMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setToastMessage("Perubahan produk berhasil disimpan!");
        router.refresh();
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Gagal menyimpan perubahan produk");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan saat menyimpan produk");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium flex items-center justify-between shadow-xs">
          <span>✓ {toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Product Info Form */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Informasi Utama Produk
            </h2>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Nama Produk *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Slug URL *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  SKU / Kode Produk
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Kategori
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                list="category-options"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
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
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Deskripsi Lengkap Produk
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Deskripsi Ringkas (Cuplikan)
              </label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>
          </section>

          {/* Pricing & Stock */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Harga & Inventaris
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Harga Pokok (IDR) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Harga Coret / Promo (IDR)
                </label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  placeholder="Opsional"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Jumlah Stok
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Status & Media Controls */}
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Status Publikasi
            </h2>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Visibilitas Produk
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              >
                <option value="published">✓ Published (Tampil di Toko)</option>
                <option value="draft">⏳ Draft (Disimpan Belum Tampil)</option>
                <option value="archived">
                  📦 Archived (Diarsipkan / Sembunyi)
                </option>
              </select>
            </div>

            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "Menyimpan..." : "💾 Simpan Perubahan Produk"}
              </button>

              <Link
                href="/admin/products"
                className="w-full py-2.5 text-center text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
              >
                Kembali ke Daftar Produk
              </Link>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Gambar Produk
            </h2>

            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <Image
                src={
                  formData.image ||
                  "/images/penaameen/products/home-learning.jpg"
                }
                alt={formData.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Path / URL Gambar
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
