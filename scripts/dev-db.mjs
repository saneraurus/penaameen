import EmbeddedPostgres from "embedded-postgres";
import fs from "fs";
import path from "path";

const DB_NAME = process.env["DEV_DB_NAME"] || "penaameen";
const DB_USER = process.env["DEV_DB_USER"] || "postgres";
const DB_PASSWORD = process.env["DEV_DB_PASSWORD"] || "password";
const DB_PORT = Number(process.env["DEV_DB_PORT"] || "5432");
const DB_DIR = process.env["DEV_DB_DIR"] || ".pgdata";

const pg = new EmbeddedPostgres({
  databaseDir: DB_DIR,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  persistent: true,
});

async function main() {
  const dirExists = fs.existsSync(DB_DIR);
  const alreadyInitialised =
    dirExists && fs.existsSync(path.join(DB_DIR, "PG_VERSION"));

  if (alreadyInitialised) {
    console.log("[dev-db] reusing existing PostgreSQL data directory");
  } else {
    console.log("[dev-db] initialising embedded PostgreSQL...");
    await pg.initialise();
  }

  console.log("[dev-db] starting PostgreSQL...");
  await pg.start();
  console.log(`[dev-db] ensuring database "${DB_NAME}" exists...`);
  try {
    await pg.createDatabase(DB_NAME);
  } catch {
    console.log(`[dev-db] database "${DB_NAME}" already exists`);
  }
  const url = `postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}`;
  console.log(`[dev-db] PostgreSQL is READY at ${url}`);
  console.log("[dev-db] keeping process alive. Press Ctrl+C to stop.");

  const keepAlive = setInterval(() => {}, 1 << 30);
  const shutdown = async () => {
    clearInterval(keepAlive);
    console.log("[dev-db] stopping PostgreSQL...");
    try {
      await pg.stop();
    } catch (e) {
      console.error("[dev-db] error during stop:", e);
    }
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((e) => {
  console.error("[dev-db] failed to start embedded PostgreSQL:", e);
  process.exit(1);
});
