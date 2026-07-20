# Traceability: Migrate Unit Information Boundaries

<!-- markdownlint-disable MD013 -->

| Use Case / Requirement                                                                                        | `SPECS.md` Section                                    | Slice                       | Test File Or Validation Plan                                                                                  |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Show Unit Definition: raw text and commands come from normalized rules                                        | Requirements 3; Acceptance Criteria 1 and 3           | Slice 1                     | `buildUnitDefinition.test.ts`, command-builder tests, JSON round-trip tests                                   |
| Show Unit Definition: table and flow share content without changing navigation                                | Requirements 3 and 5; Compatibility                   | Slice 1                     | `showUnitDefinitionInteraction.test.ts`, `flowGraphView.test.ts`, focused controller/state tests              |
| Show Unit Definition: definition telemetry keeps view attribution and schema                                  | Requirements 3 and 5; Compatibility                   | Slice 1                     | `viewerActionTelemetry.test.ts`, focused table/flow interaction and message tests                             |
| View Unit List: deterministic normalized rows and metadata                                                    | Requirements 1; Acceptance Criteria 1 and 3           | Slice 2                     | `buildUnitList.test.ts`, `buildUnitListView.test.ts`, table viewer-data/search/navigation tests               |
| View Unit List: invalid input or malformed payload does not produce a partial complete list                   | Requirements 1 and 5; Compatibility                   | Slice 2                     | parser-error tests, malformed-payload tests, JSON round-trip tests                                            |
| View Unit List: UTF-8, Shift_JIS, and representative large definitions preserve rows and order                | Requirements 1 and 5; Compatibility                   | Slice 2                     | host-path encoding fixtures or recorded desktop smoke evidence; generated/fixture large-definition regression |
| View Unit List: desktop/web shape and unit-list/table-render telemetry remain compatible                      | Requirements 1 and 5; Acceptance Criteria 1           | Slice 2                     | `AjsDocument.test.ts`, focused table telemetry tests, `rtk pnpm test`, `rtk pnpm run test:web`, build         |
| View Unit List: removed table domain dependencies have no stale exact allowances                              | Requirements 4; Acceptance Criteria 2                 | Slice 2                     | `architectureDependencyRules.test.ts`, exact allowlist validation                                             |
| Export Unit List CSV: plain visible-row/column contract preserves order and escaping                          | Requirements 2 and 4; Acceptance Criteria 1 and 3     | Slice 3                     | `exportUnitListCsv.test.ts`, `exportCsvView.test.ts`, large visible-row/column regression                     |
| Export Unit List CSV: copy/save and CSV telemetry remain compatible on desktop/web                            | Requirements 2 and 5; Compatibility                   | Slice 3                     | `viewerMessageRouting.test.ts`, `viewerActionTelemetry.test.ts`, desktop/web validation                       |
| All three: application decisions contain no raw, wrapper, parser, React, TanStack, or host types              | Requirements 4; Acceptance Criteria 2                 | Slices 1-3                  | type/contract inspection, architecture dependency suite, qlty                                                 |
| View List and Show Definition: presentation owns localization and consumes application DTOs                   | Requirements 1, 3, and 4; Acceptance Criteria 1 and 2 | Slice 4                     | English/Japanese/fallback label tests, column/dialog tests, architecture dependency suite                     |
| All three: remaining feature-owned presentation-domain allowances reach zero                                  | Acceptance Criteria 2                                 | Slice 4                     | `architectureDependencyRules.test.ts` and stale allowlist validation                                          |
| All three: JP1/AJS, malformed/large input, desktop/web, README/docs, CHANGELOG, and telemetry risks evaluated | Compatibility; Acceptance Criteria 3                  | Slices 1-4 and Feature Exit | per-slice Production Readiness evidence, integrated review, Feature Exit Review                               |

<!-- markdownlint-enable MD013 -->

## Slice 1 Implementation Evidence

- Status: complete; implementation, required validation, final review, and
  human completion approval are recorded.
- Shared definition contract: `buildUnitDefinitions` adds plain definition
  DTOs to the existing normalized document payload, and
  `toUnitDefinitionByPath` validates and indexes that same payload for table
  and flow consumers.
- Regression evidence: `buildUnitDefinition.test.ts`,
  `buildUnitList.test.ts`, `AjsDocument.test.ts`,
  `showUnitDefinitionInteraction.test.ts`, `flowGraphView.test.ts`, and
  `flowNodeDetail.test.ts`, `unitDefinitionDocumentState.test.ts`, and
  `viewerActionTelemetry.test.ts` cover raw order, command defaults, JSON
  round-trip, malformed or missing definitions, shared table/flow state and
  path lookup, safe graph rendering and action omission, and unchanged
  table/flow definition telemetry.
- Validation result: `rtk pnpm test`, `rtk pnpm run test:web`,
  `rtk pnpm run build`, and `rtk pnpm run qlty` passed on 2026-07-20.
- Build note: production build reported only the repository's existing bundle
  size warnings; no new build error or host-specific dependency was found.

## Slice 2 Implementation Evidence

- Status: complete; implementation, required validation, final review, and
  human completion approval are recorded.
- Unit-list contract: `buildUnitListProjection` produces deterministic plain
  rows and unit metadata, and `toUnitListTableData` validates and indexes the
  serialized payload without reconstructing domain objects in the table.
- Failure behavior: malformed, reordered, duplicate, or incomplete projection
  data is rejected as an empty table state instead of exposing a partial list;
  the flow payload and definition lookup remain available independently.
- Regression evidence: `buildUnitList.test.ts`,
  `buildUnitListView.test.ts`, `AjsDocument.test.ts`,
  `unitDefinitionDocumentState.test.ts`, `tableViewerData.test.ts`,
  `ajsTableGlobalFilter.test.ts`, `tableNavigation.test.ts`,
  `tableSearchState.test.ts`, `tableRenderTelemetry.test.ts`, and
  `unitListEncoding.test.ts` cover projection shape and order, JSON round-trip,
  search and selection metadata, complete malformed-field and cross-projection
  consistency rejection, table-render telemetry buckets, a generated
  500-child definition, and UTF-8/Shift_JIS input read through the VS Code
  desktop host path.
- Architecture evidence: the table no longer imports `AjsDocument`, `AjsUnit`,
  or `AjsParameter`, performs domain reconstruction, or traverses domain
  objects. The four approved exact allowlist entries were removed, and the
  architecture dependency suite passed.
- Compatibility evidence: existing unit-list build telemetry remains covered
  by `AjsDocument.test.ts`; `tableRenderTelemetry.test.ts` fixes the existing
  table-render operation, result, duration bucket, and row-count bucket schema.
  Desktop and web validation found no Node-only dependency in shared execution
  paths.
- Validation result: `rtk pnpm test`, `rtk pnpm run test:web`,
  `rtk pnpm run build`, and `rtk pnpm run qlty` passed on 2026-07-20.
- Build note: production build reported only the repository's existing bundle
  size warnings; no new build error or compatibility change was found.

## Slice 3 Implementation Evidence

- Status: complete; implementation, required validation, final review, and
  human completion approval are recorded.
- CSV contract: `exportUnitListCsv` accepts only plain header rows and visible
  row values. The application use case owns one-based numbering, quoting,
  escaping, and CSV assembly; `toExportUnitListCsvInput` keeps TanStack column
  visibility/order, header extraction, accessor evaluation, and cell
  stringification in presentation.
- Regression evidence: `exportUnitListCsv.test.ts` covers ordering, numbering,
  quotes, multiline and empty values, empty/header-only output, and a generated
  500-row by 20-column export. `exportCsvView.test.ts` covers Slice 2 rows,
  visible reordered columns, placeholders, arrays, undefined values, JSON
  round-trip, and identical copy/save pipeline output.
- Telemetry evidence: `csvExportTelemetry.test.ts`,
  `viewerMessageRouting.test.ts`, and `viewerActionTelemetry.test.ts` preserve
  `csv_export`, `copy.csv`, and `save.csv` event names, properties, buckets,
  routing, and existing emission points without adding content or path data.
- Validation result: `rtk pnpm test`, `rtk pnpm run test:web`,
  `rtk pnpm run build`, and `rtk pnpm run qlty` passed on 2026-07-21.
- Production evidence: processing and memory remain proportional to visible
  rows and columns with no domain-tree traversal; the shared implementation
  introduces no Node-only API or dependency. Production build reported only
  the repository's existing bundle-size warnings.
- Implementation feedback: the approved adapter/use-case boundary was
  sufficient and required no replanning or new dependency. The durable CSV use
  case already records the reusable contract, so no additional long-lived
  documentation or CHANGELOG entry is needed.
