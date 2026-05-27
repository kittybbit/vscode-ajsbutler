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

- Which domain helper should follow Slice-3-A?
