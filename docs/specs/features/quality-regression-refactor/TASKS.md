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
  decision/scheduling.
- Non-priority signals unless a concrete maintenance risk appears:
  generated/resource duplication, shape-only component duplication, and broad
  test duplication clusters that do not map to a focused behavior boundary.

## Completed Slice Evidence

- Flow viewport-focus package:
  `src/presentation/webview/editor/ajsFlow/flowViewportFocus.ts` and the
  related fit-view scheduling in
  `src/presentation/webview/editor/ajsFlow/useFlowViewerEffects.ts` were
  refactored without behavior changes.
- Targeted after state:
  `resolveTargetRequest` is cyclomatic 3 / cognitive 4,
  `resolveFlowViewportFocusDecision` is cyclomatic 3 / cognitive 2, and the
  extracted fit-view scheduling helpers have no targeted smells.
- Preserved behavior:
  search focus, tree-selection focus, layout refit, pending unrendered target
  waiting, animation-frame cancellation, handled-version updates, and
  zoom-preserving centering.

## Validation

- [x] During planning: reused stored upstream qlty smell and metrics evaluation
      after `a921539`.
- [x] During planning: targeted qlty function metrics check for
      `flowViewportFocus.ts` and `useFlowViewerEffects.ts`.
- [x] During implementation: targeted qlty checks for touched viewport-focus
      files.
- [x] During implementation: focused `flowViewportFocus` behavior tests through
      `CI=true rtk pnpm test`.
- [x] After implementation: `CI=true rtk pnpm run qlty`.
- [x] After implementation: `CI=true rtk pnpm test`.
- [x] After implementation: `CI=true rtk pnpm run test:web`.
- [x] After implementation: `CI=true rtk pnpm run build`.
      Production webpack emitted existing bundle-size performance warnings.
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
