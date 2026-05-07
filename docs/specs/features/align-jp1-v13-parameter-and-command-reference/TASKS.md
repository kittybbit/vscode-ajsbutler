# TASKS: align-jp1-v13-parameter-and-command-reference

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Delivered

- [x] Record JP1/AJS3 version 13 as the target reference for parameter parsing
      and command generation
- [x] Record that command generation should be separated from
      `buildUnitDefinition.ts`

## Delivered Follow-up

- [x] Inventory current parameter semantics that already match the version 13
      definition reference
- [x] Inventory current command-generation behavior and its coupling to
      show-unit-definition
- [x] Decide the first supported set of auto-generated `ajs` commands
- [x] Define how manual mismatches are tracked and closed incrementally
- [x] Extract the current `ajsshow` and `ajsprint` generation logic from
      `buildUnitDefinition.ts` into a dedicated application-facing seam while
      preserving the existing dialog DTO behavior
- [x] Replace fixed command text display with an `ajsshow` / `ajsprint`
      command-builder DTO and show-unit-definition builder UI, preserving the
      existing default command text
- [x] Localize command-builder labels, descriptions, and command reference
      links through the existing `lang` context
- [x] Prepare the next behavior-changing alignment slice around schedule-rule
      parameters (`sd`, `ln`, `st`, `cy`, `sh`, `shd`, `cftd`, `sy`, `ey`,
      `wc`, and `wt`) with manual references, code seams, and regression
      evidence status
- [x] Add behavior-preserving regression tests for thin schedule-rule evidence
      before changing helper semantics
- [x] Implement the first behavior-changing schedule-rule alignment fix:
      ignore `ln` on root jobnets while preserving nested jobnet `ln`
      behavior
- [x] Align omitted schedule-rule numbers to rule `1` across the schedule-rule
      helper boundary for `sd`, `st`, `sy`, `ey`, `ln`, `cy`, `sh`, `shd`,
      `cftd`, `wc`, and `wt`
- [x] Centralize schedule-rule value parsing behind domain helpers and verify
      the official format shape for the schedule-rule family before treating
      the category as aligned
- [x] Record transfer-operation alignment scope, manual references, affected
      seams, and expected `top1` to `top4` default behavior before completing
      the helper-boundary extraction
- [x] Record job end-judgment alignment scope, manual references, affected
      seams, and expected `jd` default behavior before implementation
- [x] Record HTTP Connection job default alignment scope, manual references,
      affected seams, alternatives, and expected omitted `eu` behavior before
      implementation
- [x] Record JP1 event sending job alignment scope, manual references,
      affected seams, alternatives, and expected omitted `evsrc` behavior
      before implementation
- [x] Record QUEUE job transfer-file alignment scope, manual references,
      affected seams, alternatives, and expected no-`topN` behavior before
      implementation

## Follow-up

- [x] Record human approval before changing editor-feedback diagnostics,
      runtime code, tests, generated artifacts, or configuration for grouped
      job end-judgment numeric range validation
- [x] Implement grouped job end-judgment numeric range validation only after
      approval
- [x] Add focused diagnostics regression evidence for omitted defaults, valid
      explicit in-range values, and explicit out-of-range `wth`, `tho`, `rjs`,
      `rje`, `rec`, and `rei` values
- [x] Run required code-change validation after implementation
- [x] Record human approval before changing editor-feedback diagnostics,
      shared schedule-rule helpers, runtime code, or tests for grouped
      schedule-rule range diagnostics
- [x] Implement grouped schedule-rule range diagnostics only after approval
- [x] Add focused regression evidence for explicit valid and out-of-range
      schedule-rule values in the approved key set
- [x] Run required code-change validation after implementation
- [x] Re-group the remaining JP1/AJS v13 parameter-alignment backlog around
      user-meaningful job types or parameter families after the delivered
      schedule-rule slice
- [x] Record human approval before changing editor-feedback diagnostics,
      runtime code, tests, generated artifacts, or configuration for grouped
      file-monitoring target-pattern validation
- [x] Implement grouped file-monitoring target-pattern validation only after
      approval
- [x] Add focused regression evidence for explicit valid and invalid `flwf`
      / `flwi` values and wildcard-with-short-interval combinations
- [x] Run required code-change validation after implementation
- [x] Record human approval before changing editor-feedback diagnostics,
      runtime code, tests, generated artifacts, or configuration for grouped
      event-host validation for `evhst` across JP1 event sending and JP1
      event reception monitoring jobs
- [x] Implement grouped event-host validation only after approval
- [x] Add focused regression evidence for explicit valid and invalid `evhst`
      values across both event-job families
- [x] Run required code-change validation after implementation
- [x] Re-group the remaining JP1/AJS v13 parameter-alignment backlog around
      user-meaningful job types or parameter families after the delivered
      event-host slice
- [x] Record human approval before changing editor-feedback diagnostics,
      runtime code, tests, generated artifacts, or configuration for grouped
      job end-judgment threshold-ordering diagnostics
- [x] Implement grouped job end-judgment threshold-ordering diagnostics only
      after approval
- [x] Add focused regression evidence for explicit valid and invalid `wth` /
      `tho` ordering
- [x] Run required code-change validation after implementation

## Notes

- 2026-04-18: normative parameter and command sources were fixed to the user
  supplied JP1/AJS3 version 13 reference documents.
- 2026-04-20: the initial audit findings established that current parameter
  semantics were already centralized mainly in `parameterHelpers.ts`,
  `Defaults.ts`, and the builder families behind `ParamFactory`, while command
  generation was still embedded in
  `src/application/unit-definition/buildUnitDefinition.ts`.
- 2026-04-20: the first extracted supported command set will preserve the
  current user-visible behavior only: `ajsshow` and `ajsprint`.
- 2026-04-22: `ajsshow` and `ajsprint` generation now lives behind
  `src/application/unit-definition/buildAjsCommands.ts`, while
  `buildUnitDefinition.ts` remains responsible for assembling the dialog DTO.
- 2026-04-23: show-unit-definition now receives structured command-builder
  metadata for the two supported commands with stable label and description
  keys for the presentation layer.
- 2026-04-23: command-builder UI now resolves labels and descriptions through
  the existing message resources and switches `ajsshow` / `ajsprint` manual
  links between English and Japanese URLs from the active `lang` context.
- 2026-04-27: schedule-rule alignment preparation is recorded in
  `SCHEDULE_RULE_ALIGNMENT.md`, keeping the matrix limited to the focused
  schedule-rule family instead of expanding to all parameters.
- 2026-04-27: behavior-preserving regression tests now cover explicit
  `sd=0,ud` preservation, default expansion for `st`, `shd`, `cftd`, `wc`, and
  `wt`, and relative-minute preservation for `sy` and `ey`.
- 2026-04-27: `ln` now follows the JP1/AJS3 v13 root-jobnet rule: root-jobnet
  `ln` values are ignored, while nested jobnet `ln` values remain sorted and
  visible to the unit-list parent-rule projection.
- 2026-04-27: schedule-rule number omission is now handled as a shared
  schedule-rule boundary concern. The domain parameter classes resolve omitted
  rule numbers to manual default rule `1`, and regression coverage verifies the
  schedule family together instead of one parameter at a time.
- 2026-04-27: schedule-rule value parsing is now centralized in domain helpers
  and reused by unit-list projection. This is the first category-level parser
  alignment pattern; later parameter categories should follow the same audit,
  helper-boundary, and regression-test workflow.
- 2026-04-27: `topN` default resolution now lives in
  `transferOperationHelpers.ts`; regression evidence covers explicit `topN`,
  derived `sav`, derived `del`, and the no-default case.
- 2026-04-27: omitted UNIX/PC job and UNIX/PC custom job `jd` values now
  resolve to `cod` through `jobEndJudgmentHelpers.ts`; explicit `jd` values
  remain preserved.
- 2026-04-28: omitted HTTP Connection job `eu` values now resolve to `def`
  through `httpConnectionJobDefaultHelpers.ts`; explicit HTTP Connection job
  `eu` values and non-HTTP generic `eu=ent` behavior remain preserved.
- 2026-04-28: omitted JP1 event sending job `evsrc` now resolves to `10`
  through `DEFAULTS.Evsrc`; explicit event sending job values remain preserved.
  Unit-list projection remains raw normalized key/value projection.
- 2026-04-29: QUEUE job transfer-file regression evidence now verifies `Qj`
  and `Rq` preserve explicit transfer source/destination values and do not
  expose transfer operation getters. Parser grammar, command generation,
  validation behavior, and unit-list group 15 raw projection remain unchanged.
- 2026-04-29: `ParamFactory.wth` now reads raw `wth`; focused regression
  evidence verifies explicit `wth` preservation and confirms raw `wt` no
  longer satisfies end-judgment threshold lookup. Parser grammar, command
  generation, validation behavior, schedule-rule `wt`, and unit-list
  normalized raw projection remain unchanged.
- 2026-04-29: `PARAMETER_COVERAGE_MATRIX.md` now turns the current audit and
  focused alignment records into an explicit category-level matrix. This is a
  docs-only status index and does not broaden parameter coverage or approve
  new runtime behavior.
- 2026-04-29: schedule-rule `wc` / `wt` effective-value pairing is implemented
  as a domain-only helper/API. Raw `Wc.numberOfTimes`, `Wt.time`, `value()`,
  and normalized unit-list projection remain unchanged. Effective values are
  empty when either paired value is `no`, missing, or unparsable.
- 2026-04-29: unit-list group 10 `wc` / `wt` projection now consumes the
  existing effective pairing semantics. Disabled pairs display empty
  start-condition monitoring values, valid pairs remain visible, and raw
  parser/domain/normalized values remain unchanged.
- 2026-04-29: unit-list group 14 JP1 event sending job projection now consumes
  existing defaults for omitted `evssv`, `evsrt`, `evspl`, and `evsrc`.
  Explicit normalized values remain visible, non-event-sending jobs do not
  synthesize these defaults, and raw parser/domain/normalized values remain
  unchanged.
- 2026-05-01: unit-list group 13 file monitoring job projection now consumes
  existing defaults for omitted `flwc`, `flwi`, `flco`, and `ets`. Explicit
  normalized values remain visible, omitted `flwf` remains empty,
  non-file-monitoring jobs do not synthesize these defaults, and raw
  parser/domain/normalized values remain unchanged.
- 2026-05-01: execution-interval control job defaults now resolve omitted
  `tmitv`, `etn`, and `ets` values to `10`, `n`, and `kl`. Unit-list group 13
  projection consumes those defaults for `tmwj` / `rtmwj`, explicit normalized
  values remain visible, non-execution-interval-control jobs do not synthesize
  those defaults, and raw parser/normalized values remain unchanged.
- 2026-05-01: QUEUE job group 15 projection now hides `top1` to `top4`
  transfer-operation values for `qj` / `rq`. Explicit `ts1` to `ts4` and
  `td1` to `td4` remain visible, non-QUEUE `topN` projection remains visible,
  and raw parser/normalized values remain unchanged.
- 2026-05-01: job end-judgment `jd` / `abr` invalid-combination diagnostics
  now report explicit UNIX/PC job and UNIX/PC custom job `abr=y` values when
  the effective `jd` value is not `cod`. Parser grammar, raw parser values,
  domain wrapper values, normalized parameters, unit-list projection, command
  generation, generated artifacts, configuration, dependency versions, and
  `engines.vscode` remain unchanged. Parameter source-location metadata was
  added to support diagnostic ranges.
- 2026-05-06: JP1 event sending job `evhst` requiredness diagnostics now
  report explicit `evsj` / `revsj` `evsrt=y` values when `evhst` is omitted.
  Omitted `evsrt=n` remains non-diagnostic, explicit valid `evhst` values
  remain accepted, and raw parser/domain/normalized values plus unit-list,
  flow, and command output remain unchanged.
- 2026-05-01: job end-judgment retry-parameter diagnostics now report explicit
  UNIX/PC job and UNIX/PC custom job `rjs`, `rje`, `rec`, or `rei` values when
  the effective `jd` value is not `cod`. Parser grammar, raw parser values,
  domain wrapper values, normalized parameters, unit-list projection, flow
  projection, command generation, generated artifacts, configuration,
  dependency versions, and `engines.vscode` remain unchanged. Numeric retry
  ranges and threshold ordering remain deferred.
- 2026-05-06: file monitoring job `flwc` / `flco` diagnostics now report
  explicit `flwj` / `rflwj` invalid combinations when `flwc` specifies both
  `s` and `m`, or when explicit `flco` is present and effective `flwc` does
  not include `c`. Omitted `flwc=c` remains non-diagnostic with explicit
  `flco`, valid explicit combinations remain non-diagnostic, and raw parser
  output, domain wrapper values, normalized parameters, unit-list projection,
  flow projection, command generation, generated artifacts, configuration,
  dependency versions, and `engines.vscode` remain unchanged.
- 2026-05-06: job end-judgment automatic-retry enablement diagnostics now
  report explicit UNIX/PC job and UNIX/PC custom job `rjs`, `rje`, `rec`, or
  `rei` values when effective `jd=cod` but effective `abr` is not `y`.
  Existing effective non-`cod` retry diagnostics remain the primary diagnostic
  for invalid end-judgment combinations. Parser grammar, raw parser values,
  domain wrapper values, normalized parameters, unit-list projection, flow
  projection, command generation, generated artifacts, configuration,
  dependency versions, and `engines.vscode` remain unchanged.
- 2026-05-06: JP1 event sending job `evspl` / `evsrc` range diagnostics now
  report explicit out-of-range `evspl` and `evsrc` values through the
  existing editor-feedback boundary. Omitted defaults remain non-diagnostic,
  explicit in-range values remain accepted, and raw parser output, domain
  wrapper values, normalized parameters, unit-list projection, flow
  projection, command generation, generated artifacts, configuration,
  dependency versions, and `engines.vscode` remain unchanged.
- 2026-05-06: JP1 event sending job `evsid` hexadecimal diagnostics now
  report explicit malformed or out-of-range `evsid` values through the
  existing editor-feedback boundary. Omitted `evsid` values remain
  non-diagnostic, explicit valid in-range hexadecimal values remain accepted,
  and raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, command generation, generated
  artifacts, configuration, dependency versions, and `engines.vscode` remain
  unchanged.
- 2026-05-06: JP1 event reception monitoring job `evesc` range diagnostics
  now report explicit malformed or out-of-range `evesc` values through the
  existing editor-feedback boundary. Omitted `evesc` values and explicit
  `evesc=no` remain non-diagnostic, and raw parser output, domain wrapper
  values, normalized parameters, unit-list projection, flow projection,
  command generation, generated artifacts, configuration, dependency
  versions, and `engines.vscode` remain unchanged.
- 2026-05-06: JP1 event reception monitoring job grouped `evwid` / `evipa`
  validation now reports explicit malformed event IDs and invalid dotted-
  decimal IPv4 source addresses through the existing editor-feedback
  boundary. Omitted values remain non-diagnostic, valid explicit values remain
  accepted, and raw parser output, domain wrapper values, normalized
  parameters, unit-list projection, flow projection, command generation,
  generated artifacts, configuration, dependency versions, and
  `engines.vscode` remain unchanged.
- 2026-05-06: The next JP1/AJS v13 parameter-alignment slice was re-scoped by
  user-visible size rather than by single-parameter granularity. The next
  approval-gated candidate is grouped job end-judgment numeric range
  diagnostics for UNIX/PC jobs and UNIX/PC custom jobs, covering explicit
  `wth`, `tho`, `rjs`, `rje`, `rec`, and `rei` values through the existing
  editor-feedback boundary while preserving raw parser output, domain wrapper
  values, normalized parameters, unit-list projection, flow projection, and
  command generation. Parser grammar, generated artifacts, configuration,
  dependency versions, `engines.vscode`, retry threshold ordering,
  byte-length validation, and broad parameter validation remain out of scope.
- 2026-05-06: Grouped job end-judgment numeric range diagnostics now report
  explicit out-of-range `wth`, `tho`, `rjs`, `rje`, `rec`, and `rei` values
  for UNIX/PC jobs and UNIX/PC custom jobs through the existing
  editor-feedback boundary. Omitted values remain non-diagnostic, valid
  explicit in-range values remain accepted, and raw parser output, domain
  wrapper values, normalized parameters, unit-list projection, flow
  projection, command generation, generated artifacts, configuration,
  dependency versions, and `engines.vscode` remain unchanged.
- 2026-05-07: Remaining JP1/AJS v13 parameter-alignment gaps were re-grouped
  around user-meaningful job types or parameter families instead of returning
  to single-parameter micro-slices. The recommended next approval-gated
  candidate is grouped schedule-rule range diagnostics for the already-modeled
  jobnet parameter family, centered on `ln`, `st`, `cy`, `shd`, `cftd`,
  `sy`, `ey`, `wc`, and `wt` through the existing editor-feedback boundary
  while preserving raw parser output, domain wrapper values, normalized
  parameters, unit-list projection, flow projection, and command generation.
  Parser grammar, schedule-rule value-shape parsing already delivered,
  generated artifacts, configuration, dependency versions, `engines.vscode`,
  and non-schedule parameter validation remain out of scope.
- 2026-05-07: Grouped schedule-rule range diagnostics now report explicit
  out-of-range `ln`, `st`, `cy`, `shd`, `cftd`, `sy`, `ey`, `wc`, and `wt`
  values on jobnets through the existing editor-feedback boundary. Root-jobnet
  `ln` remains ignored, explicit in-range values remain accepted, and raw
  parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, command generation, generated artifacts,
  configuration, dependency versions, and `engines.vscode` remain unchanged.
- 2026-05-07: Remaining JP1/AJS v13 parameter-alignment gaps were re-grouped
  again around user-meaningful job types or parameter families after the
  delivered schedule-rule slice. The recommended next approval-gated
  candidate is grouped file-monitoring target-pattern validation for
  `flwj` / `rflwj`, centered on `flwf` / `flwi` byte-length, numeric range,
  and wildcard-with-short-interval rules through the existing
  editor-feedback boundary while preserving raw parser output, domain wrapper
  values, normalized parameters, unit-list projection, flow projection, and
  command generation. Parser grammar, unit-list projection changes, `flwc` /
  `flco` diagnostics already delivered, `ets` timeout behavior, generated
  artifacts, configuration, dependency versions, `engines.vscode`, and
  non-file-monitoring validation remain out of scope.
- 2026-05-07: Grouped file-monitoring target-pattern validation now reports
  explicit `flwf` values outside the JP1/AJS3 v13 byte-length range
  `1..255`, explicit `flwi` values outside `1..600`, and explicit wildcard
  `flwf` patterns when effective `flwi` is in the restricted range `1..9`,
  through the existing editor-feedback boundary. Omitted `flwf` and omitted
  `flwi` remain non-diagnostic, raw parser output, domain wrapper values,
  normalized parameters, unit-list projection, flow projection, and command
  generation remain unchanged, and `ets` timeout behavior remains deferred.
- 2026-05-07: Remaining JP1/AJS v13 parameter-alignment gaps were re-grouped
  again by user-meaningful job type or parameter family after the delivered
  file-monitoring target-pattern slice. The recommended next approval-gated
  candidate is grouped event-host validation for `evhst` across JP1 event
  sending and JP1 event reception monitoring jobs, centered on the documented
  `1..255` byte-length rule plus the existing macro-variable or
  regular-expression allowances through the existing editor-feedback
  boundary while preserving raw parser output, domain wrapper values,
  normalized parameters, unit-list projection, flow projection, and command
  generation. Parser grammar, broader event-job string-filter validation,
  generated artifacts, configuration, dependency versions, and
  `engines.vscode` remain out of scope.
- 2026-05-07: Grouped event-host validation now reports explicit out-of-range
  `evhst` values across JP1 event sending and JP1 event reception monitoring
  jobs when the byte length falls outside `1..255`, through the existing
  editor-feedback boundary. Existing macro-variable allowance for event
  sending jobs and regular-expression or macro-variable allowance for event
  reception monitoring jobs remain preserved because the slice adds no
  string-shape validation. Raw parser output, domain wrapper values,
  normalized parameters, unit-list projection, flow projection, and command
  generation remain unchanged.
- 2026-05-07: Remaining JP1/AJS v13 parameter-alignment gaps were re-grouped
  again by user-meaningful job type or parameter family after the delivered
  event-host slice. The recommended next approval-gated candidate is grouped
  job end-judgment threshold-ordering diagnostics for UNIX/PC jobs and UNIX/PC
  custom jobs, centered on explicit `wth` / `tho` pairs through the existing
  editor-feedback boundary while preserving raw parser output, domain wrapper
  values, normalized parameters, unit-list projection, flow projection, and
  command generation. Parser grammar, domain default behavior, numeric range
  diagnostics already delivered, generated artifacts, configuration,
  dependency versions, and `engines.vscode` remain out of scope.
- 2026-05-07: Grouped job end-judgment threshold-ordering diagnostics now
  report explicit `wth` / `tho` pairs on UNIX/PC jobs and UNIX/PC custom jobs
  when effective `jd=cod` and the threshold values do not preserve the
  documented warning-to-abnormal ordering. Omitted thresholds remain
  non-diagnostic, out-of-range thresholds continue to be owned by the existing
  numeric range diagnostics, and raw parser output, domain wrapper values,
  normalized parameters, unit-list projection, flow projection, command
  generation, generated artifacts, configuration, dependency versions, and
  `engines.vscode` remain unchanged.
- 2026-05-07: The grouped job end-judgment threshold-ordering slice is now
  implemented and validated on `codex/job-end-threshold-ordering`. The next
  JP1/AJS v13 parameter-alignment candidate should be re-selected from the
  remaining partial or deferred gaps using the same user-meaningful job-type
  or parameter-family grouping rule.

## Human Approval

- Status: Approved
- Approved at: 2026-05-07
- Approved scope: grouped job end-judgment threshold-ordering diagnostics for
  explicit `wth` / `tho` pairs on UNIX/PC jobs and UNIX/PC custom jobs
  through the existing editor-feedback boundary, keeping the slice narrow to
  semantic diagnostics while preserving raw parser output, domain wrapper
  values, normalized parameters, unit-list projection, flow projection, and
  command generation.

Current implementation gate: grouped job end-judgment threshold-ordering
diagnostics for explicit `wth` / `tho` pairs is approved for implementation
inside the recorded scope.

## Prior Approval Evidence

- 2026-05-07: User replied "Approved. Proceed with implementation." after the
  grouped job end-judgment threshold-ordering diagnostics approval request.
  Approved changes were limited to adding grouped application-level semantic
  diagnostics for explicit UNIX/PC jobs and UNIX/PC custom jobs where `wth`
  and `tho` do not preserve documented threshold ordering; preserving raw
  parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation; adding focused
  regression evidence; updating SDD tracking; and running validation. Parser
  grammar, domain default behavior, numeric range diagnostics already
  delivered, generated artifacts, configuration, dependency versions, and
  `engines.vscode` were out of scope.
- 2026-05-07: User replied "Approved. Proceed with implementation." after the
  grouped event-host validation approval request. Approved changes were
  limited to adding grouped application-level semantic diagnostics for
  explicit `evhst` values across JP1 event sending and JP1 event reception
  monitoring jobs through the existing editor-feedback boundary, limited to
  the documented `1..255` byte-length rule while preserving existing
  macro-variable or regular-expression allowances; preserving raw parser
  output, domain wrapper values, normalized parameters, unit-list projection,
  flow projection, and command generation; adding focused regression
  evidence; updating SDD tracking; and running validation. Parser grammar,
  broader event-job string-filter validation, generated artifacts,
  configuration, dependency versions, and `engines.vscode` were out of
  scope.

- 2026-05-07: User replied "Approved. Proceed with implementation." after the
  grouped file-monitoring target-pattern validation approval request.
  Approved changes were limited to adding grouped application-level semantic
  diagnostics for `Flwj` / `Rflwj` `flwf` byte-length, `flwi` numeric range,
  and wildcard-with-short-interval rules through the existing editor-feedback
  boundary; preserving raw parser output, domain wrapper values, normalized
  parameters, unit-list projection, flow projection, and command generation;
  adding focused regression evidence; updating SDD tracking; and running
  validation. Parser grammar, unit-list projection changes, `flwc` / `flco`
  diagnostics already delivered, `ets` timeout behavior, generated artifacts,
  configuration, dependency versions, `engines.vscode`, and non-file-
  monitoring validation were out of scope.

- 2026-05-07: User replied "Approved. Proceed with implementation." after the
  grouped schedule-rule range-diagnostics approval request. Approved changes
  were limited to adding grouped application-level semantic diagnostics for
  already-modeled jobnet `ln`, `st`, `cy`, `shd`, `cftd`, `sy`, `ey`, `wc`,
  and `wt` values through the existing editor-feedback boundary; preserving raw
  parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation; adding focused
  regression evidence; updating SDD tracking; and running validation. Parser
  grammar, schedule-rule value-shape parsing changes, generated artifacts,
  configuration, dependency versions, `engines.vscode`, `sd` product-policy
  changes, and non-schedule parameter validation were out of scope.

- 2026-05-06: User replied "Approved. Proceed with implementation." after the
  grouped job end-judgment numeric range validation approval request.
  Approved changes were limited to adding grouped application-level semantic
  diagnostics for explicit UNIX/PC jobs and UNIX/PC custom jobs where `wth`
  or `tho` falls outside `0..2147483647`, `rjs` or `rje` falls outside
  `1..4294967295`, `rec` falls outside `1..12`, or `rei` falls outside
  `1..10`; preserving raw parser output, domain wrapper values, normalized
  parameters, unit-list projection, flow projection, and command generation;
  adding focused regression evidence; updating SDD tracking; and running
  validation. Parser grammar, generated artifacts, configuration, dependency
  versions, `engines.vscode`, retry threshold ordering, byte-length
  validation, and broad parameter validation were out of scope.

- 2026-05-06: User replied "Approved. Proceed with implementation." after the
  JP1 event reception monitoring job grouped `evwid` / `evipa` validation
  approval request. Approved changes were limited to adding focused
  application-level semantic diagnostics for explicit JP1 event reception
  monitoring jobs and recovery JP1 event reception monitoring jobs where
  `evwid` falls outside the JP1/AJS3 v13 hexadecimal event-ID format and
  range `00000000:00000000` to `FFFFFFFF:FFFFFFFF`, or where `evipa` falls
  outside the IPv4 dotted-decimal range `0.0.0.0` to `255.255.255.255`;
  preserving raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation; adding
  focused regression evidence; updating SDD tracking; and running validation.
  Parser grammar, generated artifacts, configuration, dependency versions,
  `engines.vscode`, `evhst` byte-length validation, host-name validation,
  regular-expression validation, macro-variable validation, and broad
  parameter validation were out of scope.

- 2026-05-06: User replied "OK.Proceed." after the JP1 event reception
  monitoring job `evesc` range-diagnostics approval request. Approved changes
  were limited to adding focused application-level semantic diagnostics for
  explicit JP1 event reception monitoring jobs and recovery JP1 event
  reception monitoring jobs where `evesc` is neither `no` nor a decimal value
  in the JP1/AJS3 v13 range `1..720`; preserving raw parser output, domain
  wrapper values, normalized parameters, unit-list projection, flow
  projection, and command generation; adding focused regression evidence;
  updating SDD tracking; and running validation. Parser grammar, generated
  artifacts, configuration, dependency versions, `engines.vscode`, `evwid`
  format validation, `evhst` byte-length validation, host-name validation,
  regular-expression validation, macro-variable validation, `evipa` address
  validation, and broad parameter validation were out of scope.

- 2026-05-06: User replied "OK.Proceed." after the JP1 event sending job
  `evsid` hexadecimal-diagnostics approval request. Approved changes were
  limited to adding focused application-level semantic diagnostics for
  explicit JP1 event sending jobs and recovery JP1 event sending jobs where
  `evsid` falls outside the JP1/AJS3 v13 hexadecimal ranges
  `00000000..00001FFF` and `7FFF8000..7FFFFFFF`; preserving raw parser
  output, domain wrapper values, normalized parameters, unit-list projection,
  flow projection, and command generation; adding focused regression
  evidence; updating SDD tracking; and running validation. Parser grammar,
  generated artifacts, configuration, dependency versions, `engines.vscode`,
  `evhst` byte-length validation, host-name validation, macro-variable
  validation, event receiving job `evwid` validation, and broad parameter
  validation were out of scope.

- 2026-05-06: User replied "OK.Proceed." after the JP1 event sending job
  `evspl` / `evsrc` range-diagnostics approval request. Approved changes were
  limited to adding focused application-level semantic diagnostics for
  explicit JP1 event sending jobs and recovery JP1 event sending jobs where
  `evspl` is outside `3..600` seconds or `evsrc` is outside `0..999`;
  preserving raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation; adding
  focused regression evidence; updating SDD tracking; and running validation.
  Parser grammar, generated artifacts, configuration, dependency versions,
  `engines.vscode`, `evhst` byte-length validation, host-name validation,
  macro-variable validation, `evsid` hexadecimal validation, and broad
  parameter validation were out of scope.

- 2026-05-06: User replied "OK.Proseed." after the JP1 event sending job
  `evhst` requiredness diagnostics approval request. Approved changes were
  limited to adding focused application-level semantic diagnostics for
  explicit JP1 event sending jobs and recovery JP1 event sending jobs where
  effective `evsrt=y` omits `evhst`; preserving raw parser output, domain
  wrapper values, normalized parameters, unit-list projection, flow
  projection, and command generation; adding focused regression evidence;
  updating SDD tracking; and running validation. Parser grammar, generated
  artifacts, configuration, dependency versions, `engines.vscode`, `evhst`
  byte-length validation, host-name format validation, macro-variable
  validation, `evspl` / `evsrc` range validation, and broad parameter
  validation were out of scope.

- 2026-05-06: User replied "OK.Proceed." after the job end-judgment
  automatic-retry enablement diagnostics approval request. Approved changes
  were limited to adding focused application-level semantic diagnostics for
  explicit UNIX/PC job and UNIX/PC custom job `rjs`, `rje`, `rec`, or `rei`
  values when effective `jd=cod` but effective `abr` is not `y`; preserving
  raw parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation; adding focused
  regression evidence; updating SDD tracking; and running validation. Parser
  grammar, generated artifacts, configuration, dependency versions,
  `engines.vscode`, numeric retry ranges, retry threshold ordering,
  byte-length validation, and broad parameter validation were out of scope.
- 2026-05-06: User replied "OK.Proceed." after the file monitoring job
  `flwc` / `flco` diagnostics approval request. Approved changes were limited
  to adding focused application-level semantic diagnostics for explicit
  `flwj` / `rflwj` invalid combinations where `flwc` specifies both `s` and
  `m`, or explicit `flco` is present when effective `flwc` does not include
  `c`; preserving raw parser output, domain wrapper values, normalized
  parameters, unit-list projection, flow projection, and command generation;
  adding focused regression evidence; updating SDD tracking; and running
  validation. Parser grammar, generated artifacts, configuration, dependency
  versions, `engines.vscode`, wildcard validation, byte-length validation,
  numeric range validation, timeout behavior, and broad parameter validation
  were out of scope.
- 2026-05-01: User replied "OK.Proceed." after the job end-judgment
  retry-parameter diagnostics approval request. Approved changes were limited
  to adding focused application-level semantic diagnostics for explicit
  UNIX/PC job and UNIX/PC custom job `rjs`, `rje`, `rec`, or `rei` values
  when the effective `jd` value is not `cod`; preserving raw parser output,
  domain wrapper values, normalized parameters, unit-list projection, flow
  projection, and command generation; adding focused regression evidence;
  updating SDD tracking; and running validation. Parser grammar, generated
  artifacts, configuration, dependency versions, `engines.vscode`, numeric
  retry ranges, retry threshold ordering, byte-length validation, and broad
  parameter validation were out of scope.
- 2026-05-01: User replied "OK.Proceed." after the job end-judgment `jd` /
  `abr` invalid-combination diagnostics approval request. Approved changes
  were limited to adding focused application-level semantic diagnostics for
  explicit UNIX/PC job and UNIX/PC custom job `abr=y` values when the
  effective `jd` value is not `cod`; adding source-location metadata only as
  needed for diagnostic ranges; preserving raw parser output, domain wrapper
  values, normalized parameters, unit-list projection, and command generation;
  adding focused regression evidence; updating SDD tracking; and running
  validation. Parser grammar, generated artifacts, configuration, dependency
  versions, `engines.vscode`, retry range diagnostics, byte-length validation,
  and broad parameter range validation were out of scope.
- 2026-05-01: User replied "OK. Proceed." after the QUEUE job unit-list group
  15 projection approval request. Approved changes were limited to hiding
  `top1` to `top4` transfer-operation projection for `qj` / `rq`, preserving
  explicit `ts1` to `ts4` and `td1` to `td4`, preserving non-QUEUE `topN`
  projection, adding focused regression evidence, updating SDD and use-case
  tracking, and running validation. Parser grammar, normalized raw parameter
  storage, diagnostics, generated artifacts, configuration, dependency
  versions, and `engines.vscode` changes were out of scope.
- 2026-05-01: User replied "OK. Proceed." after the execution-interval
  control job defaults and unit-list group 13 projection approval request.
  Approved changes were limited to aligning omitted `tmwj` / `rtmwj`
  `tmitv=10`, `etn=n`, and `ets=kl` behavior, making group 13 projection
  consume those defaults for execution-interval control jobs, preserving
  explicit values and non-target job behavior, adding focused regression
  evidence, updating SDD tracking, and running validation. Parser grammar,
  normalized raw parameter storage, diagnostics, generated artifacts,
  configuration, dependency versions, and `engines.vscode` changes were out of
  scope.
- 2026-05-01: User replied "OK.Proceed." after the unit-list group 13 file
  monitoring job default-aware projection approval request. Approved changes
  were limited to making group 13 `flwc`, `flwi`, `flco`, and `ets` columns
  consume existing domain defaults for omitted values, preserving explicit
  values, adding focused regression evidence, updating SDD tracking, and
  running validation. Parser grammar, raw domain wrappers, normalized raw
  parameter storage, diagnostics, generated artifacts, configuration,
  dependency versions, and `engines.vscode` changes were out of scope.

- 2026-04-29: Approved unit-list group 14 default-aware projection for JP1
  event sending job arrival-check defaults. Approved changes were limited to
  making group 14 `evssv`, `evsrt`, `evspl`, and `evsrc` arrival-check
  columns consume existing domain defaults for omitted values, preserving
  explicit values, adding focused regression evidence, updating SDD tracking,
  and running validation. Parser grammar, raw domain wrappers, normalized raw
  parameter storage, diagnostics, generated artifacts, configuration,
  dependency versions, and `engines.vscode` changes were out of scope.
- 2026-04-29: Approved unit-list group 10 effective projection for
  schedule-rule `wc` / `wt` pairing. Approved changes were limited to making
  group 10 `wc` / `wt` schedule-rule start-condition columns consume existing
  effective pairing semantics, adding focused regression evidence, updating
  SDD tracking, and running validation. Parser grammar, raw domain wrappers,
  normalized raw parameter storage, diagnostics, generated artifacts,
  configuration, dependency versions, and `engines.vscode` changes were out of
  scope.
- 2026-04-29: Approved domain-only effective-value helper/tests for
  schedule-rule `wc` / `wt` pairing, keeping raw normalized unit-list
  projection unchanged. Parser grammar, command generation, validation
  diagnostics, generated artifacts, and configuration remained out of scope.
- 2026-04-29: Approved `wth` key mapping alignment so job end-judgment
  threshold parsing reads raw `wth` rather than the schedule-rule `wt`
  parameter; update focused regression evidence; keep parser grammar, command
  generation, validation behavior, schedule-rule `wt`, and unit-list
  normalized raw projection unchanged.
- 2026-04-29: Approved QUEUE job transfer-file alignment by adding focused
  regression evidence that `Qj` / `Rq` preserve explicit `ts1` to `ts4` and
  `td1` to `td4` values without exposing or deriving `top1` to `top4`, while
  keeping parser grammar, command generation, validation behavior, and
  unit-list group 15 projection unchanged.
- 2026-04-28: Approved JP1 event sending job arrival-check default alignment
  by resolving omitted `evsrc` values to `10` for `Evsj` / `Revsj`, preserving
  explicit `evsrc`, `evssv`, `evsrt`, and `evspl` values, keeping normalized
  unit-list projection raw and unchanged, and adding focused regression
  evidence.
- 2026-04-28: Approved HTTP Connection job default alignment by resolving
  omitted `eu` values to `def` for `Htpj` / `Rhtpj`, keeping explicit `eu`
  values and non-HTTP job-family `eu` defaults unchanged, and adding focused
  regression evidence.

## Validation

- 2026-05-07: `rtk pnpm run qlty` completed with exit code 0 after grouped
  event-host validation implementation
- 2026-05-07: `rtk pnpm test` completed with exit code 0; the VS Code harness
  emitted an existing macOS `task_name_for_pid` codesign noise line
- 2026-05-07: `rtk pnpm run test:web` completed with exit code 0 and existing
  localhost dev-extension `package.nls.json` 404 noise after grouped
  event-host validation implementation
- 2026-05-07: `rtk pnpm run build` completed with existing webpack asset-size
  warnings after grouped event-host validation implementation
- 2026-05-07: `rtk pnpm run lint:md` completed with exit code 0 after grouped
  event-host validation implementation
- 2026-05-07: `rtk pnpm run qlty` completed with exit code 0 after the
  docs-only event-host regrouping investigation
- 2026-05-07: `rtk pnpm run lint:md` completed with exit code 0 after the
  docs-only event-host regrouping investigation
- 2026-05-07: `rtk pnpm run qlty` completed with exit code 0 after grouped
  job end-judgment threshold-ordering diagnostics implementation
- 2026-05-07: `rtk pnpm test` completed with exit code 0 after grouped job
  end-judgment threshold-ordering diagnostics implementation; the VS Code
  harness emitted the existing macOS `task_name_for_pid` codesign noise line
- 2026-05-07: `rtk pnpm run test:web` completed with exit code 0 after grouped
  job end-judgment threshold-ordering diagnostics implementation and emitted
  the existing localhost dev-extension `package.nls.json` 404 noise
- 2026-05-07: `rtk pnpm run build` completed with existing webpack asset-size
  warnings after grouped job end-judgment threshold-ordering diagnostics
  implementation
- 2026-05-07: `rtk pnpm run lint:md` completed with exit code 0 after grouped
  job end-judgment threshold-ordering diagnostics implementation
- 2026-05-07: `pnpm run qlty` completed with exit code 0 after the
  file-monitoring target-pattern diagnostics implementation
- 2026-05-07: `npm test` completed with exit code 0
- 2026-05-07: `pnpm run test:web` failed in the sandbox because Chromium could
  not access macOS Mach port APIs; escalated rerun completed with exit code 0
  and existing localhost dev-extension `package.nls.json` 404 noise
- 2026-05-07: `pnpm run build` completed with existing webpack asset-size
  warnings
- 2026-05-07: `pnpm run qlty` required an escalated rerun after the sandboxed
  qlty log-file permission failure; escalated rerun completed with exit code 0
- 2026-05-07: `pnpm test` completed with exit code 0; the VS Code harness
  emitted an existing macOS `task_name_for_pid` codesign noise line
- 2026-05-07: `pnpm run test:web` failed in the sandbox because Chromium could
  not access macOS Mach port APIs; escalated rerun completed with exit code 0
  and existing localhost dev-extension `package.nls.json` 404 noise
- 2026-05-07: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-05-07: `pnpm run qlty` required an escalated rerun after the sandboxed
  qlty log-file permission failure; escalated rerun completed with exit code 0
- 2026-05-07: `pnpm run lint:md` completed with exit code 0
- 2026-05-06: `pnpm run qlty` required an escalated rerun after the sandboxed
  qlty log-file permission failure; escalated rerun completed with exit code 0
- 2026-05-06: `pnpm test` completed with exit code 0; the VS Code harness
  emitted an existing macOS `task_name_for_pid` codesign noise line
- 2026-05-06: `pnpm run test:web` failed in the sandbox because Chromium could
  not access macOS Mach port APIs; escalated rerun completed with exit code 0
  and existing localhost dev-extension `package.nls.json` 404 noise
- 2026-05-06: `pnpm run build` completed with existing webpack asset-size
  warnings
- 2026-05-06: `pnpm run lint:md`
- 2026-05-06: `pnpm run test:compile`
- 2026-05-06: `pnpm run qlty` completed with exit code 0; run used an
  escalated command because sandboxed qlty cannot create its log file
- 2026-05-06: `pnpm test`
- 2026-05-06: `pnpm run qlty` completed with exit code 0 after grouped
  `evwid` / `evipa` diagnostics implementation; run used an escalated command
  because sandboxed qlty cannot create its log file
- 2026-05-06: `pnpm run test:compile`
- 2026-05-06: `pnpm test`
- 2026-05-06: `pnpm run test:web` failed in the sandbox because Chromium could
  not access macOS Mach port APIs; escalated rerun completed with exit code 0
  and existing localhost dev-extension `package.nls.json` 404 noise
- 2026-05-06: `pnpm run build` completed with existing webpack asset-size
  warnings
- 2026-05-06: `pnpm run lint:md`
- 2026-05-06: `pnpm run test:web` failed in the sandbox because Chromium could
  not access macOS Mach port APIs; escalated rerun completed with exit code 0
  and existing localhost dev-extension `package.nls.json` 404 noise
- 2026-05-06: `pnpm run build` completed with existing webpack asset-size
  warnings
- 2026-05-06: `pnpm run lint:md`
- 2026-05-06: `pnpm run qlty` required an escalated rerun after a sandboxed
  qlty log-file permission failure
- 2026-05-06: `pnpm test`
- 2026-05-06: `pnpm run test:web` failed in the sandbox because Chromium could
  not access macOS Mach port APIs; escalated rerun completed with exit code 0
  and existing localhost dev-extension `package.nls.json` 404 noise
- 2026-05-06: `pnpm run build` completed with existing webpack asset-size
  warnings
- 2026-05-06: `pnpm run lint:md`
- 2026-05-06: `pnpm run test:compile`
- 2026-05-06: `pnpm test`
- 2026-05-06: `pnpm run test:web` failed in the sandbox because Chromium could
  not access macOS Mach port APIs; escalated rerun completed with exit code 0
  and existing localhost dev-extension `package.nls.json` 404 noise
- 2026-05-06: `pnpm run build` completed with existing webpack asset-size
  warnings
- 2026-05-06: `pnpm run lint:md`
- 2026-05-06: `pnpm run test:compile`
- 2026-05-06: `pnpm test`
- 2026-05-06: `pnpm run qlty` completed with exit code 0; final run used an
  escalated command because sandboxed qlty cannot create its log file
- 2026-05-06: `pnpm test`
- 2026-05-06: `pnpm run test:web` failed in the sandbox because Chromium could
  not access macOS Mach port APIs; escalated rerun completed with exit code 0
  and existing localhost dev-extension `package.nls.json` 404 noise
- 2026-05-06: `pnpm run build` completed with existing webpack asset-size
  warnings
- 2026-05-01: `pnpm run qlty` required an escalated rerun after a sandboxed
  log-file permission failure
- 2026-05-01: `pnpm test`
- 2026-05-01: `pnpm run test:web` required an escalated rerun after Chromium
  failed to launch in the sandbox with macOS Mach port permission errors; the
  escalated rerun completed with exit code 0 and existing localhost
  dev-extension `package.nls.json` 404 noise
- 2026-05-01: `pnpm run build` completed with existing webpack asset-size
  warnings
- 2026-05-01: `pnpm run lint:md`
- 2026-05-01: `pnpm run qlty` completed with exit code 0; final runs used an
  escalated command because sandboxed qlty cannot create its log file
- 2026-05-01: `pnpm test`
- 2026-05-01: `pnpm run test:web` required an escalated rerun after Chromium
  failed to launch in the sandbox with macOS Mach port permission errors; the
  escalated rerun completed with exit code 0 and existing localhost
  dev-extension `package.nls.json` 404 noise
- 2026-05-01: `pnpm run build` completed with existing webpack asset-size
  warnings
- 2026-05-01: `pnpm run lint:md`
- 2026-05-01: `pnpm run lint:md`
- 2026-05-01: `pnpm run qlty` required an escalated rerun after a sandboxed
  log-file permission failure
- 2026-05-01: `pnpm run test:compile`
- 2026-05-01: `npm test`
- 2026-05-01: `pnpm run qlty`
- 2026-05-01: `npm run test:web` completed with exit code 0 and existing
  localhost dev-extension `package.nls.json` 404 noise
- 2026-05-01: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-05-01: `pnpm run lint:md`
- 2026-05-01: `pnpm run test:compile`
- 2026-05-01: `pnpm run qlty`
- 2026-05-01: `npm test`
- 2026-05-01: `npm run test:web` completed with exit code 0 and shutdown-time
  `ECONNRESET` / premature-close noise
- 2026-05-01: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-05-01: `pnpm run lint:md`
- 2026-04-29: `pnpm run test:compile`
- 2026-04-29: `pnpm run qlty` required an escalated rerun after a sandboxed
  log-file permission failure
- 2026-04-29: `npm test`
- 2026-04-29: `npm run test:web`
- 2026-04-29: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-04-29: `pnpm run lint:md`
- 2026-04-29: `pnpm run test:compile`
- 2026-04-29: `npm test`
- 2026-04-29: `npm run test:web`
- 2026-04-29: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-04-29: `pnpm run lint:md`
- 2026-04-29: `pnpm run qlty`
