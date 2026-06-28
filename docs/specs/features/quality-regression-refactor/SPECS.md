# SPECS: quality-regression-refactor

## Purpose

Temporarily restore maintainability quality for changes after `v1.15.1` by
reducing qlty smells and metrics regressions to `v1.15.1` parity or better
without changing extension behavior.

## Origin

- User request: temp feature for refactoring changes from `v1.15.1` to current
  `HEAD`.
- Baseline: `v1.15.1`.
- Related plan: `docs/specs/plans.md`.

## Requirements

- Treat qlty `smells` and `metrics` regressions against `v1.15.1` as the main
  remediation scope.
- Preserve desktop extension behavior, web extension behavior, parser behavior,
  list view, flow view, CSV export, diagnostics, hover, WebAPI import beta, and
  telemetry behavior.
- Prefer behavior-preserving extraction, parameter object introduction, shared
  presentation helpers, and test helper consolidation over broad rewrites.
- Actively improve files outside the direct `v1.15.1..HEAD` diff only when the
  change is necessary or clearly useful to remove the qlty regression without
  weakening architecture boundaries.
- Keep `engines.vscode` unchanged.
- Keep domain free of direct `vscode`, React, MUI, XyFlow, and webview imports.
- Keep shared webview code free of Node-only assumptions.

## Architecture

- Domain: may receive small pure helpers only when an existing domain concept is
  being clarified; no qlty-only UI concerns belong here.
- Application: may receive small use-case/helper extractions only when existing
  behavior already belongs at the application boundary.
- Presentation: primary expected remediation area for viewer chrome, table/flow
  component structure, interaction state reducers, and duplicated test-facing
  mapping helpers.
- Infrastructure: may receive small adapter parameter-object or listener
  cleanup while preserving host boundaries.

## Impact Analysis

### Baseline Evidence

- `rtk qlty smells --include-tests --no-snippets --upstream v1.15.1` reports
  new or changed smells concentrated in:
  - `src/presentation/webview/editor/ajsFlow/*`
  - `src/presentation/webview/editor/ajsTable/*`
  - `src/presentation/webview/editor/shared/*`
  - `src/bootstrap/extension/viewerWiring.ts`
  - `src/presentation/vscode/webview/*`
  - selected tests, especially flow/list/search/diagnostic tests
- `rtk qlty metrics --dirs --max-depth 4 --sort complexity --limit 80
--upstream v1.15.1` shows changed complexity concentrated in
  `src/presentation/webview/editor`, then `src/application/editor-feedback`,
  `src/presentation/vscode`, and `src/bootstrap/extension`.
- `rtk qlty metrics --functions --sort complexity --limit 80 --upstream
v1.15.1` is very large; task decisions should use targeted reruns for files
  selected by the smell clusters.

### Primary Smell Clusters

- Shared viewer chrome duplication and component complexity:
  `ajsFlow/Header.tsx`, `ajsTable/Header.tsx`, `HeaderSearchField.tsx`,
  `SharedUnitDetailPane.tsx`, and `UnitTreeSelector.tsx`.
- Flow-view interaction helpers with high complexity:
  `useFlowViewerController.ts`, `useFlowViewerEffects.ts`,
  `flowMiniMap.ts`, `flowRelationshipFocus.ts`, `flowViewportFocus.ts`,
  `useHoveredFlowNodeState.ts`, and related tests.
- Table-view interaction and column helpers with high complexity or
  duplication: `TableContents.tsx`, `TableHeader.tsx`, `VirtualizedTable.tsx`,
  `unitListDetail.ts`, `navigation.ts`, and `columnDefs/*`.
- VS Code adapter parameter count smells:
  `viewerWiring.ts`, `ViewerFactory.ts`, `WebviewMediator.ts`,
  `messageHandlers.ts`, `registerHoverProvider.ts`, and parser listener
  adapter signatures.
- Test duplication clusters in diagnostics, flow view, reveal, search, and
  parameter-helper tests.

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs:
  flow viewer components and hooks, table viewer components and helpers, shared
  webview components, VS Code preview wiring, parser adapter listener, hover
  provider, diagnostics tests, and viewer behavior tests.
- Propagation decision:
  make each implementation slice responsible for its own direct callers and
  focused tests; do not combine unrelated parser, WebAPI, and viewer cleanup in
  one slice unless required by a shared helper boundary.

### Breaking Change Analysis

- User-visible behavior: none intended.
- API/DTO/schema compatibility: none intended.
- VS Code/web extension compatibility: must remain unchanged.
- Changed scenarios: none intended; impacted behavior contracts are regression
  protections in flow graph, unit list, cross-view navigation, and show unit
  definition use cases.

### Alternative Considerations

- Fix every qlty finding in one broad rewrite:
  rejected because it would create review risk and weaken regression isolation.
- Suppress or ignore qlty shape findings:
  rejected for this temporary feature because the explicit objective is parity
  or better against `v1.15.1`.
- Start with generated or resource duplication:
  rejected for the first slice because it is less connected to the largest
  complexity clusters and may be intentional locale/resource shape.
- Start with viewer presentation:
  accepted because qlty regressions, `v1.15.1..HEAD` change volume, and
  behavior contracts all point there.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`.
- Scope changes requiring re-approval:
  behavior changes, dependency upgrades, `engines.vscode` changes, generated
  artifact changes, parser grammar changes, telemetry payload changes, WebAPI
  scope changes, or broad runtime rewrites outside qlty remediation.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility: refactors must not add Node-only APIs to shared
  webview or application code.
- Desktop extension compatibility: command, panel, diagnostics, hover, and
  telemetry behavior must remain stable.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- qlty smells and metrics for the selected implementation slice are no worse
  than before the slice and move the repository toward `v1.15.1` parity.
- Final feature closure requires qlty smells and metrics against `v1.15.1` to
  be at parity or better, or any remaining findings to be documented as
  intentional non-regressions with explicit approval.
- Focused tests cover behavior-preserving refactors for affected flow/list
  viewer or adapter behavior.
- Required validation for code changes follows `docs/specs/README.md`:
  `rtk pnpm run qlty`, `rtk pnpm test`, `rtk pnpm run test:web`, and
  `rtk pnpm run build`.
- No change raises minimum VS Code compatibility or breaks web extension
  support.

## Non-Goals

- New user-visible features.
- Dependency modernization.
- VS Code compatibility changes.
- Parser grammar changes.
- WebAPI beta scope expansion.
- Telemetry event or payload expansion.

## Open Questions

- None for the first planning slice; implementation approval is still required
  before runtime code, tests, generated artifacts, or configuration are edited.
