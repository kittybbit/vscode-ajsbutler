# Feature Tasks: Roadmap Backlog Pruning

## Agent Brief

- Purpose: prune speculative roadmap work while preserving concrete blocked
  ownership.
- Approved or active slice: Slice 1 planned; Human Approval pending.
- Do not edit runtime code, tests, generated artifacts, or configuration.
- Do not modify the inherited `import-definition-via-webapi` feature.
- Read first: `SPECS.md`, this file, `docs/specs/roadmap.md`, and the inherited
  WebAPI feature's `TASKS.md`.
- Read `TRACEABILITY.md`: not required.
- Validate: `rtk pnpm run qlty` and `rtk pnpm run lint:md`.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: Human Approval for Slice 1.

## Sync Rule

- Update this file when plan, approval, validation, risk, or Feature Exit
  readiness changes.
- This file is the sole plan owner for this selected feature.
- The inherited WebAPI feature remains outside this feature's scope.
- Update `roadmap.md` only for the approved evidence-backed disposition.

## Plan Status

- Status: Pending Approval
- Planning scope: one docs-only slice that prunes unsupported roadmap entries
  and removes shared refactoring evidence plus stale SSOT references after its
  last dependent item ends.
- Review status: Ready for approval
- Human approval: Pending
- Active implementation slice: none until approval and plan commit

## Investigation Evidence

- Architecture Boundary Protection: baseline explicitly reports no new
  dependency, cycle, or enforcement gap; current architecture suite passed 18
  tests in this conversation.
- Telemetry Product Learning: repository search found durable privacy and event
  contracts but no concrete analytics consumer or unanswered product question.
- Build/Test Output Ownership: `rtk pnpm run openapi:check` fails on one stale
  Prism fixture, but the inherited WebAPI `TASKS.md` already owns a focused
  Replanning requirement for that artifact.
- Shared Search Use Case: the flow use case explicitly keeps search
  presentation-local and states that no shared search contract is required;
  only one non-table search surface is evidenced.
- Broader WebAPI Support: the current beta remains blocked on real-environment
  evidence and user feedback, so no safe broader capability is defined.
- Viewer Bundle-Size Reduction: no compatibility, startup-time, payload-size,
  or bundle budget target is recorded.
- Translation-Resource Consolidation: no concrete maintenance blocker is
  recorded.
- JP1/AJS View Interaction Parity: no specific missing supported interaction is
  recorded.
- Expanded-Flow Layout Fixtures: existing non-overlap and layout regression
  coverage exists; no additional real-world collision or refit failure is
  recorded.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 1, `Prune unsupported roadmap backlog`, exactly as
  recorded in this plan
- Approved paths: `docs/specs/features/roadmap-backlog-pruning/` for the plan
  commit; implementation paths remain gated by Completion Approval

## Completion Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Implementation review verdict: Pending
- Commit status: Not eligible

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Implementation Slices

### Slice 1: Prune unsupported roadmap backlog

- Status: Proposed
- Scope:
  - remove Architecture Boundary Protection, its ordered-refactoring section,
    and baseline-derived ordering text
  - remove Telemetry Product Learning
  - remove the Deferred Candidates section
  - retain WebAPI Import Beta Exit with its existing evidence gate
  - remove `docs/specs/features/BASELINE.md` after confirming no selected or
    unfinished dependent refactoring feature remains
  - remove the inapplicable shared-baseline ownership and retention references
    from `docs/specs/README.md`
  - update this feature's current state and validation evidence only as
    required by the lifecycle
- User / Domain Value: maintainers see only concrete unfinished work and do not
  spend intake effort on speculative or duplicate candidates.
- Cohesive Change Group: the roadmap disposition and retirement of its shared
  temporary refactoring evidence form one repository-planning cleanup.
- Acceptance:
  - `roadmap.md` retains only the WebAPI beta-exit decision among the reviewed
    entries
  - the inherited WebAPI feature remains unchanged and owns its blocked beta
    evidence plus stale-artifact replan
  - no completed or speculative refactoring-program text remains in the
    roadmap
  - `BASELINE.md` is removed after its retention condition is confirmed ended,
    with no stale SSOT reference left behind
  - no runtime, test, generated-artifact, configuration, README, CHANGELOG, or
    use-case file changes occur
- Validation:
  - `rtk git diff --check`
  - `rtk pnpm run qlty`
  - `rtk pnpm run lint:md`
  - `rtk pnpm exec markdownlint-cli2 docs/specs/roadmap.md`
  - feature structure checks from `docs/specs/README.md`
  - targeted repository search confirming removed headings, no stale
    `BASELINE.md` reference, and retained WebAPI beta-exit ownership
- Production Readiness:
  - Failure mode: an over-pruned roadmap could hide unfinished work; prevent by
    preserving the existing WebAPI owner and verifying every removed entry
    lacks a met, distinct scope
  - JP1/AJS compatibility: unchanged; no definition semantics or manual
    interpretation changes
  - Large or malformed input risk: none; documentation only
  - Desktop/web impact: none
  - README/docs impact: `roadmap.md`, the temporary `BASELINE.md`, and the
    smallest corresponding `docs/specs/README.md` SSOT cleanup; no user
    documentation update
  - CHANGELOG impact: none because extension behavior is unchanged
- Approval Boundary: only
  `docs/specs/roadmap.md`, `docs/specs/README.md`,
  `docs/specs/features/BASELINE.md`, and selected feature lifecycle documents under
  `docs/specs/features/roadmap-backlog-pruning/`.
- Dependencies:
  - current refactoring completion commits and absence of another unfinished
    dependent feature folder
  - existing WebAPI feature remains the owner of its blocked evidence and
    generated-artifact replan
  - create or switch to dedicated docs-only branch
    `docs/roadmap-backlog-pruning` before the approved plan commit
- Risks:
  - future ideas removed from the roadmap must be recreated from evidence;
    their prior rationale remains available in Git history
  - deleting `BASELINE.md` is valid only if no concrete dependent refactoring
    feature remains
- Out of Scope:
  - fixing the stale Prism artifact or changing OpenAPI generation
  - changing the inherited WebAPI feature
  - runtime, tests, generated artifacts, configuration, README, CHANGELOG, or
    use-case edits
  - creating replacement features for candidates without met entry conditions

## Traceability

- TRACEABILITY.md required: no
- Reason: one documentation-only slice changes no behavior contract or use-case
  correspondence.

## Validation

- [x] Intake: `rtk pnpm run qlty`.
- [x] Intake: `rtk pnpm run lint:md`.
- [ ] Slice 1: run docs-only validation after implementation.

## Risks

- Removing speculative entries may hide future ideas; Git history preserves
  them, and a new evidence-backed feature can be created when an entry
  condition appears.
- Removing `BASELINE.md` too early would lose shared evidence; planning must
  verify that no unfinished dependent refactoring feature remains.
