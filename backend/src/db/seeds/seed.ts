import { pool } from "../../config/db";
import { adminSeed } from "./adminSeed";
import { planSeed } from "./planSeed";
import { clientSeed } from "./clientSeed";

async function runMasterSeed() {
  console.log("Starting master database seed...");
  try {
    await adminSeed();
    await planSeed();
    await clientSeed();
    console.log("Master seed completed successfully.");
  } catch (error) {
    console.error("Master seed failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

if (require.main === module || !module.parent) {
  runMasterSeed();
}
