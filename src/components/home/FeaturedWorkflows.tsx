import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkflowCard } from "@/components/workflow/WorkflowCard";

interface Workflow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category_id: string | null;
  tags: string[];
  node_count: number;
  download_count: number;
  view_count: number;
  works_count: number;
  broken_count: number;
  app_mode: string | null;
  repo_source?: {
    name: string;
    owner: string;
    repo: string;
  } | null;
}

interface FeaturedWorkflowsProps {
  workflows: Workflow[];
}

export function FeaturedWorkflows({ workflows }: FeaturedWorkflowsProps) {
  if (workflows.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-muted-foreground">
                Most Popular
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Featured Workflows
            </h2>
          </div>
          <Link href="/explore">
            <Button variant="outline">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Workflow grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.slice(0, 6).map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Don&apos;t see what you need? Browse our complete collection.
          </p>
          <Link href="/explore">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Explore All Templates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
