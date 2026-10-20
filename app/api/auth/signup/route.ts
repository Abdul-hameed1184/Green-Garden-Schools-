import { NextResponse } from "next/server";
import { createSession, getSession } from "@/lib/auth";
import { createAdmin, hasAnyAdmin } from "@/lib/server/data/admins";
import { handler } from "@/lib/server/http";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";
import { error, readJson } from "@/lib/server/validate";

const USERNAME = /^[a-zA-Z0-9_.-]{3,80}$/;
const MIN_KEYPHRASE = 12;
const MAX_KEYPHRASE = 512;

/**
 * Create an admin account. Allowed for a signed-in admin (adds a colleague), or
 * for anyone while no admin exists yet (first-run setup, which also signs them in).
 */
export const POST = handler(async (request) => {
  if (!rateLimit(`signup:${clientIp(request)}`, 10, 15 * 60 * 1000)) {
    return error("Too many sign-up attempts. Please wait a few minutes and try again.", 429);
  }

  const session = await getSession();
  const bootstrap = !session;
  if (bootstrap && (await hasAnyAdmin())) return error("Unauthorized.", 401);

  const body = await readJson(request);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const keyphrase = typeof body?.keyphrase === "string" ? body.keyphrase : "";

  if (!USERNAME.test(username)) {
    return error("Username must be 3–80 characters: letters, numbers, dots, dashes or underscores.", 400);
  }
  if (keyphrase.length < MIN_KEYPHRASE || keyphrase.length > MAX_KEYPHRASE) {
    return error(`Keyphrase must be between ${MIN_KEYPHRASE} and ${MAX_KEYPHRASE} characters.`, 400);
  }

  const admin = await createAdmin(username, keyphrase, bootstrap);
  if (bootstrap) await createSession(admin);
  return NextResponse.json({ username: admin.username }, { status: 201 });
});
