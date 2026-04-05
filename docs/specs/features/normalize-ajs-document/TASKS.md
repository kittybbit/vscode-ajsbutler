# TASKS: normalize-ajs-document

## Completed

- [x] Review use case: docs/requirements/use-cases/uc-normalize-ajs-document.md
- [x] Confirm SPECS.md
- [x] Implement normalized AJS document model
- [x] Add and update tests
- [x] Run relevant build and test checks for the slice

## Remaining Follow-up

- [ ] Move remaining wrapper-derived semantics into the normalized model
      where they are broadly reusable
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
- [x] Expose shared depth helpers so wrapper and normalized-model depth
      calculation no longer drift apart
- [x] Reuse shared wait-state helpers from normalized-model mapping so wrapper
      and normalized-model wait detection fully share the same rule
- [x] Reuse shared encoded-string helpers from normalized-model mapping so
      wrapper and normalized-model comment decoding fully share the same rule
- [x] Reuse shared dependency parsing helpers from normalized-model mapping so
      wrapper and normalized-model `ar` interpretation fully share the same
      rule
- [x] Reuse shared raw unit-parameter lookup helpers from normalized-model
      mapping so raw parameter filtering no longer lives only inside
      normalization
- [x] Reuse shared raw unit-parameter lookup helpers in normalized layout
      mapping so `el` lookup no longer filters parent parameters inline
- [x] Reuse shared unit-edge type normalization helpers from normalized mapping
      so `con` or `seq` coercion no longer lives only inside normalization
- [x] Document which semantics intentionally remain in application view adapters
