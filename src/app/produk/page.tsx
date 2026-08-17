"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useAmeenContext } from "@/context/AmeenContext";
import { motion, AnimatePresence } from "framer-motion";

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
  id: number;
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
  const [addedProductIds, setAddedProductIds] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { setSearchQuery } = useAmeenContext();
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
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
    const blobId = Date.now() + Math.random();
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

  const removeBlob = (blobId: number) => {
    setFlyingBlobs((prev) => prev.filter((b) => b.id !== blobId));
  };

  return (
    <div className="min-h-screen bg-background-50 relative pb-24">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-20 left-1/2 z-50 px-5 py-3 bg-primary-900/95 backdrop-blur-md text-white text-sm font-medium rounded-full shadow-xl flex items-center gap-3 border border-primary-700/50"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white text-xs">
              ✓
            </span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flying Blobs */}
      <AnimatePresence>
        {flyingBlobs.map((blob) => {
          // Mid-point curve control for natural arc
          const midX = (blob.startX + blob.endX) / 2 + (blob.startX > blob.endX ? -80 : 80);
          const midY = Math.min(blob.startY, blob.endY) - 100;

          return (
            <motion.div
              key={blob.id}
              initial={{
                x: blob.startX - 24,
                y: blob.startY - 24,
                scale: 1,
                opacity: 1,
              }}
              animate={{
                x: [blob.startX - 24, midX - 16, blob.endX - 12],
                y: [blob.startY - 24, midY - 16, blob.endY - 12],
                scale: [1, 1.2, 0.2],
                opacity: [1, 0.95, 0.1],
              }}
              transition={{
                duration: 0.75,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              onAnimationComplete={() => removeBlob(blob.id)}
              className="fixed pointer-events-none z-[9999] flex items-center justify-center"
              style={{ top: 0, left: 0 }}
            >
              {/* Glowing outer blob aura */}
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-primary-600 to-emerald-400 p-1 shadow-[0_0_25px_rgba(34,197,94,0.6)] animate-pulse">
                <div className="w-full h-full rounded-full bg-white overflow-hidden relative shadow-inner flex items-center justify-center">
                  <Image
                    src={blob.image}
                    alt="item"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-primary-600/20 backdrop-blur-[1px] flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white drop-shadow"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Page Header */}
      <section className="bg-white border-b border-supporting-200/80 py-10 shadow-2xs">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-supporting-500 mb-2">
                <Link href="/" className="hover:text-primary-600 transition-colors">
                  Beranda
                </Link>
                <span>/</span>
                <span className="text-primary-800 font-medium">Katalog Produk</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif text-primary-900 font-bold tracking-tight">
                Katalog Produk & Metode
              </h1>
              <p className="text-supporting-600 mt-2 max-w-xl text-base leading-relaxed">
                Temukan buku, paket belajar membaca Al-Barqy, ACM, dan materi edukasi resmi dari Pena Ameen.
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-80">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama paket / buku..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background-50 border border-supporting-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-2xs"
                />
                <svg
                  className="absolute left-3.5 top-3 h-4 w-4 text-supporting-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-primary-600 text-white shadow-xs"
                    : "bg-supporting-100/80 text-supporting-600 hover:bg-supporting-200/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="py-12">
        <div className="container px-4 mx-auto">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 border border-supporting-200 animate-pulse space-y-4"
                >
                  <div className="aspect-[4/3] bg-supporting-100 rounded-xl" />
                  <div className="h-4 bg-supporting-100 rounded w-1/3" />
                  <div className="h-6 bg-supporting-100 rounded w-3/4" />
                  <div className="h-4 bg-supporting-100 rounded w-full" />
                  <div className="h-8 bg-supporting-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-red-100 max-w-lg mx-auto p-8 shadow-xs">
              <p className="text-red-600 font-medium text-lg mb-2">Terjadi Gangguan</p>
              <p className="text-supporting-500 text-sm mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Muat Ulang
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => {
                const isAdded = addedProductIds[product.id];

                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-supporting-200/80 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                  >
                    {/* Clickable Image Container */}
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

                      {/* Floating Quick Action Button on Hover */}
                      <div className="absolute inset-x-4 bottom-4 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, product)}
                          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                            isAdded
                              ? "bg-emerald-600 text-white shadow-emerald-600/30"
                              : "bg-primary-600/95 hover:bg-primary-600 text-white backdrop-blur-xs shadow-primary-900/30"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Ditambahkan!</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                              <span>Tambah ke Keranjang</span>
                            </>
                          )}
                        </button>
                      </div>
                    </Link>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-md border border-primary-100">
                            {product.category}
                          </span>
                          <span className="text-[11px] text-supporting-400 font-medium">
                            Stok Tersedia
                          </span>
                        </div>

                        <Link href={`/produk/${product.slug}`}>
                          <h3 className="text-base font-serif font-bold text-primary-950 group-hover:text-primary-700 transition-colors line-clamp-1 mb-1.5">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="text-xs text-supporting-500 line-clamp-2 leading-relaxed mb-4">
                          {product.description}
                        </p>
                      </div>

                      {/* Bottom Price & Button Bar */}
                      <div className="pt-3 border-t border-supporting-100 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-supporting-400 block font-medium uppercase tracking-wider">
                            Harga
                          </span>
                          <span className="text-base font-bold text-primary-800">
                            Rp{product.price.toLocaleString("id-ID")}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, product)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 ${
                            isAdded
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white border border-primary-200/80"
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Ditambah</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                              </svg>
                              <span>+ Keranjang</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-supporting-200 max-w-md mx-auto p-8 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-supporting-100 flex items-center justify-center mx-auto mb-3 text-supporting-400">
                🔍
              </div>
              <p className="text-primary-900 font-semibold text-base mb-1">
                Tidak ada produk yang sesuai
              </p>
              <p className="text-supporting-500 text-xs mb-4">
                Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("Semua");
                }}
                className="text-xs text-primary-600 font-semibold hover:underline"
              >
                Reset Filter Pencarian
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
