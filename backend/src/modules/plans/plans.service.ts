import { pool } from "../../config/db";
import { suspendClientUsage } from "../clients/clients.service";

export async function getPlans() {
  const result = await pool.query("SELECT * FROM plans ORDER BY price_inr ASC");
  return result.rows;
}

export async function assignPlanToClient(
  clientId: string,
  planId: string,
  _paidAt?: Date
) {
  // Check client existence
  const clientRes = await pool.query("SELECT id FROM clients WHERE id = $1", [clientId]);
  if (clientRes.rows.length === 0) {
    throw new Error("CLIENT_NOT_FOUND");
  }

  // Check plan existence
  const planRes = await pool.query("SELECT * FROM plans WHERE id = $1", [planId]);
  if (planRes.rows.length === 0) {
    throw new Error("PLAN_NOT_FOUND");
  }
  const plan = planRes.rows[0];

  // Expire any existing active subscription for this client first
  await pool.query(
    "UPDATE client_subscriptions SET status = 'expired' WHERE client_id = $1 AND status = 'active'",
    [clientId]
  );

  // Insert new subscription
  const insertSql = `
    INSERT INTO client_subscriptions (
      client_id, plan_id, started_at, ends_at, status, conversations_used
    ) VALUES (
      $1, $2, NOW(), NOW() + ($3 || ' days')::INTERVAL, 'active', 0
    ) RETURNING *
  `;
  const subRes = await pool.query(insertSql, [clientId, planId, plan.duration_days]);
  const newSub = subRes.rows[0];

  // Update client status to active
  await pool.query(
    "UPDATE clients SET status = 'active', updated_at = NOW() WHERE id = $1",
    [clientId]
  );

  return {
    ...newSub,
    plan_name: plan.name,
    plan_price: plan.price_inr,
  };
}

export async function incrementConversationCount(clientId: string) {
  const updateSql = `
    UPDATE client_subscriptions cs
    SET conversations_used = cs.conversations_used + 1
    FROM plans p
    WHERE cs.client_id = $1
      AND cs.status = 'active'
      AND cs.plan_id = p.id
    RETURNING
      cs.id,
      cs.client_id,
      cs.plan_id,
      cs.started_at,
      cs.ends_at,
      cs.status,
      cs.conversations_used,
      p.conversations AS plan_limit,
      p.name AS plan_name
  `;

  const result = await pool.query(updateSql, [clientId]);

  if (result.rows.length === 0) {
    throw new Error("NO_ACTIVE_SUBSCRIPTION");
  }

  const row = result.rows[0];
  const limitReached = row.conversations_used >= row.plan_limit;

  if (limitReached) {
    await suspendClientUsage(clientId);
    return {
      subscription: row,
      limitReached: true,
      suspended: true,
      message: `Plan conversation limit (${row.plan_limit}) reached. Client usage suspended.`,
    };
  }

  return {
    subscription: row,
    limitReached: false,
    suspended: false,
  };
}
