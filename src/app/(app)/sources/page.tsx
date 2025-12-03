import { Metadata } from 'next';
import Link from 'next/link';
import { Github, ExternalLink, Star, Package } from 'lucide-react';
import { getRepoSources } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SourcesContent } from '@/components/sources';
import { formatDate, formatNumber } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Source Repositories - DifyRun Workflow Sources',
  description: 'Explore the community repositories that power DifyRun. We aggregate workflows from 7+ trusted GitHub sources.',
};

export const dynamic = 'force-dynamic';

export default async function SourcesPage() {
  const sources = await getRepoSources(true);

  const totalWorkflows = sources.reduce((sum, s) => sum + (s.total_workflows || 0), 0);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <h1 className="text-3xl font-bold mb-4">Source Repositories</h1>
        <p className="text-lg text-muted-foreground mb-6">
          DifyRun aggregates workflow templates from {sources.length} community repositories,
          bringing you {totalWorkflows}+ curated Dify DSL files in one place.
        </p>
        <p className="text-muted-foreground">
          We respect all original authors and link back to source repositories.
          Want to add your repository? Open an issue on our GitHub!
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-12">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{sources.length}</div>
            <p className="text-sm text-muted-foreground">Repositories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{formatNumber(totalWorkflows)}</div>
            <p className="text-sm text-muted-foreground">Total Workflows</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">Daily</div>
            <p className="text-sm text-muted-foreground">Sync Frequency</p>
          </CardContent>
        </Card>
      </div>

      {/* Repository list */}
      <div className="space-y-6">
        {sources.map((source) => (
          <Card key={source.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {source.is_featured && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {source.default_tags?.slice(0, 2).map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-xl">
                    <a
                      href={`https://github.com/${source.owner}/${source.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors inline-flex items-center gap-2"
                    >
                      {source.name}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {source.description}
                  </CardDescription>
                </div>

                <a
                  href={`https://github.com/${source.owner}/${source.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    View on GitHub
                  </Button>
                </a>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>
                    <strong className="text-foreground">{source.total_workflows || 0}</strong> workflows
                  </span>
                </div>

                <div className="text-muted-foreground">
                  <span className="text-muted-foreground">
                    {source.owner}/{source.repo}
                  </span>
                </div>

                {source.last_synced_at && (
                  <div className="text-muted-foreground">
                    Last synced: {formatDate(source.last_synced_at)}
                  </div>
                )}

                {source.last_sync_error && (
                  <div className="text-red-500 text-xs">
                    Sync error: {source.last_sync_error}
                  </div>
                )}
              </div>

              {/* Browse workflows link */}
              <div className="mt-4 pt-4 border-t">
                <Link
                  href={`/explore?source=${source.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  Browse {source.total_workflows || 0} workflows from this source →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add your repo CTA */}
      <Card className="mt-12 bg-muted/50">
        <CardContent className="py-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Have a Dify workflow repository?</h3>
          <p className="text-muted-foreground mb-4">
            We&apos;d love to include your workflows in DifyRun. Open an issue on GitHub
            and we&apos;ll review your submission.
          </p>
          <a
            href="https://github.com/langgenius/dify"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              <Github className="h-4 w-4 mr-2" />
              Submit Your Repository
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* E-E-A-T Expert Content */}
      <SourcesContent />
    </div>
  );
}
