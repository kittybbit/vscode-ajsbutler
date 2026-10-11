# Requirements Traceability: Desktop Test Infrastructure Stabilization

| Requirement   | Slice | Test or validation                                 |
| ------------- | ----- | -------------------------------------------------- |
| AC-1; roadmap | S1    | Clean/repeat pnpm test, stable host                |
| AC-2          | S1    | SDK target; aliases; file-load defines             |
| AC-3, AC-6    | S1    | Clean setup, no wrappers, CI parity                |
| AC-4          | S1    | Load/run rejection, phases, exit, full result      |
| AC-5: 1.75    | S1    | Existing smoke bundle on Desktop 1.75.0            |
| AC-5: Web     | S1    | Real browser smoke, compile, production build      |
| Architecture  | S1    | Full zero-exception catalog                        |
| AC-8          | S1    | test:web, test:full, prepared CI, bundle inventory |
| Quality       | S1    | qlty SARIF/aggregate; independent reviews          |

No product use-case contract changes. Minimum Desktop smoke adds version
coverage and does not replace stable full cases or browser execution.
Canonical Web invocation preserves all scenarios and the Desktop accessibility
fixture; only redundant entry/preparation is removed. Implementation evidence
belongs in [TASKS.md](TASKS.md#evidence-and-current-decisions).

Local S1 checks passed: full suite 1200 cases, minimum 1.75 smoke, real Web,
type/build and quality. Independent reviews and current-head CI/Cloud gates
remain pending. Historical prepared execution is discovery only. Memory/OOM
repair is excluded under the latest user/Main scope decision.
