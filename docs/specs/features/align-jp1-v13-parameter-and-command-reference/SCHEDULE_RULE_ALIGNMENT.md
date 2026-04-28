# Schedule Rule Parameter Alignment

## Purpose

Record the JP1/AJS3 version 13 alignment slice for jobnet schedule-rule
parameters. This is the first category-level value-parsing alignment pattern;
later parameter categories should follow the same audit, helper-boundary, and
regression-test workflow instead of moving one key at a time.

This document covers only the jobnet schedule-rule family already called out in
`AUDIT.md`: `sd`, `ln`, `st`, `cy`, `sh`, `shd`, `cftd`, `sy`, `ey`, `wc`, and
`wt`.

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
  - Remaining gap: date and rule value ranges; product decision on collapsing
    `sd=0,ud`.
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

## WC / WT Pairing Candidate

- Manual basis:
  Command Reference, `5.2.4 Jobnet definition`, says `wt` and `wc` are
  specified together for start-condition monitoring.
- Current behavior:
  `ruleParameterBuilders.wc` and `ruleParameterBuilders.wt` independently
  align defaults to each `sd` rule. `Wc.numberOfTimes` and `Wt.time` expose the
  parsed value without checking the paired parameter for the same rule.
- Behavior candidate:
  keep explicit raw `wc` and `wt` parameters parseable, but expose the
  effective start-condition values as disabled when either paired value for the
  same rule is `no`.
- Affected seams:
  `scheduleRuleHelpers.ts`, `ScheduleRule.ts`, `Time.ts`,
  `ruleParameterBuilders.ts`, `ParamFactory.wc`, and `ParamFactory.wt`.
- Affected application consumers:
  group 10 unit-list projection through
  `src/application/unit-list/buildUnitListGroup10View.ts` and
  `src/application/unit-list/unitListViewHelpers.ts` if the approved behavior
  includes default-aware or effective-value list projection.
- Regression evidence needed:
  focused domain tests for paired rule evaluation, and unit-list tests only if
  projection behavior changes.
- Approval-sensitive boundary:
  raw normalized projection should remain unchanged unless explicitly approved.
  Validation diagnostics and range checks remain separate follow-up work.

## WC / WT Pairing Delivered Alignment

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

## Delivered Alignment

- `ln`: root-jobnet values are ignored while nested jobnet values remain sorted
  and visible to the unit-list parent-rule projection.
- Shared rule-number behavior: omitted `N` values now resolve to rule `1`
  across the schedule-rule domain boundary.
- Shared value-shape parsing: schedule-rule parameter values parse through
  `scheduleRuleHelpers.ts`, and unit-list projection no longer maintains a
  separate set of schedule-rule regular expressions.

## Follow-up

- Add range validation only after deciding whether invalid JP1/AJS parameter
  values should become diagnostics, warnings, or preserved raw values.
- Revisit whether unit-list projection should consume effective `wc` / `wt`
  values only as a separate projection behavior slice.
- Apply this category-level parser alignment workflow to the next non-schedule
  parameter family before marking that category official-reference aligned.
