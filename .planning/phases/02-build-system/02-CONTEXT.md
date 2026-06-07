# Phase 2: Build System - Context

**Gathered:** 2026-06-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Node build script that produces a single valid `index.html` for the default locale, assembled from HTML partials, with all framework dependencies (React, Vite, Express, wouter, react-query) removed from output. Includes 404.html generation, CSP meta tag, and i18next client-side setup. CSS is inlined in `<style>` blocks. Asset path rewriting for GitHub Pages `/dossier/` subdirectory.

No new capabilities — build infrastructure only. Asset copying (fonts, images) and multi-locale support belong in Phases 3 and 4.

</domain>

<decisions>
## Implementation Decisions

### HTML Partials Structure
- **D-01:** One file per section: `hero.html`, `experience.html`, `skills.html`, `clients.html`, `cta.html`, `footer.html`. Shared wrapper partials: `_head.html`, `_nav.html`, `_footer.html`. Cleanest separation, mirrors CSS architecture from Phase 1.
- **D-02:** Partials directory: `src/html/` — parallel to existing `src/` directories (pages/, components/, styles/).
- **D-03:** English-only partials for Phase 2. Multi-locale (es, de) handled in Phase 4. No placeholder variables or per-locale directories now.
- **D-04:** Leading underscore for shared/wrapper partials (`_head.html`, `_nav.html`, `_footer.html`). Section partials have no prefix — they compose the body content.

### Build Script Assembly Pattern
- **D-05:** Marker replacement pattern. Main template (`index.html`) uses `<!--#include path/to/partial.html-->` markers. Build script reads the template, replaces markers with partial file contents. Familiar SSI-like pattern — structure visible in the template.
- **D-06:** Build script reads CSS/JS files from `src/styles/` and injects into `<style>`/`<script>` blocks. CSS files remain editable source — not manually copied into partials. Three `<style>` blocks, one `<script>` block for IntersectionObserver, one for i18next init.
- **D-07:** `npm run build` replaced with `node scripts/build.mjs` — single build command, no Vite. Clean break.
- **D-08:** Dev preview: `npm run build && open dist/index.html` — rebuild is fast (<200ms) so no dev server needed.

### CSS Inlining and Asset Embedding
- **D-09:** Three separate `<style>` blocks with IDs: `<style id="wk-tokens">` (wolknitive-tokens.css), `<style id="wk-base">` (base.css), `<style id="wk-animations">` (animations.css). Order preserved, debugging-friendly.
- **D-10:** Asset path rewriting via `BASE_PATH` env var. Partials use relative paths (`fonts/Bogart-Regular.woff2`). Build script prepends base path (e.g., `/dossier/`) during assembly. Same env-driven approach as current Vite config.
- **D-11:** Headshot images (AVIF/WebP with srcset) copied into `src/images/` at package level (from `../../attached_assets/`). Partials reference them with relative paths; build script rewrites for output.

### i18next Setup Without React
- **D-12:** i18next loaded as bundled vendor JS from `node_modules` (i18next.min.js + i18nextBrowserLanguageDetector.min.js). Non-CDN — no third-party origin for CSP. Inline init `<script>` in `<head>`.
- **D-13:** Locale JSON files (`en.json`, `es.json`, `de.json`) copied from `src/i18n/locales/` to `dist/locales/` during build. i18next fetches via `fetch()` with configured locale path.
- **D-14:** `data-i18n-switch="es"` attributes on language switcher buttons. Vanilla JS event delegation handles clicks and calls `i18n.changeLanguage()`. Same pattern as IntersectionObserver — no React event handlers.

### CSP and 404.html
- **D-15:** CSP `<meta>` tag: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'self'`. Removes `'unsafe-eval'` from current Express config (no need for static site). Keeps `'unsafe-inline'` for inline `<script>` blocks.
- **D-16:** 404.html generated from same template partials as index.html with different body content ("Page not found" + link home). Build script runs marker replacement twice: once for index content, once for 404 content. No duplicated layout.

### Build Output Structure
- **D-17:** `dist/` layout: `index.html`, `404.html` at root; `locales/` (locale JSON + i18next vendor JS); `fonts/` (populated by Phase 3); `images/` (populated by Phase 3).
- **D-18:** Build script scaffolds all target directories (`locales/`, `fonts/`, `images/`) even if empty. Phase 3 copies files in. Clear output contract.
- **D-19:** i18next vendor JS (`i18next.min.js`, `i18nextBrowserLanguageDetector.min.js`) copied from `node_modules` to `dist/locales/` during build.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements and Design
- `.planning/REQUIREMENTS.md` — Phase 2 requirements: DEP-01, DEP-06, DEP-07, DEP-08, DEP-10, INF-01, INF-03, STC-01, STC-05
- `.planning/phases/01-css-architecture/01-CONTEXT.md` — Phase 1 decisions (CSS file org, IO pattern, inline SVGs) — all carry forward
- `.planning/phases/01-css-architecture/01-UI-SPEC.md` — Design contract with layout, spacing, typography, animation specs

### CSS Source Files (input to build)
- `src/styles/wolknitive-tokens.css` — Design tokens + `@font-face` (from Phase 1 extraction)
- `src/styles/base.css` — CSS reset, layout, grid, dark/print `@media` blocks (from Phase 1)
- `src/styles/animations.css` — Keyframes + IntersectionObserver trigger classes (from Phase 1)

### Codebase References (being replaced/removed)
- `vite.config.ts` — Current build pipeline being replaced by `scripts/build.mjs`
- `server.mjs` — Express server being removed; CSP policy source for `<meta>` tag migration
- `package.json` — Scripts and dependencies to clean up
- `src/i18n/i18n.ts` — Current i18next + react-i18next initialization; reference for static i18n init

### Locale Data
- `src/i18n/locales/en.json` — English locale content
- `src/i18n/locales/es.json` — Spanish locale content
- `src/i18n/locales/de.json` — German locale content

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `vite.config.ts:heroPreloadPlugin` — hero image preload logic can inform path rewriting in the build script
- `server.mjs:18-28` — CSP header values are the source of truth for the `<meta>` CSP tag
- `src/i18n/i18n.ts` — Current i18next init config (resources, detection, fallback) — the init `<script>` must replicate this without react-i18next

### Established Patterns
- Phase 1 established `src/styles/` as the CSS source directory — build script reads from here
- Current Vite build uses `BASE_PATH` env var for path prefix — build script uses same env var
- `data-*` attributes for behavior (established by Phase 1 IntersectionObserver decision with `data-delay`)

### Integration Points
- Phase 3 (Asset Pipeline) copies font/image files into the `dist/fonts/` and `dist/images/` directories scaffolded by Phase 2
- Phase 4 (SEO + i18n) adds multi-locale support on top of the i18next infrastructure set up in Phase 2
- Phase 5 (Deploy) deploys the `dist/` directory produced by Phase 2 (+ Phase 3 + Phase 4) to GitHub Pages

</code_context>

<specifics>
## Specific Ideas

- "Same layout, cleaner code" — the build script replaces Vite's build pipeline, not the visual output
- i18next behavior should match current React-based behavior exactly (same locale detection, same fallback chain, same language persistence)
- The build script should be fast enough that rebuild-and-reload is comfortable for dev iteration

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-build-system*
*Context gathered: 2026-06-07*
