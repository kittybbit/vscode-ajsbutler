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

- [x] Extract `top1` to `top4` default resolution into a transfer-operation
      helper seam while preserving explicit and derived values
- [x] Align omitted UNIX/PC job and UNIX/PC custom job `jd` values to the
      JP1/AJS3 v13 default `cod`
- [x] Align omitted HTTP Connection job `eu` values to the JP1/AJS3 v13
      `ajsprint -a` default values table value `def`
- [x] Align omitted JP1 event sending job `evsrc` values to the JP1/AJS3 v13
      default `10`, preserving explicit values and deciding whether normalized
      unit-list projection should remain raw or become default-aware
- [x] Add focused regression evidence that QUEUE job `ts1` to `ts4` and `td1`
      to `td4` values are preserved while `top1` to `top4` are not exposed or
      derived for `Qj` / `Rq`
- [x] Align `wth` key mapping so job end-judgment threshold parsing reads
      `wth` rather than the schedule-rule `wt` parameter
- [x] Turn the audit notes into an explicit parameter-coverage matrix when
      category-level status needs tracking beyond the current audit summary
- [x] Investigate schedule-rule helper-boundary alignment with the remaining
      grouped semantics, such as `wc` / `wt` pairing or range validation, when
      the behavior contract is explicit enough to test across the family
- [x] Implement schedule-rule `wc` / `wt` effective-value pairing after human
      approval clarifies whether the slice is domain-only or includes
      unit-list projection
- [x] Investigate unit-list group 10 projection for schedule-rule `wc` / `wt`
      effective values as a separate behavior slice after domain-only pairing
- [x] Record human approval before changing unit-list projection behavior
- [x] Implement group 10 effective `wc` / `wt` projection only after approval
- [x] Add focused group 10 regression evidence for disabled and valid pairs
- [x] Run required code-change validation after implementation
- [x] Investigate unit-list group 14 projection for JP1 event sending job
      arrival-check defaults as a separate behavior slice
- [x] Record human approval before changing unit-list group 14 projection
- [x] Implement group 14 default-aware projection only after approval
- [x] Add focused group 14 regression evidence for omitted defaults and
      explicit value preservation
- [x] Run required code-change validation after implementation
- [x] Investigate unit-list group 13 projection for file monitoring job
      defaults as a separate behavior slice
- [x] Record human approval before changing unit-list group 13 projection
- [x] Implement group 13 file monitoring default-aware projection only after
      approval
- [x] Add focused group 13 regression evidence for omitted defaults and
      explicit value preservation
- [x] Run required code-change validation after implementation
- [x] Investigate execution-interval control job defaults and unit-list group
      13 projection as a separate behavior slice
- [x] Record human approval before changing execution-interval control job
      default or projection behavior
- [x] Implement execution-interval control job defaults only after approval
- [x] Add focused execution-interval control job regression evidence for
      omitted defaults, explicit value preservation, and non-target jobs
- [x] Run required code-change validation after implementation
- [x] Investigate unit-list group 15 projection for QUEUE job transfer-file
      operations as a separate behavior slice
- [x] Record human approval before changing QUEUE job group 15 projection
- [x] Implement QUEUE job group 15 unit-type-aware projection only after
      approval
- [x] Add focused group 15 regression evidence for QUEUE `tsN` / `tdN`
      preservation, QUEUE `topN` hiding, and non-QUEUE `topN` preservation
- [x] Run required code-change validation after implementation
- [x] Investigate job end-judgment `jd` / `abr` invalid-combination diagnostics
      as the next parameter semantic diagnostics slice
- [ ] Record human approval before changing editor-feedback diagnostics,
      parser source-location data, runtime code, tests, generated artifacts,
      or configuration
- [ ] Implement focused `jd` / `abr` semantic diagnostics only after approval
- [ ] Add focused diagnostics regression evidence for valid omitted defaults,
      explicit valid retry settings, and explicit invalid combinations
- [ ] Run required code-change validation after implementation

## Notes

- 2026-04-18: normative parameter and command sources were fixed to the user
  supplied JP1/AJS3 version 13 reference documents.
- 2026-04-20: the initial audit is recorded in `AUDIT.md`. Current parameter
  semantics are already centralized mainly in `parameterHelpers.ts`,
  `Defaults.ts`, and the builder families behind `ParamFactory`, while command
  generation is still embedded in
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
- 2026-04-26: the next parameter-alignment candidate is the schedule-rule
  family because these keys already share helper seams, affect unit-list
  behavior, and can be covered as a focused manual-alignment slice without
  creating a full parameter matrix first.
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
- 2026-04-27: transfer-operation alignment is the next helper-boundary slice.
  It keeps the existing `topN` behavior but moves the paired `tsN` / `tdN`
  default rule out of generic parameter helper code.
- 2026-04-27: `topN` default resolution now lives in
  `transferOperationHelpers.ts`; regression evidence covers explicit `topN`,
  derived `sav`, derived `del`, and the no-default case.
- 2026-04-27: job end-judgment alignment is the next non-schedule parameter
  family. The manual-backed behavior change is limited to omitted `jd`
  resolving to `cod`; invalid pairing diagnostics remain deferred.
- 2026-04-27: omitted UNIX/PC job and UNIX/PC custom job `jd` values now
  resolve to `cod` through `jobEndJudgmentHelpers.ts`; explicit `jd` values
  remain preserved.
- 2026-04-28: HTTP Connection job default alignment is the next small
  parameter-default candidate. The proposed behavior change is limited to
  omitted `eu` resolving to `def` for `Htpj` / `Rhtpj`, while other job
  families continue to use generic `eu=ent`.
- 2026-04-28: omitted HTTP Connection job `eu` values now resolve to `def`
  through `httpConnectionJobDefaultHelpers.ts`; explicit HTTP Connection job
  `eu` values and non-HTTP generic `eu=ent` behavior remain preserved.
- 2026-04-28: JP1 event sending job arrival-check defaults are the next
  category-level parameter candidate. The proposed behavior change is limited
  to omitted `evsrc` resolving to `10` for `Evsj` / `Revsj`, while explicit
  values remain preserved. Normalized unit-list projection is approval
  sensitive because it currently reads raw normalized parameters by key.
- 2026-04-28: omitted JP1 event sending job `evsrc` now resolves to `10`
  through `DEFAULTS.Evsrc`; explicit event sending job values remain preserved.
  Unit-list projection remains raw normalized key/value projection.
- 2026-04-29: QUEUE job transfer-file alignment is the next non-schedule
  parameter family. The proposed behavior-preserving change is limited to
  focused regression evidence that `Qj` / `Rq` preserve explicit `ts1` to
  `ts4` and `td1` to `td4` values without exposing or deriving `top1` to
  `top4`, because JP1/AJS3 version 13 QUEUE job definitions do not define
  `topN`.
- 2026-04-29: QUEUE job transfer-file regression evidence now verifies `Qj`
  and `Rq` preserve explicit transfer source/destination values and do not
  expose transfer operation getters. Parser grammar, command generation,
  validation behavior, and unit-list group 15 raw projection remain unchanged.
- 2026-04-29: job end-judgment `wth` key mapping is the next focused
  non-schedule parameter correction. Current code maps `ParamFactory.wth` to
  raw `wt`, and current regression evidence preserves that legacy behavior.
  The proposed implementation changes only the builder/test seam so explicit
  `wth` is preserved and schedule-rule `wt` no longer satisfies
  end-judgment threshold lookup.
- 2026-04-29: `ParamFactory.wth` now reads raw `wth`; focused regression
  evidence verifies explicit `wth` preservation and confirms raw `wt` no
  longer satisfies end-judgment threshold lookup. Parser grammar, command
  generation, validation behavior, schedule-rule `wt`, and unit-list
  normalized raw projection remain unchanged.
- 2026-04-29: `PARAMETER_COVERAGE_MATRIX.md` now turns the current audit and
  focused alignment records into an explicit category-level matrix. This is a
  docs-only status index and does not broaden parameter coverage or approve
  new runtime behavior.
- 2026-04-29: schedule-rule `wc` / `wt` pairing is the next investigated
  behavior candidate. The current code parses and defaults both parameters
  independently, while the JP1/AJS3 v13 jobnet definition says they are
  specified together and `no` in one parameter invalidates the paired
  start-condition monitoring value. Implementation approval is pending.
- 2026-04-29: schedule-rule `wc` / `wt` effective-value pairing is implemented
  as a domain-only helper/API. Raw `Wc.numberOfTimes`, `Wt.time`, `value()`,
  and normalized unit-list projection remain unchanged. Effective values are
  empty when either paired value is `no`, missing, or unparsable.
- 2026-04-29: unit-list group 10 `wc` / `wt` projection is the next
  approval-gated behavior candidate. The proposed scope is limited to table
  DTO projection using the existing effective pairing semantics; parser
  grammar, raw wrappers, normalized raw parameter storage, diagnostics,
  generated artifacts, configuration, dependency versions, and
  `engines.vscode` remain out of scope.
- 2026-04-29: unit-list group 10 `wc` / `wt` projection now consumes the
  existing effective pairing semantics. Disabled pairs display empty
  start-condition monitoring values, valid pairs remain visible, and raw
  parser/domain/normalized values remain unchanged.
- 2026-04-29: unit-list group 14 JP1 event sending job projection is the next
  approval-gated behavior candidate. The proposed scope is limited to table
  DTO projection using the existing domain defaults for omitted `evssv`,
  `evsrt`, `evspl`, and `evsrc`; parser grammar, raw domain wrappers,
  normalized raw parameter storage, diagnostics, generated artifacts,
  configuration, dependency versions, and `engines.vscode` remain out of
  scope.
- 2026-04-29: unit-list group 14 JP1 event sending job projection now consumes
  existing defaults for omitted `evssv`, `evsrt`, `evspl`, and `evsrc`.
  Explicit normalized values remain visible, non-event-sending jobs do not
  synthesize these defaults, and raw parser/domain/normalized values remain
  unchanged.
- 2026-05-01: unit-list group 13 file monitoring job projection is the next
  approval-gated behavior candidate. The proposed scope is limited to table
  DTO projection using the existing domain defaults for omitted `flwc`,
  `flwi`, `flco`, and `ets`; parser grammar, raw domain wrappers, normalized
  raw parameter storage, diagnostics, generated artifacts, configuration,
  dependency versions, and `engines.vscode` remain out of scope.
- 2026-05-01: unit-list group 13 file monitoring job projection now consumes
  existing defaults for omitted `flwc`, `flwi`, `flco`, and `ets`. Explicit
  normalized values remain visible, omitted `flwf` remains empty,
  non-file-monitoring jobs do not synthesize these defaults, and raw
  parser/domain/normalized values remain unchanged.
- 2026-05-01: execution-interval control job defaults are the next
  approval-gated behavior candidate. The proposed scope is limited to
  `tmwj` / `rtmwj` omitted `tmitv=10`, `etn=n`, and `ets=kl` behavior plus
  unit-list group 13 default-aware projection. Parser grammar, normalized raw
  parameter storage, diagnostics, generated artifacts, configuration,
  dependency versions, and `engines.vscode` remain out of scope.
- 2026-05-01: execution-interval control job defaults now resolve omitted
  `tmitv`, `etn`, and `ets` values to `10`, `n`, and `kl`. Unit-list group 13
  projection consumes those defaults for `tmwj` / `rtmwj`, explicit normalized
  values remain visible, non-execution-interval-control jobs do not synthesize
  those defaults, and raw parser/normalized values remain unchanged.
- 2026-05-01: QUEUE job group 15 projection is the next approval-gated
  behavior candidate. The proposed scope is limited to hiding `top1` to
  `top4` transfer-operation projection for `qj` / `rq`, preserving explicit
  `ts1` to `ts4` and `td1` to `td4`, and preserving non-QUEUE `topN`
  projection. Parser grammar, normalized raw parameter storage, diagnostics,
  generated artifacts, configuration, dependency versions, and
  `engines.vscode` remain out of scope.
- 2026-05-01: QUEUE job group 15 projection now hides `top1` to `top4`
  transfer-operation values for `qj` / `rq`. Explicit `ts1` to `ts4` and
  `td1` to `td4` remain visible, non-QUEUE `topN` projection remains visible,
  and raw parser/normalized values remain unchanged.
- 2026-05-01: job end-judgment `jd` / `abr` invalid-combination diagnostics
  are the next approval-gated parameter semantic diagnostics candidate. The
  proposed scope is limited to reporting explicit UNIX/PC job and UNIX/PC
  custom job `abr=y` values when the effective `jd` value is not `cod`,
  preserving raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, and command generation. Parser grammar, generated
  artifacts, configuration, dependency versions, `engines.vscode`, retry range
  diagnostics, byte-length validation, and broad range validation remain out of
  scope.

## Human Approval

- Status: Pending
- Approved at:
- Approved scope:

Current implementation gate: job end-judgment `jd` / `abr`
invalid-combination diagnostics.

## Prior Approval Evidence

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

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.

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
