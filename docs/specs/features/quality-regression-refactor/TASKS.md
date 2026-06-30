# TASKS: quality-regression-refactor

## Current Task

- Status: Ready for Planning
- Scope:
  reassess whether the stored upstream qlty evaluation still justifies another
  package/category slice or feature closure.
- Acceptance:
  keep any next task package/category-sized, behavior-preserving, and tied to a
  coherent qlty smell or metrics cluster.
- Validation:
  reuse the stored upstream evaluation unless a refresh trigger applies, and
  run targeted current-head qlty checks for any selected candidate.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Active Tasks

- [x] Complete the table column definition package remediation slice.
- [x] Complete the flow graph rendering-data remediation slice.
- [x] Reassess whether the stored upstream qlty evaluation still justifies
      another package/category slice or feature closure.
- [x] Select the flow interaction controller/search remediation slice.
- [x] Obtain human implementation approval for the flow interaction
      controller/search slice.
- [x] Complete the flow interaction controller/search remediation slice.
- [x] Reassess whether the stored upstream qlty evaluation still justifies
      another package/category slice or feature closure.
- [x] Select the webview editor detail/selector presentation-controls
      remediation slice.
- [x] Obtain human implementation approval for the webview editor
      detail/selector presentation-controls slice.
- [x] Complete the webview editor detail/selector presentation-controls slice.
- [x] Reassess whether the stored upstream qlty evaluation still justifies
      another package/category slice or feature closure.
- [x] Select the VS Code editor-feedback adapter parameter-shape slice.
- [x] Obtain human implementation approval for the VS Code editor-feedback
      adapter parameter-shape slice.
- [x] Complete the VS Code editor-feedback adapter parameter-shape slice.
- [ ] Reassess whether the stored upstream qlty evaluation still justifies
      another package/category slice or feature closure.

## Reusable Upstream Evaluation

- Baseline: `v1.15.1`.
- Last refreshed after commit:
  `a921539 Refactor flow search state construction`.
- Refresh triggers:
  refresh this evaluation only after a committed runtime/test/config change that
  can affect the broad comparison, when the selected slice fails to match stored
  evidence, or when explicitly requested. Use targeted checks for just-completed
  packages instead of refreshing the upstream comparison after every slice.
- Reusable commands:
  `rtk qlty smells --include-tests --no-snippets --upstream v1.15.1` and
  `rtk qlty metrics --dirs --max-depth 4 --sort complexity --limit 80
--upstream v1.15.1`.
- Current top-level metrics evidence:
  `src/presentation/webview/editor` remains the largest changed complexity
  cluster among active remediation candidates, with changed complexity also
  present in `src/presentation/vscode`, `src/bootstrap/extension`,
  `src/application/editor-feedback`, and selected tests.
- Current smell clusters still useful for selecting future slices:
  remaining table presentation helpers outside the completed column definition
  package, VS Code adapter parameter-list shapes, shared detail presentation,
  selected focused tests, and i18n resource duplication.
- Recently removed targeted smells:
  viewer wiring, viewer event bridge, unit type label resolver, flow
  relationship-focus classification, flow node detail context, flow tree
  selection target, flow search state construction, and flow viewport-focus
  decision/scheduling, shared flow/table header search control, and shared
  unit-tree selector expansion/scroll/row interaction logic, VS Code webview
  adapter parameter-shape wiring, and the table interaction shell around row
  reveal, table search controller, viewer data/index construction, header CSV
  actions, virtualized row selection, table header rendering, CSV cell
  conversion, and table navigation helper shapes, table column definition
  package helpers around shared row-view column builders, nested group builders,
  array/rating cell rendering, and schedule column schema preservation, and
  flow graph rendering-data helpers around DTO-to-React Flow mapping, nested
  position parameters, expanded-node type mapping, jobnet node actions, and
  relationship-focus styling, plus flow interaction controller/search helpers
  around viewer composition, current-scope search submission, and graph/tree
  hover state, and webview editor detail/selector presentation controls around
  shared detail-pane sections, column selector grouping, controlled column
  visibility, and table jump-link selection, and the VS Code hover provider
  adapter parameter shape around word lookup and hover rendering.
- Current candidate evidence:
  broad diagnostics-test duplication, selected focused test duplication, and
  i18n resource duplication remain separate candidates after the selected VS
  Code editor-feedback adapter parameter-shape slice.
- Non-priority signals unless a concrete maintenance risk appears:
  generated/resource duplication, shape-only component duplication, and broad
  test duplication clusters that do not map to a focused behavior boundary.

## Validation

- [x] Current planning: reused stored upstream evaluation and ran targeted
      current-head qlty checks for remaining candidate clusters. Additional
      targeted qlty rerun for the selected flow interaction file list was
      blocked by the environment usage limit, so this plan relies on the
      successful cluster-level checks already captured above.
- [x] Completed flow graph rendering-data slice: targeted qlty checks for
      touched flow graph rendering files and direct graph tests report no
      smells. Standard gates passed with `CI=true rtk pnpm run qlty`,
      `CI=true rtk pnpm test`, `CI=true rtk pnpm run test:web`,
      `CI=true rtk pnpm run build`, and `CI=true rtk pnpm run lint:md`.
      `test:web` required an escalated run for Chromium/macOS host access.
      Production webpack emitted existing bundle-size performance warnings.
- [x] Completed table column definition package slice: targeted qlty checks for
      `ajsTable/columnDefs`, `tableColumnDef.tsx`, and
      `tableColumnDef.test.ts` report no smells. Standard gates passed with
      `CI=true rtk pnpm run qlty`, `CI=true rtk pnpm test`,
      `CI=true rtk pnpm run test:web`, `CI=true rtk pnpm run build`, and
      `CI=true rtk pnpm run lint:md`.
      `test:web` required an escalated rerun after sandboxed Chromium failed to
      register a macOS Mach port. Production webpack emitted existing
      bundle-size performance warnings.
- [x] Stored upstream qlty smell and metrics evaluation remains reusable after
      `a921539` until a refresh trigger applies.
- [x] Completed flow interaction controller/search slice: targeted qlty checks
      for the touched flow interaction files and direct flow search/hover tests
      report no smells. Standard gates passed with
      `CI=true rtk pnpm run qlty`, `CI=true rtk pnpm test`,
      `CI=true rtk pnpm run build`, `CI=true rtk pnpm run lint:md`, and
      `rtk git diff --check`. `CI=true rtk pnpm run test:web` failed twice
      before local test startup with external HTTPS `ETIMEDOUT`, so this caveat
      remains for the next validation decision.
- [x] Current planning: reused stored upstream evaluation and ran targeted
      current-head qlty for remaining concrete candidates. Current smells are
      `SharedUnitDetailPane.tsx` `StateChip`/`SharedUnitDetailPane`,
      `DisplayColumnSelector.tsx` `ColumnDetail`, and
      `registerHoverProvider.ts` `provideHover`.
- [x] Completed webview editor detail/selector presentation-controls slice:
      targeted qlty checks for touched detail/selector/table navigation files
      report no smells. Standard gates passed with
      `CI=true rtk pnpm run qlty`, `CI=true rtk pnpm test`,
      `CI=true rtk pnpm run test:web`, `CI=true rtk pnpm run build`,
      `CI=true rtk pnpm run lint:md`, and `rtk git diff --check`.
      Production webpack emitted existing bundle-size performance warnings.
- [x] Current planning: reused stored upstream evaluation and ran targeted
      current-head qlty for concrete VS Code/presentation/test candidates.
      Current concrete production smell is `registerHoverProvider.ts`
      `provideHover`; broad `buildSyntaxDiagnostics.test.ts` duplication and
      smaller focused test duplication remain separate candidates.
- [x] Completed VS Code editor-feedback adapter parameter-shape slice:
      targeted qlty checks for the touched hover adapter, direct bootstrap
      caller, and focused hover-provider tests report no smells. Standard gates
      passed with `CI=true rtk pnpm run qlty`, `CI=true rtk pnpm test`,
      `CI=true rtk pnpm run test:web`, `CI=true rtk pnpm run build`,
      `CI=true rtk pnpm run lint:md`, and `rtk git diff --check`.
      Production webpack emitted existing bundle-size performance warnings.

## Use-Case Back-Propagation

- No behavior changes were made for the completed flow graph rendering-data
  slice.
- No behavior changes were made for the completed flow interaction
  controller/search slice.
- No behavior changes were made for the completed webview editor
  detail/selector presentation-controls slice beyond preserving the intended
  table behavior during refactoring: column visibility is controlled from one
  React state, and table jump links select and scroll to the link target rather
  than leaving a separate reveal highlight.
- No behavior changes were made for the completed VS Code editor-feedback
  adapter parameter-shape slice.
- Current-scope search, reveal, hover synchronization, selection, relationship
  focus, MiniMap visibility, and selected-node detail behavior are governed by
  `docs/requirements/use-cases/uc-build-flow-graph.md`.
- Selected-unit detail pane behavior is governed by
  `docs/requirements/use-cases/uc-show-unit-definition.md`.
- Table column visibility behavior affects
  `docs/requirements/use-cases/uc-build-unit-list-view.md` and CSV hidden-column
  behavior in `docs/requirements/use-cases/uc-export-unit-list-csv.md`.
- Hover provider behavior is governed by
  `docs/requirements/use-cases/uc-provide-editor-feedback.md`.
- Flow graph node/edge IDs, node types, positions, nested panel bounds,
  search/selection/hover flags, relationship-focus styling, and jobnet
  open/expand action ordering remain protected by direct flow graph/node tests.
- The group10 column id, nesting, and order contract is protected by
  `src/test/suite/tableColumnDef.test.ts`.
- If implementation reveals an intended or unavoidable behavior change, stop
  and update the relevant use case before requesting expanded approval.

## Decision Notes

- The user permits active behavior-preserving refactoring beyond the direct
  `v1.15.1..HEAD` diff when needed to reach qlty parity, but runtime, tests,
  generated artifacts, and configuration still require approval.
- Do not run the upstream comparison again for the next planning step unless a
  refresh trigger in `Reusable Upstream Evaluation` applies.
- Flow graph rendering-data behavior is governed mainly by
  `docs/requirements/use-cases/uc-build-flow-graph.md` and, for stable unit
  identity across viewers,
  `docs/requirements/use-cases/uc-navigate-between-unit-list-and-flow-graph.md`.
