# Schedule Rule Parameter Alignment

## Purpose

Prepare the focused JP1/AJS3 version 13 schedule-rule alignment slice before
changing parser or helper behavior.

This document keeps the slice narrower than a repository-wide parameter matrix.
It covers only the jobnet schedule-rule family already called out in
`AUDIT.md`: `sd`, `ln`, `st`, `cy`, `sh`, `shd`, `cftd`, `sy`, `ey`, `wc`, and
`wt`.

## Normative Reference

- Product/version: JP1/Automatic Job Management System 3 version 13
- Manual section: Command Reference, `5.2.4 Jobnet definition`
- Source URL:
  <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0219.HTM>

## Slice Boundary

- Owning domain seams:
  `src/domain/models/parameters/ruleParameterBuilders.ts`,
  `src/domain/models/parameters/parameterHelpers.ts`, and
  `src/domain/models/parameters/ScheduleRule.ts`
- Primary application consumer:
  `src/application/unit-list/buildUnitListGroup10View.ts`
- Regression evidence:
  `src/test/suite/parameterHelpers.test.ts`,
  `src/test/suite/parameterFactory.test.ts`,
  `src/test/suite/buildUnitListGroup10View.test.ts`, and
  `src/test/suite/buildUnitListView.test.ts`
- Out of scope for this slice:
  parser grammar token generation, all-key coverage, UI redesign, and unrelated
  command-generation work

## Manual-Aligned Expectations

### `sd`

- Manual expectation:
  jobnet execution dates are repeatable, support rule numbers, allow
  root-jobnet omission to default to rule `1` / `en`, and allow `sd=0,ud` to
  make schedules undefined.
- Current implementation seam:
  `buildRootDefaultAwareScheduleRuleParameters`, `resolveSdParameters`, and
  `Sd`.
- Existing regression evidence:
  root defaults and explicit multi-rule values are covered in
  `parameterHelpers.test.ts` and `parameterFactory.test.ts`; unit-list
  projection is covered in list tests. `parameterFactory.test.ts` also covers
  explicit `sd=0,ud` preservation.
- Status:
  partial. Default, sorting, and `sd=0,ud` preservation evidence exists; any
  collapse or reinterpretation of `sd=0,ud` still needs a product decision.

### `ln`

- Manual expectation:
  rule numbers map a nested jobnet schedule rule to an upper-level jobnet
  schedule rule; root-jobnet use is ignored by JP1/AJS3.
- Current implementation seam:
  `buildSortedScheduleRuleParameters` and `Ln`.
- Existing regression evidence:
  sorting by rule is covered in helper and facade tests; list projection is
  covered. Root-jobnet ignored behavior is covered in
  `parameterFactory.test.ts`, `buildUnitListGroup10View.test.ts`, and
  `buildUnitListView.test.ts`.
- Status:
  aligned for the current slice. `ln` values on the root jobnet are ignored by
  the domain facade and unit-list projection, while nested jobnet values remain
  visible and sorted by rule.

### `st`

- Manual expectation:
  execution start time is per `sd` rule; omitted values default to relative
  `+00:00`.
- Current implementation seam:
  `buildSdAlignedDefaultScheduleRuleParameters` and `St`.
- Existing regression evidence:
  default alignment is covered in `parameterFactory.test.ts`.
- Status:
  partial. Default alignment exists; behavior-changing time validation is not
  enforced.

### `cy`

- Manual expectation:
  processing cycle is per `sd` rule and is omitted when no processing cycle is
  set.
- Current implementation seam:
  `buildSdAlignedEmptyScheduleRuleParameters` and `Cy`.
- Existing regression evidence:
  empty `sd`-aligned placeholder behavior is covered generically; list
  projection is covered.
- Status:
  partial. Generic alignment exists; cycle range and open/closed day
  restrictions are not enforced.

### `sh`

- Manual expectation:
  closed-day substitution is per `sd` rule and supports `be`, `af`, `ca`, and
  `no`.
- Current implementation seam:
  `buildSdAlignedEmptyScheduleRuleParameters` and `Sh`.
- Existing regression evidence:
  list projection covers explicit values.
- Status:
  partial. Value parsing exists; focused default/omission evidence is thin.

### `shd`

- Manual expectation:
  maximum shift days are per `sd` rule and default to `2`.
- Current implementation seam:
  `buildSdAlignedDefaultScheduleRuleParameters` and `Shd`.
- Existing regression evidence:
  default builder behavior is covered generically and through
  `parameterFactory.test.ts`.
- Status:
  partial. Default value is encoded; range validation is not enforced.

### `cftd`

- Manual expectation:
  schedule-by-days-from-start is per `sd` rule; omitted values default to
  `no`; start days default to `1`; maximum shift days default to `10` except
  when invalid for the selected mode.
- Current implementation seam:
  `buildSdAlignedDefaultScheduleRuleParameters` and `Cftd`.
- Existing regression evidence:
  list projection covers explicit parsed display fields. Default expansion is
  covered in `parameterFactory.test.ts`.
- Status:
  partial. Value parsing and defaults exist; mode-specific invalid fields need
  explicit evidence.

### `sy`

- Manual expectation:
  delayed start time is per `sd` rule and supports absolute or relative-minute
  formats.
- Current implementation seam:
  `buildSdAlignedEmptyScheduleRuleParameters` and `Sy`.
- Existing regression evidence:
  list projection covers explicit values. Relative-minute preservation is
  covered in `parameterFactory.test.ts`.
- Status:
  partial. Aligned omission and relative-minute preservation exist; range
  validation is not enforced.

### `ey`

- Manual expectation:
  delayed end time is per `sd` rule and supports absolute or relative-minute
  formats.
- Current implementation seam:
  `buildSdAlignedEmptyScheduleRuleParameters` and `Ey`.
- Existing regression evidence:
  generic empty alignment evidence exists; list projection covers explicit
  values. Relative-minute preservation is covered in `parameterFactory.test.ts`.
- Status:
  partial. Aligned omission and relative-minute preservation exist; range
  validation is not enforced.

### `wc`

- Manual expectation:
  start-condition execution count is per `sd` rule, defaults to `no`, and is
  paired with `wt`.
- Current implementation seam:
  `buildSdAlignedDefaultScheduleRuleParameters` and `Wc`.
- Existing regression evidence:
  explicit and fallback values are covered in helper and facade tests. Default
  expansion for all effective `sd` rules is covered in
  `parameterFactory.test.ts`.
- Status:
  partial. Default alignment exists; paired `wt` invalidation is not modeled.

### `wt`

- Manual expectation:
  start-condition monitoring end time is per `sd` rule, defaults to `no`, and
  is paired with `wc`.
- Current implementation seam:
  `buildSdAlignedDefaultScheduleRuleParameters` and `Wt`.
- Existing regression evidence:
  default alignment is covered in facade tests. Default expansion for all
  effective `sd` rules is covered in `parameterFactory.test.ts`.
- Status:
  partial. Default alignment exists; paired `wc` invalidation is not modeled.

## Next Implementation Acceptance Criteria

- Preserve current DTO output for existing unit-list schedule columns.
- Add focused regression tests for at least one currently thin behavior before
  changing helper semantics.
- Keep schedule-rule interpretation in domain/application seams; UI components
  must continue consuming view-model fields.
- If a manual mismatch is intentionally left open, record it here with the
  affected key, code seam, and missing evidence.

## Behavior-Preserving Evidence

Behavior-preserving tests now cover default expansion and known manual edge
cases:

1. `sd=0,ud` remains visible as an undefined-schedule rule until a product
   decision says to collapse all schedule items.
2. `st`, `shd`, `cftd`, `wc`, and `wt` synthesize documented defaults for each
   effective `sd` rule.
3. `sy` and `ey` preserve relative-minute values without viewer-specific
   parsing.

## Delivered Behavior-Changing Alignment

- `ln`: root-jobnet values are ignored, matching the manual note that root
  jobnet specification is ignored. Nested jobnet `ln` values continue to be
  sorted and projected into the unit-list parent-rule column.
