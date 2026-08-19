import type { Metadata } from "next";

export function createFoundationMetadata(title: string): Metadata {
  return {
    // M-7 FIX: set metadataBase so relative URL-based metadata fields (OG
    // images, canonical, sitemap) resolve to absolute URLs. Without it Next.js
    // warns and mis-derives the host. Sourced from APP_BASE_URL.
    metadataBase: new URL(
      process.env.APP_BASE_URL || "http://localhost:3000",
    ),
    title: `Pena Ameen | ${title}`,
    description:
      "Pena Ameen implementation foundation. Production metadata remains gated by source and approval requirements.",
    robots: {
      index: false,
      follow: false,
    },
  };
}
