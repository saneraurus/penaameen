"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { testimonials } from "@/data/testimonials";

export function TestimonialsSection() {
  return (
    <section className="border-y border-supporting-200 bg-background-50/50 py-8 sm:py-16 lg:py-20">
      <div className="container max-w-6xl">
        {/* Section Header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="scene-index justify-center">Ulasan Terverifikasi</p>
          <h2 className="display-type mt-2.5 text-[clamp(1.5rem,3.2vw,2.25rem)] text-supporting-900 sm:mt-4">
            Kisah Nyata Ibu, Ayah dan Guru di Seluruh Indonesia
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-supporting-600 sm:mt-4 sm:text-base">
            Pengalaman nyata mendampingi anak dan santri lancar membaca dan
            mengaji dengan metode Al Barqy dan ACM.
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-supporting-500 sm:mt-4 sm:text-[11px] sm:tracking-[0.16em]">
            <span className="text-accent-700">4.9 / 5.0</span>
            <span>·</span>
            <span>100% Pembeli Terverifikasi</span>
          </div>
        </Reveal>

        {/* Mobile Swipeable Snap Carousel + Desktop 3-Column Grid */}
        <div className="mt-6 flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {testimonials.map((item, idx) => (
            <Reveal
              key={item.id}
              variant="small"
              delay={0.05 * idx}
              className="flex h-full w-[285px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-supporting-200 bg-white p-4.5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:w-auto sm:p-6"
            >
              <div>
                {/* Author Info with 2010s Webcam Avatar */}
                <div className="flex items-center gap-3.5">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-supporting-200 bg-supporting-100 shadow-inner">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-sans text-sm font-semibold text-supporting-900">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-supporting-500">
                      {item.role}
                    </p>
                    <p className="truncate text-[11px] text-supporting-400">
                      {item.location}
                    </p>
                  </div>
                </div>

                {/* Product Badge */}
                <div className="mt-3.5">
                  <span className="inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-semibold text-primary-800 sm:px-3 sm:py-1 sm:text-[11px]">
                    {item.productUsed}
                  </span>
                </div>

                {/* Quote Content */}
                <blockquote className="mt-3.5">
                  <p className="font-serif text-[15px] font-semibold leading-snug text-supporting-900 sm:text-base">
                    &ldquo;{item.title}&rdquo;
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-supporting-600 sm:text-sm">
                    {item.content}
                  </p>
                </blockquote>
              </div>

              {/* Card Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-supporting-100 pt-3">
                <span className="text-[11px] font-semibold text-accent-700">
                  {item.highlight}
                </span>
                <span
                  className="text-xs text-amber-500"
                  aria-label="5 dari 5 bintang"
                >
                  ★★★★★
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
