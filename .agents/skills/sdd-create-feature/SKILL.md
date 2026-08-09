---
name: sdd-create-feature
description: Create one scoped SDD feature entry for vscode-ajsbutler and clarify its purpose, boundaries, and durable-document impact before planning.
---

# SDD Feature Intake

## Purpose

Create one well-scoped SDD feature entry while keeping the existing
implementation gate intact. This procedure covers feature clarification and
documentation setup; planning and implementation use their own procedures.

## Minimum Context

Read first:

1. `AGENTS.md`
2. `docs/specs/README.md`
3. `docs/specs/roadmap.md`
4. `docs/specs/features/_templates/SPECS.template.md` and
   `TASKS.template.md`

Read related use cases or existing feature folders only when they are needed
to resolve observable behavior, overlap, or duplicate scope.

Use `docs/specs/README.md` as the Single Source of Truth for document roles,
trivial-change criteria, and approval policy. Do not copy that policy into a
feature document.

## Intake Gate

Before editing feature documents, establish:

- feature kind: roadmap feature or transient branch feature
- lowercase hyphenated feature slug
- one concrete purpose
- source use case, roadmap item, bug, risk, or branch goal
- JP1/AJS source reference, or an explicit undocumented/inferred basis
- expected behavior or boundary decision
- non-goals
- desktop and web compatibility expectations

Do not infer a missing feature kind, product behavior, compatibility scope, or
roadmap intent. Record assumptions in the feature documents or request the
missing decision.

## Scope Gate

Accept exactly one purpose per feature folder. If the request contains
independent outcomes, split it into named features, dependency order, and the
first feature to create. Do not create placeholder features for vague goals
such as “improve architecture” or “make it better”.

## Creation Workflow

1. Confirm the intake and scope gates.
2. Check existing feature folders, related use cases, and roadmap overlap.
3. Create `docs/specs/features/<slug>/` from the feature templates.
4. Treat the explicitly requested folder as selected; inherited folders remain
   outside the current feature.
5. Fill `SPECS.md` with purpose, origin, requirements, boundaries,
   compatibility, acceptance criteria, non-goals, and open questions.
6. Fill `TASKS.md` with current state, validation expectations, risks, and
   planning follow-up. Record approval state from the repository SSOT rather
   than inferring it.
7. Create `TRACEABILITY.md` when the feature is non-trivial, multi-slice, or
   needs explicit use-case correspondence.
8. Update `roadmap.md` only when unfinished repository-level work or ordering
   changes. Update durable use cases only when a behavior contract changes.
9. Run docs-only validation through `rtk`.

## Traceability

When created, `TRACEABILITY.md` maps:

- Use Case
- Requirement
- `SPECS.md` section
- Implementation Slice
- Test file or validation plan

## Completion Checklist

- no template placeholder remains
- purpose states one concrete observable result or boundary decision
- requirements are testable
- architecture maps responsibilities to the repository layers
- compatibility covers desktop and web
- acceptance criteria are verifiable
- feature kind, overlap, roadmap impact, and use-case impact are recorded

## Validation

For documentation-only intake work, run:

```bash
rtk pnpm run qlty
rtk pnpm run lint:md
```

## Rules

- preserve the `docs/specs/README.md` implementation gate
- keep feature documents concise and temporary
- do not edit runtime code, tests, generated artifacts, configuration, or
  implementation branches during intake
- prefer `rtk` for inspection, search, and validation
