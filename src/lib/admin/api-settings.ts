import crypto from "crypto";
import fs from "fs";
import path from "path";

export interface ApiSettings {
  midtrans: {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
    merchantId: string;
    webhookUrl: string;
  };
  rajaongkir: {
    apiKey: string;
    tier: "starter" | "basic" | "pro";
    originCityId: string;
    originCityName: string;
    enabledCouriers: string[];
  };
  autoEmail: {
    provider: "resend" | "smtp" | "sendgrid";
    apiKey: string;
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    smtpPass: string;
    senderEmail: string;
    senderName: string;
    sendInvoiceOnPaid: boolean;
    sendTrackingOnShipped: boolean;
    notifyAdminOnOrder: boolean;
  };
  emailForwarding: {
    forwardingEmail: string;
    whatsappAdminPhone: string;
    enableWhatsappNotification: boolean;
  };
  clerkAuth: {
    publishableKey: string;
    secretKey: string;
    adminEmails: string;
  };
}

const SETTINGS_FILE = path.join(process.cwd(), "src/data/api_settings.json");

export const SECRET_MARKER = "\u2022\u2022\u2022\u2022"; // "••••"

const SECRET_FIELDS: Record<keyof ApiSettings, readonly string[]> = {
  midtrans: ["serverKey", "clientKey"],
  rajaongkir: ["apiKey"],
  autoEmail: ["apiKey", "smtpPass"],
  emailForwarding: [],
  clerkAuth: ["secretKey", "publishableKey"],
};

export function isMaskedSecret(value: string): boolean {
  return value.includes(SECRET_MARKER);
}

export function maskSecret(value: string): string {
  if (!value) return "";
  if (value.length <= 8) return `${value.slice(0, 2)}${SECRET_MARKER}`;
  return `${value.slice(0, 4)}${SECRET_MARKER}${value.slice(-4)}`;
}

function getEncryptionKey(): Buffer | null {
  const raw = process.env.APP_SETTINGS_ENCRYPTION_KEY;
  if (!raw) return null;
  try {
    const key = Buffer.from(raw, "hex");
    return key.length === 32 ? key : null;
  } catch {
    return null;
  }
}

function encryptSecret(plain: string, key: Buffer): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

function decryptSecret(payload: string, key: Buffer): string | null {
  try {
    const parts = payload.split(":");
    if (parts.length !== 4 || parts[0] !== "v1") return null;
    const [version, ivB64, tagB64, dataB64] = parts;
    if (!version || !ivB64 || !tagB64 || !dataB64) return null;
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(ivB64, "base64"),
    );
    decipher.setAuthTag(Buffer.from(tagB64, "base64"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataB64, "base64")),
      decipher.final(),
    ]);
    return decrypted.toString("utf8");
  } catch {
    return null;
  }
}

function isEncryptedPayload(value: string): boolean {
  return value.startsWith("v1:");
}

function resolveEnvSecrets(): ApiSettings {
  const adminEmails = process.env.ADMIN_EMAILS || "";
  return {
    midtrans: {
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY || "",
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
      merchantId: "",
      webhookUrl: process.env.APP_BASE_URL
        ? `${process.env.APP_BASE_URL}/api/webhooks/midtrans`
        : "",
    },
    rajaongkir: {
      apiKey: process.env.RAJAONGKIR_API_KEY || "",
      tier: "starter",
      originCityId: "",
      originCityName: "",
      enabledCouriers: [],
    },
    autoEmail: {
      provider: "resend",
      apiKey: process.env.RESEND_API_KEY || "",
      smtpHost: "",
      smtpPort: "",
      smtpUser: "",
      smtpPass: "",
      senderEmail: process.env.EMAIL_FROM || "",
      senderName: "",
      sendInvoiceOnPaid: true,
      sendTrackingOnShipped: true,
      notifyAdminOnOrder: true,
    },
    emailForwarding: {
      forwardingEmail: adminEmails.split(",")[0]?.trim() || "",
      whatsappAdminPhone: "",
      enableWhatsappNotification: false,
    },
    clerkAuth: {
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
      secretKey: process.env.CLERK_SECRET_KEY || "",
      adminEmails,
    },
  };
}

function readStoredSettings(): Partial<ApiSettings> | null {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) return null;
    const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Partial<ApiSettings>) : null;
  } catch (e) {
    console.warn("Could not read api_settings.json:", e);
    return null;
  }
}

function normalizeStoredSettings(
  stored: Partial<ApiSettings> | null,
): ApiSettings {
  const base = resolveEnvSecrets();
  if (!stored) return base;

  const key = getEncryptionKey();

  const mergeGroup = <T extends keyof ApiSettings>(
    group: T,
  ): ApiSettings[T] => {
    const storedGroup = (stored[group] ?? {}) as Partial<ApiSettings[T]>;
    const envGroup = base[group];
    const result = { ...envGroup, ...storedGroup };

    for (const field of SECRET_FIELDS[group]) {
      const storedValue = (storedGroup as Record<string, unknown>)[field as string];
      const envValue = (envGroup as Record<string, string>)[field as string];
      if (typeof storedValue !== "string" || storedValue === "") {
        (result as Record<string, unknown>)[field as string] = envValue || "";
        continue;
      }
      if (isEncryptedPayload(storedValue)) {
        // Legacy plaintext values from before encryption are intentionally
        // dropped: the previous file contained invented TEST-KEY values.
        const decrypted = key ? decryptSecret(storedValue, key) : null;
        (result as Record<string, unknown>)[field as string] =
          decrypted || envValue || "";
      } else {
        (result as Record<string, unknown>)[field as string] = envValue || "";
      }
    }

    return result;
  };

  return {
    midtrans: mergeGroup("midtrans"),
    rajaongkir: mergeGroup("rajaongkir"),
    autoEmail: mergeGroup("autoEmail"),
    emailForwarding: mergeGroup("emailForwarding"),
    clerkAuth: mergeGroup("clerkAuth"),
  };
}

export function getApiSettings(): ApiSettings {
  return normalizeStoredSettings(readStoredSettings());
}

export function getPublicApiSettings(): ApiSettings {
  const full = getApiSettings();
  return maskSecrets(full);
}

export function maskSecrets(settings: ApiSettings): ApiSettings {
  const masked: ApiSettings = JSON.parse(JSON.stringify(settings));
  for (const group of Object.keys(SECRET_FIELDS) as (keyof ApiSettings)[]) {
    for (const field of SECRET_FIELDS[group]) {
      const value = (masked[group] as Record<string, string>)[field as string];
      (masked[group] as Record<string, string>)[field as string] =
        maskSecret(value ?? "");
    }
  }
  return masked;
}

export function saveApiSettings(settings: ApiSettings): void {
  const key = getEncryptionKey();
  const current = getApiSettings();

  const serializable: ApiSettings = JSON.parse(JSON.stringify(settings));

  for (const group of Object.keys(SECRET_FIELDS) as (keyof ApiSettings)[]) {
    for (const field of SECRET_FIELDS[group]) {
      const incoming = (serializable[group] as Record<string, string>)[field as string] ?? "";
      const existingFull = (current[group] as Record<string, string>)[field as string] ?? "";

      let storedValue = "";
      if (isMaskedSecret(incoming)) {
        // Masked values from the UI mean "unchanged": preserve the existing secret.
        storedValue = existingFull
          ? key
            ? encryptSecret(existingFull, key)
            : ""
          : "";
      } else if (incoming !== "") {
        if (!key) {
          // Without an encryption key, secrets are never persisted. They remain
          // environment-variable only.
          console.warn(
            "[ApiSettings] APP_SETTINGS_ENCRYPTION_KEY not set; secret not persisted (env-only).",
          );
        } else {
          storedValue = encryptSecret(incoming, key);
        }
      }

      (serializable[group] as Record<string, string>)[field as string] = storedValue;
    }
  }

  try {
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(serializable, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not write api_settings.json:", e);
  }
}