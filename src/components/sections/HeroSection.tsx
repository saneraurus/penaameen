\"use client\";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Showcase data — konten tidak diubah dari versi sebelumnya        */
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
    icon: "\uD83C\uDFE0",
    badge: "Solusi Belajar di Rumah",
    title: "Dampingi Anak Membaca & Mengaji Mandiri di Rumah",
    description:
      "Perangkat 5-in-1 lengkap: buku utama Al-Barqy, flashcard hijaiyah interaktif, 12 poster edukasi dinding, modul pendamping orang tua, dan tas kanvas. Cukup 15\u201320 menit sehari.",
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
    icon: "\u26A1",
    badge: "Metode Anti Lupa Revolusioner",
    title: "Lancar Membaca Al-Qur\u0027an dalam 200 Menit",
    description:
      "Formula fonetik kata kunci (A-DA-RA-JA, MA-HA-KA-YA) karya KH. Nursyamsu Muhadi. Tuntas membaca Al-Qur\u0027an secara tartil tanpa mengeja huruf satu per satu.",
    image: "/images/penaameen/methods/method-albarqy.jpg",
    imageAlt: "Santri dan murid belajar membaca Al-Qur\u0027an dengan metode Al-Barqy anti lupa",
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
    icon: "\uD83E\uDD82",
    badge: "Aku Cepat Membaca (3\u20138 Tahun)",
    title: "Lancar Membaca Huruf Latin Tanpa Mengeja",
    description:
      "Metode membaca aktif berbasis kata lembaga dan lagu edukatif ceria. Anak langsung membaca kata utuh tanpa mengeja B-A = BA. Tuntas rata-rata dalam 16\u201324 pertemuan.",
    image: "/images/penaameen/methods/method-acm.jpg",
    imageAlt: "Anak-anak antusias belajar membaca dengan buku dan materi metode ACM",
    ctaText: "Lihat Produk ACM",
    ctaHref: "/produk",
    secondaryCtaText: "Metode ACM",
    secondaryCtaHref: "/metode/acm",
    highlights: [
      "100% Tanpa Mengeja",
      "16\u201324 Sesi Pembelajaran",
      "Ramah PAUD/TK & ABK",
    ],
  },
  {
    id: "perangkat",
    label: "Kit & Alat Peraga",
    icon: "\uD83D\uDCC2",
    badge: "Untuk Sekolah & TPQ",
    title: "Standar Kurikulum Pengajaran Guru & Lembaga",
    description:
      "Perangkat ajar kelas: flipchart peraga dinding besar, tongkat penunjuk, buku kurikulum guru, dan sertifikasi pengajar Al-Barqy & ACM di seluruh Indonesia.",
    image: "/images/penaameen/hero/hero-kit-showcase.jpg",
    imageAlt: "Kit perangkat fisik lengkap buku, kartu flashcard, dan alat peraga PENA AMEEN",
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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
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
    router.push(q ? `/produk?q=${encodeURIComponent(q)}` : "/produk");
  };

  return (
    <section className="relative overflow-hidden bg-background-50 text-supporting-900">
      {/* ── Orbs dekoratif (hangat, tidak berat) ───────────────── */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 bg-primary-100/40 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-200/30 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-10">
        {/* ═══════════════════════════════════════════════════════════
            SPLIT HERO — KIRI: pesan; KANAN: visual + tab showcase
        ════════════════════════════════════════════════════════════ */}
        <div className="grid gap-10 lg:gap-16 items-center lg:grid-cols-2">
          {/* ── LEFT COLUMN — Message & Actions ──────────────────── */}
          <div className="flex flex-col gap-5 lg:max-w-xl justify-center">
            {/* Trust ribbon */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-[10px] font-semibold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                Penerbit Resmi
              </span>
              <span className="text-[10px] text-supporting-600 font-medium">
                \u2022 Sejak 1995
              </span>
            </div>

            {/* Headline — serif, besar tapi tidak berisik */}
            <h1 className="font-serif font-bold text-primary-950 leading-[1.1] tracking-tight text-balance">
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Kuasai Membaca &amp; Mengaji.
              </span>
              <span className="block sm:inline text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary-600">
                Lebih Cepat, Tepat &amp;{" "}
                <span className="bg-gradient-to-r from-accent-300 via-accent-400 to-accent-300 bg-clip-text text-transparent">
                  Anti-Lupa.
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-supporting-600 leading-relaxed max-w-lg">
              Metode resmi{" "}
              <strong className="text-primary-800 font-semibold">
                AL-BARQY (200 Menit)
              </strong>{" "}
              dan{" "}
              <strong className="text-primary-800 font-semibold">
                ACM (Tanpa Mengeja)
              </strong>{" "}
              dari Penerbit Pena Ameen. Teruji membimbing jutaan santri &amp;
              keluarga.
            </p>

            {/* Action row: CTA + search, terpisah secara visual */}
            <div className="flex flex-col gap-4">
              {/* CTA pair */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
                <Link
                  href="/produk"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-primary-600/20 transition-all active:scale-[0.98]"
                >
                  Jelajahi Paket &amp; Produk
                  <span aria-hidden="true">\u2192</span>
                </Link>
                <Link
                  href="/metode"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-supporting-300 text-primary-800 font-medium text-sm sm:text-base hover:bg-supporting-50 transition-all"
                >
                  Pelajari 2 Metode
                </Link>
              </div>

              {/* Search — secondary, tidak bersaing dengan CTA */}
              <form
                onSubmit={handleSearchSubmit}
                className="relative w-full max-w-sm group"
              >
                <label htmlFor="hero-search-input" className="sr-only">
                  Cari produk atau metode
                </label>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-supporting-500 group-focus-within:text-primary-600 transition-colors shrink-0"
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
                  <input
                    id="hero-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari paket Al-Barqy, ACM..."
                    className="w-full px-4 py-2.5 bg-white border border-supporting-200 rounded-xl text-sm text-supporting-900 placeholder-supporting-400 outline-none transition-all focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    className="shrink-0 px-3 py-2 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-xs font-semibold transition-colors"
                  >
                    Cari
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────────
              RIGHT COLUMN — Visual + Tab Showcase
          ──────────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4 lg:order-2">
            {/* Tab navigation — lebih tenang, wrap */}
            <div className="flex flex-wrap gap-2">
              {showcaseTabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTabId(tab.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary-950 text-white shadow-md"
                        : "bg-white text-primary-700 border border-supporting-200 hover:bg-primary-50 hover:border-primary-200"
                    }`}
                    aria-pressed={isActive}
                  >
                    <span aria-hidden="true">{tab.icon}</span>
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Showcase visual — image-first, bukan card dense */}
            <div className="relative inline-flex w-full max-w-md">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-supporting-100">
                <Image
                  src={activeTab.image}
                  alt={activeTab.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-opacity duration-300"
                  key={activeTab.image}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-primary-950/25 via-transparent to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {/* Floating info card — mobile: di bawah gambar; desktop: floating */}
              <div
                className="mt-3 bg-white rounded-xl p-4 shadow-lg border border-supporting-200 lg:mt-0 lg:absolute lg:right-0 lg:bottom-0 lg:bg-background-50/95 lg:backdrop-blur-sm lg:shadow-md lg:border-primary-200/40"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800 text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                    {activeTab.badge}
                  </span>
                  <span className="text-[10px] text-supporting-500 font-medium whitespace-nowrap">
                    {activeTab.id === "home-learning" ? "Lifestyle" : "Metode"}
                  </span>
                </div>

                <h2 className="font-serif font-bold text-primary-950 text-base md:text-lg leading-snug mb-1">
                  {activeTab.title}
                </h2>

                <p className="text-xs text-supporting-600 leading-relaxed line-clamp-2 mb-3">
                  {activeTab.description}
                </p>

                {/* Highlights pills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {activeTab.highlights.map((h) => (
                    <span
                      key={h}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-50 text-primary-800 text-[10px] font-medium border border-primary-200"
                    >
                      <svg
                        className="w-3 h-3 text-primary-600 shrink-0"
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
                      {h}
                    </span>
                  ))}
                </div>

                {/* CTAs dalam card */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-supporting-200">
                  <Link
                    href={activeTab.ctaHref}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-xs font-semibold transition-colors"
                  >
                    {activeTab.ctaText}
                    <span aria-hidden="true">\u2192</span>
                  </Link>
                  <Link
                    href={activeTab.secondaryCtaHref}
                    className="inline-flex items-center px-3 py-2 rounded-lg border border-supporting-300 text-primary-800 text-xs font-medium hover:bg-supporting-50 transition-colors"
                  >
                    {activeTab.secondaryCtaText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom edge — transisi halus ke section berikutnya ───── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-supporting-200 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
