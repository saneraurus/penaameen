/**
 * Client-safe URL builder for the self-hosted QRIS QR endpoint.
 *
 * Client components cannot import the `qrcode` library, so instead of
 * rendering in the browser they ask our own server route
 * `/api/payments/casaku/qr` to render the PNG. This keeps a single QR
 * renderer (server-side) and removes the dependency on any third-party QR
 * image service.
 */

export type QrRenderSize = 200 | 300 | 500;

export function qrisQrImageUrl(data: string, size: QrRenderSize = 300): string {
  if (!data) return "";
  if (
    data.startsWith("http://") ||
    data.startsWith("https://") ||
    data.startsWith("data:image/")
  ) {
    return data;
  }
  if (typeof window === "undefined") {
    return data;
  }
  const url = new URL("/api/payments/casaku/qr", window.location.origin);
  url.searchParams.set("data", data);
  url.searchParams.set("size", String(size));
  return url.toString();
}

export const casakuQrImageUrl = qrisQrImageUrl;
