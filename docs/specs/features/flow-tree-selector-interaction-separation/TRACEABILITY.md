# Requirements Traceability: Flow-tree Selector Interaction Separation

<!-- markdownlint-disable MD013 -->

| Use case / requirement                                                                                                            | SPECS.md section             | Implementation slice | Test or validation                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------- | --------------------------------------------------------------------------------------------------- |
| `uc-explore-flow-graph.md`: selection, focus, enabled/disabled flow-tree rows, scope-row behavior, reveal, and return-focus rules | R2-R5; R7                    | Slice 1              | `unitTreeSelector.test.ts`, `accessibilityDom.test.tsx`, flow interaction tests, desktop/web suites |
| `uc-navigate-between-unit-list-and-flow-graph.md`: stable unit identity and separation from transient row state                   | R6; Breaking Change Analysis | Slice 1              | `FlowSelector.tsx` contract inspection, flow navigation tests, qlty/build checks                    |
| R1 / AC1: presentation-local selector interaction seams and architecture boundaries                                               | R1; AC1                      | Slice 1              | focused tests, `rtk pnpm run qlty`, architecture test coverage, `rtk git diff --check`              |
| R2-R4 / AC2: pointer, keyboard, disabled-row, and explicit scope-opening behavior                                                 | R2-R4; AC2                   | Slice 1              | `unitTreeSelector.test.ts`, `accessibilityDom.test.tsx`, flow keyboard/interaction tests            |
| R5 / AC3: focus requests, rerender retention, expansion, reveal, nested fallback                                                  | R5; AC3                      | Slice 1              | `accessibilityDom.test.tsx`, deep-tree selector tests, desktop/web suites                           |
| R7 / AC5-AC6: desktop/web, VS Code compatibility, docs and CHANGELOG evaluation                                                   | R7; AC5-AC6                  | Slice 1              | production build, desktop/web preparation and suites, qlty, Markdown lint, diff checks              |

<!-- markdownlint-enable MD013 -->

## Validation Result

- Slice 1 validation passed: focused selector compilation and tests, desktop
  suite, browser web suite, production build, qlty, Markdown lint, and diff
  checks all completed successfully. The browser suite required a permitted
  native Playwright launch because the sandboxed launch lacked macOS Mach-port
  permissions.
- P1/P2 remediation revalidation passed: the accessibility DOM test resolves
  the nested child by stable `data-unit-tree-unit-id` and asserts that clicking
  it selects only the child. Focused DOM, compile, desktop/web, build, qlty,
  Markdown lint, and diff checks passed. Independent implementation re-review
  is Ready with no actionable findings; Completion Approval is recorded in
  `TASKS.md` for the exact completion commit. Feature Exit remains pending.
