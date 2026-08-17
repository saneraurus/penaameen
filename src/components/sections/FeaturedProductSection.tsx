"use client";

import React, { useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { CartContext } from "@/context/CartContext";

export function FeaturedProductSection() {
  const [activeTab, setActiveTab] = useState<"isi" | "keunggulan">("isi");
  const [isAdded, setIsAdded] = useState(false);
  const cartContext = useContext(CartContext);

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
      desc: "Poster dinding berukuran besar untuk ruang belajar di rumah atau TPQ.",
    },
    {
      icon: "👨‍👩‍👧",
      title: "Buku Panduan Pendamping (Orang Tua & Guru)",
      desc: "Instruksi praktis mendampingi 15-20 menit per hari secara mandiri.",
    },
    {
      icon: "👜",
      title: "Bonus Tas Eksklusif PENA AMEEN",
      desc: "Tas kanvas tebal untuk menyimpan seluruh perlengkapan agar rapi dan mudah dibawa.",
    },
  ];

  const keyAdvantages = [
    {
      icon: "⚡",
      title: "Sistem Cepat 200 Menit",
      desc: "Kurikulum padat yang terbukti mengantarkan santri lancar membaca dalam 200 menit.",
    },
    {
      icon: "🧠",
      title: "Formula Kata Anti-Lupa",
      desc: "Menggunakan asosiasi bunyi kata alami bahasa Indonesia sehingga tidak mudah lupa.",
    },
    {
      icon: "🎯",
      title: "Cocok untuk Semua Usia",
      desc: "Efektif digunakan untuk anak usia sekolah, remaja, mualaf, hingga lansia.",
    },
    {
      icon: "🌟",
      title: "Bahan Cetak Standar Premium",
      desc: "Kertas tebal ramah anak, warna jelas tidak silau, dan awet bertahun-tahun.",
    },
  ];

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (cartContext?.addToCart) {
      try {
        await cartContext.addToCart("1", 1);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2200);
      } catch {
        // Fallback
      }
    }
  };

  return (
    <section className="py-14 sm:py-16 md:py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white relative overflow-hidden border-y border-primary-800/80">
      <div className="container px-4 mx-auto relative z-10 max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
          {/* Left Column: 3D Box Photography & Trust Badges */}
          <div className="lg:col-span-5 space-y-3">
            <Reveal>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white/20 bg-primary-900 group">
                <Image
                  src="/images/penaameen/products/featured-home-learning.jpg"
                  alt="Paket Home Learning ALBARQY Box Set Lengkap dengan Buku, Flashcard, Poster, dan Tas Eksklusif"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 bg-primary-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-md">
                  <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    <span>👑</span>
                    <span>Paket Unggulan Terlengkap</span>
                  </span>
                </div>

                {/* Bottom Trust Pill */}
                <div className="absolute bottom-3 left-3 right-3 bg-primary-950/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/20 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-400 text-primary-950 flex items-center justify-center font-bold text-xs">
                      ★
                    </span>
                    <div>
                      <p className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                        Rating 4.9 / 5.0
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-emerald-300">
                        Dipercaya 3.200+ Keluarga &amp; Sekolah
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-md">
                    Box Set 5-in-1
                  </span>
                </div>
              </div>

              {/* 3 Quick Micro-Trust Badges */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-0.5">
                {[
                  { icon: "🛡️", label: "100% Orisinal", sub: "Garansi Resmi" },
                  { icon: "⚡", label: "Garansi Cacat", sub: "Ganti Baru" },
                  { icon: "🚚", label: "Kirim Cepat", sub: "Nasional" },
                ].map((b, idx) => (
                  <div
                    key={idx}
                    className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center"
                  >
                    <span className="text-xs sm:text-sm mb-0.5">{b.icon}</span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-white leading-tight">{b.label}</span>
                    <span className="text-[8px] sm:text-[9px] text-white/60">{b.sub}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right Column: Title, Tabbed Breakdown, & Action Box */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <Reveal delay={0.15}>
              <div>
                {/* Header Pills */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full">
                    PILIHAN BELAJAR UTAMA
                  </span>
                  <span className="text-[11px] sm:text-xs text-emerald-300 font-medium">
                    • Metode Anti-Lupa 200 Menit
                  </span>
                </div>

                {/* Section Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white leading-tight mb-2">
                  Paket Home Learning ALBARQY
                </h2>

                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
                  Solusi menyeluruh pembelajaran membaca Al-Qur&apos;an mandiri di rumah. Dirancang agar anak dan pembelajar dewasa dapat belajar secara runtut, menyenangkan, dan cepat mahir tanpa rasa bosan.
                </p>

                {/* Interactive Tab Switcher */}
                <div className="flex items-center gap-1.5 p-1 bg-primary-900/90 rounded-2xl border border-white/20 mb-3.5 w-fit">
                  <button
                    type="button"
                    onClick={() => setActiveTab("isi")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeTab === "isi"
                        ? "bg-white text-primary-950 shadow-xs"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <span>📦 Isi Paket Box (5 Item)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("keunggulan")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeTab === "keunggulan"
                        ? "bg-white text-primary-950 shadow-xs"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <span>⚡ Keunggulan Metode</span>
                  </button>
                </div>

                {/* Tab Content 1: Compact 2-Column Box Contents */}
                {activeTab === "isi" && (
                  <div className="grid gap-2 sm:grid-cols-2 mb-4">
                    {kitContents.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors ${
                          idx === 4 ? "sm:col-span-2" : ""
                        }`}
                      >
                        <span className="text-lg flex-shrink-0 mt-0.5 p-1 rounded-lg bg-white/10">
                          {item.icon}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white leading-tight mb-0.5">
                            {item.title}
                          </h4>
                          <p className="text-[10px] sm:text-[11px] text-white/70 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab Content 2: 2x2 Key Advantages */}
                {activeTab === "keunggulan" && (
                  <div className="grid gap-2 sm:grid-cols-2 mb-4">
                    {keyAdvantages.map((adv, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                          ✓
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5">
                            {adv.title}
                          </h4>
                          <p className="text-[10px] sm:text-[11px] text-white/70 leading-snug">
                            {adv.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price & Purchase Actions Bar */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-emerald-300 font-bold block mb-0.5">
                      Harga Paket Lengkap
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-300 font-serif">
                        {formatPrice(966000)}
                      </span>
                      <span className="text-xs text-white/50 line-through">
                        {formatPrice(1250000)}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                        Hemat Rp284.000 + Bonus Tas Eksklusif
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {cartContext?.addToCart && (
                      <button
                        type="button"
                        onClick={handleQuickAdd}
                        className={`px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1 ${
                          isAdded
                            ? "bg-emerald-500 text-white shadow-lg"
                            : "bg-white/15 hover:bg-white/25 text-white border border-white/20"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <span>✓</span>
                            <span>Ditambah!</span>
                          </>
                        ) : (
                          <>
                            <span>+</span>
                            <span>Keranjang</span>
                          </>
                        )}
                      </button>
                    )}

                    <Link
                      href="/produk/paket-home-learning-albarqy"
                      className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-primary-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-1"
                    >
                      <span>Lihat Detail Produk</span>
                      <span>→</span>
                    </Link>

                    <Link
                      href="/kontak"
                      className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium border border-white/20 transition-colors"
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
