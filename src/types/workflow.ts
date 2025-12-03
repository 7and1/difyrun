// Core workflow types

export interface Workflow {
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
  // Relations
  repo_sources?: RepoSource | null;
  categories?: Category | null;
}

export interface WorkflowSummary {
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
  dify_version: string | null;
  app_mode: string | null;
  preview_image_url: string | null;
  github_updated_at: string | null;
  synced_at: string;
  repo_sources?: {
    name: string;
    owner: string;
    repo: string;
  } | null;
}

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

export interface CategoryStats {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string;
  sort_order: number;
  workflow_count: number;
  total_downloads: number;
  total_views: number;
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

export interface WorkflowEvent {
  id: number;
  workflow_id: string;
  event_type: 'view' | 'download' | 'copy' | 'preview';
  user_agent: string | null;
  country: string | null;
  referer: string | null;
  session_id: string | null;
  created_at: string;
}

export interface WorkflowFeedback {
  id: string;
  workflow_id: string;
  feedback_type: 'works' | 'broken';
  dify_version: string | null;
  comment: string | null;
  ip_hash: string | null;
  created_at: string;
}
