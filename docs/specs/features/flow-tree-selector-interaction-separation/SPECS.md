# Feature Specification: Flow-tree Selector Interaction Separation

## Purpose

Separate the flow-tree selector's row-state derivation, focus management,
keyboard interaction, pointer interaction, and scope-row behavior into explicit
presentation-local seams while preserving stable unit identity and the current
flow/list interaction contract.

## Minimal Context

- Current decision: keep flow-tree interaction in the webview presentation
  layer; make selection and focus responsibilities independently reviewable
  without introducing a domain or application interaction model.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` when the next
  decision needs the requirement-to-test mapping.
- Shared evidence: `docs/specs/features/BASELINE.md` intake group 11 identifies
  `UnitTreeSelector.tsx` and its interaction hotspots.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Roadmap item: `docs/specs/roadmap.md` 7.5, Flow-tree Selector Interaction
  Separation.
- Source use cases:
  - `docs/requirements/use-cases/uc-explore-flow-graph.md`
  - `docs/requirements/use-cases/uc-navigate-between-unit-list-and-flow-graph.md`
- JP1/AJS source reference:
  - Command or definition reference: none; this feature does not change
    parsing, normalization, flow scope resolution, or JP1/AJS definition
    interpretation.
  - Undocumented or inferred behavior: existing enabled/disabled row,
    selection, focus, scope-opening, reveal, and return-focus behavior is
    characterized by `unitTreeSelector.test.ts`, `accessibilityDom.test.tsx`,
    flow interaction tests, and the source use cases.
- Implementation-slice plan: `TASKS.md`.

## Requirements

- R1: The shared selector exposes presentation-local seams for row-state
  derivation, visible-row navigation, expansion state, and DOM focus/tabindex
  management without importing domain, infrastructure, VS Code, or Node APIs.
- R2: Enabled rows preserve pointer selection, hover synchronization, focus
  movement, Enter selection-and-focus, and Space selection-only behavior.
- R3: Disabled rows remain focusable when required for sibling-tree navigation,
  remain unavailable for ordinary selection, and preserve Alt+Enter scope
  opening only for eligible scope rows.
- R4: Arrow, Home, End, Enter, Space, and Alt+Enter behavior remains distinct
  from expansion/collapse and from flow-scope resolution; scope changes are
  still initiated only by the existing flow callbacks.
- R5: Focus requests, rerendering, expansion, selected-row reveal, nested-tree
  visibility, and return-focus handoffs retain their current meaningful target
  or defined fallback for large and nested trees.
- R6: Stable unit IDs remain the only selector-to-flow identity; parser order,
  rendered order, graph placement, or transient DOM state is not introduced as
  an identity source.
- R7: The same behavior remains valid in desktop and browser webview hosts,
  with no new VS Code, Node-only, domain, application, transport, telemetry,
  or dependency contract.

## Behavioral Scenarios

```gherkin
Feature: Flow-tree selector interaction

Scenario: Enabled row selection remains separate from focus movement
  Given an enabled in-scope flow-tree row is focused
  When the user presses Enter
  Then the row is selected and its corresponding graph unit is focused
  When the user presses Space
  Then the row is selected without opening a scope

Scenario: Disabled sibling scope remains navigable but not selectable
  Given an out-of-scope eligible root-jobnet row is visible
  When the user moves focus to that row with ArrowDown, ArrowUp, Home, or End
  Then the row remains focusable and disabled for ordinary selection
  And pressing Enter or Space does not select it

Scenario: Alt+Enter opens only the eligible scope
  Given an eligible root-jobnet scope row is focused
  When the user presses Alt+Enter
  Then the existing flow-scope callback opens that scope
  And selection is not performed as a side effect

Scenario: Selector focus survives nested visibility changes
  Given a focused row in a nested flow tree
  When the tree expands, collapses, rerenders, or receives a focus request
  Then focus moves to the corresponding stable unit ID or the defined visible
  fallback
  And the selected row is revealed without changing the active flow scope
```

## Architecture

- Domain: none; JP1/AJS unit meaning and stable identity remain unchanged.
- Application: none; flow graph DTOs, scope transitions, viewer messages, and
  cross-view navigation contracts remain unchanged.
- Presentation: own selector row-state models, focus/tabindex coordination,
  keyboard and pointer interaction adapters, tree expansion/reveal behavior,
  and MUI rendering.
- Infrastructure: none; parser, VS Code host adapters, webview transport, and
  telemetry remain unchanged.

## Impact Analysis

### Dependency Impact

- Affected selector surface:
  `src/presentation/webview/editor/shared/UnitTreeSelector.tsx`,
  `src/presentation/webview/editor/shared/unitTreeNavigation.ts`,
  `src/presentation/webview/editor/shared/unitTreeSelection.ts`, and the flow
  adapter `src/presentation/webview/editor/ajsFlow/FlowSelector.tsx` only where
  extracted contracts require it.
- Direct consumers include `FlowSelector`, `FlowContents`, the shared tree
  accessibility DOM tests, and the pure selector/navigation tests. Existing
  flow scope reducers and graph selection controllers remain consumers but are
  intentionally not refactoring targets.
- Propagation decision: selector interaction seams and focused tests change
  together; unit identity, flow scope resolution, graph layout, list/flow
  navigation, parser data, host messages, and telemetry remain unchanged.

### Breaking Change Analysis

- User-visible behavior: none intended; this is a behavior-preserving
  presentation refactoring.
- API/DTO/schema compatibility: no application DTO, viewer message, or
  telemetry schema changes.
- VS Code/web extension compatibility: no new host API or Node-only import;
  the same shared selector is used by desktop and browser webviews.
- Changed scenarios: none; the source-use-case rules and scenarios are
  preserved and covered by focused selector and accessibility tests.

### Alternative Considerations

- Move selection or focus state into Application: rejected because DOM focus,
  keyboard modifiers, row affordances, and reveal timing are presentation
  concerns.
- Merge selector interaction with flow-scope resolution: rejected because
  selection and focus must not implicitly change the active scope.
- Rewrite the selector or change row semantics: rejected because the feature
  is an isolation boundary and must preserve existing JP1/AJS viewer behavior.
- Create a generic cross-view interaction framework: rejected because only the
  existing shared tree boundary is in scope and table navigation remains a
  separate feature.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval` and `Completion
Approval`, according to the lifecycle gate.
- Scope changes requiring re-approval: flow scope resolution, graph layout,
  stable identity, counterpart-viewer opening, table keyboard navigation,
  application/domain contracts, host messages, telemetry, or new shortcuts.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode` (`^1.75.0`).
- Web extension compatibility: preserve browser-safe production imports and
  validate the web test path and browser DOM behavior.
- Desktop extension compatibility: preserve the same selector callbacks,
  keyboard behavior, accessibility semantics, and focus handoffs through the
  desktop suite.
- JP1/AJS definition compatibility: no parser, normalized model, encoding,
  definition projection, flow scope, or graph placement changes are allowed.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- AC1: Selector row state, navigation, pointer/keyboard interaction, focus
  coordination, expansion, and reveal responsibilities have explicit
  presentation-local seams with no architecture-rule exception.
- AC2: Enabled and disabled rows preserve selection, hover, focus movement,
  Enter/Space behavior, and eligible Alt+Enter scope opening in focused tests.
- AC3: Focus requests, rerender focus retention, collapse/expand behavior,
  selected-row reveal, and nested-tree fallback behavior remain covered by DOM
  tests and large/deep pure navigation fixtures.
- AC4: Stable unit IDs and existing flow callbacks remain the only identity and
  scope-transition boundaries; no parser or rendered-order dependency is added.
- AC5: Desktop and web test paths, the production build, qlty, Markdown lint,
  and diff checks pass without changing `engines.vscode` or production host
  assumptions.
- AC6: README and CHANGELOG impact is evaluated under
  `docs/specs/README.md`; no update is required for an internal,
  behavior-preserving refactoring.

## Non-Goals

- Change flow scope resolution, graph placement, expansion geometry, or graph
  selection semantics.
- Change stable unit identity, list/flow navigation, or counterpart viewer
  opening behavior.
- Change table tree/grid keyboard navigation or shared header search.
- Add shortcuts, multi-selection, drag-and-drop, virtualization, or a visual
  redesign.
- Move selector behavior into domain/application layers or introduce a shared
  interaction domain contract.
- Change telemetry, host messages, parser behavior, definition compatibility,
  or the minimum supported VS Code version.

## Open Questions

- None.
