import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let error = err;

  // Normalize known Mongoose/JWT errors into ApiError so responses stay consistent.
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.badRequest("Validation failed", errors);
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    error = ApiError.conflict(`${field} already in use`);
  } else if (err.name === "CastError") {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  } else if (err.name === "JsonWebTokenError") {
    error = ApiError.unauthorized("Invalid token");
  } else if (err.name === "TokenExpiredError") {
    error = ApiError.unauthorized("Token expired");
  } else if (!(err instanceof ApiError)) {
    error = ApiError.internal(env.nodeEnv === "production" ? "Something went wrong" : err.message);
  }

  if (env.nodeEnv !== "test") {
    console.error(`[error] ${req.method} ${req.originalUrl} ->`, err);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(env.nodeEnv !== "production" && { stack: err.stack }),
  });
}
