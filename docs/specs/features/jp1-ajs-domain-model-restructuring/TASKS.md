# JP1/AJS Domain Model Restructuring Tasks

## Agent Brief

- Purpose: centralize schedule-date (`sd`) interpretation as one cohesive
  Domain responsibility without changing JP1/AJS behavior.
- Selected feature: `jp1-ajs-domain-model-restructuring`.
- Approved or active slice: Slice 3 is approved and ready after Slice 2
  completion approval.
- Do not change supported schedule forms, defaults, validation, diagnostics,
  DTOs, parser normalization, or Semantic Diff decisions.
- Do not broaden the feature to other schedule parameters or domain rules.
- Read first: `SPECS.md`, this file, and the schedule-rule baseline evidence.
- Read `TRACEABILITY.md` when decomposing or validating consumer coverage.
- Validate intake with docs-only quality and Markdown checks.
- Approval policy and document roles: see `docs/specs/README.md`.
- Next decision: review the full plan with `sdd-review-plan`.

## Sync Rule

- This file is the sole plan and current-state owner for this feature.
- Other feature folders inherited from the base branch remain outside this
  feature's scope.
- Update `docs/specs/roadmap.md` only when repository-level ordering, entry
  conditions, or unresolved product concerns change.
- Keep implementation history out of this file; retain only information that
  affects approval, validation, risk, or Feature Exit.

## Plan Status

- Status: In Progress
- Planning scope: establish one focused schedule-date Domain interpreter, then
  migrate diagnostics, Semantic Diff, and Unit List through ordered,
  independently approvable consumer boundaries.
- Review status: Reviewed
- Human approval: Approved for all three reviewed slices
- Active implementation slice: Slice 3

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: all three reviewed implementation slices exactly as recorded
  below; no new behavior, parser/DTO/schema change, host support change,
  unrelated cleanup, or architecture exception is approved

Implementation must not start while Status is Pending. Planning and review do
not constitute implementation approval.

## Planning Inputs

- Boundary evidence: `docs/specs/features/BASELINE.md` `Intake group 14`.
- Domain contract: `JP1-PARAM-SCHEDULE-START-DATE-001` and the shared
  interpretation rules in `interpret-jp1-parameters.md`.
- Existing consumers:
  - Unit List schedule projection
  - schedule diagnostics
  - Semantic Diff schedule evaluation
- Existing protective tests:
  - `src/test/suite/scheduleRuleHelpers.test.ts`
  - `src/test/suite/buildUnitListView.test.ts`
  - `src/test/suite/buildSyntaxDiagnostics.test.ts`
  - `src/test/suite/semanticDiffScheduleRules.test.ts`

## Replanning Decision

- The first plan review found that the focused Domain result contract did not
  explicitly preserve explicit-rule presence or provide semantic token
  categories, leaving diagnostics, Unit List, or Semantic Diff able to recover
  schedule syntax independently.
- The first plan review also found incomplete web/build validation for the
  shared code slices, an incomplete indirect-consumer impact inventory, and a
  missing durable Unit List schedule-date contract.
- This revision keeps the three-slice order and approval boundaries, but makes
  the shared result contract, compatibility parity, indirect impact checks,
  desktop/web/build validation, qlty evidence, and Unit List use-case
  propagation explicit.

## Planning Gate Evidence

- Selection evidence: the user explicitly selected
  `jp1-ajs-domain-model-restructuring`, and the branch
  `codex/jp1-ajs-domain-model-restructuring` was created before planning from
  the completed predecessor branch state.
- Feature coverage: the slices cover every `SPECS.md` requirement and
  acceptance criterion across shared interpretation, diagnostics, Semantic
  Diff, Unit List, raw evidence, version-13 boundaries, and host neutrality.
- Current call sites: `parseScheduleDateValue` is consumed by
  `unitListScheduleValueHelpers.ts`, `ScheduleDateRules.ts`, and
  `semanticDiffScheduleRules.ts`; each consumer reconstructs a different
  consumer-specific view from the shared syntax result.
- Indirect impact confirmation: the diagnostic pipeline includes
  `ScheduleDiagnosticRules.ts` and `evaluateScheduleDiagnosticViolations.ts`;
  the Unit List path includes `buildUnitListGroup10View.ts` and
  `unitListViewHelpers.ts`; the Semantic Diff application path includes
  `compareScheduleDiff.ts`. These are unchanged unless the approved result
  contract requires a directly coupled adapter update.
- Boundary decision: use a focused stateless Domain interpreter and stable
  `ScheduleDateInterpretation` result type, not a behaviorful class or generic
  rule engine. The result exposes the effective rule number, explicit-rule
  presence, structured year/month fields, and a semantic token category with
  the fields needed to distinguish calendar, relative, open, closed,
  backward, weekday, `en`, and `ud` forms. It does not expose diagnostic
  validity, Semantic-Diff reasons, or Unit List display labels. Consumer policy
  remains in its current owner.
- Smallest useful slices: establish the Domain contract together with its
  strictest evidence-preserving consumer, then migrate the two independent
  comparison and projection responsibilities. Each slice is reviewable,
  testable, committable, and approvable without leaving a broken consumer.
- Repository sequencing: characterization and Application Use Case Extraction
  evidence are present in the branch base; roadmap ordering and entry
  conditions do not change.
- Compatibility assumption: the focused interpreter can preserve normalized
  input and public DTOs. The existing `parseScheduleDateValue` contract must
  delegate to it during migration and produce parity for the full focused
  matrix. Any need to change normalized input or public DTOs requires
  Replanning Mode and renewed approval.

## Implementation Slices

### Slice 1: Establish Schedule-Date Interpretation Through Diagnostics

- Status: Complete
- Scope: introduce the focused Domain `ScheduleDateInterpretation` result and
  stateless interpreter; make the current generic schedule-date helper
  delegate during migration; update schedule diagnostics to consume the
  explicit-rule and semantic-token fields while retaining diagnostic
  validation and source evidence in their existing Domain service.
- User / Domain Value: one explicit Domain responsibility owns normalized `sd`
  syntax and rule association, while diagnostics continue to enforce
  `JP1-PARAM-SCHEDULE-START-DATE-001` without duplicating that interpretation.
- Cohesive Change Group:
  - focused module under `src/domain/models/parameters/`
  - `src/domain/models/parameters/scheduleRuleHelpers.ts`
  - `src/domain/services/diagnostics/ScheduleDateRules.ts`
  - `src/test/suite/scheduleRuleHelpers.test.ts`
  - `src/test/suite/buildSyntaxDiagnostics.test.ts`
- Acceptance:
  - `ScheduleDateInterpretation` preserves effective rule association,
    whether the rule number was explicit, structured year/month fields, and a
    semantic token category for calendar, relative, open, closed, backward,
    weekday, `en`, and `ud` forms
  - omitted rule resolves to `1`, while `sd=0,ud`, `sd=0,15`, `sd=145,...`,
    omitted `ud`, and explicit nonzero-rule `ud` remain distinguishable for
    the existing diagnostic validity boundary
  - calendar, relative-day, open-day, closed-day, weekday, `en`, and `ud`
    forms retain current interpretation; incomplete and unsupported shapes are
    not partially accepted
  - the legacy `parseScheduleDateValue` result is a compatibility projection
    of the focused interpretation for the migration matrix; no consumer needs
    a second raw-value syntax parser
  - raw normalized evidence, diagnostic rule ID, wording, severity, and source
    position remain unchanged
  - the Domain interpreter imports no parser, outer-layer, host, UI, Node.js,
    or infrastructure dependency
- Validation:
  - extend focused interpreter tests with omitted and explicit rules, rule
    `144`, `sd=0,ud`, `sd=0,15`, `sd=145,...`, omitted `ud`, explicit nonzero
    `ud`, every supported token category, incomplete values, and unsupported
    shapes
  - assert legacy-helper/delegated-interpreter parity for that full matrix,
    including raw evidence and explicit-rule presence
  - retain diagnostic parser-path coverage for valid and invalid schedule dates,
    `SCHEDULELIMIT`, leap/calendar boundaries, unchanged messages, source
    spans, severity, and rule IDs
  - verify indirect diagnostic consumers remain compatible:
    `ScheduleDiagnosticRules.ts` and
    `evaluateScheduleDiagnosticViolations.ts`
  - run `rtk pnpm test`, `rtk pnpm run test:web`, `rtk pnpm run build`, and
    `rtk pnpm run qlty`; compare qlty output with the baseline, resolve new
    actionable smells or record an approved follow-up, and treat metric-only
    movement as review evidence
- Production Readiness:
  - Failure mode: uninterpretable input remains undefined and diagnostics keep
    reporting the existing focused violation rather than inventing partial data
  - JP1/AJS compatibility: preserve version-13 rule `1`, rule `144`, explicit
    rule ranges, `sd=0,ud`, and all currently supported day forms
  - Large or malformed input risk: retain one bounded string match per value;
    do not add document scans, exception-based parsing, or partial results
  - Desktop/web impact: Domain code remains browser-safe and host-neutral;
    diagnostic decisions remain shared by both entry points
  - README/docs impact: no user documentation change; the durable Unit List
    use case is updated separately to name the existing schedule-date rule and
    projection contract
  - CHANGELOG impact: none under the CHANGELOG Update Criteria because this is
    internal restructuring with unchanged diagnostics and compatibility
- Approval Boundary: approve only the focused `ScheduleDateInterpretation`
  contract and its temporary helper delegation, diagnostic migration, indirect
  diagnostic compatibility checks, and their protective tests. The contract
  must not include diagnostic validity or Semantic-Diff policy. Semantic Diff
  and Unit List migration are not approved by this slice.
- Dependencies: completed characterization evidence; no earlier feature slice
- Risks: the result type could leak diagnostic validity or normalize explicit
  evidence too early; the approved contract must remain limited to shared
  interpretation, explicit-rule presence, structured date fields, and semantic
  token meaning. Delegation parity must prevent two syntax interpretations.
- Out of Scope: diagnostic wording changes, new JP1/AJS rules, parser or DTO
  changes, and restructuring other schedule helpers.

### Slice 2: Consume Schedule-Date Interpretation In Semantic Diff

- Status: Complete
- Scope: migrate Semantic Diff schedule rule association, explicit calendar
  candidate generation, and unsupported-date decisions to the focused Domain
  interpretation without changing comparison policy or result schemas. Use the
  Domain semantic token category and structured fields instead of recovering
  calendar/non-calendar distinctions from raw `sd` syntax.
- User / Domain Value: schedule comparison uses the same JP1/AJS meaning as
  diagnostics while preserving explicit unsupported and uncalculated evidence.
- Cohesive Change Group:
  - `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`
  - `src/test/suite/semanticDiffScheduleRules.test.ts`
  - focused interpreter tests only when a previously unrepresented shared
    interpretation case is required
- Acceptance:
  - rule pairing, bounded-period run dates, missing start-time decisions,
    invalid calendar-day decisions, unsupported token decisions, and zero-run
    candidates remain identical
  - Semantic Diff policy and `SemanticDiffScheduleUnsupportedReason` remain in
    the semantic-diff service and do not move into the interpreter
  - result DTOs, comparison period semantics, ordering, and user-facing report
    behavior remain unchanged
  - `src/application/semantic-diff/compareScheduleDiff.ts` remains compatible;
    no application-facing report or transport shape changes are introduced
- Validation:
  - extend Semantic Diff schedule tests for omitted and explicit rules,
    supported explicit dates, invalid dates, unsupported non-calendar tokens,
    missing/unpaired start times, `sd=0,ud`, invalid explicit rule numbers, and
    unchanged decision ordering
  - add a bounded multi-year/many-parameter regression case and malformed or
    unsupported values to prove candidate generation remains bounded by the
    comparison period and does not create calculated runs from uninterpretable
    values; do not add a flaky timing threshold
  - verify `compareScheduleDiff.ts` and the Semantic Diff report path remain
    unchanged at their application-facing boundary
  - run `rtk pnpm test`, `rtk pnpm run test:web`, `rtk pnpm run build`, and
    `rtk pnpm run qlty`; compare qlty output with the baseline, resolve new
    actionable smells or record an approved follow-up, and treat existing
    metric-only movement as review evidence
- Production Readiness:
  - Failure mode: uninterpretable and non-calculable schedules keep explicit
    existing reason codes; no unsupported value becomes a calculated run
  - JP1/AJS compatibility: preserve rule association and the deliberately
    narrow version-13 explicit-calendar comparison support
  - Large or malformed input risk: do not add scans beyond the existing
    parameter/rule evaluation or expand candidate generation outside the
    bounded comparison period
  - Desktop/web impact: shared Domain results and application-facing Semantic
    Diff outputs remain browser-safe and identical across hosts; both host test
    suites and the production build are required for this shared slice
  - README/docs impact: none expected; supported comparison behavior does not
    change
  - CHANGELOG impact: none because comparison results and supported scope are
    unchanged
- Approval Boundary: approve only Semantic Diff consumption through the
  established Domain contract, its focused regression and bounded-input tests,
  application-boundary compatibility checks, and host/build/qlty validation.
  Unit List projection and removal of the temporary helper contract remain
  unapproved.
- Dependencies: Slice 1
- Risks: restructuring candidate generation could blur unsupported syntax,
  invalid calendar dates, and zero-run cases or change deterministic ordering.
  The migration must consume the established semantic token fields without
  moving comparison reasons or calculation policy into the interpreter.
- Out of Scope: broader schedule calculation, new supported forms, result
  schema or report changes, and start-time helper restructuring.

### Slice 3: Complete Unit List Migration And Retire The Old Contract

- Status: In Progress
- Scope: migrate Unit List schedule-date display projection to the focused
  Domain interpretation; preserve the application-owned `type`, `yearMonth`,
  and `day` projection from semantic Domain fields; remove the temporary
  `parseScheduleDateValue` public contract and its old result type after
  reference verification confirms all three consumers and tests have
  migrated.
- User / Domain Value: Unit List, diagnostics, and Semantic Diff finally share
  one explicit Domain meaning while Unit List retains its presentation-ready
  `type`, `yearMonth`, and `day` projection.
- Cohesive Change Group:
  - `src/application/unit-list/unitListScheduleValueHelpers.ts`
  - `src/domain/models/parameters/scheduleRuleHelpers.ts`
  - focused interpreter module and tests for final public-contract ownership
  - `src/test/suite/buildUnitListView.test.ts`
  - directly affected Unit List helper tests if impact verification identifies
    a narrower owning test file
- Acceptance:
  - Unit List fields for calendar, relative/open/closed day, weekday, `en`,
    `ud`, invalid, and omitted inputs remain byte-for-byte compatible
  - raw normalized parameters and consumer-specific display projection remain
    distinct
  - Unit List does not use raw-value regexes to recover schedule-date token
    categories; display labels and zero-padding remain Application-owned
  - repository reference verification finds no consumer of the retired helper
    contract; other schedule helper exports remain unchanged
  - all three feature consumers use the focused Domain responsibility and all
    feature acceptance criteria pass
- Validation:
  - extend Unit List schedule fixtures for representative supported and
    uninterpretable values, including explicit-rule and raw-evidence cases,
    without changing DTO assertions
  - verify `buildUnitListGroup10View.ts`, `unitListViewHelpers.ts`, and all
    Unit List tests use the focused result only through the approved projection
    boundary
  - run repository reference verification for the retired helper and result
    type, architecture checks, `rtk pnpm test`, `rtk pnpm run test:web`,
    `rtk pnpm run build`, and `rtk pnpm run qlty`; compare qlty output with the
    baseline, resolve new actionable smells or record an approved follow-up,
    and treat metric-only movement as review evidence
- Production Readiness:
  - Failure mode: invalid or missing values retain existing empty display
    fields and never produce a partially interpreted list row
  - JP1/AJS compatibility: preserve raw parameter order, effective rule
    association, and current version-13 display projection
  - Large or malformed input risk: retain constant work per `sd` parameter and
    existing no-partial-list behavior for invalid documents
  - Desktop/web impact: Unit List DTO shape and shared webview consumption stay
    unchanged; complete desktop/web suites provide final host evidence
  - README/docs impact: the durable Unit List use case records the existing
    schedule-date rule and projection scenario; README and user documentation
    remain unchanged
  - CHANGELOG impact: none unless implementation changes externally observable
    behavior, which would require replanning before proceeding
- Approval Boundary: approve Unit List migration, application projection,
  final helper-contract retirement, indirect reference verification, directly
  coupled tests, and feature-wide validation only. The durable use-case update
  is limited to recording existing behavior. No other schedule parameter, DTO,
  UI, parser, or user-documentation change is included.
- Dependencies: Slice 2
- Risks: display-specific day-prefix stripping or year/month formatting could
  drift; retiring the helper before reference verification could break an
  unplanned consumer. The application projection must not become a second
  schedule syntax interpreter.
- Out of Scope: Unit List schema or formatting changes, other helper cleanup,
  presentation edits, parser/generated artifacts, and new behavior.

## Traceability

- TRACEABILITY.md required: yes
- Reason: the feature affects JP1/AJS definition interpretation shared by three
  durable use cases and is split into three implementation slices.

## Cross-Slice Dependencies

- Slice 1 establishes the only new Domain contract and keeps a temporary
  delegating compatibility path for unmodified consumers. Its acceptance
  includes explicit-rule preservation, semantic token classification, and
  parity between the legacy helper projection and the focused interpreter.
- Slice 2 may consume but must not broaden that contract; any missing shared
  meaning is a replanning trigger rather than a Semantic Diff-local extension.
  It must use the established token category for calendar support and retain
  unsupported/calculation policy locally.
- Slice 3 migrates the final consumer and retires the old public helper only
  after repository reference verification confirms no production or test
  reference remains. Its Application projection owns display formatting only.
- Each slice requires separate human approval and one implementation commit;
  approval of an earlier slice does not approve later slices.

## Feature-Level Risks

- A new abstraction could duplicate the existing helper instead of clarifying
  its responsibility.
- Moving parsing and validation together could change which invalid values are
  preserved for diagnostics.
- Consumer migration could alter Unit List display fields, diagnostic
  decisions, or Semantic Diff unsupported reasons.
- Schedule-rule defaults or the `sd=0,ud` exception could be normalized too
  early and lose raw evidence.
- Shared production code must remain browser-safe for desktop and web hosts.
- A three-step migration temporarily exposes two entry points to the same
  implementation; delegation must prevent duplicated syntax or divergent
  behavior.
- The shared result contract could be too weak and force a consumer to recover
  raw syntax, or too broad and leak diagnostic validity, comparison reasons, or
  display labels. Contract tests and architecture review must keep that
  boundary explicit.
- Semantic Diff has existing complexity/smell evidence in the baseline;
  qlty review must distinguish new actionable findings from pre-existing
  metrics and must not introduce unrelated cleanup.
- The selected branch inherits completed characterization and application-use-
  case work; implementation must not reopen or modify those closed feature
  scopes.

## Out of Scope

- Other schedule helper families, parser grammar, generated artifacts,
  application DTOs, presentation formatting, telemetry, infrastructure, and
  user-facing documentation.
- New JP1/AJS behavior, schedule calculation, diagnostic wording, or report
  schema changes.
- Incidental cleanup, unrelated durable-document edits, or architecture-rule
  exceptions.

## Use-Case Back-Propagation

- Update `docs/requirements/use-cases/uc-view-unit-list.md` during planning to
  name `JP1-PARAM-SCHEDULE-START-DATE-001` and record the existing schedule-date
  projection behavior. This passes the Durable Documentation Gate because it is
  a reusable observable contract, not implementation history or review notes.
- No README or CHANGELOG update is planned: the use-case change documents
  existing behavior and the feature does not change externally observable
  extension behavior.
- Re-evaluate during Feature Exit if the final Domain terminology or boundary
  is not already represented by the durable rule documents.

## Feature Exit

- Definition of Done status: not evaluated
- Durable documentation updates: Unit List use-case rule/scenario added during
  Replanning Mode; Feature Exit re-evaluation is required
- Open risks: plan review must confirm the focused interpreter boundary,
  ordered consumer migrations, and temporary compatibility path

## Validation

- [x] Three-slice implementation plan reviewed with `sdd-review-plan`
- [x] Human approval recorded for each implementation boundary
- [ ] Focused and consumer-level schedule behavior remains compatible
- [ ] Desktop and web compatibility validation passes
- [ ] Architecture, build, qlty, and required Markdown checks pass
