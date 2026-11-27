import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import { env } from "../../config/env";

export async function adminSeed() {
  if (!env.adminEmail || !env.adminPassword) {
    throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD is missing in environment variables.");
  }

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(env.adminPassword, saltRounds);

  const query = `
    INSERT INTO admin_users (email, password_hash)
    VALUES ($1, $2)
    ON CONFLICT (email) DO UPDATE
    SET password_hash = EXCLUDED.password_hash
  `;

  await pool.query(query, [env.adminEmail, passwordHash]);
  console.log(`Admin user seeded: ${env.adminEmail}`);
}

if (require.main === module || !module.parent) {
  adminSeed()
    .then(async () => {
      await pool.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("Admin seed failed:", err);
      await pool.end();
      process.exit(1);
    });
}
