---
phase: 03
slug: asset-pipeline
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-07
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — grep/file-existence based (no test runner configured) |
| **Config file** | none |
| **Quick run command** | `npm run build && echo "Build OK"` |
| **Full suite command** | `npm run build && grep -c "headshot-corp" dist/index.html && ls dist/fonts/*.woff2 | wc -l` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build` (quick check for build breakage)
- **After every plan wave:** Run complete grep/file checks
- **Before `/gsd-verify-work`:** All verification checks must pass
- **Max feedback latency:** 5 seconds

---

## Per-task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | STC-04 | T-03-01 / — | Hardcoded source paths | file-exists | `ls dist/fonts/*.woff2 \| wc -l` | ✅ | ⬜ pending |
| 03-01-02 | 01 | 1 | STC-03 | T-03-01 / — | Hardcoded source paths | file-exists | `ls dist/images/headshot* \| wc -l` | ✅ | ⬜ pending |
| 03-02-01 | 02 | 2 | DEP-02, DEP-03, INF-07 | T-03-02 / — | Pre-verifies zero orphan imports | file-exists | `test ! -f src/components/ui/button.tsx` | ✅ | ⬜ pending |
| 03-02-02 | 02 | 2 | QLT-04, SEO-04 | T-03-03 / — | Standard dep removal | grep | `rg "humberto-bello" src/html/cta.html` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] No test framework needed — verification is file-existence and grep-based

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual integrity of built page | STC-03, STC-04 | Cannot automate image rendering check | Open `dist/index.html` in browser — verify hero headshot loads, fonts render correctly (no fallback fonts) |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
