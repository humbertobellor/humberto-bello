# External Integrations

**Analysis Date:** 2026-06-07

## APIs & External Services

**Direct integrations within this package:** None

This package (`@workspace/humberto-bello`) is a self-contained static SPA with no direct API calls, external SDKs, or third-party service integrations in its own source code. All API interactions are handled through the workspace dependency `@workspace/api-client-react`.

**Workspace API client:**
- Package: `@workspace/api-client-react` (workspace dep at `../../lib/api-client-react/`)
- Source: `lib/api-client-react/` in the monorepo
- Integration: `@tanstack/react-query` wrapper — provides typed API client hooks
- No direct imports of this client found in the current source (it is available as a workspace dep but not necessarily used in the dossier page itself)

## Data Storage

**Databases:** None
- No database client, ORM, or storage layer in this package
- The dossier is a static single-page site with no persistence

**File Storage:**
- Local filesystem only — static assets served from `dist/public/`
- Self-hosted font files in `public/fonts/` (10 woff2 font files)
- Static assets: `public/favicon.svg`, `public/opengraph.jpg`, `public/Humberto_Bello_Resume.pdf`
- Images imported from `../../attached_assets/` via `@assets` alias (headshot photos in avif/webp formats)

**Caching:** Browser/HTTP-level only
- Express server sets `Cache-Control: max-age=31536000, immutable` for `/assets/*` and `/fonts/*`
- HTML responses use `Cache-Control: no-store`
- No server-side caching layer (Redis, Memcached, etc.)

## Authentication & Identity

**Auth Provider:** None
- No authentication system in this package
- No login, session management, or API auth
- The site is a public-facing professional dossier

## Monitoring & Observability

**Error Tracking:** None
- No Sentry, DataDog, or any error monitoring service configured
- Runtime error modal (`@replit/vite-plugin-runtime-error-modal`) for development only

**Logs:**
- `console.error` used in `vite.config.ts` (critical CSS plugin error logging)
- No structured logging framework in the application code
- Express server has no request logging middleware

## CI/CD & Deployment

**Hosting:**
- Replit (primary deployment platform)
  - Deployment target: `static` (from `.replit` config)
  - Router: `application` (path-based routing)
  - Port 23561 → external port 3000
  - Workflows configured: check-fonts, typecheck, Push to GitHub

**CI Pipeline:**
- No CI configuration (no GitHub Actions, CircleCI, etc.)
- Deployments happen through Replit's built-in deployment system
- Post-merge hook at `scripts/post-merge.sh` (monorepo root)

**Build & Serve Pipeline:**
1. `pnpm --filter @workspace/humberto-bello run build` — Vite builds to `dist/public/`
2. Build output copied to `../../` (monorepo root level) via `cp -r dist/public/. ../..`
3. Production: `pnpm --filter @workspace/humberto-bello run serve` — Express serves the build

## Environment Configuration

**Required env vars:**
| Variable | Type | Purpose |
|----------|------|---------|
| `PORT` | Positive integer | Dev server and Express production port |
| `BASE_PATH` | String | Vite `base` configuration (e.g., `/`, `/dossier/`) |

**Optional env vars:**
| Variable | Value | Purpose |
|----------|-------|---------|
| `REPL_ID` | String | Enables Replit cartographer + dev banner plugins |
| `ANALYZE` | `1` | Emits bundle analysis to `dist/bundle-stats.html` |

**Secrets location:** None detected — no secrets, API keys, tokens, or credentials are used in this package

**Default values:**
- `PORT` defaults to `23561` in server.mjs (but vite.config.ts throws if PORT is unset)
- `PORT`: `23561`, `BASE_PATH`: `/` in the Replit artifact config (`.replit-artifact/artifact.toml`)

## Webhooks & Callbacks

**Incoming:** None

**Outgoing:** None

## Social / SEO Integrations

**Open Graph:**
- Tags in `index.html` for rich link previews (Facebook, LinkedIn, etc.)
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`

**Twitter Cards:**
- `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`

**Structured Data:**
- JSON-LD schema.org `ProfilePage` / `Person` markup in `index.html`
- Includes: name, job title, description, contact email, social links (LinkedIn, GitHub), skills, occupation

**SEO Files:**
- `public/robots.txt` — Allows all crawlers, points to sitemap
- `public/sitemap.xml` — Single URL entry: `https://humbertobello.replit.app/`
- Canonical URL: `https://humbertobello.replit.app/`

## Content Security

**Express server security headers** (`server.mjs`):
- `X-Frame-Options: SAMEORIGIN`
- `Cross-Origin-Opener-Policy: same-origin`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Content-Security-Policy`:
  - `default-src 'self'`
  - `script-src 'self' 'unsafe-inline' 'unsafe-eval'`
  - `style-src 'self' 'unsafe-inline'`
  - `font-src 'self'`
  - `img-src 'self' data: https:`
  - `connect-src 'self'`
  - `frame-ancestors 'self'`

## External Fonts

**All fonts are self-hosted** — no Google Fonts, Typekit, or other external font services:
- Bogart (trial) — Display headings: Regular, Medium, Semibold + Italic variants (6 woff2 files)
- Inter Tight — UI text: 400, 500, 600 latin subset (3 woff2 files)
- JetBrains Mono — Code: 400, 500 latin subset (2 woff2 files)
- Newsreader — Bogart digit fallback: 400 normal + italic (2 woff2 files)

---

*Integration audit: 2026-06-07*
