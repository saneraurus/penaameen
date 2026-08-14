import type { PropsWithChildren } from "react";

export function Container({ children }: PropsWithChildren) {
  return <div className="foundation-container">{children}</div>;
}
