# Feature Specification: Telemetry Improvement

## Purpose

Define a privacy-preserving telemetry product capability that measures feature
adoption, workflow success or abandonment, search outcomes, operation
performance, diagnostic frequency, and roadmap signals without collecting
JP1/AJS definition content or personal identifiers.

## Origin

- Source use case: `docs/requirements/use-cases/uc-record-telemetry.md`
- Branch plan: `docs/specs/plans.md`
- Implementation-slice plan: `TASKS.md`
- Roadmap basis: telemetry is a roadmap-visible product capability because it
  supports prioritization across current viewers, editor feedback, WebAPI
  import, unified search, semantic comparison, dependency analysis, review
  support, and AI-assisted features.

## Current Telemetry Assessment

The current implementation is useful as a minimal telemetry boundary but is not
sufficient for product improvement.

- Current coverage:
  - extension activation and deactivation
  - table and flow preview open events
  - generic webview operation events such as CSV copy or save
  - WebAPI import beta result metadata
- Current strengths:
  - telemetry is already routed through a narrow `TelemetryPort`
  - SDK-specific implementation stays in infrastructure
  - existing use case already requires privacy-conscious payloads
- Current gaps:
  - event names are not organized by product area or lifecycle stage
  - usage events do not identify whether workflows complete, fail, or are
    abandoned
  - searches do not report success, failure, result counts, or latency
  - diagnostics are not summarized by anonymous diagnostic category
  - expensive operations do not report duration buckets or size buckets
  - roadmap features do not have a reusable telemetry vocabulary
  - payload rules rely on caller discipline rather than a shared schema,
    privacy review, and testable redaction boundary

## Requirements

- Telemetry must answer product-improvement questions rather than only raw
  usage counts:
  - which features are used
  - which features are rarely used
  - which workflows are abandoned
  - which searches fail
  - which operations become slow
  - which roadmap items should be prioritized
  - which diagnostics occur most frequently
- Telemetry must collect only anonymous operational metadata.
- Telemetry must never collect:
  - job names
  - unit names
  - comments
  - commands
  - definition contents
  - file paths
  - search text
  - user names
  - organization names
  - server names, manager names, service names, URLs, tokens, credentials, or
    raw WebAPI response bodies
- Event names must follow a consistent namespace:
  `<area>.<object>.<action>` or `<area>.<workflow>.<stage>`.
- Event names must be stable enough for dashboards and release-to-release
  comparison.
- Event payloads must be schema-owned and allowlisted.
- Event payload values must be strings because the current telemetry port
  exposes string properties.
- Numeric values must be represented as coarse buckets unless an exact count is
  explicitly non-sensitive and product-relevant.
- Duration telemetry must use coarse buckets such as `lt100ms`, `100_499ms`,
  `500_999ms`, `1_4s`, `5_14s`, `15s_plus`, or a similarly documented set.
- Size telemetry must use coarse buckets such as unit count, diagnostic count,
  row count, node count, edge count, or file size ranges; it must not expose
  content or names.
- Error telemetry must use repository-owned error codes or diagnostic rule IDs,
  not raw exception messages, server messages, stack traces, file paths, URLs,
  or definition excerpts.
- Diagnostic telemetry must report anonymous diagnostic categories or rule IDs
  and aggregate counts; it must not report offending parameter values or source
  text.
- Search telemetry must report query length bucket, result count bucket,
  target surface, mode, outcome, and duration bucket; it must not report query
  text or matched unit identity.
- Workflow telemetry must model `started`, `completed`, `cancelled`,
  `failed`, and `abandoned` stages where abandonment can be observed reliably.
- Feature usage telemetry must distinguish command invocation, view readiness,
  user action, and successful result when those are different product signals.
- Telemetry must support both desktop and web extension hosts. Unsupported
  host behavior must be reported only through anonymous host and result
  metadata.
- Telemetry must remain optional and respect VS Code telemetry settings through
  the telemetry SDK behavior.
- Telemetry must be safe for beta features, including WebAPI import, by using
  explicit beta area names or properties without exposing environment details.
- Telemetry must support future roadmap features:
  - unified search
  - semantic definition comparison
  - dependency analysis
  - review support
  - AI-assisted features
- AI-assisted telemetry must never collect prompts, responses, definition
  content, names, generated command text, or organization identifiers. It may
  report anonymous capability usage, provider category, outcome, cancellation,
  safety refusal category, token-count bucket if available, and duration
  bucket.

## Recommended Event Catalog

Initial implementation planning should refine this catalog into approved
slices. Event names below are feature-level requirements, not implemented
events.

### Extension Lifecycle

- `extension.lifecycle.activated`
- `extension.lifecycle.deactivated`
- `extension.lifecycle.telemetry_initialized`

Allowed properties:

- `development`
- `host`: `desktop` or `web`
- `result`: `success`, `noop`, or `failed`

### Viewer Usage

- `viewer.table.open_started`
- `viewer.table.ready`
- `viewer.table.closed`
- `viewer.flow.open_started`
- `viewer.flow.ready`
- `viewer.flow.closed`

Allowed properties:

- `host`
- `source`: `command`, `navigation`, or `restore`
- `result`: `success`, `failed`, or `cancelled`
- `durationBucket`
- `unitCountBucket`
- `rowCountBucket`
- `nodeCountBucket`
- `edgeCountBucket`
- `errorCode`

### Viewer Actions

- `viewer.table.csv_copied`
- `viewer.table.csv_saved`
- `viewer.table.column_visibility_changed`
- `viewer.table.unit_selected`
- `viewer.table.definition_opened`
- `viewer.table.navigate_to_flow`
- `viewer.flow.unit_selected`
- `viewer.flow.definition_opened`
- `viewer.flow.scope_opened`
- `viewer.flow.nested_expansion_toggled`
- `viewer.flow.relationship_focus_toggled`
- `viewer.flow.minimap_toggled`
- `viewer.flow.navigate_to_table`

Allowed properties:

- `host`
- `view`
- `result`
- `durationBucket`
- `visibleColumnCountBucket`
- `selectedUnitType`
- `targetUnitType`
- `expandedDepthBucket`
- `errorCode`

Unit type is allowed only when it uses JP1/AJS type codes or repository-owned
normalized categories and never includes unit names or paths.

### Search

- `search.table.submitted`
- `search.table.navigated`
- `search.table.cleared`
- `search.flow.submitted`
- `search.flow.navigated`
- `search.flow.cleared`
- `search.unified.submitted`
- `search.unified.navigated`
- `search.unified.cleared`

Allowed properties:

- `host`
- `surface`: `table`, `flow`, or `unified`
- `mode`: `partial`, `fuzzy`, `exact`, `regex`, or `unknown`
- `result`: `matched`, `no_match`, `invalid_query`, `cancelled`, or `failed`
- `queryLengthBucket`
- `resultCountBucket`
- `durationBucket`
- `scope`: `current_flow_scope`, `whole_document`, or `visible_rows`
- `errorCode`

### Diagnostics And Editor Feedback

- `editor.diagnostics.evaluated`
- `editor.diagnostics.reported`
- `editor.hover.requested`
- `editor.hover.resolved`

Allowed properties:

- `host`
- `result`
- `durationBucket`
- `diagnosticCountBucket`
- `diagnosticRuleId`
- `diagnosticCategory`
- `hoverTargetCategory`
- `errorCode`

Diagnostics should report aggregated counts per anonymous rule/category. They
must not include diagnostic messages if those messages can expose raw values in
future rules.

### WebAPI Import

- `webapi_import.workflow.started`
- `webapi_import.workflow.cancelled`
- `webapi_import.workflow.failed`
- `webapi_import.workflow.completed`
- `webapi_import.workflow.unsupported_host`

Allowed properties:

- `host`
- `stage`
- `result`
- `errorCode`
- `httpStatusCategory`
- `durationBucket`
- `unitCountBucket`
- `all`
- `inputStep`: only generic step IDs such as `base_url`, `manager`,
  `service_name`, `location`, `username`, or `password`; never values

### Performance

- `performance.parse.completed`
- `performance.unit_list_build.completed`
- `performance.flow_graph_build.completed`
- `performance.table_render.ready`
- `performance.flow_render.ready`
- `performance.csv_export.completed`

Allowed properties:

- `host`
- `operation`
- `result`
- `durationBucket`
- `unitCountBucket`
- `rowCountBucket`
- `nodeCountBucket`
- `edgeCountBucket`
- `diagnosticCountBucket`
- `errorCode`

### Planned Roadmap Capabilities

- `compare.semantic.started`
- `compare.semantic.completed`
- `dependency_analysis.started`
- `dependency_analysis.completed`
- `review_support.started`
- `review_support.completed`
- `ai_assist.started`
- `ai_assist.completed`
- `ai_assist.cancelled`
- `ai_assist.failed`

Allowed properties:

- `host`
- `capability`
- `result`
- `durationBucket`
- `inputSizeBucket`
- `outputSizeBucket`
- `findingCountBucket`
- `providerCategory`
- `safetyCategory`
- `errorCode`

## Architecture

- Domain: none. Domain must not import telemetry contracts, SDK types, VS Code
  APIs, or presentation telemetry helpers.
- Application:
  - owns telemetry event schema types, allowlisted property keys, coarse bucket
    helpers, and product-level telemetry event builders where practical
  - exposes telemetry recording ports without SDK-specific types
  - may expose privacy-safe diagnostic categories or rule IDs that callers can
    aggregate
- Presentation:
  - records user actions, workflow stages, search outcomes, navigation, viewer
    readiness, and editor feedback outcomes through application telemetry
    event builders
  - must not pass raw search text, paths, unit names, comments, commands, file
    content, raw errors, or server details to telemetry
- Infrastructure:
  - owns the concrete VS Code telemetry adapter
  - handles SDK initialization and disposal
  - preserves Noop fallback when telemetry is unavailable or not configured

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs:
  - `src/application/telemetry/TelemetryPort.ts`
  - `src/bootstrap/extension/*`
  - `src/infrastructure/telemetry/*`
  - `src/presentation/vscode/commands/*`
  - `src/presentation/vscode/diagnostics/registerDiagnostics.ts`
  - `src/presentation/vscode/languages/registerHoverProvider.ts`
  - `src/presentation/vscode/webview/*`
  - `src/presentation/webview/editor/ajsTable/*`
  - `src/presentation/webview/editor/ajsFlow/*`
  - relevant telemetry, command, viewer, diagnostics, search, WebAPI import,
    and web smoke tests
  - `README.md` telemetry section and `CHANGELOG.md` if externally visible
    telemetry behavior or policy changes
- Propagation decision:
  introduce schema and privacy guardrails before broad event expansion; then
  add events in focused product areas so each slice can validate privacy,
  behavior preservation, and compatibility.

### Breaking Change Analysis

- User-visible behavior:
  telemetry should not change visible behavior. README privacy text may change.
- API/DTO/schema compatibility:
  internal telemetry event schema may change. Existing telemetry event names
  should either be preserved through compatibility aliases or changed only with
  an explicit dashboard migration decision.
- VS Code/web extension compatibility:
  no minimum VS Code version increase is expected. Web extension behavior must
  keep Noop fallback or SDK-safe behavior when telemetry cannot initialize.
- Changed scenarios:
  telemetry scenarios in `uc-record-telemetry.md` are expanded to product
  improvement, privacy, performance, error, search, diagnostics, and roadmap
  capability telemetry.

### Alternative Considerations

- Keep only current telemetry:
  rejected because it cannot answer abandonment, search failure, diagnostic
  frequency, performance, or prioritization questions.
- Add ad hoc events at call sites:
  rejected because privacy and naming consistency would depend on each caller.
- Centralize all telemetry in infrastructure:
  rejected because product event semantics and privacy buckets belong above the
  SDK adapter.
- Collect exact names, paths, search text, or raw errors:
  rejected because it violates the privacy boundary.
- Implement a full analytics pipeline in this extension:
  rejected for this feature. The extension should emit safe events; dashboards
  and analysis tooling stay outside repository runtime unless separately
  approved.

### Approval Impact Decisions

- Approval evidence owner: TASKS.md `Human Approval`
- Scope changes requiring re-approval:
  - adding telemetry that collects or derives user content, names, paths,
    search text, server identity, credentials, prompts, responses, or raw
    errors
  - changing telemetry provider or SDK
  - raising `engines.vscode`
  - adding AI-assisted telemetry beyond anonymous operational metadata
  - broadening telemetry to new product areas not covered by this specification

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility:
  telemetry schema and event builders must be host-neutral; the concrete
  adapter must preserve current web behavior and Noop fallback when needed.
- Desktop extension compatibility:
  lifecycle, commands, viewers, diagnostics, hover, import, and CSV workflows
  must preserve current behavior while adding anonymous telemetry.
- JP1/AJS compatibility:
  telemetry must not change parsing, diagnostics, unit-list, flow-graph,
  command-generation, WebAPI import, or definition-file interpretation.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- Existing telemetry implementation is reviewed and documented as insufficient
  for product-improvement questions.
- Event naming conventions and event categories are documented.
- Allowed and forbidden telemetry properties are documented.
- Privacy rules prevent collecting names, paths, text, contents, commands,
  credentials, prompts, responses, raw errors, and server identifiers.
- Performance telemetry uses coarse duration and size buckets.
- Error telemetry uses repository-owned codes and status categories.
- Diagnostic telemetry uses anonymous categories or rule IDs and aggregate
  counts.
- Search telemetry reports outcomes without search text or matched identities.
- Workflow telemetry can represent started, completed, cancelled, failed, and
  observable abandoned states.
- Current features have recommended telemetry coverage:
  activation, deactivation, table viewer, flow viewer, CSV export, navigation,
  search, diagnostics, hover, unit definition, and WebAPI import.
- Planned roadmap features have reusable telemetry guidance:
  unified search, semantic definition comparison, dependency analysis, review
  support, and AI-assisted features.
- Architecture keeps SDK details in infrastructure and product telemetry
  schemas outside domain.
- Desktop and web compatibility risks are explicit.

## Non-Goals

- Implement telemetry events.
- Build dashboards or external analytics infrastructure.
- Collect user content, JP1/AJS definition content, names, paths, commands,
  search text, credentials, prompts, responses, or raw server details.
- Change parser, diagnostics, list, flow, CSV, WebAPI, hover, or command
  behavior.
- Raise the minimum supported VS Code version.
- Add AI-assisted behavior.
- Remove VS Code telemetry opt-out behavior.

## Open Questions

- Which existing event names must remain dashboard-compatible, if any?
- Should diagnostic rule IDs be added before diagnostic telemetry so messages
  never need to be used as telemetry identifiers?
- What exact bucket boundaries should be standardized for duration, unit count,
  row count, graph size, diagnostic count, and query length?
- Which workflow abandonment states are observable without unreliable timers or
  noisy session assumptions?
- Should README telemetry policy be updated before or in the same slice as the
  first expanded telemetry events?
