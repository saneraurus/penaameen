import { execFileSync } from "node:child_process";
import fs from "node:fs";

const required = [
  "APP_ENV",
  "APP_BASE_URL",
  "SUPABASE_DB_URL",
  "SUPABASE_DB_STAFF_URL",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
];

const providerGroups = {
  clerk: ["CLERK_SECRET_KEY", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"],
  casaku: ["CASAKU_LICENSE_KEY", "CASAKU_WEBHOOK_SECRET", "CASAKU_QR_ID"],
  midtrans: ["MIDTRANS_SERVER_KEY", "NEXT_PUBLIC_MIDTRANS_CLIENT_KEY"],
  rajaongkir: ["RAJAONGKIR_API_KEY"],
  resend: ["RESEND_API_KEY", "EMAIL_FROM"],
  sheets: ["GOOGLE_SHEETS_SPREADSHEET_ID", "GOOGLE_SHEETS_SERVICE_ACCOUNT_FILE"],
};

const placeholder = /^(?:\.\.\.|.*REDACTED.*|.*placeholder.*|.*your_.*)$/i;
const value = (key) => process.env[key]?.trim() || "";
const configured = (key) => Boolean(value(key)) && !placeholder.test(value(key));
const failures = [];

if (value("APP_ENV") !== "staging") {
  failures.push("APP_ENV must be staging; refusing to evaluate another environment as staging.");
}

for (const key of required) {
  if (!configured(key)) failures.push(`${key} is missing or placeholder.`);
}

for (const [provider, keys] of Object.entries(providerGroups)) {
  const missing = keys.filter((key) => !configured(key));
  console.log(`${provider}: ${missing.length === 0 ? "configured" : `blocked (${missing.join(", ")})`}`);
}

try {
  const tracked = execFileSync("git", ["ls-files"], { encoding: "utf8" }).split(/\r?\n/).filter(Boolean);
  const suspicious = [];
  for (const file of tracked) {
    if (!fs.existsSync(file) || /(^|\/)\.env(\.|$)/i.test(file) || /(^|\/)tests?\//i.test(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|sk_(?:live|test)_|gsk_[A-Za-z0-9_-]{20,}|cashify_[A-Za-z0-9]{30,}/.test(text)) {
      suspicious.push(file);
    }
  }
  if (suspicious.length) failures.push(`Potential secret material found in tracked files: ${suspicious.join(", ")}`);
} catch {
  failures.push("Unable to run git secret scan.");
}

console.log(`database migration gate: ${fs.existsSync("prisma/migrations") ? "migration directory present" : "blocked (no migration directory)"}`);
console.log(`authenticated E2E gate: ${configured("PLAYWRIGHT_AUTH_STATE") ? "state configured" : "blocked (PLAYWRIGHT_AUTH_STATE missing)"}`);

if (failures.length) {
  console.error("STAGING_READINESS=blocked");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("STAGING_READINESS=ready-for-provider-and-migration-checks");
}
