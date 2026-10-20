import { NextResponse } from "next/server";
import { deleteMessage, setMessageStatus } from "@/lib/server/data/inbox";
import { handler } from "@/lib/server/http";
import { error, isInboxStatus, readJson, requireAdmin } from "@/lib/server/validate";

type Ctx = RouteContext<"/api/contact/[id]">;

export const PATCH = handler(async (request, { params }: Ctx) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [{ id }, body] = await Promise.all([params, readJson(request)]);
  if (!isInboxStatus(body?.status)) {
    return error('Status must be one of "new", "read" or "handled".', 400);
  }
  return NextResponse.json({ message: await setMessageStatus(id, body.status) });
});

export const DELETE = handler(async (_request, { params }: Ctx) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!(await deleteMessage((await params).id))) return error("Not found.", 404);
  return NextResponse.json({ ok: true });
});
