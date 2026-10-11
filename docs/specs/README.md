# SDD Policy

This is the core contract and loading index for Specification-Driven
Development in this repository. Detailed validation and evidence rules have
one owner each in the linked policies. SDD preserves behavior while clarifying use
cases and architecture and maintaining desktop and web compatibility.
Repository routing is in [`AGENTS.md`](../../AGENTS.md); durable architecture
is in [`architecture.md`](architecture.md).

## Policy Loading And Index

Entry reading is repository guardrails in [AGENTS.md](../../AGENTS.md), this
index, and the applicable role definition. Before a formal SDD operation,
load the core lifecycle and approval sections required by that role. Confirm
authority, approval provenance, exact paths, dependencies, and stop conditions
before editing, reviewing, or staging; never defer safety prerequisites.

Read only relevant sections unless a decision or inconsistency needs broader
context. Detailed policy loading is conditional on the operation, not a
requirement to read every policy file in full. The role definitions own their
initial and conditional reading instructions.

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

Role definitions and loading instructions are owned by
[`.codex/agents/`](../../.codex/agents). Main routing is owned by
[AGENTS.md](../../AGENTS.md).

### Product Context References

Load only references relevant to the operation:
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
replan review returns `Ready` and Human Approval is explicit, `approval-committer`
creates one focused planning commit. Only then may `implementer` work on one
approved slice. Each completed slice receives an independent
`implementation-reviewer` review. Findings return through Main under the
[Correction Loop](validation.md#correction-loop-for-deterministic-failures);
a new decision as defined above returns through Main for replanning. After
`Ready`, explicit Completion Approval and that slice's focused commit are
required before another dependent slice starts. Once all slices are complete
and committed, `feature-closer` performs Feature Exit. Its `Close` result,
explicit Closure Approval, and focused closure commit are separate gates.

Every human approval authorizes only its stated gate and scope. Replanning is
the route for changing approved scope; do not make a silent change between
commits. Main coordinates each handoff. Role ownership and routing are defined
in [AGENTS.md](../../AGENTS.md). Complete role procedures live in
`.codex/agents/*.toml`; SDD has no lifecycle Skills or Skill adapters.

### Lifecycle State Contract

`TASKS.md` records the current feature state and each slice's state. For new
features, `Lifecycle state` is the sole authoritative state field; review
verdicts, approvals, and commits are supporting gate evidence, not parallel
plan or slice status vocabularies. The names below describe gate results, not
permission inferred from a document field. Main advances a state only from the
corresponding role result, actual human approval, or successful commit.
Blocked work retains its last substantiated state and records the missing
decision.

<!-- markdownlint-disable MD013 MD060 -->

| Input state                                     | Operation and owner                           | Output state / required fact                                     |
| ----------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------- |
| Concrete proposal                               | Intake: `feature-author`                      | `INTAKE`: scoped intake recorded                                 |
| `INTAKE`                                        | Planning: `planner`                           | `PLANNED`: complete feature plan                                 |
| `PLANNED`                                       | Independent review: `plan-reviewer`           | `PLAN_READY`: Ready for approval; Findings return to planner     |
| `PLAN_READY`                                    | Human Approval: human, recorded by Main       | `PLAN_APPROVED`: exact reviewed scope approved                   |
| `PLAN_APPROVED`                                 | Plan commit: `approval-committer`             | `PLAN_COMMITTED`: focused planning commit succeeded              |
| `PLAN_COMMITTED` or preceding `SLICE_COMMITTED` | One approved slice: `implementer`             | `IMPLEMENTING`, then `IMPLEMENTED`: diff and validation recorded |
| `IMPLEMENTED`                                   | Independent review: `implementation-reviewer` | `SLICE_READY`: Ready; Findings return to implementer             |
| `SLICE_READY`                                   | Completion Approval: human, recorded by Main  | `SLICE_APPROVED`: exact reviewed completion approved             |
| `SLICE_APPROVED`                                | Completion commit: `approval-committer`       | `SLICE_COMMITTED`: focused slice commit succeeded                |
| All slices `SLICE_COMMITTED`                    | Exit entry check: Main                        | `FEATURE_EXIT_READY`: no pending scope/design decision           |
| `FEATURE_EXIT_READY`                            | Aggregate exit review: `feature-closer`       | `CLOSE_READY`: Close recommendation                              |
| `CLOSE_READY`                                   | Closure Approval: human, recorded by Main     | `CLOSE_APPROVED`: exact propagation and removal paths approved   |
| `CLOSE_APPROVED`                                | Closure commit: `approval-committer`          | `CLOSED`: focused closure commit succeeded                       |

<!-- markdownlint-enable MD013 MD060 -->

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
slice: selected slice or not-applicable
state_transition: input -> substantiated output
result: verdict or completed operation
evidence_refs: discovery, validation, review, or closure records and identities
changed_paths: exact paths changed, or none for a read-only role
```

Add `blocking_decisions` whenever a missing decision blocks progress; omission
means no blocking decision. Add `recommended_next_role` with a reason only when
an exception needs routing outside the normal Lifecycle State Contract.
Findings and required human decisions must still be reported in the result.
Main selects the next operation and checks its prerequisites. Existing records
with explicit `none` remain valid; hosts requiring a fixed schema may retain
these fields with empty values for normal results.

Main forwards the record and references rather than reconstructing investigation
or recollecting facts. A reviewer adds its judgment and reviewed patch identity;
it does not create a second validation package. Main owns state/gate checks,
human approval provenance, routing, and final integration validation only when
integration inputs or required coverage differ from recorded evidence.

Reference recorded results, exact patches, Solution Shape, traceability, and
evidence instead of expanding them again. Raw command output, snapshot
manifests, and SARIF belong in the retained evidence artifact. References must
be accessible to the recipient; include necessary facts or report unavailable
evidence when a reference cannot supply them. A review adds its verdict,
reviewed patch identity, and actionable Findings; a commit adds its successful
commit identity and staged-check result. Do not impose identical result lists
on every role.

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
only after Feature Exit. Each record contains status, exact scope and paths,
review verdict, approval result, and commit status. Keep the active gate near
the top of `TASKS.md` and compact references for completed gates through Feature
Exit. Ordinary corrections keep the existing plan and approval records; do not
add a gate record for each attempt.

### Implementation Change Gate

Before editing runtime code, tests, generated artifacts, or configuration,
record impact findings in the selected feature's SDD documents and obtain clear
Human Approval for the exact implementation boundary. Until approval, work is
limited to investigation, SDD records, scope and alternatives, and the approval
request. Questions, added information, design discussion, ambiguous agreement,
or the agent's own judgment are not approval. If work requires paths outside
the approved boundary, stop and return to Main for Replanning and new approval.

Before approval, report only a concise impact summary and ask the human to
approve that exact boundary. Include the planned change; affected files,
behavior, and relevant functions, classes, or components; affected features,
tests, and docs; compatibility or breaking-change risk; required validation;
material alternatives. Do not claim implementation has started or finished
before approval. Proceed only after the approved boundary is recorded in
`TASKS.md`.

For repairs within an existing approval boundary, apply the
[Correction Loop](validation.md#correction-loop-for-deterministic-failures).

### Approval-Gated Commit Policy

Only `approval-committer` may make plan, completion, and closure workflow
commits. Before staging, it requires the matching review verdict, explicit
approval, exact paths, reviewed patch identity, and a clean scope boundary.
It must stop if any are missing or unrelated work is present; broad staging
cannot hide it. Make one focused commit per gate. Do not amend, reset,
force-push, publish, or alter
approval evidence to manufacture authorization.

<!-- markdownlint-disable MD013 MD060 -->

| Gate           | Required result                                                  | Commit contents                                                                 |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Plan or replan | Plan review `Ready` and Human Approval `Approved`                | Approved planning package and approval evidence                                 |
| Completion     | Implementation review `Ready` and Completion Approval `Approved` | Exact completed slice and its evidence                                          |
| Closure        | Feature Exit `Close` and Closure Approval `Approved`             | Approved durable updates, closure evidence, and selected feature-folder removal |

<!-- markdownlint-enable MD013 MD060 -->

Do not leave failed checks unexplained or defer them without an explicit
follow-up decision.

## Evidence Reuse Principle

Reuse evidence when identity and coverage match. Role changes, review,
approval, and commit gates do not invalidate evidence by themselves. Apply
[evidence identity and freshness](evidence.md#identity-and-required-facts)
before producing, refreshing, or accepting validation evidence.

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

Role model and reasoning effort are controlled by the fixed `model` and
`model_reasoning_effort` settings in `.codex/agents/*.toml`. These settings
[override inherited or explicit spawn values in Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents).
Main must not promise dynamic effort changes through a delegation prompt.
Change a role setting explicitly when a different configuration is required;
preserve model quality and independent review. Other hosts must verify their
supported configuration rather than assume a prompt applies these settings.
If implementation reveals an
out-of-scope, specification, or design decision, stop and return for
investigation and re-approval. Model or agent choice does not change SDD gates
or approved scope. Check Copilot or other agent suggestions against the
approved `SPECS.md`, `TASKS.md`, and paths; reject out-of-scope changes and
return them for investigation and approval.

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
focused commits; requirements and acceptance are met; required validation and
traceability are complete; quality and production readiness are preserved or
justified; README/CHANGELOG impact is evaluated and required updates are
complete; reusable knowledge is propagated to durable documents; roadmap
changes are recorded; valuable unfinished work has an owner in `roadmap.md` or
a new feature folder; and remaining risks are resolved, accepted, or assigned.

For code slices, assess relevant risks under
[Risk-Based Validation And Review](validation.md#risk-based-validation-and-review).
User docs change only when user-facing behavior changes.

### Feature Exit Review Output

Feature Exit reviews cross-slice completeness, integration, durable knowledge
ownership, and unresolved risk ownership. Consume the committed slices'
validation and independent reviews; do not re-review each diff or recreate
each qlty baseline/final set. Check current-head global required gates and
missing/stale cross-slice coverage only. A specific integration concern may
require a targeted check with its reason recorded. Validate new durable-doc
changes separately; they do not invalidate unrelated product checks.

`feature-closer` reports completed slices, acceptance, validation,
traceability, production readiness, durable updates, risks, and a `Close`,
`Do not close`, or `Human decision needed` recommendation. Recommend `Close`
only when the Definition of Done is met. Use `Human decision needed` when the
evidence is complete but explicit approval is still required.

Remove the complete selected feature folder only after Feature Exit, required
durable propagation, explicit Closure Approval, and its focused closure
commit. Record Feature Close only after the commit succeeds. Do not retain its
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
