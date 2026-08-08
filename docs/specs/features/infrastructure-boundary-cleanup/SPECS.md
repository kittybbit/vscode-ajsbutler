<!-- markdownlint-disable MD013 -- Evidence tables contain exact paths. -->

# Feature Specification: Infrastructure Boundary Cleanup

## Purpose

Complete roadmap Feature 8 by preserving the completed VS Code viewer-panel
boundary and isolating the remaining parser technical-error and telemetry
validation details at their exact application/infrastructure seams. Record an
evidence-based disposition for every file/host candidate so Feature 8 is not
silently narrowed or used to duplicate completed Feature 4 work.

## Selection And Recovery

- Selected feature: `infrastructure-boundary-cleanup`.
- Selected branch: `codex/infrastructure-boundary-cleanup`.
- Planning mode: Replanning Mode, revising the recovered feature package after
  independent plan review Findings.
- Recovery basis: the feature documents at `9ed0721b^`, the current roadmap,
  `BASELINE.md`, current source and call sites, and related durable contracts.
- Completed history: prior ViewerFactory Slice 1 remains complete and must not
  be reimplemented.
- Current worktree: the user-approved roadmap cleanup is committed as
  `9efd6ae`; `docs/specs/roadmap.md` is clean and remains outside this plan
  package. The plan package contains only the three feature-local documents.

## Origin And Evidence

- Roadmap item: `docs/specs/roadmap.md`, Feature 8, Infrastructure Boundary
  Cleanup.
- Baseline intake groups:
  - Intake group 9: VS Code viewer factory boundary, completed by Slice 1.
  - Intake group 12: normalized parser application port.
  - Intake group 13: validated telemetry contract and event builders.
- Durable architecture:
  - Parser and Model Boundary
  - Application and Presentation Boundaries
  - Host and Framework Boundaries
  - Telemetry Boundary
- Related behavior contracts:
  - `uc-view-unit-list.md`
  - `uc-build-flow-graph.md`
  - `uc-diagnose-ajs-definition.md`
  - `uc-build-semantic-diff.md`
  - `uc-navigate-between-unit-list-and-flow-graph.md`
  - `docs/requirements/cross-cutting/telemetry.md`

## Requirements

### R1: Preserve the completed viewer boundary

- Keep the completed injected panel-registration seam and its desktop/web
  behavior as historical Feature 8 work.
- Do not reimplement or broaden ViewerFactory Slice 1.
- Preserve panel creation, reuse, readiness, navigation, save/resource
  forwarding, disposal, setup cleanup, and plain message contracts.

### R2: Normalize the parser error boundary

- `AjsParserPort` continues to return only a normalized `AjsDocument` or
  repository-owned `AjsParserError` values.
- ANTLR listener arguments, generated types, raw units, and infrastructure-
  internal technical syntax errors remain under `src/infrastructure/parser`.
- `AntlrAjsParser` owns the one translation from infrastructure-internal syntax
  errors to the application port error contract.
- Existing parser message text, 1-based line, 0-based column, no-partial-
  document behavior, normalization warnings, and model meaning remain stable.
- Application consumers continue to use the same synchronous port contract;
  no generated, raw, host, or Node type crosses it.

Current exact evidence: `SyntaxErrorListener.ts` and `AntlrRawAjsParser.ts`
currently import and construct `AjsParserError` directly. Although no generated
type leaks outward, this leaves the repository-owned application error mapping
inside the raw ANTLR seam instead of at `AntlrAjsParser`, the normalized port
adapter.

### R3: Enforce validated telemetry construction

- `TelemetryPort.report` accepts only branded `ValidatedTelemetryEvent`
  values.
- Event definitions, the generic event constructor, raw property inputs, and
  privacy filtering remain internal to application telemetry builders.
- Presentation and bootstrap callers use named, catalog-backed builders rather
  than importing a generic constructor or event-definition map.
- Preserve every existing event name, allowed property, string conversion,
  bucket meaning, legacy compatibility event, and desktop/web payload meaning.
- Prohibited definition content, paths, credentials, query text, identifiers,
  raw errors, and stack data remain excluded even if accidentally presented to
  a builder.
- SDK initialization, report, synchronous disposal, and asynchronous disposal
  failures remain contained; the Noop fallback remains available.

Current exact evidence: `telemetryEvent.ts` exports `telemetryEvents`,
`TelemetryEventDefinition`, `TelemetryPropertyInput`, `createTelemetryEvent`,
and `allowTelemetryProperties`; `extensionLifecycle.ts` and
`messageHandlers.ts` construct events from that generic surface. The branded
port blocks raw reporting, but the construction/definition surface remains
wider than the durable policy that callers report application-catalog events
through named builders.

### R4: Resolve every file/host candidate without duplicate extraction

The following candidates are part of Feature 8 investigation and disposition,
but are implementation scope only if exact leakage remains:

| Candidate                                          | Evidence and ownership decision                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Semantic-diff file selection/read/report/clipboard | `semanticDiffCommand.ts`, `semanticDiffWiring.ts`, and `semanticDiffReportDocument.ts` are thin VS Code presentation/bootstrap adapters completed by Feature 4 Slice 3. No application leakage remains; do not reimplement.                                                                                                                                                                   |
| Viewer document/save/resource operations           | `ajsDocument.ts`, `messageHandlers.ts`, and `viewerMessageRouting.ts` were completed by Feature 4 Slices 5-6 and the prior ViewerFactory slice. They remain presentation host operations; do not reimplement.                                                                                                                                                                                 |
| CSV copy/save                                      | CSV creation remains host-neutral in `exportUnitListCsv.ts`; copy uses the webview `navigator.clipboard` and save uses validated viewer transport. The baseline assigns `Header.tsx` to Unit-list Table Presentation (Feature 7), and architecture assigns clipboard behavior to Presentation. Any copy failure UX change belongs to Feature 7 or a separate behavior feature, not Feature 8. |
| Unit-definition copy                               | `UnitDefinitionDialog.tsx` is presentation-owned and not a Feature 8 baseline intake target. A copy failure/feedback redesign is separate user-visible work.                                                                                                                                                                                                                                  |
| WebAPI credentials/transport                       | `VscodeWebApiCredentialStore.ts` and `Jp1Ajs3WebApiImportAdapter.ts` belong to the active `import-definition-via-webapi` feature and its beta-exit evidence. Feature 8 must not overlap that owner.                                                                                                                                                                                           |
| Host selection and VS Code documents               | `extensionRuntime.ts`, diagnostics/hover registration, command adapters, and viewer wiring are bootstrap or VS Code presentation responsibilities with no application/domain `vscode` import. No new port is justified.                                                                                                                                                                       |

This disposition is a scope result, not a silent exclusion. A future finding of
application/domain host leakage, or a required behavior change in any listed
candidate, triggers Replanning Mode or the named owning feature.

## Architecture

- Domain: unchanged normalized JP1/AJS models and rules.
- Application: owns `AjsParserPort`, parser error/result types,
  `TelemetryPort`, validated telemetry event types, catalog semantics, privacy
  rules, buckets, and named builders.
- Infrastructure: owns ANTLR/generated/raw parsing, the parser adapter's
  technical-error translation input, telemetry SDK and Noop adapters.
- Presentation: owns VS Code/file/clipboard/panel/message behavior and consumes
  named telemetry builders.
- Bootstrap: constructs `AntlrAjsParser` and telemetry adapters and wires
  application capabilities; it does not construct raw telemetry events after
  Slice 3.
- No service container, architecture exception, Node built-in, or newer VS Code
  API is introduced.

## Compatibility And Production Requirements

- Minimum VS Code remains `^1.75.0`.
- Desktop and browser bundles use the same parser and telemetry contracts.
- Parser compatibility covers valid, malformed, encoded, and bounded-large
  JP1/AJS definitions; successful normalization and exact existing syntax
  errors remain unchanged.
- No partial parser result is presented as complete.
- Telemetry remains optional, privacy-preserving, catalogued, bucketed where
  required, and unable to interrupt a user workflow.
- File/host operations retain their current cancellation, read/write,
  notification, clipboard, and disposal behavior because they are not changed
  by the remaining slices.
- README and CHANGELOG are not expected to change because the planned work is
  internal and behavior-preserving. Any observable behavior change requires
  Replanning Mode and a fresh CHANGELOG decision.

## Acceptance Criteria

- AC1: ViewerFactory Slice 1 remains complete and unchanged.
- AC2: only `AntlrAjsParser` maps infrastructure syntax-error data to
  `AjsParserError`; raw parser/listener code no longer imports the application
  parser contract.
- AC3: parser adapter tests prove unchanged normalized output, warnings,
  encoded content, malformed no-partial behavior, bounded-large input, and
  exact syntax error positions/messages.
- AC4: outer-layer production callers cannot import the telemetry event catalog,
  generic constructor, privacy filter, or raw property-input contract; an
  architecture test enforces the internal telemetry-builder boundary.
- AC5: all telemetry families preserve event names and payload meanings, the
  complete forbidden-property set remains filtered, and SDK/Noop failures stay
  isolated on desktop and web paths.
- AC6: architecture dependency tests remain zero-exception and production
  source gains no Node built-in.
- AC7: every roadmap/baseline file/host candidate has the explicit ownership
  disposition in R4 and in `TASKS.md`/`TRACEABILITY.md`.
- AC8: focused tests, build, desktop/web validation, qlty, Markdown lint, and
  diff checks pass at the boundaries specified per slice.
- AC9: all remaining slices receive independent plan review, explicit Human
  Approval, implementation review, Completion Approval, and focused commits.

## Non-Goals

- Reimplementing the completed ViewerFactory slice.
- Changing ANTLR grammar, generated artifacts, parser wording, normalized model
  semantics, JP1/AJS3 version support, or parser API behavior.
- Adding telemetry events, collection questions, raw data, exact sensitive
  measurements, or changing existing event names/properties.
- Refactoring telemetry only to satisfy a repository-wide metric threshold.
- Redesigning semantic diff, CSV, unit-definition copy, diagnostics, hover,
  WebAPI import, localization, viewer UI, or file/clipboard UX.
- Adding an application port where host behavior is already correctly owned by
  Presentation or Bootstrap.
- Editing `docs/specs/roadmap.md` in this plan-author run.

## Approval And Replanning Boundaries

- Human Approval is pending and is never inferred from the prior feature
  history or recreated folder.
- Slice 2 and Slice 3 require separate implementation approvals and completion
  commits; approval of one does not approve the other.
- Any parser result/schema/wording change, telemetry event/property/privacy
  change, file/host runtime change, WebAPI overlap, architecture-rule change,
  VS Code compatibility change, or new implementation path requires
  Replanning Mode and renewed review/approval.
- The pre-existing `docs/specs/roadmap.md` modification requires an explicit
  commit-scope decision before the plan commit gate; this plan does not approve,
  stage, or alter it.

<!-- markdownlint-enable MD013 -->
