# Feature Tasks: SDD Slice Commit Gate

## Agent Brief

- Purpose: create one focused commit whenever an explicit SDD human approval
  gate fixes the next approved repository state.
- Approved or active slice: Slice 1 is proposed; the plan was revised to cover
  plan/replan, implementation completion, and Feature Exit approval commits.
- Do not: change runtime source, product behavior, release publishing, or
  automatic human approval.
- Do not: allow any reviewer or feature-closer to commit, stage unrelated work,
  or bypass the applicable human-approval boundary.
- Read first: `SPECS.md`, this file, `docs/specs/README.md`, and the current
  implementer/reviewer role definitions.
- Read `TRACEABILITY.md` when updating validation evidence.
- Validate: qlty, Markdown lint, diff checks, and static contract inspection.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: implement the revised approval-gated commit workflow.

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Only
  when this feature is selected does it own active branch implementation work.
- Other feature folders inherited from the base branch remain outside this
  feature's scope.
- Update `docs/specs/roadmap.md` only when unfinished repository-level work or
  ordering changes; this transient workflow feature does not add a roadmap
  item.
- Keep this file focused on implementation slices, approval, validation, risk,
  production readiness, and Feature Exit readiness.

## Plan Status

- Status: Approved
- Planning scope: one repository-workflow slice covering plan/replan approval,
  completion approval, closure approval, lifecycle routing, role handoffs, and
  one gate-aware approval committer.
- Review status: Replanned and reviewed; Ready for approval; no actionable
  findings
- Human approval: Approved in current conversation
- Active implementation slice: Slice 1

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: The complete one-slice SDD approval-gated commit
  configuration, including lifecycle SSOT, plan/completion/closure approval
  evidence, templates, all affected role handoffs, the dedicated
  approval-committer agent/skill, and policy validation; no runtime or release
  workflow changes.
- Approved paths:
  - `docs/specs/features/sdd-slice-commit-gate/SPECS.md`
  - `docs/specs/features/sdd-slice-commit-gate/TASKS.md`
  - `docs/specs/features/sdd-slice-commit-gate/TRACEABILITY.md`

Implementation must not start while Status is Pending. Only clear human
approval can change Status to Approved.

## Completion Approval

- Status: Pending
- Approved at:
- Approved scope:
- Approved paths:
- Implementation review verdict: Pending
- Commit status: Not eligible

Completion Approval is a separate human gate after implementation review. It
authorizes only the exact completed slice recorded here; it does not approve a
new slice or broader scope.

## Closure Approval

- Status: Pending
- Approved at:
- Approved scope:
- Approved paths:
- Feature Exit verdict: Pending
- Commit status: Not eligible

Closure Approval is a separate human gate after Feature Exit returns `Close`.
It authorizes only the recorded durable-document propagation, closure evidence,
and selected feature-folder removal.

## Implementation Slices

### Slice 1: Add approval-gated commits across the SDD lifecycle

- Status: Proposed
- Scope: update `docs/specs/README.md`, `AGENTS.md`, feature templates,
  plan/review/implementation/Feature Exit skills and role handoffs; add a
  gate-aware `approval-committer.toml` role and `sdd-commit-gate/SKILL.md`.
  The committer must support plan/replan approval, slice completion approval,
  and Feature Exit closure approval; verify the matching evidence and verdict,
  inspect the worktree, stage only approved files, run staged diff checks, and
  create one focused commit. It must stop on unrelated or out-of-scope dirty
  work.
- User / Domain Value: every human-approved SDD state becomes a focused,
  recoverable commit before the workflow advances, without premature or broad
  commits.
- Cohesive Change Group: SDD lifecycle SSOT, approval evidence templates, all
  lifecycle handoffs, the gate-aware committer role/skill, and their policy
  validation.
- Acceptance:
  - satisfies R1-R9 and AC1-AC6
  - plan/replan Human Approval is committed before implementation starts
  - Completion Approval is distinct and is required before a slice commit
  - Feature Exit Closure Approval is required before closure changes commit
  - reviewers and feature-closer remain unable to approve or commit
  - the committer stages only the current gate's approved files and blocks
    unrelated work
  - multi-slice routing returns to the next slice after its approval commit and
    reaches Feature Exit only after all slice commits
- Validation:
  - run `rtk pnpm run qlty`
  - run `rtk pnpm run lint:md`
  - run `rtk git diff --check`
  - inspect every changed role/skill contract for consistent handoffs and
    forbidden pre-approval commit paths
- Production Readiness:
  - Failure mode: missing approval, missing review verdict, dirty unrelated
    work, or staged scope mismatch causes a stop without commit.
  - JP1/AJS compatibility: not applicable; runtime and definition behavior are
    unchanged.
  - Large or malformed input risk: not applicable; no product data is read or
    transformed.
  - Desktop/web impact: none; extension hosts are not changed.
  - README/docs impact: SDD SSOT and templates are updated; user docs are not.
  - CHANGELOG impact: none; this is repository workflow configuration.
- Approval Boundary: repository SDD policy, agent role contracts, skill
  procedure, and feature templates only. No runtime/test/configuration outside
  the SDD workflow surface.
- Dependencies: existing plan/review/implementation roles and the current
  Completion Approval lifecycle gate.
- Risks: an overly broad committer could stage unrelated changes; exact scope
  verification and a hard stop are mandatory.
- Out of Scope: automatic human approval, runtime changes, release/push/PR
  operations, amend/reset/force-push, and general Git automation.

## Traceability

- TRACEABILITY.md required: yes
- Reason: this feature changes repository policy, approval evidence, role
  handoffs, and a commit-capable procedure that must be checked together.

## Feature Exit

- Definition of Done status: Not started
- Durable documentation updates: SDD SSOT, templates, and role contracts are
  the durable workflow owners.
- Open risks: none beyond the planned gate-specific scope verification.

## Validation

- [ ] Tests added or updated
- [ ] Update README or user documentation if user-facing behavior changes
- [ ] Run relevant validation

## Notes

- The implementation commit for this feature must itself follow the new gate
  once the configuration is in place. Plan approval, completion approval, and
  closure approval are separate sources of authorization for their respective
  commits.
