import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Pool } from "pg";

dotenv.config();

export default async function globalSetup() {
  process.env.NODE_ENV = "test";
  const testDbUrl =
    process.env.DATABASE_URL_TEST ||
    "postgresql://postgres:postgres@localhost:5433/knowbridge_test";
  process.env.DATABASE_URL = testDbUrl;

  const testPool = new Pool({ connectionString: testDbUrl });

  try {
    // 1. Run migrations in order
    const migrationsDir = path.join(__dirname, "../src/db/migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of migrationFiles) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      await testPool.query(sql);
    }

    // 2. Run seeds
    // Check if admin exists
    const bcrypt = await import("bcryptjs");
    const adminEmail = process.env.ADMIN_EMAIL || "koushikshet2401@gmail.com";
    const adminPass = process.env.ADMIN_PASSWORD || "Koushik@2401";
    const hash = await bcrypt.default.hash(adminPass, 12);
    await testPool.query(
      `INSERT INTO admin_users (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [adminEmail, hash]
    );

    // Check if plans exist
    const planCount = await testPool.query("SELECT COUNT(*) FROM plans");
    if (parseInt(planCount.rows[0].count, 10) === 0) {
      const plans = [
        ["Starter", 2499, 500, 1, 1, false, false, 30],
        ["Professional", 6599, 2000, 3, 3, true, true, 30],
        ["Business", 16599, 10000, 10, 10, true, true, 30],
        ["Enterprise", 0, 999999, 999, 999, true, true, 30],
      ];
      for (const p of plans) {
        await testPool.query(
          `INSERT INTO plans (name, price_inr, conversations, websites, agents, web_crawling, human_handoff, duration_days)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          p
        );
      }
    }

    // Check if clients exist
    const clientCount = await testPool.query("SELECT COUNT(*) FROM clients");
    if (parseInt(clientCount.rows[0].count, 10) === 0) {
      const clients = [
        ["Ravi Shankar", "ravi@techbridgein.com", "TechBridge India Pvt Ltd", "SaaS", "11-50", "active", "https://techbridgein.com"],
        ["Priya Mehta", "priya@shopkartio.com", "ShopKart IO", "E-commerce", "11-50", "active", "https://shopkartio.com"],
        ["Arjun Nair", "arjun@learnspherein.com", "LearnSphere India", "Education", "1-10", "lead", "https://learnspherein.com"],
        ["Sneha Reddy", "sneha@propfinderin.com", "PropFinder India", "Real Estate", "51-200", "suspended", "https://propfinderin.com"],
        ["Kiran Patel", "kiran@finloanin.com", "FinLoan India", "Financial Services", "11-50", "cancelled", "https://finloanin.com"],
      ];

      const clientMap: Record<string, string> = {};
      for (const c of clients) {
        const res = await testPool.query(
          `INSERT INTO clients (name, email, company_name, industry, company_size, status, website)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          c
        );
        clientMap[c[1] as string] = res.rows[0].id;
      }

      // Plan IDs
      const plansRes = await testPool.query("SELECT id, name FROM plans");
      const pMap: Record<string, string> = {};
      plansRes.rows.forEach((r) => {
        pMap[r.name] = r.id;
      });

      // Subscriptions
      const sub1 = await testPool.query(
        `INSERT INTO client_subscriptions (client_id, plan_id, started_at, ends_at, status, conversations_used)
         VALUES ($1, $2, NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days', 'active', 847) RETURNING id`,
        [clientMap["ravi@techbridgein.com"], pMap["Professional"]]
      );
      const sub2 = await testPool.query(
        `INSERT INTO client_subscriptions (client_id, plan_id, started_at, ends_at, status, conversations_used)
         VALUES ($1, $2, NOW() - INTERVAL '25 days', NOW() + INTERVAL '5 days', 'active', 480) RETURNING id`,
        [clientMap["priya@shopkartio.com"], pMap["Starter"]]
      );
      const sub4 = await testPool.query(
        `INSERT INTO client_subscriptions (client_id, plan_id, started_at, ends_at, status, conversations_used)
         VALUES ($1, $2, NOW() - INTERVAL '45 days', NOW() - INTERVAL '15 days', 'expired', 10000) RETURNING id`,
        [clientMap["sneha@propfinderin.com"], pMap["Business"]]
      );

      // Invoices
      await testPool.query(
        `INSERT INTO invoices (client_id, subscription_id, invoice_number, amount_inr, gst_amount, total_inr, status, issued_at, paid_at)
         VALUES ($1, $2, 'KNB-2026-001', 6599, 1187.82, 7786.82, 'paid', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days')`,
        [clientMap["ravi@techbridgein.com"], sub1.rows[0].id]
      );
      await testPool.query(
        `INSERT INTO invoices (client_id, subscription_id, invoice_number, amount_inr, gst_amount, total_inr, status, issued_at, paid_at)
         VALUES ($1, $2, 'KNB-2026-002', 2499, 449.82, 2948.82, 'paid', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days')`,
        [clientMap["priya@shopkartio.com"], sub2.rows[0].id]
      );
      await testPool.query(
        `INSERT INTO invoices (client_id, subscription_id, invoice_number, amount_inr, gst_amount, total_inr, status, issued_at, paid_at)
         VALUES ($1, $2, 'KNB-2026-003', 16599, 2987.82, 19586.82, 'paid', NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days')`,
        [clientMap["sneha@propfinderin.com"], sub4.rows[0].id]
      );

      // Consent records
      const consentText =
        "I consent to KnowBridge collecting and processing my personal data for the purpose of providing customer support services, as described in the Privacy Policy. I understand I can withdraw this consent at any time.";
      for (const c of clients) {
        await testPool.query(
          `INSERT INTO consent_records (client_id, email, consent_given, consent_given_at, consent_text)
           VALUES ($1, $2, TRUE, NOW(), $3)`,
          [clientMap[c[1] as string], c[1], consentText]
        );
      }
    }

    console.log("\n[TEST] Database migrated and seeded");
  } catch (error) {
    console.error("[TEST] Error in globalSetup:", error);
    throw error;
  } finally {
    await testPool.end();
  }
}
