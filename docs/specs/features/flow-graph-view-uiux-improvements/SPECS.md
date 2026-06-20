# Feature Specification: Flow Graph View UI/UX Improvements

## Purpose

大規模な JP1/AJS3 定義を flow
graph 上で効率よく調査、レビュー、影響分析できるように、検索、選択、ツリー連携、フォーカス、MiniMap、ノード表現を一貫した操作体験として改善する。

## Origin

- Source use case: `docs/requirements/use-cases/uc-build-flow-graph.md`
- Related plan: `docs/specs/plans.md`
- Source: flow-graph-view の既存機能を活かした UI/UX 改善要求

## Requirements

- `currentUnitId` は表示スコープ、`selectedUnitId` は選択ノードとして分離する。
- `searchedUnitId` は現在の検索結果、`searchMatchedUnitIds`
  は全検索一致として維持し、結果件数、前後移動、Enter、Shift+Enter、対象ノードへのカメラ移動を提供する。
- `handleRevealUnit` と `preserveSearchOnNextScopeChange` の既存挙動を維持する。
- ノード選択時に 320〜380px 程度の閉じられる詳細ペインを表示し、グラフ文脈、関係数、状態、フォーカス・スコープ操作を提供する。
- 詳細ペインは `UnitEntityDialog`
  の定義詳細を複製せず、明示操作で同ダイアログを開く。
- `FlowSelector` とグラフの選択および hover を `selectedUnitId` と
  `hoveredUnitId`
  で双方向同期し、必要なツリー展開、スクロール、グラフ移動を行う。
- 選択ノードを起点に edge list を visited
  set 付きで辿り、上流、下流、無関係ノードおよびエッジを判別する。
- フォーカスモードはノードを削除せず、無関係要素を opacity で弱表示する。
- React Flow 標準 `MiniMap`
  を維持し、表示切替、選択、検索一致、フォーカス状態を表現し、Controls と詳細ペインに重ならないよう配置する。
- `JobNode`、`JobNetNode`、`JobGroupNode`、`ConditionNode` を既存 `AjsNode`
  を活用したカード型表示にし、種別、名称、コメント、schedule、waited-for、nested
  expandable の状態を判読可能にする。
- 通常、hover、選択、検索一致、現在検索対象、フォーカス対象の視覚状態を区別する。
- 長い名称、コメント、パスはカード内で省略し、hover または詳細ペインで完全表示できるようにする。
- カード寸法変更が `flowGraphPosition`
  とネスト展開レイアウトへ与える影響を検証する。

## Behavioral Scenarios

```gherkin
Feature: Investigate a large flow graph

Scenario: Move among multiple search results
  Given multiple units in the current scope match name, comment, or path
  When the user moves to the next or previous result
  Then the result count and current result are shown
  And the current result is visually distinct from other matches
  And the graph viewport reveals the current result

Scenario: Inspect a selected node without opening definition details
  Given a visible flow graph node
  When the user selects the node
  Then a lightweight graph-context detail panel is shown
  And UnitEntityDialog remains closed until explicitly requested

Scenario: Synchronize tree and graph interaction
  Given the flow tree and graph are visible
  When a unit is selected or hovered in either surface
  Then the corresponding unit is emphasized in the other surface
  And currentUnitId remains the graph scope rather than the selected node

Scenario: Focus on upstream and downstream relationships
  Given a selected node and focus mode is enabled
  When the graph contains upstream, downstream, and unrelated elements
  Then upstream and downstream nodes and edges are emphasized
  And unrelated elements remain visible with reduced opacity

Scenario: Toggle the standard MiniMap
  Given the flow graph is visible
  When the user toggles MiniMap visibility
  Then the standard React Flow MiniMap is shown or hidden
  And its visible state distinguishes selected, matched, and focused nodes

Scenario: Read node information from card presentation
  Given jobs, jobnets, job groups, and conditions are visible
  When the graph is rendered
  Then each node type is distinguishable as a card
  And available status indicators and truncated text are understandable
```

## Architecture

- Domain: no change; parser and JP1/AJS domain models remain unchanged.
- Application: existing flow graph DTO and unit-definition use case remain the
  boundary; no XyFlow types are introduced.
- Presentation: all added UI state, relationship traversal for visual focus,
  React Flow camera control, MiniMap styling, detail-panel composition, and tree
  synchronization stay under `src/presentation/webview/editor/ajsFlow/`.
- Infrastructure: no change.

## Impact Analysis

### Dependency Impact

- Affected components and hooks: `FlowContents`, `Header`, `FlowSelector`,
  `useFlowViewerController`, `useFlowGraphState`, `useFlowSearchState`, viewer
  effects, and node components.
- Affected mapping and layout: `flowGraphView`, `flowSearch`,
  `flowGraphPosition`, `AjsNode`, node style helpers, expanded graph decorations
  and bounds.
- Affected tests: `flowGraphView.test.ts` plus focused tests for search state,
  selection/hover state, relationship traversal, MiniMap visibility, and UI data
  mapping.
- Propagation decision: presentation-local state and XyFlow behavior change
  together; domain, parser, application DTO, host messaging, and
  `UnitEntityDialog` content remain unchanged unless investigation proves a
  missing DTO field is required.

### Breaking Change Analysis

- User-visible behavior: additive UI and interaction changes; existing scope
  selection, nested expansion, search matching, cross-view navigation, and
  explicit definition dialog actions must remain available.
- API/DTO/schema compatibility: no planned external or application DTO break.
- VS Code/web extension compatibility: preserve `engines.vscode` 1.75
  compatibility and browser-safe shared paths; do not introduce Node-only
  modules.
- Changed scenarios: search result navigation, node inspection, tree/graph
  synchronization, focus mode, MiniMap toggle, and card rendering are added to
  `uc-build-flow-graph.md`.

### Alternative Considerations

- Split into six feature folders: rejected because all six outcomes share one
  flow-viewer selection/search/focus state contract and must compose without
  conflicting visual states; implementation will still use small vertical
  slices.
- Replace React Flow or MiniMap: rejected by scope and because the existing
  graph and nested-expansion behavior should be preserved.
- Move UI state into application/domain: rejected because selection, hover,
  viewport, MiniMap visibility, and opacity are presentation concerns.
- Reuse `currentUnitId` as selected node: rejected because it would conflate
  graph scope navigation with transient inspection.

### Approval Impact Decisions

- Approval evidence owner: TASKS.md `Human Approval`
- Scope changes requiring re-approval: application/domain DTO changes, parser
  changes, host-message changes, replacement of React Flow/MiniMap, changes
  outside the flow webview and related tests/docs, or changes to
  `UnitEntityDialog` content responsibility.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode` and must remain
  compatible with VS Code 1.75.
- Web extension compatibility: all new behavior must remain browser-safe and
  work in the web extension bundle.
- Desktop extension compatibility: existing desktop flow viewer, reveal
  navigation, definition dialog, and nested expansion behavior must remain
  functional.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- Multiple search results can be traversed forward and backward by buttons and
  Enter/Shift+Enter, with count and viewport reveal.
- Search matches and the current search result are visually distinct.
- Node selection opens a closable graph-context detail panel without
  automatically opening `UnitEntityDialog`.
- Tree and graph selection and hover are synchronized without changing scope
  semantics.
- Focus mode distinguishes selected, upstream, downstream, and unrelated graph
  elements while keeping all elements visible.
- The standard MiniMap can be toggled and reflects relevant node states without
  overlapping other controls or the detail panel.
- Supported node types use readable card presentation with distinct types,
  status indicators, and safe truncation.
- Existing nested expansion, reveal/search preservation, explicit definition
  dialog, and list navigation behavior remain intact.
- Relevant tests, qlty, desktop tests, web tests, and build pass without
  TypeScript errors.

## Non-Goals

- Replace React Flow or introduce another graph library.
- Make large domain-model or parser changes.
- Change architecture outside the flow webview boundary.
- Add flow editing capabilities.
- Remove or duplicate `UnitEntityDialog`.
- Hide graph nodes as part of focus mode.

## Open Questions

- Exact card dimensions and detail-panel width within the 320〜380px range must
  be selected after layout fixtures are inspected.
- Whether `fitView` or `setCenter` gives the least disruptive search/tree reveal
  behavior must be decided during the first interaction slice.
- The exact ordering of search results must be documented during task planning
  while preserving the existing predictable descendant-first focus behavior.
