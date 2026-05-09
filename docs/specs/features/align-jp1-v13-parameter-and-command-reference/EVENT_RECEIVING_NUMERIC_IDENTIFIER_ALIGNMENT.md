# Event Receiving Numeric-Identifier Alignment

## Purpose

Record the JP1/AJS3 version 13 alignment status for the numeric identifier
parameters of JP1 event reception monitoring jobs.

This keeps the backlog grouped at a user-meaningful size: users configure one
JP1 event reception monitoring job definition, and the remaining numeric
identifier gaps all sit on the same `evwj` / `revwj` diagnostic seam.

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
- Out of scope:
  parser grammar changes, domain wrapper normalization changes, unit-list
  projection changes, flow projection changes, command generation,
  generated artifacts, dependency changes, configuration changes,
  compatible-ISAM or host-environment inputs, timeout-oriented event-
  reception rules such as `etm`, `fd`, `ha`, and `ets`, and `engines.vscode`

## Investigation Notes

- The current event-receiving diagnostic path already validates explicit
  string-filter, event-host, event-ID, IP-address, and search-scope values,
  but it does not yet validate `evuid`, `evgid`, or `evpid`.
- `Evwj` already exposes `evuid`, `evgid`, and `evpid` through the same
  `ParamFactory` facade and the same shared application editor-feedback
  boundary as the previously delivered event-receiving slices.
- The official JP1/AJS3 v13 command reference states that `evuid`, `evgid`,
  and `evpid` each accept signed-decimal values in the range
  `-1..9999999999`.
- This candidate is preferable to HTTP Connection `eu` cleanup because it
  closes three still-visible validation gaps in one job family at once.
- This candidate is preferable to timeout-oriented event-receiving work
  because `etm`, `fd`, `ha`, and `ets` introduce a different validation shape
  and broader execution-context decisions than the remaining numeric
  identifier family.
- `buildSyntaxDiagnostics.ts` already has generic unsigned decimal-range
  helpers, so the likely refactor need is only the smallest signed-range
  helper or rule builder that keeps the new checks on the existing
  `eventReceivingDiagnosticRules` path.

## Delivered Alignment

- Keep ownership in the shared application editor-feedback boundary.
- Add grouped semantic diagnostics for explicit invalid `evuid`, `evgid`, and
  `evpid` values on `evwj` / `revwj`.
- Extract only the smallest helper and rule-array refactor needed to keep the
  signed-decimal range checks on the current event-receiving diagnostics
  path.
- Preserve raw parser output, domain wrapper values, normalized parameters,
  unit-list projection, flow projection, and command generation.

## Affected Backlog

- Event reception monitoring job:
  remaining numeric identifier validation outside the already aligned
  string-filter, event-host, event-ID, IP-address, and search-scope keys

## Alternatives

- Pick HTTP Connection `eu` next:
  rejected because it is smaller and less user-visible than the grouped
  numeric-identifier slice.
- Broaden immediately to `etm`, `fd`, `ha`, or `ets`:
  rejected for now because those timeout-oriented rules are a different
  validation shape from the remaining numeric identifier family.
- Move the validation into domain wrappers:
  rejected because the current alignment policy preserves raw explicit
  manual-invalid values and surfaces them through editor feedback.

## Delivered Behavior

- Editor feedback now reports semantic diagnostics when explicit `evuid`,
  `evgid`, or `evpid` values are not signed decimal integers within the
  documented JP1/AJS3 v13 range `-1..9999999999`.
- Omitted `evuid`, `evgid`, and `evpid` values remain non-diagnostic.
- Existing event-receiving diagnostics should remain on the same shared rule
  path.

## Remaining Gap

- Timeout or start-condition rules such as `etm`, `fd`, `ha`, and `ets`
  remain separate future slices because they require a different validation
  shape from the numeric identifier family.
