# Feature Tasks: Migrate Unit Information Boundaries

## Agent Brief

- Purpose: complete the normalized application boundary for list, CSV, and unit
  definition.
- Approved or active slice: none; planning and dependencies pending.
- Do not change visible content, order, formatting, or interaction behavior.
- Do not absorb flow-graph or navigation migration.
- Read first: `SPECS.md`, this file, and the three source use cases.
- Validate: docs intake with `rtk pnpm run qlty`.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: plan after normalized-domain completion.

## Plan Status

- Status: Proposed
- Planning scope: one cohesive unit-information projection pipeline.
- Review status: implementation plan not created.
- Human approval: pending.
- Active implementation slice: none.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

## Implementation Slices

- Not yet decomposed; `sdd-plan-task` must keep each approval slice vertically
  reviewable while preserving the shared contract.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: three user-visible use cases and their compatibility evidence map to
  one shared boundary.

## Feature Exit

- Definition of Done status: not started.
- Durable documentation updates: source use cases only if boundary statements
  become inaccurate.
- Open risks: subtle CSV/table formatting or command-text regressions.

## Validation

- [ ] Application use-case and DTO mapping tests.
- [ ] CSV and unit-definition regression tests.
- [ ] Desktop/web, serialization, large/malformed input, qlty, and build checks.
