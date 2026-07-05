# Feature Tasks: Semantic Diff

## Plan Status

- Status: In Progress
- Planning scope: initial full implementation-slice plan for JP1/AJS3
  semantic diff.
- Review status: Reviewed
- Human approval: Approved
- Active implementation slice: Slice 4, VS Code Command And Report Export
  Surface

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: all remaining semantic-diff implementation slices; active
  implementation is limited to Slice 4, VS Code Command And Report Export
  Surface

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Implementation Slices

### Slice 1: Comparison Contracts And Normalized Input Scope

- Status: Complete
- Smallest Useful Slice: defines one architecture responsibility: stable
  semantic-diff domain/application DTO contracts and input boundaries without
  user-facing command behavior.
- Scope: add repository-owned comparison types for definition inputs, identity
  keys, semantic changes, attribute categories, confirmation levels,
  unsupported items, report sections, and parse/normalization limitations;
  expose a host-neutral application entry point shape that accepts already
  normalized documents.
- User / Domain Value: creates a reviewable contract for every later slice so
  parser internals, VS Code APIs, React, XyFlow, and report persistence stay
  outside comparison rules.
- Cohesive Change Group:
  - likely files: new `src/domain/models/semantic-diff/*` and
    `src/application/semantic-diff/*`
  - likely tests: new `src/test/suite/semanticDiffContracts.test.ts`
  - related existing files:
    `src/domain/models/ajs/AjsDocument.ts`,
    `src/application/parsing/AjsParserPort.ts`,
    `src/test/suite/architectureDependencyRules.test.ts`
- Acceptance:
  - comparison DTOs can represent jobnet, unit, relation, attribute,
    confirmation-required, unsupported, and report-ready result categories
  - contracts reference `AjsDocument`, `AjsUnit`, and `AjsRelation` rather
    than raw parser `Unit` or VS Code types
  - comparison result can preserve parser/normalization limitations without
    treating them as semantic changes
- Validation:
  - contract/unit tests for DTO shape and host-neutral construction
  - architecture dependency test update when new folders need import rules
  - `rtk pnpm run qlty`
  - `rtk pnpm test`
  - `rtk pnpm run build` if exported production module topology changes
- Production Readiness:
  - Failure mode: parse or normalization limitations are carried as structured
    limitations instead of thrown exceptions.
  - JP1/AJS compatibility: no interpretation changes; this slice only names
    comparison concepts.
  - Large or malformed input risk: contracts support warning/error summaries
    before expensive comparison logic exists.
  - Desktop/web impact: no direct host dependency; usable from both hosts.
  - README/docs impact: no README change expected unless public command text is
    introduced later.
  - CHANGELOG impact: no external behavior yet, so no CHANGELOG update.
- Approval Boundary: new domain/application comparison contract files,
  architecture tests, and related SDD traceability only.
- Dependencies: `AjsDocument` normalized model and architecture dependency
  rules.
- Risks: over-modeling too early; keep DTOs minimal for Slice 2 while leaving
  explicit extension points for later condition and schedule slices.
- Out of Scope: actual diff algorithm, command registration, Markdown
  rendering, flow highlighting, schedule calculation, telemetry emission, and
  generated artifacts.

### Slice 2: Structural Diff And Deterministic Identity Matching

- Status: Complete
- Smallest Useful Slice: delivers one domain meaning: deterministic semantic
  structure comparison without UI/report integration.
- Scope: implement job-group-scoped comparison for order-insensitive jobnet,
  unit, and relation additions/removals/changes; exact identity matching;
  identity-fingerprint matching for one-to-one rename/move confirmation;
  ambiguous candidate reporting; execution attribute categorization.
- User / Domain Value: reviewers can distinguish real structural/execution
  changes from definition-file order noise through a tested application use
  case.
- Cohesive Change Group:
  - likely files: `src/domain/models/semantic-diff/*`,
    `src/application/semantic-diff/compareSemanticDiff.ts`
  - likely tests: `src/test/suite/compareSemanticDiff.test.ts`,
    fixture additions under `sample/` or test fixtures
  - related existing files:
    `src/domain/models/ajs/AjsDocument.ts`,
    `src/domain/models/ajs/normalize/relations.ts`,
    `src/domain/models/parameters/unitEdgeHelpers.ts`,
    `src/test/suite/normalizeRelations.test.ts`
- Acceptance:
  - order-only changes produce no semantic changes
  - jobnet exact identity uses job-group-relative full path plus type
  - unit exact identity uses parent jobnet path, unit name, and unit type
  - unit name alone never confirms identity
  - relation comparison uses matched unit correspondence
  - one-to-one fingerprint matches can confirm rename/move
  - multiple candidates remain ambiguous
  - fingerprint-changing rename/move remains delete/add
  - execution attributes are grouped into user-facing categories
- Validation:
  - application tests for exact matching, ambiguous matching, relation
    matching, execution attribute categorization, and order-only fixtures
  - focused tests for normalization warnings carried into comparison
    limitations
  - `rtk pnpm run qlty`
  - `rtk pnpm test`
  - `rtk pnpm run test:web` when shared module bundling or browser execution
    assumptions are touched
- Production Readiness:
  - Failure mode: unsupported attributes and malformed normalized relations are
    reported as limitations without blocking other comparable changes.
  - JP1/AJS compatibility: preserves current parser/normalizer behavior and
    uses JP1/AJS3 v13 as the target reference for attribute meaning.
  - Large or malformed input risk: matching should use maps keyed by exact
    identity/fingerprint where practical and avoid repeated full-tree scans.
  - Desktop/web impact: pure domain/application logic; no Node-only imports.
  - README/docs impact: no user docs until command/report surface exists.
  - CHANGELOG impact: no externally observable command yet unless this slice is
    broadened during approval.
- Approval Boundary: comparison algorithm, helper types, fixtures, tests, and
  SDD docs for structural matching only.
- Dependencies: Slice 1.
- Risks: fingerprint field choice may over-match or under-match; unsupported
  unit families must remain visible instead of guessed.
- Out of Scope: confirmation-required condition analysis, Markdown rendering,
  VS Code commands, webview UI, schedule calculation, telemetry, manual match
  persistence, and AI advice.

### Slice 3: Markdown Report Renderer

- Status: Complete
- Smallest Useful Slice: delivers one user-facing artifact format while still
  avoiding command/UI wiring.
- Scope: render `SemanticChangeSet` output to Markdown including summary,
  structural changes, execution attribute categories, rename/move rationale,
  ambiguous candidates, unsupported items, limitations, and empty/no-change
  states.
- User / Domain Value: semantic diff results can be reviewed in pull requests,
  change-control tickets, and release approval material.
- Cohesive Change Group:
  - likely files: `src/application/semantic-diff/renderSemanticDiffMarkdown.ts`
    or equivalent report module
  - likely tests: `src/test/suite/renderSemanticDiffMarkdown.test.ts`
  - related existing patterns:
    `src/application/unit-list/exportUnitListCsv.ts`,
    `src/presentation/webview/editor/ajsTable/exportCsvView.ts`
- Acceptance:
  - reports include semantic changes, confirmation-required placeholders when
    present, matching rationale, unsupported items, limitations, and
    calculation constraints
  - reports do not include parser internals or raw AST objects
  - report output is deterministic for the same comparison result
- Validation:
  - snapshot or exact-string report tests for no-change, structural-change,
    rename/move, ambiguous-candidate, and unsupported-item cases
  - `rtk pnpm run qlty`
  - `rtk pnpm test`
- Production Readiness:
  - Failure mode: empty or limitation-only comparisons still produce a useful
    report.
  - JP1/AJS compatibility: report wording avoids asserting runtime failures.
  - Large or malformed input risk: report rendering handles large change lists
    deterministically and without recursive object dumps.
  - Desktop/web impact: pure string rendering; no filesystem or clipboard
    assumptions.
  - README/docs impact: defer user docs until command/export surface exists.
  - CHANGELOG impact: no external behavior unless paired with Slice 4.
- Approval Boundary: report renderer, report fixtures/tests, and SDD docs
  related to report validation.
- Dependencies: Slice 2.
- Risks: report may become too verbose; keep output structured enough for
  review while preserving complete rationale.
- Out of Scope: command registration, save/copy behavior, webview rendering,
  condition rules, schedule calculation, telemetry.

### Slice 4: VS Code Command And Report Export Surface

- Status: Approved
- Smallest Useful Slice: delivers one user workflow: run Phase 1 comparison
  from VS Code and obtain a Markdown report.
- Scope: add a VS Code command that compares the active JP1/AJS editor as the
  after definition against a before definition selected with a VS Code open
  dialog, parse and normalize both inputs through existing parser
  infrastructure, call the application comparison/report use cases, and expose
  Markdown report copy/save behavior with desktop/web-compatible host adapters.
- User / Domain Value: users can execute semantic structural comparison from
  the extension without using internal APIs.
- Cohesive Change Group:
  - likely files: `package.json` command contribution and `activationEvents`,
    `src/bootstrap/extension/extensionDependencies.ts`,
    `src/bootstrap/extension/extensionSubscriptions.ts`,
    new semantic-diff command wiring under `src/bootstrap/extension/` and
    `src/presentation/vscode/commands/`
  - likely tests: `src/test/suite/semanticDiffCommand.test.ts`,
    `src/test/suite/extensionSubscriptions.test.ts`,
    `src/test/suite/packageManifest.test.ts`,
    `src/test/suite/extension.test.ts`,
    web smoke updates if command availability is expected in web
  - related existing files:
    `src/presentation/vscode/commands/openPreviewCommand.ts`,
    `src/presentation/vscode/commands/importAjsDefinitionViaWebApiCommand.ts`,
    `src/presentation/vscode/webview/messageHandlers.ts`
- Acceptance:
  - command appears in `package.json` command contributions and
    `activationEvents` without raising `engines.vscode`
  - command uses the active JP1/AJS editor as the after input and a before
    file selected through `vscode.window.showOpenDialog`
  - selected before content is read through `vscode.workspace.fs.readFile`
    rather than Node-only filesystem APIs
  - command can parse both definition inputs and report parse errors
    recoverably
  - report save/copy path works through host-specific adapters
  - web host does not use Node-only filesystem/process APIs directly
  - user-facing errors do not expose raw file content
- Validation:
  - command unit tests for success, cancellation, parse failure, unsupported
    host behavior where applicable, and report persistence paths
  - package manifest tests for command contribution and activation event
  - extension subscription tests
  - `rtk pnpm run qlty`
  - `rtk pnpm test`
  - `rtk pnpm run test:web`
  - `rtk pnpm run build`
- Production Readiness:
  - Failure mode: no active editor, cancelled input, parse errors, unsupported
    web save path, and write failures produce understandable messages.
  - JP1/AJS compatibility: existing parser behavior is reused; comparison does
    not reinterpret unsupported content silently.
  - Large or malformed input risk: parse errors and large reports remain
    recoverable; avoid blocking unrelated viewer workflows.
  - Desktop/web impact: desktop may use VS Code save dialogs; web must use
    supported VS Code/browser-safe APIs or explicitly report unsupported
    persistence.
  - README/docs impact: README or user docs likely required because a new
    command/user workflow becomes available.
  - CHANGELOG impact: required by CHANGELOG criteria for new command and
    user-visible workflow.
- Approval Boundary: command contribution, `activationEvents`,
  activation/subscription wiring, command adapter, active-editor plus
  before-file input workflow, parser normalization orchestration, report
  persistence, command tests, README/CHANGELOG if needed.
- Dependencies: Slice 3.
- Risks: active-editor plus before-file input is intentionally narrow; later
  two-file, multi-root, comparison-history, or dedicated visual comparison
  workflows require separate approval.
- Out of Scope: interactive visual diff UI, flow highlighting, condition
  confirmation rules, schedule calculation, telemetry unless explicitly
  approved in this slice.

### Slice 5: Start And Wait Confirmation Checks

- Status: Approved
- Smallest Useful Slice: delivers one domain meaning: confirmation-required
  start/wait risk signals based on already matched semantic elements.
- Scope: compare supported relation conditions, start conditions, end judgment,
  branching, file wait, event wait, timeout removal, and within-job-group
  release-source disappearance; add confirmation-required items and
  constraints to comparison and report outputs.
- User / Domain Value: reviewers can see definition changes that may prevent
  expected starts or leave waits unresolved before release.
- Cohesive Change Group:
  - likely files: `src/domain/models/semantic-diff/*`,
    `src/application/semantic-diff/*`,
    possibly reusable parameter helpers under
    `src/domain/models/parameters/*` only when cross-consumer value is clear
  - likely tests: `src/test/suite/semanticDiffConditions.test.ts`,
    report tests extended for confirmation-required sections
  - related existing files:
    `src/application/editor-feedback/syntaxDiagnosticRuleSets.ts`,
    `src/domain/models/parameters/jobEndJudgmentHelpers.ts`,
    `src/domain/models/parameters/unitEdgeHelpers.ts`,
    wait/event unit tests such as `unitWaitStateHelpers.test.ts`
- Acceptance:
  - relation/start/end/branch condition changes can be reported when supported
  - timeout removal on wait units is confirmation-required
  - file/event wait target changes are visible with constraints
  - missing predecessors/successors/disconnected relations alone are not
    problem judgments
  - external files/events/runtime facts are stated as unverified constraints
- Validation:
  - rule tests for positive and negative confirmation-required scenarios
  - report tests for confirmation-required wording and constraints
  - tests for unsupported/uninterpretable conditions
  - `rtk pnpm run qlty`
  - `rtk pnpm test`
  - `rtk pnpm run test:web` if shared helpers affect web bundle
- Production Readiness:
  - Failure mode: unsupported conditions create limitations instead of false
    confirmation-required claims.
  - JP1/AJS compatibility: supported rules must name JP1/AJS3 v13 manual
    reference basis before implementation approval.
  - Large or malformed input risk: rule evaluation is bounded to matched units
    and relation sets.
  - Desktop/web impact: pure comparison/report logic unless command report
    output is extended.
  - README/docs impact: update docs if user-visible confirmation-required
    behavior changes command/report output.
  - CHANGELOG impact: required if command/report output gains new externally
    observable confirmation-required behavior.
- Approval Boundary: supported condition rule set, comparison/report DTOs,
  report wording, tests, and any reference-backed parameter helper extraction.
- Dependencies: Slice 2 and Slice 3; Slice 4 only if exposed through the
  command in the same release path.
- Risks: strictness/loosening can be overclaimed; rule support must stay
  narrow and documented when manual evidence is incomplete.
- Out of Scope: schedule calculation, flow visualization, runtime validation,
  cycle detection, terminal reachability-only judgments, AI recommendations.

### Slice 6: Flow Diff Highlighting Hooks

- Status: Approved
- Smallest Useful Slice: delivers one presentation value: show already computed
  condition/structural semantic diff emphasis in the flow viewer without moving
  comparison logic into UI code.
- Scope: extend application/presentation DTOs and existing after-definition
  flow viewer state to accept semantic diff highlight metadata, visually
  emphasize changed after-side units/relations and confirmation-required
  targets that exist in the after definition, and preserve existing flow
  interactions.
- User / Domain Value: reviewers can inspect relevant semantic diff locations
  in the graph they already use for JP1/AJS flow understanding.
- Cohesive Change Group:
  - likely files: `src/application/flow-graph/buildFlowGraphCore.ts`,
    `src/presentation/webview/editor/ajsFlow/*`,
    `src/shared/webviewEvents.ts` if event contracts are needed
  - likely tests: `src/test/suite/buildFlowGraphUseCase.test.ts`,
    `src/test/suite/flowGraphView.test.ts`,
    focused node/display tests
  - related existing files:
    `src/presentation/webview/editor/ajsFlow/flowRelationshipFocus.ts`,
    `src/presentation/webview/editor/ajsFlow/nodes/nodeSxProps.ts`,
    `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`
- Acceptance:
  - flow presentation consumes semantic diff DTOs or view models
  - comparison rules are not reimplemented in React components
  - before-only deletions and ambiguous candidates remain report-only and are
    not forced into the existing single-document flow graph
  - no dedicated two-document comparison webview is introduced in this slice
  - existing selection, search, relationship focus, nested expansion, and
    table navigation behavior remain intact
  - highlighted nodes/edges remain visible and understandable on desktop and
    web
- Validation:
  - flow DTO/view-model tests for highlight metadata
  - React/presentation tests for changed-node, changed-edge, and
    confirmation-required rendering states
  - existing flow interaction tests remain passing
  - `rtk pnpm run qlty`
  - `rtk pnpm test`
  - `rtk pnpm run test:web`
  - `rtk pnpm run build`
- Production Readiness:
  - Failure mode: missing, stale, or after-document-mismatched diff metadata
    leaves normal flow rendering unchanged.
  - JP1/AJS compatibility: no new comparison semantics; presentation consumes
    existing result categories.
  - Large or malformed input risk: highlight lookup should use IDs/paths and
    avoid repeated scans during render.
  - Desktop/web impact: React/webview changes must work in both extension
    hosts.
  - README/docs impact: update user docs if visual diff highlighting is
    exposed.
  - CHANGELOG impact: required if user-visible flow highlighting ships.
- Approval Boundary: flow DTO/view-model additions, webview event additions if
  needed, flow rendering/highlight styles, and focused tests.
- Dependencies: Slice 5 for confirmation-required highlighting; Slice 2 is
  enough for structural-only highlighting if scope is narrowed during review.
- Risks: after-definition-only highlighting cannot visualize before-only
  deletions; the Markdown report remains the authoritative place for those
  changes until a dedicated comparison view is separately approved.
- Out of Scope: computing semantic diff rules in UI, dedicated two-document
  comparison webview, full visual diff editor, schedule timeline
  visualization, AI advice.

### Slice 7: Schedule Diff

- Status: Approved
- Smallest Useful Slice: delivers one domain meaning: bounded-period schedule
  comparison for an explicitly supported JP1/AJS3 schedule subset.
- Scope: calculate and compare run schedules over a user-provided period for
  supported schedule elements; report added, removed, changed-time schedules,
  root jobnets with zero calculated runs, supported/unsupported elements, and
  calculation-failure reasons.
- User / Domain Value: reviewers can see whether a definition change removes
  or changes expected execution opportunities in a defined review period.
- Cohesive Change Group:
  - likely files: new schedule-diff modules under
    `src/domain/models/semantic-diff/` or `src/application/semantic-diff/`,
    focused reusable schedule helpers under `src/domain/models/parameters/`
    only where they are reference-backed
  - likely tests: `src/test/suite/semanticDiffSchedule.test.ts`,
    report tests for schedule sections
  - related existing files:
    `src/domain/models/parameters/scheduleRuleHelpers.ts`,
    `src/application/unit-list/unitListScheduleValueHelpers.ts`,
    `src/test/suite/scheduleRuleHelpers.test.ts`,
    `sample/sample_ref_schedule_utf8`
- Acceptance:
  - comparison period is displayed
  - added/deleted/changed run schedules are listed for supported rules
  - zero-run root jobnets are confirmation-required
  - uncalculated schedules include target and reason
  - unsupported schedule elements are summarized in result and report
- Validation:
  - reference-backed schedule fixtures for supported elements
  - tests for unsupported elements, uncalculated reasons, zero-run detection,
    48-hour/day-crossing behavior only if included in approved scope
  - report tests for schedule sections
  - `rtk pnpm run qlty`
  - `rtk pnpm test`
  - `rtk pnpm run test:web`
  - `rtk pnpm run build` if command period inputs or UI are added
- Production Readiness:
  - Failure mode: unsupported combinations produce calculation limitations
    rather than incorrect schedules.
  - JP1/AJS compatibility: supported schedule subset must cite JP1/AJS3 v13
    definition/config references before approval.
  - Large or malformed input risk: period calculation must be bounded and avoid
    unbounded loops.
  - Desktop/web impact: calculation logic stays host-neutral; period input
    adapters must be host-safe.
  - README/docs impact: required if users configure schedule comparison
    periods.
  - CHANGELOG impact: required when schedule comparison is user-visible.
- Approval Boundary: supported schedule subset, schedule calculation,
  comparison/report output, period input/presentation if included, and tests.
- Dependencies: Slice 2 and Slice 3; Slice 4 if user period input is exposed
  through the command.
- Risks: schedule semantics are broad; approval must explicitly narrow the
  first supported element set and list uncalculated elements.
- Out of Scope: real scheduler integration, runtime execution history,
  external calendar sources outside compared definitions, AI advice.

## Cross-Slice Dependencies

- Slice 1 must precede all implementation slices because it defines stable
  host-neutral contracts.
- Slice 2 depends on Slice 1 and unlocks every later behavior slice.
- Slice 3 depends on Slice 2 so reports render real semantic result shapes.
- Slice 4 depends on Slice 3 to avoid exposing a command before the report
  artifact exists.
- Slice 5 depends on Slice 2 for matched units/relations and on Slice 3 for
  confirmation-required report output.
- Slice 6 depends on Slice 5 when confirmation-required highlighting is in
  scope; it can be narrowed to structural highlighting after Slice 2 only if
  review explicitly changes the scope.
- Slice 7 depends on Slice 2 and Slice 3; it may also depend on Slice 4 if the
  comparison period is collected through the command surface.

## Traceability

- TRACEABILITY.md required: yes
- Reason: feature changes user-visible behavior, JP1/AJS definition-file
  interpretation and compatibility, and is split into multiple independently
  approvable slices.
- Status: updated for Planning Mode slice boundaries.

## Feature-Level Risks

- JP1/AJS3 manual references are still unresolved for relation conditions,
  wait units, event units, and schedule calculation.
- Initial command UX is narrowed to active after editor plus before-file picker;
  broader comparison input workflows require a future approved slice.
- Flow highlighting is narrowed to existing after-definition flow viewer
  metadata; before-only and ambiguous elements remain report-only unless a
  dedicated comparison view is separately approved.
- Schedule comparison can become too broad; Slice 7 must approve a narrow
  supported subset first.
- Telemetry should not be added speculatively; runtime semantic-diff telemetry
  requires a separately approved slice or explicit inclusion in a user-visible
  slice, with anonymous metadata only.
- Existing `engines.vscode` is `^1.75.0`; no slice may introduce APIs outside
  that compatibility contract without explicit approval.

## Use-Case Back-Propagation

- `docs/requirements/use-cases/uc-compare-semantic-diff.md` already
  carries the durable behavior contract and should be updated only when review
  or implementation changes accepted behavior, supported subsets, or
  limitations.
- `docs/requirements/use-cases/uc-normalize-ajs-document.md` needs an update
  only if semantic diff introduces reusable normalized helpers or changes the
  normalized model contract.
- `docs/requirements/use-cases/uc-build-flow-graph.md` needs an update only if
  Slice 6 changes durable flow-view behavior.
- `docs/requirements/use-cases/uc-record-telemetry.md` needs an update only if
  runtime semantic-diff telemetry is explicitly approved.

## Feature Exit

- Definition of Done status: Not started
- Durable documentation updates: use case and roadmap entries exist; update
  only when implemented behavior or accepted limitations change.
- Open risks: JP1/AJS manual references, web report persistence, and first
  schedule subset.

## Validation

- [ ] Tests added or updated with each code slice
- [ ] Update README or user documentation if user-facing behavior changes
- [ ] Update CHANGELOG when command, report, highlighting, condition checks, or
      schedule behavior becomes externally observable
- [ ] Run relevant validation for each slice
