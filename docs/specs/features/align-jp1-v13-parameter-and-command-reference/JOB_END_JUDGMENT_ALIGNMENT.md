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
  remain preserved raw values until the diagnostics policy is explicit.

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

### Current Behavior

- `ParamFactory.jd` resolves omitted `jd` to `cod`.
- `ParamFactory.abr` resolves omitted `abr` to `n`.
- Explicit invalid combinations, such as `jd=ab` with `abr=y`, are preserved
  as raw values and do not currently produce semantic diagnostics.
- `buildSyntaxDiagnostics` currently maps parser syntax errors only; it does
  not inspect parsed units for JP1/AJS parameter-rule violations.
- Parsed unit parameters preserve key, value, and definition order, but not
  line and column source locations.

### Proposed Behavior

After human approval:

- keep raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, and command generation unchanged;
- add an application-level semantic diagnostic when an explicit UNIX/PC job or
  UNIX/PC custom job has effective `abr=y` and effective `jd` is not `cod`;
- report the diagnostic through the existing editor-feedback DTO and VS Code
  adapter path so desktop and web hosts share the same rule;
- keep omitted `jd=cod` and omitted `abr=n` behavior non-diagnostic;
- add focused tests for syntax-only diagnostics, valid omitted defaults,
  explicit valid `jd=cod` / `abr=y`, and explicit invalid `jd` / `abr`
  combinations.

### Impact

- User-visible diagnostics change for syntactically valid JP1/AJS documents
  containing the invalid combination.
- The parser grammar should not change, but parsed parameter source locations
  may need to be added to `Unit.parameters` so semantic diagnostics can point
  at the explicit offending parameter instead of reporting a generic document
  position.
- The application diagnostics boundary broadens from syntax-only feedback to
  syntax plus focused semantic parameter feedback.

### Diagnostic Alternatives

- Preserve invalid combinations silently and leave the matrix gap visible.
- Change domain defaults or wrapper values to avoid the invalid combination,
  rejected because raw manual-invalid input should remain inspectable.
- Add broad parameter validation first, rejected because it is too large for
  the next alignment slice.
- Add diagnostics without source locations, possible as a fallback but less
  useful for editor feedback and likely to weaken regression evidence.
