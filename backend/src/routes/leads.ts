import { Router, Request, Response } from "express";
import { formLimiter } from "../middleware/rateLimiter";
import { validateBody } from "../middleware/validate";
import {
  demoRequestSchema,
  contactFormSchema,
  DemoRequestData,
  ContactFormData,
} from "../schemas/leadSchemas";
import {
  createLead,
  checkRecentSubmission,
} from "../services/leadService";
import {
  sendInternalNotification,
  sendAcknowledgement,
} from "../services/emailService";

export const leadsRouter = Router();

// POST /api/leads/demo
leadsRouter.post(
  "/demo",
  formLimiter,
  validateBody(demoRequestSchema),
  async (req: Request, res: Response) => {
    try {
      const body = req.body as DemoRequestData;
      const ip =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
        req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];

      // 1. Honeypot check: If bot filled _honeypot, return 201 silently
      if (body._honeypot && body._honeypot.trim().length > 0) {
        console.warn(`[Bot Trap] Honeypot triggered on /demo from IP: ${ip}`);
        res.status(201).json({
          success: true,
          message:
            "Your demo request has been received. We will contact you within 24 hours.",
        });
        return;
      }

      // 2. Duplicate check: Same email + demo enquiry within 24 hours
      const isDuplicate = await checkRecentSubmission(body.email, "demo", 24);
      if (isDuplicate) {
        console.log(
          `[Duplicate] Recent demo submission detected for ${body.email}. Returning 201 silently.`
        );
        res.status(201).json({
          success: true,
          message:
            "Your demo request has been received. We will contact you within 24 hours.",
        });
        return;
      }

      // 3. Save lead to database
      const lead = await createLead(body, "demo", ip, userAgent);

      // 4. Send notifications (fire and forget)
      sendInternalNotification(lead).catch((err) =>
        console.error("[Email] Error in background internal notification:", err)
      );
      sendAcknowledgement(lead).catch((err) =>
        console.error("[Email] Error in background acknowledgement:", err)
      );

      // 5. Respond 201
      res.status(201).json({
        success: true,
        message:
          "Your demo request has been received. We will contact you within 24 hours.",
      });
    } catch (err) {
      console.error("[Leads Error] /demo submission failed:", err);
      res.status(500).json({
        success: false,
        message: "Failed to process your request. Please try again later.",
      });
    }
  }
);

// POST /api/leads/contact
leadsRouter.post(
  "/contact",
  formLimiter,
  validateBody(contactFormSchema),
  async (req: Request, res: Response) => {
    try {
      const body = req.body as ContactFormData;
      const ip =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
        req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];

      // 1. Honeypot check
      if (body._honeypot && body._honeypot.trim().length > 0) {
        console.warn(`[Bot Trap] Honeypot triggered on /contact from IP: ${ip}`);
        res.status(201).json({
          success: true,
          message:
            "Thanks for reaching out. We will get back to you within 24 hours.",
        });
        return;
      }

      // 2. Duplicate check
      const isDuplicate = await checkRecentSubmission(body.email, "contact", 24);
      if (isDuplicate) {
        console.log(
          `[Duplicate] Recent contact submission detected for ${body.email}. Returning 201 silently.`
        );
        res.status(201).json({
          success: true,
          message:
            "Thanks for reaching out. We will get back to you within 24 hours.",
        });
        return;
      }

      // 3. Save lead to database
      const lead = await createLead(body, "contact", ip, userAgent);

      // 4. Send notifications (fire and forget)
      sendInternalNotification(lead).catch((err) =>
        console.error("[Email] Error in background internal notification:", err)
      );
      sendAcknowledgement(lead).catch((err) =>
        console.error("[Email] Error in background acknowledgement:", err)
      );

      // 5. Respond 201
      res.status(201).json({
        success: true,
        message:
          "Thanks for reaching out. We will get back to you within 24 hours.",
      });
    } catch (err) {
      console.error("[Leads Error] /contact submission failed:", err);
      res.status(500).json({
        success: false,
        message: "Failed to process your request. Please try again later.",
      });
    }
  }
);
