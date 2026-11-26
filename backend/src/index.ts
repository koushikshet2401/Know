import { validateEnv, env } from "./config/env";

// Call validateEnv() first — before anything else
validateEnv();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { runStartupChecks } from "./config/startup";

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

// Body parsing with 10kb limit
app.use(express.json({ limit: "10kb" }));

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Global error handler middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Global Error Handler]:", err);
  res.status(500).json({
    status: "error",
    message: err?.message || "Internal server error",
  });
});

export { app };

async function startServer() {
  await runStartupChecks();

  app.listen(env.port, () => {
    console.log(`  KnowBridge backend ready at http://localhost:${env.port}\n`);
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer().catch((err) => {
    console.error("Fatal startup error:", err);
    process.exit(1);
  });
}
