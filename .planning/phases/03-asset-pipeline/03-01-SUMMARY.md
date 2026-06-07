---
phase: 03-asset-pipeline
plan: 01
subsystem: build
tags: asset-pipeline, fonts, images, build-script, woff2, avif, webp
requires: []
provides:
  - Copy logic for 12 font .woff2 files from public/fonts/ to dist/fonts/
  - Copy logic for 4 headshot AVIF/WebP images from dossier-main to dist/images/
  - Graceful missing-source handling via existsSync + try/catch
affects: [04-seo, deploy-github-pages]
tech-stack:
  added: []
  patterns:
    - existsSync + try/catch copy pattern for static assets
    - resolve() for cross-monorepo paths (import.meta.dirname)
key-files:
  created: []
  modified:
    - scripts/build.mjs
key-decisions:
  - "Headshot source path is ../dossier-main/attached_assets/ (not ../../attached_assets/ as CONTEXT.md initially stated)"
  - "Skip headshot-corp_*.png — not referenced in any HTML partial, only AVIF/WebP variants needed"
  - "Use hardcoded file lists instead of readdirSync for deterministic, auditable copy behavior"
requirements-completed: [STC-03, STC-04]
duration: 8min
completed: 2026-06-07
---

# Phase 03 Plan 01: Asset Pipeline — Font + Image Copy Summary

**Font and headshot image copy steps added to scripts/build.mjs, populating dist/fonts/ with 12 .woff2 files and dist/images/ with 4 AVIF/WebP headshot variants**

## Performance

- **Duration:** 8 min
- **Started:** 2026-06-07T19:44:00Z
- **Completed:** 2026-06-07T19:52:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Added section 8: copies 12 .woff2 font files from `public/fonts/` to `dist/fonts/` — Bogart, Inter Tight, JetBrains Mono, and Newsreader digit fallback
- Added section 9: copies 4 headshot images (AVIF + WebP, full + @1x) from `../dossier-main/attached_assets/` to `dist/images/`
- Renumbered existing sections 8-10 to 10-12 for consistent ordering
- Updated completion log to reflect populated asset directories
- All asset copy follows existing `existsSync` + try/catch pattern — missing source files produce a warning, not a build failure

## Task Commits

Each task was committed atomically:

1. **Task 1: Add font and headshot image copy steps to build.mjs** - `015f4b0` (feat)

## Files Created/Modified

- `scripts/build.mjs` - Extended from 95 to 121 lines with two new copy sections (fonts + headshots)

## Decisions Made

- **Headshot source path:** Used `resolve(import.meta.dirname, '../dossier-main/attached_assets')` — the actual relative path from the `humberto-bello` package CWD, not the `../../attached_assets/` initially stated in CONTEXT.md D-03
- **Skip PNG fallback:** `headshot-corp_*.png` exists in source but is not referenced in any HTML partial — not copied
- **Hardcoded file lists:** Used explicit arrays of font/headshot filenames rather than `readdirSync` + filter pattern. This ensures deterministic, auditable copy behavior — if a file is accidentally added to the source directory, it won't silently appear in the build output

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

- Initial `npm run build` via pnpm failed due to missing pnpm catalog entries for `@replit/vite-plugin-cartographer` (this is expected — the build script runs via `node scripts/build.mjs` directly, not through the pnpm lifecycle)
- No code changes needed; the build script only uses Node built-in modules

## Threat Flags

None — plan's threat model covered all surface:
- T-03-01 (Spoofing): All paths are hardcoded, no user-controlled input — accepted
- T-03-02 (Tampering): Direct copy only, no transformation — accepted
- No new network endpoints, auth paths, or trust boundaries introduced

## Verification Results

| Check | Result |
|-------|--------|
| `node scripts/build.mjs` exits 0 | PASS |
| 12 .woff2 files in `dist/fonts/` | PASS |
| 4 headshot files in `dist/images/` | PASS |
| `Bogart-Regular-trial.woff2` is valid WOFF2 | PASS |
| `headshot-corp_*.avif` is valid AVIF | PASS |
| `dist/index.html` contains `<section id="hero">` | PASS |
| `dist/index.html` contains `id="wk-tokens"` | PASS |

## Stub Tracking

None — all copy targets are wired with actual files. No placeholder data.

## Next Phase Readiness

- Build script now populates `dist/fonts/` and `dist/images/` with all assets
- Phase 4 (SEO) can proceed: `dist/images/` has the headshot for OG image work, and `dist/fonts/` is populated for any font-based SEO considerations
- Asset path rewriting was already in place (lines 35-40 of build.mjs, handles `/fonts/` and `/images/` paths with `BASE_PATH`)

---

*Phase: 03-asset-pipeline*
*Plan: 01*
*Completed: 2026-06-07*
