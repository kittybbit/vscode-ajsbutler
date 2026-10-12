# Feature Tasks: Semantic Diff Schedule Simulation Removal

## Agent Brief

- Purpose: remove execution-date simulation and specialize Semantic Diff in
  definition-change review, with consequential responsibility cleanup.
- Active or approved slice: S1 and S2 are Human Approved; begin S1 after
  the focused planning commit. S2 waits for S1 completion approval and commit.
- Read first: `SPECS.md`, this plan, `TRACEABILITY.md` and discovery references.
- Validate: selected-feature docs now; per-slice host, boundary, quality and
  compatibility coverage below during implementation.
- Constraints: preserve schedule definition comparison, list/diagnostics,
  captured sources, Flow and privacy. Edit only the selected slice's exact
  paths. New boundaries or abstractions return to Main for Replanning.

## Current state and gate

- Lifecycle state: PLAN_APPROVED.
- Next operation: focused planning commit, then S1 implementation.
- Selection: `semantic-diff-schedule-simulation-removal`.
- Branch/base: `codex/semantic-diff-schedule-simulation-removal` / `origin/main`.
- Fixed base and planning HEAD: `0090b728977d55d4127bdad149f74f598f0b2fd5`.
- Slice states: S1 and S2 are PLAN_APPROVED; no completed slices.
- Plan review: Ready for approval; no Findings. Reviewed plan identity:
  `d4f41dc4d222a702225db6ac5749486c1bf5f6546579d176c649a91573da8f20`.
  Independent reviewer: `schedule_removal_plan_review` in current conversation.
- Planning commit: none.
- Human Approval:
  - Status: Approved
  - Approved at: approved in current conversation, 2026-10-12
  - Approved scope: reviewed S1 and S2 plan, including JSON schemaVersion 2,
    removal of related roadmap/use cases and consequential responsibility cleanup.
  - Approved paths: exact deletion/modification lists under S1 and S2 below,
    plus this selected feature's SPECS.md, TASKS.md and TRACEABILITY.md.
  - Approval provenance: human response to Main's reviewed S1/S2 approval request
    in current conversation; review identity above. Completion/Closure are excluded.
- Completion and Closure Approval: none.

Apply [lifecycle](../../README.md#lifecycle-and-approval-gates) and
[approval](../../README.md#human-approval). Intent to remove the feature is not
implementation-slice approval. Main records the exact reviewed plan identity
and approved S1/S2 boundaries before the planning commit. Each dependent slice
starts only after the preceding slice's independent Ready, explicit Completion
Approval and focused completion commit. Feature Exit and Closure remain separate.

## Discovery and decisions

- Reuse intake evidence:
  `/tmp/ajsbutler-semantic-diff-simulation-removal-intake/evidence.json`,
  identity `d9b82013e3d2df1b107529392aa22eec95d95a2aae817d76b6f4f6a0ff2db392`.
- Planning additions and exact inventories:
  `/tmp/ajsbutler-semantic-diff-simulation-removal-plan/evidence.json` and
  `/tmp/ajsbutler-semantic-diff-simulation-removal-plan/inventory.json`.
  These identify inspected source/config/doc inputs and targeted reference
  coverage, not implementation validation or a review verdict.
- `semanticDiffStructuralRules.ts` owns the independent `schedule` attribute
  category (`sd`, `st`, `cy`, `sh`, `shd`, `jc`, `ln`, `cftd`); retain it.
- Only `ScheduleDate.ts` and `ScheduleRule.ts` have retained schedule-package
  consumers: list projection and schedule diagnostics. Preserve interpretation
  and applicable date validation; remove exclusively predictive helpers from
  `ScheduleDate.ts`, including UTC projection/date serialization helpers when
  their only callers are deleted. No date/rule file relocation is needed.
- JSON is explicitly versioned at 1; its existing contract requires a new
  version on member removal. S2 emits schemaVersion 2 and removes simulation
  members, retaining schema ID/media type and deterministic locale-neutral
  ordering of surviving facts. No v1 serializer or null compatibility shell.
- No comparison-specific telemetry collection was found. Retain cataloged
  viewer/host event meanings and allowlists; add no telemetry or Node imports.
- No simulation-only external fixture or helper file was found under
  `src/test/fixtures` or `src/test/support`; dedicated suites contain their
  support inline. Retain schedule definition samples used by parser, list,
  diagnostics and WebAPI import, including generated WebAPI fixture references.
- `webpack.web-test.config.js` inherits the production editor configuration;
  remove the entry in `webpack.config.js`. The test runner discovers test files
  by glob; no package-script, dependency, lockfile or test-runner edit is needed.
  Clean builds remove ignored emitted `out/scheduleImpactCalendar.js`; never
  commit generated bundles or change the grammar/generated parser.
- Two slices are deliberately sequential. S1 independently removes the costly
  calendar interaction/lifecycle and asset while retaining comparison/report
  behavior. S2 changes all period/computation/output contracts together so no
  intermediate type, message or schema mismatch is committed. Temporary
  application schedule artifacts remaining after S1 are removed in S2; no
  new compatibility wrapper or prediction replacement is introduced.

## Solution Shape

- Domain retains normalized definitions, identity/structural/evidence rules and
  reusable schedule parameter meaning. Delete execution projection, operational
  calendar resolution, substitution and run-comparison owners entirely.
- Application `compareSemanticDiff` becomes the sole comparison result boundary;
  remove `compareSemanticDiffInternal`'s artifact-returning split and
  `compareSemanticDiffWithArtifacts`. Retain `CompareSemanticDiffOptions` only
  for existing non-simulation scope choices; no period option remains.
- Retain `createBuildSemanticDiffReportData`: this factory earns its boundary
  through injected host-neutral parser capability, both-side error normalization
  and one parse per source. Commands use its scoped-parser argument with the
  existing source-capture transaction. Delete the parallel presentation-artifact
  factory, instead of wrapping the same request/result again.
- `buildSemanticDiffOutputContext` earns its boundary by canonical summary and
  immutable snapshot ownership. Build it once for the Explorer context and reuse
  it for Summary/Full/Audit/JSON; no comparison or aggregation rerun on Output.
- Application Explorer projections and message guards own serializable DTOs,
  stable action membership and trust-boundary validation. Remove simulation
  leaves/cards/reasons/details and retain strict retained-action validation.
- Presentation commands own source selection, host failures/cancellation and
  source-capture lifecycle. Consolidate schedule-aware and legacy calendar
  execution branches into the existing file/Git source workflow and ordinary
  Explorer opener; retain useful report-only dependency-injected fallback.
  Simplify helper chains in the enumerated command files where removal makes
  them pass-through; do not introduce a new orchestration abstraction or module.
- Bootstrap owns composition and subscriptions, including source registry,
  report provider and Flow lifecycle. Delete sidecar/child calendar registries
  and `createScheduleAwareExplorerSession`; ordinary Explorer disposal retains
  source/Git reservation and Flow cleanup exactly once on success or failure.
- Presentation report serializers own localization, formatting, escaping and
  versioned JSON translation. Domain and application do not own human wording.
  Explorer components retain definition evidence and accessible source/Flow/
  Output interactions. Shared result primitives still used by Explorer remain;
  delete only the now-exclusive date-range formatter and its dedicated case.
- Existing VS Code panels, React/MUI and JSON capabilities suffice; no custom
  replacement, framework, service container or architecture exception is needed.
- Architecture dependency tests supply mechanical catalog facts. Semantic
  ownership, wrapper value and simplicity above require independent judgment;
  passing the dependency test cannot alone validate this Solution Shape.

## Common implementation validation and evidence

Both slices change bootstrap/shared host contracts; use the following required
set on each final slice, even though S1 has no parser change:

1. `rtk pnpm run test:full` (preparation, complete desktop suite, browser suite).
2. `rtk pnpm run test:desktop:min` (the existing smoke bundle on VS Code 1.75.0).
3. `rtk pnpm run build` (clean production desktop/web/editor bundles).
4. Targeted Markdown lint on every changed surviving Markdown file, local
   links/anchors and structure; `rtk git diff --check`.
5. Required full-repository qlty baseline/final check and smells observations
   and final aggregate under the Quality Contract and Execution Procedure.
   Commands: `rtk pnpm exec qlty check --all --sarif --no-fix` and
   `rtk pnpm exec qlty smells --all --sarif --no-snippets` in exact disposable
   baseline and final snapshots; `rtk pnpm run qlty` in final only.

`test:full` includes the zero-exception architecture catalog, parser/list/CSV,
condition/report/source/Flow/telemetry boundaries and shared UI suites; record
its architecture results separately from semantic ownership judgment. Inspect
both production host bundles and the cleaned editor asset inventory. Record
`engines.vscode` before/after (`^1.75.0`), relevant Node-import scan and any
unresolved case. No higher API or host-dependent prediction may be introduced.

Before editing each slice, the implementer owns one exact baseline identity,
then final content identity including ignored generated inputs used by checks,
base/rename/deletion/untracked inventory, approved path set, commands/versions,
config/dependency hashes and raw logs. Qlty >=0.645.0 must use matching full-repo
selection/config/tool version, nonzero analyzed inventories, four complete
SARIF 2.1.0 artifacts and final aggregate. New/adverse mapped findings are NG;
unchanged unrelated findings stay outside scope. Do not build a custom SARIF
parser/comparator. Mixed durable behavior docs below use the broader durable
validation tier; these per-slice qlty snapshots cover that surface too.

Unavailable or failed required host/check evidence blocks Ready. Existing
matching evidence is reused across review/approval/commit. Record exceptions
and refresh only inputs/coverage affected by change; no planning code baseline
is required. Each slice receives an independent implementation review plus
second independent review for shared contract/bootstrap/host risk, reusing the
same evidence. Current-head CI and Qlty Cloud remain Feature Exit gates.

## S1: Remove calendar interaction, child lifecycle and bundle

- Value: Explorer becomes simpler immediately; Schedule impact and all child
  calendar UI/assets cease to ship.
- Dependencies: independently Ready reviewed plan, explicit S1 Human Approval,
  focused planning commit. No S2 dependency.
- Scope: delete the exact paths below, remove calendar action availability and
  dispatch from panel/webview host state, wire ordinary Explorer directly and
  preserve file/Git workflow with its current optional simulation/report path.
  Existing application computation/artifact contracts remain until S2.
- Durable gate: the deleted use case/index entry is obsolete capability; removal
  is reusable current product knowledge and not duplicated branch history.
  Add an Unreleased CHANGELOG removal entry; keep released historical records.
  Remove selected SPECS' local link to the deleted UC in the same slice.
- Acceptance: no Schedule impact button, child session, sidecar registry,
  calendar message handling, renderer/localization, entry or emitted bundle.
  Source/Flow/Output, strict message membership, read-only context, both source
  choices, cancellation and cleanup still work. Simulation facts currently
  supplied to ordinary report/Explorer remain valid until S2.
- Boundary tests: remove only exclusive listed calendar tests; adapt command
  integration and web smoke calendar scenarios to ordinary Explorer. Preserve
  source-capture/Git failure rollback, context registration, panel disposal,
  keyboard/filter/Output and malformed/stale action checks. Architecture
  ownership tests stop requiring retired modules/entry without weakening the
  complete dependency catalog.
- Validation: common required set; clean editor bundle inventory confirms
  absence of scheduleImpactCalendar entry/output; targeted search confirms no
  imports of deleted calendar/registry files. Inspect removed UC links.
- Risks/readiness: retained application artifact production is temporary,
  explicitly removed by S2; do not leave unregistered-source leaks when changing
  opener paths. No retained report or comparison contract changes in S1.
- Approval boundary: deletion/modification sets below plus the three selected
  feature docs for traceability, evidence and gate metadata. No other paths.

### S1 exact deletion paths

- `docs/requirements/use-cases/uc-present-schedule-impact.md`
- `src/bootstrap/extension/createScheduleAwareExplorerSession.ts`
- `src/bootstrap/extension/scheduleImpactSidecarRegistry.ts`
- `src/presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarJson.ts`
- `src/presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarPanel.ts`
- `src/presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarPanelRuntime.ts`
- `src/presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarSessionRegistry.ts`
- `src/presentation/vscode/semantic-diff/calendar/scheduleImpactCalendarTransport.ts`
- `src/presentation/webview/editor/scheduleImpactCalendar.tsx`
- `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarApp.tsx`
- `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarBoundedList.tsx`
- `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarCandidates.tsx`
- `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarContents.tsx`
- `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarFilters.tsx`
- `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarHeader.tsx`
- `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarIssues.tsx`
- `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarLegend.tsx`
- `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarResultSection.tsx`
- `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarRootSections.tsx`
- `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarTimeline.tsx`
- `src/presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarTimelineHelpers.tsx`
- `src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarAccessibility.ts`
- `src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarBridge.ts`
- `src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarFocus.ts`
- `src/presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarModel.ts`
- `src/resource/i18n/scheduleImpactCalendar.ts`
- `src/resource/i18n/scheduleImpactCalendar_en.ts`
- `src/resource/i18n/scheduleImpactCalendar_ja.ts`
- `src/test/suite/createScheduleAwareExplorerSession.test.ts`
- `src/test/suite/scheduleImpactCalendarAccessibility.test.tsx`
- `src/test/suite/scheduleImpactCalendarBoundedList.test.tsx`
- `src/test/suite/scheduleImpactCalendarBridge.test.ts`
- `src/test/suite/scheduleImpactCalendarComponents.test.tsx`
- `src/test/suite/scheduleImpactCalendarLocalization.test.ts`
- `src/test/suite/scheduleImpactCalendarPanelRuntime.test.ts`
- `src/test/suite/scheduleImpactCalendarProjection.test.ts`
- `src/test/suite/scheduleImpactCalendarSession.test.ts`
- `src/test/suite/scheduleImpactCalendarThemeContext.test.tsx`
- `src/test/suite/scheduleImpactCalendarTransport.test.ts`
- `src/test/suite/scheduleImpactCalendarView.test.tsx`
- `src/test/suite/scheduleImpactSidecarRegistry.test.ts`
- `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`

### S1 exact modification paths

- `CHANGELOG.md`
- `docs/requirements/use-cases/README.md`
- `src/bootstrap/extension/semanticDiffWiring.ts`
- `src/presentation/vscode/commands/semanticDiffCommand.ts`
- `src/presentation/vscode/commands/semanticDiffCommandExplorerWorkflow.ts`
- `src/presentation/vscode/commands/semanticDiffCommandWorkflowArtifacts.ts`
- `src/presentation/vscode/commands/semanticDiffCommandWorkflowExecution.ts`
- `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanel.ts`
- `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelActions.ts`
- `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelHtml.ts`
- `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelInstall.ts`
- `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelLifecycle.ts`
- `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelRequests.ts`
- `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelTypes.ts`
- `src/presentation/vscode/semantic-diff/panel/semanticDiffExplorerRegistry.ts`
- `src/presentation/webview/editor/semanticDiffExplorer/Header.tsx`
- `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerApp.tsx`
- `src/presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerContents.tsx`
- `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerHostMessageState.ts`
- `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerHostState.ts`
- `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerView.tsx`
- `src/test/suite/architectureSemanticDiffOwnership.test.ts`
- `src/test/suite/semanticDiffCommand.test.ts`
- `src/test/suite/semanticDiffCommandScheduleImpact.test.ts`
- `src/test/suite/semanticDiffExplorerComponents.test.tsx`
- `src/test/suite/semanticDiffExplorerDom.test.tsx`
- `src/test/suite/semanticDiffExplorerPanel.test.ts`
- `src/test/suite/semanticDiffWiring.test.ts`
- `src/test/suite/webSmoke.ts`
- `webpack.config.js`

## S2: Remove prediction and simplify definition review end to end

- Value: comparison has no period prompt, execution prediction or simulation
  status. Definition-review facts own all Explorer/report/JSON surfaces.
- Dependencies: S1 is independently Ready, Completion Approved and committed;
  explicit S2 Human Approval under this reviewed/committed plan.
- Scope: delete the predictive domain/application pipeline, period parsing and
  parallel artifacts factory; simplify comparison, DTOs, canonical summary,
  Explorer guards/projections, command source workflow, composition and outputs
  together. Change schemaVersion 1 to 2; rename V1 public serializer/DTO names to
  V2 in their existing files. No backward-compatible empty schedule fields.
- Remove `scheduleComparison`, run types/counts, period/detail-period and
  simulation-only detail `scheduleRule`, comparison-period constraint,
  no/lost-calculated-run confirmation reasons, simulation unsupported reasons,
  uncalculated-only status/kind/count/formatting paths and schedule-run leaf/card.
  Retain definition `schedule` attribute category and raw attribute values,
  normalization/uninterpretable warnings, external/runtime-state limitations,
  candidate/identity evidence, relation and wait review.
- Source workflow: use scoped `BuildSemanticDiffReportData`, bind the captured
  parsed sources to the same immutable output context, register and open the
  ordinary Explorer; release transaction/reservation exactly once on cancel,
  parse/build/bind/register/open failure or session disposal. No source reread
  for Output or extra comparison to produce artifacts.
- Durable gate: update mixed compare/build/report contracts and parameter rules
  at their smallest affected clauses; delete prediction-only UD/month-end/
  weekday/relative/open-closed/shift calculation promises while preserving list
  formatting, diagnostics, WC/WT and interpretation facts with retained
  consumers. Remove the entire Deferred Schedule Semantics roadmap subsection
  and empty Semantic Diff Roadmap heading. Do this in S2, before closure.
  CHANGELOG describes removed period/simulation and schema 2 breaking output.
  README has no simulation instructions at this base and needs no edit;
  architecture policy already describes correct general owners and needs none.
- Acceptance: file and Git HEAD comparison proceed directly to definition review
  without date input; schedule attributes still compare without period.
  Unchanged/empty comparisons, identities/candidates, relations, waits,
  environment confirmation and raw evidence behave as before. Summary/Full/
  Audit/JSON use one context, omit all simulation sections/fields, preserve
  locale-neutral deterministic JSON, escaping, English fallback, Japanese
  wording, explicit copy/save and cancellation. No predictive source or tests
  remain; no replacement operational safety claim is made.
- Boundary coverage: add/update meaningful schedule-definition change cases,
  no-period command file/Git paths, both-side parse errors and cancellation;
  schema 2 field absence and deterministic retained facts across host/language/
  ordering; Explorer retired message rejection and retained valid/invalid
  transport; source/Flow/Output context reuse; list schedule display and malformed
  sd/rule diagnostics; privacy and existing error/fallback semantics.
- Tests: physically delete exclusive prediction suites and inline support.
  Migrate useful parser/source-capture/error/immutability assertions from the
  deleted artifacts adapter suites to existing report-data/command tests before
  deleting; retained mixed suites lose only prediction cases. Preserve sample
  AJS files and generated WebAPI fixtures. Repurpose the mixed command schedule
  impact suite to period-free comparison/lifecycle assertions; it may be deleted
  only after its retained assertions are covered in semanticDiffCommand.test.ts.
- Validation: common set plus search inventory for retired imports/symbols,
  report/JSON members and simulation promises. Classify retained schedule
  definition or unrelated scheduling references explicitly instead of banning
  the word schedule. Verify source/bundle/test inventories and broken UC links.
- Risks/readiness: JSON consumers must migrate to v2; intentional removal is
  explicitly approved and announced. Shared Date/Rule interpretation and
  malformed-input diagnostics are regression boundaries. Active cleanup stays
  within existing layers and enumerated files; a new owner/port/file or
  additional dependency/config change returns to Main before editing.
- Approval boundary: exact sets below plus selected feature docs. No grammar,
  generated parser, package scripts, dependencies, telemetry catalog, architecture
  exceptions, inherited WebAPI feature docs or unrelated UI modernization.

### S2 exact deletion paths

- `src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts`
- `src/application/semantic-diff/compareScheduleDiff.ts`
- `src/application/semantic-diff/compareSemanticDiffWithArtifacts.ts`
- `src/application/semantic-diff/parseSemanticDiffComparisonPeriod.ts`
- `src/application/semantic-diff/semanticDiffScheduleImpact.ts`
- `src/application/semantic-diff/semanticDiffScheduleImpactDto.ts`
- `src/application/semantic-diff/semanticDiffScheduleImpactIdentity.ts`
- `src/application/semantic-diff/semanticDiffScheduleImpactTimeline.ts`
- `src/application/semantic-diff/semanticDiffScheduleIssueProjection.ts`
- `src/application/semantic-diff/semanticDiffScheduleProjectionFacts.ts`
- `src/application/semantic-diff/semanticDiffScheduleRunProjection.ts`
- `src/domain/schedule/ScheduleCalendar.ts`
- `src/domain/schedule/ScheduleCalendarEntries.ts`
- `src/domain/schedule/ScheduleCalendarIndex.ts`
- `src/domain/schedule/ScheduleCandidateResolver.ts`
- `src/domain/schedule/ScheduleInterpretation.ts`
- `src/domain/schedule/ScheduleOperationalCalendar.ts`
- `src/domain/schedule/ScheduleOperationalCandidates.ts`
- `src/domain/schedule/SchedulePeriod.ts`
- `src/domain/schedule/ScheduleProjection.ts`
- `src/domain/schedule/ScheduleProjectionOutcomes.ts`
- `src/domain/schedule/ScheduleProjectionRules.ts`
- `src/domain/schedule/ScheduleSubstitutionAnalysis.ts`
- `src/domain/schedule/ScheduleSubstitutionResolution.ts`
- `src/domain/services/semantic-diff/semanticDiffScheduleComparison.ts`
- `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`
- `src/presentation/vscode/commands/semanticDiffCommandWorkflowPeriod.ts`
- `src/presentation/webview/editor/shared/result/formatLocalizedDateRange.ts`
- `src/test/suite/SchedulePeriod.test.ts`
- `src/test/suite/ScheduleProjectionUnits.test.ts`
- `src/test/suite/buildSemanticDiffPresentationArtifactsAdapter.test.ts`
- `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`
- `src/test/suite/parseSemanticDiffComparisonPeriod.test.ts`
- `src/test/suite/semanticDiffPresentationArtifacts.test.ts`
- `src/test/suite/semanticDiffSchedule.test.ts`
- `src/test/suite/semanticDiffScheduleCalendar.test.ts`
- `src/test/suite/semanticDiffScheduleImpact.test.ts`
- `src/test/suite/semanticDiffScheduleRules.test.ts`

### S2 exact modification paths

- `CHANGELOG.md`
- `docs/requirements/domain-rules/interpret-jp1-parameters.md`
- `docs/requirements/use-cases/uc-build-semantic-diff.md`
- `docs/requirements/use-cases/uc-compare-ajs-definitions.md`
- `docs/requirements/use-cases/uc-present-semantic-diff-report.md`
- `docs/specs/roadmap.md`
- `src/application/semantic-diff/buildSemanticDiffOutputContext.ts`
- `src/application/semantic-diff/buildSemanticDiffReportData.ts`
- `src/application/semantic-diff/buildSemanticDiffSummary.ts`
- `src/application/semantic-diff/compareSemanticDiff.ts`
- `src/application/semantic-diff/semanticDiffDto.ts`
- `src/application/semantic-diff/semanticDiffExplorerDto.ts`
- `src/application/semantic-diff/semanticDiffExplorerLeafGuards.ts`
- `src/application/semantic-diff/semanticDiffExplorerProjection.ts`
- `src/application/semantic-diff/semanticDiffExplorerProjectionLeaves.ts`
- `src/application/semantic-diff/semanticDiffExplorerProjectionPaths.ts`
- `src/application/semantic-diff/semanticDiffExplorerProjectionSupport.ts`
- `src/application/semantic-diff/semanticDiffExplorerRecordGuards.ts`
- `src/application/semantic-diff/semanticDiffExplorerViewGuards.ts`
- `src/application/semantic-diff/semanticDiffStructuredFacts.ts`
- `src/bootstrap/extension/extensionDependencies.ts`
- `src/bootstrap/extension/semanticDiffWiring.ts`
- `src/domain/models/semantic-diff/SemanticDiff.ts`
- `src/domain/schedule/ScheduleDate.ts`
- `src/presentation/semantic-diff/report/renderSemanticDiffAuditMarkdown.ts`
- `src/presentation/semantic-diff/report/renderSemanticDiffMarkdown.ts`
- `src/presentation/semantic-diff/report/renderSemanticDiffSummaryMarkdown.ts`
- `src/presentation/semantic-diff/report/semanticDiffJson.ts`
- `src/presentation/semantic-diff/report/semanticDiffJsonOrdering.ts`
- `src/presentation/semantic-diff/report/semanticDiffJsonProjection.ts`
- `src/presentation/semantic-diff/report/semanticDiffMarkdownLocalization.ts`
- `src/presentation/semantic-diff/report/serializeSemanticDiffJson.ts`
- `src/presentation/vscode/commands/semanticDiffCommand.ts`
- `src/presentation/vscode/commands/semanticDiffCommandBuild.ts`
- `src/presentation/vscode/commands/semanticDiffCommandEditor.ts`
- `src/presentation/vscode/commands/semanticDiffCommandExplorerWorkflow.ts`
- `src/presentation/vscode/commands/semanticDiffCommandLocalization.ts`
- `src/presentation/vscode/commands/semanticDiffCommandReading.ts`
- `src/presentation/vscode/commands/semanticDiffCommandSelection.ts`
- `src/presentation/vscode/commands/semanticDiffCommandSourceBinding.ts`
- `src/presentation/vscode/commands/semanticDiffCommandSteps.ts`
- `src/presentation/vscode/commands/semanticDiffCommandWorkflowArtifacts.ts`
- `src/presentation/vscode/commands/semanticDiffCommandWorkflowExecution.ts`
- `src/presentation/vscode/commands/semanticDiffCommandWorkflowInput.ts`
- `src/presentation/vscode/commands/semanticDiffCommandWorkflowSelection.ts`
- `src/presentation/vscode/commands/semanticDiffCommandWorkflowSource.ts`
- `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerDetails.ts`
- `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerLocalization.ts`
- `src/presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerTree.tsx`
- `src/resource/i18n/message_en.ts`
- `src/resource/i18n/message_ja.ts`
- `src/test/suite/AjsReadonlyContracts.test.ts`
- `src/test/suite/architectureSemanticDiffOwnership.test.ts`
- `src/test/suite/buildSemanticDiffReportData.test.ts`
- `src/test/suite/buildSyntaxDiagnostics.test.ts`
- `src/test/suite/buildUnitList.test.ts`
- `src/test/suite/compareSemanticDiff.test.ts`
- `src/test/suite/evaluateScheduleDiagnosticViolations.test.ts`
- `src/test/suite/renderSemanticDiffMarkdown.test.ts`
- `src/test/suite/scheduleRuleHelpers.test.ts`
- `src/test/suite/semanticDiffCommand.test.ts`
- `src/test/suite/semanticDiffCommandScheduleImpact.test.ts`
- `src/test/suite/semanticDiffConditions.test.ts`
- `src/test/suite/semanticDiffContracts.test.ts`
- `src/test/suite/semanticDiffExplorerComponents.test.tsx`
- `src/test/suite/semanticDiffExplorerDom.test.tsx`
- `src/test/suite/semanticDiffExplorerMessages.test.ts`
- `src/test/suite/semanticDiffExplorerPanel.test.ts`
- `src/test/suite/semanticDiffExplorerProjection.test.ts`
- `src/test/suite/semanticDiffJson.test.ts`
- `src/test/suite/semanticDiffMarkdownProjections.test.ts`
- `src/test/suite/semanticDiffOutput.test.ts`
- `src/test/suite/semanticDiffSampleCoverage.test.ts`
- `src/test/suite/semanticDiffWiring.test.ts`
- `src/test/suite/sharedResultPresentation.test.tsx`
- `src/test/suite/webSmoke.ts`

## Planning validation index

- Identity/result and raw logs:
  `/tmp/ajsbutler-semantic-diff-simulation-removal-plan/evidence.json`.
- Required documentation coverage: these three selected-feature Markdown docs;
  lint, local links/anchors, headings/structure, path inventory existence,
  requirement-to-slice coverage, fixed branch/base and Pending approval facts.
- Substantive manifest covers the final plan; gate/evidence annotations are a
  separately inspected metadata patch under evidence freshness policy.
- Intake discovery is reused for unchanged facts. Changed plan docs require
  fresh targeted documentation validation only; no code/qlty pass is claimed.
- Review: `schedule_removal_plan_review` returned Ready for approval with no
  Findings for the substantive manifest above. Main recorded only gate metadata;
  Human Approval is recorded above; planning commit remains pending.
- Follow-up: record per-slice evidence/review/completion gates here during work;
  Feature Exit consumes committed slices and current-head global gates before
  closure approval/removal of the selected feature folder.
