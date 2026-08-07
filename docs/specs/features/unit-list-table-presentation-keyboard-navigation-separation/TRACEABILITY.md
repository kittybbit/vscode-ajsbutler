# Requirements Traceability: Unit-list Table Separation

<!-- markdownlint-disable MD013 -->

| Use case / requirement                                                                                       | SPECS.md section        | Implementation slice | Test or validation                                                                                                |
| ------------------------------------------------------------------------------------------------------------ | ----------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `uc-view-unit-list.md`: stable Application-facing input and presentation-owned filtering/table integration   | R1, R2; AC1             | Slice 1              | `tableViewerData.test.ts`, `tableColumnDef.test.ts`, `ajsTableGlobalFilter.test.ts`                               |
| `uc-export-unit-list-csv.md`: visible columns and display order preserve CSV output                          | R2, R5; AC4             | Slice 1              | `exportCsvView.test.ts`, `exportUnitListCsv.test.ts`                                                              |
| `uc-navigate-between-unit-list-and-flow-graph.md`: stable-path list-to-flow action remains available         | R1, R5; AC4             | Slice 1              | `tableNavigation.test.ts`, `tableShellIntegration.test.ts`                                                        |
| `uc-show-unit-definition.md`: selected table unit retains definition-detail metadata and action              | R1, R5; AC4             | Slice 1              | `showUnitDefinitionInteraction.test.ts`, `tableShellIntegration.test.ts`                                          |
| `uc-view-unit-list.md`: keyboard entry, grid traversal, tree handoff, detail return, and meaningful fallback | R3, R6; AC2, AC3        | Slice 2              | `tableNavigation.test.ts`, `tableVirtualizationFocus.test.ts`                                                     |
| `uc-view-unit-list.md`: sorting, visibility, virtualization, and stable selection/focus remain distinct      | R3, R4, R6; AC2, AC3    | Slices 2 and 3       | `tableVirtualizationFocus.test.ts`, `tableShellIntegration.test.ts`                                               |
| `uc-view-unit-list.md`: localized semantic state, high-contrast focus, and desktop/web parity                | R5, R7; AC4, AC5, AC6   | Slice 3              | `accessibilityDom.test.tsx`, `ajsTableHeader.test.ts`, desktop/web tests, production build, manual keyboard smoke |
| Roadmap 7.3: separate rendering, column actions, virtualization, and keyboard focus from Application DTOs    | Purpose; R1-R4; AC1-AC3 | Slices 1-3           | architecture dependency test, focused table suites, `rtk pnpm run qlty`, production build                         |

<!-- markdownlint-enable MD013 -->

Slice 1 validation result: `rtk pnpm run test:compile`, the desktop test
runner, `rtk pnpm run qlty`, and `rtk pnpm run build` passed. The web smoke
runner exited successfully; its teardown emitted transport shutdown noise
(`ECONNRESET`/`EPIPE`) without a test failure.

Slice 2 validation result: `rtk pnpm run test:compile`, the desktop test
runner, `rtk pnpm run qlty`, and `rtk pnpm run build` passed. The model tests
cover movement decisions with selection/scroll targets and restoration fallback;
the virtualization focus tests cover 10,000-row bounded movement and the same
off-screen decision contract. No user-visible behavior, desktop/web host API,
Application DTO, or CHANGELOG update was required.

Slice 3 validation result: `rtk pnpm run test:compile`, the full desktop suite,
`rtk pnpm run qlty`, production `rtk pnpm run build`, and elevated `rtk pnpm run
test:web` passed. The web runner emitted existing teardown `EPIPE` and
premature-close noise after successful viewer activation. No Application,
Domain, Infrastructure, transport, dependency, accessibility-copy, or
user-visible behavior changed. Manual large-list keyboard smoke remains Feature
Exit evidence because no interactive large-list fixture was available.
