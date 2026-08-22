"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useAmeenContext } from "@/context/AmeenContext";
import { motion, AnimatePresence } from "framer-motion";

import { Reveal } from "@/components/motion/Reveal";
import {
  EmptyState,
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

interface FlyingBlob {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  image: string;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flyingBlobs, setFlyingBlobs] = useState<FlyingBlob[]>([]);
  const [addedProductIds, setAddedProductIds] = useState<
    Record<string, boolean>
  >({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { setSearchQuery } = useAmeenContext();
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const blobIdCounterRef = useRef(0);

  useEffect(() => {
    setSearchQuery(search);
  }, [search, setSearchQuery]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/products").then((r) => r.json());
        if (!active) return;
        setProducts(res.products ?? []);
      } catch {
        if (active) setError("Gagal memuat produk");
      } finally {
        if (active) setIsLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const categories = [
    "Semua",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: Product,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Calculate animation coordinates
    const btnRect = e.currentTarget.getBoundingClientRect();
    const startX = btnRect.left + btnRect.width / 2;
    const startY = btnRect.top + btnRect.height / 2;

    const cartIconEl = document.getElementById("header-cart-icon");
    let endX = window.innerWidth - 60;
    let endY = 28;

    if (cartIconEl) {
      const cartRect = cartIconEl.getBoundingClientRect();
      endX = cartRect.left + cartRect.width / 2;
      endY = cartRect.top + cartRect.height / 2;
    }

    // 2. Spawn flying blob
    const blobId = `blob-${++blobIdCounterRef.current}`;
    setFlyingBlobs((prev) => [
      ...prev,
      {
        id: blobId,
        startX,
        startY,
        endX,
        endY,
        image: product.image,
      },
    ]);

    // 3. Trigger Cart Context update
    addToCart(product.id, 1, product);

    // 4. Temporary button feedback
    setAddedProductIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedProductIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1600);

    // 5. Show toast feedback
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(`"${product.name}" ditambahkan ke keranjang!`);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const removeBlob = (blobId: string) => {
    setFlyingBlobs((prev) => prev.filter((b) => b.id !== blobId));
  };

  return (
    <div className="relative min-h-screen bg-background-50 pb-24">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: -12, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -12, x: "-50%" }}
            className="fixed left-1/2 top-24 z-[90] flex items-center gap-3 rounded-full bg-primary-950 px-5 py-3 text-sm text-background-50 shadow-[0_32px_80px_-24px_rgba(25,22,18,0.28)]"
          >
            <span
              aria-hidden="true"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[11px]"
            >
              ✓
            </span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flying item animation */}
      <AnimatePresence>
        {flyingBlobs.map((blob) => {
          const midX =
            (blob.startX + blob.endX) / 2 +
            (blob.startX > blob.endX ? -80 : 80);
          const midY = Math.min(blob.startY, blob.endY) - 100;

          return (
            <motion.div
              key={blob.id}
              aria-hidden="true"
              initial={{
                x: blob.startX - 24,
                y: blob.startY - 24,
                scale: 1,
                opacity: 1,
              }}
              animate={{
                x: [blob.startX - 24, midX - 16, blob.endX - 12],
                y: [blob.startY - 24, midY - 16, blob.endY - 12],
                scale: [1, 1.1, 0.2],
                opacity: [1, 0.95, 0.1],
              }}
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              onAnimationComplete={() => removeBlob(blob.id)}
              className="pointer-events-none fixed z-[9999] flex items-center justify-center"
              style={{ top: 0, left: 0 }}
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/60 shadow-lg">
                <Image
                  src={blob.image}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Masthead */}
      <header className="border-b border-supporting-200 bg-white">
        <Shell className="py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs text-supporting-500">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-primary-900"
                >
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-supporting-800">Katalog Produk</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SceneIndex index="01" label="Katalog" />
              <SectionHeading level={1} className="mt-5">
                Katalog Produk &amp; Metode
              </SectionHeading>
              <p className="lede mt-5 max-w-xl">
                Temukan buku, paket belajar membaca Al-Barqy, ACM, dan materi
                edukasi resmi dari Pena Ameen.
              </p>
            </div>

            <div className="lg:col-span-5">
              <label htmlFor="catalog-search" className="sr-only">
                Cari nama paket atau buku
              </label>
              <div className="flex items-center border-b border-supporting-300 transition-colors focus-within:border-primary-700">
                <svg
                  className="h-4 w-4 shrink-0 text-supporting-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  id="catalog-search"
                  type="text"
                  placeholder="Cari nama paket / buku..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent px-3 py-3.5 text-sm outline-none placeholder:text-supporting-400"
                />
              </div>
            </div>
          </div>

          {/* Category filter */}
          <div className="scrollbar-none mt-10 flex items-center gap-6 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={isActive}
                  className={`relative whitespace-nowrap py-2 text-sm transition-colors ${
                    isActive
                      ? "text-primary-900"
                      : "text-supporting-500 hover:text-primary-900"
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
          </div>
        </Shell>
      </header>

      {/* Catalogue */}
      <main>
        <Shell className="py-14 sm:py-20">
          {isLoading ? (
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/5] w-full" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorState
              title="Produk belum dapat dimuat"
              description={error}
              action={
                <button
                  onClick={() => window.location.reload()}
                  className={buttonClass({ tone: "ink" })}
                >
                  Muat Ulang
                </button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Tidak ada produk yang sesuai"
              description="Coba gunakan kata kunci lain atau pilih kategori yang berbeda."
              action={
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("Semua");
                  }}
                  className={buttonClass({ tone: "outline" })}
                >
                  Reset Filter Pencarian
                </button>
              }
            />
          ) : (
            <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product, index) => {
                const isAdded = addedProductIds[product.id];

                return (
                  <Reveal
                    key={product.id}
                    variant="small"
                    delay={(index % 3) * 0.06}
                  >
                    <article className="group flex h-full flex-col">
                      <Link
                        href={`/produk/${product.slug}`}
                        className="image-frame image-frame-zoom block aspect-[4/5] w-full"
                      >
                        <Image
                          src={`${product.image}?v=20260817b`}
                          alt={product.name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </Link>

                      <div className="mt-5 flex flex-1 flex-col">
                        <p className="meta-type">{product.category}</p>

                        <h2 className="mt-2.5 text-lg leading-snug">
                          <Link
                            href={`/produk/${product.slug}`}
                            className="text-supporting-900 transition-colors hover:text-accent-700"
                          >
                            {product.name}
                          </Link>
                        </h2>

                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-supporting-600">
                          {product.description}
                        </p>

                        <div className="mt-5 flex items-center justify-between gap-4 border-t border-supporting-200 pt-4">
                          <Price value={product.price} />

                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(e, product)}
                            aria-label={`Tambah ${product.name} ke keranjang`}
                            className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-medium transition-all duration-200 ${
                              isAdded
                                ? "bg-primary-100 text-primary-800"
                                : "bg-primary-900 text-background-50 hover:-translate-y-0.5 hover:bg-primary-800"
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <svg
                                  className="h-3.5 w-3.5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span>Ditambah</span>
                              </>
                            ) : (
                              <span>+ Keranjang</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </Shell>
      </main>
    </div>
  );
}
