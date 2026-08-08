# Feature Tasks: Shared Webview Header Search Control Separation

## Agent Brief

- Purpose: separate shared webview header-search state and accessibility
  behavior behind presentation-local contracts without changing table or flow
  matching semantics.
- Approved or active slice: Slice 1 is complete and implementation review is
  Ready; Slice 2 is a pending docs-only reconciliation slice.
- Do not: change table/flow matching, result ordering, host messages,
  telemetry, or domain/application contracts.
- Do not: add shortcuts, search features, visual redesign, or a shared search
  domain model.
- Read first: `SPECS.md`, this file, the two source use cases, and the shared
  header-search and focused test files.
- Read `TRACEABILITY.md` when updating the active slice's validation evidence.
- Validate Slice 2: the final two-document diff, `rtk git diff --check`,
  `rtk pnpm run qlty`, Markdown lint, and read-only scope/history checks;
  preserve Slice 1's historical runtime validation evidence.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: obtain independent plan review for Slice 2, then follow its
  approval-gated docs-only handoff before rerunning Feature Exit.

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Only
  when this feature is selected does it own active branch implementation work.
- Other feature folders inherited from the base branch remain outside this
  feature's scope.
- Update `docs/specs/roadmap.md` only when unfinished repository-level work or
  ordering changes; no roadmap change is required for this intake.
- Keep this file focused on implementation slices, approval, validation, risk,
  production readiness, and Feature Exit readiness. Do not retain historical
  logs or long validation diaries once they stop being actionable.

## Plan Status

- Status: Replanning
- Planning scope: one narrow docs-only reconciliation slice that records the
  existing Slice 1 approval evidence and the absence of separate focused gate
  commits, without reopening or changing Slice 1.
- Review status: Replan review Ready; Slice 1 plan and implementation reviews
  are Ready with no actionable findings.
- Human approval: Slice 1 plan and completion approvals are historical; Slice 2
  replan approval is recorded below.
- Active implementation slice: None

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 1 plan covering the presentation-only shared
  header-search contracts, local state, shortcut focus behavior, field/control
  composition, table/flow label adapters, and focused tests.
- Approved paths:
  `docs/specs/features/shared-webview-header-search-control-separation/SPECS.md`,
  `docs/specs/features/shared-webview-header-search-control-separation/TASKS.md`,
  `docs/specs/features/shared-webview-header-search-control-separation/TRACEABILITY.md`,
  `docs/specs/roadmap.md`,
  `src/presentation/webview/editor/ajsFlow/Header.tsx`,
  `src/presentation/webview/editor/ajsFlow/flowHeaderPresentation.ts`,
  `src/presentation/webview/editor/ajsTable/Header.tsx`,
  `src/presentation/webview/editor/shared/HeaderSearchControl.tsx`,
  `src/presentation/webview/editor/shared/HeaderSearchField.tsx`,
  `src/presentation/webview/editor/shared/headerSearchControlModel.ts`,
  `src/presentation/webview/editor/shared/useHeaderSearchControlState.ts`,
  `src/test/suite/accessibilityDom.test.tsx`,
  `src/test/suite/headerSearchField.test.ts`

`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

## Slice 1 Completion Approval (Historical)

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 1 implementation completion as reviewed Ready, covering
  only the approved shared presentation-control modules, table/flow label
  adapters, and focused unit/DOM tests.
- Approved paths: same as the approved Slice 1 paths listed above.

## Slice 2 Completion Approval

- Status: Pending
- Approved at:
- Approved scope: exactly the post-plan-commit Slice 2 completion record: record
  Slice 2 completion, its validation evidence, and this Slice 2 Completion
  Approval in the two selected feature documents only.
- Approved paths:
  `docs/specs/features/shared-webview-header-search-control-separation/TASKS.md`
  and
  `docs/specs/features/shared-webview-header-search-control-separation/TRACEABILITY.md`
- Implementation review verdict: Pending; the completed docs-only Slice 2
  delta must be sent to implementation-reviewer before Completion Approval.
- Commit status: Not eligible; after explicit human Completion Approval, the
  approval-committer must create one focused commit containing only the two
  approved paths and the Slice 2 completion, validation, and approval record.
- Sequence: implementation review -> human Completion Approval -> focused
  two-document completion commit -> Feature Exit.
- Completion Approval remains Pending until implementation review is Ready and
  explicit human Completion Approval is recorded.

## Replan Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 2 docs-only reconciliation of approval-gate evidence,
  limited to the two selected feature documents, with no runtime, test,
  configuration, or Git history changes.
- Approved paths:
  `docs/specs/features/shared-webview-header-search-control-separation/TASKS.md`
  and
  `docs/specs/features/shared-webview-header-search-control-separation/TRACEABILITY.md`

The existing Slice 1 plan and completion approvals remain historical evidence
and are not approval for the new reconciliation slice.

## Implementation Slices

### Slice 1: Establish explicit shared header-search presentation seams

- Status: Complete
- Scope: split the shared header-search responsibilities into explicit
  presentation-local contracts and modules for pure helper behavior, browser
  shortcut focus, local input/control state, and the MUI field/control
  composition. The primary seams are `headerSearchControlModel.ts` for shared
  types and pure helper behavior, `useHeaderSearchControlState.ts` for local
  state, `HeaderSearchField.tsx` for field rendering and shortcut focus, and
  `HeaderSearchControl.tsx` for control orchestration and navigation adornments.
  Update the table and flow header adapters only where required to consume the
  extracted contracts and keep their localization labels local. Preserve the
  current callback shapes at the table/flow search boundary.
- User / Domain Value: users retain the same search, focus, result-count, and
  accessible-label behavior while the shared webview control has independently
  reviewable state and accessibility seams.
- Cohesive Change Group: `src/presentation/webview/editor/shared/` search
  modules, the flow/table header label adapters, and focused unit/DOM tests for
  the shared control. Table and flow search controllers are regression
  consumers, not refactoring targets.
- Acceptance:
  - satisfies R1-R7 and AC1-AC5
  - pure helper functions and control types remain presentation-local and do
    not import domain, application, infrastructure, VS Code, or Node modules
  - local state preserves submit-on-blur, Enter/Shift+Enter navigation, clear
    refocus, and navigation callbacks
  - shortcut handling preserves platform detection, browser Find prevention,
    input focus, and placeholder text
  - table and flow retain their own localization and matching/result semantics
  - no raw query text is added to host messages or telemetry
- Validation (historical Slice 1 plan/evidence; not current Feature Exit status):
  - extend `headerSearchField.test.ts` for extracted helper/state seams as
    needed, including empty/non-empty input, submit, clear, navigation, and
    focus transitions
  - retain and update `accessibilityDom.test.tsx` for helper text, result count,
    localized labels, shortcut placeholder, and disabled navigation
  - run the nearest compiled focused tests through the repository test runner,
    then the desktop suite and web suite
  - run `rtk pnpm run qlty`, `rtk pnpm run build`, and `rtk git diff --check`
- Production Readiness:
  - Failure mode: an extraction could lose blur, keyboard, or focus timing;
    direct helper/state assertions and DOM integration coverage must catch it.
  - JP1/AJS compatibility: no definition content, parser, normalization,
    matching, encoding, or result-ordering behavior changes.
  - Large or malformed input risk: the control continues to pass queries to the
    existing presentation-local controllers and does not copy or parse full
    definition data.
  - Desktop/web impact: browser-standard event handling and the same webview
    component are used in both hosts; validate both paths.
  - README/docs impact: none expected because this is internal behavior-
    preserving refactoring.
  - CHANGELOG impact: none under the internal-refactoring criteria.
- Approval Boundary: presentation shared-control modules, table/flow label
  adapters, and their tests only; no behavior, host, telemetry, application,
  domain, infrastructure, or dependency changes.
- Human approval: Approved in current conversation.
- Dependencies: completed header-search characterization from baseline intake
  group 10, existing table/flow search controllers, and the current shared
  accessibility tests.
- Risks: browser shortcut listener cleanup, React callback identity, MUI
  helper/error rendering, and localized result-count semantics can regress if
  the seams are too broad; keep the extracted contracts small.
- Out of Scope: table/flow matching changes, flow-tree interaction, table
  keyboard navigation, search telemetry redesign, new shortcuts, and visual
  redesign.

#### Slice 1 implementation feedback

- Keeping pure helpers/contracts in `headerSearchControlModel.ts`, local state
  in `useHeaderSearchControlState.ts`, and field/control composition in their
  own modules made the presentation boundary explicit while preserving the
  existing table/flow callback shape.
- The helper uses a `Model` suffix because a lower-case
  `headerSearchControl.ts` would collide with `HeaderSearchControl.tsx` under
  TypeScript's case-sensitive file-name checks.

### Slice 2: Reconcile approval-gate evidence for completed Slice 1

- Status: Planned; pending independent plan review and human approval
- Scope: update only this feature's `TASKS.md` and `TRACEABILITY.md` to
  preserve the already-recorded human approvals, state plainly that history
  lacks separate focused plan-approval and Slice 1 completion-approval commits,
  record that those commits cannot be reconstructed or claimed retroactively,
  and define the exact evidence boundary for an independent Feature Exit
  review. Do not alter Slice 1, runtime behavior, tests, configuration, or
  Git history.
- Post-plan-commit implementation delta: after the approved replan commit, the
  only implementation change is recording Slice 2 completion, Slice 2
  validation evidence, and Slice 2 Completion Approval in the two selected
  feature documents. No other plan, scope, historical evidence, runtime,
  test, configuration, or Feature Exit status changes are included.
- User / Domain Value: no user-visible or domain behavior change; reviewers
  receive accurate, independently reviewable lifecycle evidence and cannot
  infer a closure approval or historical gate commit that does not exist.
- Cohesive Change Group: the selected feature's `TASKS.md` and
  `TRACEABILITY.md` only, kept synchronized as the single reconciliation
  record.
- Acceptance:
  - Slice 1 remains Complete with its existing plan and completion approval
    records and implementation validation evidence preserved.
  - `TASKS.md` distinguishes human approval records from Git commit evidence,
    names the missing focused gate commits, and keeps Slice 2 approval pending
    until the new plan is independently reviewed and approved.
  - `TRACEABILITY.md` preserves all Slice 1 requirement mappings and adds one
    explicit mapping for the documentation-only approval-evidence
    reconciliation.
  - The Slice 2 Completion Approval fields name the exact completion scope and
    paths and preserve the sequence implementation review -> human Completion
    Approval -> focused two-document completion commit -> Feature Exit.
  - Feature Exit remains pending independent reassessment; no closure approval,
    closure commit, or fabricated historical commit is asserted.
  - Slice 2's own patch adds or updates exactly the two selected feature
    documents; unrelated pre-existing worktree changes remain outside this
    slice and are not absorbed.
- Validation:
  - inspect the final diff and `rtk git diff --check`
  - run `rtk pnpm run qlty` and `rtk pnpm run lint:md`
  - verify with read-only status/diff scoped to the Slice 2 baseline and
    history inspection that only the two approved feature documents are in this
    slice and no historical commit is being manufactured; do not treat
    unrelated pre-existing worktree changes as Slice 2 changes
  - do not rerun runtime, desktop, web, or build checks for this docs-only
    reconciliation; preserve and reference Slice 1's existing validation
    evidence instead
- Production Readiness:
  - Failure mode: ambiguous wording could make approval records look like
    focused commits or could imply closure; explicit evidence boundaries and a
    pending Feature Exit state prevent that false conclusion.
  - JP1/AJS compatibility: no parser, definition-file, matching, encoding, or
    result-ordering behavior is touched.
  - Large or malformed input risk: none; no input is parsed or copied.
  - Desktop/web impact: none; Slice 1's existing desktop/web evidence remains
    unchanged and no host or webview code is edited.
  - README/docs impact: only the two selected temporary feature documents;
    no source use case, README, roadmap, or CHANGELOG update is required.
  - CHANGELOG impact: none because this reconciles process evidence only and
    changes no externally observable behavior.
- Approval Boundary: only
  `docs/specs/features/shared-webview-header-search-control-separation/TASKS.md`
  and
  `docs/specs/features/shared-webview-header-search-control-separation/TRACEABILITY.md`;
  no source, test, configuration, roadmap, README, CHANGELOG, history rewrite,
  approval grant, closure approval, or commit is included.
- Dependencies: Slice 1 remains Complete; its plan and completion approvals,
  implementation-review Ready result, validation evidence, and current
  read-only history check must remain available. After this replan is Ready and
  human-approved, the approval-committer must perform the plan/replan gate
  before the docs-only slice is implemented. After implementation review and
  explicit human Completion Approval, the approval-committer creates the
  focused two-document completion commit; Feature Exit follows that commit.
- Risks: a reviewer may expect the missing historical commits to be recreated;
  this slice must instead preserve the factual gap and leave any closure
  decision to the independent Feature Exit review. Unrelated worktree changes
  must not be absorbed into the reconciliation.
- Out of Scope: recreating or rewriting Git history, redoing or reopening Slice
  1, changing runtime code/tests/configuration, changing `SPECS.md` or the
  roadmap, adding product requirements, rerunning Feature Exit in this slice,
  or granting plan, completion, or closure approval.

## Traceability

- TRACEABILITY.md required: yes
- Reason: the feature spans shared presentation contracts and two viewers and
  needs explicit behavior, privacy, accessibility, and desktop/web validation
  correspondence.

## Feature Exit

- Definition of Done status (current Feature Exit status): pending Slice 2
  docs-only reconciliation, its implementation review, human Completion
  Approval, focused two-document completion commit, and independent Feature
  Exit review. Slice 1, its implementation review, historical validation,
  traceability, and production-readiness evidence are complete; the absence of
  separate focused gate commits remains explicit and is not being backfilled.
- Durable documentation context (historical Slice 1):
  `docs/specs/roadmap.md` no longer lists roadmap item 7.4 because the
  implementation commit removed the completed item. No source use case,
  README, or CHANGELOG update is required because behavior and user workflow
  are unchanged; this does not change the current Feature Exit status.
- Open risks: no implementation or compatibility risk was identified. The
  remaining process risk is that history contains the implementation commit
  `6e12e98d`, but no separate focused plan-approval or completion-approval
  commit for this feature, and no closure commit.
- Feature Exit determination: pending independent reassessment after Slice 2
  is approved, completed, and reviewed. Closure approval must not be inferred
  from the existing feature-document text or from the recorded human approvals
  alone.

## Validation

- [x] Tests added or updated
- [ ] Update README or user documentation if user-facing behavior changes
- [x] Run relevant validation

## Notes

- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and feature exit readiness only.

Historical Slice 1 validation evidence (not current Feature Exit status): all
recorded acceptance criteria remain satisfied. Independent checks passed:
`qlty:check`, Markdown lint, production build, test compilation, desktop suite,
elevated web suite, and the implementation diff check. The web suite exited 0
with existing teardown `EPIPE`/stream-close noise; the initial sandboxed launch
was blocked by Chromium macOS permissions. No new durable behavior, API,
telemetry, or compatibility contract was introduced.

Current Feature Exit status: pending Slice 2 completion, implementation review,
human Completion Approval, focused two-document completion commit, and
independent Feature Exit review.
