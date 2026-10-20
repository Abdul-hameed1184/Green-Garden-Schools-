import "server-only";

interface Bucket {
  count: number;
  resetAt: number;
}

declare global {
  var __ggsRateLimits: Map<string, Bucket> | undefined;
}

// In-process fixed-window limiter. Fine for a single long-lived server; move to
// Redis or Postgres if the app is ever scaled to several instances.
const buckets = (globalThis.__ggsRateLimits ??= new Map<string, Bucket>());

/** Records a hit for `key`; returns false once `limit` hits land inside `windowMs`. */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  bucket.count++;
  return bucket.count <= limit;
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
}
