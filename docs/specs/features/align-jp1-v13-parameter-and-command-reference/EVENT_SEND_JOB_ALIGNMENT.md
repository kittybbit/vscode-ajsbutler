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

### Current Range Behavior

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

### Range Impact

- User-visible diagnostics change for syntactically valid JP1/AJS documents
  containing explicit event-arrival checking without an event destination host.
- Existing parsed parameter source-location metadata can point diagnostics at
  explicit `evsrt`.
- The application diagnostics boundary remains the owner of focused semantic
  parameter feedback; parser grammar and domain wrapper values remain raw.

### Range Diagnostic Alternatives

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

## EVSPL / EVSRC Range Diagnostics

### Current EVSID Behavior

- `Evsj` / `Revsj` expose `evspl` and `evsrc` through `ParamFactory`.
- `ParamFactory.evspl` and `ParamFactory.evsrc` preserve explicit values as raw
  strings and apply the existing aligned default `10` only when the parameter
  is omitted.
- `buildSyntaxDiagnostics.ts` already owns focused semantic diagnostics for
  JP1 event sending jobs, but it currently checks only the `evsrt=y` /
  missing-`evhst` rule.
- Explicit out-of-range `evspl` / `evsrc` values are currently preserved
  without editor feedback.

### Proposed EVSID Slice

- Report a semantic diagnostic when an explicit JP1 event sending job or
  recovery JP1 event sending job sets `evspl` outside the JP1/AJS3 v13 range
  `3..600` seconds.
- Report a semantic diagnostic when an explicit JP1 event sending job or
  recovery JP1 event sending job sets `evsrc` outside the JP1/AJS3 v13 range
  `0..999` checks.
- Keep omitted `evspl` / `evsrc` values non-diagnostic because the existing
  defaults already align to `10`.
- Point diagnostics at the explicit out-of-range parameter so parser output,
  domain wrappers, normalized parameters, and downstream consumers remain
  unchanged.
- Report diagnostics through the existing application editor-feedback DTO so
  desktop and web hosts continue to share the same rule.

### Delivered Range Behavior

- Explicit JP1 event sending job and recovery JP1 event sending job `evspl`
  values now report a semantic diagnostic when outside `3..600` seconds.
- Explicit JP1 event sending job and recovery JP1 event sending job `evsrc`
  values now report a semantic diagnostic when outside `0..999` checks.
- Omitted `evspl` / `evsrc` values remain non-diagnostic because the existing
  defaults already align to `10`.
- Raw parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation remain unchanged.

### EVSID Impact

- User-visible diagnostics would change for syntactically valid JP1/AJS
  documents containing explicit out-of-range event-arrival interval or
  check-count values.
- Existing parsed parameter source-location metadata should be enough to point
  diagnostics at explicit `evspl` / `evsrc` parameters, so no parser or DTO
  shape change is expected.
- The application diagnostics boundary remains the owner of focused semantic
  parameter feedback; parser grammar and domain wrapper values remain raw.

### EVSID Diagnostic Alternatives

- Preserve out-of-range `evspl` / `evsrc` silently and leave the matrix gap
  visible.
- Move numeric validation into domain wrappers, rejected for this slice
  because the current diagnostics policy preserves raw manual-invalid values.
- Add `evhst` byte-length, macro-variable, or host-name validation in the
  same slice, rejected because that broadens the behavior and regression
  surface.

## EVSID Hexadecimal Diagnostics

### Current Behavior

- `Evsj` / `Revsj` expose `evsid` through `ParamFactory`.
- `ParamFactory.evsid` preserves explicit values as raw strings and does not
  currently validate hexadecimal shape or numeric range.
- `buildSyntaxDiagnostics.ts` already owns focused semantic diagnostics for
  JP1 event sending jobs, so an `evsid` rule can stay within the existing
  application editor-feedback boundary.
- Explicit invalid `evsid` values are currently preserved without editor
  feedback, and unit-list group 14 projects the same raw value through
  `actionEventId`.

### Proposed Next Slice

- Report a semantic diagnostic when an explicit JP1 event sending job or
  recovery JP1 event sending job sets `evsid` outside the JP1/AJS3 v13
  hexadecimal ranges `00000000..00001FFF` and `7FFF8000..7FFFFFFF`.
- Treat `evsid` as a hexadecimal value-shape check owned by
  `buildSyntaxDiagnostics.ts`, preserving raw parser output, domain wrapper
  values, normalized parameters, unit-list projection, flow projection, and
  command generation.
- Keep omitted `evsid` non-diagnostic.
- Point diagnostics at the explicit `evsid` parameter so parser and DTO
  shapes remain unchanged.
- Interpret hexadecimal digits case-insensitively unless implementation
  investigation reveals a product-specific uppercase-only constraint.
- Accept 1 to 8 hexadecimal digits when the numeric value falls inside one of
  the documented JP1/AJS3 v13 ranges, because the manual lists allowable
  hexadecimal values by range rather than as fixed-width tokens.

### Delivered EVSID Behavior

- Explicit JP1 event sending job and recovery JP1 event sending job `evsid`
  values now report a semantic diagnostic when they are malformed or outside
  the JP1/AJS3 v13 hexadecimal ranges `00000000..00001FFF` and
  `7FFF8000..7FFFFFFF`.
- Omitted `evsid` values remain non-diagnostic.
- Shorter hexadecimal representations such as `1FFF` remain accepted when the
  numeric value falls inside one of the documented ranges.
- Lowercase hexadecimal input remains accepted when the numeric value falls
  inside one of the documented ranges.
- Raw parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation remain unchanged.

### Impact

- User-visible diagnostics would change for syntactically valid JP1/AJS
  documents containing explicit invalid event IDs on `evsj` / `revsj`.
- Existing parsed parameter source-location metadata should be enough to point
  diagnostics at explicit `evsid`, so no parser or DTO shape change is
  expected.
- The application diagnostics boundary remains the owner of focused semantic
  parameter feedback; parser grammar and domain wrapper values remain raw.

### Diagnostic Alternatives

- Preserve invalid `evsid` values silently and leave the matrix gap visible.
- Move hexadecimal validation into domain wrappers, rejected for this slice
  because the current diagnostics policy preserves raw manual-invalid values.
- Broaden the slice to `evhst` byte-length, host-name, or macro-variable
  validation, rejected because that would increase behavior and regression
  surface.

## Follow-up

- Revisit `evhst` byte-length, macro-variable, or host-name validation only
  after the focused `evsid` diagnostics slice is completed or explicitly
  deferred.
