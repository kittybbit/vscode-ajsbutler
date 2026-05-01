# Execution-Interval Control Job Alignment

## Purpose

Track the JP1/AJS3 version 13 alignment slice for execution-interval control
job defaults and unit-list group 13 projection.

## Reference

- JP1/AJS3 version 13 Command Reference, "Execution-interval control job
  definition"
- Parameters in scope:
  `tmitv=wait-time`, `etn={y|n}`, and `ets={kl|nr|wr|an}`

The reference defines omitted values as:

- `tmitv`: `10`
- `etn`: `n`
- `ets`: `kl`

## Current Behavior

- `Tmwj.tmitv` delegates to `ParamFactory.tmitv`, and `ParamFactory.tmitv`
  currently has no default value.
- `Tmwj.etn` and `Tmwj.ets` delegate to factory builders that already use
  `DEFAULTS.Etn` and `DEFAULTS.Ets`.
- Unit-list group 13 currently reads normalized raw values for `tmitv` and
  `etn`.
- Unit-list group 13 now uses default-aware `ets` projection only for file
  monitoring jobs, not for execution-interval control jobs.

## Proposed Scope

After human approval, align execution-interval control job behavior by:

- adding a `tmitv` default of `10` at the domain parameter boundary;
- projecting omitted `tmitv`, `etn`, and `ets` defaults for `tmwj` / `rtmwj`
  in unit-list group 13;
- preserving explicit normalized values;
- leaving non-execution-interval-control jobs unchanged.

## Non-Goals

- parser grammar changes
- command generation changes
- diagnostics or range validation
- generated artifact changes
- dependency or configuration changes
- `engines.vscode` changes
- broad wait-job default reconciliation outside `tmwj` / `rtmwj`

## Impact

- Domain behavior changes for omitted `Tmwj.tmitv`, because the wrapper would
  return `10` instead of no value.
- Unit-list group 13 output changes for omitted execution-interval control job
  `tmitv`, `etn`, and `ets`, because the table would display defaults instead
  of empty cells.
- Raw parser output and normalized key/value storage should remain unchanged.

## Alternatives

- Keep group 13 raw by design and leave the gap visible in the matrix.
- Project defaults for group 13 only, without adding a domain `tmitv` default.
  This avoids wrapper behavior change but leaves domain and projection
  semantics inconsistent.
- Defer the slice until all wait-job defaults are reconciled. This is broader
  than the current focused manual-backed behavior gap.
