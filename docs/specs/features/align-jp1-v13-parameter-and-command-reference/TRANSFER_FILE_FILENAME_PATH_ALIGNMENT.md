# Transfer-File Filename/Path Alignment

## Purpose

Record the JP1/AJS3 version 13 parameter-alignment slice around the remaining
shared transfer-file filename/path semantics for UNIX/PC jobs, UNIX/PC custom
jobs, QUEUE jobs, and recovery QUEUE jobs.

This investigation keeps the backlog grouped at a user-meaningful size:
users work with one transfer-file parameter family across these job types, and
the current implementation already routes those diagnostics through the same
shared editor-feedback seams.

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
  `transferFileByteLengthRules`,
  `transferFileValueShapeRules`,
  `transferOperationDiagnosticRules`, and
  `queueTransferFileDiagnosticRules`
- Regression evidence:
  `src/test/suite/buildSyntaxDiagnostics.test.ts`
- Out of scope:
  parser grammar changes, domain wrapper normalization changes,
  transfer-operation `topN` behavior, unit-list projection, flow projection,
  command generation, path existence checks, platform-specific path
  normalization, macro-variable expansion semantics, generated artifacts,
  dependency changes, configuration changes, and `engines.vscode`

## Investigation Notes

- The delivered transfer-file value-shape slice already aligned the first
  explicit-string boundary: bare strings are rejected unless the value is a
  quoted transfer-file literal or an accepted macro-variable form.
- `buildSyntaxDiagnostics.ts` now has one shared transfer-file rule path for
  UNIX/PC and QUEUE-family diagnostics. Any remaining transfer-file work
  should preserve that shared structure instead of reopening one job type at a
  time.
- The remaining documented gap is no longer about whether `tsN` / `tdN`
  values are quoted; it is about the still-deferred filename/path semantics
  inside that shared quoted-value family.
- This candidate is preferable to HTTP Connection `eu` because it closes
  backlog across two partial matrix rows at once, and it is preferable to a
  broader wait-job slice because it stays within one already-shared parameter
  family and one already-shared refactoring seam.

## Planned Alignment

Delivered implementation:

- kept ownership in the shared application editor-feedback boundary;
- performed a focused reference pass on the current transfer-file helper/rule
  arrays before editing runtime code;
- implemented the smallest manual-backed shared path rule that could be
  enforced uniformly without introducing platform-specific interpretation:
  explicit quoted `tsN` values must use a full-path form;
- kept the existing transfer-operation and QUEUE transfer-file rule
  composition on one shared helper/rule-array structure;
- preserved raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation.

## Affected Backlog Rows

- Transfer Operation:
  remaining filename/path semantics after value-shape, byte-length, and
  invalid-combination alignment
- QUEUE Transfer Files:
  remaining filename/path semantics after value-shape, byte-length, and
  invalid-combination alignment

## Alternatives

- Pick HTTP Connection `eu` next:
  rejected because it is smaller and less user-visible than the requested
  slice size.
- Broaden immediately into platform-aware path interpretation:
  rejected because that would exceed the smallest reviewable slice and pull
  environment-specific behavior into a rule family that is currently
  application-level only.
- Re-open transfer rules one job type at a time:
  rejected because the current code already shares rule arrays and helper
  seams across UNIX/PC and QUEUE-family transfer-file diagnostics.

## Follow-up

- The reference pass confirmed that `tsN` carries the only clearly shared
  full-path requirement across the approved transfer-file family scope.
- The same pass did not find a stronger shared path rule for `tdN` that could
  be enforced without broadening into platform-specific path interpretation,
  so explicit quoted `tdN` values stay on the already delivered
  value-shape/byte-length/dependency path in this slice.

## Delivered Behavior

- Editor feedback now reports a semantic diagnostic when explicit quoted
  `ts1` to `ts4` values on UNIX/PC jobs, UNIX/PC custom jobs, QUEUE jobs, and
  recovery QUEUE jobs use an apparent relative path instead of a full path.
- Existing quoted `td1` to `td4` values remain accepted unless they violate
  already delivered value-shape, byte-length, or dependency rules.
- Macro-variable forms remain accepted on the existing transfer-file path.
- The implementation stays on the shared transfer-operation and QUEUE
  transfer-file helper/rule-array path in `buildSyntaxDiagnostics.ts`.

## Remaining Gap

- Platform-specific path interpretation, any broader path normalization, and
  any family-specific macro-variable syntax tightening remain deferred.
