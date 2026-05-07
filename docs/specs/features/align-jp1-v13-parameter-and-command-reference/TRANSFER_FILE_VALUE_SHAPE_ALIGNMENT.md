# Transfer-File Value-Shape Alignment

## Purpose

Record the next JP1/AJS3 version 13 parameter-alignment candidate around
explicit transfer-file value shapes for UNIX/PC jobs, UNIX/PC custom jobs,
QUEUE jobs, and recovery QUEUE jobs.

This investigation narrows the remaining transfer-related generic backlog to
one user-meaningful slice: explicit `ts1` to `ts4` and `td1` to `td4` values
should follow the documented transfer-file string shape instead of accepting
arbitrary bare strings without feedback.

## Normative Reference

- Product/version: JP1/Automatic Job Management System 3 version 13
- Manual sections:
  - Command Reference, `5.2.6 UNIX/PC job definition`
  - Command Reference, `5.2.7 QUEUE job definition`
  - Command Reference, `5.2.24 UNIX/PC custom job definition`
- Source URLs:
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0221.HTM>
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0222.HTM>
  - <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0239.HTM>

## Slice Boundary

- Application seam:
  `src/application/editor-feedback/buildSyntaxDiagnostics.ts`
- Existing consumers:
  `src/extension/diagnostics/registerDiagnostics.ts` plus transfer-file-owning
  unit types `J`, `Cj`, `Qj`, and `Rq`
- Existing reference points:
  `src/domain/models/units/J.ts`,
  `src/domain/models/units/Cj.ts`, and
  `src/domain/models/units/Qj.ts` all document `tsN` and `tdN` as quoted
  transfer-file values, while current editor feedback already preserves
  explicit macro-variable forms such as `?AJS2SRC1?`
- Regression evidence:
  `src/test/suite/buildSyntaxDiagnostics.test.ts`
- Out of scope:
  parser grammar changes, transfer-operation `topN` default behavior,
  filename byte-length rules already delivered, path existence checks,
  platform-specific path normalization, macro-variable expansion semantics,
  unit-list projection, flow projection, command generation, generated
  artifacts, dependency changes, and `engines.vscode`

## Investigation Notes

- Current editor feedback already reports transfer-file byte-length and
  invalid-combination diagnostics, but it still accepts arbitrary explicit
  bare strings such as `ts1=source-1;` without semantic feedback.
- The wrapper comments in `J.ts`, `Cj.ts`, and `Qj.ts` describe `tsN` and
  `tdN` using quoted value forms, which makes explicit string-shape feedback a
  better next slice than smaller default-only gaps such as HTTP Connection
  `eu` or file-monitoring `ets`.
- The existing generic diagnostics path is already set up for transfer-file
  rules through `transferOperationDiagnosticRules` and
  `queueTransferFileDiagnosticRules`, so this slice can stay in
  `buildSyntaxDiagnostics.ts` without widening domain or projection
  responsibilities.
- Existing regression tests already demonstrate the current preservation rule:
  quoted file names and macro-variable values are accepted, while invalid
  combinations and out-of-range byte lengths produce diagnostics.
- Macro-variable allowance should remain explicit and preserved. The candidate
  slice is about rejecting non-documented bare explicit strings, not about
  tightening or reinterpreting already accepted macro-variable forms.

## Planned Alignment

After approval:

- keep ownership in the shared application editor-feedback boundary;
- add grouped diagnostics for explicit `tsN` / `tdN` values on `j`, `rj`,
  `pj`, `rp`, `cj`, `rcj`, `qj`, and `rq` when the value is neither a quoted
  transfer-file string nor an already accepted explicit macro-variable form;
- reuse the existing transfer-file rule arrays so the new checks stay on the
  current generic-rule path beside the delivered byte-length and dependency
  rules;
- preserve raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation.

## Affected Backlog Rows

- Transfer Operation:
  remaining filename/path-shape and macro-variable-aware validation
- QUEUE Transfer Files:
  remaining filename/path-shape and macro-variable-aware validation

## Alternatives

- Pick a smaller default-only slice such as HTTP Connection `eu` or
  file-monitoring `ets`:
  rejected because those are less visible to users and smaller than the
  requested slice size.
- Broaden the slice to full path syntax, regular-expression handling, or
  platform-aware path validation:
  rejected because that would mix a simple documented value-shape gap with
  higher-risk product interpretation.
- Move transfer-file validation into domain wrappers:
  rejected because the current policy preserves raw explicit invalid values and
  surfaces them through editor feedback.

## Follow-up

- If approval is given, perform a reference-impact pass on the transfer-file
  helper/rule-array path in `buildSyntaxDiagnostics.ts` and the focused
  transfer-file tests in `buildSyntaxDiagnostics.test.ts` before editing
  runtime code.
- If implementation reveals that quoted transfer-file syntax differs by unit
  family or conflicts with existing macro-variable preservation, stop and
  request re-approval with the broadened scope.

## Delivered Behavior

- Editor feedback now reports a semantic diagnostic for explicit `tsN` and
  `tdN` values on `j`, `rj`, `pj`, `rp`, `cj`, `rcj`, `qj`, and `rq` when the
  raw explicit value is neither a quoted transfer-file string nor an accepted
  macro-variable form such as `?AJS2SRC1?`.
- The new checks stay on the existing transfer-file generic-rule path beside
  the already delivered byte-length and invalid-combination rules.
- Quoted transfer-file values and already accepted macro-variable forms remain
  non-diagnostic in this slice.
- Raw parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation remain unchanged.

## Remaining Gap

- Broader filename/path semantics, platform-specific path interpretation, and
  any family-specific macro-variable syntax tightening remain deferred.
