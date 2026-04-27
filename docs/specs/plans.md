# PLANS.md

## Purpose

This is the branch-level SDD planning index. Feature-local details live under
`docs/specs/features/<feature>/`; repository-level behavior contracts live
under `docs/requirements/use-cases/`.

## Current Decisions

- List search stays presentation-local until another non-table consumer needs
  the same matching semantics.
- Parameter-reference alignment should proceed in small JP1/AJS v13 slices
  with explicit manual coverage. For each parameter category, verify value
  parsing against the official format before claiming the category aligned.
  The active category is the schedule-rule parameter family: `sd`, `ln`, `st`,
  `cy`, `sh`, `shd`, `cftd`, `sy`, `ey`, `wc`, and `wt`.
- Read-only JP1/AJS WebAPI import stays beta until real JP1/AJS3 environment
  smoke verification and enough user feedback are recorded. Beta exit is
  feedback-gated and is not the next active implementation priority.
- Desktop and web compatibility must stay explicit whenever bootstrap,
  preview, parsing, shared adapters, or runtime behavior change.

## Next Priority Tasks

1. Continue category-level parameter parsing alignment. Use the schedule-rule
   helper boundary as the first pattern, then apply the same audit/refactor
   workflow to other parameter categories instead of checking isolated keys one
   by one.
2. Keep WebAPI import beta feedback and real-environment smoke evidence
   tracked, but defer beta exit until feedback is sufficient.
3. Keep compatibility risk visible for every shared or extension-runtime
   change.

## Wrapper Semantics Matrix

- Capability interface + helper:
  use for JP1/AJS concepts that span multiple wrapper families, such as
  wait-state and priority behavior.
- Shared helper reused by wrapper and normalized model:
  use when the same rule must stay identical across wrapper and normalized DTO
  paths, such as relation parsing, layout, recovery, depth, and encoded
  strings.
- Unit-local wrapper semantics:
  keep behavior on the wrapper when it belongs to one unit family, such as `G`
  planning behavior or `N` schedule ownership.
- `UnitEntity` core responsibilities:
  keep constructor-bound identity, tree mechanics, raw metadata, and common
  JP1 getters; avoid debug helpers, dead compatibility APIs, or
  wrapper-specific business rules.

## Default Workflow

1. Use a dedicated branch. Reserve `docs/...` branches for docs-only changes.
2. Read the relevant documents in `docs/specs/`.
3. Update `docs/requirements/use-cases/` only when the durable behavior
   contract changes.
4. Update or create feature docs under `docs/specs/features/<feature>/` only
   when implementation requirements, boundary decisions, or active tasks need
   tracking.
5. Update feature `TASKS.md`, this file, and `roadmap.md` in the same commit
   when task completion changes priorities or repository sequencing.
6. For code changes, run `pnpm run qlty`, `pnpm test`,
   `pnpm run test:web`, and `pnpm run build`.
7. For docs-only changes, run `pnpm run lint:md`.
