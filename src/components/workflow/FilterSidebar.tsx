"use client";

import { useCallback, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Filter, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CATEGORIES, getCategoryEmoji } from "@/config/categories";

interface FilterSidebarProps {
  selectedCategory?: string;
  selectedTags?: string[];
  availableTags?: string[];
}

export function FilterSidebar({
  selectedCategory,
  selectedTags = [],
  availableTags = [],
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const queryCategory = searchParams.get("category");
  const categoryFromSegment = Boolean(selectedCategory && !queryCategory);
  const currentCategorySlug = categoryFromSegment
    ? selectedCategory
    : queryCategory || undefined;
  const categorySegment = categoryFromSegment ? selectedCategory : null;
  const activeCategoryMeta = useMemo(() => {
    if (!currentCategorySlug) return undefined;
    return CATEGORIES.find((cat) => cat.slug === currentCategorySlug);
  }, [currentCategorySlug]);

  const composeExploreUrl = useCallback(
    (params: URLSearchParams, categorySlug?: string | null) => {
      const queryString = params.toString();
      if (categorySlug) {
        return queryString
          ? `/explore/${categorySlug}?${queryString}`
          : `/explore/${categorySlug}`;
      }
      return queryString ? `/explore?${queryString}` : "/explore";
    },
    [],
  );

  const buildCategoryHref = useCallback(
    (slug?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      params.delete("category");
      return composeExploreUrl(params, slug ?? null);
    },
    [composeExploreUrl, searchParams],
  );

  // Handle tag toggle
  const toggleTag = useCallback(
    (tag: string) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());

        // Get current tags
        const currentTags = params.getAll("tag");

        // Toggle tag
        if (currentTags.includes(tag)) {
          // Remove tag
          params.delete("tag");
          currentTags
            .filter((t) => t !== tag)
            .forEach((t) => params.append("tag", t));
        } else {
          // Add tag
          params.append("tag", tag);
        }

        // Reset page
        params.delete("page");

        router.push(composeExploreUrl(params, categorySegment));
      });
    },
    [router, searchParams, composeExploreUrl, categorySegment],
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    startTransition(() => {
      const params = new URLSearchParams();
      const q = searchParams.get("q");
      if (q) params.set("q", q);
      router.push(composeExploreUrl(params, null));
    });
  }, [router, searchParams, composeExploreUrl]);

  const removeCategory = useCallback(() => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("category");
      params.delete("page");
      router.push(composeExploreUrl(params, null));
    });
  }, [router, searchParams, composeExploreUrl]);

  const hasFilters = Boolean(currentCategorySlug) || selectedTags.length > 0;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="lg:sticky lg:top-20 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Filter className="h-4 w-4" />
            Filters
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs"
            >
              Clear all
              <X className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-sm font-medium mb-3">Categories</h3>
          <div className="space-y-1">
            {/* All categories option */}
            <Link
              href={buildCategoryHref()}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                !currentCategorySlug
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="flex items-center gap-2">
                <span>📁</span>
                <span className="flex flex-col leading-tight">
                  <span>All Categories</span>
                  <span className="text-xs text-muted-foreground">
                    全部分类
                  </span>
                </span>
              </span>
              {!currentCategorySlug && <Check className="h-4 w-4" />}
            </Link>

            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={buildCategoryHref(category.slug)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                  currentCategorySlug === category.slug
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="flex items-center gap-2">
                  <span>{getCategoryEmoji(category.id)}</span>
                  <span className="flex flex-col leading-tight">
                    <span>{category.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {category.nameCn}
                    </span>
                  </span>
                </span>
                {currentCategorySlug === category.slug && (
                  <Check className="h-4 w-4" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Tags */}
        {availableTags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.slice(0, 15).map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  disabled={isPending}
                  className="focus:outline-none"
                >
                  <Badge
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-colors",
                      selectedTags.includes(tag)
                        ? "bg-primary hover:bg-primary/80"
                        : "hover:bg-muted",
                    )}
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active filters */}
        {hasFilters && (
          <div>
            <h3 className="text-sm font-medium mb-3">Active Filters</h3>
            <div className="flex flex-wrap gap-2">
              {currentCategorySlug && (
                <Badge variant="secondary" className="gap-1">
                  <span className="flex flex-col leading-tight">
                    <span>
                      {activeCategoryMeta?.name || currentCategorySlug}
                    </span>
                    {activeCategoryMeta?.nameCn && (
                      <span className="text-[10px] text-muted-foreground">
                        {activeCategoryMeta.nameCn}
                      </span>
                    )}
                  </span>
                  <button
                    onClick={removeCategory}
                    className="focus:outline-none"
                    aria-label="Remove category"
                  >
                    <X className="h-3 w-3 cursor-pointer" />
                  </button>
                </Badge>
              )}
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="focus:outline-none"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="h-3 w-3 cursor-pointer" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
