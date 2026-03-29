# PLANS.md

## Purpose

Track non-trivial changes using the repository's SDD workflow before implementation.

## Default Workflow

1. Read the relevant documents in `docs/sdd/`.
2. Update or create the related use-case spec in `docs/use-cases/`.
3. Copy the task template below for the current change.
4. Fill in assumptions explicitly when requirements are ambiguous.
5. Implement only after acceptance criteria are clear.
6. Run build, quality checks, and relevant tests.
7. Summarize compatibility risks and follow-up work.

## Task Template

### Task

<!-- A single sentence describing what will be changed. -->

### Why

<!-- Why this change is necessary. -->

### Scope

<!-- Target files, modules, or use cases for the change. -->

### Non-Goals

<!-- What is out of scope for this task. -->

### Constraints

- Keep `engines.vscode` compatibility unless explicitly approved.
- Keep desktop and web extension behavior intact.
- Avoid direct `vscode` dependency in domain.

### Design

#### Use case

<!-- Which use case(s) will be addressed. -->

#### Layers affected

- domain:
- application:
- infrastructure:
- presentation:

#### Key decisions

-
-

### Acceptance Criteria

- [ ] build passes
- [ ] quality/lint passes
- [ ] tests updated
- [ ] desktop behavior preserved
- [ ] web behavior preserved if affected

### Test Plan

-
-

### Risks

-
-

### Rollback Plan

-
-

## Current Task

### Task

Extract flow graph generation into a clean-architecture use case without changing flow behavior.

### Why

The flow view still builds graph data directly inside presentation code and mixes graph construction with XyFlow concerns.

### Scope

- add a `BuildFlowGraph` use case
- define a UI-independent flow graph DTO
- move graph construction logic out of XyFlow-facing presentation code
- keep flow rendering and VS Code activation behavior unchanged
- add or update tests for graph construction
- update SDD docs and `PLANS.md`

### Non-Goals

- parser changes
- UI behavior changes
- dependency updates
- `engines.vscode` changes
- VS Code command changes
- activation/bootstrap refactor beyond this slice

### Constraints

- Keep runtime behavior unchanged.
- Keep desktop and browser builds working.
- Do not expose parser internals or XyFlow types in application DTOs.
- Do not add `vscode` imports to domain or application.

### Design

#### Use case

Build flow graph extraction.

#### Layers affected

- domain: reused
- application: added
- infrastructure: updated
- presentation: updated
- docs: updated

#### Key decisions

- Introduce a pure flow graph DTO with node and edge metadata independent from XyFlow.
- Keep XyFlow conversion in presentation and reuse normalized unit reconstruction where possible.

### Acceptance Criteria

- [ ] `BuildFlowGraph` use case exists
- [ ] flow view consumes the DTO via a presentation-layer mapper
- [ ] application DTO does not expose parser internals or XyFlow types
- [ ] flow rendering remains behaviorally unchanged
- [ ] relevant tests pass
- [ ] desktop and web builds pass

### Test Plan

- run build
- run relevant tests
- inspect diff for the intended slice only

### Risks

- DTO conversion can drift from current flow-node rendering assumptions if metadata is incomplete
- browser-hosted extension behavior still depends on existing webview constraints and bundle assumptions

### Rollback Plan

- revert the flow viewer adapter to the previous message path
- fall back to the previous presentation-side graph builder if regressions appear

## Task

Refactor VS Code integration points toward adapter boundaries without changing
user-visible behavior.

### Why

Diagnostics, hover, commands, and activation wiring are still correct
behaviorally, but the repository benefits from clearer application-vs-adapter
seams and a more explicit composition root.

### Scope

- extract testable application logic for diagnostics and hover
- move VS Code-coupled webview event helpers out of domain
- clarify command registration ownership in the VS Code-facing layer
- reduce extension activation concentration with an explicit bootstrap module
- update SDD docs and tests for the new seams

### Non-Goals

- parser grammar changes
- list or flow behavior changes
- command ID changes
- `engines.vscode` changes
- broad folder-structure rewrites beyond this adapter slice

### Constraints

- Keep runtime behavior unchanged.
- Keep desktop and browser builds working.
- Do not add `vscode` imports to domain or application.
- Preserve existing diagnostics, hover content, command IDs, and telemetry flow.

### Design

#### Use case

Provide editor feedback and isolate VS Code adapters.

#### Layers affected

- domain: remove legacy VS Code-coupled helpers
- application: add diagnostics and hover decision use cases
- infrastructure: none
- presentation: keep UI/event translation at extension/webview boundaries
- docs: update architecture and add an editor-feedback use case

#### Key decisions

- Put syntax-diagnostic and parameter-hover decisions in application DTO use cases.
- Make `src/extension/bootstrap/activateExtension.ts` the explicit composition root.

### Acceptance Criteria

- [ ] domain and application contain no direct `vscode` imports
- [ ] diagnostics and hover adapters depend on application DTO logic
- [ ] command registration remains unchanged from the user perspective
- [ ] activation wiring is easier to follow from a single composition module
- [ ] build passes
- [ ] tests pass

### Test Plan

- run build
- run tests
- add unit tests for extracted application logic
- add extension integration checks for command registration, diagnostics, and hover

### Risks

- diagnostics and hover integration tests can be timing-sensitive in VS Code
- webview adapter refactor can still regress browser behavior if shared message
  contracts drift

### Rollback Plan

- restore the previous extension activation wiring
- revert diagnostics and hover adapters to direct parser/domain access
- restore legacy webview event helpers if adapter migration regresses behavior

## Task

Refactor telemetry integration behind an adapter boundary without changing
telemetry event behavior.

### Why

Telemetry SDK usage is still referenced directly from runtime and webview
adapter code, which makes ownership less clear and keeps outer-layer details
visible to callers.

### Scope

- introduce a small application-facing telemetry port
- add an extension-side adapter for the current telemetry SDK
- refactor activation, commands, and webview telemetry callers to use the port
- document the telemetry boundary in SDD docs
- add tests where telemetry payload preservation becomes easy to verify

### Non-Goals

- changing telemetry event scope
- changing event names
- changing payload semantics beyond adapter translation
- changing `engines.vscode`
- redesigning unrelated extension runtime structure

### Constraints

- Keep runtime behavior unchanged.
- Keep desktop and browser builds working.
- Do not import telemetry SDK types into domain or application.
- Keep telemetry minimal and privacy-conscious.

### Design

#### Use case

Record telemetry through a small port.

#### Layers affected

- domain: unchanged
- application: add telemetry port
- infrastructure: none
- presentation/extension: add telemetry adapter and inject it from bootstrap
- docs: update architecture and add a telemetry design note

#### Key decisions

- Expose only `trackEvent` and `dispose` on the telemetry port.
- Keep event names and payload property shapes unchanged during this slice.

### Acceptance Criteria

- [ ] application/domain contain no telemetry SDK imports
- [ ] telemetry SDK usage exists only in outer adapter modules
- [ ] existing telemetry-triggering flows call the new port
- [ ] build passes
- [ ] tests pass

### Test Plan

- run build
- run tests
- add a targeted test for telemetry payload translation where practical

### Risks

- web extension compatibility still depends on the current telemetry SDK package
- telemetry lifecycle cleanup can regress if disposal wiring changes

### Rollback Plan

- restore direct telemetry SDK calls in the extension runtime and handlers
- remove the telemetry adapter and port if regressions appear
