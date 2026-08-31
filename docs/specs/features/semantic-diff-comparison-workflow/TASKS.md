# Feature Tasks: Semantic Diff Comparison Workflow

## Agent Brief

- Purpose: deliver one explicit file/Git `HEAD` comparison workflow that opens
  one reusable Semantic Diff Explorer context.
- Approved or active slice: none; the complete two-slice plan is independently
  reviewed and Human Approved, awaiting the focused plan commit.
- Do not implement runtime code, tests, generated artifacts, or configuration
  from this approval; implementation remains a separate slice gate.
- Preserve `ajsbutler.compareSemanticDiff`, VS Code `^1.75.0`, and the existing
  parser-error union.
- Consume the predecessor artifact builder and schedule-aware Explorer opener
  exactly once; do not rebuild comparison, schedule, output, or calendar facts.
- Pass a selected period under the predecessor's exact
  `options.scheduleComparisonPeriod` field; do not invent `period` or
  `options.period` aliases.
- Consume the calendar-owned internal Slice 1/2 companion for sidecar and
  Explorer lifecycle. This workflow does not register calendar sidecars or
  implement the public calendar action; that action belongs to calendar Slice 3
  after this feature's completion commit and a period-bearing context.
- Prepare immutable before/after descriptors, begin the Explorer-owned
  same-pass capture before artifact construction, bind its successful indexes
  to the exact context, and let bootstrap resolve opaque handles through the
  existing one-argument Explorer opener. The capture scope is the sole owner
  of retained indexes and source snapshots through `collecting` → `bound` →
  `registered` → `released`; the context registry stores only a borrowed
  binding. Composite cleanup calls `unregister(context, scope)` first and
  `scope.release()` exactly once, with the separate provider reservation
  released in the same transaction.
- Do not add WebAPI, index/arbitrary-ref comparison, persistence, telemetry,
  Git CLI, Node built-ins, or direct `.git` access.
- Read first: `SPECS.md`, this file, and predecessor contracts named below.
- Read `TRACEABILITY.md` when checking requirement and validation coverage.
- Validate docs with `rtk pnpm run qlty` and `rtk pnpm run lint:md`.
- Approval policy and document roles: `docs/specs/README.md`.

## Sync Rule

- Update this file in the same commit whenever a slice is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Inherited
  feature folders remain outside its scope.
- Update `docs/specs/roadmap.md` only when its unfinished ordering or entry
  conditions change and Main grants that scope.
- Keep implementation sequencing, approval, validation, risk, production
  readiness, and Feature Exit readiness here; keep requirements in `SPECS.md`.

## Plan Status

- Status: Reviewed plan Ready; awaiting focused plan commit
- Planning scope: complete two-slice plan covering file/period/source
  registration and Explorer handoff first, then optional Git `HEAD` retrieval
  and final documentation.
- Review status: Ready (`plan-reviewer` final verdict)
- Human approval: Approved.
- Active implementation slice: None

## Human Approval

- Status: Approved
- Approved at: 2026-08-31 (explicit user approval in Codex)
- Approved scope: The complete reviewed two-slice planning package for
  file/period comparison, Explorer handoff, optional Git `HEAD` retrieval,
  source lifecycle, validation, and durable documentation. Runtime
  implementation remains subject to its separate slice approval gates.
- Approved paths: `docs/specs/features/semantic-diff-comparison-workflow/SPECS.md`,
  `docs/specs/features/semantic-diff-comparison-workflow/TASKS.md`, and
  `docs/specs/features/semantic-diff-comparison-workflow/TRACEABILITY.md`.

The approved paths authorize only the focused plan-gate commit. No runtime,
test, generated-artifact, or configuration change is included.

Implementation must not start from this plan approval alone; the approved plan
must first be committed, and each implementation slice requires its own gate.

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

## Selection And Dependency Evidence

- Selected feature: `semantic-diff-comparison-workflow`, explicitly delegated
  on branch `docs/semantic-diff-comparison-workflow`.
- Branch evidence: this branch adds only
  `docs/specs/features/semantic-diff-comparison-workflow/` over roadmap commit
  `97d5ccfd`.
- Required completion-committed predecessors:
  `semantic-diff-identity-confidence`, `semantic-diff-structured-outputs`,
  `semantic-diff-review-risk-rules`, `schedule-semantics-expansion`,
  `semantic-diff-explorer`, and only the internal Slices 1-2 of
  `schedule-impact-calendar`. Calendar public Slice 3 is downstream: it
  depends on this feature's completion commit and a period-bearing context,
  so this feature must not depend on calendar Slice 3 or on completion of the
  whole calendar feature.
- Current repository baseline: `BuildSemanticDiffReportDataInput` is exactly
  `{ beforeContent: string; afterContent: string }`,
  `BuildSemanticDiffReportData` is `(input) =>
BuildSemanticDiffReportDataResult`, and
  `createBuildSemanticDiffReportData(parser, compare?)` parses both strings and
  calls the current `compareSemanticDiff` without a period option.
- Required future predecessor contract: the calendar-owned
  `createBuildSemanticDiffPresentationArtifacts(parser, compareWithArtifacts,
builder)` adapter keeps the source-text/parser-error boundary and accepts the
  exact future input
  `BuildSemanticDiffPresentationArtifactsInput =
BuildSemanticDiffReportDataInput & { options?: Pick<CompareSemanticDiffOptions,
"scheduleComparisonPeriod"> }`. Its callable shape is
  `(input: BuildSemanticDiffPresentationArtifactsInput) =>
BuildSemanticDiffPresentationArtifactsResult`. The command passes the
  selected value exactly as `options.scheduleComparisonPeriod`; no `period` or
  `options.period` alias is permitted. The adapter parses each side once,
  forwards that exact field to
  `CompareSemanticDiffInput.options.scheduleComparisonPeriod`, invokes
  `compareSemanticDiffWithArtifacts` and the pure builder once, and returns the
  established parser-error union or `{ context, scheduleImpact }`.
- The implementation gate must verify the completion-committed predecessor
  signatures, including the exact `scheduleComparisonPeriod` field, result
  union, and command adapter call shape. A mismatch is a Replanning trigger
  with the owning predecessor; do not add an overload, alias, or compatibility
  shim in this feature.
- Predecessor integration contract:
  `createScheduleAwareExplorerSession` consumes those artifacts, owns calendar
  sidecar registration, and calls the existing one-argument
  `OpenSemanticDiffExplorer(context)` exactly once for both available and
  unavailable schedule impact. The workflow supplies host-private source
  descriptors to the Explorer capture scope and binds the successful indexes
  to the exact context; bootstrap resolves those handles through the
  context-keyed opener adapter without changing this public/injected
  one-argument signature.
- Slice order is strict. Slice 2 depends on the completed and
  completion-approved Slice 1 command contract.

## Decision-Complete Interfaces And Data Flow

### Public Command And User Flow

- Keep command ID `ajsbutler.compareSemanticDiff`, category `JP1/AJS`, icon
  `$(diff)`, activation event, editor-title placement, and
  `editorLangId == 'jp1ajs'` enablement unchanged.
- Change both contributed `title` and `shortTitle` to `Compare Definition`, so
  the Command Palette renders `JP1/AJS: Compare Definition` without breaking
  keybindings or programmatic callers.
- Capture the active `TextEditor`, its document URI, and the after-side
  `document.getText()` exactly once at command start. The snapshot therefore
  includes unsaved changes and cannot silently switch documents while prompts
  are open.
- Prompt order is source picker (`Select Definition File`, `Git HEAD`), then
  period picker (`No schedule period`, `Specify schedule period`), then the
  two date prompts only when requested. `No schedule period` is the first and
  compatibility-default item. Nothing is written to workspace/global/secret
  storage.
- File source uses one `showOpenDialog`, one `openTextDocument(selectedUri)`,
  and exactly one `getText()` on the selected document. VS Code's configured
  document decoder is authoritative; no raw file-byte preflight is used.
  Cancellation at either picker or date prompt returns `cancelled` silently.
- A successful command begins the Explorer-owned same-pass source capture,
  then calls the injected `(parser, input) =>
BuildSemanticDiffPresentationArtifactsResult` callback exactly once with
  `{ beforeContent, afterContent, options?: { scheduleComparisonPeriod } }`,
  omitting `options` when no period is selected. That bootstrap callback alone
  invokes the calendar-owned artifact factory. After success, the command
  binds the capture exactly once and invokes the calendar-aware session opener
  exactly once; it ultimately calls the existing one-argument
  `OpenSemanticDiffExplorer(context)`. The calendar companion, not this
  command, owns sidecar registration and public-action availability. The
  command returns the normal Explorer session handle and does not
  render/open/copy Markdown or invoke a calendar action.
- The Explorer predecessor's common Output action remains the only route to
  Summary, Full, Audit, and JSON and calls
  `presentSemanticDiffOutput(context, mode)` with the same context object.

### Explorer Source Registration Boundary

- Consume the Explorer-owned same-pass capture API from
  `src/application/semantic-diff/semanticDiffSourceCapture.ts` and
  `src/application/parsing/AjsParserWithSourceIndexPort.ts`; do not recreate
  the earlier text-snapshot registration API. The workflow receives an
  injected `beginSemanticDiffSourceCapture({ before, after })` capability,
  where each `ImmutableSourceDescriptor` has only its fixed side, opaque
  `sourceHandleId`, and immutable decoded text/version facts. The returned
  scoped object is `{ parser, bind(context), release() }`, with lifecycle
  `collecting` → `bound` → `registered` → `released`, idempotent release, and
  the Explorer-defined closed bind/typed-exception unions. The scope remains
  the sole owner of retained indexes and immutable source-snapshot references
  for its whole lifetime.
- Begin capture before invoking the injected bootstrap callback
  `(parser, input) => BuildSemanticDiffPresentationArtifactsResult`. That
  callback alone invokes the calendar-owned
  `createBuildSemanticDiffPresentationArtifacts(parser, compareWithArtifacts,
builder)(input)` once. The enriched parser wrapper performs the same normal
  before/after parse calls and preserves the existing side-specific parser
  error union; the workflow never calls an application factory directly.
  The workflow owns this injected orchestration-callback boundary; Explorer's
  current-file builder remains independent. A future calendar callback is
  optional and may replace only this callback under its own approved contract,
  without changing capture, binding, registry ownership, or the one-argument
  opener.
  After a successful artifact result, call `bind(context)` exactly once. A
  successful closed bind yields `{ context, before: { sourceIndex,
  sourceHandleId }, after: { sourceIndex, sourceHandleId } }` and changes the
  scope to `bound`; the binding is borrowed and never transfers ownership.
  Only then does bootstrap register the exact `{ context, scope }` pair as a
  borrowed entry, changing the scope to `registered`, and invoke the existing
  calendar-aware session opener, which ultimately calls the one-argument
  `OpenSemanticDiffExplorer(context)` exactly once. No second opener argument
  or new Explorer hook is added.
- Before capture, prepare host snapshots and opaque handles without exposing
  host types inward. File-before uses the selected document's URI, version,
  and one decoded `getText()` result; Git-before uses the decoded
  `show(headCommit, ...)` result, version `1`, and an immutable
  `ajsbutler-git-head:` URI. The Git content-provider reservation may be
  created before the output context exists because its URI key is opaque and
  unique; the provider reservation remains a separate in-flight resource and
  is released by the composite disposer. It never transfers capture-scope
  ownership: `bind(context)` returns only a borrowed binding, and the exact
  context registry stores only a borrowed reference to that scope. After uses
  the active document URI, version, and text captured once at command start.
  Before/after side identity comes from descriptor order and handle IDs, not
  matching paths.
- Capture, provider reservation, context binding, calendar companion, and
  Explorer creation form one composite transaction. A parser error, artifact
  failure, typed `SemanticDiffSourceCaptureError`, closed bind failure,
  capacity rejection, cancellation, panel creation failure, or partial side
  registration first removes any borrowed exact-context entry, then calls the
  scope's idempotent `release()` exactly once, and releases the separate
  provider reservation exactly once. No registry, provider entry, index, or
  stale action remains. Direct scope release or a stale epoch invalidates
  borrowed registry references before any lookup can dereference them. Map a
  typed capture exception or unsuccessful closed bind to
  `source-capture-failed` without fabricating syntax errors; map provider
  `capacity-exceeded` to the stable `explorer-open-failed` outcome. Successful
  registration changes the scope to `registered` but never transfers
  ownership.
- Source actions resolve the retained side index and immutable snapshot through
  the context-keyed borrowed registry and never parse, rebuild an index, read
  Git again, or search the other side. A duplicate normalized `unitId` is
  ambiguous and returns the Explorer-defined `unit-missing` outcome; it never
  chooses by occurrence. `unregister(context, scope)` removes only the exact
  borrowed pair and then releases that scope exactly once. Direct release and
  stale epochs invalidate borrowed references, so disposal and a later
  independent session cannot resolve one another's handles.
- The implementation gate must verify the completion-committed Explorer
  source-capture types, callback and calendar-aware opener wiring, and
  `unit-missing` behavior. A mismatch stops implementation and routes
  Replanning to the Explorer owner; this feature must not add an overload,
  compatibility shim, or action-time parse.

### Period Validation

- Add a pure, host-neutral
  `parseSemanticDiffComparisonPeriod({ from, to })` boundary under
  `src/application/semantic-diff/`. It returns `{ kind: "valid", period }` or
  `{ kind: "invalid", reason }`, where reason is the closed union
  `invalid-from | invalid-to | non-increasing`.
- Accept exactly ASCII `YYYY-MM-DD`, a real proleptic-Gregorian calendar date,
  and `from < to`; retain the exact strings as the existing half-open
  `SemanticDiffComparisonPeriod` `[from, to)`. Do not use locale parsing,
  timezone, current clock, or `Date` rollover.
- Each input box uses `validateInput` to keep invalid input in-place. The `to`
  prompt also rejects `to <= from`. English and Japanese validation text is
  concise; unknown locale falls back to English.
- Do not add a period-length cap. Preserve the schedule predecessor's linear
  period behavior and its representative 144-rule, ten-year validation case.

### Source Safety And Stable Outcomes

- Use one shared constant `MAX_SEMANTIC_DIFF_SOURCE_BYTES = 8 * 1024 * 1024`
  for each decoded before/after snapshot, aligned with the Explorer
  predecessor's 8 MiB serialized-message safety boundary. Reject before
  parsing; never truncate.
- The active after document is captured from the active `TextEditor.document`
  with one `getText()` call; it is not reopened while prompts are displayed.
  The selected file uses one `workspace.openTextDocument(uri)` and one
  `TextDocument.getText()` call. VS Code owns decoding through the existing
  `files.encoding` setting, so UTF-8, BOM, and Shift_JIS documents use the
  same decoded JavaScript string as the editor. Do not add a raw
  `workspace.fs.readFile`/`TextDecoder` path for this workflow. An active
  editor `getText()` rejection maps to the existing `active-editor-failed`
  outcome. A selected-file `openTextDocument` or `getText()` rejection maps
  to the stable `before-file-read-failed` outcome; do not infer a more
  specific decode or I/O cause from the exception.
- Measure each decoded JavaScript string once with browser-safe
  `TextEncoder().encode(text).byteLength`; NUL is the only guaranteed
  non-text signal for a VS Code-decoded file snapshot, and is rejected as
  `before-file-non-text`. Other strings accepted by VS Code are treated as
  decoded text; this workflow does not promise a general binary detector.
  Reject more than 8 MiB before parsing or source registration. The decoded
  string's UTF-8 byte count, not a provider byte count, is authoritative.
- Keep `SemanticDiffCommandResult` as a closed discriminated union. Success is
  `{ ok: true, action: "explorer-opened", source: "file" | "git-head",
period: "not-requested" | "evaluated", sessionId }`. Failure is
  `{ ok: false, error: { code, reason?, side?, message } }`.
- Closed failure codes are `no-active-editor`, `active-editor-failed`,
  `after-non-text`, `after-too-large`, `source-picker-failed`, `cancelled`,
  `before-file-read-failed`, `before-file-non-text`, `before-file-too-large`,
  `git-head-unavailable`, `parse-failed`, `comparison-failed`, and
  `explorer-open-failed`, `source-capture-failed`. `parse-failed` retains the
  predecessor's separate
  before/after parser details internally and the visible message identifies
  the affected side(s) without echoing file content.
- `git-head-unavailable` carries the Git reason union defined below.
  Cancellation has no notification. Every other failure attempts at most one
  localized, actionable `showErrorMessage`; notification failure never replaces
  the stable command result.
- No failure opens an output document, Explorer, or calendar child. Failure
  before artifact construction calls neither downstream dependency; artifact
  failure never opens Explorer; Explorer creation failure relies on the
  predecessor companion's atomic registry/session rollback.

### Git `HEAD` Port And VS Code 1.75 Adapter

- Add application port
  `ReadGitHeadDefinition(input: { documentUri: string }):
Promise<GitHeadDefinitionResult>`. `documentUri` is an opaque serialized URI;
  the application contract contains no `vscode`, Git API, `Buffer`, path
  library, or infrastructure type.
- `GitHeadDefinitionResult` is `{ kind: "ready", content, ref: "HEAD" }` or
  `{ kind: "unavailable", reason }`. The closed reason union is
  `extension-missing | extension-disabled | activation-failed |
api-unavailable | repository-not-found | virtual-repository-unsupported |
head-missing | head-source-missing | submodule | binary | unsupported-encoding |
too-large | read-failed`. It deliberately has no
  `untracked` reason: an untracked or hidden/separate untracked status is not
  asserted and maps to the same non-assertive `head-source-missing` outcome
  when no HEAD source can be resolved. The public `ref: "HEAD"` is a stable
  before-side label, not an instruction to reread a moving ref.
- Implement the port in
  `src/infrastructure/git/VscodeGitHeadDefinitionSourceAdapter.ts`. Use a
  private minimal structural declaration for the VS Code 1.75 Git API v1;
  do not add a dependency on unpublished Git-extension source typings.
- Resolve `vscode.extensions.getExtension("vscode.git")`, activate it once if
  necessary, require `enabled`, call `getAPI(1)`, and use
  `api.getRepository(activeUri)`. Do not enumerate repositories or choose one
  by an ad-hoc prefix; the built-in provider owns nested repository selection.
- Require a `file` URI with the same scheme/authority containment as the
  returned `rootUri`. A missing extension is the normal web degradation path;
  a virtual/non-file repository is explicitly unavailable. Never fall back to
  a Git executable or direct repository files.
- Require the structural v1 methods `getObjectDetails`,
  `detectObjectType`, and `show`; if any is absent, return `api-unavailable`.
  Capture `repository.state.HEAD?.commit` once as an immutable `headCommit`.
  Use that hash for every `getObjectDetails(headCommit, relativePath)` and
  `show(headCommit, absoluteFsPath)` call. Return the stable `ref: "HEAD"`
  label while never rereading a moving ref; the index is never a source.
- Resolve the current document path first. Derive the object-inspection path by
  URI segment containment and slash normalization, rejecting outside-root or
  `..` traversal, then call `getObjectDetails(headCommit, currentRelativePath)`.
  If the current path has a usable object, use it regardless of working/index
  status; those statuses are advisory diagnostics only. Call
  `detectObjectType(objectHash)` once, using the returned object identifier,
  and gate non-blob, gitlink/submodule, binary, and other non-text objects
  before content retrieval.
- Enter the rename-candidate fallback only when the current-path
  `getObjectDetails` failure has `gitErrorCode === GitErrorCodes.UnknownPath`.
  Authentication, provider, and API failures must inspect no candidates and
  map to the existing stable `read-failed`, `api-unavailable`, or other
  capability-specific outcome. Only when the current-path lookup is missing,
  inspect the v1
  `indexChanges` and `workingTreeChanges` arrays for exactly one allowlisted
  rename mapping whose `renameUri` is the active URI and whose
  `originalUri` maps to the HEAD-relative source. The real 1.75 status
  allowlist is `INDEX_RENAMED` for an index change, or `MODIFIED`/`DELETED`
  with a `renameUri` for a working-tree change; VS Code 1.75 exposes no
  separate working-tree rename/copy enum. Reject `INDEX_COPIED`, any status or
  URI shape outside that allowlist, multiple candidates, and staged-plus-
  working rename chains. A missing candidate/object maps to
  `head-source-missing` and never
  asserts `UNTRACKED`, whose visibility can be hidden or configured in a
  separate group. A deleted-but-open tracked path succeeds through its
  current-path object when present; a separately recognized submodule
  repository may work normally, but a gitlink object (`mode` `160000`) is
  never decoded as a definition.
- For a candidate original path, an `UnknownPath` from its one permitted
  `getObjectDetails` lookup or its `show` call maps directly to
  `head-source-missing`; it never triggers another candidate search or a
  retry. Any other candidate lookup/show failure maps to the existing stable
  provider/API/read outcome without exposing exception text.
- For the selected current or unique original path, call
  `getObjectDetails(headCommit, relativePath)` exactly once for that path,
  call `detectObjectType(objectHash)` once, enforce object-size safety, and
  call `show(headCommit, absoluteFsPath)` once. Current-path success must not
  inspect rename candidates; fallback is entered only after a missing current
  object.
- `Repository.show(headCommit, absoluteFsPath)` is the authoritative decoded
  `textconv`/configured-encoding string, not raw blob bytes. When v1
  `detectObjectType` advertises an encoding, accept only the actual 1.75
  values `utf8`, `utf16be`, and `utf16le`; an omitted encoding remains subject
  to the configured `show` decoder, while an unknown advertised value is
  `unsupported-encoding`. Reject an advertised non-text MIME type, embedded
  NUL, or an 8 MiB post-decode UTF-8 overflow. Map missing object/path to
  `head-source-missing` and other provider/virtual/submodule failures to their
  stable reason without exposing provider exception text. Do not call a raw
  blob reader or substitute index/worktree content.
- Git-before source navigation is backed by a browser-safe
  `TextDocumentContentProvider` composed in infrastructure/bootstrap. Each
  command-scoped provider reservation receives a collision-free opaque key
  before any output context exists; after successful capture binding, that key
  is associated with the exact context. The `ajsbutler-git-head:` URI contains
  only that key and exposes no repository path, ref, or object identifier. The
  provider returns the exact decoded `show()` snapshot and never performs a
  second Git read. Define a
  fixed `MAX_GIT_HEAD_SNAPSHOT_ENTRIES = 8` active-entry limit. Reserve and
  register the provider entry before capture begins; when all eight entries
  are active, return the typed `capacity-exceeded` outcome before capture or
  panel creation, which the command maps to one `explorer-open-failed` result.
  Released/stale entries are removed immediately and may free capacity.
  Composite session disposal removes the registration exactly once, separate
  from the capture scope's `release()`, and a late or stale reveal fails
  closed. Tests cover key collisions, independent snapshots, capacity
  rejection, released-entry reuse, disposal, and reveal after disposal.
- Dirty, staged, and unsaved after content never changes before retrieval:
  before is the decoded `show(headCommit, ...)` snapshot labelled `HEAD`, and
  after is the one captured editor snapshot. Neither `diff*`, `buffer`, index,
  worktree read, nor arbitrary ref method is called.

### Localization, Privacy, And Accessibility

- Add command-local localization data under presentation for English and
  Japanese with exact English fallback. Localize source/period labels,
  validation, and error prose; do not translate paths, `HEAD`, dates,
  JP1/AJS identifiers, or raw values.
- Use VS Code QuickPick/InputBox title, prompt, placeholder, and
  `validateInput` surfaces so labels and validation are announced by the host.
  Keep distinct source labels and side-specific errors; do not encode state by
  icon or color alone.
- Add no telemetry. Logs, notifications, command results intended for display,
  and tests must not include definition content. The optional Git adapter keeps
  repository/path data inside the command/bootstrap host boundary and never
  places it in telemetry or webview messages.

## Impact Inventory

- Application: add pure period parsing and the plain Git `HEAD` source port;
  pass the exact `options.scheduleComparisonPeriod` field to the predecessor
  artifact adapter without changing comparison/result, schedule,
  output-context, report, or JSON meaning.
- Presentation: revise `semanticDiffCommand.ts`, add its English/Japanese text
  table, source/period prompts, VS Code decoded-document snapshots, closed
  command outcomes, and sole Explorer handoff.
- Presentation host integration: compose the Explorer-owned same-pass capture,
  exact-context bind, and calendar-aware one-argument opener through the
  existing command/bootstrap wiring. The Explorer feature owns source-index
  registration and lookup; this workflow owns source snapshot preparation and
  composite rollback, but adds no replacement source adapter or public action.
- Infrastructure: add the optional VS Code Git extension API v1 adapter and
  its browser-safe `ajsbutler-git-head:` content provider. No
  domain/parser/generated code changes and no infrastructure type flows inward.
- Bootstrap: inject Git capability, the predecessor artifact/session
  dependencies, the per-command capture capability, and the exact-context
  borrowed registry/opener through `extensionDependencies.ts` and
  `semanticDiffWiring.ts`; bootstrap selects no source and constructs no
  semantic facts. The registry accepts only the exact `{ context, scope }`
  pair and its composite disposer calls `unregister(context, scope)` before
  `scope.release()` exactly once. The calendar companion owns internal sidecar
  registration, while calendar Slice 3 owns the public action.
- Configuration: update only the existing `package.json` command title and
  short title. Preserve engine, activation, menus, command ID, and settings.
- Tests: extend command/build/bootstrap/package checks and add focused period,
  same-pass capture/bind, localization, and Git adapter suites. Preserve report,
  JSON, Explorer, calendar companion, parser, schedule, Flow, architecture,
  desktop, and web regressions.
- Durable docs: add
  `docs/requirements/use-cases/uc-compare-ajs-definitions.md`, index it, update
  `README.en.md`, `README.md`, and `CHANGELOG.md`, and describe the decoded
  Git `show`/textconv source and limitations. The roadmap dependency is already
  corrected by Main; this feature does not edit `docs/specs/roadmap.md`.
  Existing architecture already covers injected infrastructure boundaries, so
  no architecture edit is planned unless implementation discovers a reusable
  policy change and triggers Replanning.

## Implementation Slices

### Slice 1: Deliver File And Period Comparison To Explorer

- Status: Planned; blocked on predecessor completion, plan review, Human
  Approval, and the focused plan commit.
- Scope: retain the public command ID while changing its display name; add the
  pure period validator, command localization, decoded after/file document
  snapshots, explicit source and optional-period prompts, stable outcomes,
  exact predecessor input forwarding, Explorer-owned same-pass capture and
  exact-context binding, and exactly-once calendar-aware Explorer handoff.
- User / Domain Value: a reviewer can compare an open dirty definition with a
  selected file, optionally evaluate one explicit period, and immediately
  explore one trustworthy reusable result.
- Cohesive Change Group: one complete file-based command workflow and its
  application/presentation/bootstrap/package tests.
- Planned paths and approval scope:
  - `src/application/semantic-diff/parseSemanticDiffComparisonPeriod.ts`.
  - `src/presentation/vscode/commands/semanticDiffCommand.ts` and
    `semanticDiffCommandLocalization.ts`.
  - `src/bootstrap/extension/semanticDiffWiring.ts` and
    `extensionDependencies.ts`.
  - `package.json`.
  - `src/test/suite/parseSemanticDiffComparisonPeriod.test.ts`,
    `semanticDiffCommand.test.ts`, `semanticDiffWiring.test.ts`, the predecessor
    calendar-command companion integration test, and existing
    package/bootstrap contract tests affected by the changed injection shape.
- Acceptance:
  - `JP1/AJS: Compare Definition` invokes the unchanged command ID and reads
    the active buffer and selected file exactly once.
  - Source and period prompts follow the fixed order; no-period omits
    `options`, and a valid half-open period is forwarded only as
    `options.scheduleComparisonPeriod`; invalid or cancelled input invokes no
    parser/comparison/context/capture/bind/Explorer work and persists nothing.
  - The active after document is captured once from the active editor, and the
    selected file is opened once with `workspace.openTextDocument` and captured
    once with `TextDocument.getText()`, preserving VS Code `files.encoding`
    decoding including Shift_JIS. NUL is the only guaranteed non-text signal
    for these decoded file snapshots; it is rejected atomically, while other
    VS Code-accepted strings are not promised to be binary-classified. A
    selected-file open/read failure maps to `before-file-read-failed` without
    inferring a decode or I/O cause; an active-editor `getText()` failure maps
    to `active-editor-failed`. Parser failures retain side separation.
  - File success starts one Explorer-owned same-pass capture before the
    injected artifact callback, binds both successful side indexes exactly
    once to the resulting context, installs the exact borrowed `{ context,
scope }` registry entry, and reaches the one-argument Explorer opener
    exactly once. Parser errors preserve the normal before/after union;
    capture-contract errors map to `source-capture-failed`. Any cancellation,
    artifact/bind failure, or opener failure unregisters the exact borrowed
    pair first, then calls `scope.release()` exactly once and releases all file
    snapshots exactly once, with no action-time parse or index regeneration.
- Validation:
  - Add `parseSemanticDiffComparisonPeriod.test.ts` for format, real dates,
    leap days, year/month/day edges, `from == to`, reversed range, and the
    uncapped ten-year period.
  - Extend `semanticDiffCommand.test.ts` for prompt order, command/title
    compatibility, active/selected document open and `getText()` call counts,
    UTF-8/BOM/Shift_JIS decoded text, NUL, exactly/over 8 MiB measured with
    browser `TextEncoder`, active-editor `getText()` failures mapped to
    `active-editor-failed`, selected-file `openTextDocument`/`getText()`
    failures mapped to `before-file-read-failed`, all cancellation points,
    localized validation, unknown-locale fallback, side-specific parser
    errors, downstream throws, at-most-one notification, no persistence, exact
    `scheduleComparisonPeriod` forwarding, and context identity.
  - Extend `semanticDiffWiring.test.ts` and `semanticDiffCommand.test.ts` for
    file descriptors, capture-before-callback ordering, same-pass parser
    injection, both-side parser errors, exact-context bind, one-argument
    calendar-aware opener composition, typed capture failure mapping,
    `collecting` → `bound` → `registered` → `released` transitions,
    `unregister(context, scope)` before one `scope.release()`, idempotent and
    direct-release rollback, cancellation rollback, stale action rejection,
    and independent later sessions. Assert that source actions never parse or
    regenerate an index.
  - Extend calendar companion and Explorer/output integration tests only to
    prove `not-requested`/evaluated handoff and one normal Explorer for both
    impact states. Assert that this workflow never calls calendar sidecar
    registration or a public calendar action; public action coverage belongs to
    calendar Slice 3.
  - Run focused compiled suites, `rtk pnpm run qlty`, `rtk pnpm run build`,
    desktop extension tests, web tests, and the architecture dependency test.
- Production Readiness: bounded per-side input, no silent truncation, no
  duplicate expensive work, atomic cancellation/failure, localized accessible
  prompts, privacy-safe messages, unchanged JP1/AJS semantics, desktop/web
  file support, and preserved VS Code `^1.75.0`.
- Approval Boundary: period parser, file command flow/localization, command
  contribution title, predecessor artifact/Explorer wiring, and named tests.
  Git source implementation, durable final docs, or any predecessor contract
  change is outside this slice.
- Dependencies: completion-committed identity, structured-output, review-risk,
  schedule-semantics, and Explorer contracts plus calendar internal Slices 1-2.
  Calendar public Slice 3 is not a dependency. No dependency on Slice 2.
- Risks: the predecessor may land different symbols or command wiring; the
  calendar adapter may not yet expose exact
  `options.scheduleComparisonPeriod`; the Explorer may expose a different
  same-pass capture/bind contract; or size measurement may expose an 8 MiB
  boundary not previously explicit. Any mismatch requires stopping at the
  implementation gate and routing Replanning to the owning feature before code
  edits.
- Out of Scope: Git, WebAPI, index/ref selection, persistence, telemetry,
  report auto-open/copy, semantic changes, calendar sidecar registration,
  public calendar action/UI, and calendar Slice 3.

### Slice 2: Add Optional Git HEAD Source And Complete The Workflow

- Status: Planned; blocked on Slice 1 completion approval and focused commit.
- Scope: add the plain Git source port, VS Code 1.75 built-in Git adapter,
  `Git HEAD` picker path, current-path-first and allowlisted-rename/object
  safety, decoded/textconv source handling, Git-before source registration,
  desktop/web capability degradation, final durable docs, and full
  cross-source regression evidence.
- User / Domain Value: a reviewer can compare the current dirty, staged, or
  unsaved definition directly with its repository `HEAD` without leaving VS
  Code, while file comparison remains available when Git is absent.
- Cohesive Change Group: one optional Git-before-source vertical slice plus the
  completed public workflow documentation.
- Planned paths and approval scope:
  - `src/application/semantic-diff/GitHeadDefinitionSourcePort.ts`.
  - `src/infrastructure/git/VscodeGitHeadDefinitionSourceAdapter.ts`.
  - `src/infrastructure/git/VscodeGitHeadContentProvider.ts` for the opaque,
    bounded snapshot map used by Git-before source navigation.
  - `src/presentation/vscode/commands/semanticDiffCommand.ts` and its
    localization table.
  - `src/bootstrap/extension/semanticDiffWiring.ts` and
    `extensionDependencies.ts`.
  - `src/test/suite/vscodeGitHeadDefinitionSourceAdapter.test.ts`,
    `semanticDiffCommand.test.ts`, `semanticDiffWiring.test.ts`, and affected
    extension dependency/desktop/web contract suites.
  - `docs/requirements/use-cases/uc-compare-ajs-definitions.md`,
    `docs/requirements/use-cases/README.md`, `README.en.md`, `README.md`,
    `CHANGELOG.md`. `docs/specs/roadmap.md` is outside this branch because Main
    already corrected the Wave 3/Wave 4 dependency wording.
- Acceptance:
  - The adapter uses `vscode.git` API v1 `getRepository`, current `HEAD`,
    object inspection, type detection, and one `show`; it uses neither index,
    worktree, arbitrary refs, Git CLI, Node built-ins, `.git`, nor WebAPI.
  - Dirty/staged/unsaved and deleted-but-open tracked paths use the current
    buffer after side and the correct captured-commit `HEAD` before source. The
    adapter first looks up the active current path. Only a current-path
    `getObjectDetails` failure with `gitErrorCode ===
GitErrorCodes.UnknownPath` permits exactly one mapping from `indexChanges`
    status
    `INDEX_RENAMED`, or from `workingTreeChanges` status `MODIFIED`/`DELETED`
    with a `renameUri`, to the active URI. `INDEX_COPIED`, unsupported status
    or URI shapes, multiple changes, and staged-plus-working chains remain
    unavailable as `head-source-missing` without asserting an untracked state.
    Authentication, provider, and API failures inspect no candidates and map to
    their existing stable outcome. A candidate lookup or `show` returning
    `UnknownPath` maps directly to `head-source-missing` without retry.
  - Missing/disabled/failed Git, non-repository, unborn/missing `HEAD`, missing
    blob, virtual repository, gitlink/submodule, provider-reported binary or
    unsupported encoding, large object, and provider failure are stable,
    localized, and never affect file-source success. When
    `detectObjectType` advertises text encoding, only the v1 values `utf8`,
    `utf16be`, and `utf16le` are accepted; omitted encoding uses the configured
    `show` decoder, and an unknown value is rejected as
    `unsupported-encoding`.
  - The Git-before virtual snapshot is registered through a browser-safe
    `TextDocumentContentProvider` with one opaque collision-free key per
    command-scoped snapshot reservation before context creation; successful
    binding associates it with the exact context. Its URI contains no
    repository path or object identity; content is served from the captured
    `show()` string without a second Git read. The provider has the fixed
    eight-active-entry cap and returns typed
    `capacity-exceeded` when all entries are active; released entries are
    evicted and reusable, parent/session disposal removes the provider entry,
    and stale reveals fail closed.
  - Desktop Git works when the capability is available; web and desktop both
    degrade without it. A Git success follows Slice 1's exact period, artifact,
    same-pass capture/bind, Explorer, and output call-count contract;
    calendar sidecar registration remains calendar-companion-owned and no
    public calendar action is implemented here.
  - Durable docs describe the renamed command, two sources, optional period,
    Explorer default and common Output action, current-path-first HEAD lookup,
    decoded `Repository.show`/textconv and configured encoding behavior,
    limitations, and compatibility in `README.en.md` and `README.md`.
    Both READMEs remove the old command label and automatic-Markdown-report
    description; `CHANGELOG.md` records the observable workflow change.
- Validation:
  - Add `vscodeGitHeadDefinitionSourceAdapter.test.ts` with structural API
    doubles for extension absent/disabled/activation/getAPI failures;
    containing/nested repository selection; path boundaries; HEAD absent;
    immutable `state.HEAD.commit` capture; current-path success before status
    inspection; deleted/open and dirty or staged advisory statuses;
    current-path missing with one index `INDEX_RENAMED` and one working
    `MODIFIED`/`DELETED` plus `renameUri` fallback; `INDEX_COPIED` and
    unsupported URI/status shapes; multiple and staged-plus-working rename
    chains; ambiguous and no-candidate `head-source-missing`; exact
    head-commit arguments and call counts; current-path `UnknownPath`-only
    fallback; non-UnknownPath current errors with no candidate search;
    candidate `UnknownPath` mapping with no retry; current/original paths;
    missing object; `160000` gitlink; non-blob/provider-reported binary/text
    MIME; the v1 `utf8`/`utf16be`/`utf16le` encoding values, unknown encoding
    rejection, and configured `show` decoding/textconv; decoded NUL;
    exactly/over 8 MiB; and raw provider-error suppression. Cover
    virtual-provider key uniqueness,
    collision resistance, independent snapshots, fixed eight-entry capacity
    rejection as typed unavailable, released-entry reuse/eviction, disposal,
    and reveal-after-disposal failure. No test asserts an `UNTRACKED` status
    classification or assumes a visible untracked group.
  - Extend `semanticDiffCommand.test.ts`, `semanticDiffWiring.test.ts`, and
    source/provider dependency tests for Git selection/cancellation, opaque
    `ajsbutler-git-head:` URI/content handoff, localized reason mapping, file
    fallback, no report/copy, same context identity, exact
    `options.scheduleComparisonPeriod` forwarding, and exactly one
    artifact/capture-bind/session call. Assert exact-pair unregister precedes
    one scope release, stale source actions fail after composite disposal,
    action-time parsing is never used, and no calendar action is invoked here.
  - Add/extend desktop and web host tests: available desktop API, absent API on
    either host, and an available structural provider path without assuming a
    Git executable in test logic.
  - Run all Semantic Diff, schedule, Explorer, calendar, Flow, parser, package,
    localization, and architecture regressions; `rtk pnpm run qlty`,
    `rtk pnpm run build`, desktop tests, and `rtk pnpm run test:web`.
  - Run `rtk pnpm run lint:md`; validate the new use-case link, both
    `README.en.md`/`README.md` (including removal of old command and automatic
    Markdown wording), and `CHANGELOG.md`; verify the already-updated
    roadmap/calendar entry-condition wording without editing the roadmap in
    this feature branch.
- Production Readiness: feature-detected provider, stable no-Git web fallback,
  correct nested/rename behavior, bounded object inspection, no provider error
  leakage, no personal data telemetry, no partial session, unchanged parser
  meaning, and explicit README/CHANGELOG compatibility communication.
- Approval Boundary: application Git port, VS Code Git adapter, bootstrap and
  command Git path, Git-before virtual source registration, named tests, new
  durable use case/index, both README files, and CHANGELOG. Calendar sidecar
  registration and public action remain outside this feature; roadmap changes
  remain Main-owned and are not part of this branch.
- Dependencies: Slice 1 completion-approved commit and the same completion
  contracts for identity, structured outputs, review-risk, schedule semantics,
  Explorer, and calendar internal Slices 1-2. Calendar public Slice 3 is a
  downstream consumer of this feature and is not a dependency.
- Risks: the built-in Git extension is not a guaranteed web capability; API v1
  is public but its structural types are not shipped as this extension's
  dependency; current-path-first lookup must not let advisory status races
  override a valid object; rename detection varies by provider/status refresh;
  and `show` decoding/textconv honors provider/files encoding. Feature
  detection, structural doubles, exact fallback ordering, explicit
  `head-source-missing`, and no raw-blob fallback contain these risks.
- Out of Scope: index, arbitrary commit/ref or branch, folder comparison,
  direct Git operations, absent-side comparison, manual identity, persistence,
  telemetry, source editing, and new schedule/calendar semantics.

## Cross-Slice Validation And Approval Gates

- Each slice receives independent implementation review, explicit Completion
  Approval, and one focused completion commit before the next begins.
- The dependency chain is strict: calendar internal Slices 1-2 and the other
  completed predecessor contracts → this workflow Slices 1-2 and its
  completion commit → calendar public Slice 3. Calendar Slice 3 is the first
  owner of the public calendar action; this workflow only supplies the
  period-bearing context and never implements or invokes that action.
- The current code's no-period `BuildSemanticDiffReportDataInput` and
  `createBuildSemanticDiffReportData` shape remains documented as a baseline.
  The future calendar adapter must expose the exact
  `options.scheduleComparisonPeriod` forwarding shape before this workflow's
  implementation gate can open. A different predecessor signature or
  one-argument Explorer/source-handle contract stops implementation and routes
  Replanning to the owning feature.
- Source capture is the Explorer-owned scoped state machine:
  `collecting` → `bound` → `registered` → `released`. Prepare the
  file/Git-before and active-after immutable descriptors, begin capture before
  the injected calendar artifact callback, bind the successful context once,
  and let bootstrap register the exact borrowed `{ context, scope }` pair
  before the existing one-argument `OpenSemanticDiffExplorer(context)`.
  Composite cleanup calls `unregister(context, scope)` first and
  `scope.release()` exactly once, then releases the separate provider entry;
  direct release and stale epochs invalidate borrowed references before
  dereference. Stale actions must fail closed, no action re-parses, and no
  URI/content crosses the Explorer wire.
- Any new source, setting, command ID, output default, absent-side meaning,
  predecessor DTO/schema/session change, Git executable/Node dependency,
  compatibility-floor increase, telemetry, or calendar behavior is a
  Replanning and Human Approval trigger.
- Before Feature Exit, prove every WF requirement and use-case scenario maps to
  committed tests; all four output modes reuse one context; file works in
  desktop/web; Git available/unavailable is covered; malformed/large inputs
  are bounded; current-path-first HEAD lookup and only the exact allowlisted
  rename fallback are covered; the Git before content is decoded `show`/
  textconv output; and no content/path/personal identifier enters telemetry.
- Feature Exit updates only durable knowledge that passes the Durable
  Documentation Gate, confirms README/CHANGELOG/use-case/roadmap state, and
  removes only this selected feature folder after Closure Approval.

## Production Readiness Summary

- Failure modes: closed results, one actionable notification maximum, silent
  cancellation, atomic predecessor rollback, and no partial output/session.
- JP1/AJS compatibility: no parser, identity, review-risk, schedule, report,
  JSON, or calendar meaning changes; existing well-formed and malformed input
  behavior remains predecessor-owned.
- Scale: 8 MiB per source, 8 MiB Explorer message boundary, fixed eight-entry
  active Git snapshot map with typed capacity rejection, and no duplicate
  read/parse/compare/evaluate/context/render; period length remains uncapped
  with the predecessor's linear ten-year fixture.
- Host compatibility: file source on desktop/web; optional `vscode.git` API v1
  behind feature detection; no Git CLI, `.git`, filesystem-process assumption,
  or minimum-version increase.
- Documentation: new durable command use case plus index, `README.en.md`,
  `README.md`, and `CHANGELOG.md`; architecture only after a separately
  reviewed policy change. Main owns the already-corrected roadmap dependency
  wording.

## Feature Exit

- Definition of Done status: Not started
- Required durable propagation: `uc-compare-ajs-definitions.md`, requirements
  index, `README.en.md`, `README.md`, and `CHANGELOG.md`. The roadmap
  dependency is already corrected by Main and is not part of this feature
  branch.
- No architecture, glossary, vision, or context-map update is currently
  justified.
- Remaining risks before implementation: exact predecessor symbols must be
  checked against their completion commits; Git provider behavior must be
  verified through the v1 structural adapter tests.

## Validation

- [x] Investigate current command, bootstrap, package contribution, and tests.
- [x] Verify VS Code 1.75 built-in Git API v1 capability and argument shapes.
- [x] Align period behavior with schedule predecessor and size safety with the
      Explorer predecessor.
- [x] Plan file/Git, period, exactly-once, desktop/web, malformed/large,
      localization, accessibility, privacy, docs, and rollback validation.
- [x] Obtain independent `plan-reviewer` verdict `Ready`.
- [x] Obtain Human Approval for the reviewed planning package.
- [ ] Delegate the approved planning package to `approval-committer` for one
      focused plan-gate commit before implementation.

## Notes

- Planning changed only this feature's planning documents; Human Approval now
  authorizes one focused plan-gate commit, while no runtime code, tests,
  generated artifacts, or configuration change is authorized.
- Next decision: Main delegates this approved plan gate to
  `approval-committer`; no implementation slice is active.
- Source for the Git API verification: Microsoft VS Code tag `1.75.0`,
  `extensions/git/src/api/git.d.ts`, `api1.ts`, and `repository.ts`.
