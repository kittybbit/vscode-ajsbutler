# Requirements Traceability: Semantic Diff Schedule Simulation Removal

<!-- markdownlint-disable MD013 -->

| Requirement or source | Slice | Test or validation |
| --------------------- | ----- | ------------------ |
| R1; compare definitions UC | S2 | semanticDiffCommand, buildSemanticDiffReportData, source capture; file/Git HEAD, no date prompts, cancellation/rollback; webSmoke and minimum host |
| R2; build semantic diff UC | S2 | Exact deletion inventory; compareSemanticDiff, semanticDiffConditions; retired computation/import search |
| R3; retiring schedule impact UC | S1 then S2 | S1 deletes calendar suites/entry/assets/sidecars/UC, validates ordinary Explorer; S2 deletes remaining application projection artifacts |
| R4; report UC | S2 | semanticDiffJson v2, renderSemanticDiffMarkdown, semanticDiffMarkdownProjections, semanticDiffOutput, Explorer projection/messages/components; no simulation fields/status |
| R5; definition schedule category | S2 | compareSemanticDiff and retained structural/evidence/condition suites; schedule attributes without period, identity/candidates/relations, source/Flow/report boundary regressions |
| R6; parameter/list/diagnostic contracts | S2 | scheduleRuleHelpers, buildUnitList, buildSyntaxDiagnostics, evaluateScheduleDiagnosticViolations; full parser/list/CSV/hover/navigation coverage; retained ScheduleDate/Rule |
| R7; validation policy | S1, S2 | Exact physical deletion lists; retained mixed suites and migrated artifact adapter invariants; sharedResultPresentation; full desktop/web suites |
| R8; architecture Solution Shape | S1, S2 | Zero-exception architectureDependencyRules, updated architectureSemanticDiffOwnership, semantic ownership review, full-repo qlty comparisons/aggregate |
| R9; roadmap/usecases/durable docs | S1, S2 | S1 deletes schedule-impact UC/index entry; S2 removes Deferred Schedule Semantics and predictive clauses; Markdown/link/structure plus broader durable qlty tier and CHANGELOG |
| Compatibility and privacy | S1, S2 | test:full, test:desktop:min, clean production build, bundle inventory, engines.vscode identity/Node scan, existing telemetry allowlist/error suites |
| All requirements; selected-feature planning docs | Not applicable | Changed-doc Markdown/link/structure/inventory/scope/traceability/state/approval/diff validation |

<!-- markdownlint-enable MD013 -->
