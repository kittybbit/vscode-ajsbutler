# Job End Judgment Parameter Alignment

## Purpose

Record the JP1/AJS3 version 13 alignment slice for job end-judgment
parameters used by UNIX/PC jobs and UNIX/PC custom jobs. This is the next
non-schedule parameter-family slice after the transfer-operation helper
boundary.

This document covers the currently modeled end-judgment defaults for `jd`,
`wth`, `tho`, `jdf`, and `abr`.

## Normative Reference

- Product/version: JP1/Automatic Job Management System 3 version 13
- Manual sections:
  - Command Reference, `5.2.6 UNIX/PC job definition`
  - Command Reference, `5.2.24 UNIX/PC custom job definition`
  - Command Reference, `ajsprint`, default values table
- Source URLs:
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0221.HTM>
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0239.HTM>
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0121.HTM>

## Slice Boundary

- Domain seams:
  `src/domain/models/parameters/jobEndJudgmentHelpers.ts`,
  `src/domain/models/parameters/optionalScalarParameterBuilders.ts`, and
  `src/domain/models/parameters/Defaults.ts`
- Existing consumers:
  `src/domain/models/units/J.ts`, `src/domain/models/units/Cj.ts`, and
  `ParamFactory.jd`
- Regression evidence:
  `src/test/suite/parameterFactory.test.ts` and
  `src/test/suite/jobEndJudgmentHelpers.test.ts`
- Out of scope:
  parser grammar changes, byte-length validation, numeric range validation,
  invalid `jd` / `abr` pairing diagnostics, retry range diagnostics, and
  command-generation changes

## Shared Expectations

- Explicit `jd` values are preserved.
- Omitted `jd` resolves to `cod` for UNIX/PC jobs and UNIX/PC custom jobs.
- Omitted `tho` remains `0`.
- Omitted `abr` remains `n`.
- Explicit `wth` values are read from the `wth` parameter, not from the
  schedule-rule `wt` parameter.
- `wth` and `jdf` are not synthesized when omitted.
- Invalid combinations, such as `jd` values other than `cod` with `abr=y`,
  remain preserved raw values and are reported through focused semantic
  diagnostics for UNIX/PC jobs and UNIX/PC custom jobs.

## WTH Key Mapping Follow-up

- Current behavior:
  `src/domain/models/parameters/optionalScalarParameterBuilders.ts` maps
  `ParamFactory.wth` through `createOptionalScalarBuilder("wt", ...)`.
- Current regression evidence:
  `src/test/suite/parameterFactory.test.ts` explicitly preserves the legacy
  `wth` to `wt` mapping.
- Planned behavior if approved:
  `ParamFactory.wth` reads `wth`, explicit `wth` values are preserved, omitted
  `wth` remains undefined, and schedule-rule `wt` continues to be handled only
  by the schedule-rule helper path.
- Affected wrappers:
  `J`, `Cj`, `Cpj`, `Fxj`, `Htpj`, `Qj`, and their recovery variants.
- Affected tests:
  replace the legacy mapping test with explicit `wth` preservation and
  `wt`/`wth` non-confusion evidence; keep the existing omitted `wth` default
  assertion.
- Out of scope:
  parser grammar changes, command generation, validation diagnostics, and
  unit-list normalized raw projection changes.

## Follow-up

- Add range validation only after the first semantic diagnostic slice proves
  where source locations and parameter-rule checks belong.
- Model additional retry diagnostics after `jd` / `abr` invalid-combination
  behavior is implemented and validated across domain and editor-feedback
  paths.

## JD / ABR Diagnostic Candidate

### JD / ABR Current Behavior

- `ParamFactory.jd` resolves omitted `jd` to `cod`.
- `ParamFactory.abr` resolves omitted `abr` to `n`.
- Explicit invalid combinations, such as `jd=ab` with `abr=y`, are preserved
  as raw values and do not currently produce semantic diagnostics.
- `buildSyntaxDiagnostics` currently maps parser syntax errors only; it does
  not inspect parsed units for JP1/AJS parameter-rule violations.
- Parsed unit parameters preserve key, value, and definition order, but not
  line and column source locations.

### Implemented Behavior

- Raw parser output, domain wrapper values, normalized parameters, unit-list
  projection, and command generation remain unchanged.
- The application diagnostics boundary reports a semantic diagnostic when an
  explicit UNIX/PC job or UNIX/PC custom job has effective `abr=y` and
  effective `jd` is not `cod`.
- The diagnostic is reported through the existing editor-feedback DTO and VS
  Code adapter path so desktop and web hosts share the same rule.
- Omitted `jd=cod` and omitted `abr=n` behavior remains non-diagnostic.
- Focused tests cover syntax-only diagnostics, valid omitted defaults,
  explicit valid `jd=cod` / `abr=y`, and explicit invalid `jd` / `abr`
  combinations.

### JD / ABR Diagnostic Impact

- User-visible diagnostics change for syntactically valid JP1/AJS documents
  containing the invalid combination.
- The parser grammar did not change, but parsed parameter source locations
  were added to `Unit.parameters` so semantic diagnostics can point at the
  explicit offending parameter instead of reporting a generic document
  position.
- The application diagnostics boundary broadens from syntax-only feedback to
  syntax plus focused semantic parameter feedback.

### JD / ABR Diagnostic Alternatives

- Preserve invalid combinations silently and leave the matrix gap visible.
- Change domain defaults or wrapper values to avoid the invalid combination,
  rejected because raw manual-invalid input should remain inspectable.
- Add broad parameter validation first, rejected because it is too large for
  the next alignment slice.
- Add diagnostics without source locations, possible as a fallback but less
  useful for editor feedback and likely to weaken regression evidence.

## Retry Parameter Diagnostic Candidate

### Current Behavior

- `buildSyntaxDiagnostics` now reports the focused `jd` / `abr`
  invalid-combination diagnostic after syntax parsing succeeds.
- Explicit `rjs`, `rje`, `rec`, and `rei` values are preserved as raw values
  and do not currently produce semantic diagnostics when effective `jd` is not
  `cod`.
- Unit-list group 11 projects retry parameters from normalized raw key/value
  data, so invalid combinations remain visible in the table viewer.

### Implemented Retry Behavior

- keep raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation unchanged;
- focused application-level semantic diagnostics report when an explicit UNIX/PC
  job or UNIX/PC custom job has effective `jd` not equal to `cod` and also
  specifies any of `rjs`, `rje`, `rec`, or `rei`;
- each diagnostic is reported through the existing editor-feedback DTO and VS Code
  adapter path so desktop and web hosts share the same rule;
- keep omitted retry parameters non-diagnostic;
- keep explicit `jd=cod` with retry parameters non-diagnostic for this slice;
- focused tests cover valid `jd=cod` retry parameters and explicit invalid
  `jd` / retry-parameter combinations.

### Impact

- User-visible diagnostics change for syntactically valid JP1/AJS documents
  containing the invalid combination.
- Existing parser source-location metadata can point diagnostics at the
  explicit offending retry parameter.
- The application diagnostics boundary remains the owner of semantic
  parameter feedback; parser grammar and domain wrapper values remain raw.

### Diagnostic Alternatives

- Preserve invalid retry parameters silently and leave the matrix gap visible.
- Remove or hide retry values from domain/list outputs when `jd` is not `cod`,
  rejected because manual-invalid raw input should remain inspectable.
- Add numeric range checks for `rjs`, `rje`, `rec`, and `rei` in the same
  slice, rejected because this broadens the behavior and regression surface.
- Implement a generic parameter-rule engine first, deferred because the next
  slice can be covered by the existing small diagnostics boundary.
