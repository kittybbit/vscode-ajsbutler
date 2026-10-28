# Feature Tasks: Incremental Stack Publication

## Agent Brief

- Purpose: publish and verify each completed native stack layer before dependent
  work; acceptance is [R1-R6](SPECS.md#requirements-and-acceptance).
- Active slice: Slice 1; prior scope approval retained; base-only replan awaits
  renewed independent review and Main gate reconciliation.
- Decision context: [scope](SPECS.md#decisions-and-impact),
  [core contract](../../README.md#github-standard-stacked-pull-requests),
  [corrections](../../validation.md#correction-loop-for-deterministic-failures),
  and [freshness](../../evidence.md#freshness-and-invalidation).
- Validate: changed-document Markdown lint, local links/anchors, structure,
  static scenarios below, scope/approval inspection, and `rtk git diff --check`.
- Constraints / next decision: Main commits the approved remote-main planning
  package, then delegates Slice 1 implementation.
  No completion, closure, or merge approval is granted.

## Current state

- Lifecycle state: PLAN_APPROVED
- Feature kind: transient branch feature.
- Branch: `docs/sdd-incremental-stack-publication`.
- Base: `6eb4b1d0e6cdcc40f6416f893b5c384d5bbfd196`.
- Plan identity: `incremental-stack-publication-plan-v3-remote-main-base`;
  exact hashes and metadata validation are in
  `/tmp/ajsbutler-incremental-stack-remote-main-replan-evidence/record.md`.
- Next decision / blocker: remote-main planning commit, then Slice 1 implementation.
- Current review: plan v3 Ready, no Findings, at the exact remote-main base;
  `/tmp/ajsbutler-incremental-stack-remote-main-plan-review-evidence/record.md`.
- Base correction: user directed a dedicated branch from main and questioned
  origin synchronization. Main verified actual GitHub main five commits ahead
  of local main and recreated this branch from `main = origin/main = HEAD`.
  Import/reference proof: `/tmp/ajsbutler-remote-main-import-evidence.json`.
  Remote-main tree equals the original scope base tree; no scope, design,
  acceptance, validation or approval-boundary change is required.
- Prior gates: original plan v1 Ready and subsequent explicit Human Approval are
  retained in `/tmp/ajsbutler-incremental-stack-plan-review-evidence/record.md`
  and `/tmp/ajsbutler-incremental-stack-plan-commit-evidence/record.json`.
  Local-main plan v2 received Ready in
  `/tmp/ajsbutler-incremental-stack-main-base-plan-review-evidence/record.md`;
  its planning commit `81da81858b1500a0aeefcabb314fe9e956a81eca` is preserved on
  `docs/sdd-incremental-stack-publication-local-main`. No implementation occurred.
  Prior commits/reviews do not establish this corrected branch's planning gate.
- Reused discovery: `/tmp/ajsbutler-incremental-stack-intake-evidence/record.md`
  and `/tmp/ajsbutler-incremental-stack-planning-evidence/record.md` retain
  matching facts and judgments. Only current base/plan review identity and
  affected gate metadata validation renew; future review/approval is not claimed.

Apply the [Lifecycle State Contract](../../README.md#lifecycle-state-contract).

## Native Stack References

- Feature PRs / target: one implementation layer on
  `docs/sdd-incremental-stack-publication`, targeting `main`; PR not created.
  Planning commit precedes the completion commit on this bottom/top branch.
- Final feature identity: HEAD initially
  `6eb4b1d0e6cdcc40f6416f893b5c384d5bbfd196`; reviewed layer base is that commit.
  Implementation, publication, exact current head/checks, and closure commit
  references are Missing until produced, never inferred from local validation.
- Closure / merge evidence: none; retain gate records externally before feature
  removal. Feature Exit, Closure Approval and Human Merge Approval are separate.

Apply [native stacks](../../README.md#github-standard-stacked-pull-requests).
Keep references in this plan rather than a separate stack state.

## Human Approval

- Status: Approved
- Approved at: prior approval in current conversation after plan-v1 Ready.
- Provenance: retained approval of the unchanged slice scope below, together
  with the user's explicit direction to branch from current main. Main accepts
  those instructions after v3 Ready: the complete base tree, scope, acceptance,
  validation and approval boundary match the approved proposal. No new human
  approval after the renewed review is claimed; only the base/gate identity changes.
- Approved scope: reviewed plan `incremental-stack-publication-plan-v1`, complete
  Slice 1 boundary and planned closure preparation below. Closure execution
  still requires its separate review and approval gates.
- Approved paths: `docs/specs/README.md`, `docs/specs/validation.md`,
  `docs/specs/features/_templates/TASKS.template.md`, and this feature's
  `TASKS.md` for lifecycle/evidence metadata. The planning package comprises this
  file and `SPECS.md`. Completion, Closure and Merge Approval remain separate.

Apply [Human Approval](../../README.md#human-approval) and the
[approval-gated commit policy](../../README.md#approval-gated-commit-policy).

## Implementation Slices

### Slice 1: Publish and verify each completed stack layer

- Lifecycle state: PLANNED
- Scope and value: one cohesive operating-policy change prevents dependent
  branches and work from building on an unpublished or failing predecessor.
  README timing, committed-slice corrections, and template references form one
  complete contract; splitting them would leave the start gate incomplete.
- Acceptance: R1-R6 pass the static scenario matrix below; future operators can
  identify publication timing, the exact predecessor-ready condition, correction
  owner and gates, preserved stack topology, and closure refresh requirements.
- Dependencies: existing native GitHub stack capability, core human/commit gates,
  validation correction/review rules, and Evidence Contract freshness. No new
  tool, lifecycle state, service, dependency, or custom stack registry.
- Stack layer: 1 of 1; PR URL not created; head branch as above, reviewed base
  `6eb4b1d0e6cdcc40f6416f893b5c384d5bbfd196`. Record completion commit,
  publication/update URL, current PR head and CI/Cloud/rule evidence in existing
  stack/validation references. No predecessor is needed for this first slice.
- Production readiness: documentation policy only. Product behavior, parser,
  list, flow, CSV, diagnostics, hover/navigation, WebAPI, semantic diff/report,
  telemetry privacy, desktop/web execution and VS Code `^1.75.0` are unchanged.
  No product README, CHANGELOG, roadmap or durable use-case change is warranted.
- Approval boundary: only the three durable files below plus this feature's
  `TASKS.md` for lifecycle/evidence metadata. `SPECS.md` is planning input, not
  an incidental implementation expansion. No runtime, tests, generated output,
  dependencies, CI configuration, AGENTS, role contracts, `evidence.md`, other
  feature, or unrelated durable-document edits are authorized by this proposal.

#### Exact implementation paths and responsibilities

- `docs/specs/README.md`: update Lifecycle And Approval Gates, GitHub Standard
  Stacked Pull Requests, and the existing dependent-slice lifecycle table row
  as needed for one consistent prerequisite. Main immediately publishes/updates
  the slice PR after its approved completion commit, verifies exact-current-head
  required GitHub checks/CI and applicable Cloud gates, and only then creates
  the next dependent branch or starts its work. Preserve native bases and
  predecessor-only layer diffs: slice-1 to main, slice-2 to slice-1, slice-3 to
  slice-2. No early merge. Keep publication distinct from merge authority and
  refresh affected current-head gates after the closure commit changes top HEAD.
- `docs/specs/validation.md`: extend the existing Correction Loop to failures
  discovered after `SLICE_COMMITTED`/publication. Main routes to the owning
  implementer within existing approved boundaries; preserve failure evidence,
  apply affected validation and independent re-review, obtain explicit scoped
  Completion Approval, and make a focused additional commit to update the same
  PR. Reverify its exact new head before dependent work. New scope/design or
  unapproved paths stop for Main/Replanning. No silent authorization, amendment,
  force push, weakened checks, or unrelated layer gate reset. Reuse local and
  unchanged review evidence only under their existing owners' freshness rules.
- `docs/specs/features/_templates/TASKS.template.md`: extend existing per-slice
  stack/validation references for publication/update, exact head/check results,
  predecessor identity/readiness before dependent branch creation/work, and
  closure refresh references as applicable. Link central rules instead of
  duplicating them; introduce no lifecycle states or separate registry.
- `docs/specs/features/incremental-stack-publication/TASKS.md`: record actual
  implementation validation, Solution Shape, lifecycle and gate references.
  Status metadata grants no approval; retain the reviewed substantive identity.

#### Validation index

- Identity / result: planning documents validated in the planning evidence record;
  implementation checks are Missing until implementation. Pass requires lint,
  link/anchor/structure validation, all static scenarios, scope/provenance
  inspection and whitespace checks on the exact final patch.
- Coverage: lint every changed Markdown file explicitly, including the TASKS
  template; validate local links/anchors and structure; run `rtk git diff --check`
  plus explicit untracked-file whitespace checks where needed. Inspect exact
  paths, role routing, lifecycle/approval gates and durable ownership. Use the
  global `rtk proxy markdownlint-cli2` method already established at intake.
- Static scenarios: inspect the combined proposed policy and template using the
  cases below; retain verdict and references for each, not only a command exit.
- Evidence artifact: producer retains exact input hashes, command versions/exits,
  raw outputs, scenario judgments and changed-path manifest outside inspected
  inputs; add its reference here. Planning evidence record is above.
- Review / approval / commit: all Pending. Implementation review covers the exact
  three-file policy patch and separately validated feature metadata; Main alone
  performs the focused completion commit after Ready and explicit approval.
- Not Applicable: product tests/builds, architecture test, qlty baseline/final
  scans/aggregate and desktop/web smoke tests, because no product code, analysis
  inputs, dependencies or execution conditions change. Actual GitHub operations
  are not exercised by static scenarios; no current-head pass is claimed. Actual
  publication/Exit/Merge must obey all required GitHub gates and actual rules.

<!-- markdownlint-disable MD013 MD060 -->

| Case | Requirements | Required static outcome |
| --- | --- | --- |
| First and dependent slices succeed | R1, R2, R5 | Approved completion commit immediately published; exact predecessor head gates pass before dependent branch creation/work; native three-layer bases and predecessor-only diffs preserved. |
| Pending or missing predecessor checks | R2, R5 | Dependent creation/work blocked; missing result never becomes Pass or Not Applicable. |
| Failed or old-head checks | R2, R3 | Dependent creation/work blocked; old successful head cannot authorize the current head. |
| Expected skipped checks | R2, R4 | Only actual repository rules may accept expected skips; docs-only local validation never overrides required GitHub/Cloud gates. |
| Committed predecessor CI correction | R3, R5 | Main routes to owning implementer; unchanged approved boundary, affected validation/review, explicit approval and focused extra commit update same PR; new head gates required. |
| Correction needs new decision or path | R3 | Stop before edits; Main routes affected-scope Replanning, independent plan review and Human Approval; unrelated completed gates preserved. |
| Correction changes existing dependent content/base | R3, R5 | Existing evidence/review owners determine affected invalidation; unchanged facts reused, changed current-head gates refreshed; no amend/force push or new stack registry. |
| Closure modifies top head | R4, R6 | Affected current-head checks refreshed for closure head; closure patch review/approval/commit and separate Human Merge Approval retained. |
| Final merge pending, partial or complete | R1, R4, R6 | No lower-layer early merge; final actual rules/reviews/checks honored; only every PR observed Merged permits CLOSED. |

<!-- markdownlint-enable MD013 MD060 -->

Apply the [Evidence Contract](../../evidence.md#evidence-contract) and
[Correction Loop](../../validation.md#correction-loop-for-deterministic-failures).

#### Solution Shape

- Owner and surface: README owns timing, dependent-start prerequisite and
  lifecycle; validation owns correction/review coverage; the TASKS template
  indexes evidence references. `evidence.md` already owns identity/freshness.
- Existing capability: native GitHub PR stacking, actual repository rules, and
  existing SDD roles/gates suffice. No custom abstraction or platform mechanism.
- Contracts: publication and exact-head readiness precede dependent creation/work;
  committed-slice correction retains the same PR and all relevant human gates.
  No source-layer imports, public TypeScript contracts or dependency changes.
- Evidence and judgments: Markdown/link/whitespace checks provide mechanical
  evidence; independent review judges ownership, absence of duplicated policy,
  scenario completeness and preserved authorization. Architecture automation
  does not prove this operating-policy design.
- Stop conditions: any missing durable owner requiring another path, new lifecycle
  state/tooling, changed role/CI/merge contract, new validation strategy, material
  scope/risk or approval-boundary decision returns to Main before edits.

## Feature Exit and closure preparation

- After the slice's review, explicit Completion Approval, focused commit,
  immediate PR publication and exact current-head gates, Main routes Feature
  Exit. No additional implementation slice or integration-only PR is planned.
- Durable propagation is the three implementation policy files above; no extra
  durable edit is expected. Any necessary closure correction in those paths
  needs changed-surface validation, independent Ready review and exact Closure
  Approval; an additional durable path requires Main/Replanning first.
- The closure artifact must remain outside the removed feature folder and
  bind acceptance R1-R6, final snapshot including deletions, validation/review,
  approvals, commit/PR/check identities, risks and merge results. Carry existing
  evidence references forward rather than duplicating documents as history.
- Exact planned closure deletions, applied only by Main after Close, any required
  independent closure-patch Ready, explicit Closure Approval and staged checks:
  `docs/specs/features/incremental-stack-publication/SPECS.md` and
  `docs/specs/features/incremental-stack-publication/TASKS.md`.
  No TRACEABILITY or other file exists or is planned; no inherited folder is
  removed. Recheck links/structure and whitespace on the projected final snapshot.
- Closure stays on this existing top PR. Refresh affected exact-current-head
  GitHub gates after its focused closure commit; obtain separate Human Merge
  Approval of final PR/order/target/head/method/checks and closure commit, then
  observe actual merge results. Pending/partial merge is never CLOSED.
- Risks: old-head or incomplete CI accepted as current; dependent branch created
  too soon; skips treated as universal success; post-commit repair bypasses
  review/approval; closure-head gates stale. Static cases and independent review
  address these. No residual product compatibility risk or new roadmap follow-up
  is identified; inherited WebAPI beta and fixture work retain their owners.
