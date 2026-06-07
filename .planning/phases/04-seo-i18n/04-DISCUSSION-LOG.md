# Phase 4: SEO + i18n - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-07
**Phase:** 04-seo-i18n
**Areas discussed:** Locale-aware meta tags, Sitemap structure, Language switcher behavior, JSON-LD and structured data

---

## Locale-aware meta tags

### Per-locale meta approach

| Option | Description | Selected |
|--------|-------------|----------|
| Separate HTML per locale | Each locale gets its own HTML file (index-en.html, index-es.html, index-de.html). SEO-optimized per locale. | ✓ |
| Single HTML + JS swap | One index.html with English meta tags. JS swaps at runtime. OG tags are English-only (bots don't run JS). | |
| Build-time locale injection | Build generates meta tags from locale JSON keys. Single HTML template, build-time substitution. | |

**User's choice:** Separate HTML per locale
**Notes:** Strongest SEO approach — OG and meta tags are correct per locale for crawlers.

### Meta content source

| Option | Description | Selected |
|--------|-------------|----------|
| From locale JSON files | Add seo.title, seo.description, seo.ogTitle, seo.ogDescription keys to locale JSON. Single source of truth. | ✓ |
| Separate meta partials | _meta-en.html, _meta-es.html, _meta-de.html with hardcoded meta content. More explicit, content duplicated. | |

**User's choice:** From locale JSON files
**Notes:** Content and SEO in one place — translation workflow stays simple.

### Output structure

| Option | Description | Selected |
|--------|-------------|----------|
| Subdirectory per locale | dist/index.html (en), dist/es/index.html, dist/de/index.html. Clean separation. | ✓ |
| Flat files with locale suffix | dist/index.html, dist/index-es.html, dist/index-de.html. Simpler but URLs look odd. | |

**User's choice:** Subdirectory per locale
**Notes:** Standard multilingual URL pattern.

### Section content strategy

| Option | Description | Selected |
|--------|-------------|----------|
| data-i18n attributes + build-time replacement | Partials use data-i18n="key" attributes. Build reads locale JSON and replaces textContent. Partials stay language-agnostic. | ✓ |
| Full locale partials per section | Create hero-es.html, hero-de.html. More duplication, zero build complexity. | |

**User's choice:** data-i18n attributes + build-time replacement
**Notes:** Cleanest separation — partials are templates, content comes from JSON.

---

## Sitemap structure

### Sitemap generation

| Option | Description | Selected |
|--------|-------------|----------|
| Build-time generation | Build script generates sitemap.xml from locale list. Reads locale JSON, generates entries with hreflang. Always in sync. | ✓ |
| Static partial | sitemap.xml as hardcoded partial with 3 locale URLs. Simple but manual maintenance. | |

**User's choice:** Build-time generation
**Notes:** No manual maintenance — sitemap always matches locale files.

### Sitemap entry format

| Option | Description | Selected |
|--------|-------------|----------|
| One entry per locale + hreflang | Separate <url> per locale. Each has <loc>, <xhtml:link hreflang="xx"> for all 3 + x-default. Follows best practices. | ✓ |
| Single entry + x-default only | Single <url> with only x-default. Simpler but loses per-locale crawl signals. | |

**User's choice:** One entry per locale + hreflang
**Notes:** Standard multilingual sitemap pattern.

### lastmod handling

| Option | Description | Selected |
|--------|-------------|----------|
| Build-time timestamp | Build reads current date for <lastmod>. Always fresh. | ✓ |
| Fixed date | Hardcode a date. Static but always same regardless of build. | |

**User's choice:** Build-time timestamp
**Notes:** Always fresh per build run.

---

## Language switcher behavior

### Content swap approach

| Option | Description | Selected |
|--------|-------------|----------|
| Build-time full pages | Build generates full HTML for each locale. Language switcher navigates between pages. No runtime i18n JS. | ✓ |
| data-i18n attribute swap | i18next.t() replaces textContent at runtime. Full content swap, no server needed. | |

**User's choice:** Build-time full pages
**Notes:** Every locale URL has correct HTML — best for SEO. No JS dependency for content.

### i18next vendor JS

| Option | Description | Selected |
|--------|-------------|----------|
| Drop i18next entirely | No i18next JS in output. Locale JSON files are build-time input only. Reduces JS payload. | ✓ |
| Keep i18next as fallback | Keep vendor JS for future runtime features. Build generates HTML, i18next as fallback. | |

**User's choice:** Drop i18next entirely
**Notes:** Simplifies build output significantly. Removes 2 npm dependencies.

### Locale persistence

| Option | Description | Selected |
|--------|-------------|----------|
| localStorage redirect | Save to localStorage. On first visit, check and redirect to correct locale. Small inline script. Same UX as current. | ✓ |
| No persistence | Language switcher links directly. User must choose each visit. Simpler but worse UX. | |

**User's choice:** localStorage redirect
**Notes:** Same UX as current i18next-based persistence.

### Switcher navigation

| Option | Description | Selected |
|--------|-------------|----------|
| Standard links | Switcher uses <a href> tags to other locale pages. Standard, crawlable, no JS for switching. | ✓ |
| JS redirect on click | Switcher uses JS to read localStorage and redirect. No page flash but adds JS dependency. | |

**User's choice:** Standard links
**Notes:** Clean, crawlable, simple.

---

## JSON-LD and structured data

### Schema locale scope

| Option | Description | Selected |
|--------|-------------|----------|
| One Person schema, all locales | Keep Person schema in all 3 files. URL points to canonical locale (en). No duplicate Person. | ✓ |
| Locale-specific Person schema | Generate locale-specific Person schemas with translated fields. More SEO signal but duplicates data. | |

**User's choice:** One Person schema, all locales
**Notes:** Simplest, SEO-safe. Person schema is about the person, not the page language.

### Schema structure

| Option | Description | Selected |
|--------|-------------|----------|
| Keep ProfilePage → Person | Keep current structure. Well-structured with knowsAbout, hasOccupation, sameAs. Just update URLs. | ✓ |
| Person only, no wrapper | Simpler but loses ProfilePage nesting Google sometimes uses for rich results. | |

**User's choice:** Keep ProfilePage → Person
**Notes:** Current structure is well-formed.

### WebSite schema

| Option | Description | Selected |
|--------|-------------|----------|
| Add WebSite schema | Separate WebSite block with name, url, sameAs. Lightweight, additional structured data. | ✓ |
| Skip WebSite schema | Keep only Person. ProfilePage is sufficient for portfolio. Less markup. | |

**User's choice:** Add WebSite schema
**Notes:** Requirements mention it. Lightweight addition.

---

## OpenCode's Discretion

- Build script order of operations for locale HTML generation
- data-i18n attribute naming for complex nested content (skills categories with arrays)
- CTA form content handling (form labels and placeholders)
- Locale-specific og:image content

## Deferred Ideas

None — discussion stayed within phase scope.
