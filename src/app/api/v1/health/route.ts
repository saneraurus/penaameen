import { NextResponse } from "next/server";

import { getServerConfig } from "@/application/config/config";
import { getFoundationHealth } from "@/application/services/get-foundation-health";
import { createRequestCorrelationId } from "@/infrastructure/observability/correlation-id";

export function GET(request: Request) {
  const correlationId = createRequestCorrelationId(
    request.headers.get("x-request-id"),
  );
  const config = getServerConfig();

  const health = getFoundationHealth(config);
  return NextResponse.json(
    {
      data: health,
      meta: {
        requestId: correlationId,
      },
    },
    {
      status: health.readiness.state === "blocked" ? 503 : 200,
      headers: {
        "x-request-id": correlationId,
        "cache-control": "no-store",
      },
    },
  );
}
