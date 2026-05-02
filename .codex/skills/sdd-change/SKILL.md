---
name: sdd-change
description: Use when preparing or updating SDD artifacts for a non-trivial repository change in vscode-ajsbutler. Enforces impact investigation, human approval before implementation, scoped approval evidence, and validation rules.
---

# sdd-change

## Purpose

Prepare or update SDD artifacts before implementing a non-trivial repository change.
This is the single change-workflow skill for the repository. Former specialized
skills are represented here only as supplemental checks; they do not bypass the
SDD investigation, approval, evidence, implementation, and validation flow.

## Steps

1. read `AGENTS.md`
2. read `package.json`
3. read the relevant files in `docs/specs/`
4. run the investigation-only phase before implementation changes:
   - use a high-accuracy model for planning, impact investigation, design
     decisions, and pre-approval review when model selection is available
   - search affected functions, classes, components, and commands
   - follow `docs/specs/README.md` semantic code navigation guidance when
     Serena or an equivalent tool is available
   - use Serena selectively: targeted symbol lookup, direct references,
     call-site and dependency impact, then broad exploration only if
     uncertainty remains
   - list affected files, features, tests, docs, and breaking-change risk
   - when behavior scenarios exist, list changed, added, or removed scenarios
     and affected tests
   - check relevant supplemental perspectives below without treating them as
     separate approval paths
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

## Supplemental Checks

Use these checks during investigation and planning when they match the change.
Keep the notes short and focused on impact, decisions, and validation.

### Repository Investigation

- identify desktop and web entry points affected by the change
- identify parser-related modules and generated grammar boundaries
- identify direct VS Code API boundaries and adapter locations
- apply semantic code navigation checks from `docs/specs/README.md` when
  available
- avoid broad semantic exploration until target symbols or references are known
- summarize architectural risks, test impact, and compatibility impact

### Planning

- state scope and non-goals
- name affected layers and ownership boundaries
- record assumptions, key decisions, and approval-sensitive ambiguity
- define acceptance criteria and a concrete test plan
- note rollback or recovery steps when behavior or compatibility risk exists

### Parser Changes

- keep grammar-generated boundaries explicit
- do not leak parser internals into UI components
- add or update golden tests when parser behavior changes
- verify normalization behavior and malformed-input behavior

### VS Code Extension Changes

- confirm desktop impact, web impact, or both
- keep direct `vscode` API usage near extension or presentation boundaries
- check browser build risk and Node-only runtime assumptions
- avoid minimum VS Code version drift unless explicitly approved

### Webview Changes

- consume DTOs or view models, not parser internals
- keep UI-library-specific types in presentation code
- keep parse, business, and CSV logic out of components

### Architecture Refactors

- define the use case before moving code
- identify mixed responsibilities and move adapters outward
- preserve behavior, keep the slice reviewable, and add focused tests
- summarize remaining technical debt instead of broadening the refactor

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
- implementation inside the approved scope may use medium- or lower-cost models
  when model selection is available
- if implementation reveals a specification change, design decision, destructive
  change, or out-of-scope edit, stop and return to high-accuracy investigation
  and re-approval
- Serena is a supplemental aid for impact and reference checks; it does not
  replace manual analysis, SDD records, human approval, tests, or validation
- do not treat Serena-only results as proof that a change is safe
- do not repeat the same semantic search unless a new question requires it
- Codex, GitHub Copilot, or other coding assistants may help, but changing the
  agent or model never changes the SDD gate
- Copilot suggestions must be checked against approved `SPECS.md`, `TASKS.md`,
  and approved scope before adoption; reject suggestions outside scope unless
  the work returns to investigation and re-approval
- keep `engines.vscode` unchanged unless explicitly approved
- preserve desktop and web extension behavior
- prefer small vertical slices over broad rewrites
- document assumptions instead of hiding them
- keep KISS and YAGNI ahead of abstraction; avoid over-DRY process or code
- use a `docs/...` branch name only when the slice stays within the docs-only
  file set used by `.github/workflows/verify.yml`
- run validation through `rtk` by default
- for docs-only changes, `rtk pnpm run qlty` is required; add
  `rtk pnpm run lint:md` when useful
- `rtk` reduces cost and output volume; it is not a reason to skip validation
