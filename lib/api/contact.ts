import { request } from "@/lib/api/request";
import type { ContactMessage, InboxStatus } from "@/lib/types";

export interface ContactInput {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  return (await request<{ items: ContactMessage[] }>("/api/contact")).items;
}

export async function submitContactMessage(input: ContactInput) {
  return request<{ message: ContactMessage }>("/api/contact", { method: "POST", body: input });
}

export async function updateMessageStatus(id: string, status: InboxStatus) {
  return request<{ message: ContactMessage }>(`/api/contact/${id}`, {
    method: "PATCH",
    body: { status },
  });
}

export async function deleteMessage(id: string) {
  await request(`/api/contact/${id}`, { method: "DELETE" });
}
