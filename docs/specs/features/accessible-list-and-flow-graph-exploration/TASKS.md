# Feature Tasks: Accessible List And Flow Graph Exploration

## Agent Brief

- Purpose: make unit-list and flow-graph exploration practical through
  keyboard, assistive-technology, and high-contrast paths.
- Approved or active slice: Slices 1 through 5 are complete; Slice 6 is the
  next pending implementation slice.
- Do not: edit runtime code, tests, generated artifacts, or configuration
  before a reviewed slice receives Human Approval.
- Do not: add extension-wide WCAG certification, printable-character
  shortcuts beyond the planned `H`, `D`, `R`, and `L`, Domain, Application,
  Infrastructure, parser, DTO, or host changes.
- Read first: `SPECS.md`, this file, and the two owning use cases.
- Read `TRACEABILITY.md` when reviewing or implementing a slice.
- Validate every code slice with its focused tests and
  `rtk pnpm run qlty`; run final cross-platform evidence in Slice 7.
- Approval policy and document roles: see `docs/specs/README.md`.
- Next decision: begin Slice 6 implementation under its existing approval
  boundary.

## Sync Rule

- Update this file in the same commit whenever a slice is completed,
  re-scoped, or intentionally dropped.
- This file is the sole plan and current-state owner for this selected feature.
- Other feature folders inherited from the base branch remain outside this
  feature's scope.
- Do not return to planning during normal slice progress. Replan only for a
  new slice, changed scope or design, wider impact, or changed approval
  boundary.
- Keep implementation history out of this file once it no longer affects
  approval, validation, risk, or Feature Exit.

## Plan Status

- Status: In Progress
- Planning scope: implement `ACC-VIEW-001` through `ACC-VIEW-008` in seven
  ordered presentation and resource slices.
- Review status: Reviewed; revised Slices 3, 5, 6, and 7 are approved for
  implementation
- Human approval: All seven slices approved; Slice 5 completion is recorded
  and implementation may proceed with Slice 6
- Active implementation slice: Slice 6, Localized Semantic State And
  Announcements

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 3, Flow Spatial And Scope Navigation: presentation-local
  spatial navigation, N-only inline expansion shortcuts, N/RC Enter scope
  entry and Escape containing-scope return, asynchronous focus restoration,
  read-only React Flow configuration, performance regressions, tests, and
  required README/CHANGELOG updates. Existing Application scope eligibility,
  selector/detail/announcement/theme implementation, and revised Slices 5–7
  remain outside this approval.
- Prior approved decisions retained: normal Tab traversal; spatial unmodified
  arrows independent of predecessor/successor edges; shortest center-to-center
  Euclidean distance with upper, left, then stable-order ties; inline
  Shift+Down/Shift+Up expansion; and the planned `H`, `D`, `R`, and `L`
  shortcuts with strict event ownership.
- Replanning gap (2026-07-31): interaction verification showed that the phrase
  "Enter moves to the first child" had been implemented as selection-only
  traversal using rendered/parser-derived child order. The intended operation
  is to open a focused N or RC unit with internal units as the active flow
  scope; Escape returns to its nearest containing N or RC scope. This changes
  Slice 3's hierarchy resolver, asynchronous focus restoration, validation,
  and approval boundary, plus the scope-continuity, localized-instruction, and
  integrated-validation responsibilities in Slices 5 through 7.
- Approval invalidated only for revised, incomplete Slices 3, 5, 6, and 7.
  Completed Slices 1 and 2 and unchanged Slice 4 remain preserved.

Implementation may proceed only inside the approved slice boundaries and only
after switching from `main` to a dedicated non-doc feature branch.

## Implementation Order

1. Unit-list data-grid navigation
2. Unit-list workflow focus continuity
3. Flow spatial and scope navigation
4. Shared unit-tree keyboard semantics
5. Flow scope and detail focus continuity
6. Localized semantic state and announcements
7. Non-color state, high contrast, and compatibility validation

Slices 1 and 3 establish the two primary interaction surfaces. Slice 2 depends
on Slice 1. Slice 4 establishes the shared selector contract consumed by
Slice 5, while Slice 5 also depends on Slice 3. Slice 6 consumes the completed
selection and focus events from Slices 1 through 5. Slice 7 verifies and styles
the complete state model.

## Notion Candidate Key Reconciliation

- Already reflected: list cell arrows, Page Up/Down, Home/End, sortable-header
  arrows and Enter/Space, and normal list Tab exit.
- Partially reflected with a deliberate selector design change: Notion limits
  Up/Down and Enter to eligible root jobnets. Slice 4 instead applies shared
  tree Up/Down and Enter/Space semantics to visible enabled rows, while Slice
  5 keeps root-scope opening as an explicit eligible action and uses `L` to
  focus the current or first eligible root-jobnet target.
- Added by this replan: list `H`, `D`, `R`, and paired `Escape` behavior in
  Slice 2; flow `D`, `L`, `R`, and paired `Escape` behavior in Slice 5; their
  localized instructions in Slice 6; and integrated assistive-technology and
  editable-control checks in Slice 7.
- Revised flow map: Tab and Shift+Tab keep normal Webview focus traversal.
  Unmodified arrows move to the nearest rendered node in the pressed direction
  by center-to-center Euclidean distance without consulting predecessor or
  successor relationships. Equal distances prefer the upper then left
  candidate. Shift+Down/Shift+Up expand/collapse the current nested jobnet
  inline without changing scope. Enter opens a focused N or RC unit with
  internal units as the active flow scope; Escape returns from a nested N or
  RC scope to its nearest containing N or RC scope.
- Existing-cell action compatibility: Enter may still invoke an approved
  pre-existing nested cell action from Slice 1, but Enter and Space do not
  become generic detail-pane shortcuts.

## Implementation Slices

### Slice 1: Unit-List Data-Grid Navigation

- Status: Complete
- Scope: convert the current row-level Tab stops into a roving cell/header
  focus model while preserving native table structure. Implement visible-column
  movement, virtualized row movement, Page Up/Down, Home/End,
  Control+Home/End, stable selection and focus after sorting, sortable-header
  activation, semantic row and column counts and indices, and normal Tab exit.
- User / Domain Value: a keyboard-only user can efficiently inspect and select
  every visible unit-list value without tabbing through every row.
- Cohesive Change Group:
  `ajsTable/navigation.ts`, `ajsTable/VirtualizedTable.tsx`,
  `ajsTable/TableHeader.tsx`, `ajsTable/TableContents.tsx`, affected table cell
  rendering, `tableNavigation.test.ts`, `ajsTableHeader.test.ts`, and a focused
  virtualized-grid accessibility test when existing tests cannot host DOM
  behavior cleanly.
- Acceptance:
  - One meaningful cell or sortable header is the grid Tab stop.
  - Directional and paging keys move only among rendered or revealable visible
    cells and scroll the target into view.
  - Moving to a data cell updates row selection; hidden columns are skipped.
  - Sorting retains the selected unit by stable absolute path and restores the
    current visible column or the documented grid fallback.
  - `aria-rowcount`, `aria-rowindex`, `aria-colcount`, `aria-colindex`,
    `aria-selected`, and `aria-sort` reflect logical data, not only mounted DOM.
  - Tab and Shift+Tab leave the grid through normal Webview order.
- Validation:
  focused navigation/header tests; virtualized first, middle, last, hidden
  column, sort, empty-list, and missing-target cases; `rtk pnpm test`;
  `rtk pnpm run test:web`; `rtk pnpm run qlty` with no new smell findings.
- Implementation Evidence:
  - Focused navigation and header tests cover stable entry fallback, visible
    columns, sortable headers, first/middle/last and 10,000-row paging
    boundaries, sticky-column horizontal reveal, sorting reorder, empty and
    missing targets, ARIA sort values, and normal Tab non-capture.
  - `rtk pnpm test`, `rtk pnpm run test:web`, and
    `rtk pnpm run qlty` passed on 2026-07-30. Desktop and web bundles compiled
    without a Node-only production import or VS Code compatibility change.
  - Performance follow-up removed focus-only React state updates, duplicate
    selection reporting, and redundant smooth scrolling. Mounted-cell movement
    now updates only the previous and next roving `tabIndex`; row changes retain
    only the rendering required for selection and detail state.
  - The existing test harness has no Webview DOM renderer. Virtualization focus
    restoration was therefore reviewed at the React/Virtuoso integration
    boundary and exercised through pure logical-target tests plus desktop and
    web builds; manual assistive-technology validation remains owned by
    Slice 7.
  - Human interaction verification, including responsive cell movement and
    sticky-column horizontal reveal, was approved on 2026-07-30.
- Production Readiness:
  - Failure mode: when a target cannot be rendered, retain the current cell and
    selection and expose no false movement.
  - JP1/AJS compatibility: no command, configuration, parsing, or unit meaning
    changes.
  - Large or malformed input risk: exercise the existing virtualized large-list
    path; invalid definitions remain handled before presentation.
  - Desktop/web impact: shared Webview code only; verify browser-safe DOM and
    scrolling behavior.
  - README/docs impact: add the accepted grid keyboard model to user
    documentation in the slice.
  - CHANGELOG impact: required because keyboard and focus behavior are
    externally observable.
- Approval Boundary: unit-list grid navigation and its tests/docs only. Detail
  pane transitions, flow behavior, announcements, and theme changes remain out
  of scope.
- Dependencies: none.
- Risks: react-virtuoso may unmount the focused cell; sortable controls inside
  headers may compete with grid navigation; horizontal reveal must avoid
  hidden columns.
- Out of Scope: editable cells, column selection shortcuts, printable-character
  shortcuts, parser or DTO changes, and replacement of table frameworks.

### Slice 2: Unit-List Workflow Focus And Shortcut Continuity

- Status: Complete
- Scope: connect the current grid cell to search reveal, detail-pane entry and
  closure, and definition-dialog return. Restore focus by stable absolute path
  and visible column, with a documented grid fallback when the target is
  filtered, hidden, or unmounted. Add the candidate list shortcuts: `H` moves
  from a data cell to its current column header, header `Escape` returns to the
  saved cell, `D` opens or enters selected-unit details, detail `R` returns to
  the saved cell without closing, and detail `Escape` closes and returns.
- User / Domain Value: a keyboard-only user can search, select, inspect a
  unit's details, close nested UI, and return without losing position.
- Cohesive Change Group:
  `ajsTable/TableContents.tsx`, `ajsTable/VirtualizedTable.tsx`,
  `ajsTable/TableHeader.tsx`, `ajsTable/UnitListDetailPanel.tsx`,
  `ajsTable/Header.tsx`, `shared/SharedUnitDetailPane.tsx`,
  `UnitDefinitionDialog.tsx`, table reveal/search state, and focused list
  search, detail, dialog, and header tests.
- Acceptance:
  - Search reveal preserves stable selected-unit identity and restores a
    meaningful cell when it still exists.
  - The detail pane and its actions are reachable through normal focus order.
  - From a data cell, unmodified `H` focuses the same column's header and
    remembers the originating cell; header `Escape` returns to that cell or
    the documented grid fallback.
  - From a data cell, unmodified `D` reopens the selected unit's closed detail
    pane when necessary and focuses its heading or first enabled action.
  - In list details, unmodified `R` restores the saved cell without closing the
    pane. `Escape` closes the definition dialog first or, when no dialog is
    open, closes the detail pane and restores the saved cell.
  - `H`, `D`, and `R` do not run for modified keys or events from editable or
    nested interactive controls. Enter and Space retain the approved Slice 1
    behavior and do not become generic detail shortcuts.
  - Closing the detail pane returns to the saved current cell.
  - MUI Dialog's existing focus restoration is verified first. Change dialog
    behavior only if focused tests prove the default does not return to the
    invoking detail action.
  - A removed, filtered, or hidden target falls back to the nearest valid cell
    or the grid entry target without focusing unrelated content.
- Validation:
  extend table search/header and detail-pane tests with filter, close, dialog
  default restoration, target-removed, fallback, `H` header round trip, `D`
  pane reopen/entry, `R` return-without-close, `Escape` precedence, uppercase
  and lowercase keys, modifier rejection, and editable/nested-control event
  exclusion; `rtk pnpm test`; `rtk pnpm run test:web`;
  `rtk pnpm run qlty` with no new smell findings.
- Implementation Evidence:
  - Focused tests cover restoration to the same visible column, hidden-column
    fallback, removed and empty targets, explicit same-path search reveal, and
    MUI Dialog's enabled default focus restoration.
  - Focused shortcut tests cover uppercase and lowercase `H`, `D`, and `R`,
    header `Escape`, detail-pane `Escape`, modifier rejection, nested-control
    exclusion, and non-sortable leaf headers as valid grid focus targets.
  - Search, unit-tree, host, and in-table jump reveals issue an explicit focus
    request after resolving a valid stable absolute path. Closing the detail
    pane issues the same request for the selected unit, while the definition
    dialog retains MUI's invoking-element restoration.
  - Focus requests are separate from row selection so reselecting the same
    search result is not lost to React state equality. The request revision
    also lets the newest reveal replace an older pending virtualized target
    without mounting or scanning the full table.
  - `rtk pnpm test`, `rtk pnpm run test:web`, and
    `rtk pnpm run qlty` passed on 2026-07-30. After the independent review fix
    for detail-action `Escape`, the focused desktop tests and full web suite
    passed again. Desktop and web bundles compiled without adding VS Code,
    Node, parser, DTO, or host dependencies.
  - The repository has no Webview DOM test harness. React/Virtuoso focus
    integration therefore received final-diff review and is covered by pure
    restoration-target tests plus desktop and web builds. This evidence covers
    the automated portion of the slice. Human interaction verification and
    slice completion were approved on 2026-07-30.
- Production Readiness:
  - Failure mode: a stale path or column resolves to the documented fallback
    and never throws or focuses a detached element.
  - JP1/AJS compatibility: stable absolute-path identity is consumed as today;
    no definition meaning changes.
  - Large or malformed input risk: restoration must not scan or mount the full
    table; malformed input remains outside presentation.
  - Desktop/web impact: use browser focus APIs available in both extension
    hosts; shortcut event filtering must behave the same in both hosts and must
    not add VS Code or Node APIs.
  - README/docs impact: document `H`, `D`, `R`, `Escape`, detail entry,
    closure, and return behavior.
  - CHANGELOG impact: required because focus restoration changes user workflow.
- Approval Boundary: unit-list search, detail, dialog and `H`/`D`/`R`/Escape
  focus continuity plus tests/docs. Sorting remains owned by Slice 1. Flow and
  cross-view announcements/themes are excluded.
- Dependencies: Slice 1.
- Risks: multiple pending reveal and focus requests may race; a column may
  become hidden between saving and restoring focus; printable shortcuts may
  conflict with assistive technology, speech input, or text entry unless event
  ownership and editable-control exclusions are exact.
- Out of Scope: changing search matching, row identity, detail content,
  definition-dialog semantics, or cross-view navigation commands.

### Slice 3: Flow Spatial And Scope Navigation

- Status: Complete
- Scope: retain the implemented presentation-local spatial arrow resolver and
  read-only React Flow behavior. Keep Shift+Down/Shift+Up as same-scope inline
  nested-jobnet expansion and collapse. Replace the incorrect selection-only
  Enter-child/Escape-parent resolver with scope transitions: Enter opens a
  focused N or RC unit with internal units through the existing flow-scope
  path; Escape returns from the active nested N or RC scope to its nearest
  containing N or RC scope. Restore selection and DOM focus only after the
  destination graph is ready.
- User / Domain Value: a keyboard user can move in the visible direction,
  inspect nested content inline, or enter and leave an N/RC internal flow
  without relying on parser-derived child order.
- Cohesive Change Group:
  `ajsFlow/flowKeyboardNavigation.ts`, `ajsFlow/FlowContents.tsx`,
  `ajsFlow/flowGraphView.ts`, `ajsFlow/useFlowViewerController.ts`,
  `ajsFlow/useFlowViewerEffects.ts`, existing flow-scope and expansion helpers,
  flow node components, `flowKeyboardNavigation.test.ts`, flow-scope,
  expansion, viewport, and node-display tests. Concrete responsibilities are
  the pure key/action resolver, `FlowGraphPanel`'s owned-node event handler,
  controller current-scope transitions, selection reset and post-render focus
  requests, and scope-reset/readiness effects. Existing
  `buildFlowGraphFromValidatedDocument` N/RC eligibility and
  `canOpenNodeAsScope` are compatibility references, not planned Application
  or eligibility edits.
- Acceptance:
  - Spatial resolution uses final rendered unit-node position and dimensions,
    excludes bounds nodes, chooses the nearest center in the pressed direction,
    and retains upper/left/stable-rendered-order ties without consulting edges.
  - Selection and hover decoration reuse cached geometry; relevant identity,
    position, dimension, order, and expanded-layout changes invalidate it.
  - Shift+Down expands and Shift+Up collapses an eligible nested jobnet inline
    without changing active graph scope. Existing explicit expansion controls
    remain available.
  - Enter on a focused N or RC node with at least one internal unit opens that
    unit through the same current-scope transition used by the existing
    explicit open-scope action. It never chooses a child by parser, DTO, or
    rendered order.
  - After Enter's destination graph is ready, its rendered scope-root node is
    selected and receives DOM focus. The existing scope-change reset and
    viewport behavior applies rather than spatial centering at the previous
    zoom.
  - Escape from an active nested N or RC scope opens its nearest containing N
    or RC scope. After that graph is ready, the scope that was left is selected
    and focused in the containing graph.
  - Enter on an ineligible or empty unit and Escape from a root-jobnet scope
    leave scope, selection, focus, expansion, and viewport unchanged. The owned
    key event is still prevented and stopped at the node wrapper.
  - If an expected post-scope-change focus node is not rendered, focus moves
    to the graph region's single entry target without selecting an unrelated
    unit or initiating another scope transition.
  - A valid arrow target is selected, focused, and centered at the existing
    zoom. A successful inline expansion/collapse preserves selection, zoom,
    viewport, and stable-ID focus as already implemented.
  - Navigation keys run only when the node wrapper owns the event. Nested
    controls retain native keys, and Tab/Shift+Tab retain normal focus order.
  - Node wrappers remain meaningful focus targets; nodes and edges retain the
    read-only React Flow configuration.
- Validation:
  retain the completed spatial direction, Euclidean-distance, tie, geometry,
  cache, bounds-node, 10,000-node, no-target, wrapper-ownership, expansion,
  viewport, read-only, and flicker regressions. Replace Enter-child and
  Escape-parent expectations with tests for Enter on N and RC scopes, empty
  and ineligible Enter no-op, Escape from nested N and RC scopes, root Escape
  no-op, nearest containing flow-scope resolution, consistency with explicit
  open-scope eligibility/reset behavior, asynchronous destination readiness,
  entered-scope root focus, returned-container focus, stale-target graph-entry
  fallback, scope/selection/viewport outcomes, modifier separation, and
  descendant-control exclusion; `rtk pnpm test`; `rtk pnpm run test:web`;
  `rtk pnpm run qlty` with no new smells.
- Implementation Evidence:
  - Spatial arrows, geometry caching, read-only node/edge behavior, inline
    Shift+Down/Up expansion focus, current-zoom centering, selection-decoration
    identity stability, and whole-graph rebuild prevention for selection-only
    movement are implemented and retain their passing focused, desktop, Web,
    and qlty evidence. Enter/Escape now intentionally replace graph scope and
    therefore wait for one destination-graph render instead of pretending to
    be selection-only movement.
  - The prior Enter-child/Escape-parent tests prove only the superseded
    selection traversal and must be replaced. They are not completion evidence
    for the corrected scope behavior.
  - Existing Application behavior already accepts N and RC as flow scopes, and
    the Presentation detail path already exposes explicit N/RC open-scope
    eligibility. Replanning therefore requires no Domain, Application, parser,
    DTO, host, or dependency change.
  - Current implementation validation (2026-07-31): the resolver now derives
    Escape from the active scope rather than the focused child, Enter accepts
    only non-empty N/RC units, and post-transition selection/focus waits for
    the expected destination scope with a graph-entry fallback. Focused tests,
    desktop tests, Web tests, qlty, Markdown lint, and diff checks passed.
    Manual React Flow interaction verification was completed and human
    slice-completion approval was received on 2026-08-01.
- Production Readiness:
  - Failure mode: stale, empty, ineligible, root, or unrendered scope targets
    produce the defined no-op or graph-entry fallback without unrelated
    selection or recursive scope changes.
  - JP1/AJS compatibility: reuse existing N/RC scope eligibility, stable unit
    identity, and containing hierarchy; do not reinterpret unit types or child
    order.
  - Large or malformed input risk: arrows retain one O(N) cached geometry scan;
    Enter resolves the focused unit directly and Escape walks only its ancestor
    chain. Scope changes reuse existing bounded graph construction and error
    handling.
  - Desktop/web impact: React Flow and browser-safe presentation state only;
    verify asynchronous focus restoration in both bundles without VS Code or
    Node APIs.
  - README/docs impact: describe spatial arrows, inline Shift+Down/Up, and N/RC
    scope entry/return as distinct operations.
  - CHANGELOG impact: required because Enter/Escape graph behavior changes.
- Approval Boundary: presentation-local spatial navigation, N-only inline
  expansion shortcuts, N/RC Enter scope entry and Escape containing-scope
  return, asynchronous focus restoration, read-only React Flow configuration,
  performance regressions, and tests/docs. Existing Application scope
  eligibility is consumed but not changed; selector/detail/announcement/theme
  implementation remains outside this slice.
- Dependencies: none; implementation follows Slice 2 to finish one viewer
  journey before starting the other.
- Risks: scope rerender timing can race focus; the current scope root and the
  returned container can be temporarily absent; graph-level Escape must not
  override selector, detail-pane, dialog, or nested-control Escape; N inline
  expansion and N scope entry must remain distinguishable; RC has scope entry
  but no new inline expansion behavior; a necessary scope render must not
  regress into repeated or intermediate whole-graph flashes.
- Out of Scope: changing N/RC scope eligibility, adding RC inline expansion,
  changing graph layout or Application graph construction, relationship-focus
  semantics, new DTO fields, scope history beyond the existing containing
  hierarchy, edge editing, node dragging, wrapping, and Tab capture.

### Slice 4: Shared Unit-Tree Keyboard Semantics

- Status: Complete
- Scope: give the shared unit selector one explicit `tree`/`treeitem` contract
  and roving row focus. Implement Up/Down visible-row movement, Right
  expand-or-enter-child, Left collapse-or-return-parent, Home/End boundaries,
  Enter/Space row selection, semantic expanded/selected/current state, and
  normal behavior for nested expand and scope action buttons.
- User / Domain Value: keyboard and screen-reader users can navigate the shared
  unit hierarchy predictably in both list and flow viewers.
- Cohesive Change Group:
  `shared/UnitTreeSelector.tsx`, list and flow consumer wiring only where
  required by the shared contract, `unitTreeSelector.test.ts`, and focused
  consumer regression tests.
- Acceptance:
  - The expanded hierarchy exposes `tree` and `treeitem` semantics with one
    current row in the tree Tab sequence.
  - Up/Down, Right/Left, and Home/End operate only on visible enabled rows and
    preserve selected/current distinctions.
  - Enter/Space selects the focused row.
  - Nested action buttons do not trigger row navigation from bubbled events and
    retain native Tab, Enter, and Space behavior.
  - List and flow consumers preserve existing selection, scope eligibility,
    hover synchronization, and collapse behavior.
- Validation:
  extend `unitTreeSelector.test.ts` for semantics, roving focus, all navigation
  boundaries, nested actions, disabled rows, collapse, and both consumers;
  `rtk pnpm test`; `rtk pnpm run test:web`; `rtk pnpm run qlty` with no new
  smell findings.
- Implementation Evidence:
  - `unitTreeNavigation.ts` provides pure visible-row flattening and key
    resolution for enabled-row traversal, hierarchy expansion/collapse,
    selection, boundaries, and modifier separation. `unitTreeSelector.test.ts`
    covers those boundaries and disabled-row behavior.
  - `UnitTreeSelector` now exposes one `tree` container with roving
    `treeitem` focus, semantic current/selected/expanded/disabled state, and
    native nested expand/scope action controls. Focus restoration falls back
    to the selected or first visible enabled row when a focused row is removed.
  - Focus transitions keep the active row identity in a ref and update only
    the previous and next row `tabIndex` plus immediate target DOM focus.
    Arrow-key movement therefore does not wait for or trigger a React render.
    Focus events from nested child treeitems are ignored by ancestors, and
    scrolling and focus outlines target the visible row rather than its entire
    descendant subtree.
  - `rtk pnpm test`, `rtk pnpm run test:web`, `rtk pnpm run qlty`, Markdown lint,
    and diff checks passed on 2026-08-01. The repository has no Webview DOM
    test harness, so DOM and assistive-technology interaction remain the human
    completion gate.
- Production Readiness:
  - Failure mode: an unavailable target retains the current tree row and
    reports no false selection.
  - JP1/AJS compatibility: existing unit hierarchy and eligibility are consumed
    without reinterpretation.
  - Large or malformed input risk: visible-row navigation avoids implicit
    expansion or a full-DOM mount of deeply nested hierarchies.
  - Desktop/web impact: shared browser-safe component behavior is verified in
    both desktop and web test runs.
  - README/docs impact: document the shared tree keyboard model where users can
    discover it.
  - CHANGELOG impact: required because both viewers gain observable keyboard
    behavior.
- Approval Boundary: shared tree semantics, focus movement, consumer wiring,
  tests, and relevant docs only. Graph-node N/RC scope entry/return remains in
  Slice 3; selector scope transitions and detail focus remain in Slice 5.
- Dependencies: none; implementation follows Slice 3 to keep review order
  aligned with the flow journey.
- Risks: nested native buttons can complicate composite-widget focus;
  responsive collapse may remove the focused tree row.
- Out of Scope: changing hierarchy data, eligibility, automatic full-tree
  expansion, graph-node scope navigation, selector scope rules, or
  printable-character shortcuts.

### Slice 5: Flow Scope, Detail, And Shortcut Focus Continuity

- Status: Complete
- Scope: connect the shared selector and keyboard-focused graph to root-jobnet
  scope changes, selected-node details, panel closure, and definition-dialog
  return. Focus the opened scope's rendered root node and restore the invoking
  graph node when leaving selector or details. Add `D` to open or enter node
  details, `L` to open or enter the flow selector, `R` to return from details
  without closing, and `Escape` return/closure behavior.
- User / Domain Value: a keyboard-only user can choose a flow scope, inspect
  the selected node, and return to the graph without losing context.
- Cohesive Change Group:
  `ajsFlow/FlowSelector.tsx`, `ajsFlow/FlowContents.tsx`,
  `ajsFlow/useFlowViewerController.ts`, `ajsFlow/FlowNodeDetailPanel.tsx`,
  `shared/SharedUnitDetailPane.tsx`, conditional
  `UnitDefinitionDialog.tsx` changes, and flow selector, detail-panel,
  viewport-focus, and dialog tests.
- Acceptance:
  - Activating an existing root-jobnet scope action focuses its rendered root
    node after the graph is ready.
  - From an owned graph focus target, unmodified `D` opens or focuses the
    selected-node detail pane at its heading or first enabled action.
  - From an owned flow-viewer or graph focus target, unmodified `L` opens or
    focuses the selector at the current scope root, falling back to the first
    eligible root jobnet. Selector `Escape` returns to the saved graph node
    without changing scope.
  - In flow details, unmodified `R` restores the saved graph node without
    closing the pane. `Escape` closes the definition dialog first or, when no
    dialog is open, closes the detail pane and restores the saved graph node.
  - `D`, `L`, and `R` do not run for modified keys or events from editable or
    nested interactive controls. Shared tree arrows and activation remain
    owned by Slice 4.
  - Leaving the selector without changing scope and closing details restore the
    previously focused graph node or the graph region's single entry target
    without selecting another node or changing scope, zoom, or viewport
    position.
  - MUI Dialog's default focus restoration is verified first. Dialog code
    changes only when tests prove the invoking detail action is not restored.
  - Flow scope timing and focus requests remain separate from shared tree
    keyboard semantics.
  - Graph-node Enter/Escape scope entry and return remain owned by Slice 3.
    Selector and detail Escape handlers run only within their own regions and
    never intercept the graph-node scope-return event.
  - Selector and detail workflows remain usable when the current graph scope
    was entered through N or RC keyboard scope navigation. `L` retains its
    existing eligible-root fallback when the current N/RC scope is not itself
    an eligible root-jobnet selector target.
- Validation:
  extend `flowSelector.test.ts`, `flowNodeDetailPanelCollapse.test.ts`, flow
  viewport-focus, stale-target, asynchronous scope readiness, and dialog
  default-restoration coverage with `D`, `L`, `R`, `Escape` precedence,
  uppercase and lowercase keys, modifier rejection, editable/nested-control
  exclusion, current-scope and first-eligible selector targets, and
  return-without-scope-change cases; include entry from active nested N and RC
  scopes and verify graph-node Escape remains owned by Slice 3; missing
  saved-node restoration verifies the shared graph-region entry fallback with
  unchanged selection,
  scope/zoom/viewport; `rtk pnpm test`;
  `rtk pnpm run test:web`; `rtk pnpm run qlty` with no new smell findings.
- Implementation Evidence:
  - `flowViewerShortcuts.ts` keeps unmodified, case-insensitive `D` and `L`
    resolution separate from graph navigation and rejects modified keys.
    `FlowGraphPanel` accepts those shortcuts only from the graph node wrapper or
    graph-region entry target, so nested controls retain their native behavior.
  - Flow detail focus uses the existing shared detail-pane request contract:
    `D` selects the focused node when necessary and focuses the detail heading;
    `R` returns to the saved graph node without closing; Escape closes the
    detail pane and lets the dialog own Escape first.
  - Selector focus requests expand required ancestors, focus the current scope
    root or first eligible root-jobnet fallback, and return with Escape to the
    saved graph node. Existing root-jobnet scope actions now wait for the
    destination graph scope and focus/select its rendered root, with graph-entry
    fallback for a missing target.
  - `flowSelector.test.ts`, `flowViewerShortcuts.test.ts`, and
    `flowViewportFocus.test.ts` cover selector target resolution, modifier and
    case boundaries, asynchronous scope readiness, and missing-target fallback.
    `rtk pnpm test`, `rtk pnpm run test:web`, `rtk pnpm run qlty`, and TypeScript
    compilation passed on 2026-08-01. The repository has no Webview DOM test
    harness, so browser focus order and assistive-technology interaction were
    reviewed manually and Slice 5 completion was approved on 2026-08-01.
- Production Readiness:
  - Failure mode: an unavailable selector target uses the first eligible root
    jobnet. An unavailable saved graph node focuses the graph region's entry
    target without false selection, scope change, zoom reset, or viewport
    movement.
  - JP1/AJS compatibility: existing root-jobnet eligibility and scope rules are
    unchanged.
  - Large or malformed input risk: scope changes do not expand all nested units
    and focus lookup remains bounded.
  - Desktop/web impact: asynchronous graph readiness and browser focus are
    verified in both hosts without VS Code or Node APIs; shortcut event
    filtering must remain browser-safe.
  - README/docs impact: document `D`, `L`, `R`, `Escape`, scope, detail, and
    return behavior.
  - CHANGELOG impact: required for the expanded keyboard workflow.
- Approval Boundary: flow-specific scope/detail focus continuity,
  `D`/`L`/`R`/Escape handling, tests, and docs only. Shared tree semantics
  remain owned by Slice 4.
- Dependencies: Slices 3 and 4. Slice 3 supplies spatial graph-node focus and
  N/RC scope-entry/return continuity; Slice 5 keeps selector/detail focus
  ownership distinct from graph-node Escape.
- Risks: scope rerender timing may race focus; responsive panel collapse may
  occur while focused; the invoking dialog action may unmount; printable
  shortcuts may conflict with assistive technology, speech input, or text
  entry unless event ownership is exact.
- Out of Scope: changing scope eligibility, hierarchy semantics, graph layout,
  automatically expanding nested units, spatial navigation keys, or
  shortcuts beyond `D`, `L`, `R`, and the paired `Escape` behavior.

### Slice 6: Localized Semantic State And Announcements

- Status: Approved
- Scope: expose localized names, descriptions, state, and restrained status
  announcements for both viewers. Cover search results, selection, sort,
  spatial selection, relationship-focus and scope changes, copy completion,
  and errors while excluding hover and layout chatter. Localize React Flow
  accessibility descriptions to match the revised read-only navigation model,
  including spatial
  Left/Right/Down/Up, Shift+Down/Shift+Up, Enter N/RC scope entry, Escape
  containing-scope return, and normal Tab traversal.
- User / Domain Value: a screen-reader user can understand what changed and
  which unit, spatial direction, or relationship-focus state is current in
  English or Japanese.
- Cohesive Change Group:
  a small shared presentation announcer only if both viewers need the same
  live-region mechanics, `unitInformationLocalization.ts`,
  `resource/i18n/message_en.ts`, `resource/i18n/message_ja.ts`,
  table header/search/grid semantics, flow contents/node/detail semantics,
  React Flow `ariaLabelConfig`, and focused localization/announcement tests.
- Acceptance:
  - Interactive cells, headers, nodes, selectors, detail regions, and controls
    have localized accessible names or descriptions.
  - User-initiated search, selection, sort, spatial movement,
    relationship-focus, scope, copy, and error outcomes announce once with an
    appropriate polite or assertive level.
  - Spatial arrow movement announces the selected unit and direction without
    claiming a predecessor or successor relationship. Relationship wording is
    used only when the independent relationship-focus state changes.
  - Hover, graph layout, camera motion, and redundant selection do not announce.
  - English fallback remains deterministic for unsupported locale values.
  - English and Japanese React Flow instructions describe spatial arrow
    movement, same-scope inline expansion, and N/RC scope entry/return. They do
    not retain relationship-based arrows, selection-only child/parent
    traversal, the rejected Tab/Shift+Tab relationship traversal, or
    unmodified Down/Up expand/collapse instructions.
  - React Flow built-in instructions do not describe dragging, deletion, or
    other disabled behavior.
- Validation:
  unit tests for English/Japanese labels, interpolation, fallback, announcement
  deduplication, politeness, excluded events, spatial direction announcements
  without false relationship wording, independent relationship-focus
  announcements, the exact spatial flow key map, distinct inline expansion and
  N/RC scope entry/return wording, normal Tab traversal, and absence of
  relationship-based arrow, child-array traversal, and rejected key
  instructions; header,
  node display, search, and detail regressions; `rtk pnpm test`;
  `rtk pnpm run test:web`; `rtk pnpm run qlty` with no new smell findings.
- Production Readiness:
  - Failure mode: missing localization keys fall back to English and never
    announce raw identifiers or stale key mappings as instructions.
  - JP1/AJS compatibility: unit names and existing relationship terms are
    presented but not reinterpreted.
  - Large or malformed input risk: announcements describe the active event and
    do not serialize full lists or graphs.
  - Desktop/web impact: live regions and React Flow configuration are verified
    in desktop and web runs without host messaging changes.
  - README/docs impact: document language-aware accessibility behavior only
    where useful to users.
  - CHANGELOG impact: required for screen-reader and localized workflow changes.
- Approval Boundary: presentation/resource labels, live-region mechanics,
  React Flow accessibility configuration, and tests/docs. No telemetry or host
  protocol changes.
- Dependencies: Slices 1 through 5.
- Risks: MUI Alert/Snackbar and React Flow live regions can cause duplicate or
  overly assertive announcements; translated strings may omit needed context
  or retain instructions for the superseded key map.
- Out of Scope: announcing hover/layout, adding telemetry, changing extension
  localization infrastructure, and extension-wide translation cleanup.

### Slice 7: Non-Color State, High Contrast, And Compatibility Validation

- Status: Approved
- Scope: make focus, selection, search result, relationship, and scope state
  distinguishable without color alone using VS Code theme variables,
  high-contrast body classes, borders, outlines, text, or icons. Complete the
  desktop/web, NVDA, VoiceOver, high-contrast, large-definition, README, and
  CHANGELOG acceptance matrix.
- User / Domain Value: users can distinguish and complete both viewer workflows
  in high-contrast and non-visual environments across supported hosts.
- Cohesive Change Group:
  `ajsTable/VirtualizedTable.tsx`, `ajsTable/TableHeader.tsx`,
  `ajsFlow/nodes/nodeSxProps.ts`, `shared/UnitTreeSelector.tsx`,
  `shared/SharedUnitDetailPane.tsx`, viewer theme composition where necessary,
  focused style-state tests, `README.md`, `CHANGELOG.md`, and the manual
  validation record in this `TASKS.md`.
- Acceptance:
  - Focus and selection use distinct cues; search, relationship, and current
    scope have a non-color cue.
  - Styling follows VS Code theme variables and remains perceivable in light,
    dark, and high-contrast themes.
  - Windows desktop with NVDA, macOS desktop with VoiceOver, VS Code Web in a
    Chromium browser, Windows high contrast, and a large or deeply nested
    definition complete the search/select/traverse/detail/return workflow,
    including spatial flow Left/Right/Down/Up, inline Shift+Down/Up, Enter into
    N and RC scopes, Escape back to their containing scopes, root/empty no-op,
    normal Tab exit, and `H`, `D`, `R`, and `L` with editable-control
    exclusions.
  - Full desktop and web tests, production build, qlty, README, and CHANGELOG
    evidence are complete.
- Validation:
  focused style resolver/component tests; `rtk pnpm test`;
  `rtk pnpm run test:web`; `rtk pnpm run build`; `rtk pnpm run qlty` with no
  new smell findings; manual matrix records the full shortcut round trips,
  flow modifier separation, N/RC scope round trips, normal Tab and text entry,
  nested native controls, screen-reader interaction, and responsive spatial
  movement on a large rendered graph before completion.
- Production Readiness:
  - Failure mode: unsupported theme variables fall back to visible borders,
    text, or icons rather than transparent state.
  - JP1/AJS compatibility: no definition or command behavior changes; exercise
    representative large and nested definitions.
  - Large or malformed input risk: confirm focus and announcement performance
    on a large valid definition; existing parse errors remain unchanged.
  - Desktop/web impact: this slice owns final parity evidence for both entry
    points and supported desktop platforms.
  - README/docs impact: required; consolidate the final discoverable keyboard
    model and validation-relevant limitations.
  - CHANGELOG impact: required under the user-visible behavior criteria.
- Approval Boundary: non-color/high-contrast presentation, its focused tests,
  required docs, and integrated validation only. A failure in prior behavior
  returns to its owning incomplete slice; a changed design or approval boundary
  requires Replanning Mode.
- Dependencies: Slices 1 through 6.
- Risks: automated DOM/style assertions cannot prove screen-reader usability;
  platform evidence requires access to Windows/NVDA and macOS/VoiceOver;
  high-contrast colors may differ across user themes.
- Out of Scope: fixing prior-slice behavior under this approval, extension-wide
  WCAG certification, unrelated visual redesign, dependency upgrades, and
  fixes outside the two viewers.

## Traceability

- TRACEABILITY.md required: yes
- Reason: the feature changes two user-visible use cases, spans seven dependent
  slices, and requires explicit automated and manual validation mapping.

## Cross-Slice Dependencies

- Slice 1 establishes current-cell identity consumed by Slice 2 and the state
  announcer in Slice 6.
- Slice 3 establishes graph-node focus, spatial-arrow events, N inline
  expansion, and N/RC scope-entry/return events consumed by Slices 5 and 6.
- Slice 4 establishes shared tree semantics consumed by the flow-specific
  continuity work in Slice 5.
- Shared detail-pane changes in Slices 2 and 5 must preserve both viewers; the
  later slice extends the reviewed contract rather than replacing it.
- Slices 2 and 5 establish the viewer-owned shortcut event guards consumed by
  Slice 7's cross-platform and assistive-technology validation.
- Slice 6 must avoid duplicate announcements from MUI and React Flow.
- Slice 7 validates the integrated state model but does not own fixes for
  earlier behavior. Changed design or approval boundaries require Replanning
  Mode.

## Feature-Level Risks

- Virtualization or graph rerendering may remove the DOM focus target.
- React Flow built-in keyboard behavior may conflict with read-only spatial and
  scope navigation.
- Asynchronous N/RC scope changes may focus a stale source graph unless Enter
  and Escape restoration waits for the destination graph identity.
- A shared component change can regress the other viewer.
- Screen-reader output and high-contrast perception cannot be proven by unit
  tests alone.
- Required Windows/NVDA and macOS/VoiceOver evidence may need coordinated human
  validation before Feature Exit.
- Single-character shortcuts can conflict with screen-reader quick navigation,
  speech input, editable fields, or nested native controls if their owning
  focus region and event exclusions are too broad.

## Implementation Feedback

- Slice 1's boundary was appropriate. The only hidden interaction dependency
  was the existing jump links nested inside data cells; the single-grid-Tab-stop
  contract required keeping them out of the Tab sequence and activating the
  current cell's jump action with Enter.
- Future composite-widget planning should inspect nested interactive descendants
  explicitly when replacing row-level Tab stops. This is useful feature
  planning feedback but does not establish a repository-wide architecture
  policy, so no additional durable document was changed.
- The initial implementation revealed a missing planning investigation:
  virtualized roving-focus work should identify which state must participate in
  React rendering and which focus transitions can remain DOM-local. Treating
  focus identity as component state caused every mounted cell to render on each
  key press, while reusing the existing reveal scroll caused a second smooth
  scroll after row selection. This remains feature-planning feedback rather
  than a durable architecture rule.
- Horizontal reveal in a grid with a sticky first column must use the sticky
  column's right edge as the effective visible boundary. Browser
  `scrollIntoView` considers a cell visible even while that cell is occluded by
  the sticky column.
- Slice 2 confirmed that row selection equality cannot be used as a focus
  restoration signal: selecting the current search result again leaves the
  selected path unchanged. Workflow focus therefore needs an explicit request
  separate from selection state. This is feature-specific planning feedback,
  not a new repository-wide architecture rule.
- Slice 2 verification exposed that normal Tab reachability alone does not
  provide a direct keyboard path to reopen and enter the current selection's
  closed detail pane. The Notion candidate had proposed `H`, `D`, `R`, and `L`,
  but the initial feature plan explicitly excluded them. Replanning adds those
  shortcuts with strict event ownership and editable-control exclusions while
  retaining normal Tab and Shift+Tab traversal.
- Slice 2 confirmed that the shared detail pane can expose an opt-in
  focus-request and return-focus contract. The list viewer enables that
  contract now, while the flow viewer remains unchanged until Slice 5. This
  preserves the approved cross-slice boundary and does not require a new
  durable architecture rule.
- An earlier human follow-up moved shared-predecessor traversal away from
  Tab/Shift+Tab and onto Down/Up, while expansion moved to
  Shift+Down/Shift+Up. The later spatial-navigation decision superseded the
  predecessor target rule; the later scope-navigation correction also
  supersedes selection-only Enter-child and Escape-parent behavior. Normal Tab
  and modified inline expansion remain.
- Plan review found that the graph-node restoration fallback was referenced but
  not defined, and that Slice 6's localized React Flow instructions necessarily
  change with the revised key map. Replanning defines the shared graph-region
  entry fallback and returns Slice 6 to renewed review and approval without
  changing slice count or order.
- Slice 3 confirmed that React Flow v12 exposes focusable node wrappers but no
  graph-level node-keydown callback. Exact-target capture on the graph region
  preserves nested native controls while allowing the viewer to suppress
  React Flow's mutation-oriented keyboard defaults. This is implementation
  guidance for the remaining flow slices, not a repository-wide architecture
  rule.
- Slice 3 also confirmed that keyboard expansion needs a one-shot
  viewport-preservation request distinct from ordinary explicit expansion.
  Selection can rerender before expanded graph geometry is ready, so stable-ID
  focus restoration must wait for the requested expanded state rather than
  the first changed node-array reference.
- Slice 3 independent review found that relationship focus cannot use that
  expansion-specific rerender signal: selecting an already-selected target
  does not rerender. Relationship movement therefore focuses the existing
  target wrapper immediately, while expansion alone waits for graph geometry.
  The same review found that visual node decoration must not rebuild the
  relationship maps; a topology comparison now reuses the index across
  selection and hover updates.
- Slice 3 interaction verification invalidated the relationship-arrow design:
  visible direction was more important than predecessor/successor meaning for
  unmodified arrows. Replanning replaces only the arrow resolver and its
  downstream instructions and validation; expansion, focus restoration, and
  read-only interaction remain in the slice.
- Revised-plan review found that requested-axis distance could choose a remote
  diagonal node and that geometry readiness, no-target default suppression,
  spatial announcement wording, and large-graph evidence were underspecified.
  The human confirmed center-to-center Euclidean ranking with upper/left ties;
  the revised plan now makes those remaining contracts explicit.
- Slice 3 implementation confirmed that React Flow can expose incomplete or
  non-positive measured dimensions while initial fixed dimensions are already
  available. Spatial focus geometry therefore accepts only positive measured
  values and otherwise falls back dimension-by-dimension to the initial size.
  This is feature-specific integration guidance rather than a repository-wide
  architecture rule.
- Slice 3 interaction verification also exposed that selected-unit identity
  must not participate in base graph construction. Doing so rebuilt every
  node and edge for each keyboard move and caused visible flicker. Selection
  is now a render decoration that preserves unrelated node identities, and
  selection-only updates are synchronized through the React Flow instance
  instead of replacing the controlled node array. Future React Flow
  interaction slices should investigate base-data dependencies separately
  from transient visual state.
- Slice 3 interaction verification exposed a specification ambiguity in
  "Enter moves to the first child." The intended JP1/AJS operation is to open
  an N or RC unit's internal flow as the active scope, not to select the first
  child preserved from parser/render order. Future hierarchy-key planning must
  identify whether "enter" means focus traversal, inline expansion, or scope
  transition and must name the post-rerender focus destination explicitly.
- Slice 3 implementation confirmed that scope return must carry active-scope
  identity separately from the DOM-focused node; otherwise Escape can return
  to the focused node's parent instead of the containing flow scope. This was
  already captured by the revised scope-navigation plan and requires no new
  durable architecture rule.
- Slice 4 implementation confirmed that tree navigation must flatten only
  expanded branches while retaining disabled rows for rendering. Navigation
  filters disabled rows, whereas expand and scope buttons remain native
  controls outside row-owned key handling. This is feature-specific interaction
  guidance and does not require a durable repository-wide rule.
- Slice 4 follow-up confirmed that roving-focus identity is transient DOM
  state. Keeping it in React state rerenders every visible tree row on each
  arrow key, so the active row ref and previous/next `tabIndex` updates remain
  local to the shared selector. This is feature-specific performance guidance.
- Slice 4 regression follow-up confirmed that a ref-only focus request must
  focus an already-rendered destination immediately; otherwise no render
  occurs to run a deferred focus effect. Because nested `treeitem` focus events
  bubble, only exact-target focus may update the active-row identity, and row
  scrolling/styling must target the row frame rather than the parent treeitem's
  full subtree. This remains feature-specific interaction guidance.
- Slice 5 implementation confirmed that detail and selector return focus need
  one saved graph-node identity independent of selection state. Graph scope
  changes and missing rendered targets must resolve focus after the destination
  scope is ready, with the graph-region entry as the no-false-selection
  fallback. The shared detail-pane focus-request contract is sufficient for
  flow details as well as list details; no durable architecture change is
  needed.
- Slice 5 follow-up confirmed that an opt-in detail focus request must be
  acknowledged and cleared after the heading receives focus. Leaving the
  revision active causes a later collapse click to be interpreted as another
  expand request. The flow viewer now uses the shared one-shot acknowledgment
  contract already used by the list viewer; no durable architecture change is
  needed.

## Assumptions And Compatibility

- `package.json` `engines.vscode` remains `^1.75.0`.
- `@xyflow/react` stays on the existing dependency line; no upgrade is planned.
- Existing rendered React Flow nodes provide sufficient unit identity,
  hierarchy, final coordinates, and dimensions. If implementation disproves
  this, stop and replan before changing DTOs or outer layers.
- Existing flow construction already accepts N and RC as active scopes.
  Keyboard scope entry reuses that eligibility and requires internal units;
  Escape resolves the nearest containing N or RC from existing hierarchy data.
- Before any implementation slice starts, create or switch to a dedicated
  non-doc feature branch. The current `main` branch is not an implementation
  branch.
- No JP1/AJS command or definition/configuration reference changes.
- No undocumented JP1/AJS behavior is inferred.
- Desktop and web viewers consume the same browser-safe presentation behavior.
- Each code slice treats actionable new qlty smells as work to resolve or an
  approved follow-up. Metrics-only movement is a review signal and does not
  authorize unrelated refactoring.

## Use-Case Back-Propagation

- `uc-view-unit-list.md` already owns the durable grid navigation and focus
  continuity outcome. Update it only if implementation review changes that
  contract.
- `uc-explore-flow-graph.md` now owns spatial arrow navigation, distinct N
  inline expansion, N/RC scope entry and containing-scope return, semantic
  state, and focus restoration.
- README and CHANGELOG changes travel with the user-visible slices and are
  finalized in Slice 7.
- No architecture, domain-rule, telemetry, or roadmap change is currently
  required. Re-evaluate during final integrated review and Feature Exit.

## Feature Exit

- Definition of Done status: not started
- Durable documentation updates: owning use cases updated during intake;
  README and CHANGELOG planned in implementation slices.
- Open risks: all feature-level risks remain open.
