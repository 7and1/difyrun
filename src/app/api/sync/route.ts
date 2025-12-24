// Sync API endpoint - triggers GitHub to D1 synchronization

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { syncAllWorkflows, syncSingleRepo } from "@/lib/github/sync";
import { getRepoSources } from "@/lib/db";

// Track failed authentication attempts
const failedAttempts = new Map<string, { count: number; resetTime: number }>();

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of failedAttempts.entries()) {
    if (now > value.resetTime) {
      failedAttempts.delete(key);
    }
  }
}, 300000); // Cleanup every 5 minutes

// Track failed attempt and check if IP is blocked
function trackFailedAttempt(ip: string): boolean {
  const now = Date.now();
  let data = failedAttempts.get(ip);

  if (!data || now > data.resetTime) {
    data = { count: 1, resetTime: now + 300000 }; // 5 minute window
    failedAttempts.set(ip, data);
  } else {
    data.count++;
  }

  if (data.count > 5) {
    console.error(`[SECURITY] Multiple failed auth attempts from ${ip}`);
    return false; // Blocked
  }

  return true;
}

// Verify authorization with timing-safe comparison
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  const token = authHeader.replace("Bearer ", "");
  const syncSecret = process.env.SYNC_SECRET;

  if (!syncSecret) {
    console.error("[SECURITY] SYNC_SECRET not configured");
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  try {
    const tokenBuffer = Buffer.from(token);
    const secretBuffer = Buffer.from(syncSecret);

    // Length check (not timing-safe but necessary)
    if (tokenBuffer.length !== secretBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(tokenBuffer, secretBuffer);
  } catch (error) {
    console.error("[SECURITY] Auth comparison error:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  // Get client IP for logging
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";

  // Verify authorization
  if (!isAuthorized(request)) {
    // Track failed attempt
    if (!trackFailedAttempt(ip)) {
      return NextResponse.json(
        {
          error:
            "Too many failed authentication attempts. Please try again later.",
        },
        { status: 429 },
      );
    }

    console.error(`[SECURITY] Unauthorized sync attempt from ${ip}`);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse request body
    let body: { repoId?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Empty body is fine - sync all repos
    }

    let result;

    if (body.repoId) {
      // Sync single repository
      console.log(`Starting sync for repository: ${body.repoId}`);
      result = await syncSingleRepo(body.repoId);
    } else {
      // Sync all repositories
      console.log("Starting sync for all repositories");
      result = await syncAllWorkflows();
    }

    console.log("Sync completed:", result);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Sync failed:", error);

    return NextResponse.json(
      {
        error: "Sync failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Get sync status (last sync info)
export async function GET(request: NextRequest) {
  // Get client IP for logging
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";

  // Verify authorization
  if (!isAuthorized(request)) {
    // Track failed attempt
    if (!trackFailedAttempt(ip)) {
      return NextResponse.json(
        {
          error:
            "Too many failed authentication attempts. Please try again later.",
        },
        { status: 429 },
      );
    }

    console.error(`[SECURITY] Unauthorized sync status request from ${ip}`);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get repo source statuses
    const sources = await getRepoSources(false);

    return NextResponse.json({
      lastSync: null, // TODO: Add sync_logs query when needed
      sources: sources.map((s) => ({
        id: s.id,
        name: s.name,
        last_synced_at: s.last_synced_at,
        last_sync_error: s.last_sync_error,
        total_workflows: s.total_workflows,
        is_active: s.is_active,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get sync status",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
