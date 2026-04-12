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
- [x] Extract optional array builders into a focused internal module
- [x] Extract inherited builders into a focused internal module
- [x] Extract rule-bearing parameter builders into a focused internal module
- [x] Extract root-jobnet-aware builders into a focused internal module
- [x] Extract transfer-operation `top1` to `top4` builders into a focused
      internal module
- [x] Keep `ParamFactory` as a thin facade by extracting the remaining
      required builders and absorbing runtime-default optional scalars into
      the optional-scalar family
- [ ] Revisit `Rule.ts` family naming in a dedicated slice so
      `sd`, `st`, `sy`, `ey`, `ln`, `cy`, `sh`, `shd`, `wt`, `wc`, and
      `cftd` can be renamed together if `schedule rule` terminology is
      adopted
- [x] Decide whether the end state should keep `ParamFactory` as a thin facade
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
- 2026-04-12: optional array builders now live in
  `optionalArrayParameterBuilders.ts`, with `ParamFactory` still exposing the
  public entry points for `ar`, `el`, `env`, `eun`, `jpoif`, `mladr`,
  `mlsbj`, and `mltxt`.
- 2026-04-12: inherited builders now live in
  `inheritedParameterBuilders.ts`, with `ParamFactory` still exposing the
  public entry points for `cl`, `md`, `ni`, `op`, `pr`, `sdd`, and `stt`.
- 2026-04-12: rule-bearing parameter builders now live in
  `ruleParameterBuilders.ts`, with `ParamFactory` still exposing the public
  entry points for `cftd`, `cy`, `ey`, `ln`, `sd`, `sh`, `shd`, `st`, `sy`,
  `wc`, and `wt`.
- 2026-04-12: this family is anchored in `Rule.ts`; the shared concept is
  parameters that carry a rule number, including root-default-aware cases such
  as `sd`.
- 2026-04-12: the `sd` builder/helper naming was corrected to describe
  root-default-aware behavior instead of implying that `sd` itself is limited
  to the root jobnet.
- 2026-04-12: the broader naming review concluded that this family is really
  about schedule-rule-bearing parameters, but that terminology change should
  happen in its own slice instead of being mixed into the extraction work.
- 2026-04-12: root-jobnet-aware builders now live in
  `rootJobnetParameterBuilders.ts`, with `ParamFactory` still exposing the
  public entry point for `rg`.
- 2026-04-12: transfer-operation builders now live in
  `transferOperationParameterBuilders.ts`, with `ParamFactory` still exposing
  the public entry points for `top1`, `top2`, `top3`, and `top4`.
- 2026-04-12: runtime-default optional scalar builders for `ncex`, `ncl`, and
  `ncs` now live in `optionalScalarParameterBuilders.ts`, so that family
  continues to group scalar builders by construction pattern rather than by
  domain concept.
- 2026-04-12: required scalar builders now live in
  `requiredScalarParameterBuilders.ts`, with `ParamFactory` still exposing
  the public entry point for `ty`.
- 2026-04-12: `ParamFactory.ts` now reads as a thin facade only; the branch
  decision is to keep that facade instead of collapsing to direct exports so
  existing callers retain the stable public import path defined in the
  feature spec.
