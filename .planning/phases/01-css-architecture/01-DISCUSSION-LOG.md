# Phase 1: CSS Architecture - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-07
**Phase:** 01-css-architecture
**Areas discussed:** Dark mode palette, CSS file organization, Print stylesheet, IntersectionObserver, Inline SVG icons

---

## Dark Mode Palette

| Option | Description | Selected |
|--------|-------------|----------|
| Vellum-800 (#1C1710) | Warm dark brown, keeps brand character | |
| Ink (#14110B) | Darker, closer to pure black | ✓ |
| Vellum-700 (#2E261A) | 2-step lift from ink for card surfaces | ✓ |
| Vellum-800 (#1C1710) | Tighter lift, barely distinguishable | |
| Teal-300 (#5F8C86) | Clear contrast on dark bg, still reads as teal | ✓ |
| Teal-200 (#95B5B0) | Lighter, more luminous | |
| Keep teal-500 with white text | Accent stays same, text adapts | |
| Warm inverted (UI-SPEC direction) | Primary vellum-50, secondary vellum-200, rules vellum-500 | ✓ |
| Crisp white-based | Primary white, secondary vellum-100 | |
| Muted | Primary vellum-50, secondary vellum-300 | |

**User's choice:** Ink background, Vellum-700 surfaces, Teal-300 accents, warm inverted text
**Notes:** Followed UI-SPEC recommendation direction for text colors. No further dark mode questions.

## CSS File Organization

| Option | Description | Selected |
|--------|-------------|----------|
| 3 files: tokens + base + animations | Separates concerns clearly | ✓ |
| Single file (style.css) | Simpler but larger | |
| 2 files: tokens + style | Matches current structure | |
| wk- prefix | Consistent with existing patterns | ✓ |
| No prefix — bare class names | Simpler but risks conflicts | |
| BEM (block__element--modifier) | Explicit hierarchy, longer names | |
| Component-specific grid classes | Explicit, easy to maintain | ✓ |
| Generic grid utility classes | Reusable but less semantic | |
| Single .wk-container class | DRY, consistent | ✓ |
| Per-section padding | More explicit, less abstraction | |

**User's choice:** 3-file split, wk- prefix, component-specific grid classes, single container class
**Notes:** No further CSS organization questions.

## Print Stylesheet

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal — hide nav, CTA, decorative | Stripped-down linear layout | ✓ |
| Full page — print all sections as-is | Simple, no section-specific logic | |
| Ultra-minimal — text only | Hide headshot and client section | |
| Single column | Easier to read on paper | ✓ |
| Keep multi-column | Compact but risk awkward breaks | |
| Use webfonts (same fonts as screen) | Same look as screen | ✓ |
| Fall back to system fonts | Prints faster, universally available | |
| Preserve brand colors | More visually appealing printout | ✓ |
| Black on white only | Works on B&W printers | |

**User's choice:** Minimal output, single column, webfonts, preserve brand colors

## IntersectionObserver

| Option | Description | Selected |
|--------|-------------|----------|
| Inline <script> in HTML | Self-contained, no extra HTTP request | ✓ |
| External .js file | Cleaner separation, cacheable | |
| data-delay attributes on elements | Simple, explicit, no JS computation | ✓ |
| CSS :nth-child() cascade | Pure CSS but limited | |
| JS computes from child index | Flexible but needs JS logic | |
| One-shot (once: true) | Matches current framer-motion behavior | ✓ |
| Replay on every scroll-in | More dynamic but jarring | |
| Dedicated observer alongside animations | Clearer separation of concerns | ✓ |
| Single observer for both | Efficient but couples concerns | |

**User's choice:** Inline script, data-delay attributes, one-shot, dedicated nav observer

## Inline SVG Icons

| Option | Description | Selected |
|--------|-------------|----------|
| Copy from lucide source | Exact match to current rendering | ✓ |
| Hand-crafted simplified icons | Lighter, unique character | |
| Size classes (wk-icon-sm/md/lg) | Explicit, easy to maintain | ✓ |
| Inline width/height attributes | Quick, flexible | |
| Inline at each usage | Simplest, no indirection | ✓ |
| SVG <defs>/<use> sprite | Cleaner HTML but adds indirection | |
| Inherit from parent via currentColor | Works automatically, no extra code | ✓ |
| Explicit icon color class | More control but more CSS | |

**User's choice:** Copy from lucide source, size classes, inline at each usage, inherit via currentColor

---

## OpenCode's Discretion

- CSS class composition for specific elements (hero, nav, footer classes) — follow existing visual structure from UI-SPEC
- Keyframe timing values beyond what's specified — maintain existing durations from current CSS
- Spacing token values not explicitly discussed — use effective values from UI-SPEC spacing scale
- Inline SVG wrapper element choice — pick what's simplest

## Deferred Ideas

None — discussion stayed within phase scope.
