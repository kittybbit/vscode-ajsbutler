# Feature Tasks: Standardize Serialization And Composition Root

## Agent Brief

- Purpose: standardize plain viewer transport and bootstrap-only composition.
- Approved or active slice:
  Slices 1-4 are complete; no implementation slice remains active.
- Do not change message meaning, activation, lifecycle, or viewer behavior.
- Do not introduce a service container or reconstruct domain objects in viewers.
- Read first: `SPECS.md`, this file, and the exact architecture allowlist.
- Read `TRACEABILITY.md` when reviewing or implementing a slice.
- Validate code slices with focused tests, `rtk pnpm run qlty`, and host builds.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision:
  run `sdd-plan-task` in Feature Exit Mode.

## Sync Rule

- Update this file in the same commit whenever a slice is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` only when the branch starts, stops, or changes
  an active feature.
- Update `docs/specs/roadmap.md` only when repository sequencing changes.
- Keep this file focused on approval, validation, risk, and feature exit
  readiness rather than implementation history.

## Plan Status

- Status: In Progress
- Planning scope: every host/viewer message in both directions, the browser-safe
  host information used by those messages, and extension dependency/lifecycle
  composition.
- Review status:
  focused replan reviewed with verdict `Ready for approval`; no blocking
  findings remain.
- Human approval: approved for the full plan and all four slices.
- Active implementation slice: none; Feature Exit Review is required.

## Replanning Record

- Mode: Replanning Mode.
- Trigger:
  `sdd-review-plan` returned `Needs revision` before human approval.
- Gap:
  the original plan did not fix transport ownership by layer, JSON round trips
  alone could not exclude serializable class instances, the large recursive
  payload risk lacked a concrete regression test, and Slice 4 could be read as
  approving new partial-activation rollback behavior.
- Smallest revision:
  preserve all four slices and their order; clarify ownership and Slice 4's
  boundary, add recursive plain-JSON/inventory evidence to Slices 1 and 2, and
  reuse the existing large/deep document fixtures in Slice 1.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope:
  the complete four-slice plan and each recorded Slice 1-4 approval boundary;
  implementation remains sequential and starts with Slice 1.

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Planning Gate

- Active feature folder:
  `docs/specs/features/standardize-serialization-and-composition-root/`.
- Requirements covered:
  plain standard-JSON payloads; explicit identity/hierarchy/relation IDs;
  bootstrap-only adapter and use-case construction; presentation registration,
  host selection, and lifecycle owned by bootstrap; no user-visible behavior
  change.
- Acceptance covered:
  JSON round trips for every message, zero raw/wrapper/class/circular/VS Code/
  infrastructure payloads, sole bootstrap composition, and desktop/web
  integration and build evidence.
- Implementation order: Slice 1, Slice 2, Slice 3, Slice 4.
- Plan assumption:
  existing application DTO meaning remains authoritative; this feature may
  move or wrap transport contracts but must not redesign list, flow, definition,
  navigation, CSV, diagnostics, hover, semantic-diff, WebAPI, or telemetry
  meaning.
- Contract ownership decision:
  - Application owns host-neutral payload DTOs and semantic validators for
    list, flow, unit-definition, navigation, and telemetry meaning.
  - Presentation owns direction-specific host/viewer event names and envelopes,
    envelope parsers, the minimal post-message port, and viewer-only resource
    state such as theme, language, and shortcut platform.
  - Bootstrap wires senders, receivers, ports, and host capabilities but does
    not define payload or envelope meaning.
  - Existing `src/shared/webviewEvents.ts` and `src/shared/MyAppResource.ts`
    responsibilities migrate to these owners; `shared` must not remain a
    second transport-contract owner.
- Undocumented behavior requiring preservation:
  the resource handshake enriches viewer state with theme and language; invalid
  navigation is ignored; invalid save data reports the existing error; a newly
  opened counterpart viewer receives its reveal only after readiness; macOS
  search shortcuts use Command while other platforms use Control.

## Implementation Slices

### Slice 1: Standardize Host-To-Viewer Transport

- Status: Complete
- Scope:
  define a host-neutral, standard-JSON message contract for resource state,
  unit-list document changes, and reveal requests; migrate both host senders and
  viewer consumers to that contract; replace the global `vscode.Webview` typing
  with a minimal repository-owned post-message port; preserve stable unit IDs,
  parent IDs, absolute paths, relations, definitions, rows, and warnings.
  Application DTOs and semantic validators remain in application; presentation
  owns the direction-specific envelope, parser, post-message port, and viewer
  resource state instead of leaving those contracts in `shared`.
- User / Domain Value:
  desktop and web viewers receive the same deterministic data without depending
  on VS Code, class instances, parser/raw structures, or reconstructed domain
  objects.
- Cohesive Change Group:
  `global.d.ts`, `src/shared/MyAppResource.ts`,
  `src/shared/webviewEvents.ts`, the application list/flow/definition DTOs,
  `src/presentation/vscode/webview/ajsDocument.ts`,
  `src/bootstrap/extension/viewerWiring.ts`,
  `src/presentation/webview/editor/viewerEventBridge.ts`,
  `src/presentation/webview/editor/MyContexts.tsx`,
  `src/presentation/webview/editor/ajsTable/TableContents.tsx`,
  `src/presentation/webview/editor/ajsFlow/useFlowViewerEffects.ts`, and their
  focused transport/viewer tests.
- Acceptance:
  every host-to-viewer message survives `JSON.stringify`/`JSON.parse` with
  identity, hierarchy, relations, content, and event meaning unchanged; the
  viewer bridge consumes only validated plain messages; no VS Code type or
  runtime object crosses the boundary. A recursive transport inventory proves
  that every emitted value is only `null`, a finite JSON scalar, an array, or a
  plain record with plain descendants and contains no undefined own value,
  custom prototype/class instance, method, symbol, bigint, circular reference,
  raw/wrapper object, VS Code object, or infrastructure response.
- Validation:
  extend `AjsDocument.test.ts`, `viewerEventBridge.test.ts`,
  `tableViewerData.test.ts`, `flowGraphDocument.test.ts`,
  `unitDefinitionDocumentState.test.ts`, `revealUnit.test.ts`, and
  `viewerWiring.test.ts`; add a test-only recursive plain-JSON assertion and an
  exhaustive inventory of host-to-viewer message builders; reuse the existing
  500-unit list projection and 1,500-level flow-document cases to round-trip the
  final transport contract and confirm stable counts/identity without adding a
  wall-clock threshold; run the nearest compiled desktop tests,
  `rtk pnpm run qlty`, `rtk pnpm run test:web`, and `rtk pnpm run build`.
- Production Readiness:
  - Failure mode:
    malformed or unknown host messages are ignored without invoking callbacks,
    crashing the viewer, or presenting partial data as complete.
  - JP1/AJS compatibility:
    no grammar or version-13 interpretation changes; all definition-derived
    identity, hierarchy, relation, raw parameter text, and warnings are
    preserved.
  - Large or malformed input risk:
    the existing 500-unit projection and 1,500-level nested graph cases prove
    round-trip completion, stable identity/counts, and rejection of malformed
    documents without recursive domain reconstruction. Do not introduce a new
    timing threshold or a second production traversal solely for validation.
  - Desktop/web impact:
    both viewer bundles and both extension hosts share the same message shape;
    web smoke/build coverage is required.
  - README/docs impact:
    no user-doc change; update only feature traceability during implementation.
  - CHANGELOG impact:
    none under the SSOT criteria because behavior is internal and preserved.
- Approval Boundary:
  approve the application/presentation ownership decision, migration out of
  `shared`, typed envelope migration, runtime validation, and focused tests
  together; any payload meaning, additional production JSON abstraction, or
  viewer behavior change requires replanning.
- Dependencies:
  none; this establishes the common transport vocabulary used by Slice 2.
- Risks:
  optional/undefined fields can disappear during JSON serialization, recursive
  unit trees can hide a non-plain value, and an overly strict validator can
  suppress valid existing viewer data.
- Out of Scope:
  viewer-to-host requests, host platform detection, adapter composition, and
  application DTO redesign.

### Slice 2: Validate Viewer-To-Host Requests

- Status: Complete
- Scope:
  define distinct plain request DTOs and runtime parsers for resource readiness,
  save, operation, search, performance, and navigation; migrate every webview
  sender and the VS Code message router; make unknown or malformed messages
  fail predictably without unsafe route dispatch. Reuse application-owned
  navigation and telemetry payload meaning while presentation owns request
  envelopes, envelope parsing, and the post-message interaction.
- User / Domain Value:
  viewer actions reach the host through one testable contract while save,
  navigation, telemetry, and readiness behavior remain stable.
- Cohesive Change Group:
  the transport contract established in Slice 1,
  `src/presentation/vscode/webview/ViewerFactory.ts`,
  `src/presentation/vscode/webview/viewerMessageRouting.ts`,
  `src/presentation/vscode/webview/messageHandlers.ts`, table/flow message
  senders under `src/presentation/webview/editor/**`, and
  `viewerMessageRouting.test.ts`, `viewerFactory.test.ts`,
  `reportWebviewOperation.test.ts`, telemetry request tests, CSV export tests,
  and navigation tests.
- Acceptance:
  every supported request round-trips through JSON and routes exactly once;
  malformed types/data and unknown messages do not throw or call a handler;
  invalid save data retains its existing understandable error; telemetry
  receives only the existing allowlisted scalar meaning. The same recursive
  plain-JSON assertion and an exhaustive viewer-to-host message-builder
  inventory exclude undefined own values, custom prototypes/classes, methods,
  symbols, bigint, circular references, raw/wrapper objects, VS Code objects,
  and infrastructure responses.
- Validation:
  extend `viewerMessageRouting.test.ts`, `viewerFactory.test.ts`,
  `reportWebviewOperation.test.ts`, `searchTelemetry.test.ts`,
  `performanceTelemetry.test.ts`, `tableNavigation.test.ts`,
  `csvExportTelemetry.test.ts`, and relevant table/flow tests; reuse the
  test-only recursive plain-JSON assertion and enumerate every viewer-to-host
  message builder; run the nearest compiled desktop tests,
  `rtk pnpm run qlty`, `rtk pnpm run test:web`, and `rtk pnpm run build`.
- Production Readiness:
  - Failure mode:
    unknown or malformed requests are ignored except for the existing invalid
    save-data error; no unhandled route lookup or telemetry exception is added.
  - JP1/AJS compatibility:
    request payloads contain viewer actions and stable unit paths only; no
    definition interpretation changes.
  - Large or malformed input risk:
    validators remain linear in the small request payload; CSV text is checked
    as a string without reparsing or copying definition graphs.
  - Desktop/web impact:
    both viewer bundles emit the same contract and desktop/web hosts route it
    identically.
  - README/docs impact:
    no user-doc change unless implementation discovers an observable error
    behavior change, which requires replanning.
  - CHANGELOG impact:
    none while observable message behavior and errors are preserved.
- Approval Boundary:
  approve presentation-owned request envelopes/parsers, reuse of
  application-owned payload meaning, and all message senders/routers as one
  atomic contract change; new events, new application meaning, or telemetry
  meaning changes are excluded.
- Dependencies:
  Slice 1 transport vocabulary and post-message port.
- Risks:
  resource request and resource-state response currently share one event name,
  and permissive legacy callbacks may rely on missing data; direction-specific
  types must preserve the handshake without accepting arbitrary objects.
- Out of Scope:
  host environment sourcing, new viewer actions, CSV format changes, telemetry
  schema changes, and navigation semantics.

### Slice 3: Remove Node-Dependent Viewer Host Data

- Status: Complete
- Scope:
  replace the `os`-derived shortcut platform payload with a browser-safe
  presentation source, replace `path.basename` panel naming with a VS Code/
  URI-safe equivalent compatible with VS Code 1.75, and remove this feature's
  two exact Node-browser allowlist entries.
- User / Domain Value:
  viewer startup and shortcuts retain their behavior without relying on
  webpack Node fallbacks in shared desktop/web extension paths.
- Cohesive Change Group:
  `src/presentation/vscode/webview/messageHandlers.ts`,
  `src/presentation/vscode/webview/ViewerFactory.ts`,
  the resource contract/consumer from Slice 1,
  `src/presentation/webview/editor/shared/HeaderSearchField.tsx`,
  `src/test/fixtures/architecture/dependencyAllowlist.ts`,
  `src/test/suite/architectureDependencyRules.test.ts`, and focused resource,
  shortcut, viewer-factory, bundle, and web-smoke tests.
- Acceptance:
  panel titles remain filename-equivalent; macOS and non-macOS search shortcuts
  remain Command-F and Control-F respectively; production architecture
  violations and this feature's allowlist entries both become zero; no API
  newer than `engines.vscode` `^1.75.0` is used.
- Validation:
  extend `viewerFactory.test.ts`, `viewerEventBridge.test.ts`,
  `headerSearchField.test.ts`, `architectureDependencyRules.test.ts`,
  `viewerBundle.test.ts`, and `webSmoke.ts`; run the nearest compiled desktop
  tests, `rtk pnpm run qlty`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`.
- Production Readiness:
  - Failure mode:
    unavailable or privacy-reduced browser platform data falls back to the
    existing non-macOS shortcut behavior; unusual URI paths still produce a
    stable panel title.
  - JP1/AJS compatibility:
    no definition or command/config reference impact.
  - Large or malformed input risk:
    none beyond constant-time platform and URI-name resolution.
  - Desktop/web impact:
    this slice removes the only two Node built-ins in production extension
    paths and must prove both bundles.
  - README/docs impact:
    no user-doc change because shortcuts and titles are preserved.
  - CHANGELOG impact:
    none while shortcut and title behavior remain unchanged.
- Approval Boundary:
  approve browser-safe platform/title resolution and exact allowlist removal;
  shortcut redesign, panel-title redesign, or a minimum VS Code bump is
  excluded.
- Dependencies:
  Slice 1 for the final resource-state contract; independent of Slice 2.
- Risks:
  browser platform APIs can be reduced or deprecated, and URI basename logic
  can differ for trailing separators or non-file schemes.
- Out of Scope:
  bundle optimization, general URI utilities, viewer UI changes, and changes to
  host availability.

### Slice 4: Enforce Bootstrap-Only Composition And Lifecycle

- Status: Complete
- Scope:
  make host capability selection precede concrete adapter construction, keep
  all production use-case factories and concrete application/infrastructure
  wiring under `src/bootstrap/extension/**`, inject only ports/capabilities into
  presentation registrations, preserve the current subscription/disposal
  ownership without redesigning lifecycle failure semantics, and add
  deterministic guardrail evidence for construction sites.
- User / Domain Value:
  desktop and web activation obtain only the dependencies available to that
  host, with one auditable lifecycle and no presentation-side adapter
  construction.
- Cohesive Change Group:
  `src/extension.ts`, `src/bootstrap/extension/activateExtension.ts`,
  `extensionDependencies.ts`, `extensionSubscriptions.ts`,
  `extensionRuntime.ts`, `extensionLifecycle.ts`, `MyExtension.ts`,
  `webapiImportWiring.ts`, `semanticDiffWiring.ts`, `viewerWiring.ts`,
  concrete adapter/use-case factory imports, architecture rule support and
  fixtures, and extension dependency/runtime/subscription/lifecycle/web tests.
- Acceptance:
  production construction/reference evidence shows concrete infrastructure
  adapters and application use-case factories only in bootstrap; desktop/web
  capability selection occurs before unavailable adapters are constructed;
  activation registers the same commands/providers/viewers; deactivation and
  the existing context, telemetry, and panel subscriptions retain their current
  owners and dispose exactly once on their existing paths; no service container,
  global locator, new partial-activation rollback, or lifecycle behavior is
  introduced.
- Validation:
  extend `extensionDependencies.test.ts`, `extensionSubscriptions.test.ts`,
  `extensionRuntime.test.ts`, `extensionLifecycle.test.ts`,
  `webapiImportWiring.test.ts`, `viewerWiring.test.ts`,
  `architectureDependencyRules.test.ts`, and `extension.test.ts`; run relevant
  compiled desktop tests, `rtk pnpm run qlty`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`.
- Production Readiness:
  - Failure mode:
    unavailable host capabilities retain their current explicit fallback;
    adapter-construction failure remains contained where already specified.
    This slice verifies existing activation/disposal paths but does not add
    partial-activation rollback; if implementation requires that new behavior,
    stop and replan.
  - JP1/AJS compatibility:
    all parser, list, flow, definition, diagnostics, hover, semantic-diff,
    WebAPI beta, and telemetry meanings are injected unchanged.
  - Large or malformed input risk:
    composition adds no per-definition work; existing use cases remain
    responsible for malformed and large inputs.
  - Desktop/web impact:
    explicit host selection and activation/deactivation tests cover both entry
    points; Node-only implementations must not enter the web import/runtime
    path.
  - README/docs impact:
    no README change; final durable architecture wording remains deferred to
    `remove-legacy-and-enforce-clean-architecture`.
  - CHANGELOG impact:
    none because activation, commands, availability, lifecycle, and behavior
    are preserved.
- Approval Boundary:
  approve composition ownership, host selection, preservation/enforcement of
  current lifecycle ownership, and guardrail enforcement together; this does
  not approve lifecycle consolidation or redesign. Any new rollback, command
  availability, activation event, adapter semantics, or disposal behavior
  requires replanning.
- Dependencies:
  Slices 1 and 2 provide the final transport ports; Slice 3 removes the remaining
  browser-boundary exceptions before the invariant is asserted.
- Risks:
  moving host selection can change eager/lazy construction timing; lifecycle
  consolidation can cause double disposal or missed subscriptions; a guardrail
  based only on naming could be brittle and must use deterministic import/
  construction evidence.
- Out of Scope:
  service containers, new host capabilities, WebAPI beta expansion, telemetry
  schema changes, command changes, partial-activation rollback, lifecycle
  redesign, and final durable architecture rewrite.

## Traceability

- TRACEABILITY.md required: yes.
- Reason:
  four implementation slices span both message directions, both hosts,
  architecture guardrails, and multiple durable viewer/use-case contracts.

## Cross-Slice Dependencies

- Slice 1 establishes the message vocabulary and minimal post-message port.
- Slice 2 completes the reverse direction using Slice 1's vocabulary.
- Slice 3 consumes Slice 1's resource-state contract but can be implemented
  independently after it; it removes the two exact owned allowlist entries.
- Slice 4 follows Slices 1-3 so bootstrap composes the final transport ports and
  asserts the completed host/browser/composition invariant.
- Each slice requires separate human approval and must be independently
  reviewable, testable, committable, and completable.

## Feature-Level Risks

- Internal event names currently conceal direction-specific shapes, especially
  the resource request/response handshake.
- TypeScript DTO types and JSON round trips alone do not prove plain-data
  safety; exhaustive direction-specific message inventories and recursive
  plain-JSON assertions must exclude custom prototypes/classes and non-JSON
  values.
- The current architecture collector proves imports, not every application
  factory call or runtime object crossing `postMessage`.
- Shared unit trees can be large and recursive; reuse the existing 500-unit and
  1,500-level cases to prove stable round trips without domain reconstruction,
  a new timing threshold, or an extra production-only traversal.
- `engines.vscode` is `^1.75.0`; convenience APIs introduced later are
  forbidden without separate compatibility approval.
- The current planning work is docs-only. Implementation requires a dedicated
  non-`docs/` feature branch before Slice 1 starts.

## Use-Case Back-Propagation

- `uc-view-unit-list.md`, `uc-build-flow-graph.md`,
  `uc-show-unit-definition.md`,
  `uc-navigate-between-unit-list-and-flow-graph.md`, and
  `uc-export-unit-list-csv.md` already state the durable neutral-contract and
  desktop/web behavior to preserve.
- No use-case change is planned because this feature changes transport and
  construction only.
- If implementation changes observable payload meaning, errors, availability,
  activation, shortcuts, panel titles, or lifecycle, stop and replan before
  updating the smallest affected durable use case.

## Feature Exit

- Definition of Done status:
  not started; all four slices, traceability, validation, production-readiness
  review, and explicit closure approval remain.
- Durable documentation updates:
  feature-local evidence and branch plan only; final `architecture.md` and
  `AGENTS.md` invariant wording belongs to
  `remove-legacy-and-enforce-clean-architecture`.
- Open risks:
  payload drift, invalid-message handling, recursive serialization cost,
  browser platform detection, host adapter construction timing, and lifecycle
  disposal.

## Validation

- [x] Slice 1 host-to-viewer transport tests and desktop/web checks.
- [x] Slice 2 viewer-to-host request tests and desktop/web checks.
- [x] Exhaustive message-builder inventories and recursive plain-JSON assertions
      prove zero class/prototype/non-JSON/raw/wrapper/VS Code/infrastructure
      payload leaks in both directions.
- [x] Existing 500-unit and 1,500-level document cases round-trip through the
      final host-to-viewer contract with stable identity and counts.
- [x] Slice 3 browser-safe host data tests and zero exact allowlist.
- [x] Slice 4 composition/lifecycle guardrails and desktop/web integration.
- [x] `rtk pnpm run qlty` for Slices 1-4.
- [x] New qlty smells for Slices 1-4 resolved; no actionable follow-up remains;
      metric movement recorded only when tied to a concrete responsibility or
      compatibility risk.
- [x] Slice 1 integrated production-readiness review and separate
      higher-risk contract/host review after final validation; later slices
      retain their own review gates.
- [x] Slice 2 integrated production-readiness review and separate higher-risk
      contract/host review after final validation; later slices retain their
      own review gates.

## Implementation Feedback

- Slice 1 boundary was appropriate: the only payload cleanup required was
  omitting undefined own fields while assembling unit-list row DTO groups.
- The existing large/deep fixtures were sufficient; no timing threshold,
  domain reconstruction, or recursive production transport check was needed.
- No durable-document propagation is needed. The finding is specific to this
  feature's transport acceptance and is fully represented by the DTO builder,
  tests, and traceability evidence.
- Final review found no remaining scope, compatibility, architecture,
  performance, or production-readiness issue for Slice 1.
- Slice 2 boundary was appropriate. Separating small application-owned
  navigation/telemetry meaning from the presentation envelope prevented the
  viewer bundle from importing telemetry reporting definitions.
- The direction-specific `resource` shapes required an exact request field set
  because request and response intentionally retain the same event name.
- No durable-document propagation is needed for Slice 2. These findings are
  implementation evidence for the already-approved transport ownership and
  resource-handshake risks.
- Final review found no remaining scope, compatibility, architecture,
  privacy, performance, or production-readiness issue for Slice 2.
- Slice 3 boundary was appropriate. Browser platform detection belongs in the
  webview presentation surface, while URI panel-title resolution remains at
  the VS Code presentation boundary.
- Privacy-reduced or unavailable browser platform data now deterministically
  retains the non-macOS Control-F fallback; no additional host capability or
  transport field was needed.
- No durable-document propagation is needed for Slice 3. The platform and URI
  compatibility behavior was already specified, and implementation introduced
  no new cross-feature policy.
- Final integrated and independent compatibility reviews found no remaining
  scope, behavior, architecture, privacy, performance, VS Code 1.75, or
  production-readiness issue for Slice 3.
- Slice 4 boundary was appropriate. WebAPI import was the only unavailable
  host capability whose desktop adapter construction occurred before host
  selection; delaying that capability factory required no activation or
  availability change.
- The composition guardrail discovers exported application factories by their
  returned-function structure, resolves imported aliases, and checks actual
  factory calls and concrete infrastructure construction instead of relying
  only on naming.
- Existing context subscription ownership and telemetry disposal paths remain
  unchanged and are verified for unique registrations and exactly-once
  disposal on the existing path.
- No durable-document propagation is needed for Slice 4. The reusable
  bootstrap invariant is already specified, and final durable architecture
  wording remains assigned to
  `remove-legacy-and-enforce-clean-architecture`.
- Final integrated and independent host/lifecycle reviews found no remaining
  scope, behavior, architecture, privacy, performance, VS Code 1.75, or
  production-readiness issue for Slice 4.

## Notes

- JP1/AJS command/config reference impact: none.
- Definition-file compatibility risk: transport loss or validator rejection,
  not semantic reinterpretation.
- README/user-doc impact: none while behavior is preserved.
- CHANGELOG impact: none under the current internal-refactor scope.
- Roadmap sequencing is unchanged; do not edit `docs/specs/roadmap.md` during
  planning.
