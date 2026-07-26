# Feature Traceability: Clarify SDD Document Ownership and Lifecycle

## Mapping

| Use Case              | Requirement | `SPECS.md`       | Slice  | Validation |
| --------------------- | ----------- | ---------------- | ------ | ---------- |
| Repository workflow   | R1          | Requirements R1  | S1     | V1         |
| Repository workflow   | R2          | Requirements R2  | S1     | V2         |
| Repository workflow   | R3          | Requirements R3  | S1, S3 | V3, V7     |
| Repository planning   | R4          | Requirements R4  | S2     | V4         |
| Durable documentation | R5          | Requirements R5  | S1, S2 | V5         |
| Agent workflow        | R6          | Requirements R6  | S1     | V6         |
| Repository workflow   | R7          | Requirements R7  | S1, S3 | V7         |
| Agent workflow        | R8          | Requirements R8  | S3     | V8         |
| Repository workflow   | R9          | Requirements R9  | S3     | V9         |
| Repository planning   | R10         | Requirements R10 | S3     | V10        |

No observable extension use case changes. The labels above identify repository
workflow responsibilities rather than files under
`docs/requirements/use-cases/`.

## Slice Definitions

- S1: Switch SDD Lifecycle Ownership And Retire Shared Plans.
- S2: Normalize Roadmap To Unfinished Future Work.
- S3: Define Branch-Selected Feature Ownership.

## Validation Plans

- V1: inspect the SDD SSOT coverage; run Markdown lint and qlty.
- V2: verify temporary feature artifacts and approved folder-removal rules.
- V3: verify retired artifacts and all effective references; classify allowed
  historical, feature-local, and configuration matches.
- V4: compare every roadmap item with its recorded disposition and run focused
  completed/current-state searches.
- V5: verify durable knowledge destinations and confirm no unrelated durable
  document update is introduced.
- V6: search templates, active features, docs, skills, and agent instructions;
  exercise the four SDD skill entry assumptions by review.
- V7: verify each `TASKS.md` owns its feature and only the selected feature's
  `TASKS.md` owns active branch implementation planning; verify the legacy
  WebAPI `PLANS.md` is removed without losing durable or unfinished information.
- V8: verify deterministic selected-feature resolution, branch-base evidence,
  ambiguity and unresolved-base stops, no folder-existence-only selection, and
  no ownership transfer from policy-only edits to an inherited feature.
- V9: verify selection locking and selected-feature-only Feature Exit while
  inherited feature folders and unrelated pending state remain untouched.
- V10: verify sync cadence updates each artifact only when its owned
  information becomes stale and slice completion alone does not update the
  roadmap.

## Slice 1 Validation Results

- V1 passed: `docs/specs/README.md` owns the lifecycle and document roles;
  `rtk pnpm run qlty` and `rtk pnpm run lint:md` passed.
- V2 passed: the SSOT, templates, skills, and pull-request checklist define
  feature documents as temporary and require approved whole-folder removal.
- V3 passed: root `PLANS.md`, `docs/specs/plans.md`, and
  `PLANS.template.md` are deleted. Remaining names are limited to this
  feature's removal requirements, CHANGELOG history, and the non-effective
  `.vscodeignore` entry.
- V5 passed for Slice 1: durable lifecycle policy and concise repository
  guidance were updated; runtime, root README, CHANGELOG, architecture,
  context map, glossary, and roadmap were not changed.
- V6 passed: all four SDD skills, templates, active WebAPI tasks, Copilot
  guidance, and the pull-request checklist were reviewed without an effective
  retired-plan dependency.
- The original V7 result is superseded: it consistently applied the
  then-approved physical-folder ownership rule, but the review finding proved
  that rule invalid when inherited unfinished feature folders coexist. V7 was
  revalidated by Slice 3 below.
- Structure checks passed: one Agent Brief exists per feature `TASKS.md`, no
  feature `CONTEXT.md` exists, no non-template placeholder remains, and
  `rtk git diff --check` passed.

## Slice 2 Validation Results

- V4 passed: current roadmap items 1, 3–7, 9, and 10 were removed according to
  their recorded dispositions; unfinished WebAPI beta-exit and telemetry
  product-learning decisions remain.
- V4 passed for deferred work: all seven candidates remain with concrete entry
  conditions, and JP1/AJS View parity no longer refers to a closed active
  feature.
- Focused searches found no completion history, maintenance catalog, active
  feature or slice state, current-branch progress, slice status, process
  principles, or done criteria in `roadmap.md`.
- V5 passed for Slice 2: only `docs/specs/roadmap.md` was changed as durable
  documentation; root README, CHANGELOG, architecture, context map, glossary,
  use cases, and cross-cutting requirements remain unchanged.
- Durable-source comparison passed against the WebAPI use case and active
  feature, architecture compatibility contract, and telemetry cross-cutting
  requirement.
- `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and
  `rtk git diff --check` passed.

## Slice 3 Validation Results

- V7 passed: feature `TASKS.md` ownership is feature-local, only the selected
  feature owns active branch implementation work, and the legacy WebAPI
  `PLANS.md` was removed without losing durable or unfinished information.
- V8 passed: the SSOT and four SDD skills apply deterministic selection,
  branch-base evidence, ambiguity and unresolved-base stops, and exclusion of
  folder-only or policy-only inherited-feature evidence.
- V9 passed: the selected feature remains fixed across planning, review,
  implementation, and Feature Exit; only its folder is removed, while inherited
  pending tasks and risks remain outside its completion conditions.
- V10 passed: sync guidance updates only artifacts whose owned information
  becomes stale and does not treat slice completion alone as a roadmap trigger.
- The six focused ownership searches, feature-folder comparison with
  `origin/main`, WebAPI document disposition review, Agent Brief and `CONTEXT.md`
  structure checks, and 18-file approval-boundary review passed.
- `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and
  `rtk git diff --check` passed.

## Current Status

- Feature intake: complete.
- Planning: Replanning Mode added Slice 3 after the selected-feature ownership
  review finding; re-review passed and new Human Approval was recorded.
- Implementation: Slice 1, Slice 2, and Slice 3 are complete with completion
  approvals recorded.
- Validation results: V1–V10 passed; Feature Exit Review remains.
