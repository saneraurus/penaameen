export const GOOGLE_SHEETS_DEFAULT_SPREADSHEET_ID =
  "1OlK9J1kw9U4Br9OCdzVsBw5aabVQ24jwWRNCFFtHETc";

export const GOOGLE_SHEETS_SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
];

export const GOOGLE_SHEETS_API_BASE = "https://sheets.googleapis.com/v4";

export const GOOGLE_SHEETS_TOKEN_URI = "https://oauth2.googleapis.com/token";

export interface SheetsConfig {
  readonly spreadsheetId: string;
  readonly serviceAccountJson: string;
  readonly productSheetName: string;
  readonly movementSheetName: string;
}

export interface ServiceAccountCredentials {
  readonly clientEmail: string;
  readonly privateKey: string;
  readonly tokenUri: string;
  readonly projectId: string | null;
}

export class SheetsConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SheetsConfigError";
  }
}

export function isSheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID &&
    process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON,
  );
}

export function getSheetsConfig(): SheetsConfig {
  const spreadsheetId =
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID ||
    GOOGLE_SHEETS_DEFAULT_SPREADSHEET_ID;
  const serviceAccountJson = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    throw new SheetsConfigError(
      "GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON belum dikonfigurasi. Tambahkan JSON service account Google di environment.",
    );
  }

  return {
    spreadsheetId,
    serviceAccountJson,
    productSheetName: process.env.GOOGLE_SHEETS_SHEET_NAME || "Sheet1",
    movementSheetName:
      process.env.GOOGLE_SHEETS_MOVEMENT_SHEET_NAME || "MUTASI STOCK",
  };
}

export function parseServiceAccountCredentials(
  json: string,
): ServiceAccountCredentials {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new SheetsConfigError(
      "GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON bukan JSON yang valid.",
    );
  }

  const record = parsed as Record<string, unknown>;
  const clientEmail =
    typeof record.client_email === "string" ? record.client_email : "";
  const privateKey =
    typeof record.private_key === "string" ? record.private_key : "";
  const tokenUri =
    typeof record.token_uri === "string"
      ? record.token_uri
      : GOOGLE_SHEETS_TOKEN_URI;
  const projectId =
    typeof record.project_id === "string" ? record.project_id : null;

  if (!clientEmail || !privateKey) {
    throw new SheetsConfigError(
      "GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON harus berisi client_email dan private_key.",
    );
  }

  return { clientEmail, privateKey, tokenUri, projectId };
}
