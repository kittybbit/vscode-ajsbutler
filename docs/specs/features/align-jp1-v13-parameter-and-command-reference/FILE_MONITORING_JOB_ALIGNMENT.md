# File Monitoring Job Alignment

## Purpose

Record the JP1/AJS3 version 13 alignment slice for file monitoring job
defaults and unit-list projection behavior.

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

## Expected Behavior If Approved

- Explicit file monitoring job `flwc`, `flwi`, `flco`, and `ets` values remain
  visible in group 13.
- Omitted file monitoring job `flwc`, `flwi`, `flco`, and `ets` values display
  their existing JP1/AJS defaults in group 13.
- Omitted `flwf` remains empty because the manual does not define a default
  monitored file name.
- Non-file-monitoring jobs do not synthesize file monitoring defaults in group 13.
- Raw parser output, raw domain wrapper values, and normalized key/value
  storage remain unchanged.

## Alternatives

- Keep group 13 raw by design and leave the matrix gap visible.
- Add separate raw and default-aware columns; rejected for this slice because
  it expands UI and localization scope.
- Change domain defaults or introduce a new file-monitoring helper seam;
  deferred because existing default values already match the manual and the
  behavior gap is projection-only.
- Add diagnostics for `flwc` invalid combinations, wildcard restrictions, or
  numeric ranges first; deferred because diagnostics policy is a separate
  behavior contract.

## Follow-up

- Revisit `flwc` invalid combinations, `flwi` range validation, wildcard
  restrictions, and `flco` pairing diagnostics only after editor-feedback
  behavior explicitly owns invalid JP1/AJS parameter handling.
