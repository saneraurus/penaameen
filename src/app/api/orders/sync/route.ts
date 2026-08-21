import { NextResponse } from "next/server";

/**
 * Local browser history is display-only and must never become an authoritative
 * order source. Orders are created by the server checkout flow only.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Riwayat lokal bukan sumber order resmi. Pesanan hanya dibuat melalui checkout server.",
    },
    { status: 410 },
  );
}
