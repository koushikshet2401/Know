import request from "supertest";
import { app } from "../../src/index";
import { env } from "../../src/config/env";
import { pool } from "../../src/config/db";
import { generateWithdrawalToken } from "../../src/modules/consent/consent.service";

describe("DPDP Consent Management", () => {
  let adminToken: string;
  let validToken: string;
  let seedClient2Id: string;
  const testEmail = "priya@shopkartio.com";

  beforeAll(async () => {
    // 1. Admin login
    const loginRes = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: env.adminEmail, password: env.adminPassword });
    adminToken = loginRes.body.token;

    // 2. Fetch seed client 2
    const clientRes = await pool.query(
      "SELECT id FROM clients WHERE email = $1",
      [testEmail]
    );
    seedClient2Id = clientRes.rows[0]?.id;

    // 3. Generate valid withdrawal token
    validToken = generateWithdrawalToken(testEmail);
  });

  afterAll(() => {
    console.log("[TEST] consent.test.ts — all tests complete");
  });

  it("GET /api/consent/withdraw — succeeds with valid token", async () => {
    const res = await request(app).get(
      `/api/consent/withdraw?token=${encodeURIComponent(validToken)}`
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/withdrawn/i);
    expect(res.body.deletionDate).toBeDefined();
    expect(new Date(res.body.deletionDate).toString()).not.toBe("Invalid Date");
  });

  it("GET /api/consent/withdraw — returns 400 with invalid token", async () => {
    const res = await request(app).get("/api/consent/withdraw?token=INVALID");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/consent/withdraw — returns already withdrawn for repeat call", async () => {
    const res = await request(app).get(
      `/api/consent/withdraw?token=${encodeURIComponent(validToken)}`
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/already withdrawn/i);
  });

  it("GET /api/admin/consent — returns paginated consent records", async () => {
    const res = await request(app)
      .get("/api/admin/consent")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("GET /api/admin/consent/:clientId — returns consent for specific client", async () => {
    const res = await request(app)
      .get(`/api/admin/consent/${seedClient2Id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const record = res.body.record || res.body.data;
    expect(record).toBeDefined();
    expect(record.consent_given).toBe(true);
    expect(record.email).toBe(testEmail);
  });
});
