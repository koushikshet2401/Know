import { pool } from "../../config/db";

const CONSENT_TEXT =
  "I consent to KnowBridge collecting and processing my personal data for the purpose of providing customer support services, as described in the Privacy Policy. I understand I can withdraw this consent at any time.";

export async function clientSeed() {
  const countResult = await pool.query("SELECT COUNT(*) FROM clients");
  const count = parseInt(countResult.rows[0].count, 10);

  if (count > 0) {
    console.log(`Clients already exist (${count} found), skipping client seed.`);
    return;
  }

  // 1. Insert 5 realistic test clients
  const clientData = [
    {
      name: "Ravi Shankar",
      email: "ravi@techbridgein.com",
      company_name: "TechBridge India Pvt Ltd",
      industry: "SaaS",
      company_size: "11-50",
      status: "active",
      website: "https://techbridgein.com",
    },
    {
      name: "Priya Mehta",
      email: "priya@shopkartio.com",
      company_name: "ShopKart IO",
      industry: "E-commerce",
      company_size: "11-50",
      status: "active",
      website: "https://shopkartio.com",
    },
    {
      name: "Arjun Nair",
      email: "arjun@learnspherein.com",
      company_name: "LearnSphere India",
      industry: "Education",
      company_size: "1-10",
      status: "lead",
      website: "https://learnspherein.com",
    },
    {
      name: "Sneha Reddy",
      email: "sneha@propfinderin.com",
      company_name: "PropFinder India",
      industry: "Real Estate",
      company_size: "51-200",
      status: "suspended",
      website: "https://propfinderin.com",
    },
    {
      name: "Kiran Patel",
      email: "kiran@finloanin.com",
      company_name: "FinLoan India",
      industry: "Financial Services",
      company_size: "11-50",
      status: "cancelled",
      website: "https://finloanin.com",
    },
  ];

  const clientMap = new Map<string, { id: string; created_at: Date }>();

  for (const c of clientData) {
    const res = await pool.query(
      `INSERT INTO clients (
        name, email, company_name, industry, company_size, status, website
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, created_at`,
      [c.name, c.email, c.company_name, c.industry, c.company_size, c.status, c.website]
    );
    clientMap.set(c.email, { id: res.rows[0].id, created_at: res.rows[0].created_at });
  }

  // Fetch plan IDs
  const plansResult = await pool.query("SELECT id, name FROM plans");
  const planMap = new Map<string, string>();
  for (const row of plansResult.rows) {
    planMap.set(row.name, row.id);
  }

  const starterPlanId = planMap.get("Starter");
  const profPlanId = planMap.get("Professional");
  const bizPlanId = planMap.get("Business");

  if (!starterPlanId || !profPlanId || !bizPlanId) {
    throw new Error("Plans must be seeded before seeding client subscriptions.");
  }

  // 2. Insert subscriptions for Client 1, Client 2, and Client 4
  const client1 = clientMap.get("ravi@techbridgein.com")!;
  const client2 = clientMap.get("priya@shopkartio.com")!;
  const client4 = clientMap.get("sneha@propfinderin.com")!;

  // Client 1: Professional plan, started 15 days ago, ends 15 days from now, conversations_used: 847, status: 'active'
  const sub1Res = await pool.query(
    `INSERT INTO client_subscriptions (
      client_id, plan_id, started_at, ends_at, status, conversations_used
    ) VALUES (
      $1, $2, NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days', 'active', 847
    ) RETURNING id`,
    [client1.id, profPlanId]
  );
  const sub1Id = sub1Res.rows[0].id;

  // Client 2: Starter plan, started 25 days ago, ends 5 days from now, conversations_used: 480, status: 'active'
  const sub2Res = await pool.query(
    `INSERT INTO client_subscriptions (
      client_id, plan_id, started_at, ends_at, status, conversations_used
    ) VALUES (
      $1, $2, NOW() - INTERVAL '25 days', NOW() + INTERVAL '5 days', 'active', 480
    ) RETURNING id`,
    [client2.id, starterPlanId]
  );
  const sub2Id = sub2Res.rows[0].id;

  // Client 4: Business plan, started 45 days ago, ends 15 days ago, conversations_used: 10000, status: 'expired'
  const sub4Res = await pool.query(
    `INSERT INTO client_subscriptions (
      client_id, plan_id, started_at, ends_at, status, conversations_used
    ) VALUES (
      $1, $2, NOW() - INTERVAL '45 days', NOW() - INTERVAL '15 days', 'expired', 10000
    ) RETURNING id`,
    [client4.id, bizPlanId]
  );
  const sub4Id = sub4Res.rows[0].id;

  // 3. Insert invoices for Client 1, Client 2, and Client 4
  // Client 1: amount_inr 6599, gst 18% (1187.82), total 7786.82, status 'paid', invoice_number 'KNB-2026-001', paid_at NOW()-15days
  await pool.query(
    `INSERT INTO invoices (
      client_id, subscription_id, invoice_number, amount_inr, gst_amount, total_inr, status, issued_at, paid_at
    ) VALUES (
      $1, $2, 'KNB-2026-001', 6599, 1187.82, 7786.82, 'paid', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'
    )`,
    [client1.id, sub1Id]
  );

  // Client 2: amount_inr 2499, gst 18% (449.82), total 2948.82, status 'paid', invoice_number 'KNB-2026-002', paid_at NOW()-25days
  await pool.query(
    `INSERT INTO invoices (
      client_id, subscription_id, invoice_number, amount_inr, gst_amount, total_inr, status, issued_at, paid_at
    ) VALUES (
      $1, $2, 'KNB-2026-002', 2499, 449.82, 2948.82, 'paid', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'
    )`,
    [client2.id, sub2Id]
  );

  // Client 4: amount_inr 16599, gst 18% (2987.82), total 19586.82, status 'paid', invoice_number 'KNB-2026-003', paid_at NOW()-45days
  await pool.query(
    `INSERT INTO invoices (
      client_id, subscription_id, invoice_number, amount_inr, gst_amount, total_inr, status, issued_at, paid_at
    ) VALUES (
      $1, $2, 'KNB-2026-003', 16599, 2987.82, 19586.82, 'paid', NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days'
    )`,
    [client4.id, sub4Id]
  );

  // 4. Insert consent records for all 5 clients
  for (const c of clientData) {
    const client = clientMap.get(c.email)!;
    await pool.query(
      `INSERT INTO consent_records (
        client_id, email, consent_given, consent_given_at, consent_text
      ) VALUES (
        $1, $2, TRUE, $3, $4
      )`,
      [client.id, c.email, client.created_at, CONSENT_TEXT]
    );
  }

  console.log("Client seed completed: 5 clients, 3 subscriptions, 3 invoices, and 5 consent records seeded.");
}

if (require.main === module || !module.parent) {
  clientSeed()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("Client seed failed:", err);
      await pool.end();
      process.exit(1);
    });
}
