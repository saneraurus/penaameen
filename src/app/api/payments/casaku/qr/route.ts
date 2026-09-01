import { NextResponse } from "next/server";
import {
  parseQrSize,
  renderQrPng,
  QrRenderError,
  type QrRenderSize,
} from "@/lib/qr/qr-render";

/**
 * Self-hosted QRIS QR renderer.
 *
 * Replaces the third-party HF Space image service the checkout UI previously
 * relied on. Given a Casaku `qr_string` (the raw QRIS payment payload) it
 * returns a PNG. This is intentionally a public endpoint: the input is the
 * payment payload itself (not a secret), and the output is just a scannable
 * image — nothing in the request can leak credentials or order data.
 *
 * Input is length/character-validated in `renderQrPng` to avoid being used as
 * a resource oracle.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get("data");
  const size = parseQrSize(searchParams.get("size"));

  if (!data) {
    return NextResponse.json(
      { error: "Missing data parameter" },
      { status: 400 },
    );
  }

  try {
    const png = await renderQrPng(data, size as QrRenderSize);
    return new NextResponse(new Uint8Array(png), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=300, immutable",
      },
    });
  } catch (error) {
    if (error instanceof QrRenderError && error.reason === "invalid_data") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("QR render failed:", error);
    return NextResponse.json({ error: "QR rendering failed" }, { status: 500 });
  }
}
