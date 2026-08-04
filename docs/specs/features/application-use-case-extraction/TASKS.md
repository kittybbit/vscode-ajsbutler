<!-- markdownlint-disable MD013 -- SDD plan contains compact evidence lists. -->

# Application Use Case Extraction Tasks

## Agent Brief

- Purpose: execute the approved SDD plan for the application/use-case boundary
  extraction feature.
- Planning mode: Replanning Mode completed after `sdd-review-plan` findings.
- Selected feature: `application-use-case-extraction` on branch
  `codex/application-use-case-extraction`.
- Current state: Slices 1-17 implementation, validation, and completion
  approval are complete; Slice 18 is the next active implementation slice.
- Preserve the Current-State Boundary Gate and existing application seams.
- No JP1/AJS rule, parser grammar, DTO meaning, telemetry meaning, or VS Code
  compatibility change is planned.
- Every implementation slice owns its source and behavior-proving test files.
- Next step is `sdd-implement-task` for Slice 18.

## Plan Status

- Status: In Progress
- Planning scope: revise the full feature plan after review findings, with
  concrete contract dependencies, explicit Flow effect/controller ownership,
  and a cohesive Unit List shell/search boundary.
- Review status: `sdd-review-plan` findings incorporated; the revised full plan
  is approved in the current conversation.
- Human approval: Approved for Slices 1-20
- Active implementation slice: Slice 18: Extract Unit List rendering, columns,
  and export mapping.
- Replanning trigger: the review identified an incorrect telemetry file
  reference, unnecessary Bootstrap dependencies on presentation slices,
  incomplete Flow helper ownership, vague semantic-diff validation names,
  missing Flow shell/controller test coverage, and an overlarge Flow
  controller/effects boundary that required separate graph-state,
  viewport/document-effects, controller-composition, and caller-integration
  slices. The follow-up review also found ambiguous same-name Flow file scope,
  unowned Flow Header/tree-selection coverage, unrecorded overflow cleanup,
  and a table search controller mixed into the virtualization slice.

## Current-State Boundary Gate

The existing normalized application seams are evidence to preserve, not work
to reimplement. The gate must pass before any implementation slice is approved.
The gate is also the baseline for detecting accidental duplicate extraction.

| Boundary                      | Existing seam to preserve                                                                                                                   | Gate evidence                                                                                                                                                                                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Parser and application errors | `src/application/parsing/AjsParserPort.ts`, `src/infrastructure/parser/AntlrAjsParser.ts`, repository-owned parser/application error states | `src/test/suite/AntlrAjsParser.test.ts`, `src/test/suite/architectureDependencyRules.test.ts`                                                                                                                                                                             |
| Build Flow Graph              | `src/application/flow-graph/buildFlowGraph.ts`, `buildExpandedFlowGraph.ts`, `flowGraphDocument.ts`                                         | `buildFlowGraphUseCase.test.ts`, `buildExpandedFlowGraphUseCase.test.ts`, `flowGraphDocument.test.ts`                                                                                                                                                                     |
| View Unit List                | `src/application/unit-list/buildUnitList.ts`, `unitListDocument.ts`, `buildUnitListView.ts`, existing projections                           | `buildUnitList.test.ts`, `buildUnitListGroup10View.test.ts`, `buildUnitListGroup6View.test.ts`, `buildUnitListLinkedUnits.test.ts`, `buildUnitListPriorityViews.test.ts`, `buildUnitListRemainingGroups.test.ts`, `buildUnitListView.test.ts`, `unitListEncoding.test.ts` |
| Export Unit List CSV          | `src/application/unit-list/exportUnitListCsv.ts`                                                                                            | `exportUnitListCsv.test.ts`, `exportCsvView.test.ts`                                                                                                                                                                                                                      |
| Cross-view navigation         | `src/application/navigation/resolveNavigationTarget.ts`, existing stable identity and scope contracts                                       | `revealUnit.test.ts`, `viewerRequestMessages.test.ts`, `viewerWiring.test.ts`                                                                                                                                                                                             |

Run the following exact gate commands before implementation approval and again
when the feature is ready for exit:

- `rtk pnpm run build`
- `rtk pnpm run test:full` (the exact desktop and web host validation)
- `rtk pnpm run qlty`
- `rtk pnpm run lint:md`
- `rtk git diff --check`

The gate passes only when the existing seam tests, architecture checks, build,
desktop host run, web host run, and quality checks all pass. A gate failure is
not hidden inside a presentation slice; it requires Replanning Mode.

## Qlty and Validation Policy

- Every code slice runs `rtk pnpm run qlty` and records differential evidence
  against `docs/specs/features/BASELINE.md`.
- New actionable smells caused by a slice are fixed in that slice or recorded
  as an explicitly approved follow-up. Metrics-only movement is a review signal,
  not an automatic failure.
- `rtk pnpm run build` is required for application, bootstrap, transport, and
  shared presentation boundary changes.
- `rtk pnpm run test:full` is the exact combined desktop/web validation command;
  slice-level validation must name its focused test files as well.
- A test file is owned by one implementation slice. The Current-State Boundary
  Gate may cite an existing test as evidence, but no implementation slice may
  edit the same test file as another slice.

## Implementation Slices

### Slice 1: Rename the Diagnose application capability

- Status: Complete
- Scope: rename the application-facing diagnostics capability from
  `BuildSyntaxDiagnostics` to `DiagnoseAjsDefinition`, including
  `src/application/editor-feedback`, `src/bootstrap/extension/extensionDependencies.ts`,
  diagnostics registration, and the related application/bootstrap composition
  references. Preserve the existing parser port, error states, rules, spans,
  ordering, and scheduling behavior.
- User / Domain Value: Diagnose AJS Definition is an explicit host-neutral
  capability with the same observable diagnostics behavior.
- Cohesive Change Group: one application capability naming and composition
  boundary, including its direct bootstrap adapter.
- Acceptance: supported `JP1-PARAM-*` rules, diagnostic fields and ordering,
  short-circuiting, source ranges, and desktop/web diagnostics remain unchanged.
- Validation: `buildSyntaxDiagnostics.test.ts`, `registerDiagnostics.test.ts`,
  `extensionDependencies.test.ts`, `src/test/suite/architectureDependencyRules.test.ts`, `rtk pnpm run build`,
  `rtk pnpm run test:full`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: parser/application failures remain repository-owned and are
    mapped to the existing diagnostics or safe empty result behavior.
  - JP1/AJS compatibility: no rule, grammar, message, span, or definition-file
    interpretation change; existing JP1/AJS3 v13 rule references remain intact.
  - Large or malformed input risk: retain short-circuiting and existing parser
    failure behavior for malformed and large definitions.
  - Desktop/web impact: shared application capability and both diagnostics host
    paths must pass `test:full`.
  - README/docs impact: none expected; CHANGELOG impact: none unless a visible
    diagnostic changes, which requires replanning.
- Approval Boundary: capability rename and direct dependency/registration
  references only. No diagnostic behavior, parser rule, or host UX redesign.
- Dependencies: Current-State Boundary Gate.
- Risks: incomplete rename or accidental application import of a host type.
- Out of Scope: all other application capabilities and presentation refactors.

### Slice 2: Stabilize plain viewer transport contracts

- Status: Complete
- Scope: `src/presentation/vscode/webview/viewerRequestMessages.ts` and
  `viewerHostMessages.ts`, including validation, serialization, and their
  focused tests. Keep payloads plain and host-neutral.
- User / Domain Value: desktop and web viewers exchange validated messages with
  stable meanings and no framework objects at the transport boundary.
- Cohesive Change Group: request/host message contract and validation only.
- Acceptance: valid payload round trips, malformed payloads are rejected, and
  no raw parser, VS Code, React, or Node object crosses the boundary.
- Validation: `viewerRequestMessages.test.ts`, `viewerHostMessages.test.ts`,
  `src/test/suite/architectureDependencyRules.test.ts`, `rtk pnpm run build`,
  and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: invalid messages are rejected or mapped to an existing safe
    host response without crashing the viewer.
  - JP1/AJS compatibility: unit identity, scope, document, CSV, and navigation
    payload meanings remain unchanged.
  - Large or malformed input risk: reject malformed payloads before expensive
    presentation work and avoid copying definition content unnecessarily.
  - Desktop/web impact: the shared transport bundle requires `test:full` before
    feature exit.
  - README/docs impact: none expected; CHANGELOG impact: evaluate only for an
    observable transport behavior change.
- Approval Boundary: plain transport types, guards, and serialization only.
- Dependencies: Current-State Boundary Gate.
- Risks: schema drift or accidental framework coupling.
- Out of Scope: event bridging, document writes, panel lifecycle, and viewer UI.
- Implementation Feedback:
  - The boundary was appropriate. Existing transport builders and guards could
    be strengthened in place without moving event-bridge, document, or UI
    responsibilities into the slice.
  - The plan names the transport files with a `src/presentation/vscode/webview/`
    prefix, but the shared transport modules are actually under
    `src/presentation/webview/`; implementation and focused tests used those
    existing shared modules without changing the approved symbol boundary.
  - Full Web host validation on macOS requires permission to launch the bundled
    Playwright browser; record that requirement when reproducing the exact gate.
  - The initial deep payload guard increased qlty complexity; the final
    serialization-aware guard and request dispatch reduced that movement while
    preserving malformed-payload rejection. Future transport slices should
    include this quality check when estimating validation scope.

### Slice 3: Isolate the semantic-diff host adapter

- Status: Complete
- Scope: `src/presentation/vscode/commands/semanticDiffCommand.ts`,
  `src/bootstrap/extension/semanticDiffWiring.ts`, and semantic-diff host
  adapter tests. Keep active-editor access, file reads, cancellation, report
  display, and host error mapping outside Application.
- User / Domain Value: semantic diff remains available through a thin, testable
  host command without coupling the use case to VS Code.
- Cohesive Change Group: semantic-diff command and its composition wiring.
- Acceptance: active-editor and file-read failure paths are understandable,
  cancellation remains safe, and report content/telemetry behavior is preserved.
- Validation: `semanticDiffCommand.test.ts`,
  `semanticDiffReportDocument.test.ts`, `semanticDiffContracts.test.ts`,
  `semanticDiffConditions.test.ts`, `semanticDiffStructuralRules.test.ts`,
  `semanticDiffEvidenceRules.test.ts`, `semanticDiffSchedule.test.ts`,
  `semanticDiffScheduleRules.test.ts`, `semanticDiffFlowHighlights.test.ts`,
  `semanticDiffSampleCoverage.test.ts`,
  `src/test/suite/architectureDependencyRules.test.ts`,
  `rtk pnpm run build`, `rtk pnpm run test:full`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: missing editor, read failure, cancellation, and report failure
    use existing host-facing fallback behavior without raw errors crossing the
    application boundary.
  - JP1/AJS compatibility: preserve semantic-diff rules and definition meaning;
    no JP1/AJS command or configuration reference changes.
  - Large or malformed input risk: preserve cancellation and existing bounded
    report behavior for large or malformed definitions.
  - Desktop/web impact: command is desktop-hosted; shared report transport and
    `test:full` must remain green.
  - README/docs impact: none expected; CHANGELOG impact: none unless command
    behavior becomes visible to users.
- Approval Boundary: semantic-diff host command and wiring only.
- Dependencies: Current-State Boundary Gate. This command and its report
  wiring do not consume the viewer transport contract.
- Risks: accidentally combining preview-open concerns or moving file I/O into
  Application.
- Out of Scope: `openPreviewCommand.ts`, panel lifecycle, and webview routing.
- Implementation Feedback:
  - The Slice 3 boundary was appropriate: the existing composition wiring already
    injects VS Code editor, picker, file-system, report-display, and message
    operations, so the implementation stayed focused on command-level failure
    mapping without moving host concerns into Application.
  - Explicit mappings for picker/read, active-editor access, application
    exceptions, report rendering, report display, and notification failures make
    the host adapter retain repository-owned results instead of leaking raw
    exceptions. Future command slices should include these host-exception cases
    in their focused test estimate.
  - Desktop validation passed. The combined web host check remains blocked by
    the existing macOS Playwright Chromium launch permission failure; rerun it
    in an environment that permits the bundled browser before feature exit.

### Slice 4: Isolate the viewer-open command adapter

- Status: Complete
- Scope: `src/presentation/vscode/commands/openPreviewCommand.ts` and its
  existing focused command tests. Preserve the current injected panel-opening
  contract; composition changes remain owned by Slice 8.
- User / Domain Value: opening a viewer remains a small host operation with
  explicit failure and cancellation behavior.
- Cohesive Change Group: viewer-open command adapter only.
- Acceptance: requested viewer type, document selection, cancellation, and
  host error mapping remain unchanged; the command does not parse definitions.
- Validation: `openPreviewCommand.test.ts`,
  `src/test/suite/architectureDependencyRules.test.ts`,
  `rtk pnpm run build`, `rtk pnpm run test:full`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: unavailable document or panel failure produces the existing
    safe host outcome and never leaves a partial viewer state.
  - JP1/AJS compatibility: preserve viewer selection and document identity for
    existing definitions without changing JP1/AJS semantics.
  - Large or malformed input risk: opening remains lazy and does not duplicate
    or reinterpret malformed content.
  - Desktop/web impact: command adapter is desktop-facing; the final composition
    must pass both host runs.
  - README/docs impact: none expected; CHANGELOG impact: evaluate only for a
    visible command behavior change.
- Approval Boundary: `openPreviewCommand.ts` and its direct tests; no viewer
  wiring edits in this slice.
- Dependencies: Current-State Boundary Gate. The command's injected
  panel-opening contract is independent of viewer transport serialization.
- Risks: accidentally re-coupling command execution to composition details.
- Out of Scope: semantic diff, panel lifecycle, and viewer bundle composition.
- Implementation Feedback:
  - The Slice 4 boundary remained appropriate: active-editor access, panel
    creation, mounting, failure notification, and telemetry protection fit in
    the command adapter without changing viewer composition wiring.
  - Direct command tests should include host exceptions from editor access,
    panel creation, mounting, notification, and telemetry; the desktop host
    run alone does not exercise every injected failure path.
  - The web portion of `test:full` remains blocked by the existing macOS
    Playwright Chromium launch permission failure and must be rerun in an
    environment that permits the bundled browser before Feature Exit.

### Slice 5: Separate viewer document update handling

- Status: Complete
- Scope: `src/presentation/vscode/webview/ajsDocument.ts` and its direct test.
  Keep document refresh, save, cancellation, and write failures in the host
  adapter while passing normalized data through existing ports.
- User / Domain Value: viewer document state refreshes and saves predictably
  without moving file I/O into Application.
- Cohesive Change Group: document lifecycle and file-operation adapter.
- Acceptance: refresh, save success, cancellation, write failure, and disposal
  races retain existing behavior and error mapping.
- Validation: `AjsDocument.test.ts`,
  `src/test/suite/architectureDependencyRules.test.ts`, `rtk pnpm run build`,
  `rtk pnpm run test:full`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: failed or cancelled writes do not report false success or
    corrupt the current document state.
  - JP1/AJS compatibility: saved definition content and encoding behavior remain
    unchanged; no new JP1/AJS syntax is accepted.
  - Large or malformed input risk: preserve existing encoded, malformed, and
    large-document handling and avoid partial writes.
  - Desktop/web impact: document adapter is host-specific; shared message
    consumers must pass both desktop and web validation.
  - README/docs impact: none expected; CHANGELOG impact: none unless save UX or
    behavior changes.
- Approval Boundary: `ajsDocument.ts` adapter and its direct tests only.
- Dependencies: Slice 2 and the Current-State Boundary Gate. `ajsDocument.ts`
  emits the validated document-change payload but does not consume the
  preview-open command adapter.
- Risks: leaking host errors or conflating document refresh with routing.
- Out of Scope: message dispatch, telemetry routing, and viewer UI state.

### Slice 6: Separate viewer message and host-operation routing

- Status: Complete
- Scope: `src/presentation/vscode/webview/messageHandlers.ts` and
  `viewerMessageRouting.ts`, including resource mapping, save/resource operations,
  validated messages, and host-facing telemetry routing.
- User / Domain Value: messages cause one predictable host operation with clear
  failure behavior and no raw webview or parser internals at the boundary.
- Cohesive Change Group: webview message dispatch and host-operation bridge.
- Acceptance: invalid messages are rejected, refresh/save/resource operations
  route to the correct adapter, and privacy-safe telemetry remains catalogued.
- Validation: `viewerMessageRouting.test.ts`, `reportWebviewOperation.test.ts`,
  `src/test/suite/architectureDependencyRules.test.ts`, `rtk pnpm run build`,
  `rtk pnpm run test:full`, and
  `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: invalid operation, missing resource, cancellation, and host
    failure produce an understandable fallback and no false success.
  - JP1/AJS compatibility: resource and document identities retain current
    meanings; telemetry contains no definition content, paths, or identifiers.
  - Large or malformed input risk: validate before dispatch and do not duplicate
    large definition payloads across unrelated handlers.
  - Desktop/web impact: transport routing is shared; require `test:full`.
  - README/docs impact: none expected; CHANGELOG impact: evaluate only for a
    user-visible message or save behavior change.
- Approval Boundary: message routing and host-operation mapping only. The
  `viewerEventBridge.test.ts` ownership remains with Slice 20.
- Dependencies: Slice 2 and the Current-State Boundary Gate. Routing consumes
  validated request contracts but does not import the document-update adapter.
- Risks: duplicate dispatch, raw error leakage, or telemetry scope expansion.
- Out of Scope: panel lifecycle, composition, and presentation interaction.
- Implementation Feedback:
  - The slice boundary was appropriate. Existing message routing and host
    handlers could be hardened without moving panel lifecycle or viewer UI
    state into this slice.
  - The existing fire-and-forget host callbacks required explicit coverage for
    synchronous throws, asynchronous save rejection, safe notifications, and
    telemetry failures; future viewer adapter slices should estimate those
    failure-path tests explicitly.
  - No new dependency or design decision was needed. The Web host portion of
    the exact gate remains blocked on the existing macOS Playwright Chromium
    launch permission failure.

### Slice 7: Stabilize viewer panel lifecycle adapters

- Status: Complete
- Scope: `src/presentation/vscode/webview/ViewerFactory.ts`,
  `WebviewMediator.ts`, `WebviewStore.ts`, and `mountViewerPanel.ts`, with the
  lifecycle tests that prove reuse, readiness, retained context, and disposal.
- User / Domain Value: viewers open, reuse, become ready, and dispose without
  losing state or leaking host resources.
- Cohesive Change Group: panel lifecycle, readiness, and retained webview state.
- Acceptance: reuse, readiness handshake, disposal, retained context, and
  disposal races preserve current behavior in both viewer types.
- Validation: `viewerFactory.test.ts`, `webviewMediator.test.ts`,
  `webviewStore.test.ts`, `viewerBundle.test.ts`,
  `src/test/suite/architectureDependencyRules.test.ts`,
  `rtk pnpm run build`, `rtk pnpm run test:full`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: readiness timeout, disposed panel, or duplicate registration
    falls back safely without retaining dead resources.
  - JP1/AJS compatibility: panel lifecycle does not change parsed definition or
    viewer DTO meaning.
  - Large or malformed input risk: retain lazy initialization and avoid keeping
    unnecessary large payloads after disposal.
  - Desktop/web impact: panel behavior is host-sensitive; require exact
    desktop/web `test:full` evidence.
  - README/docs impact: none expected; CHANGELOG impact: none unless lifecycle
    behavior is visible.
- Approval Boundary: panel lifecycle and webview state adapters only.
- Dependencies: Slices 2 and 6. The lifecycle adapters consume viewer
  transport and routing contracts; document-update composition remains in
  Slice 8.
- Risks: readiness/disposal race or retained-context regression.
- Out of Scope: viewer command wiring, graph/table rendering, and navigation UX.
- Implementation Feedback:
  - The slice boundary was appropriate: panel registration, retained context,
    host event subscriptions, and disposal cleanup were stabilized without
    changing viewer wiring or composition ownership.
  - Clearing the store before disposing panels is required so synchronous
    disposal callbacks observe no live panel and cannot re-register dead
    resources. Future lifecycle slices should include this re-entrancy case.
  - Type compilation, focused desktop host tests, production build, and qlty
    passed. The exact web host run remains blocked by the existing macOS
    Playwright Chromium launch permission failure.

### Slice 8: Keep viewer composition and counterpart reveal atomic

- Status: Complete
- Scope: `src/bootstrap/extension/viewerWiring.ts`, including construction of
  application capabilities, viewer bundles, command registration, readiness
  callbacks, and the existing pending counterpart reveal behavior.
- User / Domain Value: Unit List and Flow viewers are composed from explicit
  dependencies and continue to reveal the corresponding unit when available.
- Cohesive Change Group: bootstrap composition-root lifecycle and its callback
  ownership. These two concerns remain one slice because the current
  `viewerWiring.ts` owns both the viewer bundle construction and the callback
  that resolves counterpart targets; splitting them would require an incomplete
  intermediate composition or duplicate ownership of the same file.
- Acceptance: dependencies are constructed only in permitted layers, viewer
  registration and readiness remain stable, pending reveals resolve or fall back
  safely, and telemetry remains privacy-safe.
- Validation: `viewerWiring.test.ts`, `extensionSubscriptions.test.ts`,
  `extensionRuntime.test.ts`, `extension.test.ts`,
  `src/test/suite/architectureDependencyRules.test.ts`,
  `rtk pnpm run build`, `rtk pnpm run test:full`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: unavailable counterpart, disposed viewer, or failed target
    resolution produces the existing safe fallback and does not strand focus.
  - JP1/AJS compatibility: stable unit identity, scope, and reveal semantics
    remain unchanged; no command/config rule changes.
  - Large or malformed input risk: reveal uses existing normalized identity and
    avoids reparsing or duplicating malformed definitions.
  - Desktop/web impact: this is the composition root; exact build and both host
    runs are mandatory.
  - README/docs impact: none expected; CHANGELOG impact: evaluate if command,
    reveal, or viewer lifecycle behavior changes.
- Approval Boundary: `viewerWiring.ts` composition and its existing counterpart
  callback only. Any separate reveal adapter or new composition seam requires
  Replanning Mode.
- Dependencies: Slices 2, 4, 5, 6, and 7. Semantic-diff wiring in Slice 3 is
  independent; Flow and Unit List presentation slices do not depend on this
  Bootstrap slice for implementation and use it only for final host validation.
- Risks: dependency construction in the wrong layer, stale pending reveal, or
  host-specific behavior leaking into shared presentation.
- Out of Scope: graph/table component extraction and application use-case logic.
- Implementation Feedback:
  - The atomic boundary remained appropriate: composition, readiness callbacks,
    counterpart reveal, and their shared pending state could be hardened without
    introducing a separate reveal adapter or changing downstream viewer seams.
  - Mount/reveal failure paths and telemetry exceptions needed direct focused
    coverage because the normal desktop activation path does not exercise those
    host failures.
  - The exact web host gate remains environment-limited by the macOS Playwright
    Chromium launch permission failure; reproduce it in a browser-permitted
    environment before Feature Exit.

### Slice 9: Extract Flow rendering and geometry responsibilities

- Status: Complete
- Scope: Flow rendering and geometry files under
  `src/presentation/webview/editor/ajsFlow/` only:
  `buildExpandedFlowGraph.ts`, `flowGraphView.ts`, `flowGraphPosition.ts`,
  `nodes/flowNodeDisplay.ts`, `nodes/nodeSxProps.ts`,
  `nodes/flowNodeGeometry.ts`, `expandedFlowGraphGeometry.ts`,
  `expandedFlowGraphGrowthOffsets.ts`, `expandedFlowGraphLayout.ts`,
  `expandedFlowGraphPanelIntrusion.ts`, `expandedFlowGraphPositionState.ts`,
  `expandedFlowGraphSiblingCollision.ts`, and `expandedFlowGraphTypes.ts`.
  The identically named Application use case
  `src/application/flow-graph/buildExpandedFlowGraph.ts` is not in scope.
- User / Domain Value: Flow graph DTOs render deterministically without moving
  graph meaning or placement constraints into React components.
- Cohesive Change Group: graph rendering, placement, node geometry, and style
  realization.
- Acceptance: node/edge meaning is consumed from existing Application DTOs and
  use cases, placement constraints and sibling collision behavior remain
  unchanged, and no parser internals or reconstruction of Application meaning
  is introduced into UI components.
- Validation: `buildExpandedFlowGraph.test.ts`, `flowGraphView.test.ts`,
  `flowNodeDisplay.test.ts`, `nodeSxProps.test.ts`,
  `src/test/suite/architectureDependencyRules.test.ts`,
  `rtk pnpm run build`, `rtk pnpm run test:full`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: missing geometry or malformed graph relations use existing
    fallback placement rather than rendering misleading edges.
  - JP1/AJS compatibility: graph DTO node, edge, hierarchy, and scope meaning
    remains unchanged.
  - Large or malformed input risk: retain deterministic bounded layout behavior
    and avoid quadratic work beyond the existing geometry responsibility.
  - Desktop/web impact: shared Flow rendering requires both host runs.
  - README/docs impact: none expected; CHANGELOG impact: evaluate only for a
    visible graph layout or interaction change.
- Approval Boundary: explicit geometry/node/style files listed above only.
- Dependencies: Current-State Boundary Gate only. Unit tests use application
  DTOs directly and prove geometry does not depend on panel/detail composition;
  `flowGraphHover.ts` and `flowGraphSelection.ts` are regression evidence in
  `flowGraphView.test.ts` and are not edited by this slice.
- Risks: geometry code reconstructing application semantics or introducing
  browser/host assumptions.
- Implementation Feedback: The approved Flow rendering and geometry boundary
  was already represented by the listed presentation modules before Slice 9;
  verification found no missing extraction or safe in-scope runtime change.
  Preserve this boundary and do not duplicate the application graph use case
  in later Flow presentation slices.
- Out of Scope: Flow detail panels, scope state, search, tree selection, and
  application graph construction.

### Slice 10: Extract Flow detail and responsive panel behavior

- Status: Complete
- Scope: `FlowNodeDetailPanel.tsx`, `flowNodeDetail.ts`,
  `useResponsiveFlowPanelCollapse.ts`, and the focused detail/panel tests.
- User / Domain Value: selecting a Flow node exposes its existing details and
  actions with predictable responsive and focus behavior.
- Cohesive Change Group: Flow detail presentation and responsive panel behavior.
- Acceptance: detail fields, relationship context, collapse/restore, focus
  restoration, and definition action behavior remain unchanged.
- Validation: `flowNodeDetail.test.ts`, `flowNodeDetailPanelCollapse.test.ts`,
  `src/test/suite/architectureDependencyRules.test.ts`, `rtk pnpm run build`,
  `rtk pnpm run test:full`, and
  `rtk pnpm run qlty`. `showUnitDefinitionInteraction.test.ts` is owned by
  Slice 20 because it covers cross-view/table shell integration.
- Production Readiness:
  - Failure mode: missing selected node or unavailable definition uses the
    existing empty/detail fallback without a broken panel.
  - JP1/AJS compatibility: displayed unit identity and effective values remain
    those supplied by the existing DTOs.
  - Large or malformed input risk: detail rendering remains bounded and does
    not reparse or reconstruct malformed application data.
  - Desktop/web impact: shared Flow detail behavior requires `test:full`.
  - README/docs impact: none expected; CHANGELOG impact: evaluate only for a
    visible detail or definition behavior change.
- Approval Boundary: detail and responsive panel files only.
- Dependencies: Current-State Boundary Gate only. The detail panel consumes
  existing DTOs and can be reviewed independently of Bootstrap composition and
  graph geometry.
- Risks: focus loss or presentation logic reconstructing domain meaning.
- Implementation Feedback: The approved detail boundary was already represented
  by `FlowNodeDetailPanel.tsx` and `flowNodeDetail.ts` before this slice;
  validation found no missing extraction or safe in-scope runtime change. The
  Flow-specific responsive hook module is a re-export seam, while the shared
  detail pane owns the actual responsive collapse lifecycle. Preserve both
  boundaries and do not duplicate responsive state in later Flow slices.
- Out of Scope: Flow graph geometry, scope state, search, and Unit List detail.

### Slice 11: Extract Flow graph scope and expansion state

- Status: Complete
- Scope: `useFlowGraphState.ts`, `useNestedExpansionState.ts`,
  `nestedExpansion.ts`, and `flowExpandedAncestors.ts`.
- User / Domain Value: current Flow scope, nested expansion, and collapsed
  ancestor resolution remain deterministic and independent of viewport effects.
- Cohesive Change Group: Flow graph state, scope, expansion, and ancestor-state
  primitives only.
- Acceptance: Enter/Escape scope transitions, nested expansion, ancestor
  revealing, expanded-unit identity, and unavailable graph fallback remain
  unchanged.
- Validation: `nestedExpansion.test.ts`, a planned focused
  `flowScopeState.test.ts` for `useFlowGraphState` and nested scope state,
  `src/test/suite/architectureDependencyRules.test.ts`,
  `rtk pnpm run build`, `rtk pnpm run test:full`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: missing graph or unavailable ancestor falls back to the
    existing current scope without throwing or showing partial graph state.
  - JP1/AJS compatibility: scope and hierarchy use existing graph DTO identity
    and do not alter JP1/AJS interpretation.
  - Large or malformed input risk: retain bounded expansion and ancestor work
    for deep or malformed relation trees.
  - Desktop/web impact: shared Flow state requires both host runs.
  - README/docs impact: none expected; CHANGELOG impact: evaluate only for a
    visible scope or expansion behavior change.
- Approval Boundary: graph/scope/expansion state files listed above only. No
  controller, viewport effect, search, or caller integration changes.
- Dependencies: Slices 2 and 9. `useFlowGraphState.ts` consumes the existing
  plain viewer message contract and Slice 9's Flow build/render helpers.
- Risks: scope stack corruption, stale expanded IDs, or partial graph fallback.
- Implementation Feedback: The approved Flow scope and expansion boundary was
  already represented by the listed presentation modules. No runtime change was
  required; the focused hook test now proves scope changes, nested expansion,
  ancestor reveal, and unavailable-graph fallback without widening ownership
  into controller or effects code.
- Out of Scope: viewport/document effects, search, keyboard behavior, and
  `useFlowViewerController.ts`.

### Slice 12: Extract Flow viewport, document, reveal, and overflow effects

- Status: Complete
- Scope: `useFlowViewerEffects.ts` and `flowViewportFocus.ts`, including fit,
  asynchronous focus, scope reset effects, document-change subscription,
  reveal-unit subscription, and the global viewer-overflow mount/unmount
  lifecycle.
- User / Domain Value: viewport focus, document refresh, reveal effects, and
  browser overflow cleanup stay stable without being mixed with controller
  composition or search state.
- Cohesive Change Group: Flow viewport/document/reveal/overflow effect
  orchestration.
- Acceptance: fit/zoom preservation, async focus restoration, document changes,
  scope reset, reveal-unit behavior, and overflow-style restoration on unmount
  remain unchanged.
- Validation: `flowViewerEffects.test.ts`, `flowViewportFocus.test.ts`,
  `unitDefinitionDocumentState.test.ts` covering subscriptions and overflow
  cleanup,
  `src/test/suite/architectureDependencyRules.test.ts`,
  `rtk pnpm run build`, `rtk pnpm run test:full`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: stale async focus, disposed document, unavailable target,
    failed reveal, or unmounted viewer falls back safely, restores global
    overflow styles, and does not trap focus.
  - JP1/AJS compatibility: document and unit identity remain those supplied by
    existing application DTOs and navigation contracts.
  - Large or malformed input risk: retain bounded viewport/reveal work and do
    not reparse malformed definitions in effects.
  - Desktop/web impact: shared effects require both host runs.
  - README/docs impact: none expected; CHANGELOG impact: evaluate only for a
    visible viewport, document, or reveal behavior change.
- Approval Boundary: viewport/document/reveal/overflow effects only. No
  controller public shape, search state, or Flow shell changes.
- Dependencies: Slices 2 and 11.
- Risks: effect ordering, disposal races, stale closures, false reveal success,
  or leaked global overflow styles.
- Implementation Feedback: The approved effect boundary was already present in
  `useFlowViewerEffects.ts`; the missing focused coverage was the main slice
  gap. Overflow cleanup needed to preserve and restore the styles that existed
  before the viewer mounted. No new dependency, architecture exception, or
  desktop/web contract change was discovered.
- Out of Scope: `useFlowViewerController.ts`, Flow search, keyboard primitives,
  and tree/caller composition.

### Slice 13: Extract shared tree and header-search controls

- Status: Complete
- Scope: `UnitTreeSelector.tsx`, `HeaderSearchField.tsx`,
  `unitTreeNavigation.ts`, `unitTreeSelection.ts`, `viewerAnnouncements.tsx`,
  `viewerSearchTelemetry.ts`, and `viewerThemeStyles.ts`.
- User / Domain Value: both viewers share consistent tree selection, search
  labeling, announcements, theme tokens, and accessibility behavior.
- Cohesive Change Group: shared viewer controls and accessibility/telemetry
  presentation helpers.
- Acceptance: focus ownership, selection handoff, localization, accessible
  labels, announcements, theme styles, and privacy-safe search telemetry remain
  stable in both viewers.
- Validation: `unitTreeSelector.test.ts`, `headerSearchField.test.ts`,
  `accessibilityDom.test.tsx`, `viewerAnnouncements.test.ts`,
  `viewerThemeStyles.test.ts`, `searchTelemetry.test.ts` as existing
  Application telemetry evidence, and `viewerSearchTelemetry.test.ts`;
  `src/test/suite/architectureDependencyRules.test.ts`,
  `rtk pnpm run build`, `rtk pnpm run test:full`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: missing selection or announcement target produces a safe
    fallback and does not trap keyboard focus.
  - JP1/AJS compatibility: shared controls display existing unit identity and
    do not alter JP1/AJS meaning; telemetry remains catalogued and minimal.
  - Large or malformed input risk: controls do not parse or duplicate definition
    content and retain bounded tree traversal.
  - Desktop/web impact: shared controls require both host runs and browser-safe
    imports.
  - README/docs impact: none expected; CHANGELOG impact: evaluate only for a
    visible accessibility or search behavior change.
- Approval Boundary: shared webview control/helper files and their direct tests.
- Dependencies: Slice 2 and the Current-State Boundary Gate.
- Risks: shared helper becoming a hidden application service or inconsistent
  focus semantics between viewers.
- Implementation Feedback: The shared control boundary was already present in
  the current source from the preceding accessibility work; the remaining
  Slice 13 evidence gap was the direct webview search-telemetry adapter test.
  No new dependency, architecture exception, or desktop/web contract change
  was discovered.
- Out of Scope: Flow-specific keyboard/tree orchestration and table rendering.

### Slice 14: Extract Flow search and reveal state

- Status: Complete
- Scope: `useFlowSearchState.ts`, `flowSearch.ts`, and `flowSearchState.ts` for
  Flow search matching, result ordering, ancestor reveal, and centering. The
  shared `viewerSearchTelemetry.ts` adapter remains owned by Slice 13; the
  existing Application `src/application/telemetry/searchTelemetry.ts` is not
  extracted or renamed by this feature.
- User / Domain Value: users can find a unit in the current Flow scope without a
  new shared search domain contract.
- Cohesive Change Group: Flow search state and matching/reveal logic while
  preserving the shared telemetry call.
- Acceptance: case-insensitive current-scope matching, collapsed-ancestor
  reveal, deterministic result order, centering, and the existing call to the
  shared privacy-safe telemetry adapter are unchanged.
- Validation: `flowSearch.test.ts`, `flowSearchState.test.ts`, focused
  `flowSearchController.test.ts` for `useFlowSearchState`,
  `src/test/suite/architectureDependencyRules.test.ts`,
  `rtk pnpm run build`, `rtk pnpm run test:full`, and `rtk pnpm run qlty`;
  Slice 14 validation: focused search/controller tests, test compilation,
  desktop host, production build, qlty, Markdown lint, and diff check passed;
  the web host remains blocked by the existing macOS Playwright Chromium
  launch permission failure.
- Production Readiness:
  - Failure mode: no result or stale result returns the existing empty state and
    does not move focus to an unrelated node.
  - JP1/AJS compatibility: search uses existing unit identity and display data;
    telemetry contains no definition content or path.
  - Large or malformed input risk: preserve bounded current-scope matching and
    avoid whole-document reparsing.
  - Desktop/web impact: shared Flow search requires both host runs.
  - README/docs impact: none expected; CHANGELOG impact: evaluate only for a
    visible search behavior change.
- Approval Boundary: Flow search state and matching/reveal logic only. No
  telemetry contract or controller public-shape changes.
- Dependencies: Slices 11 and 13. Slice 13 owns the shared viewer telemetry
  adapter consumed by `useFlowSearchState`; Slice 14 does not edit the
  Application telemetry contract.
- Risks: search state becoming a hidden shared domain service or revealing a
  node outside the active scope.
- Implementation Feedback: The pure submission decision and ancestor merge
  belong with Flow search matching, while `useFlowSearchState` remains the
  React/navigation/telemetry adapter. A dedicated hook test was needed to
  prove setter ordering, reveal scope changes, and privacy-safe telemetry
  calls beyond the existing pure matching and state-transition tests. No new
  dependency, architecture exception, or desktop/web contract change was
  discovered.
- Out of Scope: shared header controls, keyboard primitives, and table search.

### Slice 15: Extract Flow keyboard and relationship-focus primitives

- Status: Complete
- Scope: `flowKeyboardNavigation.ts`, `flowKeyboardNavigationActions.ts`,
  `flowRelationshipFocus.ts`, `flowViewerShortcuts.ts`, and
  `useFlowFocusModeState.ts`, plus `flowAccessibility.ts` because its
  keyboard/focus semantics are proven by the same accessibility contract.
- User / Domain Value: keyboard-only Flow navigation, focus mode, relationship
  focus, and shortcut semantics remain understandable and deterministic.
- Cohesive Change Group: Flow keyboard/focus primitives, independent of the
  larger FlowContents orchestration component.
- Acceptance: spatial movement, D/L/R/Escape shortcuts, relationship focus,
  focus mode, and tree/graph handoff preserve current behavior.
- Validation: `flowKeyboardNavigation.test.ts`, `flowRelationshipFocus.test.ts`,
  `flowViewerShortcuts.test.ts`, `flowAccessibility.test.ts`,
  `src/test/suite/architectureDependencyRules.test.ts`, `rtk pnpm run build`,
  `rtk pnpm run test:full`, and `rtk pnpm run qlty`; Slice 15 validation:
  test compilation, focused helper coverage in the desktop Extension Host,
  production build, desktop/web host validation, qlty, Markdown lint, and diff
  check passed; the web host completed with only the existing stream cleanup
  logs after host scenarios completed.
- Production Readiness:
  - Failure mode: unavailable target or unsupported key uses the existing no-op
    or fallback focus behavior without trapping the user.
  - JP1/AJS compatibility: keyboard targets resolve through existing stable
    graph/unit identity and scope data.
  - Large or malformed input risk: navigation does not scan or reparse the full
    definition for each key event.
  - Desktop/web impact: shared webview keyboard behavior requires both hosts.
  - README/docs impact: none expected; CHANGELOG impact: evaluate only for a
    visible keyboard behavior change.
- Approval Boundary: keyboard/focus primitives only; caller composition belongs
  to Slice 17.
- Dependencies: Slice 10 for `flowRelationshipFocus.ts`, plus the Current-State
  Boundary Gate. The keyboard primitives retain existing hook and DTO contracts
  and do not depend on Bootstrap or table presentation.
- Risks: shortcuts overriding browser/VS Code expectations or focus divergence.
- Implementation Feedback: The slice boundary was appropriate; the existing
  helper seams allowed malformed-input safeguards and relationship-edge
  evaluation improvements without changing caller composition. Targeted
  regression coverage for unsupported keys and cyclic scope parents improved
  validation. No new dependency, architecture exception, or desktop/web
  contract change was discovered.
- Out of Scope: `FlowContents.tsx`, `FlowSelector.tsx`, Flow header composition,
  and Unit List keyboard behavior.

### Slice 16: Extract Flow controller composition

- Status: Complete
- Scope: `useFlowViewerController.ts` and `flowTreeSelection.ts`.
  Preserve the existing public hook shape while composing the already-separated
  graph state, effects, search, detail, and keyboard primitives.
- User / Domain Value: Flow state is composed through one explicit controller
  boundary without forcing later presentation slices to edit a cross-cutting
  orchestrator.
- Cohesive Change Group: Flow controller orchestration and tree-selection
  composition.
- Acceptance: the controller returns the same graph, detail, search, focus,
  mini-map, navigation, and lifecycle values/actions; tree-selection targets
  remain stable; no new domain or host dependency is introduced.
- Validation: planned focused `flowViewerController.test.ts` and
  `flowTreeSelection.test.ts`; `flowRelationshipFocus.test.ts`,
  `flowViewerShortcuts.test.ts`, and `flowMiniMap.test.ts` are existing
  Slice 15/helper-owned regression evidence,
  `src/test/suite/architectureDependencyRules.test.ts`,
  `rtk pnpm run build`, `rtk pnpm run test:full`, and `rtk pnpm run qlty`.
  Slice 16 validation: focused controller/tree-selection tests, test
  compilation, production build, qlty, diff check, desktop Extension Host,
  and web Extension Host validation passed. The combined host command reached
  desktop successfully; its web launch was retried with the permitted macOS
  Playwright browser after the sandbox launch permission failure.
- Production Readiness:
  - Failure mode: missing graph state, stale selection, unavailable detail, or
    disposed viewer returns the existing safe fallback and does not trap focus.
  - JP1/AJS compatibility: controller passes through existing graph/unit DTOs,
    scope identity, and navigation semantics without reinterpretation.
  - Large or malformed input risk: orchestration delegates bounded work to the
    state/effect/search helpers and does not add full-document scans.
  - Desktop/web impact: shared controller composition requires both host runs.
  - README/docs impact: none expected; CHANGELOG impact: evaluate only for a
    visible Flow behavior change.
- Approval Boundary: controller and tree-selection composition only. Later
  Flow shell work consumes the preserved hook contract and must not edit these
  files.
- Dependencies: Slices 2, 10, 11, 12, 14, and 15. Existing hover, selection,
  and minimap helpers remain unchanged and are not implementation dependencies.
- Risks: stale callback wiring, accidental controller scope expansion, or
  public return-shape drift.
- Implementation Feedback: The boundary was appropriate; moving tree-selection
  orchestration into its existing helper kept the controller public shape and
  effect contracts unchanged. Focused tests for the public return shape and
  nested ancestor reveal provide useful regression coverage for Slice 17.
  No new dependency, architecture exception, or desktop/web contract change
  was discovered.
- Out of Scope: Flow rendering helpers, viewport/effect internals, search
  matching, keyboard primitive implementation, and Flow shell components.

### Slice 17: Integrate Flow tree, selector, and caller composition

- Status: Complete
- Scope: `FlowContents.tsx`, `FlowSelector.tsx`, and `Header.tsx` under
  `src/presentation/webview/editor/ajsFlow`.
  This slice wires the already-separated geometry, detail, state, search,
  shared-control, and keyboard responsibilities without reimplementing them.
  Existing `flowGraphHover.ts`, `flowGraphSelection.ts`, `flowMiniMap.ts`,
  `useFlowMiniMapState.ts`, `useHoveredFlowNodeState.ts`, and
  `useSelectedFlowNodeState.ts` remain unchanged helpers; changing any of them
  requires Replanning Mode.
- User / Domain Value: the Flow viewer remains a coherent accessible tree/graph
  experience after the smaller presentation responsibilities are separated.
- Cohesive Change Group: Flow tree/selector/header caller integration.
- Acceptance: tree selection, header search, keyboard actions, detail panel,
  scope/expansion, focus, and graph rendering retain current behavior.
- Validation: `flowSelector.test.ts`, `flowHeader.test.ts`, and a planned
  focused `flowContentsIntegration.test.ts`,
  `src/test/suite/architectureDependencyRules.test.ts`,
  `rtk pnpm run build`, `rtk pnpm run test:full`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: missing or stale child state uses the existing empty/fallback
    rendering and leaves focus recoverable.
  - JP1/AJS compatibility: caller wiring passes existing graph DTOs and unit
    identity without reconstructing application meaning.
  - Large or malformed input risk: retain virtualization/viewport safeguards and
    avoid adding full-definition scans to the orchestration component.
  - Desktop/web impact: Flow integration requires exact desktop/web validation.
  - README/docs impact: none expected; CHANGELOG impact: evaluate if combined
    Flow behavior becomes user-visible.
- Approval Boundary: Flow caller composition only; `flowTreeSelection.ts` and
  `useFlowViewerController.ts` are owned by Slice 16, while the smaller helper
  files are owned by Slices 9-15.
- Dependencies: Slices 2, 9, 10, 11, 12, 13, 14, 15, and 16. These are
  presentation helper contracts only; Bootstrap composition is not an
  implementation dependency.
- Risks: `FlowContents.tsx` remains a high-complexity integration point; do not
  add new responsibilities while wiring existing ones.
- Out of Scope: application graph construction, unrelated visual redesign, and
  changes to the listed existing Flow hover/selection/minimap helpers.
- Implementation Feedback: The caller boundary was sufficient to preserve the
  existing controller contract while making FlowSelector consume a plain scope
  identity and explicit scope-opening action. A focused FlowContents integration
  test was needed because the existing selector and header tests did not prove
  their connection to document, graph, search, and relationship-focus state.

### Slice 18: Extract Unit List rendering, columns, and export mapping

- Status: Approved
- Scope: `DisplayColumnSelector.tsx`, `Header.tsx`, `TableHeader.tsx`,
  `tableColumnDef.tsx`, `tableViewerData.ts`, `tableSearchState.ts`,
  `globalFilter.ts`, and `exportCsvView.ts` under `ajsTable`.
- User / Domain Value: Unit List rows, visible columns, search/sort presentation,
  and CSV request mapping remain deterministic and separate from virtualization.
- Cohesive Change Group: table rendering/data mapping and CSV view mapping.
- Acceptance: row identity, effective values, visible-column order, sorting/search
  presentation, localized headers, and CSV mapping remain unchanged.
- Validation: `tableColumnDef.test.ts`, `ajsTableHeader.test.ts`,
  `tableViewerData.test.ts`, `tableSearchState.test.ts`,
  `ajsTableGlobalFilter.test.ts`, `exportCsvView.test.ts`,
  `csvExportTelemetry.test.ts`,
  `src/test/suite/architectureDependencyRules.test.ts`, `rtk pnpm run build`,
  `rtk pnpm run test:full`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: missing columns or invalid row metadata use the existing safe
    outcome and cannot create a partial export.
  - JP1/AJS compatibility: preserve row fields, effective values, ordering,
    visible columns, escaping, and CSV meaning.
  - Large or malformed input risk: retain large-list and escaping fixtures; do
    not repair malformed application DTOs in presentation.
  - Desktop/web impact: shared table data/render mapping requires both hosts.
  - README/docs impact: none expected; CHANGELOG impact: evaluate if visible
    table or export behavior changes.
- Approval Boundary: table rendering/data mapping and CSV request mapping only.
- Dependencies: Slices 2 and 13, plus the Current-State Boundary Gate. Table
  rendering/data mapping does not depend on document I/O or host message
  routing implementation.
- Risks: visible-column drift, transient row IDs, or application meaning being
  reconstructed in column definitions.
- Out of Scope: application list/CSV semantics, file writes, virtualization,
  detail panels, and counterpart navigation.

### Slice 19: Extract Unit List virtualization and grid focus

- Status: Approved
- Scope: `VirtualizedTable.tsx`, `navigation.ts`, and `tableRowReveal.ts` under
  `ajsTable`. Keep the table shell and its search controller out of this slice
  so virtualization/focus can be reviewed independently.
- User / Domain Value: large Unit Lists remain performant, keyboard-accessible,
  and deterministic when sorting, revealing, and restoring focus.
- Cohesive Change Group: table virtualization, grid movement, row reveal, and
  focus primitives.
- Acceptance: virtualization, row reveal, sorting restoration, grid/tree handoff,
  and keyboard focus behavior remain unchanged for large lists.
- Validation: `tableNavigation.test.ts` and a planned focused
  `tableVirtualizationFocus.test.ts`;
  `src/test/suite/architectureDependencyRules.test.ts`, `rtk pnpm run build`,
  `rtk pnpm run test:full`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: missing row/cell or stale sort state restores a meaningful
    selected item or defined fallback without trapping focus.
  - JP1/AJS compatibility: row identity and list-to-flow target data remain
    stable; no application navigation semantics are changed.
  - Large or malformed input risk: retain virtualization and bounded row work;
    malformed DTOs do not trigger reparsing or partial list fabrication.
  - Desktop/web impact: shared table interaction primitives require both hosts.
  - README/docs impact: none expected; CHANGELOG impact: evaluate if focus or
    large-list interaction changes visibly.
- Approval Boundary: virtualization/grid/focus primitives only; shell and
  counterpart caller integration belongs to Slice 20.
- Dependencies: Slices 2 and 18.
- Risks: focus loss, DOM state replacing stable identity, or large-list slowdown.
- Out of Scope: `TableContents.tsx`, Unit List detail composition, and
  list-to-Flow command wiring. `tableSearchController.ts` is owned by Slice 20.

### Slice 20: Integrate Unit List shell, search, detail, and cross-view navigation

- Status: Approved
- Scope: `TableContents.tsx`, `tableSearchController.ts`,
  `UnitListDetailPanel.tsx`, and `unitListDetail.ts` under `ajsTable`. Wire the
  already-separated table data and virtualization responsibilities to search,
  detail inspection, and counterpart reveal. This slice owns
  `viewerEventBridge.test.ts`, `revealUnit.test.ts`, and
  `showUnitDefinitionInteraction.test.ts` so those tests have one owner.
- User / Domain Value: the Unit List remains a coherent large-list search,
  detail, and Flow-counterpart experience after the smaller table
  responsibilities split.
- Cohesive Change Group: Unit List shell/search orchestration, detail
  presentation, and cross-view caller integration.
- Acceptance: table rendering, search/sort, virtualization, detail inspection,
  definition action, Enter/L/Space/H semantics, focus restoration, and
  list-to-Flow reveal retain current behavior.
- Validation: `tableNavigation.test.ts` is owned by Slice 19 and is rerun as
  integration evidence; Slice 20 owns `revealUnit.test.ts`,
  `viewerEventBridge.test.ts`, and `showUnitDefinitionInteraction.test.ts`,
  plus planned focused `tableSearchController.test.ts` and
  `tableShellIntegration.test.ts`. Also run
  `src/test/suite/architectureDependencyRules.test.ts`,
  `rtk pnpm run build`, `rtk pnpm run test:full`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode: unavailable unit, definition, counterpart, or stale search
    result uses the existing safe fallback and does not corrupt table state.
  - JP1/AJS compatibility: stable unit identity, effective values, scope, and
    definition display remain unchanged.
  - Large or malformed input risk: shell delegates to bounded virtualization
    and never reparses or fabricates malformed application data.
  - Desktop/web impact: table shell and counterpart behavior require exact
    desktop/web validation.
  - README/docs impact: none expected; CHANGELOG impact: evaluate for any
    visible table/detail/navigation behavior change.
- Approval Boundary: table shell/search/detail/cross-view caller integration
  only; no application navigation, CSV, parser, or transport schema changes.
- Dependencies: Slices 2, 13, 18, and 19. Final host validation also requires
  Slice 8, but the Unit List presentation source does not depend on Bootstrap
  composition or message-routing implementation.
- Risks: `TableContents.tsx` remains a high-complexity integration point,
  stale search or counterpart events, and overlapping focus ownership.
- Out of Scope: application list/CSV semantics, graph construction, and Flow
  presentation helper extraction.

## Traceability

- `TRACEABILITY.md` required: yes
- Reason: this is a non-trivial JP1/AJS compatibility-preserving feature with
  multiple host, transport, lifecycle, application, and desktop/web
  presentation boundaries. The current-state gate and each residual slice need
  explicit use-case, acceptance, and validation correspondence.

## Cross-Slice Dependencies

- Current-State Boundary Gate precedes all implementation slices.
- Slice 1 is independent after the gate and precedes no other slice by file
  ownership; its capability name is the only approved application naming change.
- Slice 2 precedes Slices 5, 6, 7, 8, 11, 12, 13, 17, 18, 19, and 20
  where the selected source consumes a viewer transport contract.
- Slices 3 and 4 are independently approvable after the gate. Slice 3 has no
  implementation-slice dependency; Slice 4 precedes Slice 8 because the
  composition root invokes its injected panel-opening contract.
- Slice 5 precedes Slice 8 for document-update composition.
- Slice 6 precedes Slices 7 and 8.
- Slice 7 precedes Slice 8.
- Slice 8 is required for final host integration validation only; it is not an
  implementation dependency of Flow or Unit List presentation slices.
- Slice 9 is independent after the Current-State Boundary Gate and precedes
  Slices 11 and 17 because they consume its Flow build/render helpers.
- Slice 10 is independent after the Current-State Boundary Gate and precedes
  Slices 15, 16, and 17 for detail and relationship-focus validation.
- Slice 11 precedes Slices 12, 14, 16, and 17.
- Slice 12 precedes Slices 16 and 17.
- Slice 13 precedes Slices 14, 17, 18, and 20.
- Slice 14 precedes Slices 16 and 17.
- Slice 15 precedes Slices 16 and 17.
- Slice 16 precedes Slice 17; later Flow shell work consumes its preserved
  controller contract without editing its files.
- Slice 18 precedes Slices 19 and 20.
- Slice 19 precedes Slice 20.
- `rtk pnpm run test:full` and the final build/quality checks are feature-level
  evidence after Slice 20, not an additional implementation slice.

## Feature-Level Risks

- Existing application seams may be mistaken for unfinished implementation;
  the Current-State Boundary Gate prevents duplicate extraction.
- No source or test file may be owned by more than one implementation slice.
  If a caller needs a changed shared interface, stop and use Replanning Mode.
- The plan deliberately preserves existing application names except for the
  `DiagnoseAjsDefinition` clarity rename. Renaming other capabilities is out of
  scope unless separately approved.
- Viewer composition and counterpart reveal are the one documented atomic
  exception to further slice splitting because `viewerWiring.ts` owns both
  lifecycle construction and its reveal callback. A new adapter would require a
  new design decision and replan.
- Flow search owns matching and reveal state only. `viewerSearchTelemetry.ts`
  is shared presentation infrastructure owned by Slice 13, while
  `src/application/telemetry/searchTelemetry.ts` and its existing test remain
  outside this extraction.
- `useFlowViewerController.ts` is owned by Slice 16 as the existing orchestration
  seam. Slice 17 must preserve its public hook shape and must not edit that file;
  a required controller redesign triggers Replanning Mode.
- `useFlowViewerEffects.ts` is owned by Slice 12 and `useFlowGraphState.ts` by
  Slice 11. Slice 16 consumes their public contracts; changing those contracts
  after ownership passes requires Replanning Mode.
- Slice 12 also owns the viewer-overflow lifecycle and its cleanup evidence.
  Slice 16 and Slice 17 consume that effect boundary without mutating it.
- `flowTreeSelection.ts` and its planned focused test are owned by Slice 16;
  `flowSelector.test.ts` and `flowHeader.test.ts` are Slice 17 caller evidence.
- Existing Flow hover, selection, and minimap helpers listed in Slice 17 are
  intentionally unchanged. Any required edits to them trigger Replanning Mode.
- `tableSearchController.ts` and its planned focused test are owned by Slice 20
  with the table shell, not by the virtualization/focus Slice 19.
- Baseline Intake groups 3, 4, 7, 8, 9, 10, and 11 overlap later roadmap
  features. This feature selects only the residual boundaries named here.
- Existing qlty findings must not be treated as regressions without evidence;
  new actionable smells require resolution or an approved follow-up.
- Any observable diagnostic, command, table, flow, navigation, compatibility,
  or error-behavior change requires CHANGELOG evaluation and possible replan.
- JP1/AJS command/config reference impact is none. Preserve
  `jp1-diagnostic-parameter-rules.md`, its JP1/AJS3 version 13 references, and
  all existing definition-file compatibility rules.

## Use-Case Back-Propagation

- The durable Diagnose, Flow Graph, Explore Flow Graph, View Unit List, Export
  Unit List CSV, and cross-view navigation use cases remain authoritative.
- Feature Exit must confirm no slice changed their observable rules and
  propagate only durable boundary or terminology decisions.
- Existing parser, graph, list, CSV, and navigation contracts are evidence to
  preserve, not implementation history to copy into durable documents.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: the complete reviewed Application Use Case Extraction plan,
  including Slices 1-20, their dependencies, approval boundaries, validation,
  production-readiness constraints, traceability, and the Current-State
  Boundary Gate. No runtime code, tests, generated artifacts, configuration,
  or implementation commit is included in this approval.
- Slice 13 implementation approval: Approved in the current conversation for
  the approved shared webview control/helper files and their direct tests;
  Flow-specific keyboard/tree orchestration and table rendering remain out of
  scope.
- Slice 14 implementation approval: Approved in the current conversation for
  the approved Flow search state, matching, ancestor reveal, centering, and
  direct focused tests; the shared telemetry adapter, Application telemetry
  contract, and controller public shape remain out of scope.

## Feature Exit

- Definition of Done status: not evaluated
- Durable documentation updates: evaluate only durable boundary or terminology
  changes; do not propagate temporary refactoring notes.
- Open risks: revised plan review, Human Approval, all proposed slices,
  integration validation, and Feature Exit remain pending.

## Validation Checklist

- [ ] Pass the Current-State Boundary Gate before implementation approval.
- [ ] Implement and validate Slices 1-20 in dependency order, one approved
      slice at a time.
- [ ] Record qlty differential evidence and resolve or approve new actionable
      smells for every code slice.
- [ ] Run `rtk pnpm run build`, `rtk pnpm run test:full`,
      `rtk pnpm run lint:md`, and `rtk git diff --check` at feature exit.
- [ ] Update README or user documentation only if observable behavior changes.
- [ ] Evaluate CHANGELOG impact using `docs/specs/README.md` criteria.

## Notes

- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for implementation-slice planning, approval state,
  dependencies, validation, risks, production readiness, and Feature Exit
  readiness only.

<!-- markdownlint-enable MD013 -->
