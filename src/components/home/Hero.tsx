"use client";

import Link from "next/link";
import {
  ArrowRight,
  Download,
  Github,
  Sparkles,
  Zap,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  totalWorkflows?: number;
  totalDownloads?: number;
}

export function Hero({ totalWorkflows = 100, totalDownloads = 0 }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-500/10 via-pink-500/10 to-transparent blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{
          mask: "radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 backdrop-blur px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-muted-foreground">
              Compatible with{" "}
              <strong className="text-foreground">Dify v1.6+</strong> and MCP
            </span>
          </div>

          {/* Main heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block">The Ultimate</span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dify AI Workflow & MCP Server
            </span>
            <span className="block">Library</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Discover {totalWorkflows}+ free workflow templates. Download DSL
            files for RAG, AI Agents, MCP Servers, and automation. Better than
            n8n for LLM tasks.
          </p>

          {/* Stats */}
          <div className="mb-10 flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-foreground">
                {totalWorkflows}+
              </div>
              <div className="text-sm text-muted-foreground">Templates</div>
            </div>
            <div className="hidden sm:block w-px bg-border" />
            <div>
              <div className="text-3xl font-bold text-foreground">7</div>
              <div className="text-sm text-muted-foreground">Sources</div>
            </div>
            <div className="hidden sm:block w-px bg-border" />
            <div>
              <div className="text-3xl font-bold text-foreground">100K+</div>
              <div className="text-sm text-muted-foreground">Dify Stars</div>
            </div>
            {totalDownloads > 0 && (
              <>
                <div className="hidden sm:block w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold text-foreground">
                    {totalDownloads.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Downloads</div>
                </div>
              </>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/explore">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base px-8"
              >
                Browse Templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/explore/mcp">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base px-8"
              >
                <Zap className="mr-2 h-4 w-4 text-purple-500" />
                Explore MCP
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Free DSL Downloads</span>
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>Visual Preview</span>
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
