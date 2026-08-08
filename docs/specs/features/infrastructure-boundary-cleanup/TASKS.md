<!-- markdownlint-disable MD013 MD060 -- Plan tables contain compact evidence. -->

# Feature Tasks: Infrastructure Boundary Cleanup

## Agent Brief

- Selected feature: `infrastructure-boundary-cleanup`.
- Branch: `codex/infrastructure-boundary-cleanup`.
- Mode: Replanning Mode.
- Purpose: complete all executable Feature 8 boundaries and record exact
  disposition of non-executable file/host candidates.
- Preserve completed ViewerFactory Slice 1; do not reimplement it.
- Do not edit runtime code, tests, generated artifacts, or configuration before
  reviewed replan approval and its focused plan commit.
- `docs/specs/roadmap.md` is already handled by the separate focused commit
  `9efd6ae`; do not edit it in this replan.

## Plan Status

- Status: Approved after independent plan review `Ready for approval`.
- Planning scope: one completed historical slice and two remaining executable
  slices, plus explicit file/host candidate dispositions.
- Review status: `Ready for approval` from independent `sdd-review-plan`.
- Human approval: Approved in the current conversation; implementation remains
  sequential and slice-specific.
- Active implementation slice: none.
- Slice count and order: 3 total — Slice 1 complete; Slice 2 parser boundary;
  Slice 3 telemetry boundary.
- Feature Exit: not ready; Slices 2-3 must each be reviewed, approved,
  implemented, validated, completion-approved, and committed first.

## Planning Package Boundary

- Planning package paths:
  - `docs/specs/features/infrastructure-boundary-cleanup/SPECS.md`
  - `docs/specs/features/infrastructure-boundary-cleanup/TASKS.md`
  - `docs/specs/features/infrastructure-boundary-cleanup/TRACEABILITY.md`
- `docs/specs/roadmap.md` removes ViewerFactory from the residual Feature 8
  list and is clean because the user-approved focused docs commit `9efd6ae`
  handled it separately. It is outside this plan package.
- Plan-commit scope: exactly the three feature-local documents listed above;
  this replan edits only `TASKS.md` and `TRACEABILITY.md`, while `SPECS.md`
  remains unchanged. `docs/specs/roadmap.md` is not a plan-commit target.
- The roadmap blocker is resolved. The approval-committer must stage only the
  three feature-local documents and must not broaden the commit scope.

## Replanning Findings Addressed

- Finding 1: preserve the already committed roadmap cleanup at `9efd6ae`; do
  not edit `docs/specs/roadmap.md` in this replan.
- Finding 2: preserve the three-document feature-local plan package and the
  existing pending review/approval gates; Slice 1 remains complete and is not
  reopened.
- Finding 3: make Slice 2's parser-specific static architecture assertion
  explicit, including value imports, `import type`, and type-only named
  specifiers, the raw-seam violation cases, the adapter-only allowance, and
  adapter-only mapping ownership for AC2/AC3.
- Finding 4: make Slice 3's `TelemetryPort.ts` public boundary, internal
  `telemetryEvent.ts` surface, named-builder paths, and value/type-only import
  enforcement explicit; the latest adapter-only migration below extends the
  fixed path list only for the required public-type imports.
- Finding 5: enumerate the exact parser and telemetry read-only validation
  suites and distinguish them from each slice's focused validation; the latest
  revision keeps the two adapter source paths changed-only and the two existing
  adapter tests read-only.
- Latest Finding 1: add both infrastructure telemetry adapters to Slice 3's
  exact changed-path and approval boundaries for the required type-import
  migration. Both adapters must import `ValidatedTelemetryEvent` from
  `../../application/telemetry/TelemetryPort`; `telemetryEvent.ts` must not
  re-export it, and SDK/Noop behavior remains unchanged. Keep
  `telemetryAdapter.test.ts` and `createTelemetry.test.ts` read-only.
- Latest Finding 2: update the traceability review state from Findings 1-3 to
  Findings 1-5.

## Human Approval

- Status: Approved
- Approved at: current conversation, after independent plan review returned
  `Ready for approval`
- Approved scope: the complete reviewed replan package for Feature 8,
  preserving completed Slice 1 and authorizing the approved Slice 2 parser
  boundary followed by the approved Slice 3 telemetry boundary
- Approved paths:
  - `docs/specs/features/infrastructure-boundary-cleanup/SPECS.md`
  - `docs/specs/features/infrastructure-boundary-cleanup/TASKS.md`
  - `docs/specs/features/infrastructure-boundary-cleanup/TRACEABILITY.md`

Plan review `Ready` and explicit Human Approval are required before the plan
package is committed. Implementation approval is slice-specific; approval of
the full plan does not authorize simultaneous implementation of Slices 2-3.

## Completion Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Implementation review verdict: Pending
- Commit status: Not eligible

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Candidate Disposition Gate

<!-- markdownlint-disable MD060 -->

| Candidate                             | Exact current paths                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Decision                                       | Reason / owner                                                                                                                                                                         |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| VS Code ViewerFactory                 | `ViewerFactory.ts`, `viewerMessageRouting.ts`, `viewerWiring.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Complete as Slice 1                            | Implemented and completion-committed before `9ed0721b`; retain as history only.                                                                                                        |
| Normalized parser port                | `src/infrastructure/parser/AntlrSyntaxError.ts` (new), `src/infrastructure/parser/SyntaxErrorListener.ts`, `src/infrastructure/parser/AntlrRawAjsParser.ts`, `src/infrastructure/parser/AntlrAjsParser.ts`, `src/test/suite/AntlrAjsParser.test.ts`, `src/test/support/architectureDependencyRules.ts`, `src/test/suite/architectureDependencyRules.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Execute as Slice 2                             | Raw ANTLR seam constructs the application error type; move the technical-to-owned error mapping to the normalized adapter without changing results.                                    |
| Validated telemetry contract/builders | `src/application/telemetry/TelemetryPort.ts`, `src/application/telemetry/telemetryEvent.ts`, `src/application/telemetry/extensionLifecycleTelemetry.ts` (new), `src/application/telemetry/viewerActionTelemetry.ts`, `src/infrastructure/telemetry/VscodeTelemetryAdapter.ts`, `src/infrastructure/telemetry/NoopTelemetryAdapter.ts`, `src/bootstrap/extension/extensionLifecycle.ts`, `src/presentation/vscode/webview/messageHandlers.ts`, `src/presentation/vscode/commands/openPreviewCommand.ts`, `src/presentation/vscode/commands/importAjsDefinitionViaWebApiCommand.ts`, `src/presentation/vscode/diagnostics/registerDiagnostics.ts`, `src/presentation/vscode/languages/registerHoverProvider.ts`, `src/test/suite/telemetryEvent.test.ts`, `src/test/suite/createTelemetry.test.ts`, `src/test/suite/extensionLifecycle.test.ts`, `src/test/suite/viewerMessageRouting.test.ts`, `src/test/suite/openPreviewCommand.test.ts`, `src/test/suite/importAjsDefinitionViaWebApiCommand.test.ts`, `src/test/suite/registerDiagnostics.test.ts`, `src/test/suite/registerHoverProvider.test.ts`, `src/test/support/architectureDependencyRules.ts`, `src/test/suite/architectureDependencyRules.test.ts` | Execute as Slice 3                             | Generic event definitions/construction/filtering are exported and used outside named builders; close the construction surface while preserving catalog and privacy behavior.           |
| Semantic-diff host/file adapter       | `semanticDiffCommand.ts`, `semanticDiffWiring.ts`, `semanticDiffReportDocument.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | No Feature 8 implementation                    | Feature 4 Slice 3 already isolated dialog/read/report/clipboard capabilities and failure mapping; remains Presentation/Bootstrap.                                                      |
| Viewer document/save/resource adapter | `ajsDocument.ts`, `messageHandlers.ts`, `viewerMessageRouting.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | No new implementation                          | Feature 4 Slices 5-6 and completed ViewerFactory work own this boundary. No application/domain host leakage exists.                                                                    |
| CSV clipboard/save                    | `exportUnitListCsv.ts`, `ajsTable/Header.tsx`, viewer save transport                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Defer outside Feature 8                        | CSV generation is host-neutral; clipboard is Presentation and Header belongs to baseline Intake group 7 / Feature 7. Copy failure UX would be a separate observable behavior decision. |
| Unit-definition clipboard             | `UnitDefinitionDialog.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Defer outside Feature 8                        | Presentation-owned, not a Feature 8 baseline intake target; feedback/failure changes are user-visible feature work.                                                                    |
| WebAPI host/credential adapter        | `Jp1Ajs3WebApiImportAdapter.ts`, `VscodeWebApiCredentialStore.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Owned by another feature                       | Active `import-definition-via-webapi` feature and beta-exit evidence own these files.                                                                                                  |
| Host selection/document lifecycle     | `extensionRuntime.ts`, diagnostics/hover/command adapters, viewer wiring                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | No target found                                | Exact search found `vscode` only in allowed outer layers; application/domain/shared webview have no host or Node imports.                                                              |
| Localization adapters                 | `ParameterSyntaxResourceAdapter.ts`, resource/domain localization                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Not selected by Feature 8 baseline disposition | Baseline's Feature 8 disposition selects ViewerFactory, parser port, and telemetry. Localization change needs separate exact leakage evidence and feature intake.                      |

<!-- markdownlint-enable MD060 -->

The gate is complete only while these ownership facts remain true. Discovery of
new leakage or a required edit to a deferred/other-feature path stops the active
slice and returns to Replanning Mode.

## Implementation Slices

### Slice 1: Inject the VS Code viewer panel bridge

- Status: Complete; historical implementation and completion commit retained.
- Scope: injected the panel-registration bridge into `ViewerFactory`, kept
  panel lifecycle in VS Code presentation, and composed the bridge in
  `viewerWiring.ts` without changing plain message schemas.
- User / Domain Value: stable table/flow viewer behavior through a clearer VS
  Code host boundary.
- Cohesive Change Group: factory lifecycle and its one registration seam.
- Acceptance: completed behavior covers creation, reuse, readiness, navigation,
  save/resource forwarding, active-panel filtering, disposal, setup cleanup,
  and failure handling.
- Validation: historical focused viewer factory/message-routing/wiring tests,
  architecture suite, build, desktop/web host runs, qlty, and Markdown lint.
- Production Readiness: no parser/model behavior, large/malformed input policy,
  message schema, user documentation, CHANGELOG, VS Code engine, desktop, or
  web compatibility change.
- Approval Boundary: closed historical scope only; no authority carries into
  Slices 2-3.
- Dependencies: completed characterization and Feature 4 viewer boundaries.
- Risks: regression only if later slices edit viewer files; they must not.
- Out of Scope: reimplementation or modification by this plan.

### Slice 2: Move parser error translation to the normalized adapter

- Status: Planned; review and Human Approval pending.
- Scope:
  - Define an infrastructure-internal syntax-error shape at the raw ANTLR seam.
  - Make `SyntaxErrorListener` and `AntlrRawAjsParser` return only that internal
    shape and raw units.
  - Make `AntlrAjsParser` map those technical errors once to `AjsParserError`
    while preserving the existing `AjsParserPort` and `ParseAjsResult` API.
  - Update direct parser boundary tests and architecture dependency evidence.
  - Extend the existing `architectureDependencyRules.ts` /
    `architectureDependencyRules.test.ts` support with a parser-specific
    static rule/assertion. Any import of
    `src/application/parsing/AjsParserPort.ts` from
    `src/infrastructure/parser/SyntaxErrorListener.ts`,
    `src/infrastructure/parser/AntlrRawAjsParser.ts`, or any parser-
    infrastructure raw listener/parser seam is a violation, including a
    value import, `import type`, or type-only named specifier. Only
    `src/infrastructure/parser/AntlrAjsParser.ts` may import `AjsParserPort`
    or `ParseAjsResult` (with either value or type-only import syntax).
  - Use synthetic fixtures in the existing architecture support/test paths to
    prove raw-listener and raw-parser violations and the normalized-adapter
    allowance. The repository-owned syntax-error-to-`AjsParserError` mapping
    is owned only by `AntlrAjsParser`, and this ownership is part of AC2/AC3.
- Expected implementation paths:
  - `src/infrastructure/parser/AntlrSyntaxError.ts` (new,
    infrastructure-internal error shape)
  - `src/infrastructure/parser/SyntaxErrorListener.ts`
  - `src/infrastructure/parser/AntlrRawAjsParser.ts`
  - `src/infrastructure/parser/AntlrAjsParser.ts`
  - `src/test/suite/AntlrAjsParser.test.ts`
  - `src/test/support/architectureDependencyRules.ts`
  - `src/test/suite/architectureDependencyRules.test.ts`
- These are the complete Slice 2 production/test changed-path boundaries.
  Existing parser consumers and their suites are read-only compatibility
  validation; no path outside the exact list may be modified.
- Focused Slice 2 validation is limited to the fixed `AntlrAjsParser.test.ts`
  cases and the parser-specific architecture assertion/fixtures in the two
  fixed architecture support/test paths. The exact read-only parser-consumer
  suite inventory for AC3 is:
  - `src/test/suite/buildUnitList.test.ts`
  - `src/test/suite/buildSyntaxDiagnostics.test.ts`
  - `src/test/suite/buildSemanticDiffReportData.test.ts`
  - `src/test/suite/semanticDiffSampleCoverage.test.ts`
    These suites are executed for compatibility only and are not added to the
    changed-path list.
- User / Domain Value: all parser consumers continue to receive one stable,
  normalized result contract while ANTLR-specific error details remain inside
  infrastructure.
- Cohesive Change Group: raw syntax-error capture plus the one normalized
  adapter translation; splitting them would temporarily break the parser
  contract or duplicate error mapping.
- Acceptance:
  - AC2 and AC3 pass.
  - No change to exported parser types, success/error discriminants, error
    wording/positions, warnings, normalized model, or consumer behavior.
  - Generated parser types and `AjsRawUnit` remain infrastructure-only.
- Validation:
  - `src/test/suite/AntlrAjsParser.test.ts` for nested normalization, warning
    preservation, encoded
    content, truncated malformed input, 500-child bounded large input, and
    exact repository-owned error shape/message/position;
  - read-only consumer-suite validation for Build Unit List, Diagnose AJS
    Definition, and semantic-diff report parsing;
  - `src/test/support/architectureDependencyRules.ts` and
    `src/test/suite/architectureDependencyRules.test.ts` for the parser
    boundary, including synthetic raw-listener/raw-parser violations and the
    adapter-only `AjsParserPort`/`ParseAjsResult` allowance across value and
    type-only import forms;
  - `rtk pnpm run build`, `rtk pnpm run test:full`, `rtk pnpm run qlty`,
    `rtk pnpm run lint:md`, and `rtk git diff --check`.
- Production Readiness:
  - Failure mode: syntax failures return no partial document; unexpected new
    technical exception policy is not introduced by this refactor.
  - JP1/AJS compatibility: grammar, generated code, normalization, v13 meaning,
    error wording, line/column conventions, and encoded input remain unchanged.
  - Large/malformed risk: preserve the existing bounded 500-child and truncated
    definition evidence; no extra parse or full-document copy.
  - Desktop/web: shared parser and all three consumers require desktop and web
    host validation; no Node built-in or filesystem assumption.
  - README/CHANGELOG: none expected; any observable change triggers replan.
- Approval Boundary: exactly the listed parser production/test paths, plus the
  feature-local planning evidence update. No path outside that list, port
  redesign, grammar/generated artifact, normalization, consumer, or telemetry
  edit.
- Dependencies: Slice 1 history and completed parser characterization evidence;
  no implementation dependency on Slice 3.
- Risks: changed ANTLR message/position mapping, accidentally returning a
  partial document, duplicating error structures across layers, or overbroad
  architecture enforcement. The static rule must reject all raw-seam
  value/type-only imports while allowing only the adapter's port/result
  imports, without adding an exception to the zero-exception catalog.
- Out of Scope: parser performance redesign, async parsing, cancellation,
  grammar generation, normalization changes, and technical-exception policy.

### Slice 3: Close telemetry construction behind named builders

- Status: Planned; review and Human Approval pending.
- Scope:
  - Keep branded `ValidatedTelemetryEvent` and `TelemetryPort.report` as the
    reporting boundary.
  - Move event definitions, generic construction, raw property input, forbidden
    key set, and filtering to an application-telemetry internal surface.
  - Add or use named catalog-backed builders for lifecycle and legacy webview
    operation call sites that currently call `createTelemetryEvent` directly.
  - Keep existing performance, search, viewer action/viewer lifecycle, editor
    feedback, and WebAPI import event meanings on the same internal validated
    factory; only the listed callers and builder files are in this slice.
  - Add architecture enforcement so production callers outside application
    telemetry cannot import internal definitions/factory/filter/input types.
  - Include `src/infrastructure/telemetry/VscodeTelemetryAdapter.ts` and
    `src/infrastructure/telemetry/NoopTelemetryAdapter.ts` only for the
    required type-import migration: both must use `import type` to import
    `ValidatedTelemetryEvent` from
    `../../application/telemetry/TelemetryPort`. Do not re-export
    `ValidatedTelemetryEvent` from `telemetryEvent.ts`; preserve SDK reporting,
    disposal/failure containment, initialization fallback, and Noop behavior.
  - Make `src/application/telemetry/TelemetryPort.ts` the public boundary that
    owns `TelemetryPort` and `ValidatedTelemetryEvent`. Outer production code
    may import only those public types and named builders from the approved
    builder modules; it may not import the generic telemetry construction
    surface.
  - Keep `telemetryEvents`, `TelemetryEventDefinition`,
    `TelemetryPropertyInput`, `createTelemetryEvent`, and
    `allowTelemetryProperties` in `telemetryEvent.ts` application/telemetry
    internal scope. Architecture enforcement must reject outer bootstrap and
    presentation imports of each internal name as value imports, named
    imports, `import type`, or type-only named specifiers.
  - `extensionLifecycleTelemetry.ts` and `viewerActionTelemetry.ts` provide
    the named builders used by outer callers. Bootstrap and presentation must
    not directly import the generic factory or catalog. Fixtures must allow
    `TelemetryPort`/`ValidatedTelemetryEvent` from `TelemetryPort.ts` and the
    named builders, including approved type-only imports for the public types.
- Expected implementation paths:
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
- These are the complete Slice 3 production/test changed-path boundaries. The
  two infrastructure adapter paths are changed only for the public-type
  import migration described above; their SDK/Noop behavior must not change.
  `src/test/suite/telemetryAdapter.test.ts` and
  `src/test/suite/createTelemetry.test.ts` are read-only compatibility
  validation and are not changed paths. Other telemetry family modules,
  callers, and suites are also read-only validation; no path outside the exact
  list may be modified.
- Focused Slice 3 validation is limited to the fixed telemetry boundary,
  caller, and architecture test paths listed above. The exact Finding 5
  read-only telemetry family/failure/caller suite inventory for AC5 is:
  - `src/test/suite/telemetryBuckets.test.ts`
  - `src/test/suite/performanceTelemetry.test.ts`
  - `src/test/suite/searchTelemetry.test.ts`
  - `src/test/suite/viewerTelemetry.test.ts`
  - `src/test/suite/viewerActionTelemetry.test.ts`
  - `src/test/suite/editorFeedbackTelemetry.test.ts`
  - `src/test/suite/webApiImportTelemetry.test.ts`
  - `src/test/suite/csvExportTelemetry.test.ts`
  - `src/test/suite/tableRenderTelemetry.test.ts`
  - `src/test/suite/viewerSearchTelemetry.test.ts`
  - `src/test/suite/telemetryEvent.test.ts`
  - `src/test/suite/telemetryAdapter.test.ts`
  - `src/test/suite/createTelemetry.test.ts`
  - `src/test/suite/extensionLifecycle.test.ts`
  - `src/test/suite/viewerMessageRouting.test.ts`
  - `src/test/suite/openPreviewCommand.test.ts`
  - `src/test/suite/importAjsDefinitionViaWebApiCommand.test.ts`
  - `src/test/suite/registerDiagnostics.test.ts`
  - `src/test/suite/registerHoverProvider.test.ts`
    This is a read-only validation inventory: where a suite is also a fixed
    focused changed path, only its planned focused assertions may change; no
    additional suite/path is authorized.
- User / Domain Value: telemetry callers can submit only named, validated,
  privacy-filtered catalog events, while telemetry remains invisible to and
  unable to interrupt user workflows.
- Cohesive Change Group: internal catalog/factory plus named caller builders and
  enforcement. Splitting these would either expose the generic constructor or
  leave callers unable to construct valid events.
- Acceptance:
  - AC4 and AC5 pass.
  - Existing event names and exact allowed payload meanings remain unchanged.
  - All baseline builder targets and later editor/WebAPI families still use the
    same validated contract.
  - Forbidden content/path/identifier/error keys are filtered even if a schema
    accidentally includes them.
  - Raw SDK reporting remains confined to `VscodeTelemetryAdapter`.
- Validation:
  - `src/test/suite/telemetryEvent.test.ts` for catalog names, branded
    construction, allowlisting,
    string conversion, null/undefined omission, accidental schema allowance,
    and the complete forbidden-key set;
  - read-only `src/test/suite/createTelemetry.test.ts` for SDK report,
    sync/async dispose failure containment, initialization fallback, Noop, and
    browser-hosted port parity;
  - `src/test/suite/extensionLifecycle.test.ts`,
    `src/test/suite/viewerMessageRouting.test.ts`,
    `src/test/suite/openPreviewCommand.test.ts`,
    `src/test/suite/importAjsDefinitionViaWebApiCommand.test.ts`,
    `src/test/suite/registerDiagnostics.test.ts`, and
    `src/test/suite/registerHoverProvider.test.ts` for unchanged caller event
    meaning and routing;
  - `src/test/support/architectureDependencyRules.ts` and
    `src/test/suite/architectureDependencyRules.test.ts` for the internal
    telemetry-builder boundary. Synthetic bootstrap/presentation fixtures
    must reject generic value imports, named imports, `import type`, and
    type-only named imports of every listed `telemetryEvent.ts` internal name,
    while allowing `TelemetryPort`/`ValidatedTelemetryEvent` and named-builder
    imports;
  - `src/infrastructure/telemetry/VscodeTelemetryAdapter.ts` and
    `src/infrastructure/telemetry/NoopTelemetryAdapter.ts` for the required
    `import type` of `ValidatedTelemetryEvent` from
    `../../application/telemetry/TelemetryPort`, with no re-export from
    `telemetryEvent.ts` and no SDK/Noop behavior change;
  - read-only telemetry-family validation for unchanged bucket mappings,
    desktop/web values, and existing editor/WebAPI/viewer behavior;
  - read-only `src/test/suite/telemetryAdapter.test.ts` and
    `src/test/suite/createTelemetry.test.ts` for SDK report, sync/async dispose
    failure containment, initialization fallback, Noop, and browser-hosted
    port parity; these tests remain outside the changed-path list;
  - `rtk pnpm run build`, `rtk pnpm run test:full`, `rtk pnpm run qlty`,
    `rtk pnpm run lint:md`, and `rtk git diff --check`.
- Production Readiness:
  - Failure mode: construction remains deterministic; reporting,
    initialization, and disposal failures never alter workflow behavior.
  - Privacy: no content, path, credential, query, identity, URL, raw error, or
    stack leakage; only approved anonymous metadata and coarse buckets.
  - JP1/AJS compatibility: no definition parsing or business meaning changes;
    telemetry never inspects definition content.
  - Large input: builders receive only bounded counts/durations/categories and
    do not scan or retain large definitions or query text.
  - Desktop/web: same named builders and port contract; browser SDK/no-op path
    and both host runs required.
  - README/CHANGELOG: none expected; new/removed/renamed events or observable
    failure behavior require replan and an explicit privacy/CHANGELOG decision.
- Approval Boundary: exactly the listed telemetry production/test paths,
  including both infrastructure adapter paths for the type-import migration,
  plus the feature-local planning evidence update. The
  `telemetryAdapter.test.ts` and `createTelemetry.test.ts` suites are
  read-only validation, not approved changed paths. No path outside that list,
  new event, property, collection, product question, host behavior, or Feature
  9 quality gate.
- Dependencies: completed telemetry characterization and Slice 1 history;
  depends on Slice 2 completion because both slices may update the shared
  architecture dependency support/test paths listed above. It must not edit
  Slice 2 parser paths.
- Risks: accidental event-name/property drift, loss of legacy compatibility,
  incomplete caller migration, privacy regression, stale adapter imports or an
  unintended `telemetryEvent.ts` re-export, SDK behavior changes, type-only
  escape from the internal surface, and qlty movement from a large catalog
  split. The architecture assertion must distinguish the public
  `TelemetryPort.ts`/named-builder paths from the internal catalog/factory in
  every value and type-only import form without widening the public surface.
- Out of Scope: new telemetry, analytics policy, SDK replacement, telemetry
  settings UX, exact-number collection, Feature 9 thresholds, and unrelated
  call-site refactoring.

## Slice Order And Dependencies

1. Slice 1 is already complete and supplies viewer-boundary history only.
2. Slice 2 executes first because it is a small, isolated parser boundary and
   owns the first revision of the shared architecture-test paths.
3. Slice 3 executes second, consumes the post-Slice-2 architecture-test state,
   and may revise those shared test paths for telemetry. It must not edit Slice
   2 parser paths.

Slices 2 and 3 are behaviorally independent, but Slice 3 has a file-level
dependency on Slice 2 because the exact architecture-test paths are shared.
The order prevents concurrent ownership and enables separate review, approval,
validation, Completion Approval, and commits.

## Approval Boundaries

- Independent plan review covers the whole 3-slice plan and all candidate
  dispositions.
- Human Approval remains pending after review and must name the exact next
  slice and approved paths.
- Plan/replan approval must be committed by `approval-committer` before code
  work starts.
- Each remaining slice receives its own implementation review, Completion
  Approval, and focused commit before the next slice begins.
- Any path outside a slice's listed boundary, including deferred file/host
  candidates or `docs/specs/roadmap.md`, requires a new decision and possibly
  Replanning Mode.

## Feature-Level Validation

- Focused tests named in each remaining slice.
- Zero-exception architecture dependency suite.
- `rtk pnpm run build`.
- `rtk pnpm run test:full` for desktop and browser hosts; preserve the known
  environment caveat that browser startup may require sandbox-external
  permission, but do not treat teardown EPIPE/Premature-close logs as failures
  when the run exits successfully.
- `rtk pnpm run qlty` for every code slice and at feature completion.
- AC8 Markdown validation: `rtk pnpm run lint:md` for feature documents.
- AC8 diff validation: `rtk git diff --check` and focused diff review.
- No generated artifacts or configuration changes are expected.

## Feature-Level Production Readiness And Compatibility Risks

- Parser: error shape/text/position, no-partial result, normalization warnings,
  encoded and bounded-large definitions, and all consumers.
- Telemetry: stable names/properties, privacy allowlist and denylist, coarse
  buckets, Noop and SDK failures, lifecycle disposal, and all host call sites.
- Host: desktop/web builds and tests; no Node built-ins; no VS Code engine bump.
- JP1/AJS: no grammar, normalized meaning, v13 rule, list/flow/diagnostic/
  semantic-diff behavior, or file encoding change.
- Documentation: no README/CHANGELOG change unless behavior becomes observable;
  durable architecture already states the intended boundaries.
- Quality: existing baseline smells are review signals. No repository-wide
  threshold or Feature 9 gate is introduced.

## Feature Exit Readiness

- Current status: Not ready.
- Ready only when:
  - Slices 2-3 are complete, independently reviewed, completion-approved, and
    committed;
  - all slice and feature-level validation passes;
  - candidate dispositions are rechecked against final source;
  - no unapproved file/host, parser, telemetry, compatibility, or privacy work
    remains;
  - README/CHANGELOG and durable-documentation gates are evaluated;
  - the independent `feature-closer` performs Feature Exit.
- Expected durable propagation: none if implementation preserves current
  `architecture.md` and telemetry/use-case contracts. Any new durable decision
  discovered during implementation triggers Replanning Mode before Feature
  Exit.

## Out Of Scope And Follow-Up Ownership

- Feature 4 completed semantic-diff/viewer host adapters: history only.
- Feature 7 or a separate behavior feature: CSV clipboard failure/feedback.
- Separate unit-definition behavior feature: copy feedback/failure semantics.
- `import-definition-via-webapi`: WebAPI transport, credentials, and beta exit.
- Feature 9: differential quality-gate strengthening after bounded refactoring
  evidence exists.
- Separate intake/replan: localization leakage, new parser exception policy,
  async/cancellable parsing, telemetry collection changes, or any observable
  host behavior change.

<!-- markdownlint-enable MD013 -->
