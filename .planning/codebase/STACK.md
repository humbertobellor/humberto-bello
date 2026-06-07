# Technology Stack

**Analysis Date:** 2026-06-07

## Languages

**Primary:**
- TypeScript ~5.9.2 — Whole application (TSX/TS). Strict mode enabled via `tsconfig.base.json` (`"strict": true` variant with `strictNullChecks`, `noImplicitAny`, `noImplicitThis`, `useUnknownInCatchVariables`). JSX mode: `"preserve"` (handled by Vite).

## Runtime

**Environment:**
- Node.js 24 (declared in `.replit` as `nodejs-24` module)

**Package Manager:**
- pnpm (enforced by `preinstall` hook in root `package.json`; `package-lock.json` and `yarn.lock` deleted on install)
- Lockfile: `pnpm-lock.yaml` (monorepo root)
- Workspace config: `pnpm-workspace.yaml` — packages: `artifacts/*`, `lib/*`, `lib/integrations/*`, `scripts`
- Catalog protocol: shared version pinning in `pnpm-workspace.yaml` for all major deps (React, Vite, Tailwind, etc.)
- Workspace dep: `@workspace/api-client-react` at `workspace:*`

## Frameworks

**Core:**
- React 19.1.0 — UI library (strict pinned via catalog)
- Vite ^7.3.2 — Build tool and dev server
  - Plugin: `@vitejs/plugin-react` ^5.0.4 (JSX transform, React Refresh)
  - Plugin: `@tailwindcss/vite` ^4.1.14 (Tailwind v4 Vite integration)
  - Plugin: `@replit/vite-plugin-runtime-error-modal` ^0.0.6 (dev error overlay)
  - Plugin: `@replit/vite-plugin-cartographer` ^0.5.1 (Replit file map, dev only with `REPL_ID`)
  - Plugin: `@replit/vite-plugin-dev-banner` ^0.1.1 (dev banner, dev only with `REPL_ID`)
  - Build plugins: Custom `criticalCssPlugin` (Beasties), `heroPreloadPlugin`, `bogartPreloadPlugin`
  - Optional: `rollup-plugin-visualizer` ^5.14.0 (when `ANALYZE=1`)

**Routing:**
- wouter ^3.3.5 — Lightweight router (no react-router)
  - Two routes: `/` → Home, catch-all → NotFound
  - Base URL: derived from `import.meta.env.BASE_URL`

**Production Server:**
- Express ^5.2.1 — Static file server (serves Vite build output from `dist/public/`)
  - Security headers: CSP, HSTS, X-Frame-Options, Cross-Origin-Opener-Policy
  - Immutable caching for `/assets/` and `/fonts/` (max-age 1y), no-cache for HTML

**UI Component Framework:**
- shadcn/ui (new-york style) — 55 UI components at `src/components/ui/`
  - Config: `components.json` (RSC disabled, TSX enabled, base color "neutral", CSS variables on)
  - Radix primitives: 24 `@radix-ui/react-*` packages (accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, popover, select, tabs, tooltip, etc.)
  - class-variance-authority ^0.7.1, clsx ^2.1.1, tailwind-merge ^3.3.1

**Styling:**
- Tailwind CSS ^4.1.14 — Utility-first CSS (no `tailwind.config.js`, v4 uses CSS-based config via `@tailwindcss/vite`)
  - `@tailwindcss/typography` ^0.5.15 (Prose plugin)
  - `tw-animate-css` ^1.4.0 (Animation utilities)
  - Custom design system "Wolknitive" in `src/styles/wolknitive-tokens.css`
  - Theme mapped via `@theme inline {}` in `src/index.css`
- Self-hosted fonts: Bogart (display/headings), Inter Tight (UI), JetBrains Mono (code), Newsreader (Bogart digit fallback)

**Internationalization:**
- i18next ^26.0.6 — i18n framework
- react-i18next ^17.0.4 — React bindings
- i18next-browser-languagedetector ^8.2.1 — Browser language detection (navigator.language, cookie, etc.)
- Locales: `en` (bundled), `es`, `de` (lazy-loaded via dynamic `import()`)

**State / Data:**
- @tanstack/react-query ^5.90.21 — Server state management (QueryClient in `src/App.tsx`)

**Animation:**
- framer-motion ^12.23.24 — Only used in `src/components/FadeIn.tsx` (scroll-into-view fade-up)
- CSS keyframe animations — Hero section entrance animations (7 custom `@keyframes` in `src/index.css`)

**Forms & Validation:**
- react-hook-form ^7.55.0 — Form state management
- @hookform/resolvers ^3.10.0 — Resolver bridge
- zod ^3.25.76 — Schema validation
- input-otp ^1.4.2 — OTP input
- react-day-picker ^9.11.1 — Date picker

**Icons:**
- lucide-react ^0.545.0 — Primary icon set (~22 icons used in `src/pages/home.tsx`)
- react-icons ^5.4.0 — Fallback icon library

**Charts:**
- recharts ^2.15.2 — Chart rendering

**Utilities:**
- date-fns ^3.6.0 — Date formatting
- cmdk ^1.1.1 — Command menu (used by shadcn Command component)
- embla-carousel-react ^8.6.0 — Carousel (used by shadcn Carousel component)
- sonner ^2.0.7 — Toast notifications (via shadcn Sonner component)
- vaul ^1.1.2 — Drawer (used by shadcn Drawer component)
- next-themes ^0.4.6 — Theme switching (dark/light mode toggle)
- react-resizable-panels ^2.1.7 — Resizable panels

## TypeScript Configuration

**Base config** (`tsconfig.base.json` at monorepo root):
- Target: ES2022, Module: ESNext, ModuleResolution: bundler
- Strict null checks, no implicit any, unknown catch variables
- No unused locals (false), no implicit override (false), skipLibCheck: true

**Package config** (`tsconfig.json`):
- Extends `../../tsconfig.base.json`
- Includes `src/**/*`
- Paths: `@/*` → `./src/*`
- Project reference to `../../lib/api-client-react`
- Types: `node`, `vite/client`

## Configuration

**Environment:**
```bash
PORT=<positive-integer>     # Required - Dev server and Express port
BASE_PATH=<path>            # Required - Vite `base` config (e.g., "/" or "/app/")
REPL_ID=<string>            # Optional - Enables Replit-specific plugins
ANALYZE=1                   # Optional - Emits bundle stats to dist/bundle-stats.html
```

**Build:**
- Dev: `npm run dev` — `vite --config vite.config.ts --host 0.0.0.0` (requires `PORT` and `BASE_PATH`)
- Build: `npm run build` — `vite build` + copy `dist/public/` to `../../`
- Serve: `npm run serve` — node `server.mjs`
- Typecheck: `npm run typecheck` — `tsc --noEmit` + check-fonts script

**Replit artifact** (`.replit-artifact/artifact.toml`):
- Kind: web, Port: 23561, Preview: `/`
- Dev command: `pnpm --filter @workspace/humberto-bello run dev`
- Build command: `pnpm --filter @workspace/humberto-bello run build`
- Prod command: `pnpm --filter @workspace/humberto-bello run serve`

**Source files:**
- Entry: `src/main.tsx` → renders `<App />` into `#root`
- Root component: `src/App.tsx` — Providers (QueryClient, Tooltip, Router) + Toaster
- Single page: `src/pages/home.tsx` (1279 lines) — The complete professional dossier
- CSS: `src/index.css` (Tailwind + Wolknitive theme) + `src/styles/wolknitive-tokens.css`
- i18n: `src/i18n/i18n.ts` with locales at `src/i18n/locales/{en,es,de}.json`

**DSL (build-time only, not deployed):**
- Beasties ^0.4.2 — Critical CSS extraction and inlining (used in `criticalCssPlugin`)
- sharp ^0.34.5 — Image processing (monorepo root devDep, used by scripts)

## Platform Requirements

**Development:**
- Node.js 24
- pnpm
- Environment variables: PORT, BASE_PATH must be set

**Production:**
- Deployed on Replit (Node.js 24 environment)
- Express server on configurable port (default 23561 in artifact config)
- Serves static build output + SPA fallback route

---

*Stack analysis: 2026-06-07*
