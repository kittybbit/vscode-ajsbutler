# sdd-change

## Purpose

Prepare or update SDD artifacts before implementing a non-trivial repository change.

## Steps

1. read `AGENTS.md`
2. read `package.json`
3. read the relevant files in `docs/specs/`
4. run the investigation-only phase before implementation changes:
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
7. record `TASKS.md` human approval evidence with `Status: Pending`
8. stop after the investigation and ask for clear human approval before
   editing runtime code, tests, generated artifacts, or configuration
9. after approval, record the approval text and approved scope in `TASKS.md`
10. enumerate all affected references and task the complete fix
11. implement in small meaningful blocks, checking compile/tests as you go
12. stop again for additional approval if required changes exceed the approved
    scope
13. run required validation before finishing

## Rules

- investigation-only phase permits investigation, SDD document updates, impact
  records, alternatives, and approval requests only
- approval-required phase must not edit runtime code, tests, generated
  artifacts, configuration, implementation branches, implementation commits,
  implementation refactors, or incidental fixes
- approval definition, approval evidence, and re-approval rules are centralized
  in `docs/specs/README.md` `Implementation Change Gate`
- implementation phase starts only when `TASKS.md` records `Status: Approved`
  and the approval text
- keep `engines.vscode` unchanged unless explicitly approved
- preserve desktop and web extension behavior
- prefer small vertical slices over broad rewrites
- document assumptions instead of hiding them
- keep KISS and YAGNI ahead of abstraction; avoid over-DRY process or code
- use a `docs/...` branch name only when the slice stays within the docs-only
  file set used by `.github/workflows/verify.yml`
- for docs-only changes, `pnpm run qlty` is required; add
  `pnpm run lint:md` when useful
