// D1 Database Types for DifyRun

export interface Category {
  id: string;
  name: string;
  name_cn: string | null;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string;
  sort_order: number;
  workflow_count: number;
  created_at: string;
  updated_at: string;
}

export interface RepoSource {
  id: string;
  name: string;
  description: string | null;
  owner: string;
  repo: string;
  branch: string;
  root_path: string | null;
  strategy: string;
  exclude_paths: string | null; // JSON array
  default_tags: string | null; // JSON array
  weight: number;
  is_featured: number; // SQLite boolean
  is_active: number; // SQLite boolean
  total_workflows: number;
  last_synced_at: string | null;
  last_sync_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface Workflow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category_id: string | null;
  tags: string; // JSON array
  repo_id: string;
  file_path: string;
  github_url: string;
  raw_url: string;
  dsl_content: string;
  content_hash: string;
  readme_content: string | null;
  dify_version: string | null;
  app_mode: string | null;
  node_count: number;
  node_types: string; // JSON array
  has_knowledge_base: number; // SQLite boolean
  has_tool_nodes: number; // SQLite boolean
  preview_image_url: string | null;
  has_valid_positions: number; // SQLite boolean
  view_count: number;
  download_count: number;
  works_count: number;
  broken_count: number;
  github_updated_at: string | null;
  synced_at: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowEvent {
  id: number;
  workflow_id: string | null;
  event_type: string;
  ip_address: string | null;
  user_agent: string | null;
  country: string | null;
  referer: string | null;
  metadata: string | null; // JSON
  created_at: string;
}

export interface WorkflowFeedback {
  id: string;
  workflow_id: string;
  feedback_type: "works" | "broken";
  dify_version: string | null;
  comment: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface SyncLog {
  id: string;
  repo_id: string | null;
  status: "started" | "completed" | "failed";
  workflows_added: number;
  workflows_updated: number;
  workflows_unchanged: number;
  workflows_deleted: number;
  error_message: string | null;
  duration_ms: number | null;
  started_at: string;
  completed_at: string | null;
}

// Parsed types (with JSON arrays converted and booleans fixed)
export interface WorkflowParsed {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category_id: string | null;
  tags: string[];
  repo_id: string;
  file_path: string;
  github_url: string;
  raw_url: string;
  dsl_content: string;
  content_hash: string;
  readme_content: string | null;
  dify_version: string | null;
  app_mode: string | null;
  node_count: number;
  node_types: string[];
  has_knowledge_base: boolean;
  has_tool_nodes: boolean;
  preview_image_url: string | null;
  has_valid_positions: boolean;
  view_count: number;
  download_count: number;
  works_count: number;
  broken_count: number;
  github_updated_at: string | null;
  synced_at: string;
  created_at: string;
  updated_at: string;
  repo_source?: {
    name: string;
    owner: string;
    repo: string;
  } | null;
}

export interface RepoSourceParsed {
  id: string;
  name: string;
  description: string | null;
  owner: string;
  repo: string;
  branch: string;
  root_path: string | null;
  strategy: string;
  exclude_paths: string[] | null;
  default_tags: string[] | null;
  weight: number;
  is_featured: boolean;
  is_active: boolean;
  total_workflows: number;
  last_synced_at: string | null;
  last_sync_error: string | null;
  created_at: string;
  updated_at: string;
}

// Helper to parse workflow from D1
export function parseWorkflow(
  w: Workflow & { repo_sources?: RepoSource },
): WorkflowParsed {
  return {
    ...w,
    tags: JSON.parse(w.tags || "[]"),
    node_types: JSON.parse(w.node_types || "[]"),
    has_knowledge_base: Boolean(w.has_knowledge_base),
    has_tool_nodes: Boolean(w.has_tool_nodes),
    has_valid_positions: Boolean(w.has_valid_positions),
    repo_source: w.repo_sources
      ? {
          name: w.repo_sources.name,
          owner: w.repo_sources.owner,
          repo: w.repo_sources.repo,
        }
      : null,
  };
}

export function parseRepoSource(r: RepoSource): RepoSourceParsed {
  return {
    ...r,
    exclude_paths: r.exclude_paths ? JSON.parse(r.exclude_paths) : null,
    default_tags: r.default_tags ? JSON.parse(r.default_tags) : null,
    is_featured: Boolean(r.is_featured),
    is_active: Boolean(r.is_active),
  };
}
