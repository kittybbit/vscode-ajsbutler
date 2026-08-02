# Feature Specification: Application Use Case Extraction

## Purpose

Separate the Feature 4 application-facing use cases from VS Code, webview, and
file-I/O concerns while preserving existing JP1/AJS behavior. The feature
covers the shared parser and application-error boundary, the Diagnose, Flow
Graph, Unit List, CSV, and cross-view capabilities, and the host adapters that
keep document, viewer, webview, and file operations outside those use cases.

## Minimal Context

- Current decision: plan the complete Feature 4 boundary as ordered vertical
  slices; each use case, port/error contract, adapter, and presentation
  boundary remains independently approvable and testable.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs it.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Roadmap item: `docs/specs/roadmap.md` `Application Use Case Extraction`
- Shared evidence: `docs/specs/features/BASELINE.md` `Intake group 1:
Application syntax and semantic diagnostics`
- Source use case:
  `docs/requirements/use-cases/uc-diagnose-ajs-definition.md`
- JP1/AJS definition reference:
  `docs/requirements/domain-rules/jp1-diagnostic-parameter-rules.md`, derived
  from the JP1/AJS3 version 13 Command Reference sections cited there
- Implementation-slice plan: `TASKS.md`

## Requirements

- Diagnose AJS Definition, Build Flow Graph, View Unit List, Export Unit List
  CSV, and cross-view navigation are explicit host-neutral application
  capabilities with repository-owned inputs, outputs, and error contracts.
- Shared parsing is obtained through `AjsParserPort`; application code does
  not depend on ANTLR, generated parser types, VS Code, webview frameworks,
  Node.js, or file-system APIs.
- Parser and application failures are represented by repository-owned errors
  or result states. Host adapters may select dialogs, notifications, or
  fallback behavior, but must not expose raw parser or host errors to the
  application boundary.
- Diagnose preserves parser short-circuiting, supported `JP1-PARAM-*` rules,
  diagnostic fields, ordering, and source spans.
- Build Flow Graph preserves deterministic nodes, edges, hierarchy, scope,
  ordering, malformed-relation issues, and placement constraints without
  returning presentation geometry.
- View Unit List preserves normalized unit identity, hierarchy, ordering,
  effective values, metadata, parser/normalization failure behavior, and
  desktop/web parity without table-framework types.
- Export Unit List CSV preserves visible-column ordering, escaping, row
  numbering, and identical copy/save payloads without clipboard or file-I/O
  dependencies.
- Cross-view navigation uses stable application-facing unit identity and
  scope data; list and flow viewers do not import each other's internal state.
- VS Code document, command, panel, transport, and file-I/O handlers remain
  thin adapters. They trigger capabilities, map DTOs, route validated
  messages, perform host operations, and report host-facing telemetry.
- Webview components consume application DTOs and view models. Graph
  geometry, table rendering, search, selection, focus, viewport, and other
  framework state remain presentation responsibilities.
- The same application contracts and plain transport payloads remain usable by
  desktop and web extension composition.
- Valid, invalid, encoded, large, malformed, and unsupported definitions must
  not produce partial results presented as complete.

## Architecture

- Domain: retain normalized JP1/AJS models and reusable business rules; do not
  add orchestration, parser structures, UI state, or host state.
- Application: own the selected use cases, ports, DTOs/view models, stable
  navigation identity, and repository-owned error/result contracts.
- Infrastructure: implement parser, telemetry, and any selected technical
  capability adapters; keep ANTLR/generated parser and SDK details behind
  their ports.
- VS Code presentation: own document lifecycle, commands, editor mapping,
  panel lifecycle, message routing, dialogs, file read/write operations, and
  host-facing error presentation.
- Webview presentation: own React rendering, graph geometry, table behavior,
  search, selection, focus, viewport, and serialized event production.
- Bootstrap: construct infrastructure adapters and application capabilities;
  it does not become a second use-case implementation.

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs include
  the diagnostic, flow, unit-list, CSV, navigation, parser, viewer transport,
  file-I/O, composition, and selected webview boundaries recorded in
  `TASKS.md`.
- Propagation is ordered: first pass the existing parser/application-boundary
  gate; then update the Diagnose naming boundary and plain transport contract;
  then host bridges, viewer lifecycle/composition, and Flow/Table presentation
  responsibilities after their DTOs and transport contracts are stable.
- Domain rule meaning, parser grammar, generated artifacts, telemetry event
  meaning, and unrelated application boundaries remain unchanged unless a
  slice explicitly records a required contract-preserving rename.
- JP1/AJS command/config reference impact is none. The feature adds no new
  JP1/AJS command, `JP1-PARAM-*` rule, configuration key, or supported
  definition syntax. Existing rules and the JP1/AJS3 version 13 reference
  basis remain authoritative.

### Breaking Change Analysis

- User-visible behavior: none intentionally; this is a behavior-preserving
  boundary change across existing workflows.
- API/DTO/schema compatibility: preserve current diagnostic, graph, list, CSV,
  navigation, and transport meanings. Any behavior or schema change requires
  replanning and re-approval.
- VS Code/web extension compatibility: preserve both desktop and web behavior
  and avoid new host-specific or Node.js production dependencies.
- Changed scenarios: none; existing Diagnose AJS Definition scenarios remain
  authoritative.

### Alternative Considerations

- Keep Diagnose as the only slice: rejected because it would not satisfy the
  original Feature 4 goal or success conditions for the other selected
  application boundaries.
- Implement every target in one large slice: rejected because the use cases,
  host adapters, and webview responsibilities have different approval,
  failure, and validation boundaries.
- Move editor lifecycle, dialogs, file writes, telemetry timing, or React
  state into Application: rejected because those concerns depend on the host
  or presentation framework.
- Change or consolidate JP1/AJS rules during extraction: rejected because rule
  restructuring is a separate behavior and compatibility decision.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`
- Scope changes requiring re-approval: changing any use-case behavior or DTO,
  adding supported JP1/AJS rules, changing parser behavior, introducing a new
  host or framework dependency, moving host/file-I/O/presentation state into
  Application, changing transport schemas, changing telemetry meaning, or
  narrowing desktop/web support.
- Capability naming is intentionally conservative: `DiagnoseAjsDefinition`
  is the approved clarity rename for the existing diagnostics capability;
  existing application names such as `BuildUnitList`,
  `buildFlowGraphResult`, `ExportUnitListCsv`, and
  `resolveFlowNavigationTarget` remain unchanged to avoid an unrelated API or
  behavior migration.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`; this feature
  must not raise the minimum version or introduce a newer VS Code API.
- Web extension compatibility: preserve shared application decisions, plain
  transport payloads, browser-safe imports, and webview behavior.
- Desktop extension compatibility: preserve document triggers, commands,
  panel lifecycle, editor ranges, messages, file operations, and telemetry
  reporting.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- All selected Feature 4 capabilities are exposed as explicit application
  responsibilities: Diagnose, Flow Graph, Unit List, CSV, and cross-view
  navigation.
- Their parser, DTO, port, and application-error boundaries are host-neutral
  and independently executable/testable without an Extension Host.
- VS Code and webview code does not parse definitions, evaluate JP1/AJS rules,
  build application graph/list meaning, or reconstruct parser objects.
- VS Code, webview, and file-I/O handlers are thin adapters with explicit
  injected capabilities and understandable host-facing failures.
- Existing diagnostics, graph/list/CSV outputs, cross-view behavior, panel and
  message behavior, file operations, telemetry privacy, and desktop/web parity
  remain compatible for equivalent inputs.
- Large, malformed, encoded, unsupported, and unavailable-host cases do not
  present partial or misleading results.
- Application production code introduces no `vscode`, UI-framework, Node.js,
  ANTLR, generated-parser, or direct file-system dependency.
- Relevant application, presentation, architecture, desktop, web, build, and
  quality checks pass according to the slice-specific validation plan.

## Non-Goals

- Changing diagnostic rules, messages, source spans, graph/list/CSV meanings,
  navigation semantics, parser grammar, or normalized JP1/AJS semantics.
- Redesigning the webview visual language or adding full JP1/AJS View parity.
- Moving editor lifecycle, dialogs, clipboard/file writes, telemetry timing,
  React state, graph geometry, table formatting, or viewport behavior into
  Application.
- Adding a generic service container, architecture exception, unsupported
  shared search domain contract, or new WebAPI capability.
- Raising the minimum VS Code version or narrowing desktop/web support.

## Planning Decision

- The current source already contains the normalized parser/error, Flow Graph,
  Unit List, CSV, and stable navigation application seams required by this
  specification. Those seams are preserved as a pre-implementation boundary
  gate rather than reimplemented as duplicate Feature 4 slices.
- The remaining plan covers the Diagnose capability naming boundary, selected
  VS Code and viewer host bridges, viewer lifecycle/composition, and the
  selected Flow and Unit List presentation responsibility boundaries. Each
  slice keeps its behavior-proving tests, explicit approval boundary, and
  desktop/web validation together.
- The revised plan separates independent semantic-diff, preview-open,
  document-update, message-routing, Flow presentation, and Unit List
  interaction responsibilities. Flow graph state, viewport/document/reveal/
  overflow effects, controller composition, and Flow shell integration are
  separate approval boundaries; the Unit List shell owns its search controller
  rather than mixing it with virtualization. Viewer composition and counterpart
  reveal remain one bootstrap
  composition-root slice only where the current
  `viewerWiring.ts` lifecycle and callback ownership require an atomic change;
  the rationale and approval boundary are recorded in `TASKS.md`.
- Any boundary-gate failure or newly discovered application-contract gap
  requires Replanning Mode before runtime changes; it must not be hidden inside
  a presentation slice.
- Preserve existing semantic rules, normalized models, parser grammar,
  telemetry catalog, document semantics, DTO meanings, and host behavior. The
  work extracts and clarifies boundaries rather than redesigning behavior.
