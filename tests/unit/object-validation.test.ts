import { describe, expect, it } from "vitest";

import { validateObjectInput } from "@/application/validation/object-validation";

describe("validateObjectInput", () => {
  it("rejects non-object input", () => {
    expect(validateObjectInput("not-an-object")).toEqual({
      valid: false,
      issues: [{ field: "body", message: "Expected an object payload." }],
    });
  });

  it("accepts object input without trusting its field shapes", () => {
    expect(validateObjectInput({ value: "untrusted" })).toEqual({
      valid: true,
      value: { value: "untrusted" },
    });
  });
});
