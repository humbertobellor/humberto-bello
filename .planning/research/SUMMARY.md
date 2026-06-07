# Project Research Summary

**Project:** humberto-bello — static portfolio dossier
**Domain:** Single-page static portfolio site (React SPA → Node-built HTML)
**Researched:** 2026-06-07
**Confidence:** HIGH

## Executive Summary

This is a personal portfolio/dossier site for Humberto Bello — a single-page professional profile with 3 languages (en/es/de), 6 content sections, and a distinctive design system. The current implementation uses React 19 + Vite 6 + TypeScript + i18next + framer-motion + shadcn/ui, which is severe overkill for a page that renders once and never updates. The expert approach is a zero-dependency static site: a ~150-line Node.js build script that assembles HTML partials with inlined CSS, generates separate files per locale, and deploys to GitHub Pages (~600KB total, 1 devDependency).

The recommended approach eliminates the entire framework stack (React, Vite, TypeScript, i18next, framer-motion, shadcn/ui — ~120+ dependencies removed). The build script uses only Node built-in modules (`fs`, `path`, `url`), and deployment goes to GitHub Pages via the `gh-pages` npm package. No dev server, no HMR, no build pipeline — just a script that produces deployable HTML.

Key risks cluster around the i18n transition (per-locale HTML generation prevents SEO loss and content flicker), path consistency on GitHub Pages subdirectory (`/dossier/` prefix on all assets), and inline-style extraction (60+ inline `style={}` objects must be converted to CSS classes without losing hover states, animation delays, or active section highlighting). All three are well-understood patterns with clear mitigations documented in the research.

## Key Findings

### Recommended Stack

The current React/TypeScript/Vite stack has ~120 dependencies for a page that never re-renders. The research recommends replacing it with a single ~150-line Node.js build script using zero external dependencies.

**Core technologies:**
- **Node.js 22+**: Build script runtime — already installed, zero new dependencies
- **Node built-ins (`fs`, `path`, `url`)**: File I/O, path resolution, HTML assembly — no npm packages needed
- **HTML5 + CSS3 (custom properties)**: Markup, design system, layout, animations — 90% already authored
- **Vanilla JS (ES2020+)**: IntersectionObserver for scroll animations, active nav tracking, language switcher — ~20 lines total
- **GitHub Pages**: Static file hosting — free, zero-config, supports custom 404.html
- **`gh-pages` 6.x**: Deploy CLI — the only devDependency (down from ~120)

**What's being removed:** React 19, Vite 6, TypeScript, i18next + react-i18next, framer-motion, Express 5, Tailwind CSS v4, shadcn/ui + Radix primitives (55 files), `@tanstack/react-query`, `lucide-react` (22 icon imports), Beasties, `clsx` + `tailwind-merge` + `class-variance-authority`, and all workspace API deps.

### Expected Features

**Must have (table stakes):**
- Professional hero with name/title — currently present, unchanged
- Experience timeline/cards — core portfolio content
- Skills showcase — 6 category cards
- Client/employer logos — social proof via name cards
- CTA/contact method — email link (mailto:), no contact form
- Responsive design — preserved with CSS media queries
- Multi-language support — 3 locales (en/es/de)
- SEO meta tags — enhanced with hreflang per locale
- Resume download link — preserved
- Fast load time — improved (no JS framework overhead)

**Should have (differentiators):**
- Custom Wolknitive design system — warm vellum/teal aesthetic, brand-building
- CSS-only hero animations — smooth entrance without JS overhead
- AVIF/WebP responsive headshot with srcset — bandwidth optimization
- Bogart display font with trial-font digit workaround — unique typographic identity
- 3-language full translation — rare for personal portfolios
- Self-hosted all fonts — no external CDN, no GDPR concerns
- Scroll-triggered reveal animations — IntersectionObserver replacing framer-motion
- Sticky nav with section tracking — IntersectionObserver in vanilla JS
- JSON-LD structured data — per-locale ProfilePage schema

**Defer (v2+) / Anti-features:**
- Changelog/GitHub releases viewer — removed entirely (requires runtime API)
- Contact form — removed (email link only)
- Client-side i18n — replaced by build-time per-locale HTML
- Dark mode toggle — not in scope, design system doesn't invert cleanly
- Blog/content sections — out of scope for dossier
- Analytics/tracking pixels — zero tracking
- Service Worker/PWA — no offline functionality needed

### Architecture Approach

The target architecture is a build-time static site generator (~150 lines of Node.js) that reads locale JSON files, concatenates CSS, renders 7 HTML partials with `${t("key")}` interpolation, and outputs per-locale `index.html` files to `dist/`. The build script handles iteration-heavy sections (skills grid, experience cards, client cards) directly in JavaScript rather than inventing a template language. Deployment is to GitHub Pages via the `gh-pages` branch.

**Major components:**
1. **`src/build.mjs`** — Node ESM build script, zero dependencies, assembles all output
2. **`src/partials/`** — 7 HTML partials (`_nav.html`, `_hero.html`, `_skills.html`, `_experience.html`, `_clients.html`, `_footer.html`, `_page.html`)
3. **`src/styles/`** — 3 CSS files (tokens + base + animations), inlined in `<style>` block
4. **`src/i18n/locales/`** — 3 locale JSON files (unchanged from current)
5. **`dist/`** — Deploy root: 3 index.html files per locale, 404.html, fonts, images, SEO files

**Key architecture decisions:**
- Per-locale HTML files at build time (not runtime i18n) — better SEO, instant render, zero JS overhead
- CSS class extraction from inline styles — ~60 inline `style={}` blocks become semantic `.wk-*` classes
- IntersectionObserver replaces framer-motion — same visual result, 20 lines of vanilla JS
- `BASE_PATH` constant (`/dossier/`) prefixes all asset paths — configurable for local testing

**Data flow:** Locale JSON → build.mjs renders partials → per-locale HTML files → GitHub Pages serves static files. No runtime API calls, no client-side data fetching.

### Critical Pitfalls

1. **Keeping i18next client-side:** Generates English-only SEO, visible content flicker, ~33KB unnecessary JS. **Prevention:** Build-time per-locale HTML files. Each locale gets its own `index.html` with content baked in. Zero runtime i18n code.

2. **Path inconsistency with GitHub Pages subdirectory:** Assets break because `/dossier/` prefix is missing. **Prevention:** Configurable `BASE_PATH` constant in build script, build-time validation step checking all `src`/`href` attributes have the prefix.

3. **Incomplete inline style extraction:** ~60 inline `style={}` blocks with dynamic hover handlers, conditional values, and animation delays get lost if naively extracted. **Prevention:** Audit every inline style for dynamic content; convert `onMouseEnter`/`onMouseLeave` to `:hover` pseudoclasses, active section styling to `.active` CSS class, animation delays to `nth-child`/`data-delay` attributes.

4. **Missing `.nojekyll` file:** GitHub Pages uses Jekyll by default, silently ignoring `es/` and `de/` subdirectories, causing locale pages to 404. **Prevention:** Add `fs.writeFileSync(".nojekyll", "")` to the build script.

5. **Over-engineering the build script:** The script grows from simple template assembler to "mini static site generator" with custom template syntax and pipeline plugins. **Prevention:** Use string interpolation for partials, build iteration-heavy sections in JS with `.join("")`, keep the entire script under 200 lines.

## Implications for Roadmap

Based on combined research, the work breaks into 6 phases with clear dependency ordering:

### Phase 1: CSS Extraction + Dependency Cleanup
**Rationale:** Foundation for everything else — must establish the CSS architecture before touching templates or build. Can be verified by running the existing dev server with identical visuals.
**Delivers:** `wolknitive-base.css` with extracted section styles, deleted `src/components/ui/` (55 files), removed Tailwind/shadcn dependencies from `package.json`, responsive Tailwind utilities replaced with CSS media queries.
**Addresses:** Inline style migration (FEATURES: all sections), responsive design (table stakes).
**Avoids:** PITFALL Critical #5 — inline style regex errors. All 60+ style blocks audited one-by-one; dynamic patterns (hover, active, delay) converted before extraction.
**Needs research?** No — well-documented CSS patterns, codebase is fully understood.

### Phase 2: Build Script + Section Partials
**Rationale:** Depends on Phase 1 (CSS classes defined). The build script and partials are the core of the static architecture. Writes `build.mjs` and all 7 HTML partials.
**Delivers:** `src/build.mjs` (~150 lines), `src/partials/_nav.html`, `_hero.html`, `_skills.html`, `_experience.html`, `_clients.html`, `_footer.html`. Build script produces valid HTML for all 3 locales with `${t("key")}` interpolation. Iteration-heavy sections built in JS.
**Addresses:** Core architecture (ARCHITECTURE: section partials, template interpolation pattern).
**Avoids:** PITFALL Critical #2 — over-engineering the build script. Strict guardrail: keep under 200 lines, no template language invented.
**Needs research?** No — Node built-in patterns are standard.

### Phase 3: Asset Pipeline + SEO Files
**Rationale:** Depends on Phase 2 (files are copied/post-processed by build script). Pure asset handling with no new architectural decisions.
**Delivers:** Fonts copied to `dist/fonts/`, headshot images to `dist/images/`, `favicon.svg`, `opengraph.jpg`, `robots.txt` (URLs updated), `sitemap.xml` (regenerated with hreflang), `Humberto_Bello_Resume.pdf`, LinkedIn placeholder URL fixed.
**Addresses:** Asset pipeline (ARCHITECTURE: asset pipeline section), SEO meta tags (table stakes).
**Avoids:** PITFALL Moderate #4 — font preload mismatch (build script reads actual font files to generate preload links).
**Needs research?** No — pure file I/O.

### Phase 4: 404 Handling + i18n Finalization
**Rationale:** Depends on Phase 2 (build script exists) and Phase 3 (assets in place). The i18n strategy is the key architectural decision — this phase finalizes it.
**Delivers:** `dist/404.html` with same layout + 404 content, hreflang links across all locales, canonical URL updated, language switcher with current-locale active state, JSON-LD structured data per locale, per-locale Open Graph + Twitter Card meta.
**Addresses:** Multi-language support (differentiator), 404 handling (ARCHITECTURE: 404 section), SEO architecture (ARCHITECTURE: SEO section).
**Avoids:** PITFALL Critical #1 — keeping i18next client-side (build-time per-locale HTML eliminates this), PITFALL Moderate #1 — missing hreflang return links (build script generates symmetric link sets), PITFALL Moderate #2 — old canonical URL, PITFALL Moderate #3 — language switcher locale feedback.
**Needs research?** No — hreflang is well-documented; the build script pattern guarantees correctness.

### Phase 5: GitHub Pages Deploy Configuration
**Rationale:** Depends on all previous phases producing a valid `dist/` directory. Deployment is the final delivery step.
**Delivers:** `gh-pages` branch with `dist/` contents, `.nojekyll` file, `BASE_PATH` validated, deploy script in `package.json`, optional GitHub Actions workflow for automated deploy-on-push.
**Addresses:** Deployment (table stakes — site must be live).
**Avoids:** PITFALL Critical #3 — path inconsistency (BASE_PATH validation), PITFALL Critical #4 — missing `.nojekyll` (build script writes it).
**Needs research?** No — GitHub Pages + `gh-pages` package is standard.

### Phase 6: Verification
**Rationale:** Final phase — can only run after deployment is live. Compares against current site.
**Delivers:** Pixel-by-pixel visual comparison of all 3 locales, SEO meta tag verification, HTML validation, console error check, responsive layout check, font loading verification, JSON-LD structured data validation.
**Addresses:** Quality assurance across all features.
**Avoids:** All pitfalls — this phase catches any regression.
**Needs research?** Suggest running `/gsd-research-phase` on image comparison tooling if automated visual diff is wanted.

### Phase Ordering Rationale

- **Dependency chain:** CSS classes → build script → assets → i18n → deploy → verify. Each phase produces output consumed by the next.
- **Risk isolation:** Phase 1 (CSS extraction) is the riskiest — isolated first so regressions are caught early. Phase 4 (i18n) is the second-highest risk — isolated after assets are stable.
- **Verification last:** The final phase validates the entire pipeline end-to-end, matching the existing live site as ground truth.
- **No overlapping concerns:** Each phase touches a distinct concern (styles, build logic, assets, i18n, deploy, verify). No phase requires reverting a previous phase's work.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 6 (Verification):** If automated visual diff is desired, research pixel-comparison tools (Playwright screenshot diff, Percy, etc.). The current site must be captured as a baseline before Phase 1 begins.

Phases with standard patterns (skip research-phase):
- **Phases 1-5 all use well-documented patterns:** CSS extraction, Node.js build scripts, asset file I/O, GitHub Pages deployment. No phase requires specialized domain research.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Node built-ins + GitHub Pages are battle-tested. The removal decisions are validated against actual usage (dead code analysis from codebase map). |
| Features | HIGH | Feature set is defined by existing codebase and explicit project requirements. No guesswork — every feature is either preserved (extracted from current site) or removed (justified by static hosting constraints). |
| Architecture | HIGH | Architecture is thoroughly mapped from current code (ARCHITECTURE.md in codebase research), and the target architecture is a simplification, not a new design. Every component boundary is backed by real code. |
| Pitfalls | HIGH | All critical and moderate pitfalls are identified from existing patterns in the codebase and known GitHub Pages gotchas. Prevention strategies are specific and testable. |

**Overall confidence:** HIGH

### Gaps to Address

- **Baseline screenshot capture for Phase 6:** The current live site should be screenshotted (full page, all 3 locales, mobile/desktop) *before* any code changes. This provides the ground truth for visual verification. Capture during immediate planning.
- **`data-testid` attribute audit:** Current code has `data-testid` attributes that should be preserved. Quick grep needed to identify all instances before partials are written.
- **LinkedIn URL placeholder fix:** The current site has a known LinkedIn URL placeholder issue (identified in codebase research). The correct URL needs to be confirmed with the project owner.
- **OpenGraph image:** `opengraph.jpg` exists but should be verified against the new canonical URL — it may reference the old Replit domain.

## Sources

### Primary (HIGH confidence)
- Current codebase analysis (`.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`) — inline style patterns, component boundaries, dependency graph
- [GitHub Pages documentation](https://docs.github.com/en/pages) — static site serving, custom 404, .nojekyll, custom domains
- [Node.js built-in modules documentation](https://nodejs.org/api/) — `fs`, `path`, `url` APIs

### Secondary (MEDIUM confidence)
- [hreflang tag best practices (Ahrefs)](https://ahrefs.com/blog/hreflang-tags/) — multilingual SEO implementation
- [Better i18n Best Practices 2026](https://better-i18n.com/en/blog/i18n-best-practices-2026-complete-guide/) — per-locale static generation for SEO
- [hreflang common mistakes (hreflangs.com)](https://www.hreflangs.com/best-practices-and-common-mistakes) — bidirectional link requirements, x-default
- [gh-pages npm package documentation](https://www.npmjs.com/package/gh-pages) — deploy CLI

### Tertiary (LOW confidence)
- [Build a static site generator with Node.js](https://www.webdevdrops.com/en/build-static-site-generator-nodejs-8969ebe34b22) — template interpolation pattern reference (used as conceptual reference, not directly applicable)

---
*Research completed: 2026-06-07*
*Ready for roadmap: yes*
