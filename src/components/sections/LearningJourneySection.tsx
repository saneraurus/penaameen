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
    <section className="border-t border-supporting-200 bg-white py-16 sm:py-20">
      <div className="container max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="display-type text-supporting-900">
            Perjalanan Belajar Bersama PENA AMEEN
          </h2>
          <p className="scene-index mt-3 justify-center text-[11px]">
            Alur Pendampingan Efektif
          </p>
          <span aria-hidden="true" className="sr-only">
            ALUR PENDAMPINGAN EFEKTIF
          </span>
          <p className="mt-4 text-sm leading-relaxed text-supporting-600">
            Panduan terstruktur 5 langkah dari pengenalan awal hingga
            kemandirian membaca anak.
          </p>
        </div>

        <nav
          aria-label="Langkah perjalanan belajar"
          className="mt-10 flex gap-4 overflow-x-auto border-y border-supporting-200 py-3 sm:justify-center"
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
                className={`relative shrink-0 py-2 text-left transition-colors ${
                  isActive
                    ? "text-supporting-900"
                    : "text-supporting-400 hover:text-supporting-700"
                }`}
              >
                <span className="block text-[11px] font-medium">
                  {stage.number}
                </span>
                <span className="mt-1 block text-xs font-medium leading-tight">
                  {stage.stepName}
                </span>
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-px bg-accent-600 transition-transform ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-supporting-500">
                Tahap {activeStage.number} dari 05 · {activeStage.badge}
              </p>
              <h3 className="mt-3 font-serif text-2xl leading-tight text-supporting-900 sm:text-3xl">
                {activeStage.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-supporting-700">
                {activeStage.subtitle}
              </p>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-supporting-600">
                {activeStage.description}
              </p>

              <ul className="mt-8 space-y-3 border-t border-supporting-100 pt-6">
                {activeStage.highlights.map((h) => (
                  <li
                    key={h.label}
                    className="flex gap-3 text-sm leading-relaxed"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-px w-4 shrink-0 bg-accent-500"
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

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={activeStage.ctaHref}
                  className="inline-flex min-h-10 items-center rounded-full bg-primary-900 px-5 text-sm font-medium text-white transition-colors hover:bg-primary-800"
                >
                  {activeStage.ctaText} →
                </Link>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveStepIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={activeStepIndex === 0}
                    aria-label="Tahap Sebelumnya"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-supporting-300 text-supporting-600 transition-colors hover:border-primary-700 hover:text-primary-800 disabled:cursor-not-allowed disabled:opacity-30"
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
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-supporting-300 text-supporting-600 transition-colors hover:border-primary-700 hover:text-primary-800 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="image-frame aspect-[4/3] w-full">
              <Image
                key={activeStage.image}
                src={activeStage.image}
                alt={activeStage.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-[11px] text-supporting-500">
              Langkah {activeStage.number} · {activeStage.stepName}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
