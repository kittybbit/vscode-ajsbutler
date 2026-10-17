# Feature Specification: Telemetry simplification

## Purpose

Collect only the minimum aggregate usage information through seven fixed events
and four enum properties. Remove detailed, automatic, performance and legacy
instrumentation while preserving every JP1/AJS feature and host contract.
This is one cohesive transient branch feature: `telemetry-simplification`.

## Source

- Human request: Japanese “AJS Butler Telemetry 簡素化 修正指示書”, 2026-10-17,
  supplied in the current conversation. Source identity and complete discovery
  references: [intake
  evidence](/tmp/ajsbutler-telemetry-intake-20261017/discovery.md).
- Base: `origin/main` at `4ef3356dddad932ec514fb949831555b8ea77447`;
  branch: `codex/telemetry-simplification`.
- Existing [telemetry
  requirement](../../../requirements/cross-cutting/telemetry.md),
  [architecture](../../architecture.md), and observable
  [use cases](../../../requirements/use-cases/README.md) constrain preservation.
- JP1/AJS basis: this changes extension instrumentation, with no new JP1/AJS
  semantics or external JP1 specification claim. Existing definition, import,
  comparison, reporting and editor contracts remain authoritative.

## Requirements and acceptance

### R1: Closed event and property contract

Exactly these events may be defined and sent. Each event uses only its listed
keys and fixed string enum values. No optional extra metadata, measurements,
custom identifiers, development flag, raw event API or arbitrary property map
is exposed to callers. Preserve `ValidatedTelemetryEvent` and `TelemetryPort`.
Unknown events, keys and invalid enum values cannot reach the sender; enforce
both typed callers and validation of untrusted webview input.

<!-- markdownlint-disable MD013 MD060 -->

| Event                     | Required properties         | Trigger and frequency                                                                       |
| ------------------------- | --------------------------- | ------------------------------------------------------------------------------------------- |
| `extension.activated`     | `host`                      | Once after each completed activation                                                        |
| `viewer.open_completed`   | `feature`, `host`, `result` | Once at the result of an explicit Table/Flow open, including explicit existing-panel reveal |
| `search.executed`         | `feature`                   | Once per user search operation                                                              |
| `csv.exported`            | `method`                    | Once after a successful CSV copy/save                                                       |
| `webapi_import.completed` | `result`                    | Once at termination of an explicit import                                                   |
| `semantic_diff.completed` | `result`                    | Once at termination of an explicit comparison                                               |
| `semantic_diff.exported`  | `method`                    | Once after a successful explicit result copy/save                                           |

| Key       | Allowed values                   |
| --------- | -------------------------------- |
| `host`    | `desktop`, `web`                 |
| `feature` | `table`, `flow`                  |
| `result`  | `success`, `failed`, `cancelled` |
| `method`  | `copy`, `save`                   |

<!-- markdownlint-enable MD013 MD060 -->

Viewer results use only `success` and `failed`. Import and comparison results
also use `cancelled`. The event-specific Semantic Diff cancellation rule in
source sections 3.3 and 7.2 controls its generic success/failure summary.

### R2: Viewer completion and exclusivity

Send after successful display completion or terminal inability to display,
never at invocation alone. Preserve the existing ready/reveal behavior.
A missing/inaccessible editor or host/panel/display failure is `failed`.
An explicit reveal of an existing panel counts once. Automatic restoration,
background document refresh, close, selection, scope, expansion, relationship,
minimap and navigation-detail operations produce no telemetry.
An explicit operation opening/revealing a viewer has one completion event;
its navigation-detail notification must not add a second event. The operation
includes command, counterpart-navigation and Semantic Diff Flow opens. Display
completion uses a minimal panel-local acknowledgement after
the initial Table/Flow document commit; the existing READY handshake continues
to load the document and serve functional Flow callbacks. An already displayed
panel completes on successful reveal. Pending explicit operations complete once
each on acknowledgement, or fail on known build/transport/render failure or
disposal before acknowledgement. Restore/refresh without a pending explicit
operation sends nothing. No timeout or persistent operation tracker is added.

### R3: Search operation unit

Count a user-committed nonempty Table/Flow search once, irrespective of result
count. Do not send query text, length, timing, match counts or result metadata.
Do not count keystrokes, passive rerender, result navigation, clear or scope
reset. Preserve the current search UI and search/filter/reveal behavior.
Current controls submit on blur and use Enter/navigation to submit an inactive
query; Enter plus subsequent blur for that same operation must not duplicate.
If incremental execution is discovered on another path, group its input into
one user operation, without adding per-key events. Use the existing active-query
state to recognize the same committed operation before existing search work.
Keep current Table resubmission,
selection/reset and reveal behavior even when telemetry is suppressed. Enter
on an inactive nonempty query followed by blur, or repeated unchanged blur,
counts once; active result navigation counts zero. A different committed query
or a search after clear/scope/document reset starts a new operation. No-match
searches count once. Matching uses the existing search query equality rules;
no telemetry-specific normalized query store is added.

### R4: Exports require actual success

CSV and Semantic Diff copy events follow a fulfilled clipboard write; save
events follow a fulfilled file write. No event on rejected/thrown operation,
missing output or cancelled dialog. Posting a request, creating output,
showing a report or displaying a success notification alone is insufficient.
Preserve contents, formats, copy/save commands, dialogs and report lifetime.
Do not send output formats, data size, row counts, paths or destination names.

### R5: Import termination

Map successful import to `success`, user cancellation at any prompt to
`cancelled`, and failures including unsupported host to `failed`.
No start, input-step or duplicate terminal event. Keep imported definitions,
prompts, errors, read-only behavior and beta restrictions unchanged. Never send
URL/server/authentication information, HTTP status, error codes or unit counts.

### R6: Semantic Diff termination

Instrument the current explicit file/Git HEAD comparison workflow once, using
its terminal success/failure/cancelled result. Cancellation still creates no
partial report, Explorer or source session. Explorer redisplay, filtering,
selection, Output-mode presentation, source/Flow actions and report rendering
must not count as another comparison. A successful later report copy/save is
its own export event under R4. Do not send source kind, file/ref/identity data,
change counts, output mode, raw errors or comparison evidence.

### R7: Remove retired instrumentation

Remove all 47 old catalog definitions and their obsolete builders/call sites:
`ext.*`, `ajsbutler.tableViewer`, `ajsbutler.flowViewer`, `operation`,
`extension.lifecycle.*`, old `viewer.*`, old `search.table.*`/`search.flow.*`,
`webapi_import.workflow.*`, `editor.diagnostics.*`, `editor.hover.*`, and
`performance.*`. No dual sending or legacy compatibility layer.
Remove telemetry-only timers, buckets, DTO fields, requests/messages, helpers,
state and redundant telemetry tests once no longer needed. Retain timers,
state and messages necessary for functional readiness, navigation, diagnostics,
rendering or another non-telemetry purpose. Do not remove functional tests.

### R8: Privacy, isolation and compatibility

No user/session identifiers, definition/business content, names, paths,
queries, credentials, prompts/responses, raw errors, measurements or counts.
No custom ID generation or new data acquisition/retention for instrumentation.
Telemetry disabled, initialization failure, send failure and disposal failure
must leave all workflows and shutdown functional. Respect the existing VS Code
telemetry setting and safe Noop fallback; keep SDK ownership in infrastructure.
Domain has no telemetry dependency; application owns fixed validated events and
port; presentation detects actions/results; bootstrap assembles dependencies.
No new framework, compatibility adapter or unnecessary telemetry state manager.
Consume typed event builders directly from their substantive application owner;
remove pure re-export family modules. Keep generic construction/catalog private
and the untrusted parser at the infrastructure validation boundary. Architecture
checks enforce this public-symbol boundary without exception paths.

### R9: Validation and documentation

Meaningful catalog/privacy/type tests and operation boundary tests demonstrate
R1–R8, including exact count, permitted enums, duplicate suppression, no-send
paths, disabled telemetry and failed sender isolation. Preserve functional
coverage while retiring obsolete telemetry expectations. Required affected
unit/integration, TypeScript, ESLint, architecture, build, desktop/web and VS
Code minimum-host checks are selected in planning under the validation policy.
Align durable telemetry requirements and Japanese/English README collection
notices with the seven-event triggers, keys, enums, frequency and exclusions.

## Decisions and impact

- One feature owns the complete catalog migration and cleanup. These changes
  share one closed contract; no independent product feature or placeholder
  intake is needed. Slice boundaries and dependency order belong to planning.
- The existing WebAPI feature is inherited, remains selected only by its own
  work, and is untouched. This feature changes its instrumentation callers,
  never its beta exit or pending real-environment evidence.
- The durable cross-cutting telemetry requirement currently permits removed
  measurements and future families; it must be narrowed during approved work.
  README collection notices also change. Existing observable JP1/AJS use-case
  behavior is preserved; no new use case or roadmap item is required.
- Telemetry is externally observable collection behavior: update the Unreleased
  CHANGELOG with the smaller collection contract. No version bump is included.

## Compatibility

Keep `engines.vscode` at `^1.75.0`, desktop and web supported, shared production
code browser-safe, SDK contained in its adapter, and architecture exceptions
at zero. Preserve parser/list/flow/CSV, definition display, diagnostics, hover,
navigation, WebAPI import and Semantic Diff/report behavior and bytes.
This deliberately breaks the old telemetry event schema without dual sending;
it changes no persisted user data or JP1/AJS format.

## Non-goals

- New analytics, performance instrumentation, identifiers or collection scope.
- UI redesign, search semantics changes, report/export format changes or new
  Semantic Diff modes/actions.
- Parser/domain refactoring, dependency modernization or SDK replacement.
- WebAPI beta exit, real-server certification, fixture reproducibility work,
  changes to inherited feature records or unrelated durable documentation.

## Open questions

No product decision remains open for this plan. Main selected one atomic
catalog/call-site migration and selected minimal panel-local display completion
acknowledgement, including reused panels, restore, overlapping opens and
dispose-before-ack handling. Exact implementation scope and validation are in
TASKS; independent plan review and Human Approval remain pending. A contract
change returns through Main.
