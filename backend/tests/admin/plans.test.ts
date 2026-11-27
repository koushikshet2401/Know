import request from "supertest";
import { app } from "../../src/index";
import { env } from "../../src/config/env";
import { pool } from "../../src/config/db";

describe("Plan Management", () => {
  let adminToken: string;
  let starterPlanId: string;
  let professionalPlanId: string;
  let seedClient3Id: string;

  beforeAll(async () => {
    // 1. Admin login
    const loginRes = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: env.adminEmail, password: env.adminPassword });
    adminToken = loginRes.body.token;

    // 2. Fetch plan IDs
    const plansRes = await pool.query("SELECT id, name FROM plans");
    for (const p of plansRes.rows) {
      if (p.name === "Starter") starterPlanId = p.id;
      if (p.name === "Professional") professionalPlanId = p.id;
    }

    // 3. Fetch seed client 3 (Arjun Nair)
    const clientRes = await pool.query(
      "SELECT id FROM clients WHERE email = 'arjun@learnspherein.com'"
    );
    seedClient3Id = clientRes.rows[0]?.id;
  });

  afterAll(() => {
    console.log("[TEST] plans.test.ts — all tests complete");
  });

  it("GET /api/admin/plans — returns all 4 plans", async () => {
    const res = await request(app)
      .get("/api/admin/plans")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const plans = res.body.plans || res.body.data;
    expect(plans.length).toBe(4);
    expect(plans[0]).toHaveProperty("name");
    expect(plans[0]).toHaveProperty("price_inr");
    expect(plans[0]).toHaveProperty("conversations");
    expect(plans[0]).toHaveProperty("websites");
  });

  it("POST /api/admin/clients/:id/assign-plan — assigns plan to client", async () => {
    const assignRes = await request(app)
      .post(`/api/admin/clients/${seedClient3Id}/assign-plan`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ planId: starterPlanId });

    expect(assignRes.status).toBe(200);

    const clientRes = await request(app)
      .get(`/api/admin/clients/${seedClient3Id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    const client = clientRes.body.client || clientRes.body.data;
    expect(client.status).toBe("active");
    expect(client.subscriptions[0].status).toBe("active");
  });

  it("Assigning a new plan expires the previous subscription", async () => {
    const assignRes = await request(app)
      .post(`/api/admin/clients/${seedClient3Id}/assign-plan`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ planId: professionalPlanId });

    expect(assignRes.status).toBe(200);

    const clientRes = await request(app)
      .get(`/api/admin/clients/${seedClient3Id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    const client = clientRes.body.client || clientRes.body.data;
    const subs = client.subscriptions;
    expect(subs.length).toBeGreaterThanOrEqual(2);

    // New sub is active
    expect(subs[0].status).toBe("active");
    expect(subs[0].plan_name).toBe("Professional");

    // Old sub is expired
    const expiredSub = subs.find((s: any) => s.plan_name === "Starter");
    expect(expiredSub).toBeDefined();
    expect(expiredSub.status).toBe("expired");
  });
});
