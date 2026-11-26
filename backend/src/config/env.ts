import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "PORT",
  "DATABASE_URL",
  "JWT_SECRET",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "FROM_EMAIL",
  "NOTIFY_EMAIL",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
] as const;

export function validateEnv() {
  const missing: string[] = [];

  for (const key of requiredEnvVars) {
    const val = process.env[key];
    if (!val || val.trim() === "") {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error("\n❌ [FATAL] Missing required environment variables:");
    missing.forEach((v) => console.error(`   - ${v}`));
    console.error("Please check your .env file and restart the server.\n");
    process.exit(1);
  }
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT) || 465,
  smtpSecure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  fromEmail: process.env.FROM_EMAIL || "noreply@knowbridge.io",
  notifyEmail: process.env.NOTIFY_EMAIL || "admin@knowbridge.io",
  sendAckEmail: process.env.SEND_ACK_EMAIL === "true",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  adminEmail: process.env.ADMIN_EMAIL || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  gstPercentage: Number(process.env.GST_PERCENTAGE) || 18,
  invoicePrefix: process.env.INVOICE_PREFIX || "KNB",
};

export type Env = typeof env;
