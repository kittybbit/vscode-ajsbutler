# Feature Tasks: Accessible List And Flow Graph Exploration

## Agent Brief

- Purpose: make unit-list and flow-graph exploration practical through
  keyboard, assistive-technology, and high-contrast paths.
- Approved or active slice: Slices 1 and 2 are complete; the revised plan is
  approved, and Slice 3 is the next approved implementation slice.
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
- Next decision: implement Slice 3 with `sdd-implement-task`.

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
- Review status: reviewed; verdict Ready for approval
- Human approval: Approved
- Active implementation slice: Slice 3, Flow Relationship Navigation

## Human Approval

- Status: Approved
- Approved at: 2026-07-30 in the current conversation
- Approved scope: the reviewed seven-slice plan in the recorded implementation
  order, including each slice's tests, documentation, validation, production
  readiness work, approval boundary, dependencies, risks, and out-of-scope
  constraints.
- Replanning gap: the approved plan intentionally excluded the Notion
  candidate's single-character `H`, `D`, `R`, and `L` shortcuts. During Slice
  2 verification, the user confirmed that a closed detail pane had no direct
  keyboard reopening path and requested that the candidate shortcuts be
  reflected in the slices.
- Flow-map refinement: the user then moved the candidate's Tab/Shift+Tab
  traversal to Down/Up and its Down/Up expansion behavior to
  Shift+Down/Shift+Up, retaining normal Tab traversal.
- Approval retained: completed Slice 1 and unchanged Slice 4.
- Renewed approval granted: revised Slices 2, 3, 5, and 6 plus Slice 7's
  expanded integrated validation. Slice 6 explicitly owns localized
  instructions for the revised flow key map.

Implementation may proceed only inside the approved slice boundaries and only
after switching from `main` to a dedicated non-doc feature branch.

## Implementation Order

1. Unit-list data-grid navigation
2. Unit-list workflow focus continuity
3. Flow relationship navigation
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
- Revised flow map: Tab and Shift+Tab keep normal Webview focus traversal. The
  candidate's Tab/Shift+Tab next/previous shared-predecessor behavior moves to
  Down/Up, with sibling fallback. The candidate's Down/Up expand/collapse
  behavior moves to Shift+Down/Shift+Up. Enter moves to the first child and
  Escape returns to the parent.
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

### Slice 3: Flow Relationship Navigation

- Status: Approved
- Scope: add a presentation-local pure relationship target resolver and connect
  it to keyboard-focused React Flow nodes. Left/Right traverse
  predecessor/successor. Down/Up traverse the next/previous node sharing the
  deterministic primary predecessor with sibling fallback.
  Shift+Down/Shift+Up expand/collapse the current nested jobnet, Enter moves to
  the first child, and Escape returns to the parent. Valid movement updates
  selection and DOM focus and reveals the target without conflating DOM focus
  with viewport fitting. Disable read-only node dragging and edge Tab stops and
  align node wrapper semantics with the actual interaction.
- User / Domain Value: a keyboard-only or non-visual user can follow the
  business relationships represented by the graph rather than its pixel
  layout.
- Cohesive Change Group:
  new `ajsFlow/flowKeyboardNavigation.ts`,
  `ajsFlow/FlowContents.tsx`, `ajsFlow/flowGraphView.ts`,
  `ajsFlow/useFlowViewerController.ts`,
  `ajsFlow/useFlowViewerEffects.ts`, `ajsFlow/nodes/AjsNode.tsx`, nested-toggle
  utilities and flow node components, existing flow relationship, expansion,
  and viewport tests, and a focused flow-keyboard-navigation test.
- Acceptance:
  - Relation resolution uses existing rendered nodes, edges, hierarchy, and
    deterministic rendered order without changing graph meaning.
  - When a node has multiple predecessors, the first predecessor in
    deterministic rendered order is the primary predecessor used to form its
    Down/Up traversal group.
  - Left and Right select and focus the deterministic predecessor or successor.
  - Down and Up select and focus the next or previous node sharing the
    deterministic primary predecessor, falling back to the next or previous
    sibling when no such candidate exists.
  - Shift+Down expands the current nested jobnet and Shift+Up collapses it
    without applying Down/Up traversal. Existing explicit expansion controls
    remain available.
  - After a successful expansion or collapse rerenders React Flow, the current
    node remains selected and regains DOM focus by stable unit ID without
    changing scope or zoom. If it is no longer rendered, focus moves to the
    graph region's single entry target without changing node selection, graph
    scope, zoom, or viewport position.
  - Enter selects and focuses the first rendered child; Escape selects and
    focuses the parent. Missing child, parent, group, sibling, or expansion
    target leaves selection, focus, and viewport unchanged.
  - A valid target becomes selected, receives DOM focus, and is scrolled or
    centered into view.
  - Relationship keys run only for key events owned by the node wrapper.
    Nested interactive controls retain native keys and do not traverse.
  - A missing relation leaves selection, focus, and viewport unchanged.
  - Tab and Shift+Tab are not repurposed for relationship navigation.
  - Node wrappers expose meaningful semantics; read-only nodes cannot be moved
    with React Flow's default keyboard behavior and edges are not Tab stops.
- Validation:
  pure tests for predecessor/successor, shared-primary-predecessor ordering,
  sibling fallback, inverse Down/Up movement, Enter-child, Escape-parent,
  Shift+Down/Up expansion, multiple targets, cycles, collapsed or absent
  targets, Tab non-capture, modifier separation, and descendant-control event
  exclusion; flow node display, nested expansion, post-rerender stable-ID focus
  restoration, graph-region entry fallback with unchanged selection,
  zoom/scope/viewport, and viewport-focus regression tests; `rtk pnpm test`;
  `rtk pnpm run test:web`;
  `rtk pnpm run qlty` with no new smells.
- Production Readiness:
  - Failure mode: stale navigation/expansion targets produce no movement and
    preserve the current node and expansion state. A node unavailable after a
    successful rerender focuses the graph region's entry target without false
    selection, scope change, zoom reset, or viewport movement.
  - JP1/AJS compatibility: existing predecessor, successor, parent, and child
    projections are consumed without reinterpretation.
  - Large or malformed input risk: build bounded relationship, primary
    predecessor, sibling, and hierarchy lookup maps when graph inputs change
    rather than scanning the graph on every keydown.
  - Desktop/web impact: React Flow and browser APIs only; verify the same
    behavior in desktop and web bundles.
  - README/docs impact: document the accepted relationship keys.
  - CHANGELOG impact: required for new graph keyboard navigation.
- Approval Boundary: presentation-local relation resolution, node focus,
  viewport reveal, nested expand/collapse shortcuts, read-only React Flow
  keyboard configuration, and tests/docs. Selector/detail/announcement/theme
  work is excluded.
- Dependencies: none; implementation follows Slice 2 to finish one viewer
  journey before starting the other.
- Risks: React Flow's internal keyboard handlers may run before or after custom
  handlers; nested-panel bounds nodes must never become navigation targets;
  rendered order can change after expansion; Shift+Arrow handling must not
  trigger both traversal and expansion; successful expansion can temporarily
  unmount the current node before stable-ID focus restoration runs.
- Out of Scope: graph layout changes, relationship-focus semantics, new DTO
  fields, edge editing, node dragging, and Tab capture inside the graph.

### Slice 4: Shared Unit-Tree Keyboard Semantics

- Status: Approved
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
  tests, and relevant docs only. Flow scope transitions and detail focus remain
  in Slice 5.
- Dependencies: none; implementation follows Slice 3 to keep review order
  aligned with the flow journey.
- Risks: nested native buttons can complicate composite-widget focus;
  responsive collapse may remove the focused tree row.
- Out of Scope: changing hierarchy data, eligibility, automatic full-tree
  expansion, flow scope rules, or printable-character shortcuts.

### Slice 5: Flow Scope, Detail, And Shortcut Focus Continuity

- Status: Approved
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
- Validation:
  extend `flowSelector.test.ts`, `flowNodeDetailPanelCollapse.test.ts`, flow
  viewport-focus, stale-target, asynchronous scope readiness, and dialog
  default-restoration coverage with `D`, `L`, `R`, `Escape` precedence,
  uppercase and lowercase keys, modifier rejection, editable/nested-control
  exclusion, current-scope and first-eligible selector targets, and
  return-without-scope-change cases; missing saved-node restoration verifies
  the shared graph-region entry fallback with unchanged selection,
  scope/zoom/viewport; `rtk pnpm test`;
  `rtk pnpm run test:web`; `rtk pnpm run qlty` with no new smell findings.
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
- Dependencies: Slices 3 and 4.
- Risks: scope rerender timing may race focus; responsive panel collapse may
  occur while focused; the invoking dialog action may unmount; printable
  shortcuts may conflict with assistive technology, speech input, or text
  entry unless event ownership is exact.
- Out of Scope: changing scope eligibility, hierarchy semantics, graph layout,
  automatically expanding nested units, relationship navigation keys, or
  shortcuts beyond `D`, `L`, `R`, and the paired `Escape` behavior.

### Slice 6: Localized Semantic State And Announcements

- Status: Approved
- Scope: expose localized names, descriptions, state, and restrained status
  announcements for both viewers. Cover search results, selection, sort,
  relationship and scope changes, copy completion, and errors while excluding
  hover and layout chatter. Localize React Flow accessibility descriptions to
  match the revised read-only navigation model, including Left/Right,
  Down/Up, Shift+Down/Shift+Up, Enter/Escape, and normal Tab traversal.
- User / Domain Value: a screen-reader user can understand what changed and
  which unit or relationship is current in English or Japanese.
- Cohesive Change Group:
  a small shared presentation announcer only if both viewers need the same
  live-region mechanics, `unitInformationLocalization.ts`,
  `resource/i18n/message_en.ts`, `resource/i18n/message_ja.ts`,
  table header/search/grid semantics, flow contents/node/detail semantics,
  React Flow `ariaLabelConfig`, and focused localization/announcement tests.
- Acceptance:
  - Interactive cells, headers, nodes, selectors, detail regions, and controls
    have localized accessible names or descriptions.
  - User-initiated search, selection, sort, relationship, scope, copy, and
    error outcomes announce once with an appropriate polite or assertive level.
  - Hover, graph layout, camera motion, and redundant selection do not announce.
  - English fallback remains deterministic for unsupported locale values.
  - English and Japanese React Flow instructions describe the revised flow key
    map and do not retain the rejected Tab/Shift+Tab relationship traversal or
    unmodified Down/Up expand/collapse instructions.
  - React Flow built-in instructions do not describe dragging, deletion, or
    other disabled behavior.
- Validation:
  unit tests for English/Japanese labels, interpolation, fallback, announcement
  deduplication, politeness, excluded events, the exact revised flow key map,
  normal Tab traversal, and absence of the rejected key instructions; header,
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
    including flow Down/Up, Shift+Down/Up, Enter, Escape, normal Tab exit, and
    `H`, `D`, `R`, and `L` with editable-control exclusions.
  - Full desktop and web tests, production build, qlty, README, and CHANGELOG
    evidence are complete.
- Validation:
  focused style resolver/component tests; `rtk pnpm test`;
  `rtk pnpm run test:web`; `rtk pnpm run build`; `rtk pnpm run qlty` with no
  new smell findings; manual matrix records the full shortcut round trips,
  flow modifier separation, normal Tab and text entry, nested native controls,
  and screen-reader interaction before completion.
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
- Slice 3 establishes graph-node focus and relationship events consumed by
  Slice 5 and Slice 6.
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
- React Flow built-in keyboard behavior may conflict with read-only semantic
  relationship navigation.
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
- Human follow-up refined the flow candidate map without capturing Tab:
  next/previous shared-predecessor traversal moves from Tab/Shift+Tab to
  Down/Up, while expand/collapse moves from Down/Up to
  Shift+Down/Shift+Up. Enter-child and Escape-parent complete the parent/child
  relationship path in Slice 3.
- Plan review found that the graph-node restoration fallback was referenced but
  not defined, and that Slice 6's localized React Flow instructions necessarily
  change with the revised key map. Replanning defines the shared graph-region
  entry fallback and returns Slice 6 to renewed review and approval without
  changing slice count or order.

## Assumptions And Compatibility

- `package.json` `engines.vscode` remains `^1.75.0`.
- `@xyflow/react` stays on the existing dependency line; no upgrade is planned.
- Existing DTOs provide sufficient unit identity, hierarchy, and relationships.
  If implementation disproves this, stop and replan before changing DTOs or
  outer layers.
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
- `uc-explore-flow-graph.md` already owns relationship navigation, semantic
  state, and focus restoration. Update it only if implementation review changes
  that contract.
- README and CHANGELOG changes travel with the user-visible slices and are
  finalized in Slice 7.
- No architecture, domain-rule, telemetry, or roadmap change is currently
  required. Re-evaluate during final integrated review and Feature Exit.

## Feature Exit

- Definition of Done status: not started
- Durable documentation updates: owning use cases updated during intake;
  README and CHANGELOG planned in implementation slices.
- Open risks: all feature-level risks remain open.
