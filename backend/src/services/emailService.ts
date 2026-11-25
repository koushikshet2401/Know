import nodemailer from "nodemailer";
import { validateEnv } from "../config/validateEnv";
import { LeadRecord } from "./leadService";

const env = validateEnv();

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT, 10),
  secure: env.SMTP_PORT === "465",
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendInternalNotification(lead: LeadRecord): Promise<void> {
  try {
    const isDemo = lead.enquiry_type === "demo";
    const subject = `[KnowBridge Lead] New ${isDemo ? "Demo Request" : "Contact Enquiry"} from ${lead.name} (${lead.company_name || "N/A"})`;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; color: #18181b; line-height: 1.5;">
        <h2 style="color: #6366f1;">New Lead Received: ${isDemo ? "Book a Demo" : "Contact Form"}</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Enquiry Type</td><td style="padding: 8px; border-bottom: 1px solid #e4e4e7;">${lead.enquiry_type}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Name</td><td style="padding: 8px; border-bottom: 1px solid #e4e4e7;">${lead.name}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #e4e4e7;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
          ${lead.phone ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #e4e4e7;">${lead.phone}</td></tr>` : ""}
          ${lead.company_name ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Company</td><td style="padding: 8px; border-bottom: 1px solid #e4e4e7;">${lead.company_name}</td></tr>` : ""}
          ${lead.website ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Website</td><td style="padding: 8px; border-bottom: 1px solid #e4e4e7;"><a href="${lead.website}">${lead.website}</a></td></tr>` : ""}
          ${lead.industry ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Industry</td><td style="padding: 8px; border-bottom: 1px solid #e4e4e7;">${lead.industry}</td></tr>` : ""}
          ${lead.company_size ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Company Size</td><td style="padding: 8px; border-bottom: 1px solid #e4e4e7;">${lead.company_size}</td></tr>` : ""}
          ${lead.preferred_date ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Preferred Date</td><td style="padding: 8px; border-bottom: 1px solid #e4e4e7;">${lead.preferred_date}</td></tr>` : ""}
          ${lead.subject ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Subject</td><td style="padding: 8px; border-bottom: 1px solid #e4e4e7;">${lead.subject}</td></tr>` : ""}
          ${lead.use_case ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Use Case</td><td style="padding: 8px; border-bottom: 1px solid #e4e4e7;">${lead.use_case}</td></tr>` : ""}
          ${lead.message ? `<tr><td style="padding: 8px; border-bottom: 1px solid #e4e4e7; font-weight: bold;">Message</td><td style="padding: 8px; border-bottom: 1px solid #e4e4e7;">${lead.message}</td></tr>` : ""}
        </table>
        <p style="font-size: 12px; color: #71717a; margin-top: 24px;">Lead ID: ${lead.id} · IP: ${lead.ip_address || "N/A"} · Received at ${lead.created_at}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"KnowBridge Notifications" <no-reply@knowbridge.io>`,
      to: env.NOTIFY_EMAIL,
      subject,
      html,
    });
    console.log(`[Email] Internal notification sent for lead ${lead.id}`);
  } catch (err) {
    console.error("[Email Error] Failed to send internal notification:", err);
  }
}

export async function sendAcknowledgement(lead: LeadRecord): Promise<void> {
  if (!env.SEND_ACK_EMAIL) {
    return;
  }

  try {
    const isDemo = lead.enquiry_type === "demo";
    const subject = isDemo
      ? "We received your demo request — KnowBridge"
      : "Thank you for contacting KnowBridge";

    const bodyText = isDemo
      ? `Hi ${lead.name},\n\nThank you for requesting a demo of KnowBridge! We have received your request and our team will reach out within 24 hours to confirm your scheduled walkthrough.\n\nBest regards,\nThe KnowBridge Team`
      : `Hi ${lead.name},\n\nThank you for reaching out to KnowBridge. We have received your message and will get back to you within 24 hours.\n\nBest regards,\nThe KnowBridge Team`;

    await transporter.sendMail({
      from: `"KnowBridge" <hello@knowbridge.io>`,
      to: lead.email,
      subject,
      text: bodyText,
    });
    console.log(`[Email] Acknowledgement sent to ${lead.email}`);
  } catch (err) {
    console.error("[Email Error] Failed to send acknowledgement email:", err);
  }
}
