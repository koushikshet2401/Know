import { Router } from "express";
import { login, me } from "./auth.controller";
import { loginLimiter } from "../../middleware/rateLimiter";
import { verifyAdmin } from "../../middleware/auth";

const router = Router();

router.post("/login", loginLimiter, login);
router.get("/me", verifyAdmin, me);

export default router;
