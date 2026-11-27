import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

export default async function globalTeardown() {
  const testDbUrl =
    process.env.DATABASE_URL_TEST ||
    "postgresql://postgres:postgres@localhost:5433/knowbridge_test";

  const testPool = new Pool({ connectionString: testDbUrl });

  try {
    // Truncate tables to leave a clean test DB
    await testPool.query(`
      TRUNCATE TABLE
        invoices,
        client_subscriptions,
        consent_records,
        clients,
        plans,
        admin_users
      CASCADE;
    `);
    console.log("[TEST] Database cleaned up");
  } catch (err: any) {
    console.error("[TEST] Error in globalTeardown:", err?.message);
  } finally {
    await testPool.end();
  }
}
