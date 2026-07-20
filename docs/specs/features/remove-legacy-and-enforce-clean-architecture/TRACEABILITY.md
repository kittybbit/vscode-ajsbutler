# Traceability: Remove Legacy And Enforce Clean Architecture

## Final Closure Matrix

| Concern           | ID  | Spec | Plan | Test                   |
| ----------------- | --- | ---- | ---- | ---------------------- |
| Inventory         | F1  | Req  | TBD  | Findings closed        |
| Parser/raw        | F2  | Req  | TBD  | Unauthorized refs zero |
| Domain model      | F3  | Req  | TBD  | Domain/norm            |
| Unit info         | F4  | Req  | TBD  | List/CSV/def           |
| Flow/nav          | F5  | Req  | TBD  | Graph/nav              |
| Diag/hover        | F6  | Req  | TBD  | Editor                 |
| WebAPI            | F7  | Req  | TBD  | Port/host              |
| Diff/report       | F8  | Req  | TBD  | Semantic/i18n          |
| Telemetry         | F9  | Req  | TBD  | Privacy/failure        |
| Transport/root    | F10 | Req  | TBD  | JSON/host              |
| Legacy/rules/docs | F11 | Req  | TBD  | Zero refs/full suite   |

Feature IDs follow roadmap order from
`architecture-inventory-and-guardrails` through this feature. Each ID maps to
the corresponding folder listed in roadmap item 10.

## Required Feature Exit Evidence

The final plan must map all eleven durable use cases to their application entry
point, normalized/domain input, ports, presentation adapter, regression tests,
and desktop/web result. No unmet row may be deferred from this migration.
