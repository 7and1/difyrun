// Download API endpoint - returns DSL file and tracks downloads

import { NextRequest, NextResponse } from "next/server";
import {
  getWorkflowBySlug,
  incrementDownloadCount,
  insertWorkflowEvent,
} from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug")?.trim();

    if (!slug) {
      return NextResponse.json(
        { error: "Missing slug parameter" },
        { status: 400 },
      );
    }

    // Fetch workflow
    const workflow = await getWorkflowBySlug(slug);

    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 },
      );
    }

    // Increment download count (non-blocking)
    incrementDownloadCount(workflow.id).catch(() => {});

    // Log download event (non-blocking)
    insertWorkflowEvent(workflow.id, "download", {
      user_agent: request.headers.get("user-agent") || null,
      referer: request.headers.get("referer") || null,
    }).catch(() => {});

    // Clean filename for Content-Disposition
    const filename = `${workflow.slug}.yml`;

    // Return YAML file
    return new NextResponse(workflow.dsl_content, {
      status: 200,
      headers: {
        "Content-Type": "application/x-yaml",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      {
        error: "Download failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
