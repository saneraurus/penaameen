import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

const fsMock = vi.hoisted(() => {
  const mem = new Map<string, string>();
  return {
    mem,
    fs: {
      existsSync: (p: string) => mem.has(p),
      mkdirSync: () => undefined,
      readFileSync: (p: string) => {
        if (!mem.has(p)) throw new Error("ENOENT");
        return mem.get(p);
      },
      writeFileSync: (p: string, data: string) => {
        mem.set(p, data);
      },
      appendFileSync: (p: string, data: string) => {
        mem.set(p, (mem.get(p) ?? "") + data);
      },
    },
  };
});

vi.mock("fs", () => ({ ...fsMock.fs, default: fsMock.fs }));

import {
  SECRET_MARKER,
  isMaskedSecret,
  maskSecret,
  isPlaceholderSecret,
  getApiSettings,
  getPublicApiSettings,
  saveApiSettings,
  validateSecretReadiness,
  type ApiSettings,
} from "@/lib/admin/api-settings";

const VALID_KEY =
  "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6a7b8c9d0e1f2a3b4c5d6a7b8c9d0e1f2";

function setEnv(overrides: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

describe("api-settings secret handling", () => {
  beforeEach(() => {
    fsMock.mem.clear();
    setEnv({
      APP_SETTINGS_ENCRYPTION_KEY: VALID_KEY,
      MIDTRANS_SERVER_KEY: "env-midtrans-key",
      NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: "env-client-key",
      RAJAONGKIR_API_KEY: "env-rajaongkir-key",
      RESEND_API_KEY: "env-resend-key",
      ADMIN_EMAILS: "owner@penaameen.com",
    });
  });

  afterEach(() => {
    setEnv({
      APP_SETTINGS_ENCRYPTION_KEY: undefined,
      MIDTRANS_SERVER_KEY: undefined,
      NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: undefined,
      RAJAONGKIR_API_KEY: undefined,
      RESEND_API_KEY: undefined,
      ADMIN_EMAILS: undefined,
    });
  });

  it("maskSecret and isMaskedSecret behave consistently", () => {
    expect(isMaskedSecret(maskSecret("supersecretvalue"))).toBe(true);
    expect(isMaskedSecret("supersecretvalue")).toBe(false);
    expect(maskSecret("")).toBe("");
    expect(maskSecret("12345678")).toBe(`12${SECRET_MARKER}`);
    expect(maskSecret("abcdefghijklmno")).toBe(`abcd${SECRET_MARKER}lmno`);
  });

  it("isPlaceholderSecret detects common placeholder patterns", () => {
    expect(isPlaceholderSecret("")).toBe(true);
    expect(isPlaceholderSecret("   ")).toBe(true);
    expect(isPlaceholderSecret("...")).toBe(true);
    expect(isPlaceholderSecret("SB-Mid-server-[REDACTED]...")).toBe(true);
    expect(isPlaceholderSecret("SB-Mid-client-[REDACTED]...")).toBe(true);
    expect(isPlaceholderSecret("re_[REDACTED]")).toBe(true);
    expect(isPlaceholderSecret("re_...")).toBe(true);
    expect(isPlaceholderSecret("nvapi_your_nvidia_api_key")).toBe(true);
    expect(isPlaceholderSecret("gsk_your_groq_api_key")).toBe(true);
    expect(isPlaceholderSecret("sk_tes-[REDACTED]")).toBe(true);
    expect(isPlaceholderSecret("sk_test_-placeholder")).toBe(true);
    expect(isPlaceholderSecret("your_real_secret_key")).toBe(true);
    expect(isPlaceholderSecret("MY_PLACEHOLDER_VALUE")).toBe(true);
  });

  it("isPlaceholderSecret returns false for real credentials", () => {
    expect(
      isPlaceholderSecret("valid_custom_secret_key_1234567890abcdef"),
    ).toBe(false);
    expect(
      isPlaceholderSecret("valid_custom_publishable_key_abcdef123456"),
    ).toBe(false);
    expect(isPlaceholderSecret("valid_custom_ai_key_9876543210fedcba")).toBe(
      false,
    );
    expect(
      isPlaceholderSecret("valid_custom_license_key_4567891234567890"),
    ).toBe(false);
  });

  it("getPublicApiSettings never exposes real secret values", () => {
    const publicSettings = getPublicApiSettings();
    expect(publicSettings.midtrans.serverKey).toBe(
      maskSecret("env-midtrans-key"),
    );
    expect(publicSettings.rajaongkir.apiKey).toBe(
      maskSecret("env-rajaongkir-key"),
    );
    expect(publicSettings.autoEmail.apiKey).toBe(maskSecret("env-resend-key"));
    expect(publicSettings.midtrans.serverKey).not.toContain("env-midtrans-key");
  });

  it("new secrets are encrypted at rest and decrypt on read", () => {
    const current = getApiSettings();
    const updated: ApiSettings = {
      ...current,
      midtrans: { ...current.midtrans, serverKey: "new-midtrans-key" },
    };
    saveApiSettings(updated);

    const roundTripped = getApiSettings();
    expect(roundTripped.midtrans.serverKey).toBe("new-midtrans-key");
  });

  it("masked incoming values mean 'unchanged' and preserve the stored secret", () => {
    const current = getApiSettings();
    const updated: ApiSettings = {
      ...current,
      midtrans: {
        ...current.midtrans,
        serverKey: maskSecret("new-midtrans-key"),
      },
    };
    saveApiSettings(updated);

    const roundTripped = getApiSettings();
    expect(roundTripped.midtrans.serverKey).toBe("env-midtrans-key");
  });

  it("without an encryption key, secrets are never persisted (env remains authoritative)", () => {
    setEnv({ APP_SETTINGS_ENCRYPTION_KEY: undefined });

    const current = getApiSettings();
    const updated: ApiSettings = {
      ...current,
      midtrans: { ...current.midtrans, serverKey: "should-not-persist" },
    };
    saveApiSettings(updated);

    expect(getApiSettings().midtrans.serverKey).toBe("env-midtrans-key");
  });
});

describe("api-settings casaku group", () => {
  beforeEach(() => {
    fsMock.mem.clear();
    setEnv({
      APP_SETTINGS_ENCRYPTION_KEY: VALID_KEY,
      CASAKU_LICENSE_KEY: "env-casaku-license",
      CASAKU_WEBHOOK_SECRET: "env-casaku-webhook",
      CASAKU_QR_ID: "1364518e-748e-4538-85e0-ddba89a3b4f9",
      CASAKU_PACKAGE_IDS: "id.dana, com.gojek.gopaymerchant",
      CASAKU_EXPIRY_MINUTES: "20",
    });
  });

  afterEach(() => {
    setEnv({
      APP_SETTINGS_ENCRYPTION_KEY: undefined,
      CASAKU_LICENSE_KEY: undefined,
      CASAKU_WEBHOOK_SECRET: undefined,
      CASAKU_QR_ID: undefined,
      CASAKU_PACKAGE_IDS: undefined,
      CASAKU_EXPIRY_MINUTES: undefined,
    });
  });

  it("reads env defaults into the casaku group", () => {
    const settings = getApiSettings();
    expect(settings.casaku).toMatchObject({
      enabled: true,
      licenseKey: "env-casaku-license",
      webhookSecret: "env-casaku-webhook",
      qrId: "1364518e-748e-4538-85e0-ddba89a3b4f9",
      expiryMinutes: 20,
    });
    expect(settings.casaku.packageIds).toEqual([
      "id.dana",
      "com.gojek.gopaymerchant",
    ]);
  });

  it("masks casaku secrets in public settings", () => {
    const publicSettings = getPublicApiSettings();
    expect(publicSettings.casaku.licenseKey).toBe(
      maskSecret("env-casaku-license"),
    );
    expect(publicSettings.casaku.webhookSecret).toBe(
      maskSecret("env-casaku-webhook"),
    );
    expect(publicSettings.casaku.licenseKey).not.toContain(
      "env-casaku-license",
    );
  });

  it("persists casaku secrets encrypted and decrypts on read", () => {
    const current = getApiSettings();
    const updated: ApiSettings = {
      ...current,
      casaku: {
        ...current.casaku,
        licenseKey: "new-casaku-license",
        webhookSecret: "new-casaku-webhook",
      },
    };
    saveApiSettings(updated);

    const roundTripped = getApiSettings();
    expect(roundTripped.casaku.licenseKey).toBe("new-casaku-license");
    expect(roundTripped.casaku.webhookSecret).toBe("new-casaku-webhook");
  });

  it("disabled by default when no license key is configured", () => {
    setEnv({ CASAKU_LICENSE_KEY: undefined });
    expect(getApiSettings().casaku.enabled).toBe(false);
  });
});

describe("api-settings buatqris group", () => {
  beforeEach(() => {
    fsMock.mem.clear();
    setEnv({
      APP_SETTINGS_ENCRYPTION_KEY: VALID_KEY,
      BUATQRIS_ACCOUNT_ID: "user_test_account_id",
      BUATQRIS_SECRET_TOKEN: "sk_live_test_secret_token",
      BUATQRIS_API_BASE_URL: "https://api.buatqris.site",
      BUATQRIS_EXPIRY_MINUTES: "20",
    });
  });

  afterEach(() => {
    setEnv({
      APP_SETTINGS_ENCRYPTION_KEY: undefined,
      BUATQRIS_ACCOUNT_ID: undefined,
      BUATQRIS_SECRET_TOKEN: undefined,
      BUATQRIS_API_BASE_URL: undefined,
      BUATQRIS_EXPIRY_MINUTES: undefined,
    });
  });

  it("reads env defaults into the buatqris group", () => {
    const settings = getApiSettings();
    expect(settings.buatqris).toMatchObject({
      enabled: true,
      accountId: "user_test_account_id",
      secretToken: "sk_live_test_secret_token",
      apiBaseUrl: "https://api.buatqris.site",
      expiryMinutes: 20,
    });
  });

  it("masks buatqris secrets in public settings", () => {
    const publicSettings = getPublicApiSettings();
    expect(publicSettings.buatqris?.secretToken).toBe(
      maskSecret("sk_live_test_secret_token"),
    );
    expect(publicSettings.buatqris?.secretToken).not.toContain(
      "sk_live_test_secret_token",
    );
  });

  it("persists buatqris secrets encrypted and decrypts on read", () => {
    const current = getApiSettings();
    const updated: ApiSettings = {
      ...current,
      buatqris: {
        ...current.buatqris!,
        secretToken: "new-buatqris-token",
      },
    };
    saveApiSettings(updated);

    const roundTripped = getApiSettings();
    expect(roundTripped.buatqris?.secretToken).toBe("new-buatqris-token");
  });

  it("disabled by default when no account id is configured", () => {
    setEnv({
      BUATQRIS_ACCOUNT_ID: undefined,
      BUATQRIS_SECRET_TOKEN: undefined,
    });
    expect(getApiSettings().buatqris?.enabled).toBe(false);
  });
});

describe("api-settings placeholder detection", () => {
  beforeEach(() => {
    fsMock.mem.clear();
  });

  it("reports all placeholders and missing as not ready", () => {
    setEnv({
      MIDTRANS_SERVER_KEY: "SB-Mid-server-[REDACTED]...",
      NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: "SB-Mid-client-[REDACTED]...",
      RAJAONGKIR_API_KEY: "",
      RESEND_API_KEY: "re_...",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_your_key",
      CLERK_SECRET_KEY: "sk_tes-[REDACTED]",
      CASAKU_LICENSE_KEY: "cashify_your_license_key",
      CASAKU_WEBHOOK_SECRET: "",
      BUATQRIS_SECRET_TOKEN: "...",
    });

    const result = validateSecretReadiness();

    expect(result.ready).toBe(false);
    expect(result.placeholders).toEqual(
      expect.arrayContaining([
        "midtrans.serverKey",
        "midtrans.clientKey",
        "autoEmail.apiKey",
        "clerkAuth.publishableKey",
        "clerkAuth.secretKey",
        "casaku.licenseKey",
        "buatqris.secretToken",
      ]),
    );
    expect(result.missing).toEqual(
      expect.arrayContaining(["rajaongkir.apiKey", "casaku.webhookSecret"]),
    );
  });

  it("reports ready when all secrets are non-placeholder", () => {
    setEnv({
      MIDTRANS_SERVER_KEY: "real_midtrans_server_key",
      NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: "real_midtrans_client_key",
      RAJAONGKIR_API_KEY: "real_rajaongkir_key",
      RESEND_API_KEY: "re_real_resend_key",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_live_real_publishable_key",
      CLERK_SECRET_KEY: "sk_live_real_secret_key",
      CASAKU_LICENSE_KEY: "cashify_real_license_key",
      CASAKU_WEBHOOK_SECRET: "cashify_real_webhook_secret",
      BUATQRIS_SECRET_TOKEN: "sk_live_real_buatqris_token",
    });

    const result = validateSecretReadiness();

    expect(result.ready).toBe(true);
    expect(result.placeholders).toHaveLength(0);
    expect(result.missing).toHaveLength(0);
  });
});
