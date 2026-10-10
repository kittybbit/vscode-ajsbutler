# Requirements Traceability: Schedule Projection Facts Cohesion

<!-- markdownlint-disable MD013 MD060 -->

| Requirement or source                           | Slice                                                   | Test or validation                                                                                                                                                                |
| ----------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1, R6: meaningful ownership                    | S1 Run; S2 Issue with retained Root assembly            | Solution Shape independent review; V1 zero-exception architecture catalog, assessed separately                                                                                    |
| R2: DTO/aliases/IDs/order/duplicate identity    | S1 runs; S2 issues                                      | `semanticDiffScheduleImpact.test.ts`: direct aliases, last-hit indexes, candidates, UTF-8 IDs, duplicate/nested pairing and shuffled issues; V1/V3/V4                             |
| R3: facts states/outcomes/scope/evidence        | S1 no-runs; S2 evaluated/invalid issues and final links | `compareSemanticDiffWithArtifacts.test.ts`: state/scope/no-runs/nested/duplicate cases, extended final root/status/issue consistency; issue classification in impact suite; V1/V3 |
| R4: one evaluation/exact references/fail-closed | S1 and S2 preservation                                  | Comparison artifacts single-evaluation pipeline review; existing missing-row and source composite/count-mismatch tests in artifact/impact suites; V1/V3 WEB-13                    |
| R5: immutable host-neutral output               | S1 populated runs; S2 populated/invalid issue details   | Extended public-boundary mutation isolation and freezing in impact/artifact suites; V1 architecture, V2 desktop, V3 web, V4 both bundles                                          |
| Build Semantic Diff                             | S1 and S2                                               | Existing `semanticDiffScheduleRules.test.ts` and artifact contracts, half-open periods and explicit unsupported meanings; V1                                                      |
| Present Schedule Impact                         | S1 and S2                                               | Impact contracts and V3 existing browser WEB-13 artifact equivalence                                                                                                              |
| Present Semantic Diff Report                    | S1 and S2 preservation                                  | Unchanged comparison DTOs/result and no extra evaluation, direct alias checks; artifact suite and V2/V3 integration                                                               |
| Quality and compatibility                       | S1 and S2                                               | V5 exact per-slice qlty observations/aggregate; unchanged VS Code 1.75 and JP1/AJS3 v13; V1–V4                                                                                    |

<!-- markdownlint-enable MD013 MD060 -->

V1–V5 are defined in [TASKS](TASKS.md#required-validation-and-evidence-contract).
S1 executed evidence is indexed in [TASKS](TASKS.md#slice-s1-run-projection):
V1 has 68 passing public-contract/schedule/architecture tests, V2 has 1193
passing desktop tests, V3 passes including WEB-13, and V4 builds both bundles.
R5 now includes populated child-run freezing and producer mutation isolation
in the existing last-hit/nested fixture. V5 observations/aggregate and its
measured duplication advisory are retained for independent review. F1 repeats
on exact unchanged snapshots reproduce 15/17 within both baseline and final;
only affected smells evidence and coordination validation were refreshed. S2-specific
issue/detail/final-link extensions remain pending. These are validation facts,
not independent ownership judgment or Completion Approval.
