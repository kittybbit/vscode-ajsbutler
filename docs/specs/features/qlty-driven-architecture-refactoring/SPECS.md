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

- After Slice-2-Y, should Slice-2 continue with
  `syntaxDiagnosticRuleBuilders`, `syntaxDiagnosticScalarValidators`, or close
  application orchestration work?
