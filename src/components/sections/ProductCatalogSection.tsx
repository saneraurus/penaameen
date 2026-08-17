"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { products } from "@/data/products";
import { getProductRichDetail } from "@/data/product-rich-details";
import { useCart } from "@/context/CartContext";
import { Reveal } from "@/components/motion/Reveal";

const CATEGORIES = ["Semua", "Al-Barqy", "ACM", "Umum"] as const;
type CategoryType = (typeof CATEGORIES)[number];

export function ProductCatalogSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("Semua");
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const filteredProducts = products.filter((p) => {
    if (activeCategory === "Semua") return true;
    return p.category === activeCategory;
  });

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === "left" ? -340 : 340;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

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
      // Fallback
    }
  };

  return (
    <section className="py-16 md:py-24 bg-background-100/70 border-b border-supporting-200/80 relative">
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-xs font-bold uppercase tracking-widest text-primary-700 bg-primary-100/90 px-3.5 py-1 rounded-full border border-primary-200/70">
                  KATALOG PERANGKAT BELAJAR
                </span>
                <span className="text-xs text-supporting-500 font-medium hidden sm:inline">
                  • 19 Produk Orisinal
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary-950 leading-tight">
                Perangkat Belajar yang Dirancang untuk Digunakan.
              </h2>
              <p className="text-sm sm:text-base text-supporting-600 mt-2 leading-relaxed">
                Semua produk kami dirancang ramah anak, nyaman dipegang, tahan lama, dan memberikan pengalaman belajar yang menyenangkan.
              </p>
            </div>

            {/* Controls & Filter Tabs */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-supporting-200 shadow-2xs">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  const count = cat === "Semua" ? products.length : products.filter((p) => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? "bg-primary-950 text-white shadow-xs"
                          : "text-supporting-600 hover:text-primary-900 hover:bg-supporting-50"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isActive ? "bg-white/20 text-white" : "bg-supporting-100 text-supporting-500"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Slider Arrows */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleScroll("left")}
                  aria-label="Gulir ke kiri"
                  className="w-9 h-9 rounded-xl bg-white border border-supporting-200 text-supporting-700 hover:bg-supporting-50 hover:text-primary-950 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors cursor-pointer"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll("right")}
                  aria-label="Gulir ke kanan"
                  className="w-9 h-9 rounded-xl bg-white border border-supporting-200 text-supporting-700 hover:bg-supporting-50 hover:text-primary-950 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors cursor-pointer"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Horizontal Product Cards Carousel */}
        <Reveal delay={0.1}>
          <div
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto pb-5 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
          >
            {filteredProducts.map((product) => {
              const rich = getProductRichDetail(product.slug);
              const isAdded = addedIds[product.id];
              const isFlagship = product.slug.includes("home-learning") || product.slug.includes("200-menit");

              return (
                <div
                  key={product.id}
                  className="group flex-shrink-0 w-[290px] sm:w-[320px] snap-start bg-white rounded-3xl overflow-hidden border border-supporting-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Media Container */}
                    <Link
                      href={`/produk/${product.slug}`}
                      className="relative aspect-[4/3] bg-supporting-100 overflow-hidden block"
                    >
                      <Image
                        src={`${product.image}?v=20260817b`}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover w-full h-full group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                        <span className="px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-md text-primary-900 text-[10px] font-bold uppercase tracking-wider border border-white/80 shadow-2xs">
                          {product.category}
                        </span>
                        {isFlagship && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-2xs">
                            ★ Paling Diminati
                          </span>
                        )}
                      </div>

                      {/* Hover Quick View Pill */}
                      <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[11px] font-bold bg-primary-950/90 text-white px-3 py-1 rounded-full backdrop-blur-md shadow-md">
                          Lihat Detail →
                        </span>
                      </div>
                    </Link>

                    {/* Card Content Body */}
                    <div className="p-5">
                      <div className="flex items-center gap-1 text-amber-500 text-xs mb-1.5">
                        <span>★★★★★</span>
                        <span className="text-supporting-500 text-[11px] font-medium ml-1">
                          ({rich?.reviewCount ?? 1200}+ ulasan)
                        </span>
                      </div>

                      <Link href={`/produk/${product.slug}`}>
                        <h3 className="text-base font-serif font-bold text-primary-950 group-hover:text-primary-700 transition-colors line-clamp-1 mb-1.5">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-supporting-600 line-clamp-2 leading-relaxed mb-4">
                        {rich?.subtitle ?? product.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Price & Action Footer */}
                  <div className="p-5 pt-0">
                    <div className="p-3 rounded-2xl bg-supporting-50 border border-supporting-200/80 mb-3">
                      <div className="flex items-baseline justify-between gap-1">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-supporting-400 font-bold block">
                            Harga Resmi
                          </span>
                          <span className="text-base sm:text-lg font-bold font-serif text-emerald-700">
                            {product.price > 0 ? `Rp${product.price.toLocaleString("id-ID")}` : "Unduh Gratis"}
                          </span>
                        </div>
                        {rich?.originalPrice && (
                          <div className="text-right">
                            <span className="text-[11px] text-supporting-400 line-through block">
                              Rp{rich.originalPrice.toLocaleString("id-ID")}
                            </span>
                            {rich.savings && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                                Hemat {Math.round((rich.savings / rich.originalPrice) * 100)}%
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product.id)}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 ${
                          isAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-primary-50 hover:bg-primary-100 text-primary-800 border border-primary-200"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <span>✓</span>
                            <span>Ditambah!</span>
                          </>
                        ) : (
                          <>
                            <span>+</span>
                            <span>Keranjang</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`/produk/${product.slug}`}
                        className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-primary-950 hover:bg-primary-900 text-white text-center flex items-center justify-center gap-1 shadow-2xs transition-all"
                      >
                        <span>Beli</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Bottom Explorer Banner & Trust Badges */}
        <Reveal delay={0.2}>
          <div className="mt-8 pt-6 border-t border-supporting-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-supporting-600">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> 100% Produk Orisinal Bersegel
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Garansi Penggantian Cacat Kirim
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Kirim Cepat ke Seluruh Indonesia
              </span>
            </div>

            <Link
              href="/produk"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-supporting-50 text-primary-950 font-bold text-xs sm:text-sm border border-supporting-300 shadow-2xs transition-all hover:border-primary-600"
            >
              <span>Jelajahi Seluruh 19 Katalog Produk</span>
              <span>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
