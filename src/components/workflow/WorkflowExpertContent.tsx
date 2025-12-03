'use client';

import {
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Download,
  Settings,
  Zap,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface WorkflowExpertContentProps {
  workflowName: string;
  nodeCount: number;
  hasKnowledgeBase: boolean;
  hasToolNodes: boolean;
  categoryId?: string | null;
  categoryName?: string;
}

export function WorkflowExpertContent({
  workflowName,
  nodeCount,
  hasKnowledgeBase,
  hasToolNodes,
  categoryId,
  categoryName
}: WorkflowExpertContentProps) {
  // Determine complexity tier
  const getComplexityTier = () => {
    if (nodeCount <= 5) return 'simple';
    if (nodeCount <= 15) return 'moderate';
    return 'complex';
  };

  const complexity = getComplexityTier();

  const complexityInfo = {
    simple: {
      label: 'Beginner-Friendly',
      color: 'text-green-600',
      description: 'Great for learning Dify basics. Easy to understand and modify.',
      importTime: '5-10 minutes to get running',
      customizationLevel: 'Easy to modify — most changes are straightforward'
    },
    moderate: {
      label: 'Intermediate',
      color: 'text-yellow-600',
      description: 'Balanced complexity. Good for production use with some Dify experience.',
      importTime: '15-30 minutes to configure fully',
      customizationLevel: 'Moderate effort — may need to understand node connections'
    },
    complex: {
      label: 'Advanced',
      color: 'text-orange-600',
      description: 'Production-ready template. Best for experienced Dify users.',
      importTime: '30+ minutes for full setup',
      customizationLevel: 'Requires understanding of the complete flow'
    }
  };

  const info = complexityInfo[complexity];

  return (
    <section className="mt-12 pt-12 border-t">
      <div className="space-y-8">
        {/* How to Use This Template */}
        <div className="bg-muted/30 rounded-2xl p-6 lg:p-8 border">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shrink-0">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">How to Use This Template</h2>
              <p className="text-muted-foreground">
                Getting &quot;{workflowName}&quot; running in your Dify instance is straightforward.
                Here&apos;s what you need to know:
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Steps */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Settings className="h-4 w-4 text-blue-500" />
                Quick Setup Steps
              </h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">1</span>
                  <div className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Download the DSL file</strong> using the button above,
                    or copy the code to your clipboard.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">2</span>
                  <div className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Open Dify Studio</strong> and click &quot;Import DSL&quot;
                    in the upper right corner of your workspace.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">3</span>
                  <div className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Upload or paste</strong> — Dify accepts both file uploads
                    and direct YAML paste.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">4</span>
                  <div className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Configure connections</strong> — Update API keys,
                    knowledge bases, or external tools as needed.
                  </div>
                </li>
              </ol>
              <Link
                href="/docs/import-workflow"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Detailed import guide
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Complexity & Requirements */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-purple-500" />
                Template Complexity
              </h3>
              <div className="p-4 rounded-lg bg-background border">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${info.color}`}>{info.label}</span>
                  <span className="text-sm text-muted-foreground">{nodeCount} nodes</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{info.description}</p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span>{info.importTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span>{info.customizationLevel}</span>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              {(hasKnowledgeBase || hasToolNodes) && (
                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    Additional Setup Required
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {hasKnowledgeBase && (
                      <li>• This workflow uses a Knowledge Base — you&apos;ll need to connect your own documents</li>
                    )}
                    {hasToolNodes && (
                      <li>• Contains external tool nodes — configure API keys or MCP connections</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customization Tips */}
        <div className="bg-background rounded-2xl p-6 lg:p-8 border">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold">Customization Tips</h2>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Templates are starting points, not final products. Here&apos;s how to make this workflow
              truly yours:
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 not-prose mt-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm mb-2">Start with the Prompts</h4>
                <p className="text-xs text-muted-foreground">
                  LLM node prompts are the easiest to customize. Adjust tone, add context,
                  or change the output format without touching the workflow structure.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm mb-2">Test Before Modifying</h4>
                <p className="text-xs text-muted-foreground">
                  Run the workflow as-is first. Understanding how it works makes modifications
                  much easier and reduces debugging time.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm mb-2">Branch, Don&apos;t Replace</h4>
                <p className="text-xs text-muted-foreground">
                  Keep the original template and create a copy for modifications. This way you
                  always have a working reference.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm mb-2">Check Node Connections</h4>
                <p className="text-xs text-muted-foreground">
                  When adding nodes, make sure variable references still work. Dify&apos;s visual
                  editor shows broken connections clearly.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm mb-2">Model Flexibility</h4>
                <p className="text-xs text-muted-foreground">
                  Most workflows work with different LLMs. Start with a cheaper model for testing,
                  then upgrade to GPT-4 or Claude for production.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm mb-2">Add Your Data</h4>
                <p className="text-xs text-muted-foreground">
                  The real power comes from connecting your own data sources — documents,
                  APIs, or databases that make the workflow uniquely valuable.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Resources */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
          <span className="text-sm text-muted-foreground">Need more help?</span>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/docs/getting-started"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Getting Started Guide
            </Link>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <Link
              href="/docs/import-workflow"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              How to Import Workflows
            </Link>
            {categoryId && categoryName && (
              <>
                <span className="text-muted-foreground hidden sm:inline">•</span>
                <Link
                  href={`/explore/${categoryId}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  More {categoryName} Templates
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
