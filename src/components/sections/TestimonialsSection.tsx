"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { testimonials, Testimonial } from "@/data/testimonials";
import { Reveal } from "@/components/motion/Reveal";

type CategoryFilter = "all" | "orangtua" | "guru" | "anak" | "dewasa";

const categoryFilters: { id: CategoryFilter; label: string; icon: string }[] = [
  { id: "all", label: "Semua Ulasan", icon: "⭐" },
  { id: "orangtua", label: "Orang Tua & Home Learning", icon: "👨‍👩‍👧" },
  { id: "guru", label: "Guru & TPQ", icon: "👩‍🏫" },
  { id: "anak", label: "Anak Usia Dini (ACM)", icon: "👶" },
  { id: "dewasa", label: "Dewasa & Mandiri", icon: "📖" },
];

export function TestimonialsSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProof, setSelectedProof] = useState<Testimonial | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Filter items based on selected category
  const filteredTestimonials = useMemo(() => {
    if (activeCategory === "all") return testimonials;
    return testimonials.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  // Adjust index if out of bounds after filter change
  const maxIndex = Math.max(0, filteredTestimonials.length - 1);
  const safeIndex = Math.min(currentIndex, maxIndex);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredTestimonials.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredTestimonials.length - 1 ? prev + 1 : 0));
  };

  const handleCategoryChange = (cat: CategoryFilter) => {
    setActiveCategory(cat);
    setCurrentIndex(0);
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-secondary-50 via-white to-secondary-50 border-y border-supporting-200/60 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div
        className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 rounded-full bg-primary-100/40 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-accent-100/40 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="container px-4 sm:px-6 mx-auto">
        {/* ============================================================ */}
        {/* 1. SECTION HEADER & TRUST SUMMARY */}
        {/* ============================================================ */}
        <Reveal>
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-50 border border-primary-200/80 shadow-2xs mb-4">
              <span className="text-primary-600 text-xs font-semibold uppercase tracking-wider">
                💬 KATA MEREKA TENTANG PENA AMEEN
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary-950 tracking-tight leading-tight mb-4">
              Kisah Nyata Ibu, Ayah &amp; Guru di Seluruh Indonesia
            </h2>

            <p className="text-base sm:text-lg text-supporting-600 leading-relaxed mb-6">
              Lebih dari <strong className="text-primary-700 font-semibold">8.000+ keluarga dan 500+ TPQ</strong> telah membuktikan kemudahan mendampingi anak dan pemula lancar membaca dan mengaji dengan metode teruji.
            </p>

            {/* Overall Rating Stats Pill */}
            <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-white/90 backdrop-blur-md p-3 sm:px-6 sm:py-2.5 rounded-2xl border border-supporting-200/80 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="flex text-accent-500 text-sm">
                  {"★★★★★"}
                </div>
                <span className="text-sm font-bold text-supporting-900">4.9 / 5.0</span>
              </div>
              <span className="hidden sm:inline text-supporting-300">•</span>
              <span className="text-xs sm:text-sm font-medium text-supporting-600">
                8.000+ Ulasan Puas
              </span>
              <span className="hidden sm:inline text-supporting-300">•</span>
              <span className="text-xs sm:text-sm font-semibold text-primary-700 inline-flex items-center gap-1">
                <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                100% Pembeli Terverifikasi
              </span>
            </div>
          </div>
        </Reveal>

        {/* ============================================================ */}
        {/* 2. CATEGORY FILTER TABS & NAVIGATION BUTTONS */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 p-1.5 rounded-2xl bg-supporting-100/90 border border-supporting-200/80">
            {categoryFilters.map((tab) => {
              const isActive = tab.id === activeCategory;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleCategoryChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-primary-800 shadow-xs font-semibold"
                      : "text-supporting-600 hover:text-supporting-900 hover:bg-white/50"
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Left / Right Carousel Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-supporting-500 font-medium mr-1">
              {safeIndex + 1} dari {filteredTestimonials.length}
            </span>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Testimoni Sebelumnya"
              className="w-10 h-10 rounded-xl bg-white hover:bg-primary-50 border border-supporting-200 hover:border-primary-300 text-supporting-700 hover:text-primary-700 shadow-2xs flex items-center justify-center transition-all cursor-pointer group"
            >
              <svg
                className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Testimoni Selanjutnya"
              className="w-10 h-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-xs flex items-center justify-center transition-all cursor-pointer group"
            >
              <svg
                className="w-5 h-5 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. INTERACTIVE TESTIMONIALS CARDS (CAROUSEL / GRID) */}
        {/* ============================================================ */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${safeIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.35,
                ease: "easeOut",
              }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {/* Render 3 cards starting from safeIndex (with wrap-around) */}
              {[0, 1, 2].map((offset) => {
                const itemIndex = (safeIndex + offset) % filteredTestimonials.length;
                const item = filteredTestimonials[itemIndex];
                if (!item) return null;

                const isMainCard = offset === 0;

                return (
                  <div
                    key={`${item.id}-${offset}`}
                    className={`relative bg-white rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between ${
                      isMainCard
                        ? "border-primary-300 shadow-md ring-2 ring-primary-500/10"
                        : "border-supporting-200/90 shadow-sm hover:shadow-md hover:border-supporting-300"
                    }`}
                  >
                    {/* Top Card Info: Stars & Highlights */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1 text-accent-500 text-sm">
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-800 bg-primary-100/80 border border-primary-200/60 px-2.5 py-0.5 rounded-full">
                          {item.highlight}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-serif font-bold text-supporting-900 leading-snug mb-3">
                        &ldquo;{item.title}&rdquo;
                      </h3>

                      {/* Content */}
                      <p className="text-xs sm:text-sm text-supporting-600 leading-relaxed mb-6">
                        {item.content}
                      </p>
                    </div>

                    {/* Bottom Card Info: Product Used & Author Identity */}
                    <div className="pt-4 border-t border-supporting-100">
                      {/* Product Tag */}
                      <div className="flex items-center justify-between text-[11px] text-supporting-500 mb-3.5">
                        <span className="truncate">
                          📦 <strong>Produk:</strong> {item.productUsed}
                        </span>
                        {item.image && (
                          <button
                            type="button"
                            onClick={() => setSelectedProof(item)}
                            className="text-primary-600 hover:text-primary-700 font-semibold underline underline-offset-2 flex-shrink-0 cursor-pointer"
                          >
                            Bukti Chat ↗
                          </button>
                        )}
                      </div>

                      {/* Author Bio with Avatar */}
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary-200 bg-secondary-100 flex-shrink-0">
                          <Image
                            src={item.avatar}
                            alt={item.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs sm:text-sm font-bold text-supporting-900 truncate">
                              {item.name}
                            </h4>
                            {item.verifiedBuyer && (
                              <span
                                title="Pembeli Terverifikasi"
                                className="w-4 h-4 rounded-full bg-primary-500 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                              >
                                ✓
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-supporting-500 truncate">
                            {item.role}
                          </p>
                          <p className="text-[10px] text-supporting-400 flex items-center gap-1">
                            <span>📍 {item.location}</span>
                            <span>•</span>
                            <span>{item.date}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {filteredTestimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ke testimoni ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  safeIndex === idx
                    ? "w-8 bg-primary-600"
                    : "w-2.5 bg-supporting-300 hover:bg-supporting-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. MODAL BUKTI CHAT / SCREENSHOT PROOF */}
        {/* ============================================================ */}
        {selectedProof && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedProof(null)}
          >
            <div
              className="relative max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-supporting-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-supporting-100">
                <div>
                  <h4 className="text-sm font-bold text-supporting-900">
                    Bukti Ulasan Asli: {selectedProof.name}
                  </h4>
                  <p className="text-xs text-supporting-500">{selectedProof.role}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProof(null)}
                  className="w-8 h-8 rounded-full bg-supporting-100 hover:bg-supporting-200 text-supporting-700 flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-supporting-100 border border-supporting-200 mb-4">
                <Image
                  src={selectedProof.image}
                  alt={`Tangkapan layar ulasan dari ${selectedProof.name}`}
                  fill
                  className="object-contain"
                />
              </div>

              <p className="text-xs text-supporting-600 italic bg-secondary-50 p-3 rounded-xl border border-secondary-200/60">
                &ldquo;{selectedProof.content}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
