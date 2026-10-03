# Requirements Traceability: Semantic Diff Schedule Facade

<!-- markdownlint-disable MD013 -->

| Requirement or source | Slice | Test or validation | S1 result |
| --- | --- | --- | --- |
| R1, R6; roadmap item 1; architecture | S1 | Facade contract characterization; `ScheduleProjectionUnits.test.ts`; independent Solution Shape/thinness review; `architectureDependencyRules.test.ts` | Owner tests and architecture checks pass; independent review pending. |
| R2; Build Semantic Diff periods | S1 | `semanticDiffScheduleRules.test.ts`; `SchedulePeriod.test.ts`; batch invalid/low-year coverage | Targeted owner suite passes; selective in-host repair pending. |
| R3; calendar and direct selection | S1 | `ScheduleProjectionUnits.test.ts`; `semanticDiffScheduleCalendar.test.ts`; sc-only/type eligibility characterization | Targeted owner suite passes; web smoke WEB-11/12 passes. |
| R4; completeness, pair counts, rule zero | S1 | `semanticDiffScheduleRules.test.ts`; `semanticDiffSchedule.test.ts`; optional-property/alias characterization | Targeted owner suite passes; selective in-host repair pending. |
| R5; canonical/duplicate correspondence | S1 | `semanticDiffScheduleRules.test.ts`; `semanticDiffSchedule.test.ts`; multi-unit/moved-path ordering characterization | Targeted owner suite passes; selective in-host repair pending. |
| Build Semantic Diff; report and schedule-impact contracts | S1 | `semanticDiffJson.test.ts`; `semanticDiffMarkdownProjections.test.ts`; `renderSemanticDiffMarkdown.test.ts`; `semanticDiffScheduleImpact.test.ts`; `semanticDiffFlowHighlights.test.ts` | Standalone load failed; same five suites plus comparison/command/wiring contracts require selective actual in-host pass. Result unknown. |
| Desktop/web and VS Code compatibility | S1 | Conditional desktop baseline/selective in-host suites and web smoke; production desktop/web build; unchanged engines; architecture Node-import rules | Web smoke WEB-7–13 and build pass; original desktop suite failed/hung; matching baseline and selective host coverage pending. `engines.vscode` unchanged; architecture checks pass. |
| Quality and evidence contract | S1 | Matched full-repository qlty SARIF observations and final aggregate; content/config/dependency identities; current-head Qlty Cloud at Exit | No new mapped findings and aggregate pass retained; complete smells analyzed-path inventory repair required; Cloud remains for Exit. |

<!-- markdownlint-enable MD013 -->
