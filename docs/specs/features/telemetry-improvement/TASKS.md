# Feature Tasks: Telemetry Improvement

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` only when the branch starts, stops, or changes
  an active feature.
- Update `docs/specs/roadmap.md` when repository sequencing changes.
- Keep this file focused on the implementation-slice plan, approval state,
  validation, risk, and feature exit readiness. Do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Plan Status

- Status: In Progress
- Planning scope:
  full implementation-slice plan for privacy-preserving telemetry improvement
  across current telemetry boundaries, current product workflows, and future
  roadmap readiness.
- Review status:
  reviewed and ready for implementation.
- Human approval:
  approved for Slice 1 through Slice 8.
- Active implementation slice:
  Slice 7: Performance Telemetry.

## Human Approval

- Status: Approved
- Approved at:
  approved in current conversation
- Approved scope:
  Slice 1 through Slice 8 in this implementation plan.

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Implementation Slices

### Slice 1: Telemetry Schema And Privacy Guardrails

- Status: Complete
- Scope:
  introduce repository-owned telemetry event builders, event-name constants,
  property allowlists, coarse bucket helpers, safe result/error categories,
  and privacy tests while preserving the existing `TelemetryPort` adapter
  boundary.
- User / Domain Value:
  creates the reusable safety layer that lets future telemetry answer product
  questions without relying on every caller to remember privacy rules.
- Cohesive Change Group:
  `src/application/telemetry/*`, existing telemetry port compatibility,
  `src/test/suite/*telemetry*`, `createTelemetry` and lifecycle tests, plus
  README telemetry wording if the documented policy needs to mention the
  broader anonymous metadata model.
- Acceptance:
  event builders emit only approved string properties, bucket helpers produce
  stable coarse values, forbidden content categories have explicit tests, and
  existing telemetry adapter behavior remains compatible.
- Validation:
  focused unit tests for event builders, property allowlists, bucket helpers,
  forbidden-property rejection or omission, Noop fallback, lifecycle telemetry,
  `rtk pnpm run qlty`, `rtk pnpm test`, and `rtk pnpm run test:web` if shared
  telemetry imports affect the browser bundle.
- Production Readiness:
  - Failure mode:
    unsupported event properties are dropped, rejected, or mapped to safe
    categories without breaking user workflows.
  - JP1/AJS compatibility:
    no parser, definition-file, command, diagnostics, list, flow, or WebAPI
    interpretation changes.
  - Large or malformed input risk:
    bucket helpers must accept counts and durations only; they must not inspect
    definition contents.
  - Desktop/web impact:
    schema and helpers must be host-neutral and avoid Node-only imports.
  - README/docs impact:
    README telemetry section likely changes because current wording says only
    command execution is collected.
  - CHANGELOG impact:
    evaluate with the human because documented telemetry scope changes may be
    externally observable.
- Approval Boundary:
  schema, builders, privacy guardrails, compatibility tests, and telemetry
  policy docs only; no broad product event rollout.
- Dependencies:
  none.
- Risks:
  over-general abstractions could make event recording cumbersome; keep the
  first schema limited to approved current and planned categories.
- Out of Scope:
  dashboard work, analytics backend, new user-visible behavior, and collecting
  any forbidden content.

### Slice 2: Lifecycle And Viewer Readiness Telemetry

- Status: Complete
- Scope:
  migrate lifecycle and preview open telemetry to schema-owned events and add
  privacy-safe viewer readiness and close workflow signals for table and flow
  panels.
- User / Domain Value:
  separates command invocation from successful viewer readiness so product
  decisions can distinguish attempted usage from usable viewer sessions.
- Cohesive Change Group:
  `src/bootstrap/extension/extensionLifecycle.ts`,
  `src/bootstrap/extension/viewerWiring.ts`,
  `src/presentation/vscode/commands/openPreviewCommand.ts`,
  `src/presentation/vscode/webview/ViewerFactory.ts`,
  `src/presentation/vscode/webview/WebviewMediator.ts`,
  `src/presentation/vscode/webview/ajsDocument.ts`,
  viewer factory/routing/lifecycle tests, and README/CHANGELOG evaluation.
- Acceptance:
  activation, deactivation, open-started, viewer-ready, and viewer-closed
  events use approved names and properties; existing event compatibility is
  preserved or explicitly mapped; no file URI/path enters telemetry.
- Validation:
  update lifecycle, open preview command, viewer factory, viewer mediator, and
  viewer wiring tests; run `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode:
    viewer telemetry failure does not block panel creation, document parsing,
    message routing, or disposal.
  - JP1/AJS compatibility:
    no definition parsing or viewer content changes.
  - Large or malformed input risk:
    only document build result counts or buckets may be emitted; content and
    paths are forbidden.
  - Desktop/web impact:
    viewer readiness events must work for desktop and web panel wiring without
    Node-only behavior in shared code.
  - README/docs impact:
    README telemetry text may need to mention anonymous viewer readiness.
  - CHANGELOG impact:
    evaluate because telemetry behavior changes but visible viewer behavior
    should not.
- Approval Boundary:
  lifecycle, preview, viewer readiness, and panel close telemetry only.
- Dependencies:
  Slice 1.
- Risks:
  close/abandonment semantics can be noisy when VS Code disposes hidden panels;
  record only observable panel lifecycle states.
- Out of Scope:
  table search, flow search, CSV, diagnostics, WebAPI import, and performance
  event rollout.

### Slice 3: WebAPI Import Workflow Telemetry

- Status: Complete
- Scope:
  convert WebAPI import beta telemetry from the existing `webapiImport` result
  events into schema-owned workflow stage events for started, input-step
  cancellation, unsupported host, request-build failure, import failure, and
  successful completion.
- User / Domain Value:
  shows where the beta import workflow fails or is abandoned without exposing
  server, manager, service, location, credential, URL, or response content.
- Cohesive Change Group:
  `src/presentation/vscode/commands/importAjsDefinitionViaWebApiCommand.ts`,
  `src/bootstrap/extension/webapiImportWiring.ts`, WebAPI import command and
  wiring tests, and telemetry schema tests from Slice 1.
- Acceptance:
  events report only safe stage IDs, result codes, HTTP status categories,
  duration buckets, unit-count buckets, and `all`; no prompt values, URLs,
  server names, credential refs, usernames, passwords, or raw error messages
  are emitted.
- Validation:
  update `importAjsDefinitionViaWebApiCommand.test.ts`,
  `webapiImportWiring.test.ts`, related telemetry tests, `rtk pnpm test`,
  `rtk pnpm run qlty`, and web validation if command wiring affects web host
  behavior.
- Production Readiness:
  - Failure mode:
    telemetry failures must not hide user-facing import errors or change
    cancellation behavior.
  - JP1/AJS compatibility:
    no OpenAPI, request, response, normalization, or import behavior changes.
  - Large or malformed input risk:
    success uses unit-count buckets rather than content or exact sensitive
    values unless exact unit count remains explicitly approved.
  - Desktop/web impact:
    unsupported web host remains recoverable and privacy-safe.
  - README/docs impact:
    telemetry policy docs may mention WebAPI workflow metadata.
  - CHANGELOG impact:
    evaluate because beta telemetry scope changes but user workflow should not.
- Approval Boundary:
  WebAPI import workflow telemetry only.
- Dependencies:
  Slice 1.
- Risks:
  input-step telemetry could accidentally imply user environment shape; use
  generic step IDs only.
- Out of Scope:
  real JP1/AJS3 environment smoke verification, beta exit, new WebAPI
  endpoints, and credential behavior changes.

### Slice 4: Viewer Action Telemetry

- Status: Complete
- Scope:
  add schema-owned telemetry for current table and flow viewer actions:
  CSV copy/save, unit selection, unit-definition opening, list-to-flow and
  flow-to-list navigation, flow scope opening, nested expansion, relationship
  focus, and MiniMap toggling.
- User / Domain Value:
  identifies which viewer affordances are actually used and which interaction
  paths may need prioritization or simplification.
- Cohesive Change Group:
  `src/shared/webviewEvents.ts`,
  `src/presentation/webview/editor/ajsTable/*`,
  `src/presentation/webview/editor/ajsFlow/*`,
  `src/presentation/vscode/webview/viewerMessageRouting.ts`,
  `src/presentation/vscode/webview/messageHandlers.ts`,
  viewer action tests, navigation tests, table/flow controller tests, and
  web smoke tests if message contracts change.
- Acceptance:
  action events use approved operation IDs and safe unit type or count buckets
  only; no unit names, absolute paths, comments, commands, CSV content, or
  definition content are emitted.
- Validation:
  update `reportWebviewOperation.test.ts`, `viewerMessageRouting.test.ts`,
  `viewerFactory.test.ts`, table navigation tests, selected-node/detail tests,
  flow controller tests where needed, `rtk pnpm test`, `rtk pnpm run test:web`,
  and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode:
    telemetry must not block postMessage routing, CSV save/copy, navigation,
    selection, expansion, or focus toggles.
  - JP1/AJS compatibility:
    no list, flow, CSV, or unit-definition behavior changes.
  - Large or malformed input risk:
    events should use buckets and static action names only.
  - Desktop/web impact:
    webview event payload changes must remain serializable and host-neutral.
  - README/docs impact:
    README telemetry policy may need to cover anonymous viewer actions.
  - CHANGELOG impact:
    evaluate because telemetry behavior changes but visible actions should not.
- Approval Boundary:
  current viewer action telemetry only.
- Dependencies:
  Slice 1; Slice 2 if readiness/session context is reused.
- Risks:
  adding telemetry to high-frequency interactions can create noise; avoid hover
  and per-keystroke telemetry in this slice.
- Out of Scope:
  search outcome telemetry, diagnostics telemetry, and performance telemetry.

### Slice 5: Search Outcome Telemetry

- Status: Complete
- Scope:
  add privacy-safe search telemetry for current table and flow search submit,
  navigation, clear, no-match, and failure outcomes using query-length,
  result-count, surface, scope, mode, and duration buckets.
- User / Domain Value:
  answers which searches fail and whether current table/flow search behavior
  should drive unified search prioritization.
- Cohesive Change Group:
  `src/presentation/webview/editor/shared/HeaderSearchField.tsx`,
  `src/presentation/webview/editor/ajsTable/tableSearchController.ts`,
  `src/presentation/webview/editor/ajsTable/tableSearchState.ts`,
  `src/presentation/webview/editor/ajsFlow/useFlowSearchState.ts`,
  `src/presentation/webview/editor/ajsFlow/flowSearchState.ts`,
  `src/presentation/webview/editor/ajsFlow/flowSearch.ts`,
  search tests, webview message/event tests if telemetry crosses the VS Code
  boundary, and telemetry schema tests.
- Acceptance:
  search events never include query text, matched absolute paths, unit IDs,
  unit names, comments, or parameter values; they report only approved buckets,
  result status, search mode, surface, and scope.
- Validation:
  update table search, flow search, header search, and telemetry tests; run
  `rtk pnpm test`, `rtk pnpm run test:web`, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode:
    telemetry must not alter search state, focus, reveal behavior, or result
    navigation.
  - JP1/AJS compatibility:
    no query semantics or matching behavior changes.
  - Large or malformed input risk:
    result counts are bucketed and query text is not retained.
  - Desktop/web impact:
    current webview search behavior remains host-neutral.
  - README/docs impact:
    README telemetry policy may need to mention anonymous search outcome data.
  - CHANGELOG impact:
    evaluate because telemetry behavior changes but search behavior should not.
- Approval Boundary:
  current table and flow search telemetry only; no shared search use case.
- Dependencies:
  Slice 1; optional shared event transport from Slice 4 if adopted.
- Risks:
  query length can still be sensitive for tiny populations; use coarse buckets
  and never include the raw query.
- Out of Scope:
  unified search implementation and search behavior changes.

### Slice 6: Diagnostics And Hover Telemetry

- Status: Complete
- Scope:
  add privacy-safe editor feedback telemetry for diagnostic evaluation,
  diagnostic reported categories or rule IDs, hover requests, and hover
  resolution outcomes.
- User / Domain Value:
  identifies which diagnostics occur most frequently and whether hover support
  is useful without exposing source text.
- Cohesive Change Group:
  `src/application/editor-feedback/*` for stable diagnostic category or rule
  IDs if needed, `src/presentation/vscode/diagnostics/registerDiagnostics.ts`,
  `src/presentation/vscode/languages/registerHoverProvider.ts`,
  diagnostic and hover tests, and telemetry tests.
- Acceptance:
  diagnostic telemetry uses anonymous categories or stable rule IDs and count
  buckets; it does not emit diagnostic messages, parameter values, source
  excerpts, file paths, unit names, or hover token text.
- Validation:
  update `buildSyntaxDiagnostics.test.ts` only if DTO category/rule IDs are
  added, plus `registerHoverProvider.test.ts`, diagnostics adapter tests if
  added, telemetry tests, `rtk pnpm test`, `rtk pnpm run test:web` if shared
  editor feedback wiring affects web, and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode:
    telemetry failures must not suppress diagnostics or hover results.
  - JP1/AJS compatibility:
    diagnostic messages, positions, severity, and hover content remain
    unchanged unless a separate approved behavior change exists.
  - Large or malformed input risk:
    diagnostic counts are bucketed; raw text is never emitted.
  - Desktop/web impact:
    diagnostics and hover should remain compatible in both extension hosts.
  - README/docs impact:
    README telemetry policy may mention anonymous diagnostic categories.
  - CHANGELOG impact:
    evaluate because telemetry behavior changes; diagnostic behavior should
    not change.
- Approval Boundary:
  editor feedback telemetry and anonymous diagnostic identifiers only.
- Dependencies:
  Slice 1.
- Risks:
  current diagnostic DTOs expose messages but not rule IDs; adding rule IDs
  must preserve existing consumers and avoid message-based telemetry.
- Out of Scope:
  new diagnostic rules, diagnostic wording changes, and hover content changes.

### Slice 7: Performance Telemetry

- Status: Approved
- Scope:
  add coarse performance telemetry around parse, unit-list build, flow-graph
  build, table readiness, flow readiness, CSV export, and other approved
  current operations where duration and size buckets can be measured safely.
- User / Domain Value:
  identifies slow operations and large-input stress points without collecting
  content or paths.
- Cohesive Change Group:
  timing helpers in `src/application/telemetry/*`, callers around
  `createBuildUnitList`, `buildFlowGraph`, viewer document posting, CSV export
  flow, table/flow readiness wiring, and related unit/viewer tests.
- Acceptance:
  performance events use duration and size buckets only; user workflows remain
  unchanged; timing code is small, deterministic in tests, and injectable where
  needed.
- Validation:
  unit tests with injected clocks or duration values, viewer/application tests
  for emitted buckets, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode:
    timing failures or unavailable clocks must not break operations.
  - JP1/AJS compatibility:
    no parser, list, flow, export, or diagnostic behavior changes.
  - Large or malformed input risk:
    performance telemetry must avoid additional full-tree traversals when
    counts are already available.
  - Desktop/web impact:
    use browser-safe timing APIs or injectable clocks.
  - README/docs impact:
    README telemetry policy may mention anonymous performance buckets.
  - CHANGELOG impact:
    evaluate because telemetry scope changes but user behavior should not.
- Approval Boundary:
  performance telemetry for approved current operations only.
- Dependencies:
  Slice 1; may reuse lifecycle/viewer readiness context from Slice 2.
- Risks:
  measuring too broadly can add overhead; prefer existing boundaries and
  already-computed counts.
- Out of Scope:
  profiling dashboards, optimization work, and performance behavior changes.

### Slice 8: Roadmap Telemetry Readiness

- Status: Approved
- Scope:
  document telemetry guidance for unified search, semantic definition
  comparison, dependency analysis, review support, and AI-assisted features
  without adding runtime schema constants, builders, or emitted events for
  features that do not exist yet.
- User / Domain Value:
  gives future roadmap features a consistent, privacy-safe telemetry contract
  before implementation pressure appears.
- Cohesive Change Group:
  `docs/specs/features/telemetry-improvement/SPECS.md`,
  `docs/specs/features/telemetry-improvement/TRACEABILITY.md`,
  `docs/specs/roadmap.md`, and
  `docs/requirements/use-cases/uc-record-telemetry.md`.
- Acceptance:
  future event families are named, privacy constraints are explicit, AI
  telemetry forbids prompts/responses/content, and no unused runtime events are
  emitted.
- Validation:
  docs validation with `rtk pnpm run lint:md` and `rtk pnpm run qlty`.
- Production Readiness:
  - Failure mode:
    readiness docs do not affect runtime behavior.
  - JP1/AJS compatibility:
    no behavior changes.
  - Large or malformed input risk:
    future features are constrained to bucketed metadata.
  - Desktop/web impact:
    future guidance remains host-neutral.
  - README/docs impact:
    no README update unless user-facing telemetry policy wording changes.
  - CHANGELOG impact:
    not required for docs-only readiness unless documented extension behavior
    changes.
- Approval Boundary:
  roadmap telemetry guidance only; runtime schema constants, builders, and
  emitted events for future features require Slice 1 scope or a separately
  approved implementation slice.
- Dependencies:
  Slice 1.
- Risks:
  future guidance can become stale if it predicts implementation details; keep
  only durable categories and privacy rules.
- Out of Scope:
  implementing unified search, semantic comparison, dependency analysis,
  review support, AI-assisted features, their runtime telemetry, and unused
  runtime schema reservations.

## Traceability

- TRACEABILITY.md required: yes
- Reason:
  the feature is non-trivial, changes telemetry behavior, spans multiple
  product areas, and needs explicit mapping from use cases and requirements to
  implementation slices and validation.

## Cross-Slice Dependencies

- Slice 1 is the foundation for all runtime telemetry slices.
- Slices 2 through 7 may be implemented independently after Slice 1 if their
  approval boundaries stay separate and tests prove no behavior regression.
- Slice 4 may provide shared webview action plumbing that Slice 5 can reuse,
  but Slice 5 must not depend on unified search behavior.
- Slice 8 is docs-only after Slice 1. Runtime schema placeholders for future
  features belong in Slice 1 only if they are part of the approved schema
  foundation, or in a separately approved implementation slice.

## Feature-Level Risks

- Existing event names may have dashboard consumers; migration or aliasing must
  be decided before replacing event names.
- Diagnostic messages are not safe long-term telemetry identifiers if future
  messages include raw values; rule IDs or categories need a stable design.
- Search, workflow, and AI-related telemetry can become sensitive if raw input
  or outputs leak; schema allowlists and tests are mandatory.
- Workflow abandonment is only reliable for observable states; avoid timers or
  assumptions that create misleading telemetry.
- Performance telemetry can add overhead if it performs extra traversals; use
  already-computed counts and coarse buckets.
- README and CHANGELOG impact need a human decision because telemetry scope is
  externally documented even when user-visible workflows do not change.

## Use-Case Back-Propagation

- `uc-record-telemetry.md` already carries the durable behavior contract for
  privacy-preserving operational telemetry.
- Add or refine use-case text only if implementation reveals a durable behavior
  rule not already represented in the use case.
- Do not create separate use cases for dashboards, analytics backends, or
  planned roadmap feature behavior in this feature.

## Feature Exit

- Definition of Done status:
  not ready. Slices 1 through 6 are complete; Slices 7 through 8 remain approved
  for implementation.
- Durable documentation updates:
  `uc-record-telemetry.md`, `docs/specs/plans.md`, and `docs/specs/roadmap.md`
  were updated during feature intake; later slices must keep them synchronized
  only when durable behavior or repository sequencing changes.
- Open risks:
  event compatibility, diagnostic rule ID design, bucket boundaries, reliable
  abandonment detection, README telemetry policy timing, and CHANGELOG need.

## Validation

- [ ] Tests added or updated for each approved implementation slice
- [ ] Update README or user documentation if user-facing telemetry policy
      changes
- [ ] Run relevant validation for each approved slice

## Notes

- Keep feature requirements and boundary decisions in SPECS.md.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and feature exit readiness only.
- Use `sdd-review-plan` next to review this plan before human approval and
  implementation.
