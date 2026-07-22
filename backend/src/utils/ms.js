const UNIT_MS = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

/**
 * Parses simple duration strings like "15m", "1d", "30d", "500ms" into milliseconds.
 * Intentionally minimal - only supports the unit suffixes we actually use.
 */
export default function ms(value) {
  if (typeof value === "number") return value;

  const match = /^(\d+(?:\.\d+)?)(ms|s|m|h|d)$/.exec(String(value).trim());
  if (!match) {
    throw new Error(`Invalid duration string: "${value}"`);
  }
  const [, amount, unit] = match;
  return Number(amount) * UNIT_MS[unit];
}
