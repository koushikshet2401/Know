import { Router } from "express";
import { verifyAdmin } from "../../middleware/auth";
import { apiLimiter } from "../../middleware/rateLimiter";
import {
  listInvoices,
  getInvoice,
  downloadInvoicePdf,
  sendEmail,
} from "./invoices.controller";

const router = Router();

// Apply auth and rate limiting
router.use(verifyAdmin);
router.use(apiLimiter);

router.get("/", listInvoices);
router.get("/:id", getInvoice);
router.get("/:id/download", downloadInvoicePdf);
router.post("/:id/send-email", sendEmail);

export default router;
