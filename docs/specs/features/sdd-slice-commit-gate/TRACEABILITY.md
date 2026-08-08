# Requirements Traceability: SDD Slice Commit Gate

<!-- markdownlint-disable MD013 MD060 -->

| Requirement / policy                                                    | SPECS.md section | Implementation slice | Test or validation                                                                      |
| ----------------------------------------------------------------------- | ---------------- | -------------------- | --------------------------------------------------------------------------------------- |
| Plan, completion, and closure approvals are distinct human gates        | R1; AC1-AC3      | Slice 1              | `docs/specs/README.md`, `TASKS.template.md`, role-contract inspection, Markdown lint    |
| Plan/replan commit requires Ready review and Human Approval             | R2; AC1, AC3-AC4 | Slice 1              | `sdd-commit-gate/SKILL.md`, `approval-committer.toml`, static gate inspection           |
| Slice commit requires Ready review and explicit Completion Approval     | R3; AC1, AC3-AC4 | Slice 1              | `sdd-commit-gate/SKILL.md`, `approval-committer.toml`, static gate inspection           |
| Feature Exit commit requires Close and explicit Closure Approval        | R4; AC1, AC3-AC4 | Slice 1              | `sdd-commit-gate/SKILL.md`, `approval-committer.toml`, Feature Exit contract inspection |
| No pre-approval staging/commit and no reviewer self-approval            | R5, R7; AC3      | Slice 1              | all lifecycle role contracts, `AGENTS.md`, Markdown lint                                |
| Each approved gate creates one focused commit and blocks unrelated work | R6, R8; AC1, AC4 | Slice 1              | committer contract, staged diff check, focused static inspection                        |
| Configuration-only scope preserves runtime and host compatibility       | R9; AC5-AC6      | Slice 1              | changed-file inspection, qlty, `rtk git diff --check`                                   |

<!-- markdownlint-enable MD013 MD060 -->

Validation result: pending implementation and review.
