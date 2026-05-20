# Feature Plan: qlty-driven-architecture-refactoring

## Objective

Reduce architectural complexity, duplication, and maintainability risk by
converting Qlty findings into small, behavior-preserving refactoring slices.

The current Qlty findings should become architectural feedback instead of
remaining passive metrics.

## Scope

- Qlty check findings
- Qlty metrics findings
- Qlty smell findings
- UI orchestration boundaries
- Application orchestration boundaries
- Domain helper boundaries

## Out Of Scope

- Product behavior changes
- Parser grammar changes
- Generated parser changes
- Dependency upgrades
- Raising `engines.vscode`

## Impact Summary

- Change targets:
  `src/ui-component`, `src/application`, `src/domain`, and SDD documents
- Affected features:
  flow viewer, unit-list projection, command builders, helper orchestration
- Affected tests:
  desktop extension tests, web extension tests, build validation
- Related docs:
  `docs/specs/plans.md`, `docs/specs/roadmap.md`
- Breaking-change risk:
  medium; behavior-preserving refactoring across runtime boundaries

## Approval Scope Summary

- Approval status:
  see TASKS.md `Human Approval`
- Approved scope:
  none while approval is pending
- Scope guard:
  stop and request additional approval before changing anything outside the
  approved scope

## Milestones

1. Slice-0 repository hygiene and baseline cleanup
2. Slice-1A flow-viewer controller responsibility split
3. Slice-1B flow-viewer layout/component complexity reduction
4. Slice-2 application orchestration reduction
5. Slice-3 domain helper simplification

## Completed Slices

Slice-1A, Slice-1B-A, and Slice-1B-B are complete.

- Target:
  extract `AjsNode` styling decisions from `buildNodeSxProps` into
  presentation-local helpers without changing flow-viewer behavior.
- Reason:
  targeted Qlty smells identify `buildNodeSxProps` as the highest complexity
  node-component function, and it is referenced only by flow node components.
- Boundary:
  keep parser, generated artifacts, application flow graph DTOs, node data
  shape, VS Code compatibility, and `engines.vscode` unchanged.
- Expected impact:
  lower Qlty complexity for `AjsNode.tsx` while preserving the Slice-1A
  controller split.
- Status:
  `buildNodeSxProps` remains exported through `AjsNode.tsx`, with styling
  decisions extracted to presentation-local helpers in
  `src/ui-component/editor/ajsFlow/nodes/nodeSxProps.ts`.
  Slice-1B-B kept `Header` consumed only by `FlowContents`, with breadcrumbs,
  search field state/shortcut handling, expand-all labels, and current-unit
  badge decisions extracted into presentation-local helpers/subcomponents in
  `Header.tsx`.

## Current Slice Candidate

Slice-1B-C is the next candidate and requires separate approval before runtime
work starts.

- Target:
  extract `FlowSelector` tree rendering and drawer presentation decisions into
  presentation-local helpers or subcomponents without changing flow-viewer
  behavior.
- Reason:
  targeted Qlty smells identify `FlowSelector` with high component complexity
  (cognitive 38) and `renderUnitEntity` complexity; it is consumed only by
  `FlowContents`.
- Boundary:
  keep parser, generated artifacts, application flow graph DTOs, node data
  shape, VS Code compatibility, and `engines.vscode` unchanged.
- Expected impact:
  lower Qlty complexity for `FlowSelector.tsx` while preserving drawer open,
  width observation, current unit selection, and ancestor expansion behavior.

## Risks To Control

- Over-extraction may reduce readability
- Complexity reduction may accidentally change runtime behavior
- Qlty optimization may diverge from architectural clarity

## Validation

- code changes:
  `rtk pnpm run qlty`, `rtk pnpm test`,
  `rtk pnpm run test:web`, `rtk pnpm run build`
- docs-only changes:
  `rtk pnpm run qlty`; add `rtk pnpm run lint:md` when useful
