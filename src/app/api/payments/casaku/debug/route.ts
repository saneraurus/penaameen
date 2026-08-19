import { NextResponse } from "next/server";
import { requireStaffActor } from "@/application/auth/clerk-auth";
import { getApiSettings } from "@/lib/admin/api-settings";
import { buildCasakuConfig } from "@/lib/payment/casaku-service";
import { CasakuClient, CasakuError } from "@/lib/payment/casaku";

export async function GET() {
  // H-4 FIX: require staff authentication. This endpoint previously had auth
  // "skipped for local diagnosis" and leaked Casaku license/qr prefixes plus
  // account PII to anyone. It also fired LIVE Casaku API calls (including a
  // real QRIS generation). Now it requires staff auth and never performs
  // mutating provider calls or returns secret material.
  const actor = await requireStaffActor("settings:read");

  const result: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    checkedBy: actor.email || actor.staffId,
  };

  const settings = getApiSettings();
  const config = buildCasakuConfig(settings);
  result.config_exists = !!config;
  // Only report booleans — never expose key/qr prefixes or raw secrets.
  result.config_keys = config
    ? {
        has_license: !!config.licenseKey,
        has_qr_id: !!config.qrId,
        base_url: config.baseUrl,
      }
    : null;

  // Read-only profile check (no transaction-creating calls).
  if (config) {
    try {
      const client = new CasakuClient(config);
      const profile = await client.getProfile();
      result.profile = {
        ok: true,
        has_name: !!profile.name,
        has_email: !!profile.email,
        vipstatus: profile.vipstatus,
        maxgenerateqris: profile.maxgenerateqris,
      };
    } catch (err) {
      result.profile = {
        ok: false,
        message: err instanceof CasakuError ? err.message : "Unknown error",
        status: err instanceof CasakuError ? err.status : undefined,
      };
    }
  }

  // 6. Check environment
  result.env = {
    APP_BASE_URL: process.env.APP_BASE_URL || "(not set)",
    NODE_ENV: process.env.NODE_ENV,
  };

  return NextResponse.json(result, { status: 200 });
}
