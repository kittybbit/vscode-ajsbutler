# Traceability: Migrate Flow Graph And Navigation Boundaries

<!-- markdownlint-disable MD013 MD060 -->

| Use Case / Requirement                                                                                           | `SPECS.md` Section                                     | Slice      | Test File Or Validation Plan                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Build Flow Graph: normalized input produces deterministic host-neutral base graph DTOs                           | R1 and R4; AC1 and AC3                                 | Slice 1    | Passed: `buildFlowGraphUseCase.test.ts`, `buildFlowGraph.test.ts`, `flowGraphDocument.test.ts`, JSON round trip                   |
| Build Flow Graph: invalid document structure is unavailable and malformed relations are isolated with issues     | R1, R4, and R6; Failure Result Classification; AC3     | Slice 1    | Passed: duplicate identity/path, parent/depth/cycle, layout, relation isolation, missing scope, large input assertions            |
| Explore Flow Graph: tree, search, detail, selection, expansion state, and labels consume application DTOs        | R2 and R4; AC1-AC3                                     | Slice 2    | `flowSearch.test.ts`, `flowSelector.test.ts`, `flowNodeDetail.test.ts`, `flowGraphView.test.ts`, localization tests               |
| Build/Explore: flow and shared-tree presentation have zero domain imports and feature-owned allowances           | R2 and R4; AC2 and AC4                                 | Slice 2    | `architectureDependencyRules.test.ts`, exact allowlist validation, table shared-tree regression                                   |
| Build Flow Graph: visible nested set produces deterministic structure, placement constraints, and affected scope | R1, R2, R5, and R6; AC1-AC3                            | Slice 3    | application expanded-graph tests for action-order independence, containment, sibling order, affected scope, invalid-ID issues     |
| Explore Flow Graph: presentation geometry realizes constraints without overlap or observable coordinate drift    | R2 and R5; Compatibility; AC3                          | Slice 3    | split `buildExpandedFlowGraph.test.ts`, geometry/collision/panel tests, `flowViewportFocus.test.ts`, rendered coordinate fixtures |
| Navigate Between Views: stable path resolves flow scope, revealed unit, and required expanded ancestors          | R3, R4, and R6; Failure Result Classification; AC1-AC3 | Slice 4    | moved `revealUnit.test.ts`, `tableNavigation.test.ts`, root-jobnet/condition/nested/cycle/no-target tests                         |
| Navigate Between Views: counterpart opens/focuses and latest pending reveal is delivered after readiness         | R3 and R6; Compatibility; AC3                          | Slice 4    | `viewerEventBridge.test.ts`, `viewerMessageRouting.test.ts`, `viewerFactory.test.ts`, `viewerWiring.test.ts`                      |
| All three: graph/render/search/navigation telemetry and privacy remain compatible                                | Compatibility; AC3                                     | Slices 1-4 | performance, search, viewer action, viewer open/ready telemetry tests and emission-point inspection                               |
| All three: JP1/AJS, large/deep/malformed input, desktop/web, README/docs, and CHANGELOG risks are evaluated      | Compatibility; Failure Result Classification; AC3      | Slices 1-4 | per-slice Production Readiness evidence, `rtk pnpm test`, `rtk pnpm run test:web`, build, qlty, Feature Exit Review               |

<!-- markdownlint-enable MD013 MD060 -->

## Planned Evidence Status

- Slice 1 establishes the serialized flow document, reusable application index,
  typed issue results, and deterministic base graph contract. Desktop tests,
  web tests, production build, test compile, and qlty passed on 2026-07-21;
  human completion approval was recorded on 2026-07-22.
- Slice 2 will migrate flow exploration consumers and remove all owned
  presentation-domain allowances.
- Slice 3 will separate application placement constraints from presentation
  geometry while preserving expanded-layout fixtures.
- Slice 4 will establish the navigation target contract and preserve host
  open/focus/deferred-reveal behavior.
- Implementation and validation evidence is pending plan review, human
  approval, and slice execution.
