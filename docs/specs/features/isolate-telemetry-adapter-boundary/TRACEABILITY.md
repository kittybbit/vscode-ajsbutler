# Traceability: Isolate Telemetry Adapter Boundary

| Req               | Uses              | Spec   | Plan | Test        |
| ----------------- | ----------------- | ------ | ---- | ----------- |
| SDK isolation     | All callers       | Req    | TBD  | Arch        |
| Event schema      | Current reporters | Req    | TBD  | Snapshots   |
| Bootstrap create  | Desktop/web       | Arch   | TBD  | Composition |
| Failure isolation | All reporters     | Req    | TBD  | Throw/no-op |
| Privacy           | All events        | Compat | TBD  | Allowlist   |
