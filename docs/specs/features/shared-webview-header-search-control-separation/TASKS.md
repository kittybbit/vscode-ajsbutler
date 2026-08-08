# Feature Tasks: Shared Webview Header Search Control Separation

## Agent Brief

- Purpose: separate shared webview header-search state and accessibility
  behavior behind presentation-local contracts without changing table or flow
  matching semantics.
- Approved or active slice: Slice 1 and Slice 2 are complete; Slice 2's
  implementation review is Ready and its completion commit is recorded. The
  Legacy Gate Exception / Closure Decision below is recorded for independent
  plan review before Feature Exit.
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
- Next decision: send this revised plan to independent plan review, then obtain
  independent Feature Exit Close, explicit Closure Approval, and one focused
  closure commit.

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Only
  when this feature is selected does it own active branch implementation work.
- Other feature folders inherited from the base branch remain outside this
  feature's scope.
- Update `docs/specs/roadmap.md` only in the approved Feature Exit closure
  commit for the parent propagation recorded below; do not edit it during this
  replan. Preserve roadmap sections 8/9 and `features/BASELINE.md`.
- Keep this file focused on implementation slices, approval, validation, risk,
  production readiness, and Feature Exit readiness. Do not retain historical
  logs or long validation diaries once they stop being actionable.

## Plan Status

- Status: Complete; revised closure decision plan review Ready; Feature Exit
  pending
- Planning scope: one narrow closure-evidence revision that records the
  explicitly approved, one-feature-only Legacy Gate Exception for the missing
  Slice 1 focused gate commits and the bounded parent-roadmap propagation,
  without reopening or changing Slice 1 or Slice 2.
- Review status: revised closure decision plan review Ready; prior replan and
  Slice 1/Slice 2 implementation reviews are Ready with no actionable findings.
- Human approval: Slice 1 plan and completion approvals are historical; Slice 2
  replan and completion approvals are recorded below; the Legacy Gate Exception
  / Closure Decision is explicitly approved in the current conversation. No
  Closure Approval is recorded.
- Active implementation slice: None; Feature Exit pending

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

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: exactly the post-plan-commit Slice 2 completion record: record
  Slice 2 completion, its validation evidence, and this Slice 2 Completion
  Approval in the two selected feature documents only.
- Approved paths:
  `docs/specs/features/shared-webview-header-search-control-separation/TASKS.md`
  and
  `docs/specs/features/shared-webview-header-search-control-separation/TRACEABILITY.md`
- Implementation review verdict: Ready; no actionable findings.
- Commit status: Committed in `0f2c6dc51d553941bd70c40fdae16f1bb8c3c981`.
- Sequence completed: implementation review -> human Completion Approval ->
  focused two-document completion commit. Feature Exit is next.
- Completion Approval is recorded after implementation review returned Ready.

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

## Legacy Gate Exception / Closure Decision

- Decision: Option 2 — close this legacy feature with a narrowly bounded
  `Legacy Gate Exception` for the missing Slice 1 plan-approval and Slice 1
  completion focused gate commits.
- Approval status: Approved
- Approved at: approved in current conversation
- Approved scope: this one-feature-only Legacy Gate Exception and its closure
  evidence, limited to the selected feature's TASKS.md and TRACEABILITY.md;
  no repository-wide policy, runtime, test, configuration, or Git history
  changes.
- Approved paths:
  `docs/specs/features/shared-webview-header-search-control-separation/TASKS.md`
  and
  `docs/specs/features/shared-webview-header-search-control-separation/TRACEABILITY.md`
- Approval meaning: this records the closure decision and exception only; it is
  not Feature Exit Close, Closure Approval, or a closure commit.
- Independent plan review: Ready for approval; no actionable findings.
- Historical evidence: the Slice 1 implementation commit `6e12e98d` predates
  the approval-gated workflow commits `2c137f56` and `85bf909e`. Those later
  workflow commits are not feature-specific focused gate commits for this
  feature. Do not rewrite history or claim that the missing focused commits
  exist.
- Scope boundary: this is a one-feature-only exception. It does not alter
  repository-wide SDD policy, architecture, runtime behavior, or future
  features. It accepts the historical gate gap for this feature only.
- Required evidence: current Slice 1 acceptance and validation,
  traceability, and production-readiness evidence remain required, and all
  Slice 2 reconciliation evidence remains required. The exception waives none
  of that evidence.
- Closure sequence: after this revised plan receives independent plan review,
  Feature Exit must still return `Close`, a human must provide explicit
  Closure Approval, and `approval-committer` must create one focused closure
  commit. No feature-folder deletion, roadmap edit, staging, commit, or
  Closure Approval occurs in this replan.
- Parent `Webview Presentation Separation` propagation for that approved
  closure commit: remove the empty `### 7. Webview Presentation Separation`
  section and the stale completed-child ordering bullet around
  `docs/specs/roadmap.md` lines 73-75. Preserve sections `### 8` and `### 9`
  and `docs/specs/features/BASELINE.md`; do not perform this propagation now.

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

- Status: Complete; implementation review Ready; completion commit recorded
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
    names the missing focused gate commits, and keeps Slice 2 Completion
    Approval recorded after implementation review returned Ready and explicit
    human Completion Approval was recorded.
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
  read-only history check remain available. The approved replan gate is commit
  `9f14202321da55d91529e962cc034f62441b85f4`, and the focused Slice 2
  completion commit is `0f2c6dc51d553941bd70c40fdae16f1bb8c3c981`. Feature Exit
  follows that completion commit.
- Risks: a reviewer may expect the missing historical commits to be recreated;
  the approved one-feature-only exception instead preserves the factual gap.
  Independent plan review, Feature Exit Close, explicit Closure Approval, and
  the focused closure commit remain required. Unrelated worktree changes must
  not be absorbed into the reconciliation.
- Out of Scope: recreating or rewriting Git history, redoing or reopening Slice
  1, changing runtime code/tests/configuration, changing `SPECS.md` or the
  roadmap, adding product requirements, rerunning Feature Exit in this slice,
  or granting plan, completion, or closure approval.

#### Slice 2 implementation result

- Completion: the approved docs-only reconciliation is recorded in this
  `TASKS.md` and `TRACEABILITY.md` after replan approval commit
  `9f14202321da55d91529e962cc034f62441b85f4`.
- Scope result: Slice 1 remains Complete with its historical plan and
  completion approvals, implementation-review Ready result, and runtime
  validation evidence preserved and clearly labeled. No runtime, test,
  generated, configuration, roadmap, README, CHANGELOG, or Git history file
  was changed.
- History result: read-only inspection confirms implementation commit
  `6e12e98d` is present, while separate focused plan-approval and Slice 1
  completion-approval commits are absent. They were not reconstructed or
  claimed retroactively; no closure commit or closure approval is asserted.
- Implementation review: Ready. Slice 2 Completion Approval is recorded after
  the independent implementation review returned Ready.

#### Slice 2 validation result

- Passed `rtk pnpm run qlty`.
- Passed `rtk pnpm run lint:md`.
- Passed `rtk git diff --check`.
- Read-only scope/status and diff inspection against the post-plan-commit
  baseline confirmed that the Slice 2 delta contains only the two approved
  feature documents.
- Read-only history inspection confirmed that no focused historical gate
  commit is present and no Git history was manufactured.
- Runtime, desktop, web, and production-build checks were not rerun because
  this approved slice changes documentation only; the historical Slice 1
  validation evidence remains the applicable runtime evidence.

#### Slice 2 implementation feedback

- The two-document approval boundary was sufficient to reconcile lifecycle
  evidence without reopening Slice 1 or introducing a design or scope change.
- Keeping historical validation and missing historical gate commits explicitly
  labeled prevents documentation-only completion from being mistaken for
  retroactive approval or Feature Exit closure.

## Traceability

- TRACEABILITY.md required: yes
- Reason: the feature spans shared presentation contracts and two viewers and
  needs explicit behavior, privacy, accessibility, and desktop/web validation
  correspondence.

## Feature Exit

- Definition of Done status (current Feature Exit status): Close. Slice 1 and
  the Slice 2 docs-only reconciliation, including historical validation,
  traceability, and production-readiness evidence, are complete. The approved
  Legacy Gate Exception and Feature Exit review are complete.
- Durable documentation context: roadmap item 7.4 is absent, but the parent
  roadmap still has the empty `### 7` section and the stale completed-child
  ordering bullet around lines 73-75. The approved closure propagation is to
  remove only those stale parent references, preserving sections 8/9 and
  `features/BASELINE.md`; no source use case, README, or CHANGELOG update is
  required because behavior and user workflow are unchanged.
- Open risks: the historical gate gap is accepted only for this feature. No
  separate focused plan-approval or Slice 1 completion-approval commit exists;
  the approved exception does not change repository-wide policy or waive
  current Slice 1/Slice 2 evidence.
- Feature Exit determination: `Close`, based on the independent Feature Exit
  review and the approved one-feature-only Legacy Gate Exception.

## Closure Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: close this selected feature under the approved Legacy Gate
  Exception; remove its temporary feature folder and remove only the empty
  parent `### 7. Webview Presentation Separation` roadmap block and stale
  completed-child ordering bullet. Preserve roadmap sections 8/9,
  `docs/specs/features/BASELINE.md`, all runtime behavior, tests, and history.
- Approved paths:
  `docs/specs/features/shared-webview-header-search-control-separation/`
  and `docs/specs/roadmap.md`
- Required review: Feature Exit `Close`.
- Closure commit: pending; no staging or deletion has occurred yet.

## Validation

- [x] Tests added or updated (historical Slice 1)
- [ ] Update README or user documentation if user-facing behavior changes
- [x] Run relevant validation (historical Slice 1 and current Slice 2)

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

Current Feature Exit status: Close; closure commit pending.
