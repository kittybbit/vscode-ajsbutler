# Feature Specification: qlty-driven-architecture-refactoring

## Purpose

Use Qlty findings as architectural feedback for incremental,
behavior-preserving refactoring.

## Origin

Qlty check, metrics, and smell output identified maintainability pressure in
flow-viewer presentation code, application orchestration helpers, diagnostic
rule builders, and domain helpers.

## Requirements

- Preserve parser, diagnostics, list view, flow view, CSV export, telemetry,
  desktop extension behavior, and web extension behavior unless a later slice
  explicitly approves behavior change.
- Keep `engines.vscode` unchanged unless explicitly approved.
- Keep parser/generated artifacts unchanged for quality-only refactors.
- Keep UI-library coupling out of domain and application code.
- Keep current acceptance tests green after each implementation slice.

## Architecture

- `domain` remains independent of `vscode`, React, MUI, XyFlow, and webview
  code.
- `application` may depend on `domain`, but presentation and VS Code API
  details stay outside application helpers.
- Presentation helpers may use React and UI-library concepts, but parser and
  application DTO boundaries must remain explicit.
- Telemetry stays wrapped near extension/presentation boundaries.

## Impact Analysis

### Completed Scope Summary

- Slice-1A and Slice-1B reduced flow-viewer controller, component, layout, and
  nested expansion complexity while preserving flow graph DTO behavior.
- Slice-2 has reduced unit-list projection helpers, parser/application helper
  complexity, command-builder helpers, calendar/schedule projections,
  editor-feedback rule builders, and schedule-date validators through
  Slice-2-X.
- This specification keeps only completed-scope information that affects
  future boundary, compatibility, risk, or ownership decisions; current
  execution state stays in TASKS.md.

### Current Slice-2-Y Target

Slice-2-Y targets the remaining
`src/application/editor-feedback/syntaxDiagnosticScheduleRules.ts` smell and
metric cluster. The slice should reduce the same file's remaining
branch-heavy validators together instead of fixing one smell at a time.

Current Qlty evidence:

- `syntaxDiagnosticScheduleRules.ts` still reports high total complexity.
- Metrics for that file are 35 funcs / cyclo 193 / complexity 111 / LOC 389.
- Remaining smell findings include `isValidExplicitParentScheduleRule`,
  `isValidExplicitScheduleByDaysFromStart`, and
  `isValidExplicitWaitCount`.

### Slice-2-Y Investigation

`isValidExplicitParentScheduleRule` validates `ln` parent schedule-rule values
and treats root units as always valid.

`isValidExplicitScheduleByDaysFromStart` validates `cftd` type/segment shapes
for `no`, `be`, `af`, `db`, and `da`.

`isValidExplicitWaitCount` validates `wc` values `no`, `un`, or 1..999.

These validators share explicit schedule-rule prefix parsing and schedule rule
number validation. Serena and targeted search found direct production usage
from `buildScheduleRuleDiagnostics` only. Existing
`buildSyntaxDiagnostics.test.ts` coverage exercises valid and invalid `ln`,
`cftd`, and `wc` diagnostics.

### Slice-2-Y Boundary Decision

Reduce the same-file validator cluster together with local helpers only.

Do not change:

- `parseExplicitScheduleRuleValue` behavior
- explicit schedule rule number bounds
- root-unit `ln` allowance
- accepted `ln`/`cftd`/`wc` forms
- empty `cftd` segment rejection
- optional 1..31 validation
- wait-count bounds
- diagnostic message text
- parser/generated artifacts
- presentation behavior
- dependency versions
- VS Code compatibility
- web compatibility
- `engines.vscode`

### Slice-2-Y Approval-Sensitive Scope

Implementation may add local helper functions inside
`src/application/editor-feedback/syntaxDiagnosticScheduleRules.ts` and rewrite
`isValidExplicitParentScheduleRule`,
`isValidExplicitScheduleByDaysFromStart`, and `isValidExplicitWaitCount` as
smaller coordinators while preserving exported function names and behavior.

Any change to accepted or rejected `ln`/`cftd`/`wc` forms, diagnostic
messages, parser/generated artifacts, presentation behavior, dependency
versions, VS Code compatibility, web compatibility, or `engines.vscode`
requires separate approval.

### Slice-2-Y Result

`isValidExplicitParentScheduleRule`,
`isValidExplicitScheduleByDaysFromStart`, and `isValidExplicitWaitCount` remain
exported from `syntaxDiagnosticScheduleRules.ts`, with shared explicit
schedule-rule parsing, numeric range validation, and `cftd` rule-table
validation delegated to local helpers.

The change preserves root-unit `ln` allowance, explicit schedule rule number
bounds, accepted `ln`/`cftd`/`wc` forms, empty `cftd` segment rejection,
optional 1..31 validation, wait-count bounds, diagnostic message text,
parser/generated artifacts, presentation behavior, dependency versions, VS
Code compatibility, web compatibility, and `engines.vscode`.

Targeted Qlty smell output no longer reports the three target validators.
File metrics changed from 35 funcs / cyclo 193 / complexity 111 / LOC 389 to
40 funcs / cyclo 183 / complexity 93 / LOC 405. The function-count increase is
an accepted trade-off for this slice because it removes the targeted
branch-heavy smell cluster and lowers cyclomatic and aggregate complexity.

### Slice-2-Z Target

Slice-2-Z targets the remaining
`src/application/editor-feedback/syntaxDiagnosticScheduleRules.ts` residual
smell/metric cluster. This continues the same-file approach by handling the
remaining schedule-rule findings together.

Current Qlty evidence:

- `syntaxDiagnosticScheduleRules.ts` still reports high total complexity.
- Residual findings include `parseExplicitScheduleDateDiagnosticValue`,
  `getCalendarMonthDayLimit`, `isValidExplicitCycle`,
  `isExplicitWeeklyCycle`, `usesOpenOrClosedDaySchedule`,
  `isValidExplicitShiftDays`, and the `isValidHourMinuteRange` binary
  expression.

### Slice-2-Z Investigation

The residual validators cover schedule-date parsing/month limits, hour-minute
range checks, cycle validation, weekly/open-day compatibility helpers, and
shift-day validation. Targeted search found these functions are used within
`syntaxDiagnosticScheduleRules.ts` and from `buildScheduleRuleDiagnostics` for
schedule diagnostics such as `st`, `cy`, `shd`, and related weekly-cycle
compatibility checks.

Existing `buildSyntaxDiagnostics.test.ts` coverage exercises valid and
invalid schedule-rule diagnostics, including `st`, `cy`, `shd`, and schedule
date combinations used by weekly-cycle compatibility.

### Slice-2-Z Boundary Decision

Reduce the same-file residual schedule-rule validator cluster with local
helpers only.

Do not change:

- `parseScheduleDateValue` behavior
- explicit schedule rule number parsing
- accepted schedule date, time, cycle, weekly-cycle, open/closed-day, or
  shift-day forms
- schedule date month/day limit semantics
- diagnostic message text
- parser/generated artifacts
- presentation behavior
- dependency versions
- VS Code compatibility
- web compatibility
- `engines.vscode`

### Slice-2-Z Approval-Sensitive Scope

Implementation may add local helper functions inside
`src/application/editor-feedback/syntaxDiagnosticScheduleRules.ts` and rewrite
the residual schedule-rule validators as smaller coordinators while preserving
exported function names and behavior.

Any change to accepted/rejected schedule-rule forms, diagnostic messages,
parser/generated artifacts, presentation behavior, dependency versions, VS Code
compatibility, web compatibility, or `engines.vscode` requires separate
approval.

### Slice-2-Z Result

`syntaxDiagnosticScheduleRules.ts` now shares schedule-rule number-range,
optional-number, maximum-month-day, and explicit-cycle helpers across the
residual validators. The exported schedule-date, time, cycle, weekly-cycle,
open/closed-day, and shift-day validation functions remain behavior-preserving
coordinators.

The change preserves accepted and rejected schedule-rule forms, diagnostic
message text, parser/generated artifacts, presentation behavior, dependency
versions, VS Code compatibility, web compatibility, and `engines.vscode`.

Targeted Qlty metrics changed from 40 funcs / cyclo 183 / complexity 93 / LOC
405 before Slice-2-Z to 46 funcs / cyclo 139 / complexity 72 / LOC 412.
Targeted smell output still reports file-level high total complexity only;
`rtk pnpm run qlty` reports no issues. The next decision is whether additional
Slice-2 value remains in `syntaxDiagnosticRuleBuilders` or
`syntaxDiagnosticScalarValidators`, or whether application orchestration work
should close and Slice-3 should start.

### Slice-2-AA Target

Slice-2-AA targets
`src/application/editor-feedback/syntaxDiagnosticRuleBuilders.ts` as the next
same-file application-orchestration cluster. This is preferred over
`syntaxDiagnosticScalarValidators.ts` because Qlty reports multiple
high-complexity findings in `syntaxDiagnosticRuleBuilders.ts`, while the
scalar validators currently show one lower-risk many-parameter finding.

Current Qlty evidence:

- `syntaxDiagnosticRuleBuilders.ts` reports high total complexity.
- Metrics for that file are 18 funcs / cyclo 37 / complexity 56 / LOC 332.
- Remaining findings include `buildScheduleRuleDiagnostics`,
  `buildJobEndJudgmentDiagnostics`, and
  `collectStartConditionDisabledParameterDiagnostics`.

### Slice-2-AA Investigation

`buildScheduleRuleDiagnostics` coordinates schedule rule diagnostics for `g`
and `n` units by combining `sd` validation, explicit rule diagnostics, and
weekly-cycle compatibility diagnostics.

`buildJobEndJudgmentDiagnostics` coordinates numeric range diagnostics,
threshold ordering diagnostics, `jd`/`abr` defaults, automatic retry gating,
and retry-parameter gating for job-like units.

`collectStartConditionDisabledParameterDiagnostics` is shared by file
monitoring, execution interval control, and event receiving diagnostics to
reject parameters that cannot be specified when the unit is defined as a start
condition.

Direct production use flows through `buildSemanticSyntaxDiagnostics` in
`src/application/editor-feedback/syntaxDiagnosticRules.ts`. Existing
`buildSyntaxDiagnostics.test.ts` coverage exercises schedule-rule diagnostics,
job-end judgment retry and threshold diagnostics, and start-condition
disabled-parameter diagnostics.

### Slice-2-AA Boundary Decision

Reduce the same-file rule-builder cluster with local helpers or local rule
tables only.

Do not change:

- exported builder names
- diagnostic messages
- target unit types
- parameter keys
- default handling for `jd` and `abr`
- retry gating behavior
- threshold ordering behavior
- start-condition disabled-parameter behavior
- parser/generated artifacts
- presentation behavior
- dependency versions
- VS Code compatibility
- web compatibility
- `engines.vscode`

### Slice-2-AA Approval-Sensitive Scope

Implementation may add local helper functions or local data structures inside
`src/application/editor-feedback/syntaxDiagnosticRuleBuilders.ts` and rewrite
`buildScheduleRuleDiagnostics`, `buildJobEndJudgmentDiagnostics`, and
`collectStartConditionDisabledParameterDiagnostics` as smaller coordinators
while preserving exported function names and behavior.

Any change to diagnostic messages, target unit types, parameter keys,
default handling, retry gating, threshold ordering, start-condition
disabled-parameter behavior, parser/generated artifacts, presentation
behavior, dependency versions, VS Code compatibility, web compatibility, or
`engines.vscode` requires separate approval.

### Slice-2-AA Result

`syntaxDiagnosticRuleBuilders.ts` now keeps the public builder exports while
delegating schedule-rule coordination, job-end judgment context resolution,
threshold diagnostics, retry gating diagnostics, and optional-parameter
diagnostic collection to local helpers.

The change preserves diagnostic messages, target unit types, parameter keys,
default handling for `jd` and `abr`, retry gating behavior, threshold ordering
behavior, start-condition disabled-parameter behavior, parser/generated
artifacts, presentation behavior, dependency versions, VS Code compatibility,
web compatibility, and `engines.vscode`.

Targeted Qlty metrics changed from 18 funcs / cyclo 37 / complexity 56 / LOC
332 before Slice-2-AA to 30 funcs / cyclo 34 / complexity 26 / LOC 386.
Targeted smell output reports no findings, and `rtk pnpm run qlty` reports no
issues. The next decision is whether the remaining
`syntaxDiagnosticScalarValidators` many-parameter finding is worth another
Slice-2 implementation or whether application orchestration work should close
and Slice-3 should start.

### Slice-2-AB Target

Slice-2-AB is the final Slice-2 application-orchestration cleanup and targets
`src/application/editor-feedback/syntaxDiagnosticScalarValidators.ts`.

Current Qlty evidence:

- `parseExplicitDecimalInRange` reports a many-parameter finding.
- Metrics for `syntaxDiagnosticScalarValidators.ts` are 9 funcs / cyclo 16 /
  complexity 13 / LOC 57.

### Slice-2-AB Investigation

`parseExplicitDecimalInRange` currently receives a parameter, minimum,
maximum, and an optional `allowNegative` option. Direct application/editor-
feedback call sites are limited to:

- `syntaxDiagnosticCore.ts` for reusable explicit decimal range rules
- `syntaxDiagnosticJobEndRules.ts` for threshold ordering validation
- `syntaxDiagnosticEventRules.ts` for event search condition validation
- `syntaxDiagnosticFileMonitoringRules.ts` for monitoring interval validation

The implementation can remove the many-parameter smell by changing the helper
to accept one input object containing the parameter, inclusive range, and
options, then updating the direct call sites. This is an internal application
helper API change only; it does not require behavior or diagnostic-message
changes.

### Slice-2-AB Boundary Decision

Reduce the scalar-validator input-shape smell with a local object input.

Do not change:

- decimal parsing rules
- negative-number option behavior
- inclusive range bounds
- undefined handling
- byte-length or hexadecimal helpers
- diagnostic messages
- parser/generated artifacts
- presentation behavior
- dependency versions
- VS Code compatibility
- web compatibility
- `engines.vscode`

### Slice-2-AB Approval-Sensitive Scope

Implementation may change `parseExplicitDecimalInRange` to accept a single
input object and update direct application/editor-feedback call sites. It may
adjust nearby local type names if needed to keep the call sites readable.

Any change to parsing behavior, validation bounds, diagnostic messages,
parser/generated artifacts, presentation behavior, dependency versions, VS
Code compatibility, web compatibility, or `engines.vscode` requires separate
approval.

### Slice-2-AB Result

`parseExplicitDecimalInRange` now accepts one input object containing the
parameter, inclusive bounds, and optional parsing flags. Direct
application/editor-feedback call sites were updated without changing decimal
parsing behavior.

The change preserves negative-number option behavior, inclusive range bounds,
undefined handling, byte-length and hexadecimal helpers, diagnostic messages,
parser/generated artifacts, presentation behavior, dependency versions, VS
Code compatibility, web compatibility, and `engines.vscode`.

Targeted Qlty metrics for `syntaxDiagnosticScalarValidators.ts` changed from
9 funcs / cyclo 16 / complexity 13 / LOC 57 before Slice-2-AB to 9 funcs /
cyclo 16 / complexity 13 / LOC 63. Targeted smell output reports no findings.
Slice-2 application orchestration work is closed; the next planning decision
is the first Slice-3 domain-helper candidate.

### Slice-3-A Target

Slice-3-A starts the domain-helper simplification phase and targets
`src/domain/models/units/unitPriorityHelpers.ts`.

Current Qlty evidence:

- `resolveUnitPriority` reports many-returns and high-complexity findings.
- The nested `getPrPriority` helper reports a high-complexity finding.
- Metrics for `unitPriorityHelpers.ts` are 1 class / 6 funcs / cyclo 31 /
  complexity 31 / LOC 52.

### Slice-3-A Investigation

`resolveUnitPriority` resolves the priority exposed by
`WaitableUnitEntity.priority`. Direct production use flows through
`src/domain/models/units/unitCapabilityEntities.ts`.

Existing direct tests in `unitPriorityHelpers.test.ts` and
`unitCapabilityEntities.test.ts` cover explicit `pr`, explicit `ni`, parent
`n`/`rn` priority inheritance, inherited priority suppression, and default
priority fallback.

### Slice-3-A Boundary Decision

Reduce only the local priority-resolution helper shape in
`unitPriorityHelpers.ts`.

Do not change:

- public `resolveUnitPriority` and `PrioritizableUnit` API
- explicit `pr` and `ni` precedence where the later source wins
- inherited `pr`/`ni` suppression
- `n`/`rn` parent priority inheritance
- default priority 1
- parser/generated artifacts
- application projections
- presentation behavior
- dependency versions
- VS Code compatibility
- web compatibility
- `engines.vscode`

### Slice-3-A Approval-Sensitive Scope

Implementation may add local helpers or local data structures inside
`src/domain/models/units/unitPriorityHelpers.ts` and rewrite
`resolveUnitPriority` as a smaller coordinator while preserving public exports
and behavior.

Any change to priority semantics, public helper API, parser/generated
artifacts, application projections, presentation behavior, dependency
versions, VS Code compatibility, web compatibility, or `engines.vscode`
requires separate approval.

### Slice-3-A Result

`unitPriorityHelpers.ts` now represents explicit `pr` and `ni` values as
positioned priority sources, chooses the later explicit source, and then falls
back to parent `n`/`rn` priority or default priority 1.

The change preserves public exports, priority precedence, inherited priority
suppression, parent inheritance, parser/generated artifacts, application
projections, presentation behavior, dependency versions, VS Code
compatibility, web compatibility, and `engines.vscode`.

Targeted Qlty metrics changed from 1 class / 6 funcs / cyclo 31 / complexity
31 / LOC 52 before Slice-3-A to 1 class / 8 funcs / cyclo 23 / complexity 10 /
LOC 51. Targeted smell output reports no findings. The next planning decision
is the next Slice-3 domain-helper candidate.

### Slice-3-B Target

Slice-3-B targets `src/domain/models/units/unitGroupStateHelpers.ts`.

Current Qlty evidence:

- `resolveGroupWeekState` reports many-returns and high-complexity findings.
- Metrics for `unitGroupStateHelpers.ts` are 0 classes / 3 funcs / cyclo 14 /
  complexity 10 / LOC 26.

### Slice-3-B Investigation

`resolveGroupWeekState` resolves group weekday open/closed state from open and
close calendar parameter arrays. Production use flows through
`G.#resolveWeekState` for the `mo` through `su` getters and then into unit-list
group6 projections.

Existing tests in `unitGroupStateHelpers.test.ts`, `groupEntity.test.ts`,
`buildUnitListGroup6View.test.ts`, and `buildUnitListView.test.ts` cover group
type handling, open-calendar true state, close-calendar false state, open
calendar precedence when both sources mark a week, and undefined fallback.

### Slice-3-B Boundary Decision

Reduce only the local week-state resolution helper shape in
`unitGroupStateHelpers.ts`.

Do not change:

- public helper exports
- group type handling
- planning group detection
- open-calendar precedence over close-calendar values
- close-calendar false fallback
- undefined fallback
- parser/generated artifacts
- application projections
- presentation behavior
- dependency versions
- VS Code compatibility
- web compatibility
- `engines.vscode`

### Slice-3-B Approval-Sensitive Scope

Implementation may add local helpers inside
`src/domain/models/units/unitGroupStateHelpers.ts` and rewrite
`resolveGroupWeekState` as a smaller coordinator while preserving public
exports and behavior.

Any change to group week-state semantics, public helper API, parser/generated
artifacts, application projections, presentation behavior, dependency
versions, VS Code compatibility, web compatibility, or `engines.vscode`
requires separate approval.

### Slice-3-B Result

`unitGroupStateHelpers.ts` now resolves open and close calendar week-state
candidates through local helpers and returns the first defined candidate. This
keeps open-calendar state ahead of close-calendar state while preserving false
as a valid close-calendar result.

The change preserves public exports, group type handling, planning group
detection, undefined fallback, parser/generated artifacts, application
projections, presentation behavior, dependency versions, VS Code
compatibility, web compatibility, and `engines.vscode`.

Targeted Qlty metrics changed from 0 classes / 3 funcs / cyclo 14 /
complexity 10 / LOC 26 before Slice-3-B to 0 classes / 6 funcs / cyclo 12 /
complexity 5 / LOC 29. Targeted smell output reports no findings. The next
planning decision is the next Slice-3 domain-helper candidate.

### Slice-3-C Target

Slice-3-C targets `src/domain/models/parameters/unitEdgeHelpers.ts`.

Current Qlty evidence:

- `parseUnitEdge` reports many-returns and high-complexity findings.
- Metrics for `unitEdgeHelpers.ts` are 0 classes / 2 funcs / cyclo 11 /
  complexity 12 / LOC 33.

### Slice-3-C Investigation

`parseUnitEdge` parses `ar` relation parameter values into source name,
target name, and optional relation type. Production use flows through
`parseNormalizedRelation` for normalized relation DTOs and through the `Ar`
parameter getters for source, target, and relation type access.

Existing tests in `unitEdgeHelpers.test.ts`, linked-unit relation tests, and
unit-list relation projection tests cover relation strings with and without
relation type, missing target rejection, undefined input, required relation
type rejection, relation-type normalization, and displayed relation types.

### Slice-3-C Boundary Decision

Reduce only the local unit-edge parser helper shape in `unitEdgeHelpers.ts`.

Do not change:

- public helper exports
- source name extraction
- target name extraction
- optional relation type extraction
- `requireRelationType` behavior
- `con` relation normalization
- default `seq` relation normalization
- parser/generated artifacts
- application projections
- presentation behavior
- dependency versions
- VS Code compatibility
- web compatibility
- `engines.vscode`

### Slice-3-C Approval-Sensitive Scope

Implementation may add local helpers inside
`src/domain/models/parameters/unitEdgeHelpers.ts` and rewrite
`parseUnitEdge` as a smaller coordinator while preserving public exports and
behavior.

Any change to unit-edge parsing semantics, public helper API, parser/generated
artifacts, application projections, presentation behavior, dependency
versions, VS Code compatibility, web compatibility, or `engines.vscode`
requires separate approval.

### Slice-3-C Result

`unitEdgeHelpers.ts` now keeps `parseUnitEdge` as a coordinator over local
helpers for unit-edge name extraction, relation type extraction, and required
relation-type checks.

The change preserves public exports, source name extraction, target name
extraction, optional relation type extraction, `requireRelationType` behavior,
relation-type normalization, parser/generated artifacts, application
projections, presentation behavior, dependency versions, VS Code
compatibility, web compatibility, and `engines.vscode`.

Targeted Qlty smell output reports no findings. Targeted metrics changed from
0 classes / 2 funcs / cyclo 11 / complexity 12 / LOC 33 before Slice-3-C to
0 classes / 6 funcs / cyclo 13 / complexity 12 / LOC 44. The aggregate
complexity trade-off is accepted for this slice because the target
function-level many-returns/high-complexity findings are removed. The next
planning decision is the next Slice-3 domain-helper candidate.

### Slice-3-D Target

Slice-3-D targets `src/domain/models/parameters/PlainString.ts` smell/metric
cleanup. The current concrete smell cluster is `Ni.priority`.

Current Qlty evidence:

- `Ni.priority` reports many-returns and high-complexity findings.
- Metrics for `PlainString.ts` are 156 classes / 8 funcs / cyclo 14 /
  complexity 10 / LOC 220.

### Slice-3-D Investigation

`Ni.priority` maps JP1/AJS nice values to the priority scale consumed by unit
priority resolution. Production use flows through `getNiPrioritySource` in
`unitPriorityHelpers.ts` and then through unit priority getters and unit-list
priority projections.

Existing unit priority and unit-list priority tests cover default `ni`,
explicit `ni`, inherited priority behavior, and priority projection for
jobnet, subnet, job, and queue-job views.

### Slice-3-D Boundary Decision

Reduce only the local `PlainString.ts` smell/metric pressure, starting with the
nice-value priority mapping shape in `Ni.priority`.

Do not change:

- public parameter exports
- `Ni.priority` public getter
- nice > 10 to priority 5
- nice > 0 to priority 4
- nice == 0 to priority 3
- nice > -11 to priority 2
- lower nice values to priority 1
- default `ni` behavior
- unit-priority resolution
- parser/generated artifacts
- application projections
- presentation behavior
- dependency versions
- VS Code compatibility
- web compatibility
- `engines.vscode`

### Slice-3-D Approval-Sensitive Scope

Implementation may add local helpers or a local threshold table inside
`src/domain/models/parameters/PlainString.ts`, rewrite `Ni.priority` as a
smaller coordinator, and make same-file local adjustments only when they
directly reduce the current smell/metric pressure while preserving public
exports and behavior.

Any change to nice-value priority semantics, public parameter API,
parser/generated artifacts, application projections, presentation behavior,
dependency versions, VS Code compatibility, web compatibility, or
`engines.vscode` requires separate approval.

### Slice-3-D Result

`PlainString.ts` now resolves `Ni.priority` with a local threshold-score
helper instead of a branch-heavy return chain.

The change preserves public parameter exports, the `Ni.priority` getter,
nice-value priority thresholds, default `ni` behavior, unit-priority
resolution, parser/generated artifacts, application projections, presentation
behavior, dependency versions, VS Code compatibility, web compatibility, and
`engines.vscode`.

Targeted Qlty smell output reports no findings. Targeted metrics changed from
156 classes / 8 funcs / cyclo 14 / complexity 10 / LOC 220 before Slice-3-D to
156 classes / 9 funcs / cyclo 14 / complexity 5 / LOC 219. The next planning
decision is the next Slice-3 domain-helper candidate.

### Slice-3-E Target

Slice-3-E targets
`src/domain/models/parameters/transferOperationHelpers.ts`.

Current Qlty evidence:

- `resolveTopDefaultRawValue` reports a high-complexity finding.
- Metrics for `transferOperationHelpers.ts` are 0 classes / 2 funcs /
  cyclo 5 / complexity 7 / LOC 36.

### Slice-3-E Investigation

`resolveTopDefaultRawValue` derives implicit `topN` transfer-operation values
from the presence of matching `tsN` transfer-source and `tdN`
transfer-destination parameters. Production use flows through
`buildTopParameter`, `transferOperationParameterBuilders.ts`,
`ParameterFactory.top1` through `top4`, `J`/`Cj` transfer-operation getters,
and unit-list group 15 projections.

Existing tests in `parameterHelpers.test.ts`, `parameterFactory.test.ts`, and
`buildUnitListRemainingGroups.test.ts` cover direct default derivation, facade
access, explicit `topN` preservation, QUEUE job non-derivation, and group 15
display behavior.

### Slice-3-E Boundary Decision

Reduce only the local transfer-operation default helper shape in
`transferOperationHelpers.ts`.

Do not change:

- public helper exports
- `topN` default derivation
- source plus destination defaulting to `sav`
- source without destination defaulting to `del`
- destination without source deriving no default
- no transfer-file presence deriving no default
- explicit `topN` value precedence
- QUEUE job non-derivation behavior
- parser/generated artifacts
- application projections
- presentation behavior
- dependency versions
- VS Code compatibility
- web compatibility
- `engines.vscode`

### Slice-3-E Approval-Sensitive Scope

Implementation may add local helpers or local data structures inside
`src/domain/models/parameters/transferOperationHelpers.ts` and rewrite
`resolveTopDefaultRawValue` as a smaller coordinator while preserving public
exports and behavior.

Any change to transfer-operation default semantics, public helper API,
parser/generated artifacts, application projections, presentation behavior,
dependency versions, VS Code compatibility, web compatibility, or
`engines.vscode` requires separate approval.

### Slice-3-E Result

`transferOperationHelpers.ts` now resolves `topN` default raw values through a
local source/destination presence table instead of branch-heavy conditional
returns.

The change preserves public helper exports, `topN` default derivation,
source plus destination defaulting to `sav`, source without destination
defaulting to `del`, destination without source deriving no default, no
transfer-file presence deriving no default, explicit `topN` value precedence,
QUEUE job non-derivation behavior, parser/generated artifacts, application
projections, presentation behavior, dependency versions, VS Code
compatibility, web compatibility, and `engines.vscode`.

Targeted Qlty smell output reports no findings. Targeted metrics changed from
0 classes / 2 funcs / cyclo 5 / complexity 7 / LOC 36 before Slice-3-E to
0 classes / 3 funcs / cyclo 2 / complexity 2 / LOC 36. The next planning
decision is the next Slice-3 domain-helper candidate.

### Slice-3-F Target

Slice-3-F targets `src/domain/models/parameters/ScheduleRule.ts`.

Current Qlty evidence:

- `Sd.type` reports many-returns and high-complexity findings.
- Same-file duplication is reported across schedule-rule parameter classes.
- Metrics for `ScheduleRule.ts` are 8 classes / 24 funcs / cyclo 35 /
  complexity 16 / LOC 179.

### Slice-3-F Investigation

`ScheduleRule.ts` defines domain parameter objects for schedule rules such as
`Cftd`, `Cy`, `Ln`, `Sd`, `Sh`, `Shd`, and `Wc`. The current smell cluster is
local to `Sd.type` classification and duplicated schedule-rule parsing/storage
shape in the parameter classes.

Production use flows through `ruleParameterBuilders.ts`, `ParameterFactory`,
`N` schedule getters, and unit-list group 10 schedule projections. Existing
tests in `parameterFactory.test.ts`, `parameterHelpers.test.ts`,
`buildUnitListGroup10View.test.ts`, and `buildUnitListView.test.ts` cover
facade behavior, schedule-rule alignment, `sd` type/value results, `ln`
parent rules, `sh` substitutes, `shd` shift days, `wc` wait counts, and group
10 projections.

### Slice-3-F Boundary Decision

Reduce the same-file schedule-rule parameter smell/metric cluster inside
`ScheduleRule.ts` only.

Do not change:

- public parameter class exports
- `Sd.type` results for `en`, `ud`, `+`, `*`, `@`, and empty/default cases
- `Sd.yearMonth`
- `Sd.day`
- `Ln.parentRule`
- `Sh.substitute`
- `Shd.shiftDays` default `2`
- `Wc.numberOfTimes` default `1`
- schedule-rule parsing helper behavior
- unit-list group 10 projections
- diagnostics behavior
- parser/generated artifacts
- application projections
- presentation behavior
- dependency versions
- VS Code compatibility
- web compatibility
- `engines.vscode`

### Slice-3-F Approval-Sensitive Scope

Implementation may add local helpers or local base abstractions inside
`src/domain/models/parameters/ScheduleRule.ts` and rewrite `Sd.type` plus the
same-file duplicated schedule-rule parameter initialization shape while
preserving public class names, public getters, and behavior.

Any change to schedule-rule parameter semantics, public parameter API,
schedule-rule parsing helper behavior, diagnostics, parser/generated
artifacts, application projections, presentation behavior, dependency
versions, VS Code compatibility, web compatibility, or `engines.vscode`
requires separate approval.

### Slice-3-F Result

`ScheduleRule.ts` now resolves `Sd.type` through local literal and prefix
tables instead of a branch-heavy return chain. Parsed schedule-rule parameter
classes now share rule/value initialization through a local abstract base class
while keeping the public class names and getters unchanged.

The change preserves public parameter class exports, `Sd.type` results for
`en`, `ud`, `+`, `*`, `@`, and empty/default cases, `Sd.yearMonth`, `Sd.day`,
`Ln.parentRule`, `Sh.substitute`, `Shd.shiftDays` default `2`,
`Wc.numberOfTimes` default `1`, schedule-rule parsing helper behavior,
unit-list group 10 projections, diagnostics behavior, parser/generated
artifacts, application projections, presentation behavior, dependency
versions, VS Code compatibility, web compatibility, and `engines.vscode`.

Targeted Qlty smell output reports no findings. Targeted metrics changed from
8 classes / 24 funcs / cyclo 35 / complexity 16 / LOC 179 before Slice-3-F to
8 classes / 22 funcs / cyclo 25 / complexity 9 / LOC 153. The next planning
decision is the next Slice-3 domain-helper candidate.

### Slice-3-G Target

Slice-3-G targets `src/domain/models/parameters/parameterHelpers.ts`.

Current Qlty evidence:

- `resolveParameterArray` reports many-returns and high-complexity findings.
- `resolveDefaultRawValue` reports a many-returns finding.
- `resolveScopedDefaultRawValue` reports a high-complexity finding.
- `buildSdAlignedScheduleParameters` reports a many-parameters finding.
- Metrics for `parameterHelpers.ts` are 0 classes / 21 funcs / cyclo 52 /
  complexity 47 / LOC 338.

### Slice-3-G Investigation

`parameterHelpers.ts` centralizes domain parameter lookup, inherited parameter
fallback, default raw-value application, and schedule-rule array alignment.
Production use flows through optional/required/inherited parameter builders,
rule parameter builders, transfer-operation builders, `ParameterFactory`,
domain unit getters, and unit-list schedule projections.

Existing tests in `parameterHelpers.test.ts`, `parameterFactory.test.ts`, and
unit-list schedule projection coverage exercise own parameter precedence,
inherited lookup, default scalar and array fallback behavior, root-jobnet
defaults, connector-control defaults, singular parameter errors, schedule-rule
sorting, sd-aligned placeholders, and facade behavior.

### Slice-3-G Boundary Decision

Reduce the same-file parameter resolution and schedule-rule alignment
smell/metric cluster inside `parameterHelpers.ts` only.

Do not change:

- public helper exports
- parameter symbol validation
- own-parameter precedence over inherited and default values
- parent-chain inherited lookup behavior
- default array fallback behavior
- default scalar fallback behavior
- root-jobnet default values
- connector-control default values and modes
- `resolveParameter` singular-array error behavior
- schedule-rule sorting
- sd-aligned default/null placeholder behavior
- parser/generated artifacts
- application projections
- presentation behavior
- dependency versions
- VS Code compatibility
- web compatibility
- `engines.vscode`

### Slice-3-G Approval-Sensitive Scope

Implementation may add local helper functions or local input object types
inside `src/domain/models/parameters/parameterHelpers.ts` and rewrite
`resolveParameterArray`, default raw-value resolution, and same-file
schedule-rule alignment coordinators while preserving public helper exports
and behavior.

Any change to parameter lookup semantics, default application semantics,
schedule-rule alignment behavior, public helper API, parser/generated
artifacts, application projections, presentation behavior, dependency
versions, VS Code compatibility, web compatibility, or `engines.vscode`
requires separate approval.

### Slice-3-G Result

`parameterHelpers.ts` now resolves root-jobnet default raw values and default
application modes through local tables, normalizes sd-aligned schedule helper
input through a local object shape while preserving existing four-argument
calls, and delegates own, inherited, and default parameter array resolution to
focused local helpers.

The change preserves public helper exports, parameter symbol validation, own
parameter precedence over inherited/default values, parent-chain inherited
lookup, default array and scalar fallback behavior, root-jobnet defaults,
connector-control defaults and modes, `resolveParameter` singular-array error
behavior, schedule-rule sorting, sd-aligned default/null placeholder behavior,
parser/generated artifacts, application projections, presentation behavior,
dependency versions, VS Code compatibility, web compatibility, and
`engines.vscode`.

Targeted Qlty smell output reports no findings. Targeted metrics changed from
0 classes / 21 funcs / cyclo 52 / complexity 47 / LOC 338 before Slice-3-G to
0 classes / 32 funcs / cyclo 48 / complexity 43 / LOC 401. The function-count
and LOC increases are accepted because the same-file smell cluster was removed
while cyclomatic and aggregate complexity decreased.

### Slice-3-H Target

Slice-3-H targets
`src/domain/models/parameters/scheduleRuleHelpers.ts`.

Current Qlty evidence:

- `parseScheduleByDaysFromStartValue` reports a high-complexity finding.
- Metrics for `scheduleRuleHelpers.ts` are 0 classes / 14 funcs / cyclo 30 /
  complexity 17 / LOC 124.

### Slice-3-H Investigation

`scheduleRuleHelpers.ts` centralizes schedule-rule fragment parsing for
schedule dates, cycles, closed-day substitution, shift days, start/wait times,
wait counts, cftd schedule-by-days values, and effective wc/wt pairing.
Production use flows through `ScheduleRule.Cftd`, unit-list `parseCftd`,
parameter factory facade behavior, and schedule diagnostics that consume the
same helper module.

Existing tests in `scheduleRuleHelpers.test.ts`, `parameterFactory.test.ts`,
`buildUnitListGroup10View.test.ts`, `buildUnitListView.test.ts`, and
`buildSyntaxDiagnostics.test.ts` cover supported schedule-rule parsing, cftd
defaults, cftd mode-specific max-shift fields, unsupported partial parses,
facade behavior, unit-list projections, and cftd diagnostics.

### Slice-3-H Boundary Decision

Reduce the same-file schedule-by-days parser smell/metric cluster inside
`scheduleRuleHelpers.ts` only.

Do not change:

- public helper exports
- schedule rule number parsing or defaulting
- accepted `cftd` types `no`, `be`, `af`, `db`, and `da`
- `no` schedule-by-days suppression
- default `scheduleByDaysFromStart` value `1` for non-`no` cftd types
- default max-shift value `10` for `be` and `af`
- no max-shift value for `no`, `db`, and `da`
- unsupported-shape rejection
- effective wc/wt pair behavior
- parser/generated artifacts
- application projections
- presentation behavior
- dependency versions
- VS Code compatibility
- web compatibility
- `engines.vscode`

### Slice-3-H Approval-Sensitive Scope

Implementation may add local helper functions or local lookup tables inside
`src/domain/models/parameters/scheduleRuleHelpers.ts` and rewrite
`parseScheduleByDaysFromStartValue` as a smaller coordinator while preserving
public helper exports and behavior.

Any change to accepted/rejected schedule-rule forms, cftd defaults, effective
wc/wt pair behavior, parser/generated artifacts, application projections,
presentation behavior, dependency versions, VS Code compatibility, web
compatibility, or `engines.vscode` requires separate approval.

### Slice-3-H Result

`scheduleRuleHelpers.ts` now parses cftd schedule-by-days matches through a
typed local helper and resolves schedule-by-days/default max-shift fields
through focused type-set helpers.

The change preserves public helper exports, schedule rule number parsing and
defaulting, accepted `cftd` types, `no` schedule-by-days suppression, default
`scheduleByDaysFromStart` value `1` for non-`no` cftd types, default
max-shift value `10` for `be` and `af`, no max-shift value for `no`, `db`,
and `da`, unsupported-shape rejection, effective wc/wt pair behavior,
parser/generated artifacts, application projections, presentation behavior,
dependency versions, VS Code compatibility, web compatibility, and
`engines.vscode`.

Targeted Qlty smell output reports no findings. Targeted metrics changed from
0 classes / 14 funcs / cyclo 30 / complexity 17 / LOC 124 before Slice-3-H to
0 classes / 17 funcs / cyclo 26 / complexity 17 / LOC 154. The function-count
and LOC increases are accepted because the target function-level smell was
removed and cyclomatic complexity decreased.

### Slice-3-I Target

Slice-3-I targets
`src/domain/models/parameters/optionalScalarParameterBuilders.ts`.

Current Qlty evidence:

- `createOptionalScalarBuilder` reports a high-complexity finding.
- Metrics for `optionalScalarParameterBuilders.ts` are 0 classes / 3 funcs /
  cyclo 5 / complexity 5 / LOC 628.

### Slice-3-I Investigation

`optionalScalarParameterBuilders.ts` centralizes construction of optional
scalar parameter facade functions. The target helper normalizes option shapes,
resolves static or dynamic defaults, chooses inherited vs own lookup, and
forwards unit/parameter/default values to `parameterHelpers`.

Production use flows through `optionalScalarParameterBuilders`,
`ParameterFactory`, domain unit getters, and unit-list projections. Existing
tests cover inherited scalar values and defaults (`md`, `ni`, `sdd`, `stt`),
root-jobnet defaults (`rg`), job-end judgment defaults (`jd`), HTTP connection
job execution-user defaults (`httpConnectionJobEu`), generic `eu` defaults,
and explicit value precedence.

### Slice-3-I Boundary Decision

Reduce the same-file optional scalar builder helper smell/metric cluster
inside `optionalScalarParameterBuilders.ts` only.

Do not change:

- public `optionalScalarParameterBuilders` keys
- `ParameterFactory` facade behavior
- option normalization from string defaults
- resolver default precedence over static defaults
- inherited-vs-own parameter lookup selection
- defaultRawValue propagation
- unit and parameter forwarding
- runtime default builders for `ncex`, `ncl`, and `ncs`
- parser/generated artifacts
- application projections
- presentation behavior
- dependency versions
- VS Code compatibility
- web compatibility
- `engines.vscode`

### Slice-3-I Approval-Sensitive Scope

Implementation may add local helper functions or local input types inside
`src/domain/models/parameters/optionalScalarParameterBuilders.ts` and rewrite
`createOptionalScalarBuilder` as a smaller coordinator while preserving public
builder exports and behavior.

Any change to builder keys, facade behavior, default selection semantics,
inherited lookup behavior, parser/generated artifacts, application
projections, presentation behavior, dependency versions, VS Code
compatibility, web compatibility, or `engines.vscode` requires separate
approval.

### Slice-3-I Result

`optionalScalarParameterBuilders.ts` now splits option normalization, default
raw-value resolution, and own/inherited lookup selection into focused local
helpers, leaving `createOptionalScalarBuilder` as the coordinator that builds
the facade function.

The change preserves public `optionalScalarParameterBuilders` keys,
`ParameterFactory` facade behavior, option normalization from string defaults,
resolver default precedence over static defaults, inherited-vs-own parameter
lookup selection, defaultRawValue propagation, unit and parameter forwarding,
runtime default builders for `ncex`, `ncl`, and `ncs`, parser/generated
artifacts, application projections, presentation behavior, dependency
versions, VS Code compatibility, web compatibility, and `engines.vscode`.

Targeted Qlty smell output reports no findings. Targeted metrics changed from
0 classes / 3 funcs / cyclo 5 / complexity 5 / LOC 628 before Slice-3-I to
0 classes / 6 funcs / cyclo 5 / complexity 4 / LOC 640. The function-count
and LOC increases are accepted because the target function-level smell was
removed and aggregate complexity decreased.

### Slice-3-J Target

Slice-3-J targets `src/domain/models/ajs/AjsDocument.ts`.

Current Qlty evidence:

- `findInheritedAjsUnitParameters` reports a high-complexity finding.
- Metrics for `AjsDocument.ts` are 0 classes / 12 funcs / cyclo 17 /
  complexity 10 / LOC 121.

### Slice-3-J Investigation

`AjsDocument.ts` centralizes normalized AJS document lookup helpers for units,
parents, ancestors, roots, parameters, and inherited parameter values.
`findInheritedAjsUnitParameters` currently walks ancestors and returns the
first non-empty parameter array for the requested key.

Serena reference lookup found direct inherited-array helper usage only from
the same-file single-parameter helper. Production behavior still reaches
unit-list inherited parameter projections through the same public helper
family, including schedule, linked-unit, and priority projections. The shared
`findAjsUnitAncestors` helper is also used by flow graph input-node
construction.

### Slice-3-J Boundary Decision

Reduce only the local inherited-parameter lookup shape in `AjsDocument.ts`.

Do not change:

- public AjsDocument helper exports
- parent-to-root ancestor ordering
- nearest-ancestor first-hit inherited parameter precedence
- duplicate parameter arrays
- undefined fallback behavior
- root-unit lookup behavior
- normalized document shape
- parser/generated artifacts
- application projections
- presentation behavior
- dependency versions
- VS Code compatibility
- web compatibility
- `engines.vscode`

### Slice-3-J Approval-Sensitive Scope

Implementation may add local helper functions inside
`src/domain/models/ajs/AjsDocument.ts` and rewrite
`findInheritedAjsUnitParameters` as a smaller coordinator while preserving
public helper exports and behavior.

Any change to inherited parameter lookup semantics, ancestor ordering, public
helper API, normalized document contracts, parser/generated artifacts,
application projections, presentation behavior, dependency versions, VS Code
compatibility, web compatibility, or `engines.vscode` requires separate
approval.

### Slice-3-J Result

`AjsDocument.ts` now resolves inherited parameter arrays through local
non-empty-array and first-match helpers, leaving
`findInheritedAjsUnitParameters` as the public coordinator over ancestor units.

The change preserves public AjsDocument helper exports, parent-to-root
ancestor ordering, nearest-ancestor first-hit inherited parameter precedence,
duplicate parameter arrays, undefined fallback behavior, root-unit lookup
behavior, normalized document shape, parser/generated artifacts, application
projections, presentation behavior, dependency versions, VS Code
compatibility, web compatibility, and `engines.vscode`.

Targeted Qlty smell output reports no findings. Targeted metrics changed from
0 classes / 12 funcs / cyclo 17 / complexity 10 / LOC 121 before Slice-3-J to
0 classes / 14 funcs / cyclo 17 / complexity 5 / LOC 121. The function-count
increase is accepted because the target function-level smell was removed and
aggregate complexity decreased.

### Slice-3-K Target

Slice-3-K targets `src/domain/models/ajs/normalize/relations.ts`.

Current Qlty evidence:

- `resolveNormalizedRelations` reports a high-complexity finding.
- Metrics for `relations.ts` are 0 classes / 2 funcs / cyclo 8 /
  complexity 9 / LOC 57.

### Slice-3-K Investigation

`relations.ts` parses normalized `ar` parameter values and resolves them into
normalized relation DTOs by matching source and target names against already
normalized child units.

Serena reference lookup found direct production use from `normalizeUnitTree`.
Direct tests in `normalizeRelations.test.ts` cover parsing, valid relation
output, invalid relation warnings, and missing target warnings. Broader
fixtures in normalized document, flow graph, expanded flow graph, and
unit-list relation tests exercise relation propagation after normalization.

### Slice-3-K Boundary Decision

Reduce only the local normalized relation resolver shape in `relations.ts`.

Do not change:

- public `parseNormalizedRelation` and `resolveNormalizedRelations` exports
- `ar` parameter parsing behavior
- invalid-relation warning behavior
- missing-target warning behavior
- child-name-to-id lookup behavior
- relation output ordering
- `seq`/`con` relation type normalization
- normalized document shape
- parser/generated artifacts
- application projections
- presentation behavior
- dependency versions
- VS Code compatibility
- web compatibility
- `engines.vscode`

### Slice-3-K Approval-Sensitive Scope

Implementation may add local helper functions, local context types, or a
focused helper module under the same normalize boundary and rewrite
`resolveNormalizedRelations` as a smaller coordinator while preserving public
helper exports and behavior.

Any change to relation parsing semantics, warning semantics, child lookup,
relation ordering, public helper API, normalized document contracts,
parser/generated artifacts, application projections, presentation behavior,
dependency versions, VS Code compatibility, web compatibility, or
`engines.vscode` requires separate approval.

### Slice-3-K Result

`relations.ts` now builds an explicit relation-resolution context and resolves
each `ar` parameter value through local helpers for child lookup, warning
recording, parsed relation resolution, and normalized DTO construction.

The approval clarified that implementation did not need to stay in one file
when a focused file split was appropriate. The final change stayed in
`relations.ts` because the helper set remained small and did not justify a
new module.

The change preserves public `parseNormalizedRelation` and
`resolveNormalizedRelations` exports, `ar` parameter parsing behavior,
invalid-relation warning behavior, missing-target warning behavior,
child-name-to-id lookup behavior, relation output ordering, `seq`/`con`
relation type normalization, normalized document shape, parser/generated
artifacts, application projections, presentation behavior, dependency
versions, VS Code compatibility, web compatibility, and `engines.vscode`.

Targeted Qlty smell output reports no findings. Targeted metrics changed from
0 classes / 2 funcs / cyclo 8 / complexity 9 / LOC 57 before Slice-3-K to
0 classes / 7 funcs / cyclo 8 / complexity 9 / LOC 91. The function-count and
LOC increases are accepted because the target function-level smell was removed
without changing relation behavior.

### Slice-3-L Target

Slice-3-L targets `src/domain/models/ajs/normalize/unitBuilder.ts`.

Current Qlty evidence:

- `buildNormalizedUnit` reports a many-parameters finding.
- Metrics for `unitBuilder.ts` are 0 classes / 1 func / cyclo 2 /
  complexity 0 / LOC 44.

### Slice-3-L Investigation

`unitBuilder.ts` constructs normalized AJS unit DTOs from a parsed `Unit`, the
resolved normalized unit type, resolved relation DTOs, and normalized child
units.

Serena reference lookup found direct production use from `normalizeUnitTree`
and direct test use from `normalizeUnitBuilder.test.ts`. The direct test
asserts the complete normalized unit shape, including identity fields,
metadata, normalized flags, layout, parameter projection, relations, and
children. Broader normalized tree/document tests cover recursive composition.

### Slice-3-L Boundary Decision

Reduce only the normalized unit builder input shape.

Do not change:

- public normalized unit field names or values
- child ordering
- relation ordering
- parameter projection from parser units
- unit type and group type resolution
- comment resolution
- depth and parent id resolution
- root, recovery, root-jobnet, schedule, and wait flags
- layout values
- normalized document shape
- parser/generated artifacts
- application projections
- presentation behavior
- dependency versions
- VS Code compatibility
- web compatibility
- `engines.vscode`

### Slice-3-L Approval-Sensitive Scope

Implementation may change `buildNormalizedUnit` to accept a grouped input
object and update direct call sites in `normalizeUnitTree` and
`normalizeUnitBuilder.test.ts`. It may add local input types or focused helper
functions/modules under the same normalize boundary when they reduce real
complexity.

Any change to normalized unit semantics, public normalized DTO fields,
parameter projection, child/relation ordering, normalized document contracts,
parser/generated artifacts, application projections, presentation behavior,
dependency versions, VS Code compatibility, web compatibility, or
`engines.vscode` requires separate approval.

### Slice-3-L Result

`buildNormalizedUnit` now accepts a single `NormalizedUnitInput` object
containing the parsed unit, resolved unit type, normalized relations, and
normalized children. Direct production and test call sites were updated to use
the grouped input shape.

The change preserves public normalized unit field names and values, child
ordering, relation ordering, parameter projection from parser units, unit type
and group type resolution, comment resolution, depth and parent id resolution,
root, recovery, root-jobnet, schedule, and wait flags, layout values,
normalized document shape, parser/generated artifacts, application
projections, presentation behavior, dependency versions, VS Code
compatibility, web compatibility, and `engines.vscode`.

Targeted Qlty smell output reports no findings. Targeted metrics changed from
0 classes / 1 func / cyclo 2 / complexity 0 / LOC 44 before Slice-3-L to
0 classes / 1 func / cyclo 2 / complexity 0 / LOC 50. The LOC increase is
accepted because the target many-parameters smell was removed without changing
normalized unit behavior.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility must be preserved.
- Desktop extension compatibility must be preserved.

## Acceptance Criteria

- Target files show lower Qlty complexity or smell counts after each approved
  slice.
- Required tests remain green.
- No observable product behavior changes are introduced by quality-only
  refactors.

## Non-Goals

- Feature additions
- Runtime redesign
- Parser modernization
- Dependency modernization

## Open Questions

- Which domain helper should follow Slice-3-L.
