# Wait-Job Timeout-Action Default Alignment

## Purpose

Record the next JP1/AJS3 version 13 parameter-alignment candidate around the
remaining inconsistent unit-list projection of omitted `ets` values across the
currently modeled wait-job families.

This slice is grouped at a user-meaningful size: the same group 13
`eventTimeoutAction` concept is already shown to users for file monitoring and
execution-interval control jobs, while several other wait-job families still
fall back to raw-only projection even though the shared domain accessor already
exposes the same default.

## Normative Reference

- Product/version: JP1/Automatic Job Management System 3 version 13
- Manual sections sharing `ets={kl|nr|wr|an}`:
  - Command Reference, file-monitoring-job family
  - Command Reference, execution-interval-control-job family
  - Command Reference, currently modeled wait-job families that expose `ets`
- Parameter in scope:
  `ets={kl|nr|wr|an}` with omitted value resolved through the shared default
  path already modeled by `ParamFactory.ets`

## Slice Boundary

- Application seam:
  `src/application/unit-list/buildUnitListRemainingGroups.ts`
- Existing shared view contract:
  `src/application/unit-list/buildUnitListView.ts`
- Existing domain reference points kept unchanged:
  `src/domain/models/parameters/optionalScalarParameterBuilders.ts`,
  `src/domain/models/parameters/Defaults.ts`, and the wait-job wrappers that
  already expose `ParamFactory.ets`
- Candidate unit scope:
  `lfwj` / `rlfwj`, `mlwj` / `rmlwj`, `mqwj` / `rmqwj`,
  `mswj` / `rmswj`, and `ntwj` / `rntwj`
- Regression evidence:
  `src/test/suite/buildUnitListRemainingGroups.test.ts` and
  `src/test/suite/buildUnitListView.test.ts`
- Out of scope:
  parser grammar changes, editor-feedback diagnostics, domain-wrapper default
  changes, normalized parameter storage, flow projection, command generation,
  generated artifacts, dependency changes, configuration, and
  `engines.vscode`

## Investigation Notes

- `ParamFactory.ets` already resolves omitted values through `DEFAULTS.Ets`,
  so the remaining mismatch is not in the domain accessor. The visible gap is
  that `buildUnitListRemainingGroups.ts` still makes group 13
  `eventTimeoutAction` default-aware only for `flwj` / `rflwj` and
  `tmwj` / `rtmwj`.
- The currently modeled wait-job wrappers `Lfwj`, `Mlwj`, `Mqwj`, `Mswj`, and
  `Ntwj` already expose the same `ets` parameter through the same shared
  accessor, which makes this a better shared projection/refactor slice than a
  job-by-job cleanup.
- Because the current gap is presentation-facing and already has a narrow seam,
  it is a better next slice than broadening immediately into transfer-file
  macro-variable tightening or other environment-sensitive work.
- The current `findGroup13EventTimeoutAction(...)` helper is the smallest
  refactor seam. If approved, it should be generalized so one default-aware
  path owns all currently modeled wait-job families that surface the group 13
  timeout-action concept.

## Planned Alignment If Approved

- Keep ownership in the shared application unit-list projection boundary.
- Reconcile omitted `ets` display for the currently modeled wait-job families
  so group 13 `eventTimeoutAction` uses the same JP1/AJS3 v13 default-aware
  behavior already exposed through `ParamFactory.ets`.
- Refactor only enough helper structure to replace the current narrow
  job-family special-casing with one shared, readable default-aware projection
  path.
- Preserve explicit normalized values, raw parser output, domain wrapper
  values, editor-feedback diagnostics, flow projection, and command
  generation.

## Delivered Alignment

- Unit-list group 13 `eventTimeoutAction` now resolves omitted `ets` through
  the shared `DEFAULTS.Ets` path for the approved currently modeled wait-job
  families `lfwj` / `rlfwj`, `mlwj` / `rmlwj`, `mqwj` / `rmqwj`,
  `mswj` / `rmswj`, and `ntwj` / `rntwj`.
- Explicit normalized `ets` values remain visible and unchanged.
- The implementation stays inside `buildUnitListRemainingGroups.ts` and
  replaces the earlier narrow family-specific check with one shared
  default-aware helper path for the approved scope.
- Raw parser output, domain wrapper values, editor-feedback diagnostics, flow
  projection, and command generation remain unchanged.

## Alternatives

- Leave the current projection unchanged:
  viable, but rejected because it keeps the user-visible table inconsistent
  across job families that already share one domain default seam.
- Broaden the slice to every wait-condition parameter:
  rejected because that would mix one clear omitted-default display gap with
  larger wait-context semantics.
- Switch to transfer-file macro-variable tightening first:
  viable, but deferred because this wait-job slice is smaller, more obviously
  refactor-oriented, and closes a visible inconsistency without changing
  diagnostics.

## Follow-up

- Execution-interval control job defaults no longer need to keep this shared
  `eventTimeoutAction` projection inconsistency as a remaining gap.
- Event-receiving `ets` projection and any broader wait-condition-family
  reconciliation remain separate future work unless explicitly approved.
