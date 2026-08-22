"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

const previewPhotos = [
  {
    src: "/images/penaameen/gallery/kegiatan-19.jpg",
    alt: "TOT Al-Barqy 2014",
    span: "large" as const,
  },
  {
    src: "/images/penaameen/gallery/kegiatan-20.jpg",
    alt: "Pelatihan ACM",
    span: "small" as const,
  },
  {
    src: "/images/penaameen/gallery/kegiatan-01.jpg",
    alt: "Workshop Komunitas",
    span: "small" as const,
  },
  {
    src: "/images/penaameen/gallery/kegiatan-09.jpg",
    alt: "Kegiatan Belajar",
    span: "small" as const,
  },
  {
    src: "/images/penaameen/gallery/kegiatan-17.jpg",
    alt: "Komunitas Al-Qur'an",
    span: "small" as const,
  },
  {
    src: "/images/penaameen/gallery/kegiatan-23.jpg",
    alt: "Pelatihan Nasional 2019",
    span: "small" as const,
  },
];

export function GalleryPreviewSection() {
  return (
    <section
      id="galeri-kegiatan-preview"
      className="border-y border-primary-900 bg-primary-950 py-16 sm:py-20"
    >
      <div className="container max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="scene-index text-accent-200">Galeri Kegiatan</p>
            <h2 className="display-type mt-4 text-background-50">
              Momen bersama komunitas.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-background-200">
              Lebih dari 30 tahun mendampingi belajar membaca Al-Qur&#x2011;an —
              dari pelatihan guru hingga kegiatan komunitas.
            </p>
          </div>
          <Link
            href="/galeri-kegiatan"
            className="hidden text-sm text-background-200 underline-offset-4 hover:text-white hover:underline md:inline-flex"
          >
            Lihat Semua Foto →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {previewPhotos.map((photo, idx) => (
            <Reveal key={photo.src} delay={idx * 0.04}>
              <Link
                href="/galeri-kegiatan"
                aria-label={`Lihat foto ${photo.alt}`}
                className={`group block overflow-hidden ${
                  photo.span === "large"
                    ? "col-span-2 row-span-2 aspect-[4/3] md:aspect-square"
                    : "aspect-[4/3]"
                }`}
              >
                <span className="relative block h-full w-full overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={
                      photo.span === "large"
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 50vw, 25vw"
                    }
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/galeri-kegiatan"
            className="inline-flex min-h-10 items-center rounded-full bg-white px-5 text-sm font-medium text-primary-900 transition-colors hover:bg-background-100"
          >
            Lihat Galeri Lengkap →
          </Link>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
          {[
            { label: "Tahun Berkarya", value: "30+" },
            { label: "Foto Kegiatan", value: "200+" },
            { label: "Pelatihan", value: "50+" },
            { label: "Kota Terjangkau", value: "34+" },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="text-xs text-white/50">{stat.label}</dt>
              <dd className="mt-1 font-serif text-2xl text-white">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
