# SPECS: sdd-efficient-quality-governance

## Purpose

Make SDD work efficient and quality-aware: keep the minimum actionable context
at the top of feature documents, and require proportionate Qlty smell and
metric evidence, validation, and review without duplicating the SDD SSOT.

## Origin

- Source: SDD maturity review follow-up, 2026-07-11.
- Branch plan: `docs/specs/plans.md`.
- Implementation-slice plan: `TASKS.md`.
- JP1/AJS source reference: not applicable; this feature changes development
  process documentation only.

## Requirements

- `docs/specs/README.md` remains the sole authority for SDD document roles,
  approval gates, feature exit, and validation policy.
- New feature templates place concise, decision-oriented context in
  `SPECS.md` and a roughly ten-line `Agent Brief` in `TASKS.md`; a separate
  feature `CONTEXT.md` is not used.
- `TRACEABILITY.md` templates use a small mapping table containing only the
  required requirement-to-validation fields.
- Each SDD skill defines its phase-specific minimum reading set and links to
  the SSOT instead of repeating document-role policy.
- Code-slice planning and implementation record the appropriate Qlty evidence:
  `qlty check` remains a required validation; new smell findings must be fixed
  or carried as an approved, actionable follow-up; metric movement is a review
  signal, not an automatic merge threshold.
- Validation follows a risk-based ladder: run the nearest check first, add only
  checks justified by the changed surface, and never repeat an unchanged check
  merely to satisfy a stage label.
- Plan review remains the pre-approval scope gate; implementation has one
  integrated final review, with an additional independent review only when a
  stated high-risk condition or a discovered concern justifies it.
- Use subagents only for materially useful, independent investigation, review,
  or tightly scoped approved mechanical work. The coordinating agent retains
  SDD artifacts, approval evidence, scope/design decisions, integration, and
  final validation; delegates return concise evidence, risks, unknowns, and a
  recommended next action rather than raw transcripts or decisions.
- A lightweight, non-CI structure check detects absent Agent Briefs and
  forbidden feature `CONTEXT.md` files.

## Architecture

- Domain: none.
- Application: none.
- Presentation: none.
- Infrastructure: none.

## Compatibility

- VS Code compatibility: no extension runtime, API, or configuration change.
- Desktop and web extension compatibility: unchanged.

## Acceptance Criteria

- A new feature can start from the templates without creating `CONTEXT.md`.
- An agent can identify a feature's purpose, approval state, prohibitions, and
  smallest reading set from the beginning of `SPECS.md` and `TASKS.md`.
- Required traceability can be recorded in one table without narrative
  duplication.
- SDD skills name only phase-relevant inputs and quality evidence.
- A code-slice plan can distinguish an actionable new smell from a metric-only
  signal without treating legacy metrics as a blanket failure.
- A slice can select its tests, web checks, build, and review depth from its
  changed surface and documented risks, without weakening required evidence.
- A slice can delegate bounded independent work without broad exploration,
  concurrent edit conflicts, or loss of coordinating-agent accountability.
- The documented lightweight check succeeds for the repository's active
  feature docs.

## Non-Goals

- Alter extension behavior, tests, configuration, CI, or Qlty thresholds.
- Close the active WebAPI import feature without its Feature Exit evidence and
  human approval.
- Rewrite existing feature-specific technical traceability notes.
- Make metrics-only movement a mandatory refactor or merge blocker.
- Remove plan review, human approval, or Feature Exit review.
- Delegate human approval, SDD status updates, scope/design decisions, final
  integration, or final validation to a subagent.

## Open Questions

- A later feature may add automated metric thresholds only after a stable
  baseline and a repository-specific decision justify them.
