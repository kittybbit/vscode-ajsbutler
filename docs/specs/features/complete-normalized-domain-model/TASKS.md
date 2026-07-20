# Feature Tasks: Complete Normalized Domain Model

## Agent Brief

- Purpose: complete the stable normalized domain model and shared rules.
- Approved or active slice: none; dependencies and planning pending.
- Do not add new JP1/AJS semantics or absorb presentation formatting.
- Do not migrate consumer DTOs in this feature.
- Read first: `SPECS.md`, this file, and relevant domain-rule/use-case files.
- Validate: docs intake with `rtk pnpm run qlty`.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: plan after parser and wrapper inventory decisions are known.

## Plan Status

- Status: Proposed
- Planning scope: normalized concepts, shared rules, and the single normalizer.
- Review status: implementation plan not created.
- Human approval: pending.
- Active implementation slice: none.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

## Implementation Slices

- Not yet decomposed; `sdd-plan-task` must keep rule families reviewable.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: shared domain requirements feed multiple use cases and validations.

## Feature Exit

- Definition of Done status: not started.
- Durable documentation updates: domain rules only if established contracts are
  inaccurate; final architecture wording belongs to the final feature.
- Open risks: accidental behavior changes while reclassifying wrapper semantics.

## Validation

- [ ] Domain and normalization tests.
- [ ] Identity, relation, schedule, and parameter compatibility tests.
- [ ] Large/malformed input and dependency validation.
