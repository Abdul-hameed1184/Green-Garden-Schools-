// Shared by proxy.ts (edge-safe, no Node APIs) and the server auth module.
// Admin accounts live in the database; see prisma/seed.ts for creating one.
export const SESSION_COOKIE = "ggs_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8;
