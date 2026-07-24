# Feature Tasks: Migrate Semantic Diff And Report Boundaries

## Agent Brief

- Purpose: complete the normalized semantic-diff and application-report
  boundary without changing comparison or report behavior.
- Approved or active slice: all four approved implementation slices are
  complete.
- Do not change comparison results, wording, localization, schedule scope, or
  copy workflow.
- Keep definition evidence distinct from unverified runtime facts.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, and the two source use
  cases.
- Inspect concrete semantic-diff symbols only when confirming slice impact.
- Validate each code slice with its focused suites and
  `rtk pnpm run qlty`.
- Shared contracts and host wiring also require build, desktop, and web
  evidence.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: run Feature Exit Review with `sdd-plan-task`.

## Plan Status

- Status: In Progress
- Planning scope: domain-owned semantic identity and comparison rules,
  application-owned diff/report DTOs and host-neutral errors, and
  presentation-owned Markdown, localization, display, and copy behavior.
- Review status: revised four-slice plan reviewed and ready for approval.
- Replanning reason: the former Slice 3 combined application DTO projection
  with presentation report migration and left domain-entity projection as an
  implementation-time design decision, so its approval boundary was too broad.
- Human approval: all four slices approved.
- Active implementation slice: none; all approved slices are complete.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: all four implementation slices as documented; implementation
  must proceed one slice at a time, beginning with Slice 1, and any boundary or
  behavior change requires replanning and additional approval.

## Implementation Slices

### Slice 1: Establish Domain-Owned Structural Correspondence

- Status: Complete
- Scope:
  - Move jobnet and unit exact identity, stable unit fingerprint construction,
    deterministic exact/fingerprint/candidate matching, relation
    correspondence, and parameter/scalar change meaning out of application
    orchestration into focused domain semantic-diff services or values.
  - Keep `compareSemanticDiff` as the application entry point and map the
    domain decisions into the existing observable change-set shape.
  - Preserve normalization warnings as limitations and preserve deterministic
    ordering, match rationale, added/removed/renamed/moved results, relation
    results, and attribute categories.
- User / Domain Value:
  - The identity and structural meaning used by all semantic-diff consumers has
    one normalized domain owner, so reports and future flow consumers cannot
    silently implement different matching rules.
- Cohesive Change Group:
  - `src/domain/models/semantic-diff/**` and new focused domain
    semantic-diff services or values.
  - Structural portions of
    `src/application/semantic-diff/compareSemanticDiff.ts`.
  - `src/test/suite/compareSemanticDiff.test.ts`,
    `src/test/suite/semanticDiffContracts.test.ts`, and structural fixture
    coverage in `src/test/suite/semanticDiffSampleCoverage.test.ts`.
  - New focused domain-rule coverage in
    `src/test/suite/semanticDiffStructuralRules.test.ts`.
- Acceptance:
  - Jobnet/unit identity, fingerprint fields, candidate ambiguity, relation
    identity, and parameter/scalar comparison rules are owned by domain code.
  - `compareSemanticDiff` remains host-neutral and returns deeply equivalent
    semantic results with deterministic ordering for existing fixtures.
  - Name-only matching remains insufficient, and fingerprint-changing rename
    or move remains removal plus addition.
- Validation:
  - Run `semanticDiffStructuralRules.test.ts` directly against the extracted
    domain correspondence service.
  - Run the focused compare, contract, and sample coverage suites.
  - Run the architecture dependency suite and `rtk pnpm run qlty`.
  - Run `rtk pnpm run build` because shared domain/application imports and
    browser bundles change.
  - Record any new Qlty smell finding caused by the extraction; use metric
    movement only when it identifies a concrete responsibility or repeated-scan
    risk.
- Production Readiness:
  - Failure mode: incorrect matching can hide an addition/removal or invent a
    rename; deterministic ambiguous-candidate and collision fixtures must fail
    visibly.
  - JP1/AJS compatibility: preserve the version 13 identity and compared
    parameter scope already documented by `uc-build-semantic-diff.md`; do not
    add parameter meaning.
  - Large or malformed input risk: preserve parse/normalization failure
    handling and check that the extraction does not add repeated full-tree
    scans or nondeterministic grouping.
  - Desktop/web impact: domain and application code must stay free of Node,
    VS Code, and UI dependencies and compile into both targets.
  - README/docs impact: no README or durable use-case update is expected unless
    implementation reveals an undocumented identity rule.
  - CHANGELOG impact: none expected because this is behavior-preserving internal
    refactoring under the repository CHANGELOG criteria.
- Approval Boundary:
  - Domain semantic-diff structural rules, the application comparator's
    structural delegation/mapping, and the named focused tests only.
  - Any changed match, rationale, attribute category, supported parameter, or
    fixture expectation requires replanning and separate approval.
- Dependencies:
  - Completed parser isolation and normalized domain model.
- Risks:
  - The current comparator combines orchestration and domain decisions in one
    large file; extraction boundaries must follow identity/correspondence
    meaning rather than line count.
  - Fingerprint over-match, under-match, and path collision behavior must remain
    explicit.
- Out of Scope:
  - Confirmation-required rules, schedule comparison, DTO relocation,
    Markdown, localization, host workflow, and new comparison types.

### Slice 2: Establish Domain-Owned Confirmation And Schedule Evidence

- Status: Complete
- Scope:
  - Move start-condition, wait-release, timeout, wait-target, conditional
    relation, unsupported-condition, and supported schedule evaluation meaning
    into focused domain semantic-diff services.
  - Keep application orchestration responsible for assembling confirmation,
    unsupported, limitation, and schedule result data without asserting
    unverified runtime facts.
  - Preserve the existing supported/unsupported/uncalculated schedule boundary,
    comparison-period behavior, and confirmation constraints.
- User / Domain Value:
  - Review warnings and schedule impacts come from one domain interpretation,
    while the report continues to state exactly which runtime or external facts
    were not verified.
- Cohesive Change Group:
  - Domain semantic-diff condition, wait, evidence, and schedule services or
    values.
  - Confirmation portions of
    `src/application/semantic-diff/compareSemanticDiff.ts` and
    `src/application/semantic-diff/compareScheduleDiff.ts`.
  - `src/test/suite/semanticDiffConditions.test.ts`,
    `src/test/suite/semanticDiffSchedule.test.ts`, and evidence coverage in
    `src/test/suite/semanticDiffSampleCoverage.test.ts`.
  - New direct domain-rule coverage in
    `src/test/suite/semanticDiffEvidenceRules.test.ts` and
    `src/test/suite/semanticDiffScheduleRules.test.ts`.
- Acceptance:
  - The domain owns the supported meaning that decides confirmation-required,
    unsupported, uncalculated, and schedule-run results.
  - Application results preserve target, rationale, related elements,
    constraints, comparison periods, and existing deterministic ordering.
  - Definition evidence never becomes a claim about runtime history, external
    events/files, permissions, users, resource contention, or execution
    outcome.
- Validation:
  - Run `semanticDiffEvidenceRules.test.ts` and
    `semanticDiffScheduleRules.test.ts` directly against the extracted domain
    services.
  - Run the focused condition, schedule, and sample coverage suites.
  - Re-run the compare and contract suites to detect cross-rule regressions.
  - Run the architecture dependency suite, `rtk pnpm run qlty`, and
    `rtk pnpm run build`.
  - Record new Qlty smells relevant to rule cohesion or schedule scan cost;
    metrics alone do not authorize more refactoring.
- Production Readiness:
  - Failure mode: a missing confirmation or limitation can make a definition
    review unsafe; unsupported or invalid schedule input must remain explicit
    instead of throwing or guessing.
  - JP1/AJS compatibility: preserve the existing version 13 condition, wait,
    and deliberately narrow schedule scope; new manual interpretation is not
    approved.
  - Large or malformed input risk: retain bounded-period validation and avoid
    new repeated schedule expansion or graph scans for large job groups.
  - Desktop/web impact: the extracted rules must remain pure and browser-safe;
    both bundles must use the same result data.
  - README/docs impact: no README change is expected; update a source use case
    only if an existing durable rule is found to be incomplete.
  - CHANGELOG impact: none expected because no externally observable behavior
    is approved.
- Approval Boundary:
  - Domain condition/wait/schedule rules, application assembly/delegation, and
    the named focused tests.
  - New confirmation wording, schedule support, runtime verification, or
    changed report output requires replanning and approval.
- Dependencies:
  - Slice 1, because condition and schedule evidence must reuse the established
    unit correspondence and normalized semantic-diff domain boundary.
  - Reuse Slice 1's domain-owned unit matches, relation-pair correspondence,
    and parameter value/change helpers instead of recreating structural lookup
    rules in confirmation or schedule services.
- Risks:
  - Current condition and schedule code returns application/report-shaped
    values directly, so domain decisions must be separated without losing
    reasons and analysis constraints.
  - Date/time edge cases and unsupported schedule fields can regress if the
    existing narrow scope is generalized during extraction.
- Out of Scope:
  - New schedule semantics, relation cycles, cyclic waits, terminal
    reachability judgments, runtime evidence adapters, report rendering, and
    copy behavior.

### Slice 3: Establish The Application-Owned Semantic Diff DTO

- Status: Complete
- Scope:
  - Define application-owned comparison inputs/options, semantic changes,
    confirmation items, unsupported/limitation data, schedule result data, and
    report-section DTOs.
  - Project domain decisions into plain report/flow data. Presentation-facing
    DTOs must not contain `AjsDocument`, `AjsUnit`, `AjsRelation`,
    normalization-warning objects, or other domain model references.
  - Carry only the values required by current report and flow consumers:
    comparison scopes; element kinds; stable IDs, paths, names, and unit types;
    relation endpoint IDs/paths and relation type; parameter key/category and
    raw compared values where currently reported; summaries, rationale,
    related targets, and constraints; schedule periods/runs; and limitation or
    parser-error code/message/location data.
  - Remove presentation-facing result ownership from
    `src/domain/models/semantic-diff/SemanticDiff.ts`; retain domain decision
    values needed by the comparison services.
  - Update `compareSemanticDiff`, the current application Markdown renderer,
    and flow-highlight projection to consume the application DTO so the slice
    remains compilable and behavior-preserving before presentation migration.
  - Keep the current `createBuildSemanticDiffReport` language and rendered
    string contract temporarily unchanged; Slice 4 removes that presentation
    responsibility.
- User / Domain Value:
  - Semantic comparison has one explicit application contract that can be
    reused by report and flow consumers without exposing normalized domain
    entities or duplicating comparison rules.
- Cohesive Change Group:
  - New or revised application contracts and mapping under
    `src/application/semantic-diff/**`.
  - Domain semantic-diff result types that are narrowed to domain decisions.
  - `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts`.
  - The current application renderer/localization only where its input changes
    from domain-owned result types to the application DTO.
  - `src/test/suite/semanticDiffContracts.test.ts`,
    `src/test/suite/buildSemanticDiffReport.test.ts`,
    `src/test/suite/semanticDiffFlowHighlights.test.ts`,
    `src/test/suite/renderSemanticDiffMarkdown.test.ts`, and semantic-diff
    fixture regressions affected by DTO mapping.
- Acceptance:
  - Application owns the semantic change-set/report DTO and maps completed
    domain decisions without changing comparison meaning or order.
  - Exported presentation-facing DTO definitions contain no domain entity,
    relation, document, or normalization-warning object references.
  - Report rendering and flow highlights remain deeply equivalent for existing
    fixtures while consuming the application DTO.
  - DTO mapping preserves raw JP1/AJS identifiers and values, confirmation
    rationale/constraints, unsupported and uncalculated reasons, schedule
    periods, and host-neutral parser error details.
- Validation:
  - Add focused DTO mapping and contract coverage that constructs and inspects
    report/flow DTOs without domain objects.
  - Run `semanticDiffContracts`, `buildSemanticDiffReport`,
    `semanticDiffFlowHighlights`, `renderSemanticDiffMarkdown`, and all
    compare/condition/schedule/sample regression suites affected by mapping.
  - Run the architecture dependency suite and a targeted import/reference
    check confirming presentation-facing DTO definitions do not import the
    domain semantic-diff model or normalized AJS model.
  - Run `rtk pnpm run qlty` and `rtk pnpm run build`.
  - Record any new Qlty smell caused by duplicate projection or oversized
    mapping; metrics alone do not authorize generic serialization work.
- Production Readiness:
  - Failure mode: omitted target fields can remove report evidence or flow
    highlights; focused mapping fixtures must cover unit, relation, attribute,
    confirmation, unsupported, limitation, and schedule shapes.
  - JP1/AJS compatibility: projection must preserve current version 13
    identifiers, paths, parameter keys/raw values, relation types, and schedule
    output without adding semantics.
  - Large or malformed input risk: map each result once, preserve parser error
    short-circuiting, and avoid copying complete `AjsDocument`/unit trees into
    the DTO.
  - Desktop/web impact: the DTO and mapper must be host-neutral and
    browser-safe; production build must compile both targets.
  - README/docs impact: none expected because commands, report, and copy
    workflow remain unchanged.
  - CHANGELOG impact: none expected because this is an internal contract
    migration with no externally observable behavior change.
- Approval Boundary:
  - Application semantic-diff DTO definitions/mapping, narrowed domain result
    types, current renderer input adaptation, flow-highlight adaptation, and
    directly affected contract/regression tests.
  - Markdown location, language selection, VS Code command/bootstrap wiring,
    general serialization, new comparison fields, or changed output requires
    Slice 4 or separate replanning.
- Dependencies:
  - Slices 1 and 2, so application DTOs map completed domain decisions rather
    than preserving application-owned comparison rules.
  - Reuse Slice 2's discriminated confirmation, unsupported-schedule, and
    schedule-run decisions; preserve application wording and constraints by
    mapping those decisions instead of reinterpreting domain parameters.
- Risks:
  - Current `SemanticDiffTarget` variants embed normalized domain objects;
    projection must include every scalar needed by both report and flow
    consumers without recreating the complete domain graph.
  - The later `standardize-serialization-and-composition-root` feature still
    owns cross-feature transport standardization; this slice owns only the
    semantic-diff application contract required by this feature.
- Out of Scope:
  - Markdown/localization movement, command/bootstrap changes, public transport
    versioning, generic DTO frameworks, new comparison or schedule types,
    runtime evidence, and telemetry.

### Slice 4: Move Report Rendering And Host Workflow To Presentation

- Status: Complete
- Scope:
  - Replace the application `BuildSemanticDiffReport` string-producing
    contract with `BuildSemanticDiffReportData` /
    `createBuildSemanticDiffReportData`: before/after definition content in,
    either host-neutral parser errors or the Slice 3 report DTO out.
  - Remove display language and Markdown construction from application
    orchestration.
  - Move Markdown rendering and semantic-diff localization mapping from
    `src/application/semantic-diff/**` to a host-neutral semantic-diff
    presentation sub-boundary.
  - Move the semantic-diff-specific localization lookup currently exposed by
    `src/domain/services/i18n/nls.ts` into presentation while reusing existing
    message resources without wording changes.
  - Update the VS Code semantic-diff command and bootstrap composition to build
    report data, render it with the host display language, then display it.
  - Preserve the existing report document provider and explicit copy action,
    including display/copy failure handling.
- User / Domain Value:
  - Desktop and web hosts consume the same application report data while
    Markdown language, VS Code display, and clipboard effects are owned only
    by presentation.
- Cohesive Change Group:
  - `src/application/semantic-diff/buildSemanticDiffReport.ts` and its
    replacement report-data contract.
  - `src/application/semantic-diff/renderSemanticDiffMarkdown.ts` and
    `semanticDiffMarkdownLocalization.ts` moved to a presentation
    semantic-diff module.
  - Semantic-diff-specific localization access in
    `src/domain/services/i18n/nls.ts` and existing message resources only as
    needed to preserve exact wording.
  - `src/presentation/vscode/commands/semanticDiffCommand.ts`,
    `src/presentation/vscode/semantic-diff/semanticDiffReportDocument.ts`,
    `src/bootstrap/extension/semanticDiffWiring.ts`,
    `src/bootstrap/extension/extensionDependencies.ts`, and directly affected
    extension subscription/composition code.
  - Build-report, renderer/localization, command, report-document, bootstrap
    dependency/subscription, package manifest, and extension smoke tests.
- Acceptance:
  - Application comparison/report orchestration imports no renderer,
    localization, VS Code, clipboard, editor, or document implementation.
  - Presentation renders only the Slice 3 application DTO and imports no
    semantic-diff domain model directly.
  - English, Japanese, regional Japanese, and unsupported-language fallback
    Markdown remains identical for existing fixtures; raw identifiers, paths,
    parameter keys, values, and parser messages remain untranslated.
  - Report display still precedes copy, comparison never writes the clipboard,
    and copy uses the displayed Markdown only after the explicit command.
  - Parse/comparison failures remain host-neutral; presentation maps them to
    the existing user-facing message without definition-content leakage.
- Validation:
  - Run `buildSemanticDiffReport`, `renderSemanticDiffMarkdown`, `nls`,
    `semanticDiffCommand`, `semanticDiffReportDocument`,
    `extensionDependencies`, `extensionSubscriptions`, `packageManifest`, and
    extension smoke suites.
  - Re-run semantic-diff sample/report regressions to verify exact Markdown and
    evidence preservation across the new boundary.
  - Run the architecture dependency suite and verify semantic-diff presentation
    has no direct domain dependency and application has no presentation or host
    dependency.
  - Run `rtk pnpm run qlty`, `rtk pnpm run build`, the desktop test suite, and
    `rtk pnpm run test:web`.
  - Record any new Qlty smell caused by renderer movement or host composition;
    metric movement matters only when it exposes duplicated rendering or an
    oversized host responsibility.
- Production Readiness:
  - Failure mode: parse/comparison failures must remain understandable without
    leaking definition content; display/copy failures must not discard or
    mutate the semantic result or displayed Markdown.
  - JP1/AJS compatibility: rendering movement must not change comparison scope,
    identifiers, raw values, report sections, evidence wording, or schedule
    periods.
  - Large or malformed input risk: preserve parser short-circuiting and render
    the Slice 3 DTO without reparsing or recomparing definitions.
  - Desktop/web impact: use only APIs available under VS Code `^1.75.0`; keep
    the presentation renderer browser-safe and verify both extension targets.
  - README/docs impact: no README change is expected because commands and
    workflow remain unchanged; source use cases need updates only if a durable
    boundary statement changes.
  - CHANGELOG impact: none expected under the repository criteria because
    behavior, commands, diagnostics, and workflow are preserved.
- Approval Boundary:
  - Report-data application use case, presentation Markdown/localization,
    semantic-diff VS Code command/report adapters, bootstrap composition, and
    directly affected tests.
  - Report design, wording, localization additions, command/menu changes,
    clipboard automation, telemetry, configuration, or minimum VS Code changes
    require replanning and separate approval.
- Dependencies:
  - Slice 3, because presentation must render the application-owned scalar DTO
    rather than domain entities.
  - Reuse `semanticDiffDto.ts` directly: the current renderer and localization
    already consume this scalar contract, so Slice 4 must move presentation
    ownership without adding another report-specific projection.
- Risks:
  - Moving language selection can alter fallback wording or accidentally
    translate raw JP1/AJS data.
  - Renaming the report-data use case affects constructor and bootstrap seams;
    all direct references must move together within this slice.
- Out of Scope:
  - New report sections/design, new languages, command/menu changes, new
    comparison or schedule types, runtime evidence, telemetry, general i18n
    consolidation, and composition-root work outside semantic diff.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: the feature spans two user-visible use cases, four independently
  approved code slices, JP1/AJS semantic interpretation, localized report
  output, and desktop/web host behavior.

## Cross-Slice Dependencies

- Slice 1 establishes normalized structural correspondence before any
  condition, wait, or schedule rule is moved.
- Slice 2 reuses Slice 1 correspondence and completes domain semantic evidence
  before application/result ownership changes.
- Slice 3 maps completed domain decisions into an application-owned scalar DTO
  and adapts current consumers without moving host workflow.
- Slice 4 moves rendering/localization and host composition only after the
  application contract is independently validated.
- If an earlier slice reveals that current observable results cannot be
  preserved without a new domain decision or DTO field, stop and use
  Replanning Mode before continuing.

## Feature-Level Risks

- Identity/fingerprint behavior, schedule scope, confirmation constraints,
  Japanese wording, fallback language, report ordering, and copy timing are
  regression-sensitive and are not approved to change.
- The domain/application ownership wording requires two representations where
  necessary: domain comparison decisions and application-facing result DTOs.
  Do not use the DTO relocation to create a generic mapping framework.
- Presentation-facing application DTOs must not embed `AjsDocument`, `AjsUnit`,
  `AjsRelation`, normalization-warning objects, or other domain model
  references; they carry only current report/flow scalar evidence.
- Existing semantic-diff results are also consumed by flow highlighting; that
  consumer must not be omitted when application DTO ownership changes.
- No infrastructure adapter is justified because runtime evidence remains
  explicitly out of scope.
- The implementation branch must remain compatible with VS Code `^1.75.0` and
  both desktop and web extension builds.

## Use-Case Back-Propagation

- `uc-build-semantic-diff.md` already owns the durable identity,
  confirmation, schedule, evidence, and host-neutral data rules; update it only
  if implementation exposes an undocumented durable rule.
- `uc-present-semantic-diff-report.md` already owns localization, display,
  fallback, and explicit-copy behavior; update it only if its durable boundary
  statement is incomplete.
- README and CHANGELOG changes are not planned because no user-visible behavior
  change is approved.
- `docs/specs/plans.md` records this feature as active planning work.
- `docs/specs/roadmap.md` needs no update because the existing migration order
  and remaining debt are unchanged.
