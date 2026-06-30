# TASKS: quality-regression-refactor

## Current Task

- Status: Ready for Planning
- Scope:
  reassess whether the stored upstream qlty evaluation still justifies another
  package/category slice or feature closure after the completed diagnostics
  test fixture/helper slice.
- Acceptance:
  keep any next task package/category-sized, behavior-preserving, and tied to a
  coherent qlty smell or metrics cluster.
- Validation:
  refresh the upstream evaluation after this commit because a committed test
  change can affect the broad comparison, then run targeted current-head qlty
  checks for any selected candidate.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending. Only clear human
approval can change Status to Approved.

## Active Tasks

- [x] Reassess whether the stored upstream qlty evaluation still justifies
      another package/category slice or feature closure.
- [x] Select the editor-feedback diagnostics test fixture/helper remediation
      slice.
- [x] Obtain human implementation approval for the editor-feedback diagnostics
      test fixture/helper slice.
- [x] Complete the editor-feedback diagnostics test fixture/helper remediation
      slice.
- [ ] Reassess whether the stored upstream qlty evaluation still justifies
      another package/category slice or feature closure.

## Reusable Upstream Evaluation

- Baseline: `v1.15.1`.
- Last refreshed after commit: `f180918 Refactor host callback adapters`.
- Refresh triggers:
  refresh this evaluation only after a committed runtime/test/config change that
  can affect the broad comparison, when the selected slice fails to match stored
  evidence, or when explicitly requested. Use targeted checks for selected
  packages instead of refreshing the upstream comparison every time.
- Reusable commands:
  `rtk qlty smells --include-tests --no-snippets --upstream v1.15.1` and
  `rtk qlty metrics --dirs --max-depth 4 --sort complexity --limit 80
--upstream v1.15.1`.
- Current top-level metrics evidence:
  changed complexity is still concentrated in `src/presentation/webview/editor`,
  followed by `src/application/editor-feedback`, `src/presentation/vscode`,
  selected bootstrap/adapter paths, parser infrastructure, domain/i18n-related
  paths, and selected tests.
- Current smell clusters from the last broad upstream refresh:
  i18n resource duplication in `src/resource/i18n/ty_en.ts` and `ty_ja.ts`;
  focused test smells in `flowHeader.test.ts`/`flowSelector.test.ts`,
  `importAjsDefinitionViaWebApiCommand.test.ts`, `parameterHelpers.test.ts`,
  and `unitCapabilityEntities.test.ts`.
- Recently removed targeted smells:
  viewer wiring, viewer event bridge, unit type label resolver, flow
  relationship-focus classification, flow node detail context, flow tree
  selection target, flow search state construction, flow viewport-focus
  decision/scheduling, shared flow/table header search control, shared
  unit-tree selector expansion/scroll/row interaction logic, VS Code webview
  adapter parameter-shape wiring, table interaction/navigation helpers, table
  column definition helpers, flow graph rendering-data helpers, flow
  interaction controller/search helpers, webview editor detail/selector
  presentation controls, VS Code hover provider adapter shape, webview editor
  presentation helpers, host callback adapter parameter shapes, and diagnostics
  test fixture/helper duplication.
- Current candidate evidence:
  targeted current-head qlty for
  `src/test/suite/buildSyntaxDiagnostics.test.ts` and
  `src/test/support/syntaxDiagnostics.ts` reports no smells after the completed
  diagnostics test fixture/helper slice.
- Deferred candidates:
  i18n resource duplication and the smaller focused test clusters remain
  separate candidates after refreshing the broad upstream comparison.

## Validation

- [x] Current planning:
      refreshed upstream qlty smell/metrics after `f180918` because committed
      runtime/test changes can affect the broad comparison. No production smell
      remains in the broad upstream smell report. Targeted current-head qlty
      confirms the selected diagnostics test fixture/helper slice.
- [x] Completed diagnostics test fixture/helper slice:
      targeted qlty for `buildSyntaxDiagnostics.test.ts` and
      `syntaxDiagnostics.ts` reports no smells. Standard gates passed with
      `CI=true rtk pnpm run qlty`, `CI=true rtk pnpm test`,
      `CI=true rtk pnpm run test:web`, `CI=true rtk pnpm run build`,
      `CI=true rtk pnpm run lint:md`, and `rtk git diff --check`. Production
      webpack emitted existing bundle-size performance warnings.

## Use-Case Back-Propagation

- No behavior changes were made for the completed diagnostics test
  fixture/helper slice.
- Editor feedback behavior is governed by
  `docs/requirements/use-cases/uc-provide-editor-feedback.md`, including parser
  syntax diagnostics, semantic parameter diagnostics, JP1/AJS3 v13 rules, and
  UI-independent diagnostic DTO expectations.
- If implementation reveals an intended or unavoidable behavior change, stop
  and update the relevant use case before requesting expanded approval.

## Decision Notes

- The user permits active behavior-preserving refactoring beyond the direct
  `v1.15.1..HEAD` diff when needed to reach qlty parity, but runtime, tests,
  generated artifacts, and configuration still require approval.
- The completed diagnostics test fixture/helper slice was deliberately
  category-sized: it targeted diagnostics test fixture/helper structure rather
  than a single isolated test case, while leaving unrelated test and resource
  smells for later decisions.
