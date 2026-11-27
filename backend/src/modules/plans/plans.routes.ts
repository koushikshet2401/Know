import { Router } from "express";
import { verifyAdmin } from "../../middleware/auth";
import { apiLimiter } from "../../middleware/rateLimiter";
import { listPlans } from "./plans.controller";

const router = Router();

// Apply auth and rate limiting to all admin plans routes
router.use(verifyAdmin);
router.use(apiLimiter);

router.get("/", listPlans);

export default router;
