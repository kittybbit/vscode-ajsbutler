# PLANS: align-jp1-v13-parameter-and-command-reference

## Objective

Move parameter interpretation and supported `ajs` command generation onto
explicit JP1/AJS3 version 13 reference-driven contracts.

## Scope

- Align parameter parsing with the Definition File Reference.
- Keep generated command support tied to the Command Reference.
- Expand command and parameter support incrementally.

## Delivered

- Recorded the current parameter and command-generation audit in `AUDIT.md`.
- Extracted `ajsshow` and `ajsprint` generation into
  `buildAjsCommands(...)`.
- Added command-builder metadata for the supported commands.
- Localized command-builder labels, descriptions, and manual links through the
  existing message resources.
- Prepared the schedule-rule parameter slice in
  `SCHEDULE_RULE_ALIGNMENT.md`.
- Added behavior-preserving schedule-rule regression tests for thin evidence
  before changing helper semantics.
- Implemented the first behavior-changing schedule-rule alignment fix by
  ignoring `ln` on root jobnets.
- Started category-level value parsing alignment with the schedule-rule
  parameter family, using shared domain helpers as the boundary pattern.
- Prepared the next category-level helper-boundary slice for transfer
  operation parameters in `TRANSFER_OPERATION_ALIGNMENT.md`.
- Extracted `top1` to `top4` default resolution into
  `transferOperationHelpers.ts` while preserving explicit and derived values.
- Prepared the next non-schedule category slice for job end-judgment
  parameters in `JOB_END_JUDGMENT_ALIGNMENT.md`.
- Aligned omitted UNIX/PC job and UNIX/PC custom job `jd` values to the
  JP1/AJS3 v13 default `cod` behind `jobEndJudgmentHelpers.ts`.
- Investigated HTTP Connection job defaults in
  `HTTP_CONNECTION_JOB_DEFAULT_ALIGNMENT.md` as the next small
  parameter-default candidate.
- Aligned omitted HTTP Connection job `eu` values to `def` through
  `httpConnectionJobDefaultHelpers.ts` while preserving explicit values and
  generic non-HTTP `eu=ent` behavior.

## Impact Investigation

- Planned change: align the omitted HTTP Connection job `eu` default with the
  JP1/AJS3 version 13 `ajsprint -a` default values table by resolving `Htpj`
  and `Rhtpj` omitted `eu` values to `def` while preserving the generic `eu`
  default of `ent` for other job families.
- Affected files:
  `src/domain/models/units/Htpj.ts`,
  `src/domain/models/parameters/Defaults.ts`,
  `src/domain/models/parameters/optionalScalarParameterBuilders.ts`,
  a possible new HTTP Connection job default helper, focused parameter factory
  tests, and this feature's SDD docs.
- Affected features: JP1/AJS parameter interpretation for HTTP Connection job
  execution-user defaults.
- Tests affected: parameter factory regression tests; helper tests if a helper
  seam is introduced.
- Breaking-change risk: medium. Omitted HTTP Connection job `eu` values would
  surface as `def`, matching the `ajsprint -a` default values table, but any
  existing consumer that expected the generic `ent` fallback for HTTP
  Connection jobs will observe a changed default value. The definition section
  and `ajsprint -a` default table must remain explicitly cited because they are
  the approval-sensitive reference boundary for this slice.
- Alternatives considered: leave generic `DEFAULTS.Eu` behavior unchanged and
  record the HTTP Connection job default as unresolved; change `DEFAULTS.Eu`
  globally to `def`; or build a full parameter matrix before implementation.
  The proposed small helper seam is preferred because it limits the behavior
  change to `Htpj` and `Rhtpj`.
- Approval: human approval to proceed was given on 2026-04-28 after the
  investigation summary for HTTP Connection job `eu` default alignment.

## Follow-up

- Apply the same value parsing audit/refactor workflow to other parameter
  categories before marking them official-reference aligned.
- Build a parameter-coverage matrix when category-level status needs tracking
  beyond the current audit summary.
- Revisit QUEUE job transfer-file coverage separately because the manual
  defines `tsN` and `tdN` but not `topN`.
- Revisit invalid `jd` / `abr` combinations when diagnostics behavior is
  explicit.
- Reconcile HTTP Connection job `eu` wording across the definition section and
  `ajsprint -a` default table if future evidence conflicts with the approved
  behavior.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run qlty`; add `pnpm run lint:md` when useful

Current branch validation:

- 2026-04-27: `npm test`
- 2026-04-27: `npm run qlty`
- 2026-04-27: `npm run test:web`
- 2026-04-27: `npm run build`
- 2026-04-28: `npm test`
- 2026-04-28: `npm run qlty`
- 2026-04-28: `npm run test:web`
- 2026-04-28: `npm run build`
