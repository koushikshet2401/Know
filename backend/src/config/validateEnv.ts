import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("1h"),
  SMTP_HOST: z.string().optional().default("smtp.resend.com"),
  SMTP_PORT: z.string().optional().default("465"),
  SMTP_USER: z.string().optional().default("resend"),
  SMTP_PASS: z.string().optional().default(""),
  NOTIFY_EMAIL: z.string().email().optional().default("team@knowbridge.io"),
  SEND_ACK_EMAIL: z
    .string()
    .optional()
    .transform((val) => val === "true")
    .default("false"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
});

export type EnvConfig = z.infer<typeof envSchema>;

let parsedEnv: EnvConfig;

export function validateEnv(): EnvConfig {
  if (parsedEnv) return parsedEnv;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errorDetails = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join("\n  ");
    throw new Error(
      `[FATAL] Invalid environment configuration:\n  ${errorDetails}`
    );
  }

  parsedEnv = result.data;
  return parsedEnv;
}
