# Feature Specification: Schedule Impact Calendar

## Purpose

Present the schedule effects of one completed Semantic Diff comparison as a
read-only, accessible calendar/timeline for its selected period, so reviewers
can see when supported runs are expected, added, removed, or moved in time
without confusing valid zero-run results with unsupported or uncalculated
schedule semantics.

## Minimal Context

- Current decision: add one dedicated schedule-impact presentation that
  consumes stable upstream comparison facts and never recalculates JP1/AJS
  schedules in the presentation layer.
- Feature kind: roadmap feature, Wave 4 `Add A Schedule Impact Calendar`.
- Selected feature folder: `docs/specs/features/schedule-impact-calendar/`.
- Read first: this file, `TASKS.md`, the reviewed
  `schedule-semantics-expansion` plan, and the structured-output contract.
- Read `TRACEABILITY.md` only when planning or validating a requirement.
- Do not create `CONTEXT.md`; use `docs/specs/README.md` for SDD policy.

## Origin

- Source: improvement proposal N-3, `Schedule Impact Calendar`.
- Roadmap item: Wave 4, `Add A Schedule Impact Calendar` in
  `docs/specs/roadmap.md`.
- Source use case: `docs/requirements/use-cases/uc-build-semantic-diff.md`.
  A durable presentation use case is required when this behavior is delivered;
  the Markdown-only `uc-present-semantic-diff-report.md` is not widened during
  intake.
- Predecessor basis: the reviewed `schedule-semantics-expansion` feature owns
  JP1/AJS schedule interpretation, bounded run projection, comparison, valid
  no-run classification, and explicit unsupported or missing-context outcomes.
  The reviewed `semantic-diff-structured-outputs` feature owns neutral result,
  summary, reason-code, and report/JSON contracts. The reviewed
  `semantic-diff-explorer` feature owns the general change tree and Flow/source
  exploration behavior. The reviewed
  `semantic-diff-comparison-workflow` feature owns comparison sources, period
  input, and the period-bearing context required before this feature's public
  action can be reached.
- JP1/AJS reference basis: this feature introduces no schedule meaning. It
  presents facts calculated under the predecessor's JP1/AJS3 version 13
  normative sources and stable `JP1-PARAM-*` rules. Calendar/timeline layout
  and interaction are product workflow decisions from proposal N-3, not claims
  from a JP1/AJS manual.
- Implementation-slice plan: `TASKS.md` after delegation to `plan-author`.

## Requirements

- `CAL-FACTS-001`: the view must consume an immutable, host-neutral
  application result for the completed comparison. The calendar-owned
  internal `compareSemanticDiffWithArtifacts(input: CompareSemanticDiffInput)`
  contract accepts parsed before/after documents, performs identity comparison
  and schedule evaluation exactly once each, and returns
  `{ result, scheduleProjectionFacts }` on success. The command-facing
  adapter, not this internal contract, accepts
  the calendar-owned `BuildSemanticDiffPresentationArtifactsInput` contract
  defined below. It retains the existing `BuildSemanticDiffReportDataInput`
  source texts and parser-error union without changing that input type.
  `ScheduleProjectionFacts` is a discriminated union:
  `{ kind: "not-requested" }` has no `period`; `{ kind: "invalid", period,
issues }` preserves the invalid-period result; and `{ kind: "evaluated",
period, before: { rootProjections, statuses, issues }, after:
{ rootProjections, statuses, issues }, correspondence }` carries the
  evaluated facts.
  Presentation code must not parse schedule parameters, resolve calendars or
  inheritance, project runs, compare before/after runs, or infer risk from
  prose. The existing `compareSemanticDiff(input)` public contract remains
  unchanged and returns the internal contract's `.result`.
- `CAL-PERIOD-001`: the selected half-open comparison period `[from, to)` must
  remain visible while reviewing schedule effects. Period selection and
  validation belong to the comparison workflow; this feature consumes the
  selected period and preserves an upstream invalid-period outcome. Until the
  completion-committed `semantic-diff-comparison-workflow` supplies a
  period-bearing context, the public schedule action is hidden or disabled and
  the documented view is intentionally unreachable. It becomes enabled only
  after that workflow contract is available.
- `CAL-RUNS-001`: for every upstream-supported root-jobnet projection, the
  calendar data must retain the before-side and after-side run lists with unit
  identity/path, rule, date, and wall-clock time. The view must let a reviewer
  distinguish unchanged supported runs from added, removed, and changed-time
  effects without rerunning comparison. Root inclusion is closed to
  `unit.unitType === "n" && unit.isRootJobnet === true`; path depth, parent
  presence, truthy flags, or general jobnet type must not widen that set.
- `CAL-CHANGES-001`: added, removed, and changed-time effects must retain the
  exact upstream source-change references, sides, run facts, and deterministic
  ordering.
  Changed-time is one comparison fact with explicit before and after times,
  not an unrelated remove/add pair created by the UI.
- `CAL-ZERO-001`: a root jobnet may be shown as zero-run only when the upstream
  schedule result explicitly classifies that side and period as a complete,
  valid no-runs projection. An empty run array, an unsupported-only or partial
  projection, missing calendar context, or an invalid period must not be
  relabeled as zero-run.
- `CAL-UNKNOWN-001`: unsupported, invalid, missing-context, and otherwise
  uncalculated schedule portions must remain visible with side, target, stable
  reason code, structured detail/raw evidence allowed by the neutral contract,
  and localized presentation text. Unsupported 48-hour, calendar, inheritance,
  cycle, substitution, or other semantics must never be hidden behind a
  calculated or zero-run display.
- `CAL-PRESENT-001`: the canonical interactive representation is a date-grouped
  linear timeline/list with deterministic order, keyboard operation, and
  screen-reader semantics. A visual month/week calendar may project the same
  immutable items only when it stays synchronized with that canonical
  representation; it must not introduce separate calculation or filtering
  meaning.
- `CAL-FILTER-001`: reviewers must be able to inspect the whole period and
  narrow the presentation by root jobnet, root-side outcome, and run state.
  Root-side outcomes are exactly `supported-runs`, `valid-no-runs`, `partial`,
  and `uncalculated`; run states are exactly unchanged, added, removed, and
  changed-time. The two dimensions remain separate and combine
  conjunctively. Filtering changes visibility only; it must not change global
  counts, classifications, the comparison period, order, or retained session.
- `CAL-SESSION-001`: opening the schedule view must reuse one completed
  comparison session and its exact schedule facts. This feature owns the
  calendar presenter and an additive invocation from an existing review
  session; it does not choose comparison sources, request the period, rerun
  Semantic Diff, or decide which view a future comparison workflow opens by
  default. The bootstrap calendar companion
  `createScheduleAwareExplorerSession` always invokes the existing
  `OpenSemanticDiffExplorer(context)` exactly once for both available and
  unavailable impact, returning the normal Explorer parent handle. For
  available impact it atomically registers the context/sidecar before opening
  Explorer and exposes the calendar action; for unavailable impact it skips
  registry registration and hides the calendar action. Creation failure or
  cancellation rolls back any available registration and disposes partial or
  normal Explorer resources. The calendar is a
  host-private child of the Explorer session with its own opaque session,
  action, request, and epoch identities; child close never releases the
  parent sidecar/context, and its sidecar and action callback must not be added
  to the Explorer public message union.
- `CAL-A11Y-001`: date, unit, before/after state, effect kind, time, zero-run,
  and uncalculated status must have textual accessible names. Color, position,
  shape, hover, and animation must not be the sole indicators. Focus,
  announcements, high contrast, zoom, reduced motion, and keyboard navigation
  must remain usable on desktop and web.
- `CAL-SCALE-001`: rendering work must be bounded by the supplied period and
  result size. Large periods or run sets must use grouped/virtualized rendering
  or another bounded-DOM technique, preserve deterministic ordering, and never
  silently truncate or merge distinct facts. An upstream or transport limit
  failure must be explicit and recoverable. Every encoded calendar message,
  including success, failure, and close envelopes, has an inclusive 8 MiB
  UTF-8 limit; an oversized message must fail atomically without installing a
  partial snapshot.
- `CAL-PRIVACY-001`: telemetry, if existing catalog events are reused, must not
  contain definition content, paths, run lists, raw schedule values, or other
  personal identifiers. This feature does not add a new telemetry event by
  default.

## Normative Calendar Data Contract

### Sidecar Ownership And Root Correspondence

- `SemanticDiffOutputContext` remains the immutable `{ result, summary }`
  object owned by the structured-output predecessor. The calendar feature's
  internal application contract
  `compareSemanticDiffWithArtifacts(input: CompareSemanticDiffInput)` accepts
  parsed before/after documents, performs identity comparison and schedule
  evaluation once each, and returns
  `{ result, scheduleProjectionFacts }` on success. The command-facing
  adapter accepts the calendar-owned
  `BuildSemanticDiffPresentationArtifactsInput` source-text and optional
  period input below and preserves the existing parser-error union.
  `ScheduleProjectionFacts` is a
  discriminated union: `{ kind: "not-requested" }` has no `period`;
  `{ kind: "invalid", period, issues }` preserves the invalid-period result;
  and `{ kind: "evaluated", period, before: { rootProjections, statuses,
issues }, after: { rootProjections, statuses, issues }, correspondence }`
  carries the evaluated facts.
  The existing `compareSemanticDiff(input)` public contract remains unchanged
  by returning `.result` from that internal result. The pure
  `buildSemanticDiffPresentationArtifactsFromComparison({ result,
scheduleProjectionFacts })` calls `buildSemanticDiffOutputContext(result)`
  exactly once and returns `{ context, scheduleImpact }`. `scheduleImpact` is
  `{ kind: "unavailable", reason }` for `not-requested` or `invalid`, or
  `{ kind: "available", sidecar }` for `evaluated`; it performs no second
  comparison or schedule evaluation. The command-facing adapter
  `createBuildSemanticDiffPresentationArtifacts(parser, compareWithArtifacts,
builder)` accepts this additive source-text input contract:

  ```ts
  type BuildSemanticDiffPresentationArtifactsInput =
    BuildSemanticDiffReportDataInput & {
      options?: Pick<CompareSemanticDiffOptions, "scheduleComparisonPeriod">;
    };
  ```

  `BuildSemanticDiffReportDataInput` remains unchanged with its existing
  `beforeContent` and `afterContent` source texts. The separate calendar-owned
  type reuses the upstream `SemanticDiffComparisonPeriod` through the exact
  `CompareSemanticDiffOptions` field rather than redefining its shape.
  The adapter parses before and after exactly once, invokes comparison and
  the pure builder once, and returns the existing parser-error union or
  successful artifacts. When a period is supplied, it forwards that same
  value unchanged as `CompareSemanticDiffInput.options.scheduleComparisonPeriod`;
  when no period is supplied, it omits `CompareSemanticDiffInput.options`
  entirely rather than supplying a default, empty object, or `period` alias.
  A no-period call therefore yields `not-requested` facts; a valid-period call
  yields `evaluated` facts, including empty projections. An invalid supplied
  period remains an upstream `invalid` outcome with its exact period and
  issues; the adapter does not reinterpret it or convert it into a parser
  error. Period selection and validation UI remain workflow-owned.
  It does not widen or replace `context`, `result`, `summary`,
  report DTOs, or JSON version 1, and no presentation component may
  recalculate the sidecar.

- Only a successful completed comparison with
  `scheduleImpact.kind === "available"` may be registered in the
  bootstrap-owned, host-private `ScheduleImpactSidecarRegistry` by exact
  context object identity. Its API is `register(context, sidecar)`,
  `resolve(context)`, and `release(context)`. Explorer session creation
  resolves using the same immutable context object; the registry is not a
  public transport, report, or UI dependency. Comparison failure,
  cancellation, not-requested facts, and invalid facts never call `register`.
- The compare-success block of
  `src/presentation/vscode/commands/semanticDiffCommand.ts` invokes the
  injected `createBuildSemanticDiffPresentationArtifacts` adapter exactly once.
  Bootstrap wires the adapter and the calendar-owned
  `createScheduleAwareExplorerSession` companion through
  `src/bootstrap/extension/semanticDiffWiring.ts` and
  `src/bootstrap/extension/extensionDependencies.ts`. The companion always
  calls `OpenSemanticDiffExplorer(context)` exactly once. For available impact
  its atomic sequence is register(context, sidecar) → Explorer open → subscribe
  the returned panel's `onDidDispose` to parent release; for unavailable impact
  it skips registration/action and still creates the normal Explorer parent
  handle. Creation failure or cancellation rolls back available registration
  before returning the existing error; child close does not release the parent
  sidecar. No hook addition to the Explorer predecessor is required.
- An available sidecar contains the exact period, roots, candidate groups,
  timeline items, and issues. An invalid requested period contains its exact
  period, stable reason code, and structured detail. A period that was not
  requested exposes no sidecar or calendar action. A valid period remains
  available when all collections are empty.
- Root correspondence is evaluated with a closed matrix. A pair is created
  only when both counterpart units satisfy
  `unit.unitType === "n" && unit.isRootJobnet === true`; exact and one-to-one
  fingerprint matches use `matchKind` `exact` or `fingerprint` and retain both
  real side paths. A before-root to after-non-root correspondence is a
  one-sided `removed-root-scope` entry, and a before-non-root to after-root
  correspondence is a one-sided `added-root-scope` entry. When neither side
  is a root, the correspondence is excluded. Root rename/move remains a
  two-sided root pair. Ordinary added and removed root sets remain one-sided
  `added`/`removed` entries with no fabricated counterpart. Ambiguous root
  candidates remain separate candidate groups. One-sided scope-transition
  entries retain the counterpart path and `identityDecisionId` only in
  `scopeTransition` metadata; they never create a cross-side run pair.
- Ambiguous fingerprint candidates remain separate before/after candidate
  groups with their real unit IDs, names, and paths. They are never matched,
  diffed, folded into added/removed roots, or included in root, run, issue, or
  timeline counts.
- Every present root side carries the upstream-owned outcome, complete
  supported runs, and issue references. `partial` means supported runs plus
  explicit issues; `uncalculated` means no supported runs and explicit
  unresolved issues. Empty runs alone never imply `valid-no-runs`.
- A one-sided scope-transition root carries
  `scopeTransition: { kind: "removed-root-scope" | "added-root-scope";
counterpartPath: string; identityDecisionId: string }`. Ordinary added or
  removed roots and two-sided root pairs carry no scope-transition metadata.
  The metadata is descriptive only and is not used to pair runs across sides.

### Stable IDs, Foreign References, And Duplicate Pairing

- All sidecar record IDs use one collision-free length-prefixed encoder. Each
  component is encoded as its decimal UTF-8 byte length, `:`, then the exact
  UTF-8 value; components are concatenated without an external delimiter and
  are never normalized, localized, or truncated. The zero-based occurrence
  ordinal is a finite non-negative base-10 integer.
- Root IDs encode match kind, pair/side ownership, canonical path, and ordinal.
  Candidate-group IDs use their own kind and canonical candidate path. Run,
  issue, and timeline IDs include their record kind, side, owning root ID,
  applicable date/time/rule facts, and occurrence ordinal. These sidecar IDs
  are distinct namespaces and cannot substitute for an upstream source-change
  reference.
- `sourceChangeRef` is
  `{ id: string; occurrenceOrdinal: number } | null` and is `null` only for
  unchanged runs. Its `id` and `occurrenceOrdinal` resolve as an exact
  composite key to one element of the stable
  `context.result.scheduleComparison.runChanges` array: the ordinal is the
  zero-based occurrence among entries having the same `id`. Cross-root,
  missing, out-of-range, and sidecar-ID references are invalid. There is no
  blanket duplicate-reference rejection. A source-change reference may be
  shared only within one sidecar effect ID: an added/removed effect may share
  it between its one side's run and the same effect's timeline item, while a
  changed-time effect may share it between its before run, after run, and the
  same effect's timeline item. Reuse across different sidecar effect IDs is
  invalid. Fixtures cover both allowed sharing forms and cross-effect
  rejection.
- Issue IDs include a collision-free target key in addition to issue kind,
  side, root, reason code, and occurrence ordinal. The target key contains
  `targetKind`, exact `targetId` or target path, and `parameterKey` or an
  explicit `null` token. Each component is length-prefixed; target ID/path and
  parameter key are never flattened into an ambiguous string. Fixtures cover
  target-kind, target-ID/path, and null-versus-present parameter collisions.
- Duplicate runs are retained by grouping the captured side arrays by root,
  side, date, and rule; sorting by exact time and stable source facts; and
  assigning consecutive zero-based occurrence ordinals. Before and after
  records pair by date, rule, and occurrence ordinal: equal times are
  unchanged, differing times are changed-time, and unmatched records are
  added or removed. Duplicate issues use the same stable occurrence principle
  and are never silently merged.
- Identity, pairing, period membership, and ordering are locale- and
  timezone-independent. They must not use `localeCompare`, host/browser time,
  JavaScript `Date` conversion, current time, or localized strings.

### Root Outcomes And Presentation Sections

- Supported runs appear only in the canonical date-grouped timeline. A
  partial root shows those runs in the timeline and its explicit issues in an
  `Uncalculated schedule portions` section. An uncalculated root shows issues
  without fabricated runs; a valid-no-runs root appears in a distinct `Valid
no runs` section; a null side is announced as absent rather than as an
  outcome.
- Issue kinds remain explicit structured values (`invalid`,
  `missing-context`, `unsupported`, or `uncalculated`) and are not inferred
  from run state. Global and visible totals remain distinct for empty,
  filter-no-match, candidate-only, zero-only, partial, uncalculated-only, and
  mixed results.

### Host-Private Session, Transport, And Display Language

- The bootstrap-owned `ScheduleImpactSidecarRegistry` stores the immutable
  sidecar against the exact `SemanticDiffOutputContext` object. The
  calendar-owned bootstrap companion
  `createScheduleAwareExplorerSession` owns the atomic lifecycle. It invokes
  the existing injected `OpenSemanticDiffExplorer(context)` exactly once for
  both available and unavailable impact and receives the concrete
  `SemanticDiffExplorerSessionHandle` `{ sessionId: string, panel: WebviewPanel,
dispose(): void }`. For available impact it registers the context/sidecar and
  exposes the calendar action; for unavailable impact it skips registration
  and keeps the action hidden. Both paths retain the normal parent `dispose()`
  lifecycle; it subscribes `panel.onDidDispose` to parent disposal through one
  composite Disposable. If Explorer creation fails
  or is cancelled, the companion rolls back any available registration and all
  partial resources before returning the existing error.
  Closing a child calendar panel/session destroys only the child registry
  entry, epoch, and action handles; it retains the registered sidecar/context
  while the parent is alive. Reopening therefore resolves the same immutable
  pair without recalculating comparison or schedule facts. Late child work
  after close is ignored, and only parent disposal releases the sidecar
  registry entry.
- The Explorer host registry creates a distinct child calendar session from
  the resolved sidecar. One open calendar panel maps to one child identity;
  repeated invocation reveals it. Child disposal permits a new identity,
  parent disposal cascades to every child, and late work from an old epoch
  cannot mutate, resurrect, or clear a newer session.
- Calendar transport is a closed union separate from Explorer transport.
  Ready and refresh requests carry only the calendar session and monotonically
  increasing finite positive request ID. Session, failure, and close responses
  use strict success/payload/error nullability. Unknown message types,
  extra/missing keys, wrong sessions, stale or non-finite IDs, and conflicting
  nullable fields fail before state mutation.
- The calendar session inherits the Explorer session's immutable normalized
  `displayLanguage`. `ja` and `ja-*` normalize to `ja`; `en` and `en-*`
  normalize to `en`; every other value falls back to `en`. Requests, browser
  locale, and host callbacks cannot override it.
- Calendar-specific English and Japanese resources localize labels, badges,
  issue explanations, announcements, and errors only. Paths, dates,
  wall-clock strings, IDs, reason codes, and structured detail remain exact
  unlocalized values. Language selection must not affect facts, membership,
  ordering, IDs, filtering, or desktop/web parity.

## Architecture

- Domain: unchanged. Schedule meaning, effective-rule resolution, run
  projection, valid no-run classification, and projection comparison remain in
  the schedule-semantics owner.
- Application: the calendar-owned internal
  `compareSemanticDiffWithArtifacts(input: CompareSemanticDiffInput)` accepts
  parsed documents; the command-facing adapter owns the existing
  BuildSemanticDiff source-text/parser-error boundary. It invokes identity
  comparison and schedule evaluation exactly once each, and
  returns `{ result, scheduleProjectionFacts }`. The
  `ScheduleProjectionFacts` union is `not-requested` without a period,
  `invalid` with `{ period, issues }`, or `evaluated` with `{ period, before:
{ rootProjections, statuses, issues }, after: { rootProjections, statuses,
issues }, correspondence }`. The existing `compareSemanticDiff(input)`
  public contract returns `.result` and remains unchanged.
  `buildSemanticDiffPresentationArtifactsFromComparison({ result,
scheduleProjectionFacts })` calls `buildSemanticDiffOutputContext(result)`
  exactly once and returns `{ context, scheduleImpact }`; it performs no
  comparison or schedule evaluation itself. The immutable context remains
  `{ result, summary }`, and neither wrapper changes upstream IDs, sides,
  status/reason codes, reports, or JSON version 1.
- Presentation: own the dedicated read-only panel, localization, date grouping,
  timeline/calendar projection, filtering, focus, keyboard behavior,
  accessibility, virtualization, child-session lifecycle, and the VS Code
  child registry/closed calendar transport. The bootstrap layer owns the
  host-private `ScheduleImpactSidecarRegistry` and the calendar-owned
  `createScheduleAwareExplorerSession` companion that invokes the existing
  `OpenSemanticDiffExplorer` dependency exactly once with the same context for
  both available and unavailable impact. The webview consumes only the
  validated plain calendar payload.
- Infrastructure: none expected. The view consumes the retained comparison
  session and must not load JP1/AJS calendars, files, Git state, execution
  history, locale calendars, or network data.
- Bootstrap: wire the injected
  `createBuildSemanticDiffPresentationArtifacts(parser, compareWithArtifacts,
builder)` adapter and the calendar-owned
  `createScheduleAwareExplorerSession` companion in `semanticDiffWiring.ts`
  and `extensionDependencies.ts`. The companion invokes
  `OpenSemanticDiffExplorer(context)` exactly once for both impact states;
  available impact owns register → Explorer open → calendar action, while
  unavailable impact skips registration/action. Both paths return the concrete
  `SemanticDiffExplorerSessionHandle` and parent composite `onDidDispose`
  release, with atomic rollback on creation failure/cancel and no sidecar
  release on child close. It must not add a hook to or widen the
  Explorer public message union, change `{ result, summary }`, or construct
  schedule meaning.

### Exposure Boundary

- The internal session/transport foundation remains unreachable from the
  Explorer UI while it is delivered and validated on its own. It must not add
  a command, menu, activation event, custom editor, or other public entry
  point.
- The later user-visible delivery is the first boundary that may expose the
  additive `Schedule impact` Explorer action and the localized timeline, and
  it depends on the completion-committed
  `semantic-diff-comparison-workflow` plus a period-bearing context. Until
  both are available, the action is hidden or disabled and the documented
  calendar view is temporarily unreachable. This action remains host-private
  integration, not a new Explorer transport message or package contribution.
- `TASKS.md` owns the corresponding Slice 2 internal and Slice 3 public
  sequencing and approval paths; this specification owns the invariant that
  no public action exists before the visible presentation is complete.

## Impact Analysis

### Dependency Impact

- The current application DTO exposes the comparison period and only schedule
  run changes; the approved schedule-semantics plan deliberately keeps richer
  supported/no-run/uncalculated distinctions internal while preserving existing
  outputs. The calendar-owned
  `compareSemanticDiffWithArtifacts(input)` internal contract captures those
  facts once as `{ result, scheduleProjectionFacts }`, while the existing
  `compareSemanticDiff(input)` continues to expose only `.result`.
  `buildSemanticDiffPresentationArtifactsFromComparison({ result,
scheduleProjectionFacts })` then creates the immutable context and
  `scheduleImpact` union from that captured pair. It calls
  `buildSemanticDiffOutputContext(result)` exactly once. Presentation must not
  reconstruct facts from change rows or confirmation prose.
- The structured-output result and reusable summary remain the owners of
  neutral comparison facts used by reports, JSON, and Explorer. Calendar data
  may reference the same stable record IDs and reason codes but must not modify
  JSON version 1, the four report modes, their summary counts, or localization
  policy.
- The Explorer retains its hierarchy, source/Flow actions, immutable session,
  and public message lifecycle. Bootstrap wires the injected command adapter
  and the calendar-owned `createScheduleAwareExplorerSession` companion. The
  companion invokes `OpenSemanticDiffExplorer(context)` exactly once for both
  available and unavailable impact and receives the concrete session handle.
  Available impact is atomically registered and exposes the calendar action;
  unavailable impact is not registered and keeps the action hidden. The
  companion then attaches parent composite `onDidDispose` release; a creation
  failure or cancellation rolls back available registration and disposes
  normal or partial Explorer resources. No Explorer
  predecessor hook is added. Neither the sidecar nor the registry API crosses
  the Explorer wire. It must not rebuild the Explorer tree, Flow overlay,
  source lookup, or report dispatcher.
- The command-facing adapter parses before and after source text exactly once,
  invokes the internal comparison and pure builder once, and is itself invoked
  exactly once by the calendar flow's compare-success block. Its additive
  optional period input forwards the same `scheduleComparisonPeriod` value
  into `CompareSemanticDiffInput.options`, or omits `options` when no period
  is supplied. Existing source-text-only callers remain valid. Failure and
  cancellation return the existing parser-error union and never register;
  not-requested/invalid facts return unavailable impact without registry/action.
  This call graph prevents a second comparison or schedule evaluation while
  preserving the predecessor's public contracts.
- Propagation decision: add only the data projection and presentation needed to
  review schedule impact. Keep comparison-source/period collection, schedule
  calculation, risk policy, structured outputs, Flow rendering, and source
  navigation unchanged.

### Overlap Decision

- `schedule-semantics-expansion` owns interpretation, projection, comparison,
  zero-run classification, and source-backed support expansion. This feature
  displays those results and does not reimplement them.
- `semantic-diff-structured-outputs` owns neutral comparison facts, stable
  reason codes, summary aggregation, report modes, JSON schema, and the
  immutable `{ result, summary }` context. This feature owns only the
  `buildSemanticDiffPresentationArtifactsFromComparison` pure builder, its
  additive calendar-specific sidecar, the command-facing adapter, and
  presentation.
- `semantic-diff-explorer` owns the general change tree and Flow/source/report
  interactions. This feature adds a schedule-specific destination from the
  retained comparison session without duplicating Explorer or Flow.
- `semantic-diff-comparison-workflow` owns file/Git comparison sources,
  comparison naming, period input, and default viewer handoff. This feature
  accepts an already completed comparison and selected period. The public
  calendar action remains unavailable until that feature's completion commit
  supplies a period-bearing context. The Wave 4 roadmap entry records that
  public-delivery dependency; the internal artifact/session foundation is
  available before the workflow and does not depend on public presentation.
- These responsibilities are complementary and serve the single purpose of
  reviewing schedule impact. No feature split is required.

### Breaking Change Analysis

- User-visible behavior: adds a read-only schedule review surface. Existing
  Semantic Diff meaning, Explorer, Markdown/JSON outputs, clipboard behavior,
  and Flow Viewer behavior remain unchanged.
- API/DTO/schema compatibility: an additive internal application artifact
  contract and sidecar are expected. Existing Semantic Diff DTO fields,
  immutable `{ result, summary }` context, `scheduleComparison.runChanges`
  entries, and JSON version 1 must remain compatible. The existing
  `compareSemanticDiff(input)` public contract remains a `.result` wrapper;
  `compareSemanticDiffWithArtifacts` and
  `buildSemanticDiffPresentationArtifactsFromComparison` are calendar-owned
  internal contracts; `createBuildSemanticDiffPresentationArtifacts` is the
  command-facing adapter accepting the separate calendar-owned
  `BuildSemanticDiffPresentationArtifactsInput`; the existing
  `BuildSemanticDiffReportDataInput` type remains unchanged. The command
  receives that adapter as an injected
  dependency in Slice 2, while `createScheduleAwareExplorerSession` owns the
  Explorer handoff; no predecessor hook is added. Widening or reordering a
  predecessor contract, changing run-change IDs/occurrences, or changing
  reason/status meaning requires Replanning with that owner.
- VS Code/web extension compatibility: the same plain transport and UI behavior
  must work on VS Code `^1.75.0` desktop and web without Node built-ins,
  filesystem assumptions, host timezone, or locale-dependent ordering.
- Changed scenarios: add schedule-impact presentation, valid zero-run versus
  uncalculated, host parity, accessibility, and large-result scenarios when the
  feature is implemented. Existing calculation and Markdown scenarios do not
  change during intake.

### Alternative Considerations

- Extend the Markdown schedule section only: rejected because it does not
  support period exploration, filtering, dense run inspection, or accessible
  interactive review.
- Calculate schedules again inside the webview: rejected because it would
  duplicate the schedule-semantics owner and risk desktop/web divergence.
- Infer all runs from the added/removed/changed-time list: rejected because
  unchanged supported runs and side-specific valid zero-run status cannot be
  recovered safely from changes alone.
- Use the host timezone or a JavaScript `Date` instant as schedule truth:
  rejected because upstream runs are JP1/AJS wall-clock facts and the same
  input must render identically on desktop and web.

### Approval Impact Decisions

- Approval evidence owner: `TASKS.md` according to the lifecycle gate.
- Scope changes requiring re-approval: new schedule interpretation or risk
  rules; comparison-source/period input; structured JSON/report schema change;
  changing the immutable `{ result, summary }` context or the predecessor
  `scheduleComparison.runChanges` ID/order contract; changing the
  `compareSemanticDiffWithArtifacts` parsed-document input or facts union;
  changing the `buildSemanticDiffPresentationArtifactsFromComparison` input,
  `buildSemanticDiffOutputContext(result)` exactly-once rule, or the
  `createBuildSemanticDiffPresentationArtifacts` parser/error/success contract
  or exactly-once command invocation;
  changing the bootstrap-owned sidecar registry or
  `createScheduleAwareExplorerSession` ownership/API/lifecycle; changing
  scope-transition correspondence meaning; removing the
  `semantic-diff-comparison-workflow` completion/period-bearing dependency;
  Explorer public-message or package-contribution change; Flow/source
  navigation redesign; definition editing; runtime execution history; external
  calendar acquisition; host-timezone conversion; review decision persistence;
  public exposure before the complete visible presentation; or a desktop-only
  implementation.

## Compatibility

- VS Code compatibility follows `package.json` `engines.vscode` (`^1.75.0`);
  no newer API may be assumed.
- Web extension compatibility: application data and webview transport remain
  browser-safe. Identical inputs produce identical dates, order, states, and
  fact identity regardless of the browser or host timezone. Only the inherited
  normalized `displayLanguage` selects English or Japanese wording.
- Desktop extension compatibility: use host adapters without introducing
  filesystem, process, or desktop-only behavior into shared code.
- JP1/AJS compatibility: JP1/AJS3 version 13 is the inherited normative basis.
  The UI must preserve upstream support boundaries and cannot claim an external
  execution will or will not occur.
- Accessibility compatibility: existing Explorer and Flow keyboard/focus
  behavior must remain unchanged when the calendar is closed or unavailable.

## Acceptance Criteria

- One completed comparison with a valid selected period can open one dedicated
  read-only schedule-impact view without rerunning comparison or schedule
  projection. The internal `compareSemanticDiffWithArtifacts(input)` contract
  performs identity comparison and schedule evaluation once each, returns
  `{ result, scheduleProjectionFacts }`, and leaves the existing
  `compareSemanticDiff(input)` public `.result` contract unchanged. The pure
  `buildSemanticDiffPresentationArtifactsFromComparison({ result,
scheduleProjectionFacts })` calls `buildSemanticDiffOutputContext(result)`
  exactly once and returns `{ context, scheduleImpact }` without
  re-evaluation. `scheduleImpact` is unavailable for `not-requested` and
  `invalid` facts, including the invalid period in the unchanged `result`, and
  available only for evaluated facts.
- The view displays the selected half-open period, supported before/after run
  lists, and every added, removed, and changed-time fact with stable identity
  and deterministic ordering. Duplicate equal runs, issues, and changed-time
  effects remain separate. Every issue ID includes collision-free
  `targetKind`, exact target ID/path, and `parameterKey` or explicit `null` in
  its encoded key. Every non-null `sourceChangeRef` resolves by the
  exact `(id, occurrenceOrdinal)` composite to the stable upstream
  `scheduleComparison.runChanges` array. An added/removed effect may share its
  reference between its one side's run and the same effect timeline item; a
  changed-time effect may share it between its before run, after run, and the
  same effect timeline item. Reuse between different sidecar effect IDs is
  rejected, with fixtures for both allowed forms and cross-effect rejection.
- The root correspondence matrix includes only both-root exact/fingerprint
  pairs, one-sided `removed-root-scope` and `added-root-scope` transitions for
  root/non-root changes, and excludes non-root/non-root correspondences. Root
  rename/move remains a pair; ambiguous candidates remain separate. Real
  counterpart paths and `identityDecisionId` are `scopeTransition` metadata,
  not cross-side run pairings. Ambiguous candidates never affect root, run,
  issue, or timeline totals.
- Explicit valid no-run root jobnets are distinguishable from unsupported,
  invalid, missing-context, partial, and otherwise uncalculated results for the
  applicable side and period. Partial roots show their supported runs in the
  timeline and their issues in the uncalculated section.
- Unsupported 48-hour/calendar and every other upstream uncalculated reason
  remain visible with side, target, code, and available structured detail; no
  absent fact is silently treated as a zero run.
- Date-grouped timeline review, separate root-outcome and run-state filtering,
  root selection, focus recovery, status announcements, high contrast, zoom,
  and keyboard-only operation work on desktop and web without changing global
  counts or facts.
- One Explorer parent owns distinct child calendar identities. Reveal, refresh,
  close, reopen, parent disposal, stale requests, and old-epoch late work
  preserve the specified session without leaking the sidecar through the
  Explorer transport. Only parent Explorer session disposal calls
  `release(context)`; child close discards the child registry entry, epoch, and
  action handles while retaining the sidecar/context for parent-alive reopen.
- The calendar compare-success block calls the injected
  `createBuildSemanticDiffPresentationArtifacts(parser, compareWithArtifacts,
builder)` adapter exactly once. Source-text-only, valid-period, and
  invalid-period fixtures verify that the adapter omits `options` when no
  period is supplied or forwards the exact supplied value under
  `options.scheduleComparisonPeriod` without a `period` alias. They produce
  `not-requested`, `evaluated`, and unchanged `invalid` facts respectively,
  including evaluated empty projections. The adapter parses each source text once,
  returns the existing parser-error union on failure/cancellation, and returns
  successful `{ context, scheduleImpact }` artifacts otherwise. The
  calendar-owned `createScheduleAwareExplorerSession` companion invokes
  `OpenSemanticDiffExplorer(context)` exactly once for both available and
  unavailable results and returns the normal Explorer parent handle. Only
  `scheduleImpact.kind === "available"` registers a sidecar and exposes a
  calendar action; an unavailable `not-requested` or `invalid` result leaves
  the registry untouched and the action hidden. Creation
  failure/cancellation rolls back available registration and disposes normal
  or partial Explorer resources; child close does not release the sidecar. No
  Explorer predecessor hook is added, and no comparison or schedule evaluation
  is repeated.
- The public `Schedule impact` action is hidden or disabled when the context
  has no period, and remains temporarily unreachable until the
  completion-committed `semantic-diff-comparison-workflow` supplies the
  period-bearing context. It becomes enabled only after that dependency is
  available.
- English and Japanese labels use the immutable parent language, unknown
  locales fall back to English, and language never changes dates, order,
  filters, IDs, or facts.
- Empty, no-change, zero-run-only, uncalculated-only, mixed, malformed/stale
  session, oversized-message, and representative large-period/run-set cases
  have explicit, accessible outcomes and do not leave partial panel state.
- Existing Semantic Diff reports, JSON, Explorer, Flow highlighting, source
  navigation, copy behavior, calculation results, and normal non-diff views
  remain regression-compatible.
- Focused application projection, transport validation, presentation,
  accessibility, desktop/web, lifecycle, and large-result tests pass with the
  repository quality checks.

## Durable Documentation Impact

- Add `docs/requirements/use-cases/uc-present-schedule-impact.md` and index it
  in `docs/requirements/use-cases/README.md` when the public action and view
  make the behavior observable. The use case owns the durable trigger, inputs,
  outputs, rules, and observable scenarios; schedule calculation rules remain
  in the existing build-diff and parameter-rule owners.
- Update `README.md` and evaluate `CHANGELOG.md` when the user-facing view is
  delivered.
- Update `docs/specs/architecture.md` only if Planning approves a reusable
  application/presentation boundary not already covered by current policy.
- `docs/specs/roadmap.md` records this Wave 4 public presentation item and its
  dependency on the completed period-bearing comparison workflow and Explorer
  handoff. Internal artifact/session support precedes that workflow; public
  calendar presentation follows it. `TASKS.md` owns the slice-level sequence.

## Non-Goals

- Implementing or extending schedule interpretation, projection, comparison,
  valid no-run classification, review-risk rules, or JP1/AJS parameter rules.
- Selecting files or Git HEAD, naming a comparison, requesting/validating the
  comparison period, or choosing the default post-comparison destination.
- Changing summary/full/audit/JSON output contracts, JSON version 1, Markdown
  wording, existing report localization policy, or clipboard behavior.
- Reimplementing the Explorer hierarchy, Flow graph, diff overlays, source
  navigation, public transport union, or their matching/focus logic.
- Editing definitions, accepting/dismissing review findings, persisting review
  state, querying execution history, or asserting external runtime outcomes.
- Adding WebAPI comparison, external holiday/calendar services, timezone
  conversion, or support for a new JP1/AJS version.
- Adding a visual month/week grid, new command/menu/activation/custom-editor
  contribution, package compatibility-floor change, new telemetry event, or
  public action before the localized accessible timeline is delivered.

## Open Questions

- None.
