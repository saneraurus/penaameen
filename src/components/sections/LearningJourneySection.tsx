"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface JourneyStage {
  id: string;
  number: string;
  stepName: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  tagline: string;
  image: string;
  imageAlt: string;
  highlights: { label: string; desc: string }[];
  ctaText: string;
  ctaHref: string;
}

export const journeyStages: JourneyStage[] = [
  {
    id: "kenali",
    number: "01",
    stepName: "Kenali Kebutuhan",
    title: "Identifikasi Gaya & Kesiapan Belajar",
    subtitle:
      "Menemukan titik awal yang paling ramah dan nyaman bagi pembelajar.",
    description:
      "Setiap anak memiliki kesiapan dan kecepatan belajar yang berbeda. Evaluasi awal dilakukan secara informal tanpa tes yang membebani, memastikan anak merasa nyaman sejak hari pertama.",
    badge: "Langkah Awal",
    tagline: "Pondasi Belajar",
    image: "/images/penaameen/journey/step-1-kenali.jpg",
    imageAlt:
      "Ibu dan anak berdiskusi hangat memeriksa kartu kesiapan belajar membaca",
    highlights: [
      {
        label: "Evaluasi Informal",
        desc: "Mengenali kesiapan anak tanpa beban tes akademis.",
      },
      {
        label: "Pemetaan Minat",
        desc: "Menyesuaikan materi dengan respon visual dan audio anak.",
      },
      {
        label: "Target Realistis",
        desc: "Menyusun jadwal belajar 15 menit per hari yang teratur.",
      },
    ],
    ctaText: "Mulai Panduan Belajar",
    ctaHref: "/tentang",
  },
  {
    id: "metode",
    number: "02",
    stepName: "Pilih Metode",
    title: "Pilih Jalur Belajar yang Teruji",
    subtitle:
      "ACM untuk membaca huruf Latin, atau AL-BARQY untuk mengaji Al-Qur'an.",
    description:
      "PENA AMEEN menghadirkan dua metode rujukan: ACM (Aku Cepat Membaca) tanpa mengeja untuk anak usia dini, dan AL-BARQY dengan formula kata anti-lupa 200 menit untuk membaca Al-Qur'an.",
    badge: "Kurikulum Teruji",
    tagline: "Metode Terarah",
    image: "/images/penaameen/methods/method-albarqy.jpg",
    imageAlt: "Santri membaca Al-Qur'an dengan panduan metode terstruktur",
    highlights: [
      {
        label: "Jalur ACM (Latin)",
        desc: "Lancar membaca kata dan kalimat tanpa proses mengeja.",
      },
      {
        label: "Jalur AL-BARQY (Al-Qur'an)",
        desc: "Formula kata fonetik 200 menit langsung lancar tartil.",
      },
      {
        label: "Fleksibel",
        desc: "Dapat dipelajari bertahap di rumah maupun di kelas TPQ.",
      },
    ],
    ctaText: "Jelajahi Pilihan Metode",
    ctaHref: "/metode",
  },
  {
    id: "perangkat",
    number: "03",
    stepName: "Gunakan Perangkat",
    title: "Lengkapi Media Pembelajaran Praktis",
    subtitle:
      "Buku panduan, poster klasikal, flashcard interaktif & modul aktivitas.",
    description:
      "Perangkat fisik PENA AMEEN dirancang ergonomis dengan kertas tebal ramah anak. Media bantu ini memudahkan anak memahami materi secara visual dan kinestetik.",
    badge: "Media Lengkap",
    tagline: "Alat Peraga Edukatif",
    image: "/images/penaameen/journey/step-3-perangkat.jpg",
    imageAlt:
      "Koleksi buku, kartu belajar hijaiyah, dan perangkat edukasi PENA AMEEN",
    highlights: [
      {
        label: "Buku Panduan Step-by-Step",
        desc: "Tata letak bersih, font jelas, dan mudah dipahami anak.",
      },
      {
        label: "Flashcard Hijaiyah",
        desc: "Kartu tebal 2 sisi untuk stimulasi daya ingat visual.",
      },
      {
        label: "Poster Edukasi Dinding",
        desc: "Bagan peraga dinding agar anak terbiasa melihat huruf setiap hari.",
      },
    ],
    ctaText: "Lihat Katalog Perangkat",
    ctaHref: "/produk",
  },
  {
    id: "latihan",
    number: "04",
    stepName: "Latih Konsisten",
    title: "Pendampingan 15–20 Menit Setiap Hari",
    subtitle: "Membangun kebiasaan positif dan rutinitas belajar yang teratur.",
    description:
      "Kunci keberhasilan belajar terletak pada konsistensi harian. Cukup 15 hingga 20 menit pendampingan setiap hari untuk menghasilkan kemajuan membaca yang nyata dan stabil.",
    badge: "Rutinitas Harian",
    tagline: "15–20 Menit/Hari",
    image: "/images/penaameen/journey/step-4-latihan.jpg",
    imageAlt:
      "Ayah dan anak berlatih menulis dan membaca bersama di meja rumah",
    highlights: [
      {
        label: "Durasi Efektif",
        desc: "Sesi singkat menjaga fokus dan daya konsentrasi anak tetap optimal.",
      },
      {
        label: "Modul Pendamping",
        desc: "Instruksi praktis langkah demi langkah untuk orang tua dan guru.",
      },
      {
        label: "Kemajuan Terukur",
        desc: "Evaluasi bertahap untuk memantau kelancaran membaca anak.",
      },
    ],
    ctaText: "Lihat Paket Home Learning",
    ctaHref: "/produk/paket-home-learning-albarqy",
  },
  {
    id: "tumbuh",
    number: "05",
    stepName: "Tumbuh & Mandiri",
    title: "Kemandirian Literasi & Karakter Mulia",
    subtitle:
      "Mampu membaca lancar, gemar belajar, dan memiliki kesiapan sekolah.",
    description:
      "Hasil akhir dari proses belajar adalah tumbuhnya kemandirian membaca, kepercayaan diri menghadapi kurikulum sekolah dasar, serta kecintaan pada Al-Qur'an.",
    badge: "Hasil Nyata",
    tagline: "Mandiri & Berkarakter",
    image: "/images/penaameen/journey/step-5-tumbuh.jpg",
    imageAlt:
      "Siswi Indonesia berprestasi tersenyum bangga membaca buku dengan percaya diri",
    highlights: [
      {
        label: "Kemandirian Belajar",
        desc: "Anak terbiasa membuka dan membaca buku secara mandiri.",
      },
      {
        label: "Kesiapan Sekolah",
        desc: "Pondasi membaca yang kuat sebelum memasuki jenjang SD.",
      },
      {
        label: "Karakter Positif",
        desc: "Membentuk rasa percaya diri dan gemar membaca sejak dini.",
      },
    ],
    ctaText: "Mulai Perjalanan Anda",
    ctaHref: "/produk",
  },
];

export function LearningJourneySection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStage = journeyStages[activeStepIndex] ?? journeyStages[0]!;

  return (
    <section className="relative overflow-hidden bg-primary-950 py-8 sm:py-16 lg:py-20">
      {/* — Standout background: image + ink veil + radial accent + subtle grid — */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="/images/penaameen/hero/hero-bg-islamic-learning.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.14]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950 via-primary-950/90 to-primary-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,184,148,0.16),_transparent_58%)]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* soft vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_60%,_rgba(7,17,13,0.55)_100%)]" />
      </div>

      {/* watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 select-none font-serif text-[11rem] font-bold leading-none tracking-tighter text-white/[0.04] sm:text-[16rem] lg:text-[22rem]"
      >
        05
      </div>

      <div className="container relative max-w-5xl">
        {/* Heading — ink theme */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-400 sm:text-[11px] sm:tracking-[0.2em]">
            <span
              className="h-px w-5 bg-accent-400/60 sm:w-6"
              aria-hidden="true"
            />
            Alur Pendampingan Efektif
            <span
              className="h-px w-5 bg-accent-400/60 sm:w-6"
              aria-hidden="true"
            />
          </p>
          <h2 className="display-type mt-2 text-[clamp(1.5rem,3.2vw,2.3rem)] text-background-50 sm:mt-4">
            Perjalanan Belajar Bersama PENA AMEEN
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-background-300 sm:mt-4 sm:text-sm">
            Panduan terstruktur 5 langkah dari pengenalan awal hingga
            kemandirian membaca anak.
          </p>
        </div>

        {/* Step nav — pill + accent underline for dark */}
        <nav
          aria-label="Langkah perjalanan belajar"
          className="mt-5 flex gap-1.5 overflow-x-auto scrollbar-hide border-y border-white/10 py-2 sm:mt-10 sm:justify-center sm:gap-3 sm:py-3"
        >
          {journeyStages.map((stage, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={stage.id}
                type="button"
                aria-label={`Langkah ${stage.number}: ${stage.stepName}`}
                aria-current={isActive ? "step" : undefined}
                onClick={() => setActiveStepIndex(idx)}
                className={`group relative shrink-0 rounded-full border px-3 py-1.5 text-left transition-all duration-200 sm:px-4 sm:py-2.5 ${
                  isActive
                    ? "border-accent-500/30 bg-white text-primary-900 shadow-sm"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-white/15 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span
                  className={`block text-[9px] font-semibold tracking-[0.14em] sm:text-[10px] sm:tracking-[0.16em] ${
                    isActive
                      ? "text-accent-700"
                      : "text-white/40 group-hover:text-white/60"
                  }`}
                >
                  {stage.number}
                </span>
                <span className="mt-0.5 block text-[11px] font-medium leading-tight sm:text-xs">
                  {stage.stepName}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Content card — white standout on ink */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_24px_64px_-16px_rgba(0,0,0,0.45),0_8px_24px_-8px_rgba(0,0,0,0.35)] sm:mt-12 sm:rounded-[24px]">
          <div className="grid gap-0 lg:grid-cols-12">
            {/* Text */}
            <div className="p-4 sm:p-8 lg:col-span-7 lg:p-10">
              <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-supporting-500 sm:text-[11px] sm:tracking-[0.16em]">
                <span className="h-px w-4 bg-accent-500" aria-hidden="true" />
                Tahap {activeStage.number} dari 05 · {activeStage.badge}
              </p>
              <h3 className="mt-2 font-serif text-xl leading-tight text-supporting-900 sm:mt-3 sm:text-[28px]">
                {activeStage.title}
              </h3>
              <p className="mt-1 text-xs font-medium text-primary-700 sm:mt-2 sm:text-sm">
                {activeStage.subtitle}
              </p>
              <p className="mt-2.5 max-w-prose text-xs leading-relaxed text-supporting-600 sm:mt-4 sm:text-sm">
                {activeStage.description}
              </p>

              <ul className="mt-4 space-y-2 border-t border-supporting-100 pt-4 sm:mt-8 sm:space-y-3 sm:pt-6">
                {activeStage.highlights.map((h) => (
                  <li
                    key={h.label}
                    className="flex gap-2.5 text-xs leading-relaxed sm:gap-3 sm:text-sm"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-px w-3 shrink-0 bg-accent-500 sm:mt-2 sm:w-4"
                    />
                    <span className="text-supporting-700">
                      <strong className="font-medium text-supporting-900">
                        {h.label}
                      </strong>
                      : {h.desc}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-8 sm:gap-3">
                <Link
                  href={activeStage.ctaHref}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-primary-900 px-4 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primary-800 sm:min-h-10 sm:gap-2 sm:px-5 sm:text-sm sm:font-medium"
                >
                  {activeStage.ctaText}
                  <span aria-hidden="true">→</span>
                </Link>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveStepIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={activeStepIndex === 0}
                    aria-label="Tahap Sebelumnya"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-supporting-200 bg-white text-xs text-supporting-600 shadow-sm transition-colors hover:border-primary-700 hover:text-primary-800 disabled:cursor-not-allowed disabled:opacity-30 sm:h-9 sm:w-9 sm:text-sm"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveStepIndex((prev) =>
                        Math.min(journeyStages.length - 1, prev + 1),
                      )
                    }
                    disabled={activeStepIndex === journeyStages.length - 1}
                    aria-label="Tahap Selanjutnya"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-supporting-200 bg-white text-xs text-supporting-600 shadow-sm transition-colors hover:border-primary-700 hover:text-primary-800 disabled:cursor-not-allowed disabled:opacity-30 sm:h-9 sm:w-9 sm:text-sm"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative bg-supporting-50 p-2.5 sm:p-4 lg:col-span-5 lg:p-5">
              <div className="image-frame relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl">
                <Image
                  key={activeStage.image}
                  src={activeStage.image}
                  alt={activeStage.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                {/* subtle top accent */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-500/40 to-transparent" />
              </div>
              <div className="mt-2.5 flex items-center justify-between sm:mt-3">
                <p className="text-[10px] font-medium tracking-[0.06em] text-supporting-500 sm:text-[11px] sm:tracking-[0.08em]">
                  Langkah {activeStage.number} · {activeStage.stepName}
                </p>
                <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-semibold tracking-[0.12em] text-primary-700 shadow-sm ring-1 ring-supporting-200 sm:px-2.5 sm:py-1 sm:text-[10px] sm:tracking-[0.14em]">
                  {activeStage.tagline}
                </span>
              </div>
              {/* index watermark inside card */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-2 right-4 select-none font-serif text-6xl font-bold leading-none text-supporting-900/[0.04]"
              >
                {activeStage.number}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
