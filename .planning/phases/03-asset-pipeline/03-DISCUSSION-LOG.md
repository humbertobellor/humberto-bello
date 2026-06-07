# Phase 3: Asset Pipeline + Dead Code Cleanup - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-07
**Phase:** 03-asset-pipeline
**Areas discussed:** Asset copy integration, Dead code deletion, package.json cleanup, Image source layout, LinkedIn URL fix

---

## Asset Copy Integration

| Option | Description | Selected |
|--------|-------------|----------|
| Extend build.mjs | Add font + image copy steps directly in scripts/build.mjs | ✓ |
| Separate copy script | Create scripts/copy-assets.mjs called from build | |

**User's choice:** Extend build.mjs
**Notes:** Single command keeps things simple. Build script already scaffolds the directories.

---

## Dead Code Deletion

| Option | Description | Selected |
|--------|-------------|----------|
| Physical deletion | Delete src/components/ui/ directory, Changelog.tsx, and api-client-react dep | ✓ |
| Just stop importing | Remove imports but leave files on disk | |

**User's choice:** Physical deletion
**Notes:** Clean slate approach. Must verify no imports remain.

---

## package.json Cleanup

| Option | Description | Selected |
|--------|-------------|----------|
| Radical strip | Keep only i18next + i18next-browser-languagedetector + @types/node + typescript | ✓ |
| Cautious strip | Remove only known-unused deps | |

**User's choice:** Radical strip
**Notes:** ~35 deps removed. Only runtime i18next deps + dev typescript/types remain.

---

## Image Source Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Direct to dist | Skip src/images/ staging. Build.mjs copies directly from attached_assets to dist/images/ | ✓ |
| Stage in src/images/ | Follow original D-11: copy to src/images/ first, then build.mjs copies to dist | |

**User's choice:** Direct to dist
**Notes:** Simpler, fewer copies. Path rewriting already works for /images/ paths.

---

## LinkedIn URL Fix

| Option | Description | Selected |
|--------|-------------|----------|
| Fix href only | Single change: home.tsx line 665 | ✓ |
| Full search + replace | Find all linkedin.com occurrences across repo | |

**User's choice:** Fix href only
**Notes:** Locale labels are already correct. Just the placeholder URL needs fixing.

---

## OpenCode's Discretion

- Order of copy operations within build.mjs
- Exact verification approach for orphaned imports
- pnpm-lock.yaml regeneration after dep removal

## Deferred Ideas

None — discussion stayed within phase scope.
