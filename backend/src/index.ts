import { validateEnv, env } from "./config/env";

// Call validateEnv() first — before anything else
validateEnv();

import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { runStartupChecks } from "./config/startup";
import authRoutes from "./modules/auth/auth.routes";
import clientsRoutes from "./modules/clients/clients.routes";
import plansRoutes from "./modules/plans/plans.routes";
import invoicesRoutes from "./modules/invoices/invoices.routes";
import { consentPublicRoutes, consentAdminRoutes } from "./modules/consent/consent.routes";
import { processDataDeletion } from "./modules/consent/consent.service";
import { checkAndExpireSubscriptions } from "./modules/clients/clients.service";
import leadsRoutes from "./modules/leads/leads.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Security headers
app.use(helmet());

// CORS configuration (tightened)
const isProd = env.nodeEnv === "production" || process.env.NODE_ENV === "production";
const allowedOrigins = isProd
  ? [env.frontendUrl]
  : ["http://localhost:3000", "http://localhost:3001", "http://localhost:4000", env.frontendUrl];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!isProd && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Request logging (morgan)
if (isProd) {
  app.use(morgan("combined"));
} else if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Body parsing with 10kb limit
app.use(express.json({ limit: "10kb" }));

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Public routes
app.use("/api/consent", consentPublicRoutes);
app.use("/api/leads", leadsRoutes);

// Admin auth and management routes
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin/clients", clientsRoutes);
app.use("/api/admin/plans", plansRoutes);
app.use("/api/admin/invoices", invoicesRoutes);
app.use("/api/admin/consent", consentAdminRoutes);

// Global centralized error handler
app.use(errorHandler);

export { app };

async function startServer() {
  await runStartupChecks();

  try {
    const { expiredCount } = await checkAndExpireSubscriptions();
    console.log(`[CRON] Checked subscription expiry on startup — ${expiredCount} expired`);
  } catch (err) {
    console.error("[CRON] Startup subscription expiry check error:", err);
  }

  app.listen(env.port, () => {
    console.log(`  KnowBridge backend ready at http://localhost:${env.port}\n`);

    // Initial run on startup
    processDataDeletion()
      .then((count) => {
        if (count > 0) console.log(`[DPDP] Startup check: Deleted data for ${count} clients`);
      })
      .catch((err) => console.error("[DPDP] Startup deletion check error:", err));

    // Run every 24 hours
    setInterval(async () => {
      try {
        const count = await processDataDeletion();
        if (count > 0) console.log(`[DPDP] Deleted data for ${count} clients`);
      } catch (err) {
        console.error("[DPDP] Scheduled deletion error:", err);
      }
    }, 24 * 60 * 60 * 1000);
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer().catch((err) => {
    console.error("Fatal startup error:", err);
    process.exit(1);
  });
}
