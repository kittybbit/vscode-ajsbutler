# Requirements Traceability: semantic-diff-application-projection

<!-- markdownlint-disable MD013 MD060 -->

| Requirement or source | Slice | Test or validation |
| --- | --- | --- |
| R1; roadmap item 1; architecture Solution Shape | S1 | Five application owners and acyclic boundaries reviewed; architectureDependencyRules.test.ts verifies its catalog only |
| R2; Build Semantic Diff single-comparison projection | S1 | compareSemanticDiffWithArtifacts.test.ts; semanticDiffPresentationArtifacts.test.ts; unchanged one-pass factory and retained evaluation |
| R3; identity and Present Schedule Impact IDs/order | S1 | semanticDiffScheduleImpact.test.ts: UTF-8/numeric IDs, aliases/canonical exports, candidate ambiguity, side-local indexes, nested/duplicate pairing, scopes, immutability, ordering |
| R4; supported/uncalculated and exact source references | S1 | semanticDiffScheduleImpact.test.ts and compareSemanticDiffWithArtifacts.test.ts: fail-closed rows, occurrence ownership, invalid/not-requested/evaluated, valid-no-runs/partial/missing-context |
| R5; existing presentation/report/host meaning | S1 | semanticDiffPresentationArtifacts, semanticDiffContracts, semanticDiffJson, semanticDiffMarkdownProjections, calendar projection/transport/bridge/session/sidecar tests; Explorer and command schedule-impact, panel/session runtime tests; web smoke |
| R6; architecture and JP1/AJS desktop/web compatibility | S1 | Architecture dependency catalog; TypeScript checks; desktop preparation/host suites, web preparation/smoke, both production bundles; paired qlty SARIF and final aggregate; unchanged ^1.75.0 and domain schedule facade |

<!-- markdownlint-enable MD013 MD060 -->
