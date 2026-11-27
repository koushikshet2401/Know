import { Router } from "express";
import { verifyAdmin } from "../../middleware/auth";
import { apiLimiter } from "../../middleware/rateLimiter";
import {
  handleWithdrawConsent,
  listConsentRecords,
  getClientConsent,
} from "./consent.controller";

// Public consent routes: /api/consent
export const consentPublicRoutes = Router();
consentPublicRoutes.get("/withdraw", handleWithdrawConsent);

// Admin consent routes: /api/admin/consent
export const consentAdminRoutes = Router();
consentAdminRoutes.use(verifyAdmin);
consentAdminRoutes.use(apiLimiter);

consentAdminRoutes.get("/", listConsentRecords);
consentAdminRoutes.get("/:clientId", getClientConsent);

export default consentPublicRoutes;
