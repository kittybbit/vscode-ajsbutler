# HTTP Connection Job Default Alignment

## Purpose

Record the JP1/AJS3 version 13 alignment slice for HTTP Connection job
defaults. This is the next small non-schedule parameter-default candidate after
job end-judgment alignment.

This document focuses on the currently modeled HTTP Connection job defaults
for `htknd`, `htexm`, `htspt`, `jd`, `abr`, `ha`, `eu`, `mm`, `nmg`, `ega`,
and `uem`.

## Normative Reference

- Product/version: JP1/Automatic Job Management System 3 version 13
- Manual sections:
  - Command Reference, `5.2.27 HTTP Connection job definition`
  - Command Reference, `ajsprint`, default values table
- Source URLs:
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0242.HTM>
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0121.HTM>

## Slice Boundary

- Domain seams:
  `src/domain/models/units/Htpj.ts`,
  `src/domain/models/parameters/optionalScalarParameterBuilders.ts`, and
  `src/domain/models/parameters/Defaults.ts`
- Existing consumers:
  `src/domain/models/units/Htpj.ts`, `src/domain/models/units/Rhtpj.ts`, and
  `ParamFactory.eu`
- Regression evidence:
  `src/test/suite/parameterFactory.test.ts`; add focused helper/facade
  evidence if a dedicated HTTP Connection job default seam is introduced
- Out of scope:
  parser grammar changes, command generation, byte-length validation, numeric
  range validation, HTTP return-code mapping validation, and broader event/wait
  default refactors

## Investigation Notes

- The existing generic `eu` builder applies `DEFAULTS.Eu`, currently `ent`, to
  all unit wrappers that call `ParamFactory.eu`.
- `Htpj.eu` currently calls `ParamFactory.eu(this)`, so omitted HTTP
  Connection job `eu` values resolve through the same generic `ent` default as
  other job families.
- The `ajsprint -a` default values table lists HTTP Connection job `Eu` as
  `def`, while most other modeled job families list `Eu` as `ent`.
- The HTTP Connection job definition section also describes `eu={ent|def};`;
  keep this slice explicit about which reference statement drives the behavior
  change before implementation.

## Expected Behavior If Approved

- Explicit HTTP Connection job `eu` values are preserved.
- Omitted HTTP Connection job `eu` resolves to `def` through a small
  HTTP-connection-job-specific default seam.
- Other unit families that already use the generic `eu` default continue to
  resolve omitted `eu` as `ent`.
- Existing HTTP Connection job defaults for `htknd`, `htexm`, `htspt`, `jd`,
  `abr`, `ha`, `mm`, `nmg`, `ega`, and `uem` remain unchanged unless further
  manual investigation proves a focused mismatch.

## Alternatives

- Leave `DEFAULTS.Eu` as the only `eu` default and document HTTP Connection
  job `Eu` as unresolved because the definition section and `ajsprint -a`
  default table need reconciliation.
- Change `DEFAULTS.Eu` globally to `def`; rejected because many non-HTTP job
  families are documented as `ent` and currently share this generic default.
- Add a broad parameter coverage matrix before this behavior change; deferred
  because the current workflow favors small category-level slices.

## Follow-up

- Reconcile the HTTP Connection job definition text and the `ajsprint -a`
  default table if future evidence suggests this should remain `ent`.
- Consider extracting a small execution-user default helper if additional
  unit-type-specific `eu` defaults appear.
