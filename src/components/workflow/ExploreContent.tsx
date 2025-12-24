"use client";

import {
  Lightbulb,
  Target,
  Rocket,
  Clock,
  Code2,
  MessageSquare,
  FileText,
  Database,
  Bot,
  Workflow,
} from "lucide-react";

export function ExploreContent() {
  return (
    <section className="mt-16 pt-16 border-t">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-600 text-sm font-medium">
            <Lightbulb className="h-4 w-4" />
            Getting the Most from Templates
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">
            How to Find the Perfect Dify Workflow Template
          </h2>
          <p className="text-muted-foreground">
            With 100+ templates in our library, finding the right one can feel
            overwhelming. Here&apos;s my practical guide to picking templates
            that actually work for your use case.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:gap-12">
          {/* Finding Templates */}
          <div className="bg-muted/30 rounded-2xl p-6 lg:p-8 border">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shrink-0">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Start with the Problem, Not the Tech
                </h3>
                <p className="text-muted-foreground">
                  Here&apos;s a mistake I see all the time: someone searches for
                  &quot;GPT-4 workflow&quot; or &quot;vector database
                  template&quot; when they should be searching for
                  &quot;customer support bot&quot; or &quot;document
                  summarizer.&quot;
                </p>
              </div>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none space-y-4">
              <p className="text-muted-foreground">
                <strong>
                  Think about what you want to accomplish, not how you want to
                  accomplish it.
                </strong>
                The templates here are organized by use case for exactly this
                reason. Want to help customers faster? Check the Customer
                Support category. Need to process documents at scale? Look at
                RAG & Knowledge workflows.
              </p>

              <p className="text-muted-foreground">
                Use the search bar to describe your problem in plain language.
                Something like &quot;analyze customer reviews&quot; or
                &quot;translate documents&quot; will surface relevant templates
                much better than technical jargon. Our search looks at template
                descriptions, not just titles.
              </p>
            </div>
          </div>

          {/* What Makes a Good Template */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background rounded-xl border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                  <Rocket className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">
                  Signs of a Good Template
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong>Clear node labels</strong> — You can understand the
                    flow at a glance
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong>Meaningful variables</strong> — Not just
                    &quot;input1&quot; and &quot;output1&quot;
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong>Error handling</strong> — What happens when things
                    go wrong?
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong>Recent sync date</strong> — Templates updated for
                    Dify v1.6+ features
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>
                    <strong>Community votes</strong> — &quot;Works&quot; votes
                    from real users
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-background rounded-xl border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold">
                  When to Start from Scratch
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">→</span>
                  <span>
                    Your use case requires{" "}
                    <strong>proprietary business logic</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">→</span>
                  <span>
                    You need <strong>specific API integrations</strong> not in
                    any template
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">→</span>
                  <span>
                    Templates in your category are <strong>too complex</strong>{" "}
                    for learning
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">→</span>
                  <span>
                    You want to <strong>deeply understand</strong> every node
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">→</span>
                  <span>
                    The workflow is <strong>core to your product</strong> (not
                    just internal tooling)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Common Patterns */}
          <div className="bg-background rounded-2xl border p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                <Workflow className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold">
                Common Workflow Patterns You&apos;ll See
              </h3>
            </div>

            <p className="text-muted-foreground mb-6">
              After reviewing hundreds of Dify workflows, I&apos;ve noticed most
              fall into a few patterns. Understanding these helps you pick the
              right template and modify it for your needs:
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">Chatbot Pattern</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Start → LLM → End. Simple but effective. Add a Knowledge Base
                  node for RAG-powered chat.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-sm">
                    Document Processor
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Start → Document Extractor → LLM → Template → End. Great for
                  summarizing or analyzing files.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-sm">RAG Pipeline</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Start → Knowledge Retrieval → LLM (with context) → End. The
                  backbone of enterprise AI.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-4 w-4 text-orange-500" />
                  <span className="font-medium text-sm">Agent Loop</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Start → LLM → Tool Call → Condition → (loop back or end).
                  Powers autonomous agents.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-sm">Code Hybrid</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Start → Code Node → LLM → Code Node → End. Best of both worlds
                  for complex logic.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Workflow className="h-4 w-4 text-cyan-500" />
                  <span className="font-medium text-sm">Multi-Model Chain</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Start → LLM (Claude) → LLM (GPT-4) → End. Combine model
                  strengths for better outputs.
                </p>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 lg:p-8 border">
            <h3 className="text-xl font-semibold mb-6">
              Pro Tips from the Community
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">
                    1
                  </span>
                  <div>
                    <p className="font-medium">Preview before downloading</p>
                    <p className="text-sm text-muted-foreground">
                      Click on any workflow to see the visual preview.
                      You&apos;ll immediately know if it&apos;s what you need.
                      No download required.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">
                    2
                  </span>
                  <div>
                    <p className="font-medium">Check the node count</p>
                    <p className="text-sm text-muted-foreground">
                      5-10 nodes is a sweet spot for learning. Over 20 nodes
                      means it&apos;s production-ready but harder to customize.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">
                    3
                  </span>
                  <div>
                    <p className="font-medium">
                      Sort by downloads for proven templates
                    </p>
                    <p className="text-sm text-muted-foreground">
                      High download counts mean the community trusts it.
                      Combined with &quot;Works&quot; votes, you&apos;ve found a
                      winner.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white text-xs font-bold shrink-0">
                    4
                  </span>
                  <div>
                    <p className="font-medium">
                      Filter by tags for specific tech
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Need Claude? Filter for it. Looking for MCP integration?
                      We&apos;ve got those tagged too.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white text-xs font-bold shrink-0">
                    5
                  </span>
                  <div>
                    <p className="font-medium">Check the source repository</p>
                    <p className="text-sm text-muted-foreground">
                      Click the source link to see documentation, issues, and
                      updates. Many repos have additional context on GitHub.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white text-xs font-bold shrink-0">
                    6
                  </span>
                  <div>
                    <p className="font-medium">Vote after testing</p>
                    <p className="text-sm text-muted-foreground">
                      Help the community by marking templates as
                      &quot;Works&quot; or &quot;Broken&quot; after you&apos;ve
                      tried them. Your feedback helps everyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Understanding Categories */}
          <div className="bg-background rounded-2xl border p-6 lg:p-8">
            <h3 className="text-xl font-semibold mb-6">
              Understanding Our Categories
            </h3>

            <div className="prose prose-gray dark:prose-invert max-w-none space-y-4">
              <p className="text-muted-foreground">
                We organize templates into categories based on what they{" "}
                <em>do</em>, not what technology they use. This means you might
                find an &quot;Agent&quot; that uses RAG, or a &quot;RAG&quot;
                workflow that includes code execution. Here&apos;s a quick
                guide:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 not-prose">
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="font-medium mb-1">RAG & Knowledge</p>
                  <p className="text-sm text-muted-foreground">
                    Workflows that retrieve and use information from documents.
                    Think Q&A bots, documentation search, research assistants.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="font-medium mb-1">Agents</p>
                  <p className="text-sm text-muted-foreground">
                    Autonomous AI that makes decisions and takes actions. Can
                    browse the web, call APIs, and work independently.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="font-medium mb-1">MCP Servers</p>
                  <p className="text-sm text-muted-foreground">
                    Templates that connect to external tools via Model Context
                    Protocol. Extend Dify&apos;s capabilities with 7,000+
                    integrations.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="font-medium mb-1">Automation</p>
                  <p className="text-sm text-muted-foreground">
                    Workflows for repetitive tasks: data processing, content
                    generation, file handling, scheduling. Set and forget.
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground">
                Don&apos;t see your category? Use the search — it looks across
                all templates, not just the selected category. And remember,
                many templates are versatile enough to adapt to different use
                cases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
