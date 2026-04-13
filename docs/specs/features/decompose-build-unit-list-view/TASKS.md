# TASKS: decompose-build-unit-list-view

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Completed

- [x] Define the feature boundary and decomposition goal before code changes
- [x] Identify initial projection families and a low-risk extraction order

## Planned Slices

- [x] Extract `group6` calendar projection into a focused helper module
- [x] Extract shared priority projection for `group7` and `group11`
- [ ] Extract `group10` schedule projection into a focused helper module
- [ ] Revisit whether linked-unit projection should become its own helper
      family or stay near the main row builder after the first extractions
- [ ] Decide whether the end state should keep one coordinator file or
      collapse to direct helper composition from a smaller entry module

## Notes

- 2026-04-12: `buildUnitListView.ts` is still one of the larger handwritten
  application files and now acts as both traversal coordinator and group DTO
  projection hub.
- 2026-04-12: the safest first slices are the families that already have
  concentrated tests or helper dependencies, especially `group6`, `group7`,
  `group11`, and `group10`.
- 2026-04-12: this decomposition must keep the current `UnitListRowView`
  contract stable so table rendering and CSV export do not need follow-up
  rewiring in the same slice.
- 2026-04-12: `group6` calendar projection now lives in
  `src/application/unit-list/buildUnitListGroup6View.ts`, with focused
  regression coverage in `src/test/suite/buildUnitListGroup6View.test.ts`.
- 2026-04-13: shared priority projection for `group7` and `group11` now lives
  in `src/application/unit-list/buildUnitListPriorityViews.ts`, with focused
  regression coverage in `src/test/suite/buildUnitListPriorityViews.test.ts`.
