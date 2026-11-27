import request from "supertest";
import { app } from "../../src/index";
import { env } from "../../src/config/env";
import { pool } from "../../src/config/db";

describe("Client Management", () => {
  let adminToken: string;
  let seedClient1Id: string;

  beforeAll(async () => {
    // 1. Login as admin
    const loginRes = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: env.adminEmail, password: env.adminPassword });
    adminToken = loginRes.body.token;

    // 2. Fetch seed client 1 (Ravi Shankar)
    const clientRes = await pool.query(
      "SELECT id FROM clients WHERE email = 'ravi@techbridgein.com'"
    );
    seedClient1Id = clientRes.rows[0]?.id;
  });

  afterAll(() => {
    console.log("[TEST] clients.test.ts — all tests complete");
  });

  it("GET /api/admin/clients — returns paginated client list", async () => {
    const res = await request(app)
      .get("/api/admin/clients")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination).toHaveProperty("page");
    expect(res.body.pagination).toHaveProperty("limit");
    expect(res.body.pagination).toHaveProperty("total");
    expect(res.body.pagination).toHaveProperty("pages");

    const first = res.body.data[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("email");
    expect(first).toHaveProperty("company_name");
    expect(first).toHaveProperty("status");
  });

  it("GET /api/admin/clients — filters by status=active", async () => {
    const res = await request(app)
      .get("/api/admin/clients?status=active")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    for (const c of res.body.data) {
      expect(c.status).toBe("active");
    }
  });

  it("GET /api/admin/clients — filters by search term", async () => {
    const res = await request(app)
      .get("/api/admin/clients?search=TechBridge")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].company_name).toContain("TechBridge");
  });

  it("GET /api/admin/clients/:id — returns full client details", async () => {
    const res = await request(app)
      .get(`/api/admin/clients/${seedClient1Id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const client = res.body.client || res.body.data;
    expect(client).toBeDefined();
    expect(Array.isArray(client.subscriptions)).toBe(true);
    expect(Array.isArray(client.invoices)).toBe(true);
    expect(client.email).toBe("ravi@techbridgein.com");
  });

  it("GET /api/admin/clients/:id — returns 404 for unknown id", async () => {
    const res = await request(app)
      .get("/api/admin/clients/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  it("PATCH /api/admin/clients/:id/status — updates client status", async () => {
    const res = await request(app)
      .patch(`/api/admin/clients/${seedClient1Id}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "suspended" });

    expect(res.status).toBe(200);
    const client = res.body.client || res.body.data;
    expect(client.status).toBe("suspended");

    // Restore to active
    await request(app)
      .patch(`/api/admin/clients/${seedClient1Id}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "active" });
  });

  it("POST /api/admin/clients/:id/suspend — suspends client and subscription", async () => {
    const suspendRes = await request(app)
      .post(`/api/admin/clients/${seedClient1Id}/suspend`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(suspendRes.status).toBe(200);

    // Verify client status
    const getRes = await request(app)
      .get(`/api/admin/clients/${seedClient1Id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    const client = getRes.body.client || getRes.body.data;
    expect(client.status).toBe("suspended");
    expect(client.subscriptions[0].status).toBe("suspended");

    // Restore: reactivate
    const reactivateRes = await request(app)
      .post(`/api/admin/clients/${seedClient1Id}/reactivate`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(reactivateRes.status).toBe(200);
  });

  it("GET /api/admin/clients/expiring?days=10 — returns clients expiring soon", async () => {
    const res = await request(app)
      .get("/api/admin/clients/expiring?days=10")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const list = res.body.subscriptions || res.body.data;
    expect(Array.isArray(list)).toBe(true);
    const client2 = list.find((c: any) => c.email === "priya@shopkartio.com");
    expect(client2).toBeDefined();
  });
});
