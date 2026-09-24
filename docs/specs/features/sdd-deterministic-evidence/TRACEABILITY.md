# Requirements Traceability: Deterministic SDD Evidence

<!-- markdownlint-disable MD013 -->

| Requirement                        | SPECS.md section | Slice | Validation                                                         |
| ---------------------------------- | ---------------- | ----- | ------------------------------------------------------------------ |
| Versioned, fail-closed evidence    | Requirements 1   | 1, 2  | Snapshot metadata, missing-input fixtures, and command exit states |
| Official qlty SARIF evidence       | Requirements 2   | 1     | Verified version and SARIF 2.1.0 smoke tests for check and smells  |
| Path and architecture evidence     | Requirements 3   | 2     | Git path fixtures and existing architecture dependency test        |
| Validation and compatibility facts | Requirements 4   | 2     | Missing-check, engine-diff, Node-import, and host-path fixtures    |
| Solution Shape facts               | Requirements 5   | 2     | Changed-layer, export, import, and ambiguity fixtures              |
| Traceability and approval state    | Requirements 6   | 2     | Missing-field and pending-approval fixtures                        |
| Shared role consumption            | Requirements 7   | 3     | Procedure consistency scan and Markdown lint                       |

<!-- markdownlint-enable MD013 -->
