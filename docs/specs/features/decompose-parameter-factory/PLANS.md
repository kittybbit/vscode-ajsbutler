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
- 2026-04-12: `rg` now stays in `optionalScalarParameterBuilders.ts` through an
  inherited optional-scalar variant that resolves root-jobnet defaults at
  runtime.
- 2026-04-12: this keeps scalar families grouped by construction pattern even
  when the fallback value depends on root-jobnet state.
- 2026-04-12: transfer-operation builders were extracted to
  `transferOperationParameterBuilders.ts`.
- 2026-04-12: `ParamFactory` now delegates `top1`, `top2`, `top3`, and `top4`
  through a focused module, while the shared fallback behavior remains in
  `parameterHelpers.ts`.
- 2026-04-12: `ncex`, `ncl`, and `ncs` stay in the optional-scalar builder
  family, using a runtime-default variant so the decomposition still groups
  builders by construction pattern rather than by jobnet-connector semantics.
- 2026-04-12: `ParamFactory` now delegates those runtime-default optional
  scalars through `optionalScalarParameterBuilders.ts`, with facade-level
  regression coverage for passed-through default values.
- 2026-04-12: the last required builder was extracted to
  `requiredScalarParameterBuilders.ts`.
- 2026-04-12: `ParamFactory` now delegates `ty` through the same facade style,
  leaving `ParameterFactory.ts` as a thin static export surface only.
- 2026-04-12: the end-state decision is to keep `ParamFactory` as that thin
  facade instead of collapsing to direct exports, because the feature spec
  treats the current import path as a compatibility contract.
- 2026-04-12: inherited scalar builders now live in
  `optionalScalarParameterBuilders.ts`, inherited array builders now live in
  `optionalArrayParameterBuilders.ts`, and `inheritedParameterBuilders.ts`
  was removed.
- 2026-04-12: this resolves the last family-boundary mismatch inside the
  decomposition work by organizing both inherited and non-inherited builders
  around parameter-construction shape instead of lookup strategy.
- 2026-04-12: root-jobnet and connector-control default values are now
  centralized in `Defaults.ts`, while `parameterHelpers.ts` resolves only the
  application mode (`always` or `root-jobnet-only`) so default ownership and
  default-application rules are structurally consistent.
- 2026-04-12: connector-control defaults now use the same per-parameter map
  shape as root-jobnet defaults at the call-site level, but the defaults
  themselves now live in the flat `DEFAULTS` table instead of nested
  sub-objects, so value ownership stays with the parameter definitions.
- 2026-04-12: the dedicated terminology slice renamed `Rule.ts` to
  `ScheduleRule.ts` and aligned the shared interface plus helper/builder names
  around `schedule rule` terminology while preserving the `ParamFactory`
  facade and parameter parsing behavior.

## Proposed Slice Order

1. Optional scalar builders
   Status: completed on 2026-04-12
2. Optional array builders
   Status: completed on 2026-04-12
3. Inherited builders
   Status: completed on 2026-04-12
4. Rule-bearing parameter builders
   Status: completed on 2026-04-12
5. Root-jobnet default handling within optional scalar builders
   Status: completed on 2026-04-12
   Notes: `rg` no longer needs a dedicated family because its distinct concern
   is runtime default resolution, not a different builder shape.
6. Transfer-operation builders
   Status: completed on 2026-04-12
7. Revisit inherited-family classification against scalar/array shape
   Status: completed on 2026-04-12
   Notes: inherited scalar builders now reuse the scalar family `inherit`
   option, and inherited array builders now reuse the array family through
   the same construction-pattern axis.
8. Schedule-rule naming review as a dedicated follow-up slice
   Status: completed on 2026-04-12
   Notes: `Rule.ts` and related helpers/builders were renamed together so the
   terminology now consistently reflects schedule-rule-bearing parameters.
9. Final pass to keep `ParamFactory.ts` as a thin facade only if that still
   reads better than direct exports
   Status: completed on 2026-04-12
   Notes: the facade stays because it preserves the stable public API while
   keeping implementation ownership in focused internal modules.

## Validation

- code changes: `npm run qlty`, `npm test`, `npm run test:web`,
  `npm run build`
- docs-only changes: `npm run lint:md`
