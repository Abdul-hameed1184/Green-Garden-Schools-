import { request } from "@/lib/api/request";
import type { FaqItem } from "@/lib/types";

export type FaqInput = Pick<FaqItem, "question" | "answer">;

export async function fetchFaqs(): Promise<FaqItem[]> {
  return (await request<{ items: FaqItem[] }>("/api/faqs")).items;
}

export async function createFaq(input: FaqInput) {
  return (await request<{ faq: FaqItem }>("/api/faqs", { method: "POST", body: input })).faq;
}

export async function updateFaq(id: string, input: Partial<FaqInput>) {
  return (await request<{ faq: FaqItem }>(`/api/faqs/${id}`, { method: "PATCH", body: input })).faq;
}

export async function deleteFaq(id: string) {
  await request(`/api/faqs/${id}`, { method: "DELETE" });
}

export async function reorderFaqs(ids: string[]) {
  return (await request<{ items: FaqItem[] }>("/api/faqs", { method: "PUT", body: { ids } })).items;
}
