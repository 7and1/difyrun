import Link from "next/link";
import {
  Download,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Layers,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatNumber } from "@/lib/utils";
import { getCategoryById, getCategoryEmoji } from "@/config/categories";

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

interface WorkflowCardProps {
  workflow: Workflow;
  className?: string;
}

const categoryColors: Record<string, string> = {
  mcp: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  agents: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  rag: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  chatbots:
    "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
  content:
    "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  translation:
    "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20",
  data: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
  automation:
    "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  development:
    "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
};

export function WorkflowCard({ workflow, className }: WorkflowCardProps) {
  const category = workflow.category_id
    ? getCategoryById(workflow.category_id)
    : null;
  const categoryEmoji = workflow.category_id
    ? getCategoryEmoji(workflow.category_id)
    : "📁";
  const categoryColor = workflow.category_id
    ? categoryColors[workflow.category_id] || categoryColors.automation
    : categoryColors.automation;

  // Calculate compatibility score
  const totalVotes = workflow.works_count + workflow.broken_count;
  const compatibilityPercent =
    totalVotes > 0
      ? Math.round((workflow.works_count / totalVotes) * 100)
      : null;

  return (
    <Link
      href={`/workflow/${workflow.slug}`}
      className={cn("block group", className)}
    >
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/20">
        <CardHeader className="pb-3">
          {/* Category badge */}
          {category && (
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={cn("text-xs", categoryColor)}>
                <span className="mr-1">{categoryEmoji}</span>
                {category.name}
              </Badge>
              {workflow.app_mode && (
                <Badge variant="secondary" className="text-xs">
                  {workflow.app_mode}
                </Badge>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {workflow.name}
          </h3>
        </CardHeader>

        <CardContent className="pb-3">
          {/* Description */}
          {workflow.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {workflow.description}
            </p>
          )}

          {/* Tags */}
          {workflow.tags && workflow.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {workflow.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 text-xs bg-muted rounded-md text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              {workflow.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{workflow.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Node count */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Layers className="h-4 w-4" />
            <span>{workflow.node_count} nodes</span>
          </div>
        </CardContent>

        <CardFooter className="pt-3 border-t">
          <div className="flex items-center justify-between w-full text-sm">
            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Download className="h-4 w-4" />
                <span>{formatNumber(workflow.download_count)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{formatNumber(workflow.view_count)}</span>
              </div>
            </div>

            {/* Compatibility indicator */}
            {compatibilityPercent !== null && (
              <div className="flex items-center gap-1">
                {compatibilityPercent >= 70 ? (
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ThumbsDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    compatibilityPercent >= 70
                      ? "text-green-600"
                      : "text-red-600",
                  )}
                >
                  {compatibilityPercent}%
                </span>
              </div>
            )}
          </div>
        </CardFooter>

        {/* Source info */}
        {workflow.repo_source && (
          <div className="px-6 pb-4 -mt-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ExternalLink className="h-3 w-3" />
              <span className="truncate">{workflow.repo_source.name}</span>
            </div>
          </div>
        )}
      </Card>
    </Link>
  );
}
