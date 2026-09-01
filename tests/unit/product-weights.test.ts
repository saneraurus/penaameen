import { describe, expect, it } from "vitest";
import { resolveProductWeightGrams } from "@/data/product-weights";

describe("resolveProductWeightGrams", () => {
  it("returns trusted weight on exact name match", () => {
    const r = resolveProductWeightGrams("Buku ACM Anak");
    expect(r).toEqual({ grams: 200, estimated: false });
  });

  it("is case/space insensitive", () => {
    const r = resolveProductWeightGrams("  buku acm anak  ");
    expect(r.grams).toBe(200);
    expect(r.estimated).toBe(false);
  });

  it("falls back to ACM group median for unknown ACM-ish name", () => {
    const r = resolveProductWeightGrams("Buku ACM Spesial Edisi Lebaran");
    expect(r.estimated).toBe(true);
    expect(r.grams).toBeGreaterThan(0);
  });

  it("falls back to ABQ group median for unknown ABQ-ish name", () => {
    const r = resolveProductWeightGrams("Paket ABQ Bundling Promo");
    expect(r.estimated).toBe(true);
    // ABQ median from the declared weights should be a known positive value.
    expect(r.grams).toBeGreaterThan(0);
  });
});
