# Event Timeout Action Alignment

## Purpose

Record the delivered JP1/AJS3 version 13 parameter-alignment slice around
grouped explicit `ets` timeout-action diagnostics.

This slice groups the remaining user-visible `ets` gap across file monitoring
jobs and execution-interval control jobs instead of reopening one job family at
a time.

## Normative Reference

- Product/version: JP1/Automatic Job Management System 3 version 13
- Manual sections:
  - Command Reference, `5.2.10 File monitoring job definition`
  - Command Reference, `5.2.20 Execution-interval control job definition`
- Parameter in scope:
  `ets={kl|nr|wr|an}`

## Slice Boundary

- Domain seams kept unchanged:
  `src/domain/models/parameters/optionalScalarParameterBuilders.ts`,
  `src/domain/models/parameters/Defaults.ts`,
  `src/domain/models/units/Flwj.ts`, and
  `src/domain/models/units/Tmwj.ts`
- Implementation seam:
  `src/application/editor-feedback/buildSyntaxDiagnostics.ts`
- Existing consumer kept unchanged:
  `src/application/unit-list/buildUnitListRemainingGroups.ts`
- Regression evidence:
  focused `src/test/suite/buildSyntaxDiagnostics.test.ts`
- Out of scope:
  parser grammar changes, domain default changes, unit-list projection changes,
  `tmitv` validation, `etn` validation, broader wait-job default
  reconciliation, other `ets`-bearing unit families, generated artifacts,
  configuration, dependency versions, and `engines.vscode`

## Investigation Notes

- `DEFAULTS.Ets` is already `kl`, and current wrapper or group 13 projection
  behavior for omitted `ets` is already aligned for `flwj` / `rflwj` and
  `tmwj` / `rtmwj`.
- `buildSyntaxDiagnostics.ts` currently has no explicit `ets` validation path,
  so syntactically valid but manual-invalid explicit values remain
  non-diagnostic.
- The same `ets` parameter accessor is exposed by additional wrappers such as
  `Evwj`, `Lfwj`, `Mlwj`, `Mqwj`, `Mswj`, and `Ntwj`, but those families do not
  yet have feature-local alignment records for timeout-action validation.
- Because the current backlog already has two partial rows that share both the
  `ets` parameter and the group 13 `eventTimeoutAction` presentation concept,
  this grouped slice is more user-meaningful than returning to a smaller
  default-only gap such as HTTP Connection `eu`.

## Delivered Alignment

- The editor-feedback boundary now reports a semantic diagnostic when an
  explicit file-monitoring job or recovery file-monitoring job sets `ets`
  outside `{kl|nr|wr|an}`.
- The editor-feedback boundary now reports a semantic diagnostic when an
  explicit execution-interval control job or recovery execution-interval
  control job sets `ets` outside `{kl|nr|wr|an}`.
- Omitted `ets` remains non-diagnostic because existing default behavior is
  already aligned and valid.
- Diagnostics stay at the application editor-feedback boundary, so parser
  output, domain wrapper values, normalized parameters, unit-list projection,
  flow projection, and command generation remain unchanged.
- A small helper extraction now keeps shared explicit allowed-value validation
  on the existing `buildSyntaxDiagnostics.ts` helper/rule-array path instead of
  creating a separate timeout-rule path.

## Impact

- User-visible diagnostics would change for syntactically valid JP1/AJS
  documents containing explicit invalid `ets` values on `flwj`, `rflwj`,
  `tmwj`, or `rtmwj`.
- Existing parsed parameter source-location metadata should be enough to point
  diagnostics at the explicit `ets` parameter, so no parser or DTO shape
  change is expected.
- The application diagnostics boundary remains the owner of this validation;
  domain defaults and projection defaults remain as delivered in earlier
  slices.

## Alternatives

- Revisit only file-monitoring `ets` first; rejected because the remaining
  backlog already has another partial row with the same user-facing timeout
  action concept.
- Broaden the slice to every `ets`-bearing wrapper immediately; rejected
  because that would exceed the currently investigated feature rows and widen
  product interpretation risk.
- Revisit execution-interval `tmitv` / `etn` range behavior in the same slice;
  rejected because the current evidence set and rules are not the same as the
  shared explicit `ets` allowed-value rule.

## Follow-up

- File monitoring can now be treated as `Aligned` for the currently modeled
  `flwf`, `flwc`, `flwi`, `flco`, and `ets` scope.
- Execution-interval control still retains separate follow-up for `tmitv` /
  `etn` validation and broader wait-job reconciliation.
