import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import {
  Hero,
  CategoryGrid,
  FeaturedWorkflows,
  ExpertContent,
} from "@/components/home";
import {
  getCategoryStats,
  getFeaturedWorkflows,
  getWorkflowStats,
} from "@/lib/db";
import { CATEGORIES } from "@/config/categories";

const getHomePageData = unstable_cache(
  async () => {
    const [categoryCountMap, featuredWorkflows, stats] = await Promise.all([
      getCategoryStats(),
      getFeaturedWorkflows(6),
      getWorkflowStats(),
    ]);

    const categoryCountRecord: Record<string, number> = {};
    for (const [key, value] of categoryCountMap.entries()) {
      categoryCountRecord[key] = value;
    }

    const categories = CATEGORIES.map((cat) => ({
      ...cat,
      workflowCount: categoryCountRecord[cat.id] || 0,
    }));

    return {
      categories,
      featuredWorkflows,
      totalWorkflows: stats.total,
      totalDownloads: stats.totalDownloads,
    };
  },
  ["home-page-data"],
  { revalidate: 300 },
);

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <>
      <Hero
        totalWorkflows={data.totalWorkflows}
        totalDownloads={data.totalDownloads}
      />

      <CategoryGrid categories={data.categories} />

      <Suspense
        fallback={<div className="py-20 text-center">Loading workflows...</div>}
      >
        <FeaturedWorkflows workflows={data.featuredWorkflows} />
      </Suspense>

      {/* E-E-A-T Expert Content Section */}
      <ExpertContent />

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "DifyRun",
            description: "Free Dify AI Workflow Templates & MCP Server Library",
            url: "https://difyrun.com",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate:
                  "https://difyrun.com/explore?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </>
  );
}
