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
    label: "Home Learning",
    icon: "👨‍👩‍👧",
    badge: "Solusi Belajar di Rumah",
    title: "Dampingi Anak Membaca & Mengaji Mandiri di Rumah",
    description:
      "Perangkat 5-in-1 lengkap: buku utama Al-Barqy, flashcard hijaiyah interaktif, 12 poster edukasi dinding, modul pendamping orang tua, dan tas kanvas. Cukup 15–20 menit sehari.",
    image: "/images/penaameen/hero/hero-centered-showcase.jpg",
    imageAlt:
      "Ibu dan anak belajar membaca huruf dan kata dengan buku edukatif dan kartu flashcard PENA AMEEN",
    ctaText: "Lihat Paket Home Learning",
    ctaHref: "/produk/paket-home-learning-albarqy",
    secondaryCtaText: "Panduan Belajar",
    secondaryCtaHref: "/artikel",
    highlights: [
      "Modul Praktis 15 Menit/Hari",
      "Flashcard Visual 2 Sisi",
      "Garansi 100% Orisinal",
    ],
  },
  {
    id: "albarqy",
    label: "Metode Al-Barqy",
    icon: "⚡",
    badge: "Metode Anti Lupa Revolusioner",
    title: "Lancar Membaca Al-Qur'an dalam 200 Menit",
    description:
      "Formula fonetik kata kunci (A-DA-RA-JA, MA-HA-KA-YA) karya KH. Nursyamsu Muhadi. Tuntas membaca Al-Qur'an secara tartil tanpa mengeja huruf satu per satu.",
    image: "/images/penaameen/methods/method-albarqy.jpg",
    imageAlt:
      "Santri dan murid belajar membaca Al-Qur'an dengan metode Al-Barqy anti lupa",
    ctaText: "Lihat Paket Al-Barqy",
    ctaHref: "/produk/paket-albarqy-200-menit",
    secondaryCtaText: "Metode Al-Barqy",
    secondaryCtaHref: "/metode/al-barqy",
    highlights: ["Sistem 200 Menit Tuntas", "Formula Kata Anti-Lupa", "Untuk Anak & Dewasa"],
  },
  {
    id: "acm",
    label: "Metode ACM",
    icon: "👶",
    badge: "Aku Cepat Membaca (3–8 Tahun)",
    title: "Lancar Membaca Huruf Latin Tanpa Mengeja",
    description:
      "Metode membaca aktif berbasis kata lembaga dan lagu edukatif ceria. Anak langsung membaca kata utuh tanpa mengeja B-A = BA. Tuntas rata-rata dalam 16–24 pertemuan.",
    image: "/images/penaameen/methods/method-acm.jpg",
    imageAlt:
      "Anak-anak antusias belajar membaca dengan buku dan materi metode ACM",
    ctaText: "Lihat Produk ACM",
    ctaHref: "/produk",
    secondaryCtaText: "Metode ACM",
    secondaryCtaHref: "/metode/acm",
    highlights: [
      "100% Tanpa Mengeja",
      "16–24 Sesi Pembelajaran",
      "Ramah PAUD/TK & ABK",
    ],
  },
  {
    id: "perangkat",
    label: "Kit & Alat Peraga",
    icon: "📦",
    badge: "Untuk Sekolah & TPQ",
    title: "Standar Kurikulum Pengajaran Guru & Lembaga",
    description:
      "Perangkat ajar kelas: flipchart peraga dinding besar, tongkat penunjuk, buku kurikulum guru, dan sertifikasi pengajar Al-Barqy & ACM di seluruh Indonesia.",
    image: "/images/penaameen/hero/hero-kit-showcase.jpg",
    imageAlt:
      "Kit perangkat fisik lengkap buku, kartu flashcard, dan alat peraga PENA AMEEN",
    ctaText: "Lihat Alat Peraga Guru",
    ctaHref: "/produk",
    secondaryCtaText: "Konsultasi Lembaga",
    secondaryCtaHref: "/tentang",
    highlights: [
      "Flipchart & Poster Besar",
      "Dipakai 500+ TPQ & Sekolah",
      "Buku Panduan Pengajar",
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
    <section className="relative overflow-hidden pt-4 pb-6 sm:pt-6 sm:pb-8 md:pt-8 md:pb-10 bg-primary-950 text-white border-b border-supporting-200/40">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/penaameen/hero/hero-bg-islamic-learning.jpg"
          alt="Latar Belajar Islami Pena Ameen"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center brightness-[0.40] contrast-[1.10]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/95 via-primary-950/90 to-primary-950/98" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 mx-auto max-w-4xl">
        {/* Main Headline & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-3 sm:mb-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1.5 border border-white/15 backdrop-blur-md">
            Penerbit Resmi • Sejak 1995
          </span>

          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight mb-1.5 drop-shadow-md">
            Kuasai Membaca &amp; Mengaji.{" "}
            <span className="block sm:inline bg-gradient-to-r from-emerald-300 via-amber-200 to-emerald-200 bg-clip-text text-transparent">
              Lebih Cepat, Tepat &amp; Anti-Lupa.
            </span>
          </h1>

          <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed max-w-xl mx-auto font-normal">
            Metode resmi <strong className="text-amber-300 font-semibold">AL-BARQY (200 Menit)</strong> dan <strong className="text-amber-300 font-semibold">ACM (Tanpa Mengeja)</strong> dari Penerbit Pena Ameen. Teruji membimbing jutaan santri &amp; keluarga.
          </p>
        </div>

        {/* Action Buttons & Search */}
        <div className="flex flex-col items-center gap-2 max-w-md mx-auto mb-3.5 sm:mb-4">
          {/* Primary Action Buttons */}
          <div className="flex items-center justify-center gap-2 w-full">
            <Link
              href="/produk"
              className="flex-1 py-1.5 sm:py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer text-center"
            >
              <span>Jelajahi Paket &amp; Produk</span>
              <span>→</span>
            </Link>

            <Link
              href="/metode"
              className="py-1.5 sm:py-2 px-3 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl border border-white/25 backdrop-blur-md transition-all flex items-center justify-center text-center"
            >
              Pelajari 2 Metode
            </Link>
          </div>

          {/* Search Input Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full"
          >
            <label htmlFor="hero-search-input" className="sr-only">
              Cari produk atau metode
            </label>
            <input
              id="hero-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari paket Al-Barqy, ACM, Flashcard..."
              className="w-full pl-8 pr-16 py-1.5 sm:py-2 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-white/60 border border-white/20 rounded-xl text-xs backdrop-blur-md outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            />
            <svg
              className="absolute left-2.5 top-2 sm:top-2.5 h-3.5 w-3.5 text-emerald-300 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center cursor-pointer"
            >
              Cari
            </button>
          </form>
        </div>

        {/* Interactive Showcase Tabs Component */}
        <div className="max-w-3xl mx-auto">
          {/* Centered Hugging Tab Navigation */}
          <div className="flex justify-center mb-3">
            <div className="inline-flex items-center gap-1 p-1 bg-primary-900/90 backdrop-blur-md border border-white/15 rounded-2xl shadow-md max-w-full overflow-x-auto scrollbar-none">
              {showcaseTabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`relative px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
                      isActive
                        ? "text-primary-950 font-bold shadow-xs"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabBadge"
                        className="absolute inset-0 bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 rounded-xl z-0"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10 text-xs sm:text-sm">{tab.icon}</span>
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Showcase Card */}
          <AnimatePresence initial={false}>
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.25, ease: "easeOut" }}
              className="bg-primary-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 sm:p-4 md:p-5 shadow-xl overflow-hidden"
            >
              <div className="grid gap-3 sm:gap-5 lg:grid-cols-12 items-center">
                {/* Left Showcase Copy & Highlights */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {activeTab.badge}
                    </span>

                    <h2 className="text-sm sm:text-base md:text-lg font-serif font-bold text-white mb-1 leading-snug">
                      {activeTab.title}
                    </h2>

                    <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed mb-2.5 line-clamp-2">
                      {activeTab.description}
                    </p>

                    {/* Feature Highlights Pills */}
                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {activeTab.highlights.map((highlight, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] sm:text-[11px] text-white/90 font-medium"
                        >
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tab Action CTAs */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                    <Link
                      href={activeTab.ctaHref}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-primary-950 text-xs font-bold rounded-lg shadow-xs transition-all inline-flex items-center gap-1"
                    >
                      <span>{activeTab.ctaText}</span>
                      <span>→</span>
                    </Link>

                    <Link
                      href={activeTab.secondaryCtaHref}
                      className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg border border-white/20 transition-colors"
                    >
                      {activeTab.secondaryCtaText}
                    </Link>
                  </div>
                </div>

                {/* Right Showcase Visual Image */}
                <div className="lg:col-span-5">
                  <div className="relative aspect-[16/10] sm:aspect-[16/10] max-h-[160px] sm:max-h-[190px] rounded-xl overflow-hidden border border-white/25 shadow-md bg-primary-800/80">
                    <Image
                      src={`${activeTab.image}?v=20260817b`}
                      alt={activeTab.imageAlt}
                      fill
                      unoptimized
                      priority
                      className="object-cover"
                    />
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-primary-950/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20 flex items-center justify-between text-[11px] text-white">
                      <span className="font-semibold text-emerald-300 text-[10px] truncate">
                        {activeTab.label}
                      </span>
                      <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded text-white font-bold">
                        Orisinal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
