"use client";

import Image from "next/image";
import Link from "next/link";
import { Images, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

const previewPhotos = [
  {
    src: "/images/penaameen/gallery/kegiatan-19.jpg",
    alt: "TOT Al-Barqy 2014",
    caption: "TOT Al-Barqy 2014",
  },
  {
    src: "/images/penaameen/gallery/kegiatan-20.jpg",
    alt: "Pelatihan ACM",
    caption: "Pelatihan ACM",
  },
  {
    src: "/images/penaameen/gallery/kegiatan-01.jpg",
    alt: "Workshop Komunitas",
    caption: "Workshop Komunitas",
  },
  {
    src: "/images/penaameen/gallery/kegiatan-09.jpg",
    alt: "Kegiatan Belajar",
    caption: "Kegiatan Belajar",
  },
  {
    src: "/images/penaameen/gallery/kegiatan-17.jpg",
    alt: "Komunitas Al-Qur'an",
    caption: "Komunitas Al-Qur'an",
  },
  {
    src: "/images/penaameen/gallery/kegiatan-23.jpg",
    alt: "Pelatihan Nasional 2019",
    caption: "Pelatihan Nasional",
  },
];

export function GalleryPreviewSection() {
  return (
    <section
      id="galeri-kegiatan-preview"
      className="py-16 md:py-24 bg-primary-950 relative overflow-hidden"
    >
      {/* Decorative background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, #16a34a 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #15803d 0%, transparent 50%)",
        }}
      />

      <div className="container px-4 mx-auto max-w-6xl relative z-10">
        {/* Section header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Images className="h-3.5 w-3.5" />
                Galeri Kegiatan
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
                Momen Bersama Komunitas{" "}
                <span className="text-emerald-400">PENA AMEEN</span>
              </h2>
              <p className="mt-3 text-white/70 text-sm sm:text-base max-w-lg">
                Lebih dari 30 tahun mendampingi jutaan orang belajar membaca
                Al&#x2011;Qur&#x27;an — dari pelatihan guru hingga kegiatan
                komunitas di seluruh Indonesia.
              </p>
            </div>
            <Link
              href="/galeri-kegiatan"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all backdrop-blur-sm flex-shrink-0"
            >
              Lihat Semua Foto
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        {/* Photo grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {previewPhotos.map((photo, idx) => (
            <Reveal key={photo.src}>
              <Link
                href="/galeri-kegiatan"
                className={`group relative overflow-hidden rounded-2xl block ${
                  idx === 0
                    ? "col-span-2 md:col-span-1 row-span-2 md:row-span-2"
                    : ""
                }`}
                aria-label={`Lihat foto ${photo.caption}`}
              >
                <div
                  className={`relative w-full ${
                    idx === 0 ? "aspect-[4/5] md:aspect-[3/4]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={
                      idx === 0
                        ? "(max-width: 768px) 100vw, 33vw"
                        : "(max-width: 768px) 50vw, 33vw"
                    }
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {photo.caption}
                    </p>
                  </div>

                  {/* Zoom indicator on first photo */}
                  {idx === 0 && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="h-4 w-4 text-white -rotate-45" />
                    </div>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Mobile CTA button */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/galeri-kegiatan"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-colors shadow-lg"
          >
            <Images className="h-4 w-4" />
            Lihat Galeri Lengkap
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats strip */}
        <Reveal>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/10 pt-10">
            {[
              { label: "Tahun Berkarya", value: "30+" },
              { label: "Foto Kegiatan", value: "200+" },
              { label: "Pelatihan", value: "50+" },
              { label: "Kota Terjangkau", value: "34+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-emerald-400">
                  {stat.value}
                </p>
                <p className="text-white/60 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
