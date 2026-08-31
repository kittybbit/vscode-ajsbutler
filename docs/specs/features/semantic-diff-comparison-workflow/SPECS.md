# Feature Specification: Semantic Diff Comparison Workflow

## Purpose

Make Semantic Diff discoverable as a definition-comparison workflow that lets
a reviewer choose a before definition from a file or Git `HEAD`, optionally
select a schedule comparison period, and open the resulting comparison in the
Semantic Diff Explorer without repeating comparison work.

## Minimal Context

- Current decision: define the user-facing command, source selection, optional
  period, Git availability, and successful-result handoff boundary.
- Feature kind: roadmap feature, Wave 3.
- Selected feature folder:
  `docs/specs/features/semantic-diff-comparison-workflow/`.
- Read first: this file, `TASKS.md`,
  `docs/requirements/use-cases/uc-build-semantic-diff.md`, and the predecessor
  feature contracts named under `Origin`.
- Read `TRACEABILITY.md` when checking requirement coverage.
- Do not create `CONTEXT.md`; use `docs/specs/README.md` as the SDD policy
  owner.

## Origin

- Source: improvement proposal F-1, `Semantic Diff command workflow
improvements`.
- Roadmap item: Wave 3, `Improve The Semantic Diff Comparison Workflow` in
  `docs/specs/roadmap.md`.
- Source use cases: `docs/requirements/use-cases/uc-build-semantic-diff.md`
  and `docs/requirements/use-cases/uc-present-semantic-diff-report.md`.
- Predecessor contracts: `semantic-diff-identity-confidence`,
  `semantic-diff-structured-outputs`, `semantic-diff-review-risk-rules`,
  `schedule-semantics-expansion`, and `semantic-diff-explorer`. This feature
  consumes their completed result, period, output-context, four-mode output,
  and Explorer contracts; it does not reproduce their rules or UI.
- Schedule calendar relationship: this feature supplies the period-bearing
  comparison context required before the public Slice 3 of
  `schedule-impact-calendar` may expose its action. The calendar's internal
  artifact/session contracts from Slices 1–2 precede this workflow; its public
  Slice 3 does not. The existing artifact/sidecar adapter is consumed at its
  boundary and is not redesigned here.
- JP1/AJS reference basis: no new JP1/AJS semantic rule is introduced. Parsed
  definitions and period comparison retain the repository's normative
  JP1/AJS3 version 13 basis. Command wording, source selection, period-input
  UX, and Git `HEAD` retrieval are product workflow decisions inferred from
  proposal F-1 rather than claims from a JP1/AJS manual.
- Implementation-slice plan: `TASKS.md` after delegation to `plan-author`.

## Requirements

- WF-1: Preserve the command identifier `ajsbutler.compareSemanticDiff` and
  rename its user-facing command title to `Compare Definition` under the
  existing `JP1/AJS` category. Existing keybindings or callers using the
  command ID must continue to work.
- WF-2: The active JP1/AJS editor is the after side and its current editor
  buffer, including unsaved changes, is read exactly once for the comparison.
  It is not reopened while prompts are displayed. The workflow must label
  before and after roles clearly.
- WF-3: Before-side source selection offers `Select Definition File` and
  `Git HEAD`. File selection opens one user-selected resource through
  `workspace.openTextDocument` and captures its `getText()` snapshot, preserving
  VS Code's configured decoding, including Shift_JIS. File-open or `getText()`
  failure returns `before-file-read-failed` without guessing a decode or I/O
  cause from the exception. Git selection captures `state.HEAD.commit` once
  as an immutable `headCommit` and uses it for every object lookup and
  `Repository.show` call. The decoded/textconv result is labelled `HEAD`,
  never reread through the moving ref, and never replaced by index or
  working-tree content. It does not promise raw blob bytes or decoding
  identical to the file source.
- WF-4: Git access is an optional presentation/infrastructure capability
  behind a narrow injected port. It must feature-detect the built-in VS Code
  Git extension API version available to VS Code `^1.75.0`, select the
  repository containing the active document, and use no Git CLI, Node
  built-in, or direct `.git` filesystem access.
- WF-5: A dirty or staged document compares the resolved `HEAD` source with
  the current editor buffer. Try the active document's current path in `HEAD`
  first; success takes precedence over advisory working/index status. Only
  when current-path `getObjectDetails` fails with
  `gitErrorCode: "UnknownPath"` may exactly one unambiguous candidate map its
  `originalUri` to the HEAD source with `renameUri` equal to the current URI.
  Other provider/API failures return a stable failure without inspecting
  candidates. A selected-candidate lookup or `show` failure with `UnknownPath`
  returns `head-source-missing` without another fallback.
  Allow only `indexChanges` status `INDEX_RENAMED` or `workingTreeChanges`
  status `MODIFIED`/`DELETED` with that rename shape; VS Code 1.75 has no
  separate working-tree rename/copy enum. Reject `INDEX_COPIED`, unsupported
  status/URI shapes, multiple candidates, and staged/working rename chains;
  do not guess a before path. A missing source returns actionable
  `head-source-missing`, never an empty definition or an assertion that the
  document is untracked: VS Code's API need not expose hidden or separately
  grouped untracked files. Non-repository, disabled or missing Git extension,
  missing `HEAD`, non-blob/submodule, API failure, and missing-source outcomes
  must be distinguishable without affecting file comparison.
- WF-6: Before comparison, the user explicitly chooses either `No schedule
period` or `Specify schedule period`. No period remains the compatibility
  default. Specifying a period requests separate `from` and `to` values in
  ISO calendar-date form `YYYY-MM-DD`, interpreted as the existing half-open
  interval `[from, to)`.
- WF-7: Period input accepts only real zero-padded Gregorian dates with
  `from < to`. Invalid input remains in the prompt with a concise validation
  message and must never start parsing or comparison. Cancelling either period
  prompt cancels the whole workflow.
- WF-8: Comparison source and period values are not persisted in workspace,
  global, or secret storage. Each run starts with no implicit period and asks
  for its source. This feature does not add settings or change configuration.
- WF-9: One successful command run parses each side once, performs one
  Semantic Diff comparison and schedule evaluation at most once, and builds
  one immutable output context. Before artifact construction, begin an
  isolated Explorer-owned capture with both immutable, side-labelled source
  descriptors. Its scoped `AjsParserPort` derives each normalized document
  and source index from the same ANTLR pass. Call the bootstrap-injected
  `(parser, input) => result` callback with that scoped parser; bootstrap
  alone invokes the unchanged calendar artifact factory and its unchanged
  input/result interface. Bind the two successful captures exactly once to
  the exact resulting context. Explorer, report modes, and schedule-impact
  consumers reuse that context; source actions use retained indexes and
  snapshots without parsing, regenerating indexes, or searching another side.
- WF-10: The Semantic Diff Explorer is the sole default successful
  destination. It opens exactly once with the immutable context. Its existing
  Output action keeps Summary, Full, Audit, and JSON reachable through the
  predecessor-owned common picker; the command does not automatically open a
  second report or copy anything. Acquire opaque source handles and immutable
  snapshots before capture, while no output context exists. The file before
  side uses the selected document snapshot, Git before uses an immutable
  `ajsbutler-git-head:` URI/content snapshot, and after uses the active
  document URI, version, and text snapshot. After successful capture binding,
  bootstrap registers a borrowed binding against that exact context/scope
  before the existing one-argument `OpenSemanticDiffExplorer(context)` call.
  Host URI and `TextDocument` remain outside application descriptors; source
  navigation resolves the predecessor registry, not new context fields or
  wire content. Captures are isolated per command and remain the sole lifetime
  owner of retained indexes and immutable snapshot references from collecting
  through release. Binding transfers no ownership; the registry and Explorer
  only borrow references and never dispose those resources. Composite cleanup
  calls `unregister(context, scope)` before `scope.release()` exactly once;
  repeated cleanup is a no-op. Failure, cancellation, partial registration,
  creation rollback, direct scope release, and stale epochs invalidate
  borrowed lookups and release acquired resources. Late actions or completion
  cannot reacquire released state or reveal changed content as the snapshot.
- WF-11: Pass the selected period unchanged as
  `options.scheduleComparisonPeriod` through the calendar-owned source-text
  adapter into comparison; omit `options` when no period is selected. Consume
  its future `BuildSemanticDiffPresentationArtifactsInput`, defined as
  `BuildSemanticDiffReportDataInput & { options?: Pick<CompareSemanticDiffOptions,
"scheduleComparisonPeriod"> }`, without changing the existing content-only
  `BuildSemanticDiffReportDataInput`. The resulting context and sidecar retain
  the evaluated period facts. No-period success still
  opens the normal Explorer, while the schedule-impact action remains hidden
  or disabled. The public calendar
  action requires both this feature's completion commit and the calendar's
  public Slice 3, with evaluated period facts. Calendar owns internal sidecar
  registration and the public action; this workflow implements neither.
- WF-12: Cancelling source, file, or period selection returns a structured
  cancellation without an error notification, output, Explorer, calendar
  registration, or retained partial session. Read, Git, decode, parse,
  comparison, context-build, or Explorer-open failure returns a stable
  structured failure and shows at most one localized actionable message.
  Normal parser errors preserve the existing before/after error union,
  including errors from both sides when both fail; they do not bind captures.
  Capture-contract exceptions and unsuccessful capture binding return
  `source-capture-failed`, not fabricated parser errors. Bootstrap catches
  the typed `SemanticDiffSourceCaptureError` at the injected callback boundary;
  unrelated exceptions retain their ordinary failure classification.
- WF-13: Reject NUL-containing decoded snapshots before parsing. NUL is the
  only guaranteed non-text signal for VS Code-decoded file content; other
  strings accepted by VS Code are treated as decoded text, not certified as
  non-binary. Git additionally requires provider object/type inspection and
  rejects advertised non-text MIME. An advertised encoding must be `utf8`,
  `utf16be`, or `utf16le`; other values return `unsupported-encoding`.
  When encoding is omitted, `show` uses its configured decoder. Malformed
  JP1/AJS content retains
  side-specific parser errors and must not be presented as an empty or valid
  comparison. Each source is limited to 8 MiB measured by browser-safe
  `TextEncoder` over its decoded JavaScript string, not by on-disk bytes or
  encoding. This per-source limit is distinct from the Explorer's existing
  8 MiB serialized-message limit. Reject oversized text without truncation
  before parsing or source registration; document-open/decoding failures remain
  source failures. Large input must avoid duplicate reads, parsing, comparison,
  rendering, or retained partial panels without changing JP1/AJS meaning.
- WF-14: User-facing source, period, validation, cancellation, and error text
  is localized for English and Japanese with English fallback. Paths, refs,
  dates, JP1/AJS identifiers, and raw values are not translated.

## Behavioral Scenarios

```gherkin
Feature: Compare JP1/AJS definitions

Scenario: A file is compared and Explorer opens
  Given a JP1/AJS definition is open as the after side
  And the reviewer selects another definition file as the before side
  And the reviewer chooses no schedule period
  When comparison succeeds
  Then the definitions are compared exactly once
  And one Semantic Diff Explorer opens with the resulting context
  And Summary, Full, Audit, and JSON remain available from its Output action

Scenario: A dirty tracked document is compared with Git HEAD
  Given the active tracked definition has unsaved or working-tree changes
  And the reviewer selects Git HEAD
  When comparison succeeds
  Then the before side is decoded/textconv text at the captured HEAD commit
  And the after side is the current editor buffer
  And the index does not replace either side

Scenario: A missing Git HEAD source does not imply untracked status
  Given no current or allowed renamed HEAD path resolves for the active definition
  When the reviewer selects Git HEAD
  Then the workflow returns head-source-missing without asserting untracked status
  And it does not invent an empty before definition
  And it does not run Semantic Diff

Scenario: A valid period is carried to downstream review
  Given the reviewer enters valid from and to dates
  When comparison succeeds
  Then the exact half-open period is present in the immutable context
  And the Explorer opens once
  And schedule-impact presentation may consume the evaluated period facts

Scenario: Invalid or cancelled input has no partial result
  Given source or period input is invalid or cancelled
  When the workflow stops
  Then no comparison, output, Explorer, or calendar session is created
  And cancellation is not presented as an error
```

## Architecture

- Domain: no new responsibility. Existing identity, risk, schedule, and
  comparison semantics remain owned by their predecessor domain contracts.
- Application: own a host-neutral workflow input/result boundary and
  orchestrate exactly one parse/comparison/context build through injected
  ports. Explorer owns the same-pass capture and source-index contracts;
  existing parser and calendar factory interfaces remain unchanged. It must
  not depend on Git, VS Code, or presentation types.
- Presentation: own command prompts, labels, localization, active-editor
  and decoded-file capture, cancellation/error presentation, host-private
  source snapshots, and the default Explorer handoff.
- Infrastructure: own the optional narrow adapter over the built-in VS Code
  Git extension API and return plain source outcomes. It must not run Git or
  expose VS Code Git types inward.
- Bootstrap: compose source adapters, the predecessor comparison/artifact
  builder, and the existing Explorer/session opener without constructing
  semantic meaning. Inject the per-command capture capability and the
  `(parser, input) => result` callback that invokes the application factory.
  After capture succeeds, associate the retained indexes and opaque source
  handles with the exact output context through a borrowing host-private
  registry. The capture remains their sole owner. Preserve the opener
  signature and coordinate unregister-before-release cleanup with the calendar
  companion owner.

## Impact Analysis

### Dependency And Overlap Impact

- The current command reads one selected before file and the active editor,
  builds one Markdown report, and opens that report. This feature replaces the
  orchestration and default destination while keeping the command ID.
- Identity confidence owns correspondence evidence; structured outputs own
  the neutral result, immutable output context, four modes, and report/JSON
  presentation; review-risk owns confirmation rules; schedule semantics owns
  period evaluation; Explorer owns the default interactive view and Output
  action. This feature only collects workflow input and hands one result to
  those contracts.
- `schedule-impact-calendar` owns its sidecar, registry, and calendar action.
  This feature owns the period-bearing command context that gates the later
  public action. Its internal Slices 1–2 are required before this workflow;
  public Slice 3 follows workflow completion. The relationship is a
  slice-level dependency, not a whole-feature cycle or duplicate calendar
  scope.
- No feature split is required: naming, source selection, optional period, and
  handoff are one observable command workflow.

### Breaking Change Analysis

- User-visible behavior: the command is renamed and successful comparison now
  opens Explorer instead of automatically opening Full Markdown. Full Markdown
  remains reachable through the Explorer Output action.
- API/DTO/schema compatibility: preserve the command ID and predecessor result,
  context, output-mode, JSON version, Explorer, and schedule contracts. New
  workflow and Git-source outcomes are internal additive unions.
- VS Code/web extension compatibility: retain `^1.75.0`; file comparison works
  on desktop and web. Git comparison is capability-based on both hosts and
  degrades to an actionable unavailable result when the built-in Git API or a
  repository-backed text source is absent.
- Changed scenarios: command discovery, explicit file/Git source, dirty,
  untracked and renamed Git state, optional period, cancellation/errors,
  Explorer default handoff, and one-comparison reuse.

### Alternative Considerations

- Add a second command ID and remove the old one: rejected because it would
  break existing command invocations and keybindings.
- Use `Create Change Review` as the command title: rejected because `Compare
Definition` states the immediate action and does not imply that an approval
  record is created.
- Persist the last source or period: rejected because a stale implicit period
  can silently change schedule findings and persistence is unnecessary for
  the first workflow.
- Invoke a Git executable or read `.git` directly: rejected because it breaks
  web support and the repository's production-source rules.
- Open Full Markdown automatically and Explorer second: rejected because it
  creates competing defaults and risks rebuilding the same result.
- Treat untracked content as an addition from an empty document: rejected
  because the existing use case compares two job-group definitions and has no
  approved absent-side contract.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` according to the lifecycle gate.
- Scope changes requiring re-approval: a new command ID; WebAPI, index, commit,
  branch, or arbitrary-ref sources; manual correspondence; persisted settings;
  a different default destination; automatic clipboard or report opening;
  absent-side comparison; predecessor DTO/JSON/Explorer/calendar contract
  changes; Git CLI or Node use; desktop-only behavior; telemetry; a VS Code
  compatibility-floor increase; or new JP1/AJS interpretation.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode` (`^1.75.0`).
  Planning must verify the exact optional Git API surface against that floor
  and keep it behind runtime feature detection and a narrow adapter.
- Web extension compatibility: file comparison uses
  `workspace.openTextDocument`/`getText()`; Git HEAD
  is available only when the web host's built-in Git provider supplies the
  required repository and text-blob capability. Shared code remains free of
  Node built-ins and filesystem/process assumptions.
- Desktop extension compatibility: use the same workflow/result contract.
  Desktop may not silently fall back to the Git CLI when the extension API is
  unavailable.
- JP1/AJS compatibility: retain the predecessor JP1/AJS3 version 13 rules and
  accept the same well-formed definition files. This workflow changes no
  parser, identity, risk, or schedule meaning.
- Git compatibility: `HEAD` labels the selected repository's commit captured
  once from `state.HEAD.commit`, not a moving ref or staged content. Every
  object lookup and content retrieval uses that same hash even if HEAD moves.
  Its source text follows `Repository.show` decoding and
  textconv behavior, not a raw-blob guarantee. Dirty and staged content remains
  the after side. Unresolved/ambiguous rename, binary, non-blob, and
  missing-source states are explicit unavailable/failure outcomes; working
  status does not establish that a source exists or that a file is untracked.
- VS Code 1.75 Git API evidence: the optional adapter uses
  `vscode.extensions.getExtension("vscode.git")`, `GitExtension.getAPI(1)`,
  `API.getRepository(uri)`, `Repository.state.HEAD`,
  `getObjectDetails(headCommit, relativePath)`, `detectObjectType(objectHash)`,
  and `show(headCommit, absolutePath)` behind a private minimal structural
  type. All three methods are required; missing type detection returns
  `api-unavailable`, never unchecked content. It does not add an unpublished
  Git API type dependency. Status and rename-URI semantics follow the
  [VS Code 1.75 Git API declaration](https://github.com/microsoft/vscode/blob/1.75.0/extensions/git/src/api/git.d.ts)
  and [resource mapping](https://github.com/microsoft/vscode/blob/1.75.0/extensions/git/src/repository.ts).
- Git type detection accepts only the VS Code 1.75 advertised encoding values
  `utf8`, `utf16be`, and `utf16le`; absent encoding does not override the
  configured `show` decoder, and an unknown value returns
  `unsupported-encoding`. File-source decoding remains owned by VS Code and
  is not restricted to these Git detector values.
- Git-before navigation uses a browser-safe `TextDocumentContentProvider`
  serving only the captured string, with no further Git reads. Each snapshot
  first receives a collision-free opaque URI key scoped to its command, before
  parsing or output-context creation; successful capture later binds its
  handle to the exact context. The URI exposes no repository path, ref, or
  object identifier. At most eight snapshots may be
  active. A full provider returns typed `capacity-exceeded`, mapped to one
  `explorer-open-failed` result without a panel. Released entries are removed
  immediately and free capacity; rollback and composite session disposal
  remove registrations, and late/stale reveals fail closed.
- Comparison periods have no new maximum duration. Validation preserves the
  schedule predecessor's half-open semantics and linear ten-year scale case.

## Acceptance Criteria

- The command appears as `JP1/AJS: Compare Definition` while
  `ajsbutler.compareSemanticDiff` remains callable.
- File and Git HEAD paths produce correctly labelled before/after text, and
  dirty, staged, untracked, renamed, non-repository, unavailable Git, binary,
  malformed, and large-input cases have explicit tested outcomes.
- File tests preserve configured Shift_JIS decoding; Git tests establish
  decoded/textconv source semantics and immutable commit arguments even if
  HEAD moves. File-open/`getText()` failures use `before-file-read-failed`
  without exception-based cause guessing. Tests reject NUL and preserve the
  documented lack of a general binary detector for decoded file strings.
  Limit tests measure decoded UTF-8 bytes, including exactly and over 8 MiB.
  Hidden/separate untracked status cannot change `head-source-missing` into an
  untracked claim. Current-path success precedes rename fallback. Tests cover
  the exact `INDEX_RENAMED` and `MODIFIED`/`DELETED` plus `renameUri` shapes;
  `INDEX_COPIED`, unsupported shapes, multiple candidates, and rename chains
  never guess a source. Missing `detectObjectType` returns `api-unavailable`.
  Encoding tests cover all three accepted detector values, an omitted value
  with configured decoding, and an unknown value as `unsupported-encoding`.
- Only current-path `getObjectDetails` with exact `gitErrorCode: "UnknownPath"`
  enters rename fallback. Tests prove other errors never inspect candidates,
  and candidate lookup or `show` returning `UnknownPath` ends with
  `head-source-missing` without another fallback.
- Git snapshot-provider tests cover opaque key uniqueness, independent
  snapshots, the eight-active-entry limit, explicit capacity failure without
  a panel, released-entry reuse, rollback/disposal, stale reveals, and zero
  additional Git reads during navigation.
- Period omission preserves current no-period behavior; valid ISO dates produce
  the exact half-open period; invalid dates never start comparison; no source
  or period preference is persisted.
- A successful run reads and parses each side once, compares and evaluates at
  most once, creates one immutable context, and opens one Explorer.
- Capture starts before the artifact callback; each normalized document and
  index share one ANTLR pass. Both successful captures bind once to the exact
  context before opening. Tests preserve both-side syntax errors, isolate
  concurrent commands, distinguish typed capture failures from parser errors,
  and reject incomplete, mismatched, extra, rebound, or released captures.
  Source actions perform zero parses or index regeneration.
- Lifecycle tests prove capture ownership never transfers at bind or registry
  registration; cleanup unregisters the exact context/scope before one scope
  release. Repeated cleanup, direct release, stale epochs, and late completion
  cannot double-dispose, retain, or reacquire borrowed resources.
- The one-argument Explorer handoff resolves the exact before/after snapshots
  and retained indexes through context-keyed opaque handles. Tests verify
  snapshot acquisition before any context exists, subsequent exact-context
  binding, and unchanged calendar factory/input/result interfaces. Failed
  parsing, binding, partial registration, creation, cancellation, disposal,
  and late/stale navigation leave no retained indexes, snapshots, handles,
  or misleading source reveal.
- Summary, Full, Audit, and JSON are reachable from the existing Explorer
  Output action without a second comparison. Full Markdown is not opened or
  copied automatically.
- Cancellation is silent and atomic. Every non-cancellation failure is
  side/capability-specific, localized, actionable, and leaves no output,
  Explorer, calendar registration, or partial session.
- File comparison and all shared workflow behavior pass desktop and web tests
  at VS Code `^1.75.0`; Git capability tests cover available and unavailable
  desktop/web adapters without Git CLI or Node built-ins.
- A valid period-bearing completion supplies the prerequisite for the
  schedule-impact calendar public Slice 3; no period keeps its action hidden or
  disabled.

## Durable Documentation Impact

- Add a durable `docs/requirements/use-cases/uc-compare-ajs-definitions.md`
  contract and index it when implementation makes the command workflow
  observable. It owns trigger, source choice, period input, cancellation, and
  default Explorer handoff; it does not duplicate comparison semantics.
- Update `README.md` and `README.en.md` for the renamed command, file/Git
  workflow and decoding, optional period, Explorer default, and output action.
  Replace old command names and automatic-Markdown descriptions in both.
  A `CHANGELOG.md` entry is required because command naming and the successful
  destination change.
- `docs/specs/roadmap.md` owns this Wave 3 item and the Wave 4 public calendar
  prerequisite: internal calendar support precedes this workflow, and public
  calendar delivery follows its completion and period-bearing context.
  This intake does not edit the roadmap outside its delegated folder scope.
- Update `docs/specs/architecture.md` only if Planning approves a reusable Git
  source boundary not already covered by the current adapter policy. No vision,
  glossary, or context-map change is expected.

## Non-Goals

- WebAPI, index, arbitrary commit/ref, branch-to-branch, or folder comparison.
- Manual identity correspondence, similarity matching, or new comparison,
  review-risk, schedule, calendar, report, JSON, Explorer, Flow, or source-
  navigation semantics.
- Persisting comparison sources, periods, review decisions, or results.
- Editing definitions, staging/committing Git changes, invoking Git CLI,
  querying execution history, or verifying external JP1/AJS runtime behavior.
- Adding configuration, telemetry, a second public command, automatic report
  opening, or implicit clipboard mutation.
- Raising the minimum VS Code version or making Git comparison desktop-only.

## Open Questions

- None blocking independent plan review. Exact predecessor symbols must be
  checked against their completion commits before Slice 1 implementation; a
  mismatch requires Replanning.
