# Requirements Traceability: Semantic Diff VS Code Dependencies

<!-- markdownlint-disable MD013 MD060 -->

| Requirement/source | Slice | Tests or validation |
| ------------------ | ----- | ------------------- |
| R1; Compare AJS Definitions | S1 | Command/schedule-impact suites; minimal capability compilation and helper cases |
| R2; Roadmap item 1; Composition | S2 | Flow-source host and wiring suites; semantic Solution Shape review |
| R3; snapshot freshness | S2 | Flow-source host matrix; integrated Explorer flow stale/readiness tests; browser smoke |
| R4; comparison use case | S1, S2 | Command, capture, registry, source action, Explorer flow/panel, subscriptions/lifecycle suites |
| R4; report use case | S1, S2 | Report document, report action and output regressions; existing copy/save cases |
| R5; compatibility | S1, S2 | Architecture dependency suite; Node-import/engine checks; desktop/web tests and production builds |

<!-- markdownlint-enable MD013 MD060 -->

S1 covers optional Git/prompt/reader/Explorer/calendar/report fallbacks,
cancellation, failures, snapshot ownership and rollback. S2 covers both source
sides, identity, text/version including null, missing capture/open document,
asynchronous staleness, source opening, optional bridge and disposal.

Both slices require the SDD code-tier qlty evidence and independent implementation
review. S2 additionally requires a second independent implementation review.
Planning documents require Markdown/link/structure/diff checks; implementation
commands, evidence inputs and inherited-host-failure disposition are in TASKS.
