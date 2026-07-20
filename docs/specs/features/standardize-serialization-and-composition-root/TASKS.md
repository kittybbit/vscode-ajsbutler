# Feature Tasks: Standardize Serialization And Composition Root

## Agent Brief

- Purpose: standardize plain DTO transport and bootstrap-only composition.
- Approved or active slice: none; planning and dependencies pending.
- Do not change message semantics, activation, lifecycle, or viewer behavior.
- Do not introduce a service container or domain-object reconstruction.
- Read first: `SPECS.md`, this file, and inventory traceability.
- Validate: docs intake with `rtk pnpm run qlty`.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: plan after upstream DTO and adapter boundaries stabilize.

## Plan Status

- Status: Proposed
- Planning scope: neutral payloads, JSON transport, composition, and lifecycle.
- Review status: implementation plan not created.
- Human approval: pending.
- Active implementation slice: none.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

## Implementation Slices

- Not yet decomposed; `sdd-plan-task` must separate transport and composition
  work where needed while preserving one outer-boundary outcome.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: multiple viewers, hosts, adapters, and lifecycle paths cross this
  boundary.

## Feature Exit

- Definition of Done status: not started.
- Durable documentation updates: final architecture wording remains owned by
  the final enforcement feature.
- Open risks: payload drift, browser bundle failures, activation/disposal leaks.

## Validation

- [ ] JSON round-trip and message-contract tests.
- [ ] Composition, lifecycle, desktop/web integration, qlty, and build checks.
