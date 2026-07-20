# Feature Tasks: Remove Legacy And Enforce Clean Architecture

## Agent Brief

- Purpose: achieve the final zero-legacy, zero-exception architecture invariant.
- Approved or active slice: none; blocked on all predecessor features.
- Do not remove code until replacements and zero consumers are proven.
- Do not defer an unmet migration criterion or rewrite docs ahead of evidence.
- Read first: `SPECS.md`, this file, the rule catalog, the exact allowlist, and
  predecessor traceability.
- Validate: docs intake with `rtk pnpm run qlty`.
- Approval policy and document roles: `docs/specs/README.md`.
- Next decision: plan only after predecessor feature exits are evidenced.

## Plan Status

- Status: Proposed
- Planning scope: legacy deletion, final rules, CI evidence, durable docs, exit.
- Review status: implementation plan not created.
- Human approval: pending.
- Active implementation slice: none.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

## Implementation Slices

- Not yet decomposed; `sdd-plan-task` must verify predecessor readiness before
  proposing deletion or final documentation slices.

## Traceability

- `TRACEABILITY.md` required: yes.
- Reason: final enforcement must close every architecture issue and all eleven
  use-case migration mappings.

## Feature Exit

- Definition of Done status: blocked on predecessor features.
- Durable documentation updates: final `architecture.md`, `AGENTS.md`, roadmap,
  plans, and qualifying use-case/domain-rule corrections.
- Open risks: premature deletion or a hidden compatibility/host regression.

## Validation

- [ ] Full desktop tests, qlty, web tests, build, Markdown lint, and diff check.
- [ ] Architecture violation fixtures and zero-reference/zero-allowlist scans.
- [ ] Production readiness and Feature Exit review across all workflows.
