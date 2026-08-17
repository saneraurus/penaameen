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
    highlights: ["Modul Praktis Orang Tua", "Flashcard Interaktif", "Evaluasi Bertahap"],
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
    highlights: ["Bermain Sambil Belajar", "Buku Aktivitas Bergambar", "Menumbuhkan Minat Baca"],
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
    highlights: ["Poster Klasikal Besar", "Digunakan di 500+ TPQ", "Panduan Pengajar"],
  },
];

const targetPersonas = [
  {
    id: "anak",
    title: "Untuk Anak Usia Dini",
    icon: "👶",
    tagline: "Usia 3–8 Tahun",
    desc: "Metode ACM & Al-Barqy Anak dengan kartu bergambar ceria tanpa beban hafalan.",
    href: "/produk",
    badge: "Paling Populer",
  },
  {
    id: "orangtua",
    title: "Untuk Orang Tua",
    icon: "👨‍👩‍👧",
    tagline: "Home Learning",
    desc: "Modul bimbingan praktis di rumah, lembar pantau berkala, santai & terarah.",
    href: "/produk/paket-home-learning-albarqy",
    badge: "Rekomendasi Keluarga",
  },
  {
    id: "guru",
    title: "Untuk Guru & TPQ",
    icon: "👩‍🏫",
    tagline: "Kelas & Lembaga",
    desc: "Perangkat peraga klasikal dinding, kartu guru, dan kurikulum siap ajar.",
    href: "/produk",
    badge: "500+ Sekolah",
  },
  {
    id: "dewasa",
    title: "Dewasa & Pemula",
    icon: "📖",
    tagline: "Sistem 200 Menit",
    desc: "Belajar mengaji mandiri cepat tanpa canggung dengan formula anti lupa.",
    href: "/produk/paket-albarqy-200-menit",
    badge: "Cepat & Tuntas",
  },
];

const quickKeywords = [
  { label: "Paket 200 Menit", href: "/produk/paket-albarqy-200-menit" },
  { label: "Home Learning", href: "/produk/paket-home-learning-albarqy" },
  { label: "Flashcard Edukasi", href: "/produk" },
  { label: "Metode ACM", href: "/metode/acm" },
  { label: "Al-Barqy Klasikal", href: "/metode/al-barqy" },
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
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary-50 via-secondary-100/70 to-background-50 pt-12 pb-24 md:pt-20 md:pb-32 border-b border-supporting-200/60">
      {/* Ambient Textured Background Image with Subtle Islamic Watermark */}
      <div className="absolute inset-0 pointer-events-none -z-20 overflow-hidden">
        <Image
          src="/images/penaameen/hero/hero-bg-texture.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-40 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-50/60 via-transparent to-background-50" />
      </div>

      {/* Dynamic Background Glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary-100/60 via-accent-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-primary-200/40 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 -right-48 w-96 h-96 rounded-full bg-accent-200/40 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container relative px-4 sm:px-6 mx-auto">
        {/* ============================================================ */}
        {/* 1. TOP ANNOUNCEMENT BADGE (CENTERED) */}
        {/* ============================================================ */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-primary-200/80 shadow-xs text-xs sm:text-sm font-medium text-supporting-700">
            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="font-semibold text-primary-800 tracking-wide uppercase text-[11px] sm:text-xs">
              PENA AMEEN Digital Learning
            </span>
            <span className="text-supporting-300">•</span>
            <span className="text-supporting-600 hidden xs:inline">
              Metode Resmi Al-Barqy &amp; ACM
            </span>
            <span className="text-xs bg-primary-100 text-primary-800 font-semibold px-2 py-0.5 rounded-full">
              Anti Lupa
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. BIG CENTERED HEADLINE & SUBTITLE */}
        {/* ============================================================ */}
        <div className="text-center max-w-4xl lg:max-w-5xl mx-auto mb-8 sm:mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-serif font-bold text-primary-950 tracking-tight leading-[1.12] mb-6">
            Kuasai Membaca &amp; Mengaji{" "}
            <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-primary-700 via-primary-600 to-accent-600 bg-clip-text text-transparent">
              Lebih Cepat, Ceria &amp; Anti Lupa.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-supporting-600 leading-relaxed max-w-3xl mx-auto font-normal">
            Metode revolusioner <strong className="text-supporting-800 font-semibold">Al-Barqy (Cepat 200 Menit)</strong> dan{" "}
            <strong className="text-supporting-800 font-semibold">ACM (Aku Cepat Membaca)</strong> yang telah dipercaya lebih dari{" "}
            <strong className="text-primary-700 font-semibold">8.000+ keluarga</strong>, guru, dan santri di seluruh Indonesia untuk belajar tanpa rasa bosan atau terbebani.
          </p>
        </div>

        {/* ============================================================ */}
        {/* 3. CENTERED ACTIONS & FAST DISCOVERY BAR */}
        {/* ============================================================ */}
        <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto mb-10 sm:mb-12">
          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 w-full">
            <Link
              href="/produk"
              className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm sm:text-base font-semibold rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 group cursor-pointer"
            >
              <span>Jelajahi Paket &amp; Produk</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
              className="px-6 sm:px-7 py-3.5 bg-white/90 hover:bg-white text-primary-800 hover:text-primary-900 border border-supporting-300/80 hover:border-primary-300 text-sm sm:text-base font-semibold rounded-2xl shadow-xs hover:shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <svg
                className="w-4 h-4 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span>Pelajari Metodologi</span>
            </Link>
          </div>

          {/* Quick Search Pill */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full max-w-xl flex items-center shadow-sm rounded-2xl bg-white/95 backdrop-blur-md border border-supporting-200/90 p-1.5 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all"
          >
            <div className="pl-3.5 pr-2 text-supporting-400 flex items-center pointer-events-none">
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
              className="w-full text-xs sm:text-sm text-supporting-800 placeholder-supporting-400 bg-transparent border-none focus:outline-none pr-3"
              aria-label="Cari produk atau metode"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-supporting-800 hover:bg-supporting-900 text-white text-xs sm:text-sm font-medium rounded-xl transition-colors flex-shrink-0 cursor-pointer"
            >
              Cari
            </button>
          </form>

          {/* Keyword tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-supporting-500">
            <span className="font-medium text-supporting-600">Paling dicari:</span>
            {quickKeywords.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-2.5 py-1 rounded-lg bg-white/70 hover:bg-white text-supporting-600 hover:text-primary-700 border border-supporting-200/70 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. TRUST & SOCIAL PROOF RIBBON */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-10 sm:mb-14">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 backdrop-blur-xs border border-supporting-200/70 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center font-bold text-base flex-shrink-0">
              ★
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-supporting-900 leading-tight">
                Rating 4.9/5
              </p>
              <p className="text-[11px] text-supporting-500">8.000+ Keluarga Puas</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 backdrop-blur-xs border border-supporting-200/70 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-base flex-shrink-0">
              ⚡
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-supporting-900 leading-tight">
                Sistem 200 Menit
              </p>
              <p className="text-[11px] text-supporting-500">Formula Anti Lupa</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 backdrop-blur-xs border border-supporting-200/70 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-secondary-100 text-supporting-700 flex items-center justify-center font-bold text-base flex-shrink-0">
              🏫
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-supporting-900 leading-tight">
                500+ Lembaga
              </p>
              <p className="text-[11px] text-supporting-500">TPQ &amp; Sekolah Binaan</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 backdrop-blur-xs border border-supporting-200/70 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-base flex-shrink-0">
              🛡️
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-supporting-900 leading-tight">
                100% Asli &amp; Teruji
              </p>
              <p className="text-[11px] text-supporting-500">Perangkat Fisik Resmi</p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5. GRAND CENTERED BIG IMAGE SHOWCASE STAGE */}
        {/* ============================================================ */}
        <div className="max-w-5xl lg:max-w-6xl mx-auto">
          {/* Interactive Multi-View Showcase Tabs */}
          <div className="flex justify-center mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <div className="inline-flex p-1.5 rounded-2xl bg-supporting-100/90 backdrop-blur-md border border-supporting-200/90 shadow-inner gap-1">
              {showcaseTabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTabId(tab.id)}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-white text-primary-800 shadow-sm font-semibold"
                        : "text-supporting-600 hover:text-supporting-900 hover:bg-white/50"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grand Big Image Stage with Floating Glass Badges */}
          <div className="relative mx-auto">
            {/* Ambient Background Glow Effect */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary-400/20 via-accent-300/20 to-primary-600/20 rounded-[2.25rem] blur-xl opacity-75" />

            {/* Main Showcase Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 sm:border-8 border-white bg-white group">
              <AnimatePresence initial={false}>
                <motion.div
                  key={activeTab.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0.01 : 0.3,
                    ease: "easeOut",
                  }}
                  className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/10] w-full overflow-hidden bg-supporting-100"
                >
                  <Image
                    src={activeTab.image}
                    alt={activeTab.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1150px"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
                  />

                  {/* Gradient Lighting Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-supporting-950/80 via-supporting-950/20 to-transparent pointer-events-none" />

                  {/* Top-Right Badge on the Image */}
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 hidden xs:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/60 shadow-md">
                    <span className="text-xs font-bold text-primary-800">
                      {activeTab.badge}
                    </span>
                  </div>

                  {/* Bottom Captions & Actions Bar inside Big Image */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
                    <div className="max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-600/90 text-white backdrop-blur-xs">
                          {activeTab.label}
                        </span>
                        <div className="hidden sm:flex items-center gap-2">
                          {activeTab.highlights.map((h, i) => (
                            <span
                              key={i}
                              className="text-[11px] text-white/90 bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md"
                            >
                              ✓ {h}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h2 className="text-lg sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-tight leading-snug mb-1 sm:mb-2 drop-shadow-sm">
                        {activeTab.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-supporting-200 line-clamp-2 sm:line-clamp-none max-w-xl leading-relaxed">
                        {activeTab.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <Link
                        href={activeTab.ctaHref}
                        className="px-4 sm:px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>{activeTab.ctaText}</span>
                        <svg
                          className="w-3.5 h-3.5"
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
                        href={activeTab.secondaryCtaHref}
                        className="px-3.5 sm:px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md text-xs sm:text-sm font-medium rounded-xl transition-colors inline-flex items-center gap-1"
                      >
                        <span>{activeTab.secondaryCtaText}</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Floating Glassmorphic Trust Card 1 (Left Overlay) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="hidden lg:flex absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-supporting-200/80 items-center gap-3.5 z-20 max-w-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-xl font-bold shadow-xs flex-shrink-0">
                ⚡
              </div>
              <div>
                <p className="text-xs font-bold text-supporting-900">
                  Metode Cepat Anti Lupa
                </p>
                <p className="text-[11px] text-supporting-500 leading-snug">
                  Struktur kata Al-Barqy melekat kuat dalam 200 menit belajar.
                </p>
              </div>
            </motion.div>

            {/* Floating Glassmorphic Trust Card 2 (Right Overlay) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="hidden lg:flex absolute -top-6 -right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-supporting-200/80 items-center gap-3.5 z-20 max-w-xs"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 text-white flex items-center justify-center text-xl font-bold shadow-xs flex-shrink-0">
                📚
              </div>
              <div>
                <p className="text-xs font-bold text-supporting-900">
                  100% Kit Edukasi Asli
                </p>
                <p className="text-[11px] text-supporting-500 leading-snug">
                  Flashcard, modul evaluasi, &amp; poster pengajaran resmi.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 6. TARGET AUDIENCE / PERSONA EXPLORATION CARDS */}
        {/* ============================================================ */}
        <div className="mt-14 sm:mt-20 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200/60">
              SESUAIKAN DENGAN KEBUTUHAN ANDA
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary-900 mt-2">
              Pilih Pendekatan Belajar Terbaik
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {targetPersonas.map((persona) => (
              <Link
                key={persona.id}
                href={persona.href}
                className="group relative bg-white/90 hover:bg-white rounded-2xl p-5 border border-supporting-200/80 hover:border-primary-300 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="w-10 h-10 rounded-xl bg-secondary-100 group-hover:bg-primary-50 text-xl flex items-center justify-center transition-colors">
                      {persona.icon}
                    </span>
                    <span className="text-[10px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200/50">
                      {persona.badge}
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-supporting-400 block mb-1">
                    {persona.tagline}
                  </span>
                  <h4 className="text-base font-serif font-bold text-supporting-900 group-hover:text-primary-800 transition-colors mb-2">
                    {persona.title}
                  </h4>
                  <p className="text-xs text-supporting-600 leading-relaxed mb-4">
                    {persona.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-supporting-100 flex items-center justify-between text-xs font-semibold text-primary-600 group-hover:text-primary-700">
                  <span>Lihat Pilihan Modul</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

