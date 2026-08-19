"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    imageAlt: "Santri dan murid belajar membaca Al-Qur'an dengan metode Al-Barqy anti lupa",
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
    imageAlt: "Anak-anak antusias belajar membaca dengan buku dan materi metode ACM",
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

  return (
    <section className="relative overflow-hidden bg-primary-950 text-white section-y">
      {/* ── Orbs dekoratif (subtle, pada background gelap) ─────── */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 bg-primary-800/40 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-700/20 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-10">
        {/* ═══════════════════════════════════════════════════════════
            SPLIT HERO PROFESSIONAL
            KIRI  : teks (headline, deskripsi, CTA, search) — bg gelap
                   , kontras tinggi, mudah dibaca.
            KANAN : gambar hero besar + tab selector di bawahnya.
        ════════════════════════════════════════════════════════════ */}
        <div className="grid gap-10 lg:gap-14 items-center lg:grid-cols-2">

          {/* ── LEFT — Text content: gelap, kontras, profesional ──── */}
          <div className="flex flex-col gap-5 lg:max-w-xl justify-center lg:col-span-1">
            {/* Trust ribbon */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-semibold uppercase tracking-widest border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                Penerbit Resmi
              </span>
              <span className="text-white/50 text-[10px] font-medium">
                • Sejak 1995
              </span>
            </div>

            {/* Headline — serif, besar, kontras tinggi */}
            <h1 className="font-serif font-bold text-white leading-[1.1] tracking-tight text-balance">
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Kuasai Membaca &amp; Mengaji.
              </span>
              <span className="block sm:inline text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-accent-300">
                Lebih Cepat, Tepat &amp;{" "}
                <span className="bg-gradient-to-r from-accent-200 via-accent-300 to-accent-200 bg-clip-text text-transparent">
                  Anti-Lupa.
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-lg">
              Metode resmi{" "}
              <strong className="text-accent-300 font-semibold">
                AL-BARQY (200 Menit)
              </strong>{" "}
              dan{" "}
              <strong className="text-accent-300 font-semibold">
                ACM (Tanpa Mengeja)
              </strong>{" "}
              dari Penerbit Pena Ameen. Teruji membimbing jutaan santri &amp;
              keluarga.
            </p>

            {/* CTA pair */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
              <Link
                href="/produk"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-accent-500/25 transition-all active:scale-[0.98]"
              >
                Jelajahi Paket &amp; Produk
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/metode"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/20 text-white/90 font-medium text-sm sm:text-base hover:bg-white/10 transition-all"
              >
                Pelajari 2 Metode
              </Link>
            </div>

            {/* Search bar — secondary */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full max-w-sm group"
            >
              <label htmlFor="hero-search-input" className="sr-only">
                Cari produk atau metode
              </label>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-white/50 group-focus-within:text-accent-300 transition-colors shrink-0"
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
                  className="w-full px-4 py-2.5 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-white/40 border border-white/10 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-accent-400/50 backdrop-blur-sm"
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

          {/* ── RIGHT — Hero image + tab selector ─────────────────── */}
          <div className="flex flex-col gap-5 lg:col-span-1 lg:order-2">
            {/* Hero image — besar, prominent */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={activeTab.image}
                alt={activeTab.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                key={activeTab.image}
              />
              {/* Gradient samar di bottom gambar supaya badge terbaca */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Caption badge — bottom-left, subtle */}
              <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5">
                <span className="text-white/90 text-[10px] font-semibold">
                  {activeTab.badge}
                </span>
                <span className="text-white/40 text-[10px] ml-2">
                  •{" "}
                  {activeTab.id === "home-learning" ? "Lifestyle" : "Metode"}
                </span>
              </div>
            </div>

            {/* Tab selector — di bawah gambar */}
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
                        ? "bg-white text-primary-950 shadow-md"
                        : "bg-white/10 text-white/80 border border-white/10 hover:bg-white/20 hover:text-white hover:border-white/20"
                    }`}
                    aria-pressed={isActive}
                  >
                    <span aria-hidden="true">{tab.icon}</span>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom edge hairline ─────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
