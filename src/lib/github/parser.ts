// DSL parser with defensive Zod validation

import yaml from "js-yaml";
import { z } from "zod";

// CRITICAL: Loose schema with passthrough to handle DSL version changes
const DifyNodeSchema = z
  .object({
    id: z.string(),
    data: z
      .object({
        title: z.string().optional(),
        type: z.string(), // NOT an enum - allow any type
        desc: z.string().optional(),
      })
      .passthrough(), // Allow unknown fields
    position: z
      .object({
        x: z.number(),
        y: z.number(),
      })
      .optional(),
  })
  .passthrough();

const DifyEdgeSchema = z
  .object({
    source: z.string(),
    target: z.string(),
    sourceHandle: z.string().optional(),
    targetHandle: z.string().optional(),
  })
  .passthrough();

const DifyWorkflowSchema = z
  .object({
    nodes: z.array(DifyNodeSchema).optional(),
    edges: z.array(DifyEdgeSchema).optional(),
  })
  .passthrough();

const DifyAppSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional().nullable(),
    mode: z.string().optional(), // 'chat', 'workflow', 'agent', 'completion'
    icon: z.string().optional(),
    icon_background: z.string().optional(),
  })
  .passthrough();

const DifyDslSchema = z
  .object({
    app: DifyAppSchema.optional(),
    workflow: DifyWorkflowSchema.optional(),
    version: z.string().optional(),
    kind: z.string().optional(),
  })
  .passthrough();

export type DifyDsl = z.infer<typeof DifyDslSchema>;

export interface ParsedDsl {
  raw: DifyDsl;
  name: string | null;
  description: string | null;
  mode: string | null;
  version: string | null;
  nodeCount: number;
  nodeTypes: string[];
  hasValidPositions: boolean;
  hasKnowledgeBase: boolean;
  hasToolNodes: boolean;
}

// Check object depth to prevent YAML bombs
function getObjectDepth(obj: any, depth = 0): number {
  if (obj !== Object(obj)) return depth;
  const values = Object.values(obj);
  if (values.length === 0) return depth;
  return Math.max(...values.map((v) => getObjectDepth(v, depth + 1)));
}

// Parse DSL content safely with size and depth limits
export function parseDslContent(content: string): ParsedDsl | null {
  try {
    // Size limit check - prevent YAML bombs (1MB max)
    if (content.length > 1024 * 1024) {
      console.warn("YAML file too large (>1MB)");
      return null;
    }

    // Parse YAML with restricted schema
    const rawYaml = yaml.load(content, {
      schema: yaml.CORE_SCHEMA, // More restrictive than default
      json: false,
      onWarning: (warning) => console.warn("YAML warning:", warning),
    });

    if (!rawYaml || typeof rawYaml !== "object") {
      console.warn("Invalid YAML: not an object");
      return null;
    }

    // Depth check to prevent deeply nested structures
    const maxDepth = 10;
    const depth = getObjectDepth(rawYaml);
    if (depth > maxDepth) {
      console.warn(`YAML structure too deep (${depth} > ${maxDepth})`);
      return null;
    }

    // Validate with Zod (loose parsing)
    const result = DifyDslSchema.safeParse(rawYaml);

    if (!result.success) {
      // Log validation issues but try to continue
      console.warn("DSL validation issues:", result.error.issues);
      // Still try to extract what we can
    }

    const dsl = result.success ? result.data : (rawYaml as DifyDsl);

    // Extract metadata
    const nodes = dsl.workflow?.nodes || [];
    const nodeTypes = new Set<string>();
    let hasValidPositions = true;
    let hasKnowledgeBase = false;
    let hasToolNodes = false;

    for (const node of nodes) {
      const type = node.data?.type;
      if (type) {
        nodeTypes.add(type);

        // Check for knowledge base nodes
        if (type === "knowledge-retrieval" || type === "retrieval") {
          hasKnowledgeBase = true;
        }

        // Check for tool nodes
        if (type === "tool" || type === "http-request" || type === "code") {
          hasToolNodes = true;
        }
      }

      // Check if positions exist
      if (!node.position || (node.position.x === 0 && node.position.y === 0)) {
        hasValidPositions = false;
      }
    }

    return {
      raw: dsl,
      name: dsl.app?.name || null,
      description: dsl.app?.description || null,
      mode: dsl.app?.mode || null,
      version: dsl.version || null,
      nodeCount: nodes.length,
      nodeTypes: Array.from(nodeTypes),
      hasValidPositions,
      hasKnowledgeBase,
      hasToolNodes,
    };
  } catch (error) {
    console.error("Failed to parse DSL:", error);
    return null;
  }
}

// Calculate content hash for change detection (Edge Runtime compatible)
export async function calculateContentHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generate a unique slug from repo and file path
export function generateSlug(repoId: string, filePath: string): string {
  // Extract filename without extension
  const filename =
    filePath
      .split("/")
      .pop()
      ?.replace(/\.ya?ml$/i, "") || "unknown";

  // Clean up the filename
  const cleanName = filename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Combine with repo ID for uniqueness
  return `${repoId}-${cleanName}`;
}

// Infer category from file path and parsed content
export function inferCategory(
  filePath: string,
  parsed: ParsedDsl | null,
): string {
  const pathLower = filePath.toLowerCase();
  const descLower = (parsed?.description || "").toLowerCase();
  const nameLower = (parsed?.name || "").toLowerCase();
  const combined = `${pathLower} ${descLower} ${nameLower}`;

  // MCP related
  if (combined.includes("mcp") || combined.includes("model context protocol")) {
    return "mcp";
  }

  // Agent related
  if (combined.includes("agent") || parsed?.mode === "agent") {
    return "agents";
  }

  // RAG related
  if (
    combined.includes("rag") ||
    combined.includes("retrieval") ||
    combined.includes("knowledge") ||
    parsed?.hasKnowledgeBase
  ) {
    return "rag";
  }

  // Chatbot related
  if (
    combined.includes("chat") ||
    combined.includes("bot") ||
    combined.includes("assistant") ||
    parsed?.mode === "chat"
  ) {
    return "chatbots";
  }

  // Content related
  if (
    combined.includes("content") ||
    combined.includes("write") ||
    combined.includes("seo") ||
    combined.includes("copy") ||
    combined.includes("article") ||
    combined.includes("blog")
  ) {
    return "content";
  }

  // Translation related
  if (
    combined.includes("translat") ||
    combined.includes("language") ||
    combined.includes("multilingual") ||
    combined.includes("i18n")
  ) {
    return "translation";
  }

  // Data related
  if (
    combined.includes("data") ||
    combined.includes("analys") ||
    combined.includes("chart") ||
    combined.includes("csv") ||
    combined.includes("excel") ||
    combined.includes("report")
  ) {
    return "data";
  }

  // Automation related
  if (
    combined.includes("automat") ||
    combined.includes("workflow") ||
    combined.includes("pipeline") ||
    combined.includes("batch") ||
    combined.includes("schedule") ||
    combined.includes("trigger")
  ) {
    return "automation";
  }

  // Development related
  if (
    combined.includes("code") ||
    combined.includes("debug") ||
    combined.includes("develop") ||
    combined.includes("review") ||
    combined.includes("github") ||
    combined.includes("programming")
  ) {
    return "development";
  }

  // Default
  return "automation";
}

// Infer tags from file path and content
export function inferTags(
  filePath: string,
  parsed: ParsedDsl | null,
): string[] {
  const tags: string[] = [];
  const pathLower = filePath.toLowerCase();
  const combined = `${pathLower} ${parsed?.name?.toLowerCase() || ""} ${parsed?.description?.toLowerCase() || ""}`;

  // Extract folder names as potential tags
  const parts = filePath.split("/");
  for (const part of parts.slice(0, -1)) {
    if (part && part.length > 2 && !part.startsWith(".")) {
      // Clean and capitalize
      const cleanPart = part.replace(/[-_]/g, " ").trim();
      if (cleanPart.length > 2 && cleanPart.length < 30) {
        tags.push(cleanPart);
      }
    }
  }

  // Add specific tags based on keywords
  const keywordTags: Record<string, string[]> = {
    // AI Models
    gpt: ["GPT", "OpenAI"],
    claude: ["Claude", "Anthropic"],
    llama: ["Llama", "Meta"],
    gemma: ["Gemma", "Google"],
    gemini: ["Gemini", "Google"],
    openai: ["OpenAI"],

    // Platforms
    slack: ["Slack"],
    discord: ["Discord"],
    telegram: ["Telegram"],
    wechat: ["WeChat"],
    twitter: ["Twitter"],
    youtube: ["YouTube"],
    tiktok: ["TikTok"],

    // Use cases
    seo: ["SEO"],
    email: ["Email"],
    scrape: ["Web Scraping"],
    crawl: ["Web Crawling"],
    search: ["Search"],
    summariz: ["Summarization"],
    extract: ["Extraction"],

    // Content types
    image: ["Image"],
    video: ["Video"],
    audio: ["Audio"],
    pdf: ["PDF"],
    document: ["Documents"],

    // Features
    api: ["API"],
    webhook: ["Webhook"],
    cron: ["Scheduled"],
  };

  for (const [keyword, tagValues] of Object.entries(keywordTags)) {
    if (combined.includes(keyword)) {
      tags.push(...tagValues);
    }
  }

  // Add mode as tag
  if (parsed?.mode) {
    const modeMap: Record<string, string> = {
      chat: "Chat",
      workflow: "Workflow",
      agent: "Agent",
      completion: "Completion",
    };
    const modeTag = modeMap[parsed.mode];
    if (modeTag) {
      tags.push(modeTag);
    }
  }

  // Deduplicate, clean, and limit
  const uniqueTags = [...new Set(tags.map((t) => t.trim()))].filter(
    (t) => t.length > 0,
  );
  return uniqueTags.slice(0, 10);
}
