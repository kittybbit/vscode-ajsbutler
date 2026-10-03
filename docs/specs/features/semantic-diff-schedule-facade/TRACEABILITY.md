# Requirements Traceability: Semantic Diff Schedule Facade

<!-- markdownlint-disable MD013 -->

| Requirement or source | Slice | Test or validation | S1 result |
| --- | --- | --- | --- |
| R1, R6; roadmap item 1; architecture | S1 | Facade contract characterization; `ScheduleProjectionUnits.test.ts`; independent Solution Shape/thinness review; `architectureDependencyRules.test.ts` | Owner tests and architecture checks pass; independent review pending. |
| R2; Build Semantic Diff periods | S1 | `semanticDiffScheduleRules.test.ts`; `SchedulePeriod.test.ts`; batch invalid/low-year coverage | Targeted owner suite passes; owner coverage also passed in actual host; aggregate host gate failed on five downstream/command assertions. |
| R3; calendar and direct selection | S1 | `ScheduleProjectionUnits.test.ts`; `semanticDiffScheduleCalendar.test.ts`; sc-only/type eligibility characterization | Targeted owner suite passes; web smoke WEB-11/12 passes. |
| R4; completeness, pair counts, rule zero | S1 | `semanticDiffScheduleRules.test.ts`; `semanticDiffSchedule.test.ts`; optional-property/alias characterization | Targeted owner suite passes; owner coverage also passed in actual host; aggregate host gate failed on five downstream/command assertions. |
| R5; canonical/duplicate correspondence | S1 | `semanticDiffScheduleRules.test.ts`; `semanticDiffSchedule.test.ts`; multi-unit/moved-path ordering characterization | Targeted owner suite passes; owner coverage also passed in actual host; aggregate host gate failed on five downstream/command assertions. |
| Build Semantic Diff; report and schedule-impact contracts | S1 | `semanticDiffJson.test.ts`; `semanticDiffMarkdownProjections.test.ts`; `renderSemanticDiffMarkdown.test.ts`; `semanticDiffScheduleImpact.test.ts`; `semanticDiffFlowHighlights.test.ts` | Actual 15-suite host run: 177 passing, 5 failing; two Markdown projection failures, one rendered Markdown failure, one exact comparison failure and one command cancellation failure. Required gate failed; exact-five baseline characterization and baseline177 common outcomes match; four-file test repair pending; failed required check remains blocking until repaired all15 pass. |
| Desktop/web and VS Code compatibility | S1 | Conditional desktop baseline/selective in-host suites and web smoke; production desktop/web build; unchanged engines; architecture Node-import rules | Web smoke WEB-7–13 and build pass; original desktop suite failed/hung; paired baseline/final each 0 passing/7 failing with matching signatures and unchanged failing imports; inherited owners assigned. Conditional 15-suite host gate failed: 177 passing/5 failing, exit 1; all suites/assertions retained; baseline177 common outcomes match; repaired all15 exit0 required. `engines.vscode` unchanged; architecture checks pass. |
| Existing report localization/escaping, root scope and file-source workflow | S1 test repair | Four exact test files; original fallback source picker/period-reference assertions; immutable baseline/full-content golden provenance across 30 cases; unchanged all15 in-host coverage | Proposed four-file boundary requires renewed review/approval; no production behavior change or failed-check waiver. |
| Quality and evidence contract | S1 | Matched full-repository qlty SARIF observations and final aggregate; content/config/dependency identities; current-head Qlty Cloud at Exit | No new mapped findings and aggregate pass retained; smells inventory repaired: 433 distinct paths per snapshot, matching two analysis passes and 151 counterpart findings; localization measurement orientation advisory; Cloud remains for Exit. |

<!-- markdownlint-enable MD013 -->

Bounded baseline investigation executed all14 existing suites:177 tests,172
passing,5 failing,exit1. All177 common outcomes and five exact failures match
retained final182; final-only4 owner tests and1 Rules characterization pass.
See [investigation record](/private/tmp/ajsbutler-semantic-diff-schedule-facade/validation-repair/five-investigation.md).
This comparison does not pass the required failed gate; separate Main repair
or reviewed expressly authorized gate decision remains required.

Approved test repair captures30 immutable baseline/final equal full outputs;
actual15 host182 cases reached180 passing/2 failing. Japanese escaped-key edit
followed without revalidation; command optional-picker workflow scope needs
Replanning. Required gate remains failed; repair record retains exact input
identities and pending quality/final coverage.
