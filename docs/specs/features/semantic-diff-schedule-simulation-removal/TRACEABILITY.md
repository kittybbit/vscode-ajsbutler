# Requirements Traceability: Semantic Diff Schedule Simulation Removal

<!-- markdownlint-disable MD013 -->

| Requirement or source                            | Slice          | Test or validation                                                                                                                                                                |
| ------------------------------------------------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1; compare definitions UC                       | S2             | semanticDiffCommand, buildSemanticDiffReportData, source capture; file/Git HEAD, no date prompts, cancellation/rollback; webSmoke and minimum host                                |
| R2; build semantic diff UC                       | S2             | Exact deletion inventory; compareSemanticDiff, semanticDiffConditions; retired computation/import search                                                                          |
| R3; retiring schedule impact UC                  | S1 then S2     | S1 deletes calendar suites/entry/assets/sidecars/UC, validates ordinary Explorer; S2 deletes remaining application projection artifacts                                           |
| R4; report UC                                    | S2             | semanticDiffJson v2, renderSemanticDiffMarkdown, semanticDiffMarkdownProjections, semanticDiffOutput, Explorer projection/messages/components; no simulation fields/status        |
| R5; definition schedule category                 | S2             | compareSemanticDiff and retained structural/evidence/condition suites; schedule attributes without period, identity/candidates/relations, source/Flow/report boundary regressions |
| R6; parameter/list/diagnostic contracts          | S2             | scheduleRuleHelpers, buildUnitList, buildSyntaxDiagnostics, evaluateScheduleDiagnosticViolations; full parser/list/CSV/hover/navigation coverage; retained ScheduleDate/Rule      |
| R7; validation policy                            | S1, S2         | Exact physical deletion lists; retained mixed suites and migrated artifact adapter invariants; sharedResultPresentation; full desktop/web suites                                  |
| R8; architecture Solution Shape                  | S1, S2         | Zero-exception architectureDependencyRules, updated architectureSemanticDiffOwnership, semantic ownership review, full-repo qlty comparisons/aggregate                            |
| R9; roadmap/usecases/durable docs                | S1, S2         | S1 deletes schedule-impact UC/index entry; S2 removes Deferred Schedule Semantics and predictive clauses; Markdown/link/structure plus broader durable qlty tier and CHANGELOG    |
| Compatibility and privacy                        | S1, S2         | test:full, test:desktop:min, clean production build, bundle inventory, engines.vscode identity/Node scan, existing telemetry allowlist/error suites                               |
| All requirements; selected-feature planning docs | Not applicable | Changed-doc Markdown/link/structure/inventory/scope/traceability/state/approval/diff validation                                                                                   |

<!-- markdownlint-enable MD013 -->

S2 Registry amendment maps R3/R8 to removal of its obsolete schedule leaf union
and target/side branches, preserving ordinary and attribute source mapping.
Existing Registry, Source/Flow/Panel and full host checks retain coverage;
exact amendment evidence: `/tmp/ajs-removal-s2-registry-replan/evidence.json`.

S1 implementation maps R3, R7, R8 and R9 to the calendar deletion inventory,
ordinary Explorer source/context integration and retained strict-action tests.
Validation artifacts: `/tmp/ajs-removal-s1/evidence.json`. S2 requirements
are implemented below and await independent review.

S2 residual amendment maps R3/R4/R8/R9 to removal of the dead schedule leaf rank
and README period/prediction/calendar promises. Retained Explorer ordering and
review actions use existing projection/host tests; README needs explicit Markdown,
local-link and structure coverage in the unchanged broader durable validation tier.
Combined amendment evidence: `/tmp/ajs-removal-s2-residual-replan/evidence.json`.

S2 implementation maps R1/R2/R4/R5/R6/R7/R8/R9 to the complete prediction
removal, schema 2 serializers, period-free capture/report/Explorer workflow,
retained definition schedule/list/diagnostic tests and durable-document cleanup.
R3 is completed by removal of remaining projection/artifact contracts and dead
leaf branches. Final desktop 1032 tests, web smoke, minimum VS Code 1.75.0,
production build, zero-exception architecture suites and changed-doc checks pass.
Full baseline/final quality observations have no new findings or smells; the
aggregate passes. Exact paths, inventories, identities and raw validation records:
`/tmp/ajs-removal-s2/evidence.json`. Independent S2 review is pending.


The S2 review Correction Loop closes the R8 obsolete source-binding chain and
R3/R4 prediction-only changed-time label findings in four existing approved
production files. Active workflow source/Git rollback, release, Registry/Flow,
Explorer and localization boundaries pass in corrected desktop/web coverage.
Complete corrected patch and exact reusable facts:
`/tmp/ajs-removal-s2/correction/evidence.json`. Fresh independent review is pending.
