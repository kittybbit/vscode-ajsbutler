---
name: sdd-create-feature
description: Use when creating a new vscode-ajsbutler SDD feature folder, clarifying a proposed feature before it enters docs/specs/features, deciding whether the feature belongs on roadmap.md or is transient branch work, splitting multi-purpose feature ideas, and refusing to infer vague or abstract feature scope before updating SDD documents.
---

# sdd-create-feature

## Purpose

Create one well-scoped SDD feature entry for `vscode-ajsbutler` while keeping
the existing implementation gate intact. Use this skill only for feature
intake and documentation setup; hand off task selection to `sdd-plan-task` and
approved implementation to `sdd-implement-task`.

## Inputs

Read these first:

1. `AGENTS.md`
2. `docs/specs/README.md`
3. `docs/specs/plans.md`
4. `docs/specs/roadmap.md`
5. `docs/specs/features/_templates/SPECS.template.md`
6. `docs/specs/features/_templates/TASKS.template.md`
7. related `docs/requirements/use-cases/` files when the proposed feature
   changes observable behavior

Inspect existing feature folders under `docs/specs/features/` to avoid
duplicate or overlapping feature entries.

## Intake Gate

Before creating or editing feature docs, explicitly establish:

- feature kind: `roadmap feature` or `transient branch feature`
- feature name and slug
- one concrete purpose
- source use case, roadmap item, bug, risk, or branch goal
- expected behavior or boundary decision
- non-goals
- desktop and web compatibility expectations

Ask the user to choose the feature kind when it is not already explicit:

- `roadmap feature`: durable work that should remain visible in
  `docs/specs/roadmap.md` or repository sequencing after the branch
- `transient branch feature`: temporary branch-local work tracked in
  `docs/specs/features/<feature>/` and `docs/specs/plans.md`, removed after
  durable decisions move to use cases, roadmap, or plans

Do not infer the kind from tone, size, or urgency.

## Scope Gate

Accept exactly one purpose per feature folder.

If the request contains multiple independent outcomes, propose a split before
editing docs. Name each proposed feature, its single purpose, dependency order,
and which item should be created first.

If the purpose is vague or abstract, ask focused questions until the concrete
behavior, boundary, or decision is clear. Do not create placeholder feature
docs for goals such as "improve architecture", "modernize UI", "clean up",
"make it better", or "support WebAPI" unless the user has narrowed the
observable result or boundary.

Good feature purposes:

- add read-only import for one JP1/AJS WebAPI source
- extract CSV export into an application use case
- refresh `UnitEntity` identity compatibility checks

Too broad for one feature:

- modernize all runtime boundaries
- refactor parser, list view, flow view, and CSV together
- finish WebAPI support end to end

## Creation Workflow

1. Confirm the intake and scope gates.
2. Choose a lowercase hyphenated slug under `docs/specs/features/<slug>/`.
3. Check that the slug does not duplicate an active feature folder.
4. Create the feature folder from the repository templates:
   - `SPECS.md` from `SPECS.template.md`
   - `TASKS.md` from `TASKS.template.md`
5. Fill `SPECS.md` with only feature-level purpose, origin, requirements,
   architecture boundaries, compatibility, acceptance criteria, non-goals, and
   open questions.
6. Fill `TASKS.md` with current status, approval state, active planning tasks,
   validation expectations, unresolved risks, and use-case back-propagation
   notes. Keep `Human Approval` pending unless the user has already given
   clear approval for a specific implementation scope in the current
   conversation.
7. Update `docs/specs/plans.md` when the branch starts, stops, or changes an
   active feature.
8. Update `docs/specs/roadmap.md` only for `roadmap feature` work or when the
   new feature changes repository-level ordering, remaining debt, or deferred
   work.
9. Update or create `docs/requirements/use-cases/` only when the new feature
   changes a durable behavior contract.
10. Run docs-only validation through `rtk`.

## Document Responsibilities

- `SPECS.md`: durable feature requirements, architecture boundaries,
  compatibility notes, acceptance criteria, alternatives, non-goals, and open
  questions.
- `TASKS.md`: current executable planning state, current approval evidence,
  validation expectations, unresolved risks, and follow-up that affects the
  next decision.
- `docs/specs/plans.md`: branch-level active features and branch-wide
  assumptions.
- `docs/specs/roadmap.md`: repository-level sequence, roadmap-visible
  features, remaining debt, and deferred work.
- `docs/requirements/use-cases/`: durable behavior contracts that should
  survive feature-folder removal.

Do not store implementation logs, long transcripts, or speculative design
history in feature docs.

## Approval Boundary

This skill may update SDD documents only. It must not edit runtime code, tests,
generated artifacts, configuration, implementation branches, implementation
commits, implementation refactors, or incidental fixes.

Before finishing, report:

```md
## Feature Intake Summary

- Feature kind:
- Feature folder:
- Purpose:
- Source:
- Scope split considered:
- Ambiguities resolved:
- Roadmap impact:
- Plans impact:
- Use-case impact:
- Validation:

## Next Step

Use `sdd-plan-task` to investigate and propose the first implementation slice.
```

## Validation

For docs-only feature creation, run:

```bash
rtk pnpm run qlty
```

Run `rtk pnpm run lint:md` when markdown structure, links, or template changes
need focused validation.

## Rules

- Preserve the `docs/specs/README.md` Implementation Change Gate.
- Do not create a feature until the feature kind is explicit.
- Do not create a feature until it has one concrete purpose.
- Do not infer missing behavior, compatibility scope, or roadmap intent.
- Prefer splitting features over creating broad umbrella folders.
- Keep roadmap-visible and transient branch work distinct.
- Keep generated feature docs concise enough for future agents to read from
  the top.
- Prefer `rtk` for file inspection, search, git, package scripts, and
  validation.
