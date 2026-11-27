import { Router } from "express";
import { verifyAdmin } from "../../middleware/auth";
import { apiLimiter } from "../../middleware/rateLimiter";
import {
  listClients,
  getClient,
  updateStatus,
  suspend,
  reactivate,
  expiring,
} from "./clients.controller";
import { assignPlan, incrementUsage } from "../plans/plans.controller";

const router = Router();

// Apply auth and rate limiting to all admin client routes
router.use(verifyAdmin);
router.use(apiLimiter);

router.get("/", listClients);
router.get("/expiring", expiring);
router.get("/:id", getClient);
router.patch("/:id/status", updateStatus);
router.post("/:id/suspend", suspend);
router.post("/:id/reactivate", reactivate);
router.post("/:id/assign-plan", assignPlan);
router.post("/:id/increment-usage", incrementUsage);

export default router;
