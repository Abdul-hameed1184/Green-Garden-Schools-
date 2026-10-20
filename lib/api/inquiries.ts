import { request } from "@/lib/api/request";
import type { AdmissionsInquiry, InboxStatus } from "@/lib/types";

export interface InquiryInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gradeLevel: string;
  message: string;
}

export async function fetchInquiries(): Promise<AdmissionsInquiry[]> {
  return (await request<{ items: AdmissionsInquiry[] }>("/api/inquiries")).items;
}

export async function submitInquiry(input: InquiryInput) {
  return request<{ inquiry: AdmissionsInquiry }>("/api/inquiries", { method: "POST", body: input });
}

export async function updateInquiryStatus(id: string, status: InboxStatus) {
  return request<{ inquiry: AdmissionsInquiry }>(`/api/inquiries/${id}`, {
    method: "PATCH",
    body: { status },
  });
}

export async function deleteInquiry(id: string) {
  await request(`/api/inquiries/${id}`, { method: "DELETE" });
}
