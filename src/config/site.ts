// Site configuration

export const siteConfig = {
  name: 'DifyRun',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://difyrun.com',
  description:
    'Free Dify AI Workflow Templates & MCP Server Library. Discover, download, and deploy production-ready Dify templates.',
  author: 'DifyRun',
  keywords: [
    'Dify',
    'Dify AI',
    'Dify workflow',
    'Dify templates',
    'Dify DSL',
    'Dify MCP',
    'MCP Server',
    'RAG pipeline',
    'AI workflow',
    'LLM automation',
  ],
  links: {
    github: 'https://github.com/difyrun',
    difyOfficial: 'https://dify.ai',
    difyDocs: 'https://docs.dify.ai',
    difyGithub: 'https://github.com/langgenius/dify',
  },
  social: {
    twitter: '@difyrun',
  },
};

export type SiteConfig = typeof siteConfig;
