# JP1 Event Receiving Job Alignment

## Purpose

Record the JP1/AJS3 version 13 alignment status and remaining grouped
validation candidate for JP1 event reception monitoring job semantic
diagnostics.

This document covers the delivered `evesc`, `evwid`, and `evipa` diagnostic
slices plus the remaining grouped follow-up for `Evwj` / `Revwj`.

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
  dependency changes, `engines.vscode`, shared `evhst` byte-length
  validation, broader string-filter validation, and broad event-job
  validation

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
- The JP1/AJS3 v13 manual states that `evwid` accepts hexadecimal values in
  the range `00000000:00000000` to `FFFFFFFF:FFFFFFFF`.
- The JP1/AJS3 v13 manual states that `evipa` accepts IPv4 dotted-decimal
  addresses in the range `0.0.0.0` to `255.255.255.255`.
- The same manual also states that `evhst` accepts a character string of
  `1..255` bytes and allows both regular-expression and macro-variable forms,
  which makes the remaining `evhst` follow-up a better shared event-host
  slice than a job-local literal-hostname check.
- Existing raw projection evidence includes `evwid=EV-1;` in
  `buildUnitListView.test.ts`, which confirms that editor diagnostics can be
  tightened without changing raw unit-list projection.

## Delivered Slice Scope

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

## Delivered EVWID / EVIPA Slice

- Explicit JP1 event reception monitoring job and recovery JP1 event
  reception monitoring job `evwid` values now report a semantic diagnostic
  when they fall outside the hexadecimal event-ID format and range
  `00000000:00000000` to `FFFFFFFF:FFFFFFFF`.
- Explicit `evipa` values now report a semantic diagnostic when they fall
  outside the IPv4 dotted-decimal range `0.0.0.0` to `255.255.255.255`.
- Omitted `evwid` and `evipa` values remain non-diagnostic.
- One to eight hexadecimal digits per `evwid` segment remain accepted when
  the value stays inside the documented range, because the manual defines a
  hexadecimal range rather than a fixed-width token requirement.
- Raw parser output, domain wrapper values, normalized parameters, unit-list
  projection, flow projection, and command generation remain unchanged.

## Impact

- User-visible diagnostics changed for syntactically valid JP1/AJS documents
  containing explicit invalid event IDs or event source IP addresses on
  `evwj` / `revwj`.
- Existing parsed parameter source-location metadata should be enough to point
  diagnostics at explicit `evwid` and `evipa`, so no parser or DTO shape
  change is expected.
- The application diagnostics boundary remains the owner of focused semantic
  parameter feedback; parser grammar and domain wrapper values remain raw.

## Diagnostic Alternatives

- Preserve invalid `evwid` / `evipa` values silently and leave the matrix gap
  visible.
- Move `evwid` / `evipa` validation into domain wrappers, rejected for this
  slice because the current diagnostics policy preserves raw manual-invalid
  values.
- Keep `evwid` and `evipa` as separate micro-slices, rejected because this
  job type already had multiple related deferred validations and the user
  asked for grouped fixes by job type or category where practical.
- Broaden the delivered slice further to `evhst` or
  message/regular-expression validation, deferred because that increases
  behavior and regression surface due to regex and macro-variable allowances.

## Follow-up

- Shared grouped event-host validation now aligns explicit `evhst`
  byte-length diagnostics through the existing editor-feedback boundary while
  preserving regular-expression and macro-variable allowance.
- Revisit broader event reception monitoring job string-filter validation as a
  separate later slice now that the shared `evhst` follow-up is complete.
