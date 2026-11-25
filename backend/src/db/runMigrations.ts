import fs from "fs";
import path from "path";
import { pool } from "./index";

export async function runMigrations() {
  console.log("[Migration] Starting database migration...");
  try {
    const migrationPath = path.join(__dirname, "migrations", "001_init.sql");
    const sql = fs.readFileSync(migrationPath, "utf-8");

    await pool.query(sql);
    console.log("[Migration] Successfully executed 001_init.sql");
  } catch (err) {
    console.error("[Migration Error] Failed to run migrations:", err);
    throw err;
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log("[Migration] Done.");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
