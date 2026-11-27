import { checkDbConnection } from "./db";
import { checkSmtpConnection } from "./smtp";
import { env } from "./env";

export async function runStartupChecks(): Promise<void> {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  KnowBridge Marketing Backend");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const db = await checkDbConnection();
  if (db.ok) {
    console.log("  [OK]     Database connected");
  } else {
    console.log("  [FAILED] Database FAILED —", db.error);
  }

  const smtp = await checkSmtpConnection();
  if (smtp.ok) {
    console.log("  [OK]     SMTP connected");
  } else {
    console.log("  [FAILED] SMTP FAILED —", smtp.error);
  }

  console.log("  [SERVER] Running on PORT", env.port);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (!db.ok) {
    console.error("Cannot start without database. Fix DATABASE_URL and retry.\n");
    process.exit(1);
  }
}
