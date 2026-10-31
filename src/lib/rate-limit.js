import { ApiError } from "@/lib/api";

const buckets = new Map();
const WINDOW_MS = 60_000;

export function enforceRateLimit(request, key, limit) {
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const bucketKey = `${key}:${address}`;
  const now = Date.now();
  const bucket = buckets.get(bucketKey);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(bucketKey, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  if (bucket.count >= limit) {
    throw new ApiError(429, "Too many requests. Please try again later.", "RATE_LIMITED");
  }
  bucket.count += 1;
}
