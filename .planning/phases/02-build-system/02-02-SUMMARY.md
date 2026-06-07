---
phase: 02-build-system
plan: 02
subsystem: build
tags: [node, build-script, html-assembly, css-inlining, i18next]
requires:
  - phase: 01-css-architecture
    provides: CSS source files (tokens, base, animations) in src/styles/
  - phase: 02-build-system-01
    provides: HTML partials in src/html/ with <!--#include--> marker pattern
provides:
  - Zero-dependency Node build script (scripts/build.mjs)
  - Build output: dist/index.html, dist/404.html with inlined CSS
  - Scaffolded dist/locales/, dist/fonts/, dist/images/ directories
  - i18next locale JSON files copied to dist/locales/
  - Updated package.json scripts (build, dev, serve)
affects: [03-asset-pipeline, 04-seo-i18n, 05-deploy]
tech-stack:
  added: []
  patterns:
    - Marker-replacement HTML assembly (<!--#include path-->)
    - CSS inlining from source files into <style> blocks
    - Asset path rewriting via BASE_PATH env var
    - Zero-dependency Node build (fs/path/url only)
key-files:
  created:
    - scripts/build.mjs
  modified:
    - package.json
key-decisions:
  - "CSS placeholder uses `/* injected by build script */` comment (not HTML comment) — matches Plan 01 _head.html output"
  - "i18next vendor JS copy uses existsSync guard — node_modules may not be installed at build time"
  - "Asset path rewriting covers href/src for /fonts/ and src/srcset for /images/ only"
requirements-completed: [DEP-01, DEP-06, DEP-07, DEP-08, STC-01, STC-05]
duration: 6min
completed: 2026-06-07
---

# Phase 2 Plan 2: Build Script — Summary

**Zero-dependency Node build script (83 lines) that assembles HTML from partials, inlines 3 CSS sources, rewrites asset paths, copies i18next locale files, and scaffolds dist/ output directories — replacing Vite's build pipeline.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-06-07T18:48:00Z (approx)
- **Completed:** 2026-06-07T18:54:27Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Created `scripts/build.mjs` (83 lines) using only `fs`, `path`, `url` built-ins — no npm dependencies
- Marker replacement engine assembles HTML from 9 partials via `<!--#include path-->` directives
- CSS inlining reads 3 Wolknitive stylesheets and injects into named `<style>` blocks, replacing `/* injected by build script */` placeholders
- Asset path rewriting prepends `BASE_PATH` env var to `/fonts/` and `/images/` URLs
- Scaffolds `dist/locales/`, `dist/fonts/`, `dist/images/` output directories
- Copies i18next locale JSON files (`en.json`, `es.json`, `de.json`) to `dist/locales/`
- Gracefully handles missing i18next vendor JS (existsSync guard — installed in later phase)
- Updated `package.json` scripts: `build` → `node scripts/build.mjs`, `dev` → build+open, `serve` → `npx serve dist`

## Task Commits

Each task was committed atomically:

1. **task 1: create scripts/build.mjs** - `8371fe0` (feat)
2. **task 2: update package.json scripts** - `df6e073` (feat)

## Files Created/Modified

- `scripts/build.mjs` — Zero-dependency Node build script (83 lines)
- `package.json` — Updated build/dev/serve scripts

## Decisions Made

- **CSS placeholder format:** The `_head.html` partial uses `/* injected by build script */` (CSS comment) rather than HTML comment. The build script regex matches this exact format.
- **existsSync guards on vendor JS:** i18next vendor scripts in `node_modules/` may not be available at build time (no `npm install` run yet). Copy operations use `existsSync` guards to fail gracefully.
- **Path rewriting scope:** Only `/fonts/` (href/src) and `/images/` (src/srcset) paths are rewritten. Locale paths (`/locales/`) are not rewritten in this plan — handled in Phase 4.

## Deviations from Plan

None — plan executed exactly as written.

### Regex adjustment (trivial, not a deviation)

The plan's CSS injection regex example used `<!-- injected by build script -->` (HTML comment), but Plan 01's `_head.html` uses `/* injected by build script */` (CSS comment). The build script was written to match the actual file content. This was within expected parameters — the plan explicitly called out this potential mismatch and said "adjust the regex accordingly."

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Build script is functional: `npm run build` produces `dist/index.html` and `dist/404.html` with inlined CSS
- Phase 3 (Asset Pipeline) can copy font/image files into the scaffolded `dist/fonts/` and `dist/images/` directories
- Phase 4 (SEO + i18n) can populate CSP meta tag, i18next init script, and multi-locale routing
- Phase 5 (Deploy) can deploy the `dist/` directory to GitHub Pages

## Self-Check: PASSED

- [x] scripts/build.mjs exists (83 lines, ≤200)
- [x] Only imports from `fs`, `path`, `url` — no npm packages
- [x] Build produces dist/index.html and dist/404.html
- [x] All 3 CSS blocks inlined (wk-tokens, wk-base, wk-animations)
- [x] No `/* injected by build script */` placeholders remain in output
- [x] Locale JSON files (en, es, de) copied to dist/locales/
- [x] dist/fonts/ and dist/images/ directories scaffolded (empty)
- [x] package.json scripts updated (build, dev, serve)
- [x] Both tasks committed atomically

---

*Phase: 02-build-system*
*Completed: 2026-06-07*
