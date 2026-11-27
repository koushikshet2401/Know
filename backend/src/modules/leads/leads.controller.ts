import { Request, Response } from "express";
import { z } from "zod";
import { createDemoLead, createContactLead } from "./leads.service";

const demoSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(50).optional(),
  company_name: z.string().min(1, "Company name is required").max(255),
  website: z.string().optional().or(z.literal("")),
  industry: z.string().optional().or(z.literal("")),
  company_size: z.string().optional().or(z.literal("")),
  use_case: z.string().optional().or(z.literal("")),
  preferred_date: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
  _honeypot: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to submit this form." }),
  }),
});

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email address"),
  company: z.string().max(255).optional(),
  company_name: z.string().max(255).optional(),
  subject: z.string().min(1, "Subject is required").max(255),
  message: z.string().min(1, "Message is required").max(2000),
  _honeypot: z.string().optional(),
  consent: z.boolean().optional(),
});

export async function handleDemoLead(
  req: Request,
  res: Response
): Promise<void> {
  const parseResult = demoSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parseResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  try {
    const ipAddress = (req.headers["x-forwarded-for"] as string) || req.ip;
    const userAgent = req.headers["user-agent"];

    const result = await createDemoLead(parseResult.data, ipAddress, userAgent);

    res.status(200).json({
      message: "Demo request received successfully",
      ...result,
    });
  } catch (error) {
    console.error("Error handling demo lead:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while processing demo request",
    });
  }
}

export async function handleContactLead(
  req: Request,
  res: Response
): Promise<void> {
  const parseResult = contactSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parseResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  try {
    const ipAddress = (req.headers["x-forwarded-for"] as string) || req.ip;
    const userAgent = req.headers["user-agent"];

    const result = await createContactLead(
      parseResult.data,
      ipAddress,
      userAgent
    );

    res.status(200).json({
      message: "Contact message received successfully",
      ...result,
    });
  } catch (error) {
    console.error("Error handling contact lead:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while processing contact message",
    });
  }
}
