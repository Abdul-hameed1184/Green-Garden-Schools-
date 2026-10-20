import "server-only";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { INBOX_STATUSES, type InboxStatus } from "@/lib/types";

/** Trimmed string capped at `max` characters, or undefined when not a string. */
export function str(value: unknown, max = 5000) {
  return typeof value === "string" ? value.trim().slice(0, max) : undefined;
}

export function isEmail(value: string | undefined): value is string {
  return Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
}

export function isInboxStatus(value: unknown): value is InboxStatus {
  return INBOX_STATUSES.includes(value as InboxStatus);
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  const body = await request.json().catch(() => null);
  return body && typeof body === "object" && !Array.isArray(body)
    ? (body as Record<string, unknown>)
    : null;
}

export function error(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

/** Returns a 401 response when there is no admin session, otherwise null. */
export async function requireAdmin() {
  return (await getSession()) ? null : error("Unauthorized.", 401);
}
