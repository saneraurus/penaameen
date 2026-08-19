import { createSign } from "node:crypto";
import {
  GOOGLE_SHEETS_SCOPES,
  parseServiceAccountCredentials,
  type ServiceAccountCredentials,
} from "@/infrastructure/sheets/sheets-config";

const TOKEN_LIFETIME_SECONDS = 3600;
const TOKEN_EXPIRY_MARGIN_SECONDS = 300;

interface CachedToken {
  readonly accessToken: string;
  readonly expiresAt: number;
}

let cachedToken: CachedToken | null = null;

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function buildAssertion(
  credentials: ServiceAccountCredentials,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64UrlEncode(
    JSON.stringify({
      iss: credentials.clientEmail,
      scope: GOOGLE_SHEETS_SCOPES.join(" "),
      aud: credentials.tokenUri,
      iat: nowSeconds,
      exp: nowSeconds + TOKEN_LIFETIME_SECONDS,
    }),
  );
  const signingInput = `${header}.${claims}`;
  const signature = createSign("RSA-SHA256")
    .update(signingInput)
    .sign(credentials.privateKey, "base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  return `${signingInput}.${signature}`;
}

export async function exchangeAssertionForToken(
  assertion: string,
  tokenUri: string,
  fetchImpl: typeof fetch = fetch,
): Promise<string> {
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });

  const response = await fetchImpl(tokenUri, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Gagal menukar service account token (HTTP ${response.status})`,
    );
  }

  const payload = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!payload.access_token) {
    throw new Error("Respons token Google tidak berisi access_token");
  }

  const expiresIn = payload.expires_in ?? TOKEN_LIFETIME_SECONDS;
  cachedToken = {
    accessToken: payload.access_token,
    expiresAt: Date.now() + (expiresIn - TOKEN_EXPIRY_MARGIN_SECONDS) * 1000,
  };
  return cachedToken.accessToken;
}

export async function getGoogleSheetsAccessToken(
  serviceAccountJson: string,
  fetchImpl: typeof fetch = fetch,
): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.accessToken;
  }

  cachedToken = null;
  const credentials = parseServiceAccountCredentials(serviceAccountJson);
  const assertion = buildAssertion(credentials);
  return exchangeAssertionForToken(assertion, credentials.tokenUri, fetchImpl);
}

export function resetCachedSheetsTokenForTests(): void {
  cachedToken = null;
}
