# Repository Guidelines

## Project Structure & Module Organization

Next.js App Router code lives in `src/app`: `(app)` is the main product surface, `(content)` powers editorial pages, and `api/` holds route handlers. UI modules sit in `src/components`, shared logic in `src/lib`, and configuration/constants in `src/config`, while SQL in `scripts/d1-*.sql` mirrors the database helpers under `src/actions`. Docs live in `docs/`, static assets in `public/`; co-locate new work with the feature it supports.

## Build, Test, and Development Commands

- `npm run dev` / `make dev` – Dev server at `http://localhost:3000`.
- `npm run lint` + `npm run type-check` (`make validate`) – ESLint + TS gates; run before committing.
- `npm run build && npm run start` – Production bundle plus local smoke test.
- `make deploy` – Validates, snapshots `./data`, then `docker compose build && up -d` on port 3007.
- `npm run cf:dev` / `npm run cf:deploy` – Cloudflare Worker preview and deploy via `wrangler`.
- `npm run db:migrate` / `npm run db:seed` – Replay D1 schema/seed scripts.

## Coding Style & Naming Conventions

Stick to TypeScript, async/await, and typed server actions. Components are PascalCase, hooks/utilities camelCase, constants UPPER_SNAKE. Validate props with `zod` whenever data hops between app segments, and co-locate helper files with their consumer. Tailwind drives styling—keep layout classes near the JSX they affect and lean on `clsx`/`cva` for conditional logic. `npm run lint` enforces 2-space indentation and single quotes.

## Testing Guidelines

There is no committed Jest/Playwright suite yet, so linting + `npm run type-check` are the only required gates. For logic-heavy code (workflow parsing, Supabase queries, OG generation) add co-located `*.test.ts` files using `vitest` or React Testing Library and describe the manual QA path (routes hit, API payloads) inside the PR. Keep fixtures tiny and redact Supabase secrets from recorded responses.

## Commit & Pull Request Guidelines

Follow the conventional prefixes already in `git log` (`feat:`, `fix:`, `chore:`) with concise, imperative summaries and reference an issue when possible. In PRs, outline scope, list migrations or scripts touched, attach before/after screenshots for UI work, and mention the commands you ran (`npm run lint`, etc.). Keep each PR focused on one concern so Cloudflare, Supabase, and React changes stay reviewable.

## Security & Configuration Notes

Never commit secrets: store Supabase keys in `.env.local`, Cloudflare bindings in `wrangler.toml`, and rotate `SYNC_SECRET` via 1Password. Ensure `/api/sync` requires the bearer token before enabling jobs, and scrub downloaded workflow archives before committing.
