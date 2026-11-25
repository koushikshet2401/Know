import { query } from "../db";
import { DemoRequestData, ContactFormData } from "../schemas/leadSchemas";

export interface LeadRecord {
  id: string;
  enquiry_type: "demo" | "contact";
  name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  website: string | null;
  industry: string | null;
  company_size: string | null;
  use_case: string | null;
  preferred_date: string | null;
  subject: string | null;
  message: string | null;
  lead_status:
    | "new"
    | "contacted"
    | "qualified"
    | "demo_scheduled"
    | "closed_won"
    | "closed_lost";
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export async function createLead(
  data: (DemoRequestData | ContactFormData) & { [key: string]: unknown },
  enquiryType: "demo" | "contact",
  ipAddress?: string,
  userAgent?: string
): Promise<LeadRecord> {
  const isDemo = enquiryType === "demo";
  const demoData = isDemo ? (data as DemoRequestData) : null;
  const contactData = !isDemo ? (data as ContactFormData) : null;

  const sql = `
    INSERT INTO leads (
      enquiry_type, name, email, phone, company_name, website,
      industry, company_size, use_case, preferred_date, subject,
      message, ip_address, user_agent
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    )
    RETURNING *;
  `;

  const values = [
    enquiryType,
    data.name,
    data.email,
    demoData?.phone || null,
    isDemo ? demoData?.company_name : contactData?.company || null,
    demoData?.website || null,
    demoData?.industry || null,
    demoData?.company_size || null,
    demoData?.use_case || null,
    demoData?.preferred_date ? demoData.preferred_date : null,
    contactData?.subject || null,
    data.message || null,
    ipAddress || null,
    userAgent || null,
  ];

  const res = await query<LeadRecord>(sql, values);
  return res.rows[0];
}

export async function checkRecentSubmission(
  email: string,
  enquiryType: "demo" | "contact",
  hours = 24
): Promise<boolean> {
  const sql = `
    SELECT id FROM leads
    WHERE LOWER(email) = LOWER($1)
      AND enquiry_type = $2
      AND created_at > NOW() - ($3 || ' hours')::INTERVAL
    LIMIT 1;
  `;
  const res = await query(sql, [email, enquiryType, hours.toString()]);
  return (res.rowCount ?? 0) > 0;
}

export interface GetLeadsFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  from?: string;
  to?: string;
}

export async function getLeads(filters: GetLeadsFilters = {}) {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 20));
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIdx = 1;

  if (filters.status) {
    conditions.push(`lead_status = $${paramIdx++}`);
    params.push(filters.status);
  }

  if (filters.search) {
    conditions.push(
      `(name ILIKE $${paramIdx} OR email ILIKE $${paramIdx} OR company_name ILIKE $${paramIdx})`
    );
    params.push(`%${filters.search}%`);
    paramIdx++;
  }

  if (filters.from) {
    conditions.push(`created_at >= $${paramIdx++}`);
    params.push(filters.from);
  }

  if (filters.to) {
    conditions.push(`created_at <= $${paramIdx++}`);
    params.push(filters.to);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countSql = `SELECT COUNT(*) as total FROM leads ${whereClause};`;
  const countRes = await query<{ total: string }>(countSql, params);
  const total = parseInt(countRes.rows[0]?.total || "0", 10);

  const dataSql = `
    SELECT * FROM leads
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramIdx++} OFFSET $${paramIdx++};
  `;
  const dataParams = [...params, limit, offset];
  const dataRes = await query<LeadRecord>(dataSql, dataParams);

  return {
    leads: dataRes.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getLeadById(id: string): Promise<LeadRecord | null> {
  const sql = `SELECT * FROM leads WHERE id = $1 LIMIT 1;`;
  const res = await query<LeadRecord>(sql, [id]);
  return res.rows[0] || null;
}

export async function updateLeadStatus(
  id: string,
  status: string
): Promise<LeadRecord | null> {
  const sql = `
    UPDATE leads
    SET lead_status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *;
  `;
  const res = await query<LeadRecord>(sql, [status, id]);
  return res.rows[0] || null;
}
