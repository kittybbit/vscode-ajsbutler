# TASKS: qlty-driven-architecture-refactoring

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Keep this file focused on current state and future decisions. Retain prior
  approvals, validation details, or implementation notes only when they affect
  the next decision, re-approval boundary, or unresolved risk.

## Current Status

- Runtime status:
  Slice-3-A implementation is complete.
- Active slice:
  none.
- Open follow-up:
  choose the next Slice-3 domain-helper candidate.

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
- [x] Decide whether Slice-2 continues or closes after Slice-2-Z.
- [x] Select Slice-2-AA `syntaxDiagnosticRuleBuilders.ts` same-file
      high-complexity cluster as the next implementation candidate.
- [x] Record Slice-2-AA impact investigation.
- [x] Request human approval for the selected Slice-2-AA implementation scope.
- [x] Record human approval for Slice-2-AA.
- [x] Complete Slice-2-AA `syntaxDiagnosticRuleBuilders.ts` same-file
      high-complexity cluster.
- [x] Decide whether Slice-2 continues or closes after Slice-2-AA.
- [x] Select Slice-2-AB `syntaxDiagnosticScalarValidators.ts`
      `parseExplicitDecimalInRange` input-shape cleanup as the final Slice-2
      implementation candidate.
- [x] Record Slice-2-AB impact investigation.
- [x] Request human approval for the selected Slice-2-AB implementation scope.
- [x] Record human approval for Slice-2-AB.
- [x] Complete Slice-2-AB `syntaxDiagnosticScalarValidators.ts`
      `parseExplicitDecimalInRange` input-shape cleanup.
- [x] Close Slice-2 application orchestration work after Slice-2-AB.
- [x] Select Slice-3-A `unitPriorityHelpers.ts` priority-resolution helper
      cleanup as the first Slice-3 domain-helper candidate.
- [x] Record Slice-3-A impact investigation.
- [x] Request human approval for the selected Slice-3-A implementation scope.
- [x] Record human approval for Slice-3-A.
- [x] Complete Slice-3-A `unitPriorityHelpers.ts` priority-resolution helper
      cleanup.
- [ ] Decide the next Slice-3 domain-helper candidate after Slice-3-A.

## Validation

- docs-only changes:
  `rtk pnpm run qlty`
- Slice-2-AB implementation:
  targeted decimal range, threshold, event search, and file monitoring
  diagnostics coverage, then
  `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`
- Slice-3-A implementation:
  targeted `unitPriorityHelpers.test.ts` and
  `unitCapabilityEntities.test.ts`, then `rtk pnpm run qlty`,
  `rtk pnpm test`, `rtk pnpm run test:web`, and `rtk pnpm run build`

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
- Slice-2-AA preserved schedule-rule, job-end judgment, threshold-ordering,
  and start-condition disabled-parameter diagnostics while moving rule-builder
  orchestration into local rule tables, context helpers, and focused
  diagnostic collectors inside `syntaxDiagnosticRuleBuilders.ts`.
- Targeted Qlty metrics for `syntaxDiagnosticRuleBuilders.ts` changed from
  18 funcs / cyclo 37 / complexity 56 / LOC 332 before Slice-2-AA to
  30 funcs / cyclo 34 / complexity 26 / LOC 386. Targeted smell output reports
  no findings; `rtk pnpm run qlty` reports no issues.
- Slice-2-AB changed `parseExplicitDecimalInRange` to use one input object and
  updated direct application/editor-feedback call sites. Decimal parsing,
  optional negative-number support, inclusive range bounds, undefined handling,
  diagnostic messages, parser/generated artifacts, presentation behavior, VS
  Code compatibility, web compatibility, and `engines.vscode` are preserved.
- Targeted Qlty metrics for `syntaxDiagnosticScalarValidators.ts` changed from
  9 funcs / cyclo 16 / complexity 13 / LOC 57 before Slice-2-AB to 9 funcs /
  cyclo 16 / complexity 13 / LOC 63. Targeted smell output reports no
  findings.
- Slice-2 application orchestration work is closed. The next SDD decision is
  the first Slice-3 domain-helper candidate.
- Slice-3-A targets `unitPriorityHelpers.ts` because targeted domain Qlty
  reports `resolveUnitPriority` many-returns/high-complexity findings and a
  nested `getPrPriority` high-complexity finding. Current file metrics are
  1 class / 6 funcs / cyclo 31 / complexity 31 / LOC 52.
- Impact is local to the domain helper. Direct production use flows through
  `WaitableUnitEntity.priority` in `unitCapabilityEntities.ts`. Existing
  `unitPriorityHelpers.test.ts` and `unitCapabilityEntities.test.ts` cover
  explicit `pr`, explicit `ni`, parent `n`/`rn` inheritance, inherited
  priority suppression, and default priority.
- Slice-3-A must preserve priority precedence: when both explicit `pr` and
  `ni` exist, the later source wins; inherited `pr`/`ni` are ignored; `n`/`rn`
  parent priority is inherited; fallback priority remains 1.
- Slice-3-A changed `unitPriorityHelpers.ts` to resolve explicit `pr`/`ni`
  sources through small local helpers and then fall back to parent/default
  priority. Public exports, priority semantics, parser/generated artifacts,
  application projections, VS Code/web compatibility, and `engines.vscode` are
  preserved.
- Targeted Qlty metrics for `unitPriorityHelpers.ts` changed from 1 class /
  6 funcs / cyclo 31 / complexity 31 / LOC 52 before Slice-3-A to 1 class /
  8 funcs / cyclo 23 / complexity 10 / LOC 51. Targeted smell output reports
  no findings.
