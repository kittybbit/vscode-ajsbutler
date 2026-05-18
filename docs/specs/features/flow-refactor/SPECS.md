# Feature Specification: flow-refactor

## Purpose

Reduce concentrated responsibilities in diagnostics and flow-viewer code by
splitting large files into domain-aligned rule/layout modules and
composition-root UI wiring while preserving existing behavior.

## Origin

- Source use cases:
  `docs/requirements/use-cases/uc-provide-editor-feedback.md`,
  `docs/requirements/use-cases/uc-build-flow-graph.md`,
  `docs/requirements/use-cases/uc-navigate-between-unit-list-and-flow-graph.md`
- Related plan:
  `docs/specs/plans.md`

## Requirements

- `buildSyntaxDiagnostics.ts` must move from a large mixed rule file to
  orchestration plus extracted rule/helper modules.
- `buildExpandedFlowGraph.ts` must separate graph construction from expanded
  layout adjustment responsibilities.
- `FlowContents.tsx` must move state management, subscriptions, and DTO to
  ReactFlow conversion into hooks or presentation components.
- Existing diagnostics, flow expansion, search, reveal, and fit behavior must
  remain unchanged unless a later approved slice explicitly changes them.
- Desktop and web extension compatibility must remain explicit for every slice.
- Slices must follow the planned order:
  PR1 tests only, PR2 diagnostics split, PR3 expanded-flow split,
  PR4 `FlowContents.tsx` hook extraction, PR5 cleanup and naming/export
  consolidation.

## Behavioral Scenarios (optional)

No new user-visible behavior is introduced. This feature preserves the
behavior already contracted by the related use cases while improving internal
boundaries and sliceability.

## Architecture

- Domain:
  extract rule-specific helpers from syntax-diagnostic logic where the rules
  are pure and JP1/AJS-domain-facing
- Application:
  keep orchestration boundaries explicit for syntax diagnostics and expanded
  graph building
- Presentation:
  split flow-viewer state, event bridge wiring, and ReactFlow element mapping
  from `FlowContents.tsx`
- Infrastructure:
  no direct behavior change intended; VS Code and webview adapters stay at the
  boundary

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs:
  editor-feedback diagnostics, flow-graph construction, flow-viewer rendering
  and interaction hooks/components, regression tests, and SDD documents
- Propagation decision:
  keep parser output contracts, application DTOs, VS Code adapters, and
  visible flow-viewer behavior stable while extracting internal seams in
  focused slices

### Breaking Change Analysis

- User-visible behavior:
  none intended
- API/DTO/schema compatibility:
  none intended
- VS Code/web extension compatibility:
  must remain unchanged across shared diagnostics and flow-viewer paths
- Changed scenarios:
  none

### Alternative Considerations

- Refactor each file independently without one feature umbrella:
  rejected because the three areas share the same maintainability objective,
  the same validation expectations, and the same phased PR plan
- Start with `FlowContents.tsx` hook extraction:
  not chosen for this feature plan because the accepted slice order starts
  with characterization tests that protect the later refactors
- Large one-shot split across diagnostics, graph layout, and UI:
  rejected because approval, review, and regression diagnosis become harder

### Approval Impact Decisions

- Approval evidence owner:
  TASKS.md `Human Approval`
- Scope changes requiring re-approval:
  user-visible diagnostic text or positions, flow layout/reveal behavior
  changes, DTO contract changes, parser changes, dependency upgrades, or
  `engines.vscode` changes
- PR4 approval-sensitive scope:
  `FlowContents.tsx` hook/presentation extraction may move flow-viewer
  state, EventBridge subscriptions, search/reveal handlers, fit-to-view
  scheduling, and ReactFlow data preparation into presentation-local hooks or
  support modules. It must preserve existing component props, graph DTO
  contracts, search/reveal behavior, nested-expansion behavior, current unit
  selection, dialog behavior, desktop/web host assumptions, package
  configuration, and `engines.vscode`.

### PR4 Impact Investigation

- Primary target:
  `src/ui-component/editor/ajsFlow/FlowContents.tsx`
- Direct type/import dependents:
  `AjsFlowViewerApp.tsx`, `FlowSelector.tsx`, `FlowMenu.tsx`, `Header.tsx`,
  `flowGraphView.ts`, and `nodes/AjsNode.tsx`
- Flow behavior dependencies:
  `buildExpandedFlowGraph.ts`, `flowGraphView.ts`, `flowSearch.ts`,
  `nestedExpansion.ts`, and `revealUnit.ts`
- Test impact:
  existing flow-graph, expanded-flow, flow-search, nested-expansion,
  flow-view mapping, desktop extension, and web smoke tests remain the
  validation net. Add focused tests only if extraction creates a pure helper
  with behavior that is not already covered.
- Boundary decision:
  keep extracted code under the flow-viewer presentation area for PR4. Do not
  move React, XyFlow, EventBridge, or DOM scheduling responsibilities into
  domain/application layers.
- Breaking-change risk:
  low-to-medium internal refactor risk, concentrated around stale React
  callback dependencies, fit-to-view timing, search preservation across reveal
  and scope changes, and exported state-type churn for node/header/selector
  dependents.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility:
  shared diagnostics and flow-viewer code must stay browser-safe
- Desktop extension compatibility:
  editor diagnostics, flow-viewer events, and reveal behavior must stay stable
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- The feature documents one coherent refactoring objective with five ordered
  slices and explicit non-goals.
- Before structural refactors, characterization tests cover diagnostic
  messages, positions, counts, expanded-flow layout cases, and duplicate-edge
  prevention as planned in PR1.
- `buildSyntaxDiagnostics.ts`, `buildExpandedFlowGraph.ts`, and
  `FlowContents.tsx` each become thinner orchestration/composition files after
  their approved slices land.
- All approved slices preserve current desktop and web behavior.

## Non-Goals

- New editor-feedback rules or new flow-viewer features
- Parser grammar or normalized-model redesign
- Raising the minimum supported VS Code version
- Replacing mutable expanded-flow context with a full immutable redesign

## Open Questions

- None
