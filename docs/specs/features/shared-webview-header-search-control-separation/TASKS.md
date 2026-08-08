# Feature Tasks: Shared Webview Header Search Control Separation

## Agent Brief

- Purpose: separate shared webview header-search state and accessibility
  behavior behind presentation-local contracts without changing table or flow
  matching semantics.
- Approved or active slice: Slice 1 is complete and implementation review is
  Ready.
- Do not: change table/flow matching, result ordering, host messages,
  telemetry, or domain/application contracts.
- Do not: add shortcuts, search features, visual redesign, or a shared search
  domain model.
- Read first: `SPECS.md`, this file, the two source use cases, and the shared
  header-search and focused test files.
- Read `TRACEABILITY.md` when updating the active slice's validation evidence.
- Validate: focused header/accessibility/search tests, `rtk pnpm run qlty`, the
  desktop and web test paths, and the production build.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: none; Feature Exit is complete and the feature is Closed.

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

- Status: Complete
- Planning scope: one presentation-only slice covering the shared header
  search control's pure contracts/helpers, local state, field composition,
  shortcut focus behavior, and its table/flow label adapters.
- Review status: Plan reviewed; implementation review Ready; no actionable
  findings
- Human approval: Reset after Slice 1 completion; approval is recorded on the
  slice below.
- Active implementation slice: None

## Human Approval

- Status: Pending
- Approved at:
- Approved scope:

Implementation must not start while Status is Pending. Only clear human
approval can change Status to Approved. `Approved at` records the approval
result only, such as `none` or `approved in current conversation`; do not copy
the approval message.

Reset this section to Pending when the approved slice is complete and no active
implementation approval remains.

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
- Validation:
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

## Traceability

- TRACEABILITY.md required: yes
- Reason: the feature spans shared presentation contracts and two viewers and
  needs explicit behavior, privacy, accessibility, and desktop/web validation
  correspondence.

## Feature Exit

- Definition of Done status: complete. Slice 1, implementation review,
  validation, traceability, and production-readiness evidence are complete.
- Durable documentation updates: `docs/specs/roadmap.md` no longer lists
  roadmap item 7.4 because this feature is complete. No source use case,
  README, or CHANGELOG update is required because behavior and user workflow
  are unchanged.
- Open risks: none identified by implementation review or Feature Exit.
- Feature Exit determination: complete and approved in the current
  conversation. Closure recommendation: Close.
- Closure approval: explicit approval received in the current conversation;
  feature closed.

## Validation

- [x] Tests added or updated
- [ ] Update README or user documentation if user-facing behavior changes
- [x] Run relevant validation

## Notes

- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and feature exit readiness only.

Feature Exit validation result: all approved acceptance criteria remain
satisfied. The full desktop suite and elevated web suite passed after the
presentation split; production build, qlty, Markdown lint, and diff checks
passed. No new durable behavior, API, telemetry, or compatibility contract was
introduced.
