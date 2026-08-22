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
      className="border-y border-supporting-200 bg-white py-16 sm:py-20"
    >
      <div className="container max-w-6xl">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="scene-index justify-center">Garis Waktu</p>
            <h2 className="display-type mt-4 text-supporting-900">
              Enam Babak Perjalanan
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-supporting-600 sm:text-base">
              Dari rumah penerbitan di tahun 1995 hingga program pemberantasan
              buta aksara bersama pemerintah daerah dan CSR perusahaan.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-12 lg:gap-10">
          <Reveal className="min-w-0 lg:col-span-4">
            <div
              role="tablist"
              aria-label="Babak sejarah PENA AMEEN"
              className="flex gap-2 overflow-x-auto pb-3 sm:flex-col sm:gap-1.5 sm:overflow-visible sm:pb-0"
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
                    className={`flex w-[160px] shrink-0 flex-col gap-1 border-b py-3 text-left transition-colors sm:w-full sm:flex-row sm:items-center sm:gap-3 sm:border-0 sm:border-b ${
                      isActive
                        ? "border-accent-600 text-supporting-900"
                        : "border-supporting-200 text-supporting-500 hover:text-supporting-800 sm:hover:border-supporting-300"
                    }`}
                  >
                    <span
                      className={`shrink-0 text-[11px] tabular-nums ${
                        isActive ? "text-accent-700" : "text-supporting-400"
                      }`}
                    >
                      {milestone.period}
                    </span>
                    <span className="text-sm leading-snug">
                      {milestone.navLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-supporting-200 pt-4">
              <button
                type="button"
                onClick={() => selectTab(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-supporting-300 text-supporting-600 transition-colors hover:border-primary-700 hover:text-primary-800 disabled:cursor-not-allowed disabled:opacity-30"
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
              <span className="text-xs tabular-nums text-supporting-500">
                Babak {activeIndex + 1} dari {total}
              </span>
              <button
                type="button"
                onClick={() => selectTab(activeIndex + 1)}
                disabled={activeIndex === total - 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-supporting-300 text-supporting-600 transition-colors hover:border-primary-700 hover:text-primary-800 disabled:cursor-not-allowed disabled:opacity-30"
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

          <Reveal className="min-w-0 lg:col-span-8" delay={0.12}>
            <div className="border-t border-supporting-200 pt-8">
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

                      <h3 className="font-serif text-2xl text-supporting-900 sm:text-3xl">
                        {milestone.title}
                      </h3>

                      <p className="mt-4 max-w-prose text-sm leading-relaxed text-supporting-600 sm:text-base">
                        {milestone.narrative}
                      </p>

                      <dl className="mt-8 space-y-3 border-t border-supporting-100 pt-6">
                        {milestone.highlights.map((highlight) => (
                          <div
                            key={highlight.label}
                            className="flex gap-3 text-sm"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 h-px w-4 shrink-0 bg-accent-500"
                            />
                            <span className="leading-relaxed text-supporting-600">
                              <strong className="font-medium text-supporting-900">
                                {highlight.label}
                              </strong>
                              : {highlight.detail}
                            </span>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div className="md:col-span-5">
                      <figure className="m-0">
                        <div className="image-frame aspect-[4/3] w-full">
                          <Image
                            src={milestone.image}
                            alt={milestone.imageAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 30vw"
                            className="object-cover"
                          />
                        </div>
                        <figcaption className="mt-2.5 text-xs text-supporting-500">
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

        <ol className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {historyMilestones.map((milestone, index) => {
            const isActive = index === activeIndex;

            return (
              <li key={milestone.id}>
                <button
                  type="button"
                  onClick={() => selectTab(index)}
                  aria-current={isActive ? "step" : undefined}
                  className={`w-full border-t py-4 text-left transition-colors ${
                    isActive
                      ? "border-accent-500"
                      : "border-supporting-200 hover:border-supporting-300"
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] tabular-nums ${
                        isActive ? "text-accent-700" : "text-supporting-400"
                      }`}
                    >
                      {milestone.period}
                    </span>
                    <span className="text-[11px] text-supporting-500">
                      {milestone.eyebrow}
                    </span>
                  </span>
                  <span className="mt-2 block text-sm font-medium leading-snug text-supporting-900">
                    {milestone.title}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-supporting-500">
                    {milestone.summary}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Screen-reader friendly statement of the currently shown milestone */}
        <p aria-live="polite" className="sr-only">
          Menampilkan babak {activeIndex + 1} dari {total}:{" "}
          {activeMilestone.title}
        </p>
      </div>
    </section>
  );
}
