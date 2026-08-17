"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export function FeaturedProductSection() {
  const [activeTab, setActiveTab] = useState<"isi" | "keunggulan">("isi");

  const formatPrice = (price: number) => `Rp${price.toLocaleString("id-ID")}`;

  const kitContents = [
    {
      icon: "📖",
      title: "Buku Utama & Modul Praktik AL-BARQY",
      desc: "Panduan belajar membaca Al-Qur'an sistematis dari dasar hingga mahir tajwid.",
    },
    {
      icon: "🗂️",
      title: "Flashcard Hijaiyah Interaktif",
      desc: "Kartu tebal dua sisi bergambar untuk melatih daya ingat visual dan bunyi huruf.",
    },
    {
      icon: "📜",
      title: "Set 12 Poster Edukasi Klasikal",
      desc: "Poster dinding berukuran besar untuk menciptakan ekosistem literasi Qur'ani di rumah.",
    },
    {
      icon: "👨‍👩‍👧",
      title: "Buku Panduan Pendamping (Orang Tua & Guru)",
      desc: "Instruksi praktis mendampingi 15-20 menit per hari tanpa stres dan tanpa paksaan.",
    },
    {
      icon: "👜",
      title: "Bonus Tas Eksklusif PENA AMEEN",
      desc: "Tas kanvas tebal untuk menyimpan seluruh perlengkapan agar rapi dan mudah dibawa.",
    },
  ];

  const keyAdvantages = [
    {
      title: "Sistem Cepat 200 Menit",
      desc: "Kurikulum padat yang terbukti mengantarkan santri dan pemula lancar membaca dalam waktu singkat.",
    },
    {
      title: "Formula Kata Anti-Lupa",
      desc: "Menggunakan asosiasi bunyi kata alami bahasa Indonesia sehingga tidak mudah terlupakan.",
    },
    {
      title: "Cocok untuk Semua Usia",
      desc: "Efektif digunakan untuk balita, anak usia sekolah, remaja, mualaf, hingga lansia.",
    },
    {
      title: "Bahan Cetak Standar Premium",
      desc: "Kertas tebal ramah anak, warna cerah tidak silau, dan tahan digunakan bertahun-tahun.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white relative overflow-hidden">
      {/* Decorative ambient background elements */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container px-4 mx-auto relative z-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-center">
          {/* Left Column: Visual Showcase & Badges */}
          <div className="lg:col-span-6">
            <Reveal>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/15 bg-primary-800/60 group">
                <Image
                  src="/images/penaameen/products/featured-home-learning.jpg"
                  alt="Paket Home Learning ALBARQY Box Set Lengkap dengan Buku, Flashcard, Poster, dan Tas Eksklusif"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 bg-primary-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-md">
                  <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <span>👑</span>
                    <span>Paket Unggulan Terlengkap</span>
                  </span>
                </div>

                {/* Floating Bottom Milestone Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-primary-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-amber-400 text-primary-950 flex items-center justify-center font-bold text-sm">
                      ★
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">
                        Rating 4.9 / 5.0
                      </p>
                      <p className="text-[11px] text-primary-200">
                        Dipercaya 3.200+ Keluarga &amp; Sekolah
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold bg-white/20 text-white px-2.5 py-1 rounded-lg">
                    Box Set 5-in-1
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Information, Kit Breakdown & CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <Reveal delay={0.15}>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full">
                    PILIHAN BELAJAR UTAMA
                  </span>
                  <span className="text-xs text-primary-300 font-medium">
                    • Metode Anti-Lupa 200 Menit
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight mb-4">
                  Paket Home Learning ALBARQY
                </h2>

                <p className="text-sm sm:text-base text-primary-100/90 leading-relaxed mb-6">
                  Solusi menyeluruh pembelajaran membaca Al-Qur&apos;an mandiri
                  di rumah. Dirancang agar anak dan pembelajar dewasa dapat
                  belajar secara runtut, menyenangkan, dan cepat mahir tanpa
                  rasa bosan.
                </p>

                {/* Tab Switcher: Isi Paket vs Keunggulan */}
                <div className="flex gap-2 p-1 bg-primary-900/80 rounded-xl border border-white/15 mb-5 w-fit">
                  <button
                    onClick={() => setActiveTab("isi")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === "isi"
                        ? "bg-white text-primary-950 shadow-xs"
                        : "text-primary-200 hover:text-white"
                    }`}
                  >
                    📦 Isi Paket Box (5 Item)
                  </button>
                  <button
                    onClick={() => setActiveTab("keunggulan")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === "keunggulan"
                        ? "bg-white text-primary-950 shadow-xs"
                        : "text-primary-200 hover:text-white"
                    }`}
                  >
                    ⚡ Keunggulan Metode
                  </button>
                </div>

                {/* Content based on Active Tab */}
                {activeTab === "isi" ? (
                  <div className="space-y-3 mb-8">
                    {kitContents.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <span className="text-base flex-shrink-0 mt-0.5">
                          {item.icon}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-white">
                            {item.title}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-primary-200 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 mb-8">
                    {keyAdvantages.map((adv, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-amber-400 font-bold text-sm">
                            ✓
                          </span>
                          <h4 className="text-xs sm:text-sm font-semibold text-white">
                            {adv.title}
                          </h4>
                        </div>
                        <p className="text-[11px] sm:text-xs text-primary-200 leading-relaxed">
                          {adv.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price & Purchase Actions */}
                <div className="p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-primary-200 block">
                      Harga Paket Lengkap
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-bold text-amber-300 font-serif">
                        {formatPrice(966000)}
                      </span>
                      <span className="text-xs text-primary-200 line-through opacity-75">
                        {formatPrice(1250000)}
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-200/90 font-medium">
                      ✓ Hemat Rp284.000 + Bonus Tas Eksklusif
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      href="/produk/paket-home-learning-albarqy"
                      className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-primary-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all duration-200 transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                    >
                      <span>Lihat Detail Produk</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                    <Link
                      href="/kontak"
                      className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-medium border border-white/20 transition-colors"
                    >
                      Tanya CS
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
