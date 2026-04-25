# PLANS.md

## Purpose

This is the branch-level SDD planning index. Feature-local details live under
`docs/specs/features/<feature>/`; repository-level behavior contracts live
under `docs/requirements/use-cases/`.

## Branch Status

### Completed In This Branch

- Core application slices are implemented and covered:
  build unit list, build unit list view, export CSV, normalize AJS document,
  build flow graph, show unit definition, editor feedback, and telemetry.
- Wrapper and normalization cleanup is complete enough for current use:
  reusable cross-unit semantics moved to helpers or capability interfaces,
  while unit-local JP1/AJS behavior remains on the owning wrappers.
- Large internal refactor slices have been compressed out of
  `docs/specs/features/`:
  `buildUnitListView.ts` decomposition, `ParameterFactory` decomposition, and
  wrapper-class duplication reduction are now treated as completed roadmap
  history instead of active feature folders.
- Runtime-boundary modernization delivered the important behavior-preserving
  slices:
  stale `flatted` assumptions were removed, package management moved to pinned
  `pnpm`, webview bundles were split by viewer, and bundle-size experiments are
  documented as evidence rather than active pressure.
- Flow-view usability work for `1.13.0` is release-ready:
  visual refresh, nested expansion, current-scope search refinement, and
  list/flow bridge navigation are documented and validated.
- JP1/AJS v13 command-generation alignment has a first supported seam:
  `ajsshow` and `ajsprint` generation lives in an application helper, and the
  show-unit-definition command builder is localized through existing message
  resources.
- Feature-local task lists were tightened so open tasks represent actionable
  work rather than standing policy reminders.

### Current Decisions

- List search stays presentation-local until another non-table consumer needs
  the same matching semantics. The new search-domain use case is a deferred
  contract, not an implementation mandate.
- Bundle-size work is deferred unless a clearer reduction seam or stronger
  product need appears.
- Parameter-reference alignment should proceed in small JP1/AJS v13 slices
  with explicit manual coverage.

### Next Priority Tasks

1. Align parameter parsing with JP1/Automatic Job Management System 3 version
   13 reference manuals when a behavior-changing parameter slice needs
   per-key coverage beyond the current audit summary.
2. Define a read-only JP1/AJS WebAPI import boundary with clear application
   and infrastructure responsibilities.
3. Extend list-view search on the current presentation path so parameter key
   and value queries complement existing rendered-row partial matching.
4. Keep desktop and web compatibility explicit whenever bootstrap, preview,
   parsing, shared adapters, or runtime behavior change.

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
  JP1 getters; avoid debug helpers, dead compatibility APIs, or wrapper-specific
  business rules.

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
