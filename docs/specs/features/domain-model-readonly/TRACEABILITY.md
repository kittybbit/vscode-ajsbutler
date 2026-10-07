# Requirements Traceability: domain-model-readonly

<!-- markdownlint-disable MD013 MD060 -->

| Requirement or source | Slice | Test or validation |
| --- | --- | --- |
| R1: readonly parameter/relation/warning/layout values | S1 | AjsReadonlyContracts compile-only direct/nested/optional/Flow alias writes; parser/normalization and DTO suites |
| R1: readonly normalized document and recursive unit collections/properties | S2 | AjsReadonlyContracts document/unit/array writes, readonly inputs and helper/parser/schedule aliases; full TypeScript checks |
| R1: readonly normalized index Maps and bucket exposure | S3 | AjsReadonlyContracts index properties, Map/bucket/nested writes and calendar/indexUnits exposure; AjsDocumentIndex |
| R2: controlled construction and alias ownership | S1, S2, S3 | Retained planning discovery; positive builder buffers; S2 normalized fixture construction including unitListViewHelpers priority inheritance; DTO mutation/serialization remains valid |
| R3: Normalize AJS Document identity/order/raw/source/warnings/navigation | S1, S2 | AntlrAjsParser, normalizeAjsDocument, normalizeUnit, normalizeUnitTree, normalizeUnitBuilder, normalizeRelations, normalizeWarnings, AjsUnitState, unitEdgeHelpers; AjsDocumentModel lookup/first-hit/repeated/order/reference/owned-result assertions; existing consumer assertions |
| R3: duplicate buckets, shared references, unique/occurrence traversal | S2, S3 | AjsDocumentIndex 20,000-deep/4,096-wide/duplicates/cycles/occurrences; semanticDiffScheduleCalendar; semanticDiffScheduleImpact |
| R4: view unit list, export CSV, show unit definition | S1, S2 | Full desktop suite: buildUnitList and group projections, exportUnitListCsv/exportCsvView, buildUnitDefinition, unitListViewHelpers unchanged priority/parent-inheritance assertions, Table/DTO boundaries; webSmoke |
| R4: build/explore flow and list/flow navigation | S1, S2 | buildFlowGraphUseCase, buildExpandedFlowGraphUseCase, flowGraphDocument, nestedExpansion, navigation/viewer suites; webSmoke |
| R4: diagnose definition and show parameter hover | S1, S2 | Syntax diagnostic/rule and hover suites in desktop selection; webSmoke diagnostics/hover |
| R4: semantic comparison/report and schedule impact | S1, S2, S3 | Changed semantic fixture suites; schedule, compareSemanticDiff, contracts, presentation-artifact, schedule-impact, report/JSON suites in desktop selection |
| R4: WebAPI import and telemetry | S1, S2, S3 | Existing WebAPI adapter/import and telemetry boundary suites in full desktop selection; desktop-only beta and privacy unchanged |
| R5: desktop/web, VS Code minimum and architecture | S1, S2, S3 | Both TypeScript checks; full desktop run including architectureDependencyRules; Chromium web smoke; both preparations and production build; unchanged engines ^1.75.0 |
| R5: supported desktop host validation and preserved parser/resource ownership | S2 | Official test SDK 3.1.0 public API mapping, platform-neutral launcher, Node-22 package/CI/contributor agreement and frozen lock installation; actual full desktop test inventory/counts/results, controlled nonzero suite-load failure probe, isolated/restored test globals, parser/normalizer, nls, tableColumnDef, extensionDependencies/telemetry, architecture catalog, web smoke and both builds |
| Required quality/evidence policy | S1, S2, S3 | Exact baseline/final qlty official SARIF observations, final aggregate, required commands/identities and independent reviews in TASKS; current-head Cloud at exit |
| Planning documentation | Not applicable | Selected Markdown lint, local links/structure/scope/state/traceability/approval inspection and diff checks; TASKS plan artifact |

<!-- markdownlint-enable MD013 MD060 -->
