import { Request, Response } from "express";
import { z } from "zod";
import { loginAdmin, getAdminById } from "./auth.service";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(req: Request, res: Response): Promise<void> {
  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parseResult.error.flatten(),
    });
    return;
  }

  const { email, password } = parseResult.data;

  try {
    const result = await loginAdmin(email, password);
    res.status(200).json({
      success: true,
      token: result.token,
      admin: result.admin,
    });
  } catch (error: any) {
    if (error?.message === "INVALID_CREDENTIALS") {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    console.error("Login controller error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function me(req: Request, res: Response): Promise<void> {
  try {
    const adminId = req.admin?.adminId;

    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const admin = await getAdminById(adminId);
    if (!admin) {
      res.status(404).json({
        success: false,
        message: "Admin not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Me controller error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
