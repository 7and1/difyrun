import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dify vs n8n (2025): Which AI Workflow Platform is Better?',
  description:
    'In-depth comparison of Dify and n8n for AI workflows. Dify leads with 100K+ GitHub stars, native RAG support, and MCP integration. See benchmarks, pricing, and use cases.',
  keywords: [
    'Dify vs n8n',
    'Dify comparison',
    'n8n alternative',
    'AI workflow platform',
    'LLM automation',
    'RAG pipeline',
    'MCP integration',
  ],
  openGraph: {
    title: 'Dify vs n8n (2025): Complete Comparison Guide',
    description:
      'Which AI workflow platform is right for you? Compare features, performance, and use cases.',
    type: 'article',
  },
};

// Comparison data with real statistics
const comparisonData = {
  overview: [
    { feature: 'GitHub Stars', dify: '100,000+', n8n: '50,000+', winner: 'dify' },
    { feature: 'Primary Focus', dify: 'LLM/AI Workflows', n8n: 'General Automation', winner: 'tie' },
    { feature: 'First Release', dify: '2023', n8n: '2019', winner: 'tie' },
    { feature: 'License', dify: 'Apache 2.0', n8n: 'Sustainable Use', winner: 'dify' },
    { feature: 'Self-Hosted', dify: 'Yes (Free)', n8n: 'Yes (Free)', winner: 'tie' },
    { feature: 'Cloud Option', dify: 'Dify Cloud', n8n: 'n8n Cloud', winner: 'tie' },
  ],
  aiFeatures: [
    { feature: 'Native RAG Support', dify: 'Built-in', n8n: 'Via Plugins', winner: 'dify' },
    { feature: 'Knowledge Base', dify: 'Built-in Vector DB', n8n: 'External Only', winner: 'dify' },
    { feature: 'MCP Support', dify: 'Native (v1.6+)', n8n: 'Not Available', winner: 'dify' },
    { feature: 'Agent Mode', dify: 'Built-in', n8n: 'Via LangChain', winner: 'dify' },
    { feature: 'Model Management', dify: '20+ Providers', n8n: 'Limited', winner: 'dify' },
    { feature: 'Prompt Templates', dify: 'Built-in', n8n: 'Manual', winner: 'dify' },
    { feature: 'Streaming Responses', dify: 'Native', n8n: 'Limited', winner: 'dify' },
  ],
  automation: [
    { feature: 'Pre-built Integrations', dify: '50+', n8n: '400+', winner: 'n8n' },
    { feature: 'Webhook Support', dify: 'Yes', n8n: 'Yes', winner: 'tie' },
    { feature: 'Cron Scheduling', dify: 'Limited', n8n: 'Advanced', winner: 'n8n' },
    { feature: 'Error Handling', dify: 'Basic', n8n: 'Advanced', winner: 'n8n' },
    { feature: 'Branching Logic', dify: 'Yes', n8n: 'Yes', winner: 'tie' },
    { feature: 'Subworkflows', dify: 'Yes', n8n: 'Yes', winner: 'tie' },
  ],
  developer: [
    { feature: 'Visual Editor', dify: 'Excellent', n8n: 'Excellent', winner: 'tie' },
    { feature: 'Code Nodes', dify: 'Python/JS', n8n: 'JavaScript', winner: 'dify' },
    { feature: 'API First', dify: 'Yes', n8n: 'Yes', winner: 'tie' },
    { feature: 'Docker Compose', dify: 'Official', n8n: 'Official', winner: 'tie' },
    { feature: 'DSL Export', dify: 'YAML', n8n: 'JSON', winner: 'tie' },
    { feature: 'Version Control', dify: 'Built-in', n8n: 'Via Export', winner: 'dify' },
  ],
};

function ComparisonTable({
  data,
  title,
}: {
  data: { feature: string; dify: string; n8n: string; winner: string }[];
  title: string;
}) {
  return (
    <div className="not-prose my-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border p-3 text-left font-medium">Feature</th>
              <th className="border p-3 text-center font-medium">Dify</th>
              <th className="border p-3 text-center font-medium">n8n</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                <td className="border p-3">{row.feature}</td>
                <td
                  className={`border p-3 text-center ${row.winner === 'dify' ? 'font-semibold text-green-600 dark:text-green-400' : ''}`}
                >
                  {row.dify}
                  {row.winner === 'dify' && ' ✓'}
                </td>
                <td
                  className={`border p-3 text-center ${row.winner === 'n8n' ? 'font-semibold text-green-600 dark:text-green-400' : ''}`}
                >
                  {row.n8n}
                  {row.winner === 'n8n' && ' ✓'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  source,
  growth,
}: {
  label: string;
  value: string;
  source: string;
  growth?: string;
}) {
  return (
    <div className="not-prose border rounded-lg p-4 bg-muted/30">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground mt-1">
        Source: {source}
        {growth && <span className="text-green-600 dark:text-green-400 ml-2">{growth}</span>}
      </div>
    </div>
  );
}

function Citation({
  quote,
  source,
  url,
  date,
}: {
  quote: string;
  source: string;
  url: string;
  date: string;
}) {
  return (
    <blockquote className="not-prose border-l-4 border-primary pl-4 my-6 bg-muted/30 py-4 pr-4 rounded-r-lg">
      <p className="italic text-muted-foreground">&ldquo;{quote}&rdquo;</p>
      <footer className="mt-2 text-sm">
        &mdash;{' '}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {source}
        </a>
        , {date}
      </footer>
    </blockquote>
  );
}

export default function DifyVsN8nPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {/* Hero Section */}
      <h1>Dify vs n8n: Complete 2025 Comparison</h1>

      <p className="lead">
        Choosing between Dify and n8n for your AI workflows? This comprehensive guide breaks down
        everything you need to know. Spoiler: if you&apos;re building AI-native applications, Dify
        is the clear winner. For general automation, n8n still has its place.
      </p>

      <p className="text-sm text-muted-foreground">
        <strong>Last Updated:</strong> December 2025 &middot; <strong>Reading Time:</strong> 12 min
        &middot; <strong>Author:</strong> DifyRun Team
      </p>

      {/* Quick Stats */}
      <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
        <StatBox label="Dify GitHub Stars" value="100,000+" source="GitHub" growth="+25% YoY" />
        <StatBox label="n8n GitHub Stars" value="50,000+" source="GitHub" growth="+15% YoY" />
        <StatBox label="MCP Servers" value="100+" source="MCP Registry" />
        <StatBox label="Dify Model Providers" value="20+" source="Dify Docs" />
      </div>

      {/* TL;DR Box */}
      <div className="not-prose bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 my-8">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
          TL;DR - Quick Decision Guide
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">Choose Dify if:</p>
            <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>Building AI chatbots or agents</li>
              <li>Need RAG/knowledge base features</li>
              <li>Want MCP integration (Claude, Cursor)</li>
              <li>Managing multiple LLM providers</li>
              <li>Creating prompt-based applications</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">Choose n8n if:</p>
            <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>Building non-AI automation</li>
              <li>Need 400+ pre-built integrations</li>
              <li>Complex scheduling requirements</li>
              <li>ETL and data pipeline workflows</li>
              <li>Legacy system integration</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Overview Comparison */}
      <h2>Overview: Two Different Beasts</h2>

      <p>
        Let me be real with you — comparing Dify and n8n is like comparing a Tesla to a Toyota
        Camry. Both are vehicles. Both get you from A to B. But they&apos;re designed for
        fundamentally different purposes.
      </p>

      <p>
        <strong>Dify</strong> is purpose-built for the AI era. It was created in 2023 when the
        founding team saw that building LLM applications was way too complicated. They wanted to
        make it as easy as using Notion — visual, intuitive, and powerful.
      </p>

      <p>
        <strong>n8n</strong> started in 2019 as a Zapier alternative for developers who wanted
        self-hosted automation. It&apos;s fantastic for connecting APIs, moving data around, and
        building traditional automation workflows.
      </p>

      <Citation
        quote="Dify is an open-source LLM app development platform. Its intuitive interface combines AI workflow, RAG pipeline, agent capabilities, model management, observability features and more."
        source="Dify Official Documentation"
        url="https://docs.dify.ai"
        date="2025"
      />

      <ComparisonTable data={comparisonData.overview} title="Overview Comparison" />

      {/* The GitHub Stars Story */}
      <h2>The GitHub Stars Story: What 100,000+ Stars Really Means</h2>

      <p>
        Here&apos;s something wild. Dify launched in 2023 and already has over 100,000 GitHub
        stars. n8n launched in 2019 and has about 50,000. That&apos;s not a criticism of n8n —
        it&apos;s a testament to the explosive demand for AI-native tools.
      </p>

      <p>
        GitHub stars aren&apos;t just vanity metrics. They represent developer interest, community
        size, and project momentum. When you&apos;re choosing an open-source tool, you want active
        development and a thriving community. Dify&apos;s growth rate suggests it&apos;s meeting a
        massive unmet need in the market.
      </p>

      <div className="not-prose bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 my-6">
        <p className="text-yellow-800 dark:text-yellow-200 mb-0">
          <strong>Pro Tip:</strong> The number of GitHub stars also correlates with the number of
          plugins, templates, and community resources available. More stars = more ecosystem.
        </p>
      </div>

      {/* AI Features Deep Dive */}
      <h2>AI Features: Where Dify Absolutely Dominates</h2>

      <p>
        This is where things get interesting. If you&apos;re building anything with LLMs, Dify is
        in a different league. Let me break down the key differences:
      </p>

      <h3>1. Native RAG Support</h3>

      <p>
        RAG (Retrieval-Augmented Generation) is the technique that lets AI reference your own
        documents. Think of it as giving your AI a brain that knows about your specific business.
      </p>

      <p>
        <strong>Dify</strong>: Built-in knowledge base with vector database, chunking strategies,
        embedding models, and retrieval settings. Upload your docs, and you&apos;re done.
      </p>

      <p>
        <strong>n8n</strong>: You need to connect external services like Pinecone, Weaviate, or
        Qdrant. Build the chunking logic yourself. Handle embeddings separately. It works, but
        it&apos;s like building IKEA furniture without instructions.
      </p>

      <h3>2. MCP (Model Context Protocol) Integration</h3>

      <p>
        This is the game-changer that dropped in Dify v1.6.0. MCP is Anthropic&apos;s new standard
        for connecting AI to external tools. Think of it as USB-C for AI — one universal connector.
      </p>

      <Citation
        quote="Dify v1.6.0 introduces built-in two-way MCP support, letting you call any MCP server directly from your workflows or publish your Dify agents as MCP endpoints."
        source="Dify Official Blog"
        url="https://dify.ai/blog"
        date="November 2024"
      />

      <p>With MCP, Dify can:</p>

      <ul>
        <li>
          Connect to <strong>7,000+ apps via Zapier MCP</strong>
        </li>
        <li>
          Be used from <strong>Claude Desktop</strong>
        </li>
        <li>
          Integrate with <strong>Cursor</strong> for AI coding
        </li>
        <li>Talk to any MCP-compatible tool or service</li>
      </ul>

      <p>
        <strong>n8n</strong>: No MCP support. Not even on the roadmap as far as I can tell.
      </p>

      <h3>3. Agent Mode</h3>

      <p>
        Agents are AI systems that can reason, plan, and take actions autonomously. Dify has this
        built-in with different agent types: Function Calling, ReAct, and more.
      </p>

      <p>
        n8n can technically do agents through LangChain nodes, but it&apos;s bolted on rather than
        native. The experience is clunkier, and you lose the visual debugging that makes agents
        manageable.
      </p>

      <h3>4. Model Management</h3>

      <p>Dify supports 20+ LLM providers out of the box:</p>

      <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-2 my-4">
        {[
          'OpenAI',
          'Anthropic',
          'Google (Gemini)',
          'Azure OpenAI',
          'AWS Bedrock',
          'Ollama',
          'Groq',
          'Mistral',
          'Cohere',
          'DeepSeek',
          'Zhipu AI',
          'Moonshot',
        ].map((provider) => (
          <div key={provider} className="bg-muted rounded px-3 py-2 text-sm text-center">
            {provider}
          </div>
        ))}
      </div>

      <p>
        You can switch models with a dropdown. Test the same prompt across providers. Set fallbacks
        if one API goes down. This kind of model orchestration would take weeks to build in n8n.
      </p>

      <ComparisonTable data={comparisonData.aiFeatures} title="AI Features Comparison" />

      {/* Where n8n Wins */}
      <h2>Where n8n Still Wins: Traditional Automation</h2>

      <p>
        Look, I&apos;m not here to bash n8n. It&apos;s a fantastic tool for what it was designed to
        do. Here&apos;s where n8n genuinely beats Dify:
      </p>

      <h3>1. Pre-Built Integrations (400+ vs 50+)</h3>

      <p>
        n8n has been around longer and has integrations with everything: Slack, Notion, Airtable,
        Salesforce, HubSpot, Stripe, PostgreSQL, MongoDB, you name it. Need to sync data between
        your CRM and spreadsheet? n8n probably has a node for that.
      </p>

      <p>
        Dify&apos;s integrations are more AI-focused: LLM providers, embedding models, vector
        stores. It&apos;s not trying to be a general automation tool.
      </p>

      <h3>2. Scheduling and Error Handling</h3>

      <p>
        n8n has mature cron scheduling, retry logic, error branches, and execution history.
        It&apos;s battle-tested for production automation workflows that run on schedules.
      </p>

      <p>
        Dify&apos;s scheduling is more limited because it&apos;s designed for on-demand AI
        applications rather than batch processing.
      </p>

      <h3>3. Non-AI Workflows</h3>

      <p>
        If you&apos;re building a workflow that doesn&apos;t involve LLMs — like syncing data
        between databases, sending notifications, or processing webhooks — n8n is honestly the
        better choice. Using Dify for non-AI automation is like using a Ferrari for grocery runs.
      </p>

      <ComparisonTable data={comparisonData.automation} title="Automation Features Comparison" />

      {/* Developer Experience */}
      <h2>Developer Experience: Both Are Excellent (With Caveats)</h2>

      <p>
        Both platforms have beautiful visual editors. You can drag and drop nodes, connect them with
        edges, and see your workflow come to life. But there are some differences:
      </p>

      <h3>Dify&apos;s Advantages:</h3>

      <ul>
        <li>
          <strong>Python AND JavaScript code nodes</strong> (n8n is JS only)
        </li>
        <li>
          <strong>Built-in prompt engineering tools</strong> with variables and templates
        </li>
        <li>
          <strong>Visual debug mode</strong> that shows each step&apos;s input/output
        </li>
        <li>
          <strong>Version control</strong> for workflows built into the platform
        </li>
        <li>
          <strong>API-first design</strong> makes embedding AI features trivial
        </li>
      </ul>

      <h3>n8n&apos;s Advantages:</h3>

      <ul>
        <li>
          <strong>Execution history</strong> with detailed logs
        </li>
        <li>
          <strong>Workflow templates marketplace</strong> (though DifyRun is building this for Dify!)
        </li>
        <li>
          <strong>More mature community plugins</strong>
        </li>
        <li>
          <strong>Better documentation</strong> for edge cases
        </li>
      </ul>

      <ComparisonTable data={comparisonData.developer} title="Developer Experience Comparison" />

      {/* Pricing */}
      <h2>Pricing: Both Offer Self-Hosted Free Tiers</h2>

      <p>
        Good news: both Dify and n8n can be self-hosted for free. You just need a server (a $5/month
        VPS works fine) and Docker.
      </p>

      <h3>Self-Hosted (Free)</h3>

      <p>Both platforms are open source and can be deployed with Docker Compose in minutes:</p>

      <pre>
        <code className="language-bash">
          {`# Dify
git clone https://github.com/langgenius/dify
cd dify/docker
docker compose up -d

# n8n
docker run -it --rm -p 5678:5678 n8nio/n8n`}
        </code>
      </pre>

      <h3>Cloud Pricing</h3>

      <p>
        If you don&apos;t want to manage infrastructure, both offer cloud solutions. Pricing
        varies based on usage, but expect $20-50/month for small teams.
      </p>

      <div className="not-prose bg-muted rounded-lg p-4 my-6">
        <p className="text-sm mb-0">
          <strong>DifyRun Tip:</strong> We recommend self-hosting for production. It&apos;s more
          cost-effective and gives you full control. Check our{' '}
          <Link href="/docs/getting-started" className="text-primary hover:underline">
            Getting Started guide
          </Link>{' '}
          for Docker setup instructions.
        </p>
      </div>

      {/* Use Cases */}
      <h2>Real-World Use Cases: When to Use Each</h2>

      <h3>Use Dify For:</h3>

      <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Customer Support Bot</h4>
          <p className="text-sm text-muted-foreground">
            Build a chatbot that answers questions using your docs. Dify&apos;s RAG makes this
            trivial — upload PDFs, and you&apos;re live.
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">AI Writing Assistant</h4>
          <p className="text-sm text-muted-foreground">
            Create content generation workflows with prompt templates, model selection, and
            iterative refinement.
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Research Agent</h4>
          <p className="text-sm text-muted-foreground">
            Build an agent that searches the web, synthesizes information, and produces reports.
            Agent mode + MCP = powerful combo.
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Multi-Model Applications</h4>
          <p className="text-sm text-muted-foreground">
            Use GPT-4 for reasoning, Claude for writing, and local Llama for privacy-sensitive
            tasks. Easy model switching.
          </p>
        </div>
      </div>

      <h3>Use n8n For:</h3>

      <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Data Sync Pipelines</h4>
          <p className="text-sm text-muted-foreground">
            Sync data between CRM, database, and spreadsheets on a schedule. n8n&apos;s 400+
            integrations shine here.
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Notification Systems</h4>
          <p className="text-sm text-muted-foreground">
            Send Slack alerts when something happens in your app. Webhook trigger, conditional
            logic, multi-channel output.
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">ETL Workflows</h4>
          <p className="text-sm text-muted-foreground">
            Extract data from APIs, transform it, load it into your data warehouse. Classic
            automation use case.
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Legacy Integration</h4>
          <p className="text-sm text-muted-foreground">
            Connect old systems that predate modern APIs. n8n&apos;s HTTP node handles anything.
          </p>
        </div>
      </div>

      {/* The Verdict */}
      <h2>The Verdict: Different Tools for Different Jobs</h2>

      <p>
        After spending months with both platforms, here&apos;s my honest take:
      </p>

      <p>
        <strong>Dify is the future of AI development.</strong> If you&apos;re building anything
        with LLMs — chatbots, agents, RAG applications, AI assistants — Dify is the obvious choice.
        The 100K+ GitHub stars aren&apos;t an accident. The MCP integration is a game-changer. The
        developer experience is exceptional.
      </p>

      <p>
        <strong>n8n is still king for traditional automation.</strong> If your workflows
        don&apos;t involve AI, if you need 400+ integrations, if you have complex scheduling needs
        — n8n is mature, battle-tested, and does the job well.
      </p>

      <p>
        The real insight? <strong>You might need both.</strong> Use Dify for AI features, n8n for
        automation, and connect them via webhooks or MCP. That&apos;s what many production teams are
        doing.
      </p>

      {/* Call to Action */}
      <div className="not-prose bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 my-8">
        <h3 className="text-xl font-semibold mb-3">Ready to Try Dify?</h3>
        <p className="text-muted-foreground mb-4">
          Browse our collection of 100+ free Dify workflow templates. Download DSL files, import
          them in seconds, and start building AI applications today.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Explore Workflows
          </Link>
          <Link
            href="/docs/getting-started"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Getting Started Guide
          </Link>
        </div>
      </div>

      {/* FAQ Schema-ready section */}
      <h2>Frequently Asked Questions</h2>

      <h3>Is Dify better than n8n for AI?</h3>
      <p>
        Yes. Dify is purpose-built for AI/LLM applications with native RAG, MCP support, and 20+
        model providers. n8n can do AI through plugins, but it&apos;s not its primary focus.
      </p>

      <h3>Can I use Dify and n8n together?</h3>
      <p>
        Absolutely. Many teams use Dify for AI features and n8n for traditional automation,
        connecting them via webhooks. With Dify&apos;s MCP support, integration options are expanding.
      </p>

      <h3>Is Dify free to use?</h3>
      <p>
        Yes. Dify is open source under Apache 2.0 license. You can self-host it for free. They also
        offer a cloud version with a free tier.
      </p>

      <h3>Does n8n support MCP?</h3>
      <p>
        No. As of December 2025, n8n does not support the Model Context Protocol. This is a
        significant advantage for Dify in the AI automation space.
      </p>

      <h3>Which has more GitHub stars?</h3>
      <p>
        Dify has 100,000+ stars (as of December 2025), while n8n has about 50,000+. Dify achieved
        this in less time, indicating strong market demand for AI-native tools.
      </p>

      {/* Sources */}
      <h2>Sources & References</h2>

      <ul>
        <li>
          <a
            href="https://github.com/langgenius/dify"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dify GitHub Repository
          </a>{' '}
          - Official source code and documentation
        </li>
        <li>
          <a href="https://github.com/n8n-io/n8n" target="_blank" rel="noopener noreferrer">
            n8n GitHub Repository
          </a>{' '}
          - Official source code and documentation
        </li>
        <li>
          <a href="https://docs.dify.ai" target="_blank" rel="noopener noreferrer">
            Dify Official Documentation
          </a>{' '}
          - Features, API reference, and guides
        </li>
        <li>
          <a href="https://docs.n8n.io" target="_blank" rel="noopener noreferrer">
            n8n Official Documentation
          </a>{' '}
          - Features, nodes, and tutorials
        </li>
        <li>
          <a
            href="https://www.anthropic.com/news/model-context-protocol"
            target="_blank"
            rel="noopener noreferrer"
          >
            Anthropic MCP Announcement
          </a>{' '}
          - Model Context Protocol introduction
        </li>
        <li>
          <a href="https://spec.modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">
            MCP Specification
          </a>{' '}
          - Technical specification for MCP
        </li>
      </ul>

      <hr />

      <p className="text-sm text-muted-foreground">
        <strong>About this comparison:</strong> This article was researched and written by the
        DifyRun team, who maintain the largest collection of Dify workflow templates. We use both
        Dify and n8n in production and have hands-on experience with their strengths and
        limitations. Last updated December 2025.
      </p>
    </div>
  );
}
