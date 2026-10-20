import { NextResponse } from "next/server";
import { createSession, verifyAdmin } from "@/lib/auth";
import { handler } from "@/lib/server/http";
import { clientIp, rateLimit, resetRateLimit } from "@/lib/server/rate-limit";
import { error, readJson, str } from "@/lib/server/validate";

const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

export const POST = handler(async (request) => {
  const body = await readJson(request);
  const username = str(body?.username, 80) ?? "";
  const keyphrase = typeof body?.keyphrase === "string" ? body.keyphrase.slice(0, 512) : "";

  const limitKey = `login:${clientIp(request)}:${username.toLowerCase()}`;
  if (!rateLimit(limitKey, MAX_ATTEMPTS, WINDOW_MS)) {
    return error("Too many sign-in attempts. Please wait a few minutes and try again.", 429);
  }

  const admin = username && keyphrase ? await verifyAdmin(username, keyphrase) : null;
  if (!admin) return error("Invalid username or keyphrase.", 401);

  resetRateLimit(limitKey);
  await createSession(admin);
  return NextResponse.json({ username: admin.username });
});
