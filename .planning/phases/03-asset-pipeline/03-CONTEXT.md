# Phase 3: Asset Pipeline + Dead Code Cleanup - Context

**Gathered:** 2026-06-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Copy all static assets (fonts, images) to `dist/` with correct relative paths for GitHub Pages `/dossier/` subdirectory. Remove dead code from the source tree: 55 unused shadcn/ui components, Changelog.tsx, and the @workspace/api-client-react dependency. Fix LinkedIn placeholder URL. Strip unused dependencies from package.json. The build script (from Phase 2) already scaffolds `dist/fonts/` and `dist/images/` and handles path rewriting via BASE_PATH — this phase populates those directories and cleans up source tree.

</domain>

<decisions>
## Implementation Decisions

### Asset Copy Integration
- **D-01:** Font and image copying lives in `scripts/build.mjs` — extend the existing build script. No separate copy script. Single `npm run build` command continues to produce the complete output.
- **D-02:** Font files copied from `public/fonts/` to `dist/fonts/` — all 12 .woff2 files.
- **D-03:** Headshot images copied directly from `../../attached_assets/` to `dist/images/`. No intermediate `src/images/` staging directory. The build script handles this in one step.
- **D-04:** Build script copies SVG icon reference images for OpenGraph if they exist; no separate image processing pipeline.

### Dead Code Deletion — Physical Removal
- **D-05:** Delete `src/components/ui/` directory entirely (55 shadcn/ui files). Verify no imports reference any file in this directory before deletion.
- **D-06:** Delete `src/components/Changelog.tsx` entirely (523 lines). Remove its import from wherever it's referenced.
- **D-07:** Remove `@workspace/api-client-react` from `package.json` dependencies. The Changelog was its only consumer — deleting Changelog resolves the dependency.
- **D-08:** Remove `src/components/FadeIn.tsx` (already just a comment stub from Phase 1). IntersectionObserver lives in inline `<script>` blocks.

### package.json Cleanup — Radical Strip
- **D-09:** Keep only these `dependencies`: `i18next`, `i18next-browser-languagedetector`
- **D-10:** Keep only these `devDependencies`: `@types/node`, `typescript`
- **D-11:** Remove all Radix UI packages (@radix-ui/*), React/Vite ecosystem (react, react-dom, @vitejs/plugin-react, vite, wouter, @tanstack/react-query), Tailwind ecosystem (tailwindcss, @tailwindcss/*, tailwind-merge, clsx, tw-animate-css, class-variance-authority), UI libraries (cmdk, embla-carousel-react, react-day-picker, recharts, sonner, vaul, next-themes, react-icons, react-resizable-panels, input-otp, react-hook-form, @hookform/resolvers, zod, date-fns), build plugins (beasties, rollup-plugin-visualizer), and Replit plugins (@replit/*).

### Image Source Layout
- **D-12:** Build script copies headshot images from `../../attached_assets/` directly to `dist/images/`:
  - `headshot-corp_1776959044728.avif`
  - `headshot-corp_1776959044728.webp`
  - `headshot-corp_1776959044728@1x.avif`
  - `headshot-corp_1776959044728@1x.webp`
- **D-13:** No OpenGraph image exists in attached_assets. Build script logs a warning if no OG image is found; Phase 4 (SEO) can generate one.

### LinkedIn URL Fix
- **D-14:** Fix `href="https://linkedin.com"` → `href="https://www.linkedin.com/in/humberto-bello/"` in `src/pages/home.tsx:665`. Locale JSON label text is correct as-is.

### OpenCode's Discretion
- Order of copy operations within build.mjs (fonts before images, error handling strategy)
- Exact verification approach for ensuring no orphaned imports remain after deletion
- Handling of `package-lock.json` or `pnpm-lock.yaml` regeneration after dep removal

</decisions>

<specifics>
## Specific Ideas

- Build script should fail gracefully if source files are missing (warn, don't crash)
- "Same layout, cleaner code" — asset copying should not change file structure or naming
- Dead code removal should be verifiable: `git diff --stat` should show clear reductions

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — Phase 3 requirements: DEP-02, DEP-03, INF-07, QLT-04, SEO-04, STC-03, STC-04

### Prior Phase Context
- `.planning/phases/02-build-system/02-CONTEXT.md` — Phase 2 decisions for output layout (D-17, D-18), path rewriting (D-10), and asset path conventions (D-11)
- `.planning/phases/02-build-system/02-01-SUMMARY.md` — HTML partials structure
- `.planning/phases/02-build-system/02-02-SUMMARY.md` — Build script implementation details
- `.planning/phases/02-build-system/02-03-SUMMARY.md` — i18next wiring and CSP

### Source Files to Modify
- `scripts/build.mjs` — Extend with copy steps for fonts and images
- `src/pages/home.tsx` — Fix LinkedIn URL, remove Changelog import
- `package.json` — Strip dependencies

### Source Files to Delete
- `src/components/ui/` — Entire directory (55 files)
- `src/components/Changelog.tsx` — Changelog component
- `src/components/FadeIn.tsx` — Stub file
- `src/styles/wolknitive-animations.css` — Dead keyframe cleanup (Phase 1 gap)

### Asset Sources
- `public/fonts/` — 12 .woff2 font files (Bogart, Inter Tight, JetBrains Mono, Newsreader)
- `../../attached_assets/` — Headshot AVIF/WebP images (5 files)

### Build Output Contract
- `dist/fonts/` — Font files (populated by this phase)
- `dist/images/` — Headshot images (populated by this phase)
- `dist/index.html`, `dist/404.html` — HTML files (already produced by Phase 2)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/build.mjs:9-12` — already scaffolds `dist/fonts/` and `dist/images/` directories. Phase 3 adds copy logic after the scaffolding.
- `scripts/build.mjs:35-40` — `rewritePaths()` already handles `/fonts/` and `/images/` path prefixing with BASE_PATH. Assets placed in those directories automatically get correct paths.
- `scripts/build.mjs:70-91` — existing vendor copy pattern (i18next, locale JSON) is the template for adding font/image copy steps.

### Established Patterns
- Path rewriting via BASE_PATH env var (Phase 2 D-10) — consistent across all asset types
- Error handling: `existsSync()` checks before copy, `console.warn()` for non-fatal skips (lines 77-80, 86-89)
- Phase 1 CSS architecture used three-file split — Phase 1 gap (dead keyframes in animations.css) is cleanup candidates

### Integration Points
- Phase 2 build script produces `dist/` layout with empty fonts/ and images/ directories
- Phase 4 (SEO + i18n) adds OG image support — this phase just warns if missing
- Phase 5 (Deploy) deploys the complete `dist/` directory including assets from this phase

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-asset-pipeline*
*Context gathered: 2026-06-07*
