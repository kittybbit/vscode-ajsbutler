# Feature Specification: SDD Approval-Gated Commits

## Purpose

Make every explicit SDD human approval boundary a commit boundary. The
approval commits the plan or completed change that was just approved, and the
next lifecycle stage starts from that committed state.

## Minimal Context

- Current decision: add approval-gated commits to the repository-native SDD
  workflow. Plan or replan approval commits the approved planning package;
  completion approval commits the completed implementation slice; and closure
  approval commits durable Feature Exit propagation and temporary-feature
  removal.
- Feature kind: transient branch feature for repository SDD configuration.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` when validating
  the implementation slice.
- No JP1/AJS behavior or extension runtime is in scope.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Source: user-requested workflow gap identified after the first completed
  slice commit.
- Repository policy: `AGENTS.md`, `docs/specs/README.md`,
  `.codex/agents/implementer.toml`, and
  `.codex/agents/implementation-reviewer.toml` currently define review and
  approval handoffs but do not define a mandatory post-approval commit step.
- Implementation-slice plan: `TASKS.md`.

## Requirements

- R1: The SDD workflow distinguishes Plan or Replan Approval before
  implementation, Completion Approval after implementation review, and
  Feature Exit Closure Approval.
- R2: A plan or replan commit is permitted only after the plan reviewer is
  `Ready` and explicit human approval records the exact next-slice scope.
- R3: A slice implementation commit is permitted only after the independent
  implementation reviewer is `Ready` and explicit human Completion Approval
  records the exact completed slice scope.
- R4: A Feature Exit commit is permitted only after `feature-closer` returns
  `Close` and explicit human Closure Approval covers the durable propagation,
  closure evidence, and temporary-feature removal.
- R5: Before the corresponding human approval, no agent or skill may stage or
  commit the plan, implementation slice, or Feature Exit changes.
- R6: A dedicated approval-committer stages only the approved gate's files,
  verifies the staged diff, and creates one focused commit without amending,
  resetting, force-pushing, or including unrelated work.
- R7: Read-only reviewers cannot approve or commit on behalf of the human.
- R8: Multi-slice features commit each approved plan/slice gate before moving
  to the next stage; Feature Exit starts only after all slice commits exist.
- R9: The commit gate changes only repository workflow configuration and SDD
  documents; extension runtime, tests, generated artifacts, and user-visible
  behavior remain unaffected.

## Behavioral Scenarios

```gherkin
Feature: SDD approval-gated commits

Scenario: Plan approval commits the approved slice definition
  Given a plan reviewer has returned Ready
  And explicit Human Approval records the next slice scope
  When the approval-committer runs for the plan gate
  Then it stages only the approved planning package
  And it creates one focused plan commit before implementation starts

Scenario: Review Ready does not commit without completion approval
  Given an implementation slice has a Ready implementation review
  And Completion Approval is still Pending
  When the workflow resumes
  Then no agent or skill stages or commits the slice
  And the workflow waits for explicit human Completion Approval

Scenario: Completion approval creates one focused slice commit
  Given an implementation slice has a Ready implementation review
  And explicit Completion Approval records the exact approved scope
  When the approval-committer runs for the completion gate
  Then it stages only the approved slice files
  And it verifies the staged diff
  And it creates one focused commit

Scenario: Closure approval creates the Feature Exit commit
  Given every implementation slice has its own approved commit
  And feature-closer has returned Close
  And explicit Closure Approval covers the Feature Exit scope
  When the approval-committer runs for the closure gate
  Then it stages the approved durable-document and feature-folder changes
  And it creates one focused closure commit

Scenario: Unrelated dirty work blocks an approval-gated commit
  Given Completion Approval is recorded for one slice
  And the worktree contains unrelated changes or out-of-scope files
  When the approval-committer inspects the worktree
  Then it stops without committing
  And reports the exact scope conflict for human direction
```

## Architecture

- Domain: none.
- Application: none.
- Presentation: none.
- Infrastructure: none.
- Repository workflow: `docs/specs/README.md` owns the lifecycle policy;
  `.codex/agents/*.toml` owns role authority and handoffs;
  `.agents/skills/*.md` owns the reusable approval-commit procedure; feature
  `TASKS.md` owns the approval evidence for the active gate.

## Impact Analysis

### Dependency Impact

- Affected policy and role files: `AGENTS.md`, `docs/specs/README.md`, the
  feature templates, plan/review/implementation/Feature Exit handoffs, a new
  `approval-committer.toml`, and a new `sdd-commit-gate` skill.
- Affected validation: Markdown lint, qlty, diff checks, and focused static
  inspection of the role/skill contracts. No runtime or extension test suite
  is required because production source is unchanged.
- Propagation decision: update lifecycle routing, approval evidence shape,
  role handoffs, and one gate-aware commit procedure together. Keep runtime
  architecture, release workflow, inherited feature folders, and extension
  behavior unchanged.

### Breaking Change Analysis

- User-visible extension behavior: none.
- API/DTO/schema compatibility: none.
- VS Code/web extension compatibility: none; no runtime or host code changes.
- Git workflow impact: commits are intentionally delayed until the relevant
  explicit human approval and are limited to that gate's approved files.
- Changed scenarios: new repository workflow scenarios only; no product
  use-case scenario changes.

### Alternative Considerations

- Let reviewers or feature-closer commit: rejected because independent review
  roles must not approve or commit on behalf of the human.
- Let implementer commit immediately after validation: rejected because it
  would bypass the explicit Completion Approval boundary.
- Use separate committers for plan, slice, and closure: rejected because the
  safety rules and scope checks are the same; a gate-specific procedure keeps
  the workflow cohesive.
- Rely on prose in `TASKS.md` without a commit-capable role: rejected because
  the current gap is the lack of an executable handoff.

### Approval Impact Decisions

- Approval evidence owner: active feature `TASKS.md` `Human Approval`,
  `Completion Approval`, or `Closure Approval`, according to the gate.
- Scope changes requiring re-approval: automatic commit before the relevant
  approval, broad staging, amend/reset/force-push behavior, runtime changes,
  release publishing, or changes to human approval semantics beyond the
  approval-gated commit policy.

## Compatibility

- VS Code compatibility: unchanged; `package.json` and extension engines are
  untouched.
- Web extension compatibility: unchanged; no browser or webview source is
  modified.
- Desktop extension compatibility: unchanged; no host or runtime source is
  modified.
- JP1/AJS compatibility: unchanged; no definition parsing or interpretation is
  modified.
- Git safety: unrelated dirty work blocks the committer rather than being
  silently staged; every approval gate produces at most one focused commit.

## Acceptance Criteria

- AC1: The lifecycle documentation explicitly shows a commit after each
  approved plan/replan, completed slice, and Feature Exit closure gate.
- AC2: `TASKS.md` templates include distinct Human Approval, Completion
  Approval, and Closure Approval records with exact scope fields.
- AC3: Plan, implementation, review, Feature Exit, and closure handoffs prevent
  pre-approval staging/commit and route each approved gate to the committer.
- AC4: A dedicated approval-committer agent/skill supports plan, completion,
  and closure gates and stops on unrelated or out-of-scope changes.
- AC5: The configuration remains compatible with existing feature folders and
  does not require runtime, test, generated, or extension changes.
- AC6: qlty, Markdown lint, and diff validation pass with no new policy smell.

## Non-Goals

- Change extension runtime behavior, product use cases, or test execution.
- Automatically approve Human Approval or Completion Approval.
- Commit before the implementation reviewer is `Ready`.
- Push branches, open pull requests, amend commits, reset worktrees, or force
  push.
- Redesign the wider Git/release workflow.

## Open Questions

- None.
