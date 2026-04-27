# sdd-change

## Purpose

Prepare or update SDD artifacts before implementing a non-trivial repository change.

## Steps

1. read `AGENTS.md`
2. read `package.json`
3. read the relevant files in `docs/specs/`
4. investigate impact before implementation changes:
   - search affected functions, classes, components, and commands
   - list affected files, features, tests, docs, and breaking-change risk
   - when behavior scenarios exist, list changed, added, or removed scenarios
     and affected tests
5. record findings by responsibility:
   - `docs/specs/plans.md` for branch scope, assumptions, candidates, and risk
   - feature `SPECS.md` for durable impact analysis, alternatives, and boundary
     decisions
   - feature `TASKS.md` for investigation, approval, fixes, tests, and
     follow-up tasks
6. update or create the matching use-case spec in
   `docs/requirements/use-cases/`
   when the behavior contract changes
7. stop after the investigation and ask for explicit human approval before
   editing runtime code, tests, generated artifacts, or configuration
8. after approval, enumerate all affected references and task the complete fix
9. implement in small meaningful blocks, checking compile/tests as you go
10. run required validation before finishing

## Rules

- keep `engines.vscode` unchanged unless explicitly approved
- preserve desktop and web extension behavior
- prefer small vertical slices over broad rewrites
- document assumptions instead of hiding them
- keep KISS and YAGNI ahead of abstraction; avoid over-DRY process or code
- use a `docs/...` branch name only when the slice stays within the docs-only
  file set used by `.github/workflows/verify.yml`
- for docs-only changes, `pnpm run qlty` is required; add
  `pnpm run lint:md` when useful
