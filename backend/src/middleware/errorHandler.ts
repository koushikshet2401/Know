import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { env } from "../config/env";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const errorId = crypto.randomUUID();
  const isDev = env.nodeEnv === "development" || process.env.NODE_ENV === "development";

  if (isDev) {
    console.error(`[Error Handler] [${errorId}] Stack Trace:`, err);
  } else {
    console.error(`[Error Handler] Error ID: ${errorId} - ${err?.message || "Internal server error"}`);
  }

  const statusCode = err?.status || err?.statusCode || 500;

  if (isDev) {
    res.status(statusCode).json({
      success: false,
      message: err?.message || "Internal server error",
      errorId,
    });
  } else {
    res.status(statusCode).json({
      success: false,
      message: statusCode >= 500 ? "Internal server error. Please try again later." : err?.message || "An error occurred.",
      errorId,
    });
  }
}
