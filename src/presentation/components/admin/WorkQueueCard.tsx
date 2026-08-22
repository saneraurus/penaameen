import Link from "next/link";
import { ReactNode } from "react";

interface WorkQueueCardProps {
  title: string;
  count: number;
  description: string;
  href: string;
  icon: ReactNode;
  variant?: "default" | "warning" | "critical";
}

/**
 * Actionable operational queue entry.
 *
 * The count is the primary signal; state is carried by text, not colour alone.
 */
export function WorkQueueCard({
  title,
  count,
  description,
  href,
  icon,
  variant = "default",
}: WorkQueueCardProps) {
  const accent = {
    default: "bg-supporting-300",
    warning: "bg-accent-500",
    critical: "bg-red-500",
  }[variant];

  const statusLabel = {
    default: "Normal",
    warning: "Perlu tindakan",
    critical: "Kritis",
  }[variant];

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-lg border border-supporting-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-supporting-300 hover:shadow-[0_12px_40px_-12px_rgba(25,22,18,0.16)]"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-0.5 ${accent}`}
      />

      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-supporting-400" aria-hidden="true">
              {icon}
            </span>
            <h3 className="truncate text-sm font-medium text-supporting-900">
              {title}
            </h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-supporting-500">
            {description}
          </p>
          <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-supporting-400">
            {statusLabel}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <div className="font-serif text-3xl leading-none text-supporting-900">
            {count}
          </div>
          <div className="mt-1.5 text-[11px] text-supporting-400">items</div>
        </div>
      </div>
    </Link>
  );
}
