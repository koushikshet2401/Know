import { pool } from "../../config/db";
import {
  recordConsent,
  generateWithdrawalToken,
} from "../consent/consent.service";
import {
  sendDemoConfirmation,
  sendInternalNotification,
} from "../../utils/emailService";

export interface DemoLeadData {
  name: string;
  email: string;
  phone?: string;
  company_name: string;
  website?: string;
  industry?: string;
  company_size?: string;
  use_case?: string;
  preferred_date?: string;
  message?: string;
  _honeypot?: string;
  consent?: boolean;
}

export interface ContactLeadData {
  name: string;
  email: string;
  company?: string;
  company_name?: string;
  subject: string;
  message: string;
  _honeypot?: string;
  consent?: boolean;
}

export async function createDemoLead(
  data: DemoLeadData,
  ipAddress?: string,
  userAgent?: string
): Promise<{ success: boolean; duplicate?: boolean }> {
  // 1. Honeypot check: bot detected -> return fake success
  if (data._honeypot && data._honeypot.trim() !== "") {
    console.warn(`[Leads] Honeypot triggered on demo lead from ${data.email}`);
    return { success: true };
  }

  // 2. Duplicate check: if same email submitted demo in last 24hrs -> return fake success
  const dupCheck = await pool.query(
    `SELECT id FROM leads
     WHERE LOWER(email) = LOWER($1)
       AND enquiry_type = 'demo'
       AND created_at >= NOW() - INTERVAL '24 hours'
     LIMIT 1`,
    [data.email]
  );

  if (dupCheck.rows.length > 0) {
    console.log(
      `[Leads] Duplicate demo request for ${data.email} within 24h. Returning success.`
    );
    return { success: true, duplicate: true };
  }

  // 3. Upsert into clients table (status = 'lead')
  const clientRes = await pool.query(
    `INSERT INTO clients (
       name, email, phone, company_name, website, industry, company_size, status
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'lead')
     ON CONFLICT (email) DO NOTHING
     RETURNING id`,
    [
      data.name,
      data.email,
      data.phone || null,
      data.company_name,
      data.website || null,
      data.industry || null,
      data.company_size || null,
    ]
  );

  let clientId = clientRes.rows[0]?.id;
  if (!clientId) {
    const existingClient = await pool.query(
      "SELECT id FROM clients WHERE LOWER(email) = LOWER($1)",
      [data.email]
    );
    clientId = existingClient.rows[0]?.id;
  }

  // 4. Record DPDP consent if client exists/inserted
  if (clientId) {
    await recordConsent(clientId, data.email, ipAddress);
  }

  // 5. Insert into leads table (raw submission log)
  await pool.query(
    `INSERT INTO leads (
       enquiry_type, name, email, phone, company_name, website, industry,
       company_size, use_case, preferred_date, message, lead_status, ip_address, user_agent
     ) VALUES (
       'demo', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'new', $11, $12
     )`,
    [
      data.name,
      data.email,
      data.phone || null,
      data.company_name,
      data.website || null,
      data.industry || null,
      data.company_size || null,
      data.use_case || null,
      data.preferred_date ? data.preferred_date : null,
      data.message || null,
      ipAddress || null,
      userAgent || null,
    ]
  );

  // 6. Generate withdrawal token
  const withdrawalToken = generateWithdrawalToken(data.email);

  // 7. Fire-and-forget confirmation emails and internal alert
  sendDemoConfirmation(
    {
      name: data.name,
      email: data.email,
      company_name: data.company_name,
    },
    withdrawalToken
  ).catch((err) =>
    console.error("[Leads] Error sending demo confirmation:", err)
  );

  sendInternalNotification({
    name: data.name,
    email: data.email,
    company_name: data.company_name,
    phone: data.phone,
    use_case: data.use_case,
  }).catch((err) =>
    console.error("[Leads] Error sending internal notification:", err)
  );

  return { success: true };
}

export async function createContactLead(
  data: ContactLeadData,
  ipAddress?: string,
  userAgent?: string
): Promise<{ success: boolean; duplicate?: boolean }> {
  // 1. Honeypot check
  if (data._honeypot && data._honeypot.trim() !== "") {
    console.warn(`[Leads] Honeypot triggered on contact lead from ${data.email}`);
    return { success: true };
  }

  // 2. Duplicate check within 24h
  const dupCheck = await pool.query(
    `SELECT id FROM leads
     WHERE LOWER(email) = LOWER($1)
       AND enquiry_type = 'contact'
       AND created_at >= NOW() - INTERVAL '24 hours'
     LIMIT 1`,
    [data.email]
  );

  if (dupCheck.rows.length > 0) {
    console.log(
      `[Leads] Duplicate contact request for ${data.email} within 24h. Returning success.`
    );
    return { success: true, duplicate: true };
  }

  const company = data.company_name || data.company || null;

  // 3. Upsert client
  const clientRes = await pool.query(
    `INSERT INTO clients (name, email, company_name, status)
     VALUES ($1, $2, $3, 'lead')
     ON CONFLICT (email) DO NOTHING
     RETURNING id`,
    [data.name, data.email, company]
  );

  let clientId = clientRes.rows[0]?.id;
  if (!clientId) {
    const existingClient = await pool.query(
      "SELECT id FROM clients WHERE LOWER(email) = LOWER($1)",
      [data.email]
    );
    clientId = existingClient.rows[0]?.id;
  }

  // 4. Record consent
  if (clientId) {
    await recordConsent(clientId, data.email, ipAddress);
  }

  // 5. Insert into leads table
  await pool.query(
    `INSERT INTO leads (
       enquiry_type, name, email, company_name, subject, message, lead_status, ip_address, user_agent
     ) VALUES (
       'contact', $1, $2, $3, $4, $5, 'new', $6, $7
     )`,
    [
      data.name,
      data.email,
      company,
      data.subject,
      data.message,
      ipAddress || null,
      userAgent || null,
    ]
  );

  // 6. Generate withdrawal token and notify
  const withdrawalToken = generateWithdrawalToken(data.email);

  sendDemoConfirmation(
    {
      name: data.name,
      email: data.email,
      company_name: company || undefined,
    },
    withdrawalToken
  ).catch((err) =>
    console.error("[Leads] Error sending contact confirmation:", err)
  );

  sendInternalNotification({
    name: data.name,
    email: data.email,
    company_name: company || undefined,
    use_case: `Subject: ${data.subject}\n\n${data.message}`,
  }).catch((err) =>
    console.error("[Leads] Error sending internal notification:", err)
  );

  return { success: true };
}
