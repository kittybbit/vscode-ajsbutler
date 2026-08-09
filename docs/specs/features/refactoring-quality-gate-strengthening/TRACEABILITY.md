# Requirements Traceability: Refactoring Quality Gate Strengthening

<!-- markdownlint-disable MD013 MD060 -->

| Use case / requirement                                                                 | SPECS.md section                                 | Implementation slice | Test or validation                                                  |
| -------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------- | ------------------------------------------------------------------- |
| Roadmap item 9: prevent recurrence with an evidence-based differential quality gate    | Purpose; Origin                                  | Slice 1              | Plan review; Cloud gate evidence; Qlty validation                   |
| Reproducible Qlty baseline and bounded before/after evidence                           | Requirements; Compatibility                      | Slice 1              | Recorded version/config/root identity; bounded refactoring evidence |
| Effective Cloud gate and committed configuration agree                                 | Requirements; Impact Analysis; Open Questions    | Slice 1              | User-confirmed Cloud settings; `.qlty/qlty.toml` validation         |
| Avoid duplicate Cloud/Actions/GitHub App quality owner                                 | Requirements; Alternative Considerations         | Slice 1              | No new action, helper, package script, or workflow gate             |
| Detect newly introduced or reopened regression without failing on pre-existing backlog | Requirements; Acceptance Criteria                | Slice 1              | New-issue gate evidence; baseline backlog remains explainable       |
| Preserve docs-only classification and desktop/web extension validation                 | Requirements; Compatibility; Acceptance Criteria | Slice 1              | Unchanged Verify workflow and host checks                           |
| Preserve runtime, JP1/AJS, parser, architecture, and telemetry contracts               | Breaking Change Analysis; Non-Goals              | Slice 1              | No production changes; risk-based repository validation             |

<!-- markdownlint-enable MD013 MD060 -->
