# Feature Tasks: Migrate Flow Graph And Navigation Boundaries

## Agent Brief

- Purpose: complete the normalized graph, exploration, and navigation boundary.
- Approved or active slice: none; planning and dependencies pending.
- Do not change graph visuals or interaction behavior.
- Do not move XyFlow or geometry state inward.
- Read first: `SPECS.md`, this file, and the three source use cases.
- Validate: docs intake with `rtk pnpm run qlty`.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: plan after normalized identity and unit-information contracts.

## Plan Status

- Status: Proposed
- Planning scope: build, explore, and navigate through one graph contract.
- Review status: implementation plan not created.
- Human approval: pending.
- Active implementation slice: none.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

## Implementation Slices

- Not yet decomposed; `sdd-plan-task` must preserve behavior in vertical slices.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: three behavior-rich use cases share identity and graph contracts.

## Feature Exit

- Definition of Done status: not started.
- Durable documentation updates: use cases only for corrected boundary facts.
- Open risks: hidden coupling between identity, layout, reveal, and viewer state.

## Validation

- [ ] Graph application and DTO tests.
- [ ] Expanded-layout, search, selection, reveal, and navigation regression tests.
- [ ] Desktop/web, serialization, qlty, and build checks.
