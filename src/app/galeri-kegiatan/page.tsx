"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Images, ZoomIn } from "lucide-react";

type GalleryCategory = "semua" | "pelatihan" | "komunitas" | "dokumentasi";

type GalleryItem = {
  id: number;
  src: string;
  alt: string;
  caption: string;
  year: string;
  category: Exclude<GalleryCategory, "semua">;
};

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "/images/penaameen/gallery/kegiatan-19.jpg",
    alt: "TOT Al-Barqy 2014",
    caption: "Training of Trainers (TOT) Metode Al-Barqy 2014",
    year: "2014",
    category: "pelatihan",
  },
  {
    id: 2,
    src: "/images/penaameen/gallery/kegiatan-24.jpg",
    alt: "TOT Al-Barqy Dokumentasi",
    caption: "Dokumentasi pelatihan guru metode Al-Barqy",
    year: "2014",
    category: "dokumentasi",
  },
  {
    id: 3,
    src: "/images/penaameen/gallery/kegiatan-20.jpg",
    alt: "Pelatihan ACM",
    caption: "Sesi pelatihan Metode ACM (Aku Cepat Membaca)",
    year: "2018",
    category: "pelatihan",
  },
  {
    id: 4,
    src: "/images/penaameen/gallery/kegiatan-23.jpg",
    alt: "Pelatihan ACM Lanjutan 2019",
    caption: "Pelatihan ACM Lanjutan — Februari 2019",
    year: "2019",
    category: "pelatihan",
  },
  {
    id: 5,
    src: "/images/penaameen/gallery/kegiatan-01.jpg",
    alt: "Workshop Kegiatan Pena Ameen",
    caption: "Workshop pendidikan Al-Qur'an bersama komunitas",
    year: "2018",
    category: "komunitas",
  },
  {
    id: 6,
    src: "/images/penaameen/gallery/kegiatan-02.jpg",
    alt: "Kegiatan Belajar Komunitas",
    caption: "Sesi belajar bersama komunitas PENA AMEEN",
    year: "2018",
    category: "komunitas",
  },
  {
    id: 7,
    src: "/images/penaameen/gallery/kegiatan-03.jpg",
    alt: "Workshop PENA AMEEN",
    caption: "Workshop peningkatan mutu pengajaran Al-Qur'an",
    year: "2018",
    category: "pelatihan",
  },
  {
    id: 8,
    src: "/images/penaameen/gallery/kegiatan-04.jpg",
    alt: "Dokumentasi Kegiatan",
    caption: "Dokumentasi kegiatan pembelajaran bersama",
    year: "2018",
    category: "dokumentasi",
  },
  {
    id: 9,
    src: "/images/penaameen/gallery/kegiatan-05.jpg",
    alt: "Sesi Pembelajaran",
    caption: "Sesi pembelajaran interaktif metode Al-Barqy",
    year: "2018",
    category: "komunitas",
  },
  {
    id: 10,
    src: "/images/penaameen/gallery/kegiatan-06.jpg",
    alt: "Kegiatan Pendidikan",
    caption: "Kegiatan pendidikan Al-Qur'an anak-anak",
    year: "2018",
    category: "komunitas",
  },
  {
    id: 11,
    src: "/images/penaameen/gallery/kegiatan-07.jpg",
    alt: "Dokumentasi Kelas",
    caption: "Suasana kelas belajar mengaji",
    year: "2018",
    category: "dokumentasi",
  },
  {
    id: 12,
    src: "/images/penaameen/gallery/kegiatan-08.jpg",
    alt: "Kegiatan Pembelajaran Bersama",
    caption: "Proses belajar aktif bersama instruktur",
    year: "2018",
    category: "komunitas",
  },
  {
    id: 13,
    src: "/images/penaameen/gallery/kegiatan-09.jpg",
    alt: "Kegiatan Komunitas",
    caption: "Kegiatan komunitas belajar Al-Qur'an",
    year: "2018",
    category: "komunitas",
  },
  {
    id: 14,
    src: "/images/penaameen/gallery/kegiatan-10.jpg",
    alt: "Sesi Praktek Mengaji",
    caption: "Praktek langsung metode membaca Al-Qur'an",
    year: "2018",
    category: "komunitas",
  },
  {
    id: 15,
    src: "/images/penaameen/gallery/kegiatan-11.jpg",
    alt: "Pelatihan Guru",
    caption: "Pelatihan intensif guru metode Al-Barqy",
    year: "2018",
    category: "pelatihan",
  },
  {
    id: 16,
    src: "/images/penaameen/gallery/kegiatan-12.jpg",
    alt: "Workshop Instruktur",
    caption: "Workshop instruktur Al-Barqy bersertifikat",
    year: "2018",
    category: "pelatihan",
  },
  {
    id: 17,
    src: "/images/penaameen/gallery/kegiatan-13.jpg",
    alt: "Sesi Diskusi",
    caption: "Sesi diskusi dan tanya jawab materi pembelajaran",
    year: "2018",
    category: "pelatihan",
  },
  {
    id: 18,
    src: "/images/penaameen/gallery/kegiatan-14.jpg",
    alt: "Kegiatan Bersama",
    caption: "Kegiatan bersama peserta didik dan pengajar",
    year: "2018",
    category: "komunitas",
  },
  {
    id: 19,
    src: "/images/penaameen/gallery/kegiatan-15.jpg",
    alt: "Dokumentasi Pelatihan",
    caption: "Foto dokumentasi pelatihan guru",
    year: "2018",
    category: "dokumentasi",
  },
  {
    id: 20,
    src: "/images/penaameen/gallery/kegiatan-16.jpg",
    alt: "Peserta Pelatihan",
    caption: "Para peserta pelatihan metodologi Al-Barqy",
    year: "2018",
    category: "dokumentasi",
  },
  {
    id: 21,
    src: "/images/penaameen/gallery/kegiatan-17.jpg",
    alt: "Kegiatan Komunitas Al-Qur'an",
    caption: "Kegiatan komunitas pembelajaran Al-Qur'an",
    year: "2018",
    category: "komunitas",
  },
  {
    id: 22,
    src: "/images/penaameen/gallery/kegiatan-18.jpg",
    alt: "Sesi Bersama Guru",
    caption: "Sesi diskusi bersama para guru Al-Barqy",
    year: "2018",
    category: "komunitas",
  },
  {
    id: 23,
    src: "/images/penaameen/gallery/kegiatan-21.jpg",
    alt: "Kegiatan Edukasi",
    caption: "Kegiatan edukasi Al-Qur'an bersama komunitas",
    year: "2018",
    category: "komunitas",
  },
  {
    id: 24,
    src: "/images/penaameen/gallery/kegiatan-22.jpg",
    alt: "Momen Bersama Peserta",
    caption: "Momen kebersamaan peserta dan instruktur",
    year: "2018",
    category: "dokumentasi",
  },
];

const categories: { id: GalleryCategory; label: string; count: number }[] = [
  { id: "semua", label: "Semua Kegiatan", count: galleryItems.length },
  {
    id: "pelatihan",
    label: "Pelatihan & Workshop",
    count: galleryItems.filter((i) => i.category === "pelatihan").length,
  },
  {
    id: "komunitas",
    label: "Komunitas",
    count: galleryItems.filter((i) => i.category === "komunitas").length,
  },
  {
    id: "dokumentasi",
    label: "Dokumentasi",
    count: galleryItems.filter((i) => i.category === "dokumentasi").length,
  },
];

export default function GaleriKegiatanPage() {
  const [activeCategory, setActiveCategory] =
    useState<GalleryCategory>("semua");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "semua"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const prevImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + filtered.length) % filtered.length,
    );
  }, [lightboxIndex, filtered.length]);

  const nextImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % filtered.length,
    );
  }, [lightboxIndex, filtered.length]);

  const currentItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <>
      {/* SEO metadata set in generateMetadata — page-level markup below */}
      <div className="min-h-screen bg-supporting-50">
        {/* ── Hero Banner ── */}
        <section className="relative overflow-hidden bg-primary-950 py-20 md:py-28">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 60%, #22c55e 0%, transparent 50%), radial-gradient(circle at 75% 30%, #16a34a 0%, transparent 50%)",
            }}
          />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-8 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-8 right-1/4 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl" />
          </div>

          <div className="container px-4 mx-auto max-w-4xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6">
              <Images className="h-3.5 w-3.5" />
              Galeri Kegiatan
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-4">
              Momen &amp; Kegiatan{" "}
              <span className="text-emerald-400">PENA AMEEN</span>
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
              Dokumentasi perjalanan kami dalam menyebarkan metode belajar
              Al-Qur&#x27;an — pelatihan guru, workshop nasional, dan kegiatan
              komunitas di seluruh Indonesia.
            </p>

            {/* Stats strip */}
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              {[
                { value: "30+", label: "Tahun Berkarya" },
                { value: "200+", label: "Foto Kegiatan" },
                { value: "34+", label: "Kota di Indonesia" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl bg-white/10 border border-white/10 p-3 backdrop-blur-sm"
                >
                  <p className="text-xl font-bold text-emerald-400">
                    {s.value}
                  </p>
                  <p className="text-[11px] text-white/70 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Filter Tabs ── */}
        <section className="bg-white border-b border-supporting-200/80 sticky top-[70px] z-30">
          <div className="container px-4 mx-auto max-w-6xl">
            <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  id={`gallery-filter-${cat.id}`}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                    activeCategory === cat.id
                      ? "bg-primary-700 text-white shadow-md"
                      : "bg-supporting-100 text-supporting-600 hover:bg-primary-50 hover:text-primary-700"
                  }`}
                  aria-pressed={activeCategory === cat.id}
                >
                  {cat.label}
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      activeCategory === cat.id
                        ? "bg-white/20 text-white"
                        : "bg-supporting-200 text-supporting-500"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Gallery Grid ── */}
        <section className="py-10 md:py-16">
          <div className="container px-4 mx-auto max-w-7xl">
            <p className="text-xs text-supporting-500 mb-6 font-medium">
              Menampilkan{" "}
              <span className="text-primary-700 font-bold">
                {filtered.length}
              </span>{" "}
              foto
            </p>

            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {filtered.map((item, idx) => (
                <div
                  key={item.id}
                  className="break-inside-avoid group relative overflow-hidden rounded-2xl bg-supporting-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  onClick={() => openLightbox(idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Buka foto: ${item.caption}`}
                  onKeyDown={(e) => e.key === "Enter" && openLightbox(idx)}
                >
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-xs font-semibold leading-snug">
                          {item.caption}
                        </p>
                        <p className="text-emerald-300 text-[10px] mt-1 font-medium">
                          {item.year}
                        </p>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white">
                          <ZoomIn className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Caption below on mobile */}
                  <div className="p-3 sm:hidden">
                    <p className="text-xs font-medium text-supporting-700 leading-snug">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="text-center py-20">
                <Images className="h-12 w-12 text-supporting-300 mx-auto mb-4" />
                <p className="text-supporting-500">
                  Belum ada foto untuk kategori ini.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA Bottom ── */}
        <section className="py-12 bg-primary-950 text-white">
          <div className="container px-4 mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3">
              Ikut Bergabung dalam Komunitas Kami
            </h2>
            <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-lg mx-auto">
              Temukan cabang terdekat dan jadilah bagian dari gerakan belajar
              Al-Qur&#x27;an bersama PENA AMEEN di kota Anda.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/cabang"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-colors inline-flex items-center gap-2"
              >
                Temukan Cabang Terdekat →
              </Link>
              <Link
                href="/kontak"
                className="px-6 py-3 border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm backdrop-blur-md transition-all"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && currentItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Lightbox foto"
        >
          {/* Close */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Tutup foto"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Prev */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-3 md:left-6 z-10 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Image */}
          <div
            className="relative max-w-4xl max-h-[80vh] w-full mx-16 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full" style={{ maxHeight: "70vh" }}>
              <Image
                src={currentItem.src}
                alt={currentItem.alt}
                width={1200}
                height={800}
                className="object-contain max-h-[70vh] w-auto mx-auto rounded-xl shadow-2xl"
                priority
              />
            </div>
            <div className="mt-4 text-center px-4">
              <p className="text-white font-semibold text-sm md:text-base">
                {currentItem.caption}
              </p>
              <p className="text-emerald-400 text-xs mt-1">
                {currentItem.year}
              </p>
              <p className="text-white/40 text-xs mt-2">
                {lightboxIndex + 1} / {filtered.length}
              </p>
            </div>
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-3 md:right-6 z-10 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Foto berikutnya"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
