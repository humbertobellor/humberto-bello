---
phase: 03-asset-pipeline
plan: 02
subsystem: infra
tags: [cleanup, dependencies, static-site, linkedin, dead-code]

# Dependency graph
requires:
  - phase: 03-asset-pipeline
    plan: 01
    provides: Build script (scripts/build.mjs), HTML partials (src/html/), CSS tokens, i18n locales
provides:
  - Clean source tree with zero orphan imports
  - Minimal package.json (only i18next + i18next-browser-languagedetector in deps; @types/node + typescript in devDeps)
  - Correct LinkedIn URLs in HTML partials (cta.html, _head.html)
affects: [04-static-output, 05-deploy]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Static build via Node script assembling HTML partials"
    - "Zero React/Vite/Tailwind dependencies in output"
    - "i18next client-side only via static locale JSON"

key-files:
  created: []
  modified:
    - package.json - Stripped to 4 dependencies total
    - src/html/cta.html - Fixed LinkedIn CTA button URL
    - src/html/_head.html - Fixed LinkedIn URL in JSON-LD sameAs array

key-decisions:
  - "Deleted dead React source files (App.tsx, use-toast.ts, not-found.tsx) that imported shadcn/ui components — they were not used by the static build"
  - "Kept home.tsx as reference (per plan) but verified no @assets/headshot imports remain"

patterns-established:
  - "Source tree cleanup before dependency cleanup to avoid broken imports"
  - "Verification via npm run build after each task"

requirements-completed:
  - DEP-02
  - DEP-03
  - INF-07
  - QLT-04
  - SEO-04
  - STC-03
  - STC-04

# Metrics
duration: 15min
completed: 2026-06-07
---

# Phase 03 Plan 02: Dead Code Cleanup & Dependency Strip

**Removed ~5,700 lines of dead shadcn/ui components, stripped 38 unused npm dependencies, fixed LinkedIn placeholder URL to real profile.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-06-07T19:45:00Z
- **Completed:** 2026-06-07T20:00:00Z
- **Tasks:** 3
- **Files modified:** 5 (package.json, cta.html, _head.html + 3 deleted dirs/files)

## Accomplishments

- Deleted `src/components/ui/` directory (55 shadcn/ui component files, ~5,700 lines)
- Deleted `src/components/Changelog.tsx` and `src/components/FadeIn.tsx` (already gone)
- Deleted dead React files with orphan imports: `src/App.tsx`, `src/hooks/use-toast.ts`, `src/pages/not-found.tsx`
- Verified no `@assets/headshot` imports in `src/pages/home.tsx`
- Stripped `package.json` from 42 dependencies to 4 (2 deps + 2 devDeps)
- Fixed LinkedIn URL in CTA button: `https://linkedin.com` → `https://www.linkedin.com/in/humberto-bello/`
- Fixed LinkedIn URL in JSON-LD structured data: same correction
- All changes verified with `npm run build` — exits 0, output unchanged functionally

## task Commits

Each task was committed atomically:

1. **task 1: verify zero orphan imports and delete dead source files** - `856cd85` (fix)
2. **task 2: strip package.json to minimal dependencies** - `f3c2968` (fix)
3. **task 3: fix LinkedIn placeholder URL in HTML partials** - `b4b8775` (fix)

## Files Created/Modified

- `package.json` - Stripped to minimal: deps={i18next, i18next-browser-languagedetector}, devDeps={@types/node, typescript}
- `src/html/cta.html` - LinkedIn CTA button now points to real profile
- `src/html/_head.html` - JSON-LD sameAs array now has correct LinkedIn URL
- `src/components/ui/` - DELETED (55 files)
- `src/components/Changelog.tsx` - DELETED (was already gone)
- `src/components/FadeIn.tsx` - DELETED (was already gone)
- `src/App.tsx` - DELETED (dead code with ui imports)
- `src/hooks/use-toast.ts` - DELETED (dead code with ui imports)
- `src/pages/not-found.tsx` - DELETED (dead code with ui imports)

## Decisions Made

- Deleted `App.tsx`, `use-toast.ts`, `not-found.tsx` in addition to plan-specified files — they had orphan imports from the deleted ui/ directory and were not used by the static build script
- Kept `home.tsx` as reference file (per plan instruction) — verified no headshot imports remain
- The static build (`scripts/build.mjs`) only uses HTML partials, CSS, fonts, images, and i18n locales — no React/TypeScript source files

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Deleted additional dead files with orphan imports**
- **Found during:** task 1 (verification before deletion)
- **Issue:** `rg` found imports from `@/components/ui/` in `App.tsx` (Toaster, TooltipProvider), `use-toast.ts` (Toast types), `not-found.tsx` (Card, CardContent)
- **Fix:** Deleted these three files since they are dead React code not referenced by the static build script
- **Files modified:** `src/App.tsx`, `src/hooks/use-toast.ts`, `src/pages/not-found.tsx` (all deleted)
- **Verification:** `npm run build` passes; `rg "components/ui/" src/` returns empty
- **Committed in:** `856cd85` (task 1 commit)

**2. [Rule 1 - Bug] Changelog.tsx and FadeIn.tsx already deleted**
- **Found during:** task 1 (deletion step)
- **Issue:** Plan listed these files for deletion but they were already gone from the working tree
- **Fix:** No action needed — verified absence with `test ! -f`
- **Files modified:** None
- **Verification:** `test ! -f src/components/Changelog.tsx` and `test ! -f src/components/FadeIn.tsx` both exit 0
- **Committed in:** `856cd85` (task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both necessary for correctness. Deleting orphan-import files prevents broken source tree. No scope creep — files were dead code not used by build.

## Issues Encountered

- None beyond the auto-fixed deviations above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Source tree clean: zero orphan imports, zero dead component files
- Package.json minimal: only i18next runtime deps + TypeScript dev tooling
- LinkedIn URLs correct in both HTML partials
- Build verified passing
- Ready for Phase 04 (static output optimization) and Phase 05 (GitHub Pages deploy)

---
*Phase: 03-asset-pipeline*
*Completed: 2026-06-07*
