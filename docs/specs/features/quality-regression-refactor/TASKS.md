# TASKS: quality-regression-refactor

## Current Task

- Status: Proposed
- Scope:
  reassess remaining `v1.15.1..HEAD` qlty smell and metrics clusters after the
  unit-type label resolver cleanup, then choose the next small
  behavior-preserving remediation slice or close the temporary feature if
  parity is reached.
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
- [x] Reassess remaining qlty clusters after the viewer wiring slice.
- [x] Select the viewer event bridge remediation slice.
- [x] Obtain human implementation approval for the viewer event bridge slice.
- [x] Apply behavior-preserving viewer event bridge refactors.
- [x] Update focused tests only if behavior protection needs a new case.
- [x] Run required validation.
- [x] Reassess remaining qlty clusters and decide the next slice or closure.
- [x] Select the unit-type label resolver remediation slice.
- [x] Obtain human implementation approval for the unit-type label resolver
      slice.
- [x] Apply behavior-preserving unit-type label resolver refactors.
- [x] Update focused tests only if behavior protection needs a new case.
- [x] Run required validation.
- [ ] Reassess remaining qlty clusters and decide the next slice or closure.

## Validation

- [x] During planning: baseline qlty smell check against `v1.15.1`.
- [x] During planning: baseline qlty metrics check against `v1.15.1`.
- [x] During planning: targeted qlty smell and function metrics checks for
      candidate files.
- [x] During implementation: targeted qlty checks for touched files.
- [x] During implementation: focused `NLS` tests.
- [x] After implementation: `CI=true rtk pnpm run qlty`.
- [x] After implementation: `CI=true rtk pnpm test`.
      VS Code version lookup timed out, then the existing VS Code 1.126.0
      install was used successfully.
- [x] After implementation: `CI=true rtk pnpm run test:web`.
- [x] After implementation: `CI=true rtk pnpm run build`.
      Production webpack emitted existing bundle-size performance warnings.

## Use-Case Back-Propagation

- No behavior changes are planned.
- If implementation reveals an intended or unavoidable behavior change, stop
  and update the relevant use case before requesting expanded approval.

## Decision Notes

- The user explicitly permits active refactoring beyond the direct changed
  range when needed to meet qlty parity, but behavior preservation and SDD
  approval gates still apply.
- The completed viewer wiring slice removed the targeted qlty smells by
  splitting counterpart reveal posting, existing-panel reveal, missing-panel
  open, and navigation dependency passing while preserving viewer event DTOs,
  webview message contracts, command IDs, telemetry payloads, and VS Code
  compatibility.
- The completed viewer event bridge slice removed the targeted qlty smells by
  splitting message validation, payload dispatch, and callback list management
  while preserving shared event DTOs, the global bridge shape, React bootstrap
  wiring, VS Code-facing message routing, telemetry payloads, and VS Code
  compatibility.
- Remaining qlty smells still include broad flow/table presentation clusters
  and several boundary parameter-list smells. The next selected slice is the
  compact `unitTypeLabel` complexity smell because it is pure domain/i18n
  logic, has existing coverage in `nls.test.ts`, and feeds both unit-list and
  flow presentation without requiring parser, DTO, VS Code API, or webview
  message contract changes.
- Targeted qlty evidence for the selected slice: `unitTypeLabel` currently
  reports cyclomatic complexity 8, cognitive complexity 6, and a high
  complexity smell count of 6. The intended remediation is to replace branching
  with explicit lookup/resolver helpers while preserving the current public
  function signature and fallback behavior.
- Planning checks used baseline qlty smell/metrics comparisons against
  `v1.15.1` and targeted qlty checks for `nls.ts` and
  `flowRelationshipFocus.ts`.
- The completed unit-type label resolver slice removed the targeted
  `unitTypeLabel` qlty complexity smell by splitting group-type key resolution,
  group-label lookup, and known-unit-type dispatch while preserving localized
  labels, generic group fallback, unknown unit-type fallback, domain
  independence from presentation frameworks, VS Code compatibility, and web
  extension compatibility.
