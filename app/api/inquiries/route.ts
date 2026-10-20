import { NextResponse } from "next/server";
import { createInquiry, listInquiries } from "@/lib/server/data/inbox";
import { handler } from "@/lib/server/http";
import { error, isEmail, readJson, requireAdmin, str } from "@/lib/server/validate";

export const GET = handler(async () => {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ items: await listInquiries() });
});

export const POST = handler(async (request) => {
  const body = await readJson(request);
  const firstName = str(body?.firstName, 80);
  const lastName = str(body?.lastName, 80);
  const email = str(body?.email, 160);

  if (!firstName || !lastName || !email) {
    return error("First name, last name, and email are required.", 400);
  }
  if (!isEmail(email)) return error("Please enter a valid email address.", 400);

  const inquiry = await createInquiry({
    firstName,
    lastName,
    email,
    phone: str(body?.phone, 40) ?? "",
    gradeLevel: str(body?.gradeLevel, 80) ?? "",
    message: str(body?.message, 2000) ?? "",
  });
  return NextResponse.json({ inquiry }, { status: 201 });
});
