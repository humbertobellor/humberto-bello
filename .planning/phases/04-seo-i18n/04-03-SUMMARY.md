---
phase: 04-seo-i18n
plan: 03
subsystem: build
tags: [build-script, i18n, meta-tags, json-ld, seo]

# Dependency graph
requires:
  - phase: 04-seo-i18n
    provides: [locale JSON files, _head.html template, build.mjs scaffold]
provides:
  - Fixed replaceI18n function that correctly handles meta tag content attributes
  - Valid JSON-LD structured data with @graph array
  - opengraph.jpg copied to dist/images/
  - Sitemap generation inside try/catch block
affects: [04-seo-i18n]

# Tech tracking
tech-stack:
  added: []
  patterns: [meta-tag-i18n-replacement, json-ld-graph-array]

key-files:
  created: []
  modified: [scripts/build.mjs, src/html/_head.html]

key-decisions:
  - "Used @graph array for JSON-LD instead of two root objects"
  - "Meta tag handler strips data-i18n and preserves content attribute"
  - "Title handler matches full tag including closing tag to avoid doubled brackets"

patterns-established:
  - "Meta tag i18n: strip data-i18n, keep content attribute (content is source of truth)"
  - "Title tag i18n: replace text content, preserve closing tag"

requirements-completed: [SEO-01, SEO-02]

# Metrics
duration: 12min
completed: 2026-06-07
---

# Phase 04 Plan 03: Gap Closure Summary

**Fixed replaceI18n to handle meta tags without doubling content, valid JSON-LD with @graph array, and opengraph.jpg copy**

## Performance

- **Duration:** 12 min
- **Started:** 2026-06-07T20:00:00Z
- **Completed:** 2026-06-07T20:12:00Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- replaceI18n now produces valid HTML — no doubled content patterns
- Meta tag content attributes correctly updated with locale-specific text (ES/DE)
- JSON-LD restructured as @graph array (was invalid with two root objects)
- opengraph.jpg copied from public/ to dist/images/
- Sitemap generation moved inside try/catch for error safety

## task Commits

Each task was committed atomically:

1. **task 1: Fix replaceI18n function and add meta content updater** - `c0f3d74` (fix)

**Plan metadata:** (pending — orchestrator commits)

## Files Created/Modified
- `scripts/build.mjs` - Fixed replaceI18n with meta tag handler, resolveKey helper, moved sitemap inside try/catch, added opengraph.jpg copy
- `src/html/_head.html` - Restructured JSON-LD from invalid two-root-object format to valid @graph array

## Decisions Made
- Used `@graph` array for JSON-LD instead of wrapping in ProfilePage — cleaner schema structure
- Meta tag handler strips `data-i18n` and preserves `content` attribute (content is the source of truth)
- Title handler matches full tag including `</title>` closing tag to avoid doubled bracket artifacts

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed meta tag doubled content**
- **Found during:** task 1 verification
- **Issue:** Original replaceI18n replaced `data-i18n="key"` with `>value<` which broke self-closing meta tags — `/>` was left as text content
- **Fix:** Rewrote meta handler to match full `<meta ... />` tags and replace content attribute value directly
- **Files modified:** scripts/build.mjs
- **Verification:** No `>.*<>.*<` patterns in any output file
- **Committed in:** c0f3d74

**2. [Rule 1 - Bug] Fixed title tag doubled brackets**
- **Found during:** task 1 verification
- **Issue:** Title handler replacement `>value<` produced `>value<</title>` (doubled `<`)
- **Fix:** Changed regex to match full tag including closing tag `(<tag>)(text)(</tag>)`
- **Files modified:** scripts/build.mjs
- **Verification:** Title tags show clean `<title>value</title>` in all outputs
- **Committed in:** c0f3d74

**3. [Rule 1 - Bug] Fixed opengraph.jpg source path**
- **Found during:** task 1 verification
- **Issue:** Build tried to copy from `public/images/opengraph.jpg` but file is at `public/opengraph.jpg`
- **Fix:** Changed copy source path to `public/opengraph.jpg`
- **Files modified:** scripts/build.mjs
- **Verification:** `dist/images/opengraph.jpg` exists (84KB)
- **Committed in:** c0f3d74

---

**Total deviations:** 3 auto-fixed (3 bugs)
**Impact on plan:** All auto-fixes essential for correctness. No scope creep.

## Issues Encountered
- JSON-LD had two root objects at top level (invalid JSON) — fixed by wrapping in @graph array
- Sitemap generation was outside try/catch — moved inside for error safety

## Known Stubs
None — all data sources wired and producing correct output.

## Threat Flags
None — no new security-relevant surface introduced.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- SEO and i18n gap closure complete
- All 3 locale outputs (en, es, de) produce valid HTML with localized meta tags
- Ready for deployment verification

## Self-Check: PASSED

---
*Phase: 04-seo-i18n*
*Completed: 2026-06-07*
