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
      "Setiap anak dan pembelajar dewasa memiliki kecepatan serta gaya belajar yang unik (visual, auditori, atau kinestetik). Kami membantu orang tua dan pendidik mengidentifikasi kesiapan awal agar proses belajar tidak menimbulkan stres.",
    badge: "Langkah Awal • Tanpa Tekanan",
    tagline: "✨ Pondasi Nyaman Sejak Awal",
    image: "/images/penaameen/journey/step-1-kenali.jpg",
    imageAlt:
      "Ibu dan anak berdiskusi hangat memeriksa kartu kesiapan belajar membaca",
    highlights: [
      {
        label: "Evaluasi Ramah",
        desc: "Kenali minat awal tanpa tes yang membebani psikologis anak.",
      },
      {
        label: "Pemetaan Gaya",
        desc: "Tentukan apakah anak lebih responsif dengan warna, bunyi, atau gerakan.",
      },
      {
        label: "Target Realistis",
        desc: "Susun ritme belajar bertahap yang fleksibel sesuai rutinitas harian keluarga.",
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
      "PENA AMEEN menyediakan dua metodologi unggulan terstruktur: ACM (Aku Cepat Membaca) dengan pendekatan bermain ceria untuk anak usia dini, dan AL-BARQY dengan formula kata anti-lupa cepat 200 menit untuk membaca Al-Qur'an.",
    badge: "Kurikulum Terbukti",
    tagline: "🎯 Metode Cepat & Melekat Kuat",
    image: "/images/penaameen/methods/method-albarqy.jpg",
    imageAlt: "Santri membaca Al-Qur'an dengan panduan metode terstruktur",
    highlights: [
      {
        label: "Jalur ACM (Latin)",
        desc: "Lancar membaca kata & kalimat tanpa mengeja huruf satu per satu.",
      },
      {
        label: "Jalur AL-BARQY (Al-Qur'an)",
        desc: "Sistem bunyi terstruktur 200 menit, mudah diingat seumur hidup.",
      },
      {
        label: "Pendekatan Integratif",
        desc: "Bisa dipelajari secara bertahap atau bersamaan untuk hasil optimal.",
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
      "Buku panduan, poster klasikal, flashcard interaktif & blok aktivitas.",
    description:
      "Perangkat fisik PENA AMEEN dirancang ergonomis dengan visual menarik dan ramah anak. Media bantu ini mengubah teori menjadi pengalaman multisensori yang memikat rasa ingin tahu.",
    badge: "Media Lengkap & Menyenangkan",
    tagline: "📚 Alat Peraga Edukatif Interaktif",
    image: "/images/penaameen/journey/step-3-perangkat.jpg",
    imageAlt:
      "Koleksi buku, kartu belajar hijaiyah, dan perangkat edukasi PENA AMEEN",
    highlights: [
      {
        label: "Buku Panduan Step-by-Step",
        desc: "Tata letak bersih, font ramah anak, dan ilustrasi kontekstual.",
      },
      {
        label: "Flashcard & Kartu Kata",
        desc: "Mempercepat daya ingat visual melalui permainan tebak kata gembira.",
      },
      {
        label: "Poster Klasikal & Dinding",
        desc: "Menciptakan lingkungan literasi yang terus terlihat di ruang belajar.",
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
    subtitle:
      "Membangun kebiasaan positif dan ikatan kasih sayang (bonding) yang hangat.",
    description:
      "Kunci keberhasilan belajar bukan pada durasi yang lama dan melelahkan, melainkan pada konsistensi yang ceria. 15 hingga 20 menit pendampingan setiap hari sudah cukup menghasilkan lompatan kemampuan yang nyata.",
    badge: "Rutinitas Ceria",
    tagline: "⏱️ Cukup 15–20 Menit / Hari",
    image: "/images/penaameen/journey/step-4-latihan.jpg",
    imageAlt:
      "Ayah dan anak gembira berlatih menulis dan membaca bersama di meja rumah",
    highlights: [
      {
        label: "Bebas Rasa Bosan",
        desc: "Sesi singkat dengan variasi permainan menjaga antusiasme tetap tinggi.",
      },
      {
        label: "Modul Panduan Guru & Orang Tua",
        desc: "Instruksi praktis bagi pendamping tanpa perlu latar belakang pedagogi rumit.",
      },
      {
        label: "Apresiasi Berkala",
        desc: "Fokus pada kemajuan kecil untuk membangun kepercayaan diri anak.",
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
      "Mampu membaca lancar, cinta belajar, dan memiliki akhlak yang baik.",
    description:
      "Hasil akhir dari ekosistem PENA AMEEN bukan hanya sekadar kelancaran mengeja atau membaca teks, melainkan tumbuhnya cinta membaca seumur hidup, kecintaan pada Al-Qur'an, dan karakter percaya diri.",
    badge: "Hasil Nyata & Karakter",
    tagline: "🏆 Mandiri, Cerdas & Berakhlak",
    image: "/images/penaameen/journey/step-5-tumbuh.jpg",
    imageAlt:
      "Siswi Indonesia berprestasi tersenyum bangga memegang piagam dan membaca buku dengan percaya diri",
    highlights: [
      {
        label: "Kemandirian Belajar",
        desc: "Anak mampu membuka dan membaca buku secara mandiri tanpa disuruh.",
      },
      {
        label: "Kesiapan Jenjang Lanjut",
        desc: "Pondasi kuat untuk menghadapi kurikulum sekolah dasar dan tilawah Al-Qur'an.",
      },
      {
        label: "Cinta Nilai Kebajikan",
        desc: "Membangun kedekatan emosional anak dengan keluarga dan nilai spiritual.",
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
    <section className="py-16 md:py-24 bg-background-100 border-t border-supporting-200/60 overflow-hidden">
      <div className="container px-4 mx-auto">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
            <span className="mb-3 inline-block text-xs font-semibold tracking-widest uppercase text-primary-600 bg-primary-50 px-3.5 py-1 rounded-full border border-primary-200/70">
              ALUR PENDAMPINGAN EFEKTIF
            </span>
            <h2 className="text-section font-serif text-primary-900 leading-tight mb-4">
              Perjalanan Belajar Bersama PENA AMEEN
            </h2>
            <p className="text-supporting-600 text-base sm:text-lg">
              Sebuah panduan terstruktur 5 langkah dari pengenalan awal hingga
              kemandirian membaca yang menyenangkan dan berkarakter.
            </p>
          </div>
        </Reveal>

        {/* Step Progress Navigation Bar */}
        <Reveal delay={0.1}>
          <div className="max-w-4xl mx-auto mb-10 md:mb-12">
            <div className="grid grid-cols-5 gap-2 sm:gap-3 bg-white p-2 rounded-2xl sm:rounded-3xl shadow-xs border border-supporting-200">
              {journeyStages.map((stage, idx) => {
                const isActive = idx === activeStepIndex;
                const isPast = idx < activeStepIndex;

                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`group relative flex flex-col items-center py-2.5 px-1 sm:px-3 rounded-xl sm:rounded-2xl transition-all duration-300 text-center ${
                      isActive
                        ? "bg-primary-600 text-white shadow-sm ring-2 ring-primary-600 ring-offset-2"
                        : isPast
                          ? "bg-primary-50 text-primary-800 hover:bg-primary-100"
                          : "bg-transparent text-supporting-600 hover:bg-background-50"
                    }`}
                    aria-label={`Langkah ${stage.number}: ${stage.stepName}`}
                  >
                    <span
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-colors ${
                        isActive
                          ? "bg-white text-primary-700"
                          : isPast
                            ? "bg-primary-200 text-primary-800"
                            : "bg-supporting-200 text-supporting-700 group-hover:bg-supporting-300"
                      }`}
                    >
                      {stage.number}
                    </span>
                    <span
                      className={`text-[10px] sm:text-xs font-medium leading-tight line-clamp-1 ${
                        isActive ? "text-white font-semibold" : ""
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
          <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-supporting-200/90 transition-all duration-500">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              {/* Left Column: Contextual Details & Guidance */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-primary-100 text-primary-800 rounded-full">
                      Tahap {activeStage.number} dari 05
                    </span>
                    <span className="text-xs font-medium text-supporting-500">
                      • {activeStage.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary-900 leading-tight mb-2">
                    {activeStage.title}
                  </h3>
                  <p className="text-sm sm:text-base font-medium text-primary-700 mb-4">
                    {activeStage.subtitle}
                  </p>
                  <p className="text-sm sm:text-base text-supporting-600 leading-relaxed mb-6">
                    {activeStage.description}
                  </p>

                  {/* Highlights checklist */}
                  <div className="space-y-3 pt-2 border-t border-supporting-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-supporting-500">
                      Poin Kunci Pendampingan:
                    </h4>
                    {activeStage.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          ✓
                        </div>
                        <p className="text-xs sm:text-sm text-supporting-700">
                          <strong className="text-primary-800">
                            {h.label}:
                          </strong>{" "}
                          {h.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stage CTA & Navigation Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-supporting-100">
                  <Link
                    href={activeStage.ctaHref}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl text-sm inline-flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <span>{activeStage.ctaText}</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setActiveStepIndex((prev) => Math.max(0, prev - 1))
                      }
                      disabled={activeStepIndex === 0}
                      className="p-2.5 rounded-xl border border-supporting-200 text-supporting-600 hover:bg-background-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                      aria-label="Tahap Sebelumnya"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <span className="text-xs font-semibold text-supporting-500 px-1">
                      {activeStepIndex + 1} / {journeyStages.length}
                    </span>
                    <button
                      onClick={() =>
                        setActiveStepIndex((prev) =>
                          Math.min(journeyStages.length - 1, prev + 1),
                        )
                      }
                      disabled={activeStepIndex === journeyStages.length - 1}
                      className="p-2.5 rounded-xl border border-supporting-200 text-supporting-600 hover:bg-background-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                      aria-label="Tahap Selanjutnya"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Stage Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border-4 border-white bg-supporting-200 group">
                  <Image
                    key={activeStage.id}
                    src={activeStage.image}
                    alt={activeStage.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                  />
                  {/* Floating Tagline Badge */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/80 shadow-sm">
                    <p className="text-xs sm:text-sm font-semibold text-primary-900 text-center">
                      {activeStage.tagline}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Quick Steps Roadmap Preview */}
        <Reveal delay={0.3}>
          <div className="mt-12 max-w-5xl mx-auto">
            <h4 className="text-xs font-bold uppercase tracking-wider text-supporting-500 text-center mb-6">
              Ringkasan Roadmap Pembelajaran
            </h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {journeyStages.map((stage, idx) => {
                const isSelected = idx === activeStepIndex;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? "bg-white border-primary-500 shadow-sm ring-1 ring-primary-400"
                        : "bg-white/70 border-supporting-200/80 hover:bg-white hover:border-supporting-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            isSelected
                              ? "bg-primary-600 text-white"
                              : "bg-primary-50 text-primary-700"
                          }`}
                        >
                          {stage.number}
                        </span>
                        <span className="text-[11px] text-supporting-400 font-medium">
                          {stage.badge.split("•")[0]?.trim()}
                        </span>
                      </div>
                      <h5 className="text-sm font-serif font-bold text-primary-800 mb-1 leading-snug">
                        {stage.stepName}
                      </h5>
                      <p className="text-xs text-supporting-500 line-clamp-2">
                        {stage.subtitle}
                      </p>
                    </div>
                    <span
                      className={`mt-3 text-[11px] font-medium inline-flex items-center gap-1 ${
                        isSelected
                          ? "text-primary-700 font-bold"
                          : "text-supporting-400"
                      }`}
                    >
                      <span>Lihat Panduan</span>
                      <span>→</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
