# sdd-change

## Purpose

Prepare or update SDD artifacts before implementing a non-trivial repository change.

## Steps

1. read `AGENTS.md`
2. read `package.json`
3. read the relevant files in `docs/specs/`
4. update or create the matching use-case spec in
   `docs/requirements/use-cases/`
5. update `PLANS.md` with assumptions, scope, and acceptance criteria
6. summarize compatibility and layering risks before editing runtime code

## Rules

- keep `engines.vscode` unchanged unless explicitly approved
- preserve desktop and web extension behavior
- prefer small vertical slices over broad rewrites
- document assumptions instead of hiding them
- use a `docs/...` branch name only when the slice stays within the docs-only
  file set used by `.github/workflows/verify.yml`
