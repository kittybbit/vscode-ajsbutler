# Feature Tasks: Infrastructure Boundary Cleanup

## Agent Brief

- Purpose: isolate the VS Code `ViewerFactory` host boundary while preserving
  viewer lifecycle and plain transport behavior.
- Approved or active slice: Slice 1 approved; plan commit is the next gate.
- Do not: edit runtime code, tests, generated artifacts, or configuration until
  the reviewed plan is explicitly approved and committed.
- Do not: include parser, WebAPI, file/host, localization, telemetry, or
  composition-root cleanup in this feature.
- Read first: `SPECS.md`, this file, the baseline Intake group 9, and the
  affected use cases.
- Read `TRACEABILITY.md` when preparing or validating the implementation plan.
- Validate: focused tests, `rtk pnpm run build`, `rtk pnpm run test:full`,
  `rtk pnpm run qlty`, and `rtk pnpm run lint:md` after implementation.
- Approval policy: see `docs/specs/README.md`.
- Document roles: see `docs/specs/README.md`.
- Next decision: commit the approved plan, then implement Slice 1.

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
  logs or validation diaries once they stop being actionable.

## Plan Status

- Status: Approved
- Planning scope: one bounded VS Code `ViewerFactory` boundary cleanup with
  an injected panel-registration bridge.
- Review status: Ready for approval; independent plan-review verdict is Ready
  for approval.
- Human approval: Approved for Slice 1 exact scope.
- Active implementation slice: Slice 1.

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 1 only: inject the VS Code panel-registration bridge;
  keep `ViewerFactory` responsible for panel lifecycle; preserve message
  schemas, application DTOs, telemetry meaning, desktop/web behavior, and all
  listed failure handling.
- Approved paths: `src/presentation/vscode/webview/ViewerFactory.ts`,
  `src/presentation/vscode/webview/viewerMessageRouting.ts`,
  `src/bootstrap/extension/viewerWiring.ts`,
  `src/test/suite/viewerFactory.test.ts`,
  `src/test/suite/viewerMessageRouting.test.ts`,
  `src/test/suite/viewerWiring.test.ts`, and the selected feature SDD files.

This approval authorizes the exact Slice 1 implementation scope after the
approved planning package is committed. Any new application port, message
schema, user-visible behavior, or boundary outside the listed paths requires
Replanning Mode and renewed approval.

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

### Slice 1: Inject the VS Code viewer panel bridge

- Status: Approved
- Scope: Refactor `src/presentation/vscode/webview/ViewerFactory.ts` so it owns
  only panel creation, title selection, lookup, store registration, setup
  cleanup, and panel lifecycle checks. Inject a registration callback for the
  VS Code message/lifecycle bridge. Update
  `src/presentation/vscode/webview/viewerMessageRouting.ts` to expose the
  existing bridge as one explicit `registerViewerPanel` registration seam, and
  compose that seam in `src/bootstrap/extension/viewerWiring.ts`.
- User / Domain Value: no new user behavior; stable JP1/AJS unit-list and
  flow-graph viewer behavior with a clearer host-neutral boundary.
- Cohesive Change Group: factory lifecycle plus the single injected bridge
  registration seam; no split by file because the factory and its registration
  callback must remain independently testable as one boundary.
- Acceptance: `ViewerFactory` no longer imports message-routing or resource /
  telemetry implementation helpers; the injected bridge preserves existing
  request validation, panel readiness, navigation, save/resource forwarding,
  disposal, and setup-failure behavior without changing message schemas.
- Boundary clarification: the factory's handler callback types remain private
  presentation/bootstrap coordination types and are not application ports or
  exported application contracts. Only plain request/host-message payloads,
  application DTOs, and existing telemetry events cross the application-facing
  boundary.
- Validation: update `src/test/suite/viewerFactory.test.ts` for the injected
  registration seam and setup cleanup; add direct registration coverage in
  `src/test/suite/viewerMessageRouting.test.ts`; retain focused coverage in
  `src/test/suite/viewerWiring.test.ts`; run the architecture suite, build,
  `src/test/suite/viewerWiring.test.ts`; run the architecture suite, build,
  desktop/web host tests, qlty, Markdown lint, and diff check.
- Production Readiness:
  - Failure mode: setup and disposal failures preserve cleanup and predictable
    errors without leaving stale panels.
  - JP1/AJS compatibility: viewer content and normalized JP1/AJS semantics are
    unchanged.
  - Large or malformed input risk: no parser behavior changes; existing
    viewer failure paths remain covered by their owning use cases.
  - Desktop/web impact: validate VS Code desktop and browser extension paths
    separately; the shared request/host-message contract remains unchanged.
  - README/docs impact: no user-facing documentation change expected.
  - CHANGELOG impact: none expected for internal boundary cleanup; revisit if
    observable behavior changes.
- Approval Boundary: planning review and explicit Human Approval are required
  before editing runtime code or tests; any port/schema or wider-boundary
  change requires replanning and renewed approval.
- Dependencies: completed characterization evidence and the prior viewer
  transport, panel-lifecycle, viewer-open, document-update, and composition
  extraction work recorded in repository history; no new application port is
  required.
- Risks: lifecycle or serialized-message regressions, accidental VS Code type
  leakage, an incorrectly composed bridge, and incomplete desktop/web
  coverage.
- Out of Scope: all other baseline intake groups, new behavior, architecture
  exceptions, service containers, new application ports or message schemas,
  and changes to parser/domain/webview rendering responsibilities.

## Traceability

- TRACEABILITY.md required: yes
- Reason: this is a non-trivial boundary refactoring with multiple existing
  use-case compatibility contracts and an explicit validation plan.

## Feature Exit

- Definition of Done status: Planning complete; implementation pending plan
  approval, commit, implementation review, and completion approval.
- Durable documentation updates: none identified at intake; reassess only if
  the current architecture or use-case contract changes.
- Open risks: the selected slice must retain desktop/web lifecycle evidence
  and must not expand into the other roadmap boundary candidates.

## Validation

- [ ] Tests added or updated after approval
- [ ] Update README or user documentation if user-facing behavior changes
- [ ] Run relevant validation

## Notes

- Keep feature requirements and boundary decisions in `SPECS.md`.
- Use this file for implementation-slice planning, approval state, validation,
  risk, and Feature Exit readiness only.
