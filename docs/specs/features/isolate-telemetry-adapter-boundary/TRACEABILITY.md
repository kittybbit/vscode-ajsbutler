# Traceability: Isolate Telemetry Adapter Boundary

<!-- markdownlint-disable MD013 -->

| Use Case / Requirement                                                 | `SPECS.md` Section                              | Slice   | Test / Validation Result                                                                                                                                           |
| ---------------------------------------------------------------------- | ----------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SDK imports and translation stay in infrastructure                     | Requirements; Architecture; Acceptance Criteria | Slice 1 | `architectureDependencyRules.test.ts` and final production import scan passed; production build passed                                                             |
| Callers use a repository-owned, host-neutral reporting contract        | Requirements; Architecture                      | Slice 1 | `telemetryEvent.test.ts`, extension dependency/runtime/wiring tests, and TypeScript test compilation passed                                                        |
| Event-name and property-schema ownership is explicit without SDK types | Requirements; Impact Analysis                   | Slice 1 | `telemetryEvent.test.ts`, workflow telemetry tests, and architecture dependency tests passed                                                                       |
| Bootstrap constructs and injects the selected adapter                  | Requirements; Architecture; Acceptance Criteria | Slice 1 | `createTelemetry.test.ts` plus extension dependency/runtime/subscription/wiring tests passed                                                                       |
| Telemetry failures never change extension workflows                    | Requirements; Acceptance Criteria               | Slice 1 | `telemetryAdapter.test.ts` and representative lifecycle, diagnostics, hover, and WebAPI failure tests passed; non-telemetry error propagation remains asserted     |
| Existing event meaning remains unchanged                               | Requirements; Compatibility                     | Slice 1 | Exact legacy catalog/payload assertions plus lifecycle, webview operation/routing, viewer, search, performance, editor-feedback, and WebAPI telemetry tests passed |
| Privacy restrictions remain unchanged                                  | Purpose; Requirements; Compatibility            | Slice 1 | Nominal-type compile check, allowlist/forbidden-key tests, raw-call-site architecture guard, and exact adapter translation test passed                             |
| Desktop/web and minimum VS Code compatibility remain stable            | Compatibility                                   | Slice 1 | Desktop tests and production desktop/web builds passed; sandbox-blocked Chromium launch passed when rerun with required permission; `engines.vscode` is unchanged  |

<!-- markdownlint-enable MD013 -->
