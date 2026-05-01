# PLANS: align-jp1-v13-parameter-and-command-reference

## Objective

Move parameter interpretation and supported `ajs` command generation onto
explicit JP1/AJS3 version 13 reference-driven contracts.

## Scope

- Align parameter parsing with the Definition File Reference.
- Keep generated command support tied to the Command Reference.
- Expand command and parameter support incrementally.

## Delivered

- Recorded the current parameter and command-generation audit in `AUDIT.md`.
- Extracted `ajsshow` and `ajsprint` generation into
  `buildAjsCommands(...)`.
- Added command-builder metadata for the supported commands.
- Localized command-builder labels, descriptions, and manual links through the
  existing message resources.
- Prepared the schedule-rule parameter slice in
  `SCHEDULE_RULE_ALIGNMENT.md`.
- Added behavior-preserving schedule-rule regression tests for thin evidence
  before changing helper semantics.
- Implemented the first behavior-changing schedule-rule alignment fix by
  ignoring `ln` on root jobnets.
- Started category-level value parsing alignment with the schedule-rule
  parameter family, using shared domain helpers as the boundary pattern.
- Prepared the next category-level helper-boundary slice for transfer
  operation parameters in `TRANSFER_OPERATION_ALIGNMENT.md`.
- Extracted `top1` to `top4` default resolution into
  `transferOperationHelpers.ts` while preserving explicit and derived values.
- Prepared the next non-schedule category slice for job end-judgment
  parameters in `JOB_END_JUDGMENT_ALIGNMENT.md`.
- Aligned omitted UNIX/PC job and UNIX/PC custom job `jd` values to the
  JP1/AJS3 v13 default `cod` behind `jobEndJudgmentHelpers.ts`.
- Investigated HTTP Connection job defaults in
  `HTTP_CONNECTION_JOB_DEFAULT_ALIGNMENT.md` as the next small
  parameter-default candidate.
- Aligned omitted HTTP Connection job `eu` values to `def` through
  `httpConnectionJobDefaultHelpers.ts` while preserving explicit values and
  generic non-HTTP `eu=ent` behavior.
- Investigated JP1 event sending job arrival-check defaults in
  `EVENT_SEND_JOB_ALIGNMENT.md` as the next category-level parameter
  candidate.
- Aligned omitted JP1 event sending job `evsrc` values to `10` through
  `DEFAULTS.Evsrc`, while preserving explicit values and leaving normalized
  unit-list projection raw.
- Investigated QUEUE job transfer-file alignment as the next non-schedule
  parameter family. The candidate is behavior-preserving regression evidence
  that `Qj` / `Rq` expose `ts1` to `ts4` and `td1` to `td4` without exposing or
  deriving `top1` to `top4`.
- Investigated job end-judgment `wth` key mapping as the next focused
  non-schedule parameter correction.
- Aligned `ParamFactory.wth` to read raw `wth`, replacing the legacy
  `wth` to `wt` lookup while preserving schedule-rule `wt` behavior.
- Added `PARAMETER_COVERAGE_MATRIX.md` as a docs-only category-level status
  index for the alignment slices that already have focused investigation
  records.
- Investigated schedule-rule `wc` / `wt` pairing as the next approval-gated
  behavior candidate.
- Implemented domain-only `wc` / `wt` effective-value pairing while preserving
  raw schedule-rule values and unit-list projection.
- Investigated unit-list group 10 projection for `wc` / `wt` as the next
  approval-gated behavior candidate after domain-only pairing.
- Implemented unit-list group 10 projection for effective `wc` / `wt` values
  while preserving raw parser, wrapper, and normalized parameter values.
- Investigated JP1 event sending job unit-list group 14 projection for
  default-aware `evssv`, `evsrt`, `evspl`, and `evsrc` values as the next
  approval-gated behavior candidate after the group 10 slice.
- Implemented unit-list group 14 projection for JP1 event sending job
  arrival-check defaults while preserving explicit normalized values and raw
  storage.
- Investigated file monitoring job unit-list group 13 projection for
  default-aware `flwc`, `flwi`, `flco`, and `ets` values as the next
  approval-gated behavior candidate after the group 14 slice.
- Implemented unit-list group 13 projection for file monitoring job defaults
  while preserving explicit normalized values and raw storage.
- Investigated execution-interval control job defaults and unit-list group 13
  projection for omitted `tmitv`, `etn`, and `ets` values as the next
  approval-gated behavior candidate after the file monitoring slice.
- Implemented execution-interval control job `tmitv=10`, `etn=n`, and
  `ets=kl` defaults and group 13 default-aware projection while preserving
  explicit normalized values and raw storage.
- Investigated QUEUE job unit-list group 15 projection as the next
  approval-gated behavior candidate after the execution-interval control job
  slice.
- Implemented QUEUE job unit-list group 15 projection so `qj` / `rq`
  transfer-operation values are hidden while transfer source/destination and
  non-QUEUE `topN` projection remain visible.

## Impact Investigation

- Planned change: align the omitted JP1 event sending job `evsrc` default with
  the JP1/AJS3 version 13 event sending job definition by resolving `Evsj` and
  `Revsj` omitted `evsrc` values to `10`, while preserving explicit `evsrc`
  values and existing `evssv`, `evsrt`, and `evspl` defaults.
- Affected files:
  `src/domain/models/units/Evsj.ts`,
  `src/domain/models/parameters/Defaults.ts`,
  `src/domain/models/parameters/optionalScalarParameterBuilders.ts`,
  a possible new JP1 event sending job default helper,
  `src/application/unit-list/buildUnitListRemainingGroups.ts` if normalized
  projection is approved for default-aware behavior, focused parameter factory
  tests, focused unit-list tests if projection changes, and this feature's SDD
  docs.
- Affected features: JP1/AJS parameter interpretation for JP1 event sending
  job arrival-check defaults; unit-list group 14 event-action columns if
  normalized projection behavior changes.
- Tests affected: parameter factory regression tests; helper tests if a helper
  seam is introduced; build-unit-list view tests only if default-aware
  projection is approved.
- Breaking-change risk: medium. Omitted JP1 event sending job `evsrc` values
  would surface as `10`, matching the manual, but any consumer expecting the
  current generic `0` fallback will observe a changed default value. Unit-list
  behavior is a separate risk because it currently reads normalized raw
  parameters rather than wrapper defaults.
- Alternatives considered: leave generic `DEFAULTS.Evsrc` behavior unchanged
  and record the event sending job check-count mismatch as unresolved; change
  `DEFAULTS.Evsrc` globally to `10` only after confirming no other unit family
  shares the current `0` assumption; or defer until a full parameter coverage
  matrix exists. A focused helper seam is preferred if global impact remains
  ambiguous.
- Approval: human approval to proceed was given on 2026-04-28 after the
  investigation summary for JP1 event sending job `evsrc` default alignment.
  The approved scope keeps unit-list normalized projection raw.

### QUEUE Job Transfer-File Candidate

- Planned change: add focused regression evidence for QUEUE job transfer-file
  parameters, preserving explicit `ts1` to `ts4` and `td1` to `td4` values and
  confirming `top1` to `top4` are not exposed or derived for `Qj` / `Rq`.
- Affected files:
  `src/domain/models/units/Qj.ts`,
  `src/domain/models/parameters/ParameterFactory.ts`,
  `src/domain/models/parameters/optionalScalarParameterBuilders.ts`,
  `src/domain/models/parameters/transferOperationHelpers.ts`,
  `src/domain/models/parameters/transferOperationParameterBuilders.ts`,
  `src/application/unit-list/buildUnitListRemainingGroups.ts`,
  focused parameter factory or helper tests,
  focused unit-list tests if raw projection evidence is added, and this
  feature's SDD docs.
- Affected features: JP1/AJS parameter interpretation for QUEUE job
  transfer-file parameters; unit-list group 15 transfer columns remain raw
  normalized projection.
- Tests affected: focused parameter factory tests for `Qj` / `Rq`; existing
  transfer-operation helper tests for UNIX/PC job behavior must continue to
  pass; unit-list tests only if the approved scope includes explicit raw
  projection evidence.
- Breaking-change risk: low if limited to regression evidence. Risk becomes
  medium if implementation attempts to add `topN` to QUEUE jobs or changes
  group 15 projection semantics.
- Alternatives considered: add `topN` getters to QUEUE wrappers, rejected
  because the JP1/AJS3 version 13 QUEUE job definition does not define `topN`;
  make group 15 unit-type-aware, deferred as a separate unit-list behavior
  slice; defer to a full parameter matrix, not preferred because the current
  follow-up is already narrow and testable.
- Approval: completed in the prior QUEUE transfer-file slice; see
  `TASKS.md` prior approval evidence.

### QUEUE Job Group 15 Projection Candidate

- Planned change:
  make unit-list group 15 transfer-operation projection unit-type-aware for
  QUEUE jobs by hiding `top1` to `top4` values on `qj` / `rq`, while
  preserving explicit `ts1` to `ts4` and `td1` to `td4` projection and
  preserving non-QUEUE `topN` projection.
- Affected files:
  `src/application/unit-list/buildUnitListRemainingGroups.ts`,
  `src/application/unit-list/buildUnitListView.ts` only if helper typing
  changes, `src/test/suite/buildUnitListRemainingGroups.test.ts` or
  `src/test/suite/buildUnitListView.test.ts`,
  `QUEUE_TRANSFER_FILE_ALIGNMENT.md`, `PARAMETER_COVERAGE_MATRIX.md`,
  `SPECS.md`, `TASKS.md`, `docs/requirements/use-cases/uc-build-unit-list-view.md`,
  and branch-level `docs/specs/plans.md`.
- Affected functions/classes/components:
  `buildUnitListRemainingGroups`,
  `UnitListGroup15View.terminationStatus1` to `terminationStatus4`,
  `UnitListGroup15View.terminationDelay1` to `terminationDelay4`,
  `UnitListGroup15View.terminationOperation1` to `terminationOperation4`, and
  the group 15 table columns that render those DTO fields.
- Affected features:
  JP1/AJS table viewer group 15 transfer-file columns; build-unit-list
  application use case; QUEUE job transfer-file parameter interpretation.
- Tests affected:
  focused unit-list tests for QUEUE jobs with explicit `tsN`, `tdN`, and raw
  `topN`; non-QUEUE tests proving existing `topN` projection remains visible.
- Breaking-change risk:
  medium. This intentionally changes user-visible table output for QUEUE job
  definitions that contain raw `top1` to `top4` values. Raw parser output and
  normalized key/value storage remain unchanged.
- Alternatives considered:
  keep group 15 raw by design and leave the matrix gap visible; add `topN`
  getters to `Qj` / `Rq`, rejected because the QUEUE job definition does not
  define `top1` to `top4`; add diagnostics first, deferred until
  editor-feedback behavior explicitly owns invalid JP1/AJS parameter handling.
- Approval:
  human approval to proceed was given on 2026-05-01 after the investigation
  summary for QUEUE job unit-list group 15 projection.

### WTH End-Judgment Key Mapping Candidate

- Planned change: align `ParamFactory.wth` with the JP1/AJS3 v13
  end-judgment parameter by reading raw `wth` instead of the schedule-rule
  `wt` parameter.
- Affected files:
  `src/domain/models/parameters/optionalScalarParameterBuilders.ts`,
  `src/domain/models/parameters/ParameterFactory.ts`,
  `src/domain/models/parameters/index.ts`,
  `src/domain/models/units/J.ts`,
  `src/domain/models/units/Cj.ts`,
  `src/domain/models/units/Cpj.ts`,
  `src/domain/models/units/Fxj.ts`,
  `src/domain/models/units/Htpj.ts`,
  `src/domain/models/units/Qj.ts`,
  `src/test/suite/parameterFactory.test.ts`,
  `src/test/suite/buildUnitListView.test.ts` if raw projection evidence needs
  adjustment, and this feature's SDD docs.
- Affected features: JP1/AJS parameter interpretation for job end-judgment
  thresholds; unit-list group 11 raw threshold projection should remain
  unchanged unless implementation reveals test gaps.
- Tests affected: replace the legacy `wth` to `wt` regression with evidence
  that explicit `wth` is preserved and schedule-rule `wt` does not satisfy
  `ParamFactory.wth`; keep omitted `wth` undefined evidence.
- Breaking-change risk: low-to-medium. The planned behavior matches the
  parameter name used by wrappers and JP1/AJS3 v13 docs, but it intentionally
  removes a documented legacy compatibility quirk.
- Alternatives considered: leave the legacy `wth` to `wt` mapping and record it
  as a known mismatch; support both `wth` and `wt` fallback, rejected because it
  would continue mixing schedule-rule and end-judgment semantics; defer to a
  full parameter matrix, rejected because this is a small, isolated correction.
- Approval: human approval to proceed was given on 2026-04-29 after the
  investigation summary for `wth` key mapping alignment.

### WC / WT Schedule-Rule Pairing Candidate

- Planned change: add a small schedule-rule helper seam for `wc` / `wt`
  effective start-condition monitoring values so a rule is treated as disabled
  when either paired value for the same rule is `no`, while preserving raw
  parameter parsing and current raw normalized projection unless separately
  approved.
- Affected files:
  `src/domain/models/parameters/scheduleRuleHelpers.ts`,
  `src/domain/models/parameters/ScheduleRule.ts`,
  `src/domain/models/parameters/Time.ts`,
  `src/domain/models/parameters/ruleParameterBuilders.ts`,
  `src/domain/models/parameters/ParameterFactory.ts`,
  `src/domain/models/units/N.ts`,
  `src/application/unit-list/buildUnitListGroup10View.ts` if effective
  projection is approved,
  `src/application/unit-list/unitListViewHelpers.ts` if effective projection
  is approved,
  focused schedule-rule helper and parameter factory tests,
  focused unit-list tests only if projection changes,
  and this feature's SDD docs.
- Affected features:
  JP1/AJS parameter interpretation for jobnet start-condition monitoring;
  unit-list group 10 schedule projection only if default-aware effective values
  are explicitly approved.
- Tests affected:
  `src/test/suite/scheduleRuleHelpers.test.ts`,
  `src/test/suite/parameterFactory.test.ts`,
  `src/test/suite/parameterHelpers.test.ts` if builder output changes, and
  `src/test/suite/buildUnitListGroup10View.test.ts` /
  `src/test/suite/buildUnitListView.test.ts` only if projection changes.
- Breaking-change risk:
  medium. The manual-aligned effective behavior would treat some currently
  visible paired values as disabled when the counterpart is `no`. Preserving
  raw parameter values and limiting the first slice to domain effective helpers
  keeps projection and dialog behavior stable.
- Alternatives considered:
  leave independent `wc` and `wt` values as-is and keep the matrix marked
  partial; add diagnostics instead of changing interpretation, deferred until
  editor-feedback behavior is explicit; update unit-list projection immediately,
  deferred unless explicitly approved because list groups currently read raw
  normalized key/value data.
- Approval:
  human approval to proceed was given on 2026-04-29 after the investigation
  summary for domain-only `wc` / `wt` effective-value pairing.

### WC / WT Unit-List Projection Candidate

- Planned change:
  change unit-list group 10 start-condition projection to consume effective
  `wc` / `wt` pairing semantics instead of displaying raw independent values.
- Affected files:
  `src/application/unit-list/buildUnitListGroup10View.ts`,
  `src/application/unit-list/unitListViewHelpers.ts` if a projection helper is
  added, `src/test/suite/buildUnitListGroup10View.test.ts`,
  `src/test/suite/buildUnitListView.test.ts` if the full unit-list fixture
  needs explicit coverage, `docs/requirements/use-cases/uc-build-unit-list.md`,
  `SCHEDULE_RULE_ALIGNMENT.md`, `SPECS.md`, `TASKS.md`, and branch-level
  `docs/specs/plans.md`.
- Affected functions/classes/components:
  `buildUnitListGroup10View`, `parseWc`, `parseTimeValue`, the
  `UnitListGroup10View.waitCounts` and `waitTimes` DTO fields, and the group
  10 table columns that render those arrays.
- Affected features:
  JP1/AJS table viewer group 10 schedule definition columns; build-unit-list
  application use case; schedule-rule parameter interpretation.
- Tests affected:
  focused group 10 unit-list tests; full build-unit-list tests only if needed
  to lock the DTO-level behavior; existing domain tests for
  `resolveEffectiveStartConditionMonitoringPair` should continue to pass.
- Breaking-change risk:
  medium. This intentionally changes user-visible table output for definitions
  where one side of a `wc` / `wt` pair disables start-condition monitoring.
  Raw parser output, raw domain wrapper values, and normalized key/value
  storage remain unchanged.
- Alternatives considered:
  keep group 10 raw by design and leave the matrix gap visible; add separate
  raw and effective columns, rejected for this slice because it expands UI and
  localization scope; add diagnostics instead of projection changes, deferred
  until editor-feedback behavior explicitly owns cross-parameter warnings.
- Approval:
  human approval to proceed was given on 2026-04-29 after the investigation
  summary for unit-list group 10 effective `wc` / `wt` projection.

### JP1 Event Sending Job Group 14 Projection Candidate

- Planned change:
  change unit-list group 14 JP1 event sending job arrival-check projection to
  display existing domain defaults for omitted `evssv`, `evsrt`, `evspl`, and
  `evsrc`, while preserving explicit normalized values.
- Affected files:
  `src/application/unit-list/buildUnitListRemainingGroups.ts`,
  `src/application/unit-list/buildUnitListView.ts` only if helper typing
  changes, `src/test/suite/buildUnitListRemainingGroups.test.ts` or
  `src/test/suite/buildUnitListView.test.ts`, `EVENT_SEND_JOB_ALIGNMENT.md`,
  `PARAMETER_COVERAGE_MATRIX.md`, `SPECS.md`, `TASKS.md`, and branch-level
  `docs/specs/plans.md`.
- Affected functions/classes/components:
  `buildUnitListRemainingGroups`, `UnitListGroup14View.actionSeverity`,
  `UnitListGroup14View.actionStartType`,
  `UnitListGroup14View.actionInterval`,
  `UnitListGroup14View.actionCount`, and the group 14 table columns that
  render those DTO fields.
- Affected features:
  JP1/AJS table viewer group 14 action job definition columns;
  build-unit-list application use case; JP1 event sending job parameter
  interpretation.
- Tests affected:
  focused unit-list tests for omitted event sending job arrival-check
  parameters and explicit value preservation; existing `parameterFactory`
  default tests should continue to pass unchanged.
- Breaking-change risk:
  medium. This intentionally changes user-visible table output for definitions
  where JP1 event sending job `evssv`, `evsrt`, `evspl`, or `evsrc` are
  omitted. Raw parser output, raw domain wrapper values, and normalized
  key/value storage remain unchanged.
- Alternatives considered:
  keep group 14 raw by design and leave the matrix gap visible; add separate
  raw and default-aware columns, rejected for this slice because it expands UI
  and localization scope; prioritize `evhst` requiredness diagnostics first,
  deferred until editor-feedback behavior explicitly owns cross-parameter
  diagnostics.
- Approval:
  human approval to proceed was given on 2026-04-29 after the investigation
  summary for unit-list group 14 default-aware projection.

### File Monitoring Job Group 13 Projection Candidate

- Planned change:
  change unit-list group 13 file monitoring job projection to display existing
  domain defaults for omitted `flwc`, `flwi`, `flco`, and `ets`, while
  preserving explicit normalized values.
- Affected files:
  `src/application/unit-list/buildUnitListRemainingGroups.ts`,
  `src/application/unit-list/buildUnitListView.ts` only if helper typing
  changes, `src/test/suite/buildUnitListRemainingGroups.test.ts` or
  `src/test/suite/buildUnitListView.test.ts`,
  `FILE_MONITORING_JOB_ALIGNMENT.md`, `PARAMETER_COVERAGE_MATRIX.md`,
  `SPECS.md`, `TASKS.md`, `docs/requirements/use-cases/uc-build-unit-list-view.md`,
  and branch-level `docs/specs/plans.md`.
- Affected functions/classes/components:
  `buildUnitListRemainingGroups`,
  `UnitListGroup13View.monitoredFileCondition`,
  `UnitListGroup13View.monitoredFileCloseMode`,
  `UnitListGroup13View.monitoringInterval`,
  `UnitListGroup13View.eventTimeoutAction`, and the group 13 table columns
  that render those DTO fields.
- Affected features:
  JP1/AJS table viewer group 13 event job definition columns;
  build-unit-list application use case; file monitoring job parameter
  interpretation.
- Tests affected:
  focused unit-list tests for omitted file monitoring job defaults and
  explicit value preservation; existing domain default behavior should
  continue to pass unchanged.
- Breaking-change risk:
  medium. This intentionally changes user-visible table output for definitions
  where file monitoring job `flwc`, `flwi`, `flco`, or `ets` are omitted. Raw
  parser output, raw domain wrapper values, and normalized key/value storage
  remain unchanged.
- Alternatives considered:
  keep group 13 raw by design and leave the matrix gap visible; add separate
  raw and default-aware columns, rejected for this slice because it expands UI
  and localization scope; change domain defaults or add a file-monitoring
  helper seam, deferred because the behavior gap is projection-only; prioritize
  diagnostics for `flwc` invalid combinations, wildcard restrictions, or
  numeric ranges first, deferred until editor-feedback behavior explicitly
  owns invalid JP1/AJS parameter handling.
- Approval:
  human approval to proceed was given on 2026-05-01 after the investigation
  summary for unit-list group 13 default-aware projection.

### Execution-Interval Control Job Defaults Candidate

- Planned change:
  align omitted execution-interval control job `tmitv`, `etn`, and `ets`
  behavior with the JP1/AJS3 version 13 execution-interval control job
  definition. The recommended implementation adds a `tmitv=10` domain default
  and makes unit-list group 13 display defaults for omitted `tmwj` / `rtmwj`
  values while preserving explicit normalized values.
- Affected files:
  `src/domain/models/parameters/Defaults.ts`,
  `src/domain/models/parameters/optionalScalarParameterBuilders.ts`,
  `src/domain/models/units/Tmwj.ts` as the wrapper consumer,
  `src/application/unit-list/buildUnitListRemainingGroups.ts`,
  `src/application/unit-list/buildUnitListView.ts` only if helper typing
  changes, `src/test/suite/parameterFactory.test.ts`,
  `src/test/suite/buildUnitListRemainingGroups.test.ts` or
  `src/test/suite/buildUnitListView.test.ts`,
  `EXECUTION_INTERVAL_CONTROL_JOB_ALIGNMENT.md`,
  `PARAMETER_COVERAGE_MATRIX.md`, `SPECS.md`, `TASKS.md`, and branch-level
  `docs/specs/plans.md`.
- Affected functions/classes/components:
  `ParamFactory.tmitv`, `optionalScalarParameterBuilders.tmitv`,
  `DEFAULTS`, `Tmwj.tmitv`, `Tmwj.etn`, `Tmwj.ets`,
  `buildUnitListRemainingGroups`, `UnitListGroup13View.timeoutInterval`,
  `UnitListGroup13View.eventTimeout`,
  `UnitListGroup13View.eventTimeoutAction`, and the group 13 table columns
  that render those DTO fields.
- Affected features:
  JP1/AJS parameter interpretation for execution-interval control jobs;
  JP1/AJS table viewer group 13 event job definition columns;
  build-unit-list application use case.
- Tests affected:
  focused parameter factory tests for omitted and explicit `tmitv`, `etn`, and
  `ets` behavior; focused unit-list tests for omitted execution-interval
  control job defaults, explicit value preservation, and non-target job
  behavior.
- Breaking-change risk:
  medium. Omitted `tmitv` would become visible through the domain wrapper as
  `10`, and omitted group 13 execution-interval control job fields would
  display defaults instead of empty cells. The planned scope preserves raw
  parser output and normalized key/value storage.
- Alternatives considered:
  keep group 13 raw by design and leave the matrix gap visible; add
  projection-only defaults without adding a `tmitv` domain default, rejected as
  less domain-aligned; broaden the slice to all wait-job defaults, deferred
  because it expands the approval and regression surface.
- Approval:
  human approval to proceed was given on 2026-05-01 after the investigation
  summary for execution-interval control job defaults and unit-list group 13
  projection.

## Follow-up

- Apply the same value parsing audit/refactor workflow to other parameter
  categories before marking them official-reference aligned.
- Keep the parameter-coverage matrix current whenever a focused alignment
  slice is added, completed, re-scoped, or deferred.
- Revisit QUEUE job transfer-file coverage separately because the manual
  defines `tsN` and `tdN` but not `topN`.
- Revisit invalid `jd` / `abr` combinations when diagnostics behavior is
  explicit.
- Reconcile HTTP Connection job `eu` wording across the definition section and
  `ajsprint -a` default table if future evidence conflicts with the approved
  behavior.
- Revisit JP1 event sending job `evhst` requiredness when `evsrt=y` after the
  diagnostics behavior contract is explicit.
- Revisit file monitoring job `flwc` invalid combinations, `flwi` range
  validation, wildcard restrictions, and `flco` pairing diagnostics after the
  editor-feedback behavior contract is explicit.
- Revisit execution-interval control job `tmitv` range validation and broader
  wait-job default reconciliation after the focused default/projection slice.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run qlty`; add `pnpm run lint:md` when useful

Current branch validation:

- 2026-04-27: `npm test`
- 2026-04-27: `npm run qlty`
- 2026-04-27: `npm run test:web`
- 2026-04-27: `npm run build`
- 2026-04-28: `npm test`
- 2026-04-28: `npm run qlty`
- 2026-04-28: `npm run test:web`
- 2026-04-28: `npm run build`
- 2026-04-28: `pnpm run lint:md`
- 2026-04-28: `npm test`
- 2026-04-28: `npm run test:web`
- 2026-04-28: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-04-28: `pnpm run qlty` passed after excluding `.serena/` from Qlty
- 2026-04-29: `npm test`
- 2026-04-29: `npm run test:web`
- 2026-04-29: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-04-29: `pnpm run qlty`
- 2026-04-29: `pnpm run lint:md`
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
- 2026-05-01: `npm test`
- 2026-05-01: `pnpm run qlty`
- 2026-05-01: `npm run test:web` completed with exit code 0 and existing
  localhost dev-extension `package.nls.json` 404 noise
- 2026-05-01: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-05-01: `pnpm run lint:md`
- 2026-05-01: `pnpm run qlty` required an escalated rerun after a sandboxed
  log-file permission failure
- 2026-04-29: `pnpm run lint:md`
- 2026-04-29: `pnpm run qlty`
- 2026-04-29: `npm test`
- 2026-04-29: `pnpm run qlty`
- 2026-04-29: `npm run test:web`
- 2026-04-29: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-04-29: `npm test`
- 2026-04-29: `pnpm run qlty`
- 2026-04-29: `npm run test:web`
- 2026-04-29: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-04-29: `pnpm run qlty`
- 2026-04-29: `pnpm run lint:md`
