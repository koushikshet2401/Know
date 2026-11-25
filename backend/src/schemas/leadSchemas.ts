import { z } from "zod";

export const companySizeEnum = z.enum([
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "500+",
]);

export const demoRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(50, "Phone number is too long").optional(),
  company_name: z
    .string()
    .min(1, "Company name is required")
    .max(255, "Company name is too long"),
  website: z
    .string()
    .url("Website must be a valid URL (e.g. https://yourcompany.com)")
    .optional()
    .or(z.literal("")),
  industry: z.string().max(100, "Industry is too long").optional(),
  company_size: companySizeEnum.optional().or(z.literal("")),
  use_case: z.string().max(1000, "Use case cannot exceed 1000 characters").optional(),
  preferred_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Preferred date must be in YYYY-MM-DD format")
    .optional()
    .or(z.literal("")),
  message: z.string().max(2000, "Message cannot exceed 2000 characters").optional(),
  _honeypot: z.string().optional().default(""),
});

export type DemoRequestData = z.infer<typeof demoRequestSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Invalid email address"),
  company: z.string().max(255, "Company name is too long").optional(),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(255, "Subject cannot exceed 255 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Message cannot exceed 2000 characters"),
  _honeypot: z.string().optional().default(""),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
