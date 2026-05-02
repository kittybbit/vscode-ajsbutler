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
  start from Slice-0 repository hygiene only
- Scope guard:
  stop and request additional approval before changing anything outside the
  approved scope

## Milestones

1. Slice-0 repository hygiene and baseline cleanup
2. Slice-1 flow-viewer complexity reduction
3. Slice-2 application orchestration reduction
4. Slice-3 domain helper simplification

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
