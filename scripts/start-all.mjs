#!/usr/bin/env node
/**
 * start-all.mjs — 1-click dev orchestrator
 * Starts embedded Postgres (scripts/dev-db.mjs) + Next.js dev server together.
 * Usage: node scripts/start-all.mjs  or  npm run dev:all
 *
 * - If port 5432 already listening, reuses existing DB (fast path).
 * - Waits for "[dev-db] PostgreSQL is READY" or TCP connect before launching Next.
 * - Forwards SIGINT/SIGTERM to both children and stops Postgres gracefully.
 * - Prefixes logs with [db] / [web] for clarity.
 */
import { spawn } from "node:child_process";
import net from "node:net";
import process from "node:process";

const DB_PORT = Number(process.env["DEV_DB_PORT"] || "5432");
const DB_HOST = "127.0.0.1";
const READY_TIMEOUT_MS = 60_000;
const POLL_INTERVAL_MS = 300;

function isPortOpen(host, port, timeout = 1000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;
    const finish = (open) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve(open);
    };
    socket.setTimeout(timeout);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
    socket.connect(port, host);
  });
}

function waitForPort(host, port, timeoutMs) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const poll = async () => {
      if (await isPortOpen(host, port)) return resolve();
      if (Date.now() - start > timeoutMs) return reject(new Error(`Timeout waiting for ${host}:${port} after ${timeoutMs}ms`));
      setTimeout(poll, POLL_INTERVAL_MS);
    };
    poll();
  });
}

function spawnWithPrefix(cmd, args, opts, prefix, color) {
  const child = spawn(cmd, args, { ...opts, stdio: "pipe" });
  const c = color || "";
  const reset = "\x1b[0m";
  const tag = `${c}[${prefix}]${reset}`;
  child.stdout?.on("data", (d) => process.stdout.write(`${tag} ${d}`));
  child.stderr?.on("data", (d) => process.stderr.write(`${tag} ${d}`));
  return child;
}

let dbChild = null;
let webChild = null;
let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n[start-all] Received ${signal} — shutting down...`);
  const tasks = [];
  if (webChild && !webChild.killed) {
    console.log("[start-all] Stopping Next.js dev server...");
    // On Windows, child is a shell; kill whole tree via taskkill if needed, but spawn with shell:false helps.
    try { webChild.kill(signal); } catch {}
    tasks.push(new Promise((r) => webChild.once("exit", r).once("close", r)));
    // fallback: force kill after 5s
    setTimeout(() => { try { webChild.kill("SIGKILL"); } catch {} r(); }, 5000).unref();
  }
  if (dbChild && !dbChild.killed) {
    console.log("[start-all] Stopping embedded Postgres...");
    try { dbChild.kill(signal); } catch {}
    tasks.push(new Promise((r) => dbChild.once("exit", r).once("close", r)));
    setTimeout(() => { try { dbChild.kill("SIGKILL"); } catch {} }, 5000).unref();
  }
  await Promise.race([Promise.allSettled(tasks), new Promise((r) => setTimeout(r, 8000))]);
  console.log("[start-all] All stopped. Bye!");
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGBREAK", () => shutdown("SIGINT")); // Windows Ctrl+Break

async function main() {
  console.log("[start-all] PENA AMEEN — starting all backends (DB + Web)...");
  console.log(`[start-all] DB target: ${DB_HOST}:${DB_PORT}  (.pgdata)`);

  const alreadyOpen = await isPortOpen(DB_HOST, DB_PORT);
  if (alreadyOpen) {
    console.log("[start-all] DB already listening — reusing existing Postgres.");
  } else {
    console.log("[start-all] DB not running — launching embedded Postgres...");
    dbChild = spawnWithPrefix("node", ["scripts/dev-db.mjs"], { cwd: process.cwd(), env: process.env }, "db", "\x1b[36m");
    dbChild.on("exit", (code, sig) => {
      if (!shuttingDown) {
        console.error(`[start-all] DB exited unexpectedly code=${code} signal=${sig}`);
        console.error("[start-all] Web will be stopped.");
        shutdown("SIGTERM");
      }
    });
    // Also detect READY via stdout, but primary is TCP poll
    let readyLogged = false;
    dbChild.stdout?.on("data", (d) => {
      if (!readyLogged && d.toString().includes("PostgreSQL is READY")) {
        readyLogged = true;
        console.log("[start-all] DB reported READY (log).");
      }
    });
    console.log("[start-all] Waiting for DB to be ready (max 60s)...");
    try {
      await waitForPort(DB_HOST, DB_PORT, READY_TIMEOUT_MS);
      console.log("[start-all] DB port open — Postgres is ready.");
      // small extra grace for initdb encoding fix & DB creation
      await new Promise((r) => setTimeout(r, 800));
    } catch (e) {
      console.error("[start-all] DB failed to become ready:", e.message);
      if (dbChild) try { dbChild.kill("SIGTERM"); } catch {}
      process.exit(1);
    }
  }

  // Optional: ensure DB schema is pushed? We do a lightweight check but don't auto-migrate to avoid data loss.
  // If you want auto-push, set AUTO_DB_PUSH=1
  if (process.env["AUTO_DB_PUSH"] === "1") {
    console.log("[start-all] AUTO_DB_PUSH=1 — running prisma db push...");
    const push = spawnWithPrefix("npx", ["prisma", "db", "push", "--skip-generate"], { cwd: process.cwd(), env: process.env, shell: true }, "db-push", "\x1b[33m");
    await new Promise((resolve) => {
      push.on("exit", (code) => {
        if (code === 0) console.log("[start-all] prisma db push OK.");
        else console.warn(`[start-all] prisma db push exited ${code} (continuing)`);
        resolve();
      });
    });
  }

  console.log("[start-all] Launching Next.js dev server...");
  // Replicate package.json dev: cross-env NEXT_TELEMETRY_DISABLED=1 next dev
  const webEnv = { ...process.env, NEXT_TELEMETRY_DISABLED: "1" };
  // Use npx next dev directly; shell:true for Windows .cmd resolution
  webChild = spawnWithPrefix("npx", ["next", "dev"], { cwd: process.cwd(), env: webEnv, shell: true }, "web", "\x1b[32m");
  webChild.on("exit", (code, sig) => {
    if (!shuttingDown) {
      console.log(`[start-all] Web exited code=${code} signal=${sig} — shutting down DB.`);
      shutdown("SIGTERM");
    }
  });

  console.log("[start-all] All backends running:");
  console.log("  • DB   → postgresql://postgres:password@localhost:5432/penaameen");
  console.log("  • Web  → http://localhost:3000");
  console.log("  • Press Ctrl+C to stop BOTH.\n");
  // Keep alive
  await new Promise(() => {});
}

main().catch((e) => {
  console.error("[start-all] Fatal:", e);
  process.exit(1);
});
