import { randomBytes } from "node:crypto";

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

/** Prefixed random id, e.g. `alb-k3j9x0q2m1zp` (12 chars, ~62 bits of entropy). */
export function newId(prefix: string, length = 12) {
  const bytes = randomBytes(length);
  let out = "";
  // 252 = 7 * 36; rejecting bytes above it keeps the distribution uniform.
  for (let i = 0; out.length < length; i++) {
    if (i >= bytes.length) return newId(prefix, length);
    if (bytes[i] < 252) out += ALPHABET[bytes[i] % 36];
  }
  return `${prefix}-${out}`;
}
