import { v4 as uuidv4 } from "uuid";

/** Short, prefixed ids so payloads stay readable, e.g. "att_9f2c3b". */
export function generateId(prefix = "id") {
  return `${prefix}_${uuidv4().split("-")[0]}`;
}
