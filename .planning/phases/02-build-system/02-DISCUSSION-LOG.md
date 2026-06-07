# Phase 2: Build System - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-07
**Phase:** 02-build-system
**Areas discussed:** HTML Partials Structure, Build Script Assembly Pattern, CSS Inlining and Asset Embedding, i18next Setup Without React, CSP Meta Tag and 404.html, Build Output Structure

---

## HTML Partials Structure

| Option | Description | Selected |
|--------|-------------|----------|
| One file per section | hero.html, experience.html, skills.html, clients.html, cta.html, footer.html + _head.html, _nav.html, _footer.html. Cleanest separation. | ✓ |
| Logical groupings | _head.html, _body.html, _footer.html — fewer files, larger chunks. | |
| Hybrid: sections + shared | _meta.html, _nav.html, _footer.html + all sections in one file. | |

**User's choice:** One file per section
**Notes:** User also chose `src/html/` as the partials directory, English-only for Phase 2, and leading underscore for shared/wrapper partials.

---

## Build Script Assembly Pattern

| Option | Description | Selected |
|--------|-------------|----------|
| Marker replacement | `<!--#include path/to/partial.html-->` in main template. Script replaces markers with partial content. | ✓ |
| Programmatic composition | Functions per section (buildHero(), buildSkills()) that return HTML strings. | |
| Concatenation in sequence | Read all partials in fixed order and join. | |

**User's choice:** Marker replacement
**Notes:** Build script reads CSS/JS from `src/styles/` and injects into `<style>`/`<script>` blocks. `npm run build` replaced with `node scripts/build.mjs`. Dev preview: rebuild + open in browser, no dev server.

---

## CSS Inlining and Asset Embedding

| Option | Description | Selected |
|--------|-------------|----------|
| All 3 CSS files as separate `<style>` blocks | wk-tokens, wk-base, wk-animations IDs. Order preserved, debugging-friendly. | ✓ |
| Single concatenated `<style>` block | All CSS in one tag. Fewer bytes but harder to identify source. | |

**User's choice:** All 3 CSS files as separate `<style>` blocks
**Notes:** Asset path rewriting via `BASE_PATH` env var. Headshot images copied from `../../attached_assets/` to `src/images/` and referenced from HTML.

---

## i18next Setup Without React

| Option | Description | Selected |
|--------|-------------|----------|
| Bundled i18next + inline init script | Vendor JS from node_modules, inline init `<script>` in head. Same source as current Vite chunk. | ✓ |
| CDN-loaded i18next | Load from cdn.jsdelivr.net. Simpler but adds network dependency and CSP origin. | |

**User's choice:** Bundled i18next + inline init script
**Notes:** Locale JSON copied to `dist/locales/`. Language switcher via `data-i18n-switch` attributes + event delegation.

---

## CSP Meta Tag and 404.html

| Option | Description | Selected |
|--------|-------------|----------|
| Tighter: no unsafe-eval | Remove 'unsafe-eval', keep 'unsafe-inline'. Safer than Express config. | ✓ |
| Tightest: nonce-based | Generate nonce per build. Strongest but adds complexity for minimal gain. | |
| Same as current Express CSP | Keep 'unsafe-inline' and 'unsafe-eval'. No improvement. | |

**User's choice:** Tighter: no unsafe-eval, keep unsafe-inline
**Notes:** 404.html generated from same template partials with different body content. Build script runs marker replacement twice.

---

## Build Output Structure

| Option | Description | Selected |
|--------|-------------|----------|
| dist/ + subdirectories | index.html, 404.html at root + locales/ + fonts/ + images/ | ✓ |
| Subdirectory per concern | dist/en/, dist/fonts/, dist/images/. Prepares for multi-locale. | |
| Flat — everything in root | All files in dist/. Simple but messy with 10+ font files. | |

**User's choice:** dist/ + subdirectories
**Notes:** Scaffold all target dirs during build (fonts/, images/ even if empty — Phase 3 populates). i18next vendor JS copied from node_modules during build.

---

## OpenCode's Discretion

- Exact CSS file paths the build script reads (assuming `src/styles/wolknitive-tokens.css`, `src/styles/base.css`, `src/styles/animations.css`)
- Marker syntax details (`<!--#include partial.html-->` vs `{{ include:partial.html }}`)
- Build script error handling (file-not-found, missing partial)

## Deferred Ideas

None — discussion stayed within phase scope.
