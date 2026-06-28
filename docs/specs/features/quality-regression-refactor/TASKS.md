# TASKS: quality-regression-refactor

## Current Task

- Status: Proposed
- Scope:
  reassess the remaining `v1.15.1..HEAD` qlty smell clusters and select the
  next small behavior-preserving remediation slice.
- Acceptance:
  choose a focused slice that can be approved, implemented, reviewed, tested,
  and committed independently while preserving desktop and web behavior.
- Validation:
  planning-only validation until a new implementation slice is approved.

## Human Approval

- Status: Pending
- Approved at:
- Approved scope:

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Active Tasks

- [x] Establish `v1.15.1` as the qlty comparison baseline.
- [x] Capture qlty smell and metrics clusters against `v1.15.1`.
- [x] Record temporary feature scope and non-goals.
- [x] Obtain human implementation approval for the first remediation slice.
- [x] Use targeted qlty metrics/smells to choose exact viewer files before
      editing runtime code.
- [x] Apply behavior-preserving viewer presentation refactors.
- [x] Update or add focused tests only where behavior protection is needed.
- [x] Run required validation.
- [ ] Reassess remaining qlty clusters and decide the next slice or closure.

## Validation

- [x] Before implementation: docs-only validation for this planning update.
- [x] During implementation: targeted qlty checks for touched files.
- [x] After implementation: `CI=true rtk pnpm run qlty`.
- [x] After implementation: `CI=true rtk pnpm test`.
- [x] After implementation: `CI=true rtk pnpm run test:web`.
- [x] After implementation: `CI=true rtk pnpm run build`.

## Use-Case Back-Propagation

- No behavior changes are planned.
- If implementation reveals an intended or unavoidable behavior change, stop
  and update the relevant use case before requesting expanded approval.

## Decision Notes

- The user explicitly permits active refactoring beyond the direct changed
  range when needed to meet qlty parity, but behavior preservation and SDD
  approval gates still apply.
- The first completed slice removed qlty smells from flow MiniMap color
  resolution and shared responsive panel collapse state while preserving
  existing viewer behavior.
