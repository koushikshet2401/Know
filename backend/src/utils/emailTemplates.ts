import { env } from "../config/env";
import { generateWithdrawalToken } from "../modules/consent/consent.service";

export function withdrawalLinkHtml(email: string, token?: string): string {
  const activeToken = token || generateWithdrawalToken(email);
  const withdrawalUrl = `${env.frontendUrl}/consent/withdraw?token=${encodeURIComponent(activeToken)}`;

  return `
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #eee;font-size:12px;color:#999;text-align:center;">
      <p style="margin: 0 0 6px 0;">You are receiving this email because you consented to KnowBridge processing your data.</p>
      <p style="margin: 0 0 8px 0;">As per the Digital Personal Data Protection Act 2023 (India), you have the right to withdraw your consent at any time.</p>
      <p style="margin: 0;"><a href="${withdrawalUrl}" style="color:#6366F1;text-decoration:underline;font-weight:500;">
        Click here to withdraw consent and request data deletion
      </a></p>
    </div>
  `.trim();
}

export function invoiceEmailHtml(
  client: { name: string; email: string },
  invoice: {
    invoice_number: string;
    total_inr: number | string;
    started_at?: Date | string;
    ends_at?: Date | string;
  },
  planName: string,
  token?: string
): string {
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

  const withdrawalFooter = withdrawalLinkHtml(client.email, token);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937; line-height: 1.6; margin: 0; padding: 24px; background-color: #f9fafb; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; padding: 32px; }
    .header { font-size: 20px; font-weight: bold; color: #111827; margin-bottom: 20px; }
    .details { background: #f3f4f6; border-radius: 6px; padding: 16px; margin: 20px 0; }
    .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .row:last-child { margin-bottom: 0; }
    .label { color: #6b7280; font-size: 14px; }
    .value { font-weight: 600; color: #111827; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">Your KnowBridge Invoice</div>
    <p>Dear ${client.name},</p>
    <p>Thank you for subscribing to the <strong>KnowBridge ${planName} plan</strong>.</p>
    
    <div class="details">
      <div class="row">
        <span class="label">Invoice Number:</span>
        <span class="value">${invoice.invoice_number}</span>
      </div>
      <div class="row">
        <span class="label">Amount Paid:</span>
        <span class="value">₹${Number(invoice.total_inr).toFixed(2)} (including 18% GST)</span>
      </div>
      <div class="row">
        <span class="label">Plan Period:</span>
        <span class="value">${periodStart} to ${periodEnd}</span>
      </div>
    </div>

    <p>Your official tax invoice is attached to this email as a PDF document for your records.</p>
    <p>If you have any questions or require support, our team is always available.</p>

    <p>Regards,<br><strong>KnowBridge Team</strong></p>

    ${withdrawalFooter}
  </div>
</body>
</html>
  `.trim();
}

export function consentWithdrawalEmailHtml(
  client: { name: string; email: string }
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937; line-height: 1.6; margin: 0; padding: 24px; background-color: #f9fafb; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; padding: 32px; }
    .header { font-size: 20px; font-weight: bold; color: #b91c1c; margin-bottom: 20px; }
    .notice { background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 16px; margin: 20px 0; color: #991b1b; }
    .footer { margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 12px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">Data Consent Withdrawn</div>
    <p>Dear ${client.name},</p>
    
    <div class="notice">
      We have received your request to withdraw consent for data processing.
    </div>

    <p>Your personal data will be deleted within <strong>30 days</strong> as required by the <strong>Digital Personal Data Protection Act 2023 (India)</strong>.</p>
    <p>If this was a mistake or you wish to cancel this withdrawal, please contact us at <a href="mailto:hello@knowbridge.io">hello@knowbridge.io</a> within 7 days.</p>
    <p>A data deletion confirmation will be sent to this email once complete.</p>

    <p>Regards,<br><strong>KnowBridge Privacy & Compliance Team</strong></p>

    <div class="footer">
      KnowBridge · hello@knowbridge.io
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function demoConfirmationEmailHtml(
  lead: {
    name: string;
    email: string;
    company_name?: string;
  },
  token?: string
): string {
  const withdrawalFooter = withdrawalLinkHtml(lead.email, token);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937; line-height: 1.6; margin: 0; padding: 24px; background-color: #f9fafb; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; padding: 32px; }
    .header { font-size: 20px; font-weight: bold; color: #111827; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">We Received Your Demo Request</div>
    <p>Dear ${lead.name},</p>
    <p>Thank you for requesting a demo of KnowBridge${lead.company_name ? ` for ${lead.company_name}` : ""}.</p>
    <p>We will contact you at <strong>${lead.email}</strong> within 24 hours to confirm your demo time.</p>
    <p>By submitting this form you consented to us contacting you regarding KnowBridge services. You can withdraw this consent at any time.</p>

    <p>Regards,<br><strong>KnowBridge Team</strong></p>

    ${withdrawalFooter}
  </div>
</body>
</html>
  `.trim();
}
