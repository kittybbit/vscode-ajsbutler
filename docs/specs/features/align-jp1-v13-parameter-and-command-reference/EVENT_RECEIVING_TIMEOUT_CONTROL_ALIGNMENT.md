# Event Receiving Timeout-Control Alignment

## Purpose

Record the next JP1/AJS3 version 13 parameter-alignment candidate for the
timeout-control and start-condition-restricted parameters of JP1 event
reception monitoring jobs.

This keeps the backlog grouped at a user-meaningful size: users configure one
JP1 event reception monitoring job definition, and the remaining timeout
control gaps all sit on the same `evwj` / `revwj` diagnostic seam.

## Normative Reference

- Product/version: JP1/Automatic Job Management System 3 version 13
- Manual section:
  Command Reference, `5.2.9 Job definition for monitoring JP1 event reception`
- Source URL:
  <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0224.HTM>

## Slice Boundary

- Application seam:
  `src/application/editor-feedback/buildSyntaxDiagnostics.ts`
- Existing consumers:
  `src/extension/diagnostics/registerDiagnostics.ts` plus
  `src/domain/models/units/Evwj.ts` and `Revwj` via inheritance
- Regression evidence:
  `src/test/suite/buildSyntaxDiagnostics.test.ts`
- Preservation evidence:
  existing raw projection coverage in `src/test/suite/buildUnitListView.test.ts`
- Out of scope:
  parser grammar changes, domain wrapper normalization changes, unit-list
  projection changes, flow projection changes, command generation,
  generated artifacts, dependency changes, configuration changes,
  compatible-ISAM or host-environment inputs, `fd` disabled-on-execution
  semantics, `evwsv`, `jpoif`, wait-condition parameters such as `mm`,
  `nmg`, `eun`, `ega`, and `uem`, and `engines.vscode`

## Investigation Notes

- The current event-receiving diagnostic path already validates search-scope,
  event-host, string-filter, and numeric-identifier values, but it still
  preserves explicit `etm`, `ha`, and `ets` values without semantic
  diagnostics.
- `Evwj` already exposes `etm`, `ha`, and `ets` through the same
  `ParamFactory` facade and the same shared application editor-feedback
  boundary as the previously delivered event-receiving slices.
- The official JP1/AJS3 v13 command reference states:
  - `etm` accepts decimal values in the range `1..1440`.
  - `ha` accepts only `y` or `n`.
  - `ets` accepts only `kl`, `nr`, `wr`, or `an`.
  - explicit `etm`, `ha`, and `ets` are invalid for a job within the start
    condition.
- `buildSyntaxDiagnostics.ts` already has the main seams needed for this
  grouped slice:
  - `buildExplicitDecimalRangeRule(...)` already covers the `1..1440`
    numeric-range shape;
  - `eventTimeoutActionDiagnosticRules` already centralizes explicit `ets`
    allowed-value checks for other wait-like job families;
  - `hasStartConditionContext(...)` already detects the sibling start-
    condition context used by the recent execution-interval slice.
- This candidate is preferable to returning to HTTP Connection `eu`, because
  it closes multiple still-visible validation gaps in one job family at once.
- This candidate is preferable to broadening immediately into compatible-ISAM
  or `fd` behavior, because the timeout-control family stays inside one
  existing diagnostic seam and avoids introducing a new environment or
  disabled-behavior interpretation seam during the same slice.

## Delivered Alignment

- Keep ownership in the shared application editor-feedback boundary.
- Add grouped semantic diagnostics for explicit invalid `etm`, `ha`, and
  `ets` values on `evwj` / `revwj`.
- Add grouped semantic diagnostics for explicit `etm`, `ha`, and `ets`
  values when the unit is defined in a start-condition context.
- Reuse existing shared explicit-value and sibling-context helpers where
  practical, extracting only the smallest helper or rule-array refactor
  needed to keep the checks on the current event-receiving diagnostics path.
- Preserve raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation.

## Delivered Behavior

- Editor feedback now reports semantic diagnostics when explicit `etm` values
  on `evwj` / `revwj` fall outside the documented JP1/AJS3 v13 range
  `1..1440`.
- Editor feedback now reports semantic diagnostics when explicit `ha` values
  on `evwj` / `revwj` fall outside the documented JP1/AJS3 v13 value set
  `{y|n}`.
- Editor feedback now reports semantic diagnostics when explicit `ets` values
  on `evwj` / `revwj` fall outside the documented JP1/AJS3 v13 value set
  `{kl|nr|wr|an}`.
- Editor feedback now reports semantic diagnostics when explicit `etm`, `ha`,
  or `ets` is specified on a JP1 event reception monitoring job defined in a
  start-condition context.
- Existing event-receiving search-scope, event-host, string-filter, and
  numeric-identifier diagnostics remain on the same shared rule path.

## Affected Backlog

- Event reception monitoring job:
  remaining timeout-control and start-condition-restricted validation outside
  the already aligned search-scope, string-filter, event-host, and numeric-
  identifier families

## Alternatives

- Pick HTTP Connection `eu` next:
  rejected because it is smaller and less user-visible than the grouped
  event-receiving timeout-control slice.
- Broaden this slice immediately to `fd`:
  rejected for now because the manual says `fd` is disabled when a start-
  condition job is executed, which is a different semantic shape from
  outright invalid explicit timeout-control parameters.
- Move the validation into domain wrappers:
  rejected because the current alignment policy preserves raw explicit
  manual-invalid values and surfaces them through editor feedback.

## Remaining Gap

- `fd` range or disabled-on-execution behavior, compatible-ISAM-sensitive
  interpretation, and the broader wait-condition parameter family remain
  separate future slices because they introduce different validation shapes
  or new runtime-context seams.
