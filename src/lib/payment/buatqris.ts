import crypto from "crypto";

/**
 * Server-side client for the BuatQRIS API (https://buatqris.site).
 *
 * All credentials live in environment variables / admin settings and are
 * never exposed to the browser.
 */

export const BUATQRIS_DEFAULT_BASE_URL = "https://api.buatqris.site";

export type BuatQrisPaymentStatus =
  "pending" | "success" | "paid" | "expired" | "failed" | "cancel";

export type BuatQrisConfig = {
  readonly accountId: string;
  readonly secretToken: string;
  readonly baseUrl?: string;
  readonly expiryMinutes?: number;
};

export type BuatQrisQrisData = {
  readonly transactionId: string;
  readonly amount: number;
  readonly totalAmount: number;
  readonly amountUniq: number;
  readonly adminFee: number;
  readonly creditAmount: number;
  readonly qrisMethod: string;
  readonly description?: string | undefined;
  readonly umkmName: string;
  readonly qrisImage?: string | undefined; // Base64 data URL
  readonly qrUrl?: string | undefined; // Direct image URL
  readonly paymentUrl?: string | undefined; // Direct BuatQRIS payment landing page
  readonly expiredAt: string;
  readonly status: BuatQrisPaymentStatus;
};

export type BuatQrisCheckStatusData = {
  readonly transactionId: string;
  readonly status: BuatQrisPaymentStatus;
  readonly amount: number;
  readonly totalAmount: number;
  readonly adminFee?: number | undefined;
  readonly creditAmount?: number | undefined;
  readonly qrisMethod?: string | undefined;
  readonly paidAt?: string | undefined;
  readonly updatedAt?: string | undefined;
  readonly raw?: Record<string, unknown> | undefined;
};

export type BuatQrisWebhookPayload = {
  readonly event: string;
  readonly transactionId: string;
  readonly amount?: number | undefined;
  readonly totalAmount?: number | undefined;
  readonly status: BuatQrisPaymentStatus;
  readonly raw?: Record<string, unknown> | undefined;
};

export class BuatQrisError extends Error {
  readonly status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "BuatQrisError";
    this.status = status;
  }
}

type BuatQrisEnvelope<T> = {
  readonly success: boolean;
  readonly message?: string;
  readonly data?: T;
};

export class BuatQrisClient {
  private readonly accountId: string;
  private readonly secretToken: string;
  private readonly baseUrl: string;

  constructor(config: BuatQrisConfig) {
    this.accountId = config.accountId;
    this.secretToken = config.secretToken;
    this.baseUrl = (config.baseUrl ?? BUATQRIS_DEFAULT_BASE_URL).replace(
      /\/+$/,
      "",
    );
  }

  private async request<T>(
    action: string,
    extraParams: Record<string, unknown> = {},
  ): Promise<T> {
    const payload = {
      action,
      account_id: this.accountId,
      secret_token: this.secretToken,
      ...extraParams,
    };

    let response: Response;
    try {
      response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30_000),
      });
    } catch (error) {
      throw new BuatQrisError(
        `Gagal menghubungi BuatQRIS API: ${
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
          : `BuatQRIS API error (HTTP ${response.status})`;
      throw new BuatQrisError(message, response.status);
    }

    const envelope = body as BuatQrisEnvelope<T> | null;
    if (!envelope || typeof envelope !== "object") {
      throw new BuatQrisError("Respons BuatQRIS tidak valid");
    }

    if (!envelope.success) {
      throw new BuatQrisError(
        envelope.message ?? "BuatQRIS API error",
        response.status,
      );
    }

    if (!envelope.data) {
      throw new BuatQrisError("Data tidak ditemukan dalam respons BuatQRIS");
    }

    return envelope.data;
  }

  async createQris(params: {
    amount: number;
    description?: string;
    qrisMethod?: string;
    callbackUrl?: string;
  }): Promise<BuatQrisQrisData> {
    const raw = await this.request<{
      transaction_id: string;
      amount: number;
      total_amount: number;
      amount_uniq?: number;
      admin_fee?: number;
      credit_amount?: number;
      qris_method?: string;
      description?: string;
      umkm_name?: string;
      qris_image?: string;
      qr_url?: string;
      payment_url?: string;
      expired_at: string;
      status: BuatQrisPaymentStatus;
    }>("api_create_qris", {
      amount: params.amount,
      description: params.description ?? "Order Pembayaran",
      ...(params.qrisMethod ? { qris_method: params.qrisMethod } : {}),
      ...(params.callbackUrl ? { callback_url: params.callbackUrl } : {}),
    });

    return {
      transactionId: raw.transaction_id,
      amount: raw.amount,
      totalAmount: raw.total_amount,
      amountUniq: raw.amount_uniq ?? 0,
      adminFee: raw.admin_fee ?? 0,
      creditAmount: raw.credit_amount ?? raw.amount,
      qrisMethod: raw.qris_method ?? "qris",
      description: raw.description,
      umkmName: raw.umkm_name ?? "Pena Ameen",
      qrisImage: raw.qris_image,
      qrUrl: raw.qr_url,
      paymentUrl: raw.payment_url,
      expiredAt: raw.expired_at,
      status: raw.status ?? "pending",
    };
  }

  async checkStatus(transactionId: string): Promise<BuatQrisCheckStatusData> {
    const raw = await this.request<{
      transaction_id: string;
      status: BuatQrisPaymentStatus;
      amount: number;
      total_amount: number;
      admin_fee?: number;
      credit_amount?: number;
      qris_method?: string;
      updated_at?: string;
    }>("api_check_status", {
      transaction_id: transactionId,
    });

    return {
      transactionId: raw.transaction_id,
      status: raw.status,
      amount: raw.amount,
      totalAmount: raw.total_amount,
      adminFee: raw.admin_fee,
      creditAmount: raw.credit_amount,
      qrisMethod: raw.qris_method,
      updatedAt: raw.updated_at,
    };
  }
}

/**
 * Verifies a BuatQRIS webhook HMAC-SHA256 signature (constant-time).
 * The raw request body must be used — re-serializing JSON breaks the digest.
 */
export function verifyBuatQrisWebhookSignature(
  rawBody: string | Buffer,
  signature: string | undefined,
  secretToken: string,
): boolean {
  if (!signature || !secretToken) return false;
  const expected = crypto
    .createHmac("sha256", secretToken)
    .update(rawBody)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  let providedBuffer: Buffer;
  try {
    providedBuffer = Buffer.from(signature.trim(), "hex");
  } catch {
    return false;
  }
  if (providedBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

export function parseBuatQrisWebhookPayload(
  rawBody: string,
  eventHeader?: string | null,
  deliveryHeader?: string | null,
): BuatQrisWebhookPayload {
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    throw new BuatQrisError("Payload webhook bukan JSON valid");
  }

  const dataObj =
    typeof parsed.data === "object" && parsed.data !== null
      ? (parsed.data as Record<string, unknown>)
      : parsed;

  const transactionId =
    (typeof dataObj.transaction_id === "string" && dataObj.transaction_id) ||
    (typeof dataObj.transactionId === "string" && dataObj.transactionId) ||
    (typeof parsed.transaction_id === "string" && parsed.transaction_id) ||
    (typeof parsed.transactionId === "string" && parsed.transactionId) ||
    deliveryHeader ||
    "";

  if (!transactionId) {
    throw new BuatQrisError("Webhook payload missing transaction_id");
  }

  const rawStatus =
    (typeof dataObj.status === "string" && dataObj.status.toLowerCase()) ||
    (typeof parsed.status === "string" && parsed.status.toLowerCase()) ||
    "";

  const rawEvent =
    (typeof parsed.event === "string" && parsed.event.toLowerCase()) ||
    (typeof dataObj.event === "string" && dataObj.event.toLowerCase()) ||
    (eventHeader ? eventHeader.toLowerCase() : "") ||
    rawStatus ||
    "payment.unknown";

  let status: BuatQrisPaymentStatus = "pending";
  if (
    rawEvent === "payment.success" ||
    rawEvent === "success" ||
    rawEvent === "paid" ||
    rawEvent === "settlement" ||
    rawEvent === "settled" ||
    rawEvent === "berhasil" ||
    rawEvent === "sukses" ||
    rawStatus === "success" ||
    rawStatus === "paid" ||
    rawStatus === "settlement" ||
    rawStatus === "settled" ||
    rawStatus === "berhasil" ||
    rawStatus === "sukses"
  ) {
    status = "success";
  } else if (
    rawEvent === "payment.expired" ||
    rawEvent === "expired" ||
    rawEvent === "kadaluarsa" ||
    rawStatus === "expired" ||
    rawStatus === "kadaluarsa"
  ) {
    status = "expired";
  } else if (
    rawEvent === "payment.failed" ||
    rawEvent === "failed" ||
    rawEvent === "cancel" ||
    rawEvent === "cancelled" ||
    rawEvent === "dibatalkan" ||
    rawStatus === "failed" ||
    rawStatus === "cancel" ||
    rawStatus === "cancelled" ||
    rawStatus === "dibatalkan"
  ) {
    status = "failed";
  }

  const amountVal = dataObj.amount ?? parsed.amount;
  const amount =
    typeof amountVal === "number"
      ? amountVal
      : typeof amountVal === "string"
        ? Number(amountVal)
        : undefined;

  const totalAmountVal =
    dataObj.total_amount ??
    dataObj.totalAmount ??
    parsed.total_amount ??
    parsed.totalAmount;
  const totalAmount =
    typeof totalAmountVal === "number"
      ? totalAmountVal
      : typeof totalAmountVal === "string"
        ? Number(totalAmountVal)
        : undefined;

  return {
    event: rawEvent,
    transactionId,
    amount,
    totalAmount,
    status,
    raw: parsed,
  };
}
