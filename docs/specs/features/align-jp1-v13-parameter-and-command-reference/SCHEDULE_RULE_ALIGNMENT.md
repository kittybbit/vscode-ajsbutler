# Schedule Rule Parameter Alignment

## Purpose

Record the JP1/AJS3 version 13 alignment slice for jobnet schedule-rule
parameters. This is the first category-level value-parsing alignment pattern;
later parameter categories should follow the same audit, helper-boundary, and
regression-test workflow instead of moving one key at a time.

This document covers only the jobnet schedule-rule family already called out in
this feature: `sd`, `ln`, `st`, `cy`, `sh`, `shd`, `cftd`, `sy`, `ey`, `wc`,
and `wt`.

## Normative Reference

- Product/version: JP1/Automatic Job Management System 3 version 13
- Manual section: Command Reference, `5.2.4 Jobnet definition`
- Source URL:
  <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM>

## Slice Boundary

- Domain seams:
  `src/domain/models/parameters/scheduleRuleHelpers.ts`,
  `src/domain/models/parameters/ruleParameterBuilders.ts`,
  `src/domain/models/parameters/parameterHelpers.ts`,
  `src/domain/models/parameters/Day.ts`,
  `src/domain/models/parameters/Time.ts`, and
  `src/domain/models/parameters/ScheduleRule.ts`
- Application consumer:
  `src/application/unit-list/buildUnitListGroup10View.ts` through
  `src/application/unit-list/unitListViewHelpers.ts`
- Regression evidence:
  `src/test/suite/scheduleRuleHelpers.test.ts`,
  `src/test/suite/parameterFactory.test.ts`,
  `src/test/suite/parameterHelpers.test.ts`,
  `src/test/suite/buildUnitListGroup10View.test.ts`, and
  `src/test/suite/buildUnitListView.test.ts`
- Out of scope:
  parser grammar token generation, all-key coverage, UI redesign, unrelated
  command generation, numeric range diagnostics, and cross-parameter
  invalidation diagnostics

## Shared Expectations

- Omitted schedule-rule number `N` resolves to rule `1`, unless a
  parameter-specific note says otherwise.
- Schedule-rule value-shape parsing lives in
  `scheduleRuleHelpers.ts`; domain wrapper classes and unit-list projection
  reuse the same helpers.
- `ln` on root jobnets is ignored, matching the manual note that root-jobnet
  specification is ignored.
- `cftd` defaults are interpreted by mode: start days default to `1`; maximum
  shift days default to `10` for `be` / `af`; maximum shift days are ignored for
  `no`, `db`, and `da`.

## Parameter Status

- `sd`
  - Covered: repeatable schedule dates, rule numbers, root default `1,en`, and
    `sd=0,ud` preservation.
  - Seam: `parseScheduleDateValue`, `Sd`, and `resolveSdParameters`.
  - Remaining gap: explicit date and rule value ranges; `sd=0,ud` handling and
    `SCHEDULELIMIT`-dependent year-range policy remain separate product-
    decision follow-up items.
- `ln`
  - Covered: nested jobnet parent-rule mapping; root-jobnet values ignored.
  - Seam: `parseParentScheduleRuleValue`, `Ln`, and the root-jobnet ignored
    builder.
  - Remaining gap: rule value ranges.
- `st`
  - Covered: per-`sd` start time; omitted value default `+00:00`.
  - Seam: `parseStartTimeValue` and `St`.
  - Remaining gap: time range validation.
- `cy`
  - Covered: per-`sd` cycle value shape.
  - Seam: `parseCycleValue` and `Cy`.
  - Remaining gap: cycle ranges and open/closed-day restrictions.
- `sh`
  - Covered: per-`sd` substitution values `be`, `af`, `ca`, and `no`.
  - Seam: `parseClosedDaySubstitutionValue` and `Sh`.
  - Remaining gap: none for value-shape parsing.
- `shd`
  - Covered: per-`sd` max shift days; omitted value default `2`.
  - Seam: `parseShiftDaysValue` and `Shd`.
  - Remaining gap: range validation.
- `cftd`
  - Covered: per-`sd` mode, start-day default, and mode-specific max-shift
    default/ignore behavior.
  - Seam: `parseScheduleByDaysFromStartValue` and `Cftd`.
  - Remaining gap: range validation.
- `sy`
  - Covered: per-`sd` delayed start time; absolute or relative-minute shape.
  - Seam: `parseDelayTimeValue` and `Sy`.
  - Remaining gap: range validation.
- `ey`
  - Covered: per-`sd` delayed end time; absolute or relative-minute shape.
  - Seam: `parseDelayTimeValue` and `Ey`.
  - Remaining gap: range validation.
- `wc`
  - Covered: per-`sd` start-condition count; omitted value default `no`.
  - Seam: `parseWaitCountValue` and `Wc`.
  - Remaining gap: range validation.
- `wt`
  - Covered: per-`sd` monitoring end time; omitted value default `no`.
  - Seam: `parseWaitTimeValue` and `Wt`.
  - Remaining gap: range validation.

## WC / WT Pairing Delivered Alignment

- Manual basis:
  Command Reference, `5.2.4 Jobnet definition`, says `wt` and `wc` are
  specified together for start-condition monitoring.
- Domain helper:
  `resolveEffectiveStartConditionMonitoringPair` resolves paired `wc` / `wt`
  raw values and returns no effective values when either side is `no`, missing,
  or unparsable.
- Wrapper API:
  `Wc.effectiveNumberOfTimes(waitTimeRawValue)` and
  `Wt.effectiveTime(waitCountRawValue)` expose the paired effective values
  without changing `Wc.numberOfTimes`, `Wt.time`, or `value()`.
- Projection boundary:
  normalized unit-list projection remains raw and unchanged.
- Regression evidence:
  `scheduleRuleHelpers.test.ts` covers helper-level pair resolution, and
  `parameterFactory.test.ts` verifies raw values stay visible while effective
  values are disabled for `no` pairs.

## WC / WT Unit-List Projection Delivered Alignment

- Projection behavior:
  unit-list group 10 start-condition columns now display effective `wc` /
  `wt` values from the paired helper. Disabled, missing, or unparsable pairs
  display empty count and time cells.
- Raw preservation:
  parser output, raw domain wrapper values, and normalized raw parameter
  storage remain unchanged.
- Regression evidence:
  `buildUnitListGroup10View.test.ts` covers disabled `wc=4` / `wt=no`,
  disabled `wc=2,no` / `wt=2,01:00`, and valid `wc=3,un` / `wt=3,un`.

## Delivered Alignment

- `ln`: root-jobnet values are ignored while nested jobnet values remain sorted
  and visible to the unit-list parent-rule projection.
- Shared rule-number behavior: omitted `N` values now resolve to rule `1`
  across the schedule-rule domain boundary.
- Shared value-shape parsing: schedule-rule parameter values parse through
  `scheduleRuleHelpers.ts`, and unit-list projection no longer maintains a
  separate set of schedule-rule regular expressions.

## Historical Grouped Slice Plan

- Treat the next remaining schedule-rule work as one parameter-family slice for
  jobnets, not as a return to one-key diagnostics.
- Use the shared `scheduleRuleHelpers.ts` seam to verify already-modeled
  explicit schedule-rule values before reporting user-visible range issues
  through `buildSyntaxDiagnostics.ts`.
- Keep raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation unchanged
  unless a later approval explicitly broadens scope beyond diagnostics.
- Focus the approval-gated investigation on the schedule-rule keys that still
  have documented range gaps after value-shape alignment:
  `ln`, `st`, `cy`, `shd`, `cftd`, `sy`, `ey`, `wc`, and `wt`.
- Keep `sd` out of the first grouped follow-up unless the implementation
  investigation resolves the separate product decision around `sd=0,ud`
  handling and date-range policy.
- Keep `sh` out of the follow-up because value-shape parsing for that key has
  no remaining gap in this feature record.

## Impact

- User-visible diagnostics would change for syntactically valid JP1/AJS
  documents containing explicit out-of-range schedule-rule values on jobnets.
- The likely implementation surface spans
  `src/domain/models/parameters/scheduleRuleHelpers.ts`,
  `src/application/editor-feedback/buildSyntaxDiagnostics.ts`,
  `src/test/suite/scheduleRuleHelpers.test.ts`, and
  `src/test/suite/buildSyntaxDiagnostics.test.ts`.
- Existing schedule-rule helper references in wrapper classes and unit-list
  projection should not need projection changes if the slice stays inside
  editor-feedback diagnostics.

## Alternatives

- Reopen the backlog as smaller single-parameter fixes, rejected because the
  remaining gaps are already organized behind a shared schedule-rule seam and
  shared regression evidence.
- Switch to a different job type first, viable but deferred because schedule
  rules are the clearest remaining parameter-family candidate.
- Expand the slice to cross-parameter invalidation or UI redesign, rejected
  because that broadens the behavior and regression surface beyond range
  diagnostics.

## Delivered Range Diagnostics

- The editor-feedback boundary now reports semantic diagnostics for explicit
  jobnet `ln`, `st`, `cy`, `shd`, `cftd`, `sy`, `ey`, `wc`, and `wt` values
  when they fall outside the grouped JP1/AJS3 v13 schedule-rule ranges covered
  by this slice.
- Root-jobnet `ln` remains ignored, matching the existing manual-aligned
  boundary decision that root-jobnet parent-rule specification is ignored.
- Diagnostics stay focused on explicit parameter values and preserve raw parser
  output, domain wrapper values, normalized parameters, unit-list projection,
  flow projection, and command generation.
- This slice intentionally does not add cross-parameter invalidation such as
  `sd` / `cy` open-closed-day coupling, and it keeps `sd` date-range policy
  outside the grouped follow-up.

## Follow-up

- Grouped jobnet schedule-rule compatibility for `sd` / `cy` is now aligned
  through `buildSyntaxDiagnostics.ts`. Explicit `cy=(n,w)` values now report a
  semantic diagnostic when the matching `sd` rule for the same schedule rule
  number uses open-day (`*`) or closed-day (`@`) scheduling semantics.
- Grouped explicit `sd` diagnostics are now aligned through
  `buildSyntaxDiagnostics.ts`, including the documented valid `sd=0,ud`
  special case and the documented `1994..SCHEDULELIMIT` year range using the
  official default `SCHEDULELIMIT=2036` during this slice.
- Revisit environment-specific `SCHEDULELIMIT` override support separately if
  the repository later needs diagnostics against non-default site settings.
- Revisit any broader schedule-rule cross-parameter invalidation separately if
  implementation investigation reveals rules beyond the approved `sd` / `cy`
  weekly-cycle restriction.
- Apply this category-level parser alignment workflow to the next non-schedule
  parameter family before marking that category official-reference aligned.

## Delivered SD / CY Compatibility Diagnostics

- The editor-feedback boundary now reports semantic diagnostics for explicit
  jobnet `cy=(n,w)` values when the matching `sd` rule for the same schedule
  rule number uses open-day (`*`) or closed-day (`@`) scheduling semantics.
- Diagnostics stay focused on explicit `cy` parameters and preserve raw parser
  output, domain wrapper values, normalized parameters, unit-list projection,
  flow projection, and command generation.
- The delivered slice intentionally does not broaden into `sd` date-range
  validation, `sd=0,ud` product policy, or broader schedule-rule
  cross-parameter invalidation.

## Delivered SD Date/Rule Diagnostics

- The editor-feedback boundary now reports semantic diagnostics for explicit
  jobnet `sd` values when they use rule numbers outside `1..144`, except for
  the documented valid special case `sd=0,ud`.
- Explicit `sd` year values now report a semantic diagnostic when they fall
  outside the documented `1994..SCHEDULELIMIT` range, using the official
  default `SCHEDULELIMIT=2036` during this slice.
- Explicit `sd` month/day forms now report a semantic diagnostic when they use
  out-of-range month, day, end-of-month-offset, or weekday-occurrence values.
- Diagnostics stay focused on explicit `sd` parameters and preserve raw parser
  output, domain wrapper values, normalized parameters, unit-list projection,
  flow projection, and command generation.
