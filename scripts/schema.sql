-- DifyRun Database Schema
-- Version 3.0 - December 2025
-- Run this in Supabase SQL Editor

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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
    exclude_paths TEXT[],
    default_tags TEXT[],
    weight INTEGER NOT NULL DEFAULT 50,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    total_workflows INTEGER NOT NULL DEFAULT 0,
    last_synced_at TIMESTAMPTZ,
    last_sync_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(owner, repo)
);

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
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
    node_types TEXT[] NOT NULL DEFAULT '{}',
    has_knowledge_base BOOLEAN NOT NULL DEFAULT FALSE,
    has_tool_nodes BOOLEAN NOT NULL DEFAULT FALSE,
    preview_image_url TEXT,
    has_valid_positions BOOLEAN NOT NULL DEFAULT TRUE,
    view_count INTEGER NOT NULL DEFAULT 0,
    download_count INTEGER NOT NULL DEFAULT 0,
    works_count INTEGER NOT NULL DEFAULT 0,
    broken_count INTEGER NOT NULL DEFAULT 0,
    github_updated_at TIMESTAMPTZ,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workflow events table (for analytics)
CREATE TABLE IF NOT EXISTS workflow_events (
    id BIGSERIAL PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'view', 'download', 'copy', 'search', 'category_view'
    ip_address TEXT,
    user_agent TEXT,
    country TEXT,
    referer TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workflow feedback table
CREATE TABLE IF NOT EXISTS workflow_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    feedback_type TEXT NOT NULL CHECK (feedback_type IN ('works', 'broken')),
    dify_version TEXT,
    comment TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sync logs table
CREATE TABLE IF NOT EXISTS sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id TEXT REFERENCES repo_sources(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
    workflows_added INTEGER NOT NULL DEFAULT 0,
    workflows_updated INTEGER NOT NULL DEFAULT 0,
    workflows_unchanged INTEGER NOT NULL DEFAULT 0,
    workflows_deleted INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    duration_ms INTEGER,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
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

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_workflows_search ON workflows USING gin(
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
);

-- Tags search index
CREATE INDEX IF NOT EXISTS idx_workflows_tags ON workflows USING gin(tags);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_workflow ON workflow_events(workflow_id);
CREATE INDEX IF NOT EXISTS idx_events_created ON workflow_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_type ON workflow_events(event_type);

-- Feedback indexes
CREATE INDEX IF NOT EXISTS idx_feedback_workflow ON workflow_feedback(workflow_id);
CREATE INDEX IF NOT EXISTS idx_feedback_ip ON workflow_feedback(ip_hash, created_at);

-- Sync logs indexes
CREATE INDEX IF NOT EXISTS idx_sync_logs_started ON sync_logs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_repo ON sync_logs(repo_id);

-- ================================================
-- 3. FUNCTIONS
-- ================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Increment workflow stat function
CREATE OR REPLACE FUNCTION increment_workflow_stat(
    p_workflow_id UUID,
    p_stat_name TEXT,
    p_increment INTEGER DEFAULT 1
)
RETURNS void AS $$
BEGIN
    EXECUTE format(
        'UPDATE workflows SET %I = %I + $1 WHERE id = $2',
        p_stat_name,
        p_stat_name
    ) USING p_increment, p_workflow_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update category workflow counts
CREATE OR REPLACE FUNCTION update_category_counts()
RETURNS void AS $$
BEGIN
    UPDATE categories c
    SET workflow_count = (
        SELECT COUNT(*) FROM workflows w WHERE w.category_id = c.id
    );
END;
$$ LANGUAGE plpgsql;

-- Update repo source workflow counts
CREATE OR REPLACE FUNCTION update_repo_counts()
RETURNS void AS $$
BEGIN
    UPDATE repo_sources r
    SET total_workflows = (
        SELECT COUNT(*) FROM workflows w WHERE w.repo_id = r.id
    );
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- 4. TRIGGERS
-- ================================================

-- Update timestamps
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_repo_sources_updated_at ON repo_sources;
CREATE TRIGGER update_repo_sources_updated_at
    BEFORE UPDATE ON repo_sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_workflows_updated_at ON workflows;
CREATE TRIGGER update_workflows_updated_at
    BEFORE UPDATE ON workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================
-- 5. VIEWS
-- ================================================

-- Category statistics view
CREATE OR REPLACE VIEW category_stats AS
SELECT
    c.id,
    c.name,
    c.name_cn,
    c.slug,
    c.description,
    c.icon,
    c.color,
    c.sort_order,
    c.workflow_count,
    COALESCE(SUM(w.download_count), 0)::BIGINT as total_downloads,
    COALESCE(SUM(w.view_count), 0)::BIGINT as total_views
FROM categories c
LEFT JOIN workflows w ON w.category_id = c.id
GROUP BY c.id
ORDER BY c.sort_order;

-- ================================================
-- 6. ROW LEVEL SECURITY
-- ================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE repo_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON repo_sources FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON workflows FOR SELECT USING (true);

-- Events and feedback: public insert, no select
CREATE POLICY "Public insert" ON workflow_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert" ON workflow_feedback FOR INSERT WITH CHECK (true);

-- Service role only for admin operations
CREATE POLICY "Service role access" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role access" ON repo_sources FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role access" ON workflows FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role access" ON sync_logs FOR ALL USING (auth.role() = 'service_role');

-- ================================================
-- 7. SEED DATA - CATEGORIES
-- ================================================

INSERT INTO categories (id, name, name_cn, slug, description, icon, color, sort_order)
VALUES
    ('mcp', 'MCP Server', 'MCP服务', 'mcp', 'Model Context Protocol integrations for connecting Dify to external tools', 'Plug', 'purple', 1),
    ('agents', 'AI Agents', 'AI智能体', 'agents', 'Autonomous AI agents with reasoning and tool-use capabilities', 'Bot', 'blue', 2),
    ('rag', 'RAG Pipelines', 'RAG检索', 'rag', 'Retrieval-Augmented Generation workflows for knowledge-based AI', 'Database', 'green', 3),
    ('chatbots', 'Chatbots', '聊天机器人', 'chatbots', 'Conversational AI interfaces and customer support bots', 'MessageCircle', 'cyan', 4),
    ('content', 'Content Creation', '内容创作', 'content', 'AI-powered writing, copywriting, and content generation', 'PenTool', 'orange', 5),
    ('translation', 'Translation', '翻译', 'translation', 'Multi-language translation and localization workflows', 'Languages', 'pink', 6),
    ('data', 'Data Analysis', '数据分析', 'data', 'Data processing, visualization, and analytical workflows', 'BarChart', 'indigo', 7),
    ('automation', 'Automation', '自动化', 'automation', 'Task automation and business process workflows', 'Zap', 'yellow', 8),
    ('development', 'Development', '开发工具', 'development', 'Code generation, review, and developer productivity tools', 'Code', 'slate', 9)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    name_cn = EXCLUDED.name_cn,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    sort_order = EXCLUDED.sort_order;

-- ================================================
-- 8. SEED DATA - REPOSITORY SOURCES
-- ================================================

INSERT INTO repo_sources (id, name, description, owner, repo, branch, root_path, strategy, exclude_paths, default_tags, weight, is_featured, is_active)
VALUES
    ('svcvit-main', 'Awesome Dify Workflow', 'The most comprehensive community collection - 3000+ stars', 'svcvit', 'Awesome-Dify-Workflow', 'main', 'DSL', 'recursive', ARRAY['README.md', 'LICENSE', '.github', 'docs'], ARRAY['Community Pick', 'Most Popular'], 100, true, true),
    ('zhouhui', 'Dify for DSL', 'Sora, TTS, RSS, and specialized workflows', 'wwwzhouhui', 'dify-for-dsl', 'master', NULL, 'recursive', ARRAY['README.md', 'LICENSE'], ARRAY['Advanced', 'Video AI', 'TTS'], 85, true, true),
    ('shamspias', 'Awesome Dify Agents', 'Curated chatflows, agents, and RAG templates', 'shamspias', 'awesome-dify-agents', 'main', 'flows', 'recursive', NULL, ARRAY['Agents', 'RAG', 'Chatbots'], 80, false, true),
    ('bannylon', 'DifyAIA', 'Beginner-friendly workflows from Bilibili creator', 'BannyLon', 'DifyAIA', 'main', NULL, 'recursive', NULL, ARRAY['Beginner', 'Chinese Content', 'Bilibili'], 75, false, true),
    ('winson', 'Dify DSL Collection', 'Document query and utility workflows', 'Winson-030', 'dify-DSL', 'main', NULL, 'flat', NULL, ARRAY['Utilities', 'Documents'], 70, false, true),
    ('pgshen', 'PGshen Templates', 'High-quality application templates', 'PGshen', 'dify-app-template', 'main', NULL, 'recursive', NULL, ARRAY['Apps', 'Production Ready'], 65, false, true),
    ('tomatio', 'Workflow Generator', 'Meta-prompts for generating Dify workflows', 'Tomatio13', 'DifyWorkFlowGenerator', 'main', NULL, 'recursive', NULL, ARRAY['Meta', 'Generator', 'Japanese'], 60, false, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    owner = EXCLUDED.owner,
    repo = EXCLUDED.repo,
    branch = EXCLUDED.branch,
    root_path = EXCLUDED.root_path,
    strategy = EXCLUDED.strategy,
    exclude_paths = EXCLUDED.exclude_paths,
    default_tags = EXCLUDED.default_tags,
    weight = EXCLUDED.weight,
    is_featured = EXCLUDED.is_featured,
    is_active = EXCLUDED.is_active;

-- ================================================
-- 9. GRANT PERMISSIONS
-- ================================================

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant select on public tables
GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON repo_sources TO anon, authenticated;
GRANT SELECT ON workflows TO anon, authenticated;
GRANT SELECT ON category_stats TO anon, authenticated;

-- Grant insert on events and feedback
GRANT INSERT ON workflow_events TO anon, authenticated;
GRANT INSERT ON workflow_feedback TO anon, authenticated;

-- Grant all to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ================================================
-- 10. RPC FUNCTIONS FOR CLIENT USE
-- ================================================

-- Increment download count (called from server action)
CREATE OR REPLACE FUNCTION increment_download_count(workflow_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE workflows
    SET download_count = download_count + 1
    WHERE id = workflow_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment feedback count (works or broken)
CREATE OR REPLACE FUNCTION increment_feedback_count(workflow_id UUID, field_name TEXT)
RETURNS VOID AS $$
BEGIN
    IF field_name = 'works_count' THEN
        UPDATE workflows
        SET works_count = works_count + 1
        WHERE id = workflow_id;
    ELSIF field_name = 'broken_count' THEN
        UPDATE workflows
        SET broken_count = broken_count + 1
        WHERE id = workflow_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment view count
CREATE OR REPLACE FUNCTION increment_view_count(workflow_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE workflows
    SET view_count = view_count + 1
    WHERE id = workflow_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_download_count(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_feedback_count(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO anon, authenticated;

-- Done!
SELECT 'Schema setup complete!' AS message;
