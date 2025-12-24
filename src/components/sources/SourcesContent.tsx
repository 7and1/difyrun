"use client";

import {
  Shield,
  CheckCircle2,
  Search,
  RefreshCw,
  Users,
  FileCheck,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

export function SourcesContent() {
  return (
    <section className="mt-16 pt-16 border-t">
      <div className="space-y-10">
        {/* Why We Curate */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">
              Why We Curate Sources Carefully
            </h2>
          </div>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              Not all workflow templates are created equal. Some are outdated,
              others have security issues, and many just don&apos;t work with
              current Dify versions. That&apos;s why we don&apos;t just scrape
              every DSL file we find — we curate from trusted sources.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every repository in our list has been manually reviewed. We look
              at the maintainer&apos;s reputation, the quality of the workflows,
              how often they&apos;re updated, and whether they follow Dify best
              practices. This means you can download any template from DifyRun
              with confidence.
            </p>
          </div>
        </div>

        {/* Our Curation Process */}
        <div className="bg-muted/30 rounded-2xl p-6 lg:p-8 border">
          <h3 className="text-xl font-semibold mb-6">Our Curation Process</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 mx-auto mb-3">
                <Search className="h-6 w-6 text-blue-500" />
              </div>
              <h4 className="font-medium mb-2">Discovery</h4>
              <p className="text-sm text-muted-foreground">
                We actively search GitHub, community forums, and Discord for
                quality Dify repositories.
              </p>
            </div>
            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 mx-auto mb-3">
                <FileCheck className="h-6 w-6 text-green-500" />
              </div>
              <h4 className="font-medium mb-2">Validation</h4>
              <p className="text-sm text-muted-foreground">
                Each repo is tested for valid DSL structure, proper formatting,
                and Dify v1.6+ compatibility.
              </p>
            </div>
            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <h4 className="font-medium mb-2">Attribution</h4>
              <p className="text-sm text-muted-foreground">
                We always credit original authors and link back to source repos.
                Your work, your credit.
              </p>
            </div>
            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 mx-auto mb-3">
                <RefreshCw className="h-6 w-6 text-orange-500" />
              </div>
              <h4 className="font-medium mb-2">Sync</h4>
              <p className="text-sm text-muted-foreground">
                Automated daily syncs keep templates current. New workflows
                appear within 24 hours of commit.
              </p>
            </div>
          </div>
        </div>

        {/* What Makes a Good Source */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-background rounded-xl border p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold">What We Look For</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>
                  <strong>Active maintenance:</strong> Regular commits and
                  updates to DSL files
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>
                  <strong>Quality workflows:</strong> Clear structure, proper
                  node naming, documentation
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>
                  <strong>Dify v1.6+ support:</strong> Templates using current
                  Dify features and syntax
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>
                  <strong>Open source license:</strong> MIT, Apache 2.0, or
                  similar permissive license
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>
                  <strong>Community trust:</strong> Stars, forks, and positive
                  community feedback
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-background rounded-xl border p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Red Flags We Avoid</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>
                  <strong>Abandoned repos:</strong> No updates in 6+ months with
                  Dify version drift
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>
                  <strong>Invalid DSL:</strong> Files that fail to import or
                  have parsing errors
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>
                  <strong>Security concerns:</strong> Hardcoded API keys,
                  external data collection
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>
                  <strong>License issues:</strong> Unclear or restrictive
                  licensing terms
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>
                  <strong>Low quality:</strong> Untested templates, no
                  documentation, poor naming
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* How Sync Works */}
        <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 lg:p-8 border">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <RefreshCw className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold">How Our Sync Works</h3>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Every day, our automated system checks each source repository for
              changes. Here&apos;s what happens:
            </p>

            <ol className="space-y-4 mt-6 not-prose">
              <li className="flex items-start gap-4 p-4 bg-background/50 rounded-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold shrink-0">
                  1
                </span>
                <div>
                  <p className="font-medium">Fetch Changes</p>
                  <p className="text-sm text-muted-foreground">
                    We use the GitHub API to check for new commits and file
                    changes in each source repository.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 bg-background/50 rounded-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold shrink-0">
                  2
                </span>
                <div>
                  <p className="font-medium">Parse DSL Files</p>
                  <p className="text-sm text-muted-foreground">
                    New and modified YAML files are parsed to extract workflow
                    metadata — node counts, types, descriptions.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 bg-background/50 rounded-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold shrink-0">
                  3
                </span>
                <div>
                  <p className="font-medium">Categorize Automatically</p>
                  <p className="text-sm text-muted-foreground">
                    Based on node types and content, we auto-categorize
                    workflows (RAG, Agents, MCP, etc.) for easy browsing.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 bg-background/50 rounded-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-bold shrink-0">
                  4
                </span>
                <div>
                  <p className="font-medium">Update Database</p>
                  <p className="text-sm text-muted-foreground">
                    Workflows are indexed, searchable, and available for
                    download — usually within 24 hours of the original commit.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        {/* Transparency Note */}
        <div className="bg-background rounded-xl border p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 shrink-0">
              <Lightbulb className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                A Note on Transparency
              </h3>
              <p className="text-sm text-muted-foreground">
                DifyRun is a community project. We don&apos;t modify or alter
                the original workflows — what you download is exactly what
                exists in the source repository. We believe in transparency: you
                can always click through to the original GitHub repo to verify
                the source, read the author&apos;s documentation, and even
                contribute improvements directly.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                If you notice any issues with a workflow or have concerns about
                a source repository, please reach out at{" "}
                <a
                  href="mailto:hello@difyrun.com"
                  className="text-blue-600 hover:text-blue-700"
                >
                  hello@difyrun.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
