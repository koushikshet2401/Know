import { Pool } from "pg";
import { env } from "./env";

export const pool = new Pool({
  connectionString: env.databaseUrl,
});

export async function checkDbConnection(): Promise<
  { ok: true; timestamp: Date } | { ok: false; error: string }
> {
  try {
    const result = await pool.query("SELECT NOW()");
    return { ok: true, timestamp: result.rows[0].now };
  } catch (error: any) {
    return { ok: false, error: error?.message || "Unknown database error" };
  }
}
