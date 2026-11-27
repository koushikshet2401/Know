import request from "supertest";
import { app } from "../../src/index";
import { env } from "../../src/config/env";
import { pool } from "../../src/config/db";

describe("Invoice Management", () => {
  let adminToken: string;
  let seededInvoiceId: string;

  beforeAll(async () => {
    // 1. Admin login
    const loginRes = await request(app)
      .post("/api/admin/auth/login")
      .send({ email: env.adminEmail, password: env.adminPassword });
    adminToken = loginRes.body.token;

    // 2. Fetch seeded invoice KNB-2026-001
    const invRes = await pool.query(
      "SELECT id FROM invoices WHERE invoice_number = 'KNB-2026-001'"
    );
    seededInvoiceId = invRes.rows[0]?.id;
  });

  afterAll(() => {
    console.log("[TEST] invoices.test.ts — all tests complete");
  });

  it("GET /api/admin/invoices — returns paginated invoice list", async () => {
    const res = await request(app)
      .get("/api/admin/invoices")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    const first = res.body.data[0];
    expect(first).toHaveProperty("invoice_number");
    expect(first).toHaveProperty("amount_inr");
    expect(first).toHaveProperty("gst_amount");
    expect(first).toHaveProperty("total_inr");
  });

  it("GET /api/admin/invoices/:id — returns invoice with client details", async () => {
    const res = await request(app)
      .get(`/api/admin/invoices/${seededInvoiceId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const invoice = res.body.invoice || res.body.data;
    expect(invoice).toBeDefined();
    expect(invoice.client_name || invoice.name).toBeDefined();
    expect(invoice.invoice_number).toBe("KNB-2026-001");
  });

  it("GET /api/admin/invoices/:id/download — returns a PDF file", async () => {
    const res = await request(app)
      .get(`/api/admin/invoices/${seededInvoiceId}/download`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("application/pdf");
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("GST calculation is correct on seeded invoices", async () => {
    const res = await request(app)
      .get(`/api/admin/invoices/${seededInvoiceId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    const invoice = res.body.invoice || res.body.data;
    const amount = parseFloat(invoice.amount_inr);
    const expectedGst = parseFloat((amount * 0.18).toFixed(2));
    const expectedTotal = parseFloat((amount + expectedGst).toFixed(2));

    expect(parseFloat(invoice.gst_amount)).toBe(expectedGst);
    expect(parseFloat(invoice.total_inr)).toBe(expectedTotal);
  });
});
