# Feature Specification: flow-layout-determinism

## Purpose

Define a deterministic expanded-flow layout contract so nested expansion order
does not change the final placement of visible nodes or expanded panels.

## Origin

- Source use case:
  `docs/requirements/use-cases/uc-build-flow-graph.md`
- Related plan:
  `docs/specs/plans.md`

## Requirements

- Expanded layout must be recomputed deterministically from the selected scope
  and the full expanded-unit set, not from the most recently expanded unit.
- Expansion processing order must be stable by
  `depth`, `layout.v`, `layout.h`, `absolutePath`.
- Each expanded unit must be represented by an occupied rectangle that covers
  the normal node rectangle, the expanded panel rectangle, and any expanded
  descendant panels.
- Sibling subtrees under the same container must not overlap by occupied
  rectangle.
- Collision resolution must move only the affected right-side, lower-side, or
  lower-right area relative to the expansion source.
- Collision resolution must move rightward or downward only; it must not pull
  nodes or panels back toward the upper-left.
- Collision resolution must move entire subtrees so descendant relative
  positions stay stable.
- Bounds changes must continue to let the viewer fit the full visible graph.

## Behavioral Scenarios (optional)

```gherkin
Feature: Deterministic expanded flow layout

Scenario: Expansion order does not change final layout
  Given the same normalized flow graph input
  And the same set of expanded nested units
  When the units are expanded in order A then B
  And the layout is built again for the same expanded set in order B then A
  Then `positionOverrides` are identical
  And `nodeDecorations` are identical

Scenario: Expanded sibling subtrees avoid overlap
  Given a visible flow graph with expanded sibling subtrees in one container
  When expanded layout is built
  Then expanded panels do not overlap each other
  And expanded panels do not overlap visible nodes from sibling subtrees

Scenario: Collision resolution preserves unaffected upper-left regions
  Given a visible flow graph with an expanded subtree
  When collision resolution grows the occupied area of that subtree
  Then only the affected right-side, lower-side, or lower-right scope moves
  And unrelated upper-left nodes do not move
```

## Architecture

- Domain:
  none
- Application:
  the flow-graph use case owns deterministic graph content and expansion-state
  outputs that presentation can render predictably
- Presentation:
  `src/ui-component/editor/ajsFlow/buildExpandedFlowGraph.ts` remains the
  expanded-layout orchestration point for UI-local coordinates, but it must
  rebuild layout from the expanded set, delegate occupied-box and collision
  calculations to focused helpers, and avoid order-sensitive
  `activeExpandedUnitId` collision decisions
- Infrastructure:
  none

## Impact Analysis

### Dependency Impact

- Affected callers, components, commands, adapters, tests, and docs:
  flow-viewer expanded layout calculation, flow-viewer rendering/fit behavior,
  search/reveal regression coverage, and SDD documents
- Propagation decision:
  preserve graph DTO shape and viewer contracts while tightening the expanded
  layout algorithm around deterministic occupied-box resolution

### Breaking Change Analysis

- User-visible behavior:
  nested expansion layout becomes deterministic and non-overlapping by
  contract
- API/DTO/schema compatibility:
  no DTO shape change is intended; only the meaning of layout outputs is
  tightened
- VS Code/web extension compatibility:
  must remain unchanged
- Changed scenarios:
  add deterministic expanded-layout scenarios to the flow-graph use case

### Alternative Considerations

- Keep order-sensitive layout and patch collisions incrementally:
  rejected because identical expanded sets can still produce different layouts
- Recompute by active expansion path only:
  rejected because it preserves the current order dependence
- Rewrite the entire flow viewer:
  rejected because the required change is layout determinism, not a broader UI
  redesign

### Approval Impact Decisions

- Approval evidence owner:
  TASKS.md `Human Approval`
- Scope changes requiring re-approval:
  DTO shape changes, search/reveal/fitView behavior changes, non-doc changes
  outside expanded-flow layout and its tests, dependency upgrades, or
  `engines.vscode` changes

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode`.
- Web extension compatibility:
  deterministic layout logic must stay browser-safe
- Desktop extension compatibility:
  flow-viewer rendering, search, reveal, and fit behavior must remain stable
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- The flow-graph use case documents deterministic expansion ordering,
  occupied-rectangle semantics, subtree-based collision resolution, and
  fit-view continuity.
- The implementation plan names `LayoutBox`, `LayoutItem`, occupied-box
  calculation, container collision resolution, subtree moves, and regression
  coverage for order independence and non-overlap.
- Future implementation must prove that A→B and B→A expansion sequences
  produce identical `positionOverrides` and `nodeDecorations`.

## Non-Goals

- ReactFlow component redesign
- Search or reveal feature expansion
- Parser or normalized-model changes
- Left/up compaction or layout minimization beyond the approved right/down
  collision policy

## Open Questions

- None
