# TASKS: quality-regression-refactor

## Current Task

- Status: Proposed
- Scope:
  reassess remaining `v1.15.1..HEAD` qlty smell and metrics clusters after the
  unit-list detail cleanup, then choose the next small behavior-preserving
  remediation slice or close the temporary feature if parity is reached.
- Acceptance:
  record whether another focused slice is needed, keep behavior-preserving
  scope explicit, and require fresh human approval before any additional
  runtime, test, generated artifact, or configuration edits.
- Validation:
  planning-only validation until a new implementation slice is approved.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope:

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Active Tasks

- [x] Reassess remaining `v1.15.1` qlty smell clusters after the first slice.
- [x] Select the next focused viewer-presentation remediation slice.
- [x] Obtain human implementation approval for the unit-list detail slice.
- [x] Use targeted qlty metrics/smells to guide the exact helper split.
- [x] Apply behavior-preserving unit-list detail refactors.
- [x] Update or add focused tests only if behavior protection needs a new case.
- [x] Run required validation.
- [ ] Reassess remaining qlty clusters and decide the next slice or closure.

## Validation

- [x] Before implementation: docs-only validation for this planning update.
- [x] During implementation: targeted qlty checks for touched files.
- [x] During implementation: focused `Show Unit Definition interaction` test.
- [x] After implementation: `CI=true rtk pnpm run qlty`.
- [x] After implementation: `CI=true rtk pnpm test`.
- [x] After implementation: `CI=true rtk pnpm run build`.
- [ ] After implementation: `CI=true rtk pnpm run test:web`.
      The command was attempted in the sandbox and again with approval, but the
      web runner failed before test execution with external HTTPS
      `ETIMEDOUT`.

## Use-Case Back-Propagation

- No behavior changes are planned.
- If implementation reveals an intended or unavoidable behavior change, stop
  and update the relevant use case before requesting expanded approval.

## Decision Notes

- The user explicitly permits active refactoring beyond the direct changed
  range when needed to meet qlty parity, but behavior preservation and SDD
  approval gates still apply.
- The completed first slice removed qlty smells from flow MiniMap color
  resolution and shared responsive panel collapse state while preserving
  existing viewer behavior.
- The next slice targets `unitListDetail.ts` because qlty findings are
  concentrated in presentation-local selected-detail summary helpers and the
  direct references are limited to `TableContents.tsx` and
  `showUnitDefinitionInteraction.test.ts`.
- The completed unit-list detail slice removed targeted qlty smells by
  splitting selected-detail resolution, relation traversal, cache lookup, and
  schedule checks while preserving DTOs and selected-unit behavior.
