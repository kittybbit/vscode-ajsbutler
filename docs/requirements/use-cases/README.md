# Use Cases

This directory stores repository-level use-case requirements.

Use this directory when the behavior being described is a stable product or
application use case that may survive refactors of modules, adapters, or file
layout.

Use cases are grouped by requirement area:

Core definition interpretation:

- normalize AJS document
- interpret JP1 parameters
- generate AJS commands
- import AJS definition via WebAPI

Viewer and export behavior:

- build unit list
- build unit list view
- build flow graph
- show unit definition
- export unit list CSV
- provide editor feedback
- navigate between unit list and flow graph

Cross-cutting operations:

- record telemetry
- improve build and test performance
- search domain unification

Do not use this directory as a task log or implementation notebook.
That belongs in `docs/specs/`.

## How To Use It

1. Start from `_template.md`.
2. Create or update one `uc-*.md` file per use case, using hyphenated
   filenames such as `uc-build-flow-graph.md`.
3. Write the use case in terms of trigger, inputs, outputs, rules, and
   acceptance notes.
4. Keep UI framework details, VS Code adapter details, and file-level refactor
   steps out of the use case unless they are part of the behavior contract.
5. Use Gherkin scenarios only when they clarify behavior contracts. Keep
   `Rules` for invariant constraints and remove `Acceptance Notes` that merely
   repeat the same scenario.
6. When implementation changes but the behavior contract does not, update
   `docs/specs/` and leave the use-case file stable.
7. When the actual behavior contract changes, update the use-case file first,
   then align specs, plans, tasks, tests, and code.

## Relationship To `docs/specs/`

- `docs/requirements/use-cases/`
  Repository-level behavior contract.
- `docs/specs/features/<feature>/SPECS.md`
  Feature-local implementation requirements and boundary decisions.
- `docs/specs/features/<feature>/PLANS.md`
  Feature-local design and milestone notes.
- `docs/specs/features/<feature>/TASKS.md`
  Execution checklist for the current slice.
- `docs/specs/plans.md`
  Branch-level summary, current task, and next priorities.

## Decision Rule

Ask two questions:

1. Is this describing user-visible or application-visible behavior that should
   remain true even if the code structure changes?
   If yes, it belongs in a use-case file.
2. Is this describing how the current branch will implement, sequence, or
   validate the change?
   If yes, it belongs in `docs/specs/`, not here.
