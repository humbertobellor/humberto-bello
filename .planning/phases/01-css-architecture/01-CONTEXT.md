# Phase 1: CSS Architecture - Context

**Gathered:** 2026-06-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Extract all inline styles (86 `style={}` objects), Tailwind utilities, framer-motion animations, and lucide-react icons from the React SPA into hand-authored CSS classes, vanilla JS, and inline SVGs. Consolidate Wolknitive design tokens into `wolknitive-tokens.css` as the single source of truth. Author dark mode (`prefers-color-scheme`) and print stylesheets. The 7 content sections must render visually identical on the dev server.

No new capabilities — refactor only. New features belong in future phases.

</domain>

<decisions>
## Implementation Decisions

### Dark Mode Palette
- **D-01:** Page background: Ink (#14110B)
- **D-02:** Card/surface backgrounds: Vellum-700 (#2E261A) — 2-step lift from bg
- **D-03:** Accent elements (CTAs, active nav links, section eyebrows): Teal-300 (#5F8C86)
- **D-04:** Text colors: warm inverted — primary vellum-50 (#FAF6EC), secondary vellum-200 (#E7DCC0), muted vellum-300 (#CFBE96)
- **D-05:** Rule colors: vellum-500 (#6B5C3E) for standard rules, vellum-400 (#9C8A64) for soft rules
- **D-06:** Dark mode triggered via `@media (prefers-color-scheme: dark)` — uses a `@media` block in `base.css`
- **D-07:** Hover states on dark: accent hover = Teal-400 (#34736B), interactive elements use `transition: color` and `transition: background-color`

### CSS File Organization
- **D-08:** Three-file split:
  - `wolknitive-tokens.css` — design tokens (colors, typography, spacing, shadows, radii, breakpoints) + `@font-face` declarations
  - `base.css` — CSS reset, body defaults, `.wk-container`, section layout, grid classes, dark mode `@media` block, print `@media` block
  - `animations.css` — all `@keyframes`, IntersectionObserver trigger classes, scroll-triggered animation classes
- **D-09:** Class naming: `wk-` prefix for all dossier-specific classes (e.g., `wk-container`, `wk-grid-skills`, `wk-card`, `wk-label`)
- **D-10:** Grids: component-specific grid classes (`.wk-grid-skills`, `.wk-grid-experience`, `.wk-grid-clients`) with explicit `grid-template-columns` and responsive breakpoint overrides — not generic utility grid classes
- **D-11:** Container: single `.wk-container` class (`max-width: 72rem`, `margin: 0 auto`, `padding-inline: 1.5rem`) applied to each section

### Print Stylesheet
- **D-12:** Hidden via `display: none`: sticky nav, CTA section, scroll hint chevron, footer language switcher, hero decorative background panel
- **D-13:** Layout: all grids collapse to single column
- **D-14:** Fonts: use same self-hosted webfonts (Bogart, Inter Tight) as screen — `@font-face` already loaded, print `@media` block just overrides layout
- **D-15:** Colors: preserve Wolknitive brand colors (vellum backgrounds, teal accents) — not black/white

### IntersectionObserver (replacing framer-motion)
- **D-16:** Vanilla IntersectionObserver code lives in an inline `<script>` block in the HTML `<head>` — no separate `.js` file
- **D-17:** Staggered animation delays via `data-delay` attributes on individual elements (e.g., `data-delay="0.07s"`, `data-delay="0.14s"`) — builder generates these values in the HTML partials
- **D-18:** Animations fire once on first scroll-into-view (`once: true` behavior) — no replay on re-entry
- **D-19:** Nav scroll tracking uses a dedicated IntersectionObserver instance alongside the animation observer — concerns separated
- **D-20:** Animation CSS classes: `.wk-anim-scroll-in` with existing `wkFadeSlideUp` keyframes (opacity 0→1, y: 24px→0, 0.55s, `cubic-bezier(0.22, 1, 0.36, 1)`)
- **D-21:** Existing hero entrance CSS animations (`.wk-anim-fade-left`, `.wk-anim-fade-right`, etc.) are preserved as-is — they're already CSS-only and not using framer-motion

### Inline SVG Icons (replacing lucide-react)
- **D-22:** SVG path data copied from lucide source (lucide.dev or lucide GitHub) for exact visual match
- **D-23:** Three size classes: `.wk-icon-sm` (16×16), `.wk-icon-md` (20×20), `.wk-icon-lg` (24×24) — applied via CSS `width`/`height` on the `<svg>` element
- **D-24:** SVG `<svg>` elements inlined directly at each usage location in the HTML partials — no `<defs>`/`<use>` sprite
- **D-25:** Icons use `currentColor` on SVG `stroke` attributes, inherit color from parent element; hover color transitions handled via CSS `:hover` on the parent with `transition: color`

### OpenCode's Discretion
- CSS class composition for specific elements (which classes on hero, nav, footer etc.) — follow existing visual structure from 01-UI-SPEC.md
- Keyframe timing values beyond what's specified — maintain existing durations from current CSS
- Spacing token values not explicitly discussed — use effective values from 01-UI-SPEC.md spacing scale
- Inline SVG `<svg>` wrapper element choice (`<span>`, `<i>`, or direct) — pick what's simplest

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System
- `.planning/phases/01-css-architecture/01-UI-SPEC.md` — UI design contract with full design system documentation, spacing scale, typography, color palette, animation details, icon inventory, and layout specs
- `src/styles/wolknitive-tokens.css` — current design tokens: `@font-face`, color custom properties, spacing, shadows, radii, type scale
- `src/index.css` — current global CSS: Tailwind v4 directives, keyframe definitions, dark variant stub

### Source Files to Refactor
- `src/pages/home.tsx` — 1279-line monolithic source of all inline styles, Tailwind classes, icon imports, animation wrappers, and JSX structure to extract from
- `src/components/FadeIn.tsx` — framer-motion scroll reveal wrapper to replace with IntersectionObserver

### Assets
- `public/fonts/` — 12 self-hosted `.woff2` font files (Bogart, Inter Tight, JetBrains Mono, Newsreader)

### Requirements
- `.planning/REQUIREMENTS.md` — Phase 1 requirements: DEP-04, DEP-05, DEP-09, INF-05, INF-06, QLT-01, QLT-02, QLT-03, STC-02, VIZ-01 through VIZ-07

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `wolknitive-tokens.css` (187 lines) — fully defined design token system with `@font-face`, color scale, type scale, shadow tokens, radius tokens. This is THE single source to keep and extend. All custom properties are already defined as `var(--x)` references.
- `src/index.css:52-88` — 7 existing `@keyframes` animations (wkFadeSlideLeft, wkFadeSlideRight, wkFadeScaleIn, wkFadeSlideUp, wkFadeSlideLeftSm, wkFadeSlideUpSm, wkBounceY) with existing animation classes. These must be preserved and moved to `animations.css`.
- Section layout structure in home.tsx: all sections follow consistent pattern (section > .wk-container > header + content). This pattern maps directly to CSS classes.

### Established Patterns
- Custom component naming uses `Wk*` prefix in TSX (WkRule, WkLabelSection). CSS follows `wk-` prefix pattern for utility/atomic classes — extend this to all extracted classes.
- All spacing, color, typography references use CSS custom properties as `var(--x)` strings in inline styles. The extraction target is straightforward: move `var(--x)` from JSX `style={{}}` to CSS class `property: var(--x)`.

### Integration Points
- Animations currently split: hero entrance (CSS in index.css) vs scroll-triggered (framer-motion in FadeIn.tsx). The integration point is the IntersectionObserver inline script that bridges scroll events → CSS class addition.
- Nav scroll tracking (home.tsx:163-200) currently uses React state + IntersectionObserver. Must be extracted to the same inline script.
- 18 icon imports at `src/pages/home.tsx:4-23` — each `import { IconName } from "lucide-react"` maps to an `<IconName>` JSX element. Extraction means replacing each with `<svg>...</svg>` inline.

</code_context>

<specifics>
## Specific Ideas

No specific references beyond the UI-SPEC design contract — user's vision is to preserve the existing visual identity faithfully while stripping framework dependencies.

Key constraint from discussion: "same layout, cleaner code" — not pixel-perfect recreation but visually identical to the current site. Dark mode and print are additive improvements, not visual changes.

</specifics>

<deferred>
## Deferred Ideas

- **CSS file organization (unselected areas):** print stylesheet approach, IntersectionObserver details, and icon sourcing were all discussed and decided. No further deferred ideas.

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-css-architecture*
*Context gathered: 2026-06-07*
