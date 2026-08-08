# Requirements Traceability: Infrastructure Boundary Cleanup

<!-- markdownlint-disable MD013 MD060 -->

| Use case / requirement                                                                              | SPECS.md section                     | Implementation slice | Test or validation                                                                                |
| --------------------------------------------------------------------------------------------------- | ------------------------------------ | -------------------- | ------------------------------------------------------------------------------------------------- |
| View Unit List: desktop and web viewers consume the same application-facing list shape              | Requirements; Compatibility          | Slice 1              | `src/test/suite/viewerFactory.test.ts`; direct `registerViewerPanel` test; desktop/web validation |
| Build Flow Graph: graph construction remains independent of parser and presentation-framework types | Requirements; Architecture           | Slice 1              | Architecture dependency test; `src/test/suite/viewerWiring.test.ts`                               |
| Navigate Between Unit List And Flow Graph: counterpart opening and readiness remain stable          | Impact Analysis; Acceptance Criteria | Slice 1              | `src/test/suite/viewerWiring.test.ts`; cross-view smoke validation                                |

<!-- markdownlint-enable MD013 MD060 -->
