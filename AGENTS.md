# humberto-bello — personal dossier site

React SPA (Vite + TS) — single-page professional dossier for Humberto Bello, deployed on Replit.

## Quick start

```bash
npm run dev
```

Requires env vars `PORT` and `BASE_PATH` at dev/build time. Served via Express in production.

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Dev server (requires `PORT` + `BASE_PATH` env) |
| `npm run build` | Vite build → critical CSS inline → copy to `../../` |
| `npm run serve` | Production Express server on `PORT` |
| `npm run typecheck` | `tsc --noEmit` + check-fonts from `@workspace/scripts` |

## Stack quirks

- **Tailwind v4** via `@tailwindcss/vite` plugin — no `tailwind.config.js`
- **shadcn/ui** (new-york style), components at `src/components/ui/`
- **wouter** for routing (not react-router)
- **i18next** with lazy-loaded `es`, `de` bundles
- **framer-motion** only used in `FadeIn.tsx`; hero animations are CSS-only
- **@workspace/api-client-react** is a monorepo workspace dep (lives in `../../lib/api-client-react`)
- `@assets` alias → `../../attached_assets/` (outside the package dir)
- No linter, no formatter, no test runner configured

## Build pipeline

Custom Vite plugins for critical CSS (Beasties), hero image `<link rel="preload">`, and font preload injection. Build output goes to `dist/public/`.

## Env vars

- `PORT` — required, must be a positive integer
- `BASE_PATH` — required, used as Vite `base`
- `REPL_ID` — optional, enables Replit-specific plugins (cartographer + dev banner)
- `ANALYZE=1` — emits bundle stats to `dist/bundle-stats.html`

## App structure

Entrypoint: `src/main.tsx` → `src/App.tsx` (wouter router, react-query, tooltip provider). Single page component at `src/pages/home.tsx` (1279 lines). 404 route at `src/pages/not-found.tsx`.

<!-- GSD:project-start source:PROJECT.md -->
## Project

**Humberto Bello Dossier — Static Refactor**

A static HTML+CSS version of Humberto Bello's professional dossier site, hosting on GitHub Pages instead of Replit. Single-page portfolio showcasing experience, skills, and industry background — same visual identity, simpler architecture.

**Core Value:** Present a polished, visually distinctive professional dossier that tells Humberto's story effectively to potential employers and clients — with zero server cost.

### Constraints

- **Hosting**: Must work as 100% static files — no server, no build-time server
- **Deploy target**: GitHub Pages (`bertjbello.com`)
- **Timeline**: This session — plan through execution complete
- **Output**: Single `index.html` (plus `404.html` for SPA routing)
- **No new dependencies**: Use Node built-ins only for build script
- **i18n**: Keep client-side i18next with existing JSON locale files
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript ~5.9.2 — Whole application (TSX/TS). Strict mode enabled via `tsconfig.base.json` (`"strict": true` variant with `strictNullChecks`, `noImplicitAny`, `noImplicitThis`, `useUnknownInCatchVariables`). JSX mode: `"preserve"` (handled by Vite).
## Runtime
- Node.js 24 (declared in `.replit` as `nodejs-24` module)
- pnpm (enforced by `preinstall` hook in root `package.json`; `package-lock.json` and `yarn.lock` deleted on install)
- Lockfile: `pnpm-lock.yaml` (monorepo root)
- Workspace config: `pnpm-workspace.yaml` — packages: `artifacts/*`, `lib/*`, `lib/integrations/*`, `scripts`
- Catalog protocol: shared version pinning in `pnpm-workspace.yaml` for all major deps (React, Vite, Tailwind, etc.)
- Workspace dep: `@workspace/api-client-react` at `workspace:*`
## Frameworks
- React 19.1.0 — UI library (strict pinned via catalog)
- Vite ^7.3.2 — Build tool and dev server
- wouter ^3.3.5 — Lightweight router (no react-router)
- Express ^5.2.1 — Static file server (serves Vite build output from `dist/public/`)
- shadcn/ui (new-york style) — 55 UI components at `src/components/ui/`
- Tailwind CSS ^4.1.14 — Utility-first CSS (no `tailwind.config.js`, v4 uses CSS-based config via `@tailwindcss/vite`)
- Self-hosted fonts: Bogart (display/headings), Inter Tight (UI), JetBrains Mono (code), Newsreader (Bogart digit fallback)
- i18next ^26.0.6 — i18n framework
- react-i18next ^17.0.4 — React bindings
- i18next-browser-languagedetector ^8.2.1 — Browser language detection (navigator.language, cookie, etc.)
- Locales: `en` (bundled), `es`, `de` (lazy-loaded via dynamic `import()`)
- @tanstack/react-query ^5.90.21 — Server state management (QueryClient in `src/App.tsx`)
- framer-motion ^12.23.24 — Only used in `src/components/FadeIn.tsx` (scroll-into-view fade-up)
- CSS keyframe animations — Hero section entrance animations (7 custom `@keyframes` in `src/index.css`)
- react-hook-form ^7.55.0 — Form state management
- @hookform/resolvers ^3.10.0 — Resolver bridge
- zod ^3.25.76 — Schema validation
- input-otp ^1.4.2 — OTP input
- react-day-picker ^9.11.1 — Date picker
- lucide-react ^0.545.0 — Primary icon set (~22 icons used in `src/pages/home.tsx`)
- react-icons ^5.4.0 — Fallback icon library
- recharts ^2.15.2 — Chart rendering
- date-fns ^3.6.0 — Date formatting
- cmdk ^1.1.1 — Command menu (used by shadcn Command component)
- embla-carousel-react ^8.6.0 — Carousel (used by shadcn Carousel component)
- sonner ^2.0.7 — Toast notifications (via shadcn Sonner component)
- vaul ^1.1.2 — Drawer (used by shadcn Drawer component)
- next-themes ^0.4.6 — Theme switching (dark/light mode toggle)
- react-resizable-panels ^2.1.7 — Resizable panels
## TypeScript Configuration
- Target: ES2022, Module: ESNext, ModuleResolution: bundler
- Strict null checks, no implicit any, unknown catch variables
- No unused locals (false), no implicit override (false), skipLibCheck: true
- Extends `../../tsconfig.base.json`
- Includes `src/**/*`
- Paths: `@/*` → `./src/*`
- Project reference to `../../lib/api-client-react`
- Types: `node`, `vite/client`
## Configuration
- Dev: `npm run dev` — `vite --config vite.config.ts --host 0.0.0.0` (requires `PORT` and `BASE_PATH`)
- Build: `npm run build` — `vite build` + copy `dist/public/` to `../../`
- Serve: `npm run serve` — node `server.mjs`
- Typecheck: `npm run typecheck` — `tsc --noEmit` + check-fonts script
- Kind: web, Port: 23561, Preview: `/`
- Dev command: `pnpm --filter @workspace/humberto-bello run dev`
- Build command: `pnpm --filter @workspace/humberto-bello run build`
- Prod command: `pnpm --filter @workspace/humberto-bello run serve`
- Entry: `src/main.tsx` → renders `<App />` into `#root`
- Root component: `src/App.tsx` — Providers (QueryClient, Tooltip, Router) + Toaster
- Single page: `src/pages/home.tsx` (1279 lines) — The complete professional dossier
- CSS: `src/index.css` (Tailwind + Wolknitive theme) + `src/styles/wolknitive-tokens.css`
- i18n: `src/i18n/i18n.ts` with locales at `src/i18n/locales/{en,es,de}.json`
- Beasties ^0.4.2 — Critical CSS extraction and inlining (used in `criticalCssPlugin`)
- sharp ^0.34.5 — Image processing (monorepo root devDep, used by scripts)
## Platform Requirements
- Node.js 24
- pnpm
- Environment variables: PORT, BASE_PATH must be set
- Deployed on Replit (Node.js 24 environment)
- Express server on configurable port (default 23561 in artifact config)
- Serves static build output + SPA fallback route
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- PascalCase for component files: `Button.tsx`, `Card.tsx`, `FadeIn.tsx`, `Changelog.tsx`
- kebab-case for CSS files: `wolknitive-tokens.css`
- Lowercase with dots for config: `vite.config.ts`, `tsconfig.json`, `components.json`
- Page files use kebab-case: `not-found.tsx`, `home.tsx`
- PascalCase for component functions (both page and UI): `function Home()`, `function Button()`, `function Router()`, `function App()`
- camelCase for utility/hook functions: `cn()`, `useToast()`, `useIsMobile()`, `genId()`, `formatDate()`
- Local helper components defined as inner functions in same file: `FadeInSection`, `WkRule`, `SectionHeader`, `Tag` inside `home.tsx`
- Named function declarations preferred over arrow functions: `function App()`, `function Router()`
- Exception: `const Button = React.forwardRef<...>(({...}) => ( ... ))` — arrow with forwardRef
- camelCase for all JS identifiers
- UPPER_SNAKE_CASE for module-level constants: `TOAST_LIMIT`, `TOAST_REMOVE_DELAY`, `MOBILE_BREAKPOINT`, `INK`, `TEAL`, `V50`–`V700`, `OWNER`, `REPO`, `AUTO_GENERATED_RE`
- UPPER_SNAKE_CASE for regex: `AUTO_GENERATED_RE`
- Single-character loop indices: `i`, `bi`, `ii`
- PascalCase for type/interface names: `ToasterToast`, `Action`, `State`, `ToastProps`, `ToastActionElement`
- PascalCase with `Props` suffix for component props: `ButtonProps`, `BadgeProps`
- Inline type annotations in function signatures: `{ children: React.ReactNode; delay?: number }` (preferred over separate type declarations for single-use props)
- Discriminated union types with `type` field: `Action` in `use-toast.ts`, `InlineNode` in `Changelog.tsx`
- PascalCase enums at module level via `type` object pattern: `ActionType`
## Code Style
- **No formatter configured** — No `.prettierrc`, `biome.json`, or `.editorconfig` found
- Single quotes consistently used for JS/TS strings: `import ... from 'react'`, `'wk-rule'`
- Semicolons: **always used** (consistent throughout codebase)
- Trailing commas: yes, in multi-line arrays/objects
- Indentation: 2-space, consistent
- JSX bracket style: closing `/>` on same line for self-closing, multiline props get closing on new line
- **No linter configured** — No `.eslintrc*`, `eslint.config.*`, or rule files
- Only TypeScript compiler provides basic checking via `tsconfig.json` and `tsconfig.base.json`
- Only validation command: `npm run typecheck` runs `tsc --noEmit`
## TypeScript Strictness
## Import Organization
- `@/*` → `./src/*` (configured in `tsconfig.json` and `vite.config.ts`)
- `@assets/*` → `../../attached_assets/*` (configured in `vite.config.ts` only)
- shadcn/ui `components.json` defines: `@/components`, `@/lib`, `@/hooks`, `@/components/ui`
- `import * as React from "react"` — used in all shadcn/ui components
- `import type { ... }` — separate type imports for type-only symbols (`use-toast.ts`)
- Named imports from Radix UI primitives: `import * as DialogPrimitive from "@radix-ui/react-dialog"`
- Asset imports as default imports: `import headshotWebp from "@assets/headshot-corp_1776959044728.webp"`
## Component Patterns
- `"use client"` directive at top of interactive UI components (`tooltip.tsx`)
- `cn()` helper wraps `clsx` + `tailwind-merge` for className merging
- `cva()` from `class-variance-authority` for variant-based component styling
- Named exports at file bottom: `export { Button, buttonVariants }`
- Some components re-export Radix primitive directly: `const Tooltip = TooltipPrimitive.Root`
- `@replit` comments annotate custom deviations from shadcn defaults
- `src/pages/home.tsx` uses extensive `style={{}}` inline styling (not Tailwind classes) for the custom design system — 1279 lines, largest file in codebase
- `src/pages/not-found.tsx` uses shadcn `Card` components + Tailwind classes
- Local helper components defined as inner `function` in same file for encapsulation
- `data-testid` attributes on interactive elements for testing
## Error Handling
- Build-time validation via throw: `throw new Error("PORT environment variable is required...")` — in `vite.config.ts`
- Runtime errors handled inline via conditionals: `if (!body) return false`
- React Query `status` field for async state: `status === "pending"`, `status === "error"`, `status === "success"` — in `Changelog.tsx`
- No try/catch blocks found in source code
- No error boundaries found
- Component-level error states rendered inline: `{status === "error" && <p>Could not load releases.</p>}`
- No error boundaries (`ErrorBoundary` or `react-error-boundary`)
- No formal error handling strategy for API failures beyond React Query `status`
- No global error handler
## Logging
- `console.error()` in Vite build plugins for error reporting: `console.error("[critical-css-inline] Could not read...")`
- No structured logging, no log levels
- No production logging infrastructure
## Comments
- Section dividers: `/* ──────── STICKY NAV ──────── */` — visual separators in large files
- Explanatory comments for non-obvious code: `/* Trial-font workaround: digits 0-9 replaced... */`
- `@replit` annotations mark custom shadcn deviations
- JSDoc-style documentation comments: `/** Editorial double-rule section separator */`
- `// ! Side effects !` — inline developer notes
- CSS uses `/* Primary SEO */`, `/* Open Graph */`, `/* Font preload hints */`
- Minimal usage — only for a few component descriptions
- Not systematically applied
## Function Design
- UI component functions: 1–30 lines (shadcn components)
- Utility functions: 1–10 lines
- `src/pages/home.tsx` `Home` component: 1279 lines (monolithic — largest concern)
- `src/components/Changelog.tsx` `Changelog` component: 523 lines
- Props destructured in function signature: `{ className, variant, size, ...props }`
- Simple inline prop type annotations for local components
- `React.HTMLAttributes<HTMLDivElement>` for generic HTML wrapper components
- `React.ComponentPropsWithoutRef<typeof ...>` for Radix-based wrappers
- Components return JSX expressions (implicit return in arrow functions, explicit `return` in function declarations)
- Utility functions return primitives or `React.ReactNode[]` for render functions
## Module Design
- shadcn components: named exports only (`export { Button, buttonVariants }`)
- Page components: default export only (`export default function Home`)
- Hooks: named export (`export { useToast, toast }`)
- Utilities: named export (`export function cn(...)`)
- Not used — `components.json` aliases route directly to individual files
## CSS Conventions
- `src/styles/wolknitive-tokens.css` — Design token definitions (CSS custom properties), `@font-face`, utility classes
- `src/index.css` — Imports tokens, Tailwind v4 directives (`@import "tailwindcss"`, `@plugin`, `@theme inline`), base layer, keyframe animations
- shadcn components: Tailwind utility classes via `className`
- Custom components (`home.tsx`, `Changelog.tsx`): Inline `style={}` objects with CSS custom properties as `var(--font-display)` strings
- No `tailwind.config.js` — Tailwind v4 uses CSS-based config via `@theme inline {}`
- `@custom-variant dark (&:is(.dark *))` for dark mode
- `@plugin "@tailwindcss/typography"` for typography plugin
- Named `wk-*` prefix: `wkFadeSlideLeft`, `wkFadeSlideRight`, `wkFadeScaleIn`, etc.
- Animation classes: `wk-anim-fade-left`, `wk-anim-fade-right`, etc.
- Hero section uses CSS animations only (no framer-motion above the fold)
- Framer Motion (`FadeIn.tsx`) lazy-loaded for below-fold sections only
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## System Overview
```text
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
- Single page component (`src/pages/home.tsx` at 1279 lines) that contains all content inline — no sub-routes
- wouter for lightweight client-side routing (not react-router)
- All page sections rendered on a single route; section navigation via `scrollIntoView` + `IntersectionObserver` for active tracking
- CSS-only hero animations (above the fold); lazy-loaded framer-motion for below-fold reveal animations
- Custom design tokens system ("Wolknitive") via CSS custom properties, not Tailwind's theme config
- Tailwind v4 used for responsive layout grid only (grid-cols, hidden md:block, etc.)
- All styling uses inline `style={}` objects referencing CSS variable names (var(--x)) — no Tailwind utility classes for the dossier content
- `@workspace/api-client-react` is a monorepo workspace dependency at `../../lib/api-client-react`
## Layers
- Purpose: Mount React app to DOM
- Location: `src/main.tsx`
- Contains: `createRoot` call, importing `App`, global CSS, and i18n initialization
- Depends on: React 19
- Used by: `index.html` (script tag)
- Purpose: Configure providers and routing
- Location: `src/App.tsx`
- Contains: `QueryClientProvider` (react-query), `TooltipProvider` (Radix), `WouterRouter`, `Toaster`
- Depends on: `@tanstack/react-query`, `wouter`, `@radix-ui/react-tooltip`
- Used by: `main.tsx`
- Purpose: Single-page content sections
- Location: `src/pages/`
- Contains: `home.tsx` (hero, skills, experience, clients, CTA, footer), `not-found.tsx`
- Depends on: components, i18n, hooks, `@workspace/api-client-react`
- Used by: `App.tsx` router
- Purpose: Reusable UI building blocks
- Location: `src/components/`
- Contains: 55 shadcn/ui primitives, `FadeIn.tsx`, `Changelog.tsx`
- Depends on: Radix primitives, framer-motion, lucide-react, `@workspace/api-client-react`
- Used by: page layer
- Purpose: Shared state, utilities, i18n
- Location: `src/hooks/`, `src/lib/`, `src/i18n/`, `src/styles/`
- Contains: `useIsMobile`, `useToast`/`toast`, `cn()` utility, i18n setup, design tokens CSS
- Depends on: tailwind-merge, clsx, i18next, react-i18next
- Used by: pages and components
- Purpose: Compile, bundle, optimize
- Location: `vite.config.ts`
- Contains: React plugin, Tailwind CSS v4 plugin, Beasties critical CSS, hero image preload, Bogart font preload, Replit plugins (conditional), bundle analyzer (conditional)
- Depends on: `@vitejs/plugin-react`, `@tailwindcss/vite`, `beasties`
- Used by: build pipeline
- Purpose: Production static serving
- Location: `server.mjs`
- Contains: Express 5 app, security headers middleware, immutable asset caching, SPA fallback route
- Depends on: `express`
- Used by: production deployment
## Data Flow
### Primary Request Path
### Changelog Data Flow
### i18n Data Flow
- React component state (`useState`) for UI state (activeSection, currentLang, open accordions)
- React Query (`@tanstack/react-query`) for server state (GitHub releases)
- i18next for internationalization state
- No global state store (Redux, Zustand, etc.)
## Key Abstractions
- Purpose: Custom design token system for the dossier brand
- Location: `src/styles/wolknitive-tokens.css`
- Pattern: CSS custom properties on `:root` — neutral vellum palette, teal primary, plum secondary, amber warm accent, type families (Bogart display, Inter Tight UI, JetBrains Mono code), type scale, radii, shadows
- Also contains all `@font-face` declarations for self-hosted fonts with unicode-range subsetting and a Bogart trial-font workaround (digits rendered in Newsreader)
- Purpose: Merge Tailwind classes safely
- Location: `src/lib/utils.ts`
- Pattern: `twMerge(clsx(inputs))` — standard shadcn/ui pattern
- Used by all shadcn/ui components
- Purpose: Render GitHub release notes inline without a Markdown library
- Location: `src/components/Changelog.tsx`
- Pattern: Custom two-phase parser (inline → block) that handles `**bold**`, `*italic*`, `` `code` ``, `[text](url)` links, `# heading`, `- list`, ` ```code blocks` 
- Returns typed AST nodes rendered as React elements with Wolknitive styling
- Purpose: Below-fold scroll-triggered reveal animations
- Location: `src/components/FadeIn.tsx`
- Pattern: `motion.div` with `whileInView`, lazy-loaded via `React.lazy(() => import(...))` to defer framer-motion bundle
## Entry Points
- Location: `package.json` — `npm run dev`
- Triggers: Vite dev server on PORT, host 0.0.0.0, strictPort
- Responsibilities: HMR dev server with runtime error overlay
- Location: `package.json` — `npm run build`
- Triggers: Vite production build → copies `dist/public/.` to `../../` (monorepo root)
- Responsibilities: Bundle, critical CSS inline, hero image preload, font preload
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
### Inline Styles for Brand Styling
### No Linting or Formatting
## Error Handling
- React Query error/loading states checked in Changelog (`src/components/Changelog.tsx:377-391`)
- No try/catch patterns observed in page code
- Development: `@replit/vite-plugin-runtime-error-modal` for dev overlay
## Cross-Cutting Concerns
- CSS-only hero animations (no JS thread blocking)
- Lazy-loaded framer-motion for below-fold sections
- Preloaded fonts + hero image via Vite plugins
- Manual chunk splitting in Vite config: `vendor-react`, `vendor-i18n`
- Immutable caching for assets/fonts
- Beasties critical CSS inlining
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
