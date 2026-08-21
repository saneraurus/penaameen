"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { getProductRichDetail } from "@/data/product-rich-details";
import { products } from "@/data/products";
import { testimonials } from "@/data/testimonials";

interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "isi" | "keunggulan" | "spesifikasi" | "panduan" | "faq"
  >("isi");
  const [addedToast, setAddedToast] = useState(false);

  const { addToCart } = useCart();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const richDetail = slug ? getProductRichDetail(slug) : null;

  useEffect(() => {
    if (!slug) return;
    let active = true;
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`).then((r) => r.json());
        if (!active) return;
        if (res.error) {
          // Fallback to static data
          const fallback = products.find((p) => p.slug === slug);
          if (fallback) {
            setProduct({ ...fallback, stock: 0 });
          } else {
            setError(res.error);
          }
          return;
        }
        setProduct(res.product);
      } catch {
        const fallback = products.find((p) => p.slug === slug);
        if (fallback) {
          setProduct({ ...fallback, stock: 0 });
        } else {
          if (active) setError("Gagal memuat detail produk");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }
    fetchProduct();
    return () => {
      active = false;
    };
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isSignedIn) {
      router.push(
        "/sign-in?redirect_url=" + encodeURIComponent(window.location.pathname),
      );
      return;
    }
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 3000);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Gagal menambahkan produk ke keranjang",
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (!isSignedIn) {
      router.push(
        "/sign-in?redirect_url=" + encodeURIComponent(window.location.pathname),
      );
      return;
    }
    setIsBuyingNow(true);
    try {
      await addToCart(product.id, quantity);
      router.push("/checkout/address");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal memproses pesanan");
      setIsBuyingNow(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
          <p className="text-sm font-medium text-supporting-600">
            Memuat rincian produk...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl p-8 border border-supporting-200 shadow-md max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ⚠️
          </div>
          <h1 className="text-2xl font-serif font-bold text-primary-950 mb-2">
            Produk Tidak Ditemukan
          </h1>
          <p className="text-sm text-supporting-600 mb-6">
            Mohon maaf, produk yang Anda cari tidak tersedia atau tautan telah
            kedaluwarsa.
          </p>
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-colors shadow-xs"
          >
            <span>← Kembali ke Katalog Produk</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const relatedProducts = products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 3);
  const relevantReviews = testimonials
    .filter((t) => t.rating === 5)
    .slice(0, 3);

  // SEO JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: `https://penaameen.com${product.image}`,
    description: richDetail?.subtitle || product.description,
    sku: `PA-${product.id.padStart(4, "0")}`,
    brand: {
      "@type": "Brand",
      name: "Penerbit Pena Ameen",
    },
    offers: {
      "@type": "Offer",
      url: `https://penaameen.com/produk/${product.slug}`,
      priceCurrency: "IDR",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: isOutOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Penerbit Pena Ameen",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: richDetail?.rating ?? 4.9,
      reviewCount: richDetail?.reviewCount ?? 1200,
    },
  };

  return (
    <div className="min-h-screen bg-background-50 text-supporting-900 pb-20">
      {/* JSON-LD Script for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs Header */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-20 border-b border-supporting-200/80 shadow-2xs">
        <div className="container px-4 mx-auto py-3.5">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-between gap-4"
          >
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-supporting-500 list-none p-0 m-0">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary-700 transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/produk"
                  className="hover:text-primary-700 transition-colors"
                >
                  Produk
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span className="text-supporting-400">{product.category}</span>
              </li>
              <li aria-hidden="true">/</li>
              <li
                className="font-semibold text-primary-900 max-w-[200px] truncate"
                aria-current="page"
              >
                {product.name}
              </li>
            </ol>

            <Link
              href="/produk"
              className="text-xs font-semibold text-primary-700 hover:text-primary-800 flex items-center gap-1"
            >
              <span>← Katalog Lengkap</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Floating Added-to-Cart Toast */}
      {addedToast && (
        <div className="fixed top-16 right-4 z-50 bg-primary-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
            ✓
          </span>
          <div>
            <p className="text-xs font-bold text-white">
              Berhasil Ditambahkan ke Keranjang!
            </p>
            <p className="text-[11px] text-emerald-300">
              {quantity}x {product.name}
            </p>
          </div>
          <Link
            href="/checkout/address"
            className="ml-2 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Checkout →
          </Link>
        </div>
      )}

      <main className="py-8 md:py-12">
        <div className="container px-4 mx-auto">
          {/* Main Product Presentation Grid */}
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-start mb-16">
            {/* Left Column: Product Photography & Guarantee Badges */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-white group">
                <Image
                  src={`${product.image}?v=20260817b`}
                  alt={`${product.name} - Penerbit Pena Ameen`}
                  fill
                  priority
                  unoptimized
                  className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                />

                {/* Floating Top Left Badge */}
                <div className="absolute top-4 left-4 bg-primary-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-md">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span>{richDetail?.badge ?? "✨ Produk Orisinal"}</span>
                  </span>
                </div>

                {/* Floating Bottom Left Stock Badge */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-supporting-200/80 shadow-md">
                  {isOutOfStock ? (
                    <span className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Stok Sedang Habis
                    </span>
                  ) : isLowStock ? (
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      Sisa {product.stock} Unit Terakhir
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Ready Stock • Siap Kirim
                    </span>
                  )}
                </div>
              </div>

              {/* 4 Trust & Guarantee Ribbons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {[
                  { icon: "🛡️", title: "100% Orisinal", sub: "Penerbit Resmi" },
                  {
                    icon: "⚡",
                    title: "Garansi Retur",
                    sub: "Jika Cacat Kirim",
                  },
                  {
                    icon: "🚚",
                    title: "Kirim Nasional",
                    sub: "JNE, POS, TIKI",
                  },
                  { icon: "🔒", title: "Bayar Aman", sub: "Midtrans & QRIS" },
                ].map((badge, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white border border-supporting-200/80 shadow-2xs text-center flex flex-col items-center justify-center"
                  >
                    <span className="text-xl mb-1">{badge.icon}</span>
                    <span className="text-xs font-bold text-primary-950 leading-tight">
                      {badge.title}
                    </span>
                    <span className="text-[10px] text-supporting-500">
                      {badge.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Pricing, Value Proposition, Action CTAs */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Category & Rating Pill */}
                <div className="flex flex-wrap items-center gap-2.5 mb-3">
                  <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider border border-primary-200">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                    <span>★</span>
                    <span>{richDetail?.rating ?? 4.9}</span>
                    <span className="text-amber-600 font-normal">
                      ({richDetail?.reviewCount ?? 3200}+ Ulasan)
                    </span>
                  </div>
                  <span className="text-xs text-supporting-400">•</span>
                  <span className="text-xs font-semibold text-emerald-700">
                    100% Pembeli Puas
                  </span>
                </div>

                {/* Product Title & Subtitle */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary-950 leading-tight mb-3">
                  {product.name}
                </h1>
                <p className="text-sm sm:text-base text-supporting-600 leading-relaxed mb-6">
                  {richDetail?.subtitle ?? product.description}
                </p>

                {/* Price Box with Savings */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white shadow-lg border border-primary-800 mb-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block mb-1">
                        Harga Spesial Promo Resmi
                      </span>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl sm:text-4xl font-bold font-serif text-amber-300">
                          Rp{product.price.toLocaleString("id-ID")}
                        </span>
                        {richDetail?.originalPrice && (
                          <span className="text-sm text-white/60 line-through">
                            Rp{richDetail.originalPrice.toLocaleString("id-ID")}
                          </span>
                        )}
                      </div>
                    </div>

                    {richDetail?.savings && (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                        Hemat Rp{richDetail.savings.toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-white/80 border-t border-white/10 pt-3 mt-2 flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>
                      Termasuk garansi produk 100% orisinal + bonus konsultasi
                      metode
                    </span>
                  </p>
                </div>

                {/* Key Benefits Bullet Points */}
                <div className="space-y-2 mb-6">
                  {(
                    richDetail?.keyBenefits.slice(0, 3) ?? [
                      {
                        title: "Metode Anti-Lupa 200 Menit",
                        description:
                          "Terbukti mengantarkan ribuan pembelajar lancar membaca.",
                      },
                      {
                        title: "Lengkap & Praktis",
                        description:
                          "Buku, kartu, poster dalam satu paket praktis.",
                      },
                      {
                        title: "Kualitas Standar Premium",
                        description: "Kertas tebal tahan lama ramah anak.",
                      },
                    ]
                  ).map((ben, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        ✓
                      </span>
                      <p className="text-supporting-700 leading-snug">
                        <strong className="font-semibold text-primary-950">
                          {ben.title}:
                        </strong>{" "}
                        {ben.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Quantity & CTA Buttons Section */}
                <div className="p-5 rounded-2xl bg-white border border-supporting-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-bold text-supporting-700 uppercase tracking-wider">
                      Jumlah Pesanan
                    </span>
                    <div className="flex items-center border border-supporting-200 rounded-xl overflow-hidden bg-supporting-50">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1 || isOutOfStock}
                        className="px-3.5 py-1.5 text-sm font-bold text-supporting-700 hover:bg-white transition-colors disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="px-4 py-1.5 text-sm font-bold text-primary-950 bg-white min-w-[40px] text-center border-x border-supporting-200">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((q) => Math.min(product.stock, q + 1))
                        }
                        disabled={quantity >= product.stock || isOutOfStock}
                        className="px-3.5 py-1.5 text-sm font-bold text-supporting-700 hover:bg-white transition-colors disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={isOutOfStock || isAdding}
                      className="w-full py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm bg-primary-50 text-primary-800 hover:bg-primary-100 border border-primary-300 shadow-2xs transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isAdding ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-primary-700 border-t-transparent animate-spin" />
                          <span>Menambahkan...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 text-primary-700"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                          <span>+ Tambah Keranjang</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleBuyNow}
                      disabled={isOutOfStock || isBuyingNow}
                      className="w-full py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-600 text-white shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isBuyingNow ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Menyiapkan...</span>
                        </>
                      ) : (
                        <>
                          <span>Beli Sekarang (Checkout)</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="pt-2 text-center">
                    <Link
                      href="/kontak"
                      className="text-xs text-supporting-500 hover:text-primary-700 inline-flex items-center gap-1 font-medium"
                    >
                      <span>💬 Butuh bantuan atau pemesanan jumlah besar?</span>
                      <span className="font-semibold underline">
                        Hubungi CS Pena Ameen
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* Detailed Content Tabs Section */}
          {/* ============================================================ */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-supporting-200 shadow-sm mb-16">
            {/* Tab Navigation Buttons */}
            <div className="flex flex-wrap gap-2 border-b border-supporting-200 pb-4 mb-8">
              {[
                {
                  id: "isi",
                  label: "📦 Kelengkapan Isi Paket",
                  count: richDetail?.boxContents.length,
                },
                {
                  id: "keunggulan",
                  label: "⚡ Keunggulan Metode",
                  count: richDetail?.keyBenefits.length,
                },
                { id: "spesifikasi", label: "📋 Spesifikasi Produk" },
                { id: "panduan", label: "🗺️ Panduan 4 Tahap Belajar" },
                {
                  id: "faq",
                  label: "❓ Tanya Jawab (FAQ)",
                  count: richDetail?.faqs.length,
                },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        tab.id as
                          | "isi"
                          | "keunggulan"
                          | "spesifikasi"
                          | "panduan"
                          | "faq",
                      )
                    }
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-primary-950 text-white shadow-xs"
                        : "bg-supporting-50 text-supporting-600 hover:bg-supporting-100 hover:text-supporting-900"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] rounded-md ${isActive ? "bg-white/20 text-white" : "bg-supporting-200 text-supporting-700"}`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Kelengkapan Isi Paket Box */}
            {activeTab === "isi" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-primary-950 mb-2">
                    Kelengkapan Isi Paket {product.name}
                  </h3>
                  <p className="text-sm text-supporting-600">
                    Setiap paket dikemas secara rapi dan eksklusif dengan 5 item
                    pembelajaran terlengkap:
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {(
                    richDetail?.boxContents ?? [
                      {
                        icon: "📖",
                        name: "Buku Utama Al-Barqy",
                        description:
                          "Panduan lengkap membaca Al-Qur'an bertahap.",
                      },
                      {
                        icon: "🗂️",
                        name: "Flashcard Hijaiyah",
                        description:
                          "Kartu tebal 2 sisi untuk stimulasi daya ingat visual.",
                      },
                    ]
                  ).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-supporting-50/70 border border-supporting-200 flex items-start gap-3.5 hover:bg-supporting-50 transition-colors"
                    >
                      <span className="text-2xl p-2 rounded-xl bg-white border border-supporting-200/80 shadow-2xs flex-shrink-0">
                        {item.icon}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-primary-950 mb-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-supporting-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Keunggulan Metode */}
            {activeTab === "keunggulan" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-primary-950 mb-2">
                    Keunggulan Metode Pembelajaran
                  </h3>
                  <p className="text-sm text-supporting-600">
                    Mengapa ribuan keluarga dan ratusan TPQ memilih metode resmi
                    dari Penerbit Pena Ameen:
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {(
                    richDetail?.keyBenefits ?? [
                      {
                        title: "Metode Cepat 200 Menit",
                        description:
                          "Kurikulum teruji untuk mempercepat penguasaan baca Al-Qur'an.",
                      },
                    ]
                  ).map((ben, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-primary-50/50 border border-primary-200/80 flex items-start gap-3.5"
                    >
                      <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        ✓
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-primary-900 mb-1">
                          {ben.title}
                        </h4>
                        <p className="text-xs text-supporting-600 leading-relaxed">
                          {ben.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Spesifikasi Produk */}
            {activeTab === "spesifikasi" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-primary-950 mb-2">
                    Spesifikasi Teknis &amp; Detail Penerbitan
                  </h3>
                  <p className="text-sm text-supporting-600">
                    Informasi lengkap mengenai penerbitan dan kualitas fisik
                    buku:
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 max-w-3xl">
                  {[
                    { label: "Judul Produk", value: product.name },
                    { label: "Kategori", value: product.category },
                    {
                      label: "Penulis",
                      value: richDetail?.author ?? "KH. Nursyamsu Muhadi",
                    },
                    {
                      label: "Penerbit",
                      value: richDetail?.publisher ?? "Penerbit Pena Ameen",
                    },
                    {
                      label: "Berat Paket",
                      value: richDetail?.weight ?? "1.800 gram (1.8 kg)",
                    },
                    {
                      label: "Dimensi Kemasan",
                      value: richDetail?.dimensions ?? "32 cm x 24 cm x 6 cm",
                    },
                    {
                      label: "Bahasa",
                      value: richDetail?.language ?? "Arab & Bahasa Indonesia",
                    },
                    {
                      label: "Sasaran Pengguna",
                      value: richDetail?.targetAge ?? "Anak-anak & Pemula",
                    },
                    {
                      label: "ISBN / Seri",
                      value: richDetail?.isbn ?? "978-602-8920-11-4",
                    },
                    { label: "Kondisi", value: "100% Baru & Segel Orisinal" },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-supporting-50/80 border border-supporting-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="text-supporting-500 font-medium">
                        {row.label}
                      </span>
                      <span className="font-bold text-primary-950 text-right">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Panduan 4 Tahap Belajar */}
            {activeTab === "panduan" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-primary-950 mb-2">
                    Peta Panduan 4 Tahap Belajar di Rumah
                  </h3>
                  <p className="text-sm text-supporting-600">
                    Cukup 15–20 menit sehari mengikuti 4 tahapan sistematis
                    berikut:
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {(
                    richDetail?.learningSteps ?? [
                      {
                        step: "Tahap 1",
                        title: "Pengenalan Bunyi",
                        description:
                          "Mengenal huruf melalui flashcard dan poster.",
                      },
                    ]
                  ).map((step, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white border border-supporting-200 shadow-2xs relative flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[11px] font-bold text-primary-700 bg-primary-100 px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-3">
                          {step.step}
                        </span>
                        <h4 className="text-sm font-bold text-primary-950 mb-2">
                          {step.title}
                        </h4>
                        <p className="text-xs text-supporting-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-supporting-100 text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                        <span>⏱️ 15 Menit/Hari</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Tanya Jawab (FAQ) */}
            {activeTab === "faq" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-primary-950 mb-2">
                    Pertanyaan yang Sering Diajukan (FAQ)
                  </h3>
                  <p className="text-sm text-supporting-600">
                    Temukan jawaban atas pertanyaan umum seputar pemesanan dan
                    metode belajar:
                  </p>
                </div>

                <div className="space-y-3 max-w-3xl">
                  {(
                    richDetail?.faqs ?? [
                      {
                        question: "Bagaimana cara memesan?",
                        answer:
                          "Klik tombol Tambah Keranjang atau Beli Sekarang.",
                      },
                    ]
                  ).map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-supporting-50 border border-supporting-200"
                    >
                      <h4 className="text-sm font-bold text-primary-950 mb-1.5 flex items-center gap-2">
                        <span className="text-primary-600 font-bold">Q:</span>
                        <span>{faq.question}</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-supporting-600 leading-relaxed pl-5">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* Real Customer Reviews Section */}
          {/* ============================================================ */}
          <section className="mb-16">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-100 px-3 py-1 rounded-full border border-primary-200">
                  ULASAN TERVERIFIKASI
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary-950 mt-2">
                  Pengalaman Nyata Orang Tua &amp; Guru
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-supporting-200 shadow-2xs">
                <span className="text-amber-400 font-bold text-lg">★★★★★</span>
                <span className="text-sm font-bold text-primary-950">
                  4.9 dari 5.0
                </span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {relevantReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-3xl p-6 border border-supporting-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="text-amber-400 text-sm">
                        {"★".repeat(rev.rating)}
                      </div>
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                        ✓ Pembeli Terverifikasi
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-primary-950 mb-2 leading-snug">
                      &ldquo;{rev.title}&rdquo;
                    </h4>
                    <p className="text-xs text-supporting-600 leading-relaxed mb-4">
                      {rev.content.slice(0, 180)}...
                    </p>
                  </div>
                  <div className="pt-3 border-t border-supporting-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-800 font-bold text-xs flex items-center justify-center">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary-950">
                        {rev.name}
                      </p>
                      <p className="text-[10px] text-supporting-500">
                        {rev.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/* Related Products Section */}
          {/* ============================================================ */}
          {relatedProducts.length > 0 && (
            <section>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary-950">
                  Produk Terkait Lainnya
                </h3>
                <Link
                  href="/produk"
                  className="text-xs font-bold text-primary-700 hover:text-primary-800 flex items-center gap-1"
                >
                  <span>Lihat Semua ({products.length})</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {relatedProducts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/produk/${rel.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden border border-supporting-200 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] bg-supporting-100 overflow-hidden">
                      <Image
                        src={`${rel.image}?v=20260817b`}
                        alt={rel.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded uppercase tracking-wider mb-1.5 inline-block">
                        {rel.category}
                      </span>
                      <h4 className="text-sm font-bold text-primary-950 group-hover:text-primary-700 transition-colors line-clamp-1 mb-1">
                        {rel.name}
                      </h4>
                      <p className="text-sm font-bold text-emerald-700 font-serif">
                        Rp{rel.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* ============================================================ */}
      {/* Sticky Mobile Purchase Bar (Quick Checkout) */}
      {/* ============================================================ */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-supporting-200 p-3.5 shadow-xl sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-supporting-500 block">
              Total Harga
            </span>
            <span className="text-base font-bold text-primary-950 font-serif">
              Rp{(product.price * quantity).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className="px-3.5 py-2.5 rounded-xl bg-primary-50 text-primary-800 font-bold text-xs border border-primary-300"
            >
              + Keranjang
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock || isBuyingNow}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md"
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
