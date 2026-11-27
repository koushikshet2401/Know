import dotenv from "dotenv";
dotenv.config();

process.env.NODE_ENV = "test";
if (process.env.DATABASE_URL_TEST) {
  process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
}

import { pool } from "../src/config/db";

afterEach(async () => {
  // Only clean up dynamic test-inserted records that are NOT part of the initial seed
  try {
    // Delete any test clients inserted during tests (seed emails are ravi, priya, arjun, sneha, kiran)
    await pool.query(`
      DELETE FROM clients
      WHERE email NOT IN (
        'ravi@techbridgein.com',
        'priya@shopkartio.com',
        'arjun@learnspherein.com',
        'sneha@propfinderin.com',
        'kiran@finloanin.com'
      )
    `);
  } catch (e) {
    // ignore
  }
});

afterAll(async () => {
  // Gracefully close pool if this process opened one
  try {
    await pool.end();
  } catch (e) {
    // ignore
  }
});
