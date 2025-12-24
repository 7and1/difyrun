// Revalidate API endpoint - triggers on-demand ISR revalidation

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

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

    if (tokenBuffer.length !== secretBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(tokenBuffer, secretBuffer);
  } catch (error) {
    console.error("[SECURITY] Auth comparison error:", error);
    return false;
  }
}

interface RevalidateRequest {
  path?: string;
  tag?: string;
  type?: "page" | "layout";
}

export async function POST(request: NextRequest) {
  // Verify authorization
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse request body
    let body: RevalidateRequest = {};
    try {
      body = await request.json();
    } catch {
      // Empty body - revalidate all main paths
    }

    const results: { path?: string; tag?: string; success: boolean }[] = [];

    // Revalidate by tag
    if (body.tag) {
      try {
        revalidateTag(body.tag);
        results.push({ tag: body.tag, success: true });
        console.log(`Revalidated tag: ${body.tag}`);
      } catch (error) {
        console.error(`Failed to revalidate tag ${body.tag}:`, error);
        results.push({ tag: body.tag, success: false });
      }
    }

    // Revalidate specific path
    if (body.path) {
      try {
        revalidatePath(body.path, body.type || "page");
        results.push({ path: body.path, success: true });
        console.log(`Revalidated path: ${body.path}`);
      } catch (error) {
        console.error(`Failed to revalidate path ${body.path}:`, error);
        results.push({ path: body.path, success: false });
      }
    }

    // If no specific path or tag, revalidate main pages
    if (!body.path && !body.tag) {
      const mainPaths = [
        "/",
        "/explore",
        "/explore/mcp",
        "/explore/agents",
        "/explore/rag",
        "/explore/chatbots",
        "/explore/content",
        "/explore/translation",
        "/explore/data",
        "/explore/automation",
        "/explore/development",
        "/sources",
      ];

      for (const path of mainPaths) {
        try {
          revalidatePath(path, "page");
          results.push({ path, success: true });
        } catch (error) {
          console.error(`Failed to revalidate ${path}:`, error);
          results.push({ path, success: false });
        }
      }

      // Also revalidate common tags
      try {
        revalidateTag("workflows");
        results.push({ tag: "workflows", success: true });
      } catch (error) {
        results.push({ tag: "workflows", success: false });
      }

      try {
        revalidateTag("categories");
        results.push({ tag: "categories", success: true });
      } catch (error) {
        results.push({ tag: "categories", success: false });
      }
    }

    const allSuccess = results.every((r) => r.success);

    return NextResponse.json(
      {
        revalidated: allSuccess,
        results,
        timestamp: new Date().toISOString(),
      },
      { status: allSuccess ? 200 : 207 }, // 207 Multi-Status if partial success
    );
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      {
        error: "Revalidation failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
