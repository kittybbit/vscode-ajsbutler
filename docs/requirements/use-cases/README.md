# Use Cases

This directory stores repository-level use-case requirements.

Use this directory when the behavior being described is a stable product or
application use case that may survive refactors of modules, adapters, or file
layout.

Examples:

- build unit list
- build flow graph
- normalize AJS document
- export unit list CSV
- provide editor feedback

Do not use this directory as a task log or implementation notebook.
That belongs in `docs/specs/`.

## How To Use It

1. Start from `_template.md`.
2. Create or update one `uc-*.md` file per use case.
3. Write the use case in terms of trigger, inputs, outputs, rules, and
   acceptance notes.
4. Keep UI framework details, VS Code adapter details, and file-level refactor
   steps out of the use case unless they are part of the behavior contract.
5. When implementation changes but the behavior contract does not, update
   `docs/specs/` and leave the use-case file stable.
6. When the actual behavior contract changes, update the use-case file first,
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
