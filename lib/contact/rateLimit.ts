/**
 * Simple in-memory rate limiter for contact form submissions
 */

const WINDOW_MS = 300000; // 5 minutes
const MAX_REQUESTS = 5; // 5 requests per window

type RateLimitRecord = {
  count: number;
  windowStart: number;
};

// In-memory store for rate limit tracking
const ipRecords = new Map<string, RateLimitRecord>();

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterMs: number };

/**
 * Check if an IP is allowed to make a contact request
 */
export function checkContactRateLimit(ip: string | null): RateLimitResult {
  // If no IP, allow (don't block unknown IPs)
  if (!ip) {
    return { allowed: true };
  }

  const now = Date.now();
  const record = ipRecords.get(ip);

  // No record exists - create one
  if (!record) {
    ipRecords.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }

  const timeElapsed = now - record.windowStart;

  // Window has expired - reset
  if (timeElapsed > WINDOW_MS) {
    ipRecords.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }

  // Within window - check count
  if (record.count < MAX_REQUESTS) {
    record.count++;
    return { allowed: true };
  }

  // Rate limit exceeded
  const retryAfterMs = WINDOW_MS - timeElapsed;
  return { allowed: false, retryAfterMs };
}
