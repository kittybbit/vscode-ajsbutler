# Requirements Traceability: Architecture Test Cohesion

<!-- markdownlint-disable MD013 -->

| Requirement or source                                      | Slice  | Test or validation                                                                                                |
| ---------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| Roadmap item 1; R1 cohesive responsibilities               | S1, S2 | Solution Shape: source analysis, repository collection, policy evaluation; analysis/ownership/general suites      |
| R2 twelve catalog rules and zero exceptions                | S1, S2 | Original rule-family fixtures and zero-production gate; unchanged IDs/messages/append order                       |
| R2 parser, telemetry, factory/allocator, test seams        | S1, S2 | All 15 retained general tests and fixture variants; unchanged allowlists/reasons                                  |
| R2 package/browser/global/cycle ownership                  | S1, S2 | All seven Semantic Diff ownership tests, local AST/global and category graph checks                               |
| R3 syntax/resolution/re-export/cycle/factory compatibility | S1, S2 | Seven analysis tests; S1 deterministic reference/factory inventory equality; message/order regressions            |
| R4 full retained coverage and execution                    | S1, S2 | 29-title/assertion mapping, compile, JSON execution, clean outputs and existing runner glob discovery             |
| R5 verification-only scope and compatibility               | S1, S2 | Exact path manifest; unchanged production/product configuration/dependencies/VS Code engine; browser safety gates |
| R6 user-requested model/effort changes only                | S1     | Two TOML parses, exact old/new settings, all other fields and procedure text equal; raw diff and config hashes    |
| Quality and Evidence Contract                              | S1, S2 | V1 required commands, exact disposable qlty observations and final aggregate, documentation validation            |

<!-- markdownlint-enable MD013 -->

All original titles and base line references are in the
[planning record](/private/tmp/architecture-test-cohesion-plan/evidence.json).
The feature preserves durable
[Use Cases](../../../requirements/use-cases/README.md), including comparison,
reporting, and diagnostics. No new observable use case is introduced. Slice acceptance,
path approval boundaries, sequencing, and validation are in [TASKS.md](TASKS.md).

S1 validation mapping: [S1 evidence](/private/tmp/architecture-test-cohesion-s1/evidence.json)
records the unchanged 29 test bodies and one added formatted-message/order
regression, exact collector/discovery equality, complete catalog and special
gates, agent-setting equality, and V1 command results. S2 mapping remains planned;
its suites have not moved or executed independently yet.
