"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { testimonials, Testimonial } from "@/data/testimonials";
import { Reveal } from "@/components/motion/Reveal";

type CategoryFilter = "all" | "orangtua" | "guru" | "anak" | "dewasa";

const categoryFilters: { id: CategoryFilter; label: string; icon: string }[] = [
  { id: "all", label: "Semua Ulasan", icon: "⭐" },
  { id: "orangtua", label: "Orang Tua", icon: "👨‍👩‍👧" },
  { id: "guru", label: "Guru & TPQ", icon: "👩‍🏫" },
  { id: "anak", label: "Anak Usia Dini", icon: "👶" },
  { id: "dewasa", label: "Dewasa & Mandiri", icon: "📖" },
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

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : filteredTestimonials.length - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev < filteredTestimonials.length - 1 ? prev + 1 : 0,
    );
  };

  const handleCategoryChange = (cat: CategoryFilter) => {
    setActiveCategory(cat);
    setCurrentIndex(0);
  };

  return (
    <section className="py-14 sm:py-16 md:py-24 bg-gradient-to-b from-secondary-50 via-white to-secondary-50 border-y border-supporting-200/80 relative overflow-hidden">
      <div className="container px-4 mx-auto max-w-6xl">
        {/* Section Header & Trust Summary */}
        <Reveal>
          <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5 border border-primary-200/80">
              ULASAN PENGGUNA TERVERIFIKASI
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary-950 tracking-tight leading-tight mb-2.5">
              Kisah Nyata Ibu, Ayah &amp; Guru di Seluruh Indonesia
            </h2>

            <p className="text-xs sm:text-sm text-supporting-600 leading-relaxed mb-5">
              Pengalaman nyata mendampingi anak dan pemula lancar membaca dan mengaji dengan metode Al-Barqy dan ACM.
            </p>

            {/* Overall Rating Stats Pill */}
            <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 bg-white p-2.5 sm:px-5 sm:py-2 rounded-2xl border border-supporting-200 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500 text-sm">★★★★★</span>
                <span className="text-xs font-bold text-supporting-900">
                  4.9 / 5.0
                </span>
              </div>
              <span className="text-supporting-300">•</span>
              <span className="text-xs text-supporting-600 font-medium">
                8.000+ Ulasan Puas
              </span>
              <span className="text-supporting-300 hidden sm:inline">•</span>
              <span className="text-xs font-bold text-emerald-700 inline-flex items-center gap-1">
                <span>✓</span>
                <span>100% Pembeli Terverifikasi</span>
              </span>
            </div>
          </div>
        </Reveal>

        {/* Category Filter Tabs & Navigation Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
          {/* Category Tabs (Scrollable on Mobile) */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-supporting-100/90 border border-supporting-200/80 overflow-x-auto scrollbar-none w-full md:w-auto">
            {categoryFilters.map((tab) => {
              const isActive = tab.id === activeCategory;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleCategoryChange(tab.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                    isActive
                      ? "bg-white text-primary-950 shadow-xs font-bold"
                      : "text-supporting-600 hover:text-supporting-900 hover:bg-white/50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
            <span className="text-xs text-supporting-500 font-medium">
              {safeIndex + 1} dari {filteredTestimonials.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Testimoni Sebelumnya"
                className="w-8 h-8 rounded-xl bg-white hover:bg-supporting-50 border border-supporting-200 text-supporting-700 flex items-center justify-center font-bold text-xs shadow-2xs transition-colors cursor-pointer"
              >
                ←
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Testimoni Selanjutnya"
                className="w-8 h-8 rounded-xl bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs transition-colors cursor-pointer"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="relative">
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
              className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {[0, 1, 2].map((offset) => {
                const itemIndex =
                  (safeIndex + offset) % filteredTestimonials.length;
                const item = filteredTestimonials[itemIndex];
                if (!item) return null;

                const isMainCard = offset === 0;

                return (
                  <div
                    key={`${item.id}-${offset}`}
                    className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between ${
                      isMainCard
                        ? "border-primary-300 shadow-sm"
                        : "border-supporting-200/90 shadow-2xs hover:shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex text-amber-500 text-xs">
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-primary-800 bg-primary-100 px-2 py-0.5 rounded-full">
                          {item.highlight}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-serif font-bold text-primary-950 leading-snug mb-2">
                        &ldquo;{item.title}&rdquo;
                      </h3>

                      <p className="text-xs text-supporting-600 leading-relaxed mb-4">
                        {item.content}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-supporting-100">
                      <div className="flex items-center justify-between text-[11px] text-supporting-500 mb-3">
                        <span className="truncate max-w-[180px]">
                          📦 <strong>Produk:</strong> {item.productUsed}
                        </span>
                        {item.image && (
                          <button
                            type="button"
                            onClick={() => setSelectedProof(item)}
                            className="text-[10px] font-bold text-primary-700 hover:text-primary-900 underline flex items-center gap-0.5 cursor-pointer flex-shrink-0"
                          >
                            <span>📷</span>
                            <span>Bukti Chat</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-supporting-100 border border-supporting-200 flex-shrink-0">
                          <Image
                            src={item.avatar}
                            alt={item.name}
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <h4 className="text-xs font-bold text-primary-950 truncate">
                              {item.name}
                            </h4>
                            {item.verifiedBuyer && (
                              <span
                                className="text-emerald-600 text-[10px]"
                                title="Pembeli Terverifikasi"
                              >
                                ✓
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-supporting-500 truncate">
                            {item.role} • {item.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Screenshot Proof Modal */}
        <AnimatePresence>
          {selectedProof && (
            <div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
              onClick={() => setSelectedProof(null)}
            >
              <div
                className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-supporting-200">
                  <div>
                    <h4 className="text-sm font-bold text-primary-950">
                      Bukti Ulasan Asli: {selectedProof.name}
                    </h4>
                    <p className="text-[11px] text-supporting-500">
                      {selectedProof.location} • {selectedProof.productUsed}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProof(null)}
                    aria-label="✕"
                    className="w-8 h-8 rounded-full bg-supporting-100 hover:bg-supporting-200 text-supporting-700 flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-supporting-100 border border-supporting-200 mb-3">
                  <Image
                    src={selectedProof.image!}
                    alt={`Bukti ulasan dari ${selectedProof.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 448px"
                    className="object-contain"
                  />
                </div>

                <p className="text-xs text-supporting-600 italic text-center">
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
