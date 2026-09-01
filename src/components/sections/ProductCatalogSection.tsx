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

  // compact: only 6 hero products on homepage
  const displayProducts = filteredProducts.slice(0, 6);

  return (
    <section className="relative overflow-hidden border-t border-supporting-200 bg-white py-8 sm:py-12 lg:py-14">
      {/* subtle geometric + blur — premium but compact */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(27,58,42,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(27,58,42,0.9) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute -top-24 right-0 h-[320px] w-[520px] rounded-full bg-accent-100/50 blur-[48px] opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-0 h-[280px] w-[420px] rounded-full bg-primary-50/70 blur-[40px] opacity-60"
        aria-hidden="true"
      />

      <div className="container relative max-w-6xl">
        {/* compact header */}
        <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
          <div className="max-w-[560px]">
            <p className="scene-index text-[10px] sm:text-[11px]">
              Katalog — {products.length} Produk Orisinal
            </p>
            <h2 className="display-type mt-2 text-[clamp(1.4rem,3vw,2.05rem)] leading-[1.05] text-supporting-900 sm:mt-3">
              Perangkat belajar yang dirancang untuk digunakan.
            </h2>
            <p className="mt-2 max-w-[48ch] text-xs leading-relaxed text-supporting-600 sm:mt-3 sm:text-[13px]">
              Kurasi 6 pilihan terpopuler — buku panduan, flashcard &amp; poster
              resmi. Jelajahi katalog lengkap untuk koleksi penuh.
            </p>
          </div>

          <nav
            aria-label="Filter kategori produk"
            className="flex flex-wrap gap-1 rounded-full border border-supporting-200 bg-supporting-50 p-0.5 sm:p-1"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all sm:px-3.5 sm:py-1.5 sm:text-xs ${
                    isActive
                      ? "bg-primary-900 text-white shadow-sm"
                      : "text-supporting-600 hover:bg-white hover:text-supporting-900"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 2-column compact grid on mobile + 3-col on desktop */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-4 lg:grid-cols-3">
          {displayProducts.map((product, index) => {
            const rich = getProductRichDetail(product.slug);
            const isAdded = addedIds[product.id];

            return (
              <Reveal key={product.id} delay={(index % 3) * 0.04}>
                <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-supporting-200 bg-background-50/50 transition-all hover:border-supporting-300 hover:bg-white hover:shadow-[0_8px_24px_-14px_rgba(24,23,18,0.16)]">
                  <Link
                    href={`/produk/${product.slug}`}
                    className="image-frame image-frame-zoom block aspect-[4/3] w-full"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col p-2.5 sm:p-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-accent-700 sm:text-[10px] sm:tracking-[0.12em]">
                      {product.category}
                      {rich?.reviewCount
                        ? ` · ${rich.reviewCount}+ ulasan`
                        : ""}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-supporting-900 sm:mt-1.5 sm:text-[13.5px] sm:font-medium">
                      <Link
                        href={`/produk/${product.slug}`}
                        className="transition-colors group-hover:text-accent-700"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 hidden line-clamp-2 text-[11px] leading-relaxed text-supporting-600 sm:block sm:text-[12px]">
                      {rich?.subtitle ?? product.description}
                    </p>

                    <div className="mt-2.5 flex flex-col items-start justify-between gap-1.5 border-t border-supporting-100 pt-2 sm:mt-3 sm:flex-row sm:items-center sm:gap-0 sm:pt-3">
                      <p className="font-serif text-[12px] font-semibold text-supporting-900 sm:text-[14px] sm:font-medium">
                        {product.price > 0
                          ? `Rp${product.price.toLocaleString("id-ID")}`
                          : "Unduh Gratis"}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product.id)}
                        aria-label={`Tambah ${product.name} ke keranjang`}
                        className={`w-full rounded-full py-1 text-[10px] font-medium transition-colors sm:w-auto sm:px-3 sm:text-[11px] ${
                          isAdded
                            ? "bg-primary-900 text-white"
                            : "bg-white text-supporting-700 ring-1 ring-supporting-200 hover:bg-primary-900 hover:text-white hover:ring-primary-900"
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

        {filteredProducts.length > 6 && (
          <p className="mt-3 text-center text-[10px] tracking-[0.06em] text-supporting-400 sm:mt-4 sm:text-[11px] sm:tracking-[0.08em]">
            Menampilkan 6 dari {filteredProducts.length} produk • filter &quot;
            {activeCategory}&quot;
          </p>
        )}

        <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-supporting-100 pt-4 sm:mt-8 sm:flex-row sm:gap-4 sm:pt-6">
          <p className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] text-supporting-500 sm:justify-start sm:gap-x-4 sm:text-[11px]">
            <span className="inline-flex items-center gap-1 sm:gap-1.5">
              <span className="h-1 w-1 rounded-full bg-primary-500" />
              100% Orisinal
            </span>
            <span
              aria-hidden="true"
              className="hidden text-supporting-300 sm:inline"
            >
              ·
            </span>
            <span>Garansi Cacat Kirim</span>
            <span
              aria-hidden="true"
              className="hidden text-supporting-300 sm:inline"
            >
              ·
            </span>
            <span>Kirim Se-Indonesia</span>
          </p>

          <Link
            href="/produk"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-primary-800 hover:-translate-y-0.5 sm:px-5 sm:py-2.5"
          >
            Lihat {products.length} Katalog Lengkap
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
