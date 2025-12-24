// Sync engine - orchestrates GitHub to D1 synchronization

import {
  getDB,
  getRepoSources,
  getRepoSourceById,
  upsertWorkflow,
  getWorkflowByContentHash,
} from "@/lib/db";
import { fetchFileTree, fetchAllContents, RepoConfig } from "./fetcher";
import {
  parseDslContent,
  calculateContentHash,
  generateSlug,
  inferCategory,
  inferTags,
} from "./parser";

export interface SyncResult {
  success: boolean;
  added: number;
  updated: number;
  unchanged: number;
  deleted: number;
  errors: number;
  duration_ms: number;
  timestamp: string;
}

interface RepoSource {
  id: string;
  name: string;
  owner: string;
  repo: string;
  branch: string;
  root_path: string | null;
  exclude_paths: string[] | null;
  default_tags: string[] | null;
  is_active: boolean;
}

// Sync all active repositories
export async function syncAllWorkflows(): Promise<SyncResult> {
  const startTime = Date.now();
  const db = getDB();

  // Get all active repo sources
  const sources = await getRepoSources(true);

  if (!sources || sources.length === 0) {
    throw new Error("No active repo sources found");
  }

  const totals: SyncResult = {
    success: true,
    added: 0,
    updated: 0,
    unchanged: 0,
    deleted: 0,
    errors: 0,
    duration_ms: 0,
    timestamp: new Date().toISOString(),
  };

  // Sync each repository
  for (const source of sources) {
    try {
      console.log(`Syncing ${source.name} (${source.owner}/${source.repo})...`);

      const result = await syncRepository(source as RepoSource);

      totals.added += result.added;
      totals.updated += result.updated;
      totals.unchanged += result.unchanged;
      totals.errors += result.errors;

      // Update repo source stats
      await db
        .prepare(
          `
          UPDATE repo_sources
          SET last_synced_at = datetime('now'),
              last_sync_error = NULL,
              total_workflows = ?
          WHERE id = ?
        `,
        )
        .bind(result.added + result.updated + result.unchanged, source.id)
        .run();

      console.log(
        `  + ${source.name}: +${result.added} ~${result.updated} =${result.unchanged}`,
      );
    } catch (error) {
      totals.errors++;
      totals.success = false;
      console.error(`  x ${source.name} failed:`, error);

      // Log error to database
      await db
        .prepare(
          `
          UPDATE repo_sources
          SET last_sync_error = ?
          WHERE id = ?
        `,
        )
        .bind(
          error instanceof Error ? error.message : "Unknown error",
          source.id,
        )
        .run();
    }
  }

  totals.duration_ms = Date.now() - startTime;
  totals.timestamp = new Date().toISOString();

  // Update category counts
  await updateCategoryCounts();

  return totals;
}

// Sync a single repository by ID
export async function syncSingleRepo(repoId: string): Promise<SyncResult> {
  const startTime = Date.now();
  const db = getDB();

  const source = await getRepoSourceById(repoId);

  if (!source) {
    throw new Error(`Repository not found: ${repoId}`);
  }

  const result = await syncRepository(source as RepoSource);

  // Update repo source stats
  await db
    .prepare(
      `
      UPDATE repo_sources
      SET last_synced_at = datetime('now'),
          last_sync_error = ?,
          total_workflows = ?
      WHERE id = ?
    `,
    )
    .bind(
      result.errors > 0 ? "Some workflows failed to sync" : null,
      result.added + result.updated + result.unchanged,
      source.id,
    )
    .run();

  // Update category counts
  await updateCategoryCounts();

  return {
    ...result,
    success: result.errors === 0,
    duration_ms: Date.now() - startTime,
    timestamp: new Date().toISOString(),
  };
}

// Sync a repository (internal)
async function syncRepository(
  source: RepoSource,
): Promise<Omit<SyncResult, "success" | "duration_ms" | "timestamp">> {
  const db = getDB();

  const config: RepoConfig = {
    id: source.id,
    owner: source.owner,
    repo: source.repo,
    branch: source.branch,
    rootPath: source.root_path || undefined,
    excludePaths: source.exclude_paths || undefined,
    defaultTags: source.default_tags || undefined,
  };

  const result = {
    added: 0,
    updated: 0,
    unchanged: 0,
    deleted: 0,
    errors: 0,
  };

  // Step 1: Fetch file tree (ONE API call)
  const files = await fetchFileTree(config);
  console.log(`  Found ${files.length} YAML files`);

  if (files.length === 0) {
    return result;
  }

  // Step 2: Fetch all file contents (concurrent with limit)
  const contents = await fetchAllContents(config, files);

  // Step 3: Get existing workflows for this repo (for hash comparison)
  const existingResult = await db
    .prepare("SELECT slug, content_hash FROM workflows WHERE repo_id = ?")
    .bind(source.id)
    .all<{ slug: string; content_hash: string }>();

  const existingHashMap = new Map(
    (existingResult.results || []).map((w) => [w.slug, w.content_hash]),
  );

  // Step 4: Process each file
  for (const [filePath, content] of contents) {
    try {
      const slug = generateSlug(source.id, filePath);
      const contentHash = await calculateContentHash(content);

      // Check if unchanged
      if (existingHashMap.get(slug) === contentHash) {
        result.unchanged++;
        continue;
      }

      // Parse DSL
      const parsed = parseDslContent(content);

      if (!parsed) {
        console.warn(`  Skipping invalid DSL: ${filePath}`);
        result.errors++;
        continue;
      }

      // Extract clean name from filename
      const fileName =
        filePath
          .split("/")
          .pop()
          ?.replace(/\.ya?ml$/i, "") || "Unnamed";
      const displayName =
        parsed.name ||
        fileName.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      // Build workflow record
      const workflowData = {
        id: crypto.randomUUID(),
        slug,
        name: displayName,
        description: parsed.description,
        category_id: inferCategory(filePath, parsed),
        tags: [...(config.defaultTags || []), ...inferTags(filePath, parsed)],
        repo_id: source.id,
        file_path: filePath,
        github_url: `https://github.com/${source.owner}/${source.repo}/blob/${source.branch}/${filePath}`,
        raw_url: `https://raw.githubusercontent.com/${source.owner}/${source.repo}/${source.branch}/${filePath}`,
        dsl_content: content,
        content_hash: contentHash,
        dify_version: parsed.version,
        app_mode: parsed.mode,
        node_count: parsed.nodeCount,
        node_types: parsed.nodeTypes,
        has_knowledge_base: parsed.hasKnowledgeBase,
        has_tool_nodes: parsed.hasToolNodes,
        has_valid_positions: parsed.hasValidPositions,
      };

      // Upsert
      await upsertWorkflow(workflowData);

      if (existingHashMap.has(slug)) {
        result.updated++;
      } else {
        result.added++;
      }
    } catch (error) {
      console.error(`  Error processing ${filePath}:`, error);
      result.errors++;
    }
  }

  return result;
}

// Update category workflow counts
async function updateCategoryCounts(): Promise<void> {
  const db = getDB();

  // Get workflow counts per category using GROUP BY
  const counts = await db
    .prepare(
      "SELECT category_id, COUNT(*) as count FROM workflows GROUP BY category_id",
    )
    .all<{ category_id: string; count: number }>();

  // Update each category
  for (const row of counts.results || []) {
    if (row.category_id) {
      await db
        .prepare("UPDATE categories SET workflow_count = ? WHERE id = ?")
        .bind(row.count, row.category_id)
        .run();
    }
  }
}
