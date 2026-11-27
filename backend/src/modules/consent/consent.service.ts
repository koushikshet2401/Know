import jwt from "jsonwebtoken";
import { pool } from "../../config/db";
import { env } from "../../config/env";
import { transporter } from "../../config/smtp";
import { consentWithdrawalEmailHtml } from "../../utils/emailTemplates";

export interface ConsentRecordFilters {
  page?: number;
  limit?: number;
  status?: "active" | "withdrawn" | "deleted" | string;
}

export async function recordConsent(
  clientId: string | null,
  email: string,
  ipAddress?: string
) {
  const consentText =
    "I consent to KnowBridge collecting and processing my personal data for the purpose of providing AI customer support services, as described in the Privacy Policy. I understand I can withdraw this consent at any time by clicking the unsubscribe link in any email from KnowBridge, as per the Digital Personal Data Protection Act 2023.";

  const query = `
    INSERT INTO consent_records (
      client_id,
      email,
      consent_given,
      consent_given_at,
      consent_text,
      ip_address
    ) VALUES ($1, $2, TRUE, NOW(), $3, $4)
    RETURNING *
  `;

  const result = await pool.query(query, [
    clientId,
    email,
    consentText,
    ipAddress || null,
  ]);
  return result.rows[0];
}

export function generateWithdrawalToken(email: string): string {
  return jwt.sign({ email, action: "withdraw_consent" }, env.jwtSecret, {
    expiresIn: "30d",
  });
}

export async function withdrawConsent(token: string): Promise<
  | { success: true; deletionDate: Date; alreadyWithdrawn?: false }
  | { alreadyWithdrawn: true }
> {
  let decoded: any;
  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw new Error("INVALID_TOKEN");
  }

  if (!decoded || decoded.action !== "withdraw_consent" || !decoded.email) {
    throw new Error("INVALID_TOKEN");
  }

  const email = decoded.email;

  // Mark consent as withdrawn if currently active
  const updateRes = await pool.query(
    `UPDATE consent_records
     SET withdrawn_at = NOW(),
         data_deleted_at = NOW() + INTERVAL '30 days'
     WHERE email = $1 AND withdrawn_at IS NULL
     RETURNING *`,
    [email]
  );

  if (updateRes.rows.length === 0) {
    return { alreadyWithdrawn: true };
  }

  // Flag the client for deletion (status = 'cancelled')
  const clientRes = await pool.query(
    `UPDATE clients
     SET status = 'cancelled', updated_at = NOW()
     WHERE email = $1
     RETURNING name, email`,
    [email]
  );

  const clientName = clientRes.rows[0]?.name || "Valued User";

  // Send DPDP withdrawal confirmation email
  try {
    await transporter.sendMail({
      from: env.fromEmail,
      to: email,
      subject: "Your KnowBridge data consent has been withdrawn",
      html: consentWithdrawalEmailHtml({ name: clientName, email }),
    });
    console.log(`[Consent] Sent withdrawal confirmation email to ${email}`);
  } catch (err) {
    console.error("[Consent] Failed to send withdrawal confirmation email:", err);
  }

  const deletionDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  return {
    success: true,
    deletionDate,
  };
}

export async function processDataDeletion(): Promise<number> {
  const eligibleRecords = await pool.query(
    `SELECT id, email FROM consent_records
     WHERE data_deleted_at <= NOW()
       AND data_deleted_at IS NOT NULL
       AND (data_deleted IS FALSE OR data_deleted IS NULL)`
  );

  let deletedCount = 0;

  for (const record of eligibleRecords.rows) {
    try {
      await pool.query("DELETE FROM clients WHERE email = $1", [record.email]);
      await pool.query(
        "UPDATE consent_records SET data_deleted = TRUE WHERE id = $1",
        [record.id]
      );
      deletedCount++;
    } catch (err) {
      console.error(
        `[Consent] Error deleting client data for ${record.email}:`,
        err
      );
    }
  }

  if (deletedCount > 0) {
    console.log(`[DPDP] Deleted data for ${deletedCount} clients`);
  }

  return deletedCount;
}

export async function getConsentRecord(clientId: string) {
  const query = `
    SELECT *
    FROM consent_records
    WHERE client_id = $1
    ORDER BY created_at DESC
    LIMIT 1
  `;
  const result = await pool.query(query, [clientId]);
  return result.rows[0] || null;
}

export async function getAllConsentRecords(filters: ConsentRecordFilters = {}) {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(filters.limit) || 10));
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.status === "active") {
    conditions.push("cr.withdrawn_at IS NULL");
  } else if (filters.status === "withdrawn") {
    conditions.push(
      "cr.withdrawn_at IS NOT NULL AND (cr.data_deleted IS FALSE OR cr.data_deleted IS NULL)"
    );
  } else if (filters.status === "deleted") {
    conditions.push("cr.data_deleted IS TRUE");
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countSql = `SELECT COUNT(*) FROM consent_records cr ${whereClause}`;
  const countRes = await pool.query(countSql, params);
  const total = parseInt(countRes.rows[0].count, 10);
  const pages = Math.ceil(total / limit);

  const dataParams = [...params, limit, offset];
  const limitIdx = params.length + 1;
  const offsetIdx = params.length + 2;

  const dataSql = `
    SELECT
      cr.*,
      c.name AS client_name,
      c.company_name,
      c.status AS client_status
    FROM consent_records cr
    LEFT JOIN clients c ON c.id = cr.client_id
    ${whereClause}
    ORDER BY cr.created_at DESC
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
