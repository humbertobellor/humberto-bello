# Domain Pitfalls

**Domain:** Single-page static portfolio site (React SPA → Node-built HTML)
**Researched:** 2026-06-07

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Keeping i18next Client-Side on Static Host

**What goes wrong:** The HTML always renders in the default locale (English). i18next initializes on page load, detects the browser language, and swaps text content via DOM manipulation. This means:
- Googlebot sees only English content (it may execute JS, but swapped content is unreliable for indexing)
- Users see a flash of English before the JS swaps to their locale
- The language switcher needs to work around SPA routing on a static host
- ~33KB of JS is downloaded and executed for 3 small JSON files

**Why it happens:** Developers are comfortable with i18next from the SPA and try to keep it working by loading JSON at runtime and calling `changeLanguage()`.

**Consequences:** Poor SEO for non-English locales (the entire selling point of having a Spanish/German version is lost), perceivable content flicker, unnecessary complexity.

**Prevention:** Generate per-locale HTML files at build time. Each locale gets its own `index.html` with content baked in. Language switcher navigates between locale pages. Zero runtime i18n code.

**Detection:** If the page loads English content and switches to another language after a visible delay.

### Pitfall 2: Over-Engineering the Build Script

**What goes wrong:** The build script grows from a simple template assembler to a "mini static site generator" with custom template syntax, partial nesting, pipeline plugins, and watch mode. What should be ~100 lines of Node.js becomes 500+ lines with abstractions.

**Why it happens:** Developers pattern-match against full SSGs (Hugo, 11ty, Astro) and try to replicate their features. The 6-section portfolio doesn't need a template engine.

**Consequences:** Build script becomes the new maintenance burden, defeating the purpose of simplifying the architecture.

**Prevention:** 
- Use string interpolation (`${t("key")}`) for partials — no template language
- Build iteration-heavy sections (skills grid, experience cards, client cards) directly in JavaScript with `.join("")`
- The entire build script should fit in one file, < 150 lines
- If the build script exceeds 200 lines, reconsider the approach

**Detection:** Build script has more lines than the longest HTML partial.

### Pitfall 3: Path Inconsistency with GitHub Pages Subdirectory

**What goes wrong:** The site deploys to `bertjbello.com/` (a subdirectory, not a root domain). All asset paths must include the `/dossier/` prefix or use relative paths. If paths are hardcoded as `/fonts/...` they break on GitHub Pages because the browser looks for `bertjbello.com/fonts/` instead of `bertjbello.com/fonts/`.

**Why it happens:** During local testing, files are served from the filesystem (no prefix needed). The developer forgets to add the prefix before deploy.

**Consequences:** Missing fonts, broken images, broken language switcher links, broken SEO meta (OG image URL).

**Prevention:**
- Use a configurable `BASE_PATH` constant in the build script (defaults to `/dossier/`)
- All paths in partial HTML use `${BASE_PATH}` prefix
- Add a build-time validation step: "Are any src/href attributes missing the prefix?"
- Test locally with a server that simulates the subdirectory path

```javascript
const BASE_PATH = process.env.BASE_PATH || "/dossier";

// In build.mjs, prefix all absolute paths:
function assetPath(relative) {
  return `${BASE_PATH}/${relative}`;
}
// Usage in partials: src="${assetPath('images/headshot.webp')}"
```

**Detection:** Open the deployed site — fonts fail to load, images show 404, language switcher links go to wrong URL.

### Pitfall 4: Missing .nojekyll File on GitHub Pages

**What goes wrong:** GitHub Pages uses Jekyll by default to process files. Files and directories prefixed with `_` or starting with `.` may be excluded or processed differently. The `es/` and `de/` subdirectories may not be served correctly.

**Why it happens:** GitHub Pages' Jekyll processing is not obvious — it silently ignores/processes files without error messages.

**Consequences:** The `es/index.html` and `de/index.html` pages return 404s because Jekyll ignores them.

**Prevention:** Add an empty `.nojekyll` file to the `dist/` root. This tells GitHub Pages to skip Jekyll processing.

```bash
# In build.mjs:
fs.writeFileSync(path.join(DIST_DIR, ".nojekyll"), "");
```

**Detection:** After deploy, `https://bertjbello.com/es/` returns 404.

### Pitfall 5: Inline Style Regex Errors During CSS Extraction

**What goes wrong:** The ~60 inline `style={}` objects in `home.tsx` contain JavaScript expressions, template literals, and conditional logic. Naively extracting them to CSS classes misses dynamic behavior (hover handlers, conditional values).

**Why it happens:** Inline styles are not all static. Some use ternary expressions, event handlers, or computed values. Home.tsx has `onMouseEnter`/`onMouseLeave` handlers that modify styles dynamically.

**Consequences:** Broken hover effects, missing style variations, visual regressions.

**Prevention:**
- Audit every inline style block for dynamic content before extraction
- The dynamic patterns in home.tsx are:
  1. Hover state changes (`onMouseEnter`/`onMouseLeave` modifying colors) → convert to `:hover` CSS pseudoclass
  2. Active section styling (`activeSection === id ? TEAL : V500`) → convert to `.active` CSS class toggled by JS
  3. Animation delay (`animationDelay: ${0.3 + i * 0.07}s`) → use CSS `nth-child` or `data-delay` attribute
- Use a checklist: for each section, verify every visual state after extraction
- **Test approach:** Build the static HTML, open in browser, compare screenshots pixel-by-pixel against the current live site

## Moderate Pitfalls

### Pitfall 1: Missing hreflang Return Links
**What goes wrong:** Each locale page must link to all other locale versions. If `es/index.html` links to `en` and `de` but `de/index.html` doesn't link back to `es`, Google ignores the hreflang annotations entirely.
**Prevention:** The build script generates all hreflang links in a single block from a locale list — every locale gets identical link sets. This is mechanically correct by construction.

### Pitfall 2: Forgetting to Update the Canonical URL
**What goes wrong:** The current `index.html` has `<link rel="canonical" href="https://humbertobello.replit.app/">`. If this isn't changed to `https://bertjbello.com/`, search engines continue to prefer the old Replit URL.
**Prevention:** The canonical URL becomes a build-time constant alongside `BASE_PATH`.

### Pitfall 3: Language Switcher Without Current-Locale Feedback
**What goes wrong:** The language switcher shows EN/ES/DE buttons, but on the Spanish page, the ES button should appear as "active" (highlighted). Without this, users can't tell which locale they're on.
**Prevention:** Each locale's HTML renders its language switcher with the current locale's button in `.active` state. The build script knows which locale it's building for.

### Pitfall 4: Font Preload Mismatch
**What goes wrong:** The current `index.html` has 10 `<link rel="preload">` tags for specific woff2 files. If font filenames change or are removed, preloads fail silently (not harmful, but wasted network discovery).
**Prevention:** The build script generates preload links by reading the actual font files in `public/fonts/` — always matching reality.

### Pitfall 5: Missing `data-testid` Attributes
**What goes wrong:** The current codebase has extensive `data-testid` attributes on sections and components. If these are stripped during the static refactor, any existing end-to-end tests break.
**Prevention:** Preserve all `data-testid` attributes in the HTML partials. They're harmless in production and cost nothing.

## Minor Pitfalls

### Pitfall 1: Base Path Trailing Slash
The GitHub Pages URL `/dossier/` must have a trailing slash. `/dossier` without trailing slash causes a redirect. Ensure all generated links use `/dossier/` consistently.

### Pitfall 2: IntersectionObserver Not Available
Very old browsers (IE11) don't support IntersectionObserver. The scroll-reveal animations should degrade gracefully — content should be visible without animation, not invisible. Use `@supports (animation: fadeIn)` or a feature detection fallback.

### Pitfall 3: HTML Encoding in JSON Locale Files
If locale JSON contains special HTML characters (`&`, `<`, `>`, `"`), they must be HTML-encoded when interpolated into HTML. The `t()` function should call a simple `escapeHtml()` for any value placed in element content.

### Pitfall 4: SVG Icon Sizing
The current code uses `lucide-react` for icons (`size={14}` etc.). Converting to inline SVGs requires matching the exact dimensions. Each lucide icon has a default viewBox of `0 0 24 24` — inline SVGs should preserve this and use `width`/`height` attributes.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| CSS extraction (Phase 1) | Hover handlers lost | Convert onMouseEnter/Leave to :hover. Test every interactive element. |
| Build script (Phase 2) | Path resolution for external assets | Hardcode `ASSETS_DIR = path.resolve("../../attached_assets")` — verify with `fs.existsSync` |
| i18n finalization (Phase 4) | hreflang mismatch between locales | Build script generates all links from one locale list — symmetric by construction |
| GitHub Pages deploy (Phase 6) | Missing .nojekyll | Add `touch .nojekyll` to build script |
| GitHub Pages deploy (Phase 6) | Base path wrong | `BASE_PATH` constant validated at build time |
| GitHub Pages deploy (Phase 6) | Cache invalidation | GitHub Pages CDN caches for ~10 minutes; hard refresh may not work. Use `?v=` query param on assets if urgent update needed. |

## Sources

- Current codebase analysis — inline style patterns, path aliases, data-testid usage
- [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages) — .nojekyll, custom 404, build configuration
- [hreflang common mistakes](https://www.hreflangs.com/best-practices-and-common-mistakes) — bidirectional link requirements, x-default
- [CSS extraction best practices](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance) — :hover vs JS event handlers for interactive styles
