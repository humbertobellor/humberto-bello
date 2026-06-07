---
phase: 04-seo-i18n
plan: 02
subsystem: seo
tags: [seo, i18n, sitemap, hreflang, robots.txt, meta-tags]

# Dependency graph
requires:
  - phase: 03-static-build
    provides: "Build script infrastructure (scripts/build.mjs), locale JSON files, robots.txt"
provides:
  - "Per-locale SEO meta tags (title, description, OG, Twitter Card) in en/es/de locale JSONs"
  - "Updated robots.txt pointing to GitHub Pages sitemap"
  - "Build-generated sitemap.xml with hreflang annotations for all 3 locales"
affects: [05-deploy]

# Tech tracking
tech-stack:
  added: []
  patterns: ["sitemap generation in build script", "per-locale SEO keys in i18n JSON"]

key-files:
  created: ["dist/sitemap.xml"]
  modified: ["src/i18n/locales/en.json", "src/i18n/locales/es.json", "src/i18n/locales/de.json", "public/robots.txt", "scripts/build.mjs"]

key-decisions:
  - "Sitemap generated at build time from hardcoded locale list (no runtime overhead)"
  - "x-default hreflang points to English (canonical locale for international SEO)"
  - "Sitemap uses correct xhtml namespace for hreflang annotations"

patterns-established:
  - "SEO keys pattern: top-level seo.* keys in locale JSONs consumed by i18next and build script"
  - "Sitemap generation pattern: locale-driven entries with hreflang annotations added to build.mjs"

requirements-completed: [SEO-01, SEO-02, SEO-05, SEO-06]

# Metrics
duration: 1min
completed: 2026-06-07
---

# Phase 4 Plan 2: SEO Metadata & Sitemap Summary

**Per-locale SEO meta tags in en/es/de with build-generated sitemap.xml containing hreflang annotations for all 3 locales**

## Performance

- **Duration:** 1 min
- **Started:** 2026-06-07T23:40:33Z
- **Completed:** 2026-06-07T23:41:40Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Added seo.* keys (title, description, ogTitle, ogDescription, twitterTitle, twitterDescription, ogLocale) to all 3 locale JSON files with localized content
- Updated robots.txt to point sitemap URL to humbertobellor.github.io/dossier/sitemap.xml
- Extended build script to generate dist/sitemap.xml with hreflang annotations for en/es/de + x-default

## Task Commits

Each task was committed atomically:

1. **task 1: Add seo.* keys to all 3 locale JSON files and update robots.txt** - `1954410` (feat)
2. **task 2: Extend build script to generate sitemap.xml with hreflang annotations** - `7b4f4cc` (feat)

## Files Created/Modified
- `src/i18n/locales/en.json` - Added seo block with English meta content and ogLocale: en_US
- `src/i18n/locales/es.json` - Added seo block with Spanish meta content and ogLocale: es_ES
- `src/i18n/locales/de.json` - Added seo block with German meta content and ogLocale: de_DE
- `public/robots.txt` - Updated sitemap URL to humbertobellor.github.io/dossier/sitemap.xml
- `scripts/build.mjs` - Added sitemap generation with hreflang annotations for 3 locales

## Decisions Made
- Sitemap generated at build time from hardcoded locale list — no runtime overhead, no dynamic content risk
- x-default hreflang points to English as the canonical locale for international SEO
- Sitemap uses correct xhtml namespace (`xmlns:xhtml="http://www.w3.org/1999/xhtml"`) for hreflang annotations

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- SEO metadata complete for all 3 locales
- Sitemap generation integrated into build pipeline
- Ready for deploy phase (05-deploy) to push to GitHub Pages

## Self-Check: PASSED

All files found and commits verified:
- `src/i18n/locales/en.json` ✓
- `src/i18n/locales/es.json` ✓
- `src/i18n/locales/de.json` ✓
- `public/robots.txt` ✓
- `scripts/build.mjs` ✓
- `dist/sitemap.xml` ✓
- Commit `1954410` (task 1) ✓
- Commit `7b4f4cc` (task 2) ✓

---
*Phase: 04-seo-i18n*
*Completed: 2026-06-07*
