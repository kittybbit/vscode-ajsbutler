# Traceability: Complete Normalized Domain Model

<!-- markdownlint-disable MD013 -->

| Use Case / Requirement               | Requirement                                                                                                                    | `SPECS.md` Section                        | Slice          | Test File Or Validation Plan                                                                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Normalize AJS Document               | Deterministic identity, hierarchy, parameter/source evidence, relation/warning behavior, and shared normalized unit state      | Requirements; Architecture; Compatibility | Slice 1        | `AjsDocument.test.ts`; normalization unit/tree/document/relation/warning suites; focused deep, duplicate, missing-source, and malformed fixtures |
| View Unit List; Export Unit List CSV | Table rendering, search, and CSV consume the existing primitive application row contract without legacy `Parameter` fallback   | Requirements; Acceptance Criteria         | Slice 2        | `tableColumnDef.test.ts`; `ajsTableGlobalFilter.test.ts`; `exportCsvView.test.ts`; `buildUnitListView.test.ts`; desktop/web regression           |
| All normalized-model consumers       | Downstream application behavior remains on `AjsDocument` / `AjsUnit` while wrapper-only APIs are not recreated                 | Requirements; Acceptance Criteria         | Slice 3        | wrapper import inventory; retained normalized/application tests; full desktop/web/build validation                                               |
| Architecture guardrail               | Classify and remove all 88 exact `legacy-wrapper-dependency` edges with no unexplained, stale, or replacement wildcard entry   | Acceptance Criteria                       | Slices 1 and 3 | `architectureDependencyRules.test.ts`; Slice 1 exact 80-entry baseline; final `rtk rg` zero-dependency evidence                                  |
| Behavior-preserving migration        | Preserve JP1/AJS3 version 13 interpretation, malformed/large input handling, minimum VS Code compatibility, and browser safety | Compatibility                             | Slices 1-3     | focused parity per slice; `rtk pnpm run qlty`; `rtk pnpm test`; `rtk pnpm run test:web`; final `rtk pnpm run build`                              |

## Deferred Consumer Boundaries

- Unit-list/CSV/definition DTO redesign remains owned by
  `migrate-unit-information-boundaries`; only its obsolete `Parameter` fallback is
  removed here.
- Flow/navigation, diagnostics/hover, WebAPI, semantic-diff/report, telemetry, and
  serialization/composition work remains with the corresponding roadmap features.

## Slice 1 Implementation Evidence

- Normalized ownership: `AjsUnitState.test.ts` passed all three focused domain-state
  cases; normalization identity, hierarchy, source evidence, relation, and warning
  suites passed in the desktop and web test runs on 2026-07-20.
- Architecture guardrail: the focused architecture assertion passed with 80 exact
  `legacy-wrapper-dependency` violations, 80 matching allowances, 139 total
  allowances, and no unexplained or stale entry.
- Final validation: `rtk pnpm run qlty`, `rtk pnpm test`, and
  `rtk pnpm run test:web` completed successfully.
