# Phase 1: CSS Architecture — Pattern Map

**Generated:** 2026-06-07
**Source:** Codebase analysis of existing patterns

---

## File Role Classification

| File | Role | Data Flow | Existing Analog |
|------|------|-----------|-----------------|
| `src/styles/wolknitive-tokens.css` | Design tokens (immutable) | → consumed by all CSS | Already exists (187 lines) |
| `src/styles/wolknitive-base.css` | **NEW** — Section layout + component CSS | → extracted from home.tsx inline styles | Analog: `wolknitive-tokens.css` pattern |
| `src/styles/wolknitive-animations.css` | **NEW** — @keyframes + animation classes | → extracted from src/index.css | Analog: current `@keyframes` in `index.css` |
| `src/pages/home.tsx` | Source of all inline styles, event handlers, icon imports, framer-motion wrappers | → extracts TO | CSS files via replacement |
| `src/components/FadeIn.tsx` | framer-motion scroll wrapper | → replaced BY | IntersectionObserver inline script |
| `index.html` | Vite entry point + SEO metadata | → MODIFIED: add IntersectionObserver `<script>` | Existing (92 lines) |

## Existing Patterns

### Pattern: wk- CSS Class Prefix
**Location:** `src/styles/wolknitive-tokens.css:159-187`
```css
.wk-rule { border: 0; border-top: 1px solid var(--rule-strong); ... }
.wk-label { font-family: var(--font-ui); font-size: var(--fs-xs); font-weight: 600; ... }
.wk-eyebrow { font-family: var(--font-display); font-style: italic; color: var(--accent); ... }
```

### Pattern: Inline Style with CSS Variables
**Location:** `src/pages/home.tsx` (scattered across 86 instances)
```tsx
style={{
  fontFamily: "var(--font-display)",
  fontWeight: 500,
  fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
  color: INK,               // → var(--ink)
  margin: 0,
}}
```
**Replacement:** `.wk-class { font-family: var(--font-display); font-weight: 500; font-size: clamp(...); color: var(--ink); }`

### Pattern: Card Container (repeated ~6×)
**Location:** `src/pages/home.tsx`
```tsx
style={{
  background: V100,                    // → var(--vellum-100)
  border: `1px solid ${V200}`,         // → var(--vellum-200)
  borderRadius: "var(--radius-lg)",
  padding: "1.375rem 1.5rem",
  boxShadow: "var(--shadow-1)",
}}
```
**Replacement:** `.wk-card { background: var(--vellum-100); border: 1px solid var(--vellum-200); border-radius: var(--radius-lg); padding: 1.375rem 1.5rem; box-shadow: var(--shadow-1); }`

### Pattern: Section Layout (repeated per section)
```tsx
<section style={{ padding: "5rem 1.5rem", maxWidth: "72rem", margin: "0 auto" }}>
```
**Replacement:** `<section class="wk-section">` (single `.wk-section` class with padding 5rem 1.5rem, plus `.wk-container` wrapper)

### Pattern: Event Handler → CSS :hover
**Location:** `src/pages/home.tsx:397-398`
```tsx
onMouseEnter={e => (e.currentTarget.style.background = TEAL_6)}
onMouseLeave={e => (e.currentTarget.style.background = TEAL)}
```
**Replacement:** `.wk-btn-cta { background: var(--teal-500); transition: background-color 0.2s; }` + `:hover { background: var(--teal-600); }`

### Pattern: Tailwind Grid → CSS Grid
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
```
**Replacement:** `.wk-grid-3col { display: grid; grid-template-columns: 1fr; gap: 1.25rem; } @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); } @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }`

### Pattern: Framer Motion → IntersectionObserver
**Location:** `src/components/FadeIn.tsx`
```tsx
<motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.55, delay }}>
```
**Replacement:** `<div class="wk-reveal" data-delay="0.07s">` with CSS animation class + observer

### Pattern: lucide-react → Inline SVG
**Location:** `src/pages/home.tsx:23`
```tsx
import { MapPin, Shield, ... } from "lucide-react";
// Usage:
<MapPin size={14} />
```
**Replacement:** `<svg class="wk-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="..."/></svg>`

## Name Mapping (TS Constants → CSS Variables)

| TS Constant | Hex | CSS Variable |
|-------------|-----|-------------|
| `INK` | `#14110B` | `--ink` |
| `TEAL` | `#1B4E4A` | `--teal-500` |
| `TEAL_6` | `#103A37` | `--teal-600` |
| `V50` | `#FAF6EC` | `--vellum-50` |
| `V100` | `#F3ECD9` | `--vellum-100` |
| `V200` | `#E7DCC0` | `--vellum-200` |
| `V300` | `#CFBE96` | `--vellum-300` |
| `V400` | `#9C8A64` | `--vellum-400` |
| `V500` | `#6B5C3E` | `--vellum-500` |
| `V700` | `#2E261A` | `--vellum-700` |
