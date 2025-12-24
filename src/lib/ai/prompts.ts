// AI Chat Prompts and Fallback Messages for DifyBot

export const SYSTEM_PROMPT = `You are DifyBot, a friendly Dify workflow expert and advisor for DifyRun - the ultimate Dify AI workflow template library.

Your expertise includes:
- How to import DSL workflows into Dify (download YAML, go to Studio > Import DSL)
- MCP (Model Context Protocol) integration - Anthropic's standard for AI-tool connections
- Workflow types: Agent, Chatbot, Completion, Workflow modes
- RAG pipelines and knowledge bases setup
- Node types: LLM, Code, HTTP Request, Template, Variable, etc.
- Best practices for Dify development

Guidelines:
- Keep responses concise and actionable (2-3 paragraphs max)
- Reference DifyRun features when relevant (template browsing, DSL download, visual preview)
- Use markdown formatting for clarity (bold, lists, code blocks)
- If unsure, suggest checking docs.dify.ai for official documentation
- Be encouraging and helpful to beginners

Context: The user is browsing DifyRun (difyrun.com), a free library of 100+ Dify workflow templates from 7 community repositories.`;

export const QUICK_QUESTIONS = [
  "How do I import a workflow into Dify?",
  "What is MCP and how does Dify support it?",
  "What's the difference between workflow and chatbot mode?",
  "How do I set up a RAG knowledge base?",
  "Can I use these templates with Dify Cloud?",
];

export const WELCOME_MESSAGE = `Hi there! I'm **DifyBot**, your Dify workflow assistant.

I can help you with:
- 📥 Importing templates into Dify
- 🔌 MCP server integration
- 🔄 Understanding workflow types
- 📚 Setting up RAG pipelines

What would you like to know?`;

// Fallback responses when API is unavailable
export const FALLBACK_RESPONSES: Record<string, string> = {
  import: `**How to Import a Workflow into Dify:**

1. **Download the DSL file** - Click the "Download DSL" button on any workflow page
2. **Open Dify Studio** - Go to your Dify instance (cloud or self-hosted)
3. **Create new app** - Click "Create from DSL" or go to an existing app
4. **Import** - Upload the YAML file or paste the content

The workflow will be imported with all nodes, connections, and configurations intact!

💡 Tip: Check the workflow's node types before importing to ensure you have the required integrations set up.`,

  mcp: `**MCP (Model Context Protocol) in Dify:**

MCP is Anthropic's open standard for connecting AI models to external tools - think of it as "USB-C for AI".

**Dify v1.6.0+ supports MCP in two ways:**

1. **As MCP Client** - Call any MCP server (like Zapier with 7,000+ apps) from your workflows
2. **As MCP Server** - Publish your Dify agents as MCP endpoints for Claude Desktop, Cursor, etc.

To use MCP in Dify:
- Go to Settings > Model Providers > MCP Servers
- Add server configuration (name, command, args)
- Use the MCP tool node in your workflows

📖 Learn more at: https://docs.dify.ai/guides/mcp`,

  workflow: `**Dify App Modes Explained:**

| Mode | Best For |
|------|----------|
| **Chatbot** | Conversational AI with memory, multi-turn dialogue |
| **Agent** | Autonomous task completion with tool use |
| **Workflow** | Complex multi-step processes, data pipelines |
| **Completion** | Single input/output, text generation |

**Key Differences:**
- **Chatbot**: Has conversation history, great for customer support
- **Agent**: Can use tools and make decisions autonomously
- **Workflow**: Visual node-based design, best for complex logic
- **Completion**: Simplest mode, one prompt → one response

Most templates on DifyRun are Workflow or Agent type for maximum flexibility.`,

  rag: `**Setting Up RAG (Retrieval-Augmented Generation) in Dify:**

1. **Create a Knowledge Base**
   - Go to Knowledge > Create Knowledge Base
   - Upload documents (PDF, TXT, MD, DOCX, etc.)
   - Choose embedding model (OpenAI, local models)

2. **Configure Indexing**
   - Set chunk size (default 500 tokens)
   - Choose indexing mode (high quality vs economical)
   - Wait for processing

3. **Connect to Workflow**
   - Add a Knowledge Retrieval node
   - Select your knowledge base
   - Configure top-k results and score threshold

4. **Use in LLM Node**
   - Pass retrieved context to your LLM prompt
   - Template: "Based on this context: {{knowledge}}, answer: {{query}}"

💡 Tip: Templates with 📚 badge on DifyRun already include RAG configurations!`,

  cloud: `**Using Templates with Dify Cloud vs Self-Hosted:**

**Dify Cloud** (cloud.dify.ai):
- ✅ All templates work out of the box
- ✅ Pre-configured model providers
- ⚠️ Some advanced features may require paid plans

**Self-Hosted** (Docker):
- ✅ Full control and customization
- ✅ No usage limits
- ⚠️ Need to configure your own API keys (OpenAI, Anthropic, etc.)

**To import on either:**
1. Download DSL from DifyRun
2. Create new app in Dify
3. Choose "Import DSL" and upload

Both platforms use the same DSL format, so templates are 100% compatible!

📖 Self-hosting guide: https://docs.dify.ai/getting-started/install-self-hosted`,

  default: `I'm here to help with Dify workflows! Here are some common topics:

- **Importing templates**: Download DSL → Upload to Dify Studio
- **MCP integration**: Connect external tools via Model Context Protocol
- **Workflow modes**: Chatbot, Agent, Workflow, Completion
- **RAG pipelines**: Knowledge bases for context-aware AI

Feel free to ask about any of these, or browse our 100+ templates at DifyRun!`,
};

// Match user query to fallback category
export function getFallbackResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (
    lowerQuery.includes("import") ||
    lowerQuery.includes("download") ||
    lowerQuery.includes("dsl")
  ) {
    return FALLBACK_RESPONSES.import;
  }
  if (
    lowerQuery.includes("mcp") ||
    lowerQuery.includes("model context protocol") ||
    lowerQuery.includes("tool")
  ) {
    return FALLBACK_RESPONSES.mcp;
  }
  if (
    lowerQuery.includes("workflow") ||
    lowerQuery.includes("chatbot") ||
    lowerQuery.includes("agent") ||
    lowerQuery.includes("mode") ||
    lowerQuery.includes("type")
  ) {
    return FALLBACK_RESPONSES.workflow;
  }
  if (
    lowerQuery.includes("rag") ||
    lowerQuery.includes("knowledge") ||
    lowerQuery.includes("retrieval") ||
    lowerQuery.includes("document")
  ) {
    return FALLBACK_RESPONSES.rag;
  }
  if (
    lowerQuery.includes("cloud") ||
    lowerQuery.includes("self-host") ||
    lowerQuery.includes("docker") ||
    lowerQuery.includes("deploy")
  ) {
    return FALLBACK_RESPONSES.cloud;
  }

  return FALLBACK_RESPONSES.default;
}
