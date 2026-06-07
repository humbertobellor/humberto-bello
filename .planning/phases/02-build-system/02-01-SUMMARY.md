---
phase: 02-build-system
plan: 01
subsystem: build-system
tags: [html, partials, templates, includes, static-site, dossier]

requires: []
provides:
  - HTML partials directory with 11 files for build script assembly
  - _head.html with complete SEO/OG/JSON-LD/font preload infrastructure
  - 6 content section partials (hero, experience, skills, clients, cta, footer)
  - Main template with include markers for 9-partial assembly
  - 404 template with shared wrapper partials

affects: [02-build-system Plan 02 (build script), 02-build-system Plan 03 (i18n + CSP)]

tech-stack:
  added: []
  patterns:
    - Marker replacement pattern: `<!--#include path/to/partial.html-->`
    - Shared wrapper partials with leading underscore (`_head`, `_nav`, `_footer`)
    - Section partials as self-contained HTML fragments with wk- CSS classes
    - JSX→HTML conversion: all t() → English text, all IconName → inline SVGs

key-files:
  created:
    - src/html/_head.html - Complete <head> content: SEO meta, OG, JSON-LD, font preloads, CSS placeholders, IntersectionObserver inline script
    - src/html/_nav.html - Sticky navigation bar with section links, language switcher, resume + CTA buttons
    - src/html/_footer.html - Closing wrapper (</body></html>) with i18next init placeholder
    - src/html/hero.html - Hero section: headshot picture element, name, title, stat grid, bullets, tags, badge, scroll hint
    - src/html/experience.html - Experience section: 6 job cards with company, highlight, description, tech tags
    - src/html/skills.html - Skills section: 6 category cards with inline SVG icons and item lists
    - src/html/clients.html - Clients section: 6 client cards with sector icons and category labels
    - src/html/cta.html - CTA section: availability badge, heading, 4 action buttons (email, LinkedIn, GitHub, Substack)
    - src/html/footer.html - Footer section: name, role, location with MapPin icon
    - src/html/index.html - Main template with 9 include markers for full page assembly
    - src/html/404.html - 404 template with 3 include markers + inline 404 content
  modified: []

key-decisions:
  - "Per D-05: Marker syntax `<!--#include path/to/partial.html-->` for build script assembly"
  - "Per D-02: Partials stored in src/html/ directory alongside existing src/ structure"
  - "Per D-03: English-only content hardcoded; multi-locale deferred to Phase 4"
  - "Per D-04: Leading underscore for shared/wrapper partials (_head, _nav, _footer)"
  - "Per D-09: CSS placeholder blocks with id attributes for build script injection"
  - "Per D-11: Hero image paths use /images/ prefix for static serving"
  - "All JSX→HTML conversion applied: no className, no t(), no IconName, no event handlers"

patterns-established:
  - "Marker replacement pattern: <!--#include path/to/partial.html--> for zero-dependency template assembly"
  - "JSX→HTML conversion: conditional rendering → always-rendered HTML, map loops → hardcoded items"
  - "Inline SVGs from lucide-static paths with wk-icon-* size classes"
  - "data-wk-reveal and data-delay attributes for IntersectionObserver-driven scroll animations"

requirements-completed: [STC-01]
---

# Phase 02: Build System — Plan 01 Summary

**11 HTML partial files extracted from React SPA to standalone HTML fragments — shared wrappers, content sections, and include-marker templates for static build script assembly**

## Performance

- **Duration:** 8 min
- **Started:** 2026-06-07T21:15:00Z
- **Completed:** 2026-06-07T21:23:00Z
- **Tasks:** 3
- **Files modified:** 11

## Accomplishments
- Created `src/html/` directory with 11 HTML files: 3 shared wrapper partials, 6 content section partials, 1 main template, 1 404 template
- Extracted and hardcoded all English text from `src/i18n/locales/en.json` (no `t()` calls remaining)
- Replaced all lucide-react `<IconName>` components with inline `<svg>` elements using lucide path data
- Removed all JSX syntax: `className` → `class`, no conditional rendering, no map loops, no event handlers
- Preserved all `data-*` attributes for vanilla JS behavior (IntersectionObserver, nav tracking, lang switching)
- Preserved hero animation classes (`wk-anim-fade-*`, `wk-anim-bounce-y`) and staggered delays
- Included IntersectionObserver inline script for scroll-triggered reveal animations + nav section tracking

## Task Commits

Each task was committed atomically:

1. **Task 1: Create shared wrapper partials** — `728925c` (feat)
2. **Task 2: Create content section partials** — `640884c` (feat)
3. **Task 3: Create main and 404 templates with include markers** — `c7ce44c` (feat)

## Files Created/Modified
- `src/html/_head.html` — Complete `<head>` content: SEO meta tags, Open Graph, Twitter Cards, JSON-LD structured data, font preload hints, CSS placeholder blocks, i18next vendor script placeholders, CSP placeholder, IntersectionObserver inline script (animation reveal + nav section tracking)
- `src/html/_nav.html` — Sticky navigation: brand logo, 4 section nav links (About, Skills, Experience, Clients), Resume download button, language switcher (EN/ES/DE), mobile Resume pill, "Get in Touch" CTA button
- `src/html/_footer.html` — Closing wrapper: i18next init script placeholder, `</body></html>`
- `src/html/hero.html` — Hero section: decorative panel, desktop headshot picture element (AVIF/WebP srcset), mobile headshot, name with accent, subtitle/title, stat grid (4 stats), 3 bullet points, 9 compliance/tech tags, credential badge, bounce-y scroll hint chevron
- `src/html/experience.html` — Experience section: double-rule header, 6 job cards (Equifax, Medical Device, RAG & Agentic, Verizon, FISERV, Fifth Third Bank) with rounded building icon, company, highlight title, description text, and tech tag lists (10 tags max per card)
- `src/html/skills.html` — Skills section: 6 category cards (AI & Emerging Tech, Cloud & Infrastructure, Engineering & Architecture, Security & Compliance, Leadership & Delivery, Digital Experiences) with inline SVG icons, category titles, and detail bullet lists (4-8 items each)
- `src/html/clients.html` — Clients section: 6 client cards (Equifax, Fifth Third Bank, FISERV, Verizon, J&J, Dollar General) with inline SVG sector icons, company names, and category labels
- `src/html/cta.html` — CTA section: sunken background, lightning badge, "Let's Build Something Remarkable" heading, subtitle text, 4 action buttons (Send a Message with arrow, LinkedIn Profile, GitHub, Substack)
- `src/html/footer.html` — Footer section: name, role pipe separator, location with MapPin icon
- `src/html/index.html` — Main template: 9 `<!--#include-->` markers assembling _head, _nav, 6 sections, and _footer
- `src/html/404.html` — 404 template: 3 `<!--#include-->` markers for shared wrappers + inline 404 content (Page Not Found heading, subtitle, Back to Home link)

## Decisions Made
- Followed all Phase 2 context decisions (D-01 through D-18): marker pattern, partial naming, file layout, image paths, CSS injection placeholders
- English text hardcoded per D-03 (multi-locale deferred to Phase 4)
- Image paths use `/images/` prefix per D-11 (build script rewrites for `BASE_PATH` in Plan 02)
- CSS placeholder blocks with `id` attributes per D-09 (build script populates in Plan 02)
- IntersectionObserver script covers both animation reveal (D-16 through D-20) and nav section tracking (D-19)

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

The following intentional placeholders exist for downstream plans:

| Stub | File | Lines | Plan |
|------|------|-------|------|
| CSS `<style>` blocks with `/* injected by build script */` | `_head.html` | 99-101 | Plan 02 replaces with CSS file contents |
| i18next vendor `<script>` tags (min.js files) | `_head.html` | 103-104 | Plan 03 copies from node_modules |
| CSP `<meta>` tag with empty `content` | `_head.html` | 106 | Plan 03 populates with D-15 policy |
| i18next init script | `_footer.html` | 2 | Plan 03 adds init code |
| Language switcher `data-i18n-switch` attributes | `_nav.html` | 18-20 | Plan 03 enables with event delegation |

## Issues Encountered
None.

## Threat Surface Scan

No new security-relevant surface introduced. All include markers reference fixed local paths only (T-02-01 mitigated). Inline SVG paths are from lucide-static, a controlled dependency (T-02-02 accepted).

## Next Phase Readiness
- **Plan 02 (Build Script)**: All 11 partials ready for assembly. Build script reads `src/html/` directory, replaces markers in `index.html` and `404.html`, injects CSS from `src/styles/` into placeholder `<style>` blocks.
- **Plan 03 (i18n + CSP)**: Placeholder infrastructure in place: i18next vendor script tags, empty CSP meta, i18next init script block, `data-i18n-switch` attributes on language buttons.

---
*Phase: 02-build-system*
*Plan: 01*
*Completed: 2026-06-07*
