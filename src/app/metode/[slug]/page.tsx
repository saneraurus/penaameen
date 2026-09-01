// src/app/metode/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getMethodBySlug } from "@/data/methods";
import { products } from "@/data/products";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import {
  SceneIndex,
  SectionHeading,
  Shell,
  ActionLink,
} from "@/components/ui/primitives";
import { CinematicScene } from "@/components/story/StoryScene";

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

      {/* Cinematic Hero */}
      <CinematicScene
        image={method.image}
        imageAlt={method.name}
        eyebrow={
          <span className="text-xs font-bold uppercase tracking-wider text-primary-300">
            Metodologi Unggulan
          </span>
        }
        headline={method.name}
        body={method.tagline}
        priority
        height="tall"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <ActionLink href="/produk" tone="inverse" size="lg">
              Pesan Paket Modul Resmi
            </ActionLink>
            <ActionLink href="/kontak" tone="ghost" size="lg">
              Konsultasi / Kemitraan Sekolah
            </ActionLink>
          </div>
        }
      />

      {/* Breadcrumb */}
      <div className="border-b border-supporting-200 bg-white">
        <Shell className="py-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-supporting-500">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-primary-900"
                >
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/metode"
                  className="transition-colors hover:text-primary-900"
                >
                  Program &amp; Metode
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li
                className="font-semibold text-primary-900"
                aria-current="page"
              >
                {method.name}
              </li>
            </ol>
          </nav>
        </Shell>
      </div>

      <main className="section-y">
        <Shell className="max-w-6xl space-y-24">
          {/* 1. FILOSOFI & PERBANDINGAN */}
          <section>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-5">
                <Reveal variant="micro">
                  <SceneIndex index="02" label="Filosofi" />
                </Reveal>
                <Reveal variant="medium" delay={0.05}>
                  <SectionHeading level={2} className="mt-5">
                    Mengapa Membalik Cara Belajar Membaca?
                  </SectionHeading>
                </Reveal>
              </div>
              <div className="lg:col-span-7">
                <Reveal variant="small" delay={0.1}>
                  <p className="text-measure text-base leading-relaxed text-supporting-600">
                    {method.philosophy}
                  </p>
                </Reveal>
              </div>
            </div>

            {/* Comparison */}
            <div className="mt-14 grid gap-8 md:grid-cols-2">
              <Reveal variant="small" delay={0.1}>
                <div className="rounded-3xl border border-supporting-200 bg-white p-8 shadow-2xs">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-supporting-100 text-supporting-700 font-bold text-sm">
                      ✕
                    </span>
                    <h3 className="font-serif text-xl font-bold text-supporting-900">
                      Metode Konvensional (Mengeja)
                    </h3>
                  </div>
                  <ul className="space-y-3 text-sm text-supporting-700">
                    {method.comparison.conventional.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-supporting-300 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal variant="small" delay={0.18}>
                <div className="rounded-3xl border border-primary-200 bg-primary-50/50 p-8 shadow-2xs">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white font-bold text-sm">
                      ✓
                    </span>
                    <h3 className="font-serif text-xl font-bold text-primary-900">
                      {isACM
                        ? "Metode ACM (Aku Cepat Membaca)"
                        : "Metode AL-BARQY (Anti Lupa)"}
                    </h3>
                  </div>
                  <ul className="space-y-3 text-sm text-supporting-800 font-medium">
                    {method.comparison.acm.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white flex-shrink-0">
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </section>

          {/* 2. KEY STATS */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {method.keyStats.map((stat, idx) => (
              <Reveal key={idx} variant="small" delay={idx * 0.06}>
                <div className="rounded-3xl border border-supporting-200 bg-white p-6 text-center shadow-2xs hover:shadow-md transition-shadow">
                  <span className="block text-2xl sm:text-3xl font-serif font-bold text-primary-900 mb-1">
                    {stat.value}
                  </span>
                  <span className="block text-xs font-bold text-supporting-700 mb-1">
                    {stat.label}
                  </span>
                  <span className="block text-[11px] text-supporting-400">
                    {stat.detail}
                  </span>
                </div>
              </Reveal>
            ))}
          </section>

          {/* 3. 6 KEUNGGULAN UTAMA */}
          <section>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <Reveal variant="micro">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200 mb-3">
                  Keunggulan Utama
                </span>
              </Reveal>
              <Reveal variant="medium" delay={0.05}>
                <SectionHeading level={2} className="mt-4">
                  6 Alasan Memilih {method.name}
                </SectionHeading>
              </Reveal>
              <Reveal variant="small" delay={0.1}>
                <p className="mt-4 text-sm text-supporting-600">
                  Dirancang dengan riset pedagogik mendalam agar setiap anak
                  merasakan kegembiraan membaca:
                </p>
              </Reveal>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {method.advantages.map((adv, idx) => (
                <Reveal key={idx} variant="small" delay={idx * 0.06}>
                  <div className="h-full rounded-3xl border border-supporting-200 bg-white p-7 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <span className="text-3xl p-3 rounded-2xl bg-supporting-50 border border-supporting-200/80 inline-block mb-5 shadow-2xs">
                        {adv.icon}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-primary-950 mb-2">
                        {adv.title}
                      </h3>
                      <p className="text-sm text-supporting-600 leading-relaxed">
                        {adv.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* 4. TAHAPAN KURIKULUM */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-supporting-200 shadow-sm">
            <div className="mb-10">
              <Reveal variant="micro">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200 mb-3">
                  Roadmap Kurikulum
                </span>
              </Reveal>
              <Reveal variant="medium" delay={0.05}>
                <SectionHeading level={2} className="mt-4">
                  Tahapan Sistematis Belajar {method.name}
                </SectionHeading>
              </Reveal>
              <Reveal variant="small" delay={0.1}>
                <p className="mt-3 text-sm text-supporting-600 max-w-3xl">
                  Alur belajar terstruktur dari pengenalan kata konkret hingga
                  kemandirian membaca:
                </p>
              </Reveal>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {method.steps.map((st, idx) => (
                <Reveal key={idx} variant="small" delay={idx * 0.05}>
                  <div className="h-full rounded-2xl border border-supporting-200 bg-supporting-50/80 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="px-3 py-1 rounded-lg bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider">
                          {st.step}
                        </span>
                        <span className="text-[11px] font-bold text-primary-600">
                          Langkah {idx + 1}
                        </span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-primary-950 mb-2 leading-snug">
                        {st.title}
                      </h3>
                      <p className="text-xs text-supporting-600 leading-relaxed">
                        {st.description}
                      </p>
                    </div>
                    {st.examples && (
                      <div className="mt-4 pt-4 border-t border-supporting-200/80">
                        <span className="text-[10px] text-supporting-400 font-bold uppercase block mb-1.5">
                          Contoh Materi:
                        </span>
                        <span className="text-xs font-bold text-primary-800 bg-white px-2.5 py-1 rounded-md border border-primary-200 inline-block">
                          {st.examples}
                        </span>
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* 5. KOMPOSISI BELAJAR 70:30 & SASARAN */}
          <section className="grid gap-8 md:grid-cols-2">
            <Reveal variant="small" delay={0.05}>
              <div className="h-full rounded-3xl bg-primary-950 text-white p-8 sm:p-10 border border-primary-800 shadow-md flex flex-col justify-between">
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-3 py-1 rounded-full border border-white/20 mb-4">
                    Komposisi Pembelajaran
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">
                    Formula Ideal 70% Membaca &amp; 30% Menulis
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed mb-8">
                    Menyeimbangkan stimulasi auditori, visual, dan motorik
                    kinestetik anak tanpa membuat tangan lelah.
                  </p>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/10 border border-white/15">
                      <span className="text-sm font-bold text-amber-300 block">
                        📖 {method.composition.reading}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/10 border border-white/15">
                      <span className="text-sm font-bold text-emerald-300 block">
                        ✏️ {method.composition.writing}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-5 border-t border-white/15 text-xs text-white/70">
                  ✨ {method.composition.concept}
                </div>
              </div>
            </Reveal>
            <Reveal variant="small" delay={0.12}>
              <div className="h-full rounded-3xl border border-supporting-200 bg-white p-8 sm:p-10 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200 mb-4">
                    Sasaran Pengguna
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary-950 mb-4">
                    Siapa Saja yang Tepat Menggunakan?
                  </h3>
                  <p className="text-sm text-supporting-600 leading-relaxed mb-6">
                    {method.suitableFor}
                  </p>
                  <ul className="space-y-3 text-sm text-supporting-700">
                    {method.benefits.map((ben, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-primary-700 flex-shrink-0">
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {isACM && (
                  <div className="mt-8 pt-5 border-t border-supporting-100">
                    <a
                      href="https://akucepatmembaca.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:text-primary-800 transition-colors"
                    >
                      <span>Kunjungi Portal Resmi AkuCepatMembaca.com</span>
                      <span>↗</span>
                    </a>
                  </div>
                )}
              </div>
            </Reveal>
          </section>

          {/* 6. PRODUK & MODUL YANG SESUAI */}
          {relatedProducts.length > 0 && (
            <section>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
                <div>
                  <Reveal variant="micro">
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200 mb-3">
                      Perangkat Belajar Resmi
                    </span>
                  </Reveal>
                  <Reveal variant="medium" delay={0.05}>
                    <SectionHeading level={2} className="mt-4">
                      Buku &amp; Modul Resmi {method.name}
                    </SectionHeading>
                  </Reveal>
                </div>
                <Reveal variant="small" delay={0.1}>
                  <ActionLink href="/produk" tone="ghost">
                    Lihat Seluruh Katalog Produk ({products.length})
                  </ActionLink>
                </Reveal>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                {relatedProducts.map((prod) => (
                  <Reveal key={prod.id} variant="small" delay={0.05}>
                    <Link href={`/produk/${prod.slug}`} className="group block">
                      <div className="image-frame image-frame-zoom aspect-[4/3] w-full mb-4">
                        <Image
                          src={`${prod.image}?v=20260817b`}
                          alt={prod.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded uppercase tracking-wider inline-block mb-2">
                        {prod.category}
                      </span>
                      <h3 className="font-serif text-base font-bold text-primary-950 group-hover:text-primary-700 transition-colors mb-1 line-clamp-1">
                        {prod.name}
                      </h3>
                      <p className="text-sm font-bold text-primary-700 font-serif">
                        Rp{prod.price.toLocaleString("id-ID")}
                      </p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {/* 7. FAQ */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-supporting-200 shadow-sm">
            <div className="mb-8">
              <Reveal variant="micro">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200 mb-3">
                  Tanya Jawab (FAQ)
                </span>
              </Reveal>
              <Reveal variant="medium" delay={0.05}>
                <SectionHeading level={2} className="mt-4">
                  Pertanyaan Populer Seputar {method.name}
                </SectionHeading>
              </Reveal>
              <Reveal variant="small" delay={0.1}>
                <p className="mt-3 text-sm text-supporting-600">
                  Penjelasan detail untuk menjawab keraguan para orang tua dan
                  pendidik:
                </p>
              </Reveal>
            </div>

            <div className="space-y-4">
              {method.faqs.map((faq, idx) => (
                <Reveal key={idx} variant="small" delay={idx * 0.04}>
                  <div className="rounded-2xl border border-supporting-200 bg-supporting-50 p-6">
                    <h3 className="font-serif text-base font-bold text-primary-950 mb-2 flex items-start gap-3">
                      <span className="text-primary-600 font-bold">Q:</span>
                      <span>{faq.question}</span>
                    </h3>
                    <p className="text-sm text-supporting-600 leading-relaxed pl-8">
                      {faq.answer}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* 8. CTA Banner */}
          <section className="rounded-3xl bg-primary-950 text-white p-8 sm:p-12 text-center shadow-xl border border-primary-800 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <Image
                src={method.image}
                alt=""
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <Reveal variant="micro">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-white/20">
                  PENA AMEEN • METODOLOGI TERBUKTI
                </span>
              </Reveal>
              <Reveal variant="medium" delay={0.05}>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                  Mulai Pembelajaran {method.name} Hari Ini
                </h2>
              </Reveal>
              <Reveal variant="small" delay={0.1}>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                  Dapatkan paket modul pembelajaran orisinal atau daftarkan
                  lembaga/sekolah Anda untuk pelatihan sertifikasi pengajar.
                </p>
              </Reveal>
              <Reveal variant="small" delay={0.14}>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <ActionLink href="/produk" tone="clay" size="lg">
                    Pesan Paket Modul Resmi
                  </ActionLink>
                  <ActionLink href="/kontak" tone="inverse" size="lg">
                    Konsultasi / Kemitraan Sekolah
                  </ActionLink>
                </div>
              </Reveal>
            </div>
          </section>
        </Shell>
      </main>
    </div>
  );
}
