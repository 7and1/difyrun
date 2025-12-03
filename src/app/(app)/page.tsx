import { Suspense } from 'react';
import { Hero, CategoryGrid, FeaturedWorkflows, ExpertContent } from '@/components/home';
import { getCategoryStats, getFeaturedWorkflows, getWorkflowStats } from '@/lib/db';
import { CATEGORIES } from '@/config/categories';

export const dynamic = 'force-dynamic';

async function getHomePageData() {
  // Get category counts
  const categoryCountMap = await getCategoryStats();

  const categories = CATEGORIES.map((cat) => ({
    ...cat,
    workflowCount: categoryCountMap.get(cat.id) || 0,
  }));

  // Get featured workflows (most popular)
  const featuredWorkflows = await getFeaturedWorkflows(6);

  // Get total counts
  const stats = await getWorkflowStats();

  return {
    categories,
    featuredWorkflows,
    totalWorkflows: stats.total,
    totalDownloads: stats.totalDownloads,
  };
}

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <>
      <Hero
        totalWorkflows={data.totalWorkflows}
        totalDownloads={data.totalDownloads}
      />

      <CategoryGrid categories={data.categories} />

      <Suspense fallback={<div className="py-20 text-center">Loading workflows...</div>}>
        <FeaturedWorkflows workflows={data.featuredWorkflows} />
      </Suspense>

      {/* E-E-A-T Expert Content Section */}
      <ExpertContent />

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'DifyRun',
            description: 'Free Dify AI Workflow Templates & MCP Server Library',
            url: 'https://difyrun.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://difyrun.com/explore?q={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
    </>
  );
}
