# Architecture

## Architectural Baseline

The repository uses Domain-Driven Design and Clean Architecture boundaries for
all production code. The architecture dependency test enforces the complete
rule catalog with zero exceptions.

Behavior remains compatible across the parser, unit list, flow graph, CSV
export, unit definition, diagnostics, hover, navigation, WebAPI import,
semantic diff/report, and telemetry workflows.

## Source Layout

- `src/domain`
  Owns the normalized JP1/AJS model, values, and reusable business rules.
- `src/application`
  Owns host-neutral use cases, ports, DTOs, and view-model projections.
- `src/infrastructure`
  Implements parser, WebAPI, localization-resource, and telemetry adapters.
- `src/presentation/vscode`
  Maps application results and commands to the VS Code host API.
- `src/presentation/webview`
  Renders table and flow DTOs with React and browser-side UI libraries.
- `src/bootstrap`
  Owns extension composition, capability selection, activation, and lifecycle.
- `src/resource`
  Contains repository-owned static resources.
- `src/antlr`
  Contains the parser grammar source.
- `src/generate/parser`
  Contains generated ANTLR parser artifacts.

`src/extension.ts` is the desktop and browser extension entry point. It
delegates dependency construction and activation to bootstrap.

## Dependency Rules

The following rules are mandatory:

- Domain does not import application, infrastructure, presentation, bootstrap,
  VS Code, React, MUI, XyFlow, TanStack, or other host/UI frameworks.
- Application does not import infrastructure, presentation, or bootstrap.
- Presentation does not import domain, infrastructure, or bootstrap. It
  consumes application DTOs, view models, use cases, and neutral contracts.
- Infrastructure does not import presentation or bootstrap. It may implement
  application ports and use domain concepts.
- Concrete infrastructure dependencies are referenced only from infrastructure
  or bootstrap.
- Retired unit-wrapper dependencies under `src/domain/models/units` are
  forbidden.

These rules apply to static imports, type imports, exports, dynamic imports,
`require`, and import-equals references across all production source roots.

## Solution Shape

Every material decision, invariant, translation, lifecycle, public name,
contract, dependency, and applicable test has one semantic owner and an
explicit package/layer. The owner belongs where that meaning is stable; outer
layers translate host, transport, framework, and presentation concerns.

For this gate, a material new or retained abstraction is an exported or
layer-crossing abstraction, port or adapter, contract-bearing wrapper,
lifecycle owner, or abstraction that changes dependency direction or semantic
ownership. Ordinary local helpers and type aliases are excluded unless they
play one of those roles. Each material abstraction records its concrete
responsibility and why it earns a boundary. A port may earn its boundary by
owning dependency inversion and/or a host-neutral contract; it need not also
own adapter concerns. An adapter earns its boundary through one or more
applicable isolation, translation, error normalization, lifecycle,
compatibility, or test-boundary responsibilities. A wrapper that only forwards
the same request and response, with none of those responsibilities and no
port-contract value, does not earn a boundary. Retained application factories
are assessed separately for composition or use-case-boundary responsibility;
they are not treated as ports or adapters by default.

Framework-first means considering only the relevant framework, library,
platform, or established repository capability for the proposed responsibility.
It does not require adoption or speculative surveys. A custom-gap
justification is required only when a custom mechanism is proposed for a job a
relevant existing capability could perform. Framework use remains at the outer
boundary; inner layers stay host-neutral.

The architecture dependency test is automatic evidence only for the existing
catalog of import, construction, parser, telemetry, and layer rules. Semantic
ownership, whether an abstraction earns its boundary, framework sufficiency,
custom-gap credibility, and qlty-delta disposition remain explicit reviewer
judgments. For code slices, record pre-edit and final qlty results using the
identical command and configuration and comparable finding identity (rule,
path, and symbol/location where available). Separate new or worsened findings
from unchanged unrelated baseline findings; metric-only movement is a review
signal, not permission for unrelated cleanup.

An approved slice stops for Replanning when its semantic owner or package/layer,
contract or dependency direction, framework-versus-custom decision,
abstraction or responsibility, affected surface, risk, validation, or approval
boundary changes.

## Composition

`src/bootstrap/extension/activateExtension.ts` and its bootstrap collaborators
form the explicit composition root.

- Bootstrap constructs infrastructure adapters and application use cases.
- VS Code presentation receives already-constructed dependencies.
- Application factory functions are invoked only from application or bootstrap.
- Infrastructure classes are constructed only from infrastructure or
  bootstrap.
- Capability selection, including desktop-only WebAPI availability, occurs in
  bootstrap before presentation commands are registered.
- Activation returns explicit lifecycle ownership; disposables are registered
  with the extension context.

The repository does not use a service container.

## Parser And Model Boundary

- Generated parser code and the ANTLR runtime are used only under
  `src/infrastructure/parser`.
- `AjsRawUnit` is confined to parser infrastructure.
- Infrastructure normalizes parser-adjacent raw data into `AjsDocument`,
  `AjsUnit`, and related domain concepts.
- `AjsParserPort` returns either a normalized document or repository-owned
  syntax errors.
- Application, presentation, and bootstrap code do not consume generated
  parser types or raw parser data.
- The normalized model is the only production domain model for downstream use
  cases.

JP1/AJS3 version 13 is the normative target for new parameter and command
semantics. Consumer-specific formatting remains in application projections or
presentation; only reusable business meaning belongs in domain.

## Application And Presentation Boundaries

Application owns the host-neutral behavior and data contracts for:

- unit-list construction and table row projections
- base and expanded flow-graph DTOs
- unit-definition DTOs
- ordered CSV export input
- syntax diagnostics and parameter hover results
- stable list/flow navigation identity
- WebAPI import through an application port
- host-neutral semantic diff results, canonical summaries, and immutable output
  contexts
- validated telemetry events

Presentation owns host and rendering concerns:

- VS Code commands, diagnostics, hover Markdown, panels, and document providers
- save dialogs, clipboard operations, active-editor checks, and message routing
- React component state, table formatting, graph geometry, viewport behavior,
  search, selection, and expansion
- localization and display of application results, including Summary, Full,
  Audit, and JSON report projections and their mode selection

UI components consume DTOs and view models. They do not parse AJS grammar
output or import domain objects.

## Host And Framework Boundaries

- `vscode` imports are limited to `src/extension.ts`, bootstrap,
  infrastructure, and `src/presentation/vscode`.
- React, MUI, XyFlow, TanStack, and other UI-framework imports are limited to
  `src/presentation/webview`.
- Production source does not import Node built-ins. Host-specific behavior uses
  injected capabilities or browser-safe adapters.
- Shared code must remain safe for both the desktop and browser bundles.

## Transport And Serialization

- Extension-to-viewer documents and viewer-to-extension events use
  direction-specific plain DTO contracts.
- Webview payloads are serializable with standard JSON and do not rely on
  cyclic object graphs or wrapper reconstruction.
- Browser message input is validated before presentation callbacks run.
- Host information is resolved at the outer boundary and sent as plain data.

Changes to shared DTOs, viewer messages, bootstrap, or extension entry points
require explicit desktop and web validation.

## Telemetry Boundary

- Application owns `TelemetryPort`, the event catalog, event builders, and the
  privacy allowlist.
- Callers report only validated events and cannot send arbitrary event names or
  property maps.
- `@vscode/extension-telemetry` is imported only by
  `src/infrastructure/telemetry/VscodeTelemetryAdapter.ts`.
- Infrastructure translates validated events to the SDK and contains reporting
  and disposal failures.
- Bootstrap selects the SDK-backed or no-op adapter.
- Telemetry never includes definition content, file paths, credentials, search
  text, personal identifiers, or raw errors.

Existing event names and payload meaning are compatibility contracts. New
collection requires an approved feature with an explicit privacy decision.

## Compatibility Contracts

- `package.json` `engines.vscode` defines the minimum supported VS Code version.
- Desktop and browser entry points must remain buildable and testable.
- Parser and normalized-model changes must preserve supported JP1/AJS
  definition-file behavior or document an explicitly approved compatibility
  change.
- Large, malformed, and encoded input risks remain owned by the relevant use
  cases and regression suites.
- Read-only JP1/AJS WebAPI import remains beta until its owning feature records
  real-environment evidence and enough user feedback.

## Change Policy

- Preserve behavior before restructuring.
- Plan non-trivial work through SDD and implement one approved vertical slice
  at a time.
- Add or update the nearest boundary tests when changing parser, application,
  adapter, presentation, telemetry, or transport contracts.
- Do not add architecture exceptions. A required rule change is an architecture
  decision that must be planned, reviewed, and approved.
- Keep framework, host, transport, and formatting concerns at the outer
  boundary.
