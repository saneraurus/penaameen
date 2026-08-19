import { describe, expect, it } from "vitest";
import { sanitizeReplyLinks } from "@/lib/assistant/reply-guard";

describe("assistant reply-guard", () => {
  it("keeps official penaameen.com links unchanged", () => {
    const reply =
      "Lihat detail di https://penaameen.com/produk dan https://www.penaameen.com/kontak";
    expect(sanitizeReplyLinks(reply)).toBe(reply);
  });

  it("keeps wa.me and official email links unchanged", () => {
    const reply =
      "Hubungi kami via https://wa.me/6282231239158 atau mailto:cs.penaameen@yahoo.com";
    expect(sanitizeReplyLinks(reply)).toBe(reply);
  });

  it("strips disallowed third-party links", () => {
    const reply = "Info selengkapnya di https://example.com/buy-now ya";
    const sanitized = sanitizeReplyLinks(reply);
    expect(sanitized).not.toContain("example.com");
    expect(sanitized).toContain("penaameen.com");
  });

  it("handles bare www. links and plain text without links", () => {
    expect(
      sanitizeReplyLinks("Kunjungi www.unknown-site.org/xyz"),
    ).not.toContain("unknown-site");
    expect(sanitizeReplyLinks("Tidak ada tautan di sini.")).toBe(
      "Tidak ada tautan di sini.",
    );
  });
});
