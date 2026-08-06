# Traceability: Webview Flow-graph Presentation Separation

<!-- markdownlint-disable MD013 MD060 -->

| Use Case                                                                                       | Requirement | SPECS.md Section                  | Implementation Slice                  | Test Or Validation Plan                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------- | ----------- | --------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uc-build-flow-graph`                                                                          | R1, R2      | Requirements; Architecture        | Slice 1                               | `flowGraphView.test.ts`, `buildExpandedFlowGraph.test.ts`, `buildExpandedFlowGraphUseCase.test.ts`, TypeScript compile, architecture dependency suite                                                                                                                                         |
| `uc-explore-flow-graph`                                                                        | R3          | Requirements; Architecture        | Slices 1 and 2                        | `flowNodeDisplay.test.ts`, `flowNodeDetail.test.ts`, `flowHeader.test.ts`, `nodeSxProps.test.ts`, `flowNodeDetailPanelCollapse.test.ts`                                                                                                                                                       |
| `uc-build-flow-graph`, `uc-explore-flow-graph`                                                 | R4          | Requirements; Acceptance Criteria | Slices 1 and 3                        | `buildExpandedFlowGraph.test.ts`, `buildExpandedFlowGraphUseCase.test.ts`, `flowGraphView.test.ts`, `flowContentsIntegration.test.ts`, `flowRelationshipFocus.test.ts`, `flowMiniMap.test.ts`, `flowKeyboardNavigation.test.ts`, `flowViewportFocus.test.ts`, and `accessibilityDom.test.tsx` |
| `uc-explore-flow-graph`, `uc-navigate-between-unit-list-and-flow-graph`                        | R5          | Requirements; Acceptance Criteria | Slices 2 and 3                        | `flowNodeDetail.test.ts`, `showUnitDefinitionInteraction.test.ts`, `flowContentsIntegration.test.ts` success/unavailable-viewer scenarios, callback and focus DOM coverage                                                                                                                    |
| `uc-build-flow-graph`, `uc-explore-flow-graph`, `uc-navigate-between-unit-list-and-flow-graph` | R6          | Compatibility                     | All slices; final evidence in Slice 3 | Host-neutral component/DOM tests, per-slice `test:prepare:web`, desktop suite, production build, web-host smoke, `viewerBundle.test.ts`, architecture suite                                                                                                                                   |
| Shared refactoring baseline Intake group 3                                                     | R7          | Requirements; Acceptance Criteria | All slices                            | Per-slice `rtk pnpm run qlty`; final targeted metrics and smells comparison against `BASELINE.md`                                                                                                                                                                                             |

<!-- markdownlint-enable MD013 MD060 -->

## Slice 1 Validation Result

- `rtk pnpm test` passed, including the architecture dependency suite.
- `rtk pnpm run test:compile`, `rtk pnpm run test:prepare:web`,
  `rtk pnpm run qlty`, and `git diff --check` passed.

## Slice 2 Validation Result

- `rtk pnpm test` passed, including flow integration and viewer-wiring
  success/fallback coverage.
- `rtk pnpm run test:compile`, `rtk pnpm run test:prepare:web`,
  `rtk pnpm run qlty`, and `git diff --check` passed.
