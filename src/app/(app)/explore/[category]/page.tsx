import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getWorkflows, getPopularTags } from '@/lib/db';
import { WorkflowGrid, SearchBar, FilterSidebar, SortDropdown, Pagination, CategoryContent } from '@/components/workflow';
import { CATEGORIES, getCategoryById } from '@/config/categories';

interface SearchParams {
  q?: string;
  tag?: string | string[];
  sort?: string;
  page?: string;
}

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<SearchParams>;
}

// Note: generateStaticParams removed for Edge runtime compatibility
// Categories are loaded dynamically from config

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = CATEGORIES.find((c) => c.slug === categorySlug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} Workflows - Free Dify DSL Templates | DifyRun`,
    description: `Download free ${category.name.toLowerCase()} workflow templates for Dify AI. ${category.description}. Compatible with Dify v1.6+.`,
    openGraph: {
      title: `${category.name} - Dify Workflow Templates`,
      description: category.description,
    },
  };
}

export const dynamic = 'force-dynamic';

async function getCategoryWorkflows(
  categorySlug: string,
  searchParams: SearchParams
) {
  const category = getCategoryById(categorySlug);
  if (!category) return null;

  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const limit = 18;
  const offset = (page - 1) * limit;

  const tags = Array.isArray(searchParams.tag) ? searchParams.tag : searchParams.tag ? [searchParams.tag] : [];

  // Get workflows
  const { workflows, total } = await getWorkflows({
    categoryId: categorySlug,
    search: searchParams.q,
    tags: tags.length > 0 ? tags : undefined,
    sort: (searchParams.sort as any) || 'popular',
    limit,
    offset,
  });

  // Get popular tags for this category
  const popularTags = await getPopularTags(categorySlug, 20);

  return {
    category,
    workflows,
    total,
    page,
    limit,
    popularTags,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const data = await getCategoryWorkflows(category, resolvedSearchParams);

  if (!data) {
    notFound();
  }

  const totalPages = Math.ceil(data.total / data.limit);
  const tags = Array.isArray(resolvedSearchParams.tag) ? resolvedSearchParams.tag : resolvedSearchParams.tag ? [resolvedSearchParams.tag] : [];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{data.category.name} Workflows</h1>
        <p className="text-muted-foreground max-w-2xl">
          {data.category.description}. Browse {data.total} templates in this category.
        </p>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Suspense fallback={<div className="h-10 bg-muted animate-pulse rounded-md flex-1" />}>
          <SearchBar className="flex-1" placeholder={`Search ${data.category.name.toLowerCase()} workflows...`} />
        </Suspense>
        <SortDropdown currentSort={resolvedSearchParams.sort || 'popular'} />
      </div>

      {/* Main content with sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <Suspense fallback={<div className="w-64 h-96 bg-muted animate-pulse rounded-md" />}>
          <FilterSidebar
            selectedCategory={category}
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
                ? `No ${data.category.name.toLowerCase()} workflows found for "${resolvedSearchParams.q}".`
                : `No ${data.category.name.toLowerCase()} workflows found.`
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

      {/* E-E-A-T Category-Specific Content */}
      <CategoryContent categoryId={category} categoryName={data.category.name} />

      {/* JSON-LD CollectionPage structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${data.category.name} Dify Workflows`,
            description: data.category.description,
            url: `https://difyrun.com/explore/${category}`,
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
