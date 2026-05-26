# TASKS: qlty-driven-architecture-refactoring

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Keep this file focused on current state and future decisions. Retain prior
  approvals, validation details, or implementation notes only when they affect
  the next decision, re-approval boundary, or unresolved risk.

## Current Status

- Runtime status:
  Slice-2-Z implementation is complete; Slice-2 continuation decision is
  pending.
- Active slice:
  none.
- Open follow-up:
  decide whether Slice-2 continues with `syntaxDiagnosticRuleBuilders`,
  `syntaxDiagnosticScalarValidators`, or closes application orchestration work.

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
- [x] Select Slice-2-Z `syntaxDiagnosticScheduleRules.ts` residual
      smell/metric cluster as the next implementation candidate.
- [x] Record Slice-2-Z impact investigation.
- [x] Request human approval for the selected Slice-2-Z implementation scope.
- [x] Record human approval for Slice-2-Z.
- [x] Complete Slice-2-Z `syntaxDiagnosticScheduleRules.ts` residual
      smell/metric cluster.
- [ ] Decide whether Slice-2 continues or closes after Slice-2-Z.

## Validation

- docs-only changes:
  `rtk pnpm run qlty`
- Slice-2-Z implementation:
  targeted schedule-rule diagnostics coverage, then
  `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`

## Current Investigation Notes

- Slice-2-Z preserved schedule date, time, cycle, weekly-cycle,
  open/closed-day, and shift-day diagnostics while sharing number-range,
  month-limit, optional parsing, and explicit-cycle helpers inside
  `syntaxDiagnosticScheduleRules.ts`.
- Targeted Qlty metrics for `syntaxDiagnosticScheduleRules.ts` changed from
  40 funcs / cyclo 183 / complexity 93 / LOC 405 before Slice-2-Z to
  46 funcs / cyclo 139 / complexity 72 / LOC 412. Targeted smell output still
  reports file-level high total complexity only; `rtk pnpm run qlty` reports no
  issues.
- Next decision should consider whether continuing Slice-2 in
  `syntaxDiagnosticRuleBuilders` or `syntaxDiagnosticScalarValidators` is more
  valuable than closing application orchestration work and moving to Slice-3.
