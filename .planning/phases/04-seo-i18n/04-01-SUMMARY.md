---
phase: 04-seo-i18n
plan: 01
subsystem: i18n
tags: [i18next, static-html, build-time-i18n, seo, json-ld, github-pages]

# Dependency graph
requires:
  - phase: 03-static-refactor
    provides: "HTML partials structure, build script foundation, package.json with deps"
provides:
  - "3 self-contained locale HTML files (en/es/de) with baked content"
  - "Build-time i18n replacement via data-i18n attributes"
  - "Language switcher as <a href> links for static navigation"
  - "Locale redirect via localStorage for returning visitors"
  - "Updated SEO metadata (canonical URLs, Open Graph, JSON-LD WebSite schema)"
  - "Removed i18next runtime dependency"
affects: [04-seo-i18n-02, deployment]

# Tech tracking
tech-stack:
  added: []
  patterns: [build-time-i18n, data-i18n-attribute-replacement, locale-redirect-script]

key-files:
  created: []
  modified:
    - scripts/build.mjs
    - package.json
    - src/html/_head.html
    - src/html/_nav.html
    - src/html/_footer.html
    - src/html/hero.html
    - src/html/skills.html
    - src/html/experience.html
    - src/html/clients.html
    - src/html/cta.html
    - src/html/footer.html

key-decisions:
  - "Build-time i18n via data-i18n attribute replacement instead of runtime i18next"
  - "Language switcher uses <a href> links for GitHub Pages static hosting"
  - "Locale redirect reads localStorage 'wk-locale' key on page load"
  - "Canonical URLs point to humbertobellor.github.io/dossier/"

patterns-established:
  - "data-i18n attribute convention: element text is default English, replaced at build time"
  - "Locale file structure: flat JSON with dot-notation keys matching data-i18n attributes"
  - "Active locale baked per output file via data-active attribute on language switcher"

requirements-completed: [I18-01, I18-02, I18-03, I18-04, SEO-01, SEO-03]

# Metrics
duration: 5min
completed: 2026-06-07
---

# Phase 04 Plan 01: Core Locale Generation Summary

**Build-time i18n with 3 self-contained locale HTML files, replacing i18next runtime with data-i18n attribute baking**

## Performance

- **Duration:** 5 min
- **Started:** 2026-06-07T23:33:06Z
- **Completed:** 2026-06-07T23:38:39Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- Build produces 3 self-contained locale HTML files (dist/index.html, dist/es/index.html, dist/de/index.html) with all content baked in
- i18next runtime removed from package.json and all HTML output — zero JS required for i18n
- Language switcher converted to static `<a href>` links with correct active state per locale
- SEO metadata updated: canonical URLs, Open Graph, Twitter Card, JSON-LD WebSite schema
- Locale redirect script enables returning visitors to land on their preferred language

## Commits

Each task was committed atomically:

1. **task 1: Add data-i18n attributes to all HTML partials** - `73b976f` (feat)
2. **task 2: Extend build script for locale HTML generation** - `1f2da6e` (feat)

## Files Created/Modified
- `scripts/build.mjs` - Extended with locale generation, data-i18n replacement, html lang setter, active locale baking
- `package.json` - Removed i18next and i18next-browser-languagedetector dependencies and prebuild script
- `src/html/_head.html` - Updated meta tags, WebSite schema, removed i18next scripts, added locale redirect
- `src/html/_nav.html` - Converted language switcher from buttons to <a href> links
- `src/html/_footer.html` - Removed i18init init script, now just closing tags
- `src/html/hero.html` - Added data-i18n attributes to subtitle, stats, bullets, badge, scroll hint
- `src/html/skills.html` - Added data-i18n attributes to all skill categories and items
- `src/html/experience.html` - Added data-i18n attributes to all 6 experience entries
- `src/html/clients.html` - Added data-i18n attributes to section header and category labels
- `src/html/cta.html` - Added data-i18n attributes to badge, heading, subtitle, and link text
- `src/html/footer.html` - Added data-i18n attributes to role and location text

## Decisions Made
- Build-time i18n via data-i18n attribute replacement chosen over runtime i18next for zero-JS static site
- Language switcher uses `<a href>` links (not buttons) to work without JavaScript
- Locale redirect uses localStorage 'wk-locale' key — low risk, redirect-only, no sensitive data

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `setActiveLocale()` function initially used string `.replace()` which doesn't support backreferences — fixed by switching to `new RegExp()` with `$1` replacement. Caught and fixed during task 2 verification.

## Known Stubs

None - all data-i18n attributes are wired to locale JSON files and replaced at build time.

## Threat Flags

None - all files operate within the trust boundaries defined in the threat model (build-time only, developer-authored locale JSON).

## Next Phase Readiness
- 3 locale HTML files ready for GitHub Pages deployment
- No runtime i18n dependencies remaining
- SEO metadata updated for new hosting domain
- Ready for plan 02 (sitemap/robots.txt updates if needed)

## Self-Check: PASSED

All files exist, all commits verified, build output confirmed.

---
*Phase: 04-seo-i18n*
*Completed: 2026-06-07*
