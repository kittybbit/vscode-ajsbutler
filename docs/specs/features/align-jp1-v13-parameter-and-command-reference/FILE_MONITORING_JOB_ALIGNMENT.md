# File Monitoring Job Alignment

## Purpose

Record the JP1/AJS3 version 13 alignment status for file monitoring jobs.

This document focuses on the currently modeled file monitoring job parameters
`flwf`, `flwc`, `flwi`, `flco`, and `ets` for `Flwj` / `Rflwj`.

## Normative Reference

- Product/version: JP1/Automatic Job Management System 3 version 13
- Manual section: Command Reference, `5.2.10 File monitoring job definition`
- Source URL:
  <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0225.HTM>

## Slice Boundary

- Domain seams:
  `src/domain/models/units/Flwj.ts`,
  `src/domain/models/parameters/optionalScalarParameterBuilders.ts`, and
  `src/domain/models/parameters/Defaults.ts`
- Existing consumers:
  `src/domain/models/units/Flwj.ts`,
  `src/domain/models/units/Rflwj.ts`, and
  `src/application/unit-list/buildUnitListRemainingGroups.ts`
- Regression evidence:
  `src/test/suite/parameterFactory.test.ts` if domain defaults change, and
  focused `src/test/suite/buildUnitListRemainingGroups.test.ts` or
  `src/test/suite/buildUnitListView.test.ts` evidence if projection changes
- Out of scope:
  parser grammar changes, command generation, byte-length validation,
  wildcard validation, numeric range validation, `flwc` invalid-combination
  diagnostics, timeout behavior, generated artifacts, configuration,
  dependency versions, and `engines.vscode`

## Investigation Notes

- `Flwj` / `Rflwj` expose `flwf`, `flwc`, `flwi`, `flco`, and `ets` through
  `ParamFactory`.
- `DEFAULTS.Flwc`, `DEFAULTS.Flwi`, `DEFAULTS.Flco`, and `DEFAULTS.Ets`
  already match the manual defaults for file monitoring condition, monitoring
  interval, close-mode handling, and timeout action.
- `flwf` has no default and should remain raw/optional.
- `buildUnitListRemainingGroups.ts` projects group 13 file monitoring columns
  from normalized unit parameters by key, so existing domain defaults do not
  appear in the table viewer unless this projection boundary is intentionally
  updated.
- `ParamFactory.ets` is shared by multiple event/wait job wrappers, so any
  change to the generic default path would affect more than file monitoring
  jobs. The proposed slice should reuse the existing default only at the group
  13 projection boundary for `Flwj` / `Rflwj`.

## Delivered Alignment

- Unit-list group 13 file monitoring job projection now displays the existing
  domain defaults for omitted `flwc`, `flwi`, `flco`, and `ets` values.
- Explicit normalized values remain preserved.
- Omitted `flwf` remains empty because no monitored-file-name default exists.
- Non-file-monitoring jobs do not synthesize these file monitoring defaults.
- Editor feedback now reports focused semantic diagnostics for explicit
  `flwj` / `rflwj` invalid combinations where `flwc` specifies both `s` and
  `m`, or explicit `flco` is present when effective `flwc` does not include
  `c`.

## Delivered Target-Pattern Validation

- Editor feedback now reports a semantic diagnostic when an explicit
  file-monitoring job or recovery file-monitoring job sets `flwf` to a value
  outside the JP1/AJS3 v13 byte-length range `1..255`.
- Editor feedback now reports a semantic diagnostic when an explicit
  file-monitoring job or recovery file-monitoring job sets `flwi` to a value
  outside the JP1/AJS3 v13 numeric range `1..600`.
- Editor feedback now reports a semantic diagnostic when an explicit
  file-monitoring job or recovery file-monitoring job sets `flwf` to a
  wildcard pattern containing `*` while the effective monitoring interval from
  `flwi` is in the JP1/AJS3 v13 restricted range `1..9`.
- The implementation stays in `buildSyntaxDiagnostics.ts`, preserving raw
  parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation.
- Omitted `flwf` remains non-diagnostic because no file-name default is
  introduced, and omitted `flwi` remains non-diagnostic because the existing
  default value `60` stays valid for wildcard usage.
- Diagnostics point at the explicit `flwf` or `flwi` parameter, so parser and
  DTO shapes remain unchanged.

## Delivered Timeout-Action Validation

- Editor feedback now reports a semantic diagnostic when an explicit
  file-monitoring job or recovery file-monitoring job sets `ets` outside the
  documented JP1/AJS3 v13 value set `{kl|nr|wr|an}`.
- Omitted `ets` remains non-diagnostic because the existing default value
  `kl` is already aligned and valid.
- The implementation stays in `buildSyntaxDiagnostics.ts`, preserving raw
  parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation.

## Impact

- User-visible diagnostics would change for syntactically valid JP1/AJS
  documents containing explicit invalid monitored-file names or monitoring
  intervals on `flwj` / `rflwj`.
- Existing parsed parameter source-location metadata should be enough to point
  diagnostics at explicit `flwf` and `flwi`, so no parser or DTO shape change
  is expected.
- The application diagnostics boundary remains the owner of focused semantic
  parameter feedback; parser grammar and domain wrapper values remain raw.

## Alternatives

- Keep group 13 raw by design and leave the matrix gap visible.
- Add separate raw and default-aware columns; rejected for this slice because
  it expands UI and localization scope.
- Change domain defaults or introduce a new file-monitoring helper seam;
  deferred because existing default values already match the manual and the
  behavior gap is projection-only.
- Add diagnostics for `flwc` invalid combinations first; completed because the
  invalid-combination rule was the narrowest safe first slice in this job
  type.
- Split `flwf` byte-length, `flwi` numeric range, and wildcard restrictions
  into separate micro-slices; rejected because the manual couples wildcard
  usage to short `flwi` values and the user asked for job-type or
  parameter-family sized slices where practical.
- Broaden the slice further to `ets` timeout behavior or other event-job rules,
  deferred because that expands beyond the monitored-file and monitoring-
  interval parameter family.

## Follow-up

- none for the currently modeled file-monitoring parameters in this feature
  scope
