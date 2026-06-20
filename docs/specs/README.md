# SDD Overview

This directory is the entry point for Specification-Driven Development in this
repository.

## Goals

- keep behavior stable while refactoring incrementally
- make use cases explicit before structural changes
- preserve desktop and web extension compatibility
- support migration toward clearer domain, application, infrastructure, and
  presentation boundaries

## Recommended Reading Order

1. [Vision](./vision.md)
2. [Glossary](./glossary.md)
3. [Context Map](./context-map.md)
4. [Architecture](./architecture.md)
5. [Roadmap](./roadmap.md)
6. [Requirements Use Cases](../requirements/use-cases/README.md)

## Working Agreement

For non-trivial changes:

1. create a dedicated git branch before implementation work starts
   and use `docs/...` only for docs-only slices
2. prefer quality assurance, KISS, DRY/YAGNI, then SOLID in that order;
   do not add abstractions unless they reduce real complexity
3. update or create the relevant use-case spec in
   `docs/requirements/use-cases/` when the behavior contract changes
4. update or create concise feature docs under
   `docs/specs/features/<feature>/` when feature-level functional
   requirements or current task decisions need tracking
5. track execution tasks in `docs/specs/features/<feature>/TASKS.md`
   and update that file in the same commit whenever a task is completed,
   reframed, or dropped
   `TASKS.md` is not a complete work log; retain only the task state,
   approval boundary, unresolved risk, and use-case back-propagation notes
   that future maintainers need for the next decision
6. document assumptions explicitly
7. implement in small vertical slices
8. refresh `docs/specs/plans.md` only when the branch starts, stops, or
   changes an active feature; slice progress stays in the feature `TASKS.md`
9. refresh `docs/specs/roadmap.md` in the same commit if a completed slice
   changes repository-level ordering, remaining debt, or deferred work
10. before `git push`, run local validation through `rtk` serially in this
    order for code changes: `rtk pnpm run qlty`, `rtk pnpm test`,
    `rtk pnpm run test:web`, `rtk pnpm run build`
11. run any additional task-specific checks before finishing
12. avoid anemic domain models: extract only cross-unit or cross-layer
    semantics into helpers/interfaces, and keep entity identity plus
    unit-local behavior in the entity when that behavior is part of the
    JP1/AJS concept itself

For docs-only changes:

- `pnpm run build` is not required
- `rtk pnpm run qlty` is required
- run `rtk pnpm run lint:md` when the changed markdown scope benefits from
  markdown-specific validation
- repository `Verify` workflow should not be relied on as a required gate

Run validation commands through `rtk` by default. `rtk` is a cost-control and
execution-efficiency tool; it is not a reason to skip required validation.

## Semantic Code Navigation

When Serena or another semantic code navigation tool is available, use it
during impact investigation and reference impact verification to identify
affected symbols, references, call sites, and dependency impact.

Use semantic analysis to reduce reference omissions, including transitive
reference and dependency impact, in:

- Phase 1 impact investigation before requesting approval
- Phase 3 reference impact verification after approval

Use Serena selectively. Default order:

1. targeted symbol lookup
2. direct reference lookup
3. call-site and dependency impact lookup
4. broader repository exploration only when uncertainty remains

Do not perform broad repository exploration before identifying target symbols.
Do not repeat the same semantic search without a new question.

Serena is supplemental tooling. It does not replace:

- SDD artifacts
- human approval
- approval evidence
- tests
- validation

Manual impact analysis remains required. Do not treat Serena-only results as
proof that a change is safe.

Start with local, targeted lookup to reduce token use. Use broad exploration
only when the targeted checks still leave uncertainty about impact or
references.

Minimal local setup:

```bash
uv tool install -p 3.13 serena-agent@latest --prerelease=allow
serena init
serena setup codex
```

If the MCP client cannot find `serena` on `PATH`, configure the Codex MCP
server command with the absolute path to the installed `serena` executable.

## Model and Agent Usage

Use model and agent selection to control cost and precision without changing
the SDD process. Do not define a separate abstract "intelligence" rule; choose
the model based on whether the current phase requires judgment or execution.

Recommended model use:

- planning, impact investigation, design decisions, and pre-approval review:
  use a high-accuracy model
- destructive-change decisions, architecture decisions, and specification
  decisions: use a high-accuracy model
- implementation inside an already-approved scope: medium- or lower-cost
  models may be used
- simple fixes, lint follow-up, and approved test expectation updates:
  lower-cost models may be used
- if implementation reveals an out-of-scope change, specification change, or
  design decision: stop and return to high-accuracy investigation and
  re-approval

Codex, GitHub Copilot, or another coding assistant may be used, but all agents
must follow the same SDD gate. Changing the agent or model does not change the
process.

Every agent must preserve:

- impact investigation
- approval evidence
- approved scope boundaries
- required validation

Keep feature documents decision-focused:

- use `docs/specs/plans.md` for the branch work plan: active feature folders,
  branch-wide assumptions, and repository sequencing that applies across
  features
- do not update `docs/specs/plans.md` only because a slice inside an already
  active feature starts, finishes, or changes approval state
- use feature `SPECS.md` for feature-level functional requirements,
  compatibility constraints, acceptance criteria, and non-goals
- do not use feature `SPECS.md` for individual task records, slice histories,
  approval logs, qlty metric transcripts, or implementation checklists
- keep feature `TASKS.md` limited to the current status, active tasks, current
  approval state, unresolved risks, and the minimum record needed to decide
  whether a completed or active task must be reflected back into a use case
- remove prior implementation, approval, and validation details once they no
  longer affect a future decision, re-approval boundary, unresolved risk, or
  use-case update
- move durable behavior contracts to `docs/requirements/use-cases/`
- move repository-level sequence changes to `roadmap.md`
- summarize validation expectations in `TASKS.md`; include past run details
  only when a failure, warning, or risk remains actionable

Copilot suggestions must be checked against the approved `SPECS.md`,
`TASKS.md`, and approved scope before adoption. Do not accept Copilot
suggestions outside the approved scope. If an out-of-scope change appears
necessary, stop and return to investigation and re-approval.

When Codex orchestrates work across agents, Codex owns consistency of the SDD
documents, approval evidence, scope tracking, and validation record.

## Implementation Change Gate

Before editing runtime code, tests, generated artifacts, or configuration:

1. perform an impact investigation
2. record the findings in the right SDD artifacts
3. record the approval evidence section in the feature `TASKS.md`
4. report the planned change, affected files, affected functions/classes or
   components, affected features, affected tests, related docs,
   breaking-change risk, and alternatives
5. stop until a human gives clear approval for implementation

Clear approval means the human response unambiguously permits implementation
for the reported scope. The following are not approval:

- answers to investigation questions
- additional information
- design discussion
- ambiguous agreement
- Codex's own judgment

While approval is pending, Codex must not:

- edit runtime code
- edit tests
- edit generated artifacts
- edit configuration
- create an implementation branch
- create an implementation commit
- refactor for implementation purposes
- make incidental or "while here" fixes

While approval is pending, Codex may only:

- investigate
- update SDD documents
- record impact scope
- organize alternatives
- present the approval request

Each feature `TASKS.md` must include only the current approval evidence:

```md
## Human Approval

- Status: Pending | Approved
- Approved at:
- Approved scope:
```

`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the human approval message into `TASKS.md`.

Implementation may start only when `Status: Approved`, `Approved at`, and
`Approved scope` record the human-approved implementation boundary. Reset the
section back to `Pending` when that approved slice is finished and no active
implementation approval remains. If implementation reveals required changes
outside the approved scope, stop again, update the impact record, and obtain
additional clear approval before editing those areas.

Before approval, Codex must report only this implementation-gate output and
must not claim that implementation has started or completed:

```md
## Impact Investigation Summary

- Planned change:
- Affected files:
- Affected functions/classes/components:
- Affected features:
- Affected tests:
- Related docs:
- Breaking-change risk:
- Alternatives:

## Approval Request

Please approve implementation before I edit runtime code, tests,
generated artifacts, or configuration.

Implementation will not proceed until approval is given.
```

After approval, expand the investigation into a complete reference impact
check, list every required fix, and task the work before implementation.
Use Serena or another semantic code navigation tool when available to verify
affected references, call sites, transitive references, and dependency impact.
Do not finish with only a subset of affected references updated.

Implementation should then proceed in small meaningful blocks:

1. implement one coherent block
2. compile or run the closest fast check
3. repair affected references in order
4. run relevant unit tests
5. after all fixes, run non-unit validation required by the change

Do not leave failing checks unexplained or deferred without an explicit
follow-up decision.

## Impact Investigation Records

Use the SDD artifacts by responsibility instead of storing all investigation
notes in feature documents.

- `docs/specs/plans.md`:
  branch-level work plan: active feature folders, branch-wide assumptions, and
  repository sequencing that applies across features. Do not rewrite it for
  slice-level progress inside an already active feature.
- `docs/specs/features/<feature>/SPECS.md`:
  feature-level functional requirements, compatibility requirements,
  acceptance criteria, and non-goals
- `docs/specs/features/<feature>/TASKS.md`:
  current execution tasks, current approval evidence, unresolved risks, and
  the minimum notes needed to decide whether behavior must be reflected back
  into `docs/requirements/use-cases/`
- `docs/requirements/use-cases/`:
  durable behavior contracts and observable scenario changes

`TASKS.md` may temporarily hold approval-sensitive investigation details while
the task is active. After the task is completed, re-scoped, or dropped, reduce
the record to only what still affects future approval, risk, or use-case
back-propagation. It is not the primary record for design decisions, impact
analysis, or historical narrative.

When behavior scenarios exist, include the scenario impact in the same
investigation: changed scenarios, added scenarios, removed scenarios, and
tests affected by those scenarios.

## Gherkin Usage

Use Gherkin selectively for behavior contracts where Given / When / Then makes
the expected behavior clearer.

Keep use-case sections separated by responsibility:

- `Rules`:
  invariant constraints, boundaries, must-not statements, compatibility
  requirements, and policy decisions that apply across scenarios
- `Behavioral Scenarios`:
  concrete observable examples of behavior, one behavior per scenario
- `Acceptance Notes`:
  supplemental acceptance or validation notes that are not already expressed by
  scenarios, such as fixture strategy, migration caveats, or cross-host checks
- `Risks Or Edge Cases`:
  unresolved hazards, rare inputs, and conditions that need focused future
  verification

When adding scenarios, remove or shorten `Acceptance Notes` that repeat the
same Given / When / Then behavior. Keep `Rules` unless they are only restating
one scenario and are not a general constraint.

Good fit:

- use-case scenarios
- regression-prone behavior
- domain rules
- bug recurrence prevention
- breaking-change examples

Poor fit:

- architecture design
- layering decisions
- refactor plans
- dependency design
- internal algorithm details

Prefer clarity over ceremony. Do not force every specification into Gherkin,
and do not add Cucumber or other executable-spec tooling unless a future slice
explicitly justifies it.

## Branch Naming

Use branch names to signal verification intent clearly:

- `docs/...`
  Reserve for docs-only slices.
- non-`docs/...`
  Use for any slice that changes runtime code, tests, config, or other
  non-doc files.

Match the branch name to the `Verify` workflow's docs-only rule.
In `.github/workflows/verify.yml`, a PR is treated as docs-only only when the
changed files stay within:

- `docs/**`
- `README.md`
- `.codex/**/*.md`
- `.github/**/*.md`

If a `docs/...` branch needs any file outside that set, rename the branch or
start a new non-doc branch before continuing.

## When To Use `docs/requirements/use-cases/`

Use `docs/requirements/use-cases/` for repository-level behavior contracts.
These files should remain meaningful even if modules, adapters, or file layout
change.

Good fit:

- application use cases such as build list, build flow graph, normalize
  document, export CSV, or show definition
- cross-feature behavior that multiple implementations or adapters rely on

Poor fit:

- branch task sequencing
- implementation notes tied to the current refactor
- file-by-file execution checklists

Those belong under `docs/specs/`.

## When To Remove Feature Docs

Remove a `docs/specs/features/<feature>/` folder when it no longer carries an
active feature requirement, active task decision, unresolved risk, or useful
follow-up. Preserve completed refactor-only information in `roadmap.md`,
`plans.md`, or use cases only when it helps future sequencing, risk
assessment, ownership decisions, or behavior understanding.

## Sync Cadence

Treat the following docs as required sync artifacts, not optional catch-up
notes:

- `docs/specs/features/<feature>/TASKS.md`
  Update immediately when one task or follow-up is completed, re-scoped, or
  intentionally dropped, then remove details that no longer affect approval,
  risk, or use-case back-propagation.
- `docs/specs/plans.md`
  Update only when the branch starts, stops, or changes an active feature.
- `docs/specs/roadmap.md`
  Update when that completion changes repository-level sequence, remaining
  debt, or deferred work.

Prefer the smallest useful cadence:
one completed task or one resolved follow-up is enough reason to sync the
docs in the same commit.

When syncing, preserve decision context instead of accumulating entries:

- remove or rewrite completed checklist/history sections when they no longer
  help future maintainers understand the current state, remaining risk, next
  decision, or required use-case update
- keep `TASKS.md` readable from the top so the current approval state, active
  tasks, and next decision are immediately visible
- keep feature `SPECS.md` readable as functional requirements rather than as a
  task archive

## Document Roles

- `vision.md`: product purpose and values
- `glossary.md`: shared terms
- `context-map.md`: boundaries and external systems
- `architecture.md`: target layering and dependency direction
- `roadmap.md`: preferred incremental extraction order
- `features/_templates/`: templates for new repository-native feature docs
