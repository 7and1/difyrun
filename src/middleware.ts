import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limit configuration for different API endpoints
const rateLimits: Record<string, { requests: number; window: number }> = {
  "/api/download": { requests: 10, window: 60 }, // 10 req/min
  "/api/feedback": { requests: 5, window: 300 }, // 5 req/5min
  "/api/search": { requests: 30, window: 60 }, // 30 req/min
  "/api/ai/chat": { requests: 10, window: 60 }, // 10 req/min
  "/api/sync": { requests: 1, window: 300 }, // 1 req/5min
};

// In-memory rate limit tracking (note: this is per-worker in Cloudflare)
// For production, use Cloudflare KV or Durable Objects for distributed rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup old entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Cleanup every minute

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Find matching rate limit config
  const rateLimitConfig = Object.entries(rateLimits).find(([path]) =>
    pathname.startsWith(path),
  );

  if (!rateLimitConfig) {
    return NextResponse.next();
  }

  const [, { requests, window }] = rateLimitConfig;

  // Get client IP address
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";

  const key = `ratelimit:${pathname}:${ip}`;
  const now = Date.now();

  // Get or initialize rate limit data
  let rateLimitData = rateLimitStore.get(key);

  if (!rateLimitData || now > rateLimitData.resetTime) {
    // Initialize or reset the counter
    rateLimitData = {
      count: 0,
      resetTime: now + window * 1000,
    };
    rateLimitStore.set(key, rateLimitData);
  }

  // Increment counter
  rateLimitData.count++;

  // Check if rate limit exceeded
  if (rateLimitData.count > requests) {
    const retryAfter = Math.ceil((rateLimitData.resetTime - now) / 1000);

    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": requests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(rateLimitData.resetTime).toISOString(),
        },
      },
    );
  }

  // Add rate limit headers to successful responses
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", requests.toString());
  response.headers.set(
    "X-RateLimit-Remaining",
    (requests - rateLimitData.count).toString(),
  );
  response.headers.set(
    "X-RateLimit-Reset",
    new Date(rateLimitData.resetTime).toISOString(),
  );

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
