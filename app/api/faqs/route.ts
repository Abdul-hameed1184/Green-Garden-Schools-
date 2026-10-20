import { NextResponse } from "next/server";
import { createFaq, listFaqs, reorderFaqs } from "@/lib/server/data/faqs";
import { handler } from "@/lib/server/http";
import { error, readJson, requireAdmin, str } from "@/lib/server/validate";

/** Public: FAQs in display order. */
export const GET = handler(async () => {
  return NextResponse.json({ items: await listFaqs() });
});

/** Admin: add a FAQ to the end of the list. */
export const POST = handler(async (request) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await readJson(request);
  const question = str(body?.question, 240);
  const answer = str(body?.answer, 2000);
  if (!question || !answer) return error("Question and answer are required.", 400);

  return NextResponse.json({ faq: await createFaq(question, answer) }, { status: 201 });
});

/** Admin: reorder. Body `{ ids: string[] }` must contain every FAQ id exactly once. */
export const PUT = handler(async (request) => {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await readJson(request);
  const ids = Array.isArray(body?.ids) ? (body.ids as unknown[]) : null;
  const wellFormed =
    ids && ids.every((id) => typeof id === "string") && new Set(ids).size === ids.length;
  const items = wellFormed ? await reorderFaqs(ids as string[]) : null;
  if (!items) return error("Body must be { ids } listing every FAQ id once.", 400);

  return NextResponse.json({ items });
});
