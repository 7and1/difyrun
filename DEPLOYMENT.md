# DifyRun - Cloudflare Workers Deployment

## 🚀 Deployment Status: LIVE

**Worker URL**: https://difyrun.7and1.workers.dev
**Last Deployed**: 2025-12-02T11:17:52Z
**Version ID**: 5191e09b-357a-4da0-9e8b-02255c945ba1

## Deployment Summary

| Resource | Status | Details |
|----------|--------|---------|
| D1 Database | ✅ Created | `difyrun-db` (04a76343-22cf-4843-a91c-6be7edff7826) |
| Database Schema | ✅ Applied | 29 queries, 11 tables |
| Seed Data | ✅ Loaded | 9 categories, 7 repo sources |
| Worker | ✅ Deployed | difyrun.7and1.workers.dev |
| GITHUB_TOKEN | ✅ Set | Secret configured |
| SYNC_SECRET | ✅ Set | Secret configured |
| OpenNext Context | ✅ Fixed | Using `getCloudflareContext()` from `@opennextjs/cloudflare` |

## Quick Commands

```bash
# Build for Cloudflare
npm run cf:build

# Deploy to Cloudflare Workers
CLOUDFLARE_API_TOKEN=xxx CLOUDFLARE_ACCOUNT_ID=xxx npx wrangler deploy

# Apply database migrations
CLOUDFLARE_API_TOKEN=xxx CLOUDFLARE_ACCOUNT_ID=xxx npx wrangler d1 execute difyrun-db --remote --file=./scripts/d1-schema.sql

# Seed database
CLOUDFLARE_API_TOKEN=xxx CLOUDFLARE_ACCOUNT_ID=xxx npx wrangler d1 execute difyrun-db --remote --file=./scripts/d1-seed.sql

# Set secrets
echo "token" | CLOUDFLARE_API_TOKEN=xxx npx wrangler secret put GITHUB_TOKEN
echo "secret" | CLOUDFLARE_API_TOKEN=xxx npx wrangler secret put SYNC_SECRET
```

## Trigger Workflow Sync

After deployment, sync workflows from GitHub repositories:

```bash
curl -X POST https://difyrun.7and1.workers.dev/api/sync \
  -H "Authorization: Bearer difyrun-sync-2024-secure" \
  -H "Content-Type: application/json"
```

## Configuration Files

### wrangler.toml
```toml
name = "difyrun"
main = ".open-next/worker.js"
compatibility_date = "2024-12-01"
compatibility_flags = ["nodejs_compat"]

assets = { directory = ".open-next/assets", binding = "ASSETS" }

[[d1_databases]]
binding = "DB"
database_name = "difyrun-db"
database_id = "04a76343-22cf-4843-a91c-6be7edff7826"

[vars]
NEXT_PUBLIC_SITE_URL = "https://difyrun.pages.dev"
```

### open-next.config.ts
```typescript
const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
  edgeExternals: ["node:crypto"],
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
};
```

## Database Tables

| Table | Purpose |
|-------|---------|
| categories | Workflow categories |
| repo_sources | GitHub repository sources |
| workflows | Workflow metadata and DSL content |
| workflows_fts | Full-text search index |
| workflow_events | View/download tracking |
| workflow_feedback | User feedback (works/broken) |

## Custom Domain Setup

To add a custom domain (e.g., difyrun.com):

1. Add domain in Cloudflare Dashboard → Workers & Pages → difyrun → Custom Domains
2. Or via API:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/difyrun/routes" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"pattern": "difyrun.com/*", "script": "difyrun"}'
```

## Troubleshooting

### Check Worker Logs
```bash
CLOUDFLARE_API_TOKEN=xxx npx wrangler tail difyrun
```

### Query D1 Database
```bash
CLOUDFLARE_API_TOKEN=xxx npx wrangler d1 execute difyrun-db --remote --command "SELECT COUNT(*) FROM workflows"
```

### View Deployment History
```bash
CLOUDFLARE_API_TOKEN=xxx npx wrangler deployments list
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Cloudflare Edge                      │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐                 │
│  │   Worker    │───▶│   D1 DB     │                 │
│  │  (Next.js)  │    │  (SQLite)   │                 │
│  └─────────────┘    └─────────────┘                 │
│         │                                            │
│         ▼                                            │
│  ┌─────────────┐                                    │
│  │   Assets    │                                    │
│  │ (Static JS) │                                    │
│  └─────────────┘                                    │
└─────────────────────────────────────────────────────┘
```

## Environment Variables

| Variable | Type | Description |
|----------|------|-------------|
| NEXT_PUBLIC_SITE_URL | var | Public site URL |
| GITHUB_TOKEN | secret | GitHub PAT for API access |
| SYNC_SECRET | secret | Auth token for /api/sync |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| / | GET | Homepage |
| /explore | GET | Browse workflows |
| /explore/[category] | GET | Category page |
| /workflow/[slug] | GET | Workflow detail |
| /api/download | GET | Download DSL file |
| /api/feedback | POST | Submit feedback |
| /api/search | GET | Search workflows |
| /api/sync | POST | Trigger GitHub sync |
| /api/health | GET | Health check |
| /sitemap.xml | GET | Sitemap |
