export type ValidationIssue = {
  readonly field: string;
  readonly message: string;
};

export type ObjectValidationResult =
  | { readonly valid: true; readonly value: Readonly<Record<string, unknown>> }
  | { readonly valid: false; readonly issues: readonly ValidationIssue[] };

export function validateObjectInput(input: unknown): ObjectValidationResult {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return {
      valid: false,
      issues: [
        {
          field: "body",
          message: "Expected an object payload.",
        },
      ],
    };
  }

  return {
    valid: true,
    value: input as Readonly<Record<string, unknown>>,
  };
}
