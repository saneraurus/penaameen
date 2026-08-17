"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export function EditorialStorySection() {
  const values = [
    {
      icon: "📖",
      title: "Koneksi Emosional yang Erat",
      desc: "Menjadikan sesi belajar 15 menit sehari di rumah sebagai waktu interaksi berkualitas antara orang tua dan anak.",
    },
    {
      icon: "🌿",
      title: "Pondasi Adab & Karakter",
      desc: "Menanamkan kecintaan membaca dan adab memuliakan Al-Qur'an sejak usia dini melalui contoh keteladanan.",
    },
    {
      icon: "🎯",
      title: "Kemandirian Seumur Hidup",
      desc: "Membekali anak kemampuan membaca lancar agar mandiri mempelajari ilmu dan wawasan di jenjang pendidikan berikutnya.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden border-y border-supporting-200/80">
      <div className="container px-4 mx-auto relative z-10 max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-center">
          {/* Left Column: Editorial Photo Showcase */}
          <div className="lg:col-span-6">
            <Reveal>
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-supporting-200 group">
                  <Image
                    src="/images/penaameen/editorial/editorial-family-bonding.jpg"
                    alt="Ibu dan anak membaca buku bersama dengan penuh kehangatan dan senyuman"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-transparent to-transparent opacity-90" />

                  {/* Top Floating Pill */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/80 shadow-xs">
                    <span className="text-xs font-bold text-primary-900 flex items-center gap-1.5">
                      <span>✨</span>
                      <span>Pendampingan Keluarga</span>
                    </span>
                  </div>

                  {/* Inner caption at the bottom */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs sm:text-sm font-serif italic text-white/95 leading-snug">
                      &ldquo;Kemampuan membaca yang kuat berawal dari
                      pendampingan konsisten di rumah.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Floating Note Card */}
                <div className="hidden sm:block absolute -bottom-5 -right-5 max-w-xs bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-supporting-200/90 shadow-xl">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl text-primary-600 font-serif">
                      “
                    </span>
                    <p className="text-xs text-supporting-700 leading-relaxed font-medium">
                      Buku yang tepat dan pendampingan 15 menit sehari membentuk
                      kebiasaan literasi anak seumur hidup.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Editorial Manifesto & Value Pillars */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <Reveal delay={0.15}>
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-widest px-3.5 py-1 bg-primary-100 text-primary-800 rounded-full border border-primary-200/60">
                    MANIFESTO PENA AMEEN
                  </span>
                  <span className="text-xs text-supporting-500 font-medium hidden sm:inline">
                    • Standar Mutu Pendidikan
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary-950 leading-tight mb-4">
                  Belajar Bukan Sekadar Bisa.{" "}
                  <span className="block text-primary-600">
                    Tapi Menjadi Lebih Dekat.
                  </span>
                </h2>

                <p className="text-xs sm:text-sm md:text-base text-supporting-600 leading-relaxed mb-6">
                  PENA AMEEN berkomitmen menyajikan perangkat belajar yang
                  terstruktur secara ilmiah dan ramah anak. Kami percaya proses
                  belajar membaca harus menjadi pengalaman positif yang
                  menumbuhkan rasa percaya diri anak tanpa paksaan.
                </p>

                {/* 3 Value Pillars */}
                <div className="space-y-3 mb-6">
                  {values.map((val, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-supporting-50/80 border border-supporting-200/80 hover:bg-white hover:shadow-2xs transition-all"
                    >
                      <span className="text-lg p-1.5 rounded-xl bg-white border border-supporting-200/80 flex-shrink-0 mt-0.5">
                        {val.icon}
                      </span>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-primary-950 mb-0.5">
                          {val.title}
                        </h3>
                        <p className="text-xs text-supporting-600 leading-snug">
                          {val.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-supporting-200">
                  <Link
                    href="/tentang"
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs inline-flex items-center gap-2 transition-colors"
                  >
                    <span>Baca Kisah Lengkap PENA AMEEN</span>
                    <span>→</span>
                  </Link>

                  <Link
                    href="/cabang"
                    className="px-4 py-2.5 bg-white hover:bg-supporting-50 text-primary-800 text-xs sm:text-sm font-semibold rounded-xl border border-supporting-300 transition-colors"
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
