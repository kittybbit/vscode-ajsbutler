# Feature Tasks: Semantic Diff Explorer

## Agent Brief

- Purpose: turn one completed Semantic Diff result into an accessible,
  read-only review workspace.
- Approved or active slice: the complete four-slice planning package is
  Human Approved; no implementation slice is active.
- Do not own comparison sources/periods, upstream rules, report modes,
  schedule-calendar behavior, definition editing, or review persistence.
- Reuse the existing Flow graph, nesting, search, navigation, focus, and
  semantic-highlight foundation; do not add a second renderer.
- Consume the reviewed identity, structured-output, and review-risk contracts
  without recreating their facts, counts, ordering, or wording.
- Keep the single immutable `SemanticDiffOutputContext` in the host-private
  session; transport only validated browser-safe DTOs and opaque IDs.
- Keep source-index IDs, source-handle IDs, capture-scope IDs, session IDs,
  and action IDs as pairwise-distinct opaque brands; a Flow node ID is the
  actual existing `FlowGraphNodeDto["id"]` value, not an allocated opaque
  handle.
- Keep Explorer `changeIds` as the actual
  `SemanticDiffChange["id"]` values and `confirmationIds` as the actual
  `SemanticDiffConfirmationRequiredItem["id"]` values from the retained
  `SemanticDiffOutputContext.result`; do not allocate replacement IDs. Their
  `(kind, id)` membership is validated against that exact context, and
  duplicate records/IDs remain distinct occurrences.
- Apply the closed record/reason target-side table, map relation canonical pairs
  to side-specific Flow edge IDs, and keep Flow relation edges non-focusable.
- Generate the application-owned source index in the same ANTLR parse that
  produces each normalized document; retain only the browser-safe index and
  immutable host snapshot needed by later source actions. Preserve UTF-16,
  CRLF, Unicode, duplicate, and malformed-input behavior without parsing on
  an action or keeping a global last-parse cache.
- Define closed request/reply/host unions, explicit nulls, error codes,
  correlation/session/action IDs, strict extra-key rejection, and the fixed
  serialized payload limit.
- Preserve VS Code `^1.75.0`, desktop/web parity, and the keyboard,
  accessibility, and high-contrast baseline.
- Read first: `SPECS.md`, this file, the three predecessor contracts, and
  `TRACEABILITY.md`.
- Approval policy and document roles: `docs/specs/README.md`.
- Next route: Main delegates the approved planning package to
  `approval-committer` for the plan-gate commit. Implementation still needs a
  separate approved slice and completion/closure gates.

## Sync Rule

- This file is the sole plan and current-state owner for this feature.
- Update it only when a slice, dependency, approval boundary, validation need,
  risk, or production-readiness decision changes.
- Other feature folders remain outside this feature. Roadmap ordering and
  entry conditions are unchanged, so `roadmap.md` is not edited.

## Current Replanning Boundary

- Preserve the four slices, their order, user values, Flow and transport
  contracts, approval gates, and the existing `AjsParserPort.parse(content)`
  compatibility surface. The current revision tightens Slice 3's DTO,
  ownership, host-source, and lifecycle contracts without adding a slice or
  changing the feature purpose.
- Slice 3 owns the application plain
  `AjsParserWithSourceIndexPort` result and scoped capture contract. Bootstrap
  first injects the scoped parser into the current file command's existing
  output-context/comparison builder, so Explorer source navigation works
  independently of the calendar/workflow feature. A future calendar/workflow
  callback may replace that per-command builder only after its own approval;
  Explorer has no reverse dependency on it.
- The capture scope performs fixed before-then-after enriched parses, retains
  both indexes and source snapshots, binds them to the exact successful
  context, and remains their sole owner until release. Registry entries are
  borrowed references. Composite cleanup unregisters the context entry before
  releasing the scope exactly once; all direct, cancelled, failed, and late
  paths are stale-safe and idempotent.
- Re-review route: independent `plan-reviewer` review of the revised
  `SPECS.md`, `TASKS.md`, and `TRACEABILITY.md`; this role does not grant Human
  Approval or commit the plan.

## Plan Status

- Status: Complete four-slice plan; Ready for the plan-gate commit.
- Planning scope: application projection, explorer surface, same-session
  Markdown, source reveal, Flow reveal/highlight/focus, accessibility,
  desktop/web compatibility, and failure handling for EXP-1 through EXP-10.
- Review status: Ready (`plan-reviewer`); all findings closed.
- Human approval: Approved.
- Active implementation slice: none.
- Slice order: Slice 1, Slice 2, Slice 3, then Slice 4. Each slice needs its own
  implementation review, Completion Approval, and focused commit.

## Human Approval

- Status: Approved
- Approved at: 2026-08-31 (explicit user approval in Codex)
- Approved scope: the complete four-slice Semantic Diff Explorer planning
  package, limited to docs-only planning and its recorded validation.
- Approved paths: `docs/specs/features/semantic-diff-explorer/SPECS.md`,
  `docs/specs/features/semantic-diff-explorer/TASKS.md`, and
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`.

This approval authorizes only the plan-gate commit. Implementation remains
blocked until an individual implementation slice receives its own approval
after the plan-gate commit; Completion Approval and Closure Approval remain
separate gates.

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

## Predecessor Contract Decisions

- `semantic-diff-identity-confidence` supplies stable identity decisions and
  `identityDecisionId` links. Explorer never matches or ranks candidates.
- `semantic-diff-structured-outputs` supplies `SemanticDiffResult`, typed
  details, canonical summary aggregation and ordering, output modes, and the
  virtual report provider. Explorer consumes its summary aggregate and output
  dispatcher; it never parses Markdown or JSON.
- `semantic-diff-review-risk-rules` supplies confirmation records and the
  closed nine-member reason union. Explorer filters and labels records but
  never decides whether confirmation is required.
- Implementation is blocked until the completion commits establishing those
  contracts exist. A missing reusable summary aggregate, stable record ID,
  typed target/detail, or reason code triggers Replanning rather than a
  presentation-side reconstruction.
- `semantic-diff-comparison-workflow` is a later consumer of this feature's
  source-capture contract. Slice 3 first composes its scoped parser into the
  current file command's existing output-context/comparison builder and binds
  the result only after that builder returns the successful immutable context.
  A later calendar/workflow adapter can use the same injected callback after
  its own approval; Explorer Slice 3 does not depend on that feature's
  completion, and neither feature changes the neutral `SemanticDiffOutputContext`
  or JSON result shape here.

### Same-Pass Source Capture Contract

- Slice 3 owns the application-only contracts in
  `src/application/parsing/AjsParserWithSourceIndexPort.ts` and
  `src/application/semantic-diff/semanticDiffSourceCapture.ts`. The first
  exports `AjsParserWithSourceIndexPort` with
  `parseWithSourceIndex(content: string): ParseAjsWithSourceIndexResult`.
  `ParseAjsWithSourceIndexResult` is the existing parser-error union on
  failure and, on success, exactly `{ ok: true, document: AjsDocument,
sourceIndex: SemanticDiffSourceIndex }`; it contains no URI, `TextDocument`,
  snapshot, parser node, generated-parser type, or domain wrapper. The second
  exports the host-neutral capture port and opaque descriptor/handle types;
  it imports only application contracts and has no VS Code or Node types.
- The capture API is an explicit state machine, not an implicit cache:
  `beginSemanticDiffSourceCapture({ before: ImmutableSourceDescriptor,
after: ImmutableSourceDescriptor })` starts in `collecting` and returns a
  scoped object with `parser: AjsParserPort`,
  `bind(context: SemanticDiffOutputContext): SemanticDiffSourceCaptureBindResult`,
  and idempotent `release(): void`. A descriptor contains only a fixed side,
  a `SemanticDiffSourceHandleId`, and the immutable decoded text/version facts
  required to verify the two parser inputs; host URI and `TextDocument` remain
  outside the application contract. The capture parser accepts exactly two
  calls in before-then-after order, verifies each call against its descriptor,
  stores each successful same-pass index privately, and throws a typed
  `SemanticDiffSourceCaptureError` for a wrong-order content mismatch, extra
  call, or post-release call. A parser error is returned through the existing
  `ParseAjsResult` for that side and does not prevent the second fixed-order
  parse, so the current builder preserves separate before/after parser errors;
  the scope cannot bind unless both parses succeeded. The first and second
  call ordinals define the sides even when text is identical; distinct text in
  the opposite order throws `capture-order-invalid` while preserving the
  unchanged parser result path. An extra/post-release parser call never
  invokes the enriched parser. Bootstrap catches only this typed exception
  and maps it to the caller's `source-capture-failed` outcome; it never
  fabricates a syntax error for a capture contract violation.
- The capture scope is the sole owner of both retained source indexes and
  immutable source-snapshot references from `collecting` through `released`.
  Successful `bind` moves it to `bound` and returns a borrowed binding; it
  never transfers ownership. The host context registry stores only that
  borrowed binding and moves the scope to `registered`; it never disposes the
  indexes or snapshots. A host-private composite disposer is the normal
  lifetime boundary and performs `unregister(context, scope)` first, then
  `scope.release()` exactly once. Repeated disposal is a no-op. Direct scope
  release, stale epoch, partial registration, panel creation failure,
  cancellation, parser/artifact/bind failure, and late completion invalidate
  borrowed registry lookups and release all scope-owned resources without
  dereference or cross-command leakage.
- `SemanticDiffSourceCaptureBindResult` is a closed plain union: success is
  `{ ok: true, context, before: { sourceIndex, sourceHandleId }, after: {
sourceIndex, sourceHandleId } }`; failure is `{ ok: false, code }`, where
  `code` is exactly `capture-parser-failed | capture-incomplete |
  capture-already-bound | capture-released`. The typed exception's closed
  `code` union is exactly `capture-order-invalid | capture-input-mismatch |
  capture-extra-parse | capture-released`. Binding is atomic and changes the
  scope to `bound` only on success; the binding is borrowed and cannot release
  the scope-owned resources. Registration accepts only the exact bound
  context/scope pair and changes the lifecycle to `registered`; release
  changes it to `released`, clears indexes, and makes subsequent parse/bind/
  registry lookup unavailable. The returned binding is handed to the
  bootstrap host registry only as a borrowed reference and is never
  serialized to the webview.
- Bootstrap composes the concrete adapter in the existing
  `src/bootstrap/extension/semanticDiffWiring.ts`. Its factory invocation is
  bootstrap-only: it injects the enriched
  `AjsParserWithSourceIndexPort` implementation into the scoped wrapper and
  passes the current file command an injected per-command
  `beginSemanticDiffSourceCapture` capability. The existing
  `createBuildSemanticDiffReportData(parser)` path (and the bootstrap callback
  that creates its output context) receives the scoped `AjsParserPort`, so
  this feature is independently usable before calendar/workflow delivery.
  A future calendar/workflow adapter may replace that callback after its own
  approval, but is not a prerequisite and is never invoked by Explorer.
  The wrapper preserves the existing `AjsParserPort` interface and every
  existing consumer (`parse(content)` remains unchanged), invokes
  `parseWithSourceIndex` exactly once for each side, returns only the existing
  `ParseAjsResult` to the current builder, and retains the plain indexes in
  the scope. No global `lastParse`, cross-command map, or action-time index
  regeneration is permitted.
- The parser-infrastructure implementation is
  `src/infrastructure/parser/AntlrAjsParser.ts` plus its existing raw-parser
  seam. Its enriched path walks one ANTLR tree, derives the normalized
  `AjsDocument`, and builds the source index before discarding raw parser
  objects. Index unit keys are the actual normalized IDs produced by
  `src/infrastructure/parser/normalization/normalize/unitBuilder.ts`
  (`unit.absolutePath()`); duplicate absolute paths are marked ambiguous and
  return unavailable rather than choosing by occurrence ordinal. The index
  allocator and mapper remain private to the adapter; only plain DTOs leave
  infrastructure.
- The current file command calls the injected capture capability with both
  immutable source descriptors before the existing report/output-context
  builder, then invokes that builder with the scoped parser. A future
  calendar/workflow command may call the same capability and its own approved
  artifact callback, but must not become a Slice 3 dependency. The host binds
  `{ beforeIndex, afterIndex }` exactly once to the successful context after
  the current/future builder returns; `OpenSemanticDiffExplorer(context)`
  remains one argument. Bootstrap resolves that same context-keyed registry
  entry and supplies private handles to the Explorer session. Capture,
  registration, and Explorer creation are one composite transaction: parser
  failure, artifact failure, bind failure, panel creation/cancellation, or
  partial side registration runs unregister-before-release cleanup for every
  acquired index, snapshot, and handle. Concurrent captures are isolated by
  scope identity; disposal and stale epochs make later lookup/reveal
  unavailable.
- Source lookup/reveal uses the retained side index and immutable snapshot
  only. It never invokes a parser, reconstructs an index, searches another
  side, or selects a duplicate normalized ID. The existing application
  `lookup({ sourceIndexId, unitId, targetKind, parameterKey? })` contract and
  all UTF-16/range/fallback rules remain unchanged.

## Design Decisions

### Immutable Session And Messages

- One successful existing file comparison creates exactly one immutable
  `SemanticDiffOutputContext` upstream and one
  `SemanticDiffExplorerSession` retaining that same object identity: opaque
  session ID, context, display language, and host-private before/after source
  handles. Explorer is the default successful destination; no automatic output
  document is opened first. The before/after source indexes are captured by
  the scoped same-pass parser session before this context exists and are
  attached only by the exact-context bind after comparison success.
- The host retains URIs, compared text snapshots, document versions when
  available, result/report objects, and action lookup. The webview receives a
  plain `SemanticDiffExplorerViewModel`; its action descriptors contain only
  opaque action IDs, never arbitrary URI/path/content or highlight payload.
- The host-only opener has one argument and one asynchronous concrete return
  type. `SemanticDiffExplorerSessionHandle` is exactly
  `{ sessionId: SemanticDiffExplorerSessionId; panel: WebviewPanel;
dispose(): void }`, where `WebviewPanel` is the VS Code presentation/host
  type and is never imported by application or webview code. The opener type
  is `OpenSemanticDiffExplorer(context: SemanticDiffOutputContext):
Promise<SemanticDiffExplorerSessionHandle>`; it has no second argument.
- Requests, replies, and host messages use closed discriminated unions. Request
  kinds are exactly `ready`, `refresh`, and `action`; every request has exactly
  `sessionId: SemanticDiffExplorerSessionId`, monotonic finite `requestId`, and
  `actionId: SemanticDiffExplorerActionId | null` (`null` for the first two,
  registered non-empty ID for `action`). Reply kinds are exactly
  `ready`, `refreshed`, and `action`; every reply echoes those three fields and
  has exactly `ok`, `payload`, and `error`, with successful `error: null` and
  failed `payload: null`. Host kinds are exactly `session`, `action-result`,
  `failure`, and `close`, using the same correlation fields and explicit
  nullable payload/error fields. Unknown discriminators, missing/extra keys,
  non-finite IDs, wrong sessions, and non-session-derived payloads are
  rejected atomically.
- The closed error-code union is `invalid-request`, `unknown-session`,
  `unknown-action`, `stale-request`, `superseded-session`,
  `disposed-session`, `record-not-found`, `unavailable-target`,
  `stale-source`, `source-lookup-failed`, `flow-not-ready`,
  `flow-target-missing`, `output-failed`, `payload-too-large`, and
  `host-disposed`. Error detail is the following typed, nullable shape; no
  generic opaque target type, action/record target ID, localized prose, URI,
  content, parser object, or raw host identity is transported:

  ```ts
  type SemanticDiffExplorerErrorDetail = Readonly<{
    side: SemanticDiffSide | null;
    targetId: SemanticDiffUnitReference["id"] | null;
  }>;
  ```

  `targetId` is only the exact semantic unit ID from the retained context;
  action IDs and record IDs are carried only by their existing action/request
  fields and are never copied into error detail. Missing or malformed target
  records use `targetId: null`. Source and Flow failures use the unit ID only
  when the context contains that exact unit; request, session, action, record,
  host, and payload failures otherwise use `targetId: null`.

- Exact envelope key sets are fixed: `ready`/`refresh` requests have only
  `{type, sessionId, requestId, actionId: null}`; `action` requests have only
  `{type, sessionId, requestId, actionId}`; `ready`/`refreshed` replies have
  `{type, sessionId, requestId, actionId: null, ok, payload, error}`;
  `action` replies have the same keys with a non-null
  `SemanticDiffExplorerActionId`;
  `session` host messages have `{type, sessionId, requestId: null,
actionId: null, ok: true, payload, error: null}`; `action-result` has the
  action reply keys; `failure` has `{type, sessionId:
SemanticDiffExplorerSessionId | null, requestId: finite positive integer | null,
actionId: SemanticDiffExplorerActionId | null,
ok: false, payload: null, error}`; and `close` has
  `{type, sessionId, requestId: null, actionId: null, ok: true, payload: null,
error: null}`. Success always has non-null payload/error null; failure always
  has payload null/error non-null. No missing or extra key is accepted.
- Serialized Explorer messages have a fixed 8 MiB UTF-8 limit measured before
  posting. An oversized session/action returns only `payload-too-large`, does
  not install partial state, truncate, or fall back, and leaves later valid
  sessions/actions independent.
- Each panel owns one session. Ready/refresh replays the same view model;
  disposal increments its `disposeEpoch`, removes action handles, releases
  source snapshots, report references, and the retained context. The returned
  handle's `dispose()` is idempotent, and `panel.onDidDispose` invokes the same
  host-private composite disposer. Slice 2 initializes its source-lifetime
  release hook as a no-op; Slice 3 attaches the capture composite to that
  hook without changing the public handle. Independent panels and late async
  completions cannot update, focus, post, or recreate state.
- Parse/comparison failures occur before panel creation. Explorer-open failure
  rejects the asynchronous opener only after partial registry/scope cleanup;
  the current file command maps that rejection to its existing
  `display-failed` outcome and a future workflow caller maps it to
  `explorer-open-failed`. Later source, Flow, and report failures are isolated
  action results and preserve the session.
- Definition content, source URIs, host paths beyond existing semantic target
  paths, and parser objects are never sent to telemetry.

### Summary, Hierarchy, And Filter

- Seven fixed cards consume `context.summary` as their sole summary source:
  Changes (five kind
  subcounts), Elements, Attributes, Confirmation Required, Unsupported (three
  kind subcounts), Limitations, and Schedule Run Changes. Zero buckets remain
  visible and filtering never changes counts.
- The tree has one leaf for every upstream change, confirmation record,
  unsupported record, limitation, and schedule run change. Records are not
  target-coalesced because the neutral contract does not define that link.
- Primary placement is removed-before; other changes after-then-before;
  confirmation target; unsupported declared side/target; limitation
  `unitPath`; schedule `unitPath`. Relations use the longest common parent of
  real endpoint paths. No-path records use a final `Comparison-level findings`
  group. Rename/move appears once under after and retains before as metadata.
- Only required path ancestors are materialized as job-group/unit hierarchy.
  Sibling paths use locale-neutral UTF-16 ordinal order. Leaves use fixed kind
  order change, confirmation, unsupported, limitation, schedule, then the
  upstream canonical ID/code order. Localization never affects order.
- Discriminated leaves expose record ID/kind, change or confirmation state,
  target, typed rationale/detail/constraints, and explicit source/Flow action
  availability. Presentation localizes codes and escapes raw values without
  reconstructing rules.
- `All` is default. `Confirmation required` retains confirmation records and
  changes whose upstream level is `confirmation-required`, pruning empty
  ancestors, and uses the exact combined count already present in the summary.
  It never infers state from prose, constraints, color, or target, and never
  recalculates a summary or predicate.
- Expansion and selection are panel-local. Filtering keeps a hidden selection
  latent, moves focus to the filter, exposes no false `aria-selected`, and
  restores selection/ancestors when cleared.
- No findings shows zero-inclusive cards, a distinct empty status, no rows,
  and enabled Markdown. Filter-no-match is a separate status and does not
  replace the unfiltered session.

### Explorer Interaction And Scale

- Use a dedicated `ajsbutler.semanticDiffExplorer` webview panel and browser
  bundle opened by the existing comparison command. No command ID,
  contribution, source choice, or period input changes.
- Success opens Explorer instead of automatic Full Markdown. Its `Output`
  action invokes the structured-output feature's common four-mode picker and
  `presentSemanticDiffOutput(context, mode)` with the exact retained context;
  it does not copy the mode list, re-run comparison, rebuild context, or
  re-aggregate summary. Clipboard writes remain only in the explicit copy
  command.
- Cards are descriptive, not tab stops. Native toolbar/filter controls and a
  roving-tab-stop tree implement `tree`/`treeitem`, level/expanded/selected/
  position metadata, Arrow navigation/expansion, Home/End, Enter selection,
  and Tab access to row actions.
- Visible focus, text/icon labels, and a live status announce filtering,
  progress, success, failure, and unavailability. Color, position, animation,
  and hover are never sole signals; forced colors/high contrast are explicit.
- Flattened visible rows use existing `react-virtuoso` above 200 rows with
  20-row overscan. Stable IDs and tree metadata survive virtualization.
  Projection is memoized and no action rebuilds comparison or Flow data.
- A 10,000-leaf fixture keeps bounded DOM, deterministic order/counts, and
  keyboard first/last/filter access without truncating records.
- Failed actions refocus the invoking button. Successful source, Flow, or
  report actions focus their destination. Refresh restores a visible selected
  row, otherwise tree root, otherwise filter. The focused Explorer leaf and
  an `aria-live` status announce endpoints and state.

### Source Navigation

- Source actions use the exhaustive record/reason target-side table in
  `SPECS.md`: `added` is after, `removed` is before, `changed`/`renamed`/`moved`
  are after, `conditional-relation-removed` is before, and the other eight
  confirmation reasons are after. Unsupported/limitation/schedule records
  use only an explicit upstream side. Other records expose an action only with
  an unambiguous declared side and exact target.
- Unit/jobnet/job-group selects the unit declaration name token. Attribute
  selects every occurrence of the exact parameter key in that unit, with the
  first source-order occurrence primary. Relation/global/unsupported locators
  remain unavailable instead of selecting approximately.
- `SemanticDiffSourceLocatorPort` and `SemanticDiffSourceIndex` are
  application-owned browser-safe contracts with branded opaque IDs. The ANTLR
  infrastructure adapter is the only index producer: during the same ANTLR
  invocation that returns the normalized `AjsDocument`, it generates an
  opaque `sourceIndexId` through the application-provided allocator, then
  emits the unit declaration header/name range and every exact parameter-key
  occurrence range in source order. The index's `unitId` is the actual
  normalized `AjsUnit.id`/`absolutePath()` from
  `src/infrastructure/parser/normalization/normalize/unitBuilder.ts`;
  duplicate paths are ambiguous and unavailable. `sourceIndexId`, source
  handles, and action handles are opaque; the normalized `unitId` remains the
  semantic lookup key and never adds URI or content encoding beyond the
  existing normalized path value. It returns no URI,
  `TextDocument`, snapshot, parser node, generated type, or domain `AjsUnit`.
- The source-index DTO shapes are fixed and contain no host fields:

  ```ts
  type SemanticDiffSourceIndexId = string & {
    readonly __semanticDiffSourceIndexId: unique symbol;
  };
  type SemanticDiffSourceHandleId = string & {
    readonly __semanticDiffSourceHandleId: unique symbol;
  };
  type SemanticDiffCaptureScopeId = string & {
    readonly __semanticDiffCaptureScopeId: unique symbol;
  };
  type SemanticDiffExplorerSessionId = string & {
    readonly __semanticDiffExplorerSessionId: unique symbol;
  };
  type SemanticDiffExplorerActionId = string & {
    readonly __semanticDiffExplorerActionId: unique symbol;
  };
  type SemanticDiffSourcePosition = Readonly<{
    line: number;
    character: number;
  }>;
  type SemanticDiffSourceRange = Readonly<{
    start: SemanticDiffSourcePosition;
    end: SemanticDiffSourcePosition;
  }>;
  type SemanticDiffSourceParameterOccurrence = Readonly<{
    parameterKey: string;
    occurrenceOrdinal: number;
    range: SemanticDiffSourceRange;
  }>;
  type SemanticDiffSourceUnitEntry = Readonly<{
    unitId: string;
    headerRange: SemanticDiffSourceRange;
    nameRange: SemanticDiffSourceRange | null;
    parameterOccurrences: readonly SemanticDiffSourceParameterOccurrence[];
  }>;
  type SemanticDiffSourceIndex = Readonly<{
    sourceIndexId: SemanticDiffSourceIndexId;
    unitEntries: readonly SemanticDiffSourceUnitEntry[];
  }>;
  ```

  Allocators return the corresponding brand and never derive an ID from a
  URI, path, content, or another brand. Since TypeScript brands are erased at
  runtime, each allocator also uses a kind-specific host namespace prefix and
  monotonic per-kind sequence, and the owning registry validates both that
  prefix and membership before accepting an ID. Validators reject empty,
  malformed, unknown, expired, or cross-kind IDs. Range positions and
  occurrence ordinals are finite non-negative integers; ranges are ordered
  half-open positions. `FlowGraphNodeDto["id"]` and
  `FlowGraphEdgeDto["id"]` remain existing graph values and are not replaced
  by these opaque handles.

- The index validator accepts exactly those DTO keys, validates every nested
  position/range and occurrence ordinal, requires the `sourceIndexId` to be
  registered for the capture scope, and preserves unit-entry/parameter
  occurrence order. It does not require ranges to be globally disjoint,
  because parameter tokens may lie within a declaration header range; it does
  reject reversed ranges, non-finite values, negative values, extra keys, and
  unregistered IDs before the index enters the host registry.
- The private lookup contract is fixed to
  `lookup({ sourceIndexId, unitId, targetKind, parameterKey? })` with no extra
  keys. `targetKind` is `unit | jobnet | jobgroup | attribute`; the first three
  omit `parameterKey`, while `attribute` requires it. Success returns exactly
  `{ primaryRange, occurrences }`. Unit/jobnet/jobgroup return the declaration
  name as `primaryRange` and `occurrences: []`; attribute returns the first
  source-order exact-key range as primary plus every matching occurrence in
  source order. Missing source-index, missing or ambiguous normalized unit,
  missing key/occurrence, unsupported kind, malformed source, stale source,
  and expired index use the fixed failure codes in `SPECS.md`; an ambiguous
  normalized unit maps to the existing `unit-missing` code and never selects
  an occurrence.
- The lookup types are fixed to the following closed shapes. The first union
  member must not contain `parameterKey`; the second must contain it and no
  other key. Success has only `primaryRange` and `occurrences`; failure has
  only the fixed `code`.

  ```ts
  type SemanticDiffSourceLookupRequest =
    | Readonly<{
        sourceIndexId: SemanticDiffSourceIndexId;
        unitId: string;
        targetKind: "unit" | "jobnet" | "jobgroup";
      }>
    | Readonly<{
        sourceIndexId: SemanticDiffSourceIndexId;
        unitId: string;
        targetKind: "attribute";
        parameterKey: string;
      }>;
  type SemanticDiffSourceLookupResult =
    | Readonly<{
        primaryRange: SemanticDiffSourceRange;
        occurrences: readonly SemanticDiffSourceRange[];
      }>
    | Readonly<{
        code:
          | "source-index-missing"
          | "unit-missing"
          | "parameter-key-missing"
          | "parameter-occurrence-missing"
          | "unsupported-target-kind"
          | "malformed-source"
          | "stale-source"
          | "expired-source-index";
      }>;
  ```

  Duplicate entries with the same normalized `unitId` are retained in the
  index for evidence but make lookup return `unit-missing`; no occurrence
  ordinal or similarly named unit may resolve the ambiguity.

- The lookup validator enforces the runtime namespace/membership check for
  `sourceIndexId`, exact request keys, the closed `targetKind` union, and the
  presence/absence of `parameterKey` shown above before any lookup. It never
  treats a source handle, session ID, action ID, Flow node ID, or Flow edge ID
  as a source-index ID.
- Ranges are zero-based half-open UTF-16 line/character positions; CRLF is one
  line break and surrogate pairs count as two code units. Duplicate keys keep
  every occurrence and the first is primary. Malformed/incomplete parse is a
  closed unavailable result. Immediately before source reveal the host
  revalidates session epoch, source index, current decoded document text, and
  document version when available; stale, missing, unparsable, ambiguous,
  unavailable, or expired sources never search another side or similarly named
  unit. File sources are reopened with the injected
  `openTextDocument(uri).getText()` path for this check, preserving VS Code's
  configured decoding including Shift_JIS and BOM behavior; independently
  decoding `workspace.fs` bytes is not an identity check.
- The same-pass parser adapter derives the full unit header range from the
  ANTLR `unitAttribute` context (`UNIT_KEY` through `SEMI`), the name
  subrange from its `TEXT` value token before the first comma, and parameter
  occurrences from each `unitParameter` `PARAMETER_KEY` token/context.
  Empty names, malformed name fields within an otherwise indexed unit, or
  non-unique names fall back to the header range; malformed/incomplete source
  parsing returns unavailable and never performs fuzzy text search. The
  normalized domain is unchanged, and no source action invokes this parser
  path again.
- Desktop/web use injected decoded-document and navigation capabilities;
  shared code imports no Node or VS Code type. File and Git source selection
  remain workflow-owned. For a Git HEAD source the workflow supplies a
  read-only `GitImmutableSourceProvider`/opaque source handle and the decoded
  immutable content used by the same-pass capture; Explorer does not call Git,
  inspect `.git`, or reconstruct a HEAD snapshot. The provider is revalidated
  through its immutable revision/content contract before reveal.

### Flow Reuse, Overlay, And Focus

- Extend the existing `buildSemanticDiffFlowHighlights` foundation to return
  before/after sets. Added maps after, removed before, and renderable changed/
  renamed/moved facts after. Missing real targets have no action/highlight.
  Relation `canonicalPair` maps to the exact side-specific
  `FlowGraphEdgeDto.id` from the corresponding graph; no display-string,
  localized-pair, or session-generated synthetic edge ID is allowed.
- Add the explicit stable `FlowGraphEdgeDto.id` to every graph producer and
  make `flowGraphEdgeSemanticDiffKey` return that same ID. Encode the ordered
  `(source, target, type, occurrenceOrdinal)` tuple with UTF-16-code-unit
  length prefixes. `occurrenceOrdinal` is the zero-based deterministic ordinal
  for that exact tuple in the owning source unit's relation list, so delimiter-
  containing and supplementary-Unicode IDs cannot collide and same-type
  duplicates remain distinct. `seq` and `con` edges with equal endpoints remain
  distinct; expanded, before, and after graphs retain real IDs, and a remapped
  before endpoint gets its own before ID. Update existing graph builders,
  semantic-diff highlight lookup, document validation, React Flow projection,
  and their tests/approval paths to consume the formal ID; React Flow `id` is
  exactly the DTO ID.
- Additive kinds are `added`, `removed`, `changed`, and
  `confirmation-required`. Overlay `changeIds` are the existing
  `SemanticDiffResult["changes"][number]["id"]` string values and
  `confirmationIds` are the existing
  `SemanticDiffResult["confirmationRequired"][number]["id"]` string values.
  The host validates each ID against the exact retained context result before
  applying the overlay; no new allocator or opaque record brand is used, and
  duplicate records/IDs remain retained. Precedence is confirmation-required,
  removed, added, changed without discarding associated IDs.
- A Flow action applies the target-side table, resolves the exact existing Flow
  scope, and immediately before opening/ready/focus revalidates session epoch,
  scope, target, snapshot/version, and overlay ownership. It then builds one
  normal `UnitListDocumentDto` plus the optional `semanticDiffOverlay`
  augmentation defined in `SPECS.md` and sends it through the existing viewer
  host message. There is no new Flow overlay variant: the exact apply/clear
  envelope is `{ type: "changeDocument", data }`, where `data` is the existing
  validated document with a non-null augmentation for apply, the same base
  document with `semanticDiffOverlay: null` to clear only the overlay, or
  `null` to clear the document and overlay. An omitted augmentation means
  ordinary base data and no overlay. Supersession validates the new owner
  first, posts the new complete document once, and a late old-owner clear posts
  nothing.
- Focus reuses the existing viewer host message
  `{ type: "revealUnit", data: { absolutePath } }` and the Flow webview's
  existing `{ type: "ready" }` request/host `onReady` sequence. These viewer
  messages have no new reply envelope: parser/validator rejection is atomic
  and leaves the current document unchanged; ready/onReady failure follows
  the existing viewer failure notification and maps the Explorer action to
  `flow-not-ready`, while an absent/invalid target maps to
  `flow-target-missing`. Successful or failed Flow actions still use the
  existing Explorer `action-result` reply envelope from Slice 1. The exact
  Explorer session/action/owner fields remain host-private, and the 8 MiB
  limit applies only to Explorer wire messages, not existing viewer messages.
- The existing viewer parser accepts only `{type, data}` for
  `changeDocument`/`revealUnit`; the Flow document validator retains the
  optional `semanticDiffOverlay` and rejects extra fields, invalid IDs/states,
  or malformed base documents before state mutation. Overlay node entries
  must use an actual current `FlowGraphNodeDto["id"]` value (never a source,
  session, action, or other opaque handle); relation entries must use the
  actual current `FlowGraphEdgeDto["id"]`. The validated
  augmentation flows through `useFlowDocumentSubscription` to the existing
  Flow controller and `useFlowGraphState`. Overlay apply, clear, and
  supersession therefore reuse the current viewer validation and ready/focus
  failure paths rather than adding a second transport contract.
- Each Flow URI has one active overlay session. A newer session supersedes the
  prior owner. Clear requires `(flowUri, sessionId, disposeEpoch)`; a late
  clear from a superseded/disposed owner is a no-op and cannot clear the newer
  overlay.
- Feed the overlay through existing `useFlowGraphState`, expanded graph, and
  React Flow projection. Reuse nesting, reveal, graph/viewport focus, search,
  and keyboard controllers. Normal Flow sessions have no overlay and no
  behavior change.
- Nodes show a localized state badge and accessible state name. Highlighted
  relations retain non-color patterns, DOM state, and a visible legend; the
  Explorer focused leaf and `aria-live` status describe endpoint/state and the
  matching duplicate relation count. Flow relations remain non-focusable and
  ordinary edge keyboard behavior is unchanged. Selection/focus remain distinct
  from semantic state.
- Stale side source, unavailable scope/target, disposed panel, missing result
  ID, or rejected overlay returns a closed failure, preserves unrelated
  panels/overlays, and refocuses/announces in Explorer. The optional Flow
  augmentation contains IDs/state only; the base viewer document remains the
  normal `UnitListDocumentDto`. Reason code/detail is resolved from
  `context.result` by IDs. Missing IDs return `record-not-found` safely and
  never add reason/detail fields to the Flow wire.

## Impact Investigation

- Application: consume `SemanticDiffOutputContext`/canonical summary; add
  explorer session/view/action projection, filter, source-index port/outcomes;
  extend the existing Flow highlight builder to side-specific additive states.
  Context identity and summary are consumed, never rebuilt or re-aggregated.
- Infrastructure parser: add the enriched same-pass path beside the existing
  `AjsParserPort` implementation. One ANTLR invocation returns the normalized
  document and application-owned browser-safe source-index DTO built from raw
  unit header/name and parameter-occurrence token ranges; no raw tree escapes
  parser infrastructure, and no grammar/generated/domain meaning changes.
- VS Code/bootstrap/presentation host: migrate
  `executeCompareSemanticDiffCommand` success to the default Explorer, manage
  the session/strict actions, compose the per-command capture adapter before
  the current file report/output-context builder, own URI/TextDocument/
  snapshot/report/action and overlay registries, reuse the report provider,
  open exact sources from the retained index, and integrate existing
  `ViewerFactory`/`WebviewStore` Flow. A future calendar/workflow adapter may
  be injected at this bootstrap seam after its own approval; it is not a
  prerequisite for this feature. The workflow owns source selection and its
  immutable Git provider; Explorer owns the capture/index contract and
  source-action lookup.
- Webview: add Explorer bundle/components/localization and closed Explorer
  messages; reuse the existing Flow `changeDocument`, `revealUnit`, and
  `ready`/`onReady` host contract for highlighted documents and focus; extend
  overlay controller state, badges/status, legend, patterns, DOM semantics,
  and high contrast without adding a Flow wire variant or reason details.
- Configuration: add only the Explorer webpack entry/bundle. Keep
  `package.json` commands, activation, custom editors, and engine unchanged.
- Tests: add explorer projection/filter/message/DOM/accessibility/scale and
  source locator/navigation; update command/report, Flow highlight/message/
  controller/view/accessibility, viewer wiring, bundle, architecture, and
  desktop/web regressions.
- Durable docs: at Feature Exit update semantic report and Flow exploration
  use cases, README, and CHANGELOG; update build-semantic-diff only if its
  consumer wording becomes stale. No architecture/glossary/context/roadmap
  change is planned.

## Implementation Slices

### Slice 1: Project The Immutable Explorer Session

- Status: Planned; blocked on predecessor completion and Human Approval.
- Scope: application session/view/action types referencing one immutable
  `SemanticDiffOutputContext`, canonical cards, hierarchy, closed target-side
  mapping, availability, confirmation filter, and strict plain message
  contracts; no UI or host registry.
- User / Domain Value: one trustworthy model exposes every upstream fact and
  prevents counts or rules drifting in presentation.
- Cohesive Change Group: application projection/transport and pure tests.
- Acceptance: every neutral variant occurs once; grouping/order, rename/move,
  no-path, zero/empty, filter pruning, all five change-kind side mappings,
  all nine reason-side mappings, action availability, pairwise-distinct opaque
  ID brands, immutable context identity, and malformed/extra-key rejection
  match Design Decisions. Flow node IDs remain the actual
  `FlowGraphNodeDto["id"]` values when represented by a later overlay;
  comparison, summary, schedule, identity, and output renderers are never
  invoked.
- Validation: empty/mixed/before/after/relation/unsupported/limitation/
  schedule/candidate/all-nine-reason/shuffled fixtures; duplicate confirmation
  records plus confirmation-level change leaves; context identity and
  no-recalculation spies; closed request/reply/host union, null, correlation,
  wrong-session, non-finite, extra-key, and payload-limit tests; determinism/
  property tests; focused compiled suite, `rtk pnpm run qlty`, and build.
- Production Readiness: linearithmic worst case, raw values preserved, no
  localized comparator or host-content leak, validate before state mutation.
- Approval Boundary: Explorer application projection/filter/messages and
  named tests. Any neutral field/reason/summary/comparison/output change replans.
- Dependencies: completed predecessor contracts and canonical summary/order.
- Risks: record coalescing, second summary semantics, localized order, leaked
  handles, cross-brand ID confusion, inferred side fallback, and transport
  drift. Exact coverage, context-identity spies, strict opaque-handle
  validators, closed-union tests, and no-recalculation spies are the gate.
- Out of Scope: panel, source/Flow/report execution, telemetry, durable docs.

### Slice 2: Open And Operate The Accessible Explorer

- Status: Planned; blocked on Slice 1 completion and approval.
- Scope: panel/bundle, command success migration to the default Explorer,
  cards/tree/filter/actions, UI state/virtualization, same-session four-mode
  Output handoff, host-owned registries, and panel lifecycle.
- User / Domain Value: reviewers scan, filter, and keyboard-navigate before
  choosing detailed Markdown.
- Cohesive Change Group: command/bootstrap, panel/session, React/localization,
  report action, webpack entry, and focused tests.
- Acceptance: successful comparison opens Explorer only and retains the exact
  context identity; failures open none; `Output` calls the shared picker and
  `presentSemanticDiffOutput(context, mode)` for all four modes with no
  re-comparison/re-aggregation; empty/filter/strict session, explicit
  Markdown/no implicit copy, keyboard/focus/live/high-contrast, payload-limit,
  and 10,000-leaf behavior match Design Decisions. The host opener accepts
  only `SemanticDiffOutputContext` and resolves
  `Promise<SemanticDiffExplorerSessionHandle>` with the exact session ID,
  `WebviewPanel`, and idempotent `dispose()` contract; panel disposal invokes
  the same composite cleanup.
- Validation: command/wiring/report, four-mode call/context identity,
  lifecycle/correlation/disposal, borrowed-registry release,
  unregister-before-release ordering, dispose-epoch/late completion and
  supersession tests; opener resolution/rejection and panel
  `onDidDispose`/idempotent-dispose tests; closed host message and oversized
  payload tests; React
  DOM, keyboard/focus/localization/aria-live/axe/forced-colors/scale; focused
  compiled tests, qlty, build, desktop Semantic Diff, web bundle smoke.
- Production Readiness: dispose all listeners/requests/snapshots/report/action
  handles/context, suppress late focus/post/recreation, enforce the 8 MiB
  limit without partial state or fallback, escape raw values, preserve provider
  cache/concurrency and host parity. The source-lifetime hook is private and a
  no-op until Slice 3 attaches a capture disposer; it never changes the public
  session-handle shape.
- Approval Boundary: Explorer panel and existing command success handoff,
  Full report action, localization/bundle/tests. New command/mode/input/copy/
  persistence replans.
- Dependencies: completed Slice 1 and structured report dispatcher/provider.
- Risks: virtual tree semantics, stale focus, explicit-copy regression, context
  cloning, oversized initial payload, borrowed-registry lifetime, and close
  races. Identity/lifecycle, unregister-order, and payload-boundary tests are
  the gate.
- Out of Scope: source/Flow execution, Git/WebAPI/period, persistence, docs.

### Slice 3: Reveal Exact Before And After Source Targets

- Status: Planned; blocked on Slice 2 completion and approval.
- Scope: application-owned browser-safe source-index DTO/port, the explicit
  same-pass `AjsParserWithSourceIndexPort` result and scoped capture state
  machine, ANTLR adapter from `unitAttribute`/`unitParameter` token ranges,
  fixed private lookup API, side registry/snapshot verification, VS Code
  reveal, typed outcomes, action completion/focus, and tests. The parser
  capture is composed as an `AjsParserPort` adapter for the current file
  command's existing `createBuildSemanticDiffReportData`/output-context
  callback; a future calendar/workflow artifact callback can use the same seam
  after its own approval. No calendar result, OutputContext, or JSON contract
  changes are owned here.
- User / Domain Value: jump to the exact compared unit/parameter on the correct
  side without selecting a similarly named or changed document.
- Cohesive Change Group: application source contract, parser locator, VS Code
  adapter/wiring, Explorer routing, parser/navigation tests.
- Acceptance (source index):
  `src/application/parsing/AjsParserWithSourceIndexPort.ts` exports
  `AjsParserWithSourceIndexPort` and `ParseAjsWithSourceIndexResult`; success
  is exactly `{ ok: true, document, sourceIndex }` and failure is the existing
  `ParseAjsResult` parser-error union. The source capture contract in
  `src/application/semantic-diff/semanticDiffSourceCapture.ts` exports
  `beginSemanticDiffSourceCapture({ before, after })`; its scoped result
  exposes only `parser: AjsParserPort`,
  `bind(context: SemanticDiffOutputContext): SemanticDiffSourceCaptureBindResult`,
  and idempotent `release(): void`. The capture parser invokes the enriched
  parser exactly once for before and once for after in that order, returns the
  existing `ParseAjsResult` to the current file comparison builder, and retains
  the two indexes privately until bind/release. A wrong-order content mismatch,
  extra parse, or post-release call throws the typed
  `SemanticDiffSourceCaptureError`; bootstrap maps it to
  `source-capture-failed` without fabricating a parser syntax error. A
  bind-before-two or second bind returns the closed bind result. A parser
  error is returned through the existing result for that side and does not
  prevent the second fixed-order parse, so the current builder preserves its
  separate before/after parser-error union; a future calendar/workflow
  callback must preserve the same seam after its own approval.
- Acceptance (DTO and runtime validation): the exact
  `SemanticDiffSourceIndexId`, `SemanticDiffSourceHandleId`,
  `SemanticDiffCaptureScopeId`, `SemanticDiffExplorerSessionId`, and
  `SemanticDiffExplorerActionId` brands and the exact
  `SemanticDiffSourcePosition`, `SemanticDiffSourceRange`,
  `SemanticDiffSourceParameterOccurrence`, `SemanticDiffSourceUnitEntry`, and
  `SemanticDiffSourceIndex` shapes defined in Source Navigation are the only
  application index forms. Kind-specific namespace/sequence allocators and
  owner-registry membership checks provide runtime separation after TypeScript
  brands are erased. Index validators reject extra keys, non-finite or
  negative positions/ordinals, reversed ranges, unknown/expired IDs, and
  unregistered source indexes; nested parameter/header ranges are allowed.
- Acceptance (lookup): the exact request is
  `lookup({ sourceIndexId, unitId, targetKind, parameterKey? })`, with no extra
  keys; `targetKind` is `unit | jobnet | jobgroup | attribute`; and success is
  exactly `{ primaryRange, occurrences }`. Unit/jobnet/jobgroup return the
  declaration name range plus no occurrences; attribute returns the first
  exact-key occurrence as primary plus all matching occurrences in source
  order. The full header range is the fallback for empty, malformed, or
  non-unique names within an otherwise indexed unit. Fixed missing/stale/
  malformed/unavailable/expired outcomes, UTF-16/CRLF/Unicode ranges, and
  closed-table sides are preserved; no cross-side fallback or parser/VS Code
  DTO leakage is allowed.
- Acceptance (workflow/host binding): the workflow starts capture with both
  immutable before/after snapshot descriptors before invoking the current
  file report/output-context builder, passes the scoped `parser` to that
  builder, and calls `bind(context)` exactly once only after successful
  context construction. A future calendar/workflow callback may replace this
  injected builder after its own approval, but it is not a Slice 3 dependency
  and creates no reverse import. Bootstrap binds the captured indexes and
  opaque side handles to the exact context object, then awaits the unchanged
  one-argument `OpenSemanticDiffExplorer(context)` Promise. The resolved
  `SemanticDiffExplorerSessionHandle` has exactly
  `{ sessionId: SemanticDiffExplorerSessionId; panel: WebviewPanel;
dispose(): void }`; `WebviewPanel` remains host-only. Slice 2's private
  source-lifetime hook starts as a no-op, and Slice 3 attaches the capture's
  composite disposer to it before registration completes. Explicit handle
  disposal and `panel.onDidDispose` call that composite once. The capture
  scope remains
  sole owner across `collecting`, `bound`, `registered`, and `released`; bind
  transfers no ownership, and the context registry stores borrowed refs only.
  Parse, artifact, bind, panel-creation, cancellation, and partial-side
  failures use one composite disposer that unregisters the context mapping
  before calling `scope.release()` exactly once, then rejects the opener
  Promise; direct release and repeated disposal are idempotent. Current file
  command maps that rejection to `display-failed`; a future workflow maps it
  to `explorer-open-failed`. Concurrent scopes are isolated; stale/disposed
  epochs make borrowed lookups/actions unavailable. Source actions use only
  the retained index and decoded immutable snapshot and never parse or
  regenerate an index.
- Validation: nested `unitAttribute`/`unitParameter` header, empty-name,
  malformed-name, no-unique-name, duplicate-key, quoted-value, CRLF, Unicode,
  and malformed/incomplete fixtures; strict lookup keys/target kinds/parameter
  requirements, opaque source-index IDs, UTF-16 surrogate-pair offsets, source-order
  ordinals, missing-code matrix, before/after/dirty/missing/unavailable/
  disposed and immediate pre-reveal decoded `openTextDocument().getText()`
  revalidation/focus tests, including Shift_JIS and BOM; immutable Git HEAD
  provider/revision tests; same-pass
  normalized-document/index identity, exactly two enriched-parser calls,
  before/after order, equal-text deterministic assignment, content mismatch,
  extra-call, parser-error with second-side continuation, bind-order,
  second-bind, collecting/bound/registered/released transitions, direct
  release, unregister-before-release ordering, partial registration, panel
  creation failure, cancellation, concurrent scope, stale epoch, disposal,
  late completion, and no-action-parse spies; current file-builder call count,
  exact context identity, one-argument Promise-returning Explorer opener,
  resolved session handle, rejection-to-command-failure mapping, no-op-to-
  attached source-lifetime hook, future callback seam, and host registry
  borrowed-reference resolution tests; source-index DTO
  exact-key/brand-prefix/membership/range/ordinal validator tests; architecture,
  focused compiled suites, qlty, and build.
- Production Readiness: construct the index alongside the normalized
  document, retain immutable decoded source snapshots before reveal, revalidate
  session/index/scope and decoded `openTextDocument(uri).getText()` content/
  version immediately before host reveal, bind to the actual normalized
  `AjsUnit.id` without choosing duplicate paths, preserve VS Code Unicode
  columns and Shift_JIS/BOM decoding, isolate host failures, and keep the
  private lookup result browser-safe with no URI/TextDocument/snapshot/parser/
  domain object. The workflow-owned `GitImmutableSourceProvider` supplies
  read-only HEAD snapshots without Explorer Git or `.git` access. All capture,
  registry, and provider resources are scoped, bounded, idempotently released,
  and safe under direct release, cancellation, panel failure, stale epochs,
  and late completion.
- Approval Boundary: application source-index DTO/port, explicit enriched
  parser result, capture begin/parse/bind/release state machine, exact private
  lookup, same-pass raw locator metadata/ANTLR adapter, context-keyed source
  handles/navigation, action results, rollback/concurrency/disposal behavior,
  and named tests. Workflow source selection/Git, calendar public action,
  grammar/generated-parser redesign, normalized-domain meaning, fuzzy or
  relation matching, editing, and a changed public Explorer signature replan.
- Dependencies: completed Slice 2 and existing raw parser/workspace APIs.
  The current file command supplies the scoped-parser/output-context seam, so
  Slice 3 does not depend on calendar/workflow completion. A later workflow
  implementation may consume this contract after the Explorer completion
  commit; its calendar callback is an explicit integration gate, not a
  prerequisite or reverse dependency.
- Risks: token/context range conversion, empty or non-unique names, duplicate
  occurrence ordering, unsaved documents, Shift_JIS/BOM decoding, identical
  side paths, parser DTO leakage, erased brand confusion, stale index races,
  wrong-side capture, partial binding, borrowed-reference leaks, direct
  release ordering, and concurrent scope cross-talk. Exact DTO/validator,
  lookup/range, call-order, ownership/rollback, context-identity, provider,
  and revalidation matrices are the gate.
- Out of Scope: Flow, editing, diagnostics, arbitrary sources, durable docs.

### Slice 4: Focus Existing Flow Views With Semantic Overlays

- Status: Planned; blocked on Slice 3 completion and approval.
- Scope: explicit stable `FlowGraphEdgeDto.id` and shared semantic-diff key,
  before/after additive highlight states, canonicalPair-to-side-specific edge
  IDs, the optional `semanticDiffOverlay` augmentation in the existing
  `changeDocument` data, `revealUnit`/`ready` Flow host integration,
  `useFlowDocumentSubscription` → controller → `useFlowGraphState` handoff,
  one-overlay-per-Flow-URI ownership, exact-side panel ready/scope/reveal, and
  accessible Flow labels. No new Flow overlay wire variant is in scope.
- User / Domain Value: jump into the existing Flow Viewer and understand the
  selected state without color-only cues or a duplicate graph.
- Cohesive Change Group: highlight mapper, current Flow messages/lifecycle/
  controller/renderer, exact-side wiring, tests.
- Acceptance: the stable edge ID is the collision-free UTF-16 length-prefixed
  encoding of the ordered `(source, target, type, occurrenceOrdinal)` tuple
  and is used by every existing graph producer, semantic-diff lookup,
  validator, and React Flow edge (`id` exactly equals the DTO ID).
  `occurrenceOrdinal` is the zero-based deterministic ordinal for an identical
  tuple in its owning source relation list. Closed-table side mapping/
  precedence, canonicalPair-to-all-matching before/after IDs, lowest-ordinal
  focus, duplicate-count `aria-live`, existing graph reuse, nested focus,
  immediate pre-ready revalidation, and atomic malformed/stale/missing-record
  failure hold. Overlay apply/clear/supersede use only the exact existing
  `{ type: "changeDocument", data }` message. `data` is normal base document
  plus a non-null exact-key `semanticDiffOverlay` for apply,
  `semanticDiffOverlay: null` to clear only the overlay, omission for ordinary
  base data/no overlay, or `null` to clear the document and overlay. Focus uses
  `{ type: "revealUnit", data: { absolutePath } }`, and readiness uses the
  existing `{ type: "ready" }`/`onReady` path; no new response or overlay
  variant is introduced. One active overlay per Flow URI, owner-token
  late-clear safety, textual/pattern/legend/DOM/high-contrast states,
  non-focusable relations, and unchanged normal Flow search/navigation/
  keyboard/rendering are required.
- Overlay node entries use the actual corresponding
  `FlowGraphNodeDto["id"]` value from the active graph; they are not source
  index, source-handle, capture-scope, session, or action IDs. Overlay
  relation entries use the actual `FlowGraphEdgeDto["id"]` value. The active
  graph validator checks membership and rejects arbitrary or cross-kind IDs
  before mutating Flow state.
- Validation: stable-ID collision/UTF-16/length-prefix tests including seq/con
  parallel edges, same-type duplicate and reordering stability, delimiter and
  supplementary-Unicode identifiers, expanded graphs, before/after endpoint
  remapping, and React Flow IDs; graph/highlight/validator/existing-consumer
  regressions; exact `semanticDiffOverlay` keys, null/absent/base-data clear
  semantics, actual `FlowGraphNodeDto["id"]`/`FlowGraphEdgeDto["id"]` graph
  membership and cross-kind rejection, validator retention,
  `useFlowDocumentSubscription` → controller → `useFlowGraphState` propagation,
  apply/clear/supersede replacement tests;
  exact viewer message key, acceptance/rejection, no-reply, ready failure, and
  Explorer action-result mapping tests; controller/effects/view/node/minimap/
  focus/accessibility/high-contrast/`aria-live` duplicate-count tests; all
  state pairs, canonical-pair all-duplicate highlighting, relation
  non-focusable DOM/axe, nested/disposed/not-ready/malformed/
  oversized-Explorer-wire/replacement/late-clear/owner-token/normal goldens;
  qlty, build, desktop and web suites.
- Production Readiness: build/serialize overlays once, no graph rebuild per
  selection, validate actual graph node/edge membership and `context.result`
  IDs before mutation,
  preserve formal ID/state-only application data and existing viewer wire,
  isolate disposal/supersession, keep 8 MiB enforcement Explorer-only, and
  keep desktop/web and VS Code 1.75 compatibility.
- Approval Boundary: formal edge IDs, additive states/side mapping, existing
  Flow `changeDocument`/`revealUnit`/`ready` integration, owner lifecycle,
  accessibility, and named tests. A new Flow message variant, renderer/layout/
  search/reverse-report/edit/telemetry/comparison behavior, or synthetic ID
  scheme replans.
- Dependencies: completed Slice 3 and existing highlight/Flow/focus/a11y base.
- Risks: side ID mismatch, scope races, lost IDs, inaccessible relations,
  overlay leakage, stale ready, and a late old-owner clear removing a new
  overlay. Side/lifecycle/a11y/host matrix is the gate.
- Out of Scope: reverse Flow-to-Markdown, layout/search, calendar, editing.

## Cross-Slice Readiness And Approval Boundaries

- Every slice runs focused tests, qlty, and build; Slice 4 runs complete
  compiled desktop and web suites. Architecture tests retain zero exceptions.
- Domain gains no responsibility; application imports no VS Code/UI/
  infrastructure; ANTLR stays in parser infrastructure; presentation consumes
  DTOs; bootstrap/presentation compose concrete adapters and own URI,
  `TextDocument`, snapshot, report, action, source-index, and Flow-overlay
  registries. The capture scope remains sole owner of source indexes and
  snapshots; context registry entries are borrowed and composite cleanup
  unregisters before scope release. The application capture port is plain and
  the enriched parser result crosses into it only as normalized document plus
  browser-safe index. The existing `AjsParserPort` remains the compatibility
  seam for unrelated consumers and the current/future builder injection.
- Parser, comparison, identity, risk, structured output, normal Flow, report,
  clipboard, desktop, and web regressions remain passing.
- JP1/AJS syntax/normalization/identity/schedule/risk meaning is unchanged.
  Malformed input fails before Explorer; unsupported/uncalculated remains
  visible and non-assertive.
- Large validation covers 10,000 leaves and representative overlays without
  quadratic joins, unbounded DOM, repeated comparison parsing, action-time
  parser/index regeneration, per-selection rebuilds, or payloads above the
  fixed 8 MiB UTF-8 limit. Oversized payloads fail closed without truncation
  or partial state.
- Explorer requests, replies, and host messages reject unknown/extra/missing/
  non-finite/wrong-session/conflicting or non-session-derived data; exact
  nullable fields and the closed error-code union are tested. Existing Flow
  viewer host messages retain the exact `{type, data}` union and reject invalid
  or extra-key document/navigation data before mutation; their optional Flow
  augmentation carries IDs/state only while base data remains normal. Reason
  details resolve from `context.result` and a missing ID returns a safe error.
  Shared production code has no Node built-ins.
- Source reveal and Flow ready/focus each revalidate the session epoch,
  target/index/scope and decoded snapshot/version immediately before the host
  action. File revalidation uses `openTextDocument(uri).getText()` so VS Code
  encoding, including Shift_JIS and BOM handling, remains authoritative; Git
  HEAD revalidation uses the workflow-owned immutable provider.
  Panel close releases snapshots, report/action handles, context, and only
  overlays owned by its exact token; late completion and late clear tests prove
  that a superseded/newer overlay is not disturbed.
- Replanning is required for predecessor contract changes, a missing or
  incompatible `AjsParserWithSourceIndexPort`/capture binding, missing target
  evidence, source/period/command/calendar/persistence/edit/fuzzy mapping,
  grammar/domain expansion, reverse Flow-report, telemetry, replacement
  renderer, or engine increase. Unverifiable actions become unavailable.

## Traceability And Feature Exit

- `TRACEABILITY.md` maps EXP-1 through EXP-10, N-1, E-4, compatibility,
  readiness, and durable follow-up to slices and validation.
- Exit requires four reviewed/approved/committed slices, desktop/web/a11y
  evidence, use-case/README/CHANGELOG updates, final traceability, and no
  reusable behavior left only here. Roadmap change is not expected.

## Validation

- [ ] Slice 1 tests and checks complete
- [ ] Slice 2 tests and checks complete
- [ ] Slice 3 tests and checks complete
- [ ] Slice 4 tests and checks complete
- [ ] README, CHANGELOG, durable use cases, and final traceability complete
