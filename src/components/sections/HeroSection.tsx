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
      "Formula fonetik kata kunci (A-DA-RA-JA, MA-HA-KA-YA) karya KH. Muhadjir Sulthon. Tuntas membaca Al-Qur'an secara tartil tanpa mengeja huruf satu per satu.",
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

/**
 * Opening scene.
 *
 * The photograph is the protagonist: it fills the viewport, and type sits
 * quietly on top of it. Search, showcase switching, and every destination
 * behave exactly as before.
 */
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
    <section className="relative isolate bg-primary-950 text-background-50">
      {/* Full-bleed opening photograph */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/penaameen/hero/hero-family-learning.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary-950/88" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/78 to-primary-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/55 via-transparent to-primary-950/35" />
      </div>

      <div className="container relative z-10 pb-16 pt-20 sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Statement */}
          <div className="lg:col-span-6">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-300">
              <span>Penerbit Resmi</span>
              <span className="h-px w-6 bg-accent-400/60" aria-hidden="true" />
              <span className="text-background-300">Teruji Sejak 1995</span>
            </p>

            <h1 className="display-type mt-7 text-[clamp(2.5rem,7.5vw,5.25rem)] text-background-50">
              Kuasai Membaca &amp; Mengaji.
              <span className="mt-2 block text-accent-200">
                Lebih Cepat, Tepat &amp; Anti-Lupa.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-background-200 sm:text-lg">
              Penerbit resmi metode{" "}
              <strong className="font-semibold text-background-50">
                AL-BARQY (200 Menit Anti-Lupa)
              </strong>{" "}
              dan{" "}
              <strong className="font-semibold text-background-50">
                ACM (Aku Cepat Membaca Tanpa Mengeja)
              </strong>
              . Membimbing santri, guru, dan keluarga sejak 1995.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/produk"
                className="group inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full bg-background-50 px-8 text-sm font-medium text-primary-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white sm:text-base"
              >
                <span>Jelajahi Paket &amp; Produk</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
              <Link
                href="/metode"
                className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/25 px-7 text-sm font-medium text-background-100 transition-colors duration-200 hover:border-white/60 hover:text-white sm:text-base"
              >
                Pelajari 2 Metode
              </Link>
            </div>

            {/* Search */}
            <div className="mt-10 max-w-xl">
              <form onSubmit={handleSearchSubmit} className="group relative">
                <label htmlFor="hero-search-input" className="sr-only">
                  Cari produk atau metode
                </label>
                <div className="relative flex items-center border-b border-white/25 transition-colors focus-within:border-accent-300">
                  <svg
                    className="pointer-events-none h-4 w-4 shrink-0 text-background-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    id="hero-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari paket Al-Barqy, buku ACM, flashcard..."
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-background-50 outline-none placeholder:text-background-400"
                  />
                  <button
                    type="submit"
                    className="shrink-0 px-2 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-300 transition-colors hover:text-accent-200"
                  >
                    Cari
                  </button>
                </div>
              </form>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-background-400">
                  Populer
                </span>
                {quickSearchTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickTagClick(tag)}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-background-200 transition-colors hover:border-white/45 hover:text-white"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Showcase */}
          <div className="lg:col-span-6">
            <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-white/15 pb-4">
              {showcaseTabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTabId(tab.id)}
                    aria-pressed={isActive}
                    className={`relative py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                      isActive
                        ? "text-background-50"
                        : "text-background-400 hover:text-background-200"
                    }`}
                  >
                    <span aria-hidden="true" className="mr-1.5">
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-4 left-0 right-0 h-px origin-left bg-accent-400 transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <figure className="mt-8">
              <div className="image-frame aspect-[4/3] w-full sm:aspect-[16/11]">
                <Image
                  key={activeTab.image}
                  src={activeTab.image}
                  alt={activeTab.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="animate-fade-in object-cover"
                />
              </div>
            </figure>

            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-300">
                {activeTab.badge}
              </p>
              <h2 className="mt-3 font-serif text-xl leading-snug text-background-50 sm:text-2xl">
                {activeTab.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-background-300">
                {activeTab.description}
              </p>

              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {activeTab.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="text-xs text-background-200 before:mr-2 before:text-accent-400 before:content-['—']"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href={activeTab.ctaHref}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-background-50"
                >
                  <span className="border-b border-accent-400 pb-0.5">
                    {activeTab.ctaText}
                  </span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </Link>
                <Link
                  href={activeTab.secondaryCtaHref}
                  className="text-sm text-background-300 transition-colors hover:text-background-100"
                >
                  {activeTab.secondaryCtaText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standing record */}
      <div className="relative z-10 border-t border-white/10">
        <div className="container">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-8 py-10 md:grid-cols-4">
            {heroMetrics.map((metric) => (
              <div key={metric.label}>
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <span className="block font-serif text-2xl leading-none text-background-50 sm:text-3xl">
                    {metric.value}
                  </span>
                  <span className="mt-2.5 block text-xs font-medium text-accent-300">
                    {metric.label}
                  </span>
                  <span className="mt-1 block text-[11px] text-background-400">
                    {metric.sublabel}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
