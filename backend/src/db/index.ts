import { Pool, QueryResult, QueryResultRow } from "pg";
import { validateEnv } from "../config/validateEnv";

const env = validateEnv();

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("[Database Pool Error]:", err);
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === "development") {
    console.log(`[DB Query] executed in ${duration}ms: ${text.substring(0, 80)}`);
  }
  return res;
}
