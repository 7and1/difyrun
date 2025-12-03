-- DifyRun D1 Database Schema
-- SQLite compatible for Cloudflare D1
-- Version 1.0

-- ================================================
-- 1. TABLES
-- ================================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_cn TEXT,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT NOT NULL DEFAULT 'slate',
    sort_order INTEGER NOT NULL DEFAULT 0,
    workflow_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Repository sources table
CREATE TABLE IF NOT EXISTS repo_sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner TEXT NOT NULL,
    repo TEXT NOT NULL,
    branch TEXT NOT NULL DEFAULT 'main',
    root_path TEXT,
    strategy TEXT NOT NULL DEFAULT 'recursive',
    exclude_paths TEXT, -- JSON array as string
    default_tags TEXT, -- JSON array as string
    weight INTEGER NOT NULL DEFAULT 50,
    is_featured INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    total_workflows INTEGER NOT NULL DEFAULT 0,
    last_synced_at TEXT,
    last_sync_error TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(owner, repo)
);

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT NOT NULL DEFAULT '[]', -- JSON array as string
    repo_id TEXT NOT NULL REFERENCES repo_sources(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    github_url TEXT NOT NULL,
    raw_url TEXT NOT NULL,
    dsl_content TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    readme_content TEXT,
    dify_version TEXT,
    app_mode TEXT,
    node_count INTEGER NOT NULL DEFAULT 0,
    node_types TEXT NOT NULL DEFAULT '[]', -- JSON array as string
    has_knowledge_base INTEGER NOT NULL DEFAULT 0,
    has_tool_nodes INTEGER NOT NULL DEFAULT 0,
    preview_image_url TEXT,
    has_valid_positions INTEGER NOT NULL DEFAULT 1,
    view_count INTEGER NOT NULL DEFAULT 0,
    download_count INTEGER NOT NULL DEFAULT 0,
    works_count INTEGER NOT NULL DEFAULT 0,
    broken_count INTEGER NOT NULL DEFAULT 0,
    github_updated_at TEXT,
    synced_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Workflow events table (for analytics)
CREATE TABLE IF NOT EXISTS workflow_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_id TEXT REFERENCES workflows(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'view', 'download', 'copy', 'search'
    ip_address TEXT,
    user_agent TEXT,
    country TEXT,
    referer TEXT,
    metadata TEXT, -- JSON
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Workflow feedback table
CREATE TABLE IF NOT EXISTS workflow_feedback (
    id TEXT PRIMARY KEY,
    workflow_id TEXT NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    feedback_type TEXT NOT NULL CHECK (feedback_type IN ('works', 'broken')),
    dify_version TEXT,
    comment TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Sync logs table
CREATE TABLE IF NOT EXISTS sync_logs (
    id TEXT PRIMARY KEY,
    repo_id TEXT REFERENCES repo_sources(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
    workflows_added INTEGER NOT NULL DEFAULT 0,
    workflows_updated INTEGER NOT NULL DEFAULT 0,
    workflows_unchanged INTEGER NOT NULL DEFAULT 0,
    workflows_deleted INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    duration_ms INTEGER,
    started_at TEXT NOT NULL DEFAULT (datetime('now')),
    completed_at TEXT
);

-- ================================================
-- 2. INDEXES
-- ================================================

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Workflows indexes
CREATE INDEX IF NOT EXISTS idx_workflows_category ON workflows(category_id);
CREATE INDEX IF NOT EXISTS idx_workflows_repo ON workflows(repo_id);
CREATE INDEX IF NOT EXISTS idx_workflows_slug ON workflows(slug);
CREATE INDEX IF NOT EXISTS idx_workflows_content_hash ON workflows(content_hash);
CREATE INDEX IF NOT EXISTS idx_workflows_downloads ON workflows(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_workflows_views ON workflows(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_workflows_synced ON workflows(synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflows_created ON workflows(created_at DESC);

-- Full-text search (SQLite FTS5)
CREATE VIRTUAL TABLE IF NOT EXISTS workflows_fts USING fts5(
    name,
    description,
    tags,
    content=workflows,
    content_rowid=rowid
);

-- Triggers to keep FTS in sync
CREATE TRIGGER IF NOT EXISTS workflows_ai AFTER INSERT ON workflows BEGIN
    INSERT INTO workflows_fts(rowid, name, description, tags)
    VALUES (NEW.rowid, NEW.name, NEW.description, NEW.tags);
END;

CREATE TRIGGER IF NOT EXISTS workflows_ad AFTER DELETE ON workflows BEGIN
    INSERT INTO workflows_fts(workflows_fts, rowid, name, description, tags)
    VALUES ('delete', OLD.rowid, OLD.name, OLD.description, OLD.tags);
END;

CREATE TRIGGER IF NOT EXISTS workflows_au AFTER UPDATE ON workflows BEGIN
    INSERT INTO workflows_fts(workflows_fts, rowid, name, description, tags)
    VALUES ('delete', OLD.rowid, OLD.name, OLD.description, OLD.tags);
    INSERT INTO workflows_fts(rowid, name, description, tags)
    VALUES (NEW.rowid, NEW.name, NEW.description, NEW.tags);
END;

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_workflow ON workflow_events(workflow_id);
CREATE INDEX IF NOT EXISTS idx_events_created ON workflow_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_type ON workflow_events(event_type);

-- Feedback indexes
CREATE INDEX IF NOT EXISTS idx_feedback_workflow ON workflow_feedback(workflow_id);

-- Sync logs indexes
CREATE INDEX IF NOT EXISTS idx_sync_logs_started ON sync_logs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_repo ON sync_logs(repo_id);

-- ================================================
-- 3. TRIGGERS FOR updated_at
-- ================================================

CREATE TRIGGER IF NOT EXISTS update_categories_updated_at
    AFTER UPDATE ON categories
BEGIN
    UPDATE categories SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_repo_sources_updated_at
    AFTER UPDATE ON repo_sources
BEGIN
    UPDATE repo_sources SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_workflows_updated_at
    AFTER UPDATE ON workflows
BEGIN
    UPDATE workflows SET updated_at = datetime('now') WHERE id = NEW.id;
END;
