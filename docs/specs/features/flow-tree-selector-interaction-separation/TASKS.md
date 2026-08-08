# Feature Tasks: Flow-tree Selector Interaction Separation

## Agent Brief

- Purpose: separate flow-tree selection and focus responsibilities into
  reviewable presentation-local seams without changing flow behavior.
- Approved or active slice: Slice 1 is approved and ready for implementation.
- Do not: change flow scope resolution, graph placement, stable unit identity,
  cross-view navigation, or table keyboard behavior.
- Do not: add shortcuts, selection modes, parser/application contracts,
  telemetry, host messages, or visual redesign.
- Read first: `SPECS.md`, this file, the two source use cases, and the selector
  and navigation files named in the slice.
- Read `TRACEABILITY.md` when updating the active slice's validation evidence.
- Validate: focused selector/navigation and accessibility tests, desktop/web
  suites, production build, qlty, Markdown lint, and diff checks.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: plan review, then approved plan commit before implementation.

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
  production readiness, and Feature Exit readiness.

## Plan Status

- Status: Approved
- Planning scope: one presentation-only slice covering selector row state,
  focus/tabindex coordination, pointer and keyboard interaction, expansion and
  reveal state, and the existing flow selector adapter contracts.
- Review status: Plan review Ready; no actionable findings.
- Human approval: Approved in the current conversation for the exact Slice 1
  scope below.
- Active implementation slice: Slice 1

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 1 plan and its feature-definition, task-plan, and
  traceability documents; no runtime implementation yet.
- Approved paths: `docs/specs/features/flow-tree-selector-interaction-separation/SPECS.md`,
  `docs/specs/features/flow-tree-selector-interaction-separation/TASKS.md`,
  `docs/specs/features/flow-tree-selector-interaction-separation/TRACEABILITY.md`

Implementation must not start while Status is Pending. Only clear human
approval can change Status to Approved. `Approved at` records the approval
result only, such as `approved in current conversation`.

## Completion Approval

- Status: Pending
- Approved at:
- Approved scope:
- Approved paths:
- Implementation review verdict: Pending
- Commit status: Not eligible

## Closure Approval

- Status: Pending
- Approved at:
- Approved scope:
- Approved paths:
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Implementation Slices

### Slice 1: Establish flow-tree selector interaction seams

- Status: Approved
- Scope: extract the shared selector's pure row-state and interaction
  decisions, focus/tabindex and focus-request coordination, and expansion /
  selected-row reveal state into small presentation-local modules or hooks;
  keep `UnitTreeSelector.tsx` responsible for composition and MUI rendering.
  Preserve the existing `unitTreeNavigation.ts` contract unless a minimal
  adapter change is required to make the separation explicit. Update focused
  pure tests and accessibility DOM tests for the extracted seams. Change
  `FlowSelector.tsx` only when required to preserve its existing callback and
  stable-ID contract.
- User / Domain Value: users retain predictable flow-tree selection, focus,
  scope-row, reveal, and keyboard behavior while the interaction boundary is
  independently reviewable and maintainable.
- Cohesive Change Group: `src/presentation/webview/editor/shared/` selector
  interaction modules, the shared selector component, the flow adapter only if
  necessary, and focused selector/accessibility tests.
- Acceptance:
  - satisfies R1-R7 and AC1-AC5
  - enabled and disabled row semantics remain unchanged
  - Enter, Space, Arrow, Home, End, and eligible Alt+Enter behavior remains
    distinct and stable
  - focus requests, rerender retention, expansion, reveal, and nested fallback
    remain stable
  - no parser, domain, application, host, telemetry, or identity changes
- Validation:
  - extend `unitTreeSelector.test.ts` for pure row-state/interaction seams and
    retain existing navigation, disabled-row, and deep-tree coverage
  - retain and update `accessibilityDom.test.tsx` for treeitem roles,
    aria-disabled/selected/current state, single-tab-stop focus, collapse /
    expansion, and focus restoration
  - run the nearest compiled focused selector/navigation tests first
  - run `rtk pnpm run qlty`, `rtk pnpm run lint:md`, `rtk pnpm run build`,
    `rtk pnpm run test:full`, and `rtk git diff --check`
- Production Readiness:
  - Failure mode: extraction can lose event suppression, focus timing, or
    selection-vs-scope separation; pure and DOM regression tests must catch
    this.
  - JP1/AJS compatibility: no definition content, parser, normalization,
    encoding, scope, graph, or stable identity behavior changes.
  - Large or malformed input risk: the selector continues to consume the
    existing DTO tree; deep-tree navigation remains bounded and no definition
    content is copied or parsed.
  - Desktop/web impact: shared browser-safe presentation code is used in both
    hosts; run both test paths and the production build.
  - README/docs impact: none expected; this is an internal behavior-preserving
    refactoring.
  - CHANGELOG impact: none under the internal-refactoring criteria.
- Approval Boundary: selector presentation modules, `UnitTreeSelector.tsx`,
  any minimal `FlowSelector.tsx` adapter change, and their tests only. No
  runtime behavior contract, host, telemetry, application, domain,
  infrastructure, dependency, or configuration changes.
- Dependencies: completed flow-tree characterization from baseline intake
  group 11, existing stable cross-view identity, `unitTreeNavigation.ts`,
  flow interaction callbacks, and current selector/accessibility tests.
- Risks: too-broad extraction can duplicate row semantics or blur the boundary
  between focus and selection; keep models pure, hooks local, and callbacks
  stable. React effect timing and MUI DOM behavior require browser tests.
- Out of Scope: flow scope reducer changes, graph node interaction, table
  navigation, search, parser/application changes, host transport, telemetry,
  new shortcuts, virtualization, and visual redesign.

## Traceability

- TRACEABILITY.md required: yes
- Reason: the feature spans shared presentation interaction, flow scope-row
  behavior, accessibility, and desktop/web focus behavior and needs explicit
  requirement-to-test correspondence.

## Feature Exit

- Definition of Done status: pending implementation review and completion gate.
- Durable documentation updates: none expected unless a reusable behavior or
  repository policy change is discovered.
- Open risks: implementation review must confirm no selector semantics or
  architecture boundary changed.

## Validation

- [ ] Tests added or updated
- [ ] Update README or user documentation if user-facing behavior changes
- [ ] Run relevant validation

## Notes

- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and Feature Exit readiness only.
