"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { testimonials, Testimonial } from "@/data/testimonials";

type CategoryFilter = "all" | "orangtua" | "guru" | "anak" | "dewasa";

const categoryFilters: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "orangtua", label: "Orang Tua" },
  { id: "guru", label: "Guru & TPQ" },
  { id: "anak", label: "Anak Usia Dini" },
  { id: "dewasa", label: "Dewasa & Mandiri" },
];

export function TestimonialsSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProof, setSelectedProof] = useState<Testimonial | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const filteredTestimonials = useMemo(() => {
    if (activeCategory === "all") return testimonials;
    return testimonials.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  const maxIndex = Math.max(0, filteredTestimonials.length - 1);
  const safeIndex = Math.min(currentIndex, maxIndex);

  return (
    <section className="border-y border-supporting-200 bg-white py-16 sm:py-20">
      <div className="container max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="scene-index justify-center">Ulasan Terverifikasi</p>
          <h2 className="display-type mt-4 text-supporting-900">
            Kisah Nyata Ibu, Ayah & Guru di Seluruh Indonesia
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-supporting-600 sm:text-base">
            Pengalaman nyata mendampingi anak dan pemula lancar membaca dan
            mengaji dengan metode Al-Barqy dan ACM.
          </p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-supporting-500">
            <span className="font-medium text-supporting-700">4.9 / 5.0</span> ·
            8.000+ ulasan · 100% pembeli terverifikasi
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-y border-supporting-200 py-4">
          {categoryFilters.map((tab) => {
            const isActive = tab.id === activeCategory;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setActiveCategory(tab.id);
                  setCurrentIndex(0);
                }}
                className={`relative py-1.5 text-xs transition-colors sm:text-sm ${
                  isActive
                    ? "text-supporting-900"
                    : "text-supporting-500 hover:text-supporting-900"
                }`}
              >
                {tab.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-px bg-accent-600 transition-transform ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs tabular-nums text-supporting-500">
            {safeIndex + 1} dari {filteredTestimonials.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev > 0 ? prev - 1 : filteredTestimonials.length - 1,
                )
              }
              aria-label="Testimoni Sebelumnya"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-supporting-300 text-supporting-700 transition-colors hover:border-primary-700 hover:text-primary-800"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev < filteredTestimonials.length - 1 ? prev + 1 : 0,
                )
              }
              aria-label="Testimoni Selanjutnya"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-900 text-white transition-colors hover:bg-primary-800"
            >
              →
            </button>
          </div>
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${safeIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.25,
                ease: "easeOut",
              }}
              className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[0, 1, 2].map((offset) => {
                const itemIndex =
                  (safeIndex + offset) % filteredTestimonials.length;
                const item = filteredTestimonials[itemIndex];
                if (!item) return null;

                return (
                  <figure
                    key={`${item.id}-${offset}`}
                    className={`border-supporting-200 bg-white px-6 py-7 ${
                      offset === 0
                        ? "border-y border-r-0 lg:border-r"
                        : offset === 1
                          ? "border-y border-r-0 sm:border-r lg:border-y"
                          : "border-y"
                    }`}
                  >
                    <p
                      aria-label={`Rating ${item.rating} dari 5`}
                      className="text-[11px] tracking-[0.14em] text-supporting-400"
                    >
                      {"★★★★★".slice(0, item.rating)}
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-accent-700">
                      {item.highlight}
                    </p>
                    <blockquote className="mt-4">
                      <p className="font-serif text-[17px] leading-snug text-supporting-900">
                        &ldquo;{item.title}&rdquo;
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-supporting-600">
                        {item.content}
                      </p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 border-t border-supporting-100 pt-5">
                      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-supporting-100">
                        <Image
                          src={item.avatar}
                          alt={item.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-medium leading-none text-supporting-900">
                          {item.name}
                        </span>
                        <span className="mt-1 block truncate text-[11px] leading-none text-supporting-500">
                          {item.role} · {item.location}
                        </span>
                      </span>
                      {item.image ? (
                        <button
                          type="button"
                          onClick={() => setSelectedProof(item)}
                          className="ml-auto shrink-0 text-[11px] text-supporting-500 underline-offset-4 hover:text-primary-800 hover:underline"
                        >
                          Bukti Chat
                        </button>
                      ) : null}
                    </figcaption>
                  </figure>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedProof && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/60 p-4"
              onClick={() => setSelectedProof(null)}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label={`Bukti ulasan ${selectedProof.name}`}
                className="w-full max-w-lg rounded-lg bg-white p-5 sm:p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 border-b border-supporting-200 pb-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-supporting-900">
                      Bukti Ulasan Asli: {selectedProof.name}
                    </p>
                    <p className="mt-1 text-xs text-supporting-500">
                      {selectedProof.location} · {selectedProof.productUsed}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProof(null)}
                    aria-label="✕"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-supporting-300 text-supporting-600 hover:text-supporting-900"
                  >
                    ✕
                  </button>
                </div>
                <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded bg-supporting-100">
                  <Image
                    src={selectedProof.image!}
                    alt={`Bukti ulasan dari ${selectedProof.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 448px"
                    className="object-contain"
                  />
                </div>
                <p className="mt-3 text-center text-xs italic leading-relaxed text-supporting-600">
                  &ldquo;{selectedProof.content}&rdquo;
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
