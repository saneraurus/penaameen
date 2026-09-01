// @ts-check
/**
 * start-all.mjs — dev orchestrator (Supabase cloud Postgres)
 * 1. Validates required Supabase env vars (reads .env.local via dotenv).
 * 2. Verifies the database TCP endpoint is reachable.
 * 3. Launches the Next.js dev server.
 */
import net from "node:net";
import process from "node:process";
import { spawn } from "node:child_process";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const REQUIRED = ["SUPABASE_DB_URL", "SUPABASE_DB_STAFF_URL", "RLS_ENABLED"];
const missing = REQUIRED.filter((k) => !process.env[k]?.trim());
if (missing.length > 0) {
  console.error(`[start-all] Missing required env vars: ${missing.join(", ")}`);
  console.error(
    "[start-all] Supabase is the only database. Configure .env.local first (see .env.example).",
  );
  process.exit(1);
}

function hostPortFromUrl(url) {
  try {
    const u = new URL(url.replace(/^(postgresql|postgres):\/\//, "http://"));
    return { host: u.hostname, port: Number(u.port || 5432) };
  } catch {
    return null;
  }
}

function waitTcp(host, port, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const sock = net.connect({ host, port });
      sock.setTimeout(2000);
      sock.once("connect", () => {
        sock.destroy();
        resolve();
      });
      const fail = () => {
        sock.destroy();
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Timeout connecting to ${host}:${port}`));
        } else {
          setTimeout(attempt, 500);
        }
      };
      sock.once("error", fail);
      sock.once("timeout", fail);
    };
    attempt();
  });
}

const db = hostPortFromUrl(process.env["SUPABASE_DB_URL"]);
if (!db) {
  console.error("[start-all] SUPABASE_DB_URL is not a valid connection URL.");
  process.exit(1);
}

try {
  await waitTcp(db.host, db.port);
  console.log(
    `[start-all] Supabase Postgres reachable at ${db.host}:${db.port}.`,
  );
} catch (e) {
  console.error(`[start-all] Cannot reach Supabase Postgres: ${e.message}`);
  process.exit(1);
}

console.log("[start-all] Launching Next.js dev server → http://localhost:3000");
const web = spawn("npx", ["next", "dev"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
});
web.on("exit", (code) => process.exit(code ?? 0));
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => web.kill(sig));
}
