# TASKS: decompose-parameter-factory

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Completed

- [x] Define the feature boundary and decomposition goal before code changes
- [x] Identify builder families and an initial extraction order

## Planned Slices

- [x] Extract optional scalar builders into a focused internal module
- [ ] Extract optional array builders into a focused internal module
- [ ] Extract inherited builders into a focused internal module
- [ ] Extract SD-aligned builders into a focused internal module
- [ ] Extract root-jobnet-aware builders into a focused internal module
- [ ] Extract transfer-operation `top1` to `top4` builders into a focused
      internal module
- [ ] Decide whether the end state should keep `ParamFactory` as a thin facade
      or collapse to direct exports

## Notes

- 2026-04-12: `ParameterFactory.ts` is still the largest handwritten source
  file in the repository at roughly 2300 lines, so decomposition should be
  tracked as its own feature rather than treated as an incidental cleanup.
- 2026-04-12: the safest first slices are the families that already delegate
  almost entirely to `parameterHelpers.ts`; they can reduce file size without
  reopening parameter semantics.
- 2026-04-12: optional scalar builders now live in
  `optionalScalarParameterBuilders.ts`, with `ParamFactory` preserved as the
  public facade for that family.
