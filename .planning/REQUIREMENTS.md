# Requirements: Humberto Bello Dossier — Static Refactor

**Defined:** 2026-06-07
**Core Value:** Present a polished, visually distinctive professional dossier that tells Humberto's story effectively to potential employers and clients — with zero server cost.

## v1 Requirements

### Static Output

- [ ] **STC-01**: Build script assembles single `index.html` from HTML partials using Node built-ins only
- [ ] **STC-02**: All CSS is hand-authored (no Tailwind), using Wolknitive custom properties from tokens
- [ ] **STC-03**: All images (AVIF, WebP headshots, OpenGraph) copied to output with correct relative paths
- [ ] **STC-04**: All fonts (Bogart, Inter Tight, JetBrains Mono, Newsreader) copied to output
- [ ] **STC-05**: Build script is < 200 lines, only uses `fs`, `path`, `url` from Node

### Dependency Cleanup

- [ ] **DEP-01**: React, Vite, react-dom removed from output and dependencies
- [ ] **DEP-02**: shadcn/ui components (55 files) removed
- [ ] **DEP-03**: `@workspace/api-client-react` workspace dep removed
- [ ] **DEP-04**: framer-motion removed, replaced with CSS + IntersectionObserver
- [ ] **DEP-05**: Tailwind v4 removed, utilities replaced with hand-authored CSS
- [ ] **DEP-06**: wouter routing removed (single page)
- [ ] **DEP-07**: Express server and all server code removed
- [ ] **DEP-08**: @tanstack/react-query removed (no API calls)
- [ ] **DEP-09**: lucide-react icons replaced with inline SVGs
- [ ] **DEP-10**: i18next retained as client-side JS (locale JSON files from static assets)

### Visual & Content Preservation

- [ ] **VIZ-01**: Hero section with responsive headshot (AVIF/WebP with srcset) renders identically
- [ ] **VIZ-02**: Experience timeline with tag badges renders identically
- [ ] **VIZ-03**: Skills grid renders identically
- [ ] **VIZ-04**: Client/industry showcase with icons renders identically
- [ ] **VIZ-05**: CSS-only hero entrance animations preserved
- [ ] **VIZ-06**: Wolknitive design tokens (colors, typography, spacing, shadows) preserved
- [ ] **VIZ-07**: Scroll-triggered fade-in animations (replacing framer-motion `FadeInSection`)

### i18n

- [ ] **I18-01**: Language switcher UI preserved in static HTML
- [ ] **I18-02**: English locale content loads by default
- [ ] **I18-03**: Spanish and German locale files load via client-side JS
- [ ] **I18-04**: Language selection persists across page navigation

### SEO

- [ ] **SEO-01**: All existing meta tags, Open Graph, Twitter Cards preserved
- [ ] **SEO-02**: JSON-LD structured data enhanced (Person + WebSite schema)
- [ ] **SEO-03**: Canonical URL set to `https://humbertobellor.github.io/dossier/`
- [ ] **SEO-04**: LinkedIn placeholder URL replaced with real profile: `https://www.linkedin.com/in/humberto-bello/`
- [ ] **SEO-05**: Sitemap regenerated for new URL
- [ ] **SEO-06**: `robots.txt` updated for new domain

### Infrastructure

- [ ] **INF-01**: `404.html` generated for GitHub Pages SPA fallback
- [ ] **INF-02**: `.nojekyll` file included in output
- [ ] **INF-03**: CSP retained via `<meta>` tag (GitHub Pages cannot set HTTP headers)
- [ ] **INF-04**: Build output is deployable to `humbertobellor.github.io/dossier/`
- [ ] **INF-05**: Dark mode via `prefers-color-scheme` CSS media query
- [ ] **INF-06**: Print-friendly CSS stylesheet
- [ ] **INF-07**: `CHANGELOG.md` component removed (no API dependency)

### Code Quality

- [ ] **QLT-01**: Duplicate color constants (CSS tokens and TS inline values) consolidated to single CSS source
- [ ] **QLT-02**: ~60 inline `style={}` objects in home.tsx extracted to CSS classes
- [ ] **QLT-03**: `onMouseEnter`/`onMouseLeave` handlers replaced with CSS `:hover` pseudoclasses
- [ ] **QLT-04**: Unused dependencies removed from `package.json`

## v2 Requirements

Deferred to future iteration.

- **VIZ-08**: Narrative case studies (challenge→approach→outcome replacing job bullets) — content work
- **WCAG-01**: WCAG 2.2 AA accessibility audit and fixes
- **VIZ-09**: Speaking/publications section
- **INF-08**: GitHub Actions auto-deploy workflow

## Out of Scope

| Feature | Reason |
|---------|--------|
| Changelog / GitHub releases | Removed entirely — no live API dependency on static site |
| Replit-specific plugins | Cartographer, dev banner, runtime error modal — Replit-only |
| Contact form | Adds weight/security concerns without serving portfolio purpose |
| Analytics | Not relevant for a credential verification page |
| AI chatbot | Over-engineered for purpose, adds dependency |
| Multi-page site | Single page only — matches current SPA structure |
| Separate HTML per locale | Research suggested this but user chose client-side i18next |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| STC-01 | | Pending |
| STC-02 | | Pending |
| STC-03 | | Pending |
| STC-04 | | Pending |
| STC-05 | | Pending |
| DEP-01 | | Pending |
| DEP-02 | | Pending |
| DEP-03 | | Pending |
| DEP-04 | | Pending |
| DEP-05 | | Pending |
| DEP-06 | | Pending |
| DEP-07 | | Pending |
| DEP-08 | | Pending |
| DEP-09 | | Pending |
| DEP-10 | | Pending |
| VIZ-01 | | Pending |
| VIZ-02 | | Pending |
| VIZ-03 | | Pending |
| VIZ-04 | | Pending |
| VIZ-05 | | Pending |
| VIZ-06 | | Pending |
| VIZ-07 | | Pending |
| I18-01 | | Pending |
| I18-02 | | Pending |
| I18-03 | | Pending |
| I18-04 | | Pending |
| SEO-01 | | Pending |
| SEO-02 | | Pending |
| SEO-03 | | Pending |
| SEO-04 | | Pending |
| SEO-05 | | Pending |
| SEO-06 | | Pending |
| INF-01 | | Pending |
| INF-02 | | Pending |
| INF-03 | | Pending |
| INF-04 | | Pending |
| INF-05 | | Pending |
| INF-06 | | Pending |
| INF-07 | | Pending |
| QLT-01 | | Pending |
| QLT-02 | | Pending |
| QLT-03 | | Pending |
| QLT-04 | | Pending |

**Coverage:**
- v1 requirements: 42 total
- Mapped to phases: 0
- Unmapped: 42 ⚠️

---
*Requirements defined: 2026-06-07*
*Last updated: 2026-06-07 after initial definition*
