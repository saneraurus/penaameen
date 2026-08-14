import { describe, expect, it } from "vitest";

import {
  toHttpStatus,
  toPublicErrorResponse,
} from "@/application/errors/application-error";
import { createCorrelationId } from "@/domain/common/identifiers";

describe("application error model", () => {
  it("maps conflicts to a stable HTTP status", () => {
    expect(
      toHttpStatus({
        code: "CONFLICT",
        message: "Current state changed.",
        correlationId: createCorrelationId("test-conflict"),
      }),
    ).toBe(409);
  });

  it("omits internal causes from public responses", () => {
    const response = toPublicErrorResponse({
      code: "INFRASTRUCTURE_ERROR",
      message: "Please retry later.",
      correlationId: createCorrelationId("test-error"),
      cause: new Error("database credential must not leak"),
    });

    expect(response).toEqual({
      error: {
        code: "INFRASTRUCTURE_ERROR",
        message: "Please retry later.",
        requestId: createCorrelationId("test-error"),
      },
    });
  });
});
