import { Database } from './database';

// Export row types for convenience
export type Workflow = Database['public']['Tables']['workflows']['Row'];
export type WorkflowInsert = Database['public']['Tables']['workflows']['Insert'];
export type WorkflowUpdate = Database['public']['Tables']['workflows']['Update'];

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

export type RepoSource = Database['public']['Tables']['repo_sources']['Row'];
export type RepoSourceInsert = Database['public']['Tables']['repo_sources']['Insert'];

export type WorkflowEvent = Database['public']['Tables']['workflow_events']['Row'];
export type WorkflowEventInsert = Database['public']['Tables']['workflow_events']['Insert'];

export type WorkflowFeedback = Database['public']['Tables']['workflow_feedback']['Row'];
export type WorkflowFeedbackInsert = Database['public']['Tables']['workflow_feedback']['Insert'];

export type SyncLog = Database['public']['Tables']['sync_logs']['Row'];
export type SyncLogInsert = Database['public']['Tables']['sync_logs']['Insert'];

// Workflow with joined repo source
export type WorkflowWithSource = Workflow & {
  repo_sources: Pick<RepoSource, 'name' | 'owner' | 'repo'> | null;
};

// Category with workflow count
export type CategoryWithCount = Category & {
  workflowCount: number;
};
