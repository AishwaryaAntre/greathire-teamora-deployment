export function getClientOrigins() {
  let origins = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  if (origins.length > 0) return [...new Set(origins)];

  if (process.env.NODE_ENV === "production") {
    throw new Error("CLIENT_ORIGIN must be set in production (no wildcard CORS allowed).");
  }

  return ["http://localhost:5173"];
}

export function getPrimaryClientOrigin() {
  return getClientOrigins()[0];
}
