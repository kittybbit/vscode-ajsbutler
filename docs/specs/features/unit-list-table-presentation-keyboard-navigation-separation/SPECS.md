# Feature Specification: Unit-list Table Presentation and Keyboard Navigation Separation

## Purpose

Separate unit-list table rendering, column actions, virtualization, and keyboard
focus state behind presentation-owned contracts while preserving the existing
Application unit-list DTO and keeping keyboard navigation responsive with
explicit selection confirmation.

## Minimal Context

- Current decision: define presentation-owned table data and interaction
  responsibilities without changing unit-list meaning or user workflows.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs it.
- Shared evidence: `docs/specs/features/BASELINE.md` identifies the table
  presentation responsibility group and its current complexity hotspots.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Roadmap item: `docs/specs/roadmap.md` 7.3, Unit-list Table Presentation and
  Keyboard Navigation Separation.
- Source use cases:
  - `docs/requirements/use-cases/uc-view-unit-list.md`
  - `docs/requirements/use-cases/uc-export-unit-list-csv.md`
  - `docs/requirements/use-cases/uc-navigate-between-unit-list-and-flow-graph.md`
  - `docs/requirements/use-cases/uc-show-unit-definition.md`
- JP1/AJS source reference:
  - Command reference: none; command generation and execution are unchanged.
  - Definition/config reference: none; definition interpretation is unchanged.
  - Undocumented or inferred behavior: current table behavior is characterized
    by the source use cases and existing table navigation, virtualization,
    column, export, accessibility, and shell-integration tests.
- Implementation-slice plan: `TASKS.md`.

## Requirements

- R1: The Application unit-list DTO remains the stable input contract, and a
  presentation-owned mapping exposes only the row identity, cell values, unit
  metadata, and action metadata required by the table.
- R2: Table rendering, column definitions and visibility actions, sorting, CSV
  projection, and virtualization consume presentation-owned table contracts
  rather than depending directly on Application DTO types.
- R3: Grid focus, saved return focus, selection handoff, keyboard commands, and
  focus restoration are represented by an explicit presentation interaction
  model independent of mounted DOM elements and virtualization-library handles.
- R4: The virtualization adapter owns mounted-element registration, scrolling,
  and DOM focus application while delegating focus decisions to the interaction
  model.
- R5: Visible-column order, export output, search, sorting, detail actions,
  list-to-flow navigation, row reveal, tree/grid focus handoffs, and semantic
  selection/focus state remain behaviorally unchanged except for the keyboard
  selection contract defined by R8.
- R6: Sorting, column visibility changes, detail-pane return, document refresh,
  external row reveal, and virtualized mounting restore the selected unit and a
  meaningful visible cell or header fallback.
- R7: The refactoring preserves supported desktop and web viewers, high-contrast
  focus visibility, localized accessible names and announcements, and large-list
  navigation behavior.
- R8: Repeated keyboard row movement updates only the grid focus. The unit tree,
  detail panel, selection announcement, and `unit.select` operation remain on
  the last committed row until the focused row is confirmed with Enter or an
  explicit focus handoff commits it immediately.

## Architecture

- Domain: none; JP1/AJS unit meaning and identity rules remain unchanged.
- Application: keep the existing unit-list, CSV, navigation, and unit-definition
  contracts unchanged; do not introduce table-framework or focus-state types.
- Presentation: map Application DTOs to a table presentation model; own table
  column policy, interaction decisions, React composition, virtualization, DOM
  focus, accessibility, and host-request adaptation.
- Infrastructure: none; parser, persistence, telemetry adapter, and host
  infrastructure behavior remain unchanged.

## Impact Analysis

### Dependency Impact

- Affected components and helpers include `TableContents.tsx`,
  `VirtualizedTable.tsx`, `TableHeader.tsx`, `DisplayColumnSelector.tsx`,
  `tableColumnDef.tsx`, the files under `columnDefs/`, `navigation.ts`,
  `tableViewerData.ts`, and `exportCsvView.ts`.
- Primary regression coverage includes `tableViewerData.test.ts`,
  `tableColumnDef.test.ts`, `exportCsvView.test.ts`, `tableNavigation.test.ts`,
  `tableVirtualizationFocus.test.ts`, `tableShellIntegration.test.ts`, and
  `accessibilityDom.test.tsx`.
- Propagation decision: presentation table model, controller, render adapters,
  and their tests change together by slice; Application DTO builders, viewer
  transport schemas, parser/domain behavior, shared header search, and flow
  viewer internals remain unchanged.

### Breaking Change Analysis

- User-visible behavior: Slice 4 changes keyboard traversal so moving focus does
  not select every intermediate row. Enter confirms the focused row and updates
  selection-dependent views once; explicit focus handoffs commit the focused row
  before leaving the grid. Pointer selection remains immediate. The changed
  keyboard scenario must be propagated to the owning use case at Feature Exit.
- API/DTO/schema compatibility: Application DTOs and viewer message schemas are
  unchanged; new contracts remain presentation-local.
- VS Code/web extension compatibility: no new VS Code API or host capability;
  the declared minimum VS Code version remains unchanged.
- Changed scenarios: keyboard traversal now has a provisional focused row and an
  explicit Enter-commit step; pointer selection and existing non-keyboard
  scenarios remain unchanged. The source use case needs a corresponding update
  at Feature Exit.

### Alternative Considerations

- Move keyboard state into Application: rejected because focus, mounted cells,
  sorting widgets, and virtualization are presentation concerns.
- Keep Application DTO types throughout table-framework components: rejected
  because it leaves renderer, column, and interaction details coupled to the
  Application list shape.
- Replace the table or virtualization library: rejected because the feature is
  a boundary separation, not a user-visible rewrite or dependency migration.
- Create a generic shared viewer interaction framework: rejected because the
  table behavior is distinct and no second equivalent consumer requires it.
- Coalesce selection with a time-based idle interval: rejected because the
  commit boundary would depend on typing speed and timer scheduling rather than
  an explicit user action, leaving the selected row ambiguous while focus moves.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`.
- Scope changes requiring re-approval: Application DTO/schema changes, new
  keyboard commands beyond the existing Enter action, table-library
  replacement, shared search changes, flow-view changes, telemetry changes, or
  a new implementation slice.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode` (`^1.75.0`).
- Web extension compatibility: preserve browser-safe production imports and
  verify the table viewer through web tests and the production build.
- Desktop extension compatibility: preserve viewer messages, clipboard/save
  requests, detail actions, navigation, and focus behavior through desktop
  tests and the production build.
- JP1/AJS definition compatibility: no parsing, normalization, projection
  meaning, encoding, or parameter interpretation changes are allowed.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- AC1: Table-framework and rendering components consume a presentation-owned
  table model, with Application DTO conversion localized to an explicit
  presentation adapter boundary.
- AC2: A pure, directly tested interaction model decides keyboard movement and
  focus restoration without importing React, MUI, TanStack, Virtuoso, VS Code,
  or Application DTO types.
- AC3: The virtualization/render adapter applies interaction decisions and
  preserves roving focus, stable-path row selection, sorting, column changes,
  detail return, tree handoff, and off-screen row reveal for large lists.
- AC4: Existing visible-column/export, search, detail, list-to-flow navigation,
  accessibility, localization, and shell-integration tests pass without an
  approved behavior change.
- AC5: Focus and selection remain semantically distinguishable and keyboard
  users can enter, traverse, and leave the grid in both desktop and web builds.
- AC6: Required quality, focused tests, desktop/web tests, and build validation
  pass with no architecture-rule exception and no new unapproved smell.
- AC7: A rapid keyboard sequence does not update the unit tree or detail panel
  for intermediate rows. The focused row is committed exactly once when Enter
  confirms it, while pointer selection, tree selection, external reveal, and
  focus handoffs retain immediate commit behavior.

## Non-Goals

- Change JP1/AJS parsing, normalization, unit-list values, ordering, or stable
  identity.
- Change Application unit-list, CSV, navigation, unit-definition, telemetry, or
  viewer transport contracts.
- Add keyboard shortcuts, table features, columns, search semantics, or visual
  redesign. The Slice 4 keyboard selection-confirmation contract is the only
  approved behavior adjustment under this replan.
- Refactor shared header search, flow-tree selection, flow rendering, or flow
  interaction state owned by roadmap items 7.4 and 7.5 or completed features.
- Replace React, MUI, TanStack Table, or React Virtuoso.
- Raise the minimum supported VS Code version.

## Decision

- Slice 4 uses explicit Enter confirmation instead of a time-based idle
  interval. Focus movement remains immediate, selection-dependent effects stay
  on the last committed row, and existing explicit handoffs commit the focused
  row before transferring focus or opening detail.
