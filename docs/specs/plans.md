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

## Current Branch Plan

- Branch: `codex/align-transfer-operation-parameters`
- Objective: continue JP1/AJS3 version 13 parameter alignment by extracting the
  transfer-operation `top1` to `top4` default rule into a category-specific
  domain helper seam.
- Scope: update the SDD plan for the transfer-operation category, preserve
  current explicit and derived `topN` values, and add focused regression
  evidence for source/destination-driven defaults.
- Out of scope: parser grammar changes, byte-length validation, macro-variable
  validation, custom PC job invalidation, QUEUE job transfer-file behavior, and
  UI changes.
- Impact summary: domain parameter helper ownership changes only. User-visible
  parser, list, flow, CSV, diagnostics, hover, telemetry, desktop extension,
  and web extension behavior should remain unchanged.
- Risks and assumptions: treat the JP1/AJS3 v13 UNIX/PC job and UNIX/PC custom
  job references as the normative source for `topN` defaults; keep invalid
  value handling deferred until a diagnostics/warnings policy is chosen.

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
