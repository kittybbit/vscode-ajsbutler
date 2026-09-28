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
the plan independently reviewed. Findings or a new scope, design, dependency,
impact, or approval-boundary decision return to `planner` in Replanning Mode.

Human Approval covers the reviewed plan and exact slice scope. After a plan or
replan review returns `Ready` and Human Approval is explicit, `approval-committer`
creates one focused planning commit. Only then may `implementer` work on one
approved slice. Each completed slice receives an independent
`implementation-reviewer` review. Findings return through Main to
`implementer`; a new scope or design decision returns for replanning. After
`Ready`, explicit Completion Approval and that slice's focused commit are
required before another dependent slice starts. Once all slices are complete
and committed, `feature-closer` performs Feature Exit. Its `Close` result,
explicit Closure Approval, and focused closure commit are separate gates.

Every human approval authorizes only its stated gate and scope. Replanning is
the route for changing approved scope; do not make a silent change between
commits. Main coordinates each handoff. Role ownership and routing are defined
in [AGENTS.md](../../AGENTS.md) and the role definitions.

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

### Approval-Gated Commit Policy

Only `approval-committer` may make plan, completion, and closure workflow
commits. Before staging, it requires the matching review verdict, explicit
approval, exact paths, and a clean scope boundary. It must stop if any are
missing or unrelated work is present; broad staging cannot hide it. Make one
focused commit per gate. Do not amend, reset, force-push, publish, or alter
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
check. Do not rerun unchanged checks only because the workflow has advanced.

- **Docs-only:** compare non-mutating qlty check/smells observations in exact
  disposable baseline and final snapshots, then run the formatting-capable
  aggregate only in the disposable final snapshot. Add `rtk pnpm run lint:md`
  when Markdown structure or links need focused checking. Build is not
  required; do not rely on the repository `Verify` workflow as a required gate.
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

Use `$sdd-evidence` for mechanical facts; it neither approves work nor replaces
semantic review. Use qlty `0.645.0` or newer with official SARIF output for
both `check` and `smells`. In exact disposable baseline and final snapshots,
run these same commands over identical analyzed paths and configuration:

```sh
rtk pnpm exec qlty check --sarif --no-fix
rtk pnpm exec qlty smells --sarif --no-snippets
```

Save each complete SARIF 2.1.0 file, command output, and exit status. Record
the version, analyzed paths, configuration hash, snapshot revisions, and
commands. Keep qlty cache and output local to each snapshot. Missing or
malformed SARIF, failed commands, version/configuration/scope mismatch, or
missing results cannot pass. Compare official SARIF records; do not create a
repository-specific parser or textual-output comparator. Run `rtk pnpm run
qlty` only in the disposable final snapshot. If formatting changes approved
content, sync those paths, rebuild that snapshot, and repeat both observations
and the aggregate until stable.

The plan review is the pre-approval scope gate. After implementation and final
validation, make one integrated review of scope, acceptance, quality, and
production readiness. Add an independent second review for the higher-risk
surfaces above or when the first review finds a concern. Feature Exit remains
a separate review by `feature-closer`.

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
choice, abstraction, affected surface, risk, validation, or approval boundary
changes.

Prefer high-accuracy models for planning, impact, design, architecture,
specification, and review; medium- or lower-cost models may be used for
approved-scope implementation and simple fixes. Follow role model/effort
assignments. If implementation reveals an out-of-scope, specification, or
design decision, stop and return for investigation and re-approval. Model or
agent choice does not change SDD gates or approved scope. Check Copilot or
other agent suggestions against the approved `SPECS.md`, `TASKS.md`, and
paths; reject out-of-scope changes and return them for investigation and
approval.

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

For code slices, assess intentional failure modes, understandable errors or
fallbacks, JP1/AJS compatibility, large/malformed/edge inputs, desktop and web
behavior, user-document impact, and changelog need. User docs change only when
user-facing behavior changes.

### Feature Exit Review Output

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
