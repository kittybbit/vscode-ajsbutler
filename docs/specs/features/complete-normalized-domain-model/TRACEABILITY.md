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

## Slice 2 Implementation Evidence

- Primitive accessor contract: `tableColumnDef.test.ts` exercised every leaf accessor
  against normalized `UnitListRowView` rows and rejected non-primitive values or array
  elements.
- Presentation behavior: `ajsTableGlobalFilter.test.ts` and `exportCsvView.test.ts`
  preserved rendered-value search, parameter-value search, multiline cells, array
  joining, CSV escaping, header order, and output content.
- Architecture guardrail: all three obsolete `Parameter` imports and their exact
  allowances are absent; 54 presentation-domain violations match the remaining 136
  total allowances with no validation error.
- Final validation: `rtk pnpm run qlty`, `rtk pnpm test`, and
  `rtk pnpm run test:web` completed successfully on 2026-07-20.

## Slice 3 Implementation Evidence

- Wrapper retirement: production and test imports of `UnitEntity`,
  `LegacyUnitSource`, typed unit wrappers, `ParamFactory`, `tyFactory`, wrapper
  priority, and wrapper relation traversal are absent. The wrapper-only source and
  test graph was removed without a replacement compatibility API.
- Preserved rules: normalized unit-state, encoded-string, schedule, relation-edge,
  parameter-default, HTTP execution-user default, job-end judgment, transfer-operation,
  list, flow, diagnostics, and semantic-diff coverage passed through focused and full
  suites. Pure default and transfer-operation assertions were moved out of wrapper
  suites before deletion.
- Architecture guardrail: zero `legacy-wrapper-dependency` production violations and
  allowances remain; the 54 presentation and two Node/browser allowances account for
  all 56 remaining entries with no unexplained or stale allowance.
- Final validation: `rtk pnpm run qlty`, `rtk pnpm test`,
  `rtk pnpm run test:web`, and `rtk pnpm run build` completed successfully on
  2026-07-20. Production build emitted only the existing bundle-size warnings.
