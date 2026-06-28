# TASKS: quality-regression-refactor

## Current Task

- Status: Proposed
- Scope:
  reassess the stored upstream qlty evaluation and completed targeted
  remediations to decide whether another focused package slice is still needed
  or whether the feature can close.
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
      another slice or feature closure.

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
  decision/scheduling, and shared flow/table header search control.
- Non-priority signals unless a concrete maintenance risk appears:
  generated/resource duplication, shape-only component duplication, and broad
  test duplication clusters that do not map to a focused behavior boundary.

## Completed Slice Evidence

- Shared header search-control package:
  `src/presentation/webview/editor/shared/HeaderSearchField.tsx`,
  `src/presentation/webview/editor/ajsFlow/Header.tsx`, and
  `src/presentation/webview/editor/ajsTable/Header.tsx` now share search input
  state, helper-text resolution, result counters, and result navigation without
  behavior changes.
- Targeted after state:
  the touched header/search files report no targeted qlty smells; flow/table
  helper-text functions are cyclomatic 1 / cognitive 0, and flow `Header` is
  cyclomatic 1 / cognitive 0.
- Preserved behavior:
  Ctrl/Cmd+F focus, Enter/Shift+Enter navigation, clear/focus behavior, result
  counters, helper text, table CSV/column controls, flow
  expand/focus/minimap controls, and current-scope badge behavior.

## Validation

- [x] During planning: reused stored upstream qlty smell and metrics evaluation
      after `a921539`.
- [x] During planning: targeted qlty smell and metrics checks for the
      flow/table/shared header search package.
- [x] After implementation approval: targeted qlty checks for touched
      header/search files.
- [x] After implementation approval: focused header/search tests through
      `CI=true rtk pnpm test`.
- [x] After implementation approval: `CI=true rtk pnpm run qlty`,
      `CI=true rtk pnpm test`, `CI=true rtk pnpm run test:web`, and
      `CI=true rtk pnpm run build`.
      Production webpack emitted existing bundle-size performance warnings;
      web test exited successfully with shutdown-time `ECONNRESET` /
      `ERR_STREAM_PREMATURE_CLOSE` logs.
- [x] After completion update: `CI=true rtk pnpm run lint:md` and
      `CI=true rtk pnpm run qlty`.

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
