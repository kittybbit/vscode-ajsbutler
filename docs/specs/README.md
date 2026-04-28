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
5. [Current State](./current-state.md)
6. [Roadmap](./roadmap.md)
7. [Requirements Use Cases](../requirements/use-cases/README.md)

## Working Agreement

For non-trivial changes:

1. create a dedicated git branch before implementation work starts
   and use `docs/...` only for docs-only slices
2. prefer quality assurance, KISS, DRY/YAGNI, then SOLID in that order;
   do not add abstractions unless they reduce real complexity
3. update or create the relevant use-case spec in
   `docs/requirements/use-cases/` when the behavior contract changes
4. update or create concise feature docs under
   `docs/specs/features/<feature>/` when implementation requirements,
   boundary decisions, or active tasks need tracking
5. track execution tasks in `docs/specs/features/<feature>/TASKS.md`
   and update that file in the same commit whenever a task is completed,
   reframed, or dropped
6. document assumptions explicitly
7. implement in small vertical slices
8. refresh `docs/specs/plans.md` in the same commit if the active slice or
   branch priorities change materially
9. refresh `docs/specs/roadmap.md` in the same commit if a completed slice
   changes repository-level ordering, remaining debt, or deferred work
10. before `git push`, run local validation serially in this order for code
    changes: `pnpm run qlty`, `pnpm test`, `pnpm run test:web`, `pnpm run build`
11. run any additional task-specific checks before finishing
12. avoid anemic domain models: extract only cross-unit or cross-layer
    semantics into helpers/interfaces, and keep entity identity plus
    unit-local behavior in the entity when that behavior is part of the
    JP1/AJS concept itself

For docs-only changes:

- `pnpm run build` is not required
- `pnpm run qlty` is required
- run `pnpm run lint:md` when the changed markdown scope benefits from
  markdown-specific validation
- repository `Verify` workflow should not be relied on as a required gate

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

Each feature `TASKS.md` must include the approval evidence:

```md
## Human Approval

- Status: Pending | Approved
- Approved at:
- Approved scope:
```

Implementation may start only when `Status: Approved` and `Approved scope`
records the human-approved implementation boundary. If implementation reveals
required changes outside the approved scope, stop again, update the impact
record, and obtain additional clear approval before editing those areas.

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
notes in `TASKS.md`.

- `docs/specs/plans.md`:
  branch-level plan, scope boundary, changed-area summary, likely fix
  candidates, risk summary, and assumptions
- `docs/specs/features/<feature>/SPECS.md`:
  durable impact analysis, reference propagation decisions, breaking-change
  analysis, alternatives, and boundary decisions
- `docs/specs/features/<feature>/TASKS.md`:
  execution tasks for investigation, approval, implementation, tests, and
  follow-up tracking

`TASKS.md` may point to investigation results, but it is not the primary
record for design decisions or impact analysis.

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
active requirement, durable boundary decision, or useful follow-up. Compress
completed refactor-only slices into `roadmap.md` or `plans.md` instead of
keeping a stale feature folder as historical log.

## Sync Cadence

Treat the following docs as required sync artifacts, not optional catch-up
notes:

- `docs/specs/features/<feature>/TASKS.md`
  Update immediately when one task or follow-up is completed, re-scoped, or
  intentionally dropped.
- `docs/specs/plans.md`
  Update when that task completion changes the branch summary or next priority.
- `docs/specs/roadmap.md`
  Update when that completion changes repository-level sequence, remaining
  debt, or deferred work.

Prefer the smallest useful cadence:
one completed task or one resolved follow-up is enough reason to sync the
docs in the same commit.

## Document Roles

- `vision.md`: product purpose and values
- `glossary.md`: shared terms
- `context-map.md`: boundaries and external systems
- `architecture.md`: target layering and dependency direction
- `current-state.md`: present-day repository shape and tensions
- `roadmap.md`: preferred incremental extraction order
- `features/_templates/`: templates for new repository-native feature docs
