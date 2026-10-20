import "server-only";
import { revalidateTag, unstable_cache } from "next/cache";
import { db } from "@/lib/server/db";
import { newId } from "@/lib/server/ids";
import type { FaqItem } from "@/lib/types";

export const FAQS_TAG = "faqs";

const select = { id: true, question: true, answer: true } as const;
const order = [{ position: "asc" }, { id: "asc" }] as const;

/** Public list in display order, cached until an FAQ write. */
export const listFaqs = unstable_cache(
  (): Promise<FaqItem[]> => db.faq.findMany({ select, orderBy: [...order] }),
  ["faqs:list"],
  { tags: [FAQS_TAG] }
);

const invalidate = () => revalidateTag(FAQS_TAG, { expire: 0 });

/** Appends to the end. Serializable so two concurrent adds can't take the same position. */
export async function createFaq(question: string, answer: string) {
  const faq = await db.$transaction(
    async (tx) => {
      const { _max } = await tx.faq.aggregate({ _max: { position: true } });
      return tx.faq.create({
        data: { id: newId("faq"), question, answer, position: (_max.position ?? -1) + 1 },
        select,
      });
    },
    { isolationLevel: "Serializable" }
  );
  invalidate();
  return faq;
}

/** Throws Prisma P2025 (→ 404) when the id doesn't exist. */
export async function updateFaq(id: string, data: { question?: string; answer?: string }) {
  const faq = await db.faq.update({ where: { id }, data, select });
  invalidate();
  return faq;
}

export async function deleteFaq(id: string) {
  const { count } = await db.faq.deleteMany({ where: { id } });
  if (count) invalidate();
  return count > 0;
}

/**
 * Sets the order from `ids`, which must list every FAQ exactly once.
 * Returns null when `ids` doesn't match the current FAQs.
 */
export async function reorderFaqs(ids: string[]) {
  const items = await db.$transaction(
    async (tx) => {
      const current = await tx.faq.findMany({ select: { id: true } });
      const known = new Set(current.map((f) => f.id));
      if (ids.length !== known.size || !ids.every((id) => known.has(id))) return null;

      await Promise.all(
        ids.map((id, position) => tx.faq.update({ where: { id }, data: { position }, select: { id: true } }))
      );
      return tx.faq.findMany({ select, orderBy: [...order] });
    },
    { isolationLevel: "Serializable" }
  );
  if (items) invalidate();
  return items;
}
