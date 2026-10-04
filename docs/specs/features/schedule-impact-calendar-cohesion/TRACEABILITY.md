# Requirements Traceability: Schedule Impact Calendar Cohesion

<!-- markdownlint-disable MD013 -->

| Requirement or source | Slice | Test or validation |
| --------------------- | ----- | ------------------ |
| R1; roadmap item 1 | S1, S2 | Solution Shape and consumer review; S1 removes Sections/SectionBody, S2 removes bounded helper module; retained boundaries assessed in TASKS |
| R2; section order, empty/populated results and counts | S1 | Components characterization of ordered sections and filter transitions; existing View root/scope/identity and timeline tests |
| R2; immutable facts, period, conjunctive filters and run ordering | S1, S2 | Existing Components and View suites; no model/projection or host-contract changes |
| R3; bounded list semantics, state, keyboard and focus | S2 | New BoundedList boundary suite: handler chaining, clamping, threshold and virtualized End/Home; View 10,000-item test; Accessibility retry suite |
| R3; labels, empty alerts, announcements, theme and safe text | S1, S2 | Components and View suites; Accessibility, Localization and ThemeContext suites; unchanged shared styles/text rendering reviewed |
| R4; architecture and compatibility | S1, S2 | architectureDependencyRules suite (mechanical catalog); separate ownership review; TypeScript and test compilation; production desktop/web/webview build; code-tier qlty evidence |
| Documentation and approval boundaries | S1, S2 | Markdown/local links/structure/scope/diff checks; exact path and gate evidence in TASKS |

<!-- markdownlint-enable MD013 -->

These are planned checks, not executed product results. Exact commands and
evidence requirements belong to `TASKS.md`.
