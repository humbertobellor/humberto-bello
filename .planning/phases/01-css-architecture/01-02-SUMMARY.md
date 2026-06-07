---
phase: 01-css-architecture
plan: 02
subsystem: home.tsx
tags: [css-architecture, inline-styles, icons, animations, dependencies]
requires: [01-css-architecture-01]
provides: [home.tsx-wk-cleaned, wolknitive-base-extensions]
affects: [package.json, FadeIn.tsx]
tech-stack:
  added: []
  removed: [framer-motion, lucide-react]
key-files:
  created: []
  modified:
    - src/pages/home.tsx
    - src/components/FadeIn.tsx
    - src/styles/wolknitive-base.css
    - package.json
decisions:
  - "Inline SVGs via SvgIcon component for dynamically-resolved icons (skill/client arrays)"
  - "Direct inline <svg> elements for statically-placed icons (MapPin, Shield, ChevronDown, etc.)"
  - "FadeInSection uses IntersectionObserver with wk-reveal CSS class (replaces framer-motion)"
  - "Nav link active state uses data-active attribute instead of navLinkStyle function"
  - "Language switcher uses data-active for dynamic styling instead of inline styles"
metrics:
  duration: ""
  completed: "2026-06-07"
---

# Phase 01 Plan 02: Replace inline styles, Tailwind, framer-motion, lucide-react, and event handlers

Replaced all remaining inline styles, onMouseEnter/onMouseLeave handlers, framer-motion animations, lucide-react icons, and TS color constants in home.tsx with hand-authored CSS classes (`wk-*`), inline SVGs, and IntersectionObserver for scroll-reveal animations. Removed framer-motion and lucide-react dependencies.

## Key Results

- **home.tsx:** 1072 → 723 lines (33% reduction)
- **Inline styles:** 86 → 9 (only dynamic animation delays remain)
- **Event handlers:** 14 → 0 (all replaced with CSS `:hover`)
- **framer-motion:** removed (LazyFadeIn → IntersectionObserver-based `wk-reveal`)
- **lucide-react:** removed (22 icons → inline SVGs + SvgIcon component)
- **TS color constants:** removed (INK, TEAL, V50–V700 → CSS var() references)
- **Package.json:** removed `framer-motion` and `lucide-react` dependencies
- **CSS classes added:** ~50 new `wk-*` classes in wolknitive-base.css covering card internals, icon containers, bullet lists, CTA banners, footer parts, language switcher, etc.

## Task Execution

### Task 1 — Replace inline styles and Tailwind with CSS classes (committed as 992a5a1)

Replaced all inline `style={{}}` objects and Tailwind utility classes with `wk-*` CSS classes. Covered section wrappers, grids, cards, nav, hero layout, buttons, tags, and footer. Left ~66 inner-card inline styles for Task 2.

### Task 2 — Replace event handlers, framer-motion, icons, and color constants (committed as 94c61a3)

**2a. Color constants removed:** Deleted `INK`, `TEAL`, `TEAL_6`, `V50`–`V700` declaration block. All references replaced with CSS var() strings embedded in CSS classes.

**2b. Event handlers removed:** All 14 `onMouseEnter`/`onMouseLeave` handlers removed. CSS `:hover` pseudo-classes in wolknitive-base.css handle all hover interactions (`.wk-btn-cta:hover`, `.wk-btn-outline:hover`, `.wk-card-client:hover`, `.wk-nav-link:hover`, `.wk-card:hover`).

**2c. framer-motion replaced:** `LazyFadeIn` lazy import and `import("../components/FadeIn")` removed. `FadeInSection` reimplemented as local function using `IntersectionObserver` + `useRef` to add `.is-visible` class to `wk-reveal` elements when they scroll into view. `FadeIn.tsx` gutted to a single comment line.

**2d. lucide-react replaced:** Import block removed. Dynamically-resolved icons (skillCategories, clientIcons) use a new `SvgIcon` component that maps string names to JSX SVG paths. Statically-used icons (MapPin, Shield, Building2, ChevronDown, ArrowRight, Zap, etc.) have direct inline `<svg>` elements at each usage point.

**2e. package.json cleaned:** Both `framer-motion` and `lucide-react` lines removed from `devDependencies`.

**2f. Imports cleaned:** Removed `lazy`, `Suspense`, all lucide-react imports, FadeIn component import. Added `useRef`.

**2g. Verification:** All acceptance criteria pass.

### CSS Extension Classes Added

Added ~50 new classes to wolknitive-base.css:
- Nav: `.wk-nav-logo`, `[data-active]` selectors for nav links
- Language switcher: `.wk-lang-switcher`, `.wk-lang-btn`
- Hero typography: `.wk-hero-heading`, `.wk-hero-name-accent`, `.wk-hero-subtitle`
- Stat cards inner: `.wk-stat-value`, `.wk-stat-label`
- Bullet list: `.wk-bullet-list`, `.wk-bullet-row`, `.wk-bullet-dot`, `.wk-bullet-text`
- Credential badge: `.wk-cred-badge`
- Scroll hint: `.wk-scroll-hint`
- Icon boxes: `.wk-icon-box`, `.wk-icon-box-sm`, `.wk-icon-box-lg`
- Card inner: `.wk-card-header-lg/sm`, `.wk-card-title`, `.wk-card-eyebrow`, `.wk-card-rule`, `.wk-card-text`
- Dot list: `.wk-dot-list`, `.wk-dot-item`, `.wk-dot-marker`
- Client card: `.wk-card-client-name`, `.wk-card-category`
- CTA banner: `.wk-cta-card`, `.wk-cta-accent`, `.wk-cta-pill`, `.wk-cta-heading`, `.wk-cta-text`, `.wk-btn-group`
- Button extras: `.wk-btn-cta-shadow`, `.wk-btn-outline-dark`, `.wk-btn-uppercase`
- Footer: `.wk-footer-inner`, `.wk-footer-name`, `.wk-footer-sep`, `.wk-footer-role`, `.wk-footer-location`
- Hero extras: `.wk-hero-fade`, `.wk-hero-overlay`, `.wk-mobile-headshot-*`
- Utilities: `.wk-flex-row`

## Deviations from Plan

### Rule 2 — Auto-added missing CSS classes

- **Found during:** Task 2
- **Issue:** Plan's Task 1 only covered outer structure; ~66 inner-card inline styles remained for card-internal patterns (icon containers, bullet dots, list items, headings, etc.) that had no corresponding CSS classes in the Plan 01 output.
- **Fix:** Added ~50 new `wk-*` classes to `wolknitive-base.css` covering all repeated inner-content patterns. This was required to achieve the plan's goal of zero (or near-zero) inline styles.
- **Files:** `src/styles/wolknitive-base.css`
- **Commit:** 94c61a3

### Rule 2 — Auto-replaced framer-motion FadeInSection with IntersectionObserver

- **Found during:** Task 2c
- **Issue:** The plan's wrapper template using `className="wk-reveal"` with no IntersectionObserver would render all scroll-reveal content invisible (`.wk-reveal` has `opacity: 0` by default).
- **Fix:** Added `useRef` + `IntersectionObserver` to `FadeInSection` to add `.is-visible` class when elements scroll into view. This is zero-dependency and preserves the CSS-based reveal approach.
- **Files:** `src/pages/home.tsx`
- **Commit:** 94c61a3

## Verification Results

| Criteria | Result |
|----------|--------|
| `onMouseEnter\|onMouseLeave` count | 0 ✓ |
| `lucide-react` imports | 0 ✓ |
| `framer-motion` imports (functional) | 0 ✓ |
| `style={}` inline styles | 9 (all dynamic delays) ✓ |
| `framer-motion` in package.json | 0 ✓ |
| `lucide-react` in package.json | 0 ✓ |
| TS color constants (INK, TEAL, V50, etc.) | 0 ✓ |
| `import.*FadeIn` from components | 0 ✓ |
| `lazy`/`Suspense` imports | 0 ✓ |

## Success Criteria

- [x] home.tsx has near-zero inline `style={}` objects (9 remaining, all dynamic delays)
- [x] home.tsx has zero onMouseEnter/onMouseLeave handlers
- [x] home.tsx has zero lucide-react imports
- [x] home.tsx has zero framer-motion imports
- [x] home.tsx has zero TS color constants (INK, TEAL, etc.)
- [x] home.tsx uses wk- CSS classes for all styling
- [x] package.json has no framer-motion or lucide-react dependencies
- [x] All hover interactions use CSS :hover

## Self-Check: PASSED

- `src/pages/home.tsx` exists at 723 lines
- `src/components/FadeIn.tsx` exists at 1 line (gutted)
- `src/styles/wolknitive-base.css` exists with all new classes
- `package.json` exists with no framer-motion or lucide-react
- Commit `94c61a3` verified
- All grep-based acceptance criteria confirmed
