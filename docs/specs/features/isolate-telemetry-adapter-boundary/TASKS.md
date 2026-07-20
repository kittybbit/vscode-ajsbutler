# Feature Tasks: Isolate Telemetry Adapter Boundary

## Agent Brief

- Purpose: isolate telemetry SDK, schema translation, construction, and failure.
- Approved or active slice: none; planning and inventory pending.
- Do not add events/properties or weaken privacy.
- Do not make telemetry required for any use case.
- Read first: `SPECS.md`, this file, and architecture/roadmap telemetry sections.
- Validate: docs intake with `rtk pnpm run qlty`.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: plan after telemetry dependency inventory.

## Plan Status

- Status: Proposed
- Planning scope: port/schema, SDK adapter, bootstrap, and callers.
- Review status: implementation plan not created.
- Human approval: pending.
- Active implementation slice: none.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

## Implementation Slices

- Not yet decomposed; use `sdd-plan-task` after inventory.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: cross-cutting callers and privacy/failure requirements need explicit
  mapping.

## Feature Exit

- Definition of Done status: not started.
- Durable documentation updates: architecture only at final enforcement exit.
- Open risks: event drift, lost no-op behavior, or accidental sensitive data.

## Validation

- [ ] Port/adapter, event-schema, failure-isolation, and privacy tests.
- [ ] Desktop/web, architecture dependency, qlty, and build checks.
