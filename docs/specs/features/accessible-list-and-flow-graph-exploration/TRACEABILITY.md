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

## Slice 2: Unit-List Workflow Focus Continuity

- Use Case:
  `uc-view-unit-list.md` — `Keyboard-only exploration preserves list context`
- Requirement: `ACC-VIEW-002`, `ACC-VIEW-007`, `ACC-VIEW-008`
- `SPECS.md`: Requirements; Behavioral Scenarios; Acceptance Criteria
- Validation: table search/header, detail-pane, dialog default-restoration,
  stale-target, virtualization fallback, desktop, and Web tests

## Slice 3: Flow Relationship Navigation

- Use Case:
  `uc-explore-flow-graph.md` —
  `Non-visual navigation follows flow relationships`
- Requirement: `ACC-VIEW-003`, `ACC-VIEW-007`, `ACC-VIEW-008`
- `SPECS.md`: Requirements; Interaction Model Decisions; Behavioral Scenarios
- Validation: pure relationship target and event-boundary tests, flow node
  display and viewport tests, desktop tests, and Web tests

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

## Slice 5: Flow Scope And Detail Focus Continuity

- Use Case:
  `uc-explore-flow-graph.md` — `Flow-tree selection preserves zoom`;
  `Supporting panels collapse without losing state`
- Requirement: `ACC-VIEW-003`, `ACC-VIEW-005`, `ACC-VIEW-007`,
  `ACC-VIEW-008`
- `SPECS.md`: Requirements; Behavioral Scenarios; Acceptance Criteria
- Validation: `flowSelector.test.ts`,
  `flowNodeDetailPanelCollapse.test.ts`, viewport, dialog
  default-restoration, stale-target, asynchronous scope, desktop, and Web tests

## Slice 6: Localized Semantic State And Announcements

- Use Case:
  `uc-view-unit-list.md` — Rules for semantic table state;
  `uc-explore-flow-graph.md` — Rules for semantic graph state
- Requirement: `ACC-VIEW-004`, `ACC-VIEW-006`, `ACC-VIEW-007`,
  `ACC-VIEW-008`
- `SPECS.md`: Requirements; Compatibility; Acceptance Criteria
- Validation: English/Japanese label, fallback, live-region deduplication,
  politeness, React Flow description, excluded-event, desktop, and Web tests

## Slice 7: Non-Color State, High Contrast, And Compatibility Validation

- Use Case:
  `uc-view-unit-list.md` — Acceptance Notes for keyboard and high contrast;
  `uc-explore-flow-graph.md` — Acceptance Notes for keyboard and high contrast
- Requirement: `ACC-VIEW-005`, `ACC-VIEW-007`, `ACC-VIEW-008`
- `SPECS.md`: Requirements; Behavioral Scenarios; Compatibility;
  Acceptance Criteria
- Validation: focused style-state tests, desktop and Web suites, production
  build, Windows/NVDA, macOS/VoiceOver, Windows high contrast, and
  large-definition manual checks
