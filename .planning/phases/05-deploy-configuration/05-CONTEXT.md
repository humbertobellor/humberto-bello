# Phase 5: Deploy Configuration - Context

**Gathered:** 2026-06-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Configure GitHub Pages deployment: copy `dist/` output to `docs/` folder on main branch, validate all asset paths resolve under `/dossier/` prefix, verify the live site renders all 3 locales without errors. No new features — deployment infrastructure only.

</domain>

<decisions>
## Implementation Decisions

### Deploy Mechanism
- **D-01:** GitHub Pages serves from `docs/` folder on the `main` branch. No gh-pages branch, no GitHub Actions workflow.
- **D-02:** Build script automatically copies `dist/` contents to `docs/` after building. Single `npm run build` produces deployable output. No separate deploy command.
- **D-03:** `docs/` is added to `.gitignore` to avoid committing built output. Only `dist/` is the canonical build artifact; `docs/` is the deploy artifact generated from it.

### Asset Path Validation
- **D-04:** Build script includes a path validation step that scans output HTML for all asset references (font `src`, image `src`/`srcset`, CSS `url()`, script/link `href`). All must start with `/dossier/` or be relative paths.
- **D-05:** Build fails with a clear error message if any asset path doesn't match the expected pattern. No silent bad paths reaching production.

### Post-Deploy Verification
- **D-06:** Manual browser check after deploy — open `https://bertjbello.com/` and verify:
  1. All 3 locales (en, es, de) load and render correctly
  2. Fonts load (Bogart, Inter Tight, JetBrains Mono, Newsreader)
  3. Headshot images display (AVIF/WebP with srcset)
  4. No console 404 errors
  5. Dark mode works via `prefers-color-scheme`
  6. Language switcher navigates between locales correctly

### OpenCode's Discretion
- Exact path regex pattern for the validator (balancing specificity vs. false positives)
- Whether to log warnings vs. errors for non-critical path issues
- Order of operations in build script (validate before or after copy to docs/)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — Phase 5 requirements: INF-02 (.nojekyll), INF-04 (deployable to GitHub Pages)

### Prior Phase Context
- `.planning/phases/02-build-system/02-CONTEXT.md` — Phase 2 decisions for output layout (D-17, D-18), BASE_PATH rewriting (D-10)
- `.planning/phases/03-asset-pipeline/03-CONTEXT.md` — Phase 3 decisions for asset copy (D-01–D-04), output layout (D-17–D-18)
- `.planning/phases/04-seo-i18n/04-CONTEXT.md` — Phase 4 decisions for locale output (D-01–D-02), canonical URLs (D-14), language switcher (D-07)

### Source Files to Modify
- `scripts/build.mjs` — Add path validation step, add docs/ copy step
- `.gitignore` — Add `docs/` entry

### Build Output (input to this phase)
- `dist/` — Complete build output: index.html, 404.html, de/, es/, fonts/, images/, locales/, sitemap.xml

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/build.mjs` — Existing build script with marker replacement, CSS injection, path rewriting. Add validation and docs/ copy as new steps.
- `dist/` — Already built output with correct structure. Source for docs/ copy.

### Established Patterns
- `BASE_PATH` env var for path prefix rewriting (Phase 2 D-10) — validator checks against this
- `existsSync()` checks before copy operations (Phase 3 pattern)
- Build script fails gracefully with `console.warn()` for non-fatal issues, hard fails for critical ones

### Integration Points
- Phase 2 build produces `dist/` layout — this phase adds validation and docs/ copy
- Phase 3 populates `dist/fonts/` and `dist/images/` — validator checks these paths
- Phase 4 adds locale subdirectories — validator checks `dist/es/` and `dist/de/` paths
- GitHub Pages configuration — user sets "Source: Deploy from a branch, Branch: main, folder: /docs" in repo settings

</code_context>

<specifics>
## Specific Ideas

- Build script should output a clear summary after validation: "All 47 asset paths validated" or "3 paths failed: [list]"
- `.nojekyll` should be added to `dist/` by the build script (requirement INF-02), then copied to `docs/` with everything else
- The docs/ copy should be a simple recursive copy — no transformation, just move files from dist/ to docs/

</specifics>

<deferred>
## Deferred Ideas

- GitHub Actions auto-deploy workflow — deferred to v2 (INF-08)
- Custom domain configuration — out of scope for this phase

</deferred>

---

*Phase: 05-deploy-configuration*
*Context gathered: 2026-06-07*
