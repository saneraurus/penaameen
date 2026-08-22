import type { PropsWithChildren } from "react";

/** Foundation route container, aligned to the site measure. */
export function Container({ children }: PropsWithChildren) {
  return (
    <div className="foundation-container container py-16 sm:py-24">
      {children}
    </div>
  );
}
