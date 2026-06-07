# Coding Conventions

**Analysis Date:** 2026-06-07

## Naming Patterns

**Files:**
- PascalCase for component files: `Button.tsx`, `Card.tsx`, `FadeIn.tsx`, `Changelog.tsx`
- kebab-case for CSS files: `wolknitive-tokens.css`
- Lowercase with dots for config: `vite.config.ts`, `tsconfig.json`, `components.json`
- Page files use kebab-case: `not-found.tsx`, `home.tsx`

**Functions:**
- PascalCase for component functions (both page and UI): `function Home()`, `function Button()`, `function Router()`, `function App()`
- camelCase for utility/hook functions: `cn()`, `useToast()`, `useIsMobile()`, `genId()`, `formatDate()`
- Local helper components defined as inner functions in same file: `FadeInSection`, `WkRule`, `SectionHeader`, `Tag` inside `home.tsx`
- Named function declarations preferred over arrow functions: `function App()`, `function Router()`
- Exception: `const Button = React.forwardRef<...>(({...}) => ( ... ))` — arrow with forwardRef

**Variables:**
- camelCase for all JS identifiers
- UPPER_SNAKE_CASE for module-level constants: `TOAST_LIMIT`, `TOAST_REMOVE_DELAY`, `MOBILE_BREAKPOINT`, `INK`, `TEAL`, `V50`–`V700`, `OWNER`, `REPO`, `AUTO_GENERATED_RE`
- UPPER_SNAKE_CASE for regex: `AUTO_GENERATED_RE`
- Single-character loop indices: `i`, `bi`, `ii`

**Types:**
- PascalCase for type/interface names: `ToasterToast`, `Action`, `State`, `ToastProps`, `ToastActionElement`
- PascalCase with `Props` suffix for component props: `ButtonProps`, `BadgeProps`
- Inline type annotations in function signatures: `{ children: React.ReactNode; delay?: number }` (preferred over separate type declarations for single-use props)
- Discriminated union types with `type` field: `Action` in `use-toast.ts`, `InlineNode` in `Changelog.tsx`
- PascalCase enums at module level via `type` object pattern: `ActionType`

## Code Style

**Formatting:**
- **No formatter configured** — No `.prettierrc`, `biome.json`, or `.editorconfig` found
- Single quotes consistently used for JS/TS strings: `import ... from 'react'`, `'wk-rule'`
- Semicolons: **always used** (consistent throughout codebase)
- Trailing commas: yes, in multi-line arrays/objects
- Indentation: 2-space, consistent
- JSX bracket style: closing `/>` on same line for self-closing, multiline props get closing on new line

**Linting:**
- **No linter configured** — No `.eslintrc*`, `eslint.config.*`, or rule files
- Only TypeScript compiler provides basic checking via `tsconfig.json` and `tsconfig.base.json`
- Only validation command: `npm run typecheck` runs `tsc --noEmit`

## TypeScript Strictness

**Extends monorepo base** (`tsconfig.base.json`):
```json
{
  "noImplicitAny": true,
  "noImplicitThis": true,
  "strictNullChecks": true,
  "strictBindCallApply": true,
  "strictPropertyInitialization": true,
  "useUnknownInCatchVariables": true,
  "alwaysStrict": true,
  "noFallthroughCasesInSwitch": true,
  "noImplicitReturns": true,
  "noUnusedLocals": false,
  "noImplicitOverride": false,
  "strictFunctionTypes": false,
  "skipLibCheck": true
}
```

Key: `strictNullChecks` and `noImplicitAny` are on, but `noUnusedLocals` is off and `strictFunctionTypes` is off.

## Import Organization

**Order (observed pattern):**
1. React / framework imports: `import { useState } from "react"`
2. Third-party library imports: `import { motion } from "framer-motion"`
3. Workspace/project internal imports: `import { useGetReleases } from "@workspace/api-client-react"`
4. Relative imports: `import { cn } from "@/lib/utils"` or `import { Changelog } from "../components/Changelog"`

**Path Aliases:**
- `@/*` → `./src/*` (configured in `tsconfig.json` and `vite.config.ts`)
- `@assets/*` → `../../attached_assets/*` (configured in `vite.config.ts` only)
- shadcn/ui `components.json` defines: `@/components`, `@/lib`, `@/hooks`, `@/components/ui`

**Import styles:**
- `import * as React from "react"` — used in all shadcn/ui components
- `import type { ... }` — separate type imports for type-only symbols (`use-toast.ts`)
- Named imports from Radix UI primitives: `import * as DialogPrimitive from "@radix-ui/react-dialog"`
- Asset imports as default imports: `import headshotWebp from "@assets/headshot-corp_1776959044728.webp"`

## Component Patterns

**shadcn/ui (55 components in `src/components/ui/`):**
```tsx
// Pattern: React.forwardRef + displayName + cn()
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
    {...props}
  />
))
Card.displayName = "Card"
```

- `"use client"` directive at top of interactive UI components (`tooltip.tsx`)
- `cn()` helper wraps `clsx` + `tailwind-merge` for className merging
- `cva()` from `class-variance-authority` for variant-based component styling
- Named exports at file bottom: `export { Button, buttonVariants }`
- Some components re-export Radix primitive directly: `const Tooltip = TooltipPrimitive.Root`
- `@replit` comments annotate custom deviations from shadcn defaults

**Page components:**
```tsx
// Default export for route targets
export default function Home() { ... }
export default function NotFound() { ... }
```

- `src/pages/home.tsx` uses extensive `style={{}}` inline styling (not Tailwind classes) for the custom design system — 1279 lines, largest file in codebase
- `src/pages/not-found.tsx` uses shadcn `Card` components + Tailwind classes
- Local helper components defined as inner `function` in same file for encapsulation
- `data-testid` attributes on interactive elements for testing

## Error Handling

**Patterns:**
- Build-time validation via throw: `throw new Error("PORT environment variable is required...")` — in `vite.config.ts`
- Runtime errors handled inline via conditionals: `if (!body) return false`
- React Query `status` field for async state: `status === "pending"`, `status === "error"`, `status === "success"` — in `Changelog.tsx`
- No try/catch blocks found in source code
- No error boundaries found
- Component-level error states rendered inline: `{status === "error" && <p>Could not load releases.</p>}`

**Missing:**
- No error boundaries (`ErrorBoundary` or `react-error-boundary`)
- No formal error handling strategy for API failures beyond React Query `status`
- No global error handler

## Logging

**Framework:** `console` only

**Patterns:**
- `console.error()` in Vite build plugins for error reporting: `console.error("[critical-css-inline] Could not read...")`
- No structured logging, no log levels
- No production logging infrastructure

## Comments

**When to Comment:**
- Section dividers: `/* ──────── STICKY NAV ──────── */` — visual separators in large files
- Explanatory comments for non-obvious code: `/* Trial-font workaround: digits 0-9 replaced... */`
- `@replit` annotations mark custom shadcn deviations
- JSDoc-style documentation comments: `/** Editorial double-rule section separator */`
- `// ! Side effects !` — inline developer notes
- CSS uses `/* Primary SEO */`, `/* Open Graph */`, `/* Font preload hints */`

**JSDoc/TSDoc:**
- Minimal usage — only for a few component descriptions
- Not systematically applied

## Function Design

**Size:**
- UI component functions: 1–30 lines (shadcn components)
- Utility functions: 1–10 lines
- `src/pages/home.tsx` `Home` component: 1279 lines (monolithic — largest concern)
- `src/components/Changelog.tsx` `Changelog` component: 523 lines

**Parameters:**
- Props destructured in function signature: `{ className, variant, size, ...props }`
- Simple inline prop type annotations for local components
- `React.HTMLAttributes<HTMLDivElement>` for generic HTML wrapper components
- `React.ComponentPropsWithoutRef<typeof ...>` for Radix-based wrappers

**Return Values:**
- Components return JSX expressions (implicit return in arrow functions, explicit `return` in function declarations)
- Utility functions return primitives or `React.ReactNode[]` for render functions

## Module Design

**Exports:**
- shadcn components: named exports only (`export { Button, buttonVariants }`)
- Page components: default export only (`export default function Home`)
- Hooks: named export (`export { useToast, toast }`)
- Utilities: named export (`export function cn(...)`)

**Barrel Files:**
- Not used — `components.json` aliases route directly to individual files

## CSS Conventions

**Structure:**
- `src/styles/wolknitive-tokens.css` — Design token definitions (CSS custom properties), `@font-face`, utility classes
- `src/index.css` — Imports tokens, Tailwind v4 directives (`@import "tailwindcss"`, `@plugin`, `@theme inline`), base layer, keyframe animations
- shadcn components: Tailwind utility classes via `className`
- Custom components (`home.tsx`, `Changelog.tsx`): Inline `style={}` objects with CSS custom properties as `var(--font-display)` strings

**Tailwind v4 specifics:**
- No `tailwind.config.js` — Tailwind v4 uses CSS-based config via `@theme inline {}`
- `@custom-variant dark (&:is(.dark *))` for dark mode
- `@plugin "@tailwindcss/typography"` for typography plugin

**Custom animations (CSS, not framer-motion):**
- Named `wk-*` prefix: `wkFadeSlideLeft`, `wkFadeSlideRight`, `wkFadeScaleIn`, etc.
- Animation classes: `wk-anim-fade-left`, `wk-anim-fade-right`, etc.
- Hero section uses CSS animations only (no framer-motion above the fold)
- Framer Motion (`FadeIn.tsx`) lazy-loaded for below-fold sections only

---

*Convention analysis: 2026-06-07*
