import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { validateEnv } from "./config/validateEnv";
import { leadsRouter } from "./routes/leads";
import { adminRouter } from "./routes/admin";

const env = validateEnv();
const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [env.FRONTEND_URL, "http://localhost:3000", "http://localhost:3005"],
    credentials: true,
  })
);

// Body parsing with 10kb limit to prevent payload flooding
app.use(express.json({ limit: "10kb" }));

// Health Check Endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Route Mounting
app.use("/api/leads", leadsRouter);
app.use("/api/admin", adminRouter);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("[Unhandled Server Error]:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const PORT = parseInt(env.PORT, 10) || 4000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(
      `[KnowBridge Marketing Backend] Server running on http://localhost:${PORT}`
    );
  });
}

export default app;
