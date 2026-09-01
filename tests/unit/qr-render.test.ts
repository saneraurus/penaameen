import { describe, expect, it } from "vitest";
import {
  isValidQrData,
  parseQrSize,
  renderQrPng,
  QrRenderError,
} from "@/lib/qr/qr-render";

// A representative (non-secret) QRIS-style payload — EMVCo ASCII string.
const SAMPLE_QRIS =
  "00020101021126630012COM.CASAKU011893600012345678901011234567890123456789020123456789012345678901234567890303UMI5144001500012345678901234567890156304A1B";

describe("qr-render (self-hosted Casaku QRIS renderer)", () => {
  it("renders a valid PNG buffer for a QRIS payload", async () => {
    const png = await renderQrPng(SAMPLE_QRIS, 300);
    expect(Buffer.isBuffer(png)).toBe(true);
    // PNG magic number: 89 50 4E 47 0D 0A 1A 0A
    expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  });

  it("honors the requested size", async () => {
    const small = await renderQrPng(SAMPLE_QRIS, 200);
    const large = await renderQrPng(SAMPLE_QRIS, 500);
    expect(large.length).toBeGreaterThan(small.length);
  });

  it("rejects non-ASCII / out-of-range input", async () => {
    await expect(renderQrPng("héllo", 300)).rejects.toBeInstanceOf(
      QrRenderError,
    );
    await expect(renderQrPng("short", 300)).rejects.toBeInstanceOf(
      QrRenderError,
    );
  });

  it("isValidQrData enforces printable ASCII 8-4096", () => {
    expect(isValidQrData(SAMPLE_QRIS)).toBe(true);
    expect(isValidQrData("")).toBe(false);
    expect(isValidQrData("a".repeat(4097))).toBe(false);
    expect(isValidQrData("emoji😀")).toBe(false);
  });

  it("parseQrSize falls back to 300 for invalid input", () => {
    expect(parseQrSize("200")).toBe(200);
    expect(parseQrSize("999")).toBe(300);
    expect(parseQrSize(undefined)).toBe(300);
  });
});
