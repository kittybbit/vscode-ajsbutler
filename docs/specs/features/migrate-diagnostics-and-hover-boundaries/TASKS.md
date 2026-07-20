# Feature Tasks: Migrate Diagnostics And Hover Boundaries

## Agent Brief

- Purpose: complete host-neutral diagnostic and hover application boundaries.
- Approved or active slice: none; planning and dependencies pending.
- Do not change messages, positions, severity, localization, or rule coverage.
- Do not expose VS Code or parser types in application DTOs.
- Read first: `SPECS.md`, this file, and the two source use cases.
- Validate: docs intake with `rtk pnpm run qlty`.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: plan after parser/domain boundaries are stable.

## Plan Status

- Status: Proposed
- Planning scope: parser evidence, domain rules, application DTOs, VS Code adapters.
- Review status: implementation plan not created.
- Human approval: pending.
- Active implementation slice: none.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

## Implementation Slices

- Not yet decomposed; use `sdd-plan-task` for reviewable vertical slices.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: user-visible messages, positions, localization, and rule behavior must
  remain traceable.

## Feature Exit

- Definition of Done status: not started.
- Durable documentation updates: use cases only if boundary facts change.
- Open risks: source-position or localization regressions.

## Validation

- [ ] Application diagnostic/hover and DTO tests.
- [ ] VS Code adapter, localization, and malformed-input regression tests.
- [ ] Desktop/web, qlty, and build checks.
