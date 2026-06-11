# Humberto Bello Dossier — Static Refactor

## What This Is

A static HTML+CSS version of Humberto Bello's professional dossier site, hosting on GitHub Pages instead of Replit. Single-page portfolio showcasing experience, skills, and industry background — same visual identity, simpler architecture.

## Core Value

Present a polished, visually distinctive professional dossier that tells Humberto's story effectively to potential employers and clients — with zero server cost.

## Requirements

### Validated

Inferred from existing codebase. Already working and shipping.

- ✓ Professional homepage with hero, experience, skills, and industry sections
- ✓ Custom Wolknitive design system (warm vellum/teal palette, Bogart/Inter Tight/JetBrains Mono fonts)
- ✓ CSS-only hero entrance animations
- ✓ i18n with English, Spanish, German locale files
- ✓ Responsive layout
- ✓ SEO metadata (Open Graph, Twitter Cards, JSON-LD structured data)
- ✓ Custom AVIF/WebP headshot with responsive srcset
- ✓ Production-ready CSP and security headers
- ✓ Custom font self-hosting (Bogart trial, Inter Tight, JetBrains Mono, Newsreader)
- ✓ Sitemap and robots.txt

### Active

- [ ] **STATIC-01**: Produce single `index.html` with all content inlined or loaded as static assets
- [ ] **STATIC-02**: Scripted build step (Node) that assembles HTML from partials, copies assets
- [ ] **STATIC-03**: Remove React, Vite, and all framework dependencies from output
- [ ] **STATIC-04**: Remove Changelog component and `@workspace/api-client-react` dependency
- [ ] **STATIC-05**: Keep i18n language switcher via i18next + static JSON locale files
- [ ] **STATIC-06**: Strip unused shadcn/ui components (55 files, ~5,700 lines dead code)
- [ ] **STATIC-07**: Replace inline styles with proper CSS classes
- [ ] **STATIC-08**: Clean up duplicate color constants (Wolknitive tokens in both CSS and TS)
- [ ] **STATIC-09**: Fix LinkedIn placeholder URL with real profile link
- [ ] **STATIC-10**: Improve SEO (canonical, meta descriptions, structured data refinements)
- [ ] **STATIC-11**: Generate 404.html for GitHub Pages SPA fallback
- [ ] **STATIC-12**: Deploy to GitHub Pages (`bertjbello.com`)

### Out of Scope

- Changelog/github-releases integration — removed, no live API dependency
- Replit hosting — migrating away
- Express server — site is static only
- The unused shadcn/ui components — removed in the refactor
- New content or sections — preserving what exists
- Separate HTML files per section — single page only
- Pixel-perfect recreation — "same layout, cleaner code"

## Context

Current site is a React 19 SPA (Vite + TypeScript) served via Express on Replit. Heavy framework overhead for a single-page dossier. The site has a distinctive custom design system ("Wolknitive") with warm vellum tones, teal/plum accents, and a serif-heavy (Bogart) typographic palette. The home page (`src/pages/home.tsx`) is a 1,279-line monolithic component with extensive inline styles mixed with Tailwind utility classes.

The CONCERNS.md scan flagged: 55 unused shadcn/ui components (~5,766 lines), zero test coverage, no linter/formatter, duplicate color constants, a LinkedIn placeholder URL, and a permissive CSP. This refactor addresses all of these.

## Constraints

- **Hosting**: Must work as 100% static files — no server, no build-time server
- **Deploy target**: GitHub Pages (`bertjbello.com`)
- **Timeline**: This session — plan through execution complete
- **Output**: Single `index.html` (plus `404.html` for SPA routing)
- **No new dependencies**: Use Node built-ins only for build script
- **i18n**: Keep client-side i18next with existing JSON locale files

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| i18next client-side JS | Locale JSON files serve as static assets on GitHub Pages | — Pending |
| Scripted Node build | Automatable, reproducible, keeps source maintainable | — Pending |
| Strip all shadcn/ui components | Not used anywhere in the page, pure dead code weight | — Pending |
| Remove Changelog entirely | Requires API client dep, not worth keeping for static site | — Pending |
| Single index.html output | Matches current SPA structure, simpler deploy | — Pending |
| Improve SEO | Free signal quality improvement on migration | — Pending |
| Fix LinkedIn URL placeholder | Known issue from CONCERNS.md scan | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-07 after initialization*
