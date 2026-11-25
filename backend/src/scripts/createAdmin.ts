import bcrypt from "bcryptjs";
import { query, pool } from "../db";

async function createAdmin() {
  const args = process.argv.slice(2);
  const email = args[0];
  const password = args[1];

  if (!email || !password) {
    console.error("Usage: npx tsx src/scripts/createAdmin.ts <email> <password>");
    process.exit(1);
  }

  console.log(`[Admin Seed] Creating admin user: ${email}...`);

  try {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO admin_users (email, password_hash)
      VALUES ($1, $2)
      ON CONFLICT (email) DO UPDATE
      SET password_hash = EXCLUDED.password_hash
      RETURNING id, email, created_at;
    `;

    const res = await query(sql, [email.toLowerCase(), passwordHash]);
    console.log("[Admin Seed] Admin user successfully created/updated:", res.rows[0]);
  } catch (err) {
    console.error("[Admin Seed Error] Failed to create admin user:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createAdmin();
