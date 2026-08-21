"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

function formatRupiah(value: number): string {
  return `Rp${Number(value).toLocaleString("id-ID")}`;
}

export default function CartPage() {
  const {
    items,
    total,
    itemCount,
    isLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (isLoading) {
    return (
      <main className="min-h-[60vh] bg-supporting-50">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-supporting-200" />
            <div className="h-32 rounded-xl bg-supporting-200" />
            <div className="h-32 rounded-xl bg-supporting-200" />
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[60vh] bg-supporting-50">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-supporting-100 text-supporting-400">
            <svg
              className="h-10 w-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-primary-900">
            Keranjang Anda kosong
          </h1>
          <p className="mb-8 max-w-md text-supporting-600">
            Belum ada produk yang ditambahkan. Jelajahi produk ALBARQY &amp; ACM
            untuk memulai belanja.
          </p>
          <Link
            href="/produk"
            className="rounded-xl bg-primary-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-800"
          >
            Lihat Produk
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] bg-supporting-50">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-900">Keranjang</h1>
            <p className="text-sm text-supporting-600">
              {itemCount} item · Total {formatRupiah(total)}
            </p>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-medium text-supporting-500 transition-colors hover:text-red-600"
          >
            Kosongkan keranjang
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item) => {
            const unitPrice = Number(item.product.price) || 0;
            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-2xl border border-supporting-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-supporting-100">
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex-1">
                  <Link
                    href={`/produk/${item.product.slug}`}
                    className="font-semibold text-primary-900 hover:text-primary-700"
                  >
                    {item.product.name}
                  </Link>
                  <p className="mt-1 text-sm text-supporting-500">
                    {formatRupiah(unitPrice)} / unit
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Kurangi jumlah"
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        Math.max(0, item.quantity - 1),
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-supporting-300 text-lg font-bold text-primary-700 transition-colors hover:bg-supporting-100 disabled:opacity-40"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-lg font-semibold text-primary-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Tambah jumlah"
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-supporting-300 text-lg font-bold text-primary-700 transition-colors hover:bg-supporting-100"
                  >
                    +
                  </button>
                </div>

                <div className="text-right sm:w-32">
                  <p className="font-bold text-primary-900">
                    {formatRupiah(unitPrice * item.quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="mt-1 text-xs font-medium text-supporting-500 transition-colors hover:text-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-supporting-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <span className="text-supporting-600">Subtotal</span>
            <span className="text-xl font-bold text-primary-900">
              {formatRupiah(total)}
            </span>
          </div>
          <p className="mt-1 text-xs text-supporting-500">
            Belum termasuk ongkos kirim. Ongkir dihitung saat checkout.
          </p>
          <Link
            href="/checkout/address"
            className="mt-6 block w-full rounded-xl bg-primary-700 py-3 text-center font-semibold text-white transition-colors hover:bg-primary-800"
          >
            Lanjut ke Pembayaran
          </Link>
          <Link
            href="/produk"
            className="mt-3 block w-full text-center text-sm font-medium text-supporting-500 transition-colors hover:text-primary-700"
          >
            Lanjut belanja
          </Link>
        </div>
      </div>
    </main>
  );
}
