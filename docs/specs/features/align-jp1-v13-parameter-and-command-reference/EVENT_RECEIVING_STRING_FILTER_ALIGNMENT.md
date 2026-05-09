# Event Receiving String-Filter Alignment

## Purpose

Record the next JP1/AJS3 version 13 parameter-alignment candidate around the
remaining event-reception monitoring filter parameters that still pass through
editor feedback without semantic validation.

This keeps the backlog grouped at a user-meaningful size: users configure one
JP1 event reception monitoring job definition, and the remaining validation
gaps all sit on the same `evwj` / `revwj` diagnostic seam.

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
  `src/extension/diagnostics/registerDiagnostics.ts` plus
  `src/domain/models/units/Evwj.ts` and `Revwj` via inheritance
- Regression evidence:
  `src/test/suite/buildSyntaxDiagnostics.test.ts`
- Preservation evidence:
  existing raw projection coverage in `src/test/suite/buildUnitListView.test.ts`
- Out of scope:
  parser grammar changes, domain wrapper normalization changes, unit-list
  projection changes, flow projection changes, command generation,
  generated artifacts, dependency changes, configuration changes,
  compatible-ISAM or host-environment inputs, and `engines.vscode`

## Investigation Notes

- The current event-receiving diagnostic path only validates `evhst`,
  `evwid`, `evipa`, and `evesc`, even though `Evwj` already exposes the
  remaining filter family through the same `ParamFactory` facade.
- The manual-backed remaining explicit filter family is still concentrated in
  one job definition: `evusr`, `evgrp`, `evwms`, `evdet`, `evwfr`, and
  `evtmc`.
- The official JP1/AJS3 v13 command reference states:
  - `evusr` and `evgrp` accept `1..20` bytes and allow regular expressions.
  - `evwms` and `evdet` accept `1..1024` bytes and allow regular expressions.
  - `evwfr` accepts the `optional-extended-attribute-name:"value"` form with
    total content up to `2048` bytes, and allows regular expressions and
    macro variables in the attribute-name part.
  - `evtmc` accepts only `n`, `a`, `n:"file-name"`, `a:"file-name"`,
    `d:"file-name"`, or `b:"file-name"`, and the file-name part accepts
    `1..256` bytes.
- This candidate is preferable to a default-only cleanup such as HTTP
  Connection `eu`, because it closes multiple still-visible filter gaps in
  one job family at once.
- This candidate is preferable to broader compatible-ISAM or transfer-path
  work because it stays inside one existing diagnostic seam and one existing
  regression file.

## Delivered Alignment

- kept ownership in the shared application editor-feedback boundary;
- added grouped semantic diagnostics for explicit invalid event-receiving
  string-filter values on `evwj` / `revwj`;
- extracted only the smallest helper and rule-array refactor needed to keep
  shared quoted-string and byte-length checks on the current
  event-receiving diagnostics path;
- preserved raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation.

## Affected Backlog

- Event reception monitoring job:
  remaining string-filter validation outside the already aligned `evhst`,
  `evwid`, `evipa`, and `evesc` keys

## Alternatives

- Pick HTTP Connection `eu` next:
  rejected because it is smaller and less user-visible than the grouped
  filter-family slice.
- Broaden immediately to `evuid`, `evgid`, `evpid`, `etm`, or `fd`:
  rejected for now because those numeric or timeout-oriented rules are a
  different validation shape from the remaining string-filter family.
- Move the validation into domain wrappers:
  rejected because the current alignment policy preserves raw explicit manual-
  invalid values and surfaces them through editor feedback.

## Delivered Behavior

- Editor feedback now reports semantic diagnostics when explicit `evusr` or
  `evgrp` values are not quoted strings within `1..20` bytes.
- Editor feedback now reports semantic diagnostics when explicit `evwms` or
  `evdet` values are not quoted strings within `1..1024` bytes.
- Editor feedback now reports semantic diagnostics when explicit `evwfr`
  values do not use `optional-extended-attribute-name:"value"` format within
  `2048` bytes.
- Editor feedback now reports semantic diagnostics when explicit `evtmc`
  values are outside the documented allowed forms or use a quoted file name
  outside `1..256` bytes.
- Existing `evhst`, `evwid`, `evipa`, and `evesc` diagnostics remain on the
  same event-receiving rule path.

## Remaining Gap

- Numeric identifier validation for `evuid`, `evgid`, and `evpid`, plus
  timeout or start-condition rules such as `etm`, `fd`, `ha`, and `ets`,
  remain separate future slices because they are a different validation shape
  from the delivered string-filter family.
