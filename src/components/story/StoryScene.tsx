import Image from "next/image";
import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { Shell } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/**
 * Image-led narrative scenes.
 *
 * These components are presentation only. Every image path and caption must be
 * supplied by the caller from existing project assets and data; nothing here
 * invents imagery, claims, or product facts.
 */

/* ------------------------------------------------------------------ */
/* Full-bleed cinematic scene                                          */
/* ------------------------------------------------------------------ */

export function CinematicScene({
  image,
  imageAlt,
  eyebrow,
  headline,
  body,
  actions,
  align = "start",
  height = "tall",
  priority = false,
  overlay = "strong",
  className,
}: {
  image: string;
  imageAlt: string;
  eyebrow?: ReactNode;
  headline: ReactNode;
  body?: ReactNode;
  actions?: ReactNode;
  align?: "start" | "center";
  height?: "tall" | "medium" | "short";
  priority?: boolean;
  overlay?: "strong" | "soft";
  className?: string;
}) {
  const heightClass = {
    tall: "min-h-[88svh]",
    medium: "min-h-[70svh]",
    short: "min-h-[54svh]",
  }[height];

  return (
    <section
      className={cn(
        "relative isolate flex w-full items-end overflow-hidden bg-primary-950",
        heightClass,
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0",
          overlay === "strong" ? "image-scrim" : "image-scrim-soft",
        )}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Shell
        className={cn(
          "relative z-10 pb-16 pt-28 sm:pb-24",
          align === "center" && "text-center",
        )}
      >
        <div
          className={cn(
            "max-w-3xl",
            align === "center" && "mx-auto flex flex-col items-center",
          )}
        >
          {eyebrow ? (
            <Reveal variant="micro">
              <div className="mb-6 text-background-200">{eyebrow}</div>
            </Reveal>
          ) : null}

          <Reveal variant="large" delay={0.05}>
            <h1 className="display-type text-[clamp(2.5rem,7vw,5.25rem)] text-background-50">
              {headline}
            </h1>
          </Reveal>

          {body ? (
            <Reveal variant="medium" delay={0.14}>
              <div
                className={cn(
                  "mt-6 max-w-xl text-base leading-relaxed text-background-200 sm:text-lg",
                  align === "center" && "mx-auto",
                )}
              >
                {body}
              </div>
            </Reveal>
          ) : null}

          {actions ? (
            <Reveal variant="small" delay={0.22}>
              <div
                className={cn(
                  "mt-9 flex flex-col gap-3 sm:flex-row sm:items-center",
                  align === "center" && "justify-center",
                )}
              >
                {actions}
              </div>
            </Reveal>
          ) : null}
        </div>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Split scene: image on one side, meaning on the other                */
/* ------------------------------------------------------------------ */

export function SplitScene({
  image,
  imageAlt,
  eyebrow,
  headline,
  children,
  actions,
  reverse = false,
  ratio = "portrait",
  tone = "canvas",
  caption,
  className,
}: {
  image: string;
  imageAlt: string;
  eyebrow?: ReactNode;
  headline: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  reverse?: boolean;
  ratio?: "portrait" | "square" | "landscape";
  tone?: "canvas" | "paper" | "ink" | "subtle";
  caption?: string;
  className?: string;
}) {
  const aspect = {
    portrait: "aspect-[4/5]",
    square: "aspect-square",
    landscape: "aspect-[16/11]",
  }[ratio];

  const toneClass = {
    canvas: "bg-background-50",
    paper: "bg-white",
    subtle: "bg-background-200",
    ink: "bg-primary-950 text-background-100",
  }[tone];

  const isInk = tone === "ink";

  return (
    <section className={cn(toneClass, "section-y", className)}>
      <Shell>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal
            variant="medium"
            className={cn(
              "lg:col-span-6",
              reverse ? "lg:order-2" : "lg:order-1",
            )}
          >
            <figure>
              <div
                className={cn("image-frame image-frame-zoom w-full", aspect)}
              >
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {caption ? (
                <figcaption
                  className={cn(
                    "mt-3 text-xs",
                    isInk ? "text-background-300" : "text-supporting-500",
                  )}
                >
                  {caption}
                </figcaption>
              ) : null}
            </figure>
          </Reveal>

          <div
            className={cn(
              "lg:col-span-6",
              reverse ? "lg:order-1" : "lg:order-2",
            )}
          >
            {eyebrow ? (
              <Reveal variant="micro">
                <div className="mb-5">{eyebrow}</div>
              </Reveal>
            ) : null}

            <Reveal variant="medium" delay={0.06}>
              <h2
                className={cn(
                  "display-type text-[clamp(1.875rem,4vw,3.25rem)]",
                  isInk ? "text-background-50" : "text-supporting-900",
                )}
              >
                {headline}
              </h2>
            </Reveal>

            {children ? (
              <Reveal variant="small" delay={0.12}>
                <div
                  className={cn(
                    "mt-6 space-y-4 text-measure text-base leading-relaxed",
                    isInk ? "text-background-200" : "text-supporting-600",
                  )}
                >
                  {children}
                </div>
              </Reveal>
            ) : null}

            {actions ? (
              <Reveal variant="small" delay={0.18}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {actions}
                </div>
              </Reveal>
            ) : null}
          </div>
        </div>
      </Shell>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Editorial figure: a single image doing narrative work               */
/* ------------------------------------------------------------------ */

export function EditorialFigure({
  image,
  imageAlt,
  caption,
  ratio = "landscape",
  className,
  sizes = "(max-width: 1024px) 100vw, 66vw",
}: {
  image: string;
  imageAlt: string;
  caption?: string;
  ratio?: "portrait" | "square" | "landscape" | "cinema";
  className?: string;
  sizes?: string;
}) {
  const aspect = {
    portrait: "aspect-[3/4]",
    square: "aspect-square",
    landscape: "aspect-[16/10]",
    cinema: "aspect-[21/9]",
  }[ratio];

  return (
    <figure className={className}>
      <div className={cn("image-frame image-frame-zoom w-full", aspect)}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-xs text-supporting-500">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Pull quote                                                          */
/* ------------------------------------------------------------------ */

export function PullQuote({
  quote,
  attribution,
  className,
}: {
  quote: ReactNode;
  attribution?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal variant="medium">
      <blockquote
        className={cn("border-l border-accent-400 pl-6 sm:pl-10", className)}
      >
        <p className="display-type text-[clamp(1.5rem,3vw,2.5rem)] text-supporting-900">
          {quote}
        </p>
        {attribution ? (
          <footer className="mt-5 text-xs uppercase tracking-[0.16em] text-supporting-500">
            {attribution}
          </footer>
        ) : null}
      </blockquote>
    </Reveal>
  );
}
