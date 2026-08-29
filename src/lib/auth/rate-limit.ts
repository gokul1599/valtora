import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./session";

/**
 * Minimal in-memory rate limiting for API routes.
 * Production deployments should swap this for an edge/Redis rate limiter.
 */
const windowMs = 60_000;
const limit = parseInt(process.env.RATE_LIMIT ?? "60", 10);
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  return true;
}

export async function requireAuthApi(
  req: NextRequest
): Promise<{ session: Awaited<ReturnType<typeof getSession>>; error?: NextResponse }> {
  const session = await getSession();
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session };
}

export function rateLimitedResponse(): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Please slow down." },
    { status: 429 }
  );
}