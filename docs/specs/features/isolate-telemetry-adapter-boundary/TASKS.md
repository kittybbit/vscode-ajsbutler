# Feature Tasks: Isolate Telemetry Adapter Boundary

## Agent Brief

- Purpose: isolate telemetry SDK translation, construction, lifecycle, and
  failure behind one repository-owned reporting boundary.
- Approved or active slice: Slice 1 is complete.
- Do not expand production event/property collection beyond the enumerated
  legacy baseline, change emitted meaning, or weaken privacy.
- Do not make telemetry required for parser, viewer, import, diagnostics,
  hover, navigation, semantic diff, or report behavior.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, and the architecture
  telemetry boundary.
- Validate code with focused telemetry/composition tests, desktop/web checks,
  build, and `rtk pnpm run qlty`.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: run Feature Exit Mode with `sdd-plan-task`.

## Plan Status

- Status: Complete
- Planning scope: the complete telemetry port/schema, SDK adapter, bootstrap
  construction, caller migration, failure isolation, and boundary enforcement.
- Review status: Reviewed
- Human approval: Approved
- Active implementation slice: none.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 1 exactly as bounded below, including the enumerated
  legacy telemetry schema migration, validated-event contract, infrastructure
  failure isolation, caller migration, and directly related tests and
  architecture guardrails.

## Impact Investigation

- Current SDK ownership: `@vscode/extension-telemetry` is imported only by
  `src/infrastructure/telemetry/VscodeTelemetryAdapter.ts`, and the architecture
  collector already detects imports outside that adapter.
- Current repository contract: `TelemetryPort.trackEvent(name, properties)`
  exposes arbitrary names and property maps to bootstrap and presentation
  callers even though allowlisted event builders exist under
  `src/application/telemetry/**`.
- Current schema ownership: the new event catalog and allowlist are
  application-owned, but legacy lifecycle, preview, and webview operation
  names or payloads are still created directly in presentation/bootstrap
  callers. The emitted legacy and schema-owned events must both retain their
  current meaning during this boundary-only feature.
- Current failure ownership: initialization falls back to a no-op adapter, but
  send failures are handled inconsistently by caller-local `try/catch`; some
  direct reporting paths can still propagate adapter errors.
- Affected runtime surfaces:
  `src/application/telemetry/**`, `src/infrastructure/telemetry/**`,
  `src/bootstrap/extension/**`, and telemetry-reporting adapters under
  `src/presentation/vscode/**`.
- Affected tests: telemetry schema and adapter creation; extension lifecycle,
  dependency, runtime, subscription, and viewer wiring; diagnostics, hover,
  WebAPI import, preview/webview operation and routing; architecture dependency
  rules; desktop and web extension validation.
- Related durable docs: the existing telemetry sections of
  `docs/specs/architecture.md` and `docs/specs/roadmap.md` already state the
  intended durable boundary and privacy policy. No pre-implementation change
  is needed.
- Breaking-change risk: internal compile-time contract change only. Event
  names, emitted properties, no-op behavior, user workflows,
  `engines.vscode`, and desktop/web support must remain unchanged.
- Rejected alternative: keep raw `trackEvent(name, properties)` as a parallel
  migration API. It would preserve the leak this feature exists to remove and
  leave two reporting paths with different failure guarantees.

## Replanning Record

- Discovered gap: review found that the plan did not distinguish schema
  registration of already-emitted legacy properties from new collection, and
  did not define how callers are prevented from structurally constructing an
  unfiltered event.
- Smallest revision: preserve Slice 1 and its dependencies, while fixing the
  reporting contract, legacy baseline, approval boundary, failure validation,
  and privacy traceability. No new slice or product behavior is introduced.

## Implementation Slices

### Slice 1: Enforce One Privacy-Safe Telemetry Reporting Boundary

- Status: Complete
- Scope:
  - Replace the arbitrary name/property reporting surface with a
    repository-owned `report(ValidatedTelemetryEvent)` contract that exposes no
    telemetry SDK types. Give `ValidatedTelemetryEvent` a module-private nominal
    brand so ordinary production callers cannot construct it from a raw
    `{ name, properties }` object; the existing allowlist factory and
    workflow-specific builders remain its only normal construction path.
  - Keep the existing application event catalog, property allowlist, bucket
    builders, and workflow-specific event builders as the explicit schema
    owners. Add definitions for the already-emitted legacy baseline:
    `ext.activate`, `ext.deactivate`, `ajsbutler.tableViewer`,
    `ajsbutler.flowViewer`, and `operation`. Register the existing
    `viewType` key used by `operation`; this records current collection and must
    not add, remove, or rename any emitted event or property.
  - Make the infrastructure SDK adapter and no-op adapter own non-throwing
    report/dispose behavior. Catch only SDK reporter calls so application or
    presentation failures remain observable. Keep initialization fallback and
    adapter selection in `src/bootstrap/extension/createTelemetry.ts`.
  - Add a narrow infrastructure-local SDK reporter seam used by the adapter's
    production default and focused tests. Do not expose SDK reporter types
    through the application port or bootstrap dependency surface.
  - Inject the repository-owned reporter through the extension runtime and
    migrate all bootstrap and VS Code presentation callers. Remove caller-local
    failure guards made redundant by the non-throwing boundary.
  - Strengthen architecture tests so production SDK imports and low-level SDK
    translation remain confined to the infrastructure adapter.
- User / Domain Value: telemetry remains invisible to extension workflows and
  cannot break user operations, while the privacy allowlist becomes the only
  production reporting route. No JP1/AJS domain behavior changes.
- Cohesive Change Group:
  - Contract/schema:
    `src/application/telemetry/TelemetryPort.ts`,
    `src/application/telemetry/telemetryEvent.ts`, and the existing
    workflow-specific telemetry builders in `src/application/telemetry/**`.
  - Adapters/composition:
    `src/infrastructure/telemetry/{VscodeTelemetryAdapter,NoopTelemetryAdapter}.ts`,
    `src/bootstrap/extension/createTelemetry.ts`, extension runtime/dependency/
    lifecycle/subscription wiring, viewer wiring, and WebAPI import wiring.
  - Callers: telemetry-reporting modules under
    `src/presentation/vscode/{commands,diagnostics,languages,webview}/**` plus
    the presentation-owned host mapper.
  - Tests: existing telemetry, bootstrap/composition, workflow failure, and
    architecture dependency suites named in Impact Investigation.
- Acceptance:
  - Production code outside the infrastructure adapter has no telemetry SDK
    import or SDK-specific type.
  - Production callers cannot assign a raw `{ name, properties }` object to
    `ValidatedTelemetryEvent` or submit an arbitrary unfiltered property map
    directly to the SDK adapter; all emitted events are factory-created through
    the repository-owned privacy allowlist.
  - Bootstrap remains the sole construction/selection owner and still selects
    the no-op implementation when telemetry is unavailable.
  - Every event currently asserted by lifecycle, preview, viewer, search,
    performance, diagnostics, hover, and WebAPI import tests retains its event
    name and property meaning. Adding legacy definitions and the existing
    `viewType` key to the catalog must not expand production collection.
  - Adapter construction, reporting, or disposal failure does not escape into
    any representative extension workflow, while non-telemetry caller errors
    remain observable.
- Validation:
  - Update `telemetryEvent.test.ts` with a compile-time nominal-contract check,
    forbidden-key filtering at the factory boundary, and exact assertions for
    every enumerated legacy event/property definition.
  - Add `telemetryAdapter.test.ts` using the infrastructure-local reporter seam
    to prove SDK report/dispose throws are contained and exact validated events
    are translated without mutation.
  - Update representative workflow tests for lifecycle, preview/viewer,
    diagnostics/hover, and WebAPI import to prove failure isolation at the
    injected boundary rather than caller-local guards. Include a focused
    assertion that a non-telemetry caller failure is not swallowed.
  - Update composition and architecture dependency tests to prove bootstrap
    ownership, desktop/web contract compatibility, SDK confinement, removal of
    the raw repository `trackEvent(name, properties)` surface, and migration of
    every production call site to validated events.
  - Run the nearest affected test suites, then
    `rtk pnpm run test:full`, `rtk pnpm run build`, and
    `rtk pnpm run qlty`.
  - Review new Qlty smell findings if any. Use metric movement only when it
    identifies a concrete reporting, schema, or lifecycle responsibility.
- Production Readiness:
  - Failure mode: SDK construction falls back to no-op; report/dispose errors
    are contained at the adapter boundary and never alter workflow results or
    user-facing errors. Catch scopes must not hide event-building, application,
    presentation, or other non-SDK errors.
  - JP1/AJS compatibility: no definition interpretation, command/config
    reference, parser, diagnostic rule, or serialized AJS data changes.
  - Large or malformed input risk: no raw definition content enters telemetry;
    existing bucketed scalar metadata and performance characteristics remain
    unchanged.
  - Desktop/web impact: shared bootstrap and reporting contracts affect both
    hosts. Preserve browser-safe bundling of the SDK adapter and verify both
    desktop and web extension tests/build outputs.
  - README/docs impact: none unless implementation discovers a durable boundary
    statement missing from `docs/specs/architecture.md`; such a discovery
    requires replanning before expanding docs.
  - CHANGELOG impact: none under the repository criteria because this is an
    internal refactor with no externally observable behavior change.
- Approval Boundary: one commit may change only the existing telemetry
  contract/schema/builders, two infrastructure adapters, bootstrap injection
  and lifecycle wiring, current VS Code telemetry callers, and directly related
  tests/architecture guardrails. It may register the already-emitted
  `ext.activate`, `ext.deactivate`, `ajsbutler.tableViewer`,
  `ajsbutler.flowViewer`, and `operation` event names plus the existing
  `viewType` property key without changing their emitted payloads. Any event or
  property that expands production collection beyond this enumerated baseline,
  dashboard semantics, user-visible behavior, or unrelated composition cleanup
  requires replanning and separate approval.
- Dependencies: completed `architecture-inventory-and-guardrails`,
  `isolate-parser-boundary`, and `complete-normalized-domain-model` roadmap
  prerequisites. No dependency on optional telemetry product expansion.
- Risks:
  - Legacy and schema-owned events are currently emitted side by side in some
    workflows; accidental deduplication would change existing event meaning.
  - The nominal brand is a TypeScript production-call-site guard, not an
    untrusted-runtime serialization boundary. Runtime privacy still depends on
    factory allowlisting before the adapter receives the event.
  - A broad signature migration can omit a caller unless semantic reference
    checks and architecture tests verify all call sites.
  - Catching SDK errors must not accidentally catch or hide application or
    presentation errors.
- Out of Scope:
  - New events, properties, buckets, product questions, dashboards, or
    abandonment semantics.
  - Changes to telemetry credentials/connection-string policy.
  - Parser, viewer, diagnostics, hover, WebAPI, navigation, semantic diff, or
    report behavior.
  - General composition-root or serialization cleanup reserved for later
    roadmap features.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: this is a non-trivial cross-cutting boundary change with explicit
  privacy, failure, composition, and desktop/web compatibility requirements.

## Implementation Evidence

- Human completion approval: Approved on 2026-07-25 in the current
  conversation.
- Baseline desktop test preparation and desktop extension tests passed before
  runtime edits.
- `rtk pnpm run test:compile` and `rtk pnpm run test:desktop:run` passed after
  the implementation.
- `rtk pnpm run test:full` completed the development desktop/web bundles,
  TypeScript test compilation, and desktop tests. Its browser launch was
  blocked only by the workspace sandbox's Chromium Mach-port permission;
  `rtk pnpm run test:web:run` passed when rerun with the required permission.
- `rtk pnpm run build` passed for production webview, desktop extension, and
  web extension bundles. Existing webpack asset-size warnings remain.
- `rtk pnpm run qlty`, focused Markdown lint, and final diff checks passed.
- The independent higher-risk review found a mutable validated-property map,
  two missing representative failure tests, and a stale branch note. The map
  is now readonly, lifecycle and preview failure tests cover the real adapter
  seam, and the branch note is current; affected validation passed afterward.

## Implementation Feedback

- The single-slice boundary was appropriate: changing the nominal event
  contract, adapters, callers, and architecture guard together avoided a
  temporary raw reporting path.
- The SDK reporter's asynchronous `dispose()` rejection behavior was a useful
  planning detail not explicit in the initial impact inventory; the adapter
  seam and focused test now cover both synchronous throws and asynchronous
  rejection.
- No new dependency, slice, JP1/AJS behavior, or desktop/web design difference
  was discovered. Existing architecture documentation already states the
  durable boundary, so no long-lived document update is warranted.

## Cross-Slice Dependencies

- None. The feature has one slice because the public reporting contract,
  adapters, all production callers, failure tests, and architecture enforcement
  must change together to avoid an unvalidated dual reporting path.

## Feature-Level Risks

- Preserve both legacy and schema-owned event meaning until a separately
  approved telemetry-product feature decides otherwise.
- Keep telemetry entirely outside the domain layer and optional for every
  application and presentation workflow.
- Do not raise `engines.vscode` or introduce Node-only behavior into shared web
  paths.
- Implementation is on the dedicated
  `codex/isolate-telemetry-adapter-boundary` feature branch.

## Use-Case Back-Propagation

- No telemetry use case is created because telemetry is not product/domain
  behavior and no observable workflow changes.
- At Feature Exit, re-check `docs/specs/architecture.md`; update it only if the
  implemented verified invariant is not already represented. Roadmap sequencing
  changes only when this feature completes.

## Feature Exit

- Definition of Done status: not started.
- Durable documentation updates: evaluate the existing architecture boundary
  and roadmap completion entry in Feature Exit Mode.
- Open risks: event drift, incomplete caller migration, leaked adapter failure,
  or accidental sensitive-property bypass.
