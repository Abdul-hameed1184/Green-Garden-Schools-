import { NextResponse } from "next/server";
import { createMessage, listMessages } from "@/lib/server/data/inbox";
import { handler } from "@/lib/server/http";
import { error, isEmail, readJson, requireAdmin, str } from "@/lib/server/validate";

export const GET = handler(async () => {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ items: await listMessages() });
});

export const POST = handler(async (request) => {
  const body = await readJson(request);
  const fullName = str(body?.fullName, 120);
  const email = str(body?.email, 160);
  const message = str(body?.message, 4000);

  if (!fullName || !email || !message) {
    return error("Full name, email, and message are required.", 400);
  }
  if (!isEmail(email)) return error("Please enter a valid email address.", 400);

  const entry = await createMessage({
    fullName,
    email,
    phone: str(body?.phone, 40) ?? "",
    subject: str(body?.subject, 120) ?? "",
    message,
  });
  return NextResponse.json({ message: entry }, { status: 201 });
});
