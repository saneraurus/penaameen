import Link from "next/link";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * PENA AMEEN presentation primitives.
 *
 * Presentation only: these components render structure and style. They never
 * fetch data, mutate state, call APIs, or encode business rules.
 */

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

type Width = "narrow" | "default" | "wide" | "full";

const widthClass: Record<Width, string> = {
  narrow: "container-narrow",
  default: "container",
  wide: "container-wide",
  full: "w-full",
};

export function Shell({
  children,
  width = "default",
  className,
}: {
  children: ReactNode;
  width?: Width;
  className?: string;
}) {
  return <div className={cn(widthClass[width], className)}>{children}</div>;
}

export function Section({
  children,
  className,
  width = "default",
  tone = "canvas",
  tight = false,
  id,
  as: Tag = "section",
  "aria-labelledby": ariaLabelledBy,
}: {
  children: ReactNode;
  className?: string;
  width?: Width;
  tone?: "canvas" | "paper" | "ink" | "subtle" | "none";
  tight?: boolean;
  id?: string;
  as?: ElementType;
  "aria-labelledby"?: string;
}) {
  const toneClass = {
    canvas: "bg-background-50 text-supporting-900",
    paper: "bg-white text-supporting-900",
    subtle: "bg-background-200 text-supporting-900",
    ink: "bg-primary-950 text-background-100",
    none: "",
  }[tone];

  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        toneClass,
        tight ? "section-y-tight" : "section-y",
        className,
      )}
    >
      <Shell width={width}>{children}</Shell>
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

export function Eyebrow({
  children,
  className,
  plain = false,
}: {
  children: ReactNode;
  className?: string;
  plain?: boolean;
}) {
  return (
    <p className={cn("eyebrow", plain && "eyebrow-plain", className)}>
      {children}
    </p>
  );
}

export function SceneIndex({
  index,
  label,
  className,
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <p className={cn("scene-index", className)}>
      <span aria-hidden="true">{index}</span>
      <span className="sr-only">Bagian {index}:</span>{" "}
      <span className="text-supporting-400">— {label}</span>
    </p>
  );
}

export function SectionHeading({
  children,
  className,
  id,
  level = 2,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  level?: 1 | 2 | 3;
}) {
  const Tag = `h${level}` as ElementType;
  return (
    <Tag
      id={id}
      className={cn(
        "display-type",
        level === 1
          ? "text-[clamp(2.5rem,7vw,5rem)]"
          : "text-[clamp(2rem,4.6vw,3.5rem)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Lede({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("lede text-measure", className)}>{children}</p>;
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

type ButtonTone = "ink" | "clay" | "outline" | "ghost" | "inverse";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-200 ease-out active:translate-y-0 disabled:pointer-events-none disabled:opacity-45";

const buttonTone: Record<ButtonTone, string> = {
  ink: "bg-primary-900 text-background-50 hover:bg-primary-800 hover:-translate-y-0.5",
  clay: "bg-accent-600 text-white hover:bg-accent-700 hover:-translate-y-0.5",
  outline:
    "border border-supporting-300 text-supporting-800 hover:border-primary-700 hover:text-primary-800",
  ghost: "text-supporting-700 hover:text-primary-800",
  inverse:
    "bg-background-50 text-primary-950 hover:bg-white hover:-translate-y-0.5",
};

const buttonSize: Record<ButtonSize, string> = {
  sm: "min-h-9 px-4 text-xs",
  md: "min-h-11 px-6 text-sm",
  lg: "min-h-13 px-8 text-sm sm:text-base",
};

export function buttonClass({
  tone = "ink",
  size = "md",
  className,
}: {
  tone?: ButtonTone;
  size?: ButtonSize;
  className?: string | undefined;
} = {}) {
  return cn(buttonBase, buttonTone[tone], buttonSize[size], className);
}

export function ActionLink({
  href,
  children,
  tone = "ink",
  size = "md",
  className,
  ...rest
}: {
  href: string;
  children: ReactNode;
  tone?: ButtonTone;
  size?: ButtonSize;
  className?: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">) {
  return (
    <Link
      href={href}
      className={buttonClass({ tone, size, className })}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** Quiet editorial link with an animated rule, used for tertiary navigation. */
export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-medium text-primary-800 transition-colors hover:text-accent-700",
        className,
      )}
    >
      <span className="border-b border-current pb-0.5">{children}</span>
      <span
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-1"
      >
        &rarr;
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Status + system states                                              */
/* ------------------------------------------------------------------ */

type BadgeTone = "neutral" | "ink" | "clay" | "success" | "warning" | "danger";

const badgeTone: Record<BadgeTone, string> = {
  neutral: "border-supporting-200 bg-supporting-50 text-supporting-700",
  ink: "border-primary-200 bg-primary-50 text-primary-800",
  clay: "border-accent-200 bg-accent-50 text-accent-800",
  success: "border-primary-200 bg-primary-50 text-primary-800",
  warning: "border-accent-200 bg-accent-50 text-accent-800",
  danger: "border-red-200 bg-red-50 text-red-800",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
        badgeTone[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("skeleton-sheen rounded-lg", className)}
    />
  );
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto max-w-md px-6 py-16 text-center sm:py-24",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="mx-auto mb-6 block h-px w-16 bg-supporting-300"
      />
      <h2 className="text-2xl text-supporting-900">{title}</h2>
      {description ? (
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-supporting-500">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-8 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "mx-auto max-w-md rounded-xl border border-red-200 bg-red-50/60 px-6 py-10 text-center",
        className,
      )}
    >
      <p className="meta-type text-red-700">Terjadi gangguan</p>
      <h2 className="mt-3 text-xl text-supporting-900">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-supporting-600">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Commerce presentation                                               */
/* ------------------------------------------------------------------ */

/** Formats an existing numeric price. It never derives or alters pricing. */
export function formatIDR(value: number): string {
  return `Rp${Number(value).toLocaleString("id-ID")}`;
}

export function Price({
  value,
  className,
  size = "md",
}: {
  value: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }[size];

  return (
    <span
      className={cn(
        "font-sans font-semibold tracking-tight text-supporting-900",
        sizeClass,
        className,
      )}
    >
      {formatIDR(value)}
    </span>
  );
}
