"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface ShowcaseTab {
  id: string;
  label: string;
  icon: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  highlights: string[];
}

const showcaseTabs: ShowcaseTab[] = [
  {
    id: "home-learning",
    label: "Home Learning Keluarga",
    icon: "👨‍👩‍👧",
    badge: "Solusi Belajar di Rumah",
    title: "Dampingi Anak Membaca & Mengaji dengan Percaya Diri",
    description:
      "Perangkat edukasi lengkap dengan buku panduan orang tua, flashcard bergambar warna-warni, dan modul aktivitas ceria yang membuat belajar di rumah jadi momen bonding berharga.",
    image: "/images/penaameen/hero/hero-centered-showcase.jpg",
    imageAlt:
      "Ibu dan anak bahagia belajar membaca huruf dan kata dengan buku edukatif dan kartu flashcard PENA AMEEN",
    ctaText: "Lihat Paket Home Learning",
    ctaHref: "/produk/paket-home-learning-albarqy",
    secondaryCtaText: "Pelajari Panduan Belajar",
    secondaryCtaHref: "/artikel",
    highlights: [
      "Modul Praktis Orang Tua",
      "Flashcard Interaktif",
      "Evaluasi Bertahap",
    ],
  },
  {
    id: "albarqy",
    label: "Metode Al-Barqy (200 Menit)",
    icon: "⚡",
    badge: "Metode Anti Lupa Revolusioner",
    title: "Cepat Bisa Membaca Al-Qur'an Tanpa Ejaan Kaku",
    description:
      "Formula struktur bunyi kata Al-Barqy telah terbukti selama puluhan tahun membantu pemula, anak-anak, santri, hingga dewasa lancar mengaji dalam waktu singkat dan melekat seumur hidup.",
    image: "/images/penaameen/methods/method-albarqy.jpg",
    imageAlt:
      "Santri dan murid belajar membaca Al-Qur'an dengan metode Al-Barqy anti lupa",
    ctaText: "Lihat Paket Al-Barqy",
    ctaHref: "/produk/paket-albarqy-200-menit",
    secondaryCtaText: "Eksplorasi Metode Al-Barqy",
    secondaryCtaHref: "/metode/al-barqy",
    highlights: ["Sistem 200 Menit", "Pola Kata Anti Lupa", "Untuk Semua Usia"],
  },
  {
    id: "acm",
    label: "Metode ACM Ceria Anak",
    icon: "👶",
    badge: "Aku Cepat Membaca (3–8 Tahun)",
    title: "Belajar Membaca Latin Aktif dengan Konsep Bermain",
    description:
      "Dirancang khusus untuk dunia anak. Mengembangkan kemampuan membaca tanpa tekanan hafalan rumus kata yang rumit, diperkaya dengan ilustrasi menarik dan kartu edukasi ceria.",
    image: "/images/penaameen/methods/method-acm.jpg",
    imageAlt:
      "Anak-anak antusias belajar membaca dengan buku dan materi metode ACM",
    ctaText: "Lihat Produk ACM",
    ctaHref: "/produk",
    secondaryCtaText: "Pelajari Metode ACM",
    secondaryCtaHref: "/metode/acm",
    highlights: [
      "Bermain Sambil Belajar",
      "Buku Aktivitas Bergambar",
      "Menumbuhkan Minat Baca",
    ],
  },
  {
    id: "perangkat",
    label: "Kit & Alat Peraga Klasikal",
    icon: "📦",
    badge: "Untuk Sekolah & TPQ",
    title: "Perangkat Ajar Terstandar untuk Guru dan Kelas",
    description:
      "Dukung pengajaran klasikal dengan poster peraga dinding besar, kartu peraga guru, buku kurikulum terstruktur, dan modul sertifikasi yang telah digunakan di ratusan lembaga pendidikan.",
    image: "/images/penaameen/hero/hero-kit-showcase.jpg",
    imageAlt:
      "Kit perangkat fisik lengkap buku, kartu flashcard, dan alat peraga PENA AMEEN",
    ctaText: "Lihat Alat Peraga Guru",
    ctaHref: "/produk",
    secondaryCtaText: "Konsultasi Lembaga",
    secondaryCtaHref: "/tentang",
    highlights: [
      "Poster Klasikal Besar",
      "Digunakan di 500+ TPQ",
      "Panduan Pengajar",
    ],
  },
];

export function HeroSection() {
  const router = useRouter();
  const [activeTabId, setActiveTabId] = useState<string>("home-learning");
  const [searchQuery, setSearchQuery] = useState("");
  const shouldReduceMotion = useReducedMotion();

  const activeTab =
    showcaseTabs.find((tab) => tab.id === activeTabId) ?? showcaseTabs[0]!;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/produk?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/produk");
    }
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 bg-primary-950 text-white border-b border-supporting-200/40">
      {/* 1. VISIBLE FULL BACKGROUND IMAGE (THEME: ISLAMIC EDUCATIONAL STUDY) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/penaameen/hero/hero-bg-islamic-learning.jpg"
          alt="Latar Belajar Islami Pena Ameen"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center brightness-[0.75] contrast-[1.05] scale-102"
        />
        {/* Elegant subtle dark gradient overlay for crystal clear contrast & luxury look */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/70 via-primary-950/50 to-primary-950/85" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 mx-auto">
        {/* 2. Main Headline & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-8 pt-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-[1.12] mb-4 drop-shadow-md">
            Kuasai Membaca &amp; Mengaji{" "}
            <span className="block mt-1 bg-gradient-to-r from-emerald-300 via-amber-200 to-emerald-200 bg-clip-text text-transparent drop-shadow-sm">
              Lebih Cepat, Ceria &amp; Anti Lupa.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto drop-shadow-xs font-normal">
            Metode revolusioner{" "}
            <strong className="text-amber-200 font-semibold">
              Al-Barqy (Cepat 200 Menit)
            </strong>{" "}
            dan{" "}
            <strong className="text-amber-200 font-semibold">
              ACM (Aku Cepat Membaca)
            </strong>{" "}
            yang telah dipercaya lebih dari{" "}
            <strong className="text-emerald-300 font-semibold">
              8.000+ keluarga
            </strong>
            , guru, dan santri di seluruh Indonesia.
          </p>
        </div>

        {/* 3. Action Buttons & Search */}
        <div className="flex flex-col items-center gap-5 max-w-xl mx-auto mb-12">
          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <Link
              href="/produk"
              className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Jelajahi Paket &amp; Produk</span>
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
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>

            <Link
              href="/metode"
              className="px-6 py-3.5 bg-white/20 hover:bg-white/30 text-white border border-white/40 text-xs sm:text-sm font-bold rounded-2xl backdrop-blur-md shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>📖 Pelajari Metodologi</span>
            </Link>
          </div>

          {/* Clean Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full flex items-center shadow-lg rounded-2xl bg-white/95 backdrop-blur-md p-1.5 focus-within:ring-2 focus-within:ring-emerald-400 transition-all text-gray-900"
          >
            <div className="pl-3.5 pr-2 text-gray-400 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari modul belajar (mis: Al-Barqy 200 Menit, Flashcard, Home Learning)..."
              className="w-full text-xs text-gray-800 placeholder-gray-400 bg-transparent border-none focus:outline-none pr-3"
              aria-label="Cari produk atau metode"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors flex-shrink-0 cursor-pointer"
            >
              Cari
            </button>
          </form>
        </div>

        {/* 5. Trust & Social Proof Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-black/35 backdrop-blur-md border border-white/20 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">
              ★
            </div>
            <div>
              <p className="text-xs font-bold text-white">Rating 4.9/5</p>
              <p className="text-[10px] text-white/70">8.000+ Keluarga Puas</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-black/35 backdrop-blur-md border border-white/20 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">
              ⚡
            </div>
            <div>
              <p className="text-xs font-bold text-white">Sistem 200 Menit</p>
              <p className="text-[10px] text-white/70">Formula Anti Lupa</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-black/35 backdrop-blur-md border border-white/20 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-sm shrink-0">
              🏫
            </div>
            <div>
              <p className="text-xs font-bold text-white">500+ Lembaga</p>
              <p className="text-[10px] text-white/70">
                TPQ &amp; Sekolah Binaan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-black/35 backdrop-blur-md border border-white/20 shadow-md">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">
              🛡️
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                100% Asli &amp; Teruji
              </p>
              <p className="text-[10px] text-white/70">Perangkat Fisik Resmi</p>
            </div>
          </div>
        </div>

        {/* 6. Simplified Interactive Showcase */}
        <div className="max-w-4xl mx-auto">
          {/* Switcher Tabs */}
          <div className="flex justify-center mb-4 overflow-x-auto pb-1 scrollbar-hide">
            <div className="inline-flex p-1 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 shadow-inner gap-1">
              {showcaseTabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTabId(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-md font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clean Showcase Stage Card with Fixed Aspect Ratio & Seamless Crossfade */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/30 bg-primary-950 group">
            <AnimatePresence initial={false}>
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0.01 : 0.3,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 w-full h-full overflow-hidden"
              >
                <Image
                  src={activeTab.image}
                  alt={activeTab.imageAlt}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 950px"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-102"
                />

                {/* Bottom Card Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 sm:p-7 text-white pointer-events-auto">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                      {activeTab.badge}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold text-white mb-1 drop-shadow-sm">
                    {activeTab.title}
                  </h3>
                  <p className="text-xs text-white/90 line-clamp-2 max-w-2xl mb-3 leading-relaxed hidden sm:block drop-shadow-2xs">
                    {activeTab.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <Link
                      href={activeTab.ctaHref}
                      className="px-4 py-1.5 bg-white text-primary-950 hover:bg-gray-100 rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                    >
                      <span>{activeTab.ctaText}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
