# Feature Traceability: Clarify SDD Document Ownership and Lifecycle

## Mapping

| Use Case              | Requirement | `SPECS.md`      | Slice  | Validation |
| --------------------- | ----------- | --------------- | ------ | ---------- |
| Repository workflow   | R1          | Requirements R1 | S1     | V1         |
| Repository workflow   | R2          | Requirements R2 | S1     | V2         |
| Repository workflow   | R3          | Requirements R3 | S1     | V3         |
| Repository planning   | R4          | Requirements R4 | S2     | V4         |
| Durable documentation | R5          | Requirements R5 | S1, S2 | V5         |
| Agent workflow        | R6          | Requirements R6 | S1     | V6         |
| Repository workflow   | R7          | Requirements R7 | S1     | V7         |

No observable extension use case changes. The labels above identify repository
workflow responsibilities rather than files under
`docs/requirements/use-cases/`.

## Slice Definitions

- S1: Switch SDD Lifecycle Ownership And Retire Shared Plans.
- S2: Normalize Roadmap To Unfinished Future Work.

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
- V7: verify one feature branch, one feature folder, and one `TASKS.md` owner
  across SSOT, templates, and skills.

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
- V7 passed: the SSOT, agent guidance, templates, and skills consistently make
  the feature `TASKS.md` the sole branch plan and current-state owner.
- Structure checks passed: one Agent Brief exists per feature `TASKS.md`, no
  feature `CONTEXT.md` exists, no non-template placeholder remains, and
  `rtk git diff --check` passed.

## Current Status

- Feature intake: complete.
- Planning: reviewed and human-approved for Slice 1 and Slice 2.
- Implementation: Slice 1 complete; Slice 2 approved and not started.
- Validation results: Slice 1 results and completion approval are recorded;
  Slice 2 validation is pending.
