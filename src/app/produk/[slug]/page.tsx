"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

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
  const { addToCart } = useCart();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!slug) return;
    let active = true;
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`).then((r) => r.json());
        if (!active) return;
        if (res.error) {
          setError(res.error);
          return;
        }
        setProduct(res.product);
      } catch {
        if (active) setError("Failed to load product");
      } finally {
        if (active) setIsLoading(false);
      }
    }
    fetchProduct();
    return () => {
      active = false;
    };
  }, [slug]);

  async function handleAddToCart() {
    if (!product) return;
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=" + encodeURIComponent(window.location.pathname));
      return;
    }
    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-primary-600 mb-4">Produk Tidak Ditemukan</h1>
          <Link href="/produk" className="text-primary-600 hover:underline">
            ← Kembali ke Daftar Produk
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="min-h-screen bg-background-50">
      <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-20 border-b border-supporting-100">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <Link href="/produk" className="text-supporting-600 hover:text-primary-600">
              ← Kembali ke Produk
            </Link>
            <h1 className="text-2xl font-serif text-primary-600">{product.name}</h1>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="container px-4 mx-auto">
          <div className="grid gap-10 md:grid-cols-2 items-start">
            <div className="relative aspect-video bg-supporting-200 rounded-2xl overflow-hidden">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </div>

            <div>
              <div className="mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 bg-primary-100 text-primary-800 text-xs font-medium rounded">
                  {product.category}
                </span>
                <h2 className="mb-4 text-2xl font-serif text-primary-600">{product.name}</h2>
                <p className="mb-6 text-supporting-600 leading-relaxed">{product.description}</p>
                <div className="mb-6">
                  <h3 className="mb-2 text-lg font-semibold text-primary-600">Harga</h3>
                  <p className="text-2xl font-bold text-primary-600">Rp{product.price.toLocaleString()}</p>
                </div>

                <div className="mb-6 flex items-center gap-2">
                  {isOutOfStock && (
                    <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">Stok Habis</span>
                  )}
                  {isLowStock && !isOutOfStock && (
                    <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">Sisa {product.stock} unit</span>
                  )}
                  {!isOutOfStock && !isLowStock && (
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">Tersedia {product.stock} unit</span>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="mb-2 text-lg font-semibold text-primary-600">Deskripsi Produk</h3>
                  <p className="text-supporting-600 leading-relaxed">{product.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAdding}
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:bg-supporting-300 disabled:cursor-not-allowed transition-colors font-medium text-lg"
                  >
                    {isAdding ? "Menambahkan..." : isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
                  </button>
                  <Link href="/produk" className="px-6 py-3 border border-supporting-300 text-supporting-600 rounded-xl hover:bg-supporting-50 transition-colors font-medium text-lg text-center">
                    Kembali ke Produk
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
