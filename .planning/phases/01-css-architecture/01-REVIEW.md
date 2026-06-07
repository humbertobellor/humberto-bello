---
phase: 01-css-architecture
reviewed: 2026-06-07T20:00:00Z
depth: standard
files_reviewed: 8
files_reviewed_list:
  - index.html
  - package.json
  - src/components/FadeIn.tsx
  - src/index.css
  - src/pages/home.tsx
  - src/styles/wolknitive-animations.css
  - src/styles/wolknitive-base.css
  - src/styles/wolknitive-tokens.css
findings:
  critical: 1
  warning: 7
  info: 4
  total: 12
status: issues_found
---

# Phase 01: Code Review Report — CSS Architecture

**Reviewed:** 2026-06-07T20:00:00Z
**Depth:** standard
**Files Reviewed:** 8
**Status:** issues_found

## Summary

Reviewed the CSS architecture refactor: 8 files spanning the HTML shell, package.json, the React page component, and the extracted Wolknitive CSS modules (tokens, base, animations). The CSS extraction is structurally sound — all 30 animation classes used in `home.tsx` are properly defined, and the token system is clean.

However, there are several issues: the inline `<script>` in `index.html` is dead code that runs before React mounts, five CSS classes are defined but never referenced in JSX, and unchecked i18n type casts can cause runtime crashes if translations are missing. Accessibility gaps remain (no `prefers-reduced-motion`, `<html lang>` not updated on language switch).

---

## Critical Issues

### CR-01: Unchecked i18n type casts cause runtime crash on missing translations

**File:** `src/pages/home.tsx:238`, `src/pages/home.tsx:240`, `src/pages/home.tsx:242`

**Issue:** Three locations use `as string[]` to cast the return value of `t()` with `returnObjects: true`. When a translation key is missing, i18next falls back to returning the key string itself (e.g., `"hero.bullets"`). Calling `.map()` on a string throws `TypeError: "hero.bullets".map is not a function`, crashing the entire page.

- Line 238: `const heroBullets: string[] = t("hero.bullets", { returnObjects: true }) as string[];`
- Line 239-240: `const experienceEntries: { ... }[] = t("experience.entries", { returnObjects: true }) as ...[];`
- Line 241-242: `const skillItems = (key: string): string[] => t(...) as string[];`

These are used at lines 458, 563, and 534 respectively with `.map()` — any of them can crash the page if the translation is missing from a locale file.

**Fix:** Add runtime validation and defensive fallback:

```typescript
const heroBullets: string[] = (() => {
  const raw = t("hero.bullets", { returnObjects: true });
  return Array.isArray(raw) ? raw : [];
})();
```

Or validate once at mount and fail early with a meaningful console error. Same pattern for `experienceEntries` and `skillItems`.

---

## Warnings

### WR-01: Inline `<script>` in index.html runs before React mounts — entire block is dead code

**File:** `index.html:97-130`

**Issue:** The inline script attaches to `DOMContentLoaded`, which fires when the HTML is parsed — **before** React renders into `<div id="root">`. At that point, no `.wk-reveal`, `section[id]`, or `.wk-nav-link` elements exist in the DOM. The two `IntersectionObserver` instances observe nothing and have zero effect.

The actual scroll-reveal functionality is correctly handled by React's `FadeInSection` component in `home.tsx:161-187` (with its own IntersectionObserver) and the nav tracking `useEffect` in `home.tsx:202-217`. The inline script is a leftover from an earlier approach that attempted to replace framer-motion.

**Fix:** Remove the entire `<script>` block (lines 97-130) from `index.html`. The React components handle these behaviors correctly.

### WR-02: Unhandled promise rejection in `changeLanguage`

**File:** `src/pages/home.tsx:198`

**Issue:** `void i18n.changeLanguage(code)` discards the promise. If the locale file fails to load (network error, missing file), the promise rejection goes unhandled — no error message, no fallback to English, no user-facing feedback.

**Fix:** Handle the promise:

```typescript
const changeLanguage = async (code: string) => {
  try {
    await i18n.changeLanguage(code);
    setCurrentLang(code);
  } catch (err) {
    console.error("Failed to load locale:", code, err);
    // Optionally: setCurrentLang("en") as fallback
  }
};
```

### WR-03: Hardcoded array lengths can go out of sync with i18n data

**File:** `src/pages/home.tsx:14-21, 239-240, 587`

**Issue:** `expTags` has exactly 6 entries (lines 14-21), but `experienceEntries` comes from i18n translations (line 239). At line 587, `expTags[i]` is indexed by `i` from the translated array — if a translator adds a 7th experience entry without updating the hardcoded arrays, `expTags[i]` is `undefined` and `.map()` at line 588 crashes. Same latent risk with `clientIcons`/`clientKeys`/`clientNames` (lines 10-12, 6 items each, indexed in sync but brittle).

**Fix:** Either export translation data to include tags, or add a bounds check:

```typescript
{expTags[i]?.map((tag) => (
  <Tag key={tag} label={tag} />
))}
```

### WR-04: `<html lang="en">` not updated when language changes

**File:** `index.html:2`, `src/pages/home.tsx:197-199`

**Issue:** The `<html>` element's `lang` attribute is hardcoded to `"en"` and never updated when the user switches language. Screen readers will not announce content in the correct language — an accessibility violation (WCAG 3.1.1).

**Fix:** Add in the language-change handler:

```typescript
document.documentElement.lang = code;
```

### WR-05: Missing `prefers-reduced-motion` media query

**File:** `src/styles/wolknitive-animations.css`

**Issue:** All animations (hero entrance and scroll reveal) have no `prefers-reduced-motion` fallback. Users with vestibular motion disorders could experience discomfort. The `.wk-reveal` transition and the `@keyframes` animations should be disabled when the user has requested reduced motion.

**Fix:** Add at the end of `wolknitive-animations.css`:

```css
@media (prefers-reduced-motion: reduce) {
  .wk-reveal,
  .wk-anim-fade-left,
  .wk-anim-fade-right,
  .wk-anim-fade-scale,
  .wk-anim-fade-up,
  .wk-anim-fade-left-sm,
  .wk-anim-fade-up-sm,
  .wk-anim-bounce-y {
    animation: none !important;
    transition: none !important;
  }
  .wk-reveal { opacity: 1; transform: none; }
}
```

### WR-06: `::wk-mobile-headshot` has `display: flex` overridden by `display: block`

**File:** `src/styles/wolknitive-base.css:320-325, 699-703`

**Issue:** `.wk-mobile-headshot` sets `display: flex` for centering (`justify-content: center`). But `.wk-mobile-hidden` sets `display: none` (line 320), and at `min-width: 768px` (line 323) overrides to `display: block` — not `display: flex`. This causes `justify-content: center` to be ignored on desktop, so the mobile headshot frame may be left-aligned instead of centered within its container.

**Fix:** Ensure the flex display is preserved:

```css
@media (min-width: 768px) {
  .wk-mobile-hidden { display: flex; }
}
```

### WR-07: `.wk-nav-link.active` class selector never matches — dead CSS

**File:** `src/styles/wolknitive-base.css:150-152`

**Issue:** The React code at `home.tsx:266` uses `data-active={activeSection === link.id || undefined}` — this sets a `data-active` attribute. The CSS correctly matches this at line 339: `.wk-nav-link[data-active="true"]`. But the `.wk-nav-link.active` class (line 150) is never applied by any code path, making these three lines dead CSS.

**Fix:** Remove `.wk-nav-link.active` (lines 150-152) since the `[data-active]` attribute selector already handles active state styling. Or, alternatively, keep it and remove the duplicate attribute selector — but don't keep both.

---

## Info

### IN-01: Array index used as React `key` prop in four places

**File:** `src/pages/home.tsx:460, 534, 564, 616`

**Issue:** Using array index (`key={i}`) as React key is an anti-pattern. For static data it won't cause visible bugs, but it prevents optimal reconciliation if lists ever change. Consider using a stable unique value from the data (e.g., the company name, skill category key, or client name) or a generated ID.

### IN-02: `src/components/FadeIn.tsx` is an empty shell file

**File:** `src/components/FadeIn.tsx`

**Issue:** The file contains only a single-line comment. The `FadeInSection` component was moved inline to `home.tsx`. No code imports from this file (verified by grep). This file should be deleted to avoid confusion.

### IN-03: Dead CSS classes defined but never used in JSX

**Files:** `src/styles/wolknitive-base.css`, `src/styles/wolknitive-tokens.css`, `src/styles/wolknitive-animations.css`

**Issue:** The following CSS classes and keyframes are defined but never referenced in any TSX/TS source file:

| Class / Keyframe | File | Lines |
|---|---|---|
| `.wk-hero-photo` | base.css | 258-265 |
| `.wk-cta-section` | base.css | 722 (print) |
| `.wk-bg-elevated` | base.css | 306 |
| `.wk-icon-lg` | base.css | 296-301 |
| `.wk-eyebrow` | tokens.css | 193-199 |
| `@keyframes wkFadeSlideUpScroll` | animations.css | 35-38 |

These are artifacts of planning that were defined but the corresponding JSX was never updated to use them (or the class was renamed during refactoring).

### IN-04: LinkedIn URL is a placeholder

**File:** `index.html:49`, `src/pages/home.tsx:666`

**Issue:** The LinkedIn URL is `https://linkedin.com` — the top-level domain, not a profile URL. This appears to be a placeholder that was never replaced with the actual profile URL.

---

_Reviewed: 2026-06-07T20:00:00Z_
_Reviewer: OpenCode (gsd-code-reviewer)_
_Depth: standard_
