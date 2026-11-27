import { pool } from "../../config/db";

export interface ClientFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  industry?: string;
}

export async function getClients(filters: ClientFilters = {}) {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(filters.limit) || 10));
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.search && filters.search.trim() !== "") {
    params.push(`%${filters.search.trim()}%`);
    const idx = params.length;
    conditions.push(
      `(c.name ILIKE $${idx} OR c.email ILIKE $${idx} OR c.company_name ILIKE $${idx})`
    );
  }

  if (filters.status && filters.status.trim() !== "") {
    params.push(filters.status.trim());
    conditions.push(`c.status = $${params.length}`);
  }

  if (filters.industry && filters.industry.trim() !== "") {
    params.push(filters.industry.trim());
    conditions.push(`c.industry = $${params.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Count total matching
  const countSql = `SELECT COUNT(*) FROM clients c ${whereClause}`;
  const countRes = await pool.query(countSql, params);
  const total = parseInt(countRes.rows[0].count, 10);
  const pages = Math.ceil(total / limit);

  // Main data query with active subscription and plan details
  const dataParams = [...params, limit, offset];
  const limitIdx = params.length + 1;
  const offsetIdx = params.length + 2;

  const dataSql = `
    SELECT
      c.id,
      c.name,
      c.email,
      c.phone,
      c.company_name,
      c.website,
      c.industry,
      c.company_size,
      c.status,
      c.created_at,
      c.updated_at,
      p.name AS current_plan_name,
      cs.ends_at,
      cs.conversations_used,
      p.conversations AS plan_conversations_limit,
      cs.status AS subscription_status
    FROM clients c
    LEFT JOIN client_subscriptions cs
      ON cs.client_id = c.id AND cs.status = 'active'
    LEFT JOIN plans p
      ON p.id = cs.plan_id
    ${whereClause}
    ORDER BY c.created_at DESC
    LIMIT $${limitIdx} OFFSET $${offsetIdx}
  `;

  const dataRes = await pool.query(dataSql, dataParams);

  return {
    data: dataRes.rows,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };
}

export async function getClientById(id: string) {
  const clientSql = `
    SELECT
      c.id,
      c.name,
      c.email,
      c.phone,
      c.company_name,
      c.website,
      c.industry,
      c.company_size,
      c.status,
      c.created_at,
      c.updated_at,
      p.name AS current_plan_name,
      cs.ends_at,
      cs.conversations_used,
      p.conversations AS plan_conversations_limit,
      cs.status AS subscription_status
    FROM clients c
    LEFT JOIN client_subscriptions cs
      ON cs.client_id = c.id AND cs.status = 'active'
    LEFT JOIN plans p
      ON p.id = cs.plan_id
    WHERE c.id = $1
  `;

  const clientRes = await pool.query(clientSql, [id]);
  if (clientRes.rows.length === 0) {
    return null;
  }

  const client = clientRes.rows[0];

  // All subscriptions history
  const subsSql = `
    SELECT
      cs.id,
      cs.client_id,
      cs.plan_id,
      p.name AS plan_name,
      p.price_inr,
      cs.started_at,
      cs.ends_at,
      cs.status,
      cs.conversations_used,
      cs.created_at
    FROM client_subscriptions cs
    JOIN plans p ON p.id = cs.plan_id
    WHERE cs.client_id = $1
    ORDER BY cs.started_at DESC
  `;
  const subsRes = await pool.query(subsSql, [id]);

  // All invoices
  const invoicesSql = `
    SELECT *
    FROM invoices
    WHERE client_id = $1
    ORDER BY issued_at DESC
  `;
  const invoicesRes = await pool.query(invoicesSql, [id]);

  // Consent record
  const consentSql = `
    SELECT *
    FROM consent_records
    WHERE client_id = $1
    ORDER BY created_at DESC
    LIMIT 1
  `;
  const consentRes = await pool.query(consentSql, [id]);

  return {
    ...client,
    subscriptions: subsRes.rows,
    invoices: invoicesRes.rows,
    consent: consentRes.rows[0] || null,
  };
}

export async function updateClientStatus(id: string, status: string) {
  const query = `
    UPDATE clients
    SET status = $2, updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;
  const result = await pool.query(query, [id, status]);
  return result.rows[0] || null;
}

export async function suspendClientUsage(id: string) {
  const subQuery = `
    UPDATE client_subscriptions
    SET status = 'suspended'
    WHERE client_id = $1 AND status = 'active'
    RETURNING *
  `;
  const subRes = await pool.query(subQuery, [id]);

  const clientQuery = `
    UPDATE clients
    SET status = 'suspended', updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;
  const clientRes = await pool.query(clientQuery, [id]);

  return {
    client: clientRes.rows[0] || null,
    suspendedSubscriptions: subRes.rows,
  };
}

export async function reactivateClient(id: string) {
  const subQuery = `
    UPDATE client_subscriptions
    SET status = 'active'
    WHERE client_id = $1 AND status = 'suspended'
    RETURNING *
  `;
  const subRes = await pool.query(subQuery, [id]);

  const clientQuery = `
    UPDATE clients
    SET status = 'active', updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;
  const clientRes = await pool.query(clientQuery, [id]);

  return {
    client: clientRes.rows[0] || null,
    reactivatedSubscriptions: subRes.rows,
  };
}

export async function getExpiringSubscriptions(daysAhead: number = 7) {
  const query = `
    SELECT
      clients.id AS client_id,
      clients.name,
      clients.email,
      cs.ends_at,
      p.name AS plan_name
    FROM client_subscriptions cs
    JOIN clients ON clients.id = cs.client_id
    JOIN plans p ON p.id = cs.plan_id
    WHERE cs.status = 'active'
      AND cs.ends_at BETWEEN NOW() AND NOW() + ($1 || ' days')::INTERVAL
    ORDER BY cs.ends_at ASC
  `;
  const result = await pool.query(query, [daysAhead]);
  return result.rows;
}

export async function checkAndExpireSubscriptions() {
  const expireQuery = `
    UPDATE client_subscriptions
    SET status = 'expired'
    WHERE status = 'active' AND ends_at < NOW()
    RETURNING client_id
  `;
  const expireRes = await pool.query(expireQuery);

  const clientIds = [...new Set(expireRes.rows.map((row) => row.client_id))];

  for (const clientId of clientIds) {
    await pool.query(
      `UPDATE clients SET status = 'suspended', updated_at = NOW() WHERE id = $1`,
      [clientId]
    );
  }

  return {
    expiredCount: expireRes.rows.length,
    affectedClients: clientIds,
  };
}
