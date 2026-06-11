---
status: resolved
slug: mobile-headshot-visible-on-desktop
trigger: "mobile headshot still showing on desktop after CSS specificity fix"
created: 2026-06-08
updated: 2026-06-08
---

## Symptoms

- expected: Mobile headshot (small square, .wk-mobile-headshot.wk-mobile-hidden) is hidden at viewport >= 768px. Only the full-bleed .wk-hero-panel headshot should be visible on desktop.
- actual: Both headshots visible on desktop. Small mobile headshot appears in right content column alongside the full-bleed desktop photo.
- error_messages: None. Pure CSS visibility issue.
- timeline: Persists after commit e0afde7 which added .wk-mobile-headshot.wk-mobile-hidden { display: none !important } for min-width 768px.
- reproduction: Visit https://bertjbello.com/ on any desktop viewport (≥768px).

## Current Focus

hypothesis: "CONFIRMED — CSS fix exists in all docs/ HTML files locally but was never committed. GitHub Pages serves the last committed version (99e3739) which lacks the fix."
test: "git diff HEAD --stat confirmed 6 files with 10 added lines each (the CSS block)"
expecting: "Committing and pushing docs/ files will make the fix live"
next_action: "Commit all modified docs/ and dist/ files and push to main"
reasoning_checkpoint:
  hypothesis: "Commit e0afde7 patched src/styles/wolknitive-base.css. A subsequent direct edit added the same CSS block to all docs/ HTML files, but those edits were never committed. GitHub Pages serves the committed tree."
  confirming_evidence:
    - "git show e0afde7 --stat: only src/styles/wolknitive-base.css changed — no docs/ files"
    - "git diff HEAD --stat: 6 files (docs/index.html, docs/de, docs/es, docs/404.html, dist/index.html, dist/404.html) each show +10 lines (the exact CSS fix block)"
    - "docs/index.html lines 629-637 contain the fix locally; git shows it as unstaged change"
    - ".wk-mobile-headshot { display: flex; } at line 1011 has no !important so our fix wins"
  falsification_test: "If GitHub Pages showed the fix working, this would be wrong — but the symptom describes the live site not having the fix"
  fix_rationale: "Committing the already-correct local docs/ files deploys the fix to GitHub Pages"
  blind_spots: "Possible CDN cache delay after push (expected 1-5 min on GitHub Pages)"

## Evidence

- timestamp: 2026-06-08
  checked: "git show e0afde7 --stat"
  found: "Commit e0afde7 only changed src/styles/wolknitive-base.css — docs/ NOT included"
  implication: "The CSS source fix was never propagated to the deployed docs/ build"

- timestamp: 2026-06-08
  checked: "git diff HEAD --stat"
  found: "6 files (docs/index.html, docs/de/index.html, docs/es/index.html, docs/404.html, dist/index.html, dist/404.html) each have 10 uncommitted added lines"
  implication: "The docs/ files were manually patched locally after e0afde7 but never committed/pushed"

- timestamp: 2026-06-08
  checked: "docs/index.html lines 629-637"
  found: ".wk-mobile-headshot.wk-mobile-hidden { display: none !important; } present and logically correct"
  implication: "No need to re-run build — the local fix is correct; just needs committing"

- timestamp: 2026-06-08
  checked: "docs/index.html line 1011 — .wk-mobile-headshot { display: flex; }"
  found: "No !important on the base flex rule"
  implication: "Our !important fix wins regardless of source order. CSS logic is sound."

## Eliminated Hypotheses

- hypothesis: "CDN cache serving stale version despite correct committed CSS"
  evidence: "The fix was never committed — the committed version at HEAD lacks the CSS block entirely"
  timestamp: 2026-06-08

- hypothesis: "CSS specificity fix insufficient — display:flex overrides even with !important"
  evidence: ".wk-mobile-headshot { display: flex } has no !important; our 2-class selector + !important wins"
  timestamp: 2026-06-08

## Resolution
root_cause: "Commit e0afde7 patched only src/styles/wolknitive-base.css; subsequent direct edits to docs/ HTML files adding the same CSS fix were never committed, so GitHub Pages continued serving the unfixed deployed version."
fix: "Commit all 6 locally-modified HTML files (docs/index.html, docs/de/index.html, docs/es/index.html, docs/404.html, dist/index.html, dist/404.html) and push to main"
verification: "Committed fdcda02 and pushed to origin/master. GitHub Pages will redeploy (allow 1-5 min). CSS fix .wk-mobile-headshot.wk-mobile-hidden { display: none !important } now live in all docs/ HTML files."
files_changed: [docs/index.html, docs/de/index.html, docs/es/index.html, docs/404.html, dist/index.html, dist/404.html]
