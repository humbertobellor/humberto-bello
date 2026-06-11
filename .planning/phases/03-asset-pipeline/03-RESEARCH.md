# Phase 3: Asset Pipeline + Dead Code Cleanup — Research

**Date:** 2026-06-07
**Context path used:** `.planning/phases/03-asset-pipeline/03-CONTEXT.md`
**Requirements addressed:** DEP-02, DEP-03, INF-07, QLT-04, SEO-04, STC-03, STC-04

---

## Current State

### Build Script (`scripts/build.mjs`)
- 95 lines, uses only `fs`, `path`, `url` built-ins
- Already scaffolds `dist/fonts/`, `dist/images/`, and `dist/locales/` directories (empty)
- Has `existsSync` guard + try/catch error handling pattern for copy operations
- Asset path rewriting covers `/fonts/` (href/src) and `/images/` (src/srcset)
- i18next vendor + locale JSON copy pattern (lines 70-91) is the template for font/image copying

### Font Files (`public/fonts/` — 12 .woff2 files)

| File | Weight | Type |
|------|--------|------|
| Bogart-Italic-trial.woff2 | 400 italic | Display/Heading |
| Bogart-Medium-Italic-trial.woff2 | 500 italic | Display/Heading |
| Bogart-Medium-trial.woff2 | 500 normal | Display/Heading |
| Bogart-Regular-trial.woff2 | 400 normal | Display/Heading |
| Bogart-Semibold-trial.woff2 | 600 normal | Display/Heading |
| InterTight-400-latin.woff2 | 400 normal | UI |
| InterTight-500-latin.woff2 | 500 normal | UI |
| InterTight-600-latin.woff2 | 600 normal | UI |
| JetBrainsMono-400-latin.woff2 | 400 normal | Code |
| JetBrainsMono-500-latin.woff2 | 500 normal | Code |
| newsreader-latin-400-italic.woff2 | 400 italic | Bogart digit fallback |
| newsreader-latin-400-normal.woff2 | 400 normal | Bogart digit fallback |

- **Destination:** `dist/fonts/` (directory already scaffolded)
- **Build step:** Add after line 68 (i18next copy section), before line 93 (log)

### Headshot Images (`../dossier-main/attached_assets/` — 5 files)

| File | Size | Type |
|------|------|------|
| headshot-corp_1776959044728.avif | — | AVIF 700w |
| headshot-corp_1776959044728.webp | — | WebP 700w |
| headshot-corp_1776959044728@1x.avif | — | AVIF 350w |
| headshot-corp_1776959044728@1x.webp | — | WebP 350w |
| headshot-corp_1776959044728.png | — | PNG fallback |

- **Note:** CONTEXT.md D-03 specifies source path as `../../attached_assets/` but the actual relative path from the current working directory is `../dossier-main/attached_assets/`. The build script should use the correct resolved path.
- **Destination:** `dist/images/` (directory already scaffolded)
- **HTML partials reference:** `src/html/hero.html` uses `/images/headshot-corp_...` paths (build script rewrites with `BASE_PATH`)
- **Build step:** Copy after fonts, before log

### OpenGraph Image
- No OG image exists in attached_assets. Known gap — Phase 4 (SEO) handles this. Build script warns per D-13.

### Dead Code — Files to Delete

| File/Directory | Lines | Status |
|---------------|-------|--------|
| `src/components/ui/` (55 files) | 5,766 | 0 remaining imports (verified) |
| `src/components/Changelog.tsx` | 523 | 0 remaining imports (verified) |
| `src/components/FadeIn.tsx` | 1 (comment stub) | Purely a stub file |
| `src/pages/home.tsx` | kept — see below | |

- **Import verification:** `rg -l "components/ui/" src/` and `rg -l "Changelog" src/` both return no matches. All React imports were removed during Phase 1/2 (switched to HTML partials). These files are purely dead weight on disk.
- **`src/pages/home.tsx`:** The React source file (1279 lines) is kept for reference/backup but is NOT used in the build output. Phase 4 may remove it. Not in scope for Phase 3.

### package.json Cleanup — Current State

**Keep (4):**
- `@types/node` (devDep) — typecheck
- `typescript` (devDep) — typecheck
- `i18next` (dep) — client-side localization
- `i18next-browser-languagedetector` (dep) — language detection

**Remove (~38 deps):**
- `@radix-ui/*` (19 packages) — shadcn/ui primitives
- `@replit/*` (3 packages) — Replit-specific plugins
- `@tailwindcss/*` (2 packages) — Tailwind build tools
- `@tanstack/react-query` — React query (no API calls)
- `@types/react`, `@types/react-dom` — React types
- `@vitejs/plugin-react` — Vite React plugin
- `@workspace/api-client-react` — workspace dep (Changelog's consumer)
- `beasties` — Critical CSS (Vite-only)
- `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css` — Tailwind utilities
- `cmdk`, `embla-carousel-react`, `input-otp`, `react-day-picker`, `react-icons`, `react-resizable-panels`, `recharts`, `sonner`, `vaul`, `next-themes` — UI components (all unused)
- `react`, `react-dom` — React framework
- `express` — Server (no server needed)
- `react-hook-form`, `@hookform/resolvers`, `zod` — Form handling (unused)
- `react-i18next` — React bindings (replaced with vanilla JS i18next init)
- `rollup-plugin-visualizer` — Bundle analyzer (Vite-only)
- `wouter` — Router (single page)
- `date-fns` — Date formatting (unused)
- `vite` — Build tool (replaced with scripts/build.mjs)

### LinkedIn URL Fix

**Current (wrong):** `https://linkedin.com` — appears in:
- `src/html/cta.html:19` (the active HTML partial for build)
- `src/html/_head.html:47` (JSON-LD `sameAs` array)
- `src/pages/home.tsx:665` (legacy React source)

**Target:** `https://www.linkedin.com/in/`

**Fix locations (Phase 3 scope):**
- `src/html/cta.html` — the CTA button link
- `src/html/_head.html` — JSON-LD structured data

### wolknitive-animations.css (Phase 1 Gap)
- 82 lines, exists at `src/styles/wolknitive-animations.css`
- Already included in build script's CSS injection (line 27)
- ContEXT.md canonical refs lists it as a deletion candidate but it's actually still used for hero animations and scroll-reveal classes. Keep it. The "dead keyframes" comment is inaccurate — verify before deleting.

---

## Build Script Integration Points

### Copy Pattern (follow existing i18next vendor pattern)

```javascript
// Fonts
const fontDir = 'public/fonts';
if (existsSync(fontDir)) {
  const fonts = readdirSync(fontDir).filter(f => f.endsWith('.woff2'));
  for (const font of fonts) {
    cpSync(`${fontDir}/${font}`, `dist/fonts/${font}`);
  }
}

// Headshot images
const imgSource = '../dossier-main/attached_assets';  // actual path
const imgDest = 'dist/images';
const headshots = [
  'headshot-corp_1776959044728.avif',
  'headshot-corp_1776959044728.webp',
  'headshot-corp_1776959044728@1x.avif',
  'headshot-corp_1776959044728@1x.webp',
];
for (const img of headshots) {
  if (existsSync(`${imgSource}/${img}`)) {
    cpSync(`${imgSource}/${img}`, `${imgDest}/${img}`);
  } else {
    console.warn('⚠ Skipping headshot (not found):', img);
  }
}
```

### Path Resolution
- The actual headshot source path (`../dossier-main/attached_assets/`) differs from the Discuss-phase decision (`../../attached_assets/`). The build script should use `path.resolve(__dirname, '../dossier-main/attached_assets')` for robustness, or accept the source path via an env var for flexibility.

---

## Validation Architecture

### Verification Strategy

| Check | Method | Expected |
|-------|--------|----------|
| Fonts in dist/fonts/ | `ls dist/fonts/*.woff2 \| wc -l` | 12 files |
| Images in dist/images/ | `ls dist/images/headshot* \| wc -l` | 4 files (AVIF+WebP) |
| shadcn/ui deleted | `test ! -f src/components/ui/button.tsx` | directory gone |
| Changelog deleted | `test ! -f src/components/Changelog.tsx` | file gone |
| No orphan imports | `rg -l "components/ui" src/` | empty |
| No orphan imports | `rg -l "Changelog" src/` | empty |
| package.json cleaned | `jq '.dependencies \| keys' package.json` | only i18next, i18next-browser-languagedetector |
| package.json cleaned | `jq '.devDependencies \| keys' package.json` | only @types/node, typescript |
| LinkedIn URL fixed | `rg "linkedin.com" src/html/ -l` | `rg "humberto-bello" src/html/` matches |
| Build succeeds | `npm run build` | exit 0 |
| HTML output valid | `rg "https://linkedin.com" dist/index.html` | no matches |

### Threat Model

| Threat ID | Category | Component | Disposition | Mitigation |
|-----------|----------|-----------|-------------|------------|
| T-03-01 | Spoofing | Build script asset copy | Accept | Hardcoded source/dest paths — no user-controlled path input |
| T-03-02 | Tampering | File deletion operations | Accept | Only deletes known unused files with pre-verification of zero remaining imports |
| T-03-03 | Information Disclosure | package.json contents | Accept | npm metadata is public by design; only removes deps, doesn't expose secrets |

---

## Key Findings

1. **Headshot source path differs:** Actual location is `../dossier-main/attached_assets/` not `../../attached_assets/` as specified in D-03. The build script must use the correct resolved path.
2. **LinkedIn URL needs fixing in partials, not just home.tsx:** D-14 mentions `src/pages/home.tsx:665` but the active references are in `src/html/cta.html:19` and `src/html/_head.html:47`. Fix all three.
3. **wolknitive-animations.css is live code:** 82 lines, actively used. Do NOT delete — the CONTEXT.md's archival reference is inaccurate.
4. **Zero remaining imports to shadcn/ui or Changelog:** Safe to physically delete these files without breaking anything.
5. **png headshot exists but isn't referenced:** `headshot-corp_*.png` exists in attached_assets but isn't used in HTML partials. Skip it.
