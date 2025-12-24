# DifyRun

The Ultimate Dify AI Workflow & MCP Server Library.

## Features

- 100+ curated Dify workflow templates
- Visual DSL previewer with ReactFlow
- One-click DSL download
- Community feedback (Works/Broken)
- Full-text search with filters
- SEO optimized with JSON-LD
- Dynamic OG image generation

## Tech Stack

- **Framework**: Next.js 15 (App Router, Edge runtime)
- **Database**: Cloudflare D1 (SQLite via OpenNext `getCloudflareContext`)
- **Styling**: Tailwind CSS + shadcn/ui
- **Visualization**: ReactFlow + Dagre
- **Deployment**: Cloudflare Workers (OpenNext) or Docker for local previews

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

- `NEXT_PUBLIC_SITE_URL` - Canonical site host (used in metadata/OG)
- `NEXT_PUBLIC_SITE_NAME` - Display name for structured data
- `OPENROUTER_API_KEY` (optional) - Enables AI advisor features
- `GITHUB_TOKEN` - GitHub personal access token (repo sync/read)
- `SYNC_SECRET` - Bearer token enforced by `/api/sync`
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (optional) - Analytics tracking ID

### 3. Setup Database

Replay the D1 schema + seed data locally (or switch `--remote` to target Cloudflare):

```bash
# Apply schema
npm run db:migrate

# Seed starter data
npm run db:seed
```

### 4. Development

```bash
npm run dev
```

### 5. Production Build

```bash
npm run build
npm start
```

## Docker Deployment

```bash
# Build and deploy
make deploy

# View logs
make logs

# Stop
make down
```

## API Endpoints

| Endpoint          | Method | Description                       |
| ----------------- | ------ | --------------------------------- |
| `/api/sync`       | POST   | Trigger workflow sync from GitHub |
| `/api/search`     | GET    | Search workflows                  |
| `/api/download`   | GET    | Download DSL file                 |
| `/api/feedback`   | POST   | Submit works/broken feedback      |
| `/api/og`         | GET    | Generate OG image                 |
| `/api/revalidate` | POST   | Revalidate ISR cache              |
| `/api/health`     | GET    | Health check                      |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (app)/             # Main app routes
│   ├── (content)/         # Content pages (docs, compare)
│   └── api/               # API routes
├── components/
│   ├── home/              # Homepage components
│   ├── layout/            # Header, Footer
│   ├── ui/                # shadcn/ui components
│   ├── visualizer/        # DSL visualizer
│   └── workflow/          # Workflow components
├── config/                # Categories, sources config
├── lib/
│   ├── db/                # Cloudflare D1 helpers + cached loaders
│   ├── github/            # GitHub sync engine
│   ├── ai/                # AI utilities (OG helpers, advisors)
│   └── visualizer/        # DSL to ReactFlow
└── types/                 # TypeScript types
```

## Sync Workflows

Trigger a sync to fetch workflows from GitHub repositories:

```bash
curl -X POST http://localhost:3000/api/sync \
  -H "Authorization: Bearer YOUR_SYNC_SECRET"
```

## License

MIT
