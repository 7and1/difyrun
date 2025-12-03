import Link from 'next/link';
import { Zap, Github, Twitter, ExternalLink, Mail } from 'lucide-react';
import { CATEGORIES } from '@/config/categories';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      {/* SEO Content Section */}
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* What is Dify AI? */}
          <div>
            <h3 className="font-semibold text-lg mb-3">What is Dify AI?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Dify</strong> is an open-source platform for building
              agentic AI applications. With <strong>100,000+ GitHub stars</strong>,
              it combines visual workflow orchestration, <strong>RAG pipelines</strong>,
              agent capabilities, and model management. Unlike <strong>n8n</strong>
              which focuses on general automation, Dify specializes in LLM-native
              features like knowledge bases, vector search, and
              <strong> MCP (Model Context Protocol)</strong> integration.
            </p>
          </div>

          {/* Why Use DifyRun Templates? */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Why Use DifyRun Templates?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              DifyRun aggregates <strong>100+ workflow templates</strong> from
              7 community repositories. Every <strong>DSL file</strong> is free
              to download and import into your Dify instance. Our visual preview
              lets you see the workflow structure before downloading. Perfect for
              <strong> Docker deployments</strong>, cloud setups, and local development.
            </p>
          </div>

          {/* What is MCP? */}
          <div>
            <h3 className="font-semibold text-lg mb-3">What is MCP?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>MCP (Model Context Protocol)</strong> is Anthropic&apos;s open
              standard for connecting AI models to external tools — think of it
              as the USB-C for AI. Dify v1.6.0 added <strong>native two-way
              MCP support</strong>, letting you call any MCP server (like Zapier
              with 7,000+ apps) or publish your Dify agents as MCP endpoints for
              <strong> Claude Desktop</strong> and <strong>Cursor</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="border-t">
        <div className="container py-8">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">DifyRun</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                The ultimate Dify AI workflow and MCP server library. Built by AI enthusiasts
                who believe the best tools should be free and accessible.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:hello@difyrun.com"
                  className="hover:text-foreground transition-colors"
                >
                  hello@difyrun.com
                </a>
              </div>
              <div className="flex gap-3">
                <a
                  href="https://github.com/langgenius/dify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Dify GitHub Repository"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com/daborxai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Follow on Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                {CATEGORIES.slice(0, 5).map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/explore/${category.slug}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/docs/getting-started"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Getting Started
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/import-workflow"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    How to Import
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compare/dify-vs-n8n"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dify vs n8n
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sources"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Source Repos
                  </Link>
                </li>
              </ul>
            </div>

            {/* External Links */}
            <div>
              <h4 className="font-semibold mb-4">Official Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://dify.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dify Official <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.dify.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dify Docs <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/langgenius/dify"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub Repo <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://spec.modelcontextprotocol.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    MCP Spec <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t">
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} DifyRun. Not affiliated with Dify AI Ltd.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
