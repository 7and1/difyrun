// CSRF Protection - Origin/Referer validation for state-changing endpoints
import { NextRequest } from "next/server";

/**
 * Validate request origin to prevent CSRF attacks
 * Checks Origin header first, falls back to Referer
 */
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Allow same-origin requests
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    "http://localhost:3004",
    "http://localhost:3000",
  ].filter(Boolean) as string[];

  // Check Origin header first (more reliable for CORS)
  if (origin) {
    return allowedOrigins.includes(origin);
  }

  // Fall back to Referer header
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      return allowedOrigins.includes(refererOrigin);
    } catch {
      // Invalid referer URL
      return false;
    }
  }

  // No Origin or Referer header - reject for safety
  return false;
}
