"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Download,
  Copy,
  Check,
  Github,
  ExternalLink,
  Layers,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Eye,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DslVisualizer } from "@/components/visualizer/DslVisualizer";
import { DslCodeBlock } from "./DslCodeBlock";
import { FeedbackButtons } from "./FeedbackButtons";
import { WorkflowExpertContent } from "./WorkflowExpertContent";
import { CompatibilityBadge } from "./CompatibilityBadge";
import { cn, formatNumber, formatDate } from "@/lib/utils";
import { getCategoryById, getCategoryEmoji } from "@/config/categories";

interface Workflow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category_id: string | null;
  tags: string[];
  node_count: number;
  node_types: string[];
  download_count: number;
  view_count: number;
  works_count: number;
  broken_count: number;
  dify_version: string | null;
  app_mode: string | null;
  dsl_content: string;
  github_url: string;
  synced_at: string;
  has_knowledge_base: boolean;
  has_tool_nodes: boolean;
  repo_sources?: {
    name: string;
    owner: string;
    repo: string;
  } | null;
}

interface WorkflowDetailProps {
  workflow: Workflow;
  similarWorkflows?: Workflow[];
}

export function WorkflowDetail({
  workflow,
  similarWorkflows = [],
}: WorkflowDetailProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("code");

  const category = workflow.category_id
    ? getCategoryById(workflow.category_id)
    : null;
  const categoryEmoji = workflow.category_id
    ? getCategoryEmoji(workflow.category_id)
    : "📁";

  // Calculate compatibility
  const totalVotes = workflow.works_count + workflow.broken_count;
  const compatibilityPercent =
    totalVotes > 0
      ? Math.round((workflow.works_count / totalVotes) * 100)
      : null;

  // Handle download
  const handleDownload = async () => {
    window.open(`/api/download?slug=${workflow.slug}`, "_blank");
  };

  // Handle copy
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(workflow.dsl_content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground">
        <Link
          href="/explore"
          className="hover:text-foreground transition-colors"
        >
          Explore
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        {category && (
          <>
            <Link
              href={`/explore/${category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {category.name}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
          </>
        )}
        <span className="text-foreground font-medium truncate">
          {workflow.name}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between">
        <div className="flex-1">
          {/* Category & Mode badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {category && (
              <Badge variant="outline" className="text-sm">
                <span className="mr-1">{categoryEmoji}</span>
                {category.name}
              </Badge>
            )}
            {workflow.app_mode && (
              <Badge variant="secondary" className="text-sm">
                {workflow.app_mode}
              </Badge>
            )}
            <CompatibilityBadge
              difyVersion={workflow.dify_version}
              worksCount={workflow.works_count}
              brokenCount={workflow.broken_count}
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            {workflow.name}
          </h1>

          {/* Description */}
          {workflow.description && (
            <p className="text-lg text-muted-foreground mb-4">
              {workflow.description}
            </p>
          )}

          {/* Tags */}
          {workflow.tags && workflow.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {workflow.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/explore?tag=${encodeURIComponent(tag)}`}
                >
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-muted"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              <span>{workflow.node_count} nodes</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>{formatNumber(workflow.download_count)} downloads</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{formatNumber(workflow.view_count)} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Updated {formatDate(workflow.synced_at)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 lg:min-w-[200px]">
          <Button
            size="lg"
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Download DSL
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleCopy}
            className="w-full"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
          <a
            href={workflow.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button variant="outline" size="lg" className="w-full">
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </Button>
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Visualizer and Code */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="code">DSL Code</TabsTrigger>
              <TabsTrigger value="preview">Visual Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="mt-4">
              <DslCodeBlock
                code={workflow.dsl_content}
                filename={`${workflow.slug}.yml`}
              />
            </TabsContent>
            <TabsContent value="preview" className="mt-4">
              <DslVisualizer
                dslContent={workflow.dsl_content}
                className="h-[500px]"
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Compatibility */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Community Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              {compatibilityPercent !== null ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Works for {compatibilityPercent}% of users
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {totalVotes} votes
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className={cn(
                        "h-2.5 rounded-full transition-all",
                        compatibilityPercent >= 70
                          ? "bg-green-500"
                          : "bg-red-500",
                      )}
                      style={{ width: `${compatibilityPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{workflow.works_count} works</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <ThumbsDown className="h-4 w-4" />
                      <span>{workflow.broken_count} broken</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  Be the first to report if this workflow works!
                </p>
              )}

              <FeedbackButtons workflowId={workflow.id} />
            </CardContent>
          </Card>

          {/* Workflow Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Workflow Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {workflow.node_types && workflow.node_types.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Node Types</p>
                  <div className="flex flex-wrap gap-1">
                    {workflow.node_types.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Knowledge Base</span>
                <span
                  className={
                    workflow.has_knowledge_base
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }
                >
                  {workflow.has_knowledge_base ? "Yes" : "No"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tool Nodes</span>
                <span
                  className={
                    workflow.has_tool_nodes
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }
                >
                  {workflow.has_tool_nodes ? "Yes" : "No"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Source */}
          {workflow.repo_sources && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Source</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={`https://github.com/${workflow.repo_sources.owner}/${workflow.repo_sources.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span className="font-medium">
                    {workflow.repo_sources.name}
                  </span>
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Similar Workflows */}
      {similarWorkflows.length > 0 && (
        <section className="pt-8">
          <h2 className="text-2xl font-bold mb-6">Similar Workflows</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similarWorkflows.slice(0, 3).map((similar) => (
              <Link key={similar.id} href={`/workflow/${similar.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">
                      {similar.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {similar.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {similar.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                      <span>{similar.node_count} nodes</span>
                      <span>
                        {formatNumber(similar.download_count)} downloads
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* E-E-A-T Expert Content */}
      <WorkflowExpertContent
        workflowName={workflow.name}
        nodeCount={workflow.node_count}
        hasKnowledgeBase={workflow.has_knowledge_base}
        hasToolNodes={workflow.has_tool_nodes}
        categoryId={workflow.category_id}
        categoryName={category?.name}
      />
    </div>
  );
}
