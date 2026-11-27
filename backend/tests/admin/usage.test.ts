import { pool } from "../../src/config/db";
import { checkAndExpireSubscriptions } from "../../src/modules/clients/clients.service";
import {
  assignPlanToClient,
  incrementConversationCount,
} from "../../src/modules/plans/plans.service";

describe("Usage Control and Subscription Expiry", () => {
  let starterPlanId: string;

  beforeAll(async () => {
    const planRes = await pool.query(
      "SELECT id FROM plans WHERE name = 'Starter'"
    );
    starterPlanId = planRes.rows[0]?.id;
  });

  afterAll(() => {
    console.log("[TEST] usage.test.ts — all tests complete");
  });

  it("checkAndExpireSubscriptions — expires overdue subscriptions", async () => {
    // 1. Insert an overdue client & subscription
    const clientRes = await pool.query(
      `INSERT INTO clients (name, email, company_name, status)
       VALUES ('Overdue Test', 'overdue_test@domain.com', 'Overdue Corp', 'active')
       RETURNING id`
    );
    const testClientId = clientRes.rows[0].id;

    await pool.query(
      `INSERT INTO client_subscriptions (client_id, plan_id, started_at, ends_at, status, conversations_used)
       VALUES ($1, $2, NOW() - INTERVAL '35 days', NOW() - INTERVAL '2 days', 'active', 200)`,
      [testClientId, starterPlanId]
    );

    // 2. Run expiration job
    const result = await checkAndExpireSubscriptions();
    expect(result.expiredCount).toBeGreaterThanOrEqual(1);

    // 3. Verify client is suspended
    const checkClient = await pool.query(
      "SELECT status FROM clients WHERE id = $1",
      [testClientId]
    );
    expect(checkClient.rows[0].status).toBe("suspended");

    // Clean up
    await pool.query("DELETE FROM clients WHERE id = $1", [testClientId]);
  });

  it("incrementConversationCount — suspends client when limit reached", async () => {
    // 1. Create a test client
    const clientRes = await pool.query(
      `INSERT INTO clients (name, email, company_name, status)
       VALUES ('Limit Test', 'limit_test@domain.com', 'Limit Corp', 'active')
       RETURNING id`
    );
    const testClientId = clientRes.rows[0].id;

    // 2. Assign Starter plan (500 limit)
    await assignPlanToClient(testClientId, starterPlanId);

    // 3. Update conversations_used to 499
    await pool.query(
      "UPDATE client_subscriptions SET conversations_used = 499 WHERE client_id = $1 AND status = 'active'",
      [testClientId]
    );

    // 4. Increment by 1 -> reaches 500
    const incResult = await incrementConversationCount(testClientId);
    expect(incResult.limitReached).toBe(true);
    expect(incResult.suspended).toBe(true);

    // 5. Verify subscription is suspended
    const subRes = await pool.query(
      "SELECT status, conversations_used FROM client_subscriptions WHERE client_id = $1",
      [testClientId]
    );
    expect(subRes.rows[0].status).toBe("suspended");
    expect(subRes.rows[0].conversations_used).toBe(500);

    // Clean up
    await pool.query("DELETE FROM clients WHERE id = $1", [testClientId]);
  });
});
