import { NextResponse } from "next/server";
import { getBranches, getBranchBySlug } from "@/lib/content";

export async function GET(request: Request) {
  try {
    const slug = new URL(request.url).searchParams.get("slug");
    if (slug) return NextResponse.json({ branch: await getBranchBySlug(slug) });
    return NextResponse.json(
      { branches: await getBranches() },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Branch data unavailable" },
      { status: 503 },
    );
  }
}
