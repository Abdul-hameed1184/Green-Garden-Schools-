// Session JWTs (HS256). Runtime-agnostic: used by proxy.ts and the server auth module.
import { jwtVerify, SignJWT } from "jose";
import { SESSION_TTL_SECONDS } from "@/lib/auth-constants";

const ISSUER = "greengarden";
const AUDIENCE = "greengarden-admin";

export interface SessionClaims {
  sub: string;
  username: string;
}

let key: Uint8Array | undefined;

function secretKey() {
  if (key) return key;
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set to a random string of at least 32 characters.");
  }
  return (key = new TextEncoder().encode(secret));
}

export function signSession({ sub, username }: SessionClaims) {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

/** The token's claims, or null when it is missing, forged, expired or malformed. */
export async function verifySession(token: string | undefined): Promise<SessionClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (typeof payload.sub !== "string" || typeof payload.username !== "string") return null;
    return { sub: payload.sub, username: payload.username };
  } catch {
    return null;
  }
}
