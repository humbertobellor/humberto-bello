# Phase 4: SEO + i18n - Context

**Gathered:** 2026-06-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Full multilingual support and SEO architecture for GitHub Pages deployment. Build generates 3 separate HTML files per locale (en, es, de), each with correct per-locale meta tags, Open Graph, Twitter Cards, and structured data. Language switcher navigates between locale pages via standard links. Sitemap generated with hreflang annotations. robots.txt updated for new domain. No i18next runtime JS — build-time full pages.

</domain>

<decisions>
## Implementation Decisions

### Per-Locale HTML Output
- **D-01:** Build generates 3 HTML files: `dist/index.html` (en, default), `dist/es/index.html`, `dist/de/index.html`. Each is a complete, self-contained page with all content baked in — no runtime i18n JS.
- **D-02:** Section content (hero, skills, experience, clients, CTA, footer) uses `data-i18n="key"` attributes on elements. Build script reads locale JSON files and replaces `textContent` of matching elements at build time. Partials stay language-agnostic.
- **D-03:** Meta content (title, description, og:title, og:description, twitter:title, twitter:description) stored as `seo.*` keys in each locale JSON file. Build reads these and injects into `_head.html` per locale.

### i18next Removal
- **D-04:** i18next and i18next-browser-languagedetector vendor JS are NOT included in build output. No runtime i18n library needed — all content is baked at build time.
- **D-05:** Remove i18next and i18next-browser-languagedetector from `package.json` dependencies. Locale JSON files remain as build-time input only (in `src/i18n/locales/`).
- **D-06:** Delete `dist/locales/` directory from build output — no vendor JS or locale JSON files needed at runtime.

### Language Switcher
- **D-07:** Language switcher buttons become standard `<a href>` links: `<a href="/dossier/">EN</a>`, `<a href="/dossier/es/">ES</a>`, `<a href="/dossier/de/">DE</a>`. No JS needed for switching — full page navigation.
- **D-08:** Active locale detection via small inline `<script>` in `<head>` that reads `localStorage.getItem('wk-locale')` and redirects to correct locale path on first visit. ~5 lines of vanilla JS.
- **D-09:** Language switcher click handler saves `localStorage.setItem('wk-locale', locale)` before navigating. No i18next needed for persistence.

### Sitemap Generation
- **D-10:** Build script generates `dist/sitemap.xml` dynamically from locale list. One `<url>` entry per locale with `<xhtml:link rel="alternate" hreflang="xx">` pointing to all 3 locales plus `x-default` pointing to English.
- **D-11:** `<lastmod>` uses build-time timestamp (current date at build execution). Always fresh per build.
- **D-12:** Sitemap namespace: `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` + `xmlns:xhtml="http://www.w3.org/1999/xhtml"` for hreflang support.

### robots.txt
- **D-13:** Update `robots.txt` to point to new sitemap URL: `Sitemap: https://humbertobellor.github.io/dossier/sitemap.xml`. Content stays minimal (User-agent: *, Allow: /).

### Canonical URL
- **D-14:** All canonical URLs updated from `https://humbertobello.replit.app/` to `https://humbertobellor.github.io/dossier/`. Each locale page gets its own canonical pointing to its own URL.

### Meta Tags Per Locale
- **D-15:** Each locale HTML file gets locale-specific: `<title>`, `<meta name="description">`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:url">`, `<meta property="og:locale">`, `<meta name="twitter:title">`, `<meta name="twitter:description">`, `<link rel="canonical">`.
- **D-16:** `<html lang>` attribute set per locale: `lang="en"`, `lang="es"`, `lang="de"`.

### JSON-LD Structured Data
- **D-17:** ProfilePage → Person schema kept as-is in all 3 locale files. English-only — no per-locale translation of Person schema fields.
- **D-18:** Add WebSite schema block alongside Person: `{"@type": "WebSite", "name": "Humberto Bello — Professional Dossier", "url": "https://humbertobellor.github.io/dossier/", "sameAs": [...]}`.
- **D-19:** All URLs in JSON-LD updated from `humbertobello.replit.app` to `humbertobellor.github.io/dossier/`.

### OpenCode's Discretion
- Build script order of operations for locale HTML generation (loop vs sequential)
- Exact data-i18n attribute naming for complex nested content (e.g., skills categories with arrays)
- How to handle the CTA form content (currently form labels in locale JSON — may need special handling since forms have placeholder text too)
- Locale-specific `<meta property="og:image">` content (currently points to replit.app — needs update)

</decisions>

<specifics>
## Specific Ideas

- Build-time full pages means the site works without any JS — progressive enhancement, not JS-dependent
- localStorage redirect should have a guard to prevent redirect loops (check if already on correct path)
- Sitemap generation should be idempotent — running build twice produces identical output
- The `data-i18n` attribute approach allows future runtime i18n if ever needed (just add i18next back)

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — Phase 4 requirements: I18-01, I18-02, I18-03, I18-04, SEO-01, SEO-02, SEO-03, SEO-05, SEO-06

### Prior Phase Context
- `.planning/phases/02-build-system/02-CONTEXT.md` — Phase 2 decisions for HTML partials structure (D-01–D-04), build script assembly (D-05–D-08), i18next setup (D-12–D-14), CSP (D-15), 404.html (D-16)
- `.planning/phases/03-asset-pipeline/03-CONTEXT.md` — Phase 3 decisions for asset copy integration (D-01–D-04), output layout (D-17–D-18)

### Source Files to Modify
- `scripts/build.mjs` — Add locale HTML generation, sitemap generation, robots.txt copy, remove i18next vendor copy
- `src/html/_head.html` — Add `data-i18n` attributes for meta tags, add WebSite schema, update URLs
- `src/html/_nav.html` — Convert language switcher from `data-i18n-switch` buttons to `<a href>` links
- `src/html/index.html` — Add locale redirect script, set up for per-locale generation
- `src/i18n/locales/en.json` — Add `seo.*` keys for meta content
- `src/i18n/locales/es.json` — Add `seo.*` keys for Spanish meta content
- `src/i18n/locales/de.json` — Add `seo.*` keys for German meta content
- `package.json` — Remove i18next and i18next-browser-languagedetector dependencies

### Source Files to Delete
- `dist/locales/` — No longer needed in build output

### Existing SEO Assets
- `public/sitemap.xml` — Current sitemap (1 URL, replit.app) — will be replaced by build-generated version
- `public/robots.txt` — Current robots.txt (replit.app sitemap URL) — needs URL update
- `src/html/_head.html:33-80` — Current JSON-LD structured data — URLs need updating

### Locale Data
- `src/i18n/locales/en.json` — English locale (167 lines) — add seo.* keys
- `src/i18n/locales/es.json` — Spanish locale — add seo.* keys
- `src/i18n/locales/de.json` — German locale — add seo.* keys

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/build.mjs` — Existing build script with marker replacement, CSS injection, path rewriting. Locale generation extends this pattern.
- `src/html/_head.html` — Complete SEO setup (meta, OG, Twitter, JSON-LD) — needs URL updates and data-i18n attributes for per-locale content
- `src/html/_nav.html:18-22` — Language switcher HTML structure — convert buttons to links
- `src/html/index.html` — Simple template with <!--#include --> markers — same pattern for locale variants

### Established Patterns
- Marker replacement pattern (`<!--#include path-->`) for HTML assembly — locale generation reuses this
- `data-*` attributes for behavior (established in Phase 1 for IntersectionObserver) — extend to `data-i18n` for content
- `BASE_PATH` env var for path rewriting — sitemap and canonical URLs need this
- Build-time scaffolding of output directories — add `dist/es/` and `dist/de/`

### Integration Points
- Phase 2 build script produces `dist/` layout — this phase adds locale subdirectories
- Phase 3 copied fonts/images to `dist/fonts/` and `dist/images/` — locale pages reference these via relative paths
- Phase 5 (Deploy) deploys the complete `dist/` directory including locale subdirectories
- Current i18n JSON files in `src/i18n/locales/` — build-time input, not runtime assets

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-seo-i18n*
*Context gathered: 2026-06-07*
