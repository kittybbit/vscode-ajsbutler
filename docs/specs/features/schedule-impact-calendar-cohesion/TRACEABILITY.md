# Requirements Traceability: Schedule Impact Calendar Cohesion

<!-- markdownlint-disable MD013 -->

| Requirement or source                                         | Slice  | Test or validation                                                                                                                                                                                                             |
| ------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R1; roadmap item 1                                            | S1, S2 | Solution Shape/consumer review; S1 removes Sections/SectionBody, S2 removes bounded helper module; retained semantic boundaries assessed in TASKS                                                                              |
| R2; order, empty/populated results and counts                 | S1     | Components characterization of ordered sections and populated/empty/populated filter transitions; unchanged global and correct visible counts/list names/alerts                                                                |
| R2; immutable facts, period, conjunctive filters and ordering | S1, S2 | Existing Components and View suites including root/scope/identity and timeline facts; no model/projection or host-contract changes                                                                                             |
| R3; custom row focus/ref/aria contract                        | S1     | View integration: CandidateGroupCard, CandidateDetails, IssueCard, RootStatusCard and ValidNoRunsCard, small and virtualized focus/navigation; roving tabIndex, bounded index, aria position/set size and actual activeElement |
| R3; nested candidate event ownership                          | S1     | View: two groups with multiple before/after candidates, inner ArrowUp/Down/Home/End stays in owning side without activating/navigating parent; article-self group keys still work                                              |
| R3; bounded large-result access                               | S1, S2 | Intact 10,000-item View bounded DOM/count/candidate-group/issue/timeline focus coverage; S1 adds threshold-plus-one nested candidate/root/no-runs integration; same strict DOM identity predicate with compact failure output  |
| R3; bounded-list lifecycle and handler chaining               | S2     | BoundedList suite (4 passing): small-list semantics/handler chaining, shrink clamp, threshold boundary, and virtualized End/Home; Accessibility retry suite                                                                    |
| R3; labels, announcements, theme and safe text                | S1, S2 | Components/View, Accessibility, ThemeContext and Localization suites; approved English selectedItem colon-only expectation correction; Japanese/runtime text preserved                                                         |
| R4; architecture and compatibility                            | S1, S2 | Mechanical architectureDependencyRules catalog separately from semantic ownership review; TypeScript/test compilation, desktop/web/webview production build and code-tier qlty                                                 |
| Documentation and approval boundary                           | S1, S2 | Markdown lint, local links/structure/scope/diff checks; exact approval and gate records in TASKS; S1 CHANGELOG records observable keyboard repair                                                                              |

<!-- markdownlint-enable MD013 -->

Validation identities, outcomes, retained approvals and pending renewal are
indexed only in `TASKS.md`; complete raw artifacts remain linked from that index.
