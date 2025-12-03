// D1 Database Client for DifyRun
// Works with OpenNext for Cloudflare Workers + D1

import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { D1Database } from '@cloudflare/workers-types';
import type {
  Category,
  RepoSource,
  Workflow,
  WorkflowParsed,
  RepoSourceParsed,
} from './types';

export * from './types';

// Extend CloudflareEnv to include our D1 binding
declare global {
  interface CloudflareEnv {
    DB: D1Database;
  }
}

// Get D1 database from Cloudflare context
export function getDB(): D1Database {
  const { env } = getCloudflareContext();
  const db = env.DB;
  if (!db) {
    throw new Error('D1 database not available. Make sure DB binding is configured in wrangler.toml');
  }
  return db;
}

// ================================================
// Categories
// ================================================

export async function getCategories(): Promise<Category[]> {
  const db = getDB();
  const result = await db
    .prepare('SELECT * FROM categories ORDER BY sort_order')
    .all<Category>();
  return result.results;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const db = getDB();
  const result = await db
    .prepare('SELECT * FROM categories WHERE slug = ?')
    .bind(slug)
    .first<Category>();
  return result;
}

// ================================================
// Repository Sources
// ================================================

export async function getRepoSources(activeOnly = true): Promise<RepoSourceParsed[]> {
  const db = getDB();
  const query = activeOnly
    ? 'SELECT * FROM repo_sources WHERE is_active = 1 ORDER BY weight DESC'
    : 'SELECT * FROM repo_sources ORDER BY weight DESC';
  const result = await db.prepare(query).all<RepoSource>();
  return result.results.map((r) => ({
    ...r,
    exclude_paths: r.exclude_paths ? JSON.parse(r.exclude_paths) : null,
    default_tags: r.default_tags ? JSON.parse(r.default_tags) : null,
    is_featured: Boolean(r.is_featured),
    is_active: Boolean(r.is_active),
  }));
}

export async function getRepoSourceById(id: string): Promise<RepoSourceParsed | null> {
  const db = getDB();
  const result = await db
    .prepare('SELECT * FROM repo_sources WHERE id = ?')
    .bind(id)
    .first<RepoSource>();
  if (!result) return null;
  return {
    ...result,
    exclude_paths: result.exclude_paths ? JSON.parse(result.exclude_paths) : null,
    default_tags: result.default_tags ? JSON.parse(result.default_tags) : null,
    is_featured: Boolean(result.is_featured),
    is_active: Boolean(result.is_active),
  };
}

// ================================================
// Workflows
// ================================================

interface GetWorkflowsOptions {
  categoryId?: string;
  search?: string;
  tags?: string[];
  sort?: 'popular' | 'recent' | 'downloads' | 'name';
  limit?: number;
  offset?: number;
}

interface GetWorkflowsResult {
  workflows: WorkflowParsed[];
  total: number;
}

export async function getWorkflows(options: GetWorkflowsOptions = {}): Promise<GetWorkflowsResult> {
  const db = getDB();
  const {
    categoryId,
    search,
    tags,
    sort = 'popular',
    limit = 18,
    offset = 0,
  } = options;

  // Build WHERE clauses
  const conditions: string[] = [];
  const params: any[] = [];

  if (categoryId) {
    conditions.push('w.category_id = ?');
    params.push(categoryId);
  }

  if (search) {
    // Use FTS5 for full-text search
    conditions.push('w.rowid IN (SELECT rowid FROM workflows_fts WHERE workflows_fts MATCH ?)');
    params.push(`${search}*`);
  }

  if (tags && tags.length > 0) {
    // Check if any tag matches (SQLite JSON)
    const tagConditions = tags.map(() => "w.tags LIKE ?").join(' OR ');
    conditions.push(`(${tagConditions})`);
    tags.forEach(tag => params.push(`%"${tag}"%`));
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Sort order
  let orderBy: string;
  switch (sort) {
    case 'recent':
      orderBy = 'w.synced_at DESC';
      break;
    case 'downloads':
      orderBy = 'w.download_count DESC';
      break;
    case 'name':
      orderBy = 'w.name ASC';
      break;
    default:
      orderBy = 'w.download_count DESC';
  }

  // Get total count
  const countQuery = `SELECT COUNT(*) as count FROM workflows w ${whereClause}`;
  const countResult = await db.prepare(countQuery).bind(...params).first<{ count: number }>();
  const total = countResult?.count || 0;

  // Get workflows with repo source
  const query = `
    SELECT
      w.*,
      r.name as repo_name,
      r.owner as repo_owner,
      r.repo as repo_repo
    FROM workflows w
    LEFT JOIN repo_sources r ON w.repo_id = r.id
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  const result = await db
    .prepare(query)
    .bind(...params, limit, offset)
    .all<Workflow & { repo_name: string; repo_owner: string; repo_repo: string }>();

  const workflows: WorkflowParsed[] = result.results.map((w) => ({
    ...w,
    tags: JSON.parse(w.tags || '[]'),
    node_types: JSON.parse(w.node_types || '[]'),
    has_knowledge_base: Boolean(w.has_knowledge_base),
    has_tool_nodes: Boolean(w.has_tool_nodes),
    has_valid_positions: Boolean(w.has_valid_positions),
    repo_source: w.repo_name ? {
      name: w.repo_name,
      owner: w.repo_owner,
      repo: w.repo_repo,
    } : null,
  }));

  return { workflows, total };
}

export async function getWorkflowBySlug(slug: string): Promise<WorkflowParsed | null> {
  const db = getDB();
  const result = await db
    .prepare(`
      SELECT
        w.*,
        r.name as repo_name,
        r.owner as repo_owner,
        r.repo as repo_repo
      FROM workflows w
      LEFT JOIN repo_sources r ON w.repo_id = r.id
      WHERE w.slug = ?
    `)
    .bind(slug)
    .first<Workflow & { repo_name: string; repo_owner: string; repo_repo: string }>();

  if (!result) return null;

  return {
    ...result,
    tags: JSON.parse(result.tags || '[]'),
    node_types: JSON.parse(result.node_types || '[]'),
    has_knowledge_base: Boolean(result.has_knowledge_base),
    has_tool_nodes: Boolean(result.has_tool_nodes),
    has_valid_positions: Boolean(result.has_valid_positions),
    repo_source: result.repo_name ? {
      name: result.repo_name,
      owner: result.repo_owner,
      repo: result.repo_repo,
    } : null,
  };
}

export async function getWorkflowById(id: string): Promise<WorkflowParsed | null> {
  const db = getDB();
  const result = await db
    .prepare('SELECT * FROM workflows WHERE id = ?')
    .bind(id)
    .first<Workflow>();

  if (!result) return null;

  return {
    ...result,
    tags: JSON.parse(result.tags || '[]'),
    node_types: JSON.parse(result.node_types || '[]'),
    has_knowledge_base: Boolean(result.has_knowledge_base),
    has_tool_nodes: Boolean(result.has_tool_nodes),
    has_valid_positions: Boolean(result.has_valid_positions),
    repo_source: null,
  };
}

export async function getSimilarWorkflows(workflowId: string, categoryId: string | null, limit = 3): Promise<WorkflowParsed[]> {
  if (!categoryId) return [];

  const db = getDB();
  const result = await db
    .prepare(`
      SELECT * FROM workflows
      WHERE category_id = ? AND id != ?
      ORDER BY download_count DESC
      LIMIT ?
    `)
    .bind(categoryId, workflowId, limit)
    .all<Workflow>();

  return result.results.map((w) => ({
    ...w,
    tags: JSON.parse(w.tags || '[]'),
    node_types: JSON.parse(w.node_types || '[]'),
    has_knowledge_base: Boolean(w.has_knowledge_base),
    has_tool_nodes: Boolean(w.has_tool_nodes),
    has_valid_positions: Boolean(w.has_valid_positions),
    repo_source: null,
  }));
}

export async function getFeaturedWorkflows(limit = 6): Promise<WorkflowParsed[]> {
  const db = getDB();
  const result = await db
    .prepare(`
      SELECT
        w.*,
        r.name as repo_name,
        r.owner as repo_owner,
        r.repo as repo_repo
      FROM workflows w
      LEFT JOIN repo_sources r ON w.repo_id = r.id
      ORDER BY w.download_count DESC
      LIMIT ?
    `)
    .bind(limit)
    .all<Workflow & { repo_name: string; repo_owner: string; repo_repo: string }>();

  return result.results.map((w) => ({
    ...w,
    tags: JSON.parse(w.tags || '[]'),
    node_types: JSON.parse(w.node_types || '[]'),
    has_knowledge_base: Boolean(w.has_knowledge_base),
    has_tool_nodes: Boolean(w.has_tool_nodes),
    has_valid_positions: Boolean(w.has_valid_positions),
    repo_source: w.repo_name ? {
      name: w.repo_name,
      owner: w.repo_owner,
      repo: w.repo_repo,
    } : null,
  }));
}

// ================================================
// Statistics
// ================================================

export async function getWorkflowStats(): Promise<{ total: number; totalDownloads: number }> {
  const db = getDB();
  const result = await db
    .prepare('SELECT COUNT(*) as total, SUM(download_count) as total_downloads FROM workflows')
    .first<{ total: number; total_downloads: number }>();

  return {
    total: result?.total || 0,
    totalDownloads: result?.total_downloads || 0,
  };
}

export async function getCategoryStats(): Promise<Map<string, number>> {
  const db = getDB();
  const result = await db
    .prepare('SELECT category_id, COUNT(*) as count FROM workflows GROUP BY category_id')
    .all<{ category_id: string; count: number }>();

  const map = new Map<string, number>();
  for (const row of result.results) {
    if (row.category_id) {
      map.set(row.category_id, row.count);
    }
  }
  return map;
}

export async function getPopularTags(categoryId?: string, limit = 20): Promise<string[]> {
  const db = getDB();

  const query = categoryId
    ? 'SELECT tags FROM workflows WHERE category_id = ?'
    : 'SELECT tags FROM workflows';

  const result = categoryId
    ? await db.prepare(query).bind(categoryId).all<{ tags: string }>()
    : await db.prepare(query).all<{ tags: string }>();

  const tagCounts = new Map<string, number>();
  for (const row of result.results) {
    const tags = JSON.parse(row.tags || '[]');
    for (const tag of tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}

// ================================================
// Mutations (for sync and tracking)
// ================================================

export async function incrementDownloadCount(workflowId: string): Promise<void> {
  const db = getDB();
  await db
    .prepare('UPDATE workflows SET download_count = download_count + 1 WHERE id = ?')
    .bind(workflowId)
    .run();
}

export async function incrementViewCount(workflowId: string): Promise<void> {
  const db = getDB();
  await db
    .prepare('UPDATE workflows SET view_count = view_count + 1 WHERE id = ?')
    .bind(workflowId)
    .run();
}

export async function incrementFeedbackCount(workflowId: string, type: 'works' | 'broken'): Promise<void> {
  const db = getDB();
  const field = type === 'works' ? 'works_count' : 'broken_count';
  await db
    .prepare(`UPDATE workflows SET ${field} = ${field} + 1 WHERE id = ?`)
    .bind(workflowId)
    .run();
}

export async function insertWorkflowEvent(
  workflowId: string | null,
  eventType: string,
  metadata?: Record<string, any>
): Promise<void> {
  const db = getDB();
  await db
    .prepare(`
      INSERT INTO workflow_events (workflow_id, event_type, metadata, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `)
    .bind(workflowId, eventType, metadata ? JSON.stringify(metadata) : null)
    .run();
}

export async function insertWorkflowFeedback(
  workflowId: string,
  feedbackType: 'works' | 'broken',
  ipAddress?: string
): Promise<void> {
  const db = getDB();
  const id = crypto.randomUUID();
  await db
    .prepare(`
      INSERT INTO workflow_feedback (id, workflow_id, feedback_type, ip_address, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `)
    .bind(id, workflowId, feedbackType, ipAddress || null)
    .run();
}

// ================================================
// Workflow Upsert (for sync)
// ================================================

export interface UpsertWorkflowData {
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
  readme_content?: string | null;
  dify_version?: string | null;
  app_mode?: string | null;
  node_count: number;
  node_types: string[];
  has_knowledge_base: boolean;
  has_tool_nodes: boolean;
  has_valid_positions: boolean;
  github_updated_at?: string | null;
}

export async function upsertWorkflow(data: UpsertWorkflowData): Promise<void> {
  const db = getDB();
  await db
    .prepare(`
      INSERT INTO workflows (
        id, slug, name, description, category_id, tags, repo_id, file_path,
        github_url, raw_url, dsl_content, content_hash, readme_content,
        dify_version, app_mode, node_count, node_types, has_knowledge_base,
        has_tool_nodes, has_valid_positions, github_updated_at, synced_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        description = excluded.description,
        category_id = excluded.category_id,
        tags = excluded.tags,
        file_path = excluded.file_path,
        github_url = excluded.github_url,
        raw_url = excluded.raw_url,
        dsl_content = excluded.dsl_content,
        content_hash = excluded.content_hash,
        readme_content = excluded.readme_content,
        dify_version = excluded.dify_version,
        app_mode = excluded.app_mode,
        node_count = excluded.node_count,
        node_types = excluded.node_types,
        has_knowledge_base = excluded.has_knowledge_base,
        has_tool_nodes = excluded.has_tool_nodes,
        has_valid_positions = excluded.has_valid_positions,
        github_updated_at = excluded.github_updated_at,
        synced_at = datetime('now'),
        updated_at = datetime('now')
    `)
    .bind(
      data.id,
      data.slug,
      data.name,
      data.description,
      data.category_id,
      JSON.stringify(data.tags),
      data.repo_id,
      data.file_path,
      data.github_url,
      data.raw_url,
      data.dsl_content,
      data.content_hash,
      data.readme_content || null,
      data.dify_version || null,
      data.app_mode || null,
      data.node_count,
      JSON.stringify(data.node_types),
      data.has_knowledge_base ? 1 : 0,
      data.has_tool_nodes ? 1 : 0,
      data.has_valid_positions ? 1 : 0,
      data.github_updated_at || null
    )
    .run();
}

export async function getWorkflowByContentHash(contentHash: string): Promise<{ id: string } | null> {
  const db = getDB();
  return db
    .prepare('SELECT id FROM workflows WHERE content_hash = ?')
    .bind(contentHash)
    .first<{ id: string }>();
}

export async function getAllWorkflowSlugs(): Promise<string[]> {
  const db = getDB();
  const result = await db.prepare('SELECT slug FROM workflows').all<{ slug: string }>();
  return result.results.map((r) => r.slug);
}
