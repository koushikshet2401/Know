import request from "supertest";
import { app } from "../../src/index";
import { env } from "../../src/config/env";
import { pool } from "../../src/config/db";
import bcrypt from "bcryptjs";

describe("Admin Authentication", () => {
  let validToken: string;

  beforeAll(async () => {
    // Ensure admin user exists in test DB
    const hash = await bcrypt.hash(env.adminPassword, 12);
    await pool.query(
      `INSERT INTO admin_users (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [env.adminEmail, hash]
    );
  });

  afterAll(() => {
    console.log("[TEST] auth.test.ts — all tests complete");
  });

  it("POST /api/admin/auth/login — success with correct credentials", async () => {
    const res = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: env.adminEmail, password: env.adminPassword });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.token).toBe("string");
    expect(res.body.admin).toBeDefined();
    expect(res.body.admin.email).toBe(env.adminEmail);

    validToken = res.body.token;
  });

  it("POST /api/admin/auth/login — fails with wrong password", async () => {
    const res = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: env.adminEmail, password: "wrong_password_xyz" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid/i);
  });

  it("POST /api/admin/auth/login — fails with unknown email", async () => {
    const res = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: "nonexistent_admin@knowbridge.io", password: "somePassword123!" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid/i);
  });

  it("GET /api/admin/auth/me — returns admin details with valid token", async () => {
    const res = await request(app)
      .get("/api/admin/auth/me")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.admin).toBeDefined();
    expect(res.body.admin.email).toBe(env.adminEmail);
  });

  it("GET /api/admin/auth/me — returns 401 without token", async () => {
    const res = await request(app).get("/api/admin/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/admin/auth/me — returns 401 with malformed token", async () => {
    const res = await request(app)
      .get("/api/admin/auth/me")
      .set("Authorization", "Bearer INVALID_TOKEN_123");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
