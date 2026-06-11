# Codebase Structure

**Analysis Date:** 2026-06-07

## Directory Layout

```

├── .planning/                       # GSD planning artifacts
│   └── codebase/                    # Codebase mapping documents
├── public/                          # Static assets (copied to dist root)
│   ├── favicon.svg
│   ├── fonts/                       # Self-hosted font files (12 .woff2)
│   ├── Humberto_Bello_Resume.pdf
│   ├── opengraph.jpg
│   ├── robots.txt
│   └── sitemap.xml
├── src/                             # Application source
│   ├── components/
│   │   ├── ui/                      # 55 shadcn/ui component files
│   │   ├── Changelog.tsx            # GitHub releases viewer (523 lines)
│   │   └── FadeIn.tsx               # Scroll reveal animation wrapper
│   ├── hooks/
│   │   ├── use-mobile.tsx           # Responsive breakpoint hook
│   │   └── use-toast.ts             # shadcn toast state management
│   ├── i18n/
│   │   ├── i18n.ts                  # i18next setup + lazy locale loading
│   │   └── locales/
│   │       ├── en.json              # English translations
│   │       ├── es.json              # Spanish translations (lazy)
│   │       └── de.json              # German translations (lazy)
│   ├── lib/
│   │   └── utils.ts                 # cn() utility (twMerge + clsx)
│   ├── pages/
│   │   ├── home.tsx                 # Main dossier page (1279 lines)
│   │   └── not-found.tsx            # 404 catch-all
│   ├── styles/
│   │   └── wolknitive-tokens.css    # Design tokens + @font-face (187 lines)
│   ├── App.tsx                      # Root component + router + providers
│   ├── index.css                    # Global styles + Tailwind imports
│   └── main.tsx                     # Entry point (React mount)
├── .replit-artifact/                # Replit deployment artifacts
├── AGENTS.md                        # Opencode agent instructions
├── components.json                  # shadcn/ui configuration
├── index.html                       # HTML shell (SEO meta, font preloads)
├── package.json                     # Package manifest (private, workspace)
├── server.mjs                       # Express 5 production server (54 lines)
├── tsconfig.json                    # TypeScript config (extends base)
└── vite.config.ts                   # Vite build config (206 lines)
```

## Directory Purposes

**`src/`:**
- Purpose: All application source code
- Contains: Components, pages, hooks, i18n, lib utilities, styles
- Key files: `main.tsx` (entry), `App.tsx` (root), `pages/home.tsx` (main page)

**`src/components/ui/`:**
- Purpose: shadcn/ui primitives (new-york style)
- Contains: 55 Radix-based UI component files
- Key files: `button.tsx`, `card.tsx`, `tooltip.tsx`, `toaster.tsx`, `sheet.tsx`, `sidebar.tsx`
- All follow the same pattern: forwardRef + cn() + cva() variants

**`src/pages/`:**
- Purpose: Route-level page components
- Contains: Exactly 2 files — main dossier page and 404
- Key files: `home.tsx` (1279 lines — single file contains entire dossier content)

**`src/hooks/`:**
- Purpose: Reusable React hooks and shared state
- Contains: Toast notification system, mobile breakpoint detection

**`src/i18n/`:**
- Purpose: Internationalization infrastructure
- Contains: i18next config, lazy-loaded translation JSON bundles
- Key files: `i18n.ts` (initialization + lazy loading), `locales/en.json`, `locales/es.json`, `locales/de.json`

**`src/styles/`:**
- Purpose: Custom design system and global styles
- Contains: Wolknitive design tokens, `@font-face` rules, type scale, shadows, radii
- Key files: `wolknitive-tokens.css` (187 lines)

**`public/`:**
- Purpose: Static assets served at root path
- Contains: Fonts (12 .woff2 files), resume PDF, favicon, OG image, SEO files
- Note: Not processed by Vite — linked directly in index.html

**`.planning/`:**
- Purpose: GSD workflow artifacts
- Contains: Planning documents, codebase maps
- Generated: Yes (by GSD commands)
- Committed: Yes (for context persistence)

## Key File Locations

**Entry Points:**
- `src/main.tsx`: React mount — `createRoot(document.getElementById("root")!).render(<App />)`
- `index.html`: HTML shell with SEO metadata, Open Graph, JSON-LD, font preloads
- `server.mjs`: Express 5 production server at root

**Configuration:**
- `vite.config.ts`: Build config — plugins, aliases, chunk splitting, output dir, dev server
- `tsconfig.json`: TS config — extends `../../tsconfig.base.json`, path aliases `@/` and `@assets/`
- `components.json`: shadcn/ui config — new-york style, Tailwind v4 (no config path), RSC off
- `package.json`: Scripts, dependencies, workspace config

**Core Logic:**
- `src/pages/home.tsx`: Entire dossier content — 1279 lines, 6 major sections + nav + footer
- `src/components/Changelog.tsx`: GitHub releases view with custom Markdown renderer
- `src/components/FadeIn.tsx`: Scroll reveal animation via lazy-loaded framer-motion
- `src/styles/wolknitive-tokens.css`: Complete design system — colors, typography, spacing, shadows

**Testing:**
- Not detected — no test files, test configs, or test runner configured

## Naming Conventions

**Files:**
- PascalCase for React components: `FadeIn.tsx`, `Changelog.tsx`, `Home.tsx` (implied by export)
- kebab-case for shadcn/ui files: `alert-dialog.tsx`, `dropdown-menu.tsx`, `input-otp.tsx`
- camelCase for utilities: `utils.ts`, `use-toast.ts`, `use-mobile.tsx`
- lowercase with dots for config: `vite.config.ts`, `components.json`, `server.mjs`

**Functions:**
- camelCase for all functions: `formatDate`, `isAutoGenerated`, `parseInline`, `parseBlocks`, `cn`, `useToast`
- PascalCase for React components: `FadeInSection`, `MarkdownBody`, `ReleaseRow`, `Tag`, `WkRule`, `SectionHeader`
- PascalCase for type aliases: `InlineNode`, `BlockNode`, `ToasterToast`, `State`, `Action`

**Variables:**
- camelCase: `activeSection`, `currentLang`, `queryClient`, `basePath`, `navLinks`
- UPPER_SNAKE for CSS variable constants in JS: `INK`, `TEAL`, `TEAL_6`, `V50`, `V100`, etc.
- UPPER_CASE for module-level constants: `OWNER`, `REPO`, `AUTO_GENERATED_RE`, `MOBILE_BREAKPOINT`, `TOAST_LIMIT`

**Types:**
- PascalCase for interfaces and type aliases: `Release`, `InlineNode`, `BlockNode`, `ToastProps`, `ToastActionElement`
- Single-letter generics used sparingly

## Where to Add New Code

**New Feature (e.g., new section on dossier):**
- Primary code: If it's a new page section, create `src/components/home/<SectionName>.tsx` and import in `src/pages/home.tsx`
- For a new route entirely: Add route in `src/App.tsx` Switch, create page in `src/pages/`

**New Component/Module:**
- UI primitives: `src/components/ui/<name>.tsx` (follow shadcn pattern: forwardRef + cn + cva)
- Feature components: `src/components/<Feature>.tsx` (see `FadeIn.tsx` as pattern)
- Hooks: `src/hooks/use-<name>.ts` or `.tsx`

**New Translation:**
- Add locale file in `src/i18n/locales/<lang>.json`
- Add lazy import in `src/i18n/i18n.ts` `loadLocale` function

**New Style/Design Token:**
- Add CSS custom properties to `src/styles/wolknitive-tokens.css`
- Import via `@import` in `src/index.css`
- For Tailwind theme: add `@theme inline {}` block in `src/index.css`

**New Static Asset:**
- Fonts: `public/fonts/` (add preload `<link>` to `index.html`)
- Images: `../../attached_assets/` (referenced via `@assets/` alias)
- Documents: `public/` root

**New API Integration:**
- If responding to a new endpoint: `@workspace/api-client-react` (monorepo dep)
- If using React Query: follow pattern in `Changelog.tsx` (enabled flag, staleTime, gcTime, retry)

**Testing:**
- Not yet configured. Recommended setup: `vitest` with co-located `*.test.ts` files mirroring source tree

## Special Directories

**`../../attached_assets/` (outside package):**
- Purpose: Static images (headshots) used via `@assets` alias
- Generated: No
- Committed: Yes (Replit attached assets)
- Referenced by: `src/pages/home.tsx` (headshot images in WebP and AVIF at 1x and full resolutions)

**`../../lib/api-client-react/` (outside package):**
- Purpose: Shared API client (React Query hooks + generated types)
- Generated: Yes (via openapi-generator)
- Committed: Yes (monorepo workspace)
- Referenced by: `src/components/Changelog.tsx` — imports `useGetReleases`, `getGetReleasesQueryKey`, `type Release`

**`dist/public/` (build output):**
- Purpose: Production build output
- Generated: Yes (by `vite build`)
- Not committed
- Structure: `index.html`, `assets/` (hashed JS/CSS), `fonts/`

---

*Structure analysis: 2026-06-07*
