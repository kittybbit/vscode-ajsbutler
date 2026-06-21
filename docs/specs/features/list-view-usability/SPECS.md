# Feature Specification: List View Usability

## Purpose

Make unit discovery, selection, inspection, and cross-view navigation in the
unit-list viewer consistent with the flow viewer while preserving existing
table behavior.

## Origin

- Source use cases:
  - `docs/requirements/use-cases/uc-build-unit-list-view.md`
  - `docs/requirements/use-cases/uc-search-domain-unification.md`
  - `docs/requirements/use-cases/uc-navigate-between-unit-list-and-flow-graph.md`
  - `docs/requirements/use-cases/uc-show-unit-definition.md`
- Related plan: `docs/specs/plans.md`
- Roadmap source: viewer-parity work deferred until a concrete requirement was
  identified

## Requirements

- Present the unit-list header with the same visual language as the flow-view
  header, including a transparent app bar, paper background, blur, bottom
  border, and compact toolbar height.
- Keep existing unit-list capabilities available while relocating search,
  visible/total unit counts, column visibility, and CSV export controls into
  the header.
- Reuse presentation-level search UI where list and flow behavior is genuinely
  equivalent, including keyboard focus, result count, result navigation,
  clearing, and helper text.
- Keep table filtering and flow reveal behavior in their respective
  presentation adapters.
- Introduce shared application or domain search semantics only in a separately
  investigated and approved slice that satisfies
  `uc-search-domain-unification.md`.
- Make list-to-flow navigation discoverable from the unit-list header or
  selected-row context, using stable unit identity and the existing viewer
  bridge contract.
- Allow selected-unit definition content to be shown in a unit-list detail pane
  without changing the application-owned definition content.
- Deliver the feature as small slices in this order unless impact
  investigation justifies reordering:
  1. header styling and existing-control relocation
  2. presentation-level search UI sharing
  3. list/flow navigation actions
  4. selected-unit detail pane

## Behavioral Scenarios

```gherkin
Feature: Explore units from the unit-list viewer

Scenario: Existing table actions remain available in the refreshed header
  Given a unit list is open
  When the refreshed header is displayed
  Then search, visible and total counts, and column visibility remain available
  And CSV export remains available

Scenario: Navigate from a selected list row to the flow graph
  Given a selected unit has a corresponding flow context
  When the user invokes the flow navigation action
  Then the flow viewer opens or focuses the corresponding unit
  And navigation follows the list and flow navigation use case

Scenario: Inspect a selected unit without leaving the list
  Given a unit row is selected
  When the user opens unit details
  Then the detail pane shows the application-provided unit definition content
  And the current list state remains stable
```

## Architecture

- Domain: no UI dependencies; shared query semantics may be introduced only
  if a later approved slice identifies genuinely shared domain behavior.
- Application: retain stable unit identity, navigation, list-view DTO, and unit
  definition contracts; own shared search behavior only when the search use
  case trigger is satisfied.
- Presentation: own header styling, control layout, table filtering, flow
  reveal, keyboard interaction, and detail-pane rendering.
- Infrastructure: no planned responsibility change.

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs: unit-list
  and flow-view headers, their search presentations, unit-list table state,
  viewer bridge navigation, unit definition presentation, component tests,
  browser tests, related use cases, branch plans, and roadmap.
- Propagation decision: preserve existing DTO and bridge contracts where
  possible. Treat any shared search contract or application-layer change as a
  separate slice requiring fresh impact investigation and approval.

### Breaking Change Analysis

- User-visible behavior: controls move into a refreshed header; later slices
  add discoverable cross-view navigation and an optional detail pane.
- API/DTO/schema compatibility: no change is approved by feature creation.
- VS Code/web extension compatibility: both desktop and web viewers must retain
  equivalent behavior and must not gain unguarded Node-only dependencies.
- Changed scenarios: feature-level scenarios added; existing search,
  navigation, definition, filtering, and CSV behavior remains normative.

### Alternative Considerations

- Separate feature folders for each UI outcome: rejected for intake because
  the outcomes form one ordered unit-list exploration experience and can be
  governed through separately approved slices.
- One broad implementation pass: rejected because search boundaries,
  navigation, and detail rendering have different risks and validation needs.
- Immediate shared search service: deferred until the existing search use-case
  trigger and an approved impact investigation justify it.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`
- Scope changes requiring re-approval: beginning any runtime slice; changing
  shared search semantics; changing DTOs, viewer message contracts, CSV output,
  row filtering behavior, or unit-definition content; raising VS Code
  compatibility; or introducing host-specific dependencies.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: required for every slice; shared presentation
  code must remain browser-safe.
- Desktop extension compatibility: required; existing table, flow, export,
  navigation, and definition behavior must remain available.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- The unit-list header uses the established flow-view visual language without
  removing existing controls.
- Visible and total unit counts are available in the header.
- Shared presentation search UI does not couple table filtering to flow reveal.
- Cross-view actions follow the existing stable-identity navigation contract.
- The detail pane consumes application-provided definition data rather than
  parser internals or reconstructed wrapper objects.
- Relevant component, application, desktop, and web checks pass for each
  implemented slice.

## Non-Goals

- Rewriting table rendering, parser behavior, or flow layout.
- Changing CSV contents, unit matching semantics, or unit-definition contents
  as part of the header slice.
- Raising the minimum supported VS Code version.
- Introducing a service container or a UI-framework dependency into domain or
  application code.
- Implementing all slices under one approval decision.

## Open Questions

- Should the detail pane replace the current dialog for the unit-list viewer or
  coexist with it?
- Which selection states should enable list-to-flow navigation when no
  meaningful flow scope exists?
