"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

import {
  ActionLink,
  SceneIndex,
  SectionHeading,
  Shell,
  Skeleton,
} from "@/components/ui/primitives";

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
      <main className="min-h-[70vh] bg-background-50">
        <Shell className="py-16 sm:py-24">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-6 h-12 w-64" />
          <div className="mt-12 space-y-6">
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>
        </Shell>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-background-50">
        <Shell className="py-16 sm:py-24">
          <SceneIndex index="01" label="Keranjang" />
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <SectionHeading level={1}>
                Keranjang Anda masih kosong.
              </SectionHeading>
              <p className="lede mt-6">
                Belum ada produk yang ditambahkan. Jelajahi produk ALBARQY &amp;
                ACM untuk memulai belanja.
              </p>
              <div className="mt-10">
                <ActionLink href="/produk" tone="ink" size="lg">
                  Lihat Produk
                </ActionLink>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="image-frame aspect-[4/3] w-full">
                <Image
                  src="/images/penaameen/editorial/editorial-family-bonding.jpg"
                  alt="Keluarga belajar membaca bersama"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Shell>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-background-50">
      <Shell className="py-16 sm:py-20">
        <SceneIndex index="01" label="Keranjang" />

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionHeading level={1}>Keranjang</SectionHeading>
            <p className="mt-3 text-sm text-supporting-500">
              {itemCount} item · Total {formatRupiah(total)}
            </p>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-supporting-500 underline-offset-4 transition-colors hover:text-red-700 hover:underline"
          >
            Kosongkan keranjang
          </button>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Lines */}
          <section className="lg:col-span-7" aria-label="Item keranjang">
            <ul className="border-t border-supporting-200">
              {items.map((item) => {
                const unitPrice = Number(item.product.price) || 0;
                return (
                  <li
                    key={item.id}
                    className="flex gap-5 border-b border-supporting-200 py-7 sm:gap-7"
                  >
                    <div className="image-frame h-28 w-24 shrink-0 sm:h-36 sm:w-32">
                      {item.product.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={`/produk/${item.product.slug}`}
                            className="text-base leading-snug text-supporting-900 transition-colors hover:text-accent-700 sm:text-lg"
                          >
                            {item.product.name}
                          </Link>
                          <p className="mt-1.5 text-xs text-supporting-500">
                            {formatRupiah(unitPrice)} / unit
                          </p>
                        </div>
                        <p className="font-semibold text-supporting-900">
                          {formatRupiah(unitPrice * item.quantity)}
                        </p>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
                        <div className="inline-flex items-center rounded-full border border-supporting-300">
                          <button
                            type="button"
                            aria-label="Kurangi jumlah"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                Math.max(0, item.quantity - 1),
                              )
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-supporting-700 transition-colors hover:bg-background-200 disabled:opacity-40"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="w-9 text-center text-sm font-medium text-supporting-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Tambah jumlah"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-supporting-700 transition-colors hover:bg-background-200"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-xs text-supporting-500 underline-offset-4 transition-colors hover:text-red-700 hover:underline"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Summary */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="surface-card p-7 sm:p-8">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-supporting-500">
                  Ringkasan
                </h2>

                <div className="mt-7 flex items-baseline justify-between border-b border-supporting-200 pb-5">
                  <span className="text-sm text-supporting-600">Subtotal</span>
                  <span className="font-serif text-2xl text-supporting-900">
                    {formatRupiah(total)}
                  </span>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-supporting-500">
                  Belum termasuk ongkos kirim. Ongkir dihitung saat checkout.
                </p>

                <Link
                  href="/checkout/address"
                  className="mt-8 flex min-h-13 w-full items-center justify-center rounded-full bg-primary-900 px-6 text-sm font-medium text-background-50 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-800"
                >
                  Lanjut ke Pembayaran
                </Link>
                <Link
                  href="/produk"
                  className="mt-3 flex min-h-11 w-full items-center justify-center text-sm text-supporting-500 transition-colors hover:text-primary-900"
                >
                  Lanjut belanja
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Shell>
    </main>
  );
}
