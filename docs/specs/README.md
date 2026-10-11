# SDD Policy

This is the Single Source of Truth for Specification-Driven Development in
this repository. It defines when to use SDD, approval and validation gates,
and document responsibilities. SDD preserves behavior while clarifying use
cases and architecture and maintaining desktop and web compatibility.
Repository routing is in [`AGENTS.md`](../../AGENTS.md); durable architecture
is in [`architecture.md`](architecture.md).

## Reading Order

1. [Vision](vision.md)
2. [Glossary](glossary.md)
3. [Context Map](context-map.md)
4. [Architecture](architecture.md)
5. [Roadmap](roadmap.md)
6. [Requirements Use Cases](../requirements/use-cases/README.md)

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
approval-boundary decision. A check failure alone is not such a decision.

Human Approval covers the reviewed plan and exact slice scope. After a plan or
replan review returns `Ready` and Human Approval is explicit, `approval-committer`
creates one focused planning commit. Only then may `implementer` work on one
approved slice. Each completed slice receives an independent
`implementation-reviewer` review. Findings return through Main under the
[Correction Loop](#correction-loop-for-deterministic-failures); a new decision
as defined above returns through Main for replanning. After
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
Legacy mentions of the retired evidence Skill mean the Evidence Contract
below, not an instruction to discover or invoke a Skill.

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
blocking_decisions: missing decisions or none
recommended_next_role: optional exception route to Main
```

Omit `recommended_next_role` for the normal next gate in the Lifecycle State
Contract. Include it with a reason for Findings, blocked work, a required human
decision, or another departure from that transition. Main still selects the
next operation and checks its prerequisites.

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
## Human Approval

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
[Correction Loop](#correction-loop-for-deterministic-failures).

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

## Risk-Based Validation And Review

Choose checks for the changed surface, beginning with the nearest useful
check. Reuse matching evidence under the Evidence Contract. Do not rerun
unchanged checks only because the workflow or reviewer has changed. Intake and
planning need discovery facts and validation of their documentation changes;
they do not require implementation baseline/final scans for proposed code.

Assess only risks relevant to the changed surface: failure modes, errors and
fallbacks; JP1/AJS semantics and compatibility; large, malformed and edge input;
desktop/web behavior, VS Code compatibility and Node assumptions; architecture
and telemetry privacy; qlty/complexity, performance, dependencies and
readability; user-document and README/CHANGELOG impact. Apply the Solution
Shape contract for material design decisions. These categories do not require
unrelated investigation and do not waive any required boundary, compatibility,
privacy, architecture, or host checks below.

### Correction Loop For Deterministic Failures

Deterministic check failure is not itself a Replanning trigger. For a slice
of an approved, committed plan, `implementer` diagnoses the failure against
the existing approved contract: `SPECS.md`, `TASKS.md`, use cases, acceptance,
architecture rules, and validation requirements. Preserve the failed command,
diagnostics, and affected paths; determine whether production, tests, fixtures,
harness, or generated outputs violate that contract before editing.

Correction is authorized only within explicitly approved product and
validation-support paths, with unchanged acceptance, external behavior,
public contracts, JP1/AJS and VS Code compatibility, Solution Shape,
dependency direction, and required validation coverage. Size, a test-only
change, or an automated suggestion does not establish authorization.

- Lint, formatting, whitespace, import order, and type/build errors may be
  corrected when the existing contract uniquely determines the fix.
- Architecture violations may be corrected when existing rules determine the
  owner, layer, and dependency direction without a new abstraction decision.
- Fix production when it violates the approved observable behavior. Fix
  tests, fixtures, assertions, aliases, mocks, or harness when their expected
  behavior or configuration violates that contract, retaining meaningful
  valid, error, edge, privacy, and compatibility coverage.
- Compare snapshot/golden differences with the approved expected behavior;
  never automatically accept outputs. Regenerate inconsistent artifacts only
  using the established procedure with unchanged source, settings, contracts,
  and approved paths.
- Classify pre-existing, environment-dependent, and flaky failures with
  baseline evidence; do not silently count an unavailable or failed required
  check as passed.

Do not delete or skip tests, remove or weaken assertions, relax coverage, or
make expected outputs follow incorrect production merely to obtain green
checks. If the expected behavior is ambiguous, the correct fix needs an
unapproved path, or scope, contract, ownership, design, dependency,
compatibility, validation requirements/coverage/strategy, or approval needs a
new decision, stop before editing and return a decision request to Main.
Main routes a material decision delta for affected-scope Replanning,
independent plan review, and new Human Approval.

During correction, rerun the nearest affected check and relevant boundary
tests; refresh only affected evidence and reuse matching baseline/check
results under the Evidence Contract. After stabilization, satisfy the
approved final validation set, including required tests, qlty, architecture,
and desktop/web checks, and record the final snapshot identity and evidence.

Run this loop within `IMPLEMENTING`, without review, approval, or commit at
each attempt. The independent `implementation-reviewer` reviews the entire
final patch and its rationale. Review Findings classified as `correction`
return through Main to `implementer` in `IMPLEMENTED` pending revision,
followed by correction, affected validation, and independent re-review.
`decision-required` Findings return to Main for the missing decision and
Replanning when required. These classifications are not lifecycle states.
Completion continues the original sequence: `Ready`, explicit Completion
Approval, and a focused commit by `approval-committer`, followed by the
existing Feature Exit gates.

### Test Organization and Repair

Organize tests around use-case-defined observable behavior, the complete
architecture rule catalog, and general component/public-contract behavior.
Retain distinct valid, error, edge, privacy, and compatibility coverage. Remove
redundant identical assertions, incidental implementation-text mirrors, and
unjustified synthetic permutations or stress cases; retain purposeful
architecture and declared-configuration checks. Physically delete excess tests
and dedicated test support, recording how retained contracts remain covered.

Test common behavior once. Split desktop and web suites only when a genuine host
capability, different behavior, or adapter boundary requires it. Keep necessary
host smoke checks, shared-contract and build compatibility, and the zero-exception
architecture gate. After cleanup, repair retained tests against their contracts;
failures are not deletion evidence. A production mismatch with an existing
approved contract follows the Correction Loop; changing that contract requires
scope or design review. Test removal or coverage changes require their own
approved boundary and are not incidental corrections.

- **SDD coordination/specification docs only:** for feature intake, plans,
  replans, `SPECS.md`, `TASKS.md`, `TRACEABILITY.md`, and their templates, run
  Markdown lint covering every changed Markdown path, validate local links
  and document structure, and run `rtk git diff --check`. Inspect scope,
  traceability, state transitions, and approval provenance as applicable.
  `rtk pnpm run lint:md` covers feature/use-case Markdown; pass other changed
  paths explicitly to markdownlint-cli2. Full-repository qlty baseline/final
  scans and the aggregate are not required for this surface.
- **Repository-wide durable or configuration-sensitive docs:** policy,
  architecture, agent routing/procedures, and documentation that affects check
  commands or configuration retain non-mutating qlty check/smells comparisons
  in exact disposable baseline/final snapshots and the formatting-capable
  aggregate in the final snapshot only. Add targeted Markdown/link/structure
  and diff checks. For mixed documentation changes, use this broader tier.
  Docs-only work needs no product build; the repository `Verify` workflow is
  not a required local documentation gate.
- **Isolated code:** run relevant tests and the same qlty observations and final
  aggregate; build when compilation, bundling, packaging, or final confidence
  requires it.
- **Parser, shared contract, extension host, entry point, generated artifact,
  or configuration:** add the relevant desktop or web tests and build
  evidence.

For code slices, qlty must pass. Compare every reliably mapped finding by
identity, explicit severity ordering, baseline/final severity, measured values,
and whether higher or lower values are worse. A new finding or mapped adverse
movement is Finding/NG. Treat identity or direction that cannot be mapped
reliably as advisory; unchanged unrelated findings stay out of scope. Metric
movement is a review signal only when no mapped adverse finding exists.

### qlty Evidence Format

The owning producer records mechanical facts under the Evidence Contract;
those facts neither approve work nor replace semantic review. When the
validation tier requires qlty, use `0.645.0` or newer with official SARIF
output for both `check` and `smells`. In exact disposable baseline and final
snapshots, run these same commands with the same full-repository selection and
configuration:

```sh
rtk pnpm exec qlty check --all --sarif --no-fix
rtk pnpm exec qlty smells --all --sarif --no-snippets
```

Save each complete SARIF 2.1.0 file, command output, and exit status. Record
the version, nonzero analyzed-path inventory and count for each command in
each snapshot, configuration hash, snapshot revisions, and commands. The
selection is the full repository in both snapshots; match baseline paths
against final paths, and treat findings on paths added in the final snapshot
as new findings. Keep qlty cache and output local to each snapshot. Zero
analyzed files, missing or malformed SARIF, an incomplete scan, version or
configuration or selection mismatch, or missing results cannot pass. A
nonzero `check` exit caused by findings from a completed scan is a
finding-triggered status, not a command execution failure: retain the raw
status and complete SARIF and evaluate the findings. A command that cannot
start or complete is an execution failure and cannot pass. Compare official
SARIF records; do not create a repository-specific parser or textual-output
comparator. Any new SARIF finding is NG regardless of severity. Compare
reliably mapped findings using explicit severity ordering, measured values,
and whether higher or lower is worse; any mapped adverse movement is NG.
Run `rtk pnpm run qlty` only in the disposable final snapshot, and require
that final aggregate to pass. The current-head Qlty Cloud check must also
pass before Feature Exit. If formatting changes approved content, sync those
paths, rebuild that snapshot, and repeat both observations and the aggregate
until stable.

The plan review is the pre-approval scope gate. The independent
`implementation-reviewer` makes the integrated review of scope, acceptance,
quality, and production readiness after validation. Add a second independent
review for the higher-risk surfaces above or when the first review finds a
concern, reusing the same valid evidence. Feature Exit is the separate aggregate
review defined below, rather than another per-slice implementation review.

### Evidence Contract

Evidence is a reusable artifact with one owner, not a separate operation or
delegation. Keep `TASKS.md` as a decision index: validation identity, result,
coverage, artifact reference, missing facts or invalidation reason, and gate
references. Keep mechanical detail in a retained evidence artifact or sidecar
outside inspected inputs: producer/version, path manifests,
configuration/dependency/ tool identities, command exits, analyzed-path
inventories, SARIF references, raw outputs, and execution observations. Link
that artifact from `TASKS.md`; do not duplicate its manifest in each slice.
Keep outputs/caches outside inspected inputs. Records must be readable by the
next role; missing artifacts are unavailable evidence, never a pass. Preserve
them through review, approval, commit, and Feature Exit. Carry the compact
acceptance, validation, review, approval, and commit references for all
completed slices until closure; remove superseded narrative, not necessary
gate proof. Do not build a collector service, custom SARIF parser, or
comparator.

<!-- markdownlint-disable MD013 MD060 -->

| Record                   | Producer                                          | Consumers / purpose                                                                                        |
| ------------------------ | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Discovery facts          | Intake/planner for the references actually needed | Planner and plan-reviewer: scope, affected symbols/tests, boundaries and risks                             |
| Documentation validation | Role changing the documentation                   | Reviewer and next role: validate that changed documentation surface                                        |
| Slice validation         | Implementer, one baseline/final set per slice     | Implementation-reviewer: semantic review; feature-closer: aggregate completeness                           |
| Review findings          | Independent reviewer                              | Main and author: verdict, precise Findings, reviewed patch identity, affected revalidation                 |
| Closure evidence         | Feature-closer                                    | Main and committer: cross-slice completeness, durable ownership, risk ownership, current-head global gates |

<!-- markdownlint-enable MD013 MD060 -->

#### Identity And Required Facts

Each validation record identifies:

- Record version, feature/slice, producer, base revision and exact final
  revision or working-tree content identity; approved path set; changed paths
  with rename detection, untracked paths, and out-of-scope or ambiguous paths.
- Inputs and coverage for each check, command/arguments, tool versions,
  configuration/dependency hashes, required command set, exit status,
  passed/failed/unknown state, and raw-output reference. Record the architecture
  dependency test separately from semantic architecture judgments.
- When the validation tier requires qlty: version, configuration hash,
  full-repository selection, nonzero analyzed-path inventory/count in both
  snapshots for both commands, all four
  complete SARIF references, command logs/status, and final aggregate result.
- When relevant: `engines.vscode` before/after; touched desktop/web/bootstrap/
  parser/configuration surfaces; Node-import scan and unresolved cases; changed
  layers/exports/imports and abstraction candidates; traceability mapping.
  These are mechanical signals, not Solution Shape or approval verdicts.
- Missing/ambiguous facts and execution exceptions. Human approval provenance
  and review judgments remain separate gate records.

A commit hash alone cannot identify uncommitted validation inputs. For a
working tree, record a reproducible content manifest/hash covering inspected
tracked and untracked inputs, deletions and renames, check configuration and
dependency inputs. For full-repository qlty scans this is the full analyzed
repository surface, not just approved paths. Identify any unrelated changes
included in a snapshot; never silently mix another slice into its baseline or
final evidence. Ignored generated inputs used by a check must also be covered.

Check coverage may differ. Reuse an individual result only when its own inputs,
configuration, tool version and required command still match; a valid targeted
test cannot stand in for a required full-repository or host check. Planning
facts need their reference/base identity and coverage, not a qlty package for
code that has not been implemented.

#### Freshness And Invalidation

Evidence is stale for the affected facts only when one of these occurs:

1. Inspected content or a relevant dependency/configuration input changes.
2. The approved path set or required validation commands/coverage change.
3. The comparison base changes.
4. A relevant tool version or qlty configuration/selection changes.
5. A check modifies its inspected snapshot after observations were recorded.

Otherwise matching identity and sufficient facts require reuse. Phase changes,
new reviewers, returning to Main, human approval, and entering a commit gate
do not invalidate evidence. Linking a validated content identity to its new
commit does not require another run. Current-head CI/Cloud gates remain bound
to their exact commit; a prior commit's status is not a current-head pass.

Treat approval/status/evidence/commit annotations as a separate metadata patch.
Record its exact diff and run targeted non-mutating documentation validation
and scope inspection; metadata-only annotations do not start another qlty
baseline/final cycle. Bind existing scans to the immutable substantive snapshot
they actually inspected, never claim they scanned later annotations. Metadata
may be excluded from product-check inputs only when recorded explicitly and
when it cannot affect that check. Any specification, scope, command, risk or
acceptance change is substantive, never a metadata exception, and invalidates
affected facts. Review and human approval cover the exact substantive patch
plus the separately inspected gate metadata.

Missing facts, an identity mismatch, or a specific Finding requiring
reproduction are the only reasons for a consumer to request refresh or run an
affected non-mutating check. Record the reason and coverage; rerun only what
that reason invalidates. Retain a matching baseline; do not recreate it at each
review. Writes and formatting belong to the producer, not read-only reviewers.
An unavailable or failed required check blocks readiness. Committers must not
rerun product validation: changed scope/evidence returns through Main to the
producer and reviewer before committing. Staged diff checks remain mandatory.

#### Evidence Reuse Observations

Routine role dispatches, tests/builds, Git inspections, human gates, and commits
do not need execution counters. Record only unexpected reruns, evidence
regenerations, and extra reviews, with the reason, affected identity/coverage,
and result, in the linked evidence artifact. Distinguish a justified refresh
from duplicate work on matching inputs. Use `none` only when observed and
`unknown` when unavailable; do not reconstruct historical counts.

Keep a compact exception reference in `TASKS.md` only when it affects the next
decision. Feature Exit consumes existing observations without a counting or
collection pass. Existing counter records may be retained as evidence without
continuing routine counts. These observations never replace required checks,
independent review, or approval.

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
Apply the [Correction Loop](#correction-loop-for-deterministic-failures) for
contract-preserving repairs under existing approval.

Prefer high-accuracy models for planning, impact, design, architecture,
specification, and review; medium- or lower-cost models may be used for
approved-scope implementation and simple fixes. For implementer,
implementation-reviewer, and feature-closer, Main selects reasoning effort by
the approved slice's risk within the role's supported settings: `xhigh` for
parser, shared contracts, bootstrap, web, architecture, or unresolved review
concerns; `high` for isolated code or documentation; `medium` or `high` for
mechanical approved fixes. Preserve role model quality and independent
reviewers. Fixed host/role settings take precedence when overrides are
unavailable; never change a model merely to reduce cost. Record an effort
exception only when it affects risk or readiness. If implementation reveals an
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
[Risk-Based Validation And Review](#risk-based-validation-and-review).
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
