"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

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

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background-50">
      <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-20 border-b border-supporting-100">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <Link href="/" className="text-supporting-600 hover:text-primary-600">
              ← Kembali ke Beranda
            </Link>
            <h1 className="text-2xl font-serif text-primary-600">Produk</h1>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-supporting-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {isLoading ? (
            <p className="text-supporting-600">Memuat produk...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <Link
                  key={product.id}
                  href={`/produk/${product.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-supporting-200 hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[4/3] bg-supporting-200">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <span className="mb-2 inline-flex items-center px-2.5 py-0.5 bg-primary-100 text-primary-800 text-xs font-medium rounded">
                      {product.category}
                    </span>
                    <h3 className="mb-3 text-lg font-serif text-primary-600">
                      {product.name}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-supporting-600 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="mt-4 flex items-baseline">
                      <span className="mr-3 text-xl font-semibold text-primary-600">
                        Rp{product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-supporting-600">Tidak ada produk yang ditemukan.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
