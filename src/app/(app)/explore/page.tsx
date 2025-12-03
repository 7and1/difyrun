import { Suspense } from 'react';
import { Metadata } from 'next';
import { getWorkflows, getPopularTags } from '@/lib/db';
import { WorkflowGrid, SearchBar, FilterSidebar, SortDropdown, Pagination, ExploreContent } from '@/components/workflow';

export const metadata: Metadata = {
  title: 'Explore Dify Workflows - Free DSL Templates',
  description: 'Browse 100+ free Dify workflow templates. Filter by category, search by keywords, and download DSL files for your AI automation projects.',
};

export const dynamic = 'force-dynamic';

interface SearchParams {
  q?: string;
  category?: string;
  tag?: string | string[];
  sort?: string;
  page?: string;
}

interface ExplorePageProps {
  searchParams: Promise<SearchParams>;
}

async function getExploreData(searchParams: SearchParams) {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const limit = 18;
  const offset = (page - 1) * limit;

  const tags = Array.isArray(searchParams.tag) ? searchParams.tag : searchParams.tag ? [searchParams.tag] : [];

  // Get workflows
  const { workflows, total } = await getWorkflows({
    categoryId: searchParams.category,
    search: searchParams.q,
    tags: tags.length > 0 ? tags : undefined,
    sort: (searchParams.sort as any) || 'popular',
    limit,
    offset,
  });

  // Get popular tags for filter sidebar
  const popularTags = await getPopularTags(undefined, 20);

  return {
    workflows,
    total,
    page,
    limit,
    popularTags,
  };
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const resolvedSearchParams = await searchParams;
  const data = await getExploreData(resolvedSearchParams);
  const totalPages = Math.ceil(data.total / data.limit);

  const tags = Array.isArray(resolvedSearchParams.tag) ? resolvedSearchParams.tag : resolvedSearchParams.tag ? [resolvedSearchParams.tag] : [];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Workflows</h1>
        <p className="text-muted-foreground">
          Discover {data.total} Dify workflow templates from the community
        </p>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Suspense fallback={<div className="h-10 bg-muted animate-pulse rounded-md flex-1" />}>
          <SearchBar className="flex-1" />
        </Suspense>
        <SortDropdown currentSort={resolvedSearchParams.sort || 'popular'} />
      </div>

      {/* Main content with sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <Suspense fallback={<div className="w-64 h-96 bg-muted animate-pulse rounded-md" />}>
          <FilterSidebar
            selectedCategory={resolvedSearchParams.category}
            selectedTags={tags}
            availableTags={data.popularTags}
          />
        </Suspense>

        {/* Workflow grid */}
        <div className="flex-1">
          <WorkflowGrid
            workflows={data.workflows}
            emptyMessage={
              resolvedSearchParams.q
                ? `No workflows found for "${resolvedSearchParams.q}". Try a different search term.`
                : 'No workflows found. Try removing some filters.'
            }
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={data.page}
              totalPages={totalPages}
              totalItems={data.total}
              itemsPerPage={data.limit}
            />
          )}
        </div>
      </div>

      {/* E-E-A-T Educational Content */}
      <ExploreContent />

      {/* JSON-LD CollectionPage structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Dify Workflow Templates',
            description: 'Browse free Dify AI workflow templates. Filter by category, search by keywords, and download DSL files.',
            url: 'https://difyrun.com/explore',
            isPartOf: {
              '@type': 'WebSite',
              name: 'DifyRun',
              url: 'https://difyrun.com',
            },
            about: {
              '@type': 'SoftwareApplication',
              name: 'Dify',
              applicationCategory: 'AI Platform',
            },
            numberOfItems: data.total,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: data.total,
              itemListElement: data.workflows.slice(0, 10).map((workflow: any, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'SoftwareSourceCode',
                  name: workflow.name,
                  description: workflow.description,
                  url: `https://difyrun.com/workflow/${workflow.slug}`,
                },
              })),
            },
          }),
        }}
      />
    </div>
  );
}
