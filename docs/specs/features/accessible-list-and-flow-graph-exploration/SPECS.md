# Feature Specification: Accessible List And Flow Graph Exploration

## Purpose

Make unit search, selection, relationship traversal, and detail inspection
practical in both the unit-list and flow-graph viewers through keyboard and
assistive-technology paths, without relying on color alone.

## Minimal Context

- Current decision: define the observable accessibility outcome and
  presentation boundary before implementation-slice planning.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs it.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Source use cases:
  [`uc-view-unit-list.md`](../../../requirements/use-cases/uc-view-unit-list.md)
  and
  [`uc-explore-flow-graph.md`](../../../requirements/use-cases/uc-explore-flow-graph.md)
- Product source:
  [flow-graph-view / list-view の WCAG 2.2 アクセシビリティ改善](https://app.notion.com/p/3a28ad13c86681ecb406f0b40a8d166b)
- Implementation-slice plan: [TASKS.md](./TASKS.md)

## Requirements

- `ACC-VIEW-001`: A keyboard-only user can enter, navigate, select within, and
  leave the virtualized unit-list table while preserving a meaningful current
  cell and unit selection.
- `ACC-VIEW-002`: Unit-list sorting, detail inspection, panel closure, and
  rerendering restore focus to a meaningful control or selected unit without
  losing stable unit identity.
- `ACC-VIEW-003`: A keyboard-only or non-visual user can select a flow node,
  traverse predecessor, successor, parent, and child relationships, choose a
  root-jobnet scope, inspect details, and return to the selected node.
- `ACC-VIEW-004`: Search results, selection, sort state, relationship type,
  scope changes, completed copy actions, and errors expose the semantic state
  or necessary status notification without depending only on graph lines,
  position, hover, or color.
- `ACC-VIEW-005`: Focus and selection remain distinguishable in VS Code light,
  dark, and high-contrast themes, including after unit-list virtualization or
  flow-graph rerendering.
- `ACC-VIEW-006`: User-visible accessibility labels and status notifications
  follow the active localization context.
- `ACC-VIEW-007`: The basic interaction outcome remains available in supported
  desktop extension hosts and the web extension without OS-specific APIs or
  Node built-ins in shared Webview code.
- `ACC-VIEW-008`: The change uses existing unit identity, hierarchy, and
  relationship data and does not redefine JP1/AJS parsing, normalization, or
  flow semantics.

## Behavioral Scenarios

```gherkin
Feature: Accessible list and flow-graph exploration

Scenario: Keyboard-only unit-list exploration preserves context
  Given a unit list with rows or columns outside the rendered viewport
  When a keyboard-only user navigates, sorts, inspects details, and returns
  Then the intended unit and meaningful cell remain selected and focused
  And the user can leave the table through the normal Webview focus order

Scenario: Non-visual flow exploration follows unit relationships
  Given a selected flow node with known JP1/AJS relationships
  When a user traverses the graph without relying on its visual layout
  Then predecessor, successor, parent, and child targets can be selected
  And the selected target and relationship are exposed semantically

Scenario: Rerendering preserves a meaningful focus destination
  Given focus within a virtualized list or rendered flow graph
  When the focused element leaves the DOM because of virtualization or rerendering
  Then focus moves to a defined fallback
  And it can return to the corresponding unit when that target is available

Scenario: Viewer state remains perceivable without color
  Given a supported VS Code theme or high-contrast environment
  When selection, focus, search, sort, relationship, or scope state changes
  Then the necessary state is available through non-color visual or semantic cues
```

## Architecture

- Domain: no change; existing normalized unit identity, hierarchy, and
  relationships remain authoritative.
- Application: no change; existing view models and navigation data remain the
  boundary consumed by the viewers.
- Presentation: own keyboard event conditions, focus management, semantic
  roles and state, localized announcements, theme-aware styling, and small
  pure helpers for presentation-local navigation.
- Infrastructure: no change; no new VS Code, host, parser, or platform adapter
  is introduced.

## Interaction Model Decisions

- The unit list remains a native table structure presented as an interactive
  data grid. One current data cell or sortable header participates in the
  Webview Tab sequence; arrow keys, Page Up, Page Down, Home, End, Control+Home,
  and Control+End move within the grid.
- Normal Tab and Shift+Tab behavior moves between the grid or graph and other
  Webview controls. These keys are not reassigned to row, sibling, or
  relationship traversal.
- Moving between unit-list data cells updates the selected row. Sortable
  headers use Enter or Space, and focus returns by stable unit identity after
  sorting or virtualization.
- Flow nodes expose meaningful labels and remain keyboard focus targets.
  Left, Right, Up, and Down traverse predecessor, successor, parent, and child
  relationships respectively; a missing target leaves selection and focus
  unchanged.
- Flow relationship keys run only when the node wrapper itself owns focus.
  Events originating from nested buttons, links, or inputs keep their native
  behavior and do not trigger graph traversal.
- Multiple flow-navigation targets use deterministic rendered order. Nested
  expansion, scope opening, and detail actions remain explicit focusable
  controls instead of overloading relationship keys.
- The shared unit selector uses one `tree`/`treeitem` contract with roving row
  focus. Up and Down move between visible enabled rows, Right expands or enters
  children, Left collapses or returns to a parent, and Home and End move to the
  first or last visible enabled row. Enter or Space activates row selection.
  Nested action buttons remain outside tree-row key handling and keep native
  Tab, Enter, and Space behavior.
- React Flow node dragging and edge Tab stops are not part of this read-only
  viewer. Built-in accessibility descriptions are localized and aligned with
  the viewer's actual keyboard behavior.
- The proposed single-character `H`, `D`, `R`, and `L` shortcuts are excluded
  from the initial plan. Equivalent actions remain keyboard reachable through
  the grid, graph, selector, and detail controls without adding a shortcut
  disable or remap preference.
- Focus movement and selection are separate state transitions. Camera
  centering or fitting does not count as DOM focus restoration.

## Impact Analysis

### Dependency Impact

- Affected presentation surfaces include the virtualized table, table header
  and navigation helpers, flow contents and controller, flow selector, shared
  unit tree, and shared detail-pane behavior.
- Likely focused tests include table navigation and header behavior, flow
  selector, flow search and viewport focus, relationship focus, unit-tree
  selection, and detail-panel focus restoration.
- Durable behavior changes are propagated to `uc-view-unit-list.md` and
  `uc-explore-flow-graph.md`. Parser, Domain, Application, CSV, diagnostics,
  and cross-view command behavior remain unchanged.

### Breaking Change Analysis

- User-visible behavior: keyboard focus movement, semantic state, status
  announcements, and high-contrast presentation are added or refined.
- API/DTO/schema compatibility: no change expected; planning must return for
  re-approval if existing DTOs cannot support the behavior.
- VS Code/web extension compatibility: both desktop and web Webviews are in
  scope; the minimum `engines.vscode` version must not change.
- Changed scenarios: `UC-VUL-A11Y-001`, `UC-EFG-A11Y-001`,
  `ACC-VIEW-FOCUS-001`, and `ACC-VIEW-PERCEPTION-001` are added.

### Alternative Considerations

- Split list and flow accessibility into independent features: rejected at
  intake because search, selection, detail inspection, and focus restoration
  form one user journey and share presentation behavior. Planning must still
  decompose the work into reviewable slices.
- Claim extension-wide WCAG 2.2 conformance: rejected because the source
  targets two Webviews and does not provide evidence for the entire extension
  or VS Code host.
- Freeze the proposed key map during intake: rejected because assistive
  technology conflicts, native Webview focus order, and ARIA pattern selection
  require focused planning and validation.
- Reassign Tab and Shift+Tab to flow siblings: rejected because the keys retain
  their normal role of moving between Webview components.
- Add single-character pane shortcuts: rejected for the initial plan because
  the same actions can remain keyboard reachable without adding shortcut
  preferences or speech-input activation risk.

### Approval Impact Decisions

- Approval evidence owner: TASKS.md `Human Approval`
- Scope changes requiring re-approval: adding Domain, Application,
  Infrastructure, parser, DTO, VS Code API, or OS-specific changes; raising the
  minimum VS Code version; splitting or expanding the target beyond the two
  viewers; or approving a key model that changes existing unrelated commands.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: keyboard interaction, semantic state, and
  theme behavior must work in the browser entry point without Node built-ins.
- Desktop extension compatibility: basic behavior must be checked on Windows
  and macOS, including at least NVDA on Windows and VoiceOver on macOS.
- Theme compatibility: VS Code theme variables and high-contrast behavior take
  precedence over assumptions limited to UI-framework light and dark themes.
- JP1/AJS compatibility: no command or definition/configuration meaning
  changes; existing stable identity and relationship projections are reused.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- Unit-list search, navigation, selection, sorting, detail inspection, and
  return can be completed with a keyboard while maintaining meaningful focus.
- Flow search or tree selection can lead to keyboard and non-visual traversal
  of predecessor, successor, parent, and child relationships, root scope
  selection, detail inspection, and return.
- Virtualization, sorting, panel transitions, scope changes, and graph
  rerendering do not leave focus lost or on an unrelated unit.
- Necessary state and outcome information is available without relying only on
  color, graph lines, position, hover, or tooltip content.
- The interaction is covered by focused automated tests and manual checks on
  Windows desktop, macOS desktop, and VS Code Web; high contrast and a large or
  deeply nested definition are included in manual validation.
- No new Domain, Application, Infrastructure, parser, Node built-in, or
  minimum VS Code version dependency is introduced.

## Non-Goals

- Certify complete WCAG 2.2 conformance for the extension or VS Code.
- Change JP1/AJS parsing, definition interpretation, unit identity, hierarchy,
  or relationship semantics.
- Add OS-specific accessibility APIs or desktop-only behavior.
- Redesign all Webview visuals or replace the existing table or flow-rendering
  frameworks.
- Announce every hover event, graph layout movement, or other nonessential
  visual update.

## Open Questions

- None before plan review. NVDA, VoiceOver, high-contrast, or large-definition
  evidence that invalidates these interaction decisions requires replanning
  and renewed approval.
