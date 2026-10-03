# Requirements Traceability: semantic-diff-application-projection

<!-- markdownlint-disable MD013 MD060 -->

S1 implementation results and exact baseline/final identities are retained in
[the implementation evidence artifact](/private/tmp/ajsbutler-semantic-diff-application-projection-s1/evidence.md).
The architecture test result records catalog facts; module cohesion and semantic
ownership remain independent reviewer judgments.

| Requirement or source                                  | Slice | Test or validation                                                                                                                                                                   |
| ------------------------------------------------------ | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R1; roadmap item 1; architecture Solution Shape        | S1    | Five application owners; acyclic dependency facts pass `architectureDependencyRules.test.ts`; semantic ownership is for independent review                                           |
| R2; Build Semantic Diff single-comparison projection   | S1    | `compareSemanticDiffWithArtifacts.test.ts` and `semanticDiffPresentationArtifacts.test.ts` pass; one-pass factory and retained evaluation unchanged                                  |
| R3; identity and Present Schedule Impact IDs/order     | S1    | `semanticDiffScheduleImpact.test.ts` passes 15/15; UTF-8/numeric IDs, legacy/canonical identity, candidate ambiguity, side-local indexes, pairing, scopes, immutability and ordering |
| R4; supported/uncalculated and exact source references | S1    | Schedule-impact and comparison-artifact tests pass; fail-closed rows, occurrence ownership, invalid/not-requested/evaluated and valid-no-runs/partial/missing-context covered        |
| R5; existing presentation/report/host meaning          | S1    | Host-neutral selection passes 102/102; paired VS Code Electron selection passes 137/137 baseline and 139/139 final across all 17 listed suites; web smoke passes                     |
| R6; architecture and JP1/AJS desktop/web compatibility | S1    | Architecture/type checks, desktop/web preparation, web smoke and both production builds pass; qlty scan/aggregate results and `^1.75.0` compatibility are in the linked artifact     |

<!-- markdownlint-enable MD013 MD060 -->
