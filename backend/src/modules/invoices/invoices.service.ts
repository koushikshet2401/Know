import PDFDocument from "pdfkit";
import { pool } from "../../config/db";
import { env } from "../../config/env";

export interface InvoiceFilters {
  clientId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function generateInvoiceNumber(): Promise<string> {
  const countRes = await pool.query("SELECT COUNT(*) FROM invoices");
  const count = parseInt(countRes.rows[0].count, 10);
  const currentYear = new Date().getFullYear();
  return `${env.invoicePrefix}-${currentYear}-${String(count + 1).padStart(3, "0")}`;
}

export async function createInvoice(
  clientId: string,
  subscriptionId: string,
  amountInr: number
) {
  const gstPercentage = env.gstPercentage;
  const gstAmount = Number(((amountInr * gstPercentage) / 100).toFixed(2));
  const totalInr = Number((amountInr + gstAmount).toFixed(2));
  const invoiceNumber = await generateInvoiceNumber();

  const insertSql = `
    INSERT INTO invoices (
      client_id,
      subscription_id,
      invoice_number,
      amount_inr,
      gst_amount,
      total_inr,
      status,
      issued_at,
      due_at,
      paid_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, 'paid', NOW(), NOW(), NOW()
    ) RETURNING *
  `;

  const result = await pool.query(insertSql, [
    clientId,
    subscriptionId,
    invoiceNumber,
    amountInr,
    gstAmount,
    totalInr,
  ]);

  return result.rows[0];
}

export async function getInvoices(filters: InvoiceFilters = {}) {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(filters.limit) || 10));
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.clientId) {
    params.push(filters.clientId);
    conditions.push(`invoices.client_id = $${params.length}`);
  }

  if (filters.status) {
    params.push(filters.status);
    conditions.push(`invoices.status = $${params.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countSql = `SELECT COUNT(*) FROM invoices ${whereClause}`;
  const countRes = await pool.query(countSql, params);
  const total = parseInt(countRes.rows[0].count, 10);
  const pages = Math.ceil(total / limit);

  const dataParams = [...params, limit, offset];
  const limitIdx = params.length + 1;
  const offsetIdx = params.length + 2;

  const dataSql = `
    SELECT
      invoices.*,
      clients.name,
      clients.email,
      clients.company_name
    FROM invoices
    JOIN clients ON clients.id = invoices.client_id
    ${whereClause}
    ORDER BY invoices.issued_at DESC
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

export async function getInvoiceById(id: string) {
  const query = `
    SELECT
      invoices.*,
      clients.name AS client_name,
      clients.email AS client_email,
      clients.company_name,
      clients.website AS client_website,
      cs.started_at,
      cs.ends_at,
      p.name AS plan_name,
      p.duration_days
    FROM invoices
    JOIN clients ON clients.id = invoices.client_id
    LEFT JOIN client_subscriptions cs ON cs.id = invoices.subscription_id
    LEFT JOIN plans p ON p.id = cs.plan_id
    WHERE invoices.id = $1
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

export async function generateInvoicePdf(invoiceId: string): Promise<Buffer> {
  const invoice = await getInvoiceById(invoiceId);
  if (!invoice) {
    throw new Error("INVOICE_NOT_FOUND");
  }

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err) => reject(err));

    const issuedDate = invoice.issued_at
      ? new Date(invoice.issued_at).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

    const dueDate = invoice.due_at
      ? new Date(invoice.due_at).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : issuedDate;

    const periodStart = invoice.started_at
      ? new Date(invoice.started_at).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

    const periodEnd = invoice.ends_at
      ? new Date(invoice.ends_at).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

    const planName = invoice.plan_name || "Custom";
    const amountInr = Number(invoice.amount_inr || 0).toFixed(2);
    const gstAmount = Number(invoice.gst_amount || 0).toFixed(2);
    const totalInr = Number(invoice.total_inr || 0).toFixed(2);
    const status = (invoice.status || "paid").toUpperCase();

    // 1. Header
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("KnowBridge", 50, 50);

    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#6B7280")
      .text("AI-Powered Customer Support & Leads", 50, 76);

    // Right header (INVOICE & number)
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("INVOICE", 400, 50, { align: "right" });

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor("#4B5563")
      .text(invoice.invoice_number, 400, 76, { align: "right" });

    // Divider Line
    doc
      .moveTo(50, 105)
      .lineTo(545, 105)
      .strokeColor("#E5E7EB")
      .lineWidth(1)
      .stroke();

    // 2. Bill To & Invoice Info (2 columns)
    const infoY = 125;

    // Left Column: Bill To
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .fillColor("#9CA3AF")
      .text("BILL TO", 50, infoY);

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text(invoice.client_name || "Valued Customer", 50, infoY + 16);

    if (invoice.company_name) {
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#4B5563")
        .text(invoice.company_name, 50, infoY + 32);
    }

    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#6B7280")
      .text(invoice.client_email, 50, infoY + (invoice.company_name ? 48 : 32));

    // Right Column: Invoice Details & Status
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .fillColor("#9CA3AF")
      .text("INVOICE DETAILS", 350, infoY);

    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#4B5563")
      .text(`Issued Date: ${issuedDate}`, 350, infoY + 16)
      .text(`Due Date: ${dueDate}`, 350, infoY + 30);

    // Status Stamp
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .fillColor(status === "PAID" ? "#059669" : "#DC2626")
      .text(`Status: ${status}`, 350, infoY + 44);

    // 3. Table Header
    const tableHeaderY = 210;
    doc
      .rect(50, tableHeaderY, 495, 24)
      .fillColor("#F3F4F6")
      .fill();

    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .fillColor("#374151")
      .text("Description", 60, tableHeaderY + 7, { width: 220 })
      .text("Period", 280, tableHeaderY + 7, { width: 140 })
      .text("Amount (INR)", 420, tableHeaderY + 7, { width: 115, align: "right" });

    // Table Row
    const rowY = tableHeaderY + 32;
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text(`${planName} Plan Subscription`, 60, rowY, { width: 220 });

    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#4B5563")
      .text(`${periodStart} to ${periodEnd}`, 280, rowY, { width: 140 })
      .text(`INR ${amountInr}`, 420, rowY, { width: 115, align: "right" });

    // Table divider line
    doc
      .moveTo(50, rowY + 30)
      .lineTo(545, rowY + 30)
      .strokeColor("#E5E7EB")
      .lineWidth(1)
      .stroke();

    // 4. Totals Breakdown
    const totalsY = rowY + 45;

    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#4B5563")
      .text("Subtotal", 350, totalsY, { width: 80 })
      .text(`INR ${amountInr}`, 430, totalsY, { width: 105, align: "right" });

    doc
      .text(`GST (${env.gstPercentage}%)`, 350, totalsY + 18, { width: 80 })
      .text(`INR ${gstAmount}`, 430, totalsY + 18, { width: 105, align: "right" });

    doc
      .moveTo(350, totalsY + 36)
      .lineTo(545, totalsY + 36)
      .strokeColor("#E5E7EB")
      .lineWidth(1)
      .stroke();

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("Total", 350, totalsY + 44, { width: 80 })
      .text(`INR ${totalInr}`, 430, totalsY + 44, { width: 105, align: "right" });

    // 5. Footer
    const footerY = 680;
    doc
      .moveTo(50, footerY)
      .lineTo(545, footerY)
      .strokeColor("#E5E7EB")
      .lineWidth(1)
      .stroke();

    doc
      .fontSize(8.5)
      .font("Helvetica")
      .fillColor("#9CA3AF")
      .text(
        "Thank you for your business. This is a computer-generated invoice.",
        50,
        footerY + 15,
        { align: "center", width: 495 }
      )
      .text("KnowBridge · hello@knowbridge.io", 50, footerY + 28, {
        align: "center",
        width: 495,
      });

    doc.end();
  });
}
