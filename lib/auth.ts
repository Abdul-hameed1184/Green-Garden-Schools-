import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/auth-constants";
import { signSession, verifySession } from "@/lib/jwt";
import { db } from "@/lib/server/db";
import { dummyHash, verifyPassword } from "@/lib/server/password";
import type { SessionUser } from "@/lib/types";

/** Checks credentials; returns the admin on success. Always does one scrypt so timing doesn't leak usernames. */
export async function verifyAdmin(username: string, keyphrase: string) {
  const admin = await db.admin.findUnique({
    where: { username },
    select: { id: true, username: true, passwordHash: true },
  });
  const ok = await verifyPassword(keyphrase, admin?.passwordHash ?? (await dummyHash()));
  return ok && admin ? { id: admin.id, username: admin.username } : null;
}

/** Issues a signed session JWT in an httpOnly cookie. */
export async function createSession(admin: { id: string; username: string }) {
  const token = await signSession({ sub: admin.id, username: admin.username });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Current admin from the session JWT. Stateless (no DB hit) and memoised per request. */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const claims = await verifySession(cookieStore.get(SESSION_COOKIE)?.value);
  return claims ? { username: claims.username } : null;
});
