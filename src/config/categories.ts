// Category definitions

export interface CategoryConfig {
  id: string;
  name: string;
  nameCn: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "mcp",
    name: "MCP Server",
    nameCn: "MCP服务",
    slug: "mcp",
    description:
      "Model Context Protocol integrations for connecting Dify to external tools",
    icon: "Plug",
    color: "purple",
    sortOrder: 1,
  },
  {
    id: "agents",
    name: "AI Agents",
    nameCn: "AI智能体",
    slug: "agents",
    description:
      "Autonomous AI agents with reasoning and tool-use capabilities",
    icon: "Bot",
    color: "blue",
    sortOrder: 2,
  },
  {
    id: "rag",
    name: "RAG Pipelines",
    nameCn: "RAG检索",
    slug: "rag",
    description:
      "Retrieval-Augmented Generation workflows for knowledge-based AI",
    icon: "Database",
    color: "green",
    sortOrder: 3,
  },
  {
    id: "chatbots",
    name: "Chatbots",
    nameCn: "聊天机器人",
    slug: "chatbots",
    description: "Conversational AI interfaces and customer support bots",
    icon: "MessageCircle",
    color: "cyan",
    sortOrder: 4,
  },
  {
    id: "content",
    name: "Content Creation",
    nameCn: "内容创作",
    slug: "content",
    description: "AI-powered writing, copywriting, and content generation",
    icon: "PenTool",
    color: "orange",
    sortOrder: 5,
  },
  {
    id: "translation",
    name: "Translation",
    nameCn: "翻译",
    slug: "translation",
    description: "Multi-language translation and localization workflows",
    icon: "Languages",
    color: "pink",
    sortOrder: 6,
  },
  {
    id: "data",
    name: "Data Analysis",
    nameCn: "数据分析",
    slug: "data",
    description: "Data processing, visualization, and analytical workflows",
    icon: "BarChart",
    color: "indigo",
    sortOrder: 7,
  },
  {
    id: "automation",
    name: "Automation",
    nameCn: "自动化",
    slug: "automation",
    description: "Task automation and business process workflows",
    icon: "Zap",
    color: "yellow",
    sortOrder: 8,
  },
  {
    id: "development",
    name: "Development",
    nameCn: "开发工具",
    slug: "development",
    description: "Code generation, review, and developer productivity tools",
    icon: "Code",
    color: "slate",
    sortOrder: 9,
  },
];

export function getCategoryById(id: string): CategoryConfig | undefined {
  return CATEGORIES.find((cat) => cat.id === id);
}

export function getCategoryColor(id: string): string {
  const colors: Record<string, string> = {
    mcp: "bg-purple-500",
    agents: "bg-blue-500",
    rag: "bg-green-500",
    chatbots: "bg-cyan-500",
    content: "bg-orange-500",
    translation: "bg-pink-500",
    data: "bg-indigo-500",
    automation: "bg-yellow-500",
    development: "bg-slate-500",
  };
  return colors[id] || "bg-slate-500";
}

export function getCategoryEmoji(id: string): string {
  const emojis: Record<string, string> = {
    mcp: "🔌",
    agents: "🤖",
    rag: "📚",
    chatbots: "💬",
    content: "✍️",
    translation: "🌐",
    data: "📊",
    automation: "⚡",
    development: "💻",
  };
  return emojis[id] || "📁";
}
