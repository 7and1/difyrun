// Cloudflare D1 Environment Types

interface CloudflareEnv {
  DB: D1Database;
  GITHUB_TOKEN?: string;
  SYNC_SECRET?: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SITE_URL?: string;
      GITHUB_TOKEN?: string;
      SYNC_SECRET?: string;
    }
  }
}

export {};
