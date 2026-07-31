import { ApiError } from "./errorHandler.js";

/**
 * Validates req[source] (default "body") against a zod schema. On success,
 * req[source] is replaced with the parsed/coerced data (so defaults and type
 * coercion — e.g. "2" -> 2 for a query param — flow through to the controller).
 * On failure, throws a 400 with per-field details instead of a bare boolean.
 */
export function validate(schema, source = "body") {
  return (req, res, next) => {
    let result = schema.safeParse(req[source]);
    if (!result.success) {
      let details = result.error.issues.map((issue) => ({
        field: issue.path.length ? issue.path.join(".") : source,
        message: issue.message,
      }));
      return next(new ApiError(400, "Validation failed", details));
    }
    req[source] = result.data;
    next();
  };
}
