# Feature Specification: Semantic Diff Explorer

## Purpose

Provide a dedicated, read-only Semantic Diff Explorer that turns one completed
semantic comparison into an accessible review workspace: reviewers can scan
summary counts, traverse a hierarchical change tree, isolate
confirmation-required items, navigate to the corresponding definition source
or Flow Viewer target, and explicitly open the applicable Markdown report.

## Minimal Context

- Current decision: define the explorer's review behavior and integration
  boundaries without re-owning semantic comparison, report, or Flow layout
  rules.
- Read first: this file and `TASKS.md`; read `TRACEABILITY.md` only when the
  next decision needs it.
- Do not create `CONTEXT.md`; link to `docs/specs/README.md` instead of
  duplicating SDD policy.

## Origin

- Feature kind: roadmap feature, Wave 3 `Add A Semantic Diff Explorer`.
- Source proposals: attached improvement proposals N-1 `Semantic Diff Viewer`
  and E-4 `Flow Viewer And Semantic Diff Integration`.
- Source use cases:
  `docs/requirements/use-cases/uc-build-semantic-diff.md`,
  `docs/requirements/use-cases/uc-present-semantic-diff-report.md`, and
  `docs/requirements/use-cases/uc-explore-flow-graph.md`.
- JP1/AJS basis: existing JP1/AJS3 v13 semantic-diff results and the durable
  use cases above. The explorer interaction itself is a product workflow, not
  a new JP1/AJS semantic rule; no additional vendor behavior is inferred.
- Implementation-slice plan: `TASKS.md`.

## Requirements

- EXP-1: A successful comparison opened through the existing file-based
  Semantic Diff command displays one dedicated explorer for that comparison.
  Comparison completion creates exactly one immutable
  `SemanticDiffOutputContext`; the Explorer session retains that same object
  identity and becomes the default successful destination. The feature does
  not add or rename comparison sources, commands, or period inputs.
- EXP-2: The explorer presents summary cards derived from the neutral
  comparison result and a deterministic hierarchical tree of reviewable
  changes. Cards consume `context.summary` as their sole summary source and
  tree details resolve from `context.result`; counts, predicates, grouping,
  and ordering must not re-run, re-aggregate, clone, or reinterpret
  comparison rules.
- EXP-3: Reviewers can show all reviewable changes or only
  confirmation-required items without mutating the underlying comparison
  result or losing the current comparison session.
- EXP-4: Each tree item exposes its change kind, confirmation state, target,
  rationale or constraints when available, and whether source and Flow actions
  are available. Added, removed, changed, renamed, moved, candidate,
  unsupported, and uncalculated facts remain distinguishable when supplied by
  the upstream contracts.
- EXP-5: An available source action opens the correct before or after
  definition and reveals the target unit or parameter range. Source-document
  identity and range lookup remain separate from the neutral semantic result.
  The application owns a browser-safe source-index DTO keyed by the actual
  normalized unit IDs; index and action handles remain opaque. Parser
  infrastructure derives the index and normalized document from the same
  parse, including unit header/name tokens and every exact parameter
  occurrence. Navigation uses that retained index without parsing again. An
  unavailable, ambiguous, or stale target fails predictably without selecting
  a different unit.
- EXP-6: An available Flow action opens or focuses the relevant before- or
  after-side flow scope, reveals the selected target, and reuses the existing
  Flow graph construction, navigation, and semantic-highlight foundation.
  Target side follows the closed record/reason table below. Relation
  `canonicalPair` is resolved to the exact side-specific `FlowGraphEdgeDto.id`
  only when a real edge exists; items with no renderable Flow target expose an
  unavailable action rather than inventing a mapping.
- EXP-7: Flow highlights and selection communicate added, removed, changed,
  and confirmation-required states through semantic labels and accessible
  state in addition to visual styling. Confirmation-required state takes
  precedence when multiple states apply, while associated change and
  confirmation identifiers remain available for explorer-to-flow focus.
  Relations remain non-focusable Flow edges. The focused Explorer leaf and
  its `aria-live` status announce state and endpoint names; Flow uses
  non-color patterns and a visible legend in addition to badges.
- EXP-8: A Markdown action renders and opens output for the same immutable
  comparison session through the structured-output/report contract. It calls
  the shared four-mode picker and `presentSemanticDiffOutput(context, mode)`
  with the retained context, without re-comparison or re-aggregation. It does
  not silently copy to the clipboard, redefine report modes, or reconstruct
  comparison facts.
- EXP-9: Selection, filtering, tree expansion, source handoff, Flow handoff,
  and Markdown handoff are keyboard operable; focus is restored to a defined
  element after asynchronous navigation, refresh, or failure; status is not
  conveyed by color, position, or hover alone. Source reveal and Flow focus
  revalidate the session and target immediately before the host operation.
- EXP-10: The explorer remains read-only. It does not edit either definition,
  choose identity matches, dismiss confirmation requirements, or persist
  review decisions.

## Closed Target-Side And Relation Contract

Explorer target side is a closed projection of upstream facts. It is never
inferred from localized text, a rendered path, a relation display string, or a
missing endpoint.

<!-- markdownlint-disable MD013 -->

| Record or reason                               | `targetSide`                | Exception / action rule                                                                                                                       |
| ---------------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Change `added`                                 | `after`                     | Use the after-side unit or edge only.                                                                                                         |
| Change `removed`                               | `before`                    | Use the before-side unit or edge only.                                                                                                        |
| Change `changed`                               | `after`                     | Use after for the primary target; before is metadata or a separate source action only when the upstream change contains a real before target. |
| Change `renamed`                               | `after`                     | Use after for the primary target; retain before identity as metadata.                                                                         |
| Change `moved`                                 | `after`                     | Use after for the primary target; retain before path as metadata.                                                                             |
| Confirmation `conditional-relation-removed`    | `before`                    | The conditional relation existed on before; use its real before endpoint pair.                                                                |
| Confirmation `wait-release-source-changed`     | `after`                     | Use the changed definition's after target when present.                                                                                       |
| Confirmation `timeout-removed`                 | `after`                     | Use the after unit/parameter target.                                                                                                          |
| Confirmation `condition-judgment-changed`      | `after`                     | Use the after unit/parameter target.                                                                                                          |
| Confirmation `wait-target-changed`             | `after`                     | Use the after unit/parameter target.                                                                                                          |
| Confirmation `no-calculated-schedule-run`      | `after`                     | Use the after schedule-defined unit when a real target exists.                                                                                |
| Confirmation `calculated-schedule-run-removed` | `after`                     | Use the after schedule-defined unit when a real target exists.                                                                                |
| Confirmation `execution-user-type-changed`     | `after`                     | Use the after unit and its `eu` occurrence.                                                                                                   |
| Confirmation `jp1-resource-group-changed`      | `after`                     | Use the after unit and its `rg` occurrence.                                                                                                   |
| Unsupported, limitation, and schedule records  | upstream declared side only | Preserve an explicit upstream side; never assign a default. Without an unambiguous real target, expose no source/Flow action.                 |

<!-- markdownlint-enable MD013 -->

The nine confirmation rows above are exhaustive. An unknown reason or change
kind is invalid input, not a new side rule. For a relation, Explorer consumes
the structured-output `relationPair.canonicalPair` and its nullable before and
after endpoint facts. The host maps that pair to every matching formal
`beforeEdgeId` or `afterEdgeId` in the corresponding side's existing Flow
graph. All matching duplicate edges receive the highlight; focus selects the
lowest `occurrenceOrdinal`, and the Explorer `aria-live` status announces the
duplicate count. Edge IDs are the formal IDs generated from the canonical
`(source, target, type, occurrenceOrdinal)` tuple below; they are never
synthesized from a localized pair string or an Explorer session token. A
missing real endpoint or edge makes the Flow action unavailable.

## Flow Graph Edge ID Contract

`FlowGraphEdgeDto` gains an explicit stable `id`. Its value is generated from
the exact ordered tuple `(source, target, type, occurrenceOrdinal)`, where
`type` is the closed `seq | con` union. `occurrenceOrdinal` is the zero-based
ordinal of that exact tuple within the owning source unit's relation list,
assigned in the existing deterministic relation order. The shared
`flowGraphEdgeSemanticDiffKey` returns the same ID and uses UTF-16-code-unit
length-prefixed encoding for each component, including the canonical decimal
representation of the ordinal, for example
`edge:<sourceLength>:<source><targetLength>:<target><typeLength>:<type><ordinalLength>:<ordinal>`.
Length prefixes make the representation collision-free even when identifiers
contain delimiters or supplementary Unicode characters. The React Flow edge
`id` is exactly `FlowGraphEdgeDto.id`.

All producers populate the ID: sequential and concurrent relations with the
same endpoints remain distinct because `type` is in the tuple, same-type
duplicates remain distinct because their owner/source-list ordinal is in the
tuple, expanded graphs retain it, and before/after graphs generate their own
side-specific IDs from their real endpoint IDs. A correspondence-remapped
before endpoint therefore maps to a different before ID than the after ID,
while both remain addressable from the same canonical pair. Reordering
non-duplicate relations cannot change their IDs; reordering indistinguishable
same-tuple duplicates preserves the ordinal ID set and highlights every
duplicate. Existing `buildFlowGraph`, `buildExpandedFlowGraph`, semantic-diff
highlight lookup, document validation, React Flow projection, and their
existing consumers/tests use the explicit ID. No ad hoc display-string,
localized-pair, or session-generated synthetic ID may be substituted for this
formal ID.

## Flow Overlay Augmentation Contract

The existing `changeDocument` envelope remains unchanged:
`{ type: "changeDocument", data }`. The normal `data` is the existing
`UnitListDocumentDto`; its Flow-document transport may carry one optional
`semanticDiffOverlay` augmentation, preserved by the Flow-graph document
validator. The augmentation is exactly

```ts
type SemanticDiffOverlayAugmentation = {
  nodes: Array<{
    id: FlowGraphNodeDto["id"];
    kind: "added" | "removed" | "changed" | "confirmation-required";
    changeIds: string[];
    confirmationIds: string[];
  }>;
  relations: Array<{
    id: FlowGraphEdgeDto["id"];
    kind: "added" | "removed" | "changed" | "confirmation-required";
    changeIds: string[];
    confirmationIds: string[];
  }>;
};

type FlowDocumentData = UnitListDocumentDto & {
  semanticDiffOverlay?: SemanticDiffOverlayAugmentation | null;
};
```

The augmentation object and every node/relation entry have exact keys; arrays
are deterministic. Node IDs are the actual `FlowGraphNodeDto.id` normalized
unit IDs, not newly allocated opaque handles; relation IDs are the formal
`FlowGraphEdgeDto.id`. `changeIds` and `confirmationIds` retain the actual
string IDs from `context.result.changes[].id` and
`context.result.confirmationRequired[].id`, respectively. They are checked
against the corresponding retained result collection, not allocated as new
handles. No session ID, correlation ID, owner token, URI, reason,
detail, endpoint prose, or display payload is allowed. `semanticDiffOverlay`
absent means ordinary base `data` with no overlay; `semanticDiffOverlay: null`
keeps the base document and explicitly clears its overlay; `data: null` clears
the document and overlay. A new non-null augmentation is a complete replacement
and is accepted only for the current host-private owner. The validator retains
the optional augmentation and rejects any other extra field before mutation.

The validated augmentation is passed through
`useFlowDocumentSubscription` to the existing Flow controller and
`useFlowGraphState`; it does not create a new viewer message or response. This
keeps the base document reusable for normal Flow sessions while the
augmentation carries IDs/state only.

## Session, Transport, And Lifecycle Contract

- A successful comparison builds one immutable
  `SemanticDiffOutputContext = { result, summary }` and one Explorer session
  retaining that object. The Explorer never rebuilds the context, calls the
  summary builder, re-runs comparison/schedule/identity logic, or re-aggregates
  cards. Its `Output` action invokes the predecessor-owned common four-mode
  picker and `presentSemanticDiffOutput(context, mode)` with that same object;
  all four modes remain reachable.
- Explorer transport has closed discriminated unions. Requests are `ready`,
  `refresh`, or `action`; every request has exactly `sessionId`, `requestId`,
  and `actionId`, with `actionId: null` for `ready`/`refresh` and an opaque
  non-empty ID for `action`. Replies are `ready`, `refreshed`, or `action`,
  each echoing `sessionId`, `requestId`, and `actionId`, and carrying exactly
  `ok`, `payload`, and `error`; successful replies use `error: null`, failures
  use `payload: null`. Host-to-webview messages are `session`, `action-result`,
  `failure`, or `close`, with the same correlation fields and explicit
  nullable payload/error fields. No unknown discriminator, missing key,
  extra key, non-finite request ID, wrong session, or non-session-derived
  payload is accepted.

The exact transport envelopes are fixed as follows; `payload` and `error`
are never omitted. `ExplorerError` is exactly
`{ code: ErrorCode, detail: { side: "before" | "after" | null, targetId:
string | null } | null }`, and `ErrorCode` is the closed union below.
`detail.targetId` is the actual semantic unit ID when known, otherwise `null`;
it is never an action handle or result-record ID. Session and action fields
use the separately defined `SemanticDiffExplorerSessionId` and
`SemanticDiffExplorerActionId` brands.

<!-- markdownlint-disable MD013 -->

| Union member                | Exact keys and nullability                                                                                                                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Request `ready` / `refresh` | `{ type, sessionId: SemanticDiffExplorerSessionId, requestId: finite positive integer, actionId: null }`                                                                                                 |
| Request `action`            | `{ type, sessionId: SemanticDiffExplorerSessionId, requestId: finite positive integer, actionId: SemanticDiffExplorerActionId }`                                                                         |
| Reply `ready` / `refreshed` | `{ type, sessionId: SemanticDiffExplorerSessionId, requestId, actionId: null, ok: boolean, payload: ViewModel \| null, error: ExplorerError \| null }`                                                   |
| Reply `action`              | `{ type, sessionId: SemanticDiffExplorerSessionId, requestId, actionId: SemanticDiffExplorerActionId, ok: boolean, payload: ActionOutcome \| null, error: ExplorerError \| null }`                       |
| Host `session`              | `{ type, sessionId: SemanticDiffExplorerSessionId, requestId: null, actionId: null, ok: true, payload: ViewModel, error: null }`                                                                         |
| Host `action-result`        | `{ type, sessionId: SemanticDiffExplorerSessionId, requestId, actionId: SemanticDiffExplorerActionId, ok: boolean, payload: ActionOutcome \| null, error: ExplorerError \| null }`                       |
| Host `failure`              | `{ type, sessionId: SemanticDiffExplorerSessionId \| null, requestId: finite positive integer \| null, actionId: SemanticDiffExplorerActionId \| null, ok: false, payload: null, error: ExplorerError }` |
| Host `close`                | `{ type, sessionId: SemanticDiffExplorerSessionId, requestId: null, actionId: null, ok: true, payload: null, error: null }`                                                                              |

<!-- markdownlint-enable MD013 -->

A reply/`action-result` with `ok: true` has a non-null payload and
`error: null`; one with `ok: false` has `payload: null` and a non-null
error. The union discriminator is not a free-form string.

- The closed error-code union is `invalid-request`, `unknown-session`,
  `unknown-action`, `stale-request`, `superseded-session`,
  `disposed-session`, `record-not-found`, `unavailable-target`,
  `stale-source`, `source-lookup-failed`, `flow-not-ready`,
  `flow-target-missing`, `output-failed`, `payload-too-large`, and
  `host-disposed`. Error details are stable codes and nullable typed detail;
  raw URI, document content, parser objects, and localized prose are not wire
  data. Unknown error codes are rejected.
- The Explorer transport unions above are separate from the existing Flow
  viewer host union. Flow overlay application and clearing add no new viewer
  message variant: the host sends the existing `changeDocument` message with
  exactly `{ type: "changeDocument", data }`, where `data` is the existing
  validated `UnitListDocumentDto` carrying the optional
  `semanticDiffOverlay` augmentation defined below, or `null` to clear. The
  host sends focus through the existing `revealUnit` message with exactly
  `{ type: "revealUnit", data: { absolutePath } }`. Neither message carries
  Explorer session, owner, reason, or correlation fields, and neither creates a
  second Flow wire contract.
- Existing viewer messages have no new reply envelope. A valid
  `changeDocument` is accepted by the existing viewer parser and Flow
  document validator, which retains only the defined optional
  `semanticDiffOverlay`; invalid or other extra-key data is rejected atomically
  and leaves the current document/overlay unchanged. Flow readiness reuses the
  existing webview `{ type: "ready" }` request and host `onReady` path; a
  rejected/failed ready follows the existing viewer failure notification and
  produces the Explorer action failure `flow-not-ready`. An invalid or absent
  `revealUnit` target is rejected by existing navigation validation and
  produces `flow-target-missing`; no new rejection or response message is
  introduced.
- Serialized Explorer messages have a fixed 8 MiB UTF-8 byte limit, measured
  before posting. The limit applies only to the Explorer request/reply/host
  wire, not to existing viewer host messages. An oversized Explorer session or
  action produces only `payload-too-large`; the session is not partially
  installed or mutated, no truncation/fallback output is attempted, and a
  later valid session/action is still independent. The 10,000-leaf fixture
  uses bounded DTO fields and must remain under this limit.
- Session, index, and action handles use opaque branded IDs; a source-index
  `unitId` is the actual normalized unit ID, not an allocated handle. URI,
  `TextDocument`, snapshot, source-index, report, action, and Flow overlay
  registries are owned and composed by bootstrap/presentation host adapters.
  Explorer presentation receives only browser-safe DTOs and outcomes; domain
  models, parser internals, VS Code types, and host content do not cross the
  webview boundary. Application parsing may consume the normalized document
  and immutable decoded text through its existing inner-layer boundary.
- Each Flow URI has at most one active overlay session. Installing a newer
  session supersedes the old owner. Clearing requires the exact owner token
  `(flowUri, sessionId, disposeEpoch)`; a late clear from a superseded or
  disposed owner is a no-op and cannot clear the newer overlay. Panel close
  increments `disposeEpoch`, invalidates pending requests, clears only overlays
  still owned by that token, and releases source snapshots, report references,
  action handles, and the retained output context. Late completions after
  close or supersession are ignored and cannot focus, post, or recreate state.

## Source-Index Boundary

`SemanticDiffSourceIndex` is an application-owned, browser-safe DTO. The
parser-infrastructure adapter is its only producer. One enriched parse derives
both the normalized `AjsDocument` and the plain source index from the same raw
ANTLR tree before raw parser objects are discarded. The index contains one
unit entry from its declaration header/name tokens and all exact parameter
occurrence ranges in source order. Its `unitId` is the actual normalized ID
produced by unit normalization (`unit.absolutePath()`), not a separately
allocated opaque ID. Duplicate normalized IDs are ambiguous: lookup returns
the existing `unit-missing` unavailable outcome and must not select an
occurrence or similarly named unit. This does not change normalization or
semantic-comparison behavior.

The `sourceIndexId`, source handle, and action IDs are distinct opaque
handles, allocated without encoding a URI or source content. The index itself
contains no URI, `TextDocument`, parser node, generated-parser type, or domain
`AjsUnit`. The enriched parser result may carry the normalized `AjsDocument`
to application comparison, but parser internals never leave infrastructure.
The ordinary `AjsParserPort.parse(content)` contract and its existing
consumers remain unchanged.

The DTO shapes are fixed; all keys shown below are exact:

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

The parser adapter obtains `sourceIndexId` from the application-provided
allocator. Each allocator returns its corresponding brand, uses a kind-specific
host namespace prefix and monotonic per-kind sequence, and never derives an
ID from a URI, path, content, or another brand. Because TypeScript brands are
erased at runtime, the owning registry validates both prefix and membership:
empty, malformed, unknown, expired, and cross-kind IDs are rejected. Actual
Flow node and edge IDs are graph values, not these opaque handles.

The index validator accepts only the exact DTO keys, including nested keys,
requires its ID to be registered for the capture scope, and preserves unit
and parameter occurrence order. Positions and occurrence ordinals are finite
non-negative integers; ranges are ordered half-open positions. Reversed
ranges, non-finite or negative values, extra keys, and unregistered IDs are
rejected before registry insertion. Ranges need not be globally disjoint.
Duplicate normalized unit entries are retained as evidence, but lookup fails
with `unit-missing` instead of selecting an occurrence.

Each comparison owns an isolated same-pass capture scope. Both immutable,
side-labelled source descriptors are registered before comparison; a scoped
`AjsParserPort` wrapper invokes the enriched parser once for before and once
for after, retaining the indexes before the output context exists. It returns
the existing parser result for each side, including both sides' syntax errors
when both fail. Input mismatch, extra calls, incomplete capture, rebinding,
or use after release fail through the closed capture contract rather than
using global last-parse state. Only two successful side captures can bind to
the exact successful `SemanticDiffOutputContext` object.

Bootstrap alone composes the parser and application factories and wires the
context-keyed host registry. `OpenSemanticDiffExplorer(context)` retains its
one-argument contract; its host adapter resolves the registered indexes and
opaque source handles for that same context. Its exact host-only contract is:

```ts
type SemanticDiffExplorerSessionHandle = {
  sessionId: SemanticDiffExplorerSessionId;
  panel: WebviewPanel;
  dispose(): void;
};
type OpenSemanticDiffExplorer = (
  context: SemanticDiffOutputContext,
) => Promise<SemanticDiffExplorerSessionHandle>;
```

These types belong to the `presentation/vscode` host boundary and are composed
by bootstrap; `WebviewPanel` never enters application contracts or webview
transport. Success returns that handle. Failure rejects only after partial
resources are cleaned up, preserving the current command's `display-failed`
and the downstream workflow's existing `explorer-open-failed` outcome.
`handle.dispose()` is idempotent. It and `panel.onDidDispose` share the same
once-only composite cleanup, unregistering the context/scope binding before
releasing the capture. A second call or disposal event cannot release twice.

Source selection remains owned
by the existing file command or the downstream comparison workflow, while
capture and source lookup remain owned by Explorer. The existing file command
can inject the scoped parser into `createBuildSemanticDiffReportData(parser)`
and its bootstrap output-context callback, then bind the successful output
context without any calendar or workflow implementation.
When the calendar artifact builder is available, bootstrap may supply the
corresponding per-command callback with the same scoped parser; that callback
is not a prerequisite for Explorer source navigation. Application factories
remain composed only by bootstrap/application, never by the workflow adapter.
Parsing, binding, registry acquisition, and panel creation form one
composite lifecycle: failure, cancellation, or partial registration rolls back
all acquired snapshots, indexes, and handles. Release is idempotent; disposal
and stale epochs invalidate later actions and late completion cannot restore
state. Concurrent commands never share a mutable capture. Source actions use
only the retained side index and snapshot, revalidate before host operations,
and never parse again, regenerate indexes, or search another side.

The capture remains the sole lifetime owner of retained indexes and immutable
source-snapshot references from `collecting` through `released`. Successful
binding changes it to `bound` and returns borrowed references without
transferring ownership. Registration accepts only that exact context/scope
pair, changes its lifecycle to `registered`, and stores only the borrowed
binding; neither the context registry nor Explorer disposes those resources.
The host-private composite disposer calls `unregister(context, scope)` first,
then `scope.release()` exactly once. Repeated cleanup is a no-op. Direct scope
release, stale epochs, partial registration, failed or cancelled panel
creation, and late completion invalidate borrowed lookups. Release changes the
lifecycle to `released`, clears retained resources, and prevents further
parse, bind, or registry lookup; no stale completion reacquires a reference.

Source revalidation compares the retained decoded text with the corresponding
VS Code `openTextDocument(...).getText()` content, preserving configured file
encoding (including Shift_JIS and BOM behavior) and dirty-buffer behavior.
Document version is also checked when available. It does not compare raw
`workspace.fs.readFile` bytes with decoded snapshots. A Git-source virtual
document uses its immutable provider snapshot; revalidation does not fetch
Git again. Session and source epochs are checked again after asynchronous
document opening and immediately before revealing a range.

Ranges are zero-based, half-open line/character positions whose character
offsets count JavaScript UTF-16 code units. CRLF is one line break; surrogate
pairs count as two code units; Unicode before a target is preserved exactly.
Duplicate parameter keys retain every occurrence, with the first occurrence
primary. A malformed or incomplete source parse returns a closed `unavailable`
outcome and never guesses by text search, path, or similarly named unit. A
successfully indexed unit with a unique normalized ID whose declaration name
field is empty, malformed, or non-unique is different: lookup succeeds with
the unit header full-range fallback defined below.

The source-index private API is fixed as
`lookup({ sourceIndexId, unitId, targetKind, parameterKey? })`. The request
has no other keys. `targetKind` is the closed union `unit | jobnet | jobgroup |
attribute`; `parameterKey` is absent for the first three kinds and required for
`attribute`. A successful lookup returns exactly
`{ primaryRange, occurrences }`: unit/jobnet/jobgroup use the first unique
name subrange as `primaryRange` and return `occurrences: []`; attribute uses
the first source-order exact-key range as `primaryRange` and returns every
matching occurrence in source order. The private API never returns URI,
`TextDocument`, snapshot, parser, or domain objects.

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

Lookup validates the index ID's runtime namespace and registry membership,
the exact request keys, the closed target kind, and required/forbidden
`parameterKey` before resolving a range. A source handle, session, action,
Flow node, or Flow edge ID is never accepted as a source-index ID. A success
has only `primaryRange` and `occurrences`; a failure has only `code`.

Lookup failures use the closed codes `source-index-missing`, `unit-missing`,
`parameter-key-missing`, `parameter-occurrence-missing`,
`unsupported-target-kind`, `malformed-source`, `stale-source`, and
`expired-source-index`. Empty names, malformed name fields, or a name that is
not unique use the unit header full range as the successful fallback; they do
not trigger approximate text search. The ANTLR adapter derives that header
range from the `unitAttribute` parse context (`UNIT_KEY` through `SEMI`), the
name subrange from the `TEXT` value token before the first comma, and parameter
occurrences from each `unitParameter` `PARAMETER_KEY` token/context. No
normalized-domain type is changed.

## Flow Accessibility And Detail Ownership

The semantic overlay is an application/host-owned plan, not a new Flow wire
variant. It is materialized once as a highlighted `FlowGraphDocument` inside
the existing `changeDocument` payload and cleared with the same message's
`data: null`; a newer session replaces the document only while its host-private
owner token is current. Focus is the existing `revealUnit` payload and the
existing ready/onReady sequence. Viewer messages remain `{ type, data }` only;
their parser/validator is the atomic rejection boundary. Explorer session,
correlation, and `(flowUri, sessionId, disposeEpoch)` owner tokens stay host
private and are never serialized into Flow messages. The 8 MiB bound applies
only to the Explorer request/reply/host transport, not these existing viewer
messages.

The highlighted document's optional augmentation contains only `nodes` and
`relations`; each entry contains exactly `id`, `kind`, `changeIds`, and
`confirmationIds`. These fields are projected through the existing viewer
document; `reasonCode`, rationale, constraints, endpoint prose, and any other
reason detail are forbidden in Flow DTOs and viewer messages. Explorer resolves
those details from `context.result` by the retained IDs. A missing ID returns
`record-not-found` safely, leaves the Flow view unchanged, and announces the
failure in Explorer. Flow relations remain non-focusable; the Explorer's
focused leaf reads the localized state and endpoint summary via `aria-live`,
including the count of matching duplicate relations. Flow must expose
equivalent state through visible text, pattern, legend, DOM semantics, and
high-contrast styling without changing ordinary edge keyboard behavior.

## Behavioral Scenarios

```gherkin
Feature: Explore a semantic comparison

Scenario: Review a completed comparison in one explorer
  Given the existing file comparison completes successfully
  When the comparison is presented
  Then a dedicated explorer shows summary counts and a hierarchical change tree
  And the displayed facts preserve the upstream semantic result

Scenario: Filter confirmation-required items
  Given the explorer contains ordinary and confirmation-required changes
  When the reviewer enables the confirmation-required filter
  Then only confirmation-required review items remain in the tree
  And disabling the filter restores the same comparison session

Scenario: Reveal a changed target in its source definition
  Given a change has an available source target on a known comparison side
  When the reviewer invokes source navigation
  Then the corresponding before or after definition is opened
  And the target range is revealed without changing another definition

Scenario: Reveal a removed target in the before-side flow
  Given a removed unit has a renderable before-side flow target
  When the reviewer invokes Flow navigation
  Then the before-side Flow Viewer opens or focuses the target scope
  And the removed target is selected and identified as removed

Scenario: Open Markdown for the same comparison
  Given a comparison is open in the explorer
  When the reviewer requests Markdown output
  Then the applicable report is rendered from the same comparison session
  And the report is opened without an implicit clipboard write

Scenario: Navigate the explorer without pointer or color dependence
  Given the explorer is focused
  When the reviewer traverses cards, filters, tree items, and actions by keyboard
  Then every available action is operable with visible focus
  And change and confirmation states are exposed through accessible text
```

## Architecture

- Domain: none; this feature does not add semantic comparison or JP1/AJS
  interpretation rules. Normalized domain models remain unchanged and carry
  no source locations or host identity.
- Application: map an upstream neutral comparison result plus side-specific
  source/flow context into stable explorer view data and explicit navigation
  outcomes. Own the browser-safe source-index DTO, same-pass capture contracts,
  and branded opaque handles while retaining normalized unit IDs as lookup
  keys. Do not import VS Code, URI, `TextDocument`, host snapshot,
  generated-parser, or UI framework types.
- Presentation: own the dedicated explorer webview, summary and tree
  interaction, localization, accessibility, host message validation, and
  rendering of upstream facts and navigation availability.
- Infrastructure: reuse existing parsing and source-document capabilities;
  the parser adapter is the only producer of source-index entries and converts
  unit header/name and parameter occurrence token ranges into the application
  DTO during the same parse that normalizes the document. It exposes no parser
  internals to presentation.
- Bootstrap/presentation host adapters: own URI, `TextDocument`, snapshot,
  report, action, source-index, and Flow-overlay registries and compose the
  comparison session, Explorer surface, Flow Viewer, source navigation, and
  Markdown handoff without constructing infrastructure implementations in
  inner layers.

## Impact Analysis

### Dependency Impact

- Required predecessors:
  `semantic-diff-identity-confidence` supplies stable identity evidence,
  `semantic-diff-structured-outputs` supplies neutral explorer/report facts,
  and `semantic-diff-review-risk-rules` supplies the reviewed confirmation
  classification.
- Existing reusable foundation:
  `SemanticDiffOutputContext`, `presentSemanticDiffOutput` and its common
  picker, `SemanticDiffChangeSet`, `buildSemanticDiffFlowHighlights`, Flow
  graph semantic-highlight DTOs/rendering with formal edge IDs, absolute-path
  Flow navigation, existing viewer host-message validation, and the virtual
  Markdown report document.
- Expected future impact: semantic-diff command orchestration, application
  explorer view models/navigation outcomes and source-index port, VS Code
  webview hosting, existing Flow host-message reuse and highlight
  presentation, localized explorer strings, and focused
  application/presentation/desktop/web tests.
- Propagation decision: update the durable semantic-report and flow-exploration
  use cases when implementation makes the explorer the primary successful
  comparison surface. Preserve semantic comparison rules, existing Flow layout
  and search behavior, explicit Markdown copy behavior, and normal non-diff
  Flow Viewer behavior.

### Breaking Change Analysis

- User-visible behavior: additive explorer functionality, with the existing
  successful file-comparison command handing off to the explorer before
  Markdown. Markdown remains explicitly available from the explorer.
- API/DTO/schema compatibility: `FlowGraphEdgeDto.id` is the additive formal
  stable ID; existing viewer host envelopes remain `{type, data}` and gain no
  Flow overlay variant. New Explorer/session and side-aware navigation
  contracts must be additive. Explorer payloads use closed unions, explicit
  nulls, correlation/session/action IDs, strict extra-key rejection, and the
  fixed message-size limit; that limit does not apply to existing viewer
  messages. Any incompatible upstream contract change requires replanning.
- VS Code/web extension compatibility: preserve `engines.vscode` `^1.75.0`,
  desktop and web hosts, browser-safe shared code, high-contrast presentation,
  and current keyboard/accessibility behavior.
- Changed scenarios: add explorer presentation, confirmation filtering,
  side-specific source/Flow navigation, and Markdown handoff scenarios;
  revise the current automatic Markdown-display scenario without changing the
  explicit-copy rule.

### Alternative Considerations

- Extend the Markdown document with links only: rejected because it does not
  provide persistent filtering, hierarchical exploration, summary cards, or
  coordinated Flow selection.
- Rebuild a separate diff graph: rejected because it would duplicate the
  existing Flow graph, navigation, highlight, accessibility, and layout
  foundations.
- Put the explorer directly inside the existing Flow Viewer: rejected because
  removed and unsupported changes may not have an after-side graph target and
  because the review tree must remain useful without changing Flow scope.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` `Human Approval`, `Completion Approval`,
  or `Closure Approval`, according to the lifecycle gate.
- Scope changes requiring re-approval: comparison-source or period selection,
  schedule-calendar visualization, new semantic identity or risk rules, report
  mode/schema ownership, review-decision persistence, definition editing, or a
  replacement Flow renderer.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode` (`^1.75.0`).
- Web extension compatibility: the same explorer behavior and plain transport
  data must work without Node built-ins or filesystem/process assumptions;
  unavailable host navigation fails with an accessible explanation. URI,
  `TextDocument`, and snapshot registries remain in bootstrap/presentation.
- Desktop extension compatibility: use VS Code host adapters for source,
  explorer, Flow, and report surfaces without adding desktop-only behavior.
- Existing JP1/AJS definitions and Semantic Diff meaning remain unchanged;
  the explorer only presents upstream facts.
- Existing non-diff Flow Viewer behavior, search, nesting, keyboard navigation,
  and viewer-to-viewer navigation remain unchanged when no diff session exists.
- Model, Serena, or agent choice does not change this behavior contract or the
  SDD approval gate.

## Acceptance Criteria

- One completed existing file comparison can be reviewed through summary
  cards and a deterministic hierarchical change tree.
- Confirmation filtering preserves counts, selection rules, and the immutable
  comparison session.
- Available source and Flow actions navigate to the correct side and target;
  unavailable or stale targets have a stable, accessible failure outcome.
- The closed target-side table is applied for all five change kinds and all
  nine confirmation reasons, including the before-only conditional-relation
  exception; relation canonical pairs resolve only to exact side-specific edge
  IDs.
- A source index is emitted by parser infrastructure from exact unit header/name
  and parameter occurrence ranges into an application-owned browser-safe DTO
  in the same parse that produces the normalized comparison document.
  Before/after each parse exactly once, both sides' syntax errors remain
  available, and normal parser consumers are unchanged. Exact-context binding,
  rollback, idempotent release, concurrent command isolation, no action-time
  parsing, duplicate-normalized-ID rejection, UTF-16, CRLF, Unicode,
  duplicate-key, and malformed-input behavior are covered. Capture ownership
  survives binding, registry references are borrowed, and composite cleanup
  unregisters them before the single release. Decoded-text revalidation covers
  configured encodings, dirty buffers, immutable provider snapshots, and stale
  completion after document opening.
- Existing Flow construction and semantic-highlight foundations render and
  expose added, removed, changed, and confirmation-required states without
  changing normal Flow behavior. Highlighted documents use the existing
  `changeDocument` envelope, focus uses `revealUnit`, and readiness reuses
  `ready`/`onReady`; no new overlay response/message variant is added.
  Relations remain non-focusable and state is also available through patterns,
  legend, DOM text, and high-contrast styles.
- Markdown output opens from the same comparison session and never writes the
  clipboard implicitly. Explorer calls the shared four-mode picker and
  dispatcher with the same immutable context without re-comparison or summary
  recalculation.
- All interactive explorer functions are keyboard operable, expose meaningful
  accessible names/states, restore focus predictably, and remain usable in
  high-contrast themes. The focused leaf and `aria-live` status announce
  endpoint/state details; source and Flow operations revalidate immediately
  before host execution.
- Closed request, reply, and host-message unions reject unknown or extra keys,
  wrong-session/non-finite correlation values, and payloads over the fixed
  limit. Panel close releases snapshots, report/action handles, context, and
  only the overlay owned by its `(flowUri, sessionId, disposeEpoch)` token;
  late completions cannot restore state.
- Focused application, presentation, message-contract, source/Flow navigation,
  Markdown handoff, desktop, web, accessibility, malformed-message, and large-
  comparison tests pass with repository quality checks.

## Non-Goals

- Adding Git HEAD, WebAPI, or other comparison sources; renaming comparison
  commands; or adding comparison-period input.
- Implementing a schedule impact calendar or timeline.
- Changing identity fingerprints, semantic comparison rules, confirmation-risk
  rules, structured-output schemas, report modes, or localization policy.
- Adding reason codes or reason/detail fields to Flow DTOs or wire messages;
  Explorer resolves those details from its immutable `context.result` by IDs.
- Reimplementing Flow graph layout, navigation, search, or semantic
  highlighting.
- Editing definitions, accepting identity candidates, dismissing or persisting
  review decisions, or claiming runtime failure from definition-only evidence.
- Combining diagnostics with Semantic Diff or changing telemetry content.

## Open Questions

- None for intake. Planning must verify that the reviewed predecessor contracts
  satisfy the roadmap entry condition before assigning implementation slices.
