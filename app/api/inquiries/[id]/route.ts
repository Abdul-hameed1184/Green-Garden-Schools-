import { NextResponse } from "next/server";
import { deleteInquiry, setInquiryStatus } from "@/lib/server/data/inbox";
import { handler } from "@/lib/server/http";
import { error, isInboxStatus, readJson, requireAdmin } from "@/lib/server/validate";

type Ctx = RouteContext<"/api/inquiries/[id]">;

export const PATCH = handler(async (request, { params }: Ctx) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [{ id }, body] = await Promise.all([params, readJson(request)]);
  if (!isInboxStatus(body?.status)) {
    return error('Status must be one of "new", "read" or "handled".', 400);
  }
  return NextResponse.json({ inquiry: await setInquiryStatus(id, body.status) });
});

export const DELETE = handler(async (_request, { params }: Ctx) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!(await deleteInquiry((await params).id))) return error("Not found.", 404);
  return NextResponse.json({ ok: true });
});
