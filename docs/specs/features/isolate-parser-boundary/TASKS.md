# Feature Tasks: Isolate Parser Boundary

## Agent Brief

- Purpose: isolate parser mechanics and raw data behind normalization.
- Approved or active slice: none; ready for planning.
- Do not change grammar or JP1/AJS interpretation.
- Do not fill normalized-model gaps with presentation-facing raw fields.
- Read first: `SPECS.md`, this file, and the owned raw/parser allowances.
- Validate: docs intake with `rtk pnpm run qlty`.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: create the full implementation-slice plan with `sdd-plan-task`.

## Plan Status

- Status: Proposed
- Planning scope: parser port, raw model isolation, and normalization seam.
- Review status: implementation plan not created.
- Human approval: pending.
- Active implementation slice: none.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

## Implementation Slices

- Not yet decomposed; use `sdd-plan-task` with the completed guardrail evidence.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: parser compatibility and all downstream use cases depend on this seam.

## Feature Exit

- Definition of Done status: not started.
- Durable documentation updates: parser boundary in `architecture.md` at final
  architecture exit, not during intake.
- Open risks: raw source evidence or error behavior could be lost during mapping.

## Validation

- [ ] Parser golden and normalization tests.
- [ ] Architecture dependency and raw-reference scans.
- [ ] Desktop/web tests and build selected by the approved plan.
