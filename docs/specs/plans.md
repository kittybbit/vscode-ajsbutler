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
  The next active candidate is the QUEUE job transfer-file family: `ts1` to
  `ts4` and `td1` to `td4`, with explicit no-`topN` behavior for `Qj` / `Rq`.
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

- Branch: `codex/align-queue-transfer-files`
- Objective: continue JP1/AJS3 version 13 parameter alignment with the next
  non-schedule family: QUEUE job transfer-file parameters.
- Status: implemented locally; validation completed.
- Scope: preserve explicit QUEUE job `ts1` to `ts4` and `td1` to `td4` values
  for `Qj` / `Rq`; add focused regression evidence that `top1` to `top4` are
  not exposed or derived for QUEUE jobs.
- Out of scope: parser grammar changes, command generation, byte-length
  validation, macro-variable validation, transfer-file runtime behavior,
  adding `topN` getters to `Qj` / `Rq`, and changing unit-list group 15 raw
  projection semantics.
- Impact summary: behavior should remain unchanged if implemented as focused
  regression evidence. The key boundary is preventing the existing UNIX/PC
  `topN` default helper from being broadened to QUEUE jobs.
- Risks and assumptions: JP1/AJS3 version 13 QUEUE job definition lists `tsN`
  and `tdN` but not `topN`; related UNIX/PC job definitions list all three.
  Treating QUEUE as no-`topN` is the approval-sensitive distinction.

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
