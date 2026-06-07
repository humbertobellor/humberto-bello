# Architecture: Static Portfolio Site Refactor

**Domain:** Single-page static portfolio site (React SPA → Node-built HTML)
**Researched:** 2026-06-07
**Mode:** Ecosystem
**Overall confidence:** HIGH

---

## System Overview — Target Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       Build Step (npm run build)                  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐      │
│  │                  build.mjs (Node ESM)                    │      │
│  │  1. Read locale JSON → 3 translation maps               │      │
│  2. Read CSS files → concat + minify                      │      │
│  3. Read partials/*.html → template functions              │      │
│  4. For each locale: render all partials → assemble HTML  │      │
│  5. Copy images, fonts, static assets to dist/            │      │
│  6. Write index.html, es/index.html, de/index.html        │      │
│  7. Write 404.html (same layout, 404 content)             │      │
│  8. Inject hreflang links in each <head>                  │      │
│  9. Inject font preload <link>s in each <head>            │      │
│  └────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    dist/ (deploy root)                            │
│                                                                   │
│  index.html           (English — primary locale)                 │
│  404.html             (GitHub Pages SPA fallback)                │
│  opengraph.jpg        (OG image)                                 │
│  favicon.svg                                                      │
│  robots.txt                                                       │
│  sitemap.xml          (with hreflang annotations)                │
│  Humberto_Bello_Resume.pdf                                       │
│                                                                   │
│  es/                                                             │
│   └── index.html      (Spanish)                                  │
│  de/                                                             │
│   └── index.html      (German)                                   │
│                                                                   │
│  fonts/              (12 .woff2 files, direct copy from public/)│
│  images/             (headshot AVIF + WebP variants)             │
│  scripts/            (tiny inline-hydration JS files, optional)  │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              GitHub Pages (static file server)                    │
│                                                                   │
│  URL: humbertobellor.github.io/dossier/                          │
│  Serving: dist/ as root                                          │
│  404 fallback: 404.html                                          │
│  No server, no Express, no CSP headers (GH Pages handles         │
│   basic security headers)                                       │
└─────────────────────────────────────────────────────────────────┘
```

## Key Architecture Decision: i18n Strategy

**Decision:** Per-locale HTML files generated at build time. No i18next runtime library.

### Rationale

The current approach uses i18next (~33KB in bundled vendor-i18n chunk) with client-side language detection and lazy-loaded JSON. This is unnecessary overhead for 3 small locale files (167 lines each) on a static host.

| Approach | SEO | Perf | Complexity | Bundle |
|----------|-----|------|-----------|--------|
| i18next client-side | Only English indexed* | Flicker on swap | Medium | +33KB |
| Per-locale HTML files | ✓ Perfect per language | Instant render | Low (build only) | 0KB runtime |

*\*Client-side i18n means search engines see only the default locale. Google can execute JS, but content swapped by i18n post-mount is unreliable for indexing. Per-locale HTML files guarantee proper indexing in each language.*

### Implementation

```html
<!-- index.html (English) — <head> includes: -->
<link rel="alternate" hreflang="en" href="https://humbertobellor.github.io/dossier/" />
<link rel="alternate" hreflang="es" href="https://humbertobellor.github.io/dossier/es/" />
<link rel="alternate" hreflang="de" href="https://humbertobellor.github.io/dossier/de/" />
<link rel="alternate" hreflang="x-default" href="https://humbertobellor.github.io/dossier/" />
```

- Language switcher in nav becomes locale-specific links: `href="/dossier/es/"`, `href="/dossier/de/"`
- Active locale is known at build time; each HTML file has correct `lang="en|es|de"` attribute
- No runtime i18n library, no JSON fetch, no flicker

## Component Boundaries — Section Partials

The 1279-line `home.tsx` will be split into 7 HTML partials under `src/partials/`. Each is an HTML fragment with `${t("key")}` placeholder interpolation.

```
src/
  partials/
    _nav.html           — Sticky nav (logo, links, language switcher, resume, CTA)
    _hero.html          — Full hero section (photo + content + stats + bullets)
    _skills.html        — Skills grid (6 category cards)
    _experience.html    — Experience timeline (6 cards)
    _clients.html       — Client grid (6 client cards + CTA banner)
    _footer.html        — Footer + Changelog replaced by static content
  styles/
    wolknitive-tokens.css    — UNCHANGED (187 lines, pure CSS custom properties + @font-face)
    wolknitive-base.css      — NEW: extracted from inline styles (section layouts, cards, tags, buttons)
    wolknitive-animations.css — UNCHANGED (from index.css, CSS keyframe animations)
  i18n/
    locales/
      en.json           — UNCHANGED
      es.json           — UNCHANGED
      de.json           — UNCHANGED
  build.mjs             — NEW: build script (Node ESM, zero dependencies)
```

### Partial Responsibilities

| Partial | Extracted From | Key Content | Has i18n? | Has Images? |
|---------|---------------|-------------|-----------|-------------|
| `_nav.html` | home.tsx:232-407 | Logo, nav links, lang switcher, resume download, CTA email | ✓ | No |
| `_hero.html` | home.tsx:412-718 | Photo column, name, title, stats cards, bullets, tags, badge, scroll hint | ✓ | ✓ Headshot AVIF/WebP |
| `_skills.html` | home.tsx:720-814 | Section header + 6 skill category cards (icon, title, items list) | ✓ | No |
| `_experience.html` | home.tsx:816-920 | Section header + 6 experience cards (company, highlight, description, tags) | ✓ | No |
| `_clients.html` | home.tsx:922-1210 | Section header + 6 client cards + CTA banner (email, LinkedIn, GitHub, Substack) | ✓ | No |
| `_footer.html` | home.tsx:1214-1279 | Name, role, location, MapPin | ✓ | No |

### Inline Style Migration

All inline `style={}` objects (approximately 60+ distinct style blocks) will become CSS classes. The constants (`INK`, `TEAL`, `V500`, etc.) are already CSS custom properties — inline styles reference them as `var(--ink)`, etc. The migration is:

```
Before (JSX):
  style={{
    fontFamily: "var(--font-display)",
    fontWeight: 500,
    fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
    color: INK,
  }}

After (CSS):
  .wk-section-heading {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: clamp(1.9rem, 4vw, 2.8rem);
    color: var(--ink);
  }

After (HTML):
  <h2 class="wk-section-heading">${t("skills.title")}</h2>
```

This eliminates:
- The JS color constants (home.tsx:31-40) — redundant with CSS custom properties
- The inline `onMouseEnter`/`onMouseLeave` handlers for hover states (replaced by `:hover` in CSS)
- ~15KB of repetitive inline style declarations

## CSS Architecture

### File Breakdown

| File | Source | Size | Purpose |
|------|--------|------|---------|
| `wolknitive-tokens.css` | src/styles/ | 187 lines | Design tokens, @font-face, .wk-rule, .wk-label, .wk-eyebrow |
| `wolknitive-base.css` | **NEW** | ~350 lines est. | Section layouts, card patterns, nav styles, button styles, tag styles, footer |
| `wolknitive-animations.css` | src/styles/index.css | 88 lines | CSS keyframe animations + classes (wk-anim-*) |

**Total CSS:** ~625 lines, all inlined in a single `<style>` block in `<head>`.

### What's Removed

| Removed | Reason |
|---------|--------|
| Tailwind CSS | No `@import "tailwindcss"`, no `@tailwindcss/vite` plugin. All utility classes replaced with semantic CSS classes. Tailwind was only used for responsive grid (grid-cols, hidden md:block) and gaps — all representable in ~20 lines of CSS. |
| `tw-animate-css` | shadcn dependency, not used in page animations |
| `@tailwindcss/typography` | Not used in page content |
| shadcn `@theme inline` block | Only maps Wolknitive tokens to Tailwind theme — unnecessary without Tailwind |

### Responsive Strategy

All Tailwind responsive classes (`hidden md:block`, `w-full md:w-1/2`, etc.) replaced with CSS media queries:

```css
/* Example: nav desktop/mobile toggle */
@media (max-width: 767px) {
  .nav-links { display: none; }
  .nav-resume-mobile { display: flex; }
}
@media (min-width: 768px) {
  .nav-links { display: flex; }
  .nav-resume-mobile { display: none; }
}
```

All responsive patterns in the current codebase:
- `hidden md:block` → `.mobile-hidden` at `max-width: 767px`
- `w-full md:w-1/2` → `.hero-content` with `@media (min-width: 768px) { width: 50%; }`
- `md:flex-row` → `.footer-layout` with `@media (min-width: 768px) { flex-direction: row; }`
- `hidden md:inline` → text visibility toggle in nav CTA button
- Grid columns: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` → CSS grid with media queries

## Asset Pipeline

### Source → Output Mapping

| Source | Destination | Copy Strategy |
|--------|-------------|---------------|
| `public/fonts/*.woff2` (12 files) | `dist/fonts/` | Direct copy (same relative path) |
| `../../attached_assets/headshot-corp_*.webp` (2 files) | `dist/images/` | Copy from external dir |
| `../../attached_assets/headshot-corp_*.avif` (2 files) | `dist/images/` | Copy from external dir |
| `public/Humberto_Bello_Resume.pdf` | `dist/` | Direct copy |
| `public/favicon.svg` | `dist/` | Direct copy |
| `public/opengraph.jpg` | `dist/` | Direct copy |
| `public/robots.txt` | `dist/` | Direct copy (update URL) |
| `public/sitemap.xml` | `dist/` | **Regenerate** with all locale URLs |

### Image References in HTML

The current JSX imports headshot images via Vite's `@assets` alias:
```tsx
import headshotWebp from "@assets/headshot-corp_1776959044728.webp";
```

In static HTML, these become direct path references:
```html
<picture>
  <source srcset="images/headshot-corp_1776959044728@1x.avif 350w, images/headshot-corp_1776959044728.avif 700w"
          type="image/avif" media="(min-width: 768px)"
          sizes="(max-width: 1280px) 50vw, 640px" />
  <source srcset="images/headshot-corp_1776959044728@1x.webp 350w, images/headshot-corp_1776959044728.webp 700w"
          type="image/webp" media="(min-width: 768px)" />
  <img src="images/headshot-corp_1776959044728.webp" alt="Humberto Bert Bello"
       fetchpriority="high" loading="eager" width="700" height="700" />
</picture>
```

The responsive `srcset` with `sizes` is preserved but without Vite's content hashing. Since GitHub Pages serves with cache headers based on file age, add version query param if cache-busting is needed: `images/headshot.webp?v=1`.

## Scroll Animation Architecture

### Current (React)
- CSS-only animations for hero section (above fold) — stays
- Lazy-loaded `framer-motion` via `React.lazy()` for below-fold sections — **removed**
- `FadeInSection` wrapper component with `FadeIn.tsx` (framer-motion `whileInView`) — **removed**

### Target (Static)
- CSS animations for hero — unchanged, same `wk-anim-*` classes
- Below-fold scroll reveal: tiny IntersectionObserver script (~20 lines) in `<head>`

```html
<script>
  // IntersectionObserver for scroll-triggered fade-in (replaces framer-motion)
  document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.wk-reveal').forEach(el => observer.observe(el));
  });
</script>
```

CSS:
```css
.wk-reveal {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.wk-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
/* Staggered delays via data attribute or nth-child */
.wk-reveal[data-delay="1"] { transition-delay: 0.07s; }
.wk-reveal[data-delay="2"] { transition-delay: 0.14s; }
```

This eliminates the framer-motion dependency (~20KB gzipped) and the `React.lazy` pattern.

## Build Pipeline Design

### Build Script: `src/build.mjs`

**Zero external dependencies.** Uses only Node built-ins: `fs`, `path`, `url`.

### Execution Order

```
Step 1: Clean dist/
        └─ rm -rf dist/*

Step 2: Read source files (parallel)
        ├─ Read CSS: tokens.css, base.css, animations.css
        ├─ Read locale JSON: en.json, es.json, de.json
        ├─ Read partials: _nav.html, _hero.html, _skills.html, etc.
        └─ Read headshot images from ../../attached_assets/

Step 3: Concatenate CSS
        └─ tokens + base + animations → dist/style.css (unminified, readable)

Step 4: For each locale (en → es → de):
        ├─ Create t(key) interpolation function from locale JSON
        ├─ Render each partial with t() → full HTML body
        ├─ Wrap in <html><head>...</head><body>...</body></html>
        │  └─ Head includes:
        │     ├─ <style>...</style> (inlined CSS)
        │     ├─ <meta lang="en|es|de">
        │     ├─ hreflang <link>s for all 3 locales
        │     ├─ Font preload <link>s (10 woff2 files)
        │     ├─ SEO meta (from locale + static values)
        │     ├─ Open Graph + Twitter Card meta
        │     ├─ JSON-LD structured data
        │     └─ IntersectionObserver <script>
        ├─ Write:
        │  ├─ en → dist/index.html
        │  ├─ es → dist/es/index.html
        │  └─ de → dist/de/index.html
        └─ Write dist/404.html (same as index.html, or copy)

Step 5: Copy assets (parallel)
        ├─ fonts/* → dist/fonts/
        ├─ images/* → dist/images/ (headshots)
        ├─ favicon.svg → dist/
        ├─ opengraph.jpg → dist/
        ├─ robots.txt → dist/ (update URL to github.io)
        ├─ sitemap.xml → dist/ (regenerate with all locale URLs)
        └─ Humberto_Bello_Resume.pdf → dist/

Step 6: Verify output
        └─ Check all files exist, check no placeholder URLs remain
```

### Interpolation Format

Partials use `${t("key.subkey")}` or `${t("key.subkey.array.0")}` syntax:

```html
<!-- src/partials/_hero.html -->
<section id="hero" class="hero">
  <div class="hero-content">
    <h1 class="hero-name">
      Humberto <em>&ldquo;Bert&rdquo;</em> Bello
    </h1>
    <p class="hero-title">${t("hero.title")}</p>
    <!-- stat cards -->
    <div class="stat-grid">
      <div class="stat-card">
        <span class="stat-value">20+</span>
        <span class="stat-label">${t("hero.stats.architecture")}</span>
      </div>
      <!-- ... -->
    </div>
    <!-- bullets -->
    ${tArray("hero.bullets").map(b => `<div class="bullet-row"><span class="bullet-dot"></span><p>${b}</p></div>`).join("")}
  </div>
</section>
```

The `t()` function is a synchronous JSON path lookup. `tArray()` returns an array for iteration. The build script handles nested keys and array returns.

### Output File Manifest

| File | Size (est.) | Notes |
|------|-------------|-------|
| `dist/index.html` | ~25KB | English, full content inlined |
| `dist/es/index.html` | ~25KB | Spanish |
| `dist/de/index.html` | ~25KB | German |
| `dist/404.html` | ~25KB | Same as index.html (or minimal variant) |
| `dist/fonts/*.woff2` | ~250KB total | 12 files, unchanged |
| `dist/images/headshot*.avif` | ~80KB total | 2 AVIF variants |
| `dist/images/headshot*.webp` | ~40KB total | 2 WebP variants |
| `dist/favicon.svg` | ~1KB | |
| `dist/opengraph.jpg` | ~50KB | |
| `dist/robots.txt` | ~0.5KB | |
| `dist/sitemap.xml` | ~1KB | With hreflang annotations |
| `dist/Humberto_Bello_Resume.pdf` | ~100KB | |

**Total deploy size:** ~600KB. Same as current, minus ~200KB of unused shadcn/ui + framework JS.

## Changelog Component Removal

The `Changelog.tsx` component (523 lines) fetches GitHub Releases via `@workspace/api-client-react` and renders Markdown. In the static site:

- **Removed entirely.** The static site cannot fetch GitHub Releases at runtime without React's data fetching layer.
- **No replacement.** The footer loses the "Site Updates" accordion. The PROJECT.md lists this as in-scope removal.
- **Dependency eliminated:** `@workspace/api-client-react`, `@tanstack/react-query`, and `lucide-react` (MapPin icon stays, inline SVG) can all be removed.

This removes an entire data flow path and the only server-dependent feature.

## SEO Architecture

### Per-Locale Meta Tags

Each locale's HTML gets language-specific meta:
```html
<html lang="es">
<head>
  <title>Humberto Bello · Arquitecto de IA & Líder de Ingeniería | IA Agéntica · RAG · Nube</title>
  <meta name="description" content="...Spanish translation..." />
  <meta property="og:title" content="...Spanish..." />
  <meta property="og:locale" content="es_ES" />
  <!-- hreflang cluster -->
  <link rel="alternate" hreflang="en" href="https://humbertobellor.github.io/dossier/" />
  <link rel="alternate" hreflang="es" href="https://humbertobellor.github.io/dossier/es/" />
  <link rel="alternate" hreflang="de" href="https://humbertobellor.github.io/dossier/de/" />
  <link rel="alternate" hreflang="x-default" href="https://humbertobellor.github.io/dossier/" />
</head>
```

### Canonical URL

Update from current `https://humbertobello.replit.app/` to `https://humbertobellor.github.io/dossier/`.

### Sitemap

Regenerate with all three locale URLs and hreflang annotations:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://humbertobellor.github.io/dossier/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://humbertobellor.github.io/dossier/" />
    <xhtml:link rel="alternate" hreflang="es" href="https://humbertobellor.github.io/dossier/es/" />
    <xhtml:link rel="alternate" hreflang="de" href="https://humbertobellor.github.io/dossier/de/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://humbertobellor.github.io/dossier/" />
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### JSON-LD

Per-locale JSON-LD with localized `description` and `knowsAbout`. Structure stays identical to current (`index.html:35-82`) but URL updated.

## 404 Handling

GitHub Pages supports a custom `404.html` at the site root:
- Create `dist/404.html` with the same layout but 404-specific content
- Same nav, footer, CSS — content says "Page Not Found"
- No JavaScript redirect needed (GH Pages natively serves 404.html on 404s)

## GitHub Pages Configuration

### Deploy Structure

The `dist/` directory is the deploy root. GitHub Pages can serve from:
- `main` branch root → not suitable (contains source files)
- `main` branch `/docs` → possible but mixes source and output
- **Recommended:** `gh-pages` branch containing only `dist/` contents

### Deploy Script

```json
{
  "scripts": {
    "build": "node src/build.mjs",
    "deploy": "npm run build && npx gh-pages -d dist -b gh-pages"
  }
}
```

Or use GitHub Actions for automated deploy on push to `main`.

### BASE_PATH Consideration

The site lives at `/dossier/` on `humbertobellor.github.io`. All paths must be relative:
- `/dossier/` → root URL
- `/dossier/fonts/InterTight-400-latin.woff2` → font URL
- `/dossier/es/` → Spanish locale
- Language switcher: `href="/dossier/es/"`, `href="/dossier/de/"`

The current `BASE_PATH` environment variable (`/dossier/` or whatever) must become a hardcoded prefix in all paths, or all paths must be relative. **Recommendation:** Hardcode `/dossier/` prefix as a constant in build.mjs, configurable via env var for local testing.

## Patterns to Follow

### Pattern 1: Template Interpolation with JSON Path

```javascript
// src/build.mjs
function createT(localeData) {
  return (path) => {
    const keys = path.split(".");
    let val = localeData;
    for (const k of keys) {
      val = val?.[k];
    }
    if (typeof val === "string") return val;
    if (Array.isArray(val)) return val;
    return `{{${path}}}`; // missing key marker
  };
}

// For array paths:
function createTArray(t) {
  return (path) => {
    const val = t(path);
    return Array.isArray(val) ? val : [];
  };
}
```

### Pattern 2: Iteration in Partials

For arrays (bullets, experience entries, skill items), the partial uses a simple `forEach` pattern:

```javascript
// build.mjs interpolates this:
html = html.replace(/\$\{forEach\("([^"]+)",\s*"([^"]+)"\}\)\}/g, (_, arrayPath, templatePath) => {
  const items = t(arrayPath);
  const template = partials[templatePath];
  return items.map((item, i) => interpolate(template, { item, i, t })).join("\n");
});
```

But simpler: just build the HTML directly in build.mjs for iteration-heavy sections rather than invent a template language. Experience and skills sections would be built in JS:

```javascript
function renderSkillsSection(t, tArray) {
  const categories = [
    { key: "ai", icon: "brain" },
    { key: "cloud", icon: "cloud" },
    // ...
  ];
  return categories.map((cat) => `
    <div class="skill-card">
      <div class="skill-card-header">
        ${iconSvg(cat.icon, TEAL)}
        <h3>${t(`skills.categories.${cat.key}.title`)}</h3>
      </div>
      <ul class="skill-items">
        ${tArray(`skills.categories.${cat.key}.items`).map(item => `
          <li><span class="dot"></span>${item}</li>
        `).join("")}
      </ul>
    </div>
  `).join("\n");
}
```

**Recommendation:** Keep iteration-heavy sections (skills, experience, clients) in build.mjs JS, use HTML partials only for static-layout sections (nav, hero, footer). This avoids inventing a template language and keeps the logic where it's debuggable.

### Pattern 3: CSS Class Naming

Use the existing `wk-` prefix convention consistently:

```
.wk-nav               — sticky nav container
.wk-nav-link          — nav button
.wk-nav-link.active   — active section
.wk-lang-btn          — language toggle
.wk-lang-btn.active   — active language
.wk-hero              — hero section
.wk-hero-content      — right content column
.wk-hero-photo        — left photo column
.wk-stat-grid         — 2x2 stat cards
.wk-stat-card         — individual stat
.wk-section           — generic section padding
.wk-section-header    — label + heading + subtitle
.wk-card              — base card style
.wk-card-skills       — skills category card
.wk-card-experience   — experience card
.wk-card-client       — client card
.wk-cta-banner        — CTA banner
.wk-footer            — footer
.wk-tag               — hairline pill tag
.wk-tag-accent        — teal accent tag
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Client-Side i18n on Static Host

**What goes wrong:** Keeping i18next + react-i18next on a static site means the HTML always renders in the default locale (English). JavaScript must swap text content after page load. Causes:
- SEO: Only English content is indexed
- Flicker: User sees English for 100-500ms before JS kicks in
- Complexity: i18n init, resource loading, language detection, event handlers
- Bundle: 33KB for 3 small JSON files

**Instead:** Pre-render per-locale HTML files at build time. Language switcher navigates between locale pages.

### Anti-Pattern 2: Inline Styles for Everything

**What goes wrong:** ~60 inline style blocks with the same values repeated (card patterns, button styles, heading styles). Hard to maintain, inconsistent, larger HTML.

**Instead:** Extract all repeatable patterns into CSS classes. Use inline styles only for truly dynamic values (none in this static site).

### Anti-Pattern 3: Keeping shadcn/ui Dead Code

**What goes wrong:** 55 component files (~5,766 lines) that aren't imported anywhere in the application. They stay as dead weight in the source tree, confusing new readers and wasting cognitive bandwidth.

**Instead:** Delete all `src/components/ui/` files, `components.json`, `src/hooks/use-toast.ts`, `src/hooks/use-mobile.tsx`, and all shadcn dependencies from package.json.

### Anti-Pattern 4: Over-Engineering the Template System

**What goes wrong:** Building a full template engine with custom loop syntax, conditionals, filters, etc. for a 6-section single-page site.

**Instead:** Use simple string interpolation (`${t("key")}`) for static partials and build iteration-heavy sections directly in JavaScript. Total ~150 lines of build logic.

## Scalability Considerations

This is a single-page portfolio — scalability is not a concern. However, the architecture should accommodate:

| Concern | Current | After | Notes |
|---------|---------|-------|-------|
| Add a locale | Edit + rebuild | Add JSON file, rebuild | ~30s build time |
| Add a section | Edit home.tsx (complex) | Create partial + CSS + rebuild | Isolation improves |
| Enable caching | Express middleware | GH Pages native | GH Pages sets Cache-Control via `.html` headers |
| Custom domain | Not configured | CNAME file in repo root | Trivial |

## Security Headers

**Current:** Express server enforces CSP, HSTS, X-Frame-Options, COOP.

**Target:** GitHub Pages does not support custom response headers on the free tier. The site loses server-enforced CSP. To mitigate:
1. Remove the `script-src 'unsafe-inline'` CSP directive (only needed for i18next and framer-motion — both gone)
2. The only inline script is the IntersectionObserver — no user input, no XSS vector
3. All assets are self-hosted (no external CDNs), reducing supply chain risk
4. If strict CSP is required: use GitHub Pages Enterprise or Cloudflare in front

**Acceptable risk for a static portfolio with no forms, no auth, no user input.**

## Build Order Implications

The build has clear phase ordering for the roadmap:

1. **Phase 1: CSS Extraction** (no build script changes)
   - Extract all inline styles → `wolknitive-base.css`
   - Remove Tailwind utilities → CSS media queries
   - Delete shadcn/ui + dependencies from package.json
   - Can be verified: open the existing dev server, site looks identical

2. **Phase 2: Section Extraction** (partials created, build script written)
   - Create `src/partials/_nav.html`, `_hero.html`, etc.
   - Write `src/build.mjs` with t() interpolation
   - Build script must output valid HTML for all 3 locales
   - Verify: `npm run build` produces `dist/index.html` that looks correct

3. **Phase 3: Asset Pipeline + Static Assets**
   - Copy fonts, images, SEO files
   - Update robots.txt, sitemap.xml URLs
   - Fix LinkedIn placeholder URL
   - Verify: `dist/` directory matches manifest above

4. **Phase 4: 404 + i18n Finalization**
   - Generate 404.html
   - Add hreflang links
   - Finalize language switcher links
   - Update canonical URL

5. **Phase 5: Deploy**
   - Configure GitHub Pages
   - Push dist/ to gh-pages branch
   - Verify live site

6. **Phase 6: Verification**
   - Visual diff against current site
   - Check all 3 locales render correctly
   - Verify SEO meta tags on all pages
   - Validate HTML, check console for errors

## Sources

- [GitHub Pages documentation](https://docs.github.com/en/pages) — static site serving, custom 404, custom domains
- [hreflang tag best practices](https://ahrefs.com/blog/hreflang-tags/) — multilingual SEO implementation
- [i18next documentation](https://www.i18next.com/) — current i18n library (being removed)
- [Build a static site generator with Node.js](https://www.webdevdrops.com/en/build-static-site-generator-nodejs-8969ebe34b22) — template interpolation pattern reference
- Current codebase analysis at `.planning/codebase/ARCHITECTURE.md` and `.planning/codebase/STRUCTURE.md`
- [Better i18n Best Practices 2026](https://better-i18n.com/en/blog/i18n-best-practices-2026-complete-guide/) — per-locale static generation for SEO
