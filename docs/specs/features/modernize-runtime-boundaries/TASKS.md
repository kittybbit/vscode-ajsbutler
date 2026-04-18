# TASKS: modernize-runtime-boundaries

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Completed

- [x] Document the modernization scope in SDD:
      `pnpm`, `flatted` removal, bundle-size reduction, dependency freshness, and
      `UnitEntity` hash replacement

## Remaining Follow-up

- [ ] Decide the review order between `pnpm` migration and viewer
      serialization cleanup
- [ ] Document the current `flatted` payload seams before replacement
- [ ] Define bundle-size measurement and acceptance thresholds
- [ ] Identify identity and persistence checks needed before changing the hash
      algorithm
- [ ] Update validation commands after package-manager migration lands

## Notes

- 2026-04-18: repository-level policy now states that dependencies should stay
  as current as practical, with explicit documentation when compatibility or
  ecosystem regressions require a hold.
