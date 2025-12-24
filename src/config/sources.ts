// GitHub repository source configurations

export interface RepoConfig {
  id: string;
  name: string;
  description: string;
  owner: string;
  repo: string;
  branch: string;
  strategy: "recursive" | "flat";
  rootPath?: string;
  excludePaths?: string[];
  defaultTags: string[];
  weight: number;
  isFeatured: boolean;
}

export const REPO_SOURCES: RepoConfig[] = [
  {
    id: "svcvit-main",
    name: "Awesome Dify Workflow",
    description: "The most comprehensive community collection - 3000+ stars",
    owner: "svcvit",
    repo: "Awesome-Dify-Workflow",
    branch: "main",
    strategy: "recursive",
    rootPath: "DSL",
    excludePaths: ["README.md", "LICENSE", ".github", "docs"],
    defaultTags: ["Community Pick", "Most Popular"],
    weight: 100,
    isFeatured: true,
  },
  {
    id: "zhouhui",
    name: "Dify for DSL",
    description: "Sora, TTS, RSS, and specialized workflows",
    owner: "wwwzhouhui",
    repo: "dify-for-dsl",
    branch: "master",
    strategy: "recursive",
    excludePaths: ["README.md", "LICENSE"],
    defaultTags: ["Advanced", "Video AI", "TTS"],
    weight: 85,
    isFeatured: true,
  },
  {
    id: "shamspias",
    name: "Awesome Dify Agents",
    description: "Curated chatflows, agents, and RAG templates",
    owner: "shamspias",
    repo: "awesome-dify-agents",
    branch: "main",
    strategy: "recursive",
    rootPath: "flows",
    defaultTags: ["Agents", "RAG", "Chatbots"],
    weight: 80,
    isFeatured: false,
  },
  {
    id: "bannylon",
    name: "DifyAIA",
    description: "Beginner-friendly workflows from Bilibili creator",
    owner: "BannyLon",
    repo: "DifyAIA",
    branch: "main",
    strategy: "recursive",
    defaultTags: ["Beginner", "Chinese Content", "Bilibili"],
    weight: 75,
    isFeatured: false,
  },
  {
    id: "winson",
    name: "Dify DSL Collection",
    description: "Document query and utility workflows",
    owner: "Winson-030",
    repo: "dify-DSL",
    branch: "main",
    strategy: "flat",
    defaultTags: ["Utilities", "Documents"],
    weight: 70,
    isFeatured: false,
  },
  {
    id: "pgshen",
    name: "PGshen Templates",
    description: "High-quality application templates",
    owner: "PGshen",
    repo: "dify-app-template",
    branch: "main",
    strategy: "recursive",
    defaultTags: ["Apps", "Production Ready"],
    weight: 65,
    isFeatured: false,
  },
  {
    id: "tomatio",
    name: "Workflow Generator",
    description: "Meta-prompts for generating Dify workflows",
    owner: "Tomatio13",
    repo: "DifyWorkFlowGenerator",
    branch: "main",
    strategy: "recursive",
    defaultTags: ["Meta", "Generator", "Japanese"],
    weight: 60,
    isFeatured: false,
  },
];

export function getRepoById(id: string): RepoConfig | undefined {
  return REPO_SOURCES.find((repo) => repo.id === id);
}

export function getFeaturedRepos(): RepoConfig[] {
  return REPO_SOURCES.filter((repo) => repo.isFeatured);
}
