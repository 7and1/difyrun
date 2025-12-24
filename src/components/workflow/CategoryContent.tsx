"use client";

import {
  BookOpen,
  Zap,
  Bot,
  Database,
  Code2,
  MessageSquare,
  Wrench,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface CategoryContentProps {
  categoryId: string;
  categoryName: string;
}

const categoryContent: Record<
  string,
  {
    icon: React.ReactNode;
    intro: string;
    whatIs: string;
    whyUse: string[];
    useCases: { title: string; description: string }[];
    tips: string[];
    relatedCategories: string[];
  }
> = {
  rag: {
    icon: <Database className="h-5 w-5 text-white" />,
    intro: `Let me break down RAG in the simplest terms possible. You know how ChatGPT is incredibly
smart but knows nothing about your company? It can't tell you about your internal policies,
your product documentation, or last quarter's sales data. That's the problem RAG solves.`,
    whatIs: `RAG stands for Retrieval-Augmented Generation — but forget the jargon. Here's what
actually happens: Before the AI answers your question, it first searches through YOUR documents
to find relevant information. Then it uses that context to give you an accurate answer. It's like
giving ChatGPT a library card to your company's knowledge base. The AI doesn't just make stuff up
anymore — it pulls from real documents you've uploaded.`,
    whyUse: [
      "Answers questions using your actual company data, not general internet knowledge",
      "Reduces AI hallucinations by grounding responses in real documents",
      "Works with any file type: PDFs, Word docs, web pages, even Notion exports",
      "Keeps your data private — documents stay in your Dify instance",
    ],
    useCases: [
      {
        title: "Internal Knowledge Base",
        description:
          "Let employees ask questions about company policies, procedures, and documentation",
      },
      {
        title: "Customer Support Bot",
        description:
          "Answer customer questions using your product documentation and FAQ",
      },
      {
        title: "Research Assistant",
        description:
          "Query hundreds of papers or reports and get synthesized answers",
      },
      {
        title: "Legal Document Analysis",
        description:
          "Find relevant clauses and precedents across contract libraries",
      },
    ],
    tips: [
      "Start with clean, well-structured documents — garbage in, garbage out",
      "Use Dify's built-in chunking, but consider custom chunk sizes for technical docs",
      "Test retrieval before worrying about generation quality",
      "Enable hybrid search (keyword + semantic) for best results",
    ],
    relatedCategories: ["agents", "chatbots", "automation"],
  },
  agents: {
    icon: <Bot className="h-5 w-5 text-white" />,
    intro: `Regular chatbots answer questions. Agents take action. That's the fundamental difference.
An agent can browse the web, call APIs, execute code, and make decisions — all without you babysitting
every step. Think of it as the difference between a library assistant who answers questions vs. a
research assistant who goes out, finds information, and writes the report.`,
    whatIs: `In Dify, an Agent is a workflow that can use "tools" — external capabilities like web search,
code execution, or API calls. The magic is in the loop: the AI decides which tool to use, sees the
result, then decides what to do next. It might search the web, analyze the results, search again with
refined keywords, and then synthesize an answer. All autonomously.`,
    whyUse: [
      "Automates multi-step tasks that would take humans hours",
      "Can access real-time data from the web and APIs",
      "Makes decisions based on intermediate results",
      "Handles complex research and analysis workflows",
    ],
    useCases: [
      {
        title: "Deep Research Agent",
        description:
          "Searches multiple sources, synthesizes findings, and produces reports",
      },
      {
        title: "Code Review Agent",
        description: "Analyzes code, runs tests, and suggests improvements",
      },
      {
        title: "Sales Lead Qualifier",
        description:
          "Researches companies, scores leads, and drafts personalized outreach",
      },
      {
        title: "Content Creator",
        description:
          "Researches topics, outlines articles, and drafts content with citations",
      },
    ],
    tips: [
      "Start simple — one or two tools max — then add complexity",
      "Always set iteration limits to prevent runaway loops",
      "Log each step for debugging and improvement",
      "Consider cost: each tool call uses tokens",
    ],
    relatedCategories: ["mcp", "automation", "rag"],
  },
  mcp: {
    icon: <Zap className="h-5 w-5 text-white" />,
    intro: `Remember when every phone had a different charger? Travel meant carrying five cables.
Then USB-C came along and standardized everything. MCP (Model Context Protocol) is doing the same
thing for AI. It's Anthropic's open standard that lets any AI model connect to any tool using
the same interface.`,
    whatIs: `MCP defines how AI models talk to external tools. Instead of writing custom code for every
integration, you use a standard protocol. This means the same MCP server works with Claude, GPT-4,
Dify, Cursor, and any other MCP-compatible client. Dify added full MCP support in v1.6.0, which
unlocks access to thousands of tools — including Zapier's 7,000+ app integrations.`,
    whyUse: [
      "Access 7,000+ apps through Zapier MCP without custom code",
      "Build once, use everywhere — MCP servers work across AI platforms",
      "Publish your Dify agents as MCP endpoints for Claude Desktop",
      "Future-proof your integrations as the ecosystem grows",
    ],
    useCases: [
      {
        title: "Zapier Integration",
        description:
          "Connect to CRM, email, calendar, and thousands of other apps",
      },
      {
        title: "Database Access",
        description:
          "Query PostgreSQL, MySQL, or MongoDB directly from workflows",
      },
      {
        title: "File System Tools",
        description: "Read, write, and manipulate files on your server",
      },
      {
        title: "Custom API Bridge",
        description: "Expose any REST API as an MCP tool for AI consumption",
      },
    ],
    tips: [
      "Start with official MCP servers from the ModelContextProtocol org",
      "Test MCP connections locally before deploying to production",
      "Implement proper error handling — MCP calls can fail",
      "Consider security: MCP servers have access to external systems",
    ],
    relatedCategories: ["agents", "automation", "api"],
  },
  automation: {
    icon: <Wrench className="h-5 w-5 text-white" />,
    intro: `Here's a dirty secret about AI: the fancy chatbots get all the attention, but automation
workflows do the real work. These are the behind-the-scenes processes that handle data, generate
content, process files, and keep your business running without human intervention.`,
    whatIs: `Automation workflows in Dify are designed to run without a chat interface. They're triggered
by events, schedules, or API calls, and they execute a series of AI-powered steps. Think: every
morning at 8 AM, summarize yesterday's support tickets and send a report to Slack. Or: when a new
document lands in this folder, extract key data and update the spreadsheet.`,
    whyUse: [
      "Process thousands of items without manual intervention",
      "Consistent results every time — no human error",
      "Runs on schedule or triggered by events",
      "Scales without adding headcount",
    ],
    useCases: [
      {
        title: "Content Generation",
        description:
          "Generate social posts, email drafts, or product descriptions at scale",
      },
      {
        title: "Data Processing",
        description: "Extract, transform, and load data with AI assistance",
      },
      {
        title: "Document Handling",
        description:
          "Summarize, categorize, or translate documents automatically",
      },
      {
        title: "Monitoring & Alerts",
        description:
          "Watch data sources and trigger actions based on conditions",
      },
    ],
    tips: [
      "Build idempotent workflows — running twice shouldn't break things",
      "Implement proper logging for debugging automation issues",
      "Set up alerts for failures so you know when things break",
      "Start with low volume and scale up after validation",
    ],
    relatedCategories: ["rag", "agents", "api"],
  },
  chatbots: {
    icon: <MessageSquare className="h-5 w-5 text-white" />,
    intro: `Chatbots are the most visible AI application, but most are terrible. They give generic
answers, don't understand context, and frustrate users. The difference between a bad chatbot and
a great one isn't the model — it's the workflow behind it.`,
    whatIs: `In Dify, a chatbot is a workflow with a conversational interface. But unlike basic chatbots,
you can add knowledge bases for accurate answers, tools for taking action, and conditional logic
for handling different scenarios. The visual workflow editor lets you see exactly how your chatbot
makes decisions.`,
    whyUse: [
      "Provide 24/7 support without human agents",
      "Scale conversations without increasing staff",
      "Maintain consistent brand voice across all interactions",
      "Handle routine queries so humans focus on complex issues",
    ],
    useCases: [
      {
        title: "Customer Support",
        description:
          "Answer FAQs, troubleshoot issues, and escalate when needed",
      },
      {
        title: "Lead Qualification",
        description:
          "Engage website visitors and collect information before sales handoff",
      },
      {
        title: "Internal IT Help Desk",
        description: "Reset passwords, answer policy questions, submit tickets",
      },
      {
        title: "Product Recommendations",
        description:
          "Help customers find the right product based on their needs",
      },
    ],
    tips: [
      "Always provide an escape hatch to human support",
      "Use conversation memory wisely — not everything needs to be remembered",
      "Test with real user questions, not just your imagined scenarios",
      "Track which questions lead to handoffs and improve those areas",
    ],
    relatedCategories: ["rag", "agents", "support"],
  },
  api: {
    icon: <Code2 className="h-5 w-5 text-white" />,
    intro: `Most Dify workflows end up being called from other applications. That internal customer
support bot? It's accessed via API from your mobile app. The document summarizer? Integrated into
your existing document management system. API-ready workflows are the building blocks of AI-powered
applications.`,
    whatIs: `Every Dify workflow can be exposed as an API endpoint. This means you build the workflow
visually, test it in Dify's interface, and then call it from anywhere — your web app, mobile app,
backend service, or even a simple curl command. API workflows are designed for integration, not
direct user interaction.`,
    whyUse: [
      "Integrate AI capabilities into existing applications",
      "Build once in Dify, use anywhere via standard HTTP",
      "Version and manage AI logic separate from application code",
      "Scale independently of your main application",
    ],
    useCases: [
      {
        title: "Text Enhancement API",
        description:
          "Grammar correction, summarization, or translation as a service",
      },
      {
        title: "Document Processing API",
        description: "Extract data from invoices, receipts, or contracts",
      },
      {
        title: "Content Moderation",
        description: "Check user-generated content before publishing",
      },
      {
        title: "Recommendation Engine",
        description: "Get personalized suggestions based on user data",
      },
    ],
    tips: [
      "Design for latency — API consumers expect fast responses",
      "Implement rate limiting to prevent abuse",
      "Return structured JSON for easy integration",
      "Include proper error codes and messages",
    ],
    relatedCategories: ["automation", "mcp", "chatbots"],
  },
};

// Fallback content for categories not explicitly defined
const defaultContent = {
  icon: <Lightbulb className="h-5 w-5 text-white" />,
  intro: `This category contains specialized Dify workflow templates curated from the community.
Each template has been tested and documented to help you get started quickly.`,
  whatIs: `These workflows represent best practices from the Dify community. They're designed to
be starting points that you can customize for your specific needs. Each template includes visual
previews so you can understand the structure before downloading.`,
  whyUse: [
    "Save hours of development time with proven templates",
    "Learn from community best practices",
    "Customize and extend for your specific use case",
    "Compatible with Dify v1.6+ features",
  ],
  useCases: [
    {
      title: "Quick Prototyping",
      description: "Start with a working template and modify to fit your needs",
    },
    {
      title: "Learning Dify",
      description: "Study well-designed workflows to understand Dify patterns",
    },
    {
      title: "Production Deployment",
      description: "Use battle-tested templates as a foundation for production",
    },
  ],
  tips: [
    "Preview the workflow before downloading to understand its structure",
    "Check the node count — simpler workflows are easier to customize",
    "Read the source repository for additional documentation",
    'Vote "Works" or "Broken" after testing to help the community',
  ],
  relatedCategories: ["rag", "agents", "automation"],
};

export function CategoryContent({
  categoryId,
  categoryName,
}: CategoryContentProps) {
  const content = categoryContent[categoryId] || defaultContent;

  return (
    <section className="mt-16 pt-16 border-t">
      <div className="space-y-10">
        {/* Introduction */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              {content.icon}
            </div>
            <h2 className="text-2xl font-bold">
              Understanding {categoryName} Workflows
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {content.intro}
          </p>
        </div>

        {/* What Is Section */}
        <div className="bg-muted/30 rounded-2xl p-6 lg:p-8 border">
          <h3 className="text-xl font-semibold mb-4">What Exactly Is This?</h3>
          <p className="text-muted-foreground leading-relaxed">
            {content.whatIs}
          </p>
        </div>

        {/* Why Use & Use Cases Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Why Use */}
          <div className="bg-background rounded-xl border p-6">
            <h3 className="text-lg font-semibold mb-4">
              Why Use {categoryName} Templates?
            </h3>
            <ul className="space-y-3">
              {content.whyUse.map((reason, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {reason}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Use Cases */}
          <div className="bg-background rounded-xl border p-6">
            <h3 className="text-lg font-semibold mb-4">Common Use Cases</h3>
            <div className="space-y-4">
              {content.useCases.map((useCase, i) => (
                <div key={i} className="flex items-start gap-3">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-1 shrink-0" />
                  <div>
                    <span className="font-medium text-sm">{useCase.title}</span>
                    <p className="text-xs text-muted-foreground">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 lg:p-8 border">
          <h3 className="text-xl font-semibold mb-4">
            Pro Tips for {categoryName}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {content.tips.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-background/50 rounded-lg"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started CTA */}
        <div className="text-center py-6">
          <p className="text-muted-foreground mb-4">
            Browse the templates above and find the perfect starting point for
            your project. Every template is free to download and customize.
          </p>
          <a
            href="/docs/import-workflow"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Learn how to import workflows into Dify
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
