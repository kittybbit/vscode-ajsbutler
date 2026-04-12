# PLANS: decompose-parameter-factory

## Objective

Make `ParameterFactory.ts` reviewable and lower-risk by decomposing it into
focused builder modules while preserving behavior.

## Scope

- `src/domain/models/parameters/ParameterFactory.ts`
- new internal builder modules under `src/domain/models/parameters/`
- focused tests for extracted builder families
- sync updates to `docs/specs/plans.md` and `docs/specs/roadmap.md`

## Risks To Control

- Silent parameter-default drift
- Accidental reordering of rule-based arrays
- Breaking root-jobnet-only defaults
- Over-extraction that only moves code without clarifying ownership

## Slice Strategy

1. Document the target decomposition and slice order
2. Extract one builder family at a time behind the existing `ParamFactory`
   facade
3. Add or update focused tests for that family
4. Run the full serial validation baseline
5. Re-sync feature `TASKS.md`, branch `plans.md`, and `roadmap.md`

## Current Status

- 2026-04-12: optional scalar builders were extracted to
  `optionalScalarParameterBuilders.ts`.
- 2026-04-12: `ParamFactory` now delegates that family through a thin facade.
- 2026-04-12: focused regression tests were added for explicit value,
  defaulted value, and the legacy `wth` to `wt` mapping.
- 2026-04-12: optional array builders were extracted to
  `optionalArrayParameterBuilders.ts`.
- 2026-04-12: `ParamFactory` now delegates optional array builders through the
  same facade style, with focused regression tests for explicit and missing
  array values.
- 2026-04-12: inherited builders were extracted to
  `inheritedParameterBuilders.ts`.
- 2026-04-12: `ParamFactory` now delegates inherited scalar and array builders
  through the same facade style, with focused regression tests for inherited
  values and inherited flags.
- 2026-04-12: rule-bearing parameter builders were extracted to
  `ruleParameterBuilders.ts`.
- 2026-04-12: this family is defined around `Rule.ts`, including both
  schedule-rule-aligned parameters, root-default-aware rule parameters such as
  `sd`, and other rule-bearing parameters such as `ln`.
- 2026-04-12: the `sd` builder naming was clarified so this family no longer
  implies `sd` is root-jobnet-only; the root-only concern remains limited to
  its default fallback behavior.
- 2026-04-12: a broader naming review confirmed that `Rule.ts` and this
  builder family actually model schedule-rule-bearing parameters, covering
  `sd`, `st`, `sy`, `ey`, `ln`, `cy`, `sh`, `shd`, `wt`, `wc`, and `cftd`.
- 2026-04-12: the branch decision is to defer any broader rename to a
  dedicated follow-up slice, so this decomposition slice can preserve
  behavior and avoid mixing extraction with a cross-cutting terminology
  change.
- 2026-04-12: root-jobnet-aware builders were extracted to
  `rootJobnetParameterBuilders.ts`.
- 2026-04-12: `ParamFactory` now delegates `rg` through a focused module that
  owns the root-jobnet scalar default concern.

## Proposed Slice Order

1. Optional scalar builders
   Status: completed on 2026-04-12
2. Optional array builders
   Status: completed on 2026-04-12
3. Inherited builders
   Status: completed on 2026-04-12
4. Rule-bearing parameter builders
   Status: completed on 2026-04-12
5. Root-jobnet-aware builders
   Status: completed on 2026-04-12
6. Transfer-operation builders
7. Schedule-rule naming review as a dedicated follow-up slice
   Status: deferred from the current extraction slice on 2026-04-12
   Notes: if executed, rename `Rule.ts` and related helpers/builders together
   so the terminology consistently reflects schedule-rule-bearing parameters.
8. Final pass to keep `ParamFactory.ts` as a thin facade only if that still
   reads better than direct exports

## Validation

- code changes: `npm run qlty`, `npm test`, `npm run test:web`,
  `npm run build`
- docs-only changes: `npm run lint:md`
