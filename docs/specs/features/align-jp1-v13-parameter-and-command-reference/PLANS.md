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
- Investigated JP1 event sending job arrival-check defaults in
  `EVENT_SEND_JOB_ALIGNMENT.md` as the next category-level parameter
  candidate.
- Aligned omitted JP1 event sending job `evsrc` values to `10` through
  `DEFAULTS.Evsrc`, while preserving explicit values and leaving normalized
  unit-list projection raw.

## Impact Investigation

- Planned change: align the omitted JP1 event sending job `evsrc` default with
  the JP1/AJS3 version 13 event sending job definition by resolving `Evsj` and
  `Revsj` omitted `evsrc` values to `10`, while preserving explicit `evsrc`
  values and existing `evssv`, `evsrt`, and `evspl` defaults.
- Affected files:
  `src/domain/models/units/Evsj.ts`,
  `src/domain/models/parameters/Defaults.ts`,
  `src/domain/models/parameters/optionalScalarParameterBuilders.ts`,
  a possible new JP1 event sending job default helper,
  `src/application/unit-list/buildUnitListRemainingGroups.ts` if normalized
  projection is approved for default-aware behavior, focused parameter factory
  tests, focused unit-list tests if projection changes, and this feature's SDD
  docs.
- Affected features: JP1/AJS parameter interpretation for JP1 event sending
  job arrival-check defaults; unit-list group 14 event-action columns if
  normalized projection behavior changes.
- Tests affected: parameter factory regression tests; helper tests if a helper
  seam is introduced; build-unit-list view tests only if default-aware
  projection is approved.
- Breaking-change risk: medium. Omitted JP1 event sending job `evsrc` values
  would surface as `10`, matching the manual, but any consumer expecting the
  current generic `0` fallback will observe a changed default value. Unit-list
  behavior is a separate risk because it currently reads normalized raw
  parameters rather than wrapper defaults.
- Alternatives considered: leave generic `DEFAULTS.Evsrc` behavior unchanged
  and record the event sending job check-count mismatch as unresolved; change
  `DEFAULTS.Evsrc` globally to `10` only after confirming no other unit family
  shares the current `0` assumption; or defer until a full parameter coverage
  matrix exists. A focused helper seam is preferred if global impact remains
  ambiguous.
- Approval: human approval to proceed was given on 2026-04-28 after the
  investigation summary for JP1 event sending job `evsrc` default alignment.
  The approved scope keeps unit-list normalized projection raw.

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
- Revisit JP1 event sending job `evhst` requiredness when `evsrt=y` after the
  diagnostics behavior contract is explicit.

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
- 2026-04-28: `pnpm run lint:md`
- 2026-04-28: `npm test`
- 2026-04-28: `npm run test:web`
- 2026-04-28: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-04-28: `pnpm run qlty` passed after excluding `.serena/` from Qlty
