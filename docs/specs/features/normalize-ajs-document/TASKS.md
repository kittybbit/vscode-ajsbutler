# TASKS: normalize-ajs-document

## Sync Rule

- Update this file in the same commit whenever one task or follow-up is
  completed, re-scoped, or intentionally dropped.
- If that change affects branch priorities or repository sequencing, update
  `docs/specs/plans.md` and `docs/specs/roadmap.md` in the same commit.

## Completed

- [x] Review use case: docs/requirements/use-cases/uc-normalize-ajs-document.md
- [x] Confirm SPECS.md
- [x] Implement normalized AJS document model
- [x] Add and update tests
- [x] Run relevant build and test checks for the slice

## Remaining Follow-up

- [ ] Revisit normalized-model extraction only when a wrapper rule is both
      broadly reusable and still duplicated outside the owning wrapper
- [ ] Prefer fixture-backed normalization coverage for remaining edge cases such
      as encoding-sensitive documents and larger definitions, instead of
      creating new abstractions without repeated consumers
- [x] Keep adapter-boundary docs aligned when a semantic intentionally remains
      wrapper-local or application-local, so future slices do not re-open
      already settled extraction decisions
- [x] Expose normalized helpers for parent, ancestor, and root jobnet lookup
      so application slices stop repeating wrapper-era navigation logic
- [x] Expose normalized helpers for direct parameter lookup, repeated-value
      lookup, and first-ancestor inherited parameter lookup so application
      slices stop repeating wrapper-era parameter traversal logic
- [x] Expose shared helpers for reusable transfer-operation defaults so
      `top1` to `top4` fallback behavior stops living only in
      `ParameterFactory`
- [x] Expose shared helpers for reusable sorted rule-parameter mapping so
      simple rule arrays stop sorting directly inside `ParameterFactory`
- [x] Expose shared helpers for connector-control default resolution so group
      and root-jobnet wrappers stop hard-coding `ncl`, `ncs`, and `ncex`
      fallback values
- [x] Expose shared helpers for inherited scalar and array parameter building
      so simple inherited lookup wiring stops repeating in `ParameterFactory`
- [x] Expose shared helpers for root-jobnet-aware scalar and rule-array
      building so `rg` and `sd` stop assembling root defaults directly in
      `ParameterFactory`
- [x] Expose a shared helper for `top1` to `top4` parameter building so
      transfer-operation builder wiring stops repeating in `ParameterFactory`
- [x] Expose a shared helper for required scalar parameters so `ty` stops
      handling the required-or-throw path inline in `ParameterFactory`
- [x] Expose a shared helper for simple optional scalar parameters so trivial
      `checkAndGet(...)` plus `new Xxx(...)` builders stop repeating in
      `ParameterFactory`
- [x] Expose a shared helper for simple optional array parameters so trivial
      `checkAndGetArray(...)` plus `params.map((param) => new Xxx(param))`
      builders stop repeating in `ParameterFactory`
- [x] Expose a shared helper for defaultable scalar parameters so `ncl`,
      `ncs`, and `ncex` stop forwarding caller-supplied defaults inline in
      `ParameterFactory`
- [x] Expose a shared helper for sd-aligned empty-rule parameters so `cy`,
      `ey`, `sh`, and `sy` stop constructing `${rule},` fallbacks inline in
      `ParameterFactory`
- [x] Expose a shared helper for sd-aligned default-rule parameters so
      `cftd`, `shd`, `st`, `wc`, and `wt` stop constructing
      `${rule},<default>` fallbacks inline in `ParameterFactory`
- [x] Remove the final `#checkAndGet` and `#checkAndGetArray` wrapper usage so
      `ParameterFactory` depends on shared helper paths consistently
- [x] Expose shared sd resolution helpers so sd-aligned parameter builders stop
      calling `unit.params("sd")` directly in `ParameterFactory`
- [x] Expose shared unit-relation helpers so `UnitEntity` stops duplicating
      sibling `ar` lookup and relation-to-unit mapping logic
- [x] Expose shared recovery-type helpers so wrapper and normalized-model
      recovery semantics no longer drift apart
- [x] Expose shared layout helpers so wrapper and normalized-model `el`
      interpretation no longer drift apart
- [x] Expose shared defined-parameter helpers so wrapper prototype inspection no
      longer lives only inside `UnitEntity`
- [x] Expose shared wait-state helpers so wrapper classes stop duplicating
      `eun`-based `hasWaitedFor` checks
- [x] Expose shared root-jobnet helpers so wrapper and normalized-model
      root-jobnet detection no longer drift apart
- [x] Expose shared schedule-state helpers so wrapper and normalized-model
      schedule detection no longer drift apart
- [x] Expose shared group-state helpers so wrapper and normalized-model `gty`
      interpretation no longer drift apart
- [x] Expose shared group-week helpers so wrapper group weekday checks stop
      duplicating `op` and `cl` interpretation logic
- [x] Expose shared priority helpers so wrapper classes stop routing priority
      resolution through a misc utility module
- [x] Expose a shared `PrioritizableUnit` capability so wrapper priority
      semantics remain composition-oriented without adding another base class
- [x] Expose shared depth helpers so wrapper and normalized-model depth
      calculation no longer drift apart
- [x] Reuse shared wait-state helpers from normalized-model mapping so wrapper
      and normalized-model wait detection fully share the same rule
- [x] Reuse shared encoded-string helpers from normalized-model mapping so
      wrapper and normalized-model comment decoding fully share the same rule
- [x] Reuse shared unit-relation parsing helpers from normalized-model mapping
      so wrapper and normalized-model `ar` interpretation fully share the same
      rule
- [x] Reuse shared raw unit-parameter lookup helpers from normalized-model
      mapping so raw parameter filtering no longer lives only inside
      normalization
- [x] Reuse shared raw unit-parameter lookup helpers in normalized layout
      mapping so `el` lookup no longer filters parent parameters inline
- [x] Reuse shared relation-type normalization helpers from normalized mapping
      so `con` or `seq` coercion no longer lives only inside normalization
- [x] Extract shared normalize-unit helpers so normalized type, group, comment,
      layout, root-jobnet, schedule, and wait derivation no longer live only
      inside `normalizeAjsDocument.ts`
- [x] Extract shared normalize-relation helpers so `ar` relation parsing,
      child resolution, and warning generation no longer live only inside
      `normalizeAjsDocument.ts`
- [x] Extract shared normalize-warning helpers so warning payload construction
      no longer lives inline in normalization helpers
- [x] Extract a shared normalize-unit builder so `AjsUnit` DTO assembly no
      longer lives inline in `normalizeAjsDocument.ts`
- [x] Extract a shared normalize-document-tree helper so recursive
      normalization no longer lives inline in `normalizeAjsDocument.ts`
- [x] Align normalize-warning codes and messages with relation terminology so
      warning payloads match the normalized relation model
- [x] Reorganize normalized helper modules under
      `src/domain/models/ajs/normalize/` so file placement and naming are
      consistent across unit, relation,
      warning, builder, and tree concerns
- [x] Reuse shared wait-state helpers through structural wrapper shapes so
      repeated `hasWaitedFor` behavior no longer requires dedicated wrapper
      base classes while `hasSchedule` remains local to `N`
- [x] Audit remaining wrapper semantics after `WaitableUnit` and
      `PrioritizableUnit` so future capability extraction stays focused on
      real cross-unit behavior instead of unit-local rules
- [x] Keep `G` planning, weekday-state, and connector-control defaults as
      group-local wrapper behavior with focused wrapper tests instead of
      introducing another capability interface
- [x] Keep `N` root-jobnet detection, schedule ownership, and connector-control
      defaults as jobnet-local wrapper behavior with focused wrapper tests
      instead of introducing another capability interface
- [x] Confirm that, after `WaitableUnit`, `PrioritizableUnit`, `G`, and `N`,
      the remaining wrappers are mostly typed parameter-access surfaces rather
      than additional strong unit-local semantics that need new abstraction
- [x] Remove generic `UnitEntity` parameter lookup and debug serialization
      helpers now that remaining relation access can use typed wrapper APIs
- [x] Remove dead wrapper-era `UnitEntity` APIs once flow and list consumers no
      longer depend on wrapper navigation, layout, or parameter-introspection
      getters
- [x] Document `UnitEntity` core responsibilities so future refactors preserve
      base-wrapper identity and tree mechanics while avoiding wrapper bloat
- [x] Document which semantics intentionally remain in application view adapters
- [x] Document the current capability/shared/local wrapper semantics matrix so
      future refactors use the same extraction criteria
