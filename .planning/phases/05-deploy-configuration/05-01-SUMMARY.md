---
phase: 05-deploy-configuration
plan: 01
subsystem: infra
tags: [build, github-pages, static-deploy, path-validation]

# Dependency graph
requires:
  - phase: 04-seo-i18n
    provides: "SEO metadata, sitemap, i18n locale files, 404.html"
provides:
  - "Path validation ensuring all asset paths use /dossier/ prefix"
  - ".nojekyll file for GitHub Pages Jekyll bypass"
  - "docs/ directory as deployable output"
  - "Fixed rewritePaths handling srcset, CSS url(), favicon, and resume PDF"
affects: [deployment, github-pages]

# Tech tracking
tech-stack:
  added: []
  patterns: [validatePaths regex-based HTML scanning, cpSync deploy copy]

key-files:
  created: [".gitignore"]
  modified: ["scripts/build.mjs"]

key-decisions:
  - "Default BASE_PATH to /dossier/ for GitHub Pages deployment"
  - "Extended rewritePaths to handle all asset path patterns (srcset, CSS url, favicon, resume PDF)"

patterns-established:
  - "validatePaths: regex-based scanning of src/href/srcset/CSS url() in built HTML"
  - "Deploy flow: build → validate → copy dist/ to docs/"

requirements-completed: [INF-02, INF-04]

# Metrics
duration: 5min
completed: 2026-06-08
---

# Phase 5 Plan 01: Deploy Configuration Summary

**Build script validates all asset paths use /dossier/ prefix, creates .nojekyll, copies dist/ to docs/ for GitHub Pages deployment**

## Performance

- **Duration:** 5 min
- **Started:** 2026-06-08T00:53:33Z
- **Completed:** 2026-06-08T00:58:09Z
- **Tasks:** 2 (auto) + 1 (checkpoint pending)
- **Files modified:** 2

## Accomplishments
- Added validatePaths() function that scans all 4 HTML files for asset paths without /dossier/ prefix
- Created .nojekyll file in dist/ for GitHub Pages Jekyll bypass
- Built docs/ directory as deployable output (copies dist/)
- Fixed rewritePaths to handle srcset values, CSS url() paths, favicon, and resume PDF
- Set default BASE_PATH to /dossier/ for GitHub Pages deployment

## Commits

Each task was committed atomically:

1. **task 1: Add path validation and .nojekyll creation to build script** - `214bd6e` (feat)
2. **task 2: Add docs/ to .gitignore** - `a77ec26` (chore)

**Plan metadata:** pending (docs: complete plan)

## Files Created/Modified
- `scripts/build.mjs` - Added validatePaths(), .nojekyll creation, docs/ copy, fixed rewritePaths for all asset patterns
- `.gitignore` - New file excluding dist/ and docs/ from version control

## Decisions Made
- Default BASE_PATH to `/dossier/` instead of empty string — GitHub Pages always serves at /dossier/ subpath
- Extended rewritePaths to handle srcset, CSS url(), favicon.svg, and Humberto_Bello_Resume.pdf — the original only handled href/src for fonts and images

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed incomplete rewritePaths not handling all asset path patterns**
- **Found during:** task 1 (Add path validation)
- **Issue:** Plan's validatePaths caught 131 errors because rewritePaths only handled href/src for fonts and images — missed srcset values, CSS url() in inlined styles, favicon.svg, Humberto_Bello_Resume.pdf, and root href="/"
- **Fix:** Extended rewritePaths with srcset regex rewrite, CSS url() rewrite, and specific rewrites for favicon, resume PDF, and root path
- **Files modified:** scripts/build.mjs
- **Verification:** Build passes with 0 validation errors, all 4 HTML files scanned
- **Committed in:** 214bd6e (task 1 commit)

**2. [Rule 1 - Bug] Set default BASE_PATH to /dossier/ for GitHub Pages**
- **Found during:** task 1 (Add path validation)
- **Issue:** BASE_PATH defaulted to empty string, causing rewritePaths to return early without rewriting any paths — all 131 validation errors were absolute paths without /dossier/ prefix
- **Fix:** Changed default from '' to '/dossier/' in build script
- **Files modified:** scripts/build.mjs
- **Verification:** Build passes with path validation success message
- **Committed in:** 214bd6e (task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes necessary for build correctness — plan's validator was correct but existing rewritePaths was incomplete. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Build script produces deployable docs/ directory
- Ready for GitHub Pages deployment: push to main, set Pages source to docs/
- Checkpoint task 3 requires live site verification at bertjbello.com/

---
*Phase: 05-deploy-configuration*
*Completed: 2026-06-08*

## Self-Check: PASSED

All files and commits verified:
- scripts/build.mjs: FOUND
- .gitignore: FOUND
- SUMMARY.md: FOUND
- dist/.nojekyll: FOUND
- docs/: FOUND
- Commit 214bd6e: FOUND
- Commit a77ec26: FOUND
- Commit 7e9a7f1: FOUND
