import Midtrans from "midtrans-client";
import { getApiSettings } from "@/lib/admin/api-settings";

/**
 * Single source of truth for Midtrans clients. Settings merge
 * src/data/api_settings.json over environment variables (secrets fall back
 * to env when nothing valid is stored), so every call site — order creation,
 * snap regeneration, and webhook signature verification — sees the same
 * credentials instead of half of them.
 */
export function createMidtransSnapClient() {
  const { midtrans } = getApiSettings();
  return new Midtrans.Snap({
    isProduction: midtrans.isProduction,
    serverKey: midtrans.serverKey,
    clientKey: midtrans.clientKey,
  });
}

/** Server key used for webhook signature verification (sha512). */
export function getMidtransServerKey(): string {
  return getApiSettings().midtrans.serverKey;
}
