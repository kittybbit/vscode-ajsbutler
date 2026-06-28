# TASKS: quality-regression-refactor

## Current Task

- Status: Proposed
- Scope:
  reassess the stored upstream qlty evaluation and completed targeted
  remediations to decide whether another focused package/category slice is
  still needed or whether the feature can close.
- Acceptance:
  reuse the saved `v1.15.1` comparison where it still matches the repository,
  refresh upstream only when the trigger below applies, and select at most one
  coherent category/package slice for the next implementation approval.
- Validation:
  planning-only checks are enough unless a new runtime/test/config slice is
  approved.

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
  flow presentation helpers and hooks, table presentation and column helpers,
  VS Code adapter parameter-list shapes, shared tree/detail presentation, CSV
  cell conversion, selected focused tests, and i18n resource duplication.
- Recently removed targeted smells:
  viewer wiring, viewer event bridge, unit type label resolver, flow
  relationship-focus classification, flow node detail context, flow tree
  selection target, flow search state construction, and flow viewport-focus
  decision/scheduling, shared flow/table header search control, and shared
  unit-tree selector expansion/scroll/row interaction logic, VS Code webview
  adapter parameter-shape wiring, and the table interaction shell around row
  reveal, table search controller, viewer data/index construction, header CSV
  actions, virtualized row selection, table header rendering, CSV cell
  conversion, and table navigation helper shapes.
- Non-priority signals unless a concrete maintenance risk appears:
  generated/resource duplication, shape-only component duplication, and broad
  test duplication clusters that do not map to a focused behavior boundary.

## Validation

- [x] Completed slice: targeted qlty checks for touched `ajsTable` interaction
      shell files report no smells; standard gates passed with
      `CI=true rtk pnpm run qlty`, `CI=true rtk pnpm test`,
      `CI=true rtk pnpm run test:web`, and `CI=true rtk pnpm run build`.
      Production webpack emitted existing bundle-size performance warnings.
- [x] Previous planning: reused stored upstream qlty smell and metrics evaluation
      after `a921539`.
- [x] Completed slice: targeted qlty checks for touched VS Code webview adapter
      files and focused adapter tests through `CI=true rtk pnpm test`.
- [x] Completed slice: `CI=true rtk pnpm run qlty`,
      `CI=true rtk pnpm test`, `CI=true rtk pnpm run test:web`, and
      `CI=true rtk pnpm run build`.
      `test:web` required an escalated rerun after sandboxed Chromium failed to
      register a macOS Mach port; the first escalated run then hit a transient
      external HTTPS timeout and the next rerun passed. Production webpack
      emitted existing bundle-size performance warnings.
- [x] Completed slice: targeted qlty checks for touched unit-tree selector
      files and focused selector tests through `CI=true rtk pnpm test`.
- [x] Completed slice: `CI=true rtk pnpm run qlty`,
      `CI=true rtk pnpm test`, `CI=true rtk pnpm run test:web`, and
      `CI=true rtk pnpm run build`.
      `test:web` required an escalated rerun after sandboxed Chromium failed to
      register a macOS Mach port. Production webpack emitted existing
      bundle-size performance warnings.

## Use-Case Back-Propagation

- No behavior changes are planned.
- If implementation reveals an intended or unavoidable behavior change, stop
  and update the relevant use case before requesting expanded approval.

## Decision Notes

- The user permits active behavior-preserving refactoring beyond the direct
  `v1.15.1..HEAD` diff when needed to reach qlty parity, but runtime, tests,
  generated artifacts, and configuration still require approval.
- Do not run the upstream comparison again for the next planning step unless a
  refresh trigger in `Reusable Upstream Evaluation` applies.
