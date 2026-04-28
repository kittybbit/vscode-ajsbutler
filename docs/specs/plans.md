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
  The next active candidate is the job end-judgment `wth` key mapping, because
  the current factory intentionally preserves a legacy `wth` to `wt` lookup
  that conflicts with the JP1/AJS3 v13 end-judgment parameter name.
- Read-only JP1/AJS WebAPI import stays beta until real JP1/AJS3 environment
  smoke verification and enough user feedback are recorded. Beta exit is
  feedback-gated and is not the next active implementation priority.
- Desktop and web compatibility must stay explicit whenever bootstrap,
  preview, parsing, shared adapters, or runtime behavior change.

## Next Priority Tasks

1. Continue category-level parameter parsing alignment by correcting the
   end-judgment `wth` lookup to read the `wth` parameter instead of the
   schedule-rule `wt` parameter, after approval.
2. Keep WebAPI import beta feedback and real-environment smoke evidence
   tracked, but defer beta exit until feedback is sufficient.
3. Keep compatibility risk visible for every shared or extension-runtime
   change.

## Current Branch Plan

- Branch: `codex/align-wth-end-judgment`
- Objective: continue JP1/AJS3 version 13 parameter alignment with a focused
  job end-judgment correction for `wth`.
- Status: implemented locally; validation completed.
- Scope: update the `ParamFactory.wth` builder to read the raw `wth`
  parameter; preserve omitted `wth` as undefined; preserve schedule-rule `wt`
  behavior through `ruleParameterBuilders.wt`; update focused regression
  evidence.
- Out of scope: parser grammar changes, command generation, byte-length or
  numeric range validation, invalid `jd` / `abr` pairing diagnostics, retry
  range diagnostics, and changing unit-list normalized raw projection.
- Impact summary: behavior changes only for wrappers that expose `wth`
  (`J`, `Cj`, `Cpj`, `Fxj`, `Htpj`, `Qj`, and recovery variants). Existing
  callers should stop seeing schedule-rule `wt` as an end-judgment threshold.
- Risks and assumptions: this intentionally breaks the legacy `wth` to `wt`
  mapping test. The risk is low-to-medium because the current mapping is
  documented as legacy behavior, but any downstream consumer depending on that
  compatibility quirk will observe a changed value.

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
- 2026-04-29: `npm test`
- 2026-04-29: `npm run test:web`
- 2026-04-29: `npm run build` completed with existing webpack asset-size
  warnings
- 2026-04-29: `pnpm run qlty`
- 2026-04-29: `pnpm run lint:md`
- 2026-04-29: `npm test`
- 2026-04-29: `pnpm run qlty`
- 2026-04-29: `npm run test:web`
- 2026-04-29: `npm run build` completed with existing webpack asset-size
  warnings
