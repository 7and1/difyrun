// Search API endpoint - workflows search with filtering and pagination

import { NextRequest, NextResponse } from "next/server";
import { getWorkflows } from "@/lib/db";

export interface SearchResponse {
  workflows: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const query = searchParams.get("q")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const tags = searchParams.getAll("tag").filter(Boolean);
    const sort = searchParams.get("sort") || "popular";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "20", 10)),
    );

    const offset = (page - 1) * limit;

    // Get workflows using D1
    const { workflows, total } = await getWorkflows({
      categoryId: category || undefined,
      search: query || undefined,
      tags: tags.length > 0 ? tags : undefined,
      sort: sort as any,
      limit,
      offset,
    });

    const totalPages = Math.ceil(total / limit);

    const response: SearchResponse = {
      workflows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      {
        error: "Search failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
