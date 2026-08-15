import type { ReactNode } from "react";

export type StatusKind =
  "info" | "success" | "warning" | "error" | "processing" | "unavailable";

type StatusMessageProps = {
  readonly kind: StatusKind;
  readonly title: string;
  readonly children: ReactNode;
};

export function StatusMessage({ kind, title, children }: StatusMessageProps) {
  const role = kind === "error" ? "alert" : "status";

  return (
    <section aria-live="polite" className="foundation-surface" role={role}>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
