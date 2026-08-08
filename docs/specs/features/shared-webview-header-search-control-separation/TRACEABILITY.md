# Requirements Traceability: Shared Webview Header Search Control Separation

<!-- markdownlint-disable MD013 -->

| Use case / requirement                                                                                                  | SPECS.md section        | Implementation slice | Test or validation                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------- |
| `uc-explore-flow-graph.md`: current-scope search, result state, focus, and presentation-local matching                  | R2-R5; AC2-AC4          | Slice 1              | `headerSearchField.test.ts`, `accessibilityDom.test.tsx`, flow search/controller suites, desktop/web tests     |
| `uc-view-unit-list.md`: search-result state and localized semantic table state                                          | R2-R5; AC2-AC4          | Slice 1              | `headerSearchField.test.ts`, `accessibilityDom.test.tsx`, table search/controller and shell suites             |
| Roadmap 7.4: shared header-search state and accessibility behavior are explicit without a shared search domain contract | Purpose; R1-R7; AC1-AC6 | Slice 1              | architecture dependency test, focused suites, `rtk pnpm run qlty`, production build, desktop/web validation    |
| Query privacy policy: shared control does not add raw query text to host messages or telemetry                          | R6; AC5                 | Slice 1              | existing `searchTelemetry.test.ts`, `telemetryEvent.test.ts`, viewer request assertions, focused control tests |
| Desktop and browser webview parity                                                                                      | R7; AC6                 | Slice 1              | desktop suite, web suite, `rtk pnpm run build`                                                                 |

<!-- markdownlint-enable MD013 -->

Validation result: Slice 1 implementation review Ready. `rtk pnpm run
test:compile`, desktop preparation and suite, web preparation and suite,
`rtk pnpm run qlty`, `rtk pnpm run build`, `rtk git diff --check`, and Markdown
lint passed. The first sandboxed web run was blocked by Chromium macOS process
permission; the same web suite passed after an approved sandbox escalation
with only existing teardown `ECONNRESET`/stream-close noise. Production build
retained the repository's existing bundle-size warnings and introduced no new
quality findings.

Feature Exit result: feature closed after explicit approval in the current
conversation. Close recommendation accepted.
Roadmap item 7.4 was removed because the feature is complete. No durable
use-case, README, or CHANGELOG propagation is required; matching semantics,
viewer messages, telemetry, and supported desktop/web behavior remain unchanged.
