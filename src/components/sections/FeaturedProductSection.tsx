"use client";

import { useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { CartContext } from "@/context/CartContext";

export function FeaturedProductSection() {
  const [openDropdown, setOpenDropdown] = useState<"isi" | "keunggulan" | null>(
    null,
  );
  const [isAdded, setIsAdded] = useState(false);
  const cartContext = useContext(CartContext);

  const formatPrice = (price: number) => `Rp${price.toLocaleString("id-ID")}`;

  const kitContents = [
    { title: "Buku Utama & Modul Praktik AL-BARQY", icon: "📖" },
    { title: "Flashcard Hijaiyah Interaktif 2 Sisi", icon: "🃏" },
    { title: "Set 12 Poster Edukasi Klasikal Dinding", icon: "🖼️" },
    { title: "Buku Panduan Pendamping Orang Tua & Guru", icon: "👨‍👩‍👧" },
    { title: "Bonus Tas Kanvas Eksklusif PENA AMEEN", icon: "👜" },
  ];

  const keyAdvantages = [
    { title: "Sistem Cepat 200 Menit Tuntas", stat: "200′" },
    { title: "Formula Kata Kunci Anti Lupa", stat: "A-DA" },
    { title: "Untuk Semua Usia (Anak hingga Lansia)", stat: "4–60+" },
    { title: "Cetak Tebal Premium & Awet Digunakan", stat: "PREM" },
  ];

  const toggleDropdown = (key: "isi" | "keunggulan") => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (cartContext?.addToCart) {
      try {
        await cartContext.addToCart("1", 1);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2200);
      } catch {
        // silent
      }
    }
  };

  return (
    <section
      id="bestseller-albarqy"
      className="relative overflow-hidden bg-primary-950 py-8 sm:py-14 lg:py-16"
    >
      {/* Background glow & subtle pattern */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 -right-32 h-[450px] w-[450px] rounded-full bg-accent-500/10 blur-[80px]" />
        <div className="absolute -bottom-32 -left-32 h-[450px] w-[450px] rounded-full bg-primary-600/20 blur-[80px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-400/30 to-transparent" />
      </div>

      <div className="container relative max-w-5xl">
        {/* Eyebrow */}
        <Reveal variant="micro" className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-400/20 bg-white/[0.07] px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-200 backdrop-blur sm:text-[11px] sm:tracking-[0.2em]">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            Pilihan Belajar Utama · 3.200+ Keluarga Terbimbing
          </span>
        </Reveal>

        {/* Compact unified product card */}
        <div className="mx-auto mt-4 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl sm:mt-6 sm:rounded-3xl">
          <div className="grid lg:grid-cols-12">
            {/* LEFT: Clean Visual */}
            <div className="flex flex-col justify-between bg-gradient-to-br from-background-50 via-white to-background-100 p-4 sm:p-6 lg:col-span-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-950 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-accent-300">
                    ★ Paket Terlaris
                  </span>
                  <span className="rounded-full border border-supporting-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-primary-800">
                    Box Set 5-in-1
                  </span>
                </div>

                <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-xl border border-supporting-200 bg-white p-2 shadow-sm sm:mt-4">
                  <Image
                    src="/images/penaameen/products/featured-home-learning.jpg"
                    alt="Paket Home Learning ALBARQY Box Set Lengkap"
                    fill
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className="object-cover rounded-lg"
                    priority
                  />
                  <div className="absolute right-2 top-2 rounded-md bg-gradient-to-br from-amber-400 to-accent-600 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow">
                    10+ Bonus
                  </div>
                </div>
              </div>

              {/* 3 Quick specs */}
              <div className="mt-3 grid grid-cols-3 divide-x divide-supporting-200 rounded-xl border border-supporting-200 bg-white py-2 text-center text-supporting-900 shadow-xs sm:mt-4">
                <div>
                  <p className="font-serif text-xs font-bold leading-none sm:text-sm">
                    30 Thn
                  </p>
                  <p className="mt-0.5 text-[9px] text-supporting-500">
                    Sejak 1995
                  </p>
                </div>
                <div>
                  <p className="font-serif text-xs font-bold leading-none sm:text-sm">
                    200 Menit
                  </p>
                  <p className="mt-0.5 text-[9px] text-supporting-500">
                    Anti Lupa
                  </p>
                </div>
                <div>
                  <p className="font-serif text-xs font-bold leading-none text-accent-700 sm:text-sm">
                    4.9 ★
                  </p>
                  <p className="mt-0.5 text-[9px] text-supporting-500">
                    3.200+ Ulasan
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: Compact Info + Dropdowns + Action */}
            <div className="flex flex-col justify-between p-4 sm:p-6 lg:col-span-7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-700 sm:text-[11px]">
                  Paket Terlengkap
                </p>
                <h2 className="display-type mt-1 text-xl font-bold leading-tight text-supporting-900 sm:text-2xl">
                  Paket Home Learning ALBARQY
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-supporting-600 sm:text-sm">
                  Solusi menyeluruh belajar membaca Al-Qur&apos;an mandiri di
                  rumah dengan metode 200 menit anti lupa.
                </p>

                {/* Price block */}
                <div className="mt-3 flex flex-wrap items-center gap-2 border-y border-supporting-100 py-2.5 sm:gap-3">
                  <span className="font-serif text-xl font-bold text-primary-950 sm:text-2xl">
                    {formatPrice(966000)}
                  </span>
                  <span className="text-xs text-supporting-400 line-through">
                    {formatPrice(1250000)}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                    Hemat Rp284.000
                  </span>
                </div>

                {/* Compact Collapsible Dropdowns */}
                <div className="mt-3 space-y-2">
                  {/* Dropdown 1: Isi Paket Box */}
                  <div className="overflow-hidden rounded-xl border border-supporting-200 bg-background-50/70 transition-colors hover:bg-background-50">
                    <button
                      type="button"
                      aria-expanded={openDropdown === "isi"}
                      onClick={() => toggleDropdown("isi")}
                      className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs font-semibold text-supporting-900 sm:text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span>📦</span>
                        <span>Isi Paket Box (5 Item Lengkap)</span>
                      </span>
                      <span
                        className={`text-xs text-supporting-500 transition-transform duration-200 ${openDropdown === "isi" ? "rotate-180" : ""}`}
                      >
                        ▾
                      </span>
                    </button>
                    {openDropdown === "isi" && (
                      <div className="border-t border-supporting-200 bg-white px-3.5 py-2.5">
                        <ul className="space-y-1.5">
                          {kitContents.map((item, idx) => (
                            <li
                              key={item.title}
                              className="flex items-center gap-2 text-xs text-supporting-700"
                            >
                              <span className="text-sm">{item.icon}</span>
                              <span className="text-[11px] font-semibold text-supporting-400">
                                0{idx + 1}
                              </span>
                              <span className="leading-snug">{item.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Dropdown 2: Keunggulan Metode */}
                  <div className="overflow-hidden rounded-xl border border-supporting-200 bg-background-50/70 transition-colors hover:bg-background-50">
                    <button
                      type="button"
                      aria-expanded={openDropdown === "keunggulan"}
                      onClick={() => toggleDropdown("keunggulan")}
                      className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs font-semibold text-supporting-900 sm:text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span>⚡</span>
                        <span>Keunggulan Metode (Formula 200 Menit)</span>
                      </span>
                      <span
                        className={`text-xs text-supporting-500 transition-transform duration-200 ${openDropdown === "keunggulan" ? "rotate-180" : ""}`}
                      >
                        ▾
                      </span>
                    </button>
                    {openDropdown === "keunggulan" && (
                      <div className="border-t border-supporting-200 bg-white px-3.5 py-2.5">
                        <ul className="grid gap-1.5 sm:grid-cols-2">
                          {keyAdvantages.map((adv) => (
                            <li
                              key={adv.title}
                              className="flex items-center justify-between rounded-lg bg-background-50 px-2.5 py-1.5 text-xs text-supporting-800"
                            >
                              <span className="text-[11.5px] leading-tight">
                                {adv.title}
                              </span>
                              <span className="shrink-0 rounded bg-accent-100 px-1.5 py-0.5 text-[9px] font-bold text-accent-800">
                                {adv.stat}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons & Quick Trust */}
              <div className="mt-4 pt-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Link
                    href="/produk/paket-home-learning-albarqy"
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-primary-950 px-6 text-xs font-semibold text-white shadow-md transition-all hover:bg-primary-900 sm:text-sm"
                  >
                    <span>Lihat Detail &amp; Beli</span>
                    <span aria-hidden="true" className="text-accent-400">
                      →
                    </span>
                  </Link>
                  {cartContext?.addToCart ? (
                    <button
                      type="button"
                      onClick={handleQuickAdd}
                      className={`inline-flex min-h-10 items-center justify-center rounded-full border px-5 text-xs font-semibold transition-all sm:text-sm ${
                        isAdded
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-supporting-300 bg-white text-supporting-800 hover:border-primary-700 hover:text-primary-900"
                      }`}
                    >
                      {isAdded ? "✓ Ditambahkan" : "+ Keranjang"}
                    </button>
                  ) : null}
                </div>

                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[10px] text-supporting-500 sm:text-[11px]">
                  <span>✓ Termasuk Bonus Tas · 100% Orisinal</span>
                  <Link
                    href="/kontak"
                    className="underline decoration-supporting-300 underline-offset-4 hover:text-primary-800"
                  >
                    Tanya CS via WhatsApp
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Micro footer bar */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center text-[11px] text-background-300/80 sm:mt-6 sm:text-xs">
          <span>★★★★★ 4.9/5.0 dari 3.200+ Keluarga</span>
          <span className="hidden sm:inline">·</span>
          <span>500+ TPQ &amp; Sekolah Mitra</span>
          <span className="hidden sm:inline">·</span>
          <span>30+ Tahun Teruji Sejak 1995</span>
        </div>
      </div>
    </section>
  );
}
