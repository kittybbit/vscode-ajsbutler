# Feature Tasks: Telemetry simplification

## Agent Brief

- Purpose: seven fixed events and four enum properties; preserve JP1/AJS,
  viewer/search/export/import/comparison/editor behavior under [SPECS](SPECS.md).
- Active slice: S1; original 105-path plan reviewed Ready and Human Approved.
  The one-test-path delta is Human Approved (106 paths). The cleanup delta
  below adds four paths and changes the import boundary; it is Human Approved.
- Read: requirements R1–R9, S1 scope/design/checks below,
  [traceability](TRACEABILITY.md), and the
  [planning discovery](/tmp/ajsbutler-telemetry-plan-20261017/discovery.md).
- Prohibitions: no implementation before the approved planning commit;
  no identifiers, generic tracker, timeout, dual sending, architecture exception,
  dependency/engine/configuration change or inherited-feature edit.
- Next operation: commit the approved cleanup replan, then resume implementation.
  Existing implementation remains incomplete; preserve its current patch.

## Current state and gate

- Lifecycle state: APPROVED
- Feature: `docs/specs/features/telemetry-simplification` (transient branch).
- Mode: Replanning, direct-builder cleanup delta; predecessor intake identity
  `cc4914f191b6921377a4722ac579d72d2aedd84f30633a7dbd3e05813c5a1571`.
- Branch: `codex/telemetry-simplification`; comparison base `origin/main` =
  `4ef3356dddad932ec514fb949831555b8ea77447`.
- Original plan review: Ready; no Findings. Approved planning/implementation
  base commit: `5d28d9f5ce0b9c8c9546962153e1963438e8d090`.
  Reviewed substantive plan identity:
  `0dd582e615f1c6aaa5d57d48f67d6b6d3b17b15bd4bc84935185009cd99367aa`.
  Review record: [independent review](/tmp/ajsbutler-telemetry-plan-20261017/review.md).
- Human Approval: Status: Approved;
  Approved at: approved in current conversation (2026-10-17).
  Approved scope: reviewed S1 outcomes, Solution Shape and required validation.
  Approved paths: original 105 exact paths in the
  [approved manifest](/tmp/ajsbutler-telemetry-plan-20261017/proposed-paths.txt);
  no additional paths. Original approval/provenance remains unchanged.
- Approval covers: S1 outcomes, Solution Shape, exact product/support/docs
  paths below and required validation. Closure removal remains a separate gate.
- S1 runtime implementation exists but is incomplete; no implementation Ready,
  completion review/approval/commit, Feature Exit, Closure Approval or Human
  Merge Approval is claimed.

Apply [lifecycle and approvals](../../README.md#lifecycle-and-approval-gates).

## Approved direct-builder cleanup delta

- Trigger: user requests removal of files that only re-export symbols. Main
  selected direct typed-builder imports with no replacement wrapper. Existing
  full ESLint also identifies one baseline unused import requiring correction.
- Prior approved boundary: 106 paths; one-path replan commit
  `de86f73f86fc1466802bb9f025cce0784090cad8`. Original plan/approval and that
  delta's approval remain intact; only the design/scope below needs renewal.
- Delete five pure re-export modules already in S1 scope:
  `src/application/telemetry/extensionLifecycleTelemetry.ts`,
  `src/application/telemetry/searchTelemetry.ts`,
  `src/application/telemetry/viewerActionTelemetry.ts`,
  `src/application/telemetry/webApiImportTelemetry.ts`,
  `src/application/telemetry/semanticDiffTelemetry.ts`.
  The last file is currently untracked: omit it from the final patch rather
  than committing a new stub. Remove the re-export clause in retained
  `viewerTelemetry.ts`; retain its actual `resolveViewerTelemetryKind` logic.
- Affected existing paths: retarget imports in `extensionLifecycle.ts`,
  `viewerWiring.ts`, `webapiImportWiring.ts`, `semanticDiffWiring.ts` under
  `src/bootstrap/extension/`, and `viewerMessageRouting.ts` under
  `src/presentation/vscode/webview/`, and
  `src/presentation/vscode/telemetryHost.ts`. Retarget imports in existing suites
  `extensionLifecycle.test.ts`, `searchTelemetry.test.ts`,
  `viewerActionTelemetry.test.ts`, `webApiImportTelemetry.test.ts`,
  `semanticDiffTelemetry.test.ts` and `viewerTelemetry.test.ts` under
  `src/test/suite/`, retaining their meaningful assertions.
  Existing `src/test/suite/architectureDependencyRules.test.ts` verifies the
  revised semantic import boundary described in Solution Shape below.
- Four exact approved additions (S1 total: 110 paths):
  `src/test/support/architectureSourceAnalysis.ts`,
  `src/test/support/architectureDependencyRules.ts`,
  `src/test/suite/architectureSourceAnalysis.test.ts`,
  `src/application/unit-list/buildUnitListRemainingGroups.ts`.
  The unit-list file permits only removal of its unused `ParamSymbol` import;
  unit-list behavior, exports and implementation remain unchanged. The three
  architecture files permit only the narrow named-import metadata/rule/tests.
- Proposed outcome: seven builders/public enum types are consumed directly from
  their substantive owner; no catalog/generic raw access, SDK exposure, new
  wrapper/analyzer or architecture exception. All R1–R9 behavior remains intact.
- Delta review: Ready for approval; no Findings.
  Reviewed plan identity:
  `365d837529e17ad1de65528ba351835a3f055358ba08e03a4df04b50d5383c17`.
  Review: [cleanup review](/tmp/ajsbutler-telemetry-replan-builders-20261017/review.md).
  Delta Human Approval: Status: Approved;
  Approved at: approved in current conversation (2026-10-17).
  Approved scope: the reviewed direct-builder cleanup design, five wrapper
  removals, four exact path additions and affected validation described here.
  Resume after the focused replan commit. Other approvals remain intact.
- Evidence: [cleanup discovery](/tmp/ajsbutler-telemetry-replan-builders-20261017/discovery.md),
  [delta validation](/tmp/ajsbutler-telemetry-replan-builders-20261017/validation.json).
  Starting implementation snapshot identity:
  `076bba80d2d3e5045ef3ed320fac0301de876259131fb327cedb4df17d637f72`.
  Runtime work remains incomplete; no implementation Ready/final pass claimed.

## Approved one-path approval delta

- Trigger: approved Flow `nodes/Utils.ts` removes retired nested-toggle
  telemetry, but an existing interaction test outside the original boundary
  still expects that retired message. Its path is restored to HEAD.
- Approved S1 path addition: `src/test/suite/showUnitDefinitionInteraction.test.ts`.
  Approved S1 boundary total: 106 exact paths (original 105 plus this path).
- Exact test delta: preserve the existing functional toggle assertion; change
  the message expectation to `[]` and clarify the test title. No production,
  behavior, Solution Shape, dependency, compatibility, risk tier, validation
  command/coverage strategy or closure-boundary change is proposed.
- Proposal: [reviewable test delta](/tmp/ajsbutler-telemetry-s1-20261017/approval-boundary/showUnitDefinitionInteraction.test.ts.proposal.diff).
- Delta review: Ready for approval; no Findings.
  Reviewed plan identity:
  `4ae21c0ef9eb6e0e84e704cf69a06b9ef4a4ed513da53d915b381cda6633b903`.
  Review: [delta review](/tmp/ajsbutler-telemetry-replan-path-20261017/review.md).
  Delta Human Approval: Status: Approved;
  Approved at: approved in current conversation (2026-10-17).
  Approved scope: this exact one-test-path addition and preserved functional
  assertion with no retired telemetry, as independently reviewed.
  Resume this test edit after the focused replan commit.
- Original 105-path Human Approval, review and planning commit remain intact.
  Only affected delta review/approval and scope-dependent evidence need renewal.
  The existing final S1 checks still apply and include this interaction suite;
  preserve incomplete implementation and do not claim its final checks passed.
- Delta discovery and exact content/check identity:
  [discovery](/tmp/ajsbutler-telemetry-replan-path-20261017/discovery.md),
  [documentation validation](/tmp/ajsbutler-telemetry-replan-path-20261017/validation.json).

## Native stack

One implementation slice is one native stack layer and PR. Narrowing the closed
catalog changes every existing caller, DTO and obsolete assertion; splitting
catalog and callers would require a broken intermediate or the forbidden dual
schema. Splitting cleanup/tests/docs would leave retired instrumentation or an
inaccurate collection notice. The single coherent layer has standalone value:
the complete smaller privacy contract, including Semantic Diff, works at its
head. Internal work order is not a second slice or approval gate.

- Trunk/target: `main`.
- Layer S1 branch/head ref: `codex/telemetry-simplification`; PR: not created.
- Layer predecessor/base: `origin/main` at the SHA above. Planning package
  precedes implementation on this branch; approved implementation base is
  `5d28d9f5ce0b9c8c9546962153e1963438e8d090`.
- Layer head/reviewed diff: not established; record exact base/head commit and
  content identities, PR URL and acceptance evidence at review/publication.
- Top integration head: S1 head; no integration branch or integration-only PR.
- Completion: independent Ready, explicit Completion Approval and focused commit.
- Closure propagation/removal lands in this same top PR after Feature Exit,
  required independent closure-patch Ready and explicit Closure Approval.
- Merge: explicit Human Merge Approval must name final PR, order (S1 only),
  `main`, head, method, closure commit and current GitHub gates. Respect actual
  rules/checks/reviews. Only observed merge with result SHA establishes CLOSED.
- Base/head changes renew affected diff review/base-dependent evidence under
  [freshness](../../evidence.md#freshness-and-invalidation); matching independent
  results are reused. Pending/partial integration never counts as CLOSED.

## S1: Complete minimum telemetry contract

- Lifecycle state: PLANNED
- Value: collect only meaningful aggregate user actions through seven fixed
  event shapes while all existing extension workflows remain functional.
- Dependencies: complete intake; independently Ready plan; explicit Human
  Approval of S1; committed planning package. No external service, SDK upgrade,
  inherited WebAPI beta completion or other feature implementation is required.
- Acceptance: all R1–R9 and TRACEABILITY rows; no legacy or automatic event
  definition, send, payload or telemetry-only timer/helper remains. One terminal
  event per explicit action, actual successful export only, strict enums/keys,
  safe disabled/failure paths and preserved functional outputs on both hosts.
- Approval boundary: only the enumerated paths, contracts, design and validation
  below. Removal permission applies only to the named obsolete telemetry files
  and dedicated obsolete tests after coverage disposition. No wildcard scope.
- Production readiness: actual successful local checks and required current-head
  GitHub checks/Qlty Cloud; no Missing/Failed check is a pass. Independently
  review the complete final layer, with an additional independent review for
  the shared transport/entry-point lifecycle risk using the same valid evidence.

### Solution Shape

The application telemetry package is the sole semantic owner of event names,
per-event required keys/enums and typed factories. Keep its branded
`ValidatedTelemetryEvent` and host-neutral `TelemetryPort`: they earn the
boundary by inversion and a validated sender contract. Replace the generic
string-valued construction surface with a closed discriminated catalog and
runtime validation; outer code imports event-specific builders, never its
catalog internals or a raw event-name/property-map API. Reject unknown names,
keys and values from untrusted input; compile-time negative examples exercise
typed calls. No measurement parameter or `DEVELOPMENT` property survives.

Existing `VscodeTelemetryAdapter` owns SDK/settings translation, initialization,
sending and disposal failure isolation; Noop owns absent/disabled sending.
They earn their boundaries through host/SDK isolation, lifecycle and failure
normalization. Preserve existing configuration/settings behavior; do not claim
control over SDK-provided metadata or introduce custom IDs. The bootstrap
factories continue to compose existing use cases and ports, without redundant
same-request wrappers. Domain/parser/application use cases gain no telemetry
coupling. Presentation observes operation outcomes; bootstrap wires builders
and senders without moving SDK/framework types inward.

Use existing VS Code APIs and clipboard/file-write promises, React lifecycle
hooks, viewer panel store and search active-query state. No new dependency or
platform feature is needed at VS Code `^1.75.0`. The only custom gap is display
completion: READY currently asks for initial content before render, so it cannot
prove completed display. Add a minimal presentation transport acknowledgement
with only `success|failed` after the initial document state commits. Keep READY,
RESOURCE, SAVE, navigation/reveal and document-change transport functional.
Use the installed React root `onUncaughtError` hook for failed render, and
acknowledge missing-root/startup failure without transmitting exception data.
Keep existing error handling/propagation; reporting itself is best effort.
Panel-local pending completion closures plus displayed state belong to viewer
wiring; they earn no new exported tracker/port/class. Existing panel identity
is local only and never transmitted. No IDs, history, query store, timing,
retry/timeout, general event bus or operation manager is introduced.

The direct-builder cleanup makes `telemetryEvent.ts` the substantive owner and
public entry for exactly `createExtensionActivatedEvent`,
`createViewerOpenCompletedEvent`, `createSearchExecutedEvent`,
`createCsvExportedEvent`, `createWebApiImportCompletedEvent`,
`createSemanticDiffCompletedEvent` and `createSemanticDiffExportedEvent`, plus
`TelemetryHost`, `ViewerFeature`, `TelemetryResult` and `ExportMethod` type
aliases. Use named imports; aliases are allowed by original source symbol.
Catalogs/enum arrays and the generic constructor stay private;
`parseTelemetryEvent` remains the infrastructure validation seam, forbidden to
bootstrap/presentation. The branded port remains separate. No pure re-export
family module or replacement barrel earns a boundary; retain only the real
viewer-kind translation in `viewerTelemetry.ts`.

Realign the existing zero-exception telemetry architecture rule with this
public surface, instead of banning its whole module. Extend existing TypeScript
AST import collection with optional original named-symbol metadata, present only
for static named-only imports without a default binding. The rule allows only
nonempty named imports of these seven builders/four types from this module for
outer callers; any absent/unknown metadata or other symbol fails closed.
Normalize source-extension spelling when comparing this module's target.
Reject parser/catalog/generic/raw/unknown symbols even when aliased or type-only;
reject default (including default plus named), namespace, side-effect, re-export,
dynamic import, require, import-equals and import-type-query access. Collect
import-type-query references with the existing AST visitor so they cannot evade
the rule. Existing SDK/port/raw-reporting/layer gates remain unchanged. This is
a small extension to current test support, with no new analyzer, dependency,
exception path, configuration or policy/durable-document edit.

### Operation boundaries and acceptance examples

1. Activation: report once after subscription construction succeeds; no event
   for initialization, failed activation or deactivation. Shutdown still safely
   disposes telemetry and all subscriptions even if telemetry throws/rejects.
2. Viewer command/counterpart navigation/Semantic Diff Flow action: create a
   once-only completion for each explicit open. Known editor/factory/mount/
   reveal/build/post/ack failure completes `failed`; preserve existing errors
   and cleanup. A new panel completes `success` only after initial content
   commit acknowledgement. A previously displayed panel completes once after
   successful reveal; it does not wait for another READY or remount to report.
   Overlapping explicit opens awaiting the same initial panel display each
   complete once when that display settles. Drain and release pending closures
   on ack/failure/dispose; duplicate/stale ack or late READY cannot resend.
   Dispose-before-ack fails pending operations only. Restore, background refresh,
   repeated READY and disposal without an explicit pending open send nothing.
   Render/data rejection sends failed; an absent acknowledgement remains pending
   until an existing failure/disposal boundary, without an invented timeout.
   Keep pending target reveal, store active-panel guards, Flow bridge readiness,
   document refresh and mounted viewer behavior; navigation detail sends nothing.
3. Search: before the existing submit work, use its current active-query test
   to decide whether this is a newly committed nonempty operation. Submit emits
   `{feature}` only. Keep Table's current recomputation/reset/reveal even for a
   same-query blur; suppress telemetry only. Flow's `current` submission remains
   functionally unchanged. Inactive Enter + following blur = one; unchanged
   repeated blur = zero additional; next/previous on active query = zero;
   no-match commit = one; edit to another query and commit = one more; clear,
   scope reset and document reset = zero but permit a subsequent new search.
   Typing/rerender sends zero. Existing equality rules determine query identity;
   no query/count/duration crosses the telemetry transport.
4. CSV: await clipboard write in Header before sending a narrow copy-success
   notification; preserve contents and existing copy announcements. Rejection
   sends none. Host `saveText` returns an explicit success result only after
   `workspace.fs.writeFile` fulfills; cancellation/dialog/write failure or stale
   panel sends none. Host sends save event once, without a second webview save
   event. Retain SAVE payload for functional content transport, never analytics.
5. WebAPI import: one terminal report after the existing command result; map
   cancellation at every prompt to cancelled, unsupported host/failure to failed,
   success to success. Delete start/step/count/error/timing telemetry and its
   types. Reporter exceptions cannot alter the import result, prompts or errors.
6. Semantic Diff: one outer `executeCompareSemanticDiffCommand` final-result
   boundary covers file/Git HEAD and legacy report-mode branches; existing
   cancelled result maps to cancelled, other failures to failed and ok to
   success. Preserve all return values/session rollback. No instrumentation in
   comparison internals, Explorer/report redisplay, selection or filtering.
   Provider copy/save successful-write boundaries emit export once; a fulfilled
   write counts even if a later notification fails. Missing/stale/disposed
   output, cancelled dialog, rejected write or absent output sends nothing.
7. Cleanup: remove automatic diagnostics/hover/parser/list/render/layout timers
   only when telemetry-only. Keep real document debounce, performance needed for
   functionality, parser/diagnostics/hover results, listener disposal, navigation
   and Flow readiness. Remove OPERATION/PERFORMANCE analytics transport and
   operation IDs once no functional use remains; replace SEARCH payload with
   fixed feature only and CSV copy-completion with fixed method only. Validate
   untrusted shape/enum and active-panel guards before event construction.

### Exact production and validation-support paths

The original entries below retain their 105-path approval plus the approved
one-test-path delta (106). The separately listed cleanup delta proposes 110
paths and wrapper deletion/import-rule changes; its approval remains Pending.
Entries are modify paths unless explicitly marked new or obsolete. Existing
paths may remain unchanged when unnecessary; need for another path returns to
Main before edits.

#### Application

- `src/application/telemetry/TelemetryPort.ts`
- `src/application/telemetry/telemetryEvent.ts`
- `src/application/telemetry/extensionLifecycleTelemetry.ts`
- `src/application/telemetry/viewerTelemetry.ts`
- `src/application/telemetry/searchTelemetry.ts`
- `src/application/telemetry/viewerActionTelemetry.ts`
- `src/application/telemetry/webApiImportTelemetry.ts`
- `src/application/telemetry/semanticDiffTelemetry.ts`
- `src/application/telemetry/telemetryBuckets.ts`
- `src/application/telemetry/viewerOperation.ts`
- `src/application/telemetry/searchTelemetryData.ts`
- `src/application/telemetry/viewerPerformanceTelemetryData.ts`
- `src/application/telemetry/performanceTelemetry.ts`
- `src/application/telemetry/editorFeedbackTelemetry.ts`

Under the pending cleanup delta, delete the five re-export modules listed above
and remove the viewer helper re-export clause; no new family stub is retained.
Delete obsolete `telemetryBuckets.ts`,
`viewerOperation.ts`, `searchTelemetryData.ts`,
`viewerPerformanceTelemetryData.ts`, `performanceTelemetry.ts` and
`editorFeedbackTelemetry.ts` after removing callers. The event builders
are the seven direct builders in `telemetryEvent.ts`; do not keep compatibility
exports or pure family wrappers.

#### Composition and adapters

- `src/bootstrap/extension/activateExtension.ts`
- `src/bootstrap/extension/createTelemetry.ts`
- `src/bootstrap/extension/extensionLifecycle.ts`
- `src/bootstrap/extension/extensionDependencies.ts`
- `src/bootstrap/extension/extensionSubscriptions.ts`
- `src/bootstrap/extension/extensionRuntime.ts`
- `src/bootstrap/extension/MyExtension.ts`
- `src/bootstrap/extension/viewerWiring.ts`
- `src/bootstrap/extension/webapiImportWiring.ts`
- `src/bootstrap/extension/semanticDiffWiring.ts`
- `src/bootstrap/extension/semanticDiffFlowViewerBridge.ts`
- `src/infrastructure/telemetry/VscodeTelemetryAdapter.ts`
- `src/infrastructure/telemetry/NoopTelemetryAdapter.ts`

These paths cover telemetry dependency removal, activation/shutdown, safe sender
composition and explicit viewer/compare/import/export outcomes. SDK adapters
change only if needed to enforce the closed boundary/isolation contract.

#### Host presentation

- `src/presentation/vscode/telemetryHost.ts`
- `src/presentation/vscode/commands/openPreviewCommand.ts`
- `src/presentation/vscode/commands/importAjsDefinitionViaWebApiCommand.ts`
- `src/presentation/vscode/commands/semanticDiffCommand.ts`
- `src/presentation/vscode/semantic-diff/report/semanticDiffReportDocument.ts`
- `src/presentation/vscode/webview/ViewerFactory.ts`
- `src/presentation/vscode/webview/ajsDocument.ts`
- `src/presentation/vscode/webview/messageHandlers.ts`
- `src/presentation/vscode/webview/viewerMessageRouting.ts`
- `src/presentation/vscode/diagnostics/registerDiagnostics.ts`
- `src/presentation/vscode/languages/registerHoverProvider.ts`

Keep semantic comparison algorithms/workflow modules, report rendering and
functional host operations unchanged; instrument the outer result boundary.

#### Webview and transport

- `src/presentation/webview/viewerRequestMessages.ts`
- `src/presentation/webview/viewerHostMessages.ts`
- `src/presentation/webview/editor/bootstrapViewer.tsx`
- `src/presentation/webview/editor/shared/viewerSearchTelemetry.ts`
- `src/presentation/webview/editor/ajsTable/Header.tsx`
- `src/presentation/webview/editor/ajsTable/TableContents.tsx`
- `src/presentation/webview/editor/ajsTable/tableSearchController.ts`
- `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`
- `src/presentation/webview/editor/ajsFlow/useFlowSearchState.ts`
- `src/presentation/webview/editor/ajsFlow/useFlowGraphState.ts`
- `src/presentation/webview/editor/ajsFlow/useFlowViewerEffects.ts`
- `src/presentation/webview/editor/ajsFlow/nodes/Utils.ts`

Only analytics removal, narrow completion transport and the stated result/
search observation changes are included. No UI layout/accessibility redesign,
search matching/filter changes or CSV/report format change is authorized.

#### Tests

- `src/test/suite/telemetryEvent.test.ts`
- `src/test/suite/telemetryAdapter.test.ts`
- `src/test/suite/createTelemetry.test.ts`
- `src/test/suite/viewerTelemetry.test.ts`
- `src/test/suite/viewerActionTelemetry.test.ts`
- `src/test/suite/webApiImportTelemetry.test.ts`
- `src/test/suite/searchTelemetry.test.ts`
- `src/test/suite/viewerSearchTelemetry.test.ts`
- `src/test/suite/csvExportTelemetry.test.ts`
- `src/test/suite/tableRenderTelemetry.test.ts`
- `src/test/suite/performanceTelemetry.test.ts`
- `src/test/suite/telemetryBuckets.test.ts`
- `src/test/suite/editorFeedbackTelemetry.test.ts`
- `src/test/suite/semanticDiffTelemetry.test.ts`
- `src/test/suite/openPreviewCommand.test.ts`
- `src/test/suite/viewerWiring.test.ts`
- `src/test/suite/viewerMessageRouting.test.ts`
- `src/test/suite/viewerFactory.test.ts`
- `src/test/suite/AjsDocument.test.ts`
- `src/test/suite/viewerRequestMessages.test.ts`
- `src/test/suite/viewerHostMessages.test.ts`
- `src/test/suite/extensionLifecycle.test.ts`
- `src/test/suite/extensionDependencies.test.ts`
- `src/test/suite/extensionSubscriptions.test.ts`
- `src/test/suite/extensionRuntime.test.ts`
- `src/test/suite/importAjsDefinitionViaWebApiCommand.test.ts`
- `src/test/suite/webapiImportWiring.test.ts`
- `src/test/suite/semanticDiffCommand.test.ts`
- `src/test/suite/semanticDiffWiring.test.ts`
- `src/test/suite/semanticDiffReportDocument.test.ts`
- `src/test/suite/semanticDiffExplorerReportAction.test.ts`
- `src/test/suite/semanticDiffExplorerFlow.test.ts`
- `src/test/suite/tableSearchController.test.ts`
- `src/test/suite/flowSearchController.test.ts`
- `src/test/suite/headerSearchField.test.ts`
- `src/test/suite/ajsTableHeader.test.ts`
- `src/test/suite/exportCsvView.test.ts`
- `src/test/suite/registerDiagnostics.test.ts`
- `src/test/suite/registerHoverProvider.test.ts`
- `src/test/suite/tableShellIntegration.test.ts`
- `src/test/suite/flowContentsIntegration.test.ts`
- `src/test/suite/flowViewerEffects.test.ts`
- `src/test/suite/flowViewerController.test.ts`
- `src/test/suite/flowGraphView.test.ts`
- `src/test/suite/viewerBundle.test.ts`
- `src/test/suite/bootstrapViewer.test.ts`
- `src/test/suite/architectureDependencyRules.test.ts`
- `src/test/suite/reportWebviewOperation.test.ts`

`semanticDiffTelemetry.test.ts` and `bootstrapViewer.test.ts` are new.
The bootstrap test covers missing root, root/render failure and no exception
data in completion transport using the existing DOM harness. Retain meaningful workflow/privacy/error/
host behavior coverage. Obsolete dedicated bucket/performance/editor-feedback/
render-only/legacy-operation tests may be physically deleted when their entire
contract is retired; preserve or move their functional assertions into the
listed workflow suites. Catalog and family suites are rewritten for the seven
events rather than mechanically deleting failed assertions. Tests use existing
fixtures/harness; no fixture, snapshot, generated output, test-runner or
other architecture-rule catalog change is planned. The pending cleanup delta
authorizes only the stated telemetry public-symbol boundary and import metadata
with focused analyzer/boundary tests. All catalog rules remain a zero-exception
gate with no weakened raw/internal protection.

#### Durable docs in S1

- `docs/requirements/cross-cutting/telemetry.md`
- `README.md`
- `README.en.md`
- `CHANGELOG.md`

The Durable Documentation Gate passes for this proposed scope: update the
existing cross-cutting requirement as the single durable owner of event table,
triggers/frequency, required keys/enums, exclusions, settings and isolation;
README/README.en keep concise matching collection notices and link to it,
without duplicating design. CHANGELOG Unreleased records externally observable
reduced collection and Semantic Diff aggregate events; no version bump.
Architecture and observable use cases already own correct unchanged semantics,
so no updates there. No roadmap reordering or beta-exit claim is authorized.

#### Selected feature coordination paths

- `docs/specs/features/telemetry-simplification/SPECS.md`
- `docs/specs/features/telemetry-simplification/TASKS.md`
- `docs/specs/features/telemetry-simplification/TRACEABILITY.md`

Only these feature documents carry current scope, gates and evidence references.
They do not authorize runtime edits until independent Ready, explicit Human
Approval and the focused planning commit.

### Exclusions

`package.json`, `pnpm-lock.yaml`, TypeScript/webpack/ESLint/qlty/CI configuration,
`src/domain`, parser/generated source, fixtures/snapshots/resources, unrelated
application algorithms, new dependencies, inherited WebAPI feature records,
AGENTS/agent policies, architecture exceptions and unrelated cleanup are outside
scope. The pending four-path delta above replaces only the prior exclusion of
architecture-support and unrelated unit-list paths for its exact edits. These
narrow changes require approval; no other rule/catalog or unit-list
change is allowed. Preserve `engines.vscode` `^1.75.0` and browser-safe imports.

### Validation and material risks

Risk tier: shared contracts, bootstrap/extension lifecycle and desktop/web host
boundaries. All following checks are required for the stabilized S1 patch;
run focused suites during correction, then the final set once. Use existing
scripts/harness rather than modifying execution conditions.

- Compile/type checks: `rtk pnpm run test:compile` and `rtk pnpm exec tsc --noEmit`.
  Negative type assertions in telemetryEvent tests must compile as expected.
- ESLint: `rtk pnpm exec eslint src` (same existing configuration).
- Functional unit/integration: `rtk pnpm run test:full` runs the established
  desktop suite (including all listed tests and full architecture catalog) and
  web smoke/browser suite with preparation. Record architecture result separately.
  The listed operation tests must cover both positive and no-send boundaries,
  throwing senders, strict malformed transport and preserved outputs; do not
  assume a broad command alone demonstrates these acceptance cases.
- Minimum host: `rtk pnpm run test:desktop:min`, retaining actual VS Code 1.75.0
  launch result and smoke output. Stable desktop/web does not replace this.
- Production builds: `rtk pnpm run build` for desktop and web bundles. Inspect
  engines before/after and Node built-in imports in changed shared source;
  dependency and compatibility contracts must be unchanged.
- Quality: qlty >= 0.645.0; exact disposable baseline/final full-repository
  snapshots, same tool/config/selection, complete official SARIF 2.1.0 for
  `rtk pnpm exec qlty check --all --sarif --no-fix` and
  `rtk pnpm exec qlty smells --all --sarif --no-snippets`, nonzero analyzed-path
  inventories/counts, statuses/logs and official finding comparison. No new or
  mapped adverse finding; `rtk pnpm run qlty` aggregate must pass in final
  disposable snapshot. Sync only approved formatter changes then rebuild and
  repeat affected final observations. Do not replace official SARIF with a
  custom comparator. Current-head Qlty Cloud is required at Feature Exit.
- Documentation: explicit `rtk pnpm exec markdownlint-cli2` coverage for all
  changed Markdown including both READMEs, CHANGELOG and cross-cutting telemetry;
  validate local links/anchors, document roles, parity and exact event matrix.
  `rtk git diff --check` plus new/untracked-file whitespace inspection.
- Static retirement/privacy review: inventory seven catalog definitions and
  typed builders; scan production for retired events/helpers/analytics transport,
  telemetry timers and sensitive/free-form properties. Distinguish legitimate
  command/view-type strings from retired analytics names. Review pending viewer
  closures, duplicate/search observation, actual write outcomes and SDK isolation.
- GitHub current-head required checks, code scanning, reviews and protections
  remain separate native PR gates; no local result bypasses them.

Key risks and mitigations: premature display success is covered by delayed ack
and tests; overlapping/stale panels by once-only completions and active guards;
search behavior drift by keeping existing search work and testing reset/reveal;
false export success by fulfilled writes and failed-notification coverage;
sender errors by throwing/failing Noop/adapter/workflow tests; privacy leaks by
strict shape/enums and malicious input cases; cleanup regression by retained
parser/list/Flow/diagnostics/hover/CSV/report tests and both host builds. No
server access or real-environment WebAPI beta certification is needed because
import semantics are unchanged. Any missing required host/check remains Missing
and blocks Ready until Main resolves it; it cannot be silently deferred.

## Evidence and review index

- Intake discovery/validation: reuse the reference-base facts at
  [intake discovery](/tmp/ajsbutler-telemetry-intake-20261017/discovery.md) and
  [intake validation](/tmp/ajsbutler-telemetry-intake-20261017/validation.json).
- Planning discovery and documentation checks:
  [discovery](/tmp/ajsbutler-telemetry-plan-20261017/discovery.md),
  [validation](/tmp/ajsbutler-telemetry-plan-20261017/validation.json).
  The artifact supplies the exact plan content manifest/identity and check logs.
- S1 implementation remains incomplete; this replan makes no runtime pass or
  readiness claim. Preserve exact base/head, approved paths, configuration/
  dependency/tool hashes, tracked/untracked/deletion manifests and check status
  in accessible artifacts outside analyzed inputs. No evidence collector or
  parallel registry is introduced.
- Planning product checks/qlty: Not Applicable to this documentation-only patch;
  the S1 product set above is future required coverage, not a claimed pass.
- Reuse valid evidence per [Evidence Contract](../../evidence.md#evidence-contract).
  Only changed inputs/coverage or a concrete missing fact invalidates it.

## Cleanup-delta validation renewal

Reuse original acceptance and required commands; no check is removed or waived.
Focused tests prove actual named imports, alias source names and type-only
bindings are collected, builders/types allowed and parser/internal/unsafe forms
rejected; test representative forms without a synthetic cross-product. Retain
production-wide zero-exception telemetry/raw-reporting/SDK/layer scans and
strict catalog/privacy tests. Scan imports for all five retired module paths;
retain the real viewer-kind translation test. Full TypeScript/ESLint confirms
imports and the import-only unit-list correction; existing unit-list suites
continue to cover behavior. Desktop/web/minimum-host/build checks remain S1
requirements because product import/analysis inputs change.

Earlier desktop 1008/web 7/minimum 1.75/build/type/Markdown results belong to the
prior snapshot. Reuse only results whose inspected inputs and coverage still
match; affected product/architecture/host/quality checks need the stabilized
cleanup snapshot. The docs-only planning commits leave the original product
qlty baseline reusable; record its exact comparison/content identity. Prior
final check SARIF had four baseline records, but is not final cleanup evidence.
Final smells/aggregate and full ESLint success remain required; neither prior
baseline unused-import failure nor pending output establishes Ready. Preserve
baseline/final ESLint logs and current quality artifacts in the implementation
evidence; do not manufacture a pass or change analysis selection/configuration.
No new durable propagation/removal target, native layer or approval gate beyond
this affected replan is introduced.

## Feature Exit and closure plan

Entry: S1 SLICE_COMMITTED with all acceptance/checks/reviews and explicit
Completion Approval, no pending design decision. Feature-closer verifies current
head global gates, aggregate acceptance and preservation, reuses valid evidence,
and assesses production readiness and durable-document completeness. The four
S1 durable documents already carry reusable telemetry knowledge; planned
closure propagation is verification of those same paths, with minimal correction
only if within this approved durable scope. No other durable target is planned.

Removal scope (Main applies only after the separate closure gate):

- `docs/specs/features/telemetry-simplification/SPECS.md`
- `docs/specs/features/telemetry-simplification/TASKS.md`
- `docs/specs/features/telemetry-simplification/TRACEABILITY.md`

Feature-closer prepares retained external closure evidence bound to the exact
projected final snapshot including these deletions, durable targets, slice
proof, unresolved-risk ownership, current PR/base/head and checks. Keep evidence
and human gate proof accessible in the existing PR/retained closure artifact
after removal; do not copy feature documents into history. Changed closure patch
needs independent implementation-reviewer Ready before explicit Closure Approval
and its focused top-layer commit. No inherited folder is removed. Unexpected
valuable unfinished work or unapproved durable destination returns to Main for
scope/owner decision; no planned roadmap edit. Final merge needs separate Human
Merge Approval; Main records actual verified merge SHAs/CLOSED outside the
removed feature folder.
