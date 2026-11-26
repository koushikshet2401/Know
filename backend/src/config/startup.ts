import { checkDbConnection } from "./db";
import { checkSmtpConnection } from "./smtp";
import { env } from "./env";

export async function runStartupChecks(): Promise<void> {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  KnowBridge Marketing Backend");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const db = await checkDbConnection();
  if (db.ok) {
    console.log("  ✅ Database     connected");
  } else {
    console.log("  ❌ Database     FAILED —", db.error);
  }

  const smtp = await checkSmtpConnection();
  if (smtp.ok) {
    console.log("  ✅ SMTP         connected");
  } else {
    console.log("  ❌ SMTP         FAILED —", smtp.error);
  }

  console.log("  🚀 Server       PORT", env.port);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (!db.ok) {
    console.error("Cannot start without database. Fix DATABASE_URL and retry.\n");
    process.exit(1);
  }
}
