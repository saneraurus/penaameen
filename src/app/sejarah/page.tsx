// src/app/sejarah/page.tsx
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { HistoryTimelineSection } from "@/components/sections/HistoryTimelineSection";
import { createFoundationMetadata } from "@/presentation/foundation-metadata";
import { methods } from "@/data/methods";
import {
  historyFacts,
  historyFounders,
  historyReach,
  literacyPartners,
  methodTraits,
} from "@/data/history";

export const metadata = createFoundationMetadata("Sejarah");

export default function HistoryPage() {
  return (
    <div className="bg-background-50 text-supporting-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary-50 via-secondary-100 to-background-50 pt-6 pb-16 md:pb-20 border-b border-supporting-200/60">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-100/50 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-accent-100/50 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="container relative px-4 mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-supporting-500 list-none p-0 m-0">
              <li>
                <Link
                  href="/"
                  className="text-supporting-600 hover:text-primary-700 transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/tentang"
                  className="text-supporting-600 hover:text-primary-700 transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-primary-800">
                Sejarah
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-center">
            <div className="lg:col-span-7">
              <span className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200/80 text-xs font-semibold uppercase tracking-wider text-primary-800">
                <span
                  className="flex h-2 w-2 rounded-full bg-primary-500"
                  aria-hidden="true"
                />
                Sejarah Perusahaan
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary-900 tracking-tight leading-[1.15] mb-5">
                Sejarah PENA AMEEN
                <span className="block text-primary-600">
                  Dari PENA SUCI 1995 hingga Hari Ini
                </span>
              </h1>

              <p className="text-base sm:text-lg text-supporting-600 leading-relaxed mb-6 max-w-2xl">
                PENA AMEEN tumbuh dari PENA SUCI, perusahaan printing &amp;
                publishing yang berdiri tahun 1995, dan dari kerja sama jangka
                panjang dengan Al Ameen Serve Holding di Malaysia. Dua metode
                pembelajaran, ACM dan Al-Barqy, menjadi benang merah sepanjang
                perjalanan ini.
              </p>

              {/* Compact arc: 1995 → 2013 → now */}
              <ol className="flex flex-wrap items-center gap-2 mb-8 list-none p-0">
                {[
                  { period: "1995", label: "PENA SUCI" },
                  { period: "2013", label: "PENA AMEEN" },
                  { period: "Kini", label: "Literasi & pelatihan" },
                ].map((step, index) => (
                  <li key={step.period} className="flex items-center gap-2">
                    {index > 0 && (
                      <span className="text-supporting-400" aria-hidden="true">
                        →
                      </span>
                    )}
                    <span className="inline-flex items-center gap-2 bg-white/90 border border-supporting-200 rounded-xl px-3 py-1.5 shadow-2xs">
                      <span className="text-xs font-bold text-primary-700 tabular-nums">
                        {step.period}
                      </span>
                      <span className="text-xs font-medium text-supporting-700">
                        {step.label}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="#garis-waktu"
                  className="px-5 py-3 bg-primary-700 text-white rounded-xl hover:bg-primary-800 transition-colors font-medium text-sm inline-flex items-center gap-2"
                >
                  Lihat Garis Waktu
                  <svg
                    className="h-4 w-4"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </Link>
                <Link
                  href="/metode"
                  className="px-5 py-3 border border-primary-300 text-primary-700 rounded-xl hover:bg-primary-50 transition-colors font-medium text-sm"
                >
                  Kenali Metode
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <figure className="relative m-0">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-supporting-100">
                  <Image
                    src="/images/penaameen/editorial/anak-belajar-mengaji.jpg"
                    alt="Anak belajar mengaji dengan pendampingan"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-caption text-supporting-500 text-center">
                  Metode ACM dan Al-Barqy menemani pembelajar sejak 1995
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Headline facts */}
          <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {historyFacts.map((fact) => (
              <div
                key={fact.value}
                className="bg-white/90 border border-supporting-200 rounded-2xl p-4 shadow-2xs"
              >
                <dt className="text-xl sm:text-2xl font-serif font-bold text-primary-700 tabular-nums">
                  {fact.value}
                </dt>
                <dd className="mt-1 text-xs sm:text-sm text-supporting-600 leading-snug">
                  {fact.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Interactive timeline */}
      <HistoryTimelineSection />

      {/* How PENA AMEEN was formed */}
      <section className="py-16 md:py-24 bg-background-50">
        <div className="container px-4 mx-auto">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
              <span className="mb-3 inline-block text-xs font-semibold tracking-widest uppercase text-primary-700">
                Dua Perusahaan, Satu Nama Baru
              </span>
              <h2 className="text-section font-serif text-primary-900 leading-tight mb-4">
                Bagaimana PENA AMEEN Terbentuk
              </h2>
              <p className="text-supporting-600">
                Kerja sama yang semakin solid antara penerbit Indonesia dan
                Malaysia melahirkan satu badan usaha bersama pada tahun 2013.
              </p>
            </div>
          </Reveal>

          <div className="max-w-5xl mx-auto">
            <div className="grid gap-5 md:grid-cols-2">
              {historyFounders.map((founder, index) => (
                <Reveal key={founder.name} delay={index * 0.1}>
                  <div className="h-full bg-white rounded-3xl border border-supporting-200 shadow-sm p-6 sm:p-7 flex flex-col">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary-100 text-secondary-800 border border-secondary-200">
                        {founder.origin}
                      </span>
                      <span className="text-xs font-medium text-supporting-500">
                        {founder.role}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-primary-800 mb-2">
                      {founder.name}
                    </h3>
                    <p className="text-sm text-supporting-600 leading-relaxed">
                      {founder.detail}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div
              className="flex justify-center py-4 text-supporting-500"
              aria-hidden="true"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>

            <Reveal delay={0.2}>
              <div className="bg-primary-800 text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-md">
                <div className="grid gap-6 md:grid-cols-12 md:gap-8 items-center">
                  <div className="md:col-span-8">
                    <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/15 text-white tabular-nums">
                      2013
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-3">
                      PENA AMEEN
                    </h3>
                    <p className="text-sm sm:text-base text-primary-100 leading-relaxed">
                      PENA SUCI dan Al Ameen Serve Holding membentuk kerja sama
                      yang lebih solid untuk mengembangkan produk-produk yang
                      ada. Peningkatan mutu dan pengembangan produk dilakukan
                      guna memberikan hasil yang terbaik bagi konsumen.
                    </p>
                  </div>
                  <div className="md:col-span-4">
                    <ul className="space-y-2.5 list-none p-0 m-0">
                      {[
                        "Kerja sama lebih solid",
                        "Peningkatan mutu produk",
                        "Pengembangan produk berkelanjutan",
                      ].map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm text-primary-50"
                        >
                          <span
                            className="mt-0.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0"
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Method heritage */}
      <section className="py-16 md:py-24 bg-primary-50 border-y border-primary-100">
        <div className="container px-4 mx-auto">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
              <span className="mb-3 inline-block text-xs font-semibold tracking-widest uppercase text-primary-700">
                Warisan Metodologi
              </span>
              <h2 className="text-section font-serif text-primary-900 leading-tight mb-4">
                Dua Metode yang Menjadi Benang Merah
              </h2>
              <p className="text-supporting-600 mb-6">
                Kedua metode ini mudah diterima oleh kalangan pendidikan karena
                telah teruji secara ilmiah. Metode Al-Barqy dan ACM disusun
                secara ilmiah, memenuhi unsur quantum learning dan quantum
                teaching, serta dikembangkan melalui serangkaian penelitian
                secara terus-menerus.
              </p>
              <ul className="flex flex-wrap justify-center gap-2 list-none p-0 m-0">
                {methodTraits.map((trait) => (
                  <li
                    key={trait}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-800 bg-white border border-primary-200 px-3 py-1.5 rounded-full"
                  >
                    <span aria-hidden="true">✓</span>
                    {trait}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {methods.map((method, index) => (
              <Reveal key={method.id} delay={0.1 + index * 0.1}>
                <div className="h-full bg-white rounded-3xl border border-supporting-200/80 shadow-sm overflow-hidden flex flex-col">
                  <div className="relative aspect-[16/10] bg-secondary-100">
                    <Image
                      src={method.image}
                      alt={method.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-primary-800 mb-2">
                        {method.name}
                      </h3>
                      <p className="text-sm text-supporting-600 leading-relaxed mb-4">
                        {method.description}
                      </p>
                      <p className="text-xs font-medium text-primary-700 bg-primary-50 inline-block px-2.5 py-1 rounded-md mb-5">
                        Untuk: {method.suitableFor}
                      </p>
                    </div>
                    <Link
                      href={`/metode/${method.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:text-primary-800"
                    >
                      Pelajari {method.name}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reach */}
      <section className="py-16 md:py-24 bg-background-100">
        <div className="container px-4 mx-auto">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-center max-w-6xl mx-auto">
            <Reveal className="lg:col-span-5">
              <span className="mb-3 inline-block text-xs font-semibold tracking-widest uppercase text-primary-700">
                Jangkauan
              </span>
              <h2 className="text-section font-serif text-primary-900 leading-tight mb-4">
                Dari Wilayah Indonesia ke Asia Tenggara
              </h2>
              <p className="text-supporting-600 leading-relaxed mb-4">
                Dalam pengembangannya, PENA SUCI mengadakan Training dan
                Workshop ke berbagai wilayah di Indonesia dan mancanegara.
              </p>
              <p className="text-supporting-600 leading-relaxed">
                Melalui kerja sama dengan Al Ameen Serve Holding, produk-produk
                PENA SUCI beredar di berbagai negara di Asia Tenggara, di
                antaranya negara berikut.
              </p>
            </Reveal>

            <Reveal className="lg:col-span-7" delay={0.15}>
              <dl className="grid gap-4 sm:grid-cols-2">
                {historyReach.map((place) => (
                  <div
                    key={place.country}
                    className="bg-white rounded-2xl border border-supporting-200 p-5 shadow-2xs"
                  >
                    <dt className="text-base font-serif font-bold text-primary-800 mb-1">
                      {place.country}
                    </dt>
                    <dd className="text-sm text-supporting-600 leading-snug">
                      {place.note}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Literacy programmes */}
      <section className="py-16 md:py-24 bg-primary-950 text-white border-y border-primary-800">
        <div className="container px-4 mx-auto">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
              <span className="mb-3 inline-block text-xs font-bold tracking-widest uppercase text-emerald-300 bg-white/10 px-3.5 py-1 rounded-full border border-white/20">
                Peran &amp; Dampak Nyata
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight mb-4 drop-shadow-md">
                Pemberantasan Buta Aksara Al-Qur&apos;an &amp; Latin
              </h2>
              <p className="text-white/90 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
                PENA AMEEN menjadi penyedia metode pembelajaran untuk pendidikan anak dan orang dewasa penyandang
                buta aksara di seluruh Indonesia melalui kemitraan bersama berbagai Pemda dan CSR perusahaan nasional.
              </p>
            </div>
          </Reveal>

          <dl className="grid gap-5 sm:grid-cols-3 max-w-4xl mx-auto">
            {literacyPartners.map((partner, index) => (
              <Reveal key={partner.name} delay={index * 0.1}>
                <div className="h-full bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-md hover:bg-white/15 transition-colors">
                  <dt className="text-lg font-serif font-bold text-white mb-1">
                    {partner.name}
                  </dt>
                  <dd className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                    {partner.type}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Continue exploring */}
      <section className="py-16 md:py-24 bg-background-50">
        <div className="container px-4 mx-auto">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center bg-white rounded-3xl p-8 sm:p-12 border border-supporting-200 shadow-sm">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary-950 leading-tight mb-4">
                Lanjutkan Penjelajahan Bersama Pena Ameen
              </h2>
              <p className="text-supporting-600 mb-8 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Kenali PENA AMEEN lebih dekat, pelajari metodenya, atau temukan modul perangkat belajar yang Anda butuhkan.
              </p>
              <div className="flex flex-wrap gap-3.5 justify-center">
                <Link
                  href="/tentang"
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-bold text-sm shadow-xs"
                >
                  Tentang Kami
                </Link>
                <Link
                  href="/metode"
                  className="px-6 py-3 border border-primary-300 text-primary-800 bg-primary-50/50 rounded-xl hover:bg-primary-50 transition-colors font-bold text-sm"
                >
                  Program / Metode
                </Link>
                <Link
                  href="/produk"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-bold text-sm shadow-xs"
                >
                  Jelajahi Produk
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
