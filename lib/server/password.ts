// No "server-only" import: the seed script (run outside Next) also uses this.
import { randomBytes, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from "node:crypto";

const scrypt = (password: string, salt: Buffer, keylen: number, options: ScryptOptions) =>
  new Promise<Buffer>((resolve, reject) =>
    scryptCb(password, salt, keylen, options, (err, key) => (err ? reject(err) : resolve(key)))
  );

const N = 16384;
const r = 8;
const p = 1;
const KEYLEN = 64;

/** Hashes a password as `scrypt$N$r$p$salt$hash` (base64 parts). */
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEYLEN, { N, r, p });
  return ["scrypt", N, r, p, salt.toString("base64"), hash.toString("base64")].join("$");
}

export async function verifyPassword(password: string, stored: string) {
  const [algo, n, rr, pp, salt, hash] = stored.split("$");
  if (algo !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const actual = await scrypt(password, Buffer.from(salt, "base64"), expected.length, {
    N: Number(n),
    r: Number(rr),
    p: Number(pp),
  });
  return timingSafeEqual(actual, expected);
}

/** A valid hash of a random password, verified against when the username doesn't exist so
 * failed logins take the same time either way. */
export function dummyHash() {
  return (dummyHash_ ??= hashPassword(randomBytes(16).toString("hex")));
}
let dummyHash_: Promise<string> | undefined;
