import fs from "fs";
import path from "path";
import { pool } from "../config/db";

export async function runMigrations() {
  const migrationsDir = path.join(__dirname, "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");
    try {
      await pool.query(sql);
      console.log(`Running migration: ${file} ... done`);
    } catch (error) {
      console.error(`Error running migration ${file}:`, error);
      await pool.end();
      process.exit(1);
    }
  }

  await pool.end();
  console.log("All migrations completed successfully.");
}

if (require.main === module || !module.parent) {
  runMigrations().catch(async (error) => {
    console.error("Migration runner failed:", error);
    await pool.end();
    process.exit(1);
  });
}
