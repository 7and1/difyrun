import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getWorkflowBySlug,
  getSimilarWorkflows,
  incrementViewCount,
  insertWorkflowEvent,
} from "@/lib/db";
import { WorkflowDetail } from "@/components/workflow/WorkflowDetail";
import { getCategoryById } from "@/config/categories";

interface WorkflowPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: WorkflowPageProps): Promise<Metadata> {
  const { slug } = await params;
  const workflow = await getWorkflowBySlug(slug);

  if (!workflow) {
    return {
      title: "Workflow Not Found",
    };
  }

  const category = workflow.category_id
    ? getCategoryById(workflow.category_id)
    : null;

  const title = `${workflow.name} - Free Dify Workflow Template (DSL Download)`;
  const description = workflow.description
    ? `Download "${workflow.name}" for Dify AI. ${workflow.description}. ${workflow.node_count} nodes. Free DSL file.`
    : `Download "${workflow.name}" for Dify AI. ${workflow.node_count} nodes. Compatible with Dify v1.6+. Free DSL file.`;

  return {
    title,
    description,
    keywords: [
      "Dify",
      "Dify workflow",
      "Dify DSL",
      workflow.name,
      ...workflow.tags.slice(0, 5),
      category?.name || "Workflow",
    ],
    openGraph: {
      title: workflow.name,
      description:
        workflow.description ||
        `Free Dify workflow template with ${workflow.node_count} nodes.`,
      type: "article",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(workflow.name)}&nodes=${workflow.node_count}&category=${encodeURIComponent(category?.name || "Workflow")}&downloads=${workflow.download_count}`,
          width: 1200,
          height: 630,
          alt: workflow.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: workflow.name,
      description: workflow.description || `Free Dify workflow template`,
    },
  };
}

export const dynamic = "force-dynamic";

async function getWorkflow(slug: string) {
  const workflow = await getWorkflowBySlug(slug);

  if (!workflow) {
    return null;
  }

  // Increment view count (non-blocking)
  incrementViewCount(workflow.id).catch(() => {});

  // Log view event (non-blocking)
  insertWorkflowEvent(workflow.id, "view").catch(() => {});

  // Get similar workflows (same category)
  const similarWorkflows = await getSimilarWorkflows(
    workflow.id,
    workflow.category_id,
    3,
  );

  return {
    workflow,
    similarWorkflows,
  };
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { slug } = await params;
  const data = await getWorkflow(slug);

  if (!data) {
    notFound();
  }

  // Sanitize workflow data for JSON-LD to prevent XSS
  const sanitizeForJsonLd = (str: string | null | undefined): string => {
    if (!str) return "";
    // Remove any script-breaking sequences and HTML tags
    return str
      .replace(/<script[^>]*>.*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026");
  };

  // JSON-LD structured data with sanitized fields
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: sanitizeForJsonLd(data.workflow.name),
    description: sanitizeForJsonLd(data.workflow.description),
    programmingLanguage: {
      "@type": "ComputerLanguage",
      name: "YAML",
      alternateName: "Dify DSL",
    },
    codeRepository: data.workflow.github_url,
    codeSampleType: "template",
    runtimePlatform: "Dify AI Platform",
    dateModified: data.workflow.synced_at,
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    keywords: data.workflow.tags?.map((t) => sanitizeForJsonLd(t)).join(", "),
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/DownloadAction",
        userInteractionCount: data.workflow.download_count,
      },
    ],
  };

  // Double-escape for extra safety in JSON-LD script tag
  const jsonLdString = JSON.stringify(jsonLd)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");

  return (
    <div className="container py-8">
      <WorkflowDetail
        workflow={data.workflow}
        similarWorkflows={data.similarWorkflows}
      />

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
    </div>
  );
}
