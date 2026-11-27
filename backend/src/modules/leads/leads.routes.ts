import { Router } from "express";
import { formLimiter } from "../../middleware/rateLimiter";
import { handleDemoLead, handleContactLead } from "./leads.controller";

const router = Router();

router.post("/demo", formLimiter, handleDemoLead);
router.post("/contact", formLimiter, handleContactLead);

export default router;
