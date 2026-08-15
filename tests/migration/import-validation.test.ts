import { describe, expect, it } from "vitest";

import { validateImportRecord } from "@/application/services/migration-validation";

describe("migration validation foundation", () => {
  it("quarantines a record with missing required source data", () => {
    expect(
      validateImportRecord({
        sourceId: "source-product-1",
        requiredValues: {
          name: "",
          slug: undefined,
        },
      }),
    ).toEqual({
      valid: false,
      missingFields: ["name", "slug"],
    });
  });

  it("accepts a complete logical record without importing it", () => {
    expect(
      validateImportRecord({
        sourceId: "source-product-1",
        requiredValues: {
          name: "Approved source name",
          slug: "approved-source-slug",
        },
      }),
    ).toEqual({ valid: true });
  });
});
