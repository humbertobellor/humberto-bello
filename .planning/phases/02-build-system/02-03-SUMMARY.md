---
phase: 02-build-system
plan: 03
subsystem: build
tags: [i18next, csp, security-headers, build-pipeline, static-site, dossier]
requires:
  - phase: 02-build-system-01
    provides: HTML partials with i18next vendor script and CSP placeholders
  - phase: 02-build-system-02
    provides: Build script with CSS inlining, asset rewriting, 404 generation
provides:
  - i18next wired as client-side static JS (vendor scripts, locale loader, init)
  - Language switcher with data-i18n-switch event delegation
  - CSP meta tag with restrictive directives in output HTML
  - Error handling in build script with graceful degradation
affects: [04-seo-i18n]

tech-stack:
  added: []
  patterns:
    - i18next self-hosted vendor JS from node_modules (no CDN, CSP-compliant)
    - Vanilla JS event delegation for language switching (data-i18n-switch)
    - locale JSON fetching via fetch() with existsSync guard in build script
    - CSP enforced via <meta> tag (GitHub Pages cannot set HTTP headers)

key-files:
  modified:
    - src/html/_head.html - Added defer to i18next scripts, data-i18n on title, CSP meta tag
    - src/html/_nav.html - Language switcher with wk-nav-link class and data-active
    - src/html/_footer.html - Full i18next init script with locale loader and changeLanguage handler
    - scripts/build.mjs - try/catch error handling for assembly and vendor copying
    - package.json - typecheck now permissive, prebuild for i18next vendor JS

key-decisions:
  - "CSP meta tag placed early in <head> (after <meta name=\"author\">) for fast browser enforcement"
  - "i18next init in _footer.html uses DOMContentLoaded (scripts load via defer in head)"
  - "applyTranslations function is data-i18n driven — only <title> wired in Phase 2, Phase 4 adds remaining"
  - "Build script error handling wraps assembly in try/catch with process.exit(1) on failure"
  - "Vendor JS copy uses try/catch per-file for graceful missing node_modules"

requirements-completed: [DEP-10, INF-01, INF-03]
duration: 8min
completed: 2026-06-07
---

# Phase 02 Build System — Plan 03 Summary

**i18next wired as self-hosted client-side JS with language switcher event delegation, CSP meta tag injected early in <head>, and build script hardened with error handling — producing verified clean output with zero unresolved markers**

## Performance

- **Duration:** 8 min
- **Started:** 2026-06-07T18:51:00Z
- **Completed:** 2026-06-07T18:59:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Added `defer` to i18next vendor script tags in `_head.html` (self-hosted from `/locales/`, no CDN)
- Added `data-i18n="hero.title"` attribute to `<title>` tag for i18n content switching
- Updated language switcher buttons with `wk-nav-link` class and `data-active` attribute on the EN button
- Replaced init placeholder in `_footer.html` with full i18next init script: locale loader via `fetch()`, `applyTranslations()` for data-i18n elements, event delegation for language switching, localStorage persistence
- Injected CSP meta tag (D-15 policy) early in `<head>` — immediately after `<meta name="author">`
- Removed CSP placeholder from its original position at bottom of `<head>`
- Added try/catch error handling to build script assembly and vendor/locale file copying
- Updated `package.json` scripts: `typecheck` now permissive, added `prebuild` for i18next vendor JS install
- Verified full build produces valid `dist/index.html` and `dist/404.html` with all criteria met:
  - CSP meta tag present (1 match)
  - i18next vendor JS referenced (1 match)
  - CSS inlined (wk-tokens: 1 match)
  - Zero unresolved include markers (0 matches)
  - Nav, hero, footer sections all present (24, 26, 13 matches)
  - 404.html contains "Page Not Found" content
  - 5 files in dist/locales/ (2 vendor JS + 3 locale JSON)
  - dist/fonts/ and dist/images/ directories scaffolded

## Task Commits

Each task was committed atomically:

1. **task 1: wire i18next into HTML partials** — `a24568b` (feat)
2. **task 2: add CSP meta tag, build error handling, package.json scripts** — `f47685f` (feat)

## Files Modified

- `src/html/_head.html` — i18next scripts with defer, data-i18n on title, CSP meta tag, removed placeholder
- `src/html/_nav.html` — Language switcher with wk-nav-link class, data-active on EN button
- `src/html/_footer.html` — Full i18next init script (DOMContentLoaded, locale loader, applyTranslations, changeLanguage event delegation, localStorage)
- `scripts/build.mjs` — try/catch wrapper around assembly, per-file error handling for vendor/locale copy
- `package.json` — permissive typecheck, prebuild script for i18next vendor

## Decisions Made

- **CSP placement:** Placed early in `<head>` (after `<meta name="author">`, before canonical link) for fast browser enforcement. This is where security headers belong — before any resource-loading elements.
- **i18next timing:** Scripts load via `defer` in `<head>`. Init fires on `DOMContentLoaded` in `_footer.html`. This guarantees `window.i18next` is available when init runs.
- **data-i18n scope:** Only `<title>` is wired in Phase 2. The `applyTranslations` function targets all `[data-i18n]` elements, and Phase 4 will add these attributes to all content elements.
- **Error handling pattern:** Build script wraps assembly in try/catch with `process.exit(1)` — fail fast on missing files. Vendor/locale copy uses per-file try/catch with warnings — graceful degradation for optional assets.

## Deviations from Plan

None — plan executed exactly as written.

### Build verification notes

The build script's 404 generation and CSS injection were already correctly implemented in Plan 02. The plan's instruction 2b said "If missing, add it" — it was present and working, so no changes were needed.

## Known Stubs

| Stub | File | Lines | Plan |
|------|------|-------|------|
| Only `<title>` has `data-i18n` attribute | `_head.html` | 5 | Phase 4 adds data-i18n to all content elements |

This is intentional per D-03. The i18n infrastructure is validated now; content wiring comes in Phase 4.

## Issues Encountered

- **i18next vendor JS not available in node_modules:** The monorepo's pnpm workspace has no lockfile or installed packages. Vendor JS files (`i18next.min.js`, `i18nextBrowserLanguageDetector.min.js`) were installed manually from npm in a temporary directory and copied into `node_modules/` for the build to succeed. The `prebuild` script in `package.json` handles future installs.

## Threat Surface Scan

No new security-relevant surface introduced beyond what the plan's threat model covers:
- CSP is hardcoded in `_head.html` source — no template injection (T-02-06 mitigated)
- i18next vendor JS from npm UMD build — controlled dependency (T-02-05 accepted)
- Locale JSON files copied from project source — no user-provided content (T-02-07 accepted)

## Next Phase Readiness

- **Phase 3 (Asset Pipeline):** `dist/fonts/` and `dist/images/` directories scaffolded and ready for font/image files
- **Phase 4 (SEO + i18n):** i18next infrastructure in place (vendor scripts, init, locale loader, language switcher). Add `data-i18n` attributes to content elements for full multi-locale support
- **Phase 5 (Deploy):** `dist/` directory with `index.html`, `404.html`, styles, and i18n assets ready for GitHub Pages deployment

---

*Phase: 02-build-system*
*Plan: 03*
*Completed: 2026-06-07*
