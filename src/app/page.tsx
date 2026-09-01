import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

import { Reveal } from "@/components/motion/Reveal";
import {
  Lede,
  SceneIndex,
  Section,
  SectionHeading,
  Shell,
  TextLink,
} from "@/components/ui/primitives";

// Below-the-fold interactive scenes stay dynamically imported to protect TBT.
const LearningJourneySection = dynamic(
  () =>
    import("@/components/sections/LearningJourneySection").then(
      (m) => m.LearningJourneySection,
    ),
  { ssr: true },
);

const TestimonialsSection = dynamic(
  () =>
    import("@/components/sections/TestimonialsSection").then(
      (m) => m.TestimonialsSection,
    ),
  { ssr: true },
);

const FeaturedProductSection = dynamic(
  () =>
    import("@/components/sections/FeaturedProductSection").then(
      (m) => m.FeaturedProductSection,
    ),
  { ssr: true },
);

const ProductCatalogSection = dynamic(
  () =>
    import("@/components/sections/ProductCatalogSection").then(
      (m) => m.ProductCatalogSection,
    ),
  { ssr: true },
);

const articles = [
  {
    slug: "belajar-cepat-mengaji-untuk-anak",
    title:
      "Belajar Cepat Mengaji untuk Anak: Kunci Konsistensi 15 Menit Sehari",
    category: "Tips Belajar",
    image: "/images/penaameen/editorial/anak-belajar-mengaji.jpg",
    date: "12 Januari 2026",
    readTime: "5 min read",
    excerpt:
      "Panduan mendampingi anak belajar membaca Al-Qur'an di rumah tanpa rasa bosan dan tanpa paksaan melalui pendekatan fonetik alami.",
  },
  {
    slug: "metode-albarqy-anti-lupa",
    title: "Mengenal Formula Kata Bunyi Anti-Lupa pada Metode AL-BARQY",
    category: "Metode Al-Qur'an",
    image: "/images/penaameen/methods/logoantilupa.png",
    date: "10 Januari 2026",
    readTime: "6 min read",
    excerpt:
      "Mengapa rumus kata kunci A-DA-RA-JA mampu mengunci ingatan membaca Al-Qur'an seumur hidup hanya dalam 200 menit.",
  },
  {
    slug: "keunggulan-metode-acm",
    title: "Mengapa Metode ACM Efektif Mengajarkan Anak Membaca Tanpa Mengeja",
    category: "Literasi Anak",
    image: "/images/penaameen/methods/albarqy.png",
    date: "8 Januari 2026",
    readTime: "4 min read",
    excerpt:
      "Ulasan ilmiah mengapa menghafal abjad A–Z di awal memperlambat kemampuan membaca anak dan bagaimana ACM mengatasinya.",
  },
] as const;

/** Audiences the catalogue already serves. Copy and imagery are existing. */
const audiences = [
  {
    title: "Anak Usia Dini (PAUD/TK)",
    description: "Lancar membaca huruf Latin tanpa mengeja dan bebas stres.",
    image: "/images/penaameen/products/aktivitas.jpg",
    badge: "Metode ACM",
  },
  {
    title: "Orang Tua di Rumah",
    description: "Modul pendampingan mandiri praktis 15 menit per hari.",
    image: "/images/penaameen/products/home-learning.jpg",
    badge: "Home Learning",
  },
  {
    title: "Guru & Pengajar TPQ",
    description:
      "Perangkat peraga klasikal dinding dan panduan kurikulum kelas.",
    image: "/images/penaameen/products/flashcard.jpg",
    badge: "Alat Peraga Guru",
  },
  {
    title: "Remaja, Dewasa & Mualaf",
    description: "Kuasai membaca Al-Qur'an tartil dalam 200 menit tuntas.",
    image: "/images/penaameen/products/poster.jpg",
    badge: "Al-Barqy 200 Menit",
  },
] as const;

export default function HomePage() {
  return (
    <div className="bg-background-50 text-supporting-900">
      {/* HERO — Compact with image as background */}
      <section className="relative isolate overflow-hidden bg-primary-950 text-background-50">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/penaameen/hero/hero-family-learning.jpg"
            alt="Keluarga belajar membaca bersama dengan produk PENA AMEEN"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* ink veils */}
          <div className="absolute inset-0 bg-primary-950/75 sm:bg-primary-950/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/60 to-primary-950/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/70 to-transparent lg:from-primary-950 lg:via-primary-950/55 lg:to-primary-950/15" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,184,148,0.16),_transparent_60%)] opacity-60" />
        </div>

        <div className="container relative">
          <div className="max-w-3xl py-7 sm:py-12 lg:max-w-[620px] lg:py-16">
            <Reveal variant="micro">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-400 sm:text-[11px] sm:tracking-[0.22em]">
                <span>Penerbit Resmi</span>
                <span
                  className="h-px w-6 bg-accent-400/60"
                  aria-hidden="true"
                />
                <span className="text-background-300">Teruji Sejak 1995</span>
              </p>
            </Reveal>

            <Reveal variant="large" delay={0.05}>
              <h1 className="display-type mt-3 text-[clamp(1.85rem,5vw,3.75rem)] leading-[0.98] text-background-50 sm:mt-5">
                Kuasai Membaca &amp; Mengaji.
                <span className="mt-1 block text-accent-400">
                  Lebih Cepat, Tepat &amp; Anti-Lupa.
                </span>
              </h1>
            </Reveal>

            <Reveal variant="medium" delay={0.12}>
              <p className="mt-3.5 max-w-xl text-[13.5px] leading-relaxed text-background-200 sm:mt-5 sm:text-[15px]">
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
            </Reveal>

            <Reveal variant="small" delay={0.18}>
              <div className="mt-5 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:items-center sm:gap-3">
                <Link
                  href="/produk"
                  className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-background-100 px-6 text-xs font-semibold text-primary-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white sm:min-h-11 sm:px-7 sm:text-sm sm:font-medium"
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
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/25 px-5 text-xs font-medium text-background-100 transition-colors duration-200 hover:border-white/60 hover:text-white sm:min-h-11 sm:px-6 sm:text-sm"
                >
                  Pelajari 2 Metode
                </Link>
              </div>
            </Reveal>

            <Reveal variant="small" delay={0.24}>
              <div className="mt-5 max-w-xl sm:mt-8">
                <form action="/produk" className="group relative">
                  <label htmlFor="hero-search-input" className="sr-only">
                    Cari produk atau metode
                  </label>
                  <div className="relative flex items-center border-b border-white/20 transition-colors focus-within:border-accent-400">
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
                      type="search"
                      name="q"
                      placeholder="Cari paket Al-Barqy, buku ACM, flashcard..."
                      className="w-full bg-transparent px-3 py-2.5 text-xs text-background-50 outline-none placeholder:text-background-400 sm:py-3 sm:text-sm"
                    />
                    <button
                      type="submit"
                      className="shrink-0 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-400 transition-colors hover:text-accent-300 sm:py-2 sm:text-xs sm:tracking-[0.16em]"
                    >
                      Cari
                    </button>
                  </div>
                </form>

                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 sm:mt-3.5 sm:gap-2">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-background-400 sm:text-[11px] sm:tracking-[0.16em]">
                    Populer:
                  </span>
                  {[
                    "Paket 200 Menit",
                    "Flashcard Hijaiyah",
                    "Buku Guru ACM",
                    "Poster Edukasi",
                  ].map((tag) => (
                    <Link
                      key={tag}
                      href={`/produk?q=${encodeURIComponent(tag)}`}
                      className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-background-200 transition-colors hover:border-white/45 hover:text-white sm:px-3 sm:py-1.5 sm:text-xs"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Standing record — compact 2x2 grid on mobile */}
        <div className="relative border-t border-white/10 bg-primary-950/40 backdrop-blur-[2px]">
          <div className="container">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 py-4 sm:gap-x-8 sm:gap-y-6 sm:py-7 md:grid-cols-4">
              <div>
                <dt className="sr-only">Dedikasi Pendidikan</dt>
                <dd>
                  <span className="block font-serif text-lg leading-none text-background-50 sm:text-2xl">
                    30+ Tahun
                  </span>
                  <span className="mt-1 block text-[11px] font-medium text-accent-400 sm:mt-1.5 sm:text-xs">
                    Dedikasi Pendidikan
                  </span>
                  <span className="mt-0.5 block text-[10px] text-background-400 sm:text-[11px]">
                    Sejak 1995
                  </span>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Metode Cepat Tuntas</dt>
                <dd>
                  <span className="block font-serif text-lg leading-none text-background-50 sm:text-2xl">
                    200 Menit
                  </span>
                  <span className="mt-1 block text-[11px] font-medium text-accent-400 sm:mt-1.5 sm:text-xs">
                    Metode Cepat Tuntas
                  </span>
                  <span className="mt-0.5 block text-[10px] text-background-400 sm:text-[11px]">
                    Formula Anti-Lupa
                  </span>
                </dd>
              </div>
              <div>
                <dt className="sr-only">TPQ & Lembaga Sekolah</dt>
                <dd>
                  <span className="block font-serif text-lg leading-none text-background-50 sm:text-2xl">
                    500+
                  </span>
                  <span className="mt-1 block text-[11px] font-medium text-accent-400 sm:mt-1.5 sm:text-xs">
                    Mitra TPQ &amp; Sekolah
                  </span>
                  <span className="mt-0.5 block text-[10px] text-background-400 sm:text-[11px]">
                    Di Seluruh Indonesia
                  </span>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Keluarga Terbimbing</dt>
                <dd>
                  <span className="block font-serif text-lg leading-none text-background-50 sm:text-2xl">
                    8.000+
                  </span>
                  <span className="mt-1 block text-[11px] font-medium text-accent-400 sm:mt-1.5 sm:text-xs">
                    Keluarga Terbimbing
                  </span>
                  <span className="mt-0.5 block text-[10px] text-background-400 sm:text-[11px]">
                    Belajar Mandiri di Rumah
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* MANIFESTO — Editorial story */}
      <Section tone="paper">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal variant="micro">
              <SceneIndex index="01" label="Tentang Pena Ameen" />
            </Reveal>
            <Reveal variant="medium" delay={0.06}>
              <SectionHeading className="mt-6">
                Metode yang menemani, bukan menuntut.
              </SectionHeading>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal variant="small" delay={0.1}>
              <Lede>
                PENA AMEEN menerbitkan metode <strong>AL-BARQY</strong> (Cepat
                Baca Al-Qur&apos;an 200 Menit Anti-Lupa) dan{" "}
                <strong>ACM</strong> (Aku Cepat Membaca Tanpa Mengeja).
              </Lede>
            </Reveal>
            <Reveal variant="small" delay={0.16}>
              <p className="mt-6 text-measure leading-relaxed text-supporting-600">
                Kami telah mendampingi lebih dari 8.000+ keluarga dan 500+
                TPQ/sekolah di Indonesia dan Asia Tenggara.
              </p>
            </Reveal>
            <Reveal variant="small" delay={0.22}>
              <div className="mt-10">
                <TextLink href="/tentang">Kenali profil lengkap</TextLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* METHODS — Compact cards + geometric blur background (70% opacity, 50% blur) */}
      <section className="relative overflow-hidden bg-background-50 py-8 sm:py-10 lg:py-11">
        {/* geometric decor — premium, more visible, controlled blur */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden="true"
        >
          {/* layered blur wrapper — reduced blur to reveal geometry */}
          <div className="absolute inset-0" style={{ filter: "blur(8px)" }}>
            {/* soft blobs — slightly smaller so geometry reads */}
            <div className="absolute -top-20 -right-20 h-[360px] w-[360px] rounded-full bg-accent-200/35" />
            <div className="absolute -bottom-24 -left-20 h-[460px] w-[460px] rounded-full bg-primary-100/45" />
            <div className="absolute left-1/2 top-1/2 h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-[36px] bg-white/30" />
            {/* Islamic geometric tiling — clearer, premium */}
            <svg
              width="100%"
              height="100%"
              className="absolute inset-0 h-full w-full opacity-[0.34]"
            >
              <defs>
                <pattern
                  id="geo-penaa"
                  width="72"
                  height="72"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <rect width="72" height="72" fill="none" />
                  {/* outer diamond — ink, more prominent */}
                  <path
                    d="M36 0 L72 36 L36 72 L0 36 Z"
                    fill="none"
                    stroke="#1b3a2a"
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  {/* inner diamond */}
                  <path
                    d="M36 14 L58 36 L36 58 L14 36 Z"
                    fill="none"
                    stroke="#d09a78"
                    strokeWidth="0.9"
                    opacity="0.9"
                  />
                  {/* center octagon hint */}
                  <circle
                    cx="36"
                    cy="36"
                    r="8.5"
                    fill="none"
                    stroke="#e8b894"
                    strokeWidth="0.9"
                    opacity="1"
                  />
                  <circle
                    cx="36"
                    cy="36"
                    r="2.2"
                    fill="#122b1f"
                    opacity="0.85"
                  />
                  {/* corner dots for premium rhythm */}
                  <circle cx="36" cy="0" r="1.2" fill="#e8b894" opacity="0.7" />
                  <circle
                    cx="72"
                    cy="36"
                    r="1.2"
                    fill="#e8b894"
                    opacity="0.7"
                  />
                  <circle
                    cx="36"
                    cy="72"
                    r="1.2"
                    fill="#e8b894"
                    opacity="0.7"
                  />
                  <circle cx="0" cy="36" r="1.2" fill="#e8b894" opacity="0.7" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#geo-penaa)" />
            </svg>
          </div>
          {/* second unblurred crisp overlay at 18% to pop geometry */}
          <svg
            width="100%"
            height="100%"
            className="absolute inset-0 h-full w-full opacity-[0.09]"
          >
            <defs>
              <pattern
                id="geo-penaa-crisp"
                width="72"
                height="72"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <path
                  d="M36 0 L72 36 L36 72 L0 36 Z"
                  fill="none"
                  stroke="#1b3a2a"
                  strokeWidth="0.6"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geo-penaa-crisp)" />
          </svg>
        </div>
        {/* subtle paper grain */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,184,148,0.12),_transparent_62%)] opacity-50" />

        <div className="container relative">
          <div className="mx-auto max-w-[1080px] space-y-5 lg:space-y-5">
            {/* 02 — Al-Barqy super-compact card */}
            <Reveal variant="small">
              <div className="overflow-hidden rounded-xl border border-supporting-200 bg-white shadow-[0_6px_20px_-12px_rgba(24,23,18,0.14)]">
                <div className="grid gap-0 lg:grid-cols-[1.12fr_0.88fr]">
                  <div className="image-frame image-frame-zoom relative aspect-[16/10] max-h-[260px] w-full overflow-hidden lg:aspect-[4/3] lg:max-h-[280px]">
                    <Image
                      src="/images/penaameen/methods/method-albarqy.jpg"
                      alt="Metode Al-Barqy — membaca Al-Qur'an 200 menit anti-lupa"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-5 sm:p-6 lg:px-7 lg:py-6">
                    <SceneIndex index="02" label="Metode Al-Barqy" />
                    <h3 className="display-type mt-3 text-[clamp(1.35rem,2.6vw,1.65rem)] leading-[1.08] text-supporting-900">
                      200 menit untuk membaca seumur hidup.
                    </h3>
                    <p className="mt-2.5 max-w-[44ch] text-[13px] leading-relaxed text-supporting-600">
                      Formula fonetik kata kunci A-DA-RA-JA mengunci ingatan
                      tanpa mengeja huruf satu per satu — untuk anak hingga
                      dewasa.
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Link
                        href="/metode/al-barqy"
                        className="group inline-flex items-center gap-2 text-sm font-medium text-primary-800 transition-colors hover:text-accent-700"
                      >
                        <span className="border-b border-current pb-0.5">
                          Metode Al-Barqy
                        </span>
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        >
                          &rarr;
                        </span>
                      </Link>
                      <Link
                        href="/produk"
                        className="text-sm text-supporting-500 transition-colors hover:text-primary-800"
                      >
                        Lihat paket terkait
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* 03 — ACM super-compact card */}
            <Reveal variant="small" delay={0.06}>
              <div className="overflow-hidden rounded-xl border border-supporting-200 bg-white shadow-[0_6px_20px_-12px_rgba(24,23,18,0.14)]">
                <div className="grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
                  <div className="flex flex-col justify-center p-5 sm:p-6 lg:px-7 lg:py-6 lg:order-1">
                    <SceneIndex index="03" label="Metode ACM" />
                    <h3 className="display-type mt-3 text-[clamp(1.35rem,2.6vw,1.65rem)] leading-[1.08] text-supporting-900">
                      Membaca kata utuh, tanpa mengeja.
                    </h3>
                    <p className="mt-2.5 max-w-[44ch] text-[13px] leading-relaxed text-supporting-600">
                      Berbasis kata lembaga dan lagu edukatif ceria, dirancang
                      untuk PAUD, TK, SD awal, hingga anak berkebutuhan khusus.
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Link
                        href="/metode/acm"
                        className="group inline-flex items-center gap-2 text-sm font-medium text-primary-800 transition-colors hover:text-accent-700"
                      >
                        <span className="border-b border-current pb-0.5">
                          Metode ACM
                        </span>
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        >
                          &rarr;
                        </span>
                      </Link>
                      <Link
                        href="/produk"
                        className="text-sm text-supporting-500 transition-colors hover:text-primary-800"
                      >
                        Lihat produk ACM
                      </Link>
                    </div>
                  </div>
                  <div className="image-frame image-frame-zoom relative aspect-[16/10] max-h-[260px] w-full overflow-hidden lg:order-2 lg:aspect-[4/3] lg:max-h-[280px]">
                    <Image
                      src="/images/penaameen/methods/method-acm.jpg"
                      alt="Metode ACM — belajar membaca tanpa mengeja untuk anak usia dini"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <LearningJourneySection />

      {/* AUDIENCES — Designer-grade compact editorial cards */}
      <section className="relative overflow-hidden bg-white py-8 sm:py-12 lg:py-14">
        {/* premium background: faint grid + warm blobs */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(27,58,42,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(27,58,42,0.9) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          <div className="absolute -top-28 right-[-60px] h-[360px] w-[520px] rounded-full bg-accent-100/45 blur-[48px]" />
          <div className="absolute -bottom-24 left-[-80px] h-[320px] w-[420px] rounded-full bg-primary-50/60 blur-[40px]" />
          {/* thin top hairline accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-supporting-200 to-transparent" />
        </div>

        <div className="container relative">
          {/* header — tighter, more editorial */}
          <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
            <div className="max-w-[560px]">
              <Reveal variant="micro">
                <SceneIndex index="04" label="Untuk Siapa" />
              </Reveal>
              <Reveal variant="medium" delay={0.06}>
                <h2 className="display-type mt-2 text-[clamp(1.4rem,3vw,2.15rem)] leading-[1.06] text-supporting-900 sm:mt-3">
                  Satu ekosistem, banyak titik mulai.
                </h2>
              </Reveal>
              <Reveal variant="small" delay={0.1}>
                <p className="mt-2 max-w-[46ch] text-xs leading-relaxed text-supporting-600 sm:mt-3 sm:text-[13px]">
                  Dari PAUD hingga dewasa — kurasi jalur belajar sesuai peran
                  &amp; usia. Pilih titik mulai, kami temani sampai lancar.
                </p>
              </Reveal>
            </div>
            <Reveal variant="small" delay={0.14}>
              <Link
                href="/produk"
                className="hidden items-center gap-1.5 rounded-full border border-supporting-200 bg-white px-4 py-2 text-xs font-medium text-supporting-700 shadow-sm transition-all hover:border-primary-900 hover:bg-primary-900 hover:text-white sm:inline-flex"
              >
                Lihat semua jalur
                <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>

          {/* Mobile Snap Carousel + Desktop 4-Col Grid */}
          <div className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide sm:mx-0 sm:mt-8 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
            {audiences.map((item, index) => (
              <Reveal
                key={item.title}
                variant="small"
                delay={index * 0.06}
                className="w-[220px] shrink-0 snap-start sm:w-auto"
              >
                <Link
                  href="/produk"
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-supporting-200 bg-white shadow-[0_2px_10px_-8px_rgba(24,23,18,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-supporting-300 hover:shadow-[0_16px_32px_-14px_rgba(24,23,18,0.18)]"
                >
                  <div className="relative">
                    <div className="image-frame image-frame-zoom aspect-[4/3] w-full">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 220px, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                      {/* soft top scrim for badge legibility */}
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/15 to-transparent opacity-60 sm:h-20" />
                    </div>
                    {/* floating badge + index */}
                    <div className="absolute left-2.5 top-2.5 flex items-center gap-2 sm:left-3 sm:top-3">
                      <span className="inline-flex items-center rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-primary-900 shadow-sm ring-1 ring-black/5 backdrop-blur sm:px-2.5 sm:py-1 sm:text-[10px]">
                        {item.badge}
                      </span>
                    </div>
                    <span className="absolute right-2.5 top-2.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-950/90 text-[9px] font-semibold tracking-widest text-accent-300 shadow-sm ring-1 ring-white/15 sm:right-3 sm:top-3 sm:h-6 sm:w-6 sm:text-[10px]">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <h3 className="font-serif text-[14px] font-semibold leading-snug text-supporting-900 transition-colors group-hover:text-primary-900 sm:text-[15px]">
                      {item.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-supporting-600 sm:mt-1.5 sm:text-[12.5px]">
                      {item.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-primary-700 sm:mt-4 sm:text-xs">
                      <span className="border-b border-transparent pb-0.5 transition-all group-hover:border-primary-700">
                        Jelajahi
                      </span>
                      <span
                        aria-hidden="true"
                        className="translate-x-0 text-[10px] transition-transform group-hover:translate-x-0.5 sm:text-[11px]"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProductSection />

      <ProductCatalogSection />

      <TestimonialsSection />

      {/* GALLERY PREVIEW */}
      <Section tone="canvas" tight>
        <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
          <div className="max-w-xl">
            <Reveal variant="micro">
              <SceneIndex index="05" label="Galeri Kegiatan" />
            </Reveal>
            <Reveal variant="medium" delay={0.06}>
              <SectionHeading className="mt-3 sm:mt-6">
                Pelatihan, workshop, dan kelas yang terus berjalan.
              </SectionHeading>
            </Reveal>
          </div>
          <Reveal variant="small" delay={0.12}>
            <TextLink href="/galeri-kegiatan">Lihat seluruh galeri</TextLink>
          </Reveal>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-0 border border-supporting-200 sm:mt-14 md:grid-cols-4">
          {[
            {
              src: "/images/penaameen/gallery/kegiatan-01.jpg",
              ratio: "square" as const,
            },
            {
              src: "/images/penaameen/gallery/kegiatan-04.jpg",
              ratio: "square" as const,
            },
            {
              src: "/images/penaameen/gallery/kegiatan-09.jpg",
              ratio: "square" as const,
            },
            {
              src: "/images/penaameen/gallery/kegiatan-14.jpg",
              ratio: "square" as const,
            },
          ].map((item, index) => (
            <Reveal
              key={item.src}
              variant="small"
              delay={index * 0.06}
              className="border-supporting-200 [&:nth-child(odd)]:border-r md:[&:nth-child(2)]:border-r"
            >
              <div className="image-frame image-frame-zoom aspect-square w-full">
                <Image
                  src={item.src}
                  alt="Dokumentasi kegiatan dan pelatihan PENA AMEEN"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* PULL QUOTE */}
      <Section tone="paper" tight>
        <div className="max-w-2xl">
          <Reveal variant="medium">
            <blockquote className="border-l border-accent-400 pl-4 sm:pl-10">
              <p className="display-type text-[clamp(1.35rem,2.8vw,2.5rem)] text-supporting-900">
                Belajar membaca bukan perlombaan. Ia perjalanan yang boleh
                dimulai kapan saja.
              </p>
              <footer className="mt-3 text-[10px] uppercase tracking-[0.14em] text-supporting-500 sm:mt-5 sm:text-xs sm:tracking-[0.16em]">
                Manifesto Pena Ameen
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </Section>

      {/* ARTICLES */}
      <Section tone="canvas" tight>
        <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
          <div className="max-w-xl">
            <Reveal variant="micro">
              <SceneIndex index="06" label="Wawasan" />
            </Reveal>
            <Reveal variant="medium" delay={0.06}>
              <SectionHeading className="mt-3 sm:mt-6">
                Catatan untuk pendamping belajar.
              </SectionHeading>
            </Reveal>
          </div>
          <Reveal variant="small" delay={0.12}>
            <TextLink href="/artikel">Semua artikel</TextLink>
          </Reveal>
        </div>
        {/* Mobile Horizontal Snap Carousel + Desktop 3-Column Split */}
        <div className="mt-6 flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide sm:mx-0 sm:mt-14 sm:grid sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-y-0 sm:overflow-visible sm:border-y sm:border-supporting-200 sm:px-0 sm:pb-0">
          {articles.map((article, index) => (
            <Reveal
              key={article.slug}
              variant="small"
              delay={index * 0.07}
              className="w-[260px] shrink-0 snap-start rounded-2xl border border-supporting-200 bg-white p-3.5 shadow-sm sm:w-auto sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:py-8 sm:shadow-none md:px-6 md:py-10 md:first:pl-0 md:last:pr-0"
            >
              <article>
                <Link href={`/artikel/${article.slug}`} className="group block">
                  <div className="image-frame image-frame-zoom aspect-[4/3] w-full">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 260px, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="meta-type mt-3 text-[10px] sm:mt-5 sm:text-xs">
                    {article.category} · {article.readTime}
                  </p>
                  <h3 className="mt-1.5 line-clamp-2 text-[15px] font-medium leading-snug text-supporting-900 transition-colors group-hover:text-accent-700 sm:mt-3 sm:text-[17px]">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-supporting-600 sm:mt-3">
                    {article.excerpt}
                  </p>
                  <p className="mt-2.5 text-[10px] text-supporting-400 sm:mt-4 sm:text-[11px]">
                    {article.date}
                  </p>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FINAL CTA */}
      <section className="relative isolate overflow-hidden bg-primary-950 py-16 text-background-50 sm:py-28">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/penaameen/editorial/editorial-family-bonding.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          className="absolute inset-0 bg-primary-950/70"
          aria-hidden="true"
        />
        <Shell className="relative z-10 text-center">
          <Reveal variant="micro">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-400 sm:text-[11px] sm:tracking-[0.22em]">
              Mulai hari ini
            </p>
          </Reveal>
          <Reveal variant="large" delay={0.06}>
            <p className="display-type mx-auto mt-3 max-w-3xl text-[clamp(1.75rem,4vw,3.5rem)] text-background-50 sm:mt-6">
              Tidak ada yang terlambat untuk mulai membaca.
            </p>
          </Reveal>
          <Reveal variant="small" delay={0.14}>
            <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:mt-10 sm:flex-row sm:gap-3">
              <Link
                href="/produk"
                className="group inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full bg-background-100 px-7 text-xs font-semibold text-primary-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white sm:min-h-13 sm:px-8 sm:text-base sm:font-medium"
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
                href="/kontak"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-6 text-xs font-medium text-background-100 transition-colors duration-200 hover:border-white/60 hover:text-white sm:min-h-13 sm:px-7 sm:text-base"
              >
                Bicara dengan tim kami
              </Link>
            </div>
          </Reveal>
        </Shell>
      </section>
    </div>
  );
}
