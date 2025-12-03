'use client';

import { useCallback, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Filter, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CATEGORIES, getCategoryEmoji } from '@/config/categories';

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

  // Handle tag toggle
  const toggleTag = useCallback(
    (tag: string) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());

        // Get current tags
        const currentTags = params.getAll('tag');

        // Toggle tag
        if (currentTags.includes(tag)) {
          // Remove tag
          params.delete('tag');
          currentTags
            .filter((t) => t !== tag)
            .forEach((t) => params.append('tag', t));
        } else {
          // Add tag
          params.append('tag', tag);
        }

        // Reset page
        params.delete('page');

        router.push(`/explore?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    startTransition(() => {
      const params = new URLSearchParams();
      const q = searchParams.get('q');
      if (q) params.set('q', q);
      router.push(`/explore?${params.toString()}`);
    });
  }, [router, searchParams]);

  const hasFilters = selectedCategory || selectedTags.length > 0;

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
              href="/explore"
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors',
                !selectedCategory
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              <span className="flex items-center gap-2">
                <span>📁</span>
                All Categories
              </span>
              {!selectedCategory && <Check className="h-4 w-4" />}
            </Link>

            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/explore/${category.slug}`}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors',
                  selectedCategory === category.slug
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="flex items-center gap-2">
                  <span>{getCategoryEmoji(category.id)}</span>
                  {category.name}
                </span>
                {selectedCategory === category.slug && (
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
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-colors',
                      selectedTags.includes(tag)
                        ? 'bg-primary hover:bg-primary/80'
                        : 'hover:bg-muted'
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
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1">
                  {CATEGORIES.find((c) => c.slug === selectedCategory)?.name}
                  <Link
                    href={`/explore${searchParams.toString() ? `?${searchParams.toString().replace(/category=[^&]*&?/, '')}` : ''}`}
                  >
                    <X className="h-3 w-3 cursor-pointer" />
                  </Link>
                </Badge>
              )}
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button onClick={() => toggleTag(tag)} className="focus:outline-none">
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
