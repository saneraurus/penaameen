"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Showcase data — Terverifikasi dengan aset foto orisinal           */
/* ------------------------------------------------------------------ */
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
    icon: "🏠",
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
    highlights: [
      "Sistem 200 Menit Tuntas",
      "Formula Kata Anti-Lupa",
      "Untuk Anak & Dewasa",
    ],
  },
  {
    id: "acm",
    label: "Metode ACM",
    icon: "🧒",
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

const quickSearchTags = [
  "Paket 200 Menit",
  "Flashcard Hijaiyah",
  "Buku Guru ACM",
  "Poster Edukasi",
];

const heroMetrics = [
  {
    value: "30+ Tahun",
    label: "Dedikasi Pendidikan",
    sublabel: "Sejak 1995",
    icon: "🏆",
  },
  {
    value: "200 Menit",
    label: "Metode Cepat Tuntas",
    sublabel: "Formula Anti-Lupa",
    icon: "⚡",
  },
  {
    value: "500+ Mitra",
    label: "TPQ & Lembaga Sekolah",
    sublabel: "Di Seluruh Indonesia",
    icon: "🏫",
  },
  {
    value: "8.000+",
    label: "Keluarga Terbimbing",
    sublabel: "Belajar Mandiri di Rumah",
    icon: "👨‍👩‍👧‍👦",
  },
];

export function HeroSection() {
  const router = useRouter();
  const [activeTabId, setActiveTabId] = useState<string>("home-learning");
  const [searchQuery, setSearchQuery] = useState("");

  const activeTab =
    showcaseTabs.find((tab) => tab.id === activeTabId) ?? showcaseTabs[0]!;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/produk?q=${encodeURIComponent(q)}` : "/produk");
  };

  const handleQuickTagClick = (tag: string) => {
    setSearchQuery(tag);
    router.push(`/produk?q=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#06140a] via-primary-950 to-[#051108] text-white">
      {/* ── Background Aesthetic Atmosphere (Subtle Real Visual + Deep Glow) ── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Subtle photo texture overlay */}
        <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay">
          <Image
            src="/images/penaameen/hero/hero-bg-islamic-learning.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-accent-500/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 left-1/3 w-[500px] h-72 bg-emerald-500/10 rounded-full blur-[110px]" />

        {/* Subtle Geometric Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      {/* ── Main Hero Body Container ─────────────────────────────── */}
      <div className="container mx-auto px-4 pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-16 relative z-10 my-auto">
        <div className="grid gap-10 lg:gap-12 xl:gap-16 items-center lg:grid-cols-12">
          {/* ═════════════════════════════════════════════════════════
              LEFT COLUMN : Authority Headline, Value Prop, CTA, Search
          ══════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-6 lg:col-span-7 xl:col-span-6">
            {/* Live Trust Accolade Ribbon */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-400" />
                </span>
                <span className="tracking-wide uppercase text-[11px] font-bold text-accent-300">
                  Penerbit Resmi
                </span>
                <span className="text-white/40">|</span>
                <span className="text-white/80 font-medium text-[11px]">
                  Teruji Sejak 1995
                </span>
              </div>
              <span className="text-white/60 text-xs font-medium hidden sm:inline-flex items-center gap-1.5">
                <span className="text-accent-400">★</span> 500+ Lembaga &amp;
                TPQ
              </span>
            </div>

            {/* Dominant Headline with Master Typography */}
            <div className="space-y-2">
              <h1 className="font-serif font-bold text-white text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] xl:text-[3.8rem] leading-[1.12] tracking-tight text-balance">
                <span>Kuasai Membaca &amp; Mengaji.</span>
                <span className="block mt-1 text-accent-300 font-serif">
                  Lebih Cepat, Tepat &amp;{" "}
                  <span className="bg-gradient-to-r from-amber-200 via-accent-300 to-amber-100 bg-clip-text text-transparent underline decoration-accent-500/40 decoration-wavy decoration-2 underline-offset-8">
                    Anti-Lupa.
                  </span>
                </span>
              </h1>
            </div>

            {/* Sub-headline / Core Positioning */}
            <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed max-w-2xl font-normal">
              Penerbit resmi metode revolusioner{" "}
              <strong className="text-white font-semibold underline decoration-accent-400/50 underline-offset-2">
                AL-BARQY (200 Menit Anti-Lupa)
              </strong>{" "}
              dan{" "}
              <strong className="text-white font-semibold underline decoration-accent-400/50 underline-offset-2">
                ACM (Aku Cepat Membaca Tanpa Mengeja)
              </strong>
              . Membimbing jutaan santri, guru, dan keluarga sejak 1995 dengan
              garansi orisinalitas 100%.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link
                href="/produk"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-accent-500/25 transition-all duration-200 hover:shadow-accent-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Jelajahi Paket &amp; Produk</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
              <Link
                href="/metode"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-sm transition-all duration-200 hover:border-white/40 cursor-pointer"
              >
                Pelajari 2 Metode
              </Link>
            </div>

            {/* Smart Search Bar & Quick Recommendation Chips */}
            <div className="space-y-2.5 pt-2">
              <form
                onSubmit={handleSearchSubmit}
                className="relative w-full max-w-xl group"
              >
                <label htmlFor="hero-search-input" className="sr-only">
                  Cari produk atau metode
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 pointer-events-none text-white/50 group-focus-within:text-accent-300 transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
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
                    id="hero-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari paket Al-Barqy, buku ACM, flashcard..."
                    className="w-full pl-11 pr-24 py-3 bg-white/[0.07] hover:bg-white/[0.1] focus:bg-white/[0.14] text-white placeholder-white/50 border border-white/15 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-accent-400/50 focus:border-accent-400/60 backdrop-blur-md"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-4 py-1.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    Cari
                  </button>
                </div>
              </form>

              {/* Quick Tags */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs text-white/60">
                <span className="text-[11px] font-medium text-white/40">
                  Populer:
                </span>
                {quickSearchTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickTagClick(tag)}
                    className="px-2.5 py-0.5 rounded-md bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 hover:text-white text-[11px] transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════
              RIGHT COLUMN : High-Impact Interactive Showcase Stage
          ══════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-4 lg:col-span-5 xl:col-span-6">
            {/* Interactive Tab Switcher */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/30 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
              {showcaseTabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTabId(tab.id)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-white text-primary-950 shadow-lg shadow-white/10 scale-[1.02]"
                        : "text-white/70 hover:text-white hover:bg-white/[0.08]"
                    }`}
                    aria-pressed={isActive}
                  >
                    <span aria-hidden="true" className="text-sm">
                      {tab.icon}
                    </span>
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Showcase Stage Card (Full visual fidelity, zero placeholders) */}
            <div className="relative rounded-3xl overflow-hidden bg-white/[0.06] border border-white/15 backdrop-blur-xl shadow-2xl transition-all duration-300">
              {/* Authentic Product / Method Photography Stage */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-primary-950">
                <Image
                  src={activeTab.image}
                  alt={activeTab.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  key={activeTab.image}
                />

                {/* Visual Depth Gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/20 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                {/* Top Corner Authenticity Seal */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold">
                  <span className="text-accent-400">✓</span>
                  <span>Aset Orisinal Pena Ameen</span>
                </div>
              </div>

              {/* Showcase Detail Section */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Badge Category Tag */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/20 text-accent-300 text-xs font-bold border border-accent-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                    {activeTab.badge}
                  </span>
                  <span className="text-xs font-medium text-white/50">
                    {activeTab.id === "home-learning"
                      ? "Edisi Keluarga"
                      : "Kurikulum Resmi"}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h2 className="font-serif font-bold text-white text-lg sm:text-xl leading-snug">
                    {activeTab.title}
                  </h2>
                  <p className="mt-1.5 text-xs sm:text-sm text-white/75 leading-relaxed line-clamp-2">
                    {activeTab.description}
                  </p>
                </div>

                {/* Highlights Feature Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeTab.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.08] text-white/90 text-[11px] font-medium border border-white/10"
                    >
                      <svg
                        className="w-3 h-3 text-accent-400 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Direct Action Link Pair */}
                <div className="flex items-center gap-2.5 pt-3 border-t border-white/10">
                  <Link
                    href={activeTab.ctaHref}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>{activeTab.ctaText}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                  <Link
                    href={activeTab.secondaryCtaHref}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white/90 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {activeTab.secondaryCtaText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Impact Metrics Bar (Integrated full-width base ribbon) ── */}
      <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 sm:py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {heroMetrics.map((metric, idx) => (
              <div
                key={metric.label}
                className={`flex items-center gap-3.5 ${
                  idx !== 0 ? "pt-3 md:pt-0 md:pl-6" : ""
                }`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.08] border border-white/15 text-xl shrink-0 shadow-inner">
                  <span aria-hidden="true">{metric.icon}</span>
                </div>
                <div className="min-w-0">
                  <div className="font-serif font-bold text-white text-base sm:text-lg lg:text-xl leading-none">
                    {metric.value}
                  </div>
                  <div className="text-xs font-semibold text-accent-300 mt-1 truncate">
                    {metric.label}
                  </div>
                  <div className="text-[10px] text-white/50 hidden sm:block truncate">
                    {metric.sublabel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Subtitle bottom hairline ─────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-400/30 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
