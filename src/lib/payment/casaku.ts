import crypto from "crypto";

/**
 * Minimal server-side client for the Casaku QRIS payment API
 * (ex-Cashify; migrated to Casaku.id — https://casaku.id/docs).
 *
 * All credentials live in environment variables / admin settings and are
 * never exposed to the browser. API contract per official docs v2.1:
 * base https://api.casaku.id, auth via `x-license-key` header.
 */

export const CASAKU_DEFAULT_BASE_URL = "https://api.casaku.id";
export const CASAKU_QR_IMAGE_URL =
  "https://larabert-qrgen.hf.space/v1/create-qr-code";

export type CasakuPaymentStatus =
  "pending" | "paid" | "success" | "cancel" | "expired";

export type CasakuConfig = {
  readonly licenseKey: string;
  readonly qrId: string;
  readonly baseUrl?: string;
  readonly packageIds?: string[];
  readonly expiryMinutes?: number;
  readonly prefix?: string;
};

export type CasakuQrisData = {
  readonly transactionId: string;
  readonly qrString?: string;
  readonly originalAmount: number;
  readonly totalAmount: number;
  readonly uniqueNominal: number;
  readonly useUniqueCode: boolean;
  readonly packageIds: string[];
  readonly expiredInMinutes: number;
  readonly status: CasakuPaymentStatus;
  readonly paymentUrl?: string;
};

export type CasakuCheckStatusData = {
  readonly transactionId: string;
  readonly amount: number;
  readonly status: CasakuPaymentStatus;
  readonly expiredAt?: string;
};

export type CasakuProfileData = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly vipstatus: boolean;
  readonly vipexpires?: string;
  readonly maxgenerateqris: number;
  readonly storeName?: string;
};

export type CasakuWebhookPayload = {
  readonly transactionId: string;
  readonly amount: number;
  readonly packageName?: string | undefined;
  readonly appName?: string | undefined;
  readonly status: CasakuPaymentStatus;
  readonly paidAt?: string | undefined;
};

export class CasakuError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "CasakuError";
    this.status = status;
  }
}

type CasakuEnvelope<T> = {
  readonly status: number;
  readonly message?: string;
  readonly data: T;
};

function isEnvelope<T>(body: unknown): body is CasakuEnvelope<T> {
  if (!body || typeof body !== "object") return false;
  const candidate = body as Record<string, unknown>;
  return (
    typeof candidate.status === "number" &&
    typeof candidate.data === "object" &&
    candidate.data !== null
  );
}

export class CasakuClient {
  private readonly licenseKey: string;
  private readonly qrId: string;
  private readonly baseUrl: string;
  private readonly packageIds: string[];
  private readonly expiryMinutes: number;
  private readonly prefix: string;

  constructor(config: CasakuConfig) {
    this.licenseKey = config.licenseKey;
    this.qrId = config.qrId;
    this.baseUrl = (config.baseUrl ?? CASAKU_DEFAULT_BASE_URL).replace(
      /\/+$/,
      "",
    );
    this.packageIds = config.packageIds?.length
      ? config.packageIds
      : ["id.dana"];
    this.expiryMinutes = config.expiryMinutes ?? 15;
    this.prefix = config.prefix ?? "PA";
  }

  private async request<T>(
    path: string,
    init: { method?: "GET" | "POST"; body?: unknown },
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-license-key": this.licenseKey,
      Accept: "application/json",
    };

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method: init.method ?? "POST",
        headers,
        body: init.body !== undefined ? JSON.stringify(init.body) : null,
        signal: AbortSignal.timeout(30_000),
      });
    } catch (error) {
      throw new CasakuError(
        `Gagal menghubungi Casaku API: ${
          error instanceof Error ? error.message : "network error"
        }`,
      );
    }

    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (!response.ok) {
      const message =
        body && typeof body === "object" && "message" in body
          ? String((body as { message: unknown }).message)
          : `Casaku API responded with HTTP ${response.status}`;
      throw new CasakuError(message, response.status);
    }

    if (!isEnvelope<T>(body)) {
      throw new CasakuError("Respons Casaku tidak sesuai kontrak API");
    }

    if (body.status !== 200) {
      throw new CasakuError(
        body.message ?? `Casaku API error (status ${body.status})`,
        body.status,
      );
    }

    return body.data;
  }

  async generateQris(params: {
    qrId?: string;
    amount: number;
    packageIds?: string[];
    useUniqueCode?: boolean;
    expiredInMinutes?: number;
    prefix?: string;
  }): Promise<CasakuQrisData> {
    // The Casaku v2 API uses snake_case field names (qr_string, payment_url);
    // normalize them to the camelCase contract used across this codebase.
    const raw = await this.request<{
      transactionId: string;
      qr_string?: string;
      originalAmount: number;
      totalAmount: number;
      uniqueNominal: number;
      useUniqueCode: boolean;
      packageIds: string[];
      expiredInMinutes: number;
      status: CasakuPaymentStatus;
      payment_url?: string;
    }>("/api/generate/v2/qris", {
      body: {
        qr_id: params.qrId ?? this.qrId,
        amount: params.amount,
        useUniqueCode: params.useUniqueCode ?? true,
        packageIds: params.packageIds?.length
          ? params.packageIds
          : this.packageIds,
        expiredInMinutes: params.expiredInMinutes ?? this.expiryMinutes,
        qrType: "dynamic",
        paymentMethod: "qris",
        useQris: true,
        prefix: params.prefix ?? this.prefix,
      },
    });

    return {
      transactionId: raw.transactionId,
      qrString: raw.qr_string ?? "",
      originalAmount: raw.originalAmount,
      totalAmount: raw.totalAmount,
      uniqueNominal: raw.uniqueNominal,
      useUniqueCode: raw.useUniqueCode,
      packageIds: raw.packageIds ?? this.packageIds,
      expiredInMinutes: raw.expiredInMinutes,
      status: raw.status,
      paymentUrl: raw.payment_url ?? "",
    };
  }

  async checkStatus(transactionId: string): Promise<CasakuCheckStatusData> {
    return this.request<CasakuCheckStatusData>("/api/generate/check-status", {
      body: { transactionId },
    });
  }

  async cancel(transactionId: string): Promise<{ canceledAt: string }> {
    return this.request<{
      transactionId: string;
      status: string;
      canceledAt: string;
    }>("/api/generate/cancel-status", { body: { transactionId } });
  }

  async getProfile(): Promise<CasakuProfileData> {
    return this.request<CasakuProfileData>("/api/profile", { method: "GET" });
  }

  /** Official Casaku QR renderer URL for a QRIS string. */
  qrImageUrl(
    data: string,
    size: "200x200" | "300x300" | "500x500" = "300x300",
  ): string {
    const url = new URL(CASAKU_QR_IMAGE_URL);
    url.searchParams.set("size", size);
    url.searchParams.set("style", "2");
    url.searchParams.set("color", "111111");
    url.searchParams.set("data", data);
    return url.toString();
  }
}

/**
 * Verifies a Casaku webhook HMAC-SHA256 signature (constant-time).
 * The raw request body must be used — re-serializing JSON breaks the digest.
 */
export function verifyCasakuWebhookSignature(
  rawBody: string | Buffer,
  signature: string | undefined,
  secret: string,
): boolean {
  if (!signature || !secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  let providedBuffer: Buffer;
  try {
    providedBuffer = Buffer.from(signature, "hex");
  } catch {
    return false;
  }
  if (providedBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

export function parseCasakuWebhookPayload(
  rawBody: string,
): CasakuWebhookPayload {
  const parsed = JSON.parse(rawBody) as Record<string, unknown>;
  const { transactionId, amount, status } = parsed;
  if (typeof transactionId !== "string" || transactionId === "") {
    throw new CasakuError("Webhook payload missing transactionId");
  }
  if (typeof amount !== "number") {
    throw new CasakuError("Webhook payload missing numeric amount");
  }
  if (
    typeof status !== "string" ||
    !["paid", "pending", "cancel", "expired"].includes(status)
  ) {
    throw new CasakuError(
      `Webhook payload has unsupported status: ${String(status)}`,
    );
  }
  return {
    transactionId,
    amount,
    status: status as CasakuWebhookPayload["status"],
    packageName:
      typeof parsed.packageName === "string" ? parsed.packageName : undefined,
    appName: typeof parsed.appName === "string" ? parsed.appName : undefined,
    paidAt: typeof parsed.paidAt === "string" ? parsed.paidAt : undefined,
  };
}
