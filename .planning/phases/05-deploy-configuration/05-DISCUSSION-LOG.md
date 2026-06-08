# Phase 5: Deploy Configuration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-07
**Phase:** 05-deploy-configuration
**Areas discussed:** Deploy mechanism, Asset path validation, Post-deploy verification

---

## Deploy mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| Push to gh-pages branch | Build script or manual step pushes dist/ contents to a gh-pages branch. GitHub Pages serves from that branch. Simple, no Actions needed. | |
| Serve from main branch | Configure GitHub Pages to serve from the main branch's root or /docs folder. dist/ would need to live there. Conflicts with source code. | ✓ |
| GitHub Actions workflow | GitHub Actions workflow builds and deploys on push to main. Automated but adds CI complexity. (Note: INF-08 deferred this to v2, but could pull it forward.) | |

**User's choice:** Serve from main branch
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Root of main branch | GitHub Pages serves from the root of main. dist/ contents live at repo root alongside source code. Simple but mixes source and output. | |
| docs/ folder on main | GitHub Pages serves from docs/ folder on main. Build script copies dist/ contents to docs/. Source and output separated. | ✓ |

**User's choice:** docs/ folder on main
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-copy in build (Recommended) | Build script automatically copies dist/ to docs/ after building. Single `npm run build` produces deployable output. Most convenient. | ✓ |
| Separate deploy command | Separate deploy command (e.g., `npm run deploy`) that copies dist/ to docs/. Build and deploy are distinct steps. | |
| Manual copy | Manual copy — you handle moving dist/ to docs/. Maximum control, least automation. | |

**User's choice:** Auto-copy in build (Recommended)
**Notes:** None

---

## Asset path validation

| Option | Description | Selected |
|--------|-------------|----------|
| Build-time validation (Recommended) | Build script scans output HTML for asset references (fonts, images, CSS) and verifies they start with /dossier/. Fails build on bad paths. | ✓ |
| Manual local check | After build, run `npx serve dist/` and manually check browser console for 404s. Human verification. | |
| Both build + manual | Both — build validates paths, then manual check as backup before deploy. | |

**User's choice:** Build-time validation (Recommended)
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| All asset references (Recommended) | Check font src, image src/srcset, CSS url() references, script/link hrefs. All must start with /dossier/ or be relative. | ✓ |
| Critical paths only | Only check img src and link href. Skip CSS url() and srcset. | |
| You decide | You decide — check whatever matters for no 404s. | |

**User's choice:** All asset references (Recommended)
**Notes:** None

---

## Post-deploy verification

| Option | Description | Selected |
|--------|-------------|----------|
| Manual browser check (Recommended) | Open the live URL in a browser, check all 3 locales, look for console errors and broken images/fonts. Manual but thorough. | ✓ |
| Automated HTTP checks | Add a post-deploy script that fetches the live URL, checks HTTP status codes for key assets, and reports broken paths. | |
| Both manual + automated | Manual browser check plus automated HTTP status checks. | |

**User's choice:** Manual browser check (Recommended)
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Full checklist (Recommended) | Check all 3 locales (en, es, de), verify fonts load, images display, no console 404s, dark mode works, language switcher navigates correctly. | ✓ |
| Smoke test only | Just check the default English locale loads without errors. Quick smoke test. | |
| You decide | You decide what to check. | |

**User's choice:** Full checklist (Recommended)
**Notes:** None

---

## OpenCode's Discretion

- Exact path regex pattern for the validator (balancing specificity vs. false positives)
- Whether to log warnings vs. errors for non-critical path issues
- Order of operations in build script (validate before or after copy to docs/)

## Deferred Ideas

- GitHub Actions auto-deploy workflow — deferred to v2 (INF-08)
- Custom domain configuration — out of scope for this phase
