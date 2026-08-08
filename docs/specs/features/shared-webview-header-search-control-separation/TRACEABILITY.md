# Requirements Traceability: Shared Webview Header Search Control Separation

<!-- markdownlint-disable MD013 -->

| Use case / requirement                                                                                                  | SPECS.md section                                    | Implementation slice | Test or validation                                                                                                                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uc-explore-flow-graph.md`: current-scope search, result state, focus, and presentation-local matching                  | R2-R5; AC2-AC4                                      | Slice 1              | `headerSearchField.test.ts`, `accessibilityDom.test.tsx`, flow search/controller suites, desktop/web tests                                                                                                                                              |
| `uc-view-unit-list.md`: search-result state and localized semantic table state                                          | R2-R5; AC2-AC4                                      | Slice 1              | `headerSearchField.test.ts`, `accessibilityDom.test.tsx`, table search/controller and shell suites                                                                                                                                                      |
| Roadmap 7.4: shared header-search state and accessibility behavior are explicit without a shared search domain contract | Purpose; R1-R7; AC1-AC6                             | Slice 1              | architecture dependency test, focused suites, `rtk pnpm run qlty`, production build, desktop/web validation                                                                                                                                             |
| Query privacy policy: shared control does not add raw query text to host messages or telemetry                          | R6; AC5                                             | Slice 1              | existing `searchTelemetry.test.ts`, `telemetryEvent.test.ts`, viewer request assertions, focused control tests                                                                                                                                          |
| Desktop and browser webview parity                                                                                      | R7; AC6                                             | Slice 1              | desktop suite, web suite, `rtk pnpm run build`                                                                                                                                                                                                          |
| Independently reviewable Slice 2 completion and approval-gate evidence for completed Slice 1                            | Approval Impact Decisions; AC1-AC6 remain unchanged | Slice 2              | `TASKS.md` Slice 2 completion record; `rtk pnpm run qlty`, `rtk pnpm run lint:md`, `rtk git diff --check`, read-only scope/history checks; implementation review -> human Completion Approval -> focused two-document completion commit -> Feature Exit |

<!-- markdownlint-enable MD013 -->

Historical Slice 1 validation evidence (not current Feature Exit status): Slice
1 implementation review Ready. `rtk pnpm run
test:compile`, desktop preparation and suite, web preparation and suite,
`rtk pnpm run qlty`, `rtk pnpm run build`, `rtk git diff --check`, and Markdown
lint passed. The first sandboxed web run was blocked by Chromium macOS process
permission; the same web suite passed after an approved sandbox escalation
with only existing teardown `ECONNRESET`/stream-close noise. Production build
retained the repository's existing bundle-size warnings and introduced no new
quality findings.

Historical Feature Exit review evidence for Slice 1 (not current Feature Exit
status): the acceptance and validation correspondence remains satisfied.
Roadmap item 7.4 is absent because the implementation commit removed the
completed item. No durable use-case, README, or CHANGELOG propagation is
required; matching semantics, viewer messages, telemetry, and supported
desktop/web behavior remain unchanged.

Slice 2 implementation validation result (documentation-only; implementation
review Ready and Completion Approval recorded): `rtk pnpm run qlty`, `rtk pnpm run lint:md`, and `rtk git diff
--check` passed. Read-only status/diff inspection against replan approval commit
`9f14202321da55d91529e962cc034f62441b85f4` confirmed that only `TASKS.md` and
`TRACEABILITY.md` changed. Read-only history inspection confirmed the existing
implementation commit `6e12e98d` and the absence of separate focused
plan-approval and Slice 1 completion-approval commits; no history was
manufactured. Runtime, desktop, web, and build checks were not rerun because
Slice 2 changes documentation only; the historical Slice 1 validation evidence
above remains clearly separate and applicable to runtime behavior.

Current Feature Exit status: pending the focused two-document completion
commit and independent Feature Exit review.

Closure evidence blocker: Git history contains implementation commit
`6e12e98d`, but does not evidence separate focused plan-approval or
completion-approval commits for this feature. No closure commit or closure
approval may be inferred from the existing feature-document text or the
recorded human approvals. Slice 2 is documentation-only and must preserve this
fact rather than reconstructing or claiming historical commits.
