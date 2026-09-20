# Requirements Traceability: Schedule Impact Calendar Qlty Cleanup

<!-- markdownlint-disable MD013 -->

| Use case / requirement                                                                                                                                | SPECS.md section                | Implementation slice | Test or validation                                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `uc-present-schedule-impact.md`: retain periods, facts, order, filters, counts, focus, bounded rendering, localization, and explicit unknown evidence | R2, R3, R6; Acceptance Criteria | Slice 1              | Calendar component, view, projection, accessibility, localization, theme, desktop, and web tests                                                             |
| R1: clear all 36 originating hosted blockers without suppression or configuration changes                                                             | R1; Acceptance Criteria         | Slice 1              | Reconcile the hosted 34-smell subset, all 43 local smell locations, and two `CHANGELOG.md` findings; local qlty; direct changelog lint; hosted PR qlty check |
| R2: preserve panel/runtime lifecycle while removing its reported host findings                                                                        | R2; Compatibility               | Slice 1              | `scheduleImpactCalendarPanelRuntime`, session, Explorer panel/messages/schedule-impact tests; desktop and WEB-7 through WEB-10 host checks                   |
| R3: remove reported Calendar, Table, and shared UI structure findings while preserving rendering and interaction                                      | R3; Acceptance Criteria         | Slice 1              | Calendar UI/model/a11y suites; `ajsTableHeader`, Table shell, unit-tree, accessibility DOM, unit-definition, and flow-detail tests                           |
| R3: remove five duplication findings while preserving section content and English/Japanese values                                                     | R3; Compatibility               | Slice 1              | Calendar view/component and localization tests; exported-value diff review; qlty duplication output                                                          |
| R4: wrap two blocking changelog lines without meaning changes                                                                                         | R4; Acceptance Criteria         | Slice 1              | `rtk pnpm exec markdownlint-cli2 CHANGELOG.md` and exact diff review                                                                                         |
| R5: retain Clean Architecture, browser-safe presentation code, MUI theme flow, DTOs, transport schema, and public exports                             | R5; Architecture                | Slice 1              | Architecture dependency suite, TypeScript compile, production/desktop/web builds, API/import diff review                                                     |
| R6: preserve desktop and web operation and failure cleanup                                                                                            | R6; Compatibility               | Slice 1              | Production/desktop/web builds; desktop host suite; web host suite including WEB-7 through WEB-10                                                             |
| No externally observable documentation change                                                                                                         | Non-Goals; Planning Evidence    | Slice 1              | README, roadmap, architecture, and use-case paths absent from implementation diff; changelog wrap-only review                                                |

<!-- markdownlint-enable MD013 -->

## Implementation Result

<!-- markdownlint-disable MD013 -->

| Evidence           | Result                                                                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Approved scope     | Calendar host/runtime, Explorer requests, Table header, Calendar UI/model, shared UI, localization helpers, and two CHANGELOG wraps only |
| Quality            | `pnpm run qlty` passed; `qlty smells --no-snippets` returned zero findings against `origin/main`                                         |
| Compile and builds | `pnpm run test:compile`, `pnpm run build`, `development:desktop`, and `development:web` passed                                           |
| Host validation    | Desktop and web host suites passed; existing macOS codesign diagnostic was non-fatal                                                     |
| Markdown and diff  | Direct CHANGELOG lint, repository Markdown lint, and `git diff --check` passed                                                           |
| Review corrections | Restored lifecycle, typing, accessibility, localization, and stable-key contracts identified during implementation review                |
| Review verdict     | `implementation-reviewer` returned `Ready` on 2026-09-21 with no Findings                                                                |
| Completion gate    | Approved on 2026-09-21 under the established automatic per-slice approval policy; exact paths are recorded in `TASKS.md`                 |
| Remaining gate     | PR #318 hosted qlty check after the completion commit is pushed                                                                          |

<!-- markdownlint-enable MD013 -->

## Live Finding Coverage

<!-- markdownlint-disable MD013 -->

| Finding group                 | Hosted count | Additional local coverage                                                  | Slice 1 owners                                                                                                                    | Required evidence                                                                         |
| ----------------------------- | -----------: | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Function with high complexity |           23 | Local output lists 32 locations; all are in scope                          | Calendar panel/runtime, Explorer requests, Table header, Calendar app/list/sections/timeline/model, shared detail pane, unit tree | Zero corresponding qlty smells; focused behavior tests; diff review                       |
| Duplication                   |            5 | Same five locations reproduced locally                                     | Calendar sections (3) and English/Japanese Calendar localization (2)                                                              | Zero corresponding qlty duplication findings; view and localization parity tests          |
| Function with many returns    |            3 | Local output also lists `SharedUnitDetailPane`, for four covered locations | Calendar bounded list, Calendar timeline, Calendar model, shared detail pane                                                      | Zero corresponding qlty smells; focus, keyboard, rendering, and responsive behavior tests |
| Markdown line length          |            2 | Both reproduced by direct Markdown lint                                    | `CHANGELOG.md` current lines 5 and 12                                                                                             | Direct changelog Markdown lint and wrap-only diff                                         |
| Function with many parameters |            1 | Same location reproduced locally                                           | Calendar runtime `buildCalendarShell`                                                                                             | Zero corresponding qlty smell; shell/CSP/session/runtime tests                            |
| High total complexity         |            1 | Same location reproduced locally                                           | Calendar sections module                                                                                                          | Zero corresponding qlty smell; component/view parity tests; internal placement review     |
| Complex binary expression     |            1 | Same location reproduced locally                                           | Calendar model                                                                                                                    | Zero corresponding qlty smell; projection/filter/outcome tests                            |

<!-- markdownlint-enable MD013 -->
