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

- Add range validation only after deciding whether invalid JP1/AJS parameter
  values should become diagnostics, warnings, or preserved raw values.
- Model `jd` / `abr` invalid combinations once the behavior contract is
  explicit enough to test across domain and editor-feedback paths.
