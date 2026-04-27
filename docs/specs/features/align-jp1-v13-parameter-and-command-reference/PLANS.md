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
- Prepared the next category-level helper-boundary slice for transfer
  operation parameters in `TRANSFER_OPERATION_ALIGNMENT.md`.
- Extracted `top1` to `top4` default resolution into
  `transferOperationHelpers.ts` while preserving explicit and derived values.

## Impact Investigation

- Planned change: move `top1` to `top4` default resolution out of the generic
  `parameterHelpers.ts` module and into a transfer-operation helper seam.
- Affected files:
  `src/domain/models/parameters/parameterHelpers.ts`,
  `src/domain/models/parameters/transferOperationHelpers.ts`,
  `src/domain/models/parameters/transferOperationParameterBuilders.ts`,
  `src/test/suite/parameterHelpers.test.ts`, and this feature's SDD docs.
- Affected features: JP1/AJS parameter interpretation for UNIX/PC job and
  UNIX/PC custom job transfer operation defaults.
- Tests affected: parameter helper and parameter factory regression tests.
- Breaking-change risk: low. The intended behavior preserves current explicit
  and derived `topN` values while narrowing the owning helper boundary.
- Alternatives considered: leave `topN` logic in `parameterHelpers.ts`; this
  was rejected because the schedule-rule slice established category-specific
  helper seams and `topN` has transfer-specific paired-parameter semantics.

## Follow-up

- Apply the same value parsing audit/refactor workflow to other parameter
  categories before marking them official-reference aligned.
- Build a parameter-coverage matrix when category-level status needs tracking
  beyond the current audit summary.
- Revisit QUEUE job transfer-file coverage separately because the manual
  defines `tsN` and `tdN` but not `topN`.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run qlty`; add `pnpm run lint:md` when useful
