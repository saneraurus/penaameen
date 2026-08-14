import { describe, expect, it } from "vitest";

import { createFoundationMetadata } from "@/presentation/foundation-metadata";

describe("foundation metadata performance and SEO boundary", () => {
  it("keeps foundation routes non-indexable until production SEO data is approved", () => {
    const metadata = createFoundationMetadata("Test");

    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.title).toBe("Pena Ameen | Test");
  });
});
