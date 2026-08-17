// src/app/metode/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getMethodBySlug } from "@/data/methods";
import { products } from "@/data/products";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const method = getMethodBySlug(slug);

  if (!method) {
    return {
      title: "Metode Pembelajaran | Penerbit Pena Ameen",
    };
  }

  return {
    title: method.seo.title,
    description: method.seo.description,
    keywords: method.seo.keywords,
    openGraph: {
      title: method.seo.title,
      description: method.seo.description,
      images: [
        {
          url: method.image,
          alt: method.name,
        },
      ],
    },
  };
}

export default async function MethodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const method = getMethodBySlug(slug);

  if (!method) {
    notFound();
  }

  const relatedProducts = products.filter((p) =>
    method.relatedProductSlugs.includes(p.slug),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: method.name,
    description: method.description,
    provider: {
      "@type": "Organization",
      name: "Penerbit Pena Ameen",
      sameAs: method.officialDomain,
    },
    educationalCredentialAwarded: "Kemampuan Membaca Mandiri Anti Lupa",
    offers: {
      "@type": "AggregateOffer",
      category: "Educational Material & Learning Methods",
      priceCurrency: "IDR",
    },
  };

  const isACM = method.slug === "acm";

  return (
    <div className="min-h-screen bg-background-50 text-supporting-900 pb-20">
      {/* Structured Data JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header & Breadcrumb */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-20 border-b border-supporting-200 shadow-2xs">
        <div className="container px-4 mx-auto py-3.5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-supporting-500"
            >
              <Link
                href="/"
                className="hover:text-primary-700 transition-colors"
              >
                Beranda
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href="/metode"
                className="hover:text-primary-700 transition-colors"
              >
                Program &amp; Metode
              </Link>
              <span aria-hidden="true">/</span>
              <span
                className="font-semibold text-primary-900"
                aria-current="page"
              >
                {method.name}
              </span>
            </nav>

            <div className="flex items-center gap-2">
              {isACM && (
                <a
                  href="https://akucepatmembaca.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <span>🌐 Portal Resmi: akucepatmembaca.com</span>
                  <span>↗</span>
                </a>
              )}
              <Link
                href="/metode"
                className="text-xs font-semibold text-primary-700 hover:text-primary-800"
              >
                ← Semua Metode
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="py-8 md:py-14">
        <div className="container px-4 mx-auto max-w-6xl space-y-16">
          {/* ============================================================ */}
          {/* 1. HERO SECTION: Title, Tagline, Stats, & Photography */}
          {/* ============================================================ */}
          <section className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-center">
            {/* Left: Headline & Manifesto */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider border border-primary-200">
                  METODOLOGI UNGGULAN
                </span>
                <span className="text-xs text-supporting-500 font-medium">
                  • {method.officialReference}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary-950 leading-[1.15] tracking-tight">
                {method.name}
              </h1>

              <p className="text-lg sm:text-xl font-medium text-emerald-800 leading-snug">
                {method.tagline}
              </p>

              <p className="text-sm sm:text-base text-supporting-600 leading-relaxed">
                {method.description}
              </p>

              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                {method.keyStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white border border-supporting-200 shadow-2xs text-center"
                  >
                    <span className="text-base sm:text-lg font-serif font-bold text-primary-900 block mb-0.5">
                      {stat.value}
                    </span>
                    <span className="text-[11px] font-bold text-supporting-700 block leading-tight">
                      {stat.label}
                    </span>
                    <span className="text-[10px] text-supporting-400 mt-0.5 block">
                      {stat.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Media Card with Visual Badge */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-supporting-200 group">
                <Image
                  src={method.image}
                  alt={method.name}
                  fill
                  priority
                  unoptimized
                  className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                />

                {/* Floating Top Left Pill */}
                <div className="absolute top-4 left-4 bg-primary-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-md">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span>✨</span>
                    <span>100% Anti-Lupa</span>
                  </span>
                </div>

                {/* Bottom Floating Info Ribbon */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-supporting-200/80 shadow-lg">
                  <div className="flex items-center justify-between text-xs font-semibold text-primary-900">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {method.targetDuration}
                    </span>
                    <span className="text-[11px] text-supporting-500 bg-supporting-100 px-2 py-0.5 rounded-md">
                      Formula 70:30
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 2. FILOSOFI & PERBANDINGAN: Konvensional vs ACM */}
          {/* ============================================================ */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-supporting-200 shadow-sm space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-100 px-3 py-1 rounded-full">
                  FILOSOFI PEMBELAJARAN
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary-950 mb-3">
                Mengapa Membalik Cara Belajar Membaca?
              </h2>
              <p className="text-sm sm:text-base text-supporting-600 leading-relaxed max-w-4xl">
                {method.philosophy}
              </p>
            </div>

            {/* Comparison Table */}
            <div className="grid gap-6 md:grid-cols-2 pt-2">
              {/* Conventional Column */}
              <div className="p-6 rounded-2xl bg-red-50/50 border border-red-200/80 space-y-4">
                <div className="flex items-center gap-2 text-red-700">
                  <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center font-bold text-xs">
                    ✕
                  </span>
                  <h3 className="text-base font-bold font-serif">
                    Metode Konvensional (Mengeja)
                  </h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-supporting-700">
                  {method.comparison.conventional.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-500 font-bold mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ACM / Al-Barqy Column */}
              <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4">
                <div className="flex items-center gap-2 text-emerald-800">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </span>
                  <h3 className="text-base font-bold font-serif">
                    {isACM
                      ? "Metode ACM (Aku Cepat Membaca)"
                      : "Metode AL-BARQY (Anti Lupa)"}
                  </h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-supporting-800 font-medium">
                  {method.comparison.acm.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">
                        ✓
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 3. 6 KEUNGGULAN UTAMA METODE */}
          {/* ============================================================ */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-100 px-3 py-1 rounded-full border border-primary-200">
                KEUNGGULAN UTAMA
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary-950 mt-2 mb-3">
                6 Alasan Memilih {method.name}
              </h2>
              <p className="text-sm text-supporting-600">
                Dirancang dengan riset pedagogik mendalam agar setiap anak
                merasakan kegembiraan membaca:
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {method.advantages.map((adv, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-supporting-200 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-3xl p-3 rounded-2xl bg-supporting-50 border border-supporting-200/80 inline-block mb-4 shadow-2xs">
                      {adv.icon}
                    </span>
                    <h3 className="text-base font-serif font-bold text-primary-950 mb-2">
                      {adv.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-supporting-600 leading-relaxed">
                      {adv.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/* 4. TAHAPAN KURIKULUM BELAJAR 6 LANGKAH ILMIAH */}
          {/* ============================================================ */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-supporting-200 shadow-sm space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-100 px-3 py-1 rounded-full">
                ROADMAP KURIKULUM
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary-950 mt-2 mb-2">
                Tahapan Sistematis Belajar {method.name}
              </h2>
              <p className="text-sm text-supporting-600 max-w-3xl">
                Alur belajar terstruktur dari pengenalan kata konkret hingga
                kemandirian membaca:
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {method.steps.map((st, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-supporting-50/80 border border-supporting-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider">
                        {st.step}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700">
                        Langkah {idx + 1}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-primary-950 mb-2 leading-snug">
                      {st.title}
                    </h3>

                    <p className="text-xs text-supporting-600 leading-relaxed mb-3">
                      {st.description}
                    </p>
                  </div>

                  {st.examples && (
                    <div className="pt-3 border-t border-supporting-200/80">
                      <span className="text-[10px] text-supporting-400 font-bold uppercase block mb-1">
                        Contoh Materi:
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-emerald-200 inline-block">
                        {st.examples}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/* 5. KOMPOSISI BELAJAR 70:30 & SASARAN */}
          {/* ============================================================ */}
          <section className="grid gap-6 md:grid-cols-2">
            <div className="bg-gradient-to-br from-primary-950 to-primary-900 text-white rounded-3xl p-8 border border-primary-800 shadow-md flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-block mb-3">
                  KOMPOSISI PEMBELAJARAN
                </span>
                <h3 className="text-2xl font-serif font-bold text-white mb-3">
                  Formula Ideal 70% Membaca &amp; 30% Menulis
                </h3>
                <p className="text-sm text-white/80 leading-relaxed mb-6">
                  Menyeimbangkan stimulasi auditori, visual, dan motorik
                  kinestetik anak tanpa membuat tangan lelah.
                </p>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                    <span className="text-xs font-bold text-amber-300 block mb-0.5">
                      📖 {method.composition.reading}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                    <span className="text-xs font-bold text-emerald-300 block mb-0.5">
                      ✏️ {method.composition.writing}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 text-xs text-white/70">
                ✨ {method.composition.concept}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-supporting-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-100 px-3 py-1 rounded-full border border-primary-200 inline-block mb-3">
                  SASARAN PENGGUNA
                </span>
                <h3 className="text-2xl font-serif font-bold text-primary-950 mb-3">
                  Siapa Saja yang Tepat Menggunakan?
                </h3>
                <p className="text-sm text-supporting-600 leading-relaxed mb-6">
                  {method.suitableFor}
                </p>

                <ul className="space-y-2.5 text-xs sm:text-sm text-supporting-700">
                  {method.benefits.map((ben, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">
                        ✓
                      </span>
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {isACM && (
                <div className="mt-6 pt-4 border-t border-supporting-100">
                  <a
                    href="https://akucepatmembaca.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>Kunjungi Portal Resmi AkuCepatMembaca.com</span>
                    <span>↗</span>
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* ============================================================ */}
          {/* 6. PRODUK & MODUL YANG SESUAI DENGAN METODE INI */}
          {/* ============================================================ */}
          {relatedProducts.length > 0 && (
            <section className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-100 px-3 py-1 rounded-full">
                    PERANGKAT BELAJAR RESMI
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary-950 mt-2">
                    Buku &amp; Modul Resmi {method.name}
                  </h2>
                </div>
                <Link
                  href="/produk"
                  className="text-xs font-bold text-primary-700 hover:text-primary-800 flex items-center gap-1"
                >
                  <span>Lihat Seluruh Katalog Produk ({products.length})</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                {relatedProducts.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/produk/${prod.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden border border-supporting-200 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] bg-supporting-100 overflow-hidden">
                      <Image
                        src={`${prod.image}?v=20260817b`}
                        alt={prod.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded uppercase tracking-wider mb-1.5 inline-block">
                        {prod.category}
                      </span>
                      <h3 className="text-sm font-bold text-primary-950 group-hover:text-primary-700 transition-colors line-clamp-1 mb-1">
                        {prod.name}
                      </h3>
                      <p className="text-sm font-bold text-emerald-700 font-serif">
                        Rp{prod.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/* 7. FAQ KHUSUS METODE INI */}
          {/* ============================================================ */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-supporting-200 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-100 px-3 py-1 rounded-full">
                TANYA JAWAB (FAQ)
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary-950 mt-2 mb-2">
                Pertanyaan Populer Seputar {method.name}
              </h2>
              <p className="text-sm text-supporting-600">
                Penjelasan detail untuk menjawab keraguan para orang tua dan
                pendidik:
              </p>
            </div>

            <div className="space-y-3.5">
              {method.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-supporting-50 border border-supporting-200"
                >
                  <h3 className="text-sm sm:text-base font-bold text-primary-950 mb-2 flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">Q:</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-supporting-600 leading-relaxed pl-5">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/* 8. RICH CALL-TO-ACTION BANNER */}
          {/* ============================================================ */}
          <section className="rounded-3xl bg-primary-950 text-white p-8 sm:p-12 text-center shadow-xl border border-primary-800 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-white/20">
                PENA AMEEN • METODOLOGI TERBUKTI
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
                Mulai Pembelajaran {method.name} Hari Ini
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Dapatkan paket modul pembelajaran orisinal atau daftarkan
                lembaga/sekolah Anda untuk pelatihan sertifikasi pengajar.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/produk"
                  className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all text-sm inline-flex items-center gap-2"
                >
                  <span>Pesan Paket Modul Resmi</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/kontak"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all text-sm"
                >
                  Konsultasi / Kemitraan Sekolah
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
