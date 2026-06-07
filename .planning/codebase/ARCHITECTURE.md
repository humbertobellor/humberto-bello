<!-- refreshed: 2026-06-07 -->
# Architecture

**Analysis Date:** 2026-06-07

## System Overview

```text
┌───────────────────────────────────────────────────────────────────┐
│                    Browser (React SPA)                             │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  ┌───────────────┐  │
│  │  main.tsx │  │ App.tsx  │  │  pages/    │  │  components/  │  │
│  │ (mount)   │  │ (router  │  │  home.tsx  │  │  FadeIn.tsx   │  │
│  │           │  │ +providers)│  not-found  │  │  Changelog.tsx│  │
│  └──────────┘  └────┬─────┘  └─────┬──────┘  └───────┬───────┘  │
│                     │              │                  │          │
│                     ▼              ▼                  ▼          │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              @workspace/api-client-react                  │    │
│  │            (monorepo dep at ../../lib/api-client-react)   │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  ┌───────────────┐  │
│  │  i18n/   │  │ hooks/   │  │  lib/      │  │  styles/      │  │
│  │  i18n.ts │  │ use-     │  │  utils.ts  │  │  wolknitive-  │  │
│  │  locales/│  │ mobile   │  │  (cn())    │  │  tokens.css   │  │
│  │          │  │ use-toast│  │            │  │               │  │
│  └──────────┘  └──────────┘  └────────────┘  └───────────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────┐
│               Vite Build Pipeline (vite.config.ts)                 │
│                                                                   │
│  @vitejs/plugin-react  │  @tailwindcss/vite  │  Beasties (CSS)    │
│  hero-preload-plugin   │  bogart-preload      │  Replit plugins   │
│  rollup-plugin-visualizer (if ANALYZE=1)                          │
│                                                                   │
│  Output: dist/public/ (index.html + hashed assets)                │
└───────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────────────┐
│              Production Server (server.mjs)                       │
│                                                                   │
│  Express 5 — static file serving + SPA fallback route             │
│  Security headers: CSP, HSTS, X-Frame-Options, COOP               │
│  Immutable caching: /assets/ (1y), /fonts/ (1y)                  │
│  No-store for .html                                                │
│  Port: env PORT                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| `App` | Root component: providers + wouter router | `src/App.tsx` |
| `Home` | Single main page (1279 lines) — hero, skills, experience, clients, CTA, footer | `src/pages/home.tsx` |
| `NotFound` | 404 catch-all page | `src/pages/not-found.tsx` |
| `FadeInSection` | Lazy-loaded framer-motion scroll reveal wrapper | `src/components/FadeIn.tsx` |
| `Changelog` | GitHub releases viewer with Markdown renderer | `src/components/Changelog.tsx` |
| 55 shadcn/ui components | Radix-based primitives, new-york style | `src/components/ui/*.tsx` |
| `i18n` | i18next instance, lazy-loaded es/de bundles | `src/i18n/i18n.ts` |
| `server.mjs` | Express 5 production server, static files + security headers | `server.mjs` |

## Pattern Overview

**Overall:** Single-page React application with client-side routing, built as a static SPA via Vite, served by Express for production.

**Key Characteristics:**
- Single page component (`src/pages/home.tsx` at 1279 lines) that contains all content inline — no sub-routes
- wouter for lightweight client-side routing (not react-router)
- All page sections rendered on a single route; section navigation via `scrollIntoView` + `IntersectionObserver` for active tracking
- CSS-only hero animations (above the fold); lazy-loaded framer-motion for below-fold reveal animations
- Custom design tokens system ("Wolknitive") via CSS custom properties, not Tailwind's theme config
- Tailwind v4 used for responsive layout grid only (grid-cols, hidden md:block, etc.)
- All styling uses inline `style={}` objects referencing CSS variable names (var(--x)) — no Tailwind utility classes for the dossier content
- `@workspace/api-client-react` is a monorepo workspace dependency at `../../lib/api-client-react`

## Layers

**Entry/Mount Layer:**
- Purpose: Mount React app to DOM
- Location: `src/main.tsx`
- Contains: `createRoot` call, importing `App`, global CSS, and i18n initialization
- Depends on: React 19
- Used by: `index.html` (script tag)

**Provider/Route Layer:**
- Purpose: Configure providers and routing
- Location: `src/App.tsx`
- Contains: `QueryClientProvider` (react-query), `TooltipProvider` (Radix), `WouterRouter`, `Toaster`
- Depends on: `@tanstack/react-query`, `wouter`, `@radix-ui/react-tooltip`
- Used by: `main.tsx`

**Page Layer:**
- Purpose: Single-page content sections
- Location: `src/pages/`
- Contains: `home.tsx` (hero, skills, experience, clients, CTA, footer), `not-found.tsx`
- Depends on: components, i18n, hooks, `@workspace/api-client-react`
- Used by: `App.tsx` router

**Component Layer:**
- Purpose: Reusable UI building blocks
- Location: `src/components/`
- Contains: 55 shadcn/ui primitives, `FadeIn.tsx`, `Changelog.tsx`
- Depends on: Radix primitives, framer-motion, lucide-react, `@workspace/api-client-react`
- Used by: page layer

**Infrastructure/Hooks Layer:**
- Purpose: Shared state, utilities, i18n
- Location: `src/hooks/`, `src/lib/`, `src/i18n/`, `src/styles/`
- Contains: `useIsMobile`, `useToast`/`toast`, `cn()` utility, i18n setup, design tokens CSS
- Depends on: tailwind-merge, clsx, i18next, react-i18next
- Used by: pages and components

**Build Layer:**
- Purpose: Compile, bundle, optimize
- Location: `vite.config.ts`
- Contains: React plugin, Tailwind CSS v4 plugin, Beasties critical CSS, hero image preload, Bogart font preload, Replit plugins (conditional), bundle analyzer (conditional)
- Depends on: `@vitejs/plugin-react`, `@tailwindcss/vite`, `beasties`
- Used by: build pipeline

**Server Layer:**
- Purpose: Production static serving
- Location: `server.mjs`
- Contains: Express 5 app, security headers middleware, immutable asset caching, SPA fallback route
- Depends on: `express`
- Used by: production deployment

## Data Flow

### Primary Request Path

1. Browser requests app at `<base_path>/` → Express serves `dist/public/index.html` (`server.mjs:49-52`)
2. `index.html` loads `<script type="module" src="/src/main.tsx">` → Vite dev server or built bundle
3. `main.tsx` calls `createRoot(document.getElementById("root")!).render(<App />)` (`src/main.tsx:6`)
4. `App.tsx` renders `QueryClientProvider` → `TooltipProvider` → `WouterRouter` → `Switch` with two routes (`src/App.tsx:10-16`)
5. Route `/` renders `Home` component, which:
   - Calls `useTranslation()` for i18n content (`src/pages/home.tsx:162`)
   - Initializes IntersectionObserver for active section tracking (`src/pages/home.tsx:171-186`)
   - Renders hero (with imported headshot images from `@assets/`) → skills grid → experience cards → clients grid → CTA banner → footer → Changelog
   - `FadeInSection` wrappers lazy-load `FadeIn.tsx` for scroll-triggered animations (`src/pages/home.tsx:63-73`)

### Changelog Data Flow

1. User clicks "Site Updates" button → `open` state toggles true (`src/components/Changelog.tsx:325`)
2. `useGetReleases` query fires (enabled only when `open` is true) (`src/components/Changelog.tsx:303-310`)
3. React-query fetches from GitHub Releases API via `@workspace/api-client-react`
4. Response rendered as per-release cards with toggle-able Markdown notes (`src/components/Changelog.tsx:392-418`)

### i18n Data Flow

1. `i18n.ts` initializes with `LanguageDetector` and English as fallback (`src/i18n/i18n.ts:13-21`)
2. `languageChanged` event triggers lazy loading of es.json or de.json (`src/i18n/i18n.ts:23-31`)
3. `home.tsx` reads content via `useTranslation()` + `t("key")` calls with `returnObjects` for arrays
4. Language switcher buttons call `i18n.changeLanguage(code)` (`src/pages/home.tsx:167`)

**State Management:**
- React component state (`useState`) for UI state (activeSection, currentLang, open accordions)
- React Query (`@tanstack/react-query`) for server state (GitHub releases)
- i18next for internationalization state
- No global state store (Redux, Zustand, etc.)

## Key Abstractions

**Wolknitive Design System:**
- Purpose: Custom design token system for the dossier brand
- Location: `src/styles/wolknitive-tokens.css`
- Pattern: CSS custom properties on `:root` — neutral vellum palette, teal primary, plum secondary, amber warm accent, type families (Bogart display, Inter Tight UI, JetBrains Mono code), type scale, radii, shadows
- Also contains all `@font-face` declarations for self-hosted fonts with unicode-range subsetting and a Bogart trial-font workaround (digits rendered in Newsreader)

**cn() Utility:**
- Purpose: Merge Tailwind classes safely
- Location: `src/lib/utils.ts`
- Pattern: `twMerge(clsx(inputs))` — standard shadcn/ui pattern
- Used by all shadcn/ui components

**Changelog Markdown Renderer:**
- Purpose: Render GitHub release notes inline without a Markdown library
- Location: `src/components/Changelog.tsx`
- Pattern: Custom two-phase parser (inline → block) that handles `**bold**`, `*italic*`, `` `code` ``, `[text](url)` links, `# heading`, `- list`, ` ```code blocks` 
- Returns typed AST nodes rendered as React elements with Wolknitive styling

**FadeIn Scroll Animation:**
- Purpose: Below-fold scroll-triggered reveal animations
- Location: `src/components/FadeIn.tsx`
- Pattern: `motion.div` with `whileInView`, lazy-loaded via `React.lazy(() => import(...))` to defer framer-motion bundle

## Entry Points

**Development (Vite dev server):**
- Location: `package.json` — `npm run dev`
- Triggers: Vite dev server on PORT, host 0.0.0.0, strictPort
- Responsibilities: HMR dev server with runtime error overlay

**Build:**
- Location: `package.json` — `npm run build`
- Triggers: Vite production build → copies `dist/public/.` to `../../` (monorepo root)
- Responsibilities: Bundle, critical CSS inline, hero image preload, font preload

**Production (Express):**
- Location: `package.json` — `npm run serve`
- Responsibilities: Serve static assets, security headers, SPA fallback
- Requires: PORT env var

## Architectural Constraints

- **Routing:** wouter with `base={import.meta.env.BASE_URL}` — requires `BASE_PATH` env var at build time. App cannot function without it.
- **Immutability:** `/assets/` and `/fonts/` paths served with `max-age=1y, immutable` — file content changes require new filenames (Vite content hashes)
- **SPA fallback:** All unmatched routes serve `index.html` — no server-side rendering
- **Monorepo dependency:** `@workspace/api-client-react` at `../../lib/api-client-react` — changes in that package affect this app
- **Font licensing:** Bogart is a trial font with digit workaround (Newsreader for 0-9); font files are self-hosted in `public/fonts/`
- **Security headers:** Express server enforces CSP, HSTS (2 years preload), X-Frame-Options, COOP (`server.mjs:11-31`)
- **Singleton:** `QueryClient` created as module-level constant in `App.tsx:8` — shared across the app

## Anti-Patterns

### Monolithic Page Component

**What happens:** All dossier content lives in a single 1279-line `src/pages/home.tsx` component with inline styles, section primitives, hero, skills, experience, clients, CTA, and footer all in one file.
**Why it's wrong:** High cognitive load, poor testability, no separation of concerns, difficult to maintain or extend.
**Do this instead:** Extract each section (HeroSection, SkillsGrid, ExperienceTimeline, ClientsGrid, CTABanner, SiteFooter) into separate components under `src/components/home/` — see `src/components/Changelog.tsx` for the pattern that gets it right.

### Inline Styles for Brand Styling

**What happens:** All dossier content styling uses JS inline `style={}` objects instead of CSS classes or Tailwind utilities. Wolknitive CSS variables (`var(--fg-1)`, `var(--font-display)`) and JS constants (`INK`, `TEAL`) are referenced from inline styles.
**Why it's wrong:** No CSS reusability, style constants duplicated in both CSS (`wolknitive-tokens.css`) and JS (`home.tsx:31-40`), poor DX for theming/updates, larger bundle.
**Do this instead:** Define common patterns as CSS classes (`.wk-card`, `.wk-heading`) in `wolknitive-tokens.css` or use Tailwind `@apply` in `index.css`.

### No Linting or Formatting

**What happens:** No linter, no formatter, no test runner configured.
**Why it's wrong:** Inconsistent code style, no automated quality gates, no regression protection.
**Do this instead:** Add `biome` or `eslint` + `prettier` for code quality; add `vitest` for testing.

## Error Handling

**Strategy:** Minimal — no global error boundary. Errors in react-query (`status === "error"`) show fallback messages in `Changelog.tsx`. The Not Found page shows a 404 message. No Sentry or error monitoring.

**Patterns:**
- React Query error/loading states checked in Changelog (`src/components/Changelog.tsx:377-391`)
- No try/catch patterns observed in page code
- Development: `@replit/vite-plugin-runtime-error-modal` for dev overlay

## Cross-Cutting Concerns

**Logging:** Not used. No logging framework — console not referenced.
**Validation:** Zod available as dev dependency but no validation observed in app code.
**Authentication:** Not applicable — public dossier site.
**Performance:**
- CSS-only hero animations (no JS thread blocking)
- Lazy-loaded framer-motion for below-fold sections
- Preloaded fonts + hero image via Vite plugins
- Manual chunk splitting in Vite config: `vendor-react`, `vendor-i18n`
- Immutable caching for assets/fonts
- Beasties critical CSS inlining

---

*Architecture analysis: 2026-06-07*
