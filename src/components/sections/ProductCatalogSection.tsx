"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { products } from "@/data/products";
import { getProductRichDetail } from "@/data/product-rich-details";
import { useCart } from "@/context/CartContext";
import { Reveal } from "@/components/motion/Reveal";

const CATEGORIES = ["Semua", "Al-Barqy", "ACM", "Umum"] as const;
type CategoryType = (typeof CATEGORIES)[number];

export function ProductCatalogSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("Semua");
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const { addToCart } = useCart();

  const filteredProducts = products.filter((p) => {
    if (activeCategory === "Semua") return true;
    return p.category === activeCategory;
  });

  const handleQuickAdd = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(productId, 1);
      setAddedIds((prev) => ({ ...prev, [productId]: true }));
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [productId]: false }));
      }, 2000);
    } catch {
      // silent
    }
  };

  return (
    <section className="border-t border-supporting-200 bg-background-50 py-16 sm:py-20">
      <div className="container max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-xl">
            <p className="scene-index">Katalog — 19 Produk Orisinal</p>
            <h2 className="display-type mt-4 text-supporting-900">
              Perangkat belajar yang dirancang untuk digunakan.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-supporting-600 sm:text-base">
              Koleksi buku panduan, flashcard hijaiyah, poster peraga dinding,
              dan modul belajar resmi dari Penerbit Pena Ameen.
            </p>
          </div>

          <nav
            aria-label="Filter kategori produk"
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative py-2 text-sm transition-colors ${
                    isActive
                      ? "text-supporting-900"
                      : "text-supporting-500 hover:text-supporting-900"
                  }`}
                >
                  {cat}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-px origin-left bg-accent-600 transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => {
            const rich = getProductRichDetail(product.slug);
            const isAdded = addedIds[product.id];

            return (
              <Reveal key={product.id} delay={(index % 3) * 0.05}>
                <article className="group flex h-full flex-col">
                  <Link
                    href={`/produk/${product.slug}`}
                    className="image-frame image-frame-zoom block aspect-[4/5] w-full"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </Link>

                  <div className="mt-4 flex flex-1 flex-col">
                    <p className="meta-type text-[11px]">
                      {product.category}
                      {rich?.reviewCount
                        ? ` · ${rich.reviewCount}+ ulasan`
                        : ""}
                    </p>
                    <h3 className="mt-2 text-[15px] font-medium leading-snug text-supporting-900">
                      <Link
                        href={`/produk/${product.slug}`}
                        className="transition-colors group-hover:text-accent-700"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-supporting-600">
                      {rich?.subtitle ?? product.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-supporting-200 pt-4">
                      <p className="font-serif text-[15px] text-supporting-900">
                        {product.price > 0
                          ? `Rp${product.price.toLocaleString("id-ID")}`
                          : "Unduh Gratis"}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product.id)}
                        aria-label={`Tambah ${product.name} ke keranjang`}
                        className={`text-xs font-medium underline-offset-4 transition-colors ${
                          isAdded
                            ? "text-primary-700"
                            : "text-supporting-600 hover:text-primary-800 hover:underline"
                        }`}
                      >
                        {isAdded ? "Ditambah ✓" : "+ Keranjang"}
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-supporting-200 pt-8 sm:flex-row sm:items-center">
          <p className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-supporting-600">
            <span>100% Produk Orisinal</span>
            <span aria-hidden="true" className="text-supporting-300">
              ·
            </span>
            <span>Garansi Penggantian Cacat Kirim</span>
            <span aria-hidden="true" className="text-supporting-300">
              ·
            </span>
            <span>Kirim Cepat Seluruh Indonesia</span>
          </p>

          <Link
            href="/produk"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-900 transition-colors hover:text-accent-700"
          >
            <span className="border-b border-current pb-0.5">
              Lihat 19 Katalog Produk
            </span>
            <span aria-hidden="true" className="transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
