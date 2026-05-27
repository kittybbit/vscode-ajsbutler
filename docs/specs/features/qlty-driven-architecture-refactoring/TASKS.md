# TASKS: qlty-driven-architecture-refactoring

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Keep this file focused on current state and future decisions. Retain prior
  approvals, validation details, or implementation notes only when they affect
  the next decision, re-approval boundary, or unresolved risk.

## Current Status

- Runtime status:
  Slice-3-F investigation is complete; implementation is waiting for approval.
- Active slice:
  Slice-3-F `ScheduleRule.ts` schedule-rule parameter smell/metric cleanup.
- Open follow-up:
  none.

## Human Approval

- Status: Pending
- Approved at:
  none
- Approved scope:
  Planned Slice-3-F scope: refactor only
  `src/domain/models/parameters/ScheduleRule.ts` to reduce the same-file
  `Sd.type` many-returns/high-complexity smell and the local schedule-rule
  parameter duplication while preserving public parameter classes, schedule
  rule parsing semantics, unit-list projections, diagnostics behavior,
  parser/generated artifacts, VS Code compatibility, web compatibility, and
  `engines.vscode`.

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
- [x] Decide the next Slice-3 domain-helper candidate after Slice-3-A.
- [x] Select Slice-3-B `unitGroupStateHelpers.ts` week-state helper cleanup as
      the next domain-helper candidate.
- [x] Record Slice-3-B impact investigation.
- [x] Request human approval for the selected Slice-3-B implementation scope.
- [x] Record human approval for Slice-3-B.
- [x] Complete Slice-3-B `unitGroupStateHelpers.ts` week-state helper cleanup.
- [x] Decide the next Slice-3 domain-helper candidate after Slice-3-B.
- [x] Select Slice-3-C `unitEdgeHelpers.ts` unit-edge parser helper cleanup as
      the next domain-helper candidate.
- [x] Record Slice-3-C impact investigation.
- [x] Request human approval for the selected Slice-3-C implementation scope.
- [x] Record human approval for Slice-3-C.
- [x] Complete Slice-3-C `unitEdgeHelpers.ts` unit-edge parser helper cleanup.
- [x] Decide the next Slice-3 domain-helper candidate after Slice-3-C.
- [x] Select Slice-3-D `PlainString.ts` smell/metric cleanup as the next
      domain-helper candidate.
- [x] Record Slice-3-D impact investigation.
- [x] Request human approval for the selected Slice-3-D implementation scope.
- [x] Record human approval for Slice-3-D.
- [x] Complete Slice-3-D `PlainString.ts` smell/metric cleanup.
- [x] Decide the next Slice-3 domain-helper candidate after Slice-3-D.
- [x] Select Slice-3-E `transferOperationHelpers.ts` transfer-operation
      default helper cleanup as the next domain-helper candidate.
- [x] Record Slice-3-E impact investigation.
- [x] Request human approval for the selected Slice-3-E implementation scope.
- [x] Record human approval for Slice-3-E.
- [x] Complete Slice-3-E `transferOperationHelpers.ts` transfer-operation
      default helper cleanup.
- [x] Decide the next Slice-3 domain-helper candidate after Slice-3-E.
- [x] Select Slice-3-F `ScheduleRule.ts` schedule-rule parameter
      smell/metric cleanup as the next domain candidate.
- [x] Record Slice-3-F impact investigation.
- [x] Request human approval for the selected Slice-3-F implementation scope.
- [ ] Record human approval for Slice-3-F.
- [ ] Complete Slice-3-F `ScheduleRule.ts` schedule-rule parameter
      smell/metric cleanup.

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
- Slice-3-B implementation:
  targeted `unitGroupStateHelpers.test.ts`, `groupEntity.test.ts`,
  `buildUnitListGroup6View.test.ts`, and `buildUnitListView.test.ts`, then
  `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`
- Slice-3-C implementation:
  targeted `unitEdgeHelpers.test.ts`, relation normalization coverage, and
  linked-unit/unit-list relation coverage, then `rtk pnpm run qlty`,
  `rtk pnpm test`, `rtk pnpm run test:web`, and `rtk pnpm run build`
- Slice-3-D implementation:
  targeted unit priority and unit-list priority coverage, then
  `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`
- Slice-3-E implementation:
  targeted `parameterHelpers.test.ts`, `parameterFactory.test.ts`, and
  `buildUnitListRemainingGroups.test.ts` transfer-operation coverage, then
  `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`
- Slice-3-F implementation:
  targeted `parameterFactory.test.ts`, `parameterHelpers.test.ts`,
  `buildUnitListGroup10View.test.ts`, and `buildUnitListView.test.ts`
  schedule-rule coverage, then `rtk pnpm run qlty`, `rtk pnpm test`,
  `rtk pnpm run test:web`, and `rtk pnpm run build`

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
- Slice-3-B targets `unitGroupStateHelpers.ts` because targeted domain Qlty
  reports `resolveGroupWeekState` many-returns and high-complexity findings.
  Current file metrics are 0 classes / 3 funcs / cyclo 14 / complexity 10 /
  LOC 26.
- Impact is local to the group week-state domain helper. Production use flows
  through `G.#resolveWeekState` for weekday getters and then unit-list group6
  projections. Existing tests cover unsupported group types, planning group
  detection, open calendar precedence, close calendar fallback, and undefined
  fallback.
- Slice-3-B must preserve open-calendar precedence over close-calendar values,
  close-calendar false fallback, and undefined when neither calendar source
  marks the requested week.
- Slice-3-B changed `unitGroupStateHelpers.ts` to resolve week-state candidates
  through small local helpers while preserving public exports, open-calendar
  precedence, close-calendar fallback, undefined fallback, parser/generated
  artifacts, application projections, VS Code/web compatibility, and
  `engines.vscode`.
- Targeted Qlty metrics for `unitGroupStateHelpers.ts` changed from
  0 classes / 3 funcs / cyclo 14 / complexity 10 / LOC 26 before Slice-3-B to
  0 classes / 6 funcs / cyclo 12 / complexity 5 / LOC 29. Targeted smell
  output reports no findings.
- Slice-3-C targets `unitEdgeHelpers.ts` because targeted domain Qlty reports
  `parseUnitEdge` many-returns and high-complexity findings. Current file
  metrics are 0 classes / 2 funcs / cyclo 11 / complexity 12 / LOC 33.
- Impact is local to unit-edge parsing. Production use flows through
  `parseNormalizedRelation` for normalized `ar` relations and through `Ar`
  parameter getters for source, target, and relation type access. Existing
  tests cover relation strings with and without relation type, missing target,
  undefined input, required relation type, normalization, linked-unit
  relation display, and unit-list relation projection.
- Slice-3-C must preserve source/target extraction, optional relation type
  extraction, required-relation-type rejection, and `con`/default `seq`
  normalization.
- Slice-3-C changed `unitEdgeHelpers.ts` to extract unit-edge names,
  relation type, and required-relation-type checks through small local helpers.
  Public exports, source/target extraction, optional relation type extraction,
  required-relation-type behavior, relation-type normalization,
  parser/generated artifacts, application projections, VS Code/web
  compatibility, and `engines.vscode` are preserved.
- Targeted Qlty smell output for `unitEdgeHelpers.ts` reports no findings.
  Targeted metrics changed from 0 classes / 2 funcs / cyclo 11 /
  complexity 12 / LOC 33 before Slice-3-C to 0 classes / 6 funcs / cyclo 13 /
  complexity 12 / LOC 44. The aggregate complexity trade-off is accepted for
  this slice because the target function-level many-returns/high-complexity
  findings are removed while behavior stays covered.
- Slice-3-D targets `PlainString.ts` `Ni.priority` because targeted domain Qlty
  reports many-returns and high-complexity findings for that getter. Current
  file metrics are 156 classes / 8 funcs / cyclo 14 / complexity 10 /
  LOC 220.
- Slice-3-D is scoped as a `PlainString.ts` smell/metric cleanup, not a
  one-smell-only task. The known smell cluster is currently `Ni.priority`;
  implementation should remove that smell and avoid worsening file-level
  metrics when practical without broadening behavior or public API changes.
- Impact is local to `Ni` nice-value priority mapping. Production use flows
  through `unitPriorityHelpers.ts` `getNiPrioritySource` and unit priority
  getters. Existing tests cover inherited/default `ni`, explicit `ni` priority,
  and unit-list priority projection for jobnet, subnet, job, and queue-job
  views.
- Slice-3-D must preserve the current thresholds: nice > 10 maps to priority 5,
  nice > 0 maps to 4, nice == 0 maps to 3, nice > -11 maps to 2, and all lower
  values map to 1.
- Slice-3-D changed `PlainString.ts` to resolve `Ni.priority` through a local
  threshold-score helper. Public parameter exports, the `Ni.priority` getter,
  nice-value priority thresholds, default `ni` behavior, unit-priority
  resolution, parser/generated artifacts, application projections, VS Code/web
  compatibility, and `engines.vscode` are preserved.
- Targeted Qlty smell output for `PlainString.ts` reports no findings. Targeted
  metrics changed from 156 classes / 8 funcs / cyclo 14 / complexity 10 /
  LOC 220 before Slice-3-D to 156 classes / 9 funcs / cyclo 14 /
  complexity 5 / LOC 219.
- Slice-3-E targets `transferOperationHelpers.ts` because targeted domain
  Qlty reports a high-complexity finding for `resolveTopDefaultRawValue`.
  Current file metrics are 0 classes / 2 funcs / cyclo 5 / complexity 7 /
  LOC 36.
- Impact is local to `topN` default derivation from matching `tsN`/`tdN`
  transfer-file presence. Production use flows through
  `transferOperationParameterBuilders.ts`, `ParameterFactory.top1` through
  `top4`, `J`/`Cj` transfer-operation getters, and unit-list group 15
  projections. Existing tests cover direct default derivation, facade access,
  explicit `topN` preservation, QUEUE job non-derivation, and group 15 display
  behavior.
- Slice-3-E must preserve current derivation: source plus destination defaults
  to `sav`, source without destination defaults to `del`, destination without
  source does not derive a default, no transfer-file presence does not derive a
  default, and explicit `topN` values continue to win.
- Slice-3-E changed `transferOperationHelpers.ts` to resolve `topN` default
  raw values through a local source/destination presence table. Public helper
  exports, transfer-operation derivation semantics, explicit `topN` value
  precedence, parser/generated artifacts, application projections, VS Code/web
  compatibility, and `engines.vscode` are preserved.
- Targeted Qlty smell output for `transferOperationHelpers.ts` reports no
  findings. Targeted metrics changed from 0 classes / 2 funcs / cyclo 5 /
  complexity 7 / LOC 36 before Slice-3-E to 0 classes / 3 funcs / cyclo 2 /
  complexity 2 / LOC 36.
- Slice-3-F targets `ScheduleRule.ts` because targeted domain Qlty reports
  `Sd.type` many-returns/high-complexity findings and same-file duplication in
  schedule-rule parameter classes. Current file metrics are 8 classes /
  24 funcs / cyclo 35 / complexity 16 / LOC 179.
- Impact is local to domain schedule-rule parameter objects. Production use
  flows through `ruleParameterBuilders.ts`, `ParameterFactory`, `N` schedule
  getters, and unit-list group 10 schedule projections. Existing tests cover
  `sd` type/value facade behavior, `ln` parent rules, `sh` substitutes, `shd`
  shift days, `wc` wait counts, schedule parameter alignment, and group 10
  unit-list projections.
- Slice-3-F must preserve `Sd.type` results for `en`, `ud`, `+`, `*`, `@`, and
  empty/default cases; `Sd.yearMonth`; `Sd.day`; `Ln.parentRule`;
  `Sh.substitute`; `Shd.shiftDays` default `2`; `Wc.numberOfTimes` default
  `1`; and all public parameter class exports.
