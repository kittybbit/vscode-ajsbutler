# TASKS: quality-regression-refactor

## Current Task

- Status: Proposed
- Scope:
  reassess remaining `v1.15.1..HEAD` qlty smell and metrics clusters after the
  viewer wiring cleanup, then choose the next small behavior-preserving
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

- [x] Reassess remaining `v1.15.1` qlty smell and metrics clusters after the
      unit-list detail slice.
- [x] Select the next focused remediation slice.
- [x] Obtain human implementation approval for the viewer wiring slice.
- [x] Apply behavior-preserving counterpart reveal wiring refactors.
- [x] Update focused tests only if behavior protection needs a new case.
- [x] Run required validation.
- [ ] Reassess remaining qlty clusters and decide the next slice or closure.

## Validation

- [x] During implementation: targeted qlty checks for touched files.
- [x] During implementation: focused `Viewer wiring` tests.
- [x] After implementation: `CI=true rtk pnpm run qlty`.
- [x] After implementation: `CI=true rtk pnpm test`.
- [x] After implementation: `CI=true rtk pnpm run test:web`.
      Initial sandbox run failed with Chromium Mach port permission; approved
      rerun passed.
- [x] After implementation: `CI=true rtk pnpm run build`.

## Use-Case Back-Propagation

- No behavior changes are planned.
- If implementation reveals an intended or unavoidable behavior change, stop
  and update the relevant use case before requesting expanded approval.

## Decision Notes

- The user explicitly permits active refactoring beyond the direct changed
  range when needed to meet qlty parity, but behavior preservation and SDD
  approval gates still apply.
- Remaining `v1.15.1` qlty findings are still broad, but
  `viewerWiring.ts` has a compact, behavior-significant cluster:
  `revealCounterpartPanel` high complexity and
  `revealCounterpartFromNavigation` parameter count.
- Direct references are limited to `viewerWiring.ts` and
  `src/test/suite/viewerWiring.test.ts`; the behavior maps to
  `uc-navigate-between-unit-list-and-flow-graph.md`.
- The completed viewer wiring slice removed the targeted qlty smells by
  splitting counterpart reveal posting, existing-panel reveal, missing-panel
  open, and navigation dependency passing while preserving viewer event DTOs,
  webview message contracts, command IDs, telemetry payloads, and VS Code
  compatibility.
