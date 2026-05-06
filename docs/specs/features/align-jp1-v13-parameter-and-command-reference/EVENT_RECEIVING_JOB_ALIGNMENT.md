# JP1 Event Receiving Job Alignment

## Purpose

Record the next JP1/AJS3 version 13 alignment candidate for JP1 event
reception monitoring job semantic diagnostics.

This document focuses on the currently modeled JP1 event reception monitoring
job parameter `evesc` for `Evwj` / `Revwj`.

## Normative Reference

- Product/version: JP1/Automatic Job Management System 3 version 13
- Manual section:
  Command Reference, `5.2.9 Job definition for monitoring JP1 event reception`
- Source URL:
  <https://itpfdoc.hitachi.co.jp/manuals/3021/30213L4920e/AJSO0224.HTM>

## Slice Boundary

- Application seam:
  `src/application/editor-feedback/buildSyntaxDiagnostics.ts`
- Existing consumers:
  `src/domain/models/units/Evwj.ts` and `Revwj` via inheritance
- Regression evidence:
  `src/test/suite/buildSyntaxDiagnostics.test.ts`; keep the existing raw list
  projection evidence in `src/test/suite/buildUnitListView.test.ts`
- Out of scope:
  parser grammar changes, domain wrapper normalization, unit-list projection
  changes, flow projection changes, command generation, generated artifacts,
  dependency changes, `engines.vscode`, `evwid` format validation, `evhst`
  byte-length validation, host-name validation, regular-expression
  validation, macro-variable validation, `evipa` address validation, and
  broad event-job validation

## Investigation Notes

- `Evwj` exposes `evesc` through `ParamFactory.evesc`, which currently uses
  the generic optional scalar builder path and preserves explicit values as raw
  strings.
- `buildSyntaxDiagnostics.ts` already owns focused semantic diagnostics for
  syntactically valid JP1/AJS documents and is shared by desktop and web
  adapters through the existing editor-feedback boundary.
- The JP1/AJS3 v13 manual states that `evesc` accepts either `no` or a
  decimal value between `1` and `720` minutes, with omitted `evesc`
  defaulting to `no`.

## Proposed Next Slice

- Report a semantic diagnostic when an explicit JP1 event reception monitoring
  job or recovery JP1 event reception monitoring job sets `evesc` to a value
  other than `no` or a decimal value between `1` and `720`.
- Treat the rule as an application-level range validation owned by
  `buildSyntaxDiagnostics.ts`, preserving raw parser output, domain wrapper
  values, normalized parameters, unit-list projection, flow projection, and
  command generation.
- Keep omitted `evesc` and explicit `evesc=no` non-diagnostic.
- Point diagnostics at the explicit `evesc` parameter so parser and DTO shapes
  remain unchanged.

## Delivered Behavior

- Explicit JP1 event reception monitoring job and recovery JP1 event reception
  monitoring job `evesc` values now report a semantic diagnostic when they are
  neither `no` nor decimal values in the range `1..720`.
- Omitted `evesc` values and explicit `evesc=no` remain non-diagnostic.
- Raw parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation remain unchanged.

## Impact

- User-visible diagnostics would change for syntactically valid JP1/AJS
  documents containing explicit invalid event search conditions on
  `evwj` / `revwj`.
- Existing parsed parameter source-location metadata should be enough to point
  diagnostics at explicit `evesc`, so no parser or DTO shape change is
  expected.
- The application diagnostics boundary remains the owner of focused semantic
  parameter feedback; parser grammar and domain wrapper values remain raw.

## Diagnostic Alternatives

- Preserve invalid `evesc` values silently and leave the matrix gap visible.
- Move `evesc` range validation into domain wrappers, rejected for this slice
  because the current diagnostics policy preserves raw manual-invalid values.
- Broaden the slice to `evwid`, `evhst`, `evipa`, or message/regular-
  expression validation, rejected because that increases behavior and
  regression surface.

## Follow-up

- Revisit event reception monitoring job host-name, address, regular-
  expression, and event-ID validation only after the focused `evesc`
  diagnostics slice is completed or explicitly deferred.
