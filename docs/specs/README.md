# SDD Policy

SDD makes feature scope, approval, independent review and completion verifiable
while preserving JP1/AJS behavior, desktop/web compatibility and
[architecture](architecture.md). This file owns lifecycle and approval;
validation, evidence and role contracts have the owners linked below.

A feature must make its intended JP1/AJS behavior, acceptance, exact approved
paths and material risks clear enough for independent readiness review.
The active slice's Agent Brief identifies that outcome and the minimum scope,
contract and evidence references needed for the next decision. Relevant checks
must demonstrate acceptance on the reviewed patch; a completed edit or tool
invocation alone does not establish readiness.

## Policy Loading And Index

Formal SDD operations require substantiated authority, approval provenance,
exact paths, dependencies and the applicable role's entry conditions before
edits or staging. This index maps decisions to their authoritative contracts;
it does not require a fixed reading order or full-policy loading.

- **Core:** [Lifecycle and approval](#lifecycle-and-approval-gates),
  [handoff](#handoff-record), [feature ownership](#selected-feature-ownership),
  and [document roles](#document-roles).
- **Validation:** [risk and changed-surface checks](validation.md#risk-based-validation-and-review),
  [Correction Loop](validation.md#correction-loop-for-deterministic-failures),
  and [qlty quality contract and execution procedure](validation.md#qlty-evidence-format).
- **Evidence:** [identity](evidence.md#identity-and-required-facts),
  [freshness](evidence.md#freshness-and-invalidation), and
  [reuse observations](evidence.md#evidence-reuse-observations).
- **Design:** [Solution Shape and impact](#solution-shape-and-impact) and
  [architecture](architecture.md#solution-shape).
- **Exit:** [Definition of Done](#feature-definition-of-done),
  [Feature Exit](#feature-exit-review-output), and
  [Durable Documentation Gate](#durable-documentation-gate).

### Role Procedures

Role authority, required inputs, results and stop conditions are owned by
[`.codex/agents/`](../../.codex/agents). Role definitions use this index for
common contracts rather than repeating their rules or reading sequences.

Lifecycle roles cannot grant human approval, broaden delegated scope or resolve
unapproved design decisions. Main owns mechanical commit gates by default;
`approval-committer` executes only an explicitly delegated gate under the
[Approval-Gated Commit Policy](#approval-gated-commit-policy).

### Product Context References

References for product purpose, terminology, boundaries and acceptance:
[Vision](vision.md), [Glossary](glossary.md), [Context Map](context-map.md),
[Architecture](architecture.md), [Roadmap](roadmap.md), and
[Requirements Use Cases](../requirements/use-cases/README.md).

## Trivial Change Criteria

Skip feature creation only when a change affects none of these:

- runtime behavior, tests, validation expectations, generated artifacts, or
  configuration
- desktop, web, VS Code, JP1/AJS, or definition-file compatibility
- durable documentation responsibility or document roles

Typo fixes, formatting-only cleanup, behavior-neutral comment edits, and
meaning-preserving link fixes may be trivial. If impact is uncertain, treat
the change as non-trivial and route intake through `feature-author`.

## Lifecycle And Approval Gates

For non-trivial work, use a dedicated feature branch (`docs/...` for docs-only
work), create or select one feature, plan all implementation slices, and have
the plan independently reviewed. Plan-review Findings return to `planner`.
Replanning is required for a new scope, contract, design, dependency,
compatibility, validation requirement/coverage/strategy, material impact, or
approval-boundary decision. A deterministic check failure is not itself a
Replanning trigger; detailed correction rules belong to
[validation policy](validation.md#correction-loop-for-deterministic-failures).

Human Approval covers the reviewed plan and exact slice scope. After a plan or
replan review returns `Ready` and Human Approval is explicit, Main
creates one focused planning commit under the commit policy. Only then may
`implementer` work on one approved slice. Each completed slice receives an independent
`implementation-reviewer` review. Findings return through Main under the
[Correction Loop](validation.md#correction-loop-for-deterministic-failures);
a new decision as defined above returns through Main for replanning. After
`Ready`, explicit Completion Approval and that slice's focused commit are
required. Main immediately publishes or updates its PR; a dependent slice may
start only after its predecessor's exact-current-head gates pass under the
native stack contract. Once all slices are complete and committed,
`feature-closer` performs Feature Exit. Its `Close` result,
explicit Closure Approval, and focused closure commit are separate gates.
Merge and final closure follow the
[native stack contract](#github-standard-stacked-pull-requests).

Every human approval authorizes only its stated gate and scope. Replanning is
the route for changing approved scope; do not make a silent change between
commits. Main coordinates each handoff. Role ownership and routing are defined
by repository routing. Role contracts live in `.codex/agents/*.toml`; SDD has
no lifecycle Skills or Skill adapters.

### GitHub Standard Stacked Pull Requests

Purpose: retain independently reviewable slices and integrate the complete
feature through GitHub's native stacked pull requests. GitHub's native behavior
and active repository rules govern publication and merge operations.

Each slice PR has an exact layer diff, acceptance, approved scope, independent
review and evidence. The feature's final head contains every slice and its
closure patch. The planning package precedes implementation; dependent slices
start from committed predecessors. After each approved completion commit, Main
immediately publishes or updates that slice's PR. The first PR targets `main`;
each later PR targets its predecessor branch and retains only its layer diff.
Before creating a dependent branch or starting its work, Main verifies that the
predecessor PR is at its exact current head and its required GitHub CI/checks
and applicable Cloud gates pass under actual repository rules. Pending, failed,
missing, or old-head results block dependent work; expected skips count only
when actual repository rules accept them. A commit or local validation alone
does not satisfy this prerequisite. Do not merge lower layers early. Main owns
publication and merge authority, separately from commit gates. No custom stack
tooling/state, integration branch or integration-only PR is permitted.

Feature integration requires all slice gates, Feature Exit, the closure commit
and explicit Human Merge Approval of the final feature identities. Because a
closure commit changes the top head, Main refreshes affected required GitHub
checks and applicable Cloud gates for that exact head before merge. Main must
respect GitHub's actual reviews, required checks and protection rules without
bypass. Publication, PR approval and Closure Approval do not authorize merge.
Review and evidence validity follow [validation](validation.md#independent-review)
and [evidence](evidence.md#freshness-and-invalidation).

Completion is the observed merge of every feature PR, with resulting commit
identities and required check evidence retained. Pending or partial integration
is not `CLOSED`; retain actual results and the missing gates. Changed merge
scope or identities require renewed Human Merge Approval.

### Lifecycle State Contract

`TASKS.md` records the current feature state and each slice's state until its
approved removal. The retained closure artifact then records the final merge
result and `CLOSED` gate fact, without a second active stack-state registry.
For new features, `Lifecycle state` is the sole authoritative state field; review
verdicts, approvals, and commits are supporting gate evidence, not parallel
plan or slice status vocabularies. The names below describe gate results, not
permission inferred from a document field. Main advances a state only from the
corresponding role result, actual human approval, successful commit, or verified
GitHub merge results.
Blocked work retains its last substantiated state and records the missing
decision.

<!-- markdownlint-disable MD013 MD060 -->

| Input state                                     | Operation and owner                           | Output state / required fact                                                                                          |
| ----------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Concrete proposal                               | Intake: `feature-author`                      | `INTAKE`: scoped intake recorded                                                                                      |
| `INTAKE`                                        | Planning: `planner`                           | `PLANNED`: complete feature plan                                                                                      |
| `PLANNED`                                       | Independent review: `plan-reviewer`           | `PLAN_READY`: Ready for approval; Findings return to planner                                                          |
| `PLAN_READY`                                    | Human Approval: human, recorded by Main       | `PLAN_APPROVED`: exact reviewed scope approved                                                                        |
| `PLAN_APPROVED`                                 | Plan commit: Main                             | `PLAN_COMMITTED`: planning commit on bottom stack branch succeeded                                                    |
| `PLAN_COMMITTED` or preceding `SLICE_COMMITTED` | One approved slice: `implementer`             | `IMPLEMENTING`, then `IMPLEMENTED`: diff and validation recorded                                                      |
| `IMPLEMENTED`                                   | Independent review: `implementation-reviewer` | `SLICE_READY`: Ready; Findings return to implementer                                                                  |
| `SLICE_READY`                                   | Completion Approval: human, recorded by Main  | `SLICE_APPROVED`: exact reviewed completion approved                                                                  |
| `SLICE_APPROVED`                                | Completion commit and PR publication: Main    | `SLICE_COMMITTED`: approved layer committed and PR published/updated; exact-head gates recorded before dependent work |
| All slices `SLICE_COMMITTED`                    | Exit entry check: Main                        | `FEATURE_EXIT_READY`: no pending scope/design decision                                                                |
| `FEATURE_EXIT_READY`                            | Aggregate exit review: `feature-closer`       | `CLOSE_READY`: Close recommendation                                                                                   |
| `CLOSE_READY` with a changed top-layer patch    | Independent review: `implementation-reviewer` | `CLOSE_READY`: final closure patch Ready; Findings return to closer                                                   |
| `CLOSE_READY`                                   | Closure Approval: human, recorded by Main     | `CLOSE_APPROVED`: exact reviewed propagation/removal paths approved                                                   |
| `CLOSE_APPROVED`                                | Closure commit: Main                          | `CLOSE_APPROVED`: final top-head closure commit recorded                                                              |
| `CLOSE_APPROVED` with closure commit            | Human Merge Approval, then Stack Merge: Main  | `CLOSED`: all layer PRs verified Merged; resulting identities recorded                                                |

<!-- markdownlint-enable MD013 MD060 -->

`SLICE_COMMITTED` fixes layer content, not integration into `main`. Commit and
merge facts in the table determine state; there is no separate stack lifecycle.

A new scope/design/approval-boundary decision routes through Main to planner
in Replanning Mode. The affected plan returns to `PLANNED` for review and new
approval; preserve completed and unaffected slices. A Finding within an
approved implementation boundary returns that slice to `IMPLEMENTED` pending
revision and review, without resetting unrelated gates.

Existing features may retain their current status vocabulary. Main maps it to
these states only using recorded review, human provenance, and commit facts;
migration does not grant approval or require rewriting inherited plans.
Legacy mentions of the retired evidence Skill mean the
[Evidence Contract](evidence.md#evidence-contract), not an instruction to
discover or invoke a Skill.

### Handoff Record

Every role returns this compact envelope, adding only role-specific judgments,
blocking decisions, and material risks needed for the next decision:

```yaml
feature: selected feature folder
slice: selected slice (omit outside slice work)
state_transition: input -> substantiated output
result: verdict or completed operation
evidence_refs: discovery, validation, review, or closure records and identities
changed_paths: exact changed paths (omit when read-only)
```

The references identify the exact feature/slice, reviewed plan or layer
base/head patch, and PR when available. Include actionable Findings, required
human decisions and material risks, not expanded TASKS/manifests/logs. Add
`blocking_decisions` when progress needs a missing decision, and
`recommended_next_role` with a reason only for exceptional routing. Inapplicable
fields may be omitted; hosts with fixed schemas may retain empty values.

Main uses this record for routing and gate decisions without recollecting
unchanged facts. Review adds its verdict and patch identity; commit adds its
identity and staged-check result. Evidence contents/access and refresh reasons
belong to the [Evidence Contract](evidence.md#evidence-contract).

### Human Approval

Record approval in the selected feature's `TASKS.md` with:

```md
- Status: Pending | Approved
- Approved at:
- Approved scope:
```

`Approved at` records only the result, such as `none` or `approved in current
conversation`; do not copy the approval message. Implementation requires
`Status: Approved`, an approval result, and the human-approved slice boundary.
An SDD field alone does not prove human approval.

Enumerate concrete product paths and foreseeable validation-support paths
(tests, fixtures, snapshot assets, harness/configuration, and approved generated
outputs) before approval. Do not use unrestricted wildcards, automatically add
paths during implementation, or include unrelated feature repairs. A required
unapproved path returns to Main before editing for an approval-boundary decision.

Add Completion Approval only after implementation review and Closure Approval
only after Feature Exit. Human Merge Approval is separate: its scope identifies
the final feature PRs, order, target branch, head, merge method, closure commit
and current GitHub gates. Keep it in the feature PRs or a retained closure
artifact after feature-folder removal. Closure Approval alone never grants
merge authority. Each record contains status, exact scope and paths,
review verdict, approval result, and commit status. Keep the active gate near
the top of `TASKS.md` and compact references for completed gates through Feature
Exit. Ordinary corrections keep the existing plan and approval records; do not
add a gate record for each attempt.

### Implementation Change Gate

Runtime, test, generated-artifact and configuration edits require explicit
Human Approval of the exact implementation boundary, recorded in `TASKS.md`.
The approval request must make the change, affected paths/behavior/features,
relevant symbols/tests/docs, compatibility risks, required validation and
material alternatives reviewable. Until approval, only investigation, SDD
records and approval preparation are authorized; do not claim implementation
has begun or finished. Questions, discussion, ambiguous agreement and agent
judgment are not approval.

Unapproved paths or a new boundary decision stop edits and return through Main
for Replanning and approval. Existing-boundary repairs follow the
[Correction Loop](validation.md#correction-loop-for-deterministic-failures).

### Approval-Gated Commit Policy

Purpose: one authorized commit of the exact reviewed work, without a
mechanical agent dispatch on the normal path. Main is the sole executor unless
it explicitly delegates that gate to `approval-committer`. Delegated results
are consumed once, not reexecuted by Main. This authority applies to plans
explicitly Human Approved under this policy; inherited approved authorities
remain unchanged until the human approves a change. No other lifecycle role
stages or commits; semantic review and Feature Exit remain independent.

A commit is eligible only when gate-specific human provenance, the matching
independent verdict, reviewed base/patch identity, approved paths, fresh required
validation and staged diff agree. The existing index must contain no unrelated
work; only exact approved paths may be staged. Broad staging, another slice,
unexpected paths, substantive post-review changes or failed staged diff checks
stop the commit. Reviewed content plus separately validated gate metadata must
match the staged identity. Missing, ambiguous, failed or stale facts return
through Main to the owning producer/reviewer; a status field or instruction to
continue cannot supply gate approval.

One focused commit records the executor, commit identity, staged-check result
and approval/review/evidence references. Closure removal is limited to its
approved selected-feature paths. No amend, reset, discard, force-push or evidence
editing may manufacture authorization. Evidence acceptance has one owner in
[evidence policy](evidence.md); publication/merge follow the native stack contract.

<!-- markdownlint-disable MD013 MD060 -->

| Gate           | Required result                                                                              | Commit contents                                                                 |
| -------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Plan or replan | Plan review `Ready` and Human Approval `Approved`                                            | Approved planning package and approval evidence                                 |
| Completion     | Implementation review `Ready` and Completion Approval `Approved`                             | Exact completed slice and its evidence                                          |
| Closure        | Feature Exit `Close`, required closure-patch review `Ready`, and Closure Approval `Approved` | Approved durable updates, closure evidence, and selected feature-folder removal |

<!-- markdownlint-enable MD013 MD060 -->

Do not leave failed checks unexplained or defer them without an explicit
follow-up decision.

## Evidence Reuse Principle

The [Evidence Contract](evidence.md#evidence-contract) owns evidence identity,
freshness, reuse, artifact contents and access for every role and gate.

## Solution Shape And Impact

Record `Solution Shape` at planning, implementation, and review using the
definition in [`architecture.md`](architecture.md#solution-shape). The
architecture dependency test is automatic evidence only for its cataloged
rules; semantic ownership, abstraction value, framework sufficiency,
custom-gap justification, and qlty finding disposition remain reviewer
judgments.

Record direct and transitive impact, added/changed/removed behavior scenarios
when applicable, and affected tests. Semantic navigation tools may help locate
references; they do not replace manual impact analysis, SDD artifacts,
approvals, tests, or validation. Stop and replan when the approved semantic
owner, package or layer, contract, dependency direction, framework/custom
choice, abstraction, affected surface, material risk/impact, validation
requirements/coverage/strategy, or approval boundary needs a new decision.
Apply the
[Correction Loop](validation.md#correction-loop-for-deterministic-failures) for
contract-preserving repairs under existing approval.

Role model/effort settings in `.codex/agents/*.toml` must be supported by the
current host. Unavailable settings block delegation; prompts cannot silently
substitute settings or override approved scope, gates or independent review.
New out-of-scope/specification/design decisions, including agent suggestions,
return through Main for investigation and re-approval.

## User-Facing Change Records

Update `CHANGELOG.md` when a change affects externally observable behavior,
compatibility, commands, configuration, diagnostics, user workflow, or
documented extension behavior. Documentation maintenance, internal cleanup,
and tests without observable behavior changes do not require a changelog entry.
If uncertain, record the evaluation in the feature plan and obtain a human
decision before closing the slice or feature.

Use `docs/requirements/use-cases/` for durable, observable behavior contracts
that remain valid across module and file-layout changes. Do not put branch task
sequences, implementation notes, or file-level checklists there; those belong
in the selected feature's `TASKS.md`.

Use Gherkin only when scenarios clarify observable behavior. Put general
invariants in `Rules`, one observable behavior per `Behavioral Scenario`, and
non-duplicative validation or migration notes in `Acceptance Notes`; put
unresolved hazards in `Risks Or Edge Cases`. Do not force architecture or
refactor plans into Gherkin or add executable-spec tooling without an approved
slice.

## Selected Feature Ownership

A feature folder under `docs/specs/features/<feature>/` is temporary; its
presence does not select it. The selected feature is the one chosen for the
current branch work, the branch-owned feature is the one this branch adds,
changes, implements, or closes, and the active feature is the selection for
the current agent run. Keep the selection fixed across planning, review,
implementation, and Feature Exit; changing it requires Replanning, a separate
feature branch, or deferral. Compatibility edits to an inherited feature do
not transfer branch ownership.

Resolve selection from the user's choice, the single feature created by this
branch, the single feature changed by this branch, or an unambiguous branch
purpose/name match, in that order. Compare branch changes with the supplied
base or, when absent, the default branch merge-base. If the base or selection
is ambiguous, stop and ask the user to select the feature. Do not guess from
folder presence, pending tasks, or approval state.

## Document Roles

<!-- markdownlint-disable MD013 MD060 -->

| Document                                                        | Responsibility                                                                                                                                                                                              |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SPECS.md`                                                      | Purpose and origin; feature requirements, decisions, boundaries, compatibility, acceptance, and non-goals. No task sequencing or history.                                                                   |
| `TASKS.md`                                                      | Sole feature plan and current state: approved/active slice, dependencies, approvals, impact, validation, risks, production readiness, and exit readiness. The selected feature owns the active branch plan. |
| `TRACEABILITY.md`                                               | When required, compact requirement/use-case to slice and test/validation mapping. No design notes, status, or work log.                                                                                     |
| `roadmap.md`                                                    | Unfinished repository-level future work, ordering, entry conditions, and unresolved product concerns.                                                                                                       |
| `vision.md`, `glossary.md`, `context-map.md`, `architecture.md` | Current product purpose, shared terms, external boundaries, and layering/dependency direction.                                                                                                              |
| `docs/requirements/use-cases/`                                  | Durable observable behavior contracts.                                                                                                                                                                      |
| `README.md`                                                     | Repository/product overview, setup, usage, basic commands, and links to details.                                                                                                                            |
| `CHANGELOG.md`                                                  | Externally observable changes organized by release.                                                                                                                                                         |
| `AGENTS.md`                                                     | Concise agent-facing repository constraints, architecture rules, and routing.                                                                                                                               |
| Durable docs generally                                          | Current reusable knowledge only; never branch state, temporary investigation, review commentary, resolved findings, or implementation history.                                                              |

<!-- markdownlint-enable MD013 MD060 -->

Do not create a feature `CONTEXT.md`. Keep the `TASKS.md` Agent Brief to the
purpose, active or approved slice, prohibitions, and minimum reading/validation
needed for the next role. Keep all feature documents decision-focused; remove
history once it no longer affects approval, risk, traceability, readiness, or
Feature Exit.

Update `TASKS.md` when plan, approval, slice state, validation, risk, or exit
readiness changes. Update `TRACEABILITY.md` when its mapping or required
validation result changes. Update `roadmap.md` only when its repository-level
future work changes. Do not keep a separate branch plan or active-feature
index. Remove completed checklists when they no longer inform a future
decision. Keep status, approvals, active slice, and next decision near the top.

## Feature Definition Of Done

A feature is complete when all implementation slices and approval gates have
focused commits and its native stack has verified merge results for every
layer; requirements and acceptance are met; required validation and
traceability are complete; quality and production readiness are preserved or
justified; README/CHANGELOG impact is evaluated and required updates are
complete; reusable knowledge is propagated to durable documents; roadmap
changes are recorded; valuable unfinished work has an owner in `roadmap.md` or
a new feature folder; and remaining risks are resolved, accepted, or assigned.

For code slices, assess relevant risks under
[Risk-Based Validation And Review](validation.md#risk-based-validation-and-review).
User docs change only when user-facing behavior changes.

### Feature Exit Review Output

Feature Exit owns cross-slice completeness, integration, durable knowledge and
unresolved risk ownership. Its validation coverage follows
[validation policy](validation.md#independent-review), and existing evidence
is evaluated under the Evidence Contract.

`feature-closer` reports completed slices, acceptance, validation,
traceability, production readiness, durable updates, risks, and a `Close`,
`Do not close`, or `Human decision needed` recommendation. Recommend `Close`
only when the pre-merge Definition of Done obligations are met and the stack
is ready for closure preparation and final merge gates. `Close` is not `CLOSED`
and cannot assert merge success. Use `Human decision needed` when the
evidence is complete but explicit approval is still required.

Closure readiness requires planned, reviewed and approved durable propagation
and selected-feature removal within the feature's existing PRs, without an
integration-only PR. The feature-closer owns integration and durable-edit
judgments. A changed top-layer patch requires independent
implementation-reviewer Ready before Closure Approval; unchanged content
retains its valid independent review.
The external closure artifact binds propagation/removal paths to the exact
projected final snapshot, including planned deletions, so review, validation
and the resulting commit cover the same content. The sole commit executor applies
the approved removal. Durable knowledge and gate proof must remain accessible
after removal.
The final closure head follows the native stack review/merge gates and Evidence
Contract. Do not retain the removed folder's
`SPECS.md`, `TASKS.md`, or `TRACEABILITY.md` as history. Assign unfinished
valuable work and unresolved risks to an explicit owner or resolve/accept the
risks. Preserve inherited feature folders and their pending work; stop and
replan only if closing the selected feature would damage or invalidate another
feature.

### Durable Documentation Gate

Before updating a long-lived document, confirm the content is reusable beyond
one feature, describes durable behavior/specification/design/policy, helps
future work, and is not duplicated, temporary investigation, implementation
history, review commentary, or a resolved issue. Update the smallest necessary
document surface.
