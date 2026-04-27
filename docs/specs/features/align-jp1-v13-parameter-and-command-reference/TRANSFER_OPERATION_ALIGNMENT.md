# Transfer Operation Parameter Alignment

## Purpose

Record the JP1/AJS3 version 13 alignment slice for transfer operation
parameters used by UNIX/PC jobs and UNIX/PC custom jobs. This is the next
category-level helper-boundary slice after schedule-rule parsing.

This document covers only `top1`, `top2`, `top3`, and `top4`, plus their
paired transfer source and destination presence checks through `ts1` to `ts4`
and `td1` to `td4`.

## Normative Reference

- Product/version: JP1/Automatic Job Management System 3 version 13
- Manual sections:
  - Command Reference, `5.2.6 UNIX/PC job definition`
  - Command Reference, `5.2.24 UNIX/PC custom job definition`
- Source URLs:
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0221.HTM>
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0239.HTM>

## Slice Boundary

- Domain seams:
  `src/domain/models/parameters/transferOperationHelpers.ts` and
  `src/domain/models/parameters/transferOperationParameterBuilders.ts`
- Existing consumers:
  `src/domain/models/units/J.ts`, `src/domain/models/units/Cj.ts`, and
  `ParamFactory.top1` to `ParamFactory.top4`
- Regression evidence:
  `src/test/suite/parameterHelpers.test.ts` and
  `src/test/suite/parameterFactory.test.ts`
- Out of scope:
  quoted filename parsing, byte-length validation, macro-variable validation,
  custom PC job invalidation, and QUEUE job transfer-file handling because
  QUEUE job definitions do not define `top1` to `top4`

## Shared Expectations

- Explicit `topN` values are preserved.
- If `topN` is omitted and both `tsN` and `tdN` exist, `topN` resolves to
  `sav`.
- If `topN` is omitted and `tsN` exists without `tdN`, `topN` resolves to
  `del`.
- If `topN`, `tsN`, and `tdN` are all omitted, no default `topN` parameter is
  synthesized.
- The transfer operation default rule is isolated from the generic parameter
  helper so future transfer-specific checks do not broaden
  `parameterHelpers.ts`.

## Follow-up

- Add validation only after deciding whether invalid JP1/AJS parameter values
  should become diagnostics, warnings, or preserved raw values.
- Revisit QUEUE job transfer-file coverage separately because its manual
  contract includes `tsN` and `tdN` but not `topN`.
