import "server-only";
import type { ContactMessage as MessageRow, Inquiry as InquiryRow } from "@/lib/generated/prisma/client";
import { db } from "@/lib/server/db";
import { newId } from "@/lib/server/ids";
import type { AdmissionsInquiry, ContactMessage, InboxStatus } from "@/lib/types";

// Inbox data is admin-only and changes constantly, so it is never cached.

const toInquiry = (row: InquiryRow): AdmissionsInquiry => ({
  ...row,
  createdAt: row.createdAt.toISOString(),
});

const toMessage = (row: MessageRow): ContactMessage => ({
  ...row,
  createdAt: row.createdAt.toISOString(),
});

export async function listInquiries() {
  const rows = await db.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toInquiry);
}

export async function createInquiry(
  input: Omit<AdmissionsInquiry, "id" | "status" | "createdAt">
) {
  return toInquiry(await db.inquiry.create({ data: { id: newId("inq"), ...input } }));
}

/** Throws Prisma P2025 (→ 404 via handler) when the id doesn't exist. */
export async function setInquiryStatus(id: string, status: InboxStatus) {
  return toInquiry(await db.inquiry.update({ where: { id }, data: { status } }));
}

export async function deleteInquiry(id: string) {
  const { count } = await db.inquiry.deleteMany({ where: { id } });
  return count > 0;
}

export async function listMessages() {
  const rows = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toMessage);
}

export async function createMessage(input: Omit<ContactMessage, "id" | "status" | "createdAt">) {
  return toMessage(await db.contactMessage.create({ data: { id: newId("msg"), ...input } }));
}

export async function setMessageStatus(id: string, status: InboxStatus) {
  return toMessage(await db.contactMessage.update({ where: { id }, data: { status } }));
}

export async function deleteMessage(id: string) {
  const { count } = await db.contactMessage.deleteMany({ where: { id } });
  return count > 0;
}
