# Requirements Traceability: Schedule Impact Calendar Cohesion

<!-- markdownlint-disable MD013 -->

| Requirement or source | Slice | Test or validation | S1 execution result |
| --------------------- | ----- | ----------------- | ------------------- |
| R1; roadmap item 1 | S1, S2 | Solution Shape and consumer review; S1 removes Sections/SectionBody, S2 removes bounded helper module; retained boundaries assessed in TASKS | S1 stale-import search passes; the two forwarding files are removed; Contents and ResultSection retain ownership described in TASKS |
| R2; section order, empty/populated results and counts | S1 | Components characterization of ordered sections and filter transitions; existing View root/scope/identity and timeline tests | Ordered sections and populated/empty/populated counts, list names, and alert labels pass in pre- and post-refactor component tests |
| R2; immutable facts, period, conjunctive filters and run ordering | S1, S2 | Existing Components and View suites; no model/projection or host-contract changes | Non-large View cases pass; existing 10,000-item View case is SIGKILLed on both the base and S1 snapshots; no model or projection path changed |
| R3; bounded list semantics, state, keyboard and focus | S2 | New BoundedList boundary suite: handler chaining, clamping, threshold and virtualized End/Home; View 10,000-item test; Accessibility retry suite | S2 remains planned; S1 does not change bounded-list code; the inherited 10,000-item View test is blocked on base and S1 |
| R3; labels, empty alerts, announcements, theme and safe text | S1, S2 | Components and View suites; Accessibility, Localization and ThemeContext suites; unchanged shared styles/text rendering reviewed | S1 component and Accessibility/Theme tests pass; the existing English announcement assertion fails identically on base and S1; expectation-only colon removal in Localization is proposed, pending replan gates; runtime/Japanese text stays unchanged; alert transitions pass |
| R4; architecture and compatibility | S1, S2 | architectureDependencyRules suite (mechanical catalog); separate ownership review; TypeScript and test compilation; production desktop/web/webview build; code-tier qlty evidence | S1 architecture suite 29/29, TypeScript, test compilation, and desktop/web/webview build pass; final qlty observations/aggregate await Main's replan |
| Documentation and approval boundaries | S1, S2 | Markdown/local links/structure/scope/diff checks; exact path and gate evidence in TASKS | S1 feature Markdown lint and diff check passed before these outcome annotations; rerun is pending; original approval scope remains preserved; proposed Localization path needs renewed S1 review/approval/commit; Main preserves required 10,000-item check unchanged as implementation-readiness blocker |

<!-- markdownlint-enable MD013 -->

S1 outcomes and unresolved baseline failures are recorded here and in
`TASKS.md`; raw commands, exits, SARIF, and snapshot references are in its
linked evidence artifact. S2 checks remain planned.

The minimal S1 proposal in `TASKS.md` maps the expectation-only wording repair
to R3. Required 10,000-item bounded DOM/count/focus coverage is retained; no
waiver, replacement check, fixture reduction or View-test edit is approved.
