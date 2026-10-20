import "server-only";
import type { NextRequest } from "next/server";
import { error } from "@/lib/server/validate";

/** Throw from anywhere in a handler to return `{ message }` with this status. */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

function isPrismaNotFound(err: unknown) {
  return typeof err === "object" && err !== null && (err as { code?: unknown }).code === "P2025";
}

/**
 * Wraps a route handler so every failure still honours the `{ message }` error
 * contract: HttpError → its status, Prisma "record not found" → 404, anything else → 500.
 */
export function handler<Ctx>(fn: (request: NextRequest, context: Ctx) => Promise<Response>) {
  return async (request: NextRequest, context: Ctx): Promise<Response> => {
    try {
      return await fn(request, context);
    } catch (err) {
      if (err instanceof HttpError) return error(err.message, err.status);
      if (isPrismaNotFound(err)) return error("Not found.", 404);
      console.error(`[api] ${request.method} ${request.nextUrl.pathname}`, err);
      return error("Something went wrong. Please try again.", 500);
    }
  };
}
