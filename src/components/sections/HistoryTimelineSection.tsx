"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { historyMilestones } from "@/data/history";

const tabId = (id: string) => `sejarah-tab-${id}`;
const panelId = (id: string) => `sejarah-panel-${id}`;

export function HistoryTimelineSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const total = historyMilestones.length;
  const activeMilestone =
    historyMilestones[activeIndex] ?? historyMilestones[0]!;

  const selectTab = (index: number, moveFocus = false) => {
    const nextIndex = (index + total) % total;
    setActiveIndex(nextIndex);
    if (moveFocus) {
      tabRefs.current[nextIndex]?.focus();
    }
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        selectTab(activeIndex + 1, true);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        selectTab(activeIndex - 1, true);
        break;
      case "Home":
        selectTab(0, true);
        break;
      case "End":
        selectTab(total - 1, true);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  return (
    <section
      id="garis-waktu"
      className="py-16 md:py-24 bg-background-100 border-y border-supporting-200/60"
    >
      <div className="container px-4 mx-auto">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
            <span className="mb-3 inline-block text-xs font-semibold tracking-widest uppercase text-primary-700 bg-primary-50 px-3.5 py-1 rounded-full border border-primary-200/70">
              GARIS WAKTU
            </span>
            <h2 className="text-section font-serif text-primary-900 leading-tight mb-4">
              Enam Babak Perjalanan
            </h2>
            <p className="text-supporting-600 text-base sm:text-lg">
              Dari rumah penerbitan di tahun 1995 hingga program pemberantasan
              buta aksara bersama pemerintah daerah dan CSR perusahaan.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 items-start max-w-6xl mx-auto">
          {/* Milestone rail: horizontal on compact screens, vertical on large.
              `min-w-0` keeps the scroller inside its grid column instead of
              stretching the page. */}
          <Reveal className="min-w-0 lg:col-span-4">
            <div
              role="tablist"
              aria-label="Babak sejarah PENA AMEEN"
              className="flex gap-2.5 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0"
            >
              {historyMilestones.map((milestone, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={milestone.id}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={tabId(milestone.id)}
                    aria-selected={isActive}
                    aria-controls={panelId(milestone.id)}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectTab(index)}
                    onKeyDown={handleTabKeyDown}
                    className={`group flex-shrink-0 w-[168px] snap-start text-left rounded-2xl border px-4 py-3 transition-all duration-300 cursor-pointer lg:w-full lg:flex lg:items-center lg:gap-3 ${
                      isActive
                        ? "bg-primary-700 border-primary-700 text-white shadow-sm"
                        : "bg-white border-supporting-200 text-supporting-700 hover:border-primary-300 hover:bg-primary-50"
                    }`}
                  >
                    <span
                      className={`mb-1.5 inline-flex items-center justify-center rounded-lg px-2 py-0.5 text-xs font-bold tabular-nums lg:mb-0 lg:flex-shrink-0 ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-primary-50 text-primary-700 group-hover:bg-white"
                      }`}
                    >
                      {milestone.period}
                    </span>
                    <span
                      className={`block text-sm font-semibold leading-snug ${
                        isActive ? "text-white" : "text-supporting-800"
                      }`}
                    >
                      {milestone.navLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Progress + sequential controls */}
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-white border border-supporting-200 px-3 py-2.5">
              <button
                type="button"
                onClick={() => selectTab(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="p-2 rounded-xl border border-supporting-200 text-supporting-600 hover:bg-background-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Babak sebelumnya"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
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
              <span className="text-xs font-semibold text-supporting-500 tabular-nums">
                Babak {activeIndex + 1} dari {total}
              </span>
              <button
                type="button"
                onClick={() => selectTab(activeIndex + 1)}
                disabled={activeIndex === total - 1}
                className="p-2 rounded-xl border border-supporting-200 text-supporting-600 hover:bg-background-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Babak selanjutnya"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
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
          </Reveal>

          {/* Milestone panels: all rendered, inactive ones hidden */}
          <Reveal className="min-w-0 lg:col-span-8" delay={0.15}>
            <div className="bg-white rounded-3xl border border-supporting-200/90 shadow-sm p-6 sm:p-8">
              {historyMilestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  role="tabpanel"
                  id={panelId(milestone.id)}
                  aria-labelledby={tabId(milestone.id)}
                  hidden={index !== activeIndex}
                  tabIndex={0}
                >
                  <div className="grid gap-6 md:grid-cols-12 md:gap-8 items-start">
                    <div className="md:col-span-7">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-primary-100 text-primary-800 rounded-full tabular-nums">
                          {milestone.period}
                        </span>
                        <span className="text-xs font-medium text-supporting-500">
                          {milestone.eyebrow}
                        </span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary-900 leading-tight mb-3">
                        {milestone.title}
                      </h3>

                      <p className="text-sm sm:text-base text-supporting-600 leading-relaxed mb-6">
                        {milestone.narrative}
                      </p>

                      <dl className="space-y-3 pt-4 border-t border-supporting-100">
                        {milestone.highlights.map((highlight) => (
                          <div
                            key={highlight.label}
                            className="flex items-start gap-2.5"
                          >
                            <span
                              className="mt-0.5 w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0"
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                            <div className="text-xs sm:text-sm">
                              <dt className="inline font-semibold text-primary-800">
                                {highlight.label}:
                              </dt>{" "}
                              <dd className="inline text-supporting-700">
                                {highlight.detail}
                              </dd>
                            </div>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div className="md:col-span-5">
                      <figure className="m-0">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-supporting-100 border border-supporting-200">
                          <Image
                            src={milestone.image}
                            alt={milestone.imageAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 30vw"
                            className="object-cover"
                          />
                        </div>
                        <figcaption className="mt-2.5 text-caption text-supporting-500">
                          {milestone.caption}
                        </figcaption>
                      </figure>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Compact recap so the whole arc stays readable at a glance */}
        <Reveal delay={0.25}>
          <ol className="mt-10 max-w-6xl mx-auto grid gap-3 sm:grid-cols-2 lg:grid-cols-3 list-none p-0">
            {historyMilestones.map((milestone, index) => {
              const isActive = index === activeIndex;

              return (
                <li key={milestone.id}>
                  <button
                    type="button"
                    onClick={() => selectTab(index)}
                    aria-current={isActive ? "step" : undefined}
                    className={`w-full h-full text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-white border-primary-400 ring-1 ring-primary-300 shadow-sm"
                        : "bg-white/70 border-supporting-200/80 hover:bg-white hover:border-supporting-300"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2 mb-1.5">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md tabular-nums ${
                          isActive
                            ? "bg-primary-700 text-white"
                            : "bg-primary-50 text-primary-700"
                        }`}
                      >
                        {milestone.period}
                      </span>
                      <span className="text-[11px] font-medium text-supporting-500">
                        {milestone.eyebrow}
                      </span>
                    </span>
                    <span className="block text-sm font-serif font-bold text-primary-800 mb-1 leading-snug">
                      {milestone.title}
                    </span>
                    <span className="block text-xs text-supporting-500">
                      {milestone.summary}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </Reveal>

        {/* Screen-reader friendly statement of the currently shown milestone */}
        <p aria-live="polite" className="sr-only">
          Menampilkan babak {activeIndex + 1} dari {total}:{" "}
          {activeMilestone.title}
        </p>
      </div>
    </section>
  );
}
