# Feature Tasks: Semantic Diff

## Plan Status

- Status: Approved
- Planning scope: Replanning Mode for additional semantic diff command
  discoverability, report-display workflow, and evaluation sample coverage
  before Feature Exit Review.
- Review status: Reviewed
- Human approval: Approved for Slice 8 through Slice 10
- Active implementation slice: Slice 10, Semantic Diff Evaluation Sample
  Fixtures

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 8 through Slice 10: editor-title semantic diff command
  entry, displayed report workflow with explicit Markdown copy, and semantic
  diff evaluation sample fixtures.

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains. Preserve it while approved Slice 10
remains pending.

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

- Status: Complete
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

- Status: Complete
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

- Status: Complete
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

- Status: Complete
- Smallest Useful Slice: delivers one domain meaning: bounded-period schedule
  comparison for one explicitly supported JP1/AJS3 schedule subset without
  widening command or UI input behavior.
- Replanning Gap: implementation could not continue because the previous Slice
  7 approval boundary required schedule calculation but did not name the first
  supported schedule element set, the uncalculated element set, or whether
  period input belonged to the command surface.
- Supported Schedule Subset:
  - schedule-defined jobnet units, including root and nested jobnets, when the
    jobnet has directly defined schedule parameters in the compared definition
  - explicit schedule dates whose `sd` day is a concrete calendar day in
    `YYYY/MM/DD`, `MM/DD`, or `DD` form
  - default or explicit schedule-rule number pairing between `sd` and `st`
  - normal start times parsed by `st` in `HH:MM` form
  - schedule generation limited to an inclusive `from` / exclusive `to`
    comparison period supplied through application options
  - no command prompt, settings, webview input, or persisted period state in
    this slice
- Uncalculated Schedule Elements:
  - open-day, closed-day, week-day, month-end, base-day, relative-day, cycle,
    shift, closed-day substitution, start-time offset, delay time,
    day-crossing, 48-hour, calendar, and inherited parent-rule semantics
  - schedule rules with missing or unparsable `sd` / `st` pairs
  - jobnets that rely only on parent schedule inheritance without directly
    defined schedule parameters
- Scope: add host-neutral schedule comparison options and report-ready result
  data, calculate the supported directly defined jobnet run schedule subset
  over the bounded period, compare added, removed, and changed-time runs, add
  confirmation-required items when an after-side schedule-defined jobnet has
  zero calculated runs for the period, and report uncalculated schedule
  elements with reasons.
- User / Domain Value: reviewers can see whether a definition change removes
  or changes supported directly defined jobnet execution opportunities in a
  defined review period, while unsupported schedule semantics remain visible
  instead of being guessed.
- Cohesive Change Group:
  - likely files: `src/domain/models/semantic-diff/SemanticDiff.ts`,
    `src/application/semantic-diff/compareSemanticDiff.ts`,
    `src/application/semantic-diff/renderSemanticDiffMarkdown.ts`, and one
    focused schedule calculator module under `src/application/semantic-diff/`
  - likely tests: `src/test/suite/semanticDiffSchedule.test.ts`,
    report tests for schedule sections
  - related existing files:
    `src/domain/models/parameters/scheduleRuleHelpers.ts`,
    `src/application/unit-list/unitListScheduleValueHelpers.ts`,
    `src/test/suite/scheduleRuleHelpers.test.ts`,
    `sample/sample_ref_schedule_utf8`
- Acceptance:
  - comparison period is displayed
  - supported explicit-date schedule-defined jobnet schedules list added and
    removed run times within the bounded period
  - same-date schedule-defined jobnet runs with changed start times are
    represented as changed-time schedule differences instead of unrelated
    delete/add entries
  - zero calculated runs for an after-side schedule-defined jobnet are
    confirmation-required
  - supported before-side runs disappearing from the after definition are
    visible in the schedule report
  - uncalculated schedule elements include target, side, parameter key or rule,
    and reason
  - unsupported or uncalculated schedule elements are summarized in the result
    and Markdown report
  - no VS Code command contribution, command prompt, webview UI, settings,
    telemetry, or persistence behavior changes in this slice
- Validation:
  - reference-backed tests for explicit-date `sd` plus `st` root and nested
    jobnet runs in the bounded comparison period
  - tests for added, removed, and changed-time supported schedule runs
  - tests for zero-run confirmation-required items
  - tests for uncalculated open-day, week-day, cycle/shift/day-crossing or
    unparsable schedule values
  - report tests for schedule sections
  - `rtk pnpm run qlty`
  - `rtk pnpm test`
  - `rtk pnpm run test:web`
  - `rtk pnpm run build`
- Production Readiness:
  - Failure mode: unsupported combinations produce calculation limitations
    rather than incorrect schedules.
  - JP1/AJS compatibility: supported subset is limited to JP1/AJS3 v13
    unit-definition schedule parameters `sd` and `st`; all calendar,
    inherited-rule, closed-day, cycle, offset, day-crossing, and 48-hour
    semantics remain uncalculated.
  - Large or malformed input risk: period calculation must be bounded and avoid
    unbounded loops; missing or malformed period options must skip schedule
    calculation and report an understandable limitation.
  - Desktop/web impact: calculation and Markdown rendering stay host-neutral;
    no Node-only, VS Code, or webview APIs are added.
  - README/docs impact: no README change because users cannot configure the
    period through the command or settings in this slice.
  - CHANGELOG impact: required if command output now includes schedule
    findings by default; not required if schedule comparison only runs when an
    application caller supplies a period and the current command does not.
- Approval Boundary: application/domain DTO extensions for schedule period and
  schedule findings, supported explicit-date `sd` plus `st` calculation,
  uncalculated schedule reporting, Markdown schedule report output, and focused
  tests for root and nested schedule-defined jobnets. Command period input, UI,
  settings, persistence, and telemetry are not approved.
- Dependencies: Slice 2 and Slice 3. Slice 4 is not a dependency for this
  revised scope because user period input is not exposed through the command.
- Risks: this first subset intentionally under-reports broad JP1/AJS schedule
  semantics; unsupported and uncalculated reasons must be prominent enough that
  users do not mistake omitted semantics for no schedule impact.
- Implementation Feedback:
  - The slice boundary was appropriate: schedule comparison can remain
    application-only when the comparison period is supplied through options,
    so command prompts, settings, persistence, and telemetry are still outside
    this slice.
  - Future schedule slices should decide whether inherited parent-rule
    schedules are calculated or remain explicitly uncalculated before adding
    command period input.
- Out of Scope: real scheduler integration, runtime execution history,
  external calendar sources outside compared definitions, command period
  prompts, VS Code settings, webview schedule UI, persisted comparison period,
  calendar/holiday semantics, day-crossing and 48-hour calculations, telemetry,
  AI advice.

### Slice 8: Editor Title Command Entry

- Status: Complete
- Replanning Gap: after the initial command workflow was implemented, the
  feature still required better command discoverability from the JP1/AJS editor
  itself before Feature Exit.
- Smallest Useful Slice: delivers one user value: users can start semantic diff
  from the editor title next to the existing JP1/AJS viewer actions.
- Scope: add the existing `ajsbutler.compareSemanticDiff` command to the
  `editor/title` menu for JP1/AJS editors with an appropriate navigation group
  placement, preserving the existing command id, title, icon, activation event,
  and command behavior.
- User / Domain Value: reduces command-palette friction without changing the
  semantic comparison model or report content.
- Cohesive Change Group:
  - likely files: `package.json`
  - likely tests: `src/test/suite/packageManifest.test.ts`
  - related existing files: `src/test/suite/extension.test.ts`
- Acceptance:
  - semantic diff appears as an editor-title icon for `editorLangId == 'jp1ajs'`
  - existing flow/table editor-title entries remain unchanged
  - command id, icon, activation event, and command behavior remain unchanged
  - no new VS Code API beyond the existing manifest contribution model
- Validation:
  - package manifest test for the semantic diff `editor/title` contribution
  - `rtk pnpm run qlty`
  - `rtk pnpm test`
  - `rtk pnpm run test:web`
  - `rtk pnpm run build`
- Production Readiness:
  - Failure mode: if the command cannot run, existing command error handling
    still reports no active editor, cancellation, read failure, or parse
    failure.
  - JP1/AJS compatibility: no definition interpretation changes.
  - Large or malformed input risk: unchanged from the existing command.
  - Desktop/web impact: manifest menu contribution applies to both hosts and
    uses the existing command path.
  - README/docs impact: update command usage wording if the editor-title entry
    changes discoverability documentation.
  - CHANGELOG impact: required because a user-visible command entry point is
    added.
- Approval Boundary: package manifest menu contribution, focused manifest
  tests, README/CHANGELOG wording only if needed for the new entry point.
- Dependencies: Slice 4.
- Risks: editor title can become crowded; place semantic diff consistently with
  the existing JP1/AJS viewer commands.
- Implementation Feedback:
  - The slice boundary was appropriate: the editor-title contribution, manifest
    test, CHANGELOG note, and traceability update could be implemented and
    validated without changing command behavior or report output.
- Out of Scope: changing comparison behavior, report output, report display,
  command period input, telemetry, or dedicated visual diff UI.

### Slice 9: Report Document Display And Explicit Markdown Copy

- Status: Complete
- Replanning Gap: the current command implicitly writes the generated Markdown
  report to the clipboard and then offers save behavior, but the desired
  workflow is to display the result in VS Code and copy Markdown only after an
  explicit user action from that report surface.
- Smallest Useful Slice: delivers one user workflow: review semantic diff
  output in a VS Code-native report document, then explicitly copy the Markdown
  from that displayed report.
- Scope: replace implicit clipboard write and save prompt in the command with
  a VS Code-native Markdown report display surface, using a host-safe
  presentation adapter such as a readonly virtual Markdown document or
  equivalent editor document surface; add a report-surface command to copy the
  displayed Markdown to the clipboard; contribute the copy command only for the
  semantic diff report surface; preserve existing parser, comparison, renderer,
  and report text behavior.
- User / Domain Value: users can inspect results before choosing to copy, and
  the clipboard changes only through an explicit action.
- Cohesive Change Group:
  - likely files: `package.json`,
    `src/presentation/vscode/commands/semanticDiffCommand.ts`,
    `src/bootstrap/extension/semanticDiffWiring.ts`, and a focused report
    document/provider module under `src/presentation/vscode/commands/` or
    `src/presentation/vscode/semantic-diff/`
  - likely tests: `src/test/suite/semanticDiffCommand.test.ts`,
    `src/test/suite/packageManifest.test.ts`,
    `src/test/suite/extensionSubscriptions.test.ts`
  - related docs: README and CHANGELOG
- Acceptance:
  - running semantic diff opens or reveals a VS Code report document/surface
    containing the generated Markdown report
  - running semantic diff does not automatically write the report to the
    clipboard
  - the report surface provides an explicit command/menu action to copy the
    displayed Markdown
  - copy action copies the exact displayed Markdown report
  - parse/read/cancellation failures still produce understandable messages
    without exposing definition contents
  - desktop and web hosts do not use Node-only filesystem/process APIs for the
    report display or copy action
  - existing application/domain comparison and Markdown rendering logic are not
    moved into presentation code
- Validation:
  - command tests for successful report display without clipboard writes
  - command tests for explicit copy action and copy failure handling
  - manifest tests for report-copy command contribution and context/menu guard
  - subscription tests for registering the report provider/copy command
  - existing parse/cancel/read-failure command tests remain passing
  - `rtk pnpm run qlty`
  - `rtk pnpm test`
  - `rtk pnpm run test:web`
  - `rtk pnpm run build`
- Production Readiness:
  - Failure mode: report-display failure and clipboard-copy failure produce
    understandable messages and do not lose the generated report silently.
  - JP1/AJS compatibility: no definition interpretation changes.
  - Large or malformed input risk: large reports should be displayed through a
    document/editor surface rather than custom recursive rendering; parse
    failures remain recoverable.
  - Desktop/web impact: use VS Code APIs compatible with `engines.vscode`
    `^1.75.0` and avoid Node-only APIs in the command path.
  - README/docs impact: required because the command workflow changes from
    implicit clipboard/save to displayed report plus explicit copy.
  - CHANGELOG impact: required because command workflow and clipboard behavior
    change externally.
- Approval Boundary: command/report presentation adapter, report copy command,
  manifest contributions/context guards, command wiring, focused command and
  manifest tests, README/CHANGELOG updates for the changed workflow.
- Dependencies: Slice 4 and Slice 8. Slice 8 is not technically required for
  the report display, but implementing the discoverability entry first keeps
  command-surface manifest changes easier to review.
- Risks:
  - A custom webview could overreach the requested VS Code-native workflow; use
    a text/document surface unless implementation review identifies a concrete
    blocker.
  - Virtual report documents need deterministic identifiers and lifecycle
    handling so stale copy actions do not copy the wrong report.
- Implementation Feedback:
  - The slice boundary was appropriate: the command workflow, report document
    provider, copy command, manifest contributions, tests, README, CHANGELOG,
    and traceability update stayed within the approved presentation adapter
    scope without changing semantic comparison or Markdown report content.
  - The virtual document approach kept desktop and web behavior on VS Code APIs
    available under the existing `engines.vscode` compatibility contract.
- Out of Scope: dedicated visual diff UI, side-by-side comparison editor,
  persisted report history, automatic clipboard writes, save prompts,
  schedule-period UI, telemetry, or changing Markdown report content.

### Slice 10: Semantic Diff Evaluation Sample Fixtures

- Status: Approved
- Replanning Gap: the feature has focused unit tests for each semantic diff
  behavior, but lacks reusable JP1/AJS sample definitions that exercise the
  implemented evaluation categories through the parser/normalizer/report path.
- Smallest Useful Slice: delivers one validation asset: a reusable before/after
  sample pair that demonstrates the implemented semantic diff evaluations.
- Scope: add repository sample JP1/AJS definition files for semantic diff
  before/after comparison and a focused parser-to-report coverage test that
  verifies the sample pair exercises the implemented evaluation categories:
  structural add/remove, rename or move rationale, ambiguous candidates,
  execution attribute category changes, relation changes, confirmation-required
  condition/wait/timeout cases, unsupported or uninterpretable items, schedule
  run changes, zero calculated runs, and uncalculated schedule elements.
- User / Domain Value: maintainers and reviewers have a concrete JP1/AJS sample
  pair for manual and automated semantic diff verification.
- Cohesive Change Group:
  - likely files: new sample files under `sample/`, such as
    `sample/semantic_diff_before_utf8` and
    `sample/semantic_diff_after_utf8`
  - likely tests: `src/test/suite/semanticDiffSampleCoverage.test.ts`
  - related existing tests: `src/test/suite/buildSemanticDiffReport.test.ts`,
    `src/test/suite/compareSemanticDiff.test.ts`,
    `src/test/suite/semanticDiffConditions.test.ts`,
    `src/test/suite/semanticDiffSchedule.test.ts`
- Acceptance:
  - sample before/after definitions parse through the repository parser
  - normalization succeeds without requiring parser-internal assertions in UI
    code
  - sample comparison plus Markdown rendering covers all implemented semantic
    diff evaluation categories listed in this slice
  - the sample pair is small enough for review and does not duplicate the
    large generic samples
  - sample coverage remains deterministic and host-neutral
- Validation:
  - parser-to-report sample coverage test
  - `rtk pnpm run qlty`
  - `rtk pnpm test`
  - `rtk pnpm run test:web` if sample coverage touches shared bundles or
    command behavior
  - `rtk pnpm run build` if test or sample import paths affect production
    bundling
- Production Readiness:
  - Failure mode: malformed sample definitions fail the focused sample coverage
    test before they can become misleading fixtures.
  - JP1/AJS compatibility: sample syntax must use existing parser-supported
    JP1/AJS definition forms and JP1/AJS3 v13 parameter assumptions already
    used by the feature.
  - Large or malformed input risk: sample remains review-sized; broader stress
    testing stays in existing or future performance fixtures.
  - Desktop/web impact: sample coverage is test/fixture-only and does not
    introduce host APIs.
  - README/docs impact: update README sample-directory wording only if the
    sample becomes a recommended manual verification fixture.
  - CHANGELOG impact: not required for test/sample-only validation assets.
- Approval Boundary: semantic diff sample before/after files, focused sample
  coverage test, and SDD traceability updates for sample validation.
- Dependencies: Slices 1 through 7. It can be implemented after Slice 8 or 9;
  it does not depend on the report display workflow unless the approved test
  explicitly includes command-surface verification.
- Risks:
  - A single sample can become too dense to understand; keep it as a focused
    semantic-diff fixture rather than a replacement for unit-level behavior
    tests.
  - Some evaluation categories may require multiple jobnets or units with
    similar fingerprints; tests should assert category coverage instead of
    relying on fragile full-report snapshots.
- Out of Scope: changing semantic diff algorithms, adding new evaluation
  categories, performance stress samples, generated fixtures, or manual
  screenshot assets.

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
- Slice 7 depends on Slice 2 and Slice 3; the replanned scope explicitly avoids
  command period input, so Slice 4 command changes are not part of Slice 7.
- Slice 8 depends on Slice 4 because it contributes an additional entry point
  for the existing semantic diff command.
- Slice 9 depends on Slice 4 and should follow Slice 8 so command-surface
  manifest changes stay reviewable before replacing the command result
  workflow.
- Slice 10 depends on Slices 1 through 7 for implemented semantic evaluation
  coverage; it can be implemented after Slice 8 or Slice 9 because it is a
  validation fixture slice rather than a command workflow dependency.

## Traceability

- TRACEABILITY.md required: yes
- Reason: feature changes user-visible behavior, JP1/AJS definition-file
  interpretation and compatibility, and is split into multiple independently
  approvable slices.
- Status: updated for the approved additional Slice 8 through Slice 10 plan;
  Slice 8 validation is recorded.

## Feature-Level Risks

- JP1/AJS3 manual references are still incomplete for later broad schedule
  calculation; Slice 7 is narrowed to directly defined jobnet `sd` and `st`
  schedule parameters and must report other schedule semantics as uncalculated.
- Initial command UX is narrowed to active after editor plus before-file picker;
  broader comparison input workflows require a future approved slice.
- Flow highlighting is narrowed to existing after-definition flow viewer
  metadata; before-only and ambiguous elements remain report-only unless a
  dedicated comparison view is separately approved.
- Schedule comparison can become too broad; Slice 7 is narrowed to explicit
  directly defined jobnet schedule dates and normal start times, with broader
  calendar, cycle, day-crossing, and inherited-rule semantics deferred.
- Report presentation can become a custom visual diff surface too early; Slice
  9 is limited to displaying the generated Markdown and explicitly copying it.
- A comprehensive sample can become hard to maintain; Slice 10 must remain a
  review-sized fixture that complements focused unit tests instead of replacing
  them.
- Telemetry should not be added speculatively; runtime semantic-diff telemetry
  requires a separately approved slice or explicit inclusion in a user-visible
  slice, with anonymous metadata only.
- Existing `engines.vscode` is `^1.75.0`; no slice may introduce APIs outside
  that compatibility contract without explicit approval.

## Use-Case Back-Propagation

- `docs/requirements/use-cases/uc-compare-semantic-diff.md` is updated for the
  additional displayed-report and explicit-copy behavior. Revisit it only if
  review changes the approved report-surface contract.
- `docs/requirements/use-cases/uc-normalize-ajs-document.md` needs an update
  only if semantic diff introduces reusable normalized helpers or changes the
  normalized model contract.
- `docs/requirements/use-cases/uc-build-flow-graph.md` needs an update only if
  Slice 6 changes durable flow-view behavior.
- `docs/requirements/use-cases/uc-record-telemetry.md` needs an update only if
  runtime semantic-diff telemetry is explicitly approved.

## Feature Exit

- Definition of Done status: paused; additional Slice 8 through Slice 10 plan
  needs review and approval before Feature Exit can resume.
- Durable documentation updates: use case and roadmap entries exist; update
  only when implemented behavior or accepted limitations change.
- Open risks: broad JP1/AJS schedule semantics beyond the Slice 7 supported
  subset, report display lifecycle, sample maintainability, and feature exit
  documentation propagation.

## Validation

- [ ] Tests added or updated with each code slice
- [ ] Update README or user documentation if user-facing behavior changes
- [ ] Update CHANGELOG when command, report, highlighting, condition checks, or
      schedule behavior becomes externally observable
- [ ] Run relevant validation for each slice
