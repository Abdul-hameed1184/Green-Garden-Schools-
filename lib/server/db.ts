import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

declare global {
  var __ggsPrisma: PrismaClient | undefined;
}

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set.");
  const adapter = new PrismaPg({
    connectionString,
    max: Number(process.env.DATABASE_POOL_MAX) || 10,
    idleTimeoutMillis: 30_000,
  });
  // Query errors aren't logged here: handler() maps expected ones (e.g. not found)
  // to 4xx responses and logs the unexpected ones itself.
  return new PrismaClient({ adapter, log: ["warn"] });
}

// One client (and one connection pool) per process, reused across dev hot reloads.
export const db = globalThis.__ggsPrisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalThis.__ggsPrisma = db;
