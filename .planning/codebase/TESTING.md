# Testing Patterns

**Analysis Date:** 2026-06-07

## Test Framework

**Runner:** Not configured. No test runner found in the project.

- `jest.config.*`, `vitest.config.*` — not present
- `package.json` — no `test` script defined
- `tsconfig.json` — excludes `**/*.test.ts` from compilation (`"exclude": ["node_modules", "build", "dist", "**/*.test.ts"]`)
- No test files exist anywhere in the codebase (`src/**/*.test.*`, `src/**/*.spec.*` — 0 results)
- No test dependencies in `package.json` (no jest, vitest, playwright, cypress, testing-library, etc.)

**Current state:** Zero test infrastructure.

## Test File Organization

Not applicable — no tests exist.

**Recommendations for adding tests:**

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.test.tsx      # Co-located with component
│   │   └── Card.test.tsx
│   ├── Changelog.test.tsx
│   └── FadeIn.test.tsx
├── hooks/
│   ├── use-toast.test.ts        # Unit test for reducer logic
│   └── use-mobile.test.ts
├── lib/
│   └── utils.test.ts             # Test cn() function
└── pages/
    ├── home.test.tsx
    └── not-found.test.tsx
```

- Co-locate test files with source (not a separate `__tests__` directory)
- Suffix: `.test.tsx` for component tests, `.test.ts` for pure logic tests (consistent with `tsconfig.json` exclude pattern)
- Test IDs (`data-testid`) already present on most interactive elements for query targeting

## Test Structure

Not applicable — no test framework to describe.

**If vitest were added** (recommended match for Vite project), the pattern should be:

```typescript
import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("handles tailwind conflicts", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });
});
```

## Mocking

Not applicable — no mock framework configured.

**Observations for future setup:**
- External API calls via `@workspace/api-client-react` (React Query hooks) will need MSW or similar for integration tests
- `i18next` `useTranslation()` results should be mocked at the module level
- `framer-motion` `motion.div` can be stubbed as a plain `<div>` in unit tests
- `window.matchMedia` needs mock for `use-mobile.tsx` testing

## Fixtures and Factories

Not applicable — no test data patterns exist.

**API response shapes used in production** (`Changelog.tsx`):
```typescript
// @workspace/api-client-react exports:
type Release = {
  id: number;
  tag_name: string;
  published_at: string;   // ISO date
  body: string | null;
  html_url: string;
};
```

This type can drive factory functions for changelog tests.

## Coverage

**Requirements:** None enforced. No coverage tooling configured.

## Test Types

### Current State

- **Unit Tests:** None
- **Integration Tests:** None
- **E2E Tests:** None

### What Should Be Tested First (Priority Order)

1. **`src/lib/utils.ts`** — Pure function `cn()`, simplest to test, highest reuse (used by all UI components)
2. **`src/hooks/use-toast.ts`** — `reducer()` is a pure function; toast actions (ADD, UPDATE, DISMISS, REMOVE) should be unit-tested; covers the most complex logic in the codebase
3. **`src/hooks/use-mobile.tsx`** — Hook with window event listener, straightforward to test
4. **`src/components/ui/*.tsx`** — shadcn UI components are mostly presentational; spot-check rendering and class output
5. **`src/components/Changelog.tsx`** — Has data-fetching (React Query), conditional rendering, and a custom markdown parser; the most feature-rich component after `home.tsx`
6. **`src/pages/home.tsx`** — 1279 lines, renders content with i18n, but visual regression testing may be more appropriate than unit tests for this
7. **`src/components/FadeIn.tsx`** — Animation wrapper, framer-motion dependency could cause issues; snapshot test most useful

## Data Attributes for Testing

The codebase consistently uses `data-testid` attributes on elements that would be testing targets:

### `data-testid` attributes found:

| Test ID | Location | Element |
|---------|----------|---------|
| `nav` | `home.tsx` | Sticky nav container |
| `nav-logo` | `home.tsx` | Logo button |
| `nav-{section}` | `home.tsx` | Navigation links (hero, skills, experience, clients) |
| `nav-resume` | `home.tsx` | Resume download link (desktop) |
| `nav-resume-mobile` | `home.tsx` | Resume download link (mobile) |
| `nav-contact` | `home.tsx` | Contact CTA button |
| `lang-{code}` | `home.tsx` | Language switcher buttons (en, es, de) |
| `section-hero` | `home.tsx` | Hero section |
| `hero-photo-col` | `home.tsx` | Desktop photo column |
| `hero-photo-mobile` | `home.tsx` | Mobile photo wrapper |
| `hero-headshot` | `home.tsx` | Headshot `<img>` |
| `cta-email` | `home.tsx` | Email CTA link |
| `cta-linkedin` | `home.tsx` | LinkedIn CTA link |
| `cta-github` | `home.tsx` | GitHub CTA link |
| `cta-substack` | `home.tsx` | Substack CTA link |
| `footer` | `home.tsx` | Footer container |
| `changelog` | `Changelog.tsx` | Changelog container |
| `changelog-toggle` | `Changelog.tsx` | Expand/collapse button |
| `changelog-latest-tag` | `Changelog.tsx` | Latest release tag badge |
| `changelog-list` | `Changelog.tsx` | Releases list container |
| `changelog-release` | `Changelog.tsx` | Individual release row |
| `changelog-release-tag` | `Changelog.tsx` | Release version tag |
| `changelog-release-date` | `Changelog.tsx` | Release date |
| `changelog-release-body` | `Changelog.tsx` | Release body markdown area |
| `changelog-all-releases` | `Changelog.tsx` | GitHub link |

## Recommended Test Setup

### Suggested Tooling
```bash
# Vital:
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Nice to have:
npm install -D @testing-library/user-event msw
```

### Suggested vitest config (`vitest.config.ts`):
```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["node_modules", "dist"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

### Suggested setup file (`src/test/setup.ts`):
```typescript
import "@testing-library/jest-dom";
```

### Suggested test script in `package.json`:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

## Key Testing Challenges

1. **`@workspace/api-client-react`** — Workspace dependency; tests importing it need either mock or the workspace available
2. **`@assets` alias** — Points to `../../attached_assets/` outside the package; image imports in tests would need stubs
3. **`i18next` initialization** — `src/i18n/i18n.ts` is imported as a side effect in `main.tsx`; components using `useTranslation()` need the i18n module initialized or mocked
4. **Tailwind v4** — No `tailwind.config.js`; Tailwind classes are resolved at build time, not available in unit tests
5. **Vite build plugins** — Custom plugin logic (critical CSS, hero preload, Bogart preload) is non-trivial and currently untestable; consider extracting pure functions for testability
6. **Inline styles** — `home.tsx` relies heavily on inline `style={}` objects; visual regression testing may be more appropriate than DOM assertion testing

---

*Testing analysis: 2026-06-07*
