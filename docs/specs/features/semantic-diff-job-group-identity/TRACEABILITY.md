# Requirements Traceability: Semantic Diff Job-Group Identity

<!-- markdownlint-disable MD013 MD060 -->

| Use case / requirement                                                                                   | `SPECS.md` basis                                          | Implementation slice | Test or validation plan                                                                                                                              |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JGI-REFLEXIVE-001`: identical normalized inputs with unique job-group paths produce no semantic changes | Requirements; Behavioral Scenarios; Acceptance Criteria   | Slice 1              | Parse and self-compare `sample/sample1_large_utf8`; assert 868 units, zero changes, no candidate decision, and 48 distinct exact `nest_jg` decisions |
| `JGI-EXACT-001`: `g`/`mg` use canonical path plus unit type                                              | Requirements; Architecture; Acceptance Criteria           | Slice 1              | Domain exact-key cases for `g`, `mg`, nested equal names, selected-scope equality/descendant paths, full-path fallback, and unchanged other keys     |
| `JGI-AMBIGUITY-001`: duplicate actual paths never auto-pair                                              | Requirements; Behavioral Scenarios; Non-Goals             | Slice 1              | Duplicate keys on either/both sides and shuffled arrays preserve conservative fingerprint outcomes without positional pairing                        |
| `JGI-EVIDENCE-001`: job-group exact evidence extends the closed union                                    | Requirements; Dependency Impact; Breaking Change Analysis | Slice 1              | Domain decision, application copy, compile, decision-ID/order, and existing `jobnet`/`unit` shape regressions cover every union branch               |
| `JGI-MOVE-001`: rename/move and order semantics remain conservative                                      | Requirements; Behavioral Scenarios; Acceptance Criteria   | Slice 1              | Path-not-exact, one-to-one fingerprint rename/move, changed-fingerprint add/remove, multi-candidate, relation, reorder, and shuffled regressions     |
| `JGI-OUTPUT-001`: Markdown and JSON v1 project the new exact key                                         | Requirements; Architecture; Compatibility                 | Slice 1              | English/Japanese Audit and JSON wire/projection/ordering/byte tests; `schemaVersion: 1`; existing variant and mode-selection regressions             |
| `JGI-COMPAT-001`: unrelated behavior and host compatibility remain stable                                | Requirements; Compatibility; Non-Goals                    | Slice 1              | Focused contracts, schedule, Explorer, Flow, architecture; compile/build/qlty; desktop and web host suites                                           |
| Durable behavior records job-group exact identity and reflexivity                                        | Durable Documentation Impact                              | Slice 1              | Update and lint `uc-build-semantic-diff.md`; add Unreleased CHANGELOG fix; confirm report use case, README, roadmap, and architecture unchanged      |

<!-- markdownlint-enable MD013 MD060 -->

## Dependency And Approval Trace

- This transient bugfix owns only job-group exact identity and its exhaustive
  evidence projections. Existing comparison-workflow and schedule-calendar
  feature folders remain inherited and unselected.
- Slice 1 owns the additive `job-group` exact-key branch and every repository
  closed-union consumer. The application DTO alias/copy boundary is explicitly
  verified even when no source edit is required.
- JSON v1 remains selected because the new discriminator adds evidence for a
  previously incorrect domain case without removing, renaming, or changing
  the type, meaning, or nullability of an existing member. Strict exhaustive
  consumers remain an acknowledged compatibility risk covered by explicit
  wire-shape/order tests and CHANGELOG disclosure. Evidence of an externally
  fixed two-value discriminator contract triggers Replanning for versioning.
- Independent plan review is `Ready` with no Findings. Human Approval for the
  exact Slice 1 scope and paths is recorded in `TASKS.md` under the user's
  automatic no-findings instruction; implementation remains gated on the
  focused approved-plan commit.
