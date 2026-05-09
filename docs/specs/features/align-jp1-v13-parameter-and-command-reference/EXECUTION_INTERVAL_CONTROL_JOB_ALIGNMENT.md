# Execution-Interval Control Job Alignment

## Purpose

Record the delivered JP1/AJS3 version 13 alignment status for
execution-interval control job defaults, unit-list group 13 projection, and
the remaining context-sensitive validation candidate for `tmwj` / `rtmwj`.

## Reference

- JP1/AJS3 version 13 Command Reference, "Execution-interval control job
  definition"
- Parameters in scope:
  `tmitv=wait-time`, `etn={y|n}`, and `ets={kl|nr|wr|an}`

The reference defines omitted values as:

- `tmitv`: `10`
- `etn`: `n`
- `ets`: `kl`

The same reference also documents context-sensitive behavior around
`etn=y`, including start-condition semantics and compatible-ISAM
restrictions that are not yet modeled in editor feedback.

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

- Explicit `ets` timeout-action diagnostics are now aligned through the shared
  editor-feedback boundary for `tmwj` / `rtmwj`.
- Explicit `tmitv` range diagnostics are now aligned through the shared
  editor-feedback boundary for `tmwj` / `rtmwj`.
- Explicit `etn` allowed-value diagnostics are now aligned through the shared
  editor-feedback boundary for `tmwj` / `rtmwj`.
- Explicit `etn=y` now reports a semantic diagnostic when a `tmwj` / `rtmwj`
  unit is not defined in a start-condition context.
- Compatible-ISAM-specific `etn` restrictions are not planned for this
  repository because compatible-ISAM applies only to legacy migration-mode
  environments that this extension will not model explicitly.
- Broader wait-job default reconciliation also remains outside the smallest
  meaningful validation slice.

## Delivered Context Slice

- Delivered scope:
  grouped execution-interval control context diagnostics for `tmwj` /
  `rtmwj`, limited to the documented start-condition restriction for explicit
  `etn=y`.
- Ownership boundary:
  `src/application/editor-feedback/buildSyntaxDiagnostics.ts`, reusing the
  current `executionIntervalControlDiagnosticRules` path and any small helper
  extraction needed to keep context-sensitive checks on the existing
  rule-array structure.
- Evidence:
  `src/test/suite/buildSyntaxDiagnostics.test.ts` now covers both valid
  start-condition-context `etn=y` usage and invalid non-start-condition
  usage. Existing `parameterFactory` and unit-list evidence remain unchanged
  because this slice preserves domain defaults and presentation projection.
- Preserved boundaries:
  raw parser output, domain wrapper values, normalized parameters, unit-list
  group 13 projection, flow projection, command generation, generated
  artifacts, configuration, dependency versions, and `engines.vscode`.
- Refactoring note:
  the current execution-interval diagnostics are still simple value-local
  rules. This slice added only a sibling-context helper so the new semantic
  check stays beside the existing execution-interval rule path rather than on
  a separate implementation branch.

## Alternatives

- Keep group 13 raw by design and leave the gap visible in the matrix.
- Project defaults for group 13 only, without adding a domain `tmitv` default.
  This avoids wrapper behavior change but leaves domain and projection
  semantics inconsistent.
- Defer the slice until all wait-job defaults are reconciled. This is broader
  than the current focused manual-backed behavior gap.
- Jump directly to platform-specific transfer-file path interpretation:
  rejected for now because the remaining execution-interval gap is still more
  self-contained, already sits behind one diagnostic seam, and keeps the
  backlog grouped by one job definition instead of by environment-specific
  file-path behavior.
- Model compatible-ISAM as a hard-coded global assumption:
  rejected because compatible-ISAM is a legacy migration-only mode that this
  repository will not support explicitly, and inferring it inside editor
  feedback would add an unsupported environment dependency.
