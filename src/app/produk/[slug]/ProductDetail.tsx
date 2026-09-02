"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { getProductRichDetail } from "@/data/product-rich-details";
import { products } from "@/data/products";
import { testimonials } from "@/data/testimonials";

import { Reveal } from "@/components/motion/Reveal";
import {
  ActionLink,
  ErrorState,
  Price,
  SceneIndex,
  SectionHeading,
  Shell,
  Skeleton,
  buttonClass,
} from "@/components/ui/primitives";

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

export default function ProductDetailClient({ slug }: { slug: string }) {
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
      <div className="min-h-screen bg-background-50">
        <Shell className="py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Skeleton className="aspect-[4/5] w-full" />
            </div>
            <div className="space-y-5 lg:col-span-5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
          <p className="sr-only" role="status">
            Memuat rincian produk...
          </p>
        </Shell>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-50 p-6">
        <ErrorState
          title="Produk Tidak Ditemukan"
          description="Mohon maaf, produk yang Anda cari tidak tersedia atau tautan telah kedaluwarsa."
          action={
            <ActionLink href="/produk" tone="ink">
              Kembali ke Katalog Produk
            </ActionLink>
          }
        />
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

  const tabs = [
    {
      id: "isi" as const,
      label: "Kelengkapan Isi Paket",
      count: richDetail?.boxContents.length,
    },
    {
      id: "keunggulan" as const,
      label: "Keunggulan Metode",
      count: richDetail?.keyBenefits.length,
    },
    { id: "spesifikasi" as const, label: "Spesifikasi Produk" },
    { id: "panduan" as const, label: "Panduan 4 Tahap Belajar" },
    {
      id: "faq" as const,
      label: "Tanya Jawab (FAQ)",
      count: richDetail?.faqs.length,
    },
  ];

  return (
    <div className="min-h-screen bg-background-50 pb-28 text-supporting-900 sm:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {addedToast && (
        <div
          role="status"
          className="animate-fade-in fixed right-4 top-24 z-[90] flex items-center gap-4 rounded-xl bg-primary-950 px-5 py-4 text-background-50 shadow-[0_32px_80px_-24px_rgba(25,22,18,0.28)]"
        >
          <div>
            <p className="text-sm font-medium">Ditambahkan ke keranjang</p>
            <p className="mt-0.5 text-xs text-background-300">
              {quantity}x {product.name}
            </p>
          </div>
          <Link
            href="/checkout/address"
            className="rounded-full bg-accent-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-700"
          >
            Checkout →
          </Link>
        </div>
      )}

      <div className="border-b border-supporting-200 bg-background-50">
        <Shell className="py-4">
          <nav aria-label="Breadcrumb">
            <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-xs text-supporting-500">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-primary-900"
                >
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/produk"
                  className="transition-colors hover:text-primary-900"
                >
                  Produk
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>{product.category}</li>
              <li aria-hidden="true">/</li>
              <li
                className="max-w-[200px] truncate text-supporting-800"
                aria-current="page"
              >
                {product.name}
              </li>
            </ol>
          </nav>
        </Shell>
      </div>

      <main>
        <Shell className="py-12 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <figure className="image-frame image-frame-zoom aspect-[4/5] w-full sm:aspect-[4/3]">
                <Image
                  src={`${product.image}?v=20260817b`}
                  alt={`${product.name} - Penerbit Pena Ameen`}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
              </figure>

              <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-supporting-200 pt-6 sm:grid-cols-4">
                {[
                  { title: "100% Orisinal", sub: "Penerbit Resmi" },
                  { title: "Garansi Retur", sub: "Jika Cacat Kirim" },
                  { title: "Kirim Nasional", sub: "JNE, POS, TIKI" },
                  { title: "Bayar Aman", sub: "Midtrans & QRIS" },
                ].map((badge) => (
                  <li key={badge.title}>
                    <p className="text-xs font-medium text-supporting-900">
                      {badge.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-supporting-500">
                      {badge.sub}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <p className="meta-type">{product.category}</p>

                <h1 className="display-type mt-4 text-[clamp(1.875rem,3.6vw,3rem)]">
                  {product.name}
                </h1>

                <p className="mt-5 text-measure text-sm leading-relaxed text-supporting-600 sm:text-base">
                  {richDetail?.subtitle ?? product.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-supporting-500">
                  <span>
                    <span aria-hidden="true" className="text-accent-600">
                      ★
                    </span>{" "}
                    {richDetail?.rating ?? 4.9} (
                    {richDetail?.reviewCount ?? 3200}+ Ulasan)
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {isOutOfStock
                      ? "Stok Sedang Habis"
                      : isLowStock
                        ? `Sisa ${product.stock} Unit Terakhir`
                        : "Ready Stock • Siap Kirim"}
                  </span>
                </div>

                <div className="mt-9 border-y border-supporting-200 py-7">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-supporting-500">
                    Harga
                  </p>
                  <div className="mt-3 flex flex-wrap items-baseline gap-4">
                    <Price value={product.price} size="lg" />
                    {richDetail?.originalPrice && (
                      <span className="text-sm text-supporting-400 line-through">
                        Rp{richDetail.originalPrice.toLocaleString("id-ID")}
                      </span>
                    )}
                    {richDetail?.savings && (
                      <span className="text-xs font-medium text-accent-700">
                        Hemat Rp{richDetail.savings.toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-xs text-supporting-500">
                    Termasuk garansi produk 100% orisinal + bonus konsultasi
                    metode
                  </p>
                </div>

                <ul className="mt-7 space-y-3.5">
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
                    <li key={idx} className="flex gap-3 text-sm">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-px w-4 shrink-0 bg-accent-500"
                      />
                      <p className="leading-relaxed text-supporting-600">
                        <strong className="font-medium text-supporting-900">
                          {ben.title}:
                        </strong>{" "}
                        {ben.description}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-9">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs uppercase tracking-[0.16em] text-supporting-500">
                      Jumlah Pesanan
                    </span>
                    <div className="inline-flex items-center rounded-full border border-supporting-300">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1 || isOutOfStock}
                        aria-label="Kurangi jumlah"
                        className="flex h-11 w-11 items-center justify-center rounded-full text-lg text-supporting-700 transition-colors hover:bg-background-200 disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-medium">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((q) => Math.min(product.stock, q + 1))
                        }
                        disabled={quantity >= product.stock || isOutOfStock}
                        aria-label="Tambah jumlah"
                        className="flex h-11 w-11 items-center justify-center rounded-full text-lg text-supporting-700 transition-colors hover:bg-background-200 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={isOutOfStock || isAdding}
                      className={buttonClass({ tone: "outline", size: "lg" })}
                    >
                      {isAdding ? "Menambahkan..." : "+ Tambah Keranjang"}
                    </button>

                    <button
                      type="button"
                      onClick={handleBuyNow}
                      disabled={isOutOfStock || isBuyingNow}
                      className={buttonClass({ tone: "ink", size: "lg" })}
                    >
                      {isBuyingNow ? "Menyiapkan..." : "Beli Sekarang"}
                    </button>
                  </div>

                  <p className="mt-5 text-xs text-supporting-500">
                    Butuh bantuan atau pemesanan jumlah besar?{" "}
                    <Link
                      href="/kontak"
                      className="border-b border-current text-primary-800 transition-colors hover:text-accent-700"
                    >
                      Hubungi CS Pena Ameen
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Shell>

        <section className="border-t border-supporting-200 bg-white">
          <Shell className="py-16 sm:py-20">
            <SceneIndex index="02" label="Rincian Produk" />

            <div className="scrollbar-none mt-8 flex gap-7 overflow-x-auto border-b border-supporting-200">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-pressed={isActive}
                    className={`relative whitespace-nowrap py-4 text-sm transition-colors ${
                      isActive
                        ? "text-supporting-900"
                        : "text-supporting-500 hover:text-supporting-800"
                    }`}
                  >
                    {tab.label}
                    {tab.count ? (
                      <span className="ml-2 text-xs text-supporting-400">
                        {tab.count}
                      </span>
                    ) : null}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 bottom-0 h-px origin-left bg-accent-600 transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-12">
              {activeTab === "isi" && (
                <div className="grid gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <h2 className="text-2xl">
                      Kelengkapan Isi Paket {product.name}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-supporting-600">
                      Setiap paket dikemas secara rapi dan eksklusif dengan 5
                      item pembelajaran terlengkap:
                    </p>
                  </div>
                  <ul className="border-t border-supporting-200 lg:col-span-7 lg:col-start-6">
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
                      <li
                        key={idx}
                        className="flex gap-5 border-b border-supporting-200 py-5"
                      >
                        <span
                          aria-hidden="true"
                          className="text-xs text-supporting-400"
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="text-base text-supporting-900">
                            {item.name}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-supporting-600">
                            {item.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "keunggulan" && (
                <div className="grid gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <h2 className="text-2xl">Keunggulan Metode Pembelajaran</h2>
                    <p className="mt-4 text-sm leading-relaxed text-supporting-600">
                      Mengapa ribuan keluarga dan ratusan TPQ memilih metode
                      resmi dari Penerbit Pena Ameen:
                    </p>
                  </div>
                  <ul className="border-t border-supporting-200 lg:col-span-7 lg:col-start-6">
                    {(
                      richDetail?.keyBenefits ?? [
                        {
                          title: "Metode Cepat 200 Menit",
                          description:
                            "Kurikulum teruji untuk mempercepat penguasaan baca Al-Qur'an.",
                        },
                      ]
                    ).map((ben, idx) => (
                      <li
                        key={idx}
                        className="border-b border-supporting-200 py-5"
                      >
                        <h3 className="text-base text-supporting-900">
                          {ben.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-supporting-600">
                          {ben.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "spesifikasi" && (
                <div className="grid gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <h2 className="text-2xl">
                      Spesifikasi Teknis &amp; Detail Penerbitan
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-supporting-600">
                      Informasi lengkap mengenai penerbitan dan kualitas fisik
                      buku:
                    </p>
                  </div>
                  <dl className="border-t border-supporting-200 lg:col-span-7 lg:col-start-6">
                    {[
                      { label: "Judul Produk", value: product.name },
                      { label: "Kategori", value: product.category },
                      {
                        label: "Penulis",
                        value: richDetail?.author ?? "KH. Muhadjir Sulthon",
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
                        value:
                          richDetail?.language ?? "Arab & Bahasa Indonesia",
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
                        className="flex items-baseline justify-between gap-6 border-b border-supporting-200 py-4"
                      >
                        <dt className="text-sm text-supporting-500">
                          {row.label}
                        </dt>
                        <dd className="text-right text-sm font-medium text-supporting-900">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {activeTab === "panduan" && (
                <div>
                  <div className="max-w-xl">
                    <h2 className="text-2xl">
                      Peta Panduan 4 Tahap Belajar di Rumah
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-supporting-600">
                      Cukup 15–20 menit sehari mengikuti 4 tahapan sistematis
                      berikut:
                    </p>
                  </div>
                  <ol className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
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
                      <li
                        key={idx}
                        className="border-t border-supporting-300 pt-5"
                      >
                        <span className="scene-index">{step.step}</span>
                        <h3 className="mt-3 text-lg text-supporting-900">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-supporting-600">
                          {step.description}
                        </p>
                        <p className="mt-4 text-xs text-supporting-400">
                          15 Menit/Hari
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {activeTab === "faq" && (
                <div className="grid gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <h2 className="text-2xl">
                      Pertanyaan yang Sering Diajukan (FAQ)
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-supporting-600">
                      Temukan jawaban atas pertanyaan umum seputar pemesanan dan
                      metode belajar:
                    </p>
                  </div>
                  <dl className="border-t border-supporting-200 lg:col-span-7 lg:col-start-6">
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
                        className="border-b border-supporting-200 py-5"
                      >
                        <dt className="text-base text-supporting-900">
                          {faq.question}
                        </dt>
                        <dd className="mt-2 text-sm leading-relaxed text-supporting-600">
                          {faq.answer}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </Shell>
        </section>

        <section className="border-t border-supporting-200">
          <Shell className="py-16 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <SceneIndex index="03" label="Ulasan Terverifikasi" />
                <SectionHeading className="mt-6">
                  Pengalaman Nyata Orang Tua &amp; Guru
                </SectionHeading>
              </div>
              <p className="text-sm text-supporting-500">
                <span aria-hidden="true" className="text-accent-600">
                  ★★★★★
                </span>{" "}
                4.9 dari 5.0
              </p>
            </div>

            <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
              {relevantReviews.map((rev, index) => (
                <Reveal key={rev.id} variant="small" delay={index * 0.07}>
                  <figure className="border-t border-supporting-300 pt-6">
                    <blockquote>
                      <p className="font-serif text-xl leading-snug text-supporting-900">
                        &ldquo;{rev.title}&rdquo;
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-supporting-600">
                        {rev.content}
                      </p>
                    </blockquote>
                    <figcaption className="mt-6 text-xs text-supporting-500">
                      <span className="font-medium text-supporting-900">
                        {rev.name}
                      </span>
                      <span className="mt-0.5 block">{rev.role}</span>
                      <span className="mt-2 block text-[11px] text-supporting-400">
                        Pembeli Terverifikasi
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Shell>
        </section>

        {relatedProducts.length > 0 && (
          <section className="border-t border-supporting-200 bg-white">
            <Shell className="py-16 sm:py-20">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="text-2xl sm:text-3xl">Produk Terkait Lainnya</h2>
                <Link
                  href="/produk"
                  className="group inline-flex items-center gap-2 text-sm text-primary-800 transition-colors hover:text-accent-700"
                >
                  <span className="border-b border-current pb-0.5">
                    Lihat Semua ({products.length})
                  </span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>

              <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
                {relatedProducts.map((rel, index) => (
                  <Reveal key={rel.slug} variant="small" delay={index * 0.07}>
                    <Link href={`/produk/${rel.slug}`} className="group block">
                      <div className="image-frame image-frame-zoom aspect-[4/5] w-full">
                        <Image
                          src={`${rel.image}?v=20260817b`}
                          alt={rel.name}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <p className="meta-type mt-5">{rel.category}</p>
                      <h3 className="mt-2 text-lg leading-snug text-supporting-900 transition-colors group-hover:text-accent-700">
                        {rel.name}
                      </h3>
                      <p className="mt-2 text-sm font-medium text-supporting-700">
                        Rp{rel.price.toLocaleString("id-ID")}
                      </p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </Shell>
          </section>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-supporting-200 bg-background-50/95 px-4 py-3 backdrop-blur-xl sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.14em] text-supporting-500">
              Total Harga
            </span>
            <span className="font-serif text-lg text-supporting-900">
              Rp{(product.price * quantity).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={buttonClass({ tone: "outline", size: "sm" })}
            >
              + Keranjang
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock || isBuyingNow}
              className={buttonClass({ tone: "ink", size: "sm" })}
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
