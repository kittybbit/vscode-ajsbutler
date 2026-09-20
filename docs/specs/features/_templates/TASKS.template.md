# Feature Tasks: {{Feature Name}}

## Agent Brief

- Purpose: {{one-sentence outcome}}
- Approved or active slice: {{slice and status}}
- Do not: {{scope prohibition}}
- Do not: {{scope prohibition}}
- Read first: `SPECS.md`, this file, and {{smallest required file or "none"}}.
- Read `TRACEABILITY.md` only when required for the active slice.
- Validate: {{smallest validation set}}.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: {{approval, implementation, replan, or feature exit}}.

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Only
  when this feature is selected does it own active branch implementation work.
- Other feature folders inherited from the base branch remain outside this
  feature's scope.
- Update `docs/specs/roadmap.md` only when unfinished repository-level future
  work, ordering, entry conditions, or unresolved product concerns change.
- Keep this file focused on implementation slices, approval, validation, risk,
  production readiness, and Feature Exit readiness. Do not retain historical
  logs, prior approvals, or long validation diaries once they stop being
  actionable.

## Plan Status

- Status: Proposed | Review Needed | Pending Approval | Approved | In Progress |
  Replan Required | Complete
- Planning scope:
- Review status:
- Human approval:
- Active implementation slice:

## Human Approval

- Status: Pending
- Approved at:
- Approved scope:
- Approved paths:

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Completion Approval

- Status: Pending | Approved
- Approved at:
- Approved scope:
- Approved paths:
- Implementation review verdict: Pending | Ready
- Commit status: Not eligible | Eligible | Committed

Completion Approval is a separate human gate after the independent
implementation review returns `Ready`. It authorizes only the exact completed
slice recorded here. The approval-committer must create the focused slice
commit before another slice or Feature Exit starts.

## Closure Approval

- Status: Pending | Approved
- Approved at:
- Approved scope:
- Approved paths:
- Feature Exit verdict: Pending | Close
- Commit status: Not eligible | Eligible | Committed

Closure Approval is a separate human gate after `feature-closer` returns
`Close`. It authorizes only the recorded durable-document propagation, closure
evidence, and selected feature-folder removal. The approval-committer must
create the focused closure commit before the feature is closed.

## Implementation Slices

### Slice 1: {{slice name}}

- Status: Proposed | Approved | In Progress | Complete | Blocked | Replan Required

#### Solution Shape Evidence

Record this compact evidence only for this slice and for every material new or
retained abstraction (exported or layer-crossing abstraction, port or adapter,
contract-bearing wrapper, lifecycle owner, or abstraction changing dependency
direction or semantic ownership; ordinary local helpers and type aliases are
excluded unless they play one of those roles):

- Semantic owner and package/layer for each material decision, invariant,
  translation, lifecycle, public name, contract, dependency, and applicable
  test:
- Material abstraction, concrete responsibility, and why it earns a boundary;
  assess ports, adapters, and retained application factories as separate cases:
- Public names, contracts, dependency direction, and tests where applicable:
- Relevant framework, library, platform, or established repository capability;
  custom-gap justification only when a custom mechanism is proposed:
- Automatic architecture evidence versus reviewer-only judgments:
- Code-slice qlty evidence: baseline and comparable final use the same
  non-mutating `rtk pnpm exec qlty check` and `rtk pnpm exec qlty smells` with
  the `--no-snippets` option in exact disposable snapshots. Record each
  finding's identity, explicit severity ordering, baseline/final severity,
  measured values, and whether higher or lower values are worse. A new finding
  or reliably mapped adverse movement is Finding/NG; only unmappable identity
  or direction is advisory; unchanged unrelated findings stay out of scope.
  Keep formatting-capable `rtk pnpm run qlty` as separate final validation in
  the disposable final snapshot. Apply the shared snapshot contract in
  `AGENTS.md`: use identical verified configuration and analyzed scope, keep
  qlty runtime artifacts snapshot-local, and after formatter changes rebuild
  and repeat the check/smells pair plus aggregate until stable.
- Replanning trigger check: owner/package, contract/dependency direction,
  framework-versus-custom decision, abstraction/responsibility, affected
  surface, risk, validation, or approval boundary:

- Scope:
- User / Domain Value:
- Cohesive Change Group:
- Acceptance:
- Validation:
- Production Readiness:
  - Failure mode:
  - JP1/AJS compatibility:
  - Large or malformed input risk:
  - Desktop/web impact:
  - README/docs impact:
  - CHANGELOG impact:
- Approval Boundary:
- Dependencies:
- Risks:
- Out of Scope:

## Traceability

- TRACEABILITY.md required: yes | no
- Reason:

## Feature Exit

- Definition of Done status:
- Durable documentation updates:
- Open risks:

## Validation

- [ ] Tests added or updated
- [ ] Update README or user documentation if user-facing behavior changes
- [ ] Run relevant validation

## Notes

- Keep feature requirements and boundary decisions in SPECS.md.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and feature exit readiness only.
