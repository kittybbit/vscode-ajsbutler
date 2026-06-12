# Qlty-Driven Architecture Refactoring Tasks

## Current Task

- Status: Proposed
- Scope:
  decide whether another qlty-driven architecture refactoring slice should be
  proposed.
- Acceptance:
  do not continue Qlty-driven refactoring for shape-only smells. Prefer a
  small behavior-preserving slice only when Qlty findings map to a coherent
  responsibility, boundary, application use case, adapter concern, or
  maintainability risk.
- Validation:
  for the next code slice, run `rtk pnpm run qlty`, `rtk pnpm test`,
  `rtk pnpm run test:web`, and `rtk pnpm run build`.

## Human Approval

- Status: Pending
- Approved at:
  none
- Approved scope:
  none

Implementation must not start while Status is Pending. Only clear human
approval can change Status from Pending to Approved.

## Decision Notes

- Recheck `rtk qlty metrics --sort complexity` and `rtk qlty smells` before
  selecting any next slice.
- After Slice-6-F, `rtk qlty metrics --sort complexity` reports
  `src/domain/models/parameters/parameterHelpers.ts` at complexity 30 and
  `src/domain/models/parameters/parameterScheduleRuleHelpers.ts` at complexity 11.
- Remaining reported DTO and domain-unit duplication smells should stay
  candidate signals only. Do not extract shared code from them unless a future
  slice identifies a stronger shared JP1/AJS business concept, use-case need,
  adapter boundary, or maintainability risk than shape similarity alone.
- `docs/requirements/use-cases/uc-build-flow-graph.md` already carries the
  durable expanded-flow behavior contract preserved by recent layout slices.
- `docs/requirements/use-cases/uc-interpret-jp1-parameters.md` already carries
  the durable behavior contract for context-sensitive parameter and
  schedule-rule interpretation.

## Use-Case Back-Propagation

- No use-case update is currently pending.
