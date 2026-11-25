import { z } from "zod";

// ─── Demo Request Schema ──────────────────────────────────────────────────────
export const demoRequestSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(50, "Phone number is too long").optional().or(z.literal("")),
  company_name: z
    .string()
    .min(1, "Company name is required")
    .max(255, "Company name is too long"),
  website: z
    .string()
    .url("Please enter a valid URL (e.g. https://yourcompany.com)")
    .optional()
    .or(z.literal("")),
  industry: z.string().max(100, "Industry is too long").optional().or(z.literal("")),
  company_size: z
    .enum(["1-10", "11-50", "51-200", "201-500", "500+", ""])
    .optional(),
  use_case: z.string().max(1000, "Use case must be under 1000 characters").optional().or(z.literal("")),
  preferred_date: z.string().optional().or(z.literal("")),
  message: z.string().max(2000, "Message must be under 2000 characters").optional().or(z.literal("")),
  _honeypot: z.string().optional(),
});

export type DemoRequestInput = z.infer<typeof demoRequestSchema>;

// ─── Contact Form Schema ──────────────────────────────────────────────────────
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().max(255, "Company name is too long").optional().or(z.literal("")),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(255, "Subject is too long"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Message must be under 2000 characters"),
  _honeypot: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
