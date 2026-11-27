import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../config/db";
import { env } from "../../config/env";

export interface AdminPayload {
  adminId: string;
  email: string;
}

export async function loginAdmin(
  email: string,
  password: string
): Promise<{ token: string; admin: { id: string; email: string } }> {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await pool.query(
    "SELECT id, email, password_hash FROM admin_users WHERE LOWER(email) = LOWER($1)",
    [normalizedEmail]
  );

  if (result.rows.length === 0) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const row = result.rows[0];
  const isMatch = await bcrypt.compare(password, row.password_hash);
  if (!isMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const payload: AdminPayload = { adminId: row.id, email: row.email };
  const token = jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as any,
  });

  return {
    token,
    admin: {
      id: row.id,
      email: row.email,
    },
  };
}

export async function getAdminById(adminId: string) {
  const result = await pool.query(
    "SELECT id, email, created_at FROM admin_users WHERE id = $1",
    [adminId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}
