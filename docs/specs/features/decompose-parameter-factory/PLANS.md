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
- 2026-04-12: after `rg` joined the optional-scalar family, the main remaining
  classification mismatch is that `inheritedParameterBuilders.ts` still uses
  lookup strategy as its family boundary while other families are now
  described primarily by parameter-construction shape.
- 2026-04-12: keep that inherited-family question as an explicit follow-up
  instead of folding it into the already-completed thin-facade work, because
  it may require reshaping both scalar and array families together.
- 2026-04-12: the last required builder was extracted to
  `requiredScalarParameterBuilders.ts`.
- 2026-04-12: `ParamFactory` now delegates `ty` through the same facade style,
  leaving `ParameterFactory.ts` as a thin static export surface only.
- 2026-04-12: the end-state decision is to keep `ParamFactory` as that thin
  facade instead of collapsing to direct exports, because the feature spec
  treats the current import path as a compatibility contract.

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
7. Schedule-rule naming review as a dedicated follow-up slice
   Status: deferred from the current extraction slice on 2026-04-12
   Notes: if executed, rename `Rule.ts` and related helpers/builders together
   so the terminology consistently reflects schedule-rule-bearing parameters.
8. Final pass to keep `ParamFactory.ts` as a thin facade only if that still
   reads better than direct exports
   Status: completed on 2026-04-12
   Notes: the facade stays because it preserves the stable public API while
   keeping implementation ownership in focused internal modules.

## Validation

- code changes: `npm run qlty`, `npm test`, `npm run test:web`,
  `npm run build`
- docs-only changes: `npm run lint:md`
