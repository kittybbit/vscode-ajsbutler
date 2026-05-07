# Execution-Interval Control Job Alignment

## Purpose

Record the delivered JP1/AJS3 version 13 alignment status for
execution-interval control job defaults and unit-list group 13 projection.

## Reference

- JP1/AJS3 version 13 Command Reference, "Execution-interval control job
  definition"
- Parameters in scope:
  `tmitv=wait-time`, `etn={y|n}`, and `ets={kl|nr|wr|an}`

The reference defines omitted values as:

- `tmitv`: `10`
- `etn`: `n`
- `ets`: `kl`

## Delivered Alignment

- `Tmwj.tmitv`, `Tmwj.etn`, and `Tmwj.ets` now resolve omitted values through
  `DEFAULTS.Tmitv`, `DEFAULTS.Etn`, and `DEFAULTS.Ets` at the domain parameter
  boundary.
- Unit-list group 13 now projects omitted `tmitv`, `etn`, and `ets` defaults
  for `tmwj` / `rtmwj`.
- Explicit normalized values remain visible.
- Non-execution-interval-control jobs remain unchanged.

## Non-Goals

- parser grammar changes
- command generation changes
- diagnostics or range validation
- generated artifact changes
- dependency or configuration changes
- `engines.vscode` changes
- broad wait-job default reconciliation outside `tmwj` / `rtmwj`

## Evidence

- `src/test/suite/parameterFactory.test.ts` verifies omitted `tmitv`, `etn`,
  and `ets` defaults through the wrapper facade.
- `src/test/suite/buildUnitListRemainingGroups.test.ts` verifies group 13
  projection for omitted and explicit execution-interval control job values.
- `src/test/suite/buildUnitListView.test.ts` keeps the row-view projection
  path covered.

## Remaining Gap

- Range validation and broader wait-job default reconciliation remain outside
  this delivered slice.

## Alternatives

- Keep group 13 raw by design and leave the gap visible in the matrix.
- Project defaults for group 13 only, without adding a domain `tmitv` default.
  This avoids wrapper behavior change but leaves domain and projection
  semantics inconsistent.
- Defer the slice until all wait-job defaults are reconciled. This is broader
  than the current focused manual-backed behavior gap.
