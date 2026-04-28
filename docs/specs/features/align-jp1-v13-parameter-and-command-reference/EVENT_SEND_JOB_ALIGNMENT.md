# JP1 Event Sending Job Alignment

## Purpose

Record the JP1/AJS3 version 13 alignment slice for JP1 event sending job
arrival-check defaults and value-shape ownership.

This document focuses on the currently modeled JP1 event sending job
parameters `evssv`, `evsrt`, `evspl`, and `evsrc` for `Evsj` / `Revsj`.

## Normative Reference

- Product/version: JP1/Automatic Job Management System 3 version 13
- Manual section: Command Reference, `5.2.17 JP1 event sending job definition`
- Source URL:
  <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4900e/AJSO0231.HTM>

## Slice Boundary

- Domain seams:
  `src/domain/models/units/Evsj.ts`,
  `src/domain/models/parameters/optionalScalarParameterBuilders.ts`,
  `src/domain/models/parameters/Defaults.ts`, and a possible focused event
  sending job helper
- Existing consumers:
  `src/domain/models/units/Evsj.ts`,
  `src/domain/models/units/Revsj.ts`, and
  `src/application/unit-list/buildUnitListRemainingGroups.ts`
- Regression evidence:
  `src/test/suite/parameterFactory.test.ts` and
  `src/test/suite/buildUnitListView.test.ts`; add focused helper/facade
  evidence if a dedicated event sending job seam is introduced
- Out of scope:
  parser grammar changes, command generation, byte-length validation, numeric
  range validation, event arrival runtime behavior, event destination host
  requiredness diagnostics, and broader event receiving job semantics

## Investigation Notes

- `Evsj` / `Revsj` expose `evssv`, `evsrt`, `evspl`, and `evsrc` through
  `ParamFactory`, and those factory entries currently use the generic optional
  scalar builder path.
- `DEFAULTS.Evssv`, `DEFAULTS.Evsrt`, and `DEFAULTS.Evspl` already match the
  manual defaults for event severity, arrival-check flag, and check interval.
- `DEFAULTS.Evsrc` was `0`, while the JP1 event sending job definition says
  omitted `evsrc` is assumed as `10`.
- `buildUnitListRemainingGroups.ts` projects `evssv`, `evsrt`, `evspl`, and
  `evsrc` from normalized unit parameters by key, so a default change in the
  domain wrapper path does not automatically change normalized list projection
  unless that path is intentionally updated.

## Expected Behavior If Approved

- Explicit `evssv`, `evsrt`, `evspl`, and `evsrc` values for `Evsj` /
  `Revsj` are preserved.
- Omitted JP1 event sending job `evsrc` resolves to `10` through the approved
  event sending job seam.
- Omitted `evssv`, `evsrt`, and `evspl` remain aligned with their existing
  manual defaults: `no`, `n`, and `10`.
- Unit-list projection behavior is either preserved as raw normalized data or
  updated explicitly if the approved scope includes default-aware projection.

## Delivered Alignment

- Omitted JP1 event sending job `evsrc` now resolves to `10` through
  `DEFAULTS.Evsrc`.
- Reference impact verification found `ParamFactory.evsrc` is consumed by
  `Evsj`; `Revsj` receives the same behavior through inheritance.
- Normalized unit-list projection remains raw key/value projection and does not
  synthesize omitted event sending job defaults.

## Alternatives

- Leave `DEFAULTS.Evsrc` as `0` and record the event sending job check-count
  mismatch as unresolved.
- Change `DEFAULTS.Evsrc` globally to `10`; this is only acceptable if the
  reference impact check confirms no other unit family depends on the current
  generic `0` default.
- Build a full parameter coverage matrix before changing this default; deferred
  because the roadmap favors small category-level slices with focused evidence.

## Follow-up

- Decide whether normalized unit-list projection should display JP1 event
  sending job defaults or continue showing only explicit normalized
  parameters.
- Revisit `evhst` requiredness when `evsrt=y` only after diagnostics behavior
  is explicitly scoped.
- Add range validation for `evspl` and `evsrc` only after invalid JP1/AJS
  parameter handling is defined across domain and diagnostics.
