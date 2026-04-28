# PLANS.md

## Purpose

This is the branch-level SDD planning index. Feature-local details live under
`docs/specs/features/<feature>/`; repository-level behavior contracts live
under `docs/requirements/use-cases/`.

Clear branch-specific notes when starting a new branch. Keep stable workflow
rules in `docs/specs/README.md`, not in this file.

## Current Decisions

- List search stays presentation-local until another non-table consumer needs
  the same matching semantics.
- Parameter-reference alignment should proceed in small JP1/AJS v13 slices
  with explicit manual coverage. For each parameter category, verify value
  parsing against the official format before claiming the category aligned.
  The next active candidate is the JP1 event sending job arrival-check family:
  `evssv`, `evsrt`, `evspl`, and `evsrc`.
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

## Current Branch Plan

- Branch: `codex/align-event-send-job-evsrc-default`
- Objective: continue JP1/AJS3 version 13 parameter alignment with the next
  category-level candidate for JP1 event sending job arrival-check defaults.
- Status: implemented locally; validation completed.
- Scope: preserve explicit JP1 event sending job `evssv`, `evsrt`, `evspl`,
  and `evsrc` values; keep existing `evssv=no`, `evsrt=n`, and `evspl=10`
  defaults; change omitted `evsrc` for `Evsj` / `Revsj` from the previous
  generic `0` fallback to the manual default `10`.
- Out of scope: parser grammar changes, command generation, byte-length
  validation, numeric range validation, event arrival runtime behavior,
  `evhst` requiredness diagnostics, and broader event receiving job semantics.
- Impact summary: domain parameter default behavior changes only for omitted
  `evsrc` on `Evsj` / `Revsj`. Unit-list projection remains raw normalized
  key/value projection and does not synthesize omitted defaults.
- Risks and assumptions: the approval-sensitive reference boundary is the
  JP1/AJS3 v13 JP1 event sending job definition stating omitted `evsrc` is
  assumed as `10`. A focused helper seam is preferred unless the complete
  reference impact check proves a global `DEFAULTS.Evsrc` change is safe.

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

## Branch Validation

- docs-only changes: `pnpm run qlty`; add `pnpm run lint:md` when markdown
  structure or links need focused validation
- code changes: follow `docs/specs/README.md`

Current branch checks:

- 2026-04-27: `npm run qlty`
- 2026-04-27: `npm test`
- 2026-04-27: `npm run test:web`
- 2026-04-27: `npm run build`
- 2026-04-28: `npm test`
- 2026-04-28: `npm run qlty`
- 2026-04-28: `npm run test:web`
- 2026-04-28: `npm run build`
- 2026-04-28: `pnpm run lint:md`
- 2026-04-28: `npm test`
- 2026-04-28: `npm run test:web`
- 2026-04-28: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-04-28: `pnpm run qlty` passed after excluding `.serena/` from Qlty
