# TASKS: qlty-driven-architecture-refactoring

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Keep this file focused on current state and future decisions. Retain prior
  approvals, validation details, or implementation notes only when they affect
  the next decision, re-approval boundary, or unresolved risk.

## Current Status

- Runtime status:
  Slice-2-Y implementation is complete.
- Active slice:
  none; Slice-2-Y is complete and the next Slice-2 target is not selected.
- Open follow-up:
  after Slice-2-Y, decide whether Slice-2 continues with
  `syntaxDiagnosticRuleBuilders`, `syntaxDiagnosticScalarValidators`, or closes
  application orchestration work.

## Human Approval

- Status: Pending
- Approved at:
  none
- Approved scope:
  none

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.

## Active Tasks

- [x] Reframe retained SDD records around future decision context.
- [x] Select Slice-2-Y `syntaxDiagnosticScheduleRules.ts` remaining
      smell/metric cluster as the next implementation candidate.
- [x] Record Slice-2-Y impact investigation.
- [x] Request human approval for the selected Slice-2-Y implementation scope.
- [x] Record human approval for Slice-2-Y.
- [x] Complete Slice-2-Y `syntaxDiagnosticScheduleRules.ts` remaining
      smell/metric cluster.
- [ ] Decide whether Slice-2 continues or closes after Slice-2-Y.

## Validation

- docs-only changes:
  `rtk pnpm run qlty`
- Slice-2-Y implementation:
  targeted `ln`/`cftd`/`wc` diagnostics coverage, then
  `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`

## Current Investigation Notes

- Slice-2-Y targets the remaining `syntaxDiagnosticScheduleRules.ts` smell and
  metric cluster because Qlty reports high total complexity, metrics of 35
  funcs / cyclo 193 / complexity 111 / LOC 389, and remaining findings around
  `isValidExplicitParentScheduleRule`,
  `isValidExplicitScheduleByDaysFromStart`, and `isValidExplicitWaitCount`.
- Slice-2-Y impact is local to
  `src/application/editor-feedback/syntaxDiagnosticScheduleRules.ts`; Serena
  and targeted search found direct production usage from
  `buildScheduleRuleDiagnostics` in
  `src/application/editor-feedback/syntaxDiagnosticRuleBuilders.ts` for `ln`,
  `cftd`, and `wc` diagnostics.
- Slice-2-Y must preserve root-unit `ln` allowance, explicit schedule rule
  number bounds, accepted `ln`/`cftd`/`wc` forms, empty `cftd` segment
  rejection, optional 1..31 validation, wait-count bounds, diagnostic message
  text, parser/generated artifacts, presentation behavior, VS Code
  compatibility, web compatibility, and `engines.vscode`.
- Existing `buildSyntaxDiagnostics.test.ts` coverage exercises valid and
  invalid `ln`, `cftd`, and `wc` diagnostics.
- Slice-2-Y was approved by the user at 2026-05-26 23:03 JST for the
  `syntaxDiagnosticScheduleRules.ts` remaining smell/metric cluster.
- Slice-2-Y preserved `ln`, `cftd`, and `wc` diagnostics while extracting
  shared explicit schedule-rule parsing, numeric range validation, and `cftd`
  rule-table validation helpers. Targeted Qlty smell output no longer reports
  `isValidExplicitParentScheduleRule`, `isValidExplicitScheduleByDaysFromStart`,
  or `isValidExplicitWaitCount`. File metrics changed from 35 funcs / cyclo
  193 / complexity 111 / LOC 389 to 40 funcs / cyclo 183 / complexity 93 /
  LOC 405; the function-count increase is accepted for this slice because it
  removes the targeted branch-heavy smell cluster and lowers cyclomatic and
  aggregate complexity.
