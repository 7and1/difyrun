import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Health check endpoint
 * Used by Docker HEALTHCHECK and load balancers
 */
export async function GET() {
  const dbStatus: { ok: boolean; latencyMs: number | null; error?: string } = {
    ok: false,
    latencyMs: null,
  };

  const started = Date.now();

  try {
    const db = getDB();
    await db.prepare("SELECT 1").first();
    dbStatus.ok = true;
    dbStatus.latencyMs = Date.now() - started;
  } catch (error) {
    dbStatus.error =
      error instanceof Error ? error.message : "Unknown DB error";
  }

  const healthy = dbStatus.ok;

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      db: dbStatus,
    },
    {
      status: healthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
