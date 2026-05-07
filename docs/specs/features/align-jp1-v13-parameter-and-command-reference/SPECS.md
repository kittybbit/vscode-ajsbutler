# SPECS: align-jp1-v13-parameter-and-command-reference

## Purpose

Align parameter interpretation and `ajs` command generation to named
JP1/AJS3 version 13 reference documents.

## Origin

- Source use case: docs/requirements/use-cases/uc-interpret-jp1-parameters.md
- Source use case: docs/requirements/use-cases/uc-generate-ajs-commands.md
- Related use case: docs/requirements/use-cases/uc-show-unit-definition.md

## Acceptance Criteria

- JP1/Automatic Job Management System 3 version 13 is named explicitly as the
  target product version
- parameter parsing scope is tied to the Definition File Reference
- command generation scope is tied to the Command Reference
- `buildUnitDefinition.ts` no longer needs to own command-generation logic as
  an inseparable concern
- reference alignment can proceed incrementally without hiding known gaps

## Implementation Notes

- prefer isolating reusable parameter and command semantics in domain or
  application seams rather than viewer-specific helpers
- keep command generation reusable so show-unit-definition is one consumer, not
  the owner of the logic
- when manual coverage is partial, document supported commands and remaining
  gaps explicitly in `TASKS.md`
- avoid bundling these reference-alignment slices with unrelated flow-graph or
  package-manager work

## Durable Impact Analysis

- Unit-type-specific defaults must not be collapsed into a single global
  default when the JP1/AJS3 version 13 `ajsprint -a` default values table
  distinguishes a unit family.
- HTTP Connection job `eu` is approval-sensitive because the generic
  `DEFAULTS.Eu` value is shared by many job families, while the `ajsprint -a`
  default values table lists HTTP Connection job `Eu` separately as `def`.
- A focused helper seam is preferred over changing `DEFAULTS.Eu` globally so
  non-HTTP job families continue to preserve their existing `ent` default.
- JP1 event sending job `evsrc` is approval-sensitive because the current
  generic default is `0`, while the JP1/AJS3 version 13 event sending job
  definition says omitted `evsrc` is assumed as `10`.
- Normalized unit-list projection currently reads event sending job parameters
  from normalized raw key/value data, so default-aware wrapper changes do not
  automatically change list projection unless that boundary is explicitly in
  scope.
- QUEUE job transfer-file alignment is approval-sensitive because `Qj` / `Rq`
  expose `ts1` to `ts4` and `td1` to `td4`, while the related UNIX/PC job and
  UNIX/PC custom job definitions also define `top1` to `top4`. The QUEUE job
  slice must preserve that distinction and must not broaden `topN` default
  derivation to wrappers whose manual section does not define `topN`.
- QUEUE job unit-list group 15 projection is a separate approval-sensitive
  boundary from wrapper behavior because it is user-visible table output. If
  approved, it should preserve `ts1` to `ts4` and `td1` to `td4` projection
  for `qj` / `rq`, but hide `top1` to `top4` transfer-operation projection
  for those unit types because the JP1/AJS3 version 13 QUEUE job definition
  does not define `topN`.
- Job end-judgment `wth` alignment is approval-sensitive because the current
  factory preserves a legacy lookup from `wth` to the schedule-rule `wt`
  parameter. Correct alignment should read explicit `wth` values without
  synthesizing omitted values and without changing schedule-rule `wt`
  projection.
- `PARAMETER_COVERAGE_MATRIX.md` is the feature-local status index for
  investigated categories. It is intentionally narrower than `ParamFactory`
  and must not be read as repository-wide JP1/AJS3 parameter coverage.
- Schedule-rule `wc` / `wt` pairing is approval-sensitive because the current
  wrappers expose both values independently, while the JP1/AJS3 version 13
  jobnet definition treats `no` in either parameter as invalidating the paired
  start-condition monitoring value. Any implementation must distinguish raw
  parameter preservation from effective-value interpretation.
- Schedule-rule remaining range gaps are approval-sensitive because the
  modeled jobnet parameters already share a parsing seam and regression
  evidence set. Follow-up work should stay grouped by schedule-rule parameter
  family where practical, rather than reopening the backlog as one-key
  diagnostics, while still preserving raw parser output, domain wrapper
  values, normalized parameters, unit-list projection, flow projection, and
  command generation unless a narrower approval explicitly broadens scope.
- Schedule-rule `sd` / `cy` compatibility is approval-sensitive because
  existing behavior preserves explicit weekly cycle values on open-day or
  closed-day schedules as raw parsed data without editor feedback. A focused
  follow-up should stay inside application editor-feedback, report explicit
  `cy=(n,w)` values when the matching `sd` rule for the same schedule rule
  number uses open-day (`*`) or closed-day (`@`) scheduling semantics, and
  preserve raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation.
- Schedule-rule `sd` explicit date/rule diagnostics remain approval-sensitive
  because current behavior accepts supported `sd` value shapes through
  `parseScheduleDateValue`, but editor feedback does not yet distinguish
  explicit out-of-range schedule-rule numbers or day values. A focused
  follow-up should stay inside application editor-feedback, reuse the existing
  schedule-rule parsing seam, report explicit `sd` parameters when rule
  numbers fall outside `1..144` or day tokens fall outside the documented
  JP1/AJS3 v13 day ranges, and preserve raw parser output, domain wrapper
  values, normalized parameters, unit-list projection, flow projection, and
  command generation. The approved expanded scope may also keep `sd=0,ud` as
  the one valid rule-`0` special case and may enforce the documented
  `1994..SCHEDULELIMIT` year range using the official default
  `SCHEDULELIMIT=2036` during this slice, as long as parser output, wrapper
  values, normalized parameters, and projection boundaries remain unchanged.
- Unit-list group 10 `wc` / `wt` projection is a separate approval-sensitive
  boundary from domain interpretation because it is user-visible table output.
  If approved, it should consume the existing paired effective-value semantics
  while preserving parser output, raw domain wrapper values, and normalized raw
  parameter storage.
- JP1 event sending job unit-list group 14 projection is a separate
  approval-sensitive boundary from domain defaults because it is user-visible
  table output. If approved, it should consume the existing wrapper/default
  semantics for `evssv`, `evsrt`, `evspl`, and `evsrc` while preserving parser
  output and normalized raw parameter storage.
- File monitoring job unit-list group 13 projection is a separate
  approval-sensitive boundary from domain defaults because it is user-visible
  table output. If approved, it should consume the existing wrapper/default
  semantics for `flwc`, `flwi`, `flco`, and `ets` while preserving parser
  output and normalized raw parameter storage.
- File monitoring job `flwc` / `flco` diagnostics are approval-sensitive
  because existing behavior preserves explicit invalid combinations as raw
  parsed values without editor feedback. A focused diagnostic slice should
  report `s` and `m` co-specification in `flwc`, and explicit `flco` when the
  effective `flwc` value does not include `c`, while preserving raw parser
  output, domain wrapper values, normalized parameters, unit-list projection,
  flow projection, and command generation.
- File monitoring job `flwf` / `flwi` validation is approval-sensitive
  because existing behavior preserves explicit monitored-file patterns and
  monitoring-interval values as raw parsed data without editor feedback. A
  grouped validation slice should report explicit `flwf` values outside the
  JP1/AJS3 v13 byte-length range `1..255`, explicit `flwi` values outside the
  range `1..600`, and explicit wildcard `flwf` patterns when the effective
  `flwi` value is in the JP1/AJS3 v13 restricted range `1..9`, while
  preserving raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation.
- Shared `ets` timeout-action diagnostics are approval-sensitive because
  `ParamFactory.ets` and group 13 `eventTimeoutAction` projection are shared
  across multiple wait or event job families, while only file monitoring and
  execution-interval control jobs remain as feature-local partial rows. A
  focused follow-up should stay inside application editor-feedback, report
  explicit `ets` values outside the documented set `{kl|nr|wr|an}` for
  `flwj` / `rflwj` and `tmwj` / `rtmwj`, include only the small helper
  extraction needed to keep explicit allowed-value validation on the existing
  `buildSyntaxDiagnostics.ts` rule-array path, and preserve raw parser output,
  domain wrapper values, normalized parameters, unit-list projection, flow
  projection, and command generation. Broader `ets`-bearing unit families,
  `tmitv` or `etn` validation, and wait-job default reconciliation remain
  separate approval-sensitive work.
- Shared `ets` timeout-action diagnostics are aligned through application
  editor-feedback for explicit `flwj` / `rflwj` and `tmwj` / `rtmwj` values
  that fall outside `{kl|nr|wr|an}`, while raw parser output, domain wrapper
  values, normalized parameters, unit-list projection, flow projection, and
  command generation remain unchanged. Broader `ets`-bearing unit families and
  `tmitv` / `etn` validation remain deferred.
- Execution-interval control job defaults are approval-sensitive because
  JP1/AJS3 version 13 defines omitted `tmitv`, `etn`, and `ets` behavior for
  `tmwj` / `rtmwj`, while current code only has generic defaults for `etn` and
  `ets`. `ParamFactory.tmitv` is referenced only through `Tmwj.tmitv` today,
  but adding a wrapper default is still a domain behavior change.
- Execution-interval control job unit-list group 13 projection is a separate
  approval-sensitive boundary from domain defaults because it is user-visible
  table output. If approved, it should consume execution-interval defaults for
  `tmitv`, `etn`, and `ets` while preserving explicit normalized values,
  parser output, and normalized raw parameter storage.
- Job end-judgment `jd` / `abr` diagnostics are approval-sensitive because
  existing behavior preserves explicit invalid combinations as raw parsed
  values without editor feedback. A diagnostic slice must preserve raw parser
  output, domain wrapper values, normalized parameters, unit-list projection,
  and command generation while adding application-level semantic diagnostics
  through the existing editor-feedback boundary.
- Job end-judgment retry-parameter diagnostics are approval-sensitive for the
  same reason: existing behavior preserves explicit `rjs`, `rje`, `rec`, and
  `rei` values even when effective `jd` is not `cod`. A focused diagnostic
  slice should report these explicit invalid combinations through
  editor-feedback while preserving raw parser output, domain wrapper values,
  normalized parameters, unit-list projection, flow projection, and command
  generation.
- Job end-judgment automatic-retry enablement diagnostics are approval-sensitive
  because existing behavior preserves explicit `rjs`, `rje`, `rec`, and `rei`
  values when effective `abr` is not `y`. A focused diagnostic slice should
  report these explicit invalid combinations through editor-feedback while
  preserving raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation.
- Job end-judgment threshold-ordering diagnostics are approval-sensitive
  because existing behavior preserves explicit `wth` / `tho` pairs without
  semantic feedback. A focused diagnostic slice should stay inside
  application editor-feedback and report explicit threshold pairs that do not
  preserve the documented warning-to-abnormal ordering while preserving raw
  parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation. This ordering rule is
  inferred from the official JP1/AJS3 v13 description that normal ends fall
  below the warning threshold, warning ends fall between the warning and
  abnormal thresholds, and abnormal ends exceed the abnormal threshold.
- JP1 event sending job `evhst` requiredness diagnostics are aligned through
  application editor-feedback. Explicit `evsrt=y` on `evsj` / `revsj` now
  reports a semantic diagnostic when `evhst` is omitted, while raw parser
  output, domain wrapper values, normalized parameters, unit-list projection,
  flow projection, and command generation remain unchanged.
- JP1 event sending job `evspl` / `evsrc` range diagnostics are approval-
  sensitive because existing behavior preserves explicit out-of-range values as
  raw parsed data without editor feedback. A focused diagnostic slice should
  report explicit `evspl` values outside `3..600` seconds and explicit
  `evsrc` values outside `0..999` checks through editor-feedback while
  preserving raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation.
- JP1 event sending job `evsid` hexadecimal diagnostics are approval-sensitive
  because existing behavior preserves explicit event IDs as raw parsed data
  without editor feedback. A focused diagnostic slice should report explicit
  `evsid` values outside the JP1/AJS3 v13 hexadecimal ranges
  `00000000..00001FFF` and `7FFF8000..7FFFFFFF` through editor-feedback while
  preserving raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation.
- JP1 event sending job `evsid` hexadecimal diagnostics are aligned through
  application editor-feedback. Explicit `evsid` values on `evsj` / `revsj`
  now report a semantic diagnostic when they are malformed or fall outside the
  JP1/AJS3 v13 hexadecimal ranges `00000000..00001FFF` and
  `7FFF8000..7FFFFFFF`, while raw parser output, domain wrapper values,
  normalized parameters, unit-list projection, flow projection, and command
  generation remain unchanged.
- JP1 event reception monitoring job `evesc` range diagnostics are
  approval-sensitive because existing behavior preserves explicit invalid event
  search values as raw parsed data without editor feedback. A focused
  diagnostic slice should report explicit `evesc` values that are neither `no`
  nor decimal values in the JP1/AJS3 v13 range `1..720` through
  editor-feedback while preserving raw parser output, domain wrapper values,
  normalized parameters, unit-list projection, flow projection, and command
  generation.
- JP1 event reception monitoring job `evwid` and `evipa` validation are
  approval-sensitive because existing behavior preserves explicit event IDs
  and source IP addresses as raw parsed data without editor feedback. A
  grouped diagnostic slice should report explicit `evwid` values that fall
  outside the JP1/AJS3 v13 hexadecimal event-ID format and range
  `00000000:00000000` to `FFFFFFFF:FFFFFFFF`, plus explicit `evipa` values
  that fall outside the JP1/AJS3 v13 IPv4 dotted-decimal range
  `0.0.0.0` to `255.255.255.255`, through editor-feedback while preserving
  raw parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation.
- JP1 event reception monitoring job `evesc` range diagnostics are aligned
  through application editor-feedback. Explicit `evesc` values on `evwj` /
  `revwj` now report a semantic diagnostic when they are neither `no` nor
  decimal values in the JP1/AJS3 v13 range `1..720`, while raw parser output,
  domain wrapper values, normalized parameters, unit-list projection, flow
  projection, and command generation remain unchanged.
- JP1 event reception monitoring job `evwid` and `evipa` validation are
  aligned through application editor-feedback. Explicit `evwid` values on
  `evwj` / `revwj` now report a semantic diagnostic when they are not
  colon-separated hexadecimal event IDs within the
  `00000000:00000000` to `FFFFFFFF:FFFFFFFF` range, and explicit `evipa`
  values now report a semantic diagnostic when they are not IPv4
  dotted-decimal values in `0.0.0.0` to
  `255.255.255.255`, while raw parser output, domain wrapper values,
  normalized parameters, unit-list projection, flow projection, and command
  generation remain unchanged.
- Event-host `evhst` validation is approval-sensitive because the same
  parameter name appears in both JP1 event sending jobs and JP1 event
  reception monitoring jobs, but the documented allowances differ by job
  family. A grouped follow-up should stay inside application editor-feedback,
  enforce the documented `1..255` byte-length rule for explicit values, keep
  event-sending macro-variable allowance visible, keep event-reception
  regular-expression and macro-variable allowances visible, and preserve raw
  parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation.
- The remaining generic validation backlog is approval-sensitive because
  multiple coverage-matrix rows now defer the same families of rules:
  filename-like value checks, byte-length limits, macro-variable-aware string
  handling, and invalid combinations. The next grouped slice should stay
  inside application editor-feedback, reuse or extract shared explicit-value
  validators only where that reduces duplication in
  `buildSyntaxDiagnostics.ts`, include the small refactoring needed so the new
  rules do not split away from the existing generic-rule path, and keep
  per-family macro-variable allowances explicit so shared helpers do not
  accidentally collapse distinct JP1/AJS3 v13 rules into one generic string
  policy.
- Transfer-file `tsN` / `tdN` string-shape diagnostics are approval-sensitive
  because current behavior preserves arbitrary explicit bare strings such as
  `ts1=source-1;` as raw parsed values without editor feedback, even though
  the currently modeled wrapper comments document quoted transfer-file values.
  A focused follow-up should stay inside application editor-feedback, report
  explicit transfer-file values on UNIX/PC, UNIX/PC custom, and QUEUE-family
  units when they are neither quoted transfer-file strings nor already
  accepted macro-variable forms, and preserve raw parser output, domain
  wrapper values, normalized parameters, unit-list projection, flow
  projection, and command generation.

## Reference Documents

- Definition File Reference:
  [JP1/Automatic Job Management System 3 version 13](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0211.HTM)
- Command Reference:
  [JP1/Automatic Job Management System 3 version 13](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0067.HTM)

## Non-Goals

- claiming support for every JP1/AJS3 command in one change
- mixing reference-alignment work with unrelated dependency modernization
- hiding version-specific assumptions behind generic "latest JP1" wording
