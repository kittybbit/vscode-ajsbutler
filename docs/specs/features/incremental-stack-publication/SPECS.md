# Feature Specification: Incremental Stack Publication

## Purpose

Publish each completed SDD slice and verify its current GitHub head before
starting dependent work, reducing cascading rebuilds when CI finds a correction.
Preserve native stacked PRs and the existing approval and merge boundaries.

## Source

- User request to publish the SDD PR stack per completed slice rather than
  waiting until feature completion; user explicitly reconfirmed stacking.
- Main's intake decision: completion commit, immediate slice PR publication,
  current-head checks, then dependent-slice creation and implementation.
- Existing [core policy](../../README.md#github-standard-stacked-pull-requests),
  [validation](../../validation.md), and [evidence](../../evidence.md) contracts.
- Kind: transient branch feature; no roadmap product item or JP1/AJS semantic
  change. JP1/AJS basis is preservation of all existing definition workflows.

## Requirements and acceptance

- R1: After an approved slice completion commit, Main immediately publishes or
  updates that slice's PR. The first PR targets trunk; each later PR targets its
  predecessor branch and retains the independently reviewed predecessor diff.
  For example: slice-1 targets main, slice-2 targets slice-1, and slice-3 targets
  slice-2. Lower layers are not merged early to enable dependent work.
- R2: Before creating or starting a dependent slice, Main verifies the
  predecessor PR's exact current-head required GitHub CI/checks and applicable
  Cloud gates. Pending, failed, missing, or old-head results cannot pass. A
  completion commit alone is insufficient to start the dependent slice.
- R3: A CI failure stays with the owning slice. Deterministic corrections retain
  existing approved boundaries and follow correction, independent re-review,
  explicit approval, and focused commit gates before updating that PR and
  verifying its new head. New decisions return through Main for Replanning.
- R4: Publication does not grant merge authority. Feature Exit, closure review
  and approval, closure commit, and separate explicit Human Merge Approval
  remain required. A closure commit changes the final head and requires its
  current-head checks again. Preserve actual GitHub rules at merge.
- R5: Reuse valid local evidence under the existing Evidence Contract. Keep PR,
  predecessor, head, and gate references in existing records; introduce no
  custom stack tooling, extra lifecycle state, or parallel state registry.
- R6: Validate the documentation with static scenarios covering successful
  incremental publication, pending/missing/failed/stale checks, owning-slice
  correction, and closure-head invalidation while retaining final merge gates.

## Decisions and impact

- Solution Shape: publication scheduling belongs to the core SDD
  policy in `docs/specs/README.md`; Main executes it. Existing native GitHub
  stack capability is sufficient; no new abstraction or tooling is warranted.
- Expected policy surfaces are the core contract, validation's correction
  handling for an already committed slice, and the TASKS template's per-slice
  publication/check/predecessor references. The plan fixes one cohesive slice
  in `TASKS.md` and these exact durable paths:
  `docs/specs/README.md`, `docs/specs/validation.md`, and
  `docs/specs/features/_templates/TASKS.template.md`. Approval remains Pending.
- Evidence freshness already belongs to `evidence.md`; role contracts already
  link central policy. Change those owners only for a concrete discovered gap.
- Preserve existing independent SDD review. No additional per-slice human PR
  review approval is introduced by the publication/start condition.
- No overlap with the inherited WebAPI feature or roadmap beta-exit and fixture
  work. Durable product use cases, roadmap, product README, and CHANGELOG need
  no change for this operating-policy proposal. TRACEABILITY is not required:
  named requirements and the eventual TASKS validation mapping suffice.

## Compatibility

Product runtime, parser, list, flow, CSV, definition, diagnostics, hover,
navigation, WebAPI, semantic diff/report, and telemetry behavior are unchanged.
`engines.vscode` remains `^1.75.0`; desktop and web execution conditions and
dependencies are unchanged. The existing Verify workflow remains unchanged.

## Non-goals

- Runtime, tests, generated artifacts, dependencies, or CI workflow edits.
- Flattening PR bases to trunk, early lower-layer merges, integration-only PRs,
  custom stack automation/state, force pushes, or automatic human approval.
- Rewriting inherited feature plans or changing merge methods and branch rules.

## Open questions

None blocking planning. The exact slice/path boundary and static validation
cases in `TASKS.md` require independent review and Human Approval.
