import type { Metadata } from "next";

export function createFoundationMetadata(title: string): Metadata {
  return {
    title: `Pena Ameen | ${title}`,
    description:
      "Pena Ameen implementation foundation. Production metadata remains gated by source and approval requirements.",
    robots: {
      index: false,
      follow: false,
    },
  };
}
