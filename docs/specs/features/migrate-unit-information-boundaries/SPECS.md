# Feature Specification: Migrate Unit Information Boundaries

## Purpose

Move the unit-list, CSV-export, and unit-definition pipeline onto one normalized
domain-to-application-DTO boundary with no raw model, legacy wrapper, or React
table dependency in application decisions.

## Minimal Context

- Current decision: complete the shared unit-information projection boundary.
- Read first: this file, `TASKS.md`, and the three related durable use cases.
- Do not create `CONTEXT.md`.

## Origin

- Source use cases: `uc-view-unit-list.md`, `uc-export-unit-list-csv.md`, and
  `uc-show-unit-definition.md`.
- Source: complete migration directive Slice 4.
- JP1/AJS source reference: existing definition/config behavior and durable use
  cases; no new parameter or command semantics.
- Dependencies: inventory, parser isolation, and normalized domain completion.

## Requirements

- View Unit List consumes the normalized model and returns application-owned
  row/view DTOs.
- CSV export consumes application-facing row/column contracts and preserves
  content, column order, and escaping.
- Show Unit Definition derives shared meaning from domain rules and returns an
  application DTO preserving raw parameter and command text.
- None of these application or presentation paths depends on raw `Unit`, legacy
  wrappers, parser artifacts, or React table internals.
- Desktop and web use the same application decisions.

## Architecture

- Domain: provide normalized units and shared parameter/command meaning.
- Application: own list, CSV, and definition use cases and DTO projections.
- Presentation: own table rendering, clipboard/save/dialog actions, and final
  host formatting.
- Infrastructure: none beyond injected parser/import boundaries.

## Impact Analysis

### Dependency Impact

- Affected surface: unit-list builder, CSV export, unit-definition builder,
  table/flow detail consumers, DTOs, serialization, and tests.
- Propagation decision: graph/navigation changes remain in their own feature.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: internal DTOs may change together with adapters.
- VS Code/web extension compatibility: list, definition, copy, and save paths
  must remain equivalent on supported hosts.
- Changed scenarios: none.

### Alternative Considerations

- Keep CSV coupled to rendered React cells: rejected because export decisions
  would remain presentation-owned.
- Migrate each consumer to a different intermediate model: rejected because the
  shared unit-information boundary would stay inconsistent.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md`.
- Any visible column, ordering, formatting, command, or copy/save change requires
  replanning and approval.

## Compatibility

- Preserve `engines.vscode`, JP1/AJS definition compatibility, desktop/web list
  behavior, CSV output, and unit-definition content.

## Acceptance Criteria

- The three durable use cases expose explicit host-neutral application entry
  points and outputs.
- Raw/wrapper/parser/table-internal production dependencies are zero in these
  pipelines.
- Existing list, CSV, and definition behavior passes regression tests.

## Non-Goals

- UI redesign, new list columns, new CSV fields, or new command semantics.

## Open Questions

- Exact shared row/column and definition DTO boundaries require planning.
