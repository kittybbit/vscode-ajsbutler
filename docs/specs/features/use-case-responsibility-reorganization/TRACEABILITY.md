# Traceability: Use-Case Responsibility Reorganization

| Source | SPECS          | Slice | Validation                 |
| ------ | -------------- | ----- | -------------------------- |
| D1     | R1, R2, R4-R6  | 1     | Passed: paths/qlty/lint    |
| U1     | R3-R6          | 2     | Passed: scenarios/rules    |
| E1     | R3-R6          | 3     | Passed: scenarios/rule IDs |
| F1     | R2, R3, R5, R6 | 4     | Passed: scenarios/details  |
| S1     | R3, R5, R6     | 5     | Passed: scenarios/paths    |
| U2     | R4, R7, R8     | 6     | Passed: six IDs/consumers  |
| E2     | R4, R7, R8     | 7     | Passed: IDs/gap inventory  |
| F2     | R2, R5, R9     | 8     | Passed: ownership matrix   |
| V2     | R5, R6, R10    | 9     | Planned: matrix/evidence   |

## Source Mapping

- D1: normalization, parameter interpretation, command generation, telemetry,
  and search-unification requirement documents.
- U1: `uc-build-unit-list.md` and `uc-build-unit-list-view.md`.
- E1: `uc-provide-editor-feedback.md`.
- F1: `uc-build-flow-graph.md` and its navigation references.
- S1: `uc-compare-semantic-diff.md` and all final taxonomy references.

## SPECS Requirement Mapping

- R1: keep only stable user/application behavior in `use-cases/`.
- R2: move other responsibilities to the correct document category.
- R3: consolidate or split files around user/application purposes.
- R4: make parameter interpretation the normative semantic owner.
- R5: preserve documented observable behavior except official-source
  corrections, whose runtime gaps are deferred explicitly.
- R6: keep indexes and repository-local links consistent.
- R7: make every parameter rule deterministic and source-backed.
- R8: enumerate exact consumer rule IDs or an explicit no-dependency boundary.
- R9: distinguish application placement constraints from presentation layout.
- R10: preserve requirement-level migration and reproducible final evidence.

## Replanned Review-Finding Mapping

- RF1-RF7 refer to the numbered findings in
  `Use-Case Responsibility Reorganization レビュー修正指示書`; they are
  distinct from SPECS requirements R1-R10 above.
- U2: review RF1 and RF4 for Unit List rules and the Hover no-ID boundary.
- E2: review RF1, RF3, and RF4 for supported diagnostic rules, official-manual
  precedence, consumer coverage, and independent conformance follow-up.
- F2: review RF2 for Flow application/presentation ownership.
- V2: review RF5, RF6, and RF7 for migration proof, validation, and current
  state.

## Old-To-New Document Mapping

- `uc-normalize-ajs-document.md` becomes the normalization domain rule.
- `uc-interpret-jp1-parameters.md` becomes the parameter domain rule.
- `uc-generate-ajs-commands.md` becomes the command-generation domain rule.
- `uc-record-telemetry.md` becomes the cross-cutting telemetry requirement.
- `uc-search-domain-unification.md` is removed after its future trigger is
  retained by `docs/specs/roadmap.md`.
- `uc-build-unit-list.md` and `uc-build-unit-list-view.md` become
  `uc-view-unit-list.md`.
- `uc-provide-editor-feedback.md` becomes `uc-diagnose-ajs-definition.md` and
  `uc-show-parameter-hover.md`.
- `uc-build-flow-graph.md` is narrowed and `uc-explore-flow-graph.md` is added.
- `uc-compare-semantic-diff.md` becomes `uc-build-semantic-diff.md` and
  `uc-present-semantic-diff-report.md`.
