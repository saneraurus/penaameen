import {
  GOOGLE_SHEETS_API_BASE,
  type SheetsConfig,
} from "@/infrastructure/sheets/sheets-config";
import { getGoogleSheetsAccessToken } from "@/infrastructure/sheets/service-account-jwt";

const REQUEST_TIMEOUT_MS = 15_000;

export class SheetsApiError extends Error {
  readonly status: number;
  readonly kind:
    "auth" | "not_found" | "rate_limited" | "invalid_request" | "provider";

  constructor(status: number, kind: SheetsApiError["kind"], message: string) {
    super(message);
    this.name = "SheetsApiError";
    this.status = status;
    this.kind = kind;
  }
}

function classifyError(status: number): SheetsApiError["kind"] {
  if (status === 401 || status === 403) return "auth";
  if (status === 404) return "not_found";
  if (status === 429) return "rate_limited";
  if (status >= 400 && status < 500) return "invalid_request";
  return "provider";
}

export function sheetRange(sheetName: string, range: string): string {
  return `'${sheetName.replace(/'/g, "''")}'!${range}`;
}

export interface SheetsSpreadsheetInfo {
  readonly sheets: ReadonlyArray<{
    readonly sheetId: number;
    readonly title: string;
  }>;
}

export class SheetsApiClient {
  private readonly config: SheetsConfig;

  constructor(config: SheetsConfig) {
    this.config = config;
  }

  private async request(
    path: string,
    init: RequestInit = {},
    fetchImpl: typeof fetch = fetch,
  ): Promise<unknown> {
    const accessToken = await getGoogleSheetsAccessToken(
      this.config.serviceAccountJson,
      fetchImpl,
    );
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetchImpl(`${GOOGLE_SHEETS_API_BASE}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          ...init.headers,
        },
        signal: controller.signal,
        cache: "no-store",
      });
    } catch (error) {
      throw new SheetsApiError(
        0,
        "provider",
        error instanceof Error
          ? error.message
          : "Gagal menghubungi Google Sheets",
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const providerMessage = await response.text().catch(() => "");
      throw new SheetsApiError(
        response.status,
        classifyError(response.status),
        `Google Sheets API gagal (HTTP ${response.status})${
          providerMessage ? `: ${providerMessage}` : ""
        }`,
      );
    }

    if (response.status === 204) return null;
    return response.json();
  }

  async getSpreadsheetInfo(): Promise<SheetsSpreadsheetInfo> {
    const payload = (await this.request(
      `/spreadsheets/${encodeURIComponent(this.config.spreadsheetId)}?fields=sheets.properties(sheetId,title)`,
    )) as {
      sheets?: Array<{ properties?: { sheetId?: number; title?: string } }>;
    };

    return {
      sheets: (payload.sheets ?? [])
        .map((sheet) => ({
          sheetId: sheet.properties?.sheetId ?? -1,
          title: sheet.properties?.title ?? "",
        }))
        .filter((sheet) => sheet.title.length > 0),
    };
  }

  async addSheet(title: string): Promise<void> {
    await this.request(
      `/spreadsheets/${encodeURIComponent(this.config.spreadsheetId)}:batchUpdate`,
      {
        method: "POST",
        body: JSON.stringify({
          requests: [
            {
              addSheet: {
                properties: { title },
              },
            },
          ],
        }),
      },
    );
  }

  async valuesGet(range: string): Promise<unknown[][]> {
    const payload = (await this.request(
      `/spreadsheets/${encodeURIComponent(this.config.spreadsheetId)}/values/${encodeURIComponent(range)}`,
    )) as { values?: unknown[][] };
    return payload.values ?? [];
  }

  async valuesAppend(range: string, values: unknown[][]): Promise<void> {
    await this.request(
      `/spreadsheets/${encodeURIComponent(this.config.spreadsheetId)}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        body: JSON.stringify({
          values,
          majorDimension: "ROWS",
        }),
      },
    );
  }

  async valuesUpdate(range: string, values: unknown[][]): Promise<void> {
    await this.request(
      `/spreadsheets/${encodeURIComponent(this.config.spreadsheetId)}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        body: JSON.stringify({
          values,
          majorDimension: "ROWS",
        }),
      },
    );
  }

  async valuesClear(range: string): Promise<void> {
    await this.request(
      `/spreadsheets/${encodeURIComponent(this.config.spreadsheetId)}/values/${encodeURIComponent(range)}:clear`,
      { method: "POST" },
    );
  }
}
