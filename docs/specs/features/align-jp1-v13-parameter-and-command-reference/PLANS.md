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

## Impact Investigation

- Planned change: align the omitted `jd` default for UNIX/PC jobs and
  UNIX/PC custom jobs with JP1/AJS3 version 13 by changing the default from
  `cond` to `cod` and moving the category-specific default into a
  job-end-judgment helper seam.
- Affected files:
  `src/domain/models/parameters/Defaults.ts`,
  `src/domain/models/parameters/jobEndJudgmentHelpers.ts`,
  `src/domain/models/parameters/optionalScalarParameterBuilders.ts`,
  `src/test/suite/jobEndJudgmentHelpers.test.ts`,
  `src/test/suite/parameterFactory.test.ts`, and this feature's SDD docs.
- Affected features: JP1/AJS parameter interpretation for UNIX/PC job and
  UNIX/PC custom job end-judgment defaults.
- Tests affected: parameter helper and parameter factory regression tests.
- Breaking-change risk: medium. Omitted `jd` values will now surface as
  `cod`, matching the v13 manual and `ajsprint -a` default table, but any
  existing consumer that expected the previous `cond` fallback will observe a
  changed default value.
- Alternatives considered: leave `DEFAULTS.Jd` as-is and document the mismatch;
  this was rejected because the roadmap prioritizes manual-backed parameter
  alignment and the affected behavior has a focused regression boundary.
- Approval: human approval to proceed was given on 2026-04-27 after branch
  creation for `codex/align-job-end-judgment-parameters`.

## Follow-up

- Apply the same value parsing audit/refactor workflow to other parameter
  categories before marking them official-reference aligned.
- Build a parameter-coverage matrix when category-level status needs tracking
  beyond the current audit summary.
- Revisit QUEUE job transfer-file coverage separately because the manual
  defines `tsN` and `tdN` but not `topN`.
- Revisit invalid `jd` / `abr` combinations when diagnostics behavior is
  explicit.

## Validation

- code changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`,
  `pnpm run build`
- docs-only changes: `pnpm run qlty`; add `pnpm run lint:md` when useful

Current branch validation:

- 2026-04-27: `npm test`
- 2026-04-27: `npm run qlty`
- 2026-04-27: `npm run test:web`
- 2026-04-27: `npm run build`
