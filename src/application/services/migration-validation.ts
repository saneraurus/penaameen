export type ImportRecord = {
  readonly sourceId: string;
  readonly requiredValues: Readonly<Record<string, string | undefined>>;
};

export type ImportValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly missingFields: readonly string[] };

export function validateImportRecord(
  record: ImportRecord,
): ImportValidationResult {
  const missingFields = Object.entries(record.requiredValues)
    .filter(([, value]) => value === undefined || value.trim().length === 0)
    .map(([field]) => field);

  if (record.sourceId.trim().length === 0) {
    return {
      valid: false,
      missingFields: ["sourceId", ...missingFields],
    };
  }

  if (missingFields.length > 0) {
    return { valid: false, missingFields };
  }

  return { valid: true };
}
