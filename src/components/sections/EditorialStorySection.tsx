"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export function EditorialStorySection() {
  const values = [
    {
      icon: "🤍",
      title: "Koneksi Emosional yang Erat",
      desc: "Menjadikan momen belajar 15 menit sehari sebagai ruang kasih sayang dan bonding berkualitas antara orang tua dan anak.",
    },
    {
      icon: "🌿",
      title: "Pondasi Adab & Karakter",
      desc: "Bukan hanya mengejar kecepatan membaca, tetapi menanamkan kecintaan pada Al-Qur'an, rasa ingin tahu, dan akhlak mulia.",
    },
    {
      icon: "🚀",
      title: "Kemandirian Seumur Hidup",
      desc: "Membangun rasa percaya diri agar anak tumbuh menjadi pembelajar mandiri yang gemar membaca tanpa paksaan.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-secondary-100/70 relative overflow-hidden border-y border-supporting-200/60">
      {/* Subtle decorative background circles */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-100/40 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container px-4 mx-auto relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Photo Showcase with Floating Quote */}
          <div className="lg:col-span-6">
            <Reveal>
              <div className="relative">
                {/* Main Photography Container */}
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-supporting-200 group">
                  <Image
                    src="/images/penaameen/editorial/editorial-family-bonding.jpg"
                    alt="Ibu dan anak membaca buku bersama dengan penuh kehangatan dan senyuman"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/80 shadow-xs">
                    <span className="text-xs font-semibold text-primary-800 flex items-center gap-1.5">
                      <span>✨</span>
                      <span>Eksplorasi Hangat &amp; Alami</span>
                    </span>
                  </div>

                  {/* Inner caption at the bottom */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs sm:text-sm font-serif italic text-white/95 leading-snug">
                      &ldquo;Membaca bukan beban tugas, melainkan petualangan
                      penuh cinta bersama keluarga.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Floating Quote Card */}
                <div className="hidden sm:block absolute -bottom-6 -right-6 max-w-xs bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-supporting-200/80 shadow-lg">
                  <div className="flex items-start gap-2.5">
                    <span className="text-2xl text-primary-500 font-serif leading-none">
                      “
                    </span>
                    <p className="text-xs text-supporting-700 leading-relaxed font-medium">
                      Buku adalah jembatan, namun pelukan dan kehadiran tulus
                      Anda adalah kunci yang membuka hati anak.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Editorial Manifesto & Value Pillars */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <Reveal delay={0.2}>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1 bg-primary-100 text-primary-800 rounded-full border border-primary-200/60">
                    MANIFESTO PENA AMEEN
                  </span>
                  <span className="text-xs text-supporting-500 font-medium">
                    • Jiwa Pembelajaran
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary-900 leading-tight mb-5">
                  Belajar Bukan Sekadar Bisa.{" "}
                  <br className="hidden sm:inline" />
                  <span className="text-primary-600">
                    Tapi Menjadi Lebih Dekat.
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-supporting-600 leading-relaxed mb-8">
                  Di balik setiap lembar halaman yang dilalui, ada harapan untuk
                  merekatkan tali kasih sayang, menumbuhkan rasa percaya diri,
                  dan menanamkan nilai-nilai luhur. PENA AMEEN hadir bukan
                  sekadar sebagai metode teknis, melainkan sebagai sahabat
                  pendamping perjalanan belajar setiap keluarga.
                </p>

                {/* 3 Value Pillars */}
                <div className="space-y-4 mb-8">
                  {values.map((val, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/80 backdrop-blur-xs border border-supporting-200/80 hover:bg-white hover:border-primary-200 hover:shadow-xs transition-all duration-300"
                    >
                      <span className="text-xl flex-shrink-0 mt-0.5">
                        {val.icon}
                      </span>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-primary-800 mb-0.5">
                          {val.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-supporting-600 leading-relaxed">
                          {val.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-supporting-200/60">
                  <Link
                    href="/tentang"
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-medium rounded-xl shadow-xs inline-flex items-center gap-2 transition-colors"
                  >
                    <span>Baca Kisah Lengkap PENA AMEEN</span>
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

                  <Link
                    href="/cabang"
                    className="px-5 py-3 bg-white hover:bg-supporting-50 text-primary-700 text-xs sm:text-sm font-medium rounded-xl border border-supporting-200 transition-colors"
                  >
                    Temukan Komunitas &amp; Cabang
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
