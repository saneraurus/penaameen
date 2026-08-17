import { describe, expect, it } from "vitest";

import { redactLogContext } from "@/application/observability/redaction";
import { isSafeRelativeRedirect } from "@/application/security/safe-redirect";
import { validateUploadMetadata } from "@/application/security/upload-validation";

describe("security foundation", () => {
  it("redacts sensitive log context", () => {
    expect(
      redactLogContext({
        operation: "checkout",
        apiKey: "do-not-log",
        email: "customer@example.test",
        nested: { token: "do-not-log" },
      }),
    ).toEqual({
      operation: "checkout",
      apiKey: "[REDACTED]",
      email: "[REDACTED]",
      nested: { token: "[REDACTED]" },
    });
  });

  it("rejects open redirect targets", () => {
    expect(isSafeRelativeRedirect("https://untrusted.example")).toBe(false);
    expect(isSafeRelativeRedirect("//untrusted.example")).toBe(false);
    expect(isSafeRelativeRedirect("/%2f%2funtrusted.example")).toBe(false);
    expect(isSafeRelativeRedirect("/shop")).toBe(true);
  });

  it("requires an explicit upload policy", () => {
    const policy = {
      allowedMimeTypes: new Set(["image/test"]),
      maximumContentLength: 100,
    };

    expect(
      validateUploadMetadata(
        {
          fileName: "foundation-image",
          mimeType: "image/test",
          contentLength: 10,
        },
        policy,
      ),
    ).toEqual({ valid: true });

    expect(
      validateUploadMetadata(
        {
          fileName: "foundation-image",
          mimeType: "image/unknown",
          contentLength: 10,
        },
        policy,
      ),
    ).toMatchObject({ valid: false });
  });
});
