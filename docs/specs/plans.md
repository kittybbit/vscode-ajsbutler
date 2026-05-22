# PLANS.md

## Purpose

This is the branch-level SDD planning index. Feature-local details live under
`docs/specs/features/<feature>/`; repository-level behavior contracts live
under `docs/requirements/use-cases/`.

Clear branch-specific notes when starting a new branch. Keep stable workflow
rules in `docs/specs/README.md`, not in this file.

## Current Decisions

- List search stays presentation-local until another non-table consumer needs
  the same matching semantics.
- JP1/AJS3 version 13 is the current normative target for new parameter and
  command semantics. The repository-supported parameter-alignment scope is now
  represented in use cases, so future manual-alignment work should start as a
  new focused feature only when it adds a supported parameter family, consumer,
  or product-version target.
- Read-only JP1/AJS WebAPI import stays beta until real JP1/AJS3 environment
  smoke verification and enough user feedback are recorded. Beta exit is
  feedback-gated and is not the next active implementation priority.
- Qlty-driven architecture refactoring is eligible to resume as the next
  maintainability priority after the completed flow-viewer refactor plan.
- Completed feature folders should be removed once their durable requirements
  are represented in `docs/requirements/use-cases/`, `docs/specs/roadmap.md`,
  or `docs/specs/architecture.md`.
- Desktop and web compatibility must stay explicit whenever bootstrap,
  preview, parsing, shared adapters, or runtime behavior change.

## Next Priority Tasks

1. Keep WebAPI import beta feedback and real-environment smoke evidence
   tracked, but defer beta exit until feedback is sufficient.
2. Select the next Qlty-driven architecture refactoring Slice-1B target after
   Slice-1B-R; `expandedFlowGraphLayout.ts` still reports high total
   complexity and needs a fresh approval gate before runtime work.
3. Keep compatibility risk visible for every shared or extension-runtime
   change.

## Active Feature Specs

- `docs/specs/features/import-definition-via-webapi/`:
  active beta feature with real-environment smoke verification still pending.
- `docs/specs/features/modernize-runtime-boundaries/`:
  active modernization follow-up for `UnitEntity` hash readiness and bundle
  pressure notes.
- `docs/specs/features/qlty-driven-architecture-refactoring/`:
  active maintainability-driven architectural refactoring based on Qlty
  complexity, duplication, and code-smell findings. Slice-1A completed the
  presentation-local flow-viewer controller split; Slice-1B-A completed a
  presentation-local `AjsNode` styling extraction; Slice-1B-B completed a
  presentation-local `Header` extraction; Slice-1B-C completed a
  presentation-local `FlowSelector` extraction; Slice-1B-D completed a focused
  `applyGrowthOffsets` extraction; Slice-1B-E completed a focused
  `resolveSiblingSubtreeCollisions` extraction; Slice-1B-F completed a focused
  `resolveLowerExpandedPanelIntrusions` extraction; Slice-1B-G completed a
  focused `buildExpandedPanelBounds` extraction; Slice-1B-H completed a focused
  `getUpperExpandedPanelMaxRight` extraction; Slice-1B-I completed a focused
  `relayoutExpandedScope` extraction; Slice-1B-J completed a focused
  `isDescendantOf` extraction; Slice-1B-K completed a focused
  `syncAnchoredDescendantOverrides` extraction; Slice-1B-L completed a focused
  `appendExpandedUnitEdges` extraction; Slice-1B-M completed a focused
  `revealVisibleNestedUnit` extraction; Slice-1B-N completed a focused
  `getDisplayPositions` extraction; Slice-1B-O completed a focused
  `includeNodeBounds` extraction; Slice-1B-P completed a focused
  `addVisibleNode` extraction; Slice-1B-Q completed a focused
  `ensureVisibleNestedNode` extraction; Slice-1B-R completed a focused
  `applyGrowthOffsets` extraction. The next Slice-1B target requires a fresh
  approval gate.

Completed feature-local folders were removed after their durable behavior
contracts were compressed into `docs/requirements/use-cases/`.

## Branch Validation

- docs-only changes: `rtk pnpm run qlty`; add `rtk pnpm run lint:md` when
  markdown structure or links need focused validation
- code changes: follow `docs/specs/README.md`
