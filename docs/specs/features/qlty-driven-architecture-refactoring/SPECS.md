# Feature Specification: qlty-driven-architecture-refactoring

## Purpose

Use Qlty findings as input for incremental architecture refactoring while
preserving observable extension behavior.

## Functional Requirements

- Parser, diagnostics, list view, flow view, CSV export, telemetry, desktop
  extension behavior, and web extension behavior must stay unchanged unless a
  use-case spec is updated and the behavior change is explicitly approved.
- Qlty findings are candidate signals, not requirements by themselves. A slice
  must improve a meaningful ownership, responsibility, or boundary concern.
- Shape-only smell or metric cleanup must not be forced when it does not map to
  a useful JP1/AJS concept, application use case, adapter boundary, or
  maintainability risk.
- When multiple findings are concentrated in the same file or responsibility,
  the task should address the coherent cluster together instead of fixing one
  smell or metric at a time.
- Refactors may split files when that makes the responsibility boundary
  clearer; a same-file constraint is not required.
- Feature requirements stay in this `SPECS.md`. Individual slice tasks,
  approval evidence, and use-case back-propagation notes stay in `TASKS.md`.

## Architecture Requirements

- `domain` must remain independent of `vscode`, React, MUI, XyFlow, and
  webview code.
- `application` may depend on `domain`; presentation, VS Code API, telemetry
  adapter, and webview details stay outside application helpers.
- Presentation helpers may use React and UI-library concepts, but parser and
  application DTO boundaries must remain explicit.
- Telemetry must remain wrapped near extension, presentation, or infrastructure
  boundaries.
- Parser/generated artifacts, OpenAPI generated artifacts, dependency
  versions, and `engines.vscode` must stay unchanged for quality-only
  refactors unless separately approved.

## Use-Case Relationship

This feature is behavior-preserving by default. If a candidate slice changes
observable behavior, command semantics, prompt text, diagnostic messages, DTO
contracts, telemetry events, adapter behavior, or compatibility expectations,
the matching use case under `docs/requirements/use-cases/` must be updated
before implementation approval.

When a slice is confirmed behavior-preserving, `TASKS.md` only needs to record
that no use-case reflection is required and the reason for that decision.

## Acceptance Criteria

- Each approved implementation slice lowers or removes the targeted Qlty smell,
  complexity pressure, duplication pressure, or responsibility confusion.
- Required tests and validation remain green for the changed scope.
- No VS Code compatibility, desktop/web extension compatibility, parser,
  generated artifact, or dependency-version drift is introduced without
  explicit approval.

## Non-Goals

- Adding product features.
- Changing JP1/AJS parsing semantics.
- Modernizing dependencies.
- Raising the minimum supported VS Code version.
- Recording a complete historical log of every refactor slice.
