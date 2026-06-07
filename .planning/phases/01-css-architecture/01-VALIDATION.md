---
phase: 1
slug: css-architecture
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-07
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — manual visual verification + grep assertions |
| **Config file** | none |
| **Quick run command** | `npm run typecheck && grep -c "style={" src/pages/home.tsx` (should be 0 after Plan 1 extraction) |
| **Full suite command** | `npm run dev && echo "Visually verify all 7 sections at localhost:{PORT}"` |
| **Estimated runtime** | ~30 seconds (typecheck) + manual visual check |

---

## Sampling Rate

- **After every task commit:** Run `npm run typecheck`
- **After every plan wave:** Run typecheck + grep counts for style={}, onMouseEnter, framer-motion, lucide-react
- **Before `/gsd-verify-work`:** Full suite must be green (typecheck + grep assertions + visual verification)
- **Max feedback latency:** 30 seconds

---

## Per-task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | VIZ-06, QLT-01 | T-01-01 / — | N/A — CSS extraction, no user input | grep | `grep -c "style={" src/pages/home.tsx` | ✅ | ⬜ pending |
| 1-01-02 | 01 | 1 | DEP-05, STC-02, INF-06 | T-01-02 / — | N/A | grep | `grep -c "@tailwind" src/index.css` | ✅ | ⬜ pending |
| 1-01-03 | 01 | 1 | VIZ-01, VIZ-02, VIZ-03, VIZ-04 | — | N/A | manual | `npm run dev` + visual check | ✅ | ⬜ pending |
| 1-02-01 | 02 | 1 | DEP-04, VIZ-07, VIZ-05 | T-01-03 / — | N/A | grep | `grep -c "framer-motion\|FadeIn" src/pages/home.tsx src/components/` | ✅ | ⬜ pending |
| 1-02-02 | 02 | 1 | DEP-09, QLT-03 | T-01-04 / — | N/A — SVG icons are static | grep | `grep -c "lucide-react" src/pages/home.tsx && grep -c "onMouseEnter\|onMouseLeave" src/pages/home.tsx` | ✅ | ⬜ pending |
| 1-03-01 | 03 | 2 | INF-05 | T-01-05 / — | N/A | grep | `grep "@media.*prefers-color-scheme.*dark" src/styles/*.css` | ✅ | ⬜ pending |

---

## Wave 0 Requirements

- [ ] `npm run typecheck` — existing TypeScript check (already configured)
- [ ] dev server start (`npm run dev`) — existing dev command

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual parity of 7 sections | VIZ-01 through VIZ-07 | CSS visual rendering requires human comparison | Open dev server, compare each section (hero, nav, skills, experience, clients, CTA, footer) against current live site at Replit URL. Verify identical layout, colors, spacing, fonts, icon appearance, animations. |
| Hover interactions on nav links, CTA buttons, client cards | QLT-03 | CSS hover states require manual interaction | Hover each interactive element: nav links (should turn teal), CTA buttons (should darken), client cards (should lift). Verify smooth transitions. |
| Scroll-triggered animations | VIZ-07 | Requires physical scrolling | Scroll through page. Verify each section's cards animate in (fade up) on first scroll-into-view. Verify staggered delays on skill cards. |
| Dark mode rendering | INF-05 | Requires OS-level dark mode toggle | Toggle system `prefers-color-scheme` to dark in dev tools. Verify all colors invert correctly per CONTEXT.md D-01 through D-07. Verify text is readable, images visible, interactive elements visible. |
| Print preview | INF-06 | Requires print dialog or dev tools print emulation | Open print preview (Cmd+P or dev tools → Rendering → Emulate CSS media type `print`). Verify nav, CTA section, scroll hint, hero decorative panel are hidden. Verify grids collapse to single column. Verify brand colors preserved. |
| Mobile responsive layout | STC-02, VIZ-01-04 | Requires responsive mode testing | Test at 375px (mobile), 768px (tablet), 1024px+ (desktop). Verify grid column counts change correctly. Verify nav collapses to hamburger on mobile. Verify hero content stacks vertically on mobile. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30 seconds
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
