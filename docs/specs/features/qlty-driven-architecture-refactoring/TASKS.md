# TASKS: qlty-driven-architecture-refactoring

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Keep this file focused on current state and future decisions. Retain prior
  approvals, validation details, or implementation notes only when they affect
  the next decision, re-approval boundary, or unresolved risk.

## Current Status

- Runtime status:
  Slice-3-M implementation is complete.
- Active slice:
  none.
- Open follow-up:
  Decide the next Slice-3 domain-helper candidate.

## Human Approval

- Status: Pending
- Approved at:
  none.
- Approved scope:
  none.

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
- [x] Record human approval for Slice-3-F.
- [x] Complete Slice-3-F `ScheduleRule.ts` schedule-rule parameter
      smell/metric cleanup.
- [x] Decide the next Slice-3 domain-helper candidate after Slice-3-F.
- [x] Select Slice-3-G `parameterHelpers.ts` parameter resolution helper
      smell/metric cleanup as the next domain-helper candidate.
- [x] Record Slice-3-G impact investigation.
- [x] Request human approval for the selected Slice-3-G implementation scope.
- [x] Record human approval for Slice-3-G.
- [x] Complete Slice-3-G `parameterHelpers.ts` parameter resolution helper
      smell/metric cleanup.
- [x] Decide the next Slice-3 domain-helper candidate after Slice-3-G.
- [x] Select Slice-3-H `scheduleRuleHelpers.ts` schedule-by-days parser helper
      cleanup as the next domain-helper candidate.
- [x] Record Slice-3-H impact investigation.
- [x] Request human approval for the selected Slice-3-H implementation scope.
- [x] Record human approval for Slice-3-H.
- [x] Complete Slice-3-H `scheduleRuleHelpers.ts` schedule-by-days parser
      helper cleanup.
- [x] Decide the next Slice-3 domain-helper candidate after Slice-3-H.
- [x] Select Slice-3-I `optionalScalarParameterBuilders.ts` optional scalar
      builder helper cleanup as the next domain-helper candidate.
- [x] Record Slice-3-I impact investigation.
- [x] Request human approval for the selected Slice-3-I implementation scope.
- [x] Record human approval for Slice-3-I.
- [x] Complete Slice-3-I `optionalScalarParameterBuilders.ts` optional scalar
      builder helper cleanup.
- [x] Decide the next Slice-3 domain-helper candidate after Slice-3-I.
- [x] Select Slice-3-J `AjsDocument.ts` inherited parameter lookup helper
      cleanup as the next domain-helper candidate.
- [x] Record Slice-3-J impact investigation.
- [x] Request human approval for the selected Slice-3-J implementation scope.
- [x] Record human approval for Slice-3-J.
- [x] Complete Slice-3-J `AjsDocument.ts` inherited parameter lookup helper
      cleanup.
- [x] Decide the next Slice-3 domain-helper candidate after Slice-3-J.
- [x] Select Slice-3-K `relations.ts` normalized relation resolver cleanup as
      the next domain-helper candidate.
- [x] Record Slice-3-K impact investigation.
- [x] Request human approval for the selected Slice-3-K implementation scope.
- [x] Record human approval for Slice-3-K.
- [x] Complete Slice-3-K `relations.ts` normalized relation resolver cleanup.
- [x] Decide the next Slice-3 domain-helper candidate after Slice-3-K.
- [x] Select Slice-3-L `unitBuilder.ts` normalized unit builder input cleanup
      as the next domain-helper candidate.
- [x] Record Slice-3-L impact investigation.
- [x] Request human approval for the selected Slice-3-L implementation scope.
- [x] Record human approval for Slice-3-L.
- [x] Complete Slice-3-L `unitBuilder.ts` normalized unit builder input
      cleanup.
- [x] Decide the next Slice-3 domain-helper candidate after Slice-3-L.
- [x] Select Slice-3-M `Cmsj`/`Tmwj`/`Pwlj` wait-job shared getter cleanup as
      the next domain-helper candidate.
- [x] Record Slice-3-M impact investigation.
- [x] Request human approval for the selected Slice-3-M implementation scope.
- [x] Record human approval for Slice-3-M.
- [x] Complete Slice-3-M `Cmsj`/`Tmwj`/`Pwlj` wait-job shared getter cleanup.
- [ ] Decide the next Slice-3 domain-helper candidate after Slice-3-M.

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
- Slice-3-G implementation:
  targeted `parameterHelpers.test.ts`, `parameterFactory.test.ts`,
  schedule-rule facade coverage, and unit-list schedule projection coverage,
  then `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`
- Slice-3-J implementation:
  targeted normalized document helper, unit-list inherited parameter, linked
  unit, priority, group 10, and flow graph coverage, then
  `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`
- Slice-3-K implementation:
  targeted `normalizeRelations.test.ts`, relation normalization, flow graph,
  expanded flow graph, and unit-list relation coverage, then
  `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`
- Slice-3-L implementation:
  targeted `normalizeUnitBuilder.test.ts`, `normalizeUnitTree.test.ts`, and
  normalized document coverage, then `rtk pnpm run qlty`, `rtk pnpm test`,
  `rtk pnpm run test:web`, and `rtk pnpm run build`
- Slice-3-M implementation:
  targeted Qlty smell/metrics for `Cmsj.ts`, `Tmwj.ts`, and `Pwlj.ts`,
  `parameterFactory.test.ts` execution-interval coverage, unit-list remaining
  groups/view coverage, then `rtk pnpm run qlty`, `rtk pnpm test`,
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
- Slice-3-F changed `ScheduleRule.ts` to resolve `Sd.type` through local
  literal/prefix tables and to share parsed schedule-rule parameter
  initialization through a local abstract base class. Public parameter classes,
  schedule-rule parsing semantics, unit-list projections, diagnostics behavior,
  parser/generated artifacts, VS Code/web compatibility, and `engines.vscode`
  are preserved.
- Targeted Qlty smell output for `ScheduleRule.ts` reports no findings.
  Targeted metrics changed from 8 classes / 24 funcs / cyclo 35 /
  complexity 16 / LOC 179 before Slice-3-F to 8 classes / 22 funcs /
  cyclo 25 / complexity 9 / LOC 153.
- Slice-3-F validation passed for targeted schedule-rule coverage,
  `rtk pnpm run qlty`, `rtk pnpm test`, and `rtk pnpm run build`.
  `rtk pnpm run test:web` completed webpack and TypeScript compile but failed
  twice on external VS Code web test service connection timeouts
  (`ETIMEDOUT` to `*:443`), including one rerun with escalated permissions.
- Slice-3-G targets `parameterHelpers.ts` because targeted domain Qlty reports
  a same-file cluster: `resolveParameterArray` many-returns/high-complexity,
  `resolveDefaultRawValue` many-returns,
  `resolveScopedDefaultRawValue` high-complexity, and
  `buildSdAlignedScheduleParameters` many-parameters. Current file metrics are
  0 classes / 21 funcs / cyclo 52 / complexity 47 / LOC 338.
- Impact is local to domain parameter lookup helpers. Production use flows
  through optional/required/inherited parameter builders, rule parameter
  builders, transfer-operation builders, `ParameterFactory`, domain unit
  getters, and unit-list schedule projections. Existing tests cover own,
  inherited, array default, singular parameter error, root-jobnet defaults,
  connector-control defaults, schedule-rule alignment, inherited scalar/array
  helpers, and facade behavior.
- Slice-3-G must preserve parameter symbol validation, own-parameter
  precedence over inherited/default values, parent-chain inherited lookup,
  default array and scalar fallback behavior, default application modes,
  `resolveParameter` singular-array error behavior, schedule-rule sorting, and
  sd-aligned default/null placeholder behavior.
- Slice-3-G changed `parameterHelpers.ts` to table-drive default raw values
  and default application modes, normalize sd-aligned schedule helper input
  while preserving existing four-argument calls, and split own, inherited, and
  default parameter array resolution into local helpers. Public helper exports,
  parameter symbol validation, own > inherited > default precedence,
  parent-chain lookup, default array/scalar fallback, default modes, singular
  array error behavior, schedule sorting, sd alignment, parser/generated
  artifacts, VS Code/web compatibility, and `engines.vscode` are preserved.
- Targeted Qlty smell output for `parameterHelpers.ts` reports no findings.
  Targeted metrics changed from 0 classes / 21 funcs / cyclo 52 /
  complexity 47 / LOC 338 before Slice-3-G to 0 classes / 32 funcs /
  cyclo 48 / complexity 43 / LOC 401. The function-count and LOC increases
  are accepted because the target smell cluster was removed while cyclomatic
  and aggregate complexity decreased.
- Slice-3-G validation passed for targeted parameter helper/factory and
  unit-list schedule projection coverage, `rtk pnpm run qlty`,
  `rtk pnpm test`, `rtk pnpm run test:web`, and `rtk pnpm run build`. Build
  completed with existing webpack asset-size warnings.
- Slice-3-H targets `scheduleRuleHelpers.ts` because targeted domain Qlty
  reports a high-complexity finding for
  `parseScheduleByDaysFromStartValue`. Current file metrics are 0 classes /
  14 funcs / cyclo 30 / complexity 17 / LOC 124.
- Impact is local to schedule-rule parsing helpers. Production use flows
  through `ScheduleRule.Cftd`, unit-list `parseCftd`, parameter factory
  facade behavior, and schedule diagnostics that already consume the same
  schedule-rule helper module. Existing tests cover supported schedule-rule
  parsing, cftd defaults, cftd mode-specific max-shift fields, unsupported
  partial parses, parameter factory cftd facades, unit-list group 10
  projections, and syntax diagnostics for cftd ranges.
- Slice-3-H must preserve schedule rule number defaulting to 1, accepted cftd
  types `no`/`be`/`af`/`db`/`da`, `no` suppressing
  `scheduleByDaysFromStart`, default `scheduleByDaysFromStart` of `1` for
  non-`no` types, default max-shift `10` for `be`/`af`, no max-shift for
  `no`/`db`/`da`, unsupported-shape rejection, and current wc/wt effective
  pair behavior.
- Slice-3-H changed `scheduleRuleHelpers.ts` to parse cftd matches through a
  typed local helper and resolve schedule-by-days/default max-shift fields
  through focused type-set helpers. Public helper exports, schedule rule number
  defaulting, accepted/rejected cftd shapes, cftd default fields, effective
  wc/wt pairing, parser/generated artifacts, VS Code/web compatibility, and
  `engines.vscode` are preserved.
- Targeted Qlty smell output for `scheduleRuleHelpers.ts` reports no findings.
  Targeted metrics changed from 0 classes / 14 funcs / cyclo 30 /
  complexity 17 / LOC 124 before Slice-3-H to 0 classes / 17 funcs /
  cyclo 26 / complexity 17 / LOC 154. The function-count and LOC increases
  are accepted because the target function-level smell was removed and
  cyclomatic complexity decreased.
- Slice-3-H validation passed for targeted schedule-rule helper, parameter
  factory, unit-list schedule projection, and syntax diagnostics coverage,
  `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`. Build completed with existing webpack asset-size
  warnings.
- Slice-3-I targets `optionalScalarParameterBuilders.ts` because targeted
  domain Qlty reports a high-complexity finding for
  `createOptionalScalarBuilder`. Current file metrics are 0 classes / 3 funcs /
  cyclo 5 / complexity 5 / LOC 628.
- Impact is local to optional scalar parameter facade construction. Production
  use flows through `optionalScalarParameterBuilders`, `ParameterFactory`,
  domain unit getters, and unit-list projections. Existing tests cover
  inherited scalar values and defaults (`md`, `ni`, `sdd`, `stt`), root-jobnet
  defaults (`rg`), job-end judgment defaults (`jd`), HTTP connection job
  execution-user defaults (`httpConnectionJobEu`), generic `eu` defaults, and
  explicit value precedence.
- Slice-3-I must preserve option normalization from string defaults, resolver
  defaults winning over static defaults, inherited-vs-own builder selection,
  defaultRawValue propagation, unit and parameter forwarding, and all public
  optional scalar builder keys.
- Slice-3-I changed `optionalScalarParameterBuilders.ts` to split option
  normalization, default raw-value resolution, and own/inherited lookup
  selection into focused local helpers. Public builder exports, optional scalar
  lookup semantics, inherited scalar behavior, static/runtime default
  behavior, resolver precedence over static defaults, parameter facade
  behavior, parser/generated artifacts, VS Code/web compatibility, and
  `engines.vscode` are preserved.
- Targeted Qlty smell output for `optionalScalarParameterBuilders.ts` reports
  no findings. Targeted metrics changed from 0 classes / 3 funcs / cyclo 5 /
  complexity 5 / LOC 628 before Slice-3-I to 0 classes / 6 funcs /
  cyclo 5 / complexity 4 / LOC 640. The function-count and LOC increases are
  accepted because the target function-level smell was removed and aggregate
  complexity decreased.
- Slice-3-I validation passed for targeted parameter factory, unit priority,
  priority projection, job-end judgment, and remaining group projection
  coverage, `rtk pnpm run qlty`, `rtk pnpm test`,
  `rtk pnpm run test:web`, and `rtk pnpm run build`. Build completed with
  existing webpack asset-size warnings.
- Slice-3-J targets `AjsDocument.ts` because targeted domain Qlty reports a
  high-complexity finding for `findInheritedAjsUnitParameters`. Current file
  metrics are 0 classes / 12 funcs / cyclo 17 / complexity 10 / LOC 121.
- Impact is local to normalized AJS document lookup helpers. Direct use of the
  inherited-parameter array helper funnels through the same-file single-value
  helper; production behavior reaches unit-list inherited parameter
  projections such as schedule, linked-unit, and priority views. The shared
  ancestor helper is also used by flow graph input-node construction.
- Slice-3-J must preserve public AjsDocument helper exports, parent-to-root
  ancestor ordering, nearest-ancestor first-hit behavior, duplicate parameter
  arrays, undefined fallback, root-unit lookup behavior, normalized document
  shape, parser/generated artifacts, application projections, VS Code/web
  compatibility, and `engines.vscode`.
- Slice-3-J changed `AjsDocument.ts` to split inherited parameter lookup into
  local non-empty-array and first-match helpers. Public helper exports,
  parent-to-root ancestor ordering, nearest-ancestor first-hit behavior,
  duplicate parameter arrays, undefined fallback, root-unit lookup behavior,
  normalized document shape, parser/generated artifacts, application
  projections, VS Code/web compatibility, and `engines.vscode` are preserved.
- Targeted Qlty smell output for `AjsDocument.ts` reports no findings.
  Targeted metrics changed from 0 classes / 12 funcs / cyclo 17 /
  complexity 10 / LOC 121 before Slice-3-J to 0 classes / 14 funcs /
  cyclo 17 / complexity 5 / LOC 121. The function-count increase is accepted
  because the target function-level smell was removed and aggregate complexity
  decreased.
- Slice-3-J validation passed for targeted Qlty smell/metrics,
  `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`. Build completed with existing webpack asset-size
  warnings.
- Slice-3-K targets `relations.ts` because targeted domain Qlty reports a
  high-complexity finding for `resolveNormalizedRelations`. Current file
  metrics are 0 classes / 2 funcs / cyclo 8 / complexity 9 / LOC 57.
- Impact is local to normalized relation resolution from `ar` parameters.
  Direct production use flows through `normalizeUnitTree`; direct tests cover
  parse results, valid relation output, invalid relation warnings, and missing
  target warnings. Broader relation behavior is covered by normalized
  document, flow graph, expanded flow graph, and unit-list relation tests.
- Slice-3-K must preserve public helper exports, `ar` parameter parsing,
  invalid-relation warnings, missing-target warnings, child-name-to-id
  resolution, relation ordering, `seq`/`con` normalization, normalized
  document shape, parser/generated artifacts, application projections, VS
  Code/web compatibility, and `engines.vscode`.
- Slice-3-K approval included the clarification that implementation does not
  need to stay in one file when a focused file split is appropriate. The final
  change stayed in `relations.ts` because the helper set remained small.
- Slice-3-K changed `relations.ts` to build a relation-resolution context,
  isolate child lookup, warning recording, single-value relation resolution,
  and resolved DTO construction in local helpers. Public helper exports, `ar`
  parameter parsing, invalid-relation warnings, missing-target warnings,
  child-name-to-id resolution, relation ordering, `seq`/`con` normalization,
  normalized document shape, parser/generated artifacts, application
  projections, VS Code/web compatibility, and `engines.vscode` are preserved.
- Targeted Qlty smell output for `relations.ts` reports no findings. Targeted
  metrics changed from 0 classes / 2 funcs / cyclo 8 / complexity 9 / LOC 57
  before Slice-3-K to 0 classes / 7 funcs / cyclo 8 / complexity 9 /
  LOC 91. The function-count and LOC increases are accepted because the
  target function-level smell was removed without changing relation behavior.
- Slice-3-K validation passed for targeted Qlty smell/metrics,
  `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`. Build completed with existing webpack asset-size
  warnings.
- Slice-3-L targets `unitBuilder.ts` because targeted domain Qlty reports a
  many-parameters finding for `buildNormalizedUnit`. Current file metrics are
  0 classes / 1 func / cyclo 2 / complexity 0 / LOC 44.
- Impact is local to normalized unit DTO construction. Direct production use
  flows through `normalizeUnitTree`; direct tests call `buildNormalizedUnit`
  in `normalizeUnitBuilder.test.ts`. Broader normalized document behavior is
  covered by normalize unit tree and normalized document tests.
- Slice-3-L must preserve public normalized unit fields, child/relation
  ordering, parameter projection from parser units, unit type, group type,
  comment, depth, parent id, root/recovery/root-jobnet/schedule/wait flags,
  layout values, normalized document shape, parser/generated artifacts,
  application projections, VS Code/web compatibility, and `engines.vscode`.
- Slice-3-L changed `buildNormalizedUnit` to accept a single
  `NormalizedUnitInput` object and updated direct production/test call sites.
  Public normalized unit fields, child/relation ordering, parameter
  projection, unit type, group type, comment, depth, parent id,
  root/recovery/root-jobnet/schedule/wait flags, layout values, normalized
  document shape, parser/generated artifacts, application projections, VS
  Code/web compatibility, and `engines.vscode` are preserved.
- Targeted Qlty smell output for `unitBuilder.ts` reports no findings.
  Targeted metrics changed from 0 classes / 1 func / cyclo 2 / complexity 0 /
  LOC 44 before Slice-3-L to 0 classes / 1 func / cyclo 2 / complexity 0 /
  LOC 50. The LOC increase is accepted because the target many-parameters
  smell was removed without changing normalized unit behavior.
- Slice-3-L validation passed for targeted Qlty smell/metrics,
  `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`. Build completed with existing webpack asset-size
  warnings.
- Slice-3-M targets the `Cmsj.ts` / `Tmwj.ts` / `Pwlj.ts` duplication cluster
  because targeted domain Qlty reports 43 lines of similar code across those
  three wait-job unit classes. Current cluster metrics are 6 classes /
  27 funcs / cyclo 3 / complexity 0 / LOC 96.
- Impact is local to domain unit parameter getter ownership. Production class
  construction flows through `TyUtils.tyFactory`; direct references preserve
  public `Cmsj`, `Rcmsj`, `Tmwj`, `Rtmwj`, `Pwlj`, and `Rpwlj` exports.
  Existing tests cover `Tmwj.tmitv` defaults and explicit values through
  `parameterFactory.test.ts`, and shared `etm`, `fd`, `ex`, `ha`, `eu`, `pfm`,
  and `jty` values through unit-list projection coverage.
- Slice-3-M must preserve all existing getter names and values:
  `Cmsj.cmsts/cmaif/pfm/etm/fd/ex/ha/eu/jty`,
  `Tmwj.tmitv/etn/jpoif/etm/fd/ex/ha/eu/ets`, and
  `Pwlj.pwlt/pwlf/pfm/etm/fd/ex/ha/eu/jty`; public class exports; recovery
  subclass inheritance; waitable-unit behavior; `tyFactory` mappings;
  parser/generated artifacts; application projections; VS Code/web
  compatibility; and `engines.vscode`.
- Slice-3-M added `ExecutionWaitJobUnitEntity` and
  `PlatformExecutionWaitJobUnitEntity` in `unitCapabilityEntities.ts`, moving
  shared `etm`, `fd`, `ex`, `ha`, `eu`, `pfm`, and `jty` getters out of
  `Cmsj`, `Tmwj`, and `Pwlj`. Class-specific getters and public recovery
  subclasses remain in their original unit files.
- Targeted Qlty smell output for `Cmsj.ts`, `Tmwj.ts`, `Pwlj.ts`, and
  `unitCapabilityEntities.ts` reports no findings. Metrics changed from the
  three-file cluster 6 classes / 27 funcs / cyclo 3 / complexity 0 / LOC 96
  before Slice-3-M to the four-file cluster 6 classes / 24 funcs / cyclo 4 /
  complexity 0 / LOC 111 after. The total LOC increase is accepted because
  target duplication was removed while per-target unit files became smaller.
- Slice-3-M validation passed targeted Qlty smell/metrics,
  `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`. Build completed with existing webpack asset-size
  warnings.
