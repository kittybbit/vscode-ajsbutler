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
- Wait-job group 13 `eventTimeoutAction` projection is a separate approval-
  sensitive boundary from the shared domain `ParamFactory.ets` default because
  it is user-visible table output. Current projection is default-aware for
  `flwj` / `rflwj` and `tmwj` / `rtmwj`, but other currently modeled
  `ets`-bearing wait-job families still project omitted values raw/empty. If
  approved, the next focused follow-up should stay inside
  `buildUnitListRemainingGroups.ts`, reconcile omitted `ets` display for the
  currently modeled wait-job families that already share `ParamFactory.ets`,
  and include only the smallest helper refactor needed to replace the current
  family-specific projection seam while preserving explicit normalized values,
  parser output, domain wrapper values, editor-feedback diagnostics, flow
  projection, and command generation.
- Wait-job group 13 `eventTimeoutAction` projection is now aligned for the
  currently modeled wait-job families `lfwj` / `rlfwj`, `mlwj` / `rmlwj`,
  `mqwj` / `rmqwj`, `mswj` / `rmswj`, and `ntwj` / `rntwj`. Omitted `ets`
  now uses the same shared default-aware semantics already exposed by
  `ParamFactory.ets`, while explicit normalized values, parser output, domain
  wrapper values, editor-feedback diagnostics, flow projection, and command
  generation remain unchanged.
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
- Execution-interval control job `tmitv` / `etn` diagnostics are approval-
  sensitive because existing behavior preserves explicit invalid wait-time and
  end-timing values as raw parsed data without editor feedback. A focused
  follow-up should stay inside application editor-feedback, report explicit
  `tmitv` values outside the JP1/AJS3 v13 range `1..1440` and explicit `etn`
  values outside `{y|n}` for `tmwj` / `rtmwj`, reuse the existing decimal-
  range and allowed-value rule helpers where practical, and preserve raw
  parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation. Context-sensitive
  `etn=y` start-condition semantics and compatible-ISAM restrictions remain
  separate approval-sensitive work.
- Execution-interval control contextual diagnostics remain approval-sensitive
  after the value-local `tmitv` / `etn` slice because current behavior still
  preserves explicit `etn=y` combinations even when the surrounding
  execution-interval control context violates the documented start-condition
  or compatible-ISAM restrictions. The next focused follow-up should stay
  inside application editor-feedback for `tmwj` / `rtmwj`, reuse the current
  execution-interval rule-array path plus only the smallest helper extraction
  needed for context-aware checks, and preserve raw parser output, domain
  wrapper values, normalized parameters, unit-list projection, flow
  projection, and command generation. Broader wait-job default reconciliation
  remains separate approval-sensitive work.
- Execution-interval control start-condition diagnostics are now aligned
  through application editor-feedback. Explicit `etn=y` on `tmwj` / `rtmwj`
  now reports a semantic diagnostic when the unit is not defined in a
  start-condition context, while raw parser output, domain wrapper values,
  normalized parameters, unit-list projection, flow projection, and command
  generation remain unchanged.
- Execution-interval control compatible-ISAM restrictions are not planned for
  this repository because compatible-ISAM is limited to legacy migration-mode
  environments that the extension will not model or support explicitly.
- Shared wait-job execution-time diagnostics for `fd` are approval-sensitive
  because file monitoring, execution-interval control, and JP1 event
  reception monitoring jobs all expose the same parameter while current
  behavior preserves explicit raw values without editor feedback. A focused
  follow-up should stay inside application editor-feedback, report explicit
  `fd` values outside the documented JP1/AJS3 v13 range `1..1440`, report
  explicit `fd` on jobs defined in a start-condition context where the manual
  says the parameter is disabled when the job executes, reuse the existing
  start-condition helper and only the smallest shared helper/rule-array
  refactor needed to keep the checks on the current wait-like diagnostic
  paths, and preserve raw parser output, domain wrapper values, normalized
  parameters, unit-list projection, flow projection, and command generation.
  Broader wait-condition family alignment remains separate approval-sensitive
  work. Compatible-ISAM-sensitive restrictions are not planned because that
  mode is outside this repository's supported environment scope.
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
- JP1 event reception monitoring job string-filter diagnostics are aligned
  through application editor-feedback. Explicit `evusr`, `evgrp`, `evwms`,
  `evdet`, `evwfr`, and `evtmc` values on `evwj` / `revwj` now report a
  semantic diagnostic when they violate the documented JP1/AJS3 v13
  byte-length or allowed-format rules, while raw parser output, domain
  wrapper values, normalized parameters, unit-list projection, flow
  projection, and command generation remain unchanged.
- JP1 event reception monitoring job numeric identifier validation is
  approval-sensitive because existing behavior preserves explicit `evuid`,
  `evgid`, and `evpid` values as raw parsed data without editor feedback. A
  grouped diagnostic slice should stay inside application editor-feedback for
  `evwj` / `revwj`, report explicit signed-decimal values outside the
  documented JP1/AJS3 v13 range `-1..9999999999`, reuse or extract only the
  smallest signed-range helper needed to keep the checks on the current
  event-receiving rule-array path, and preserve raw parser output, domain
  wrapper values, normalized parameters, unit-list projection, flow
  projection, and command generation.
- JP1 event reception monitoring job numeric identifier validation is aligned
  through application editor-feedback. Explicit `evuid`, `evgid`, and
  `evpid` values on `evwj` / `revwj` now report a semantic diagnostic when
  they are not signed decimal integers within the JP1/AJS3 v13 range
  `-1..9999999999`, while raw parser output, domain wrapper values,
  normalized parameters, unit-list projection, flow projection, and command
  generation remain unchanged.
- JP1 event reception monitoring timeout-control diagnostics are approval-
  sensitive because existing behavior preserves explicit `etm`, `ha`, and
  `ets` values as raw parsed data without editor feedback, including when the
  job is defined in a start-condition context where those parameters are
  documented as invalid. A focused follow-up should stay inside application
  editor-feedback for `evwj` / `revwj`, report explicit `etm` values outside
  `1..1440`, explicit `ha` values outside `{y|n}`, explicit `ets` values
  outside `{kl|nr|wr|an}`, and explicit `etm` / `ha` / `ets` when the unit is
  defined in a start-condition context, reuse the existing decimal-range,
  shared `ets`, and sibling-context helper seams where practical, and
  preserve raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation. `fd`
  disabled-on-execution behavior, compatible-ISAM-sensitive interpretation,
  and broader wait-condition semantics remain separate approval-sensitive
  work.
- JP1 event reception monitoring timeout-control diagnostics are aligned
  through application editor-feedback. Explicit `etm` values on `evwj` /
  `revwj` now report a semantic diagnostic when they fall outside `1..1440`,
  explicit `ha` values now report a semantic diagnostic when they fall
  outside `{y|n}`, explicit `ets` values now report a semantic diagnostic
  when they fall outside `{kl|nr|wr|an}`, and explicit `etm` / `ha` / `ets`
  now report a semantic diagnostic when they are specified on jobs defined in
  a start-condition context, while raw parser output, domain wrapper values,
  normalized parameters, unit-list projection, flow projection, and command
  generation remain unchanged.
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
- Transfer-file `tsN` / `tdN` filename/path semantics remain approval-
  sensitive because current behavior now distinguishes bare strings from
  quoted or macro-variable forms, but still preserves any quoted explicit
  transfer-file value without checking the remaining documented shared
  filename/path constraints. The next grouped follow-up should stay inside
  application editor-feedback, cover the shared `tsN` / `tdN` family across
  UNIX/PC, UNIX/PC custom, and QUEUE-family jobs, include only the smallest
  helper/rule-array refactor needed to keep transfer diagnostics on the
  existing shared path, and preserve raw parser output, domain wrapper
  values, normalized parameters, unit-list projection, flow projection, and
  command generation unless broader platform-specific path interpretation
  proves unavoidable and triggers re-approval.
- Shared transfer-file filename/path alignment is now implemented through
  application editor-feedback for explicit quoted `tsN` values that do not
  use a full-path form on UNIX/PC jobs, UNIX/PC custom jobs, QUEUE jobs, and
  recovery QUEUE jobs. Existing `tdN` handling remains on the already aligned
  value-shape, byte-length, and dependency path because the focused reference
  pass did not identify a stronger shared `tdN` path rule that could be
  enforced without broadening into platform-specific interpretation.

## Reference Documents

- Definition File Reference:
  [JP1/Automatic Job Management System 3 version 13](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0211.HTM)
- Command Reference:
  [JP1/Automatic Job Management System 3 version 13](https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0067.HTM)

## Non-Goals

- claiming support for every JP1/AJS3 command in one change
- mixing reference-alignment work with unrelated dependency modernization
- hiding version-specific assumptions behind generic "latest JP1" wording
