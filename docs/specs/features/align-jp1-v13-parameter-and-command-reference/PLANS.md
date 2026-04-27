# PLANS: align-jp1-v13-parameter-and-command-reference

## Objective

Move parameter interpretation and supported `ajs` command generation onto
explicit JP1/AJS3 version 13 reference-driven contracts.

## Scope

- Align parameter parsing with the Definition File Reference.
- Keep generated command support tied to the Command Reference.
- Expand command and parameter support incrementally.

## Delivered

- Recorded the current parameter and command-generation audit in `AUDIT.md`.
- Extracted `ajsshow` and `ajsprint` generation into
  `buildAjsCommands(...)`.
- Added command-builder metadata for the supported commands.
- Localized command-builder labels, descriptions, and manual links through the
  existing message resources.
- Prepared the schedule-rule parameter slice in
  `SCHEDULE_RULE_ALIGNMENT.md`.
- Added behavior-preserving schedule-rule regression tests for thin evidence
  before changing helper semantics.
- Implemented the first behavior-changing schedule-rule alignment fix by
  ignoring `ln` on root jobnets.
- Started category-level value parsing alignment with the schedule-rule
  parameter family, using shared domain helpers as the boundary pattern.

## Follow-up

- Apply the same value parsing audit/refactor workflow to other parameter
  categories before marking them official-reference aligned.
- Build a parameter-coverage matrix when category-level status needs tracking
  beyond the current audit summary.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run lint:md`
