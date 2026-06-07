# Phase 1: CSS Architecture — Technical Research

**Phase:** 1 — CSS Architecture
**Researched:** 2026-06-07
**Confidence:** HIGH

## Overview

Refactor the existing React 19/Vite/TypeScript SPA dossier (home.tsx: 1279 lines) into hand-authored CSS + vanilla JS. Extract 86 inline `style={}` objects, 14 `onMouseEnter`/`onMouseLeave` handlers, ~22 Tailwind utility-class elements, and 22 lucide-react icon imports into: (a) a consolidated Wolknitive tokens file, (b) a new hand-authored base.css with responsive breakpoints, (c) an animations.css with `@keyframes` + IntersectionObserver trigger classes, and (d) inline SVGs. Dark mode (`prefers-color-scheme`) and print stylesheets are new additive features.

## What Needs Research

- CSS class extraction strategy from 86 inline `style={}` objects
- Converting `onMouseEnter`/`onMouseLeave` (14 handlers) to CSS `:hover`
- Replacing framer-motion `FadeInSection` with IntersectionObserver
- Converting 22 lucide-react icon imports to inline SVGs
- Replacing Tailwind responsive utilities with CSS media queries
- Authoring dark mode and print stylesheets

## Research Domain

### Is This a Standard Problem?
**YES** — CSS extraction, responsive grid replacement, and IntersectionObserver for scroll animations are well-documented, mature patterns. No novel algorithms or frameworks needed.

### What Makes This Hard?
- **Completeness:** 86 inline style objects must be individually audited; missed extractions cause visual regressions
- **Dynamic behavior:** ~14 event handlers modify styles at runtime via `e.currentTarget.style.*` — these must be converted to CSS `:hover` pseudoclasses, not naively extracted
- **Staggered delays:** Framer-motion's `delay` prop maps to `data-delay` attributes or `nth-child` selectors on grid children
- **Visual fidelity:** Must render identically — no pixel-perfect requirement per user ("same layout, cleaner code"), but visual regression must be near-zero

## Domain Knowledge

### CSS Extraction Strategy

The 86 inline `style={}` objects in home.tsx follow these patterns:

| Pattern | Count | Approach |
|---------|-------|----------|
| Static `var(--x)` references | ~60 | Direct extraction to `.wk-*` CSS class |
| Ternary expressions | ~8 | Extract branches to individual classes (`.active`, `.wk-card-plum`, etc.) |
| Template literal values | ~5 | Pre-compute; no runtime JS needed |
| `i * 0.07s` animation delays | ~4 | Convert to `data-delay` attribute on HTML elements |
| `onMouseEnter/Leave` color swaps | ~9 | Pure CSS `:hover` with `transition` |

**Key insight from UI-SPEC:** All spacing, color, typography references already use CSS custom properties as `var(--x)` strings. Extraction is syntax-only — the values are already CSS-aware.

### Converting Mouse Handlers to CSS

Current patterns in home.tsx:

1. **Nav link hover** (line 303/307): Changes color from V500 to TEAL on hover → `.wk-nav-link:hover { color: var(--teal-500); transition: color 0.2s; }`
2. **CTA button hover** (line 397/398): Background shifts from TEAL to TEAL_6 → `.wk-btn-cta { background: var(--teal-500); transition: background-color 0.2s; } .wk-btn-cta:hover { background: var(--teal-600); }`
3. **Client card hover** (lines 1098-1196): Multiple card instances with background/border color swaps → `.wk-card-client:hover { background: var(--vellum-100); transition: background-color 0.2s; }`
4. **Active section nav** tracking (line ~960): Uses `activeSection === id ? TEAL : V500` → `.wk-nav-link.active { color: var(--teal-500); }`

**Total CSS replacements:** ~14 lines of CSS, zero JS.

### IntersectionObserver Replacements

**Framer-motion behavior (FadeIn.tsx):**
- Initial: `opacity: 0, y: 24px`
- On scroll-into-view (once, margin -60px): `opacity: 1, y: 0`
- Duration: 0.55s, easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Per-element delay via `delay` prop
- Currently used on ~5 FadeInSection instances (skill cards staggered)

**Replacement mechanism:**
- Single inline `<script>` in `<head>` (~25 lines)
- `data-wk-reveal` attribute marks elements for observation
- `data-delay` attribute provides per-element stagger (skills grid: index * 0.07s)
- CSS class `.wk-reveal` has initial hidden state
- Observer adds `.is-visible` class on intersection

### Tailwind → CSS Media Queries

All Tailwind responsive patterns in home.tsx:

| Pattern | Replace With |
|---------|-------------|
| `hidden md:flex` | `.wk-nav-links { display: none; } @media (min-width: 768px) { .wk-nav-links { display: flex; } }` |
| `md:hidden` | `.wk-nav-toggle { display: flex; } @media (min-width: 768px) { .wk-nav-toggle { display: none; } }` |
| `hidden md:inline` | `.wk-btn-text-desktop { display: none; } @media (min-width: 768px) { .wk-btn-text-desktop { display: inline; } }` |
| `w-full md:w-1/2` | `.wk-hero-content { width: 100%; } @media (min-width: 768px) { .wk-hero-content { width: 50%; } }` |
| `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5` | `.wk-grid-skills, .wk-grid-experience { display: grid; grid-template-columns: 1fr; gap: 1.25rem; } @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); } @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }` |
| `grid grid-cols-2 md:grid-cols-3 gap-4 mb-16` | `.wk-grid-clients { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 4rem; } @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }` |
| `md:flex-row md:justify-between md:text-left` | `.wk-footer { text-align: center; } @media (min-width: 768px) { .wk-footer { flex-direction: row; justify-content: space-between; text-align: left; } }` |

### lucide-react → Inline SVGs

22 icon imports, all following same pattern:
```tsx
import { MapPin, Shield, Cloud, Brain, Users, Code2, Lock, Globe, ChevronDown, Building2, ArrowRight, BarChart2, Landmark, CreditCard, Smartphone, Activity, ShoppingCart, Zap } from "lucide-react";
```

Each icon maps to `<IconName size={14|16|20|24} />` in JSX.

**Replacement:** Inline `<svg viewBox="0 0 24 24" ...>` elements with lucide's exact path `d` attributes. Three size classes via CSS:
- `.wk-icon-sm` → `width: 16px; height: 16px;`
- `.wk-icon-md` → `width: 20px; height: 20px;`
- `.wk-icon-lg` → `width: 24px; height: 24px;`

Stroke `currentColor` for theme awareness. Hover transitions via parent CSS `:hover`.

### Dark Mode (`@media prefers-color-scheme: dark`)

New feature — not present in current codebase beyond a stub `@custom-variant dark`. Must author:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #14110B;           /* Ink */
    --bg-elevated: #2E261A;  /* Vellum-700 */
    --bg-sunken: #1C1710;    /* Vellum-800 */
    --fg-1: #FAF6EC;         /* Vellum-50 */
    --fg-2: #E7DCC0;         /* Vellum-200 */
    --fg-3: #CFBE96;         /* Vellum-300 */
    --fg-4: #9C8A64;         /* Vellum-400 */
    --accent: #5F8C86;       /* Teal-300 */
    --accent-hover: #34736B; /* Teal-400 */
    --rule: #6B5C3E;         /* Vellum-500 */
    --rule-soft: #9C8A64;    /* Vellum-400 */
    --shadow-1: 0 1px 0 rgba(250,246,236,0.05), 0 1px 2px rgba(0,0,0,0.3);
    /* etc */
  }
}
```

### Print Stylesheet

```css
@media print {
  .wk-nav, .wk-cta-section, .wk-scroll-hint, .wk-hero-panel { display: none; }
  .wk-grid-3col { grid-template-columns: 1fr; }
  .wk-section { page-break-inside: avoid; break-inside: avoid; }
  .wk-card { box-shadow: none; border: 1px solid #ccc; }
  /* Preserve brand colors */
  body { background: white; color: black; }
}
```

## Verification Strategy (Nyquist)

### Validation Architecture

**Dimension 1 — Visual Fidelity:**
- Compare screenshots of current dev server vs styled version for all 7 sections
- Verify each of the 86 extracted inline styles maps to a CSS class with identical computed values

**Dimension 2 — CSS Completeness:**
- `wolknitive-tokens.css` contains all custom properties (colors, spacings, radii, shadows, fonts)
- `base.css` contains section layouts, card patterns, nav, buttons, tags, footer, responsive breakpoints, dark mode, print styles
- `animations.css` contains all `@keyframes` and `.wk-anim-*` classes

**Dimension 3 — Zero Framework Dependencies:**
- No `import` from framer-motion in source
- No `import` from lucide-react in source
- No `@tailwind` directives in CSS
- No `style={{}}` objects remaining in partials

**Dimension 4 — Interaction Parity:**
- Every `onMouseEnter`/`onMouseLeave` handler has a CSS `:hover` equivalent
- Nav active tracking works via IntersectionObserver + `.active` class
- All scroll-triggered animations fire on first intersection

**Dimension 5 — Dark Mode:**
- `@media (prefers-color-scheme: dark)` block exists in base.css
- Variables override all colors per CONTEXT.md D-01 through D-07

**Dimension 6 — Print:**
- `@media print` block exists in base.css
- Hides nav, CTA, scroll hint, hero panel
- Grids collapse to single column

### Acceptance Test Commands

```bash
# Typecheck (no framework errors)
npm run typecheck

# Visual verification (manual)
# Start dev server, compare each section against current live site

# CSS audit
grep -c "style={" src/pages/home.tsx  # should be 0 after extraction
grep -c "onMouseEnter\|onMouseLeave" src/pages/home.tsx  # should be 0
grep -c "framer-motion" package.json  # should be 0
grep -c "lucide-react" package.json   # should be 0
grep -c "@tailwind" src/index.css     # should be 0
```

## Implementation Patterns

### CSS Class Naming (wk- prefix)

| Class | Purpose | Derived From |
|-------|---------|-------------|
| `.wk-container` | Max-width 72rem, centered, padding 1.5rem | D-11 |
| `.wk-section` | Section padding (6rem 1.5rem) | Layout contract |
| `.wk-section-header` | Eyebrow + heading + subtitle | Repeated pattern |
| `.wk-label` | Section eyebrow: UI font, 12px, 600, 0.1em LS, uppercase | Existing |
| `.wk-eyebrow` | Bogart italic teal label | Existing |
| `.wk-rule` | Editorial double-rule: 1px + 0.5px | Existing |
| `.wk-card` | Base card: bg, border, radius, shadow, padding | Repeated pattern |
| `.wk-card-skills` | Skills variant (icon + title + items) | D-10 |
| `.wk-card-experience` | Experience variant (company + tags) | D-10 |
| `.wk-card-client` | Client variant (icon + name + category) | D-10 |
| `.wk-grid-skills` | 1→2→3 column grid, 20px gap | D-10 |
| `.wk-grid-experience` | 1→2→3 column grid, 20px gap | D-10 |
| `.wk-grid-clients` | 2→3 column grid, 16px gap | D-10 |
| `.wk-nav-link` | Nav anchor styling | Existing |
| `.wk-btn-cta` | Teal CTA button | Existing |
| `.wk-btn-outline` | Border-only button (LinkedIn, GitHub) | Existing |
| `.wk-tag` | Hairline pill badge | Existing |
| `.wk-icon-sm/md/lg` | Inline SVG size classes (16/20/24px) | D-23 |
| `.wk-hero-content` | Hero text column | Layout contract |
| `.wk-hero-photo` | Hero headshot column | Layout contract |
| `.wk-stat-card` | Stat display card | Layout contract |
| `.wk-footer` | Footer layout | Layout contract |
| `.wk-hero-panel` | Decorative background panel | Layout contract |
| `.wk-anim-fade-left` | Hero animation: x -20px→0, 1s | Existing (preserve) |
| `.wk-anim-fade-right` | Hero animation: x 30px→0, 0.85s | Existing (preserve) |
| `.wk-anim-fade-scale` | Hero animation: scale 0.94→1, 0.7s | Existing (preserve) |
| `.wk-anim-fade-up` | Hero animation: y 12px→0, 0.45s | Existing (preserve) |
| `.wk-anim-fade-left-sm` | Hero animation: x -12px→0, 0.45s | Existing (preserve) |
| `.wk-anim-fade-up-sm` | Hero animation: y 8px→0, 0.45s | Existing (preserve) |
| `.wk-anim-bounce-y` | Scroll chevron: y 0→4→0, 2.4s infinite | Existing (preserve) |
| `.wk-reveal` | Scroll-trigger: opacity 0, y 24px | Replacement for framer-motion |
| `.wk-reveal.is-visible` | Scroll-trigger: opacity 1, y 0 | Replacement for framer-motion |

### Inline SVG Icon Paths

Each lucide icon has a canonical SVG path. For Phase 1 research, the paths can be sourced from [lucide.dev/icons](https://lucide.dev/icons/) or the installed `node_modules/lucide-static/`. The 22 icons needed:

| Icon | lucide Path ID | Size | Usage |
|------|----------------|------|-------|
| MapPin | `map-pin` | 16px | Hero stats |
| Shield | `shield` | 20px | Skills security |
| Cloud | `cloud` | 20px | Skills cloud |
| Brain | `brain` | 20px | Skills AI |
| Users | `users` | 20px | Skills leadership |
| Code2 | `code-2` | 20px | Skills engineering |
| Lock | `lock` | 20px | Skills security |
| Globe | `globe` | 20px | Skills stats |
| ChevronDown | `chevron-down` | 14px | Scroll hint/nav |
| Building2 | `building-2` | 20px | Skills digital |
| ArrowRight | `arrow-right` | 15px | CTA buttons |
| BarChart3 | `bar-chart-3` | 24px | Clients fin services |
| Landmark | `landmark` | 24px | Clients banking |
| CreditCard | `credit-card` | 24px | Clients fintech |
| Smartphone | `smartphone` | 24px | Clients telecom |
| Activity | `activity` | 24px | Clients healthtech |
| ShoppingCart | `shopping-cart` | 24px | Clients retail |
| Zap | `zap` | 16px | Skill bullets |

All use `stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"`.

## Common Pitfalls

1. **Missing hover states**: 14 `onMouseEnter`/`onMouseLeave` handlers exist; if any is not converted to CSS `:hover`, the element loses its interactive state — Mitigation: grep for remaining `onMouseEnter`/`onMouseLeave` after extraction
2. **Staggered animation loss**: Framer-motion's per-element delays (skill cards: `i * 0.07s`) must be preserved via `data-delay` attributes — Mitigation: count the current staggered instances (5 FadeInSection calls) and verify replacement
3. **Dark mode visibility**: Dark mode is NEW — must not break existing light mode. All color overrides go in a `@media` block — Mitigation: test both `prefers-color-scheme: light` and `dark` in dev tools
4. **SVG sizing mismatch**: lucide-react components accept `size` prop (14-24px); inline SVGs must match → use CSS `.wk-icon-*` size classes with exact px values
5. **Responsive regression**: Tailwind's responsive utilities are replaced by CSS media queries — every responsive breakpoint must have an exact CSS equivalent — Mitigation: test at 375px, 768px, 1024px widths

## Sources

- Current codebase: `src/pages/home.tsx` (1279 lines), `src/components/FadeIn.tsx`, `src/styles/wolknitive-tokens.css`, `src/index.css`
- CONTEXT.md: 25 locked decisions (D-01 through D-25) from discuss-phase
- UI-SPEC.md: Design contract with spacing, typography, color, layout, animations, icons, interactions
- `.planning/research/ARCHITECTURE.md`: Target architecture with CSS file breakdown, inline style migration patterns, and responsive strategy
- `.planning/research/PITFALLS.md`: Critical pitfalls for CSS extraction and hover handler conversion
- `.planning/research/FEATURES.md`: Feature landscape showing D-25 decision provenance
- [lucide.dev](https://lucide.dev/icons/): SVG icon source for 22 lucide icons
- [MDN: IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver): Scroll-triggered animation API
- [MDN: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme): Dark mode media query

---

*Research completed: 2026-06-07*
*Ready for planning: yes*
