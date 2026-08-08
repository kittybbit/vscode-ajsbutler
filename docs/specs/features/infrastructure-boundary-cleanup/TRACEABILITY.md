# Requirements Traceability: Infrastructure Boundary Cleanup

<!-- markdownlint-disable MD013 MD060 -->

## Executable And Completed Slices

| Requirement / use case                                                                          | SPECS.md requirement / acceptance | Slice              | Test or validation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------------- | --------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preserve table/flow panel lifecycle and plain transport                                         | R1; AC1                           | Slice 1 (complete) | Historical `viewerFactory.test.ts`, `viewerMessageRouting.test.ts`, `viewerWiring.test.ts`, architecture suite, desktop/web validation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| View Unit List consumes normalized parser results                                               | R2; AC2-AC3                       | Slice 2            | `src/test/suite/AntlrAjsParser.test.ts`, parser-specific architecture assertion with synthetic raw-listener/raw-parser violations and adapter allowance, `src/test/support/architectureDependencyRules.ts`, `src/test/suite/architectureDependencyRules.test.ts`, exact read-only parser-consumer suites, desktop/web validation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Build Flow Graph remains parser-structure independent                                           | R2; AC2-AC3                       | Slice 2            | `src/test/suite/AntlrAjsParser.test.ts`, parser-specific architecture assertion with synthetic raw-listener/raw-parser violations and adapter allowance, `src/test/support/architectureDependencyRules.ts`, `src/test/suite/architectureDependencyRules.test.ts`, exact read-only parser-consumer suites, desktop/web validation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Diagnose AJS Definition preserves syntax messages and source positions                          | R2; AC2-AC3                       | Slice 2            | exact error shape/message/line/column cases in `src/test/suite/AntlrAjsParser.test.ts`; adapter-only mapping ownership assertion; parser consumer validation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Build Semantic Diff parses before/after definitions through the same port                       | R2; AC2-AC3                       | Slice 2            | `src/test/suite/AntlrAjsParser.test.ts`, parser consumer validation, desktop/web validation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Parser valid, encoded, malformed, warning, and bounded-large behavior                           | R2; AC3                           | Slice 2            | nested normalization, encoded parameter/comment, warning, truncated no-partial, and 500-child cases in `src/test/suite/AntlrAjsParser.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Telemetry callers report only validated catalog events                                          | R3; AC4-AC5                       | Slice 3            | `TelemetryPort.ts` public-boundary assertion; named-builder callers; `src/infrastructure/telemetry/VscodeTelemetryAdapter.ts` and `src/infrastructure/telemetry/NoopTelemetryAdapter.ts` import `ValidatedTelemetryEvent` from `../../application/telemetry/TelemetryPort` without a `telemetryEvent.ts` re-export; `src/test/suite/telemetryEvent.test.ts`, `src/test/suite/extensionLifecycle.test.ts`, `src/test/suite/viewerMessageRouting.test.ts`, `src/test/suite/openPreviewCommand.test.ts`, `src/test/suite/importAjsDefinitionViaWebApiCommand.test.ts`, `src/test/suite/registerDiagnostics.test.ts`, `src/test/suite/registerHoverProvider.test.ts`, `src/test/support/architectureDependencyRules.ts`, `src/test/suite/architectureDependencyRules.test.ts`; exact read-only telemetry suite inventory |
| Telemetry preserves performance/search/viewer buckets and desktop/web meaning                   | R3; AC5                           | Slice 3            | `src/application/telemetry/viewerActionTelemetry.ts`, `src/test/suite/telemetryEvent.test.ts`, `src/test/suite/extensionLifecycle.test.ts`, `src/test/suite/viewerMessageRouting.test.ts`, `src/test/suite/openPreviewCommand.test.ts`, `src/test/suite/importAjsDefinitionViaWebApiCommand.test.ts`, `src/test/suite/registerDiagnostics.test.ts`, `src/test/suite/registerHoverProvider.test.ts`, desktop/web validation                                                                                                                                                                                                                                                                                                                                                                                           |
| Diagnostics, hover, lifecycle, CSV, viewer, and WebAPI call sites preserve event meaning        | R3; AC5                           | Slice 3            | `src/test/suite/extensionLifecycle.test.ts`, `src/test/suite/viewerMessageRouting.test.ts`, `src/test/suite/openPreviewCommand.test.ts`, `src/test/suite/importAjsDefinitionViaWebApiCommand.test.ts`, `src/test/suite/registerDiagnostics.test.ts`, `src/test/suite/registerHoverProvider.test.ts`, plus `test:full`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Telemetry excludes prohibited content, paths, identifiers, credentials, queries, and raw errors | R3; AC5                           | Slice 3            | complete forbidden-key and accidental-schema-allowance cases in `src/test/suite/telemetryEvent.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Telemetry failure never interrupts workflows; Noop remains available                            | R3; AC5                           | Slice 3            | read-only `src/test/suite/createTelemetry.test.ts`, `src/test/suite/extensionLifecycle.test.ts`, and lifecycle disposal coverage                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Zero-exception architecture and desktop/web compatibility                                       | AC6; AC8                          | Slices 2-3         | parser and telemetry static assertions in `src/test/support/architectureDependencyRules.ts` / `src/test/suite/architectureDependencyRules.test.ts`, `rtk pnpm run build`, `rtk pnpm run test:full`, `rtk pnpm run qlty`, `rtk pnpm run lint:md`, `rtk git diff --check`, no Node or VS Code engine change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

## Exact Changed-Path Traceability

The following are the complete expected production/test changed-path
boundaries. Tests and suites named only as read-only validation are not
expected to be modified. The feature-local planning documents are plan-package
paths, not implementation paths.

### Slice 2

- `src/infrastructure/parser/AntlrSyntaxError.ts` (new, infrastructure-internal
  error shape)
- `src/infrastructure/parser/SyntaxErrorListener.ts`
- `src/infrastructure/parser/AntlrRawAjsParser.ts`
- `src/infrastructure/parser/AntlrAjsParser.ts`
- `src/test/suite/AntlrAjsParser.test.ts`
- `src/test/support/architectureDependencyRules.ts`
- `src/test/suite/architectureDependencyRules.test.ts`

Slice 2 read-only validation includes existing parser consumers and their
suites, plus desktop/web validation. No path outside the list above may be
modified.

### Slice 3

- `src/application/telemetry/TelemetryPort.ts`
- `src/application/telemetry/telemetryEvent.ts`
- `src/application/telemetry/extensionLifecycleTelemetry.ts` (new named
  lifecycle builders)
- `src/application/telemetry/viewerActionTelemetry.ts` (named legacy webview
  operation builder)
- `src/infrastructure/telemetry/VscodeTelemetryAdapter.ts`
- `src/infrastructure/telemetry/NoopTelemetryAdapter.ts`
- `src/bootstrap/extension/extensionLifecycle.ts`
- `src/presentation/vscode/webview/messageHandlers.ts`
- `src/presentation/vscode/commands/openPreviewCommand.ts`
- `src/presentation/vscode/commands/importAjsDefinitionViaWebApiCommand.ts`
- `src/presentation/vscode/diagnostics/registerDiagnostics.ts`
- `src/presentation/vscode/languages/registerHoverProvider.ts`
- `src/test/suite/telemetryEvent.test.ts`
- `src/test/suite/extensionLifecycle.test.ts`
- `src/test/suite/viewerMessageRouting.test.ts`
- `src/test/suite/openPreviewCommand.test.ts`
- `src/test/suite/importAjsDefinitionViaWebApiCommand.test.ts`
- `src/test/suite/registerDiagnostics.test.ts`
- `src/test/suite/registerHoverProvider.test.ts`
- `src/test/support/architectureDependencyRules.ts`
- `src/test/suite/architectureDependencyRules.test.ts`

Slice 3 read-only validation includes other telemetry family modules and
unchanged callers. `src/test/suite/telemetryAdapter.test.ts` and
`src/test/suite/createTelemetry.test.ts` remain read-only validation and are
not changed paths. The two infrastructure adapter source paths above are
changed paths only for the `import type` `ValidatedTelemetryEvent` migration;
their SDK/Noop behavior remains unchanged, and `telemetryEvent.ts` must not
re-export the public type. No path outside the list above may be modified.
Slice 3 starts only after Slice 2 completes because the architecture
support/test paths are shared sequentially.

## Slice 2 Implementation Evidence

- Status: Complete; independent implementation review returned `Ready`,
  Completion Approval was recorded in the current conversation, and the exact
  Slice 2 completion commit is
  `ba54fa0542f08a79e4064d4d9537acb799441d1a`.
- Changed files: exactly the seven approved Slice 2 paths listed above:
  `AntlrSyntaxError.ts`, `SyntaxErrorListener.ts`, `AntlrRawAjsParser.ts`,
  `AntlrAjsParser.ts`, `AntlrAjsParser.test.ts`,
  `architectureDependencyRules.ts`, and `architectureDependencyRules.test.ts`.
- Acceptance evidence: raw ANTLR errors use the infrastructure-only
  `AntlrSyntaxError` shape; only `AntlrAjsParser` maps `msg` /
  `charPositionInLine` to the existing `AjsParserError` message / column
  contract. Direct parser coverage retains nested normalization, warnings,
  encoded input, malformed no-partial behavior, bounded-large input, and exact
  normalized error assertions. Architecture fixtures reject value,
  `import type`, and type-only named raw-seam imports and allow the normalized
  adapter without changing the zero-exception rule catalog.
- Validation evidence: `rtk pnpm run test:compile`, `rtk pnpm run build`,
  `rtk pnpm run test:full`, and `rtk pnpm run qlty` passed;
  `rtk git diff --check` passed. `test:full` covered the parser,
  architecture, and four read-only consumer suites on desktop and web. Web
  teardown produced the known `EPIPE` / `ERR_STREAM_PREMATURE_CLOSE` logs while
  exiting successfully. Build retained only the existing three webpack
  bundle-size warnings.
- Compatibility and documentation: desktop/web shared parser behavior,
  VS Code `^1.75.0`, grammar/generated artifacts, consumers, README, and
  CHANGELOG are unchanged. No durable-document update is required.
- Production readiness and remaining risk: no new exception policy, partial
  result, Node dependency, host assumption, or parser performance path was
  introduced. Slice 3 is the next active boundary and remains untouched.
- Handoff: Slice 2 completion is recorded; proceed to the approved Slice 3
  implementation boundary.

## Slice 3 Implementation Evidence

- Status: Implemented; independent implementation review returned `Ready`,
  Completion Approval was recorded in the current conversation, and the exact
  Slice 3 completion commit is pending.
- Changed paths: the actual code/test files are `TelemetryPort.ts`,
  `telemetryEvent.ts`, new `extensionLifecycleTelemetry.ts`,
  `viewerActionTelemetry.ts`, both infrastructure telemetry adapters,
  `extensionLifecycle.ts`, the five listed VS Code callers,
  `telemetryEvent.test.ts`, `extensionLifecycle.test.ts`,
  `importAjsDefinitionViaWebApiCommand.test.ts`, `registerDiagnostics.test.ts`,
  `registerHoverProvider.test.ts`, and the architecture support/test files
  `architectureDependencyRules.ts` / `architectureDependencyRules.test.ts`
  under their approved `src/` paths.
  `TASKS.md` and `TRACEABILITY.md` are the only feature-local evidence files
  updated.
  `viewerMessageRouting.test.ts`, `openPreviewCommand.test.ts`, the other
  telemetry-family suites, `telemetryAdapter.test.ts`, and
  `createTelemetry.test.ts` remained read-only because no expectation or type
  update was needed. No path outside the approved boundary changed.
- Traceability result: the public `TelemetryPort.ts` owns the branded
  `ValidatedTelemetryEvent`; `telemetryEvent.ts` retains the catalog/factory,
  input, and privacy filter internally without re-exporting the public type.
  Named lifecycle and legacy webview builders preserve the existing event
  names and payloads. Architecture fixtures reject every listed internal
  symbol from bootstrap/presentation in value, `import type`, and type-only
  named forms, and allow the public port and named builders. Production scan
  reports no outer `telemetryEvent.ts` import.
- Privacy/failure evidence: the complete forbidden-key filtering and
  accidental-schema protection remain covered; SDK report and synchronous or
  asynchronous disposal failures remain contained; initialization fallback,
  Noop behavior, lifecycle disposal, and viewer/command failure behavior
  remain covered by the read-only suites.
- Validation: compile, desktop host, web host, production build, qlty,
  Markdown lint, and diff checks passed. Web validation required the approved
  sandbox-external browser permission and exited 0; its known teardown
  `EPIPE` / `ERR_STREAM_PREMATURE_CLOSE` messages are non-failing evidence.
  Build retained only the existing three bundle-size warnings. VS Code
  `^1.75.0`, desktop/web entry points, parser/JP1/AJS behavior, README, and
  CHANGELOG are unchanged.
- Remaining risks and handoff: no event/property/privacy drift or accidental
  public re-export was found by independent review. The exact uncommitted diff
  and evidence package is ready for the Slice 3 completion commit; a new
  design or scope issue must return to planning.

## Candidate Disposition Traceability

| Roadmap/baseline candidate                  | Evidence                                                                                                                                 | Disposition / owner                                    | Reopen trigger                                                                   |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| ViewerFactory                               | Baseline Intake group 9; prior feature docs at `9ed0721b^`; commits `d02822c0`, `00b0fe0b`, `9ed0721b`; roadmap cleanup commit `9efd6ae` | Slice 1 complete; do not reimplement                   | Regression requiring edits outside Slice 1 history                               |
| Normalized `AjsParserPort`                  | Baseline Intake group 12; architecture Parser and Model Boundary; current raw listener/parser imports `AjsParserError`                   | Slice 2                                                | Port/schema/grammar/normalization change or new exception policy                 |
| Validated telemetry contract/event builders | Baseline Intake group 13; telemetry cross-cutting contract; exported generic factory/catalog and direct outer callers                    | Slice 3                                                | New/renamed event/property, privacy decision, SDK replacement, or raw collection |
| Semantic-diff file/host adapter             | Feature 4 Slice 3 history; current injected `showOpenDialog`, `readFile`, report and clipboard wiring                                    | No Feature 8 implementation; Feature 4 completed       | Application/domain host leakage or new semantic-diff host behavior               |
| Viewer document/save/resource adapters      | Feature 4 Slices 5-6 history; current VS Code presentation files and validated messages                                                  | No new implementation; completed Feature 4/Viewer work | Application/domain leakage, schema change, or save/resource behavior change      |
| CSV copy/save                               | `exportUnitListCsv.ts` host-neutral output; `Header.tsx` browser clipboard and save message; Baseline Intake group 7                     | Feature 7 or separate observable behavior feature      | Approved clipboard failure/feedback or host-capability redesign                  |
| Unit-definition copy                        | `UnitDefinitionDialog.tsx` presentation-owned and not a Feature 8 intake target                                                          | Separate unit-definition behavior feature              | Approved copy feedback/failure behavior change                                   |
| WebAPI transport/credentials                | Active `import-definition-via-webapi` feature and architecture WebAPI boundary                                                           | Owning WebAPI feature                                  | Explicit cross-feature coordination and replan                                   |
| Host selection/document APIs                | current `vscode` import search and architecture test show imports only in allowed outer layers                                           | No target found                                        | Concrete application/domain/shared-webview host leakage                          |
| Localization                                | Baseline Feature 8 disposition does not select localization; current adapter/resource ownership                                          | Separate intake if exact leakage appears               | Concrete boundary leakage with compatibility evidence                            |

## Approval And Exit Traceability

| Gate               | Evidence required                                                                                                              | Current state                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Plan review        | Complete 3-slice decomposition, candidate dispositions, validation, production readiness, approval boundaries                  | Ready for approval; approved                                         |
| Human Approval     | Explicit approval for exact next-slice scope and paths after review `Ready`                                                    | Approved in current conversation                                     |
| Plan commit        | Review `Ready`, Human Approval, exactly the three feature-local documents; roadmap clean and separately committed as `9efd6ae` | Complete: `97e8e744`                                                 |
| Slice 2 completion | Implementation review `Ready`, parser validation and compatibility evidence, Completion Approval                               | Complete: `ba54fa0542f08a79e4064d4d9537acb799441d1a`                 |
| Slice 3 completion | Implementation review `Ready`, telemetry privacy/failure/host evidence, Completion Approval                                    | Ready; Completion Approval recorded; exact completion commit pending |
| Feature Exit       | Both remaining slices completion-committed; full validation; candidate recheck; docs/CHANGELOG decision                        | Not ready                                                            |

<!-- markdownlint-enable MD013 MD060 -->
