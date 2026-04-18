# Architecture

## Target layering

- Domain
- Application
- Infrastructure
- Presentation

## Dependency direction

Domain <- Application <- Infrastructure / Presentation

## Transitional note

The repository currently contains mixed responsibilities.
Migration should be incremental and use-case driven.

## Current Structure

- `src/domain`
  Contains unit models, value objects, parser orchestration, the normalized AJS
  model, and some transitional wrapper/event helpers.
- `src/application`
  Contains DTO-oriented use cases and view adapters for unit list, flow graph,
  editor feedback, telemetry ports, and unit definition building.
- `src/extension`
  Contains extension activation, diagnostics, hover provider registration,
  preview commands, and webview panel orchestration.
- `src/ui-component`
  Contains React-based webview presentation for table and flow views.
- `src/generate/parser`
  Contains generated ANTLR parser artifacts.

## Parser Boundaries

### Stable parser-adjacent boundary

- grammar source lives in `src/antlr`
- generated parser code lives in `src/generate/parser`
- parser orchestration currently lives in
  `src/domain/services/parser/AjsParser.ts`
- parse-tree evaluation currently lives in
  `src/domain/services/parser/AjsEvaluator.ts`
- syntax error collection currently lives in
  `src/domain/services/parser/SyntaxErrorListener.ts`

### Where parser output crosses outward

- `src/domain/services/parser/AjsParser.ts` returns `Unit[]` plus syntax errors,
  which is a reasonable boundary for domain-facing consumers
- `src/domain/models/ajs/normalizeAjsDocument.ts` converts raw `Unit[]` into a
  stable normalized model
- `src/application/unit-list/*` and `src/application/flow-graph/*` can now
  consume normalized units instead of raw parser-adjacent trees for selected
  slices
- VS Code-facing diagnostics and webview adapters remain outside the parser
  boundary

### Boundary assessment

- the grammar and generated parser are already isolated
- the evaluator-to-`Unit[]` mapping is still the raw seam
- normalization is now the next stable seam for application-facing use cases
- unit-list table rendering now depends on an application row/view adapter
  end to end instead of direct wrapper accessors or `UnitEntity` row objects
- flow rendering now depends on flow-graph DTOs plus normalized AJS state and
  unit-definition DTOs instead of reconstructing `UnitEntity` for selection and
  node interaction
- the remaining migration work is to move more non-table use cases from raw or
  wrapper-oriented structures onto the normalized model

## Model Layers

### Raw parsed model

- `src/domain/values/Unit.ts` remains the parser-adjacent raw unit tree
- this model keeps source-oriented structure such as `unitAttribute`,
  free-form parameters, parent links, and child nesting

### Interpreter / wrapper layer

- `src/domain/models/units/*` remains an interpretation layer over raw `Unit`
- this layer derives JP1/AJS semantics such as schedule flags, root jobnet
  detection, layout hints, and relation traversal
- these wrappers are still useful during migration, but they are not the final
  stable application-facing model

### Normalized model

- normalized AJS concepts should live behind stable names such as
  `AjsDocument`, `AjsUnit`, and `AjsDependency`
- the normalizer may use the current wrapper layer internally while producing a
  stable model for application use cases
- application slices should gradually depend on the normalized model instead of
  raw `Unit` or wrapper-specific classes

## VS Code API Boundaries

### Correct boundary locations

- `src/extension.ts`
- `src/extension/commands/*`
- `src/extension/diagnostics/*`
- `src/extension/languages/*`
- `src/extension/webview/*`
- `src/test/*`

### Current boundary leaks

- diagnostics and hover behavior still originate from extension-facing
  registration modules, but some construction and wiring is still concentrated
  in bootstrap code
- webview panel creation, telemetry, and message handling are still grouped
  under `src/extension/webview`, which is correct for adapter code but still
  mixes some responsibilities that can be decomposed further

### Interpretation

- the extension layer is already the natural adapter boundary
- diagnostics should depend on an application use case that returns diagnostic
  DTOs
- hover should depend on an application use case that returns hover DTOs
- webview message constants and payload types should live in a neutral shared
  module rather than in domain

## Adapter Boundary Clarifications

### Application-facing logic

- `src/application/unit-list/*` exposes DTO-oriented unit-list building
- `src/application/unit-list/buildUnitListView.ts` projects normalized units
  into stable table row/view data for the table presentation
- `src/application/flow-graph/*` exposes DTO-oriented flow graph building
- `src/application/editor-feedback/buildSyntaxDiagnostics.ts` exposes
  parse-error decisions without `vscode` types
- `src/application/editor-feedback/findParameterHover.ts` exposes parameter
  hover decisions without `vscode` types
- `src/application/telemetry/TelemetryPort.ts` exposes a small telemetry
  contract without SDK-specific types
- normalized AJS use cases should depend on `AjsDocument` and `AjsUnit`
  instead of directly on `Unit` or `UnitEntity` where migration is practical

### Semantics that can remain in view adapters

- normalized helpers should expose reusable lookup and traversal semantics, but
  they do not need to absorb every table-specific formatting rule
- `src/application/unit-list/buildUnitListView.ts` may continue to parse and
  reshape schedule-oriented parameter strings such as `sd`, `cy`, `sh`, `cftd`,
  `sy`, `ey`, `wc`, and `wt` into table-specific group fields because that
  logic is about presentation-facing view structure rather than shared domain
  meaning
- CSV export may continue to depend on visible column order and rendered cell
  stringification because those concerns belong to the export adapter boundary,
  not to normalized AJS semantics
- future normalization work should focus on semantics that are reused by
  multiple consumers, such as lookup, inheritance, dependency interpretation,
  root defaults, and rule-aware parameter alignment

### VS Code-facing adapters

- `src/extension/diagnostics/registerDiagnostics.ts` owns
  `DiagnosticCollection`, document subscriptions, and DTO-to-VS Code mapping
- `src/extension/languages/registerHoverProvider.ts` owns hover provider
  registration and `MarkdownString` construction
- `src/extension/commands/registerPreviewCommand.ts` owns command registration
  and active-editor checks
- `src/extension/webview/messageHandlers.ts` owns save dialogs, theme/env/os
  payload enrichment, and telemetry reporting for webview events
- `src/extension/bootstrap/activateExtension.ts` is the explicit composition
  root for activation wiring
- `src/extension/telemetry/*` owns the telemetry SDK adapter and composition
  of the runtime telemetry implementation

## Telemetry Boundary

- callers in extension-facing modules request telemetry via
  `TelemetryPort.trackEvent(...)`
- SDK-specific translation lives only in
  `src/extension/telemetry/VscodeTelemetryAdapter.ts`
- bootstrap wiring creates the telemetry adapter and injects it into the
  extension runtime object
- event names and payload shapes remain defined by the callers so the refactor
  preserves existing collection scope

## Web Extension Risks

- `src/extension.ts` is used for both desktop and browser entry points, so any
  shared import chain can affect both bundles
- `src/extension/telemetry/VscodeTelemetryAdapter.ts` depends on
  `@vscode/extension-telemetry`; this still needs continued verification in web
  extension execution
- `src/extension/webview/messageHandlers.ts` imports `os`; webpack currently
  provides a browser fallback, but this remains an environment-specific
  adapter concern that needs continued verification
- `src/ui-component` receives webview event payloads rebuilt from plain DTO
  documents, so serialization-boundary changes still affect both desktop and
  web viewers even when parsing behavior is unchanged

## Planned Boundary Tightening

### Package manager and toolchain

- the repository may migrate from `npm` to `pnpm`, but package-manager changes
  must stay outside domain/application behavior contracts
- build, test, and docs validation commands should remain explicit in SDD docs
  during the migration period so contributors can tell whether current
  instructions describe the live toolchain or the target toolchain

### Serialization boundary

- viewer payloads should stay on plain DTO and event-object transport
  contracts instead of reintroducing `flatted`-style implicit serialization
  assumptions
- presentation payloads should prefer DTOs that can be serialized by standard
  JSON boundaries without circular-reference assumptions
- serialization simplification is expected to support bundle-size reduction,
  but the primary architectural goal is a clearer adapter boundary

### Identity and hashing

- `UnitEntity` identity semantics should remain stable, but internal hashing
  should prefer a common, well-understood algorithm instead of repository-local
  bespoke logic when behavior can be preserved
- hash-algorithm changes should remain an implementation detail unless a
  public or persisted identity contract is affected

### JP1 reference alignment

- JP1/AJS3 version 13 is the current normative product target for new
  parameter-parsing and command-generation slices
- manual-aligned parsing rules belong in domain/application seams that are
  reusable by hover, definition rendering, navigation, and future import paths
- command generation should be isolated behind an application-facing service or
  use case instead of remaining embedded in a presentation-oriented
  unit-definition builder

### JP1/AJS WebAPI integration

- JP1/AJS WebAPI access should sit behind infrastructure adapters with
  application-facing DTOs or use cases
- initial scope is read-only import of server-side definition information
- WebAPI transport details, authentication, and endpoint wiring should stay
  outside domain logic and outside webview presentation modules

## First Good Vertical Slice

### Recommended slice

Build Unit List

### Why this slice was first

- it already has a documented use case
- it sits closest to the existing parser-to-domain seam
- it is shared by diagnostics-adjacent parsing and table-view presentation needs
- it can reduce current coupling without forcing an immediate flow-graph
  redesign

### Slice outcome

The repository now has application-facing unit-list, CSV export, flow-graph,
unit-definition, and table row/view adapter slices built on top of the
normalized model where practical.

### Current benefits

- moves parser invocation behind a clearer application boundary
- removes `vscode` and serialization concerns from domain-side helpers
- gives the table webview application-projected row/view data instead of
  wrapper-driven accessor logic
- creates a repeatable pattern for later slices such as CSV export and flow
  graph building

## Remaining extraction priority

1. Reconcile any remaining wrapper-derived semantics that should move into the
   normalized model instead of staying in view adapters
2. Continue moving non-table presentation paths toward explicit DTO/view-model
   boundaries
3. Reduce residual raw-`Unit` / wrapper usage where application slices already
   provide stable models
4. Simplify viewer serialization and dependency weight where adapter contracts
   are still broader than necessary
5. Add application and infrastructure seams for JP1/AJS3 version 13
   reference-aligned parameter, command, and WebAPI work
