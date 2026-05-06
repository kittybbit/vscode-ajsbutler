# Job End Judgment Parameter Alignment

## Purpose

Record the current JP1/AJS3 version 13 alignment state for job end-judgment
parameters used by UNIX/PC jobs and UNIX/PC custom jobs.

This document covers the implemented behavior for `jd`, `wth`, `tho`, `jdf`,
`abr`, `rjs`, `rje`, `rec`, and `rei`.

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
  `src/domain/models/units/J.ts`,
  `src/domain/models/units/Cj.ts`,
  `src/domain/models/units/Cpj.ts`,
  `src/domain/models/units/Fxj.ts`,
  `src/domain/models/units/Htpj.ts`,
  `src/domain/models/units/Qj.ts`, and recovery variants
- Diagnostics boundary:
  `src/application/editor-feedback/buildSyntaxDiagnostics.ts`
- Regression evidence:
  `src/test/suite/parameterFactory.test.ts`,
  `src/test/suite/jobEndJudgmentHelpers.test.ts`, and
  `src/test/suite/buildSyntaxDiagnostics.test.ts`
- Out of scope:
  parser grammar changes, byte-length validation, numeric range validation,
  retry threshold ordering, and command-generation changes

## Shared Expectations

- Explicit `jd` values are preserved.
- Omitted `jd` resolves to `cod` for UNIX/PC jobs and UNIX/PC custom jobs.
- Omitted `tho` remains `0`.
- Omitted `abr` remains `n`.
- Explicit `wth` values are read from the `wth` parameter, not from the
  schedule-rule `wt` parameter.
- `wth` and `jdf` are not synthesized when omitted.
- Invalid combinations remain preserved as raw values and are reported through
  focused editor-feedback diagnostics instead of being rewritten in wrappers or
  unit-list output.

## Delivered Alignment

### WTH Key Mapping

- `ParamFactory.wth` reads raw `wth` instead of the schedule-rule `wt`
  parameter.
- Explicit `wth` values are preserved.
- Omitted `wth` remains undefined.
- Schedule-rule `wt` remains handled only by the schedule-rule helper path.

### JD Default

- Omitted `jd` resolves to `cod` through
  `jobEndJudgmentHelpers.ts` for UNIX/PC jobs and UNIX/PC custom jobs.
- Explicit `jd` values remain preserved.

### JD / ABR Diagnostics

- The editor-feedback boundary reports a semantic diagnostic when an explicit
  UNIX/PC job or UNIX/PC custom job has effective `abr=y` and effective `jd`
  is not `cod`.
- Raw parser output, domain wrapper values, normalized parameters, unit-list
  projection, and command generation remain unchanged.

### Retry Parameter Diagnostics For Effective Non-`cod` JD

- The editor-feedback boundary reports a semantic diagnostic when an explicit
  UNIX/PC job or UNIX/PC custom job has effective `jd` not equal to `cod` and
  also specifies any of `rjs`, `rje`, `rec`, or `rei`.
- Existing source-location metadata points each diagnostic at the explicit
  offending retry parameter.
- Omitted retry parameters remain non-diagnostic.

### Retry Parameter Diagnostics For Effective Non-`y` ABR

- The editor-feedback boundary reports a semantic diagnostic when an explicit
  UNIX/PC job or UNIX/PC custom job has effective `jd=cod`, effective `abr`
  not equal to `y`, and also specifies any of `rjs`, `rje`, `rec`, or `rei`.
- Existing effective non-`cod` `jd` diagnostics remain the primary diagnostic
  for invalid end-judgment combinations.
- Raw parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation remain unchanged.

## Proposed Next Grouped Slice

- Report semantic diagnostics when an explicit UNIX/PC job or UNIX/PC custom
  job sets `wth` or `tho` outside the JP1/AJS3 v13 range
  `0..2147483647`.
- Report semantic diagnostics when an explicit UNIX/PC job or UNIX/PC custom
  job sets `rjs` or `rje` outside the JP1/AJS3 v13 range
  `1..4294967295`.
- Report semantic diagnostics when an explicit UNIX/PC job or UNIX/PC custom
  job sets `rec` outside the JP1/AJS3 v13 range `1..12` or `rei` outside the
  range `1..10`.
- Treat the rule as application-level numeric validation owned by
  `buildSyntaxDiagnostics.ts`, preserving raw parser output, domain wrapper
  values, normalized parameters, unit-list projection, flow projection, and
  command generation.
- Keep omitted values non-diagnostic so the existing default-aware wrapper
  semantics remain unchanged.
- Point each diagnostic at the explicit out-of-range parameter so parser and
  DTO shapes remain unchanged.

## Impact

- User-visible diagnostics would change for syntactically valid JP1/AJS
  documents containing explicit out-of-range job end-judgment or automatic
  retry values on `j` / `cj`.
- Existing parsed parameter source-location metadata should be enough to point
  diagnostics at explicit `wth`, `tho`, `rjs`, `rje`, `rec`, and `rei`, so no
  parser or DTO shape change is expected.
- The application diagnostics boundary remains the owner of focused semantic
  parameter feedback; parser grammar and domain wrapper values remain raw.

## Diagnostic Alternatives

- Preserve out-of-range numeric values silently and leave the matrix gap
  visible.
- Move numeric validation into domain wrappers, rejected for this slice
  because the current diagnostics policy preserves raw manual-invalid values.
- Broaden the slice to retry threshold ordering in the same change, deferred
  because cross-parameter ordering adds a second rule family and expands the
  regression surface beyond a single numeric-range slice.

## Follow-up

- Implement grouped numeric range validation first, then revisit retry
  threshold ordering as a separate approval-gated slice if the grouped numeric
  diagnostics land cleanly.
