import { NextResponse } from "next/server";
import { deleteFaq, updateFaq } from "@/lib/server/data/faqs";
import { handler } from "@/lib/server/http";
import { error, readJson, requireAdmin, str } from "@/lib/server/validate";

type Ctx = RouteContext<"/api/faqs/[id]">;

export const PATCH = handler(async (request, { params }: Ctx) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [{ id }, body] = await Promise.all([params, readJson(request)]);
  const question = str(body?.question, 240);
  const answer = str(body?.answer, 2000);
  if (question === "" || answer === "") return error("Question and answer can't be empty.", 400);

  const faq = await updateFaq(id, {
    ...(question && { question }),
    ...(answer && { answer }),
  });
  return NextResponse.json({ faq });
});

export const DELETE = handler(async (_request, { params }: Ctx) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!(await deleteFaq((await params).id))) return error("Not found.", 404);
  return NextResponse.json({ ok: true });
});
