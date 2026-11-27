import { transporter } from "../config/smtp";
import { env } from "../config/env";
import { getInvoiceById, generateInvoicePdf } from "../modules/invoices/invoices.service";
import { getClientById } from "../modules/clients/clients.service";
import {
  invoiceEmailHtml,
  demoConfirmationEmailHtml,
} from "./emailTemplates";

export async function sendInvoiceEmail(
  clientId: string,
  invoiceId: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const invoice = await getInvoiceById(invoiceId);
    if (!invoice) {
      console.error(`[EmailService] Invoice ${invoiceId} not found.`);
      return { success: false, error: "Invoice not found" };
    }

    const client = await getClientById(clientId);
    if (!client) {
      console.error(`[EmailService] Client ${clientId} not found.`);
      return { success: false, error: "Client not found" };
    }

    const pdfBuffer = await generateInvoicePdf(invoiceId);
    const planName = invoice.plan_name || client.current_plan_name || "Custom";

    const info = await transporter.sendMail({
      from: env.fromEmail,
      to: client.email,
      subject: `Your KnowBridge Invoice ${invoice.invoice_number}`,
      html: invoiceEmailHtml(client, invoice, planName),
      attachments: [
        {
          filename: `${invoice.invoice_number}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log(`[EmailService] Invoice email sent to ${client.email} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("[EmailService] Failed to send invoice email:", error);
    return { success: false, error: error?.message || "Failed to send invoice email" };
  }
}

export async function sendDemoConfirmation(
  lead: {
    name: string;
    email: string;
    company_name?: string;
  },
  token?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await transporter.sendMail({
      from: env.fromEmail,
      to: lead.email,
      subject: "We received your demo request — KnowBridge",
      html: demoConfirmationEmailHtml(lead, token),
    });
    console.log(`[EmailService] Demo confirmation email sent to ${lead.email}`);
    return { success: true };
  } catch (error: any) {
    console.error("[EmailService] Failed to send demo confirmation:", error);
    return { success: false, error: error?.message || "Failed to send confirmation" };
  }
}

export async function sendInternalNotification(lead: {
  name: string;
  email: string;
  company_name?: string;
  phone?: string;
  use_case?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const html = `
      <h3>New Demo Request Submitted</h3>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Company:</strong> ${lead.company_name || "N/A"}</p>
      <p><strong>Phone:</strong> ${lead.phone || "N/A"}</p>
      <p><strong>Use Case:</strong> ${lead.use_case || "N/A"}</p>
      <p><strong>Submitted At:</strong> ${new Date().toISOString()}</p>
    `;

    await transporter.sendMail({
      from: env.fromEmail,
      to: env.notifyEmail,
      subject: `New demo request — ${lead.company_name || lead.name}`,
      html,
    });
    console.log(`[EmailService] Internal notification sent to ${env.notifyEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error("[EmailService] Failed to send internal notification:", error);
    return { success: false, error: error?.message || "Failed to send notification" };
  }
}
