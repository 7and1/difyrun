-- DifyRun D1 Seed Data
-- Categories and Repository Sources

-- ================================================
-- CATEGORIES
-- ================================================

INSERT OR REPLACE INTO categories (id, name, name_cn, slug, description, icon, color, sort_order)
VALUES
    ('mcp', 'MCP Server', 'MCP服务', 'mcp', 'Model Context Protocol integrations for connecting Dify to external tools', 'Plug', 'purple', 1),
    ('agents', 'AI Agents', 'AI智能体', 'agents', 'Autonomous AI agents with reasoning and tool-use capabilities', 'Bot', 'blue', 2),
    ('rag', 'RAG Pipelines', 'RAG检索', 'rag', 'Retrieval-Augmented Generation workflows for knowledge-based AI', 'Database', 'green', 3),
    ('chatbots', 'Chatbots', '聊天机器人', 'chatbots', 'Conversational AI interfaces and customer support bots', 'MessageCircle', 'cyan', 4),
    ('content', 'Content Creation', '内容创作', 'content', 'AI-powered writing, copywriting, and content generation', 'PenTool', 'orange', 5),
    ('translation', 'Translation', '翻译', 'translation', 'Multi-language translation and localization workflows', 'Languages', 'pink', 6),
    ('data', 'Data Analysis', '数据分析', 'data', 'Data processing, visualization, and analytical workflows', 'BarChart', 'indigo', 7),
    ('automation', 'Automation', '自动化', 'automation', 'Task automation and business process workflows', 'Zap', 'yellow', 8),
    ('development', 'Development', '开发工具', 'development', 'Code generation, review, and developer productivity tools', 'Code', 'slate', 9);

-- ================================================
-- REPOSITORY SOURCES
-- ================================================

INSERT OR REPLACE INTO repo_sources (id, name, description, owner, repo, branch, root_path, strategy, exclude_paths, default_tags, weight, is_featured, is_active)
VALUES
    ('svcvit-main', 'Awesome Dify Workflow', 'The most comprehensive community collection - 3000+ stars', 'svcvit', 'Awesome-Dify-Workflow', 'main', 'DSL', 'recursive', '["README.md", "LICENSE", ".github", "docs"]', '["Community Pick", "Most Popular"]', 100, 1, 1),
    ('zhouhui', 'Dify for DSL', 'Sora, TTS, RSS, and specialized workflows', 'wwwzhouhui', 'dify-for-dsl', 'master', NULL, 'recursive', '["README.md", "LICENSE"]', '["Advanced", "Video AI", "TTS"]', 85, 1, 1),
    ('shamspias', 'Awesome Dify Agents', 'Curated chatflows, agents, and RAG templates', 'shamspias', 'awesome-dify-agents', 'main', 'flows', 'recursive', NULL, '["Agents", "RAG", "Chatbots"]', 80, 0, 1),
    ('bannylon', 'DifyAIA', 'Beginner-friendly workflows from Bilibili creator', 'BannyLon', 'DifyAIA', 'main', NULL, 'recursive', NULL, '["Beginner", "Chinese Content", "Bilibili"]', 75, 0, 1),
    ('winson', 'Dify DSL Collection', 'Document query and utility workflows', 'Winson-030', 'dify-DSL', 'main', NULL, 'flat', NULL, '["Utilities", "Documents"]', 70, 0, 1),
    ('pgshen', 'PGshen Templates', 'High-quality application templates', 'PGshen', 'dify-app-template', 'main', NULL, 'recursive', NULL, '["Apps", "Production Ready"]', 65, 0, 1),
    ('tomatio', 'Workflow Generator', 'Meta-prompts for generating Dify workflows', 'Tomatio13', 'DifyWorkFlowGenerator', 'main', NULL, 'recursive', NULL, '["Meta", "Generator", "Japanese"]', 60, 0, 1);
