import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const error = result.error as ZodError;
      const errors = error.errors.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
      return;
    }

    req.body = result.data;
    next();
  };
}
