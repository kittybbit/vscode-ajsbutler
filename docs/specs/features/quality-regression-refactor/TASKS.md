# TASKS: quality-regression-refactor

## Current Task

- Status: Ready for Planning
- Scope:
  reassess whether the quality-regression-refactor feature can close after the
  completed unit-type i18n resource remediation slice, or whether remaining
  metrics evidence justifies another package/category slice.
- Acceptance:
  keep any next task package/category-sized, behavior-preserving, and backed by
  current qlty evidence. Prefer feature closure if no concrete smell or
  actionable metrics regression remains.
- Validation:
  refresh reusable qlty evidence only when the committed unit-type i18n slice
  changes the broad comparison or when selecting another implementation slice.

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
- [x] Select the domain parameter/capability test helper remediation slice.
- [x] Obtain human implementation approval for the domain
      parameter/capability test helper slice.
- [x] Complete the domain parameter/capability test helper remediation slice.
- [x] Reassess whether the stored upstream qlty evaluation still justifies
      another package/category slice or feature closure.
- [x] Select the flow header/selector test fixture remediation slice.
- [x] Obtain human implementation approval for the flow header/selector test
      fixture slice.
- [x] Complete the flow header/selector test fixture remediation slice.
- [x] Reassess whether the stored upstream qlty evaluation still justifies
      another package/category slice or feature closure.
- [x] Select the WebAPI command test dependency factory remediation slice.
- [x] Obtain human implementation approval for the WebAPI command test
      dependency factory slice.
- [x] Complete the WebAPI command test dependency factory remediation slice.
- [x] Reassess whether the stored upstream qlty evaluation still justifies
      another package/category slice or feature closure.
- [x] Select the unit-type i18n resource remediation slice.
- [x] Obtain human implementation approval for the unit-type i18n resource
      slice.
- [x] Complete the unit-type i18n resource remediation slice.
- [ ] Reassess whether the feature can close or needs another package/category
      slice after the committed unit-type i18n resource remediation.

## Reusable Upstream Evaluation

- Baseline: `v1.15.1`.
- Last refreshed after commit: `5c126ba Refactor WebAPI command test harness`.
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
- Current smell clusters:
  none known after the unit-type i18n resource remediation working tree. The
  next planning pass should refresh after the commit if another implementation
  slice is considered.
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
  test fixture/helper duplication, and domain parameter/capability test helper
  duplication, flow header/selector test fixture duplication, WebAPI command
  test dependency factory return-shape smell, and unit-type i18n resource
  duplication.
- Current candidate evidence:
  post-implementation upstream qlty smell comparison reported no smells, and
  targeted qlty for the consolidated unit-type i18n resource scope reported no
  smells.
- Deferred candidates:
  none after the unit-type i18n resource slice unless implementation reveals a
  necessary follow-up or the post-slice upstream refresh still reports a
  concrete qlty regression.

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
- [x] Current planning:
      refreshed upstream qlty smell/metrics after `8f27c7b` because committed
      test changes can affect the broad comparison. Broad diagnostics-test
      duplication is gone. Remaining concrete smells are i18n resource
      duplication, flow header/selector test duplication, WebAPI command test
      dependency factory returns, and domain parameter/capability test
      duplication. Targeted current-head qlty confirms the selected
      parameter/capability test helper slice.
- [x] Completed domain parameter/capability test helper slice:
      targeted qlty for `parameterHelpers.test.ts` and
      `unitCapabilityEntities.test.ts` reports no smells. Standard gates passed
      with `CI=true rtk pnpm run qlty`, `CI=true rtk pnpm test`,
      `CI=true rtk pnpm run test:web`, `CI=true rtk pnpm run build`,
      `CI=true rtk pnpm run lint:md`,
      `CI=true rtk pnpm exec tsc -p tsconfig.test.json --noEmit`, and
      `rtk git diff --check`. Production webpack emitted existing bundle-size
      performance warnings.
- [x] Current planning:
      refreshed upstream qlty smell/metrics after `a223768` because committed
      test changes affected the broad comparison. Remaining concrete smells are
      i18n resource duplication, flow header/selector test duplication, and the
      WebAPI command test dependency factory return-shape smell. Targeted
      current-head qlty confirms the selected flow header/selector test fixture
      slice.
- [x] Completed flow header/selector test fixture slice:
      targeted qlty for `flowHeader.test.ts`, `flowSelector.test.ts`, and
      `flowUnits.ts` reports no smells. Standard gates passed with
      `CI=true rtk pnpm run qlty`, `CI=true rtk pnpm test`,
      `CI=true rtk pnpm run test:web`, `CI=true rtk pnpm run build`,
      `CI=true rtk pnpm run lint:md`,
      `CI=true rtk pnpm exec tsc -p tsconfig.test.json --noEmit`, and
      `rtk git diff --check`. `test:web` required an elevated rerun because
      sandboxed Chromium hit macOS Mach port permission failure. Production
      webpack emitted existing bundle-size performance warnings.
- [x] Current planning:
      refreshed upstream qlty smell/metrics after `d420357` because committed
      test-support changes affected the broad comparison. Remaining concrete
      smells are i18n resource duplication and WebAPI command test dependency
      factory return-shape smell. Targeted current-head qlty confirms the
      selected WebAPI command test dependency factory slice.
- [x] Completed WebAPI command test dependency factory slice:
      targeted qlty for `importAjsDefinitionViaWebApiCommand.test.ts` reports
      no smells. Standard gates passed with `CI=true rtk pnpm run qlty`,
      `CI=true rtk pnpm test`, `CI=true rtk pnpm run test:web`,
      `CI=true rtk pnpm run build`, `CI=true rtk pnpm run lint:md`,
      `CI=true rtk pnpm exec tsc -p tsconfig.test.json --noEmit`, and
      `rtk git diff --check`. `test:web` required an elevated rerun because the
      first run hit an external connection timeout. Production webpack emitted
      existing bundle-size performance warnings.
- [x] Current planning:
      refreshed upstream qlty smell/metrics after `5c126ba` because committed
      test changes affected the broad comparison. The only remaining broad
      smell is unit-type i18n resource duplication in `ty_en.ts`/`ty_ja.ts`.
      Targeted current-head qlty confirms the selected unit-type i18n resource
      slice.
- [x] Completed unit-type i18n resource slice:
      consolidated unit-type labels into `src/resource/i18n/ty.ts`, removed
      obsolete `ty_en.ts`/`ty_ja.ts` shims after confirming no repository
      imports require them, and added focused `NLS` assertions for unsupported
      language fallback and Japanese label preservation. Targeted qlty reports
      no smells, upstream qlty smells reports no smells, and generated
      English/Japanese label objects match the previous resources exactly.
      Standard gates passed with `CI=true rtk pnpm run qlty`,
      `CI=true rtk pnpm test`, `CI=true rtk pnpm run test:web`,
      `CI=true rtk pnpm run build`, `CI=true rtk pnpm run lint:md`,
      `CI=true rtk pnpm exec tsc -p tsconfig.test.json --noEmit`, and
      `rtk git diff --check`. Production webpack emitted existing bundle-size
      performance warnings. One earlier `test:web` rerun was needed because an
      external connection timed out.

## Use-Case Back-Propagation

- No behavior changes were made for the completed diagnostics test
  fixture/helper slice.
- No behavior changes were made for the completed domain parameter/capability
  test helper slice.
- No behavior changes were made for the completed flow header/selector test
  fixture slice.
- No behavior changes were made for the completed WebAPI command test
  dependency factory slice.
- The completed unit-type i18n resource slice preserved observable unit-type
  labels for flow nodes, flow details, unit-list type cells, and unit-list
  details.
- Editor feedback behavior is governed by
  `docs/requirements/use-cases/uc-provide-editor-feedback.md`, including parser
  syntax diagnostics, semantic parameter diagnostics, JP1/AJS3 v13 rules, and
  UI-independent diagnostic DTO expectations.
- Domain parameter helper and wrapper capability behavior is governed by
  `docs/requirements/use-cases/uc-normalize-ajs-document.md`, especially shared
  parameter lookup and wrapper-derived semantics during normalized-model
  migration.
- Flow header/selector behavior is governed by
  `docs/requirements/use-cases/uc-build-flow-graph.md`, especially explicit
  root-jobnet flow scopes, selector/graph synchronization, and in-scope tree
  selection.
- WebAPI import beta behavior is governed by
  `docs/requirements/use-cases/uc-import-ajs-definition-via-webapi.md`,
  especially desktop-only availability, read-only import request construction,
  stable unsupported-host errors, and no secret leakage in user-facing errors
  or telemetry.
- Unit-type label behavior is governed by
  `docs/requirements/use-cases/uc-build-flow-graph.md`,
  `docs/requirements/use-cases/uc-build-unit-list-view.md`, and existing
  `NLS` tests, because labels are rendered in flow nodes/details and unit-list
  type/detail surfaces.
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
