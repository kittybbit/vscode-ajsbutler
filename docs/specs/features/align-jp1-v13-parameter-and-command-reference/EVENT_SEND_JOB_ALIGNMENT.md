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
  range validation, event arrival runtime behavior, broader event receiving
  job semantics, and any validation beyond the focused `evsrt=y` / missing
  `evhst` semantic diagnostic

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

## Delivered Alignment

- Omitted JP1 event sending job `evsrc` now resolves to `10` through
  `DEFAULTS.Evsrc`.
- Reference impact verification found `ParamFactory.evsrc` is consumed by
  `Evsj`; `Revsj` receives the same behavior through inheritance.
- Normalized unit-list projection remains raw key/value projection and does not
  synthesize omitted event sending job defaults.
- Unit-list group 14 JP1 event sending job arrival-check projection now
  displays the existing domain defaults for omitted `evssv`, `evsrt`,
  `evspl`, and `evsrc` values. Explicit normalized values remain preserved,
  and non-event-sending jobs do not synthesize these defaults.

## EVHST Requiredness Diagnostics

### Current Behavior

- `Evsj` / `Revsj` expose `evhst` and `evsrt` through `ParamFactory`.
- `ParamFactory.evsrt` resolves omitted `evsrt` to `n`.
- Explicit `evsrt=y` without `evhst` is preserved as raw parsed data.
- Unit-list group 14 projects `evhst` from normalized raw key/value data, so
  missing `evhst` remains visible as an empty table value.

### Delivered Behavior

- Report a semantic diagnostic when an explicit JP1 event sending job or
  recovery JP1 event sending job has effective `evsrt=y` and omits `evhst`.
- Point the diagnostic at the explicit `evsrt` parameter because the required
  `evhst` parameter has no source location when omitted.
- Keep omitted `evsrt=n` without `evhst` non-diagnostic.
- Keep raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation unchanged.
- Report diagnostics through the existing application editor-feedback DTO so
  desktop and web hosts share the same rule.

### Impact

- User-visible diagnostics change for syntactically valid JP1/AJS documents
  containing explicit event-arrival checking without an event destination host.
- Existing parsed parameter source-location metadata can point diagnostics at
  explicit `evsrt`.
- The application diagnostics boundary remains the owner of focused semantic
  parameter feedback; parser grammar and domain wrapper values remain raw.

### Diagnostic Alternatives

- Preserve missing `evhst` silently and leave the matrix gap visible.
- Synthesize or rewrite `evhst` in domain/list output, rejected because
  manual-invalid raw input should remain inspectable.
- Add `evhst` byte-length, macro-variable, or `evspl` / `evsrc` range
  diagnostics in the same slice, rejected because that broadens the behavior
  and regression surface.

## Alternatives

- Leave `DEFAULTS.Evsrc` as `0` and record the event sending job check-count
  mismatch as unresolved.
- Change `DEFAULTS.Evsrc` globally to `10`; this is only acceptable if the
  reference impact check confirms no other unit family depends on the current
  generic `0` default.
- Build a full parameter coverage matrix before changing this default; deferred
  because the roadmap favors small category-level slices with focused evidence.

## Follow-up

- Add range validation for `evspl` and `evsrc` only after invalid JP1/AJS
  parameter handling is defined across domain and diagnostics.
