import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";

/**
 * Middleware factory that validates req.body against a given Zod schema.
 * On failure it sends a 422 with structured field-level error messages.
 */
export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const zodErr = result.error as ZodError;
      const errors = zodErr.issues.map((issue) => ({
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

    // Replace req.body with the parsed (trimmed/transformed) data
    req.body = result.data;
    next();
  };
