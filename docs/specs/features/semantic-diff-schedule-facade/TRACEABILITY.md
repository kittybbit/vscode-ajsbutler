# Requirements Traceability: Semantic Diff Schedule Facade

<!-- markdownlint-disable MD013 -->

| Requirement or source | Slice | Test or validation |
| --- | --- | --- |
| R1, R6; roadmap item 1; architecture | S1 | Facade contract characterization; `ScheduleProjectionUnits.test.ts`; independent Solution Shape/thinness review; `architectureDependencyRules.test.ts` |
| R2; Build Semantic Diff periods | S1 | `semanticDiffScheduleRules.test.ts`; `SchedulePeriod.test.ts`; batch invalid/low-year coverage |
| R3; calendar and direct selection | S1 | `ScheduleProjectionUnits.test.ts`; `semanticDiffScheduleCalendar.test.ts`; sc-only/type eligibility characterization |
| R4; completeness, pair counts, rule zero | S1 | `semanticDiffScheduleRules.test.ts`; `semanticDiffSchedule.test.ts`; optional-property/alias characterization |
| R5; canonical/duplicate correspondence | S1 | `semanticDiffScheduleRules.test.ts`; `semanticDiffSchedule.test.ts`; multi-unit/moved-path ordering characterization |
| Build Semantic Diff; report and schedule-impact contracts | S1 | `semanticDiffJson.test.ts`; `semanticDiffMarkdownProjections.test.ts`; `renderSemanticDiffMarkdown.test.ts`; `semanticDiffScheduleImpact.test.ts`; `semanticDiffFlowHighlights.test.ts` |
| Desktop/web and VS Code compatibility | S1 | Existing desktop full suite and web smoke; production desktop/web build; unchanged engines; architecture Node-import rules |
| Quality and evidence contract | S1 | Matched full-repository qlty SARIF observations and final aggregate; content/config/dependency identities; current-head Qlty Cloud at Exit |

<!-- markdownlint-enable MD013 -->
