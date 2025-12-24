import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Github } from "lucide-react";
import { getWorkflowBySlug } from "@/lib/db";
import { getCategoryById } from "@/config/categories";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DslVisualizer } from "@/components/visualizer/DslVisualizer";
import { formatDate, formatNumber } from "@/lib/utils";

interface WorkflowPreviewPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: WorkflowPreviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const workflow = await getWorkflowBySlug(slug);

  if (!workflow) {
    return {
      title: "Workflow Preview Not Found",
    };
  }

  return {
    title: `${workflow.name} – Visual Preview | DifyRun`,
    description:
      workflow.description ||
      `Visual preview for the "${workflow.name}" Dify workflow.`,
  };
}

export default async function WorkflowPreviewPage({
  params,
}: WorkflowPreviewPageProps) {
  const { slug } = await params;
  const workflow = await getWorkflowBySlug(slug);

  if (!workflow) {
    notFound();
  }

  const category = workflow.category_id
    ? getCategoryById(workflow.category_id)
    : null;

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <Link
            href={`/workflow/${workflow.slug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to workflow details
          </Link>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {category && <Badge variant="outline">{category.name}</Badge>}
              <Badge variant="secondary">{workflow.node_count} nodes</Badge>
              <Badge variant="secondary">
                {formatNumber(workflow.download_count)} downloads
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{workflow.name}</h1>
            {workflow.description && (
              <p className="text-muted-foreground max-w-3xl">
                {workflow.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>Synced {formatDate(workflow.synced_at)}</span>
            {workflow.tags?.length > 0 && (
              <span>
                Tags: {workflow.tags.slice(0, 5).join(", ")}
                {workflow.tags.length > 5 && "…"}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href={`/workflow/${workflow.slug}`}>
            <Button variant="outline">View full details</Button>
          </Link>
          <a
            href={`/api/download?slug=${workflow.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download DSL
            </Button>
          </a>
          <a
            href={workflow.github_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary">
              <Github className="h-4 w-4 mr-2" />
              View Repo
            </Button>
          </a>
        </div>
      </div>

      <section>
        <DslVisualizer
          dslContent={workflow.dsl_content}
          className="h-[640px]"
        />
      </section>

      <section className="rounded-lg border bg-muted/30 p-6">
        <h2 className="text-xl font-semibold mb-3">How to use this preview</h2>
        <p className="text-sm text-muted-foreground">
          This standalone preview loads the DSL file directly in the browser so
          you can inspect the node graph, confirm tool wiring, and validate
          complexity before importing it into your own Dify workspace. When
          you&apos;re ready, download the DSL or return to the full workflow
          detail page for compatibility data and community feedback.
        </p>
      </section>
    </div>
  );
}
