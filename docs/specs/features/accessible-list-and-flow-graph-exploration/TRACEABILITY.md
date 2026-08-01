# Traceability: Accessible List And Flow Graph Exploration

The revised seven-slice plan maps only to durable use-case files and scenario
names that exist in those files.

## Slice 1: Unit-List Data-Grid Navigation

- Use Case:
  `uc-view-unit-list.md` — `Keyboard-only exploration preserves list context`
- Requirement: `ACC-VIEW-001`, `ACC-VIEW-007`, `ACC-VIEW-008`
- `SPECS.md`: Requirements; Interaction Model Decisions; Acceptance Criteria
- Implementation Slice: Slice 1, Unit-List Data-Grid Navigation
- Tests: `tableNavigation.test.ts`, `ajsTableHeader.test.ts`
- Validation result (2026-07-30): focused tests passed; `rtk pnpm test`,
  `rtk pnpm run test:web`, and `rtk pnpm run qlty` passed. Pure tests cover
  virtualized logical targeting and large-list boundaries; React/Virtuoso DOM
  focus integration received final-diff review because the repository has no
  Webview DOM test harness. The same desktop/web suites passed again after
  removing focus-only rerenders and redundant selection scrolling. A focused
  regression test verifies that horizontal reveal compensates for the sticky
  index column's occluded area. Human interaction verification was approved on
  2026-07-30.

## Slice 2: Unit-List Workflow Focus And Shortcut Continuity

- Use Case:
  `uc-view-unit-list.md` — `Keyboard-only exploration preserves list context`
- Requirement: `ACC-VIEW-002`, `ACC-VIEW-007`, `ACC-VIEW-008`
- `SPECS.md`: Requirements; Behavioral Scenarios; Acceptance Criteria
- Implementation Slice: Slice 2, Unit-List Workflow Focus And Shortcut
  Continuity
- Tests: `tableNavigation.test.ts`,
  `showUnitDefinitionInteraction.test.ts`, `ajsTableHeader.test.ts`
- Revised validation plan: `H` header round trip, `D` detail reopen/entry, `R`
  return without close, `Escape` dialog/pane precedence, uppercase/lowercase
  handling, modifier rejection, editable/nested-control exclusion, stable
  target and fallback behavior, desktop, and Web tests.
- Validation result (2026-07-30): focused stable-path, same-path search,
  hidden-column, stale-target, empty-target, dialog default-restoration,
  uppercase/lowercase shortcut, modifier-rejection, nested-control-exclusion,
  and non-sortable-header tests passed. `rtk pnpm test`,
  `rtk pnpm run test:web`, and `rtk pnpm run qlty` passed. After an independent
  review fix ensured that `Escape` works from a nested detail action, the
  focused desktop tests and full Web suite passed again. React/Virtuoso focus
  integration received final-diff review because the repository has no Webview
  DOM test harness. Human interaction verification and slice completion were
  approved on 2026-07-30.

## Slice 3: Flow Spatial And Scope Navigation

- Use Case:
  `uc-explore-flow-graph.md` —
  `Keyboard navigation follows rendered spatial direction`;
  `Keyboard navigation enters an internal flow scope`;
  `Keyboard navigation returns to a containing flow scope`
- Requirement: `ACC-VIEW-003`, `ACC-VIEW-007`, `ACC-VIEW-008`
- `SPECS.md`: Requirements; Interaction Model Decisions; Behavioral Scenarios
- Implementation Slice: Slice 3, Flow Spatial And Scope Navigation
- Tests: `flowKeyboardNavigation.test.ts`, `flowViewportFocus.test.ts`,
  `flowNodeDisplay.test.ts`, `flowGraphView.test.ts`
- Revised validation plan: pure four-direction center-coordinate targeting,
  strict boundaries, nearest center-to-center Euclidean distance,
  upper/left/stable-order ties, edge-independence, measured/initial dimensions,
  expanded-layout positions, geometry-cache invalidation, excluded bounds
  nodes, 10,000-node scan, no-target default and propagation suppression,
  same-scope Shift+Down/Up expansion/collapse, Enter on N and RC scopes, empty
  and ineligible Enter no-op, Escape from nested N and RC scopes, root Escape
  no-op, nearest containing flow-scope resolution, explicit open-scope
  eligibility/reset consistency, modifier and descendant-event boundaries;
  asynchronous destination readiness, entered-scope root focus,
  returned-container focus, missing-node graph-entry fallback, flow node
  display, nested expansion, viewport, desktop, and Web tests.
- Prior validation result (2026-07-30): superseded relationship-arrow resolver
  tests passed, but interaction verification invalidated that target-selection
  design. Focus restoration, read-only node/edge behavior, nested expansion,
  viewport preservation, event ownership, and normal Tab evidence remain
  reusable subject to revised-plan review.
- Partially reusable validation result (2026-07-31): focused four-direction,
  center-to-center distance, upper/left/rendered-order tie, measured/initial
  dimension, invalid-geometry, geometry-cache, 10,000-node, no-target
  suppression, modifier, wrapper-ownership, nested-expansion,
  graph-entry-fallback, read-only node/edge, same-selected-target, and
  viewport-preservation tests passed. `rtk pnpm test`,
  `rtk pnpm run test:web`, and `rtk pnpm run qlty` passed. Independent
  final-diff review found no actionable issue. React Flow DOM event ordering,
  visual direction, and perceived large-graph responsiveness remain the human
  interaction completion gate. The passing Enter-child/Escape-parent tests are
  superseded and are not evidence for the corrected scope behavior.
- Flicker follow-up (2026-07-31): selection was removed from base expanded-graph
  construction so selection-only movement does not recreate every node and
  edge. `flowGraphView.test.ts` verifies that selection decoration changes only
  the selected node while unrelated node identities remain stable. The flow
  graph panel is memoized and selection-only updates synchronize only the
  previous and next React Flow nodes through the instance API, so arrow-key
  movement does not replace the controlled node array. Full desktop tests, Web
  tests, qlty, Markdown lint, and diff checks passed after the follow-up.
  Corrected Enter/Escape behavior intentionally changes graph scope and must
  instead verify one destination render without repeated intermediate flashes.
- Replanning gap (2026-07-31): the implementation interpreted "enter the first
  child" as selection-only traversal using child-array order. The corrected
  contract opens a focused N or RC unit with internal units as the active flow
  scope and returns with Escape to its nearest containing N or RC scope. Slice
  3 and affected downstream Slices 5 through 7 require review and renewed
  approval before implementation resumes. Slice 3 has since received renewed
  human approval; revised downstream Slices 5 through 7 remain pending.
- Current implementation validation (2026-07-31): `flowKeyboardNavigation.test.ts`
  covers N/RC entry, active-scope-based containing-scope return, empty and
  ineligible no-op behavior, root Escape, async destination readiness, stale
  transition cancellation, and graph-entry fallback. Focused TypeScript tests,
  `rtk pnpm test`, `rtk pnpm run test:web`, `rtk pnpm run qlty`, Markdown lint,
  and diff checks passed. Manual React Flow interaction verification was
  completed, and human slice-completion approval was received on 2026-08-01.

## Slice 4: Shared Unit-Tree Keyboard Semantics

- Use Case:
  `uc-view-unit-list.md` — `Keyboard-only exploration preserves list context`;
  `uc-explore-flow-graph.md` —
  `Graph and flow tree synchronize interaction`
- Requirement: `ACC-VIEW-001`, `ACC-VIEW-003`, `ACC-VIEW-007`,
  `ACC-VIEW-008`
- `SPECS.md`: Requirements; Interaction Model Decisions; Acceptance Criteria
- Validation: `unitTreeSelector.test.ts`, list and flow consumer regressions,
  disabled/nested-action/collapse cases, desktop tests, and Web tests
- Current implementation validation (2026-08-01): `unitTreeNavigation.ts`
  covers visible-row flattening, disabled-row skipping, Up/Down/Home/End
  boundaries, Right expand-or-enter, Left collapse-or-parent, Enter/Space
  selection, and modifier separation. The shared selector now exposes
  tree/treeitem semantics with roving row focus and keeps nested action buttons
  outside row key handling. `rtk pnpm test`, `rtk pnpm run test:web`,
  `rtk pnpm run qlty`, Markdown lint, and diff checks passed. DOM-level
  assistive-technology verification remains the human completion gate. The
  follow-up focus regression keeps active-row identity in a ref and updates
  only the previous/next row DOM state while focusing the rendered destination
  immediately, avoiding a React rerender or deferred-render wait for arrow
  movement. Nested treeitem focus bubbling cannot overwrite the active child,
  and row scrolling is limited to the visible row frame.

## Slice 5: Flow Scope, Detail, And Shortcut Focus Continuity

- Use Case:
  `uc-explore-flow-graph.md` — `Flow-tree selection preserves zoom`;
  `Supporting panels collapse without losing state`
- Requirement: `ACC-VIEW-003`, `ACC-VIEW-005`, `ACC-VIEW-007`,
  `ACC-VIEW-008`
- `SPECS.md`: Requirements; Behavioral Scenarios; Acceptance Criteria
- Validation: `flowSelector.test.ts`,
  `flowNodeDetailPanelCollapse.test.ts`, viewport, dialog
  default-restoration, stale-target, asynchronous scope, `D`/`L`/`R`/Escape
  event-boundary and round-trip behavior, current/fallback selector targets,
  missing saved-node focus on the shared graph-region entry target with
  unchanged selection/zoom/scope/viewport, entry from nested N and RC scopes,
  graph-node Escape ownership remaining in Slice 3, desktop, and Web tests
- Implementation Slice: Slice 5, Flow Scope, Detail, And Shortcut Focus
  Continuity
- Tests: `flowSelector.test.ts`, `flowViewerShortcuts.test.ts`,
  `flowViewportFocus.test.ts`, existing `flowKeyboardNavigation.test.ts`,
  `showUnitDefinitionInteraction.test.ts`
- Current implementation validation (2026-08-01): unmodified D/L shortcut
  boundaries, current/fallback selector targets, graph focus request waiting,
  rendered-target focus, and graph-entry fallback are covered by focused tests.
  The flow detail pane now acknowledges each one-shot focus request so a later
  collapse action remains collapsed. `rtk pnpm test`, `rtk pnpm run test:web`,
  `rtk pnpm run qlty`, and TypeScript compilation passed. DOM-level
  detail/selector round trips and assistive-technology focus order were
  reviewed manually, and Slice 5 completion was approved on 2026-08-01.

## Slice 6: Localized Semantic State And Announcements

- Use Case:
  `uc-view-unit-list.md` — Rules for semantic table state;
  `uc-explore-flow-graph.md` — Rules for semantic graph state
- Requirement: `ACC-VIEW-004`, `ACC-VIEW-006`, `ACC-VIEW-007`,
  `ACC-VIEW-008`
- `SPECS.md`: Requirements; Compatibility; Acceptance Criteria
- Implementation Slice: Slice 6, Localized Semantic State And Announcements
- Tests: localization and announcement tests, node-display regressions, and
  React Flow accessibility-description tests
- Revised validation plan: English/Japanese labels, fallback, live-region
  deduplication, politeness, excluded events, spatial movement without false
  predecessor/successor wording, independent relationship-focus wording, exact
  spatial Left/Right/Down/Up, inline Shift+Down/Shift+Up, Enter N/RC scope
  entry, Escape containing-scope return, and normal-Tab instructions;
  rejection of relationship-based arrows, selection-only child/parent,
  superseded Tab-relationship, and unmodified-arrow expansion descriptions;
  desktop and Web tests
- Current implementation validation (2026-08-01): focused localization,
  interpolation, live-region deduplication/politeness, and React Flow
  accessibility-description tests passed. Table and flow labels, detail state,
  search/sort/selection/copy announcements, spatial direction wording, and
  revised keyboard instructions are wired through the shared browser-safe
  presentation path. `rtk pnpm test`, `rtk pnpm run test:web`,
  `rtk pnpm run qlty:check`, TypeScript compilation, and diff checks passed.
  The repository has no Webview DOM test harness; live-region timing,
  duplicate output from assistive technology, and English/Japanese screen
  reader pronunciation remain the Slice 7 manual completion gate. A follow-up
  performance fix caches localized message maps and reuses the live-region DOM
  node so vertical row movement does not repeat full resource copies. A flow
  tree interaction follow-up also keeps Arrow/Home/End navigation available
  when focus is on a nested disclosure or scope action button, while preserving
  native Enter/Space activation; localized selector labels are now forwarded
  through the flow consumer. The same ownership rule is now applied to table
  jump links and React Flow node actions for movement keys only, with focused
  pure ownership tests and unchanged native activation behavior. Human
  slice-completion approval was received on 2026-08-01; live-region timing,
  screen-reader output, high contrast, and large-definition checks remain
  Slice 7's final cross-platform gate.

## Slice 7: Non-Color State, High Contrast, And Compatibility Validation

- Use Case:
  `uc-view-unit-list.md` — Acceptance Notes for keyboard and high contrast;
  `uc-explore-flow-graph.md` — Acceptance Notes for keyboard and high contrast
- Requirement: `ACC-VIEW-005`, `ACC-VIEW-007`, `ACC-VIEW-008`
- `SPECS.md`: Requirements; Behavioral Scenarios; Compatibility;
  Acceptance Criteria
- Validation: focused style-state tests, desktop and Web suites, production
  build, Windows/NVDA, macOS/VoiceOver, Windows high contrast, and
  large-definition manual checks, including spatial flow Left/Right/Down/Up,
  inline Shift+Down/Shift+Up, Enter into N and RC scopes, Escape to containing
  scopes, root/empty no-op, normal Tab exit,
  `H`/`D`/`R`/`L` round trips, editable/native-control exclusions, and
  responsive movement on a large rendered graph
- Current implementation validation (2026-08-01): focused node, tree, grid,
  and shared theme style tests passed. `rtk pnpm test`,
  `rtk pnpm run test:web`, `rtk pnpm run build`, `rtk pnpm run qlty`, and
  `rtk pnpm run test:compile` passed. The production build initially exposed
  two existing FlowContents type/wiring gaps; minimal behavior-preserving
  fixes restored the approved build gate. Windows/NVDA, macOS/VoiceOver,
  Windows high-contrast, and large-definition manual evidence remains the
  human completion gate because those platform combinations are unavailable in
  this environment.
  Integrated search validation also confirmed that stable reset callbacks in
  the table and flow search hooks preserve submitted queries across normal
  state updates, restoring list match cues and flow-node search highlighting.

## Slice 8: Shared Tree Composite Focus Semantics And Action Targets

- Use Case:
  `uc-view-unit-list.md` — `Keyboard-only exploration preserves list context`;
  `uc-explore-flow-graph.md` — `Graph and flow tree synchronize interaction`
- Requirement: `ACC-VIEW-003`, `ACC-VIEW-005`, `ACC-VIEW-006`,
  `ACC-VIEW-007`, `ACC-VIEW-008`
- `SPECS.md`: Interaction Model Decisions; Acceptance Criteria
- Implementation Slice: Slice 8, Shared Tree Composite Focus Semantics And
  Action Targets
- Tests/validation: `unitTreeNavigation.test.ts`, `unitTreeSelector.test.ts`,
  list/flow consumer regressions, DOM Tab/order and collapse cases in Slice 10,
  desktop/Web suites, qlty, and 28x28 target-size checks
- Status: Complete; human completion approval recorded in TASKS.md
- Current validation (2026-08-01): Alt+Enter eligibility/modifier boundaries,
  visible-row preservation, and 28px action sizing pass in
  `unitTreeSelector.test.ts`; `rtk pnpm test`, `rtk pnpm run test:web`,
  `rtk pnpm run test:compile`, and `rtk pnpm run qlty` pass. Browser DOM Tab
  order, native click activation, and hidden-descendant focus evidence remain
  Slice 10 validation.

## Slice 9: Flow Action Activation And Graph Keyboard-Entry Ownership

- Use Case:
  `uc-explore-flow-graph.md` — `Keyboard navigation follows rendered spatial
direction`; `Supporting panels collapse without losing state`
- Requirement: `ACC-VIEW-003`, `ACC-VIEW-005`, `ACC-VIEW-006`,
  `ACC-VIEW-007`, `ACC-VIEW-008`
- `SPECS.md`: Interaction Model Decisions; Behavioral Scenarios; Compatibility
- Implementation Slice: Slice 9, Flow Action Activation And Graph
  Keyboard-Entry Ownership
- Tests/validation: `flowKeyboardNavigation.test.ts`, `flowNodeDisplay.test.ts`,
  `flowViewportFocus.test.ts`, graph target-classification/entry helpers,
  Slice 10 DOM/axe cases, desktop/Web suites, build, TypeScript compilation,
  and qlty
- Status: Proposed; implementation pending reviewed-plan approval

## Slice 10: Browser-Level Accessibility Evidence And Focus/Selection Review

- Use Case:
  `uc-view-unit-list.md` — `Keyboard-only exploration preserves list context`;
  `uc-explore-flow-graph.md` — `Rerendering preserves a meaningful focus
destination`; `Viewer state remains perceivable without color`
- Requirement: `ACC-VIEW-001`, `ACC-VIEW-002`, `ACC-VIEW-003`,
  `ACC-VIEW-005`, `ACC-VIEW-006`, `ACC-VIEW-007`, `ACC-VIEW-008`
- `SPECS.md`: Behavioral Scenarios; Compatibility; Acceptance Criteria
- Implementation Slice: Slice 10, Browser-Level Accessibility Evidence And
  Focus/Selection Review
- Tests/validation: `jsdom`/`@testing-library/react`/`@testing-library/dom`
  and `axe-core` browser-DOM suite for tree Tab order, one-shot
  Enter/Space, virtualized final-row focus, detail return, hidden-descendant
  collapse, graph fallback, duplicate IDs, ARIA references, and focused
  selection/recomputation assertions; desktop/Web suites; 100/200/400% and
  NVDA/VoiceOver/high-contrast manual matrix
- Status: Proposed; implementation pending reviewed-plan approval. 2.4.11 is
  the required AA target; 2.4.12 is a product-quality aspiration.

## Slice 11: Flow Tree Out-of-Scope Scope Navigation Follow-Up

- Use Case:
  `uc-explore-flow-graph.md` — `Graph and flow tree synchronize interaction`;
  `Flow detail and selector shortcuts preserve graph focus`
- Requirement: `ACC-VIEW-003`, `ACC-VIEW-005`, `ACC-VIEW-006`,
  `ACC-VIEW-007`, `ACC-VIEW-008`
- `SPECS.md`: Interaction Model Decisions; Behavioral Scenarios; Acceptance
  Criteria
- Implementation Slice: Slice 11, Flow Tree Out-of-Scope Scope Navigation
  Follow-Up
- Tests/validation: `unitTreeSelector.test.ts`, `flowSelector.test.ts`, pure
  disabled-but-scope-focusable navigation tests, desktop/Web suites, qlty, and
  manual confirmation that sibling scope opening renders the destination graph
- Status: Proposed; implementation pending plan review and Human Approval
