# TASKS: refactor-unit-model-classes

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If the change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Completed

- [x] Confirm this feature aligns with `docs/specs/plans.md` and
      `docs/specs/roadmap.md`.
- [x] Create feature-level SPECS and PLANS.
- [x] Review wrapper class duplication across `src/domain/models/units/`.
- [x] Identify common extraction points for parameter getters and helper logic.
- [x] Implement shared wrapper abstractions while preserving unit-local rules.
- [x] Add regression tests covering shared behavior and wrapper-specific cases.
- [x] Run validation: `npm run qlty`, `npm test`, `npm run test:web`,
      `npm run build`.

## Remaining
- [ ] None.

## Notes

- This feature is the implementation slice for the roadmap item:
  "Refactor unit model classes to reduce code duplication across similar
  unit types."
- Keep wrapper refactor selective: extract only genuinely shared semantics.
