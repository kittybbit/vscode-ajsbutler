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
  `parameterHelpers.test.ts`, `buildUnitListGroup10View.test.ts`, and
  `buildUnitListView.test.ts`
- Remaining gap:
  range validation remains deferred. `wc` / `wt` effective-value pairing is
  aligned in the domain wrapper boundary and unit-list group 10 projection.

### Transfer Operation

- Keys:
  `top1` to `top4`, with `ts1` to `ts4` and `td1` to `td4` presence
  checks
- Unit scope: UNIX/PC jobs and UNIX/PC custom jobs
- Status: aligned for default resolution
- Owning seam:
  `transferOperationHelpers.ts` and `transferOperationParameterBuilders.ts`
- Evidence: `parameterHelpers.test.ts` and `parameterFactory.test.ts`
- Remaining gap:
  filename, byte-length, macro-variable, and invalid-combination validation
  remain deferred

### QUEUE Transfer Files

- Keys: `ts1` to `ts4` and `td1` to `td4`
- Unit scope: QUEUE jobs and recovery QUEUE jobs
- Status: aligned for wrapper boundary
- Owning seam: `Qj.ts` and `ParameterFactory.ts`
- Evidence: `parameterFactory.test.ts`
- Remaining gap:
  group 15 remains raw projection; unit-type-aware list behavior is deferred

### Job End Judgment

- Keys: `jd`, `wth`, `tho`, `jdf`, and `abr`
- Unit scope:
  UNIX/PC jobs, UNIX/PC custom jobs, and wrappers exposing end-judgment fields
- Status: partial
- Owning seam:
  `jobEndJudgmentHelpers.ts`, `optionalScalarParameterBuilders.ts`, and
  `Defaults.ts`
- Evidence: `parameterFactory.test.ts` and `jobEndJudgmentHelpers.test.ts`
- Remaining gap:
  range validation, `jd` / `abr` invalid-combination diagnostics, and retry
  diagnostics remain deferred

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
- Status: partial
- Owning seam: `Evsj.ts`, `optionalScalarParameterBuilders.ts`, and
  `Defaults.ts`
- Evidence: `parameterFactory.test.ts` and `buildUnitListView.test.ts`
- Remaining gap:
  unit-list group 14 default-aware projection is aligned for these defaults;
  `evhst` requiredness and range validation are deferred

### File Monitoring Job Defaults

- Keys: `flwf`, `flwc`, `flwi`, `flco`, and `ets`
- Unit scope: file monitoring jobs and recovery file monitoring jobs
- Status: partial
- Owning seam: `Flwj.ts`, `optionalScalarParameterBuilders.ts`, and
  `Defaults.ts`
- Evidence:
  `parameterFactory.test.ts` for existing domain default seams and
  `buildUnitListRemainingGroups.test.ts` for group 13 projection
- Remaining gap:
  unit-list group 13 default-aware projection is aligned for these defaults;
  `flwc` invalid-combination diagnostics, wildcard restrictions, byte-length
  validation, and range validation are deferred

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
  are aligned for these values; range validation and broader wait-job default
  reconciliation are deferred

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
