import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db";
import { validateEnv } from "../config/validateEnv";
import { verifyAdmin } from "../middleware/auth";
import { adminLimiter } from "../middleware/rateLimiter";
import {
  getLeads,
  getLeadById,
  updateLeadStatus,
} from "../services/leadService";

const env = validateEnv();

export const adminRouter = Router();

// POST /api/admin/auth/login
adminRouter.post("/auth/login", adminLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const sql = `SELECT * FROM admin_users WHERE LOWER(email) = LOWER($1) LIMIT 1;`;
    const result = await query<{
      id: string;
      email: string;
      password_hash: string;
    }>(sql, [email]);

    const admin = result.rows[0];
    if (!admin) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("[Admin Auth Error] Login failed:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/admin/leads
adminRouter.get("/leads", verifyAdmin, adminLimiter, async (req: Request, res: Response) => {
  try {
    const { page, limit, status, search, from, to } = req.query;

    const data = await getLeads({
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      status: status as string,
      search: search as string,
      from: from as string,
      to: to as string,
    });

    res.json({
      success: true,
      ...data,
    });
  } catch (err) {
    console.error("[Admin Leads Error] Fetch failed:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
});

// GET /api/admin/leads/:id
adminRouter.get("/leads/:id", verifyAdmin, async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const lead = await getLeadById(id);

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      return;
    }

    res.json({
      success: true,
      lead,
    });
  } catch (err) {
    console.error("[Admin Leads Error] Fetch by id failed:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lead",
    });
  }
});

// PATCH /api/admin/leads/:id/status
adminRouter.patch("/leads/:id/status", verifyAdmin, async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body;

    const validStatuses = [
      "new",
      "contacted",
      "qualified",
      "demo_scheduled",
      "closed_won",
      "closed_lost",
    ];

    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
      return;
    }

    const updated = await updateLeadStatus(id, status);

    if (!updated) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      return;
    }

    res.json({
      success: true,
      lead: updated,
    });
  } catch (err) {
    console.error("[Admin Leads Error] Status update failed:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update lead status",
    });
  }
});
