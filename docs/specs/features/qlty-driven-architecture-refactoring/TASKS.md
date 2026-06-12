# Qlty-Driven Architecture Refactoring Tasks

## Current Task

- Status: Proposed
- Scope:
  select the next candidate only if it has meaningful responsibility,
  boundary, or use-case value.
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

- Rechecked `rtk qlty metrics --sort complexity` and `rtk qlty smells`.
- Slice-6-D removed the `expandedFlowGraphPanelIntrusion.ts` "function with
  many parameters" smells while preserving the public expanded-flow layout
  contract.
- Remaining reported DTO and domain-unit duplication smells should stay
  candidate signals only. Do not extract shared code from them unless a future
  slice identifies a stronger shared JP1/AJS business concept, use-case need,
  adapter boundary, or maintainability risk than shape similarity alone.
- `docs/requirements/use-cases/uc-build-flow-graph.md` already carries the
  durable expanded-flow behavior contract preserved by recent layout slices.

## Use-Case Back-Propagation

- No new use-case update is expected. Slice-6-D is intended to preserve the
  existing expanded-flow panel intrusion behavior already covered by
  `uc-build-flow-graph.md`.
