import type { ReactNode } from "react";

export type StatusKind =
  "info" | "success" | "warning" | "error" | "processing" | "unavailable";

type StatusMessageProps = {
  readonly kind: StatusKind;
  readonly title: string;
  readonly children: ReactNode;
};

/** Status text always carries the meaning; colour is supplementary. */
const kindLabel: Record<StatusKind, string> = {
  info: "Informasi",
  success: "Berhasil",
  warning: "Perhatian",
  error: "Kesalahan",
  processing: "Diproses",
  unavailable: "Belum tersedia",
};

const kindAccent: Record<StatusKind, string> = {
  info: "bg-supporting-400",
  success: "bg-primary-600",
  warning: "bg-accent-500",
  error: "bg-red-500",
  processing: "bg-accent-400",
  unavailable: "bg-supporting-300",
};

export function StatusMessage({ kind, title, children }: StatusMessageProps) {
  const role = kind === "error" ? "alert" : "status";

  return (
    <section
      aria-live="polite"
      className="foundation-surface relative overflow-hidden rounded-lg border border-supporting-200 bg-white p-6 sm:p-8"
      role={role}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-0.5 ${kindAccent[kind]}`}
      />
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-supporting-400">
        {kindLabel[kind]}
      </p>
      <h2 className="mt-3 text-xl text-supporting-900">{title}</h2>
      <div className="mt-3 text-measure text-sm leading-relaxed text-supporting-600">
        {children}
      </div>
    </section>
  );
}
