import { ApiError } from "../utils/ApiError.js";

/**
 * @param {import('zod').ZodSchema} schema - expects shape { body?, params?, query? }
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.slice(1).join(".") || issue.path.join("."),
        message: issue.message,
      }));
      return next(ApiError.badRequest("Validation failed", errors));
    }

    // Overwrite with parsed/defaulted values.
    if (result.data.body) req.body = result.data.body;
    if (result.data.query) req.query = result.data.query;
    if (result.data.params) req.params = result.data.params;

    next();
  };
}
