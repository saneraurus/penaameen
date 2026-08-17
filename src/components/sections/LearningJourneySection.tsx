"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

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
    <section className="py-14 sm:py-16 md:py-24 bg-background-100/80 border-t border-supporting-200/80 overflow-hidden">
      <div className="container px-4 mx-auto max-w-5xl">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
            <span className="mb-2.5 inline-block text-xs font-bold tracking-widest uppercase text-primary-700 bg-primary-100 px-3.5 py-1 rounded-full border border-primary-200/70">
              ALUR PENDAMPINGAN EFEKTIF
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary-950 leading-tight mb-2.5">
              Perjalanan Belajar Bersama PENA AMEEN
            </h2>
            <p className="text-xs sm:text-sm text-supporting-600">
              Panduan terstruktur 5 langkah dari pengenalan awal hingga
              kemandirian membaca anak.
            </p>
          </div>
        </Reveal>

        {/* Step Progress Navigation Bar */}
        <Reveal delay={0.1}>
          <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5 bg-white p-1.5 sm:p-2 rounded-2xl shadow-2xs border border-supporting-200">
              {journeyStages.map((stage, idx) => {
                const isActive = idx === activeStepIndex;
                const isPast = idx < activeStepIndex;

                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`group relative flex flex-col items-center py-2 px-1 sm:px-2 rounded-xl transition-all duration-200 text-center cursor-pointer ${
                      isActive
                        ? "bg-primary-600 text-white shadow-xs"
                        : isPast
                          ? "bg-primary-50 text-primary-900 hover:bg-primary-100"
                          : "text-supporting-600 hover:bg-supporting-50"
                    }`}
                    aria-label={`Langkah ${stage.number}: ${stage.stepName}`}
                  >
                    <span
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold mb-0.5 transition-colors ${
                        isActive
                          ? "bg-white text-primary-700"
                          : isPast
                            ? "bg-primary-200 text-primary-900"
                            : "bg-supporting-100 text-supporting-700"
                      }`}
                    >
                      {stage.number}
                    </span>
                    <span
                      className={`text-[9px] sm:text-[11px] font-semibold leading-tight line-clamp-1 ${
                        isActive ? "text-white" : ""
                      }`}
                    >
                      {stage.stepName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Active Stage Spotlight Panel */}
        <Reveal delay={0.2}>
          <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-9 shadow-sm border border-supporting-200 transition-all duration-300">
            <div className="grid gap-6 lg:grid-cols-12 items-center">
              {/* Left Column: Contextual Details & Guidance */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-primary-100 text-primary-800 rounded-md">
                      Tahap {activeStage.number} dari 05
                    </span>
                    <span className="text-[11px] font-medium text-supporting-500">
                      • {activeStage.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary-950 leading-tight mb-1.5">
                    {activeStage.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-800 mb-3">
                    {activeStage.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-supporting-600 leading-relaxed mb-4">
                    {activeStage.description}
                  </p>

                  {/* Highlights checklist */}
                  <div className="space-y-2 pt-3 border-t border-supporting-100">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-supporting-400">
                      Poin Kunci Pendampingan:
                    </h4>
                    {activeStage.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs sm:text-sm"
                      >
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                          ✓
                        </span>
                        <p className="text-supporting-700 leading-snug">
                          <strong className="text-primary-950 font-semibold">
                            {h.label}:
                          </strong>{" "}
                          {h.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stage CTA & Navigation Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-supporting-100">
                  <Link
                    href={activeStage.ctaHref}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs sm:text-sm inline-flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <span>{activeStage.ctaText}</span>
                    <span>→</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveStepIndex((prev) => Math.max(0, prev - 1))
                      }
                      disabled={activeStepIndex === 0}
                      aria-label="Tahap Sebelumnya"
                      className="px-3 py-2 text-xs font-bold rounded-xl border border-supporting-200 text-supporting-700 hover:bg-supporting-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Sebelumnya
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
                      className="px-3.5 py-2 text-xs font-bold rounded-xl bg-supporting-900 hover:bg-primary-950 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-2xs"
                    >
                      Selanjutnya →
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Stage Illustration */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-supporting-200 bg-supporting-100">
                  <Image
                    src={activeStage.image}
                    alt={activeStage.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-supporting-200 shadow-2xs flex items-center justify-between text-xs">
                    <span className="font-bold text-primary-950 text-[11px]">
                      Langkah {activeStage.number}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700">
                      {activeStage.stepName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
