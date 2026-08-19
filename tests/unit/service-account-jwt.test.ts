import { describe, expect, it } from "vitest";
import { generateKeyPairSync } from "node:crypto";
import {
  buildAssertion,
  exchangeAssertionForToken,
  resetCachedSheetsTokenForTests,
} from "@/infrastructure/sheets/service-account-jwt";
import type { ServiceAccountCredentials } from "@/infrastructure/sheets/sheets-config";

const { privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const credentials: ServiceAccountCredentials = {
  clientEmail: "stock-sheet@penaameen.iam.gserviceaccount.com",
  privateKey: String(privateKey.export({ type: "pkcs8", format: "pem" })),
  tokenUri: "https://oauth2.googleapis.com/token",
  projectId: "penaameen",
};

describe("service-account-jwt", () => {
  it("builds a three-part RS256 assertion with correct claims", () => {
    const now = 1_700_000_000;
    const assertion = buildAssertion(credentials, now);
    const parts = assertion.split(".");
    const headerB64 = parts[0]!;
    const claimsB64 = parts[1]!;
    const signatureB64 = parts[2]!;

    expect(headerB64).toBeDefined();
    expect(claimsB64).toBeDefined();
    expect(signatureB64).toBeDefined();
    expect(signatureB64).not.toBe("");

    const header = JSON.parse(
      Buffer.from(headerB64, "base64").toString("utf8"),
    ) as { alg: string; typ: string };
    expect(header).toEqual({ alg: "RS256", typ: "JWT" });

    const claims = JSON.parse(
      Buffer.from(claimsB64, "base64").toString("utf8"),
    ) as {
      iss: string;
      scope: string;
      aud: string;
      iat: number;
      exp: number;
    };
    expect(claims.iss).toBe(credentials.clientEmail);
    expect(claims.aud).toBe(credentials.tokenUri);
    expect(claims.scope).toContain(
      "https://www.googleapis.com/auth/spreadsheets",
    );
    expect(claims.iat).toBe(now);
    expect(claims.exp).toBe(now + 3600);
  });

  it("exchanges an assertion for an access token", async () => {
    resetCachedSheetsTokenForTests();
    const fetchImpl = (async () => {
      return new Response(
        JSON.stringify({ access_token: "ya29.fake-token", expires_in: 3600 }),
        { status: 200 },
      );
    }) as typeof fetch;

    const token = await exchangeAssertionForToken(
      "header.claims.signature",
      credentials.tokenUri,
      fetchImpl,
    );
    expect(token).toBe("ya29.fake-token");
  });

  it("throws when the token endpoint fails", async () => {
    resetCachedSheetsTokenForTests();
    const fetchImpl = (async () => {
      return new Response(JSON.stringify({ error: "invalid_grant" }), {
        status: 400,
      });
    }) as typeof fetch;

    await expect(
      exchangeAssertionForToken("a.b.c", credentials.tokenUri, fetchImpl),
    ).rejects.toThrow(/HTTP 400/);
  });
});
