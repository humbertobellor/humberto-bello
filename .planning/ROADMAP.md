# Roadmap: Humberto Bello Dossier — Static Refactor

## Overview

Refactor the existing React 19/Vite/TypeScript SPA into a zero-dependency static HTML+CSS site with the same visual identity. Five phases: strip framework dependencies and extract clean CSS, build the Node build script and partials, copy assets and remove dead code, add SEO/i18n polish, then deploy to GitHub Pages. The result is a faster, lighter site with zero server cost and zero framework overhead.

## Phases

- [x] **Phase 1: CSS Architecture** — Extract inline styles, consolidate Wolknitive tokens, replace Tailwind/framer-motion/lucide with hand-authored CSS and vanilla JS (2026-06-07)
- [ ] **Phase 2: Build System** — Create Node build script, assemble HTML partials, remove React/Vite/Express from output
- [ ] **Phase 3: Asset Pipeline + Dead Code Cleanup** — Copy fonts/images to output, remove shadcn/ui, api-client, CHANGELOG, fix LinkedIn URL
- [ ] **Phase 4: SEO + i18n** — Per-locale meta tags, JSON-LD, sitemap, language switcher with client-side i18next
- [ ] **Phase 5: Deploy Configuration** — Configure GitHub Pages output, add .nojekyll, verify live site

## Phase Details

### Phase 1: CSS Architecture
**Goal**: Clean, maintainable CSS with all inline styles extracted, Wolknitive tokens consolidated, and framework-driven animations replaced with CSS/vanilla JS — visual integrity verified on dev server
**Depends on**: Nothing (first phase)
**Requirements**: DEP-04, DEP-05, DEP-09, INF-05, INF-06, QLT-01, QLT-02, QLT-03, STC-02, VIZ-01, VIZ-02, VIZ-03, VIZ-04, VIZ-05, VIZ-06, VIZ-07
**Success Criteria** (what must be TRUE):
  1. All 7 content sections (hero, experience, skills, clients, nav, footer, about) render visually identical to the current site when served via dev server
  2. All styling is in hand-authored CSS classes — no inline `style={}` objects, no Tailwind utilities remain in source
  3. Wolknitive color tokens (background, accent, text, shadow) exist in one CSS source — no duplicate constants in TypeScript
  4. Hero entrance animations play on load, scroll-triggered fade-ins trigger via IntersectionObserver — no framer-motion dependency
  5. lucide-react icon imports are replaced with inline SVGs that render identically; all hover/tap interactions work via CSS `:hover`
  6. Dark mode (`prefers-color-scheme`) and print stylesheets are authored as CSS
**Plans**: TBD
**UI hint**: yes

### Phase 2: Build System
**Goal**: Node build script produces a single valid `index.html` for the default locale, assembled from HTML partials, with all framework dependencies removed from output
**Depends on**: Phase 1
**Requirements**: DEP-01, DEP-06, DEP-07, DEP-08, DEP-10, INF-01, INF-03, STC-01, STC-05
**Success Criteria** (what must be TRUE):
  1. Running `npm run build` produces `dist/index.html` with all content rendered and styled, all CSS inlined in `<style>` blocks
  2. Build script is ≤200 lines and imports only `fs`, `path`, `url` from Node.js — no npm build dependencies
  3. No React, Vite, wouter, Express, or react-query code or dependencies remain in source or build output
  4. i18next and its locale JSON files load as client-side static assets — no server-side rendering, no locale files in build output path
  5. `dist/404.html` is generated alongside the main page with matching layout and navigation
  6. CSP meta tag with restrictive directives is present in the output `<head>`
**Plans**: TBD

### Phase 3: Asset Pipeline + Dead Code Cleanup
**Goal**: All static assets (fonts, images) copied to output with correct relative paths, dead code removed from the tree
**Depends on**: Phase 2
**Requirements**: DEP-02, DEP-03, INF-07, QLT-04, SEO-04, STC-03, STC-04
**Success Criteria** (what must be TRUE):
  1. All 4 font families (Bogart, Inter Tight, JetBrains Mono, Newsreader) are in `dist/fonts/` with correct relative paths from output HTML
  2. Headshot images (AVIF/WebP with srcset variants) and OpenGraph image are in `dist/images/` with correct relative paths
  3. `src/components/ui/` directory (55 shadcn/ui files) and `@workspace/api-client-react` dep are removed — no imports reference them
  4. CHANGELOG component is removed — no API client dependency exists in build output
  5. LinkedIn profile link resolves to `https://www.linkedin.com/in/humberto-bello/` — no placeholder URL
  6. `package.json` lists only necessary runtime and dev dependencies — no Tailwind, shadcn, framer-motion, lucide-react, etc.
**Plans**: TBD

### Phase 4: SEO + i18n
**Goal**: Full multilingual support and SEO architecture for GitHub Pages deployment
**Depends on**: Phase 2
**Requirements**: I18-01, I18-02, I18-03, I18-04, SEO-01, SEO-02, SEO-03, SEO-05, SEO-06
**Success Criteria** (what must be TRUE):
  1. Language switcher UI in the nav toggles between en/es/de — content updates without page reload
  2. English is the default locale on first visit; Spanish and German content loads on language selection
  3. Language choice persists across page visits (localStorage)
  4. Open Graph, Twitter Card, and meta description tags are present and correct for all 3 locales
  5. JSON-LD structured data (Person + WebSite schema) is present in the output HTML
  6. Canonical URL is set to `https://humbertobellor.github.io/dossier/`
  7. `sitemap.xml` includes all 3 locale variants with correct hreflang annotations and x-default
  8. `robots.txt` points to the new sitemap URL and allows crawling
**Plans**: TBD
**UI hint**: yes

### Phase 5: Deploy Configuration
**Goal**: Site is live on GitHub Pages, all asset paths resolve correctly, pages render without console errors
**Depends on**: Phase 3, Phase 4
**Requirements**: INF-02, INF-04
**Success Criteria** (what must be TRUE):
  1. `dist/` directory structure is deployable to GitHub Pages subdirectory — all asset paths use `/dossier/` prefix, no absolute `/` paths
  2. `.nojekyll` file is present at the deploy root
  3. Site is live at `https://humbertobellor.github.io/dossier/` after deploy
  4. All asset paths (fonts, images, preloads) resolve on the live site — no 404s in browser console
  5. All 3 locale pages render without visual regressions compared to the original Replit-hosted site
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. CSS Architecture | 4/4 | Complete | 2026-06-07 |
| 2. Build System | 0/0 | Not started | - |
| 3. Asset Pipeline + Cleanup | 0/0 | Not started | - |
| 4. SEO + i18n | 0/0 | Not started | - |
| 5. Deploy Configuration | 0/0 | Not started | - |
