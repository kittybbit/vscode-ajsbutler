# Parameter Coverage Matrix

## Purpose

Track the JP1/AJS3 version 13 parameter-alignment status for the focused
categories already investigated by this feature. This matrix turns the audit
notes into a durable status index without claiming repository-wide parameter
coverage.

## Status Vocabulary

- Aligned: implemented behavior and focused regression evidence match the
  recorded JP1/AJS3 version 13 reference for the stated slice.
- Partial: the implemented behavior covers the stated slice, but documented
  follow-up remains before the category can be treated as fully aligned.
- Deferred: the reference point is known, but implementation or validation is
  intentionally out of scope for the current slices.
- Raw projection: application list projection reads normalized key/value data
  and does not synthesize wrapper defaults.

## Coverage Entries

### Schedule Rules

- Keys: `sd`, `ln`, `st`, `cy`, `sh`, `shd`, `cftd`, `sy`, `ey`,
  `wc`, and `wt`
- Unit scope: jobnets
- Status: partial
- Owning seam:
  `scheduleRuleHelpers.ts`, `ruleParameterBuilders.ts`, `Day.ts`, and
  `Time.ts`
- Evidence:
  `scheduleRuleHelpers.test.ts`, `parameterFactory.test.ts`,
  `parameterHelpers.test.ts`, `buildUnitListGroup10View.test.ts`,
  `buildUnitListView.test.ts`, and `buildSyntaxDiagnostics.test.ts`
- Remaining gap:
  grouped range diagnostics are aligned for `ln`, `st`, `cy`, `shd`, `cftd`,
  `sy`, `ey`, `wc`, and `wt` through editor-feedback. Grouped `sd` / `cy`
  weekly-cycle compatibility for open-day and closed-day schedules is also
  aligned through editor-feedback. Grouped `sd` explicit rule/day diagnostics
  are aligned through editor-feedback, preserving `sd=0,ud` as the documented
  valid special case and enforcing the documented `1994..SCHEDULELIMIT` year
  range with the official default `SCHEDULELIMIT=2036` in this slice.
  Environment-specific `SCHEDULELIMIT` override support and any broader
  cross-parameter invalidation remain deferred. `wc` / `wt` effective-value
  pairing is aligned in the domain wrapper boundary and unit-list group 10
  projection.

### Transfer Operation

- Keys:
  `top1` to `top4`, with `ts1` to `ts4` and `td1` to `td4` presence
  checks
- Unit scope: UNIX/PC jobs and UNIX/PC custom jobs
- Status: partial
- Owning seam:
  `transferOperationHelpers.ts` and `transferOperationParameterBuilders.ts`
- Evidence: `parameterHelpers.test.ts` and `parameterFactory.test.ts`
- Remaining gap:
  editor-feedback now aligns `tsN` / `tdN` byte-length diagnostics and
  `tdN` / `topN` source-file dependency diagnostics for the currently modeled
  transfer-operation parameters. Explicit transfer-file value-shape
  diagnostics for non-macro bare strings are now aligned through
  editor-feedback; broader filename/path semantics and macro-variable syntax
  tightening remain deferred under
  `TRANSFER_FILE_VALUE_SHAPE_ALIGNMENT.md`

### QUEUE Transfer Files

- Keys: `ts1` to `ts4` and `td1` to `td4`
- Unit scope: QUEUE jobs and recovery QUEUE jobs
- Status: partial
- Owning seam: `Qj.ts` and `ParameterFactory.ts`
- Evidence: `parameterFactory.test.ts`
- Remaining gap:
  group 15 unit-type-aware projection now hides `topN` on QUEUE jobs.
  Editor-feedback now aligns `tsN` / `tdN` byte-length diagnostics and `tdN`
  source-file dependency diagnostics for the currently modeled QUEUE
  transfer-file parameters. Explicit transfer-file value-shape diagnostics for
  non-macro bare strings are now aligned through editor-feedback; broader
  filename/path semantics and macro-variable syntax tightening remain deferred
  under `TRANSFER_FILE_VALUE_SHAPE_ALIGNMENT.md`

### Job End Judgment

- Keys: `jd`, `wth`, `tho`, `jdf`, and `abr`
- Unit scope:
  UNIX/PC jobs, UNIX/PC custom jobs, and wrappers exposing end-judgment fields
- Status: aligned
- Owning seam:
  `jobEndJudgmentHelpers.ts`, `optionalScalarParameterBuilders.ts`, and
  `Defaults.ts`
- Evidence:
  `parameterFactory.test.ts`, `jobEndJudgmentHelpers.test.ts`, and
  `buildSyntaxDiagnostics.test.ts`
- Remaining gap:
  none for the currently modeled end-judgment fields in this feature scope

### HTTP Connection Job Defaults

- Keys:
  `eu` plus currently modeled `htknd`, `htexm`, `htspt`, `jd`, `abr`, `ha`,
  `mm`, `nmg`, `ega`, and `uem`
- Unit scope: HTTP Connection jobs and recovery HTTP Connection jobs
- Status: partial
- Owning seam: `Htpj.ts`, `optionalScalarParameterBuilders.ts`, and
  `Defaults.ts`
- Evidence: `parameterFactory.test.ts`
- Remaining gap:
  future reconciliation may be needed if the definition section and
  `ajsprint -a` default table conflict for `eu`

### JP1 Event Sending Job Arrival Check

- Keys: `evssv`, `evsrt`, `evspl`, and `evsrc`
- Unit scope:
  JP1 event sending jobs and recovery JP1 event sending jobs
- Status: aligned
- Owning seam: `Evsj.ts`, `optionalScalarParameterBuilders.ts`, and
  `Defaults.ts`
- Evidence:
  `parameterFactory.test.ts`, `buildUnitListView.test.ts`, and
  `buildSyntaxDiagnostics.test.ts`
- Remaining gap:
  broader event-job validation outside the arrival-check keys in this row
  remains deferred

### File Monitoring Job Defaults

- Keys: `flwf`, `flwc`, `flwi`, `flco`, and `ets`
- Unit scope: file monitoring jobs and recovery file monitoring jobs
- Status: aligned
- Owning seam: `Flwj.ts`, `optionalScalarParameterBuilders.ts`, and
  `Defaults.ts`
- Evidence:
  `parameterFactory.test.ts` for existing domain default seams and
  `buildUnitListRemainingGroups.test.ts` for group 13 projection
- Remaining gap:
  none for the currently modeled file-monitoring parameters in this feature
  scope

### Execution-Interval Control Job Defaults

- Keys: `tmitv`, `etn`, and `ets`
- Unit scope:
  execution-interval control jobs and recovery execution-interval control jobs
- Status: partial
- Owning seam:
  `Tmwj.ts`, `optionalScalarParameterBuilders.ts`, `Defaults.ts`, and
  `buildUnitListRemainingGroups.ts`
- Evidence:
  `parameterFactory.test.ts` for domain defaults and
  `buildUnitListRemainingGroups.test.ts` for group 13 projection
- Remaining gap:
  execution-interval control job defaults and unit-list group 13 projection
  are aligned for these values, and explicit `ets` timeout-action
  diagnostics are aligned through editor-feedback. `tmitv` / `etn`
  validation and broader wait-job default reconciliation remain deferred

### Event Reception Monitoring Job Search Scope

- Keys: `evesc`, `evwid`, and `evipa`
- Unit scope:
  JP1 event reception monitoring jobs and recovery JP1 event reception
  monitoring jobs
- Status: aligned
- Owning seam:
  `Evwj.ts`, `optionalScalarParameterBuilders.ts`, and
  `buildSyntaxDiagnostics.ts`
- Evidence: `buildSyntaxDiagnostics.test.ts`
- Remaining gap:
  broader event reception monitoring string-filter validation outside the
  search-scope keys in this row remains deferred

## Boundary Decisions

- This matrix covers only categories with feature-local investigation records.
  It is not a complete inventory of every key in `ParamFactory`.
- Default-aware wrapper behavior and raw normalized list projection are tracked
  separately because several list groups intentionally read raw key/value data.
- Validation gaps are not treated as parser failures until the editor-feedback
  behavior contract specifies diagnostics, warnings, or raw preservation.
- New parameter categories should add a focused alignment document first, then
  add or update one row here after the slice has reference notes, boundary
  decisions, and regression evidence.
