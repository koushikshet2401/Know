import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid business email is required"),
  companyName: z.string().min(1, "Company name is required"),
  phone: z.string().optional().default(""),
  websiteUrl: z.string().optional().default(""),
  useCase: z.string().optional().default(""),
  additionalInfo: z.string().optional().default(""),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      fullName,
      email,
      companyName,
      phone,
      websiteUrl,
      useCase,
      additionalInfo,
    } = result.data;

    // Load SMTP credentials strictly from environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT
      ? parseInt(process.env.SMTP_PORT, 10)
      : 587;
    const smtpSecure = process.env.SMTP_SECURE === "true";
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom =
      process.env.SMTP_FROM || `"KnowBridge Leads" <${smtpUser || "hello@knowbridge.io"}>`;
    const smtpTo = process.env.SMTP_TO || "hello@knowbridge.io";

    // If SMTP credentials are configured, send the real email via Nodemailer
    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
          <div style="margin-bottom: 24px; border-bottom: 1px solid #f3f4f6; padding-bottom: 16px;">
            <h2 style="color: #09090b; margin: 0 0 6px 0; font-size: 20px;">New KnowBridge Demo Request</h2>
            <p style="color: #71717a; margin: 0; font-size: 14px;">Received on ${new Date().toLocaleString()}</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; color: #71717a; width: 140px; font-weight: 500;">Full Name:</td>
              <td style="padding: 10px 0; color: #09090b; font-weight: 600;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #71717a; font-weight: 500;">Business Email:</td>
              <td style="padding: 10px 0; color: #09090b;"><a href="mailto:${email}" style="color: #09090b; text-decoration: underline;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #71717a; font-weight: 500;">Company Name:</td>
              <td style="padding: 10px 0; color: #09090b; font-weight: 600;">${companyName}</td>
            </tr>
            ${
              phone
                ? `<tr><td style="padding: 10px 0; color: #71717a; font-weight: 500;">Phone:</td><td style="padding: 10px 0; color: #09090b;">${phone}</td></tr>`
                : ""
            }
            ${
              websiteUrl
                ? `<tr><td style="padding: 10px 0; color: #71717a; font-weight: 500;">Website:</td><td style="padding: 10px 0; color: #09090b;"><a href="${websiteUrl}" target="_blank" style="color: #2563eb;">${websiteUrl}</a></td></tr>`
                : ""
            }
            ${
              useCase
                ? `<tr><td style="padding: 10px 0; color: #71717a; font-weight: 500; vertical-align: top;">Planned Use Case:</td><td style="padding: 10px 0; color: #09090b; line-height: 1.5;">${useCase}</td></tr>`
                : ""
            }
            ${
              additionalInfo
                ? `<tr><td style="padding: 10px 0; color: #71717a; font-weight: 500; vertical-align: top;">Additional Info:</td><td style="padding: 10px 0; color: #09090b; line-height: 1.5;">${additionalInfo}</td></tr>`
                : ""
            }
          </table>

          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #f3f4f6; color: #a1a1aa; font-size: 12px; text-align: center;">
            Sent automatically by KnowBridge Lead Capture &middot; <a href="https://knowbridge.io" style="color: #71717a;">knowbridge.io</a>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: smtpFrom,
        to: smtpTo,
        replyTo: email,
        subject: `[New Lead] Demo Request from ${fullName} (${companyName})`,
        text: `New Demo Request\n\nName: ${fullName}\nEmail: ${email}\nCompany: ${companyName}\nPhone: ${phone}\nWebsite: ${websiteUrl}\nUse Case: ${useCase}\nNotes: ${additionalInfo}`,
        html: emailHtml,
      });

      console.log(`[SMTP Service] Successfully delivered email to ${smtpTo}`);
    } else {
      // In development or when credentials are not yet populated in .env
      console.log(
        "[SMTP Service] Notice: SMTP credentials not fully configured in environment. Lead captured successfully:",
        { fullName, email, companyName, phone, websiteUrl }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your demo request has been received. We will respond within 24 hours.",
    });
  } catch (err: unknown) {
    console.error("[SMTP Service] Error processing request:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email. Please try again or email hello@knowbridge.io directly.",
      },
      { status: 500 }
    );
  }
}
