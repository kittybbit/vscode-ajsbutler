# Requirements Traceability: Deterministic SDD Evidence

<!-- markdownlint-disable MD013 -->

| Requirement                        | SPECS.md section | Slice | Validation                                                          |
| ---------------------------------- | ---------------- | ----- | ------------------------------------------------------------------- |
| Versioned, fail-closed evidence    | Requirements 1   | 1, 2  | Shared SKILL record, raw outputs, and command exit states           |
| Official qlty SARIF evidence       | Requirements 2   | 1     | Verified version and SARIF 2.1.0 smoke tests for check and smells   |
| Path and architecture evidence     | Requirements 3   | 2     | Git dry run and existing architecture dependency test               |
| Validation and compatibility facts | Requirements 4   | 2     | SKILL record fields and dry run of unchanged engine and no src edit |
| Solution Shape facts               | Requirements 5   | 2     | SKILL dry run of changed layers, exports, and imports               |
| Traceability and approval state    | Requirements 6   | 2     | SKILL dry run of document presence and recorded approval fields     |
| Shared role consumption            | Requirements 7   | 3     | Procedure consistency scan and Markdown lint                        |

<!-- markdownlint-enable MD013 -->
