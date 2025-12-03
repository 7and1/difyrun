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

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui
- **Visualization**: ReactFlow + Dagre
- **Deployment**: Docker

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
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `GITHUB_TOKEN` - GitHub personal access token (for sync)
- `SYNC_SECRET` - Secret for protecting sync endpoint

### 3. Setup Database

Run the SQL schema in your Supabase SQL Editor:

```bash
# Copy contents of scripts/schema.sql to Supabase SQL Editor
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

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sync` | POST | Trigger workflow sync from GitHub |
| `/api/search` | GET | Search workflows |
| `/api/download` | GET | Download DSL file |
| `/api/feedback` | POST | Submit works/broken feedback |
| `/api/og` | GET | Generate OG image |
| `/api/revalidate` | POST | Revalidate ISR cache |
| `/api/health` | GET | Health check |

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
│   ├── actions/           # Server actions
│   ├── github/            # GitHub sync engine
│   ├── supabase/          # Supabase clients
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
