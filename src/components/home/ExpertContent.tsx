"use client";

import Link from "next/link";
import {
  BookOpen,
  Zap,
  Brain,
  Workflow,
  Server,
  Shield,
  TrendingUp,
  Users,
  Star,
  CheckCircle2,
} from "lucide-react";

export function ExpertContent() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 text-sm font-medium">
            <BookOpen className="h-4 w-4" />
            Expert Guide
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything You Need to Know About Dify AI Workflows
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Whether you&apos;re building your first AI application or scaling
            enterprise solutions, this guide breaks down everything in plain
            English.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-12 lg:gap-16">
          {/* What is Dify Section */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">
                  What is Dify? The Plain English Version
                </h3>
              </div>

              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Let me explain Dify like I&apos;d explain it to a friend over
                  coffee. Imagine you want to build something with AI — maybe a
                  customer support bot, a document analyzer, or an automated
                  research assistant. Traditionally, you&apos;d need to write
                  thousands of lines of code, understand complex APIs, and spend
                  months learning prompt engineering.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  <strong>Dify changes everything.</strong> It&apos;s like
                  having a visual canvas where you can drag and drop AI
                  components — kind of like building with LEGO blocks, but for
                  AI. You connect a &quot;Start&quot; block to an
                  &quot;LLM&quot; block, add a &quot;Knowledge Base&quot; for
                  your documents, and boom — you&apos;ve got a working AI
                  application. No PhD required.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  The numbers speak for themselves: Dify crossed{" "}
                  <strong>100,000 GitHub stars</strong> in 2024, making it one
                  of the top 100 open-source projects worldwide. Over{" "}
                  <strong>130,000 AI applications</strong>
                  have been built on their cloud platform. This isn&apos;t just
                  another dev tool — it&apos;s becoming the standard for
                  building LLM applications.
                </p>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-background rounded-2xl border p-6 lg:p-8 shadow-sm">
              <h4 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Dify by the Numbers (2025)
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">GitHub Stars</span>
                  </div>
                  <span className="text-2xl font-bold">100,000+</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Workflow className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Apps Built</span>
                  </div>
                  <span className="text-2xl font-bold">130,000+</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Contributors</span>
                  </div>
                  <span className="text-2xl font-bold">900+</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Server className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">Supported Models</span>
                  </div>
                  <span className="text-2xl font-bold">100+</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Data sources: GitHub, Dify official announcements, NVIDIA GTC
                2025
              </p>
            </div>
          </div>

          {/* Why Workflows Matter Section */}
          <div className="bg-background rounded-2xl border p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                <Workflow className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-semibold">
                Why AI Workflows Will Define the Next Decade
              </h3>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Here&apos;s a prediction that might sound bold:{" "}
                <strong>
                  by 2030, every knowledge worker will use AI workflows daily
                </strong>
                , whether they realize it or not. Just like spreadsheets
                transformed accounting in the 1980s, AI workflows are about to
                transform how we handle any task involving language, documents,
                or decision-making.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Think about what you do at work. You read emails, summarize
                documents, answer questions, analyze data, write reports. Every
                single one of these tasks can be automated — not by replacing
                you, but by giving you superpowers. A Dify workflow can read 500
                customer reviews and summarize the key themes in 30 seconds. It
                can answer questions about your company&apos;s policies by
                pulling from your knowledge base. It can draft responses that
                match your brand voice.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                <strong>The magic is in the &quot;workflow&quot; part.</strong>{" "}
                You&apos;re not just calling an AI once — you&apos;re building a
                pipeline. Input comes in, gets processed by multiple AI steps,
                conditionally branches based on content, queries your databases,
                and produces structured output. This is the difference between
                asking ChatGPT a question and having an AI colleague who knows
                your business.
              </p>
            </div>
          </div>

          {/* MCP Explained Section */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="bg-background rounded-2xl border p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">
                  MCP: The Universal AI Connector
                </h3>
              </div>

              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Let me use an analogy. Remember when every phone had a
                  different charger? You&apos;d travel with five cables and
                  still couldn&apos;t charge your friend&apos;s phone. Then
                  USB-C came along and solved everything.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  <strong>
                    MCP (Model Context Protocol) is the USB-C of AI.
                  </strong>{" "}
                  It&apos;s Anthropic&apos;s open standard that lets any AI
                  model connect to any tool using the same interface. Whether
                  you&apos;re using Claude, GPT-4, or a local model running on
                  your laptop — if it supports MCP, it can talk to any MCP
                  server.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Dify added full MCP support in version 1.6.0, which means two
                  game-changing things:
                </p>

                <ul className="space-y-2 mt-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong>Call any MCP server from Dify:</strong> Connect to
                      Zapier (7,000+ apps), Google services, databases, and more
                      — all through a standard interface.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong>Publish Dify agents as MCP endpoints:</strong>{" "}
                      Your workflows become tools that Claude Desktop, Cursor,
                      or any MCP-compatible client can use.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* RAG Section */}
            <div className="bg-background rounded-2xl border p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-semibold">
                  RAG: Teaching AI Your Business
                </h3>
              </div>

              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  ChatGPT knows a lot about the world, but it knows nothing
                  about <em>your</em> world. It doesn&apos;t know your company
                  policies, your product documentation, or your customer
                  history. That&apos;s where RAG comes in.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  <strong>
                    RAG stands for Retrieval-Augmented Generation.
                  </strong>{" "}
                  In plain English: before the AI answers a question, it first
                  searches your documents to find relevant context. It&apos;s
                  like giving the AI a library card to your company&apos;s
                  knowledge base.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  Dify makes RAG ridiculously simple. You upload your documents
                  (PDFs, Word files, web pages, Notion exports — whatever
                  you&apos;ve got), and Dify automatically:
                </p>

                <ul className="space-y-2 mt-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">
                      Chunks them into digestible pieces
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">
                      Creates vector embeddings for semantic search
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">
                      Retrieves the most relevant chunks when asked questions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">
                      Feeds them to the LLM for grounded, accurate answers
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Why DifyRun Exists Section */}
          <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-8 lg:p-10 border">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-semibold">Why We Built DifyRun</h3>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                We built DifyRun because we got tired of reinventing the wheel.
                Every time we started a new Dify project, we&apos;d think:
                &quot;Someone must have already built a customer support
                workflow&quot; or &quot;There&apos;s got to be a good RAG
                template out there.&quot;
              </p>

              <p className="text-muted-foreground leading-relaxed">
                The problem? Dify templates were scattered across dozens of
                GitHub repos, buried in Discord threads, or hidden in blog
                posts. Finding them was a treasure hunt that nobody had time
                for.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                <strong>
                  DifyRun aggregates 100+ workflow templates from 7 trusted
                  community repositories.
                </strong>{" "}
                Every DSL file is:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-foreground">
                      Free to Download
                    </strong>
                    <span className="text-sm text-muted-foreground">
                      No signups, no paywalls, no nonsense
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-foreground">
                      Visually Previewable
                    </strong>
                    <span className="text-sm text-muted-foreground">
                      See the workflow structure before importing
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-foreground">
                      Community Validated
                    </strong>
                    <span className="text-sm text-muted-foreground">
                      Works/broken feedback from real users
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-foreground">
                      Dify v1.6+ Compatible
                    </strong>
                    <span className="text-sm text-muted-foreground">
                      Tested with the latest Dify features
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mt-6">
                Whether you&apos;re running Dify on Docker, using the cloud
                version, or self-hosting on your own infrastructure — DifyRun
                has templates that&apos;ll work for you. Start with a proven
                foundation, customize it for your needs, and ship AI-powered
                features in days instead of weeks.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Ready to build something amazing? Browse our library and find the
              perfect starting point for your AI project.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/explore"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Explore All Templates
              </Link>
              <Link
                href="/docs/getting-started"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg border bg-background hover:bg-muted transition-colors font-medium"
              >
                Read the Docs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
