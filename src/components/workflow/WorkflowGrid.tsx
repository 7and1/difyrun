import { WorkflowCard } from './WorkflowCard';
import { Loader2 } from 'lucide-react';

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

interface WorkflowGridProps {
  workflows: Workflow[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function WorkflowGrid({
  workflows,
  isLoading = false,
  emptyMessage = 'No workflows found',
}: WorkflowGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-3 text-muted-foreground">Loading workflows...</p>
        </div>
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium mb-2">No Results Found</h3>
          <p className="text-muted-foreground max-w-md">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
}
