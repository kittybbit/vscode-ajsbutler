# Feature Tasks: Schedule Impact Calendar

## Agent Brief

- Purpose: present one completed Semantic Diff comparison's supported schedule
  runs and explicit schedule outcomes as an accessible, read-only,
  date-grouped timeline.
- Mode: Completion Approval recorded for Slice 1 after approved third targeted
  replan commit `11615026`; the focused completion commit is eligible and
  pending. Runtime and focused test changes remain limited to the approved
  Slice 1 paths.
- Approved or active slice: Slice 1 (the immutable schedule-impact sidecar)
  is implementation-complete, independently reviewed `Ready` with no
  Findings, and Completion Approved. The previous implementation and approved
  first and second-Replanning deltas are preserved. The latest implementation
  review found no remaining Findings; the third targeted delta received final
  independent `plan-reviewer` `Ready` review with no Findings and Main's
  automatic Human Approval; its focused plan/replan commit `11615026` is
  complete. Slice 2 is not active and public Slice 3 remains out of scope.
- Do not recalculate schedules, infer outcomes from empty arrays, merge
  ambiguous identity candidates, change the Explorer contract, or change
  `SemanticDiffResult`, the immutable `{ result, summary }`
  `SemanticDiffOutputContext`, the public `compareSemanticDiff(input)` result
  contract, JSON version 1, report modes, or existing Flow/source behavior.
- Read first: `SPECS.md`, this file, `TRACEABILITY.md`, and the reviewed
  `schedule-semantics-expansion`, `semantic-diff-structured-outputs`, and
  `semantic-diff-explorer` plans.
- Validate the revised planning documents with `rtk pnpm run lint:md` and
  `git diff --check`; record third-delta implementation results only after
  its exact approved paths are implemented and rerun.

## Current Plan Basis

- This was the third targeted Replanning Mode revision for Slice 1 after the
  latest implementation-review Findings. The feature contract and rationale
  remain in `SPECS.md`; this file owns the executable slice plan and current
  gate state. The earlier replan approval commit `6622953f` and the second
  replan approval commit `ebf8bf3d` remain historical and their implementation
  changes are preserved; this third delta is authorized by focused commit
  `11615026` and remains uncommitted pending independent review.
- The prior Findings remain remediated and preserved: carried status is
  reason-scoped; before and after valid-no-runs metadata is retained in one
  evaluation; duplicate/count-mismatch effects have strict reference rules;
  candidate-root issues are excluded; issue ordinals group by `issueKind`;
  the missing-context fixture is genuine; root-scope one-sided effects use
  upstream references; and validation text is evidence-based. The new local
  Findings are that the real `semanticDiffScheduleDiffer` currently emits
  duplicate/count-mismatch rows as added/removed, so sidecar references cannot
  be proven against the actual upstream output; sidecar pairing groups only by
  date/rule and can cross-pair nested source units; focused expected detail,
  timeline, and rule order needs to follow the approved deterministic
  comparators; prior validation claims were reset to historical evidence and
  are superseded by the current rerun evidence below.
- The required revision remains an evaluation-only predecessor carrier,
  internal differ, and application sidecar projection change, plus one narrow
  normative documentation clarification. No new schedule meaning, public
  surface, Slice 2/3 work, or UI is introduced. The third replan includes the
  prepared and validated `SPECS.md` clarification for source-unit-aware
  duplicate pairing; it requires no result/report/JSON schema change.
- The plan remains three slices: pure comparison artifacts and sidecar
  projection; internal command/bootstrap session and transport foundation;
  then the public accessible timeline and documentation.
- Current boundaries remain: one identity pass and one schedule evaluation,
  immutable `{ result, summary }` context, host-private sidecar, no Explorer
  transport change, and no schedule recalculation or candidate merging.
- Public calendar exposure remains gated by the completion-committed
  `semantic-diff-comparison-workflow` and a period-bearing context. No slice is
  complete on this branch; the approved internal Slice 1 is the active
  implementation slice and public Slice 3 remains unreachable.
- The original independent plan review, first replan review, and second
  replan review are complete with `Ready` verdicts and no Findings. The third
  package has final independent `plan-reviewer` `Ready` review with no
  Findings and Main's automatic Human Approval. Its focused plan/replan commit
  `11615026` is complete; implementation review is `Ready` with no Findings,
  Completion Approval is recorded below, and the focused completion commit is
  pending.

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- This file is the sole plan and current-state owner for this feature. Other
  feature folders inherited from the base branch remain outside this feature's
  scope.
- `docs/specs/roadmap.md` now records the calendar as a Wave 4 item and its
  public entry condition as the completion-committed
  `semantic-diff-comparison-workflow` plus a period-bearing context. The
  dependency chain remains internal Calendar Slices 1–2 → workflow → public
  Calendar Slice 3.
- Keep this file focused on implementation slices, approval, validation, risk,
  production readiness, and Feature Exit readiness.

## Plan Status

- Status: Slice 1 implementation is complete under approved third-replan
  commit `11615026`; independent implementation review is `Ready` with no
  Findings, Completion Approval is recorded, and the focused completion commit
  is pending.
- Planning scope: the internal application comparison-artifact contract and
  immutable sidecar projection, exact root and candidate correspondence,
  private calendar session transport, atomic Explorer handoff, accessible
  timeline, outcome/run filtering, localization, bounded rendering, workflow
  period-bearing action gating, validation, and durable user documentation.
- Review status: Original plan, first Replanning package, second Replanning
  package, and third targeted package are `Ready` with no Findings.
- Human approval: The reviewed three-slice package, original internal Slice 1
  boundary, first four-path status-carrier delta, second five-path Replanning
  delta, and third seven-path Replanning delta are approved. The focused
  plan/replan commit `11615026` is complete; implementation review is `Ready`
  with no Findings, Completion Approval is recorded, and the focused
  completion commit remains pending.
- Active implementation slice: Slice 1.
- Slice order: Slice 1, Slice 2, then Slice 3. Each slice requires its own
  implementation review, Completion Approval, and focused commit after the
  plan gate.

## Human Approval

- Status: Approved for the original Slice 1 boundary, the independently
  reviewed first and second Replanning deltas, and the independently reviewed
  third targeted Replanning delta.
- Approved at: 2026-09-10; approved in current conversation
- Basis: independent `plan-reviewer` final verdict `Ready`; Findings none; the
  user's automatic no-findings slice-level approval instruction.
- Approved scope: the application-only internal Slice 1 implementation:
  `compareSemanticDiffWithArtifacts`, `semanticDiffScheduleImpact`,
  `buildSemanticDiffPresentationArtifactsFromComparison`, and the named pure
  application tests, plus the evaluation-only predecessor status carrier and
  sidecar status-consumption Replanning delta. No command, bootstrap, Explorer,
  UI, or public action.
- Approved paths:
  - `src/application/semantic-diff/compareSemanticDiff.ts`
  - `src/application/semantic-diff/compareScheduleDiff.ts`
  - `src/application/semantic-diff/compareSemanticDiffWithArtifacts.ts`
  - `src/application/semantic-diff/semanticDiffScheduleImpact.ts`
  - `src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts`
  - `src/application/semantic-diff/buildSemanticDiffOutputContext.ts`
  - `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`
  - `src/test/suite/semanticDiffPresentationArtifacts.test.ts`
  - `src/test/suite/semanticDiffScheduleImpact.test.ts`
  - `src/test/suite/compareSemanticDiff.test.ts`
  - `src/test/suite/semanticDiffSchedule.test.ts`
  - `src/test/suite/semanticDiffContracts.test.ts`
- Newly approved Replanning delta paths:

  - `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`
  - `src/application/semantic-diff/semanticDiffScheduleImpact.ts`
  - `src/test/suite/semanticDiffScheduleRules.test.ts`
  - `src/test/suite/semanticDiffScheduleImpact.test.ts`
  - `src/test/suite/semanticDiffScheduleCalendar.test.ts`

- Third targeted Replanning delta paths (independently reviewed, Human
  Approved, and committed in focused plan/replan commit `11615026`):
  - `src/domain/services/semantic-diff/semanticDiffScheduleDiffer.ts`: add a
    minimal internal run-differ contract that groups by canonical source-unit
    path, date, and rule; uses stable source facts as tie-breaks; pairs
    duplicate occurrences deterministically; and emits one changed-time fact
    per paired time difference plus only unmatched added/removed extras without
    changing the public `runChanges` DTO.
  - `src/application/semantic-diff/semanticDiffScheduleImpact.ts`: pair
    sidecar runs only within a complete source-unit identity/date/rule key,
    preserve deterministic duplicate ordinals, and resolve references against
    the real upstream rows without cross-pairing nested units.
  - `src/test/suite/semanticDiffScheduleRules.test.ts`: cover the real differ
    contract for duplicate equal runs, count mismatches, changed-time pairing,
    rule grouping, and deterministic decision order.
  - `src/test/suite/semanticDiffScheduleImpact.test.ts`: cover nested source
    unit isolation, duplicate sidecar pairing, deterministic timeline/rule
    order, and exact references for upstream added/removed/changed-time rows.
  - `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`: add
    end-to-end parsed-document coverage proving the actual differ output feeds
    the sidecar for duplicate/count-mismatch effects while public result,
    report, and JSON boundaries remain unchanged.
  - `src/test/suite/semanticDiffScheduleCalendar.test.ts`: correct only the
    focused detail/run/rule expectations to the approved deterministic order;
    retain the existing calendar semantics and no public-contract change.
  - `docs/specs/features/schedule-impact-calendar/SPECS.md`: the prepared
    normative duplicate-pairing clarification includes source-unit identity
    plus date/rule, preserves root/side semantics and deterministic duplicate
    handling, and leaves public result/report/JSON contracts unchanged. The
    authorized feature-author has prepared and validated this clarification.

The second-Replanning approval covers the same-pass before/after valid-no-runs
carrier, reason-scoped status consumption, duplicate/count-mismatch
source-reference handling, candidate-root issue exclusion, issue-kind
occurrence grouping, root-scope/upstream reference reconciliation, and the
corrected fixture and validation evidence. Main's automatic Human Approval
also covers the independently reviewed third targeted delta above.

This approval authorizes implementation within the listed original Slice 1
boundary and all listed Replanning delta paths, including the independently
reviewed third targeted paths above. The focused plan/replan commit
`11615026` is complete. Independent implementation review is `Ready` with no
Findings and Completion Approval is recorded above; the focused completion
commit remains pending.

## Completion Approval

- Status: Approved
- Approved at: 2026-09-10; approved in current conversation
- Basis: independent `implementation-reviewer` verdict `Ready`; Findings none;
  the user's automatic no-findings slice-level approval instruction.
- Approved scope: the completed Slice 1 immutable schedule-impact sidecar,
  including its one-pass comparison-artifact contract, evaluation-only
  predecessor carriers, internal source-aware differ and sidecar pairing,
  exact upstream reference validation, pure artifact builder, focused tests,
  deterministic ordering, and current validation evidence. Slice 2 is not
  active and public Slice 3 remains out of scope.
- Approved paths:
  - `src/application/semantic-diff/compareScheduleDiff.ts`
  - `src/application/semantic-diff/compareSemanticDiff.ts`
  - `src/application/semantic-diff/compareSemanticDiffWithArtifacts.ts`
  - `src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts`
  - `src/application/semantic-diff/semanticDiffScheduleImpact.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleDiffer.ts`
  - `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`
  - `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`
  - `src/test/suite/semanticDiffPresentationArtifacts.test.ts`
  - `src/test/suite/semanticDiffScheduleImpact.test.ts`
  - `src/test/suite/semanticDiffScheduleCalendar.test.ts`
  - `src/test/suite/semanticDiffScheduleRules.test.ts`
- Implementation review verdict: `Ready`; Findings none. The review package
  covers the exact completed paths above, duplicate/count-mismatch pairing,
  source-unit isolation, root-scope/reference fail-closed behavior, status and
  no-run preservation, public run-change ordering compatibility, report/JSON
  and Explorer regressions, desktop/web checks, and quality evidence recorded
  in this task.
- Commit status: Eligible; focused Slice 1 completion commit pending through
  `approval-committer`.

## Closure Approval

- Status: Pending
- Approved at: none
- Approved scope: none
- Approved paths: none
- Feature Exit verdict: Pending
- Commit status: Not eligible

## Planning Inputs And Boundaries

- Selected feature: `schedule-impact-calendar`, the Wave 4 roadmap feature
  from proposal N-3.
- Purpose boundary: present existing schedule comparison facts for one
  selected period in one accessible, read-only, date-grouped timeline. This
  feature does not add JP1/AJS schedule meaning.
- Required predecessor: the completion-committed
  `schedule-semantics-expansion` contract owns schedule interpretation,
  supported run projection, completeness, valid no-runs, partial/unresolved
  outcomes, and schedule issue evidence.
- Required predecessor: the completion-committed
  `semantic-diff-structured-outputs` contract owns neutral comparison facts,
  stable reason/detail records, summary, report modes, and JSON version 1.
- Integration predecessor: the completion-committed
  `semantic-diff-explorer` contract owns the general Explorer session and
  action/message transport. This feature uses the existing Explorer session
  creation contract through a calendar-owned companion adapter, and adds one
  host-private schedule action and child panel without changing the Explorer
  predecessor or adding a new hook, message union member, or existing action.
- Required predecessor for the public action: the completion-committed
  `semantic-diff-comparison-workflow` contract supplies the period-bearing
  context and owns comparison sources, period input, and default viewer
  handoff. Slice 3 remains unreachable until this dependency is complete.
- Dependency gate: Slice 1 requires the schedule-semantics and
  structured-output completion commits; Slice 2 additionally requires the
  Explorer session creation contract; Slice 3 additionally requires the
  `semantic-diff-comparison-workflow` completion commit and a period-bearing
  context. If any predecessor changes the consumed contract, Main must route
  another Replanning before implementation.
- Compatibility boundary: preserve VS Code `^1.75.0`, browser-safe shared
  code, JP1/AJS3 v13 evidence limits, JSON version 1, existing reports,
  Explorer, Flow, source, copy behavior, and desktop/web parity.

## Design Decisions

### Sidecar Source, Root Correspondence, And Candidate Groups

- `SemanticDiffOutputContext` remains the immutable `{ result, summary }`
  object from the structured-output predecessor. The calendar-owned internal
  `compareSemanticDiffWithArtifacts(input: CompareSemanticDiffInput)` accepts
  parsed documents, invokes identity comparison and schedule evaluation exactly
  once each, and returns `{ result, scheduleProjectionFacts }`.
  `ScheduleProjectionFacts` is the union `not-requested` without a period,
  `invalid` with `{ period, issues }`, or `evaluated` with `{ period, before:
{ rootProjections, statuses, issues }, after: { rootProjections, statuses,
issues }, correspondence }`. The existing `compareSemanticDiff(input)` public
  contract remains unchanged by returning `.result`.
  `buildSemanticDiffPresentationArtifactsFromComparison({ result,
  scheduleProjectionFacts })` is a pure calendar artifact builder that calls
  `buildSemanticDiffOutputContext(result)` exactly once and returns
  `{ context, scheduleImpact }`; not-requested/invalid map to unavailable
  impact, while evaluated maps to available sidecar. The command adapter owns
  the source-text/parser-error union. The sidecar is not a field in
  `SemanticDiffResult`, `SemanticDiffOutputContext`, a report DTO, or JSON
  version 1, and no presentation code may recalculate it.
- Bootstrap owns a host-private `ScheduleImpactSidecarRegistry` with the exact
  API `register(context, sidecar)`, `resolve(context)`, and `release(context)`.
  Registration uses the immutable context object identity. A successful
  completed comparison may register; comparison failure or cancellation must
  not. Explorer session creation resolves with the same context object and
  never receives the sidecar through its public wire. `release(context)` is
  called only for parent Explorer session disposal; child close destroys only
  the child registry entry, epoch, and action handles, retaining the
  context/sidecar for parent-alive reopen.
- The compare-success block and all builder injection/wiring are Slice 2
  integration. The existing `BuildSemanticDiffReportDataInput` remains
  unchanged. The calendar-owned adapter uses the additive input type
  `BuildSemanticDiffPresentationArtifactsInput =
BuildSemanticDiffReportDataInput & { options?: Pick<CompareSemanticDiffOptions,
"scheduleComparisonPeriod"> }` for
  `createBuildSemanticDiffPresentationArtifacts(parser, compareWithArtifacts,
builder)`.
  The adapter parses each source once, forwards the same selected period value
  as `CompareSemanticDiffInput.options.scheduleComparisonPeriod`, invokes
  comparison and the pure builder once, and is itself invoked exactly once by
  the command. When `options` or `scheduleComparisonPeriod` is not supplied,
  the adapter omits `options` and that field from the comparison input; it does
  not pass an `undefined` placeholder or invent a `period` alias.
  Bootstrap wires that adapter and the
  calendar-owned `createScheduleAwareExplorerSession` companion through
  `src/bootstrap/extension/semanticDiffWiring.ts` and
  `src/bootstrap/extension/extensionDependencies.ts`. The companion invokes
  `OpenSemanticDiffExplorer(context)` exactly once for both impact states using
  the same context object; available impact performs register → Explorer
  session/panel creation → parent `onDidDispose` release, while unavailable
  impact skips registry/action and still returns the normal parent handle.
  Child close does not release the parent sidecar. The Explorer predecessor is
  not modified with a new hook.
- The sidecar's available payload contains `period`, `roots`,
  `candidateGroups`, `timelineItems`, and `issues`. An invalid requested
  period contains only the exact period, stable invalid-period reason code,
  and structured detail; a not-requested period has no sidecar/action. A
  valid period remains available even when all collections are empty.
- Root selection is closed to `isRootJobnet(unit) =
unit.unitType === "n" && unit.isRootJobnet === true`. No path, depth,
  parent, truthy flag, or general jobnet-type inference may add a root.
- Evaluate correspondence with the closed root matrix. Both sides must
  satisfy `unit.unitType === "n" && unit.isRootJobnet === true` for an exact or
  one-to-one fingerprint pair; retain both real `unitPath` values and use the
  after path as `canonicalPath` when present. A root rename or move remains a
  two-sided root pair. A before-root to after-non-root correspondence becomes a
  one-sided `removed-root-scope` entry, and a before-non-root to after-root
  correspondence becomes a one-sided `added-root-scope` entry. A
  non-root/non-root correspondence is excluded. Ordinary added and removed
  root sets remain one-sided `added`/`removed` entries with no fabricated
  counterpart.
- Scope-transition entries carry the real counterpart path and
  `identityDecisionId` only as `scopeTransition` metadata. The absent root side
  is `null`; it is not a valid no-runs or uncalculated outcome, and no
  cross-side run pairing is created for the transition. The metadata itself
  has no source-change reference; real one-sided run/timeline effects still
  resolve their exact upstream reference when a corresponding `runChanges`
  entry exists.
- Fingerprint candidate groups are never matched, merged, diffed, or assigned
  to a root. A `candidateGroup` has its own stable group ID plus separate,
  sorted `before` and `after` candidate arrays containing each candidate's
  real unit ID, name, and path. Candidate groups are displayed in a separate
  before/after section and are not included in root, run, issue, or timeline
  counts. Candidates must not fall through into added/removed roots.
- A non-null root side is exactly a real side record with `side`, `unitId`,
  `unitPath`, `unitName`, upstream-owned `outcome`, `runs`, and `issueIds`.
  The only outcomes are `supported-runs`, `valid-no-runs`, `partial`, and
  `uncalculated`. The predecessor classification is authoritative: an empty
  array alone never means valid no-runs; `partial` means supported runs plus
  explicit issues; no supported runs plus explicit unresolved issues is
  `uncalculated`.
- The schedule predecessor carries valid-no-runs metadata for both `before`
  and `after` sides from the same evaluation pass through an additive,
  evaluation-only `zeroRunCandidatesBySide: { before: AjsUnit[]; after:
AjsUnit[] }` carrier. The existing after-side `zeroRunCandidates` view used
  by `compareScheduleDiff` remains unchanged. Slice 1 consumes the per-side
  carrier only for authoritative roots; it never infers no-runs from an empty
  array, a missing side, or a second evaluation.
- A one-sided scope-transition root carries
  `scopeTransition: { kind: "removed-root-scope" | "added-root-scope";
counterpartPath: string; identityDecisionId: string }`. Ordinary added or
  removed roots and two-sided root pairs carry no scope-transition metadata.
  This metadata is descriptive only and never pairs runs across sides.
- The sidecar retains complete supported before/after projected run arrays
  from that one upstream pass. It does not re-project, parse parameters,
  reconstruct unchanged runs from change rows, or derive issues from prose.

### Collision-Free Sidecar Identity And Pairing

- Define one closed encoder for all sidecar IDs:
  `lp(value) = <decimal UTF-8 byte length>:<UTF-8 value>` and
  `encode(kind, side, root, date, time, rule, occurrenceOrdinal) =
lp(kind) + lp(side) + lp(root) + lp(date) + lp(time) + lp(rule) +
lp(String(occurrenceOrdinal))`. Components are concatenated without a
  delimiter; lengths are measured in UTF-8 bytes and values are not
  normalized, localized, or truncated. `occurrenceOrdinal` is a finite
  non-negative integer rendered in base 10.
- `root.id` uses `kind=root`, `side=pair` for a matched root or the actual
  `before`/`after` side for a one-sided root, `root=canonicalPath`, empty date
  and time, `rule=matchKind`, and ordinal `0`.
- `candidateGroup.id` uses the same encoder with `kind=candidate-group`,
  `side=pair`, `root=canonical candidate path` (after first, otherwise
  before), empty date and time, `rule=fingerprint`, and ordinal `0`. It is a
  display key only and is never a root or a `sourceChangeRef`.
- `run.id` uses `kind=run`, the run side, `root=root.id`, the private
  source-unit identity key, exact ISO date, exact JP1/AJS wall-clock time,
  decimal rule, and the deterministic ordinal for that source/side/date/rule
  group. The time component keeps different times distinct, while equal runs
  receive consecutive ordinals. The source-unit identity component prevents
  nested runs with identical date/time/rule facts from colliding; it is a
  sidecar-only value and is not added to `SemanticDiffScheduleRun` or public
  `runChanges`. A run also carries `sourceChangeRef: { id: string;
occurrenceOrdinal: number } | null`; it is `null` only for unchanged runs.
- `issue.id` uses `kind=issue`, issue side, `root=root.id`, empty date and
  time, and a collision-free target key containing the issue kind,
  `reasonCode`, `targetKind`, exact `targetId` or target path, and
  `parameterKey` or an explicit `null` token. Every component is length
  prefixed; target ID/path and parameter key are never flattened into an
  ambiguous string. The final ordinal is assigned within the complete
  root/side/kind/reason/target-key group. The issue record carries that
  ordinal, stable kind/reason code, target key, and structured detail.
- `timelineItem.id` uses `kind=timeline`, effect side (`pair` for
  changed-time), `root=root.id`, the private source-unit identity key, exact
  effect date, an exact time key (the single side time for unchanged/added/
  removed, and a length-prefixed pair of before and after times for
  changed-time), effect rule, and the pair ordinal. A timeline item carries
  independent before/after run IDs and the same upstream `sourceChangeRef`
  for a changed/added/removed effect.
- `sourceChangeRef` is a foreign composite reference, not an ID alias. Its
  `id` and `occurrenceOrdinal` resolve together against the stable
  `context.result.scheduleComparison.runChanges` array, where the ordinal is
  the zero-based occurrence among entries with that `id`. Missing,
  out-of-range, or sidecar-ID references fail validation. There is no blanket
  duplicate-reference prohibition: an added/removed effect may share the same
  reference between its one side's run and its same-effect timeline item; a
  changed-time effect may share it between its before run, after run, and
  same-effect timeline item. Reuse across different sidecar effect IDs is
  rejected. Unchanged runs have no source-change reference. A real one-sided
  effect under a root-scope transition follows the same exact reference rule;
  scope-transition metadata does not suppress or invent that reference.
- Occurrences are assigned from the already captured side arrays. The builder
  derives a private source-unit identity for each run: an exact or
  fingerprint-confirmed identity decision ID plus the canonical source-unit
  path for matched sides, or a side-qualified exact unit ID and path for a
  one-sided source. For each root and side, group by source identity/date/rule,
  sort by exact time then unit path, unit ID, unit name, and the predecessor's
  stable source ordinal when present, and assign zero-based ordinals; equal
  records receive consecutive ordinals. Pair before and after entries by the
  shared source identity/date/rule/ordinal. Equal times are unchanged;
  differing times are one changed-time item; an unmatched entry is added or
  removed. The source identity is used for pairing and collision-free sidecar
  IDs but is not exposed in the public result/report/JSON schema. The same
  ordinal is used by the run and paired timeline identity; the time component
  keeps distinct times collision-free. This retains duplicate equal runs and
  makes shuffled-input output deterministic without a second projection. Equal
  records remain equivalent when their input order changes. Source-change
  occurrence ordinals are resolved independently from the stable upstream
  `runChanges` array and are never inferred from sidecar array order. Candidate
  changes are matched by the complete effect signature (kind, path, date, rule,
  and before/after times), consumed once, and then addressed by the upstream
  `(id, occurrenceOrdinal)` composite. Duplicate changed-time entries remain
  distinct; count mismatches become the appropriate added/removed effects when
  a matching upstream row exists, and an unmatched eligible effect fails
  closed rather than receiving a guessed or null reference.
- Issues are copied once from the same side collections, sorted by root, side,
  `issueKind`, reason code, `targetKind`, exact target ID/path,
  `parameterKey` or the explicit null token, structured detail key, and source
  ordinal before
  assigning duplicate ordinals. The occurrence group includes `issueKind`, so
  a same-reason decision with different carried statuses has an independent
  ordinal sequence. Ambiguous candidate-root decisions are excluded before
  root ownership/remapping; their issues do not become null-root sidecar
  issues or contribute to counts. These target-key components are encoded
  individually so target ID/path and parameter-key combinations cannot
  collide. No issue or run is silently merged. All references are validated
  exactly once against the same root and side before the snapshot is exposed.
- Root and candidate display order uses canonical path (after first,
  otherwise before), then the length-prefixed ID. Run and timeline ordering is
  locale-neutral UTF-16 order over date, time, root, side, source-unit
  identity, rule, and ordinal; the source identity is the final tie-break
  needed when nested units share all visible schedule facts. Issue ordering is
  root, side, kind precedence, code, and ID. No
  `localeCompare`, host timezone, JavaScript `Date`, current clock, or locale
  formatting participates in identity, sorting, or period membership.

### Root Outcomes, Timeline, Issues, And Filters

- Supported runs are rendered only in the date-grouped linear timeline. A
  partial root displays its supported runs there and its explicit issues in
  the separate `Uncalculated schedule portions` section. An uncalculated root
  displays issues without fabricated runs. A valid no-runs root appears in a
  dedicated `Valid no runs` section. A null side is announced as not present
  on that side and is never relabelled as an outcome.
- The root outcome badge/filter dimension is independent from the run-state
  dimension. Root outcome options are exactly `All`, `Supported runs`, `Valid
no runs`, `Partial`, and `Uncalculated`. Run-state options are exactly
  `All`, `Unchanged`, `Added`, `Removed`, and `Changed time`. A root selector
  remains a separate native selector. Run-state filtering changes only
  timeline visibility; root-outcome filtering changes only matching root
  status/issues and their associated timeline items. The dimensions combine
  conjunctively and do not mutate source facts, counts, order, period, or
  session.
- Issue kind is rendered as text (`invalid`, `missing-context`, `unsupported`,
  or `uncalculated`) in the uncalculated section; it is not inferred from a
  run state. The carried predecessor status is consulted only when the
  reason is `calendar-selection` or `closed-day-substitution`. Legacy
  reason mappings remain authoritative for every other reason, including
  `missing-start-time` → `uncalculated`, even when an internal projection
  status is present. Global and visible totals remain distinct, including filter
  no-match, candidate groups, zero-only, partial, uncalculated-only, and
  mixed data.
- The fixed legend has separate run-state and root-outcome labels, with text,
  icon, and pattern. Color, position, shape, hover, and animation are never
  the sole state signal. A month/week grid remains out of scope.

### Host-Private Calendar Session And Closed Transport

- `ScheduleImpactSidecarRegistry` is bootstrap-owned and host-private. Its
  exact API is `register(context, sidecar)`, `resolve(context)`, and
  `release(context)`, keyed by immutable context object identity. The
  calendar-owned bootstrap companion
  `createScheduleAwareExplorerSession` always invokes the existing
  `OpenSemanticDiffExplorer(context)` exactly once for available and
  unavailable impact and returns the normal Explorer parent handle. Available
  impact uses the atomic sequence register(context, sidecar) → Explorer
  creation → parent composite `onDidDispose` release; unavailable impact skips
  registration and calendar action but still opens/returns the normal parent.
  Creation failure or cancellation rolls back available registration and all
  partial/normal Explorer resources before returning the existing error. Child
  panel/session close destroys only the child registry entry, epoch, and action
  handles; it retains the registered context/sidecar while the parent is alive,
  so reopen resolves the same immutable pair without rerunning comparison or
  schedule projection. Late child work after close is ignored. The sidecar is
  not copied through or added to the Explorer transport.
- The available calendar action resolves the sidecar through the host-private
  parent Explorer registry and creates one child calendar session from the
  parent session. An unavailable/invalid result creates no registry entry or
  calendar panel/action, while the normal Explorer parent remains available.
- Parent and child identities are separate: the existing immutable Explorer
  `parentSessionId` and parent `disposeEpoch` remain Explorer-owned; the
  calendar registry allocates a fresh opaque `calendarSessionId`, a private
  `calendarActionId`, and a child `calendarEpoch`. The action callback carries
  these IDs in a host-private type and is not accepted by the Explorer's
  public message union. A parent owns its child IDs; the calendar registry
  owns child epoch and request state; neither registry may mutate the other's
  epoch.
- Calendar transport is a closed union separate from Explorer transport.
  Requests are exactly `{type: "ready" | "refresh", sessionId,
requestId}`. Host `session` is exactly `{type, sessionId, requestId, ok:
true, payload, error: null}`; `failure` is exactly `{type, sessionId:
string | null, requestId: number | null, ok: false, payload: null, error}`;
  `close` is exactly `{type, sessionId, requestId: null, ok: true, payload:
null, error: null}`. Request IDs are finite positive integers, monotonic
  within the child session, and stale/wrong-session requests fail atomically.
- Calendar error codes are exactly `invalid-request`, `unknown-session`,
  `stale-request`, `disposed-session`, `payload-too-large`, and
  `host-disposed`. Error details are typed and nullable, contain no localized
  prose or host identity, and unknown types, missing/extra keys, non-finite
  IDs, and conflicting nullable fields are rejected before state mutation.
- Before every calendar message is posted, serialize that individual message
  and measure its UTF-8 byte length. The fixed limit is 8 MiB inclusive per
  encoded calendar message, including session, failure, and close envelopes.
  An over-limit payload yields only `payload-too-large`, installs no partial
  state, and leaves the parent session usable for a narrower workflow-owned
  rerun. Explorer's limit and calendar's limit remain separately tested.
- One open panel maps to one child session. Repeated action reveals that panel
  and may issue a new child request without creating another identity. Closing
  the child removes its registry entry and invalidates its epoch; invoking the
  action again while the parent remains alive creates a new panel with a new
  child session/action identity. Disposing the parent cascades close and
  invalidation to every child. Late requests, replies, reveal callbacks, and
  disposal completions from an old epoch are ignored and cannot resurrect or
  clear a newer session.
- Ready/refresh replays the same immutable snapshot. Initial failure leaves
  no partial facts; refresh failure preserves the last valid snapshot and
  announces the error. No restoration, persistence, execution history,
  external calendar, WebAPI, or new command/contribution is introduced.

### Display Language And Compatibility

- The parent Explorer session captures an immutable normalized
  `displayLanguage`; the child calendar session inherits the exact value and
  cannot override it from a request, browser locale, or host callback.
  Normalize `ja`/`ja-*` to `ja`, `en`/`en-*` to `en`, and all other values to
  `en` as the explicit English fallback.
- Add calendar-specific English and Japanese resource maps and a common
  lookup with English fallback. Resources contain labels, badges, issue
  explanations, live announcements, and error text only; raw paths, dates,
  wall-clock strings, IDs, reason codes, and structured detail remain
  unlocalized values.
- The chosen language never changes period membership, date text, sort order,
  ID encoding, filter semantics, or desktop/web output. Existing Explorer,
  Flow, report, and normal viewer language behavior is untouched.

### Impact Inventory

- Application: add the calendar-owned internal
  `compareSemanticDiffWithArtifacts(input: CompareSemanticDiffInput)` contract
  over parsed documents. It performs identity comparison and schedule
  evaluation once each and returns `{ result, scheduleProjectionFacts }`.
  `ScheduleProjectionFacts` is a discriminated union: `not-requested` has no
  period, `invalid` has `{ period, issues }`, and `evaluated` has `{ period,
before: { rootProjections, statuses, issues }, after: { rootProjections,
statuses, issues }, correspondence }`. The existing
  `compareSemanticDiff(input)` remains a public `.result` wrapper.
  `buildSemanticDiffPresentationArtifactsFromComparison({ result,
scheduleProjectionFacts })` calls `buildSemanticDiffOutputContext(result)`
  exactly once and returns `{ context, scheduleImpact }`. Keep the context
  exactly `{ result, summary }` and consume predecessor facts without changing
  its result, run-change, report, or JSON contract.
- Presentation host: add the calendar panel, private child-session registry,
  closed calendar transport, and lifecycle handling. Presentation webview owns
  timeline/list projection, filters, keyboard, accessibility, virtualization,
  and localized labels.
- Bootstrap: own and compose the host-private
  `ScheduleImpactSidecarRegistry` and calendar-owned
  `createScheduleAwareExplorerSession` companion in
  `semanticDiffWiring.ts` and `extensionDependencies.ts`. The companion opens
  the normal Explorer exactly once for either impact state; available impact
  owns register → Explorer session/panel creation → parent composite
  `onDidDispose` release, while unavailable impact skips registry/action. Both
  paths use atomic rollback on failure/cancel, and child close has no sidecar
  release. Slice 2 owns command caller/injection/wiring and exactly-once
  integration; do not change the Explorer public
  message contract or add a predecessor hook.
- Configuration: add only the calendar web bundle entry in webpack. Keep
  `package.json` commands, activation events, custom editors, menu/command
  contributions, and VS Code engine unchanged; the manifest path is a
  no-change guard covered by tests.
- Documentation: add the durable schedule-impact use case, index it, update
  README and CHANGELOG only when Slice 3 makes the view observable, and run
  Markdown lint. The roadmap already records the Wave 4 placement and the
  completion-committed `semantic-diff-comparison-workflow` plus
  period-bearing-context entry condition; this feature preserves that wording.

## Implementation Slices

### Slice 1: Capture And Validate The Immutable Schedule-Impact Sidecar

- Status: Slice 1 implementation is complete under approved third targeted
  replan commit `11615026`; the prior implementation and approved
  predecessor-status deltas remain preserved. Independent implementation review
  is `Ready` with no Findings, Completion Approval is recorded, and the focused
  completion commit is pending.
- Scope: create the calendar-owned internal
  `compareSemanticDiffWithArtifacts(input: CompareSemanticDiffInput)` contract
  over parsed documents. Invoke identity comparison and schedule evaluation
  once each, returning `{ result, scheduleProjectionFacts }` on success. The
  discriminated facts union is `not-requested` without a period, `invalid` with
  `{ period, issues }`, or `evaluated` with `{ period, before: {
rootProjections, statuses, issues }, after: { rootProjections, statuses,
issues }, correspondence }`. Keep `compareSemanticDiff(input)` unchanged as
  the public `.result` wrapper. Build the pure calendar-owned
  `buildSemanticDiffPresentationArtifactsFromComparison({ result,
scheduleProjectionFacts })`; it calls `buildSemanticDiffOutputContext(result)`
  exactly once and returns `{ context, scheduleImpact }`, mapping only
  evaluated facts to `kind: "available"` and not-requested/invalid facts to
  `kind: "unavailable"`. Project exact root/candidate correspondence,
  root/non-root scope
  transitions, root outcomes, occurrence-aware runs/timeline/issues,
  length-prefixed IDs, `sourceChangeRef` composite references, canonical/side
  paths, strict validation, ordering, and the closed calendar DTO. Keep the
  existing output context, result, report, and JSON untouched.
- User / Domain Value: later presentation receives trustworthy complete facts,
  duplicate records, valid no-runs, partial outcomes, and ambiguous candidates
  without rerunning or guessing schedule meaning.
- Cohesive Change Group: application comparison-artifact contract, the
  internal schedule differ/sidecar pairing boundary, sidecar
  types/projection/validator, and pure application unit tests. Command caller,
  injection, bootstrap wiring, and Explorer lifecycle are Slice 2 concerns.
- Planned paths and approval scope:
  - `src/application/semantic-diff/compareSemanticDiff.ts` (keep the public
    `compareSemanticDiff(input)` contract as the internal result's `.result`
    wrapper).
  - `src/application/semantic-diff/compareScheduleDiff.ts` (reuse the
    existing schedule comparison/evaluation operation once in the internal
    artifact contract).
  - `src/application/semantic-diff/compareSemanticDiffWithArtifacts.ts` (new
    parsed-document internal contract with one identity pass, one schedule
    evaluation pass, and `scheduleProjectionFacts`).
  - `src/application/semantic-diff/semanticDiffScheduleImpact.ts` (new
    sidecar types, ID encoder, projection, pairing, validation, and ordering).
  - `src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts`
    (pure builder
    `buildSemanticDiffPresentationArtifactsFromComparison`; it calls the
    predecessor `buildSemanticDiffOutputContext(result)` exactly once; no
    comparison, schedule evaluation, predecessor, or JSON contract change).
  - `src/application/semantic-diff/buildSemanticDiffOutputContext.ts`
    (existing structured-output predecessor symbol consumed without changing
    its `{ result, summary }` contract; if its actual symbol/path differs,
    stop at the implementation gate and replan).
  - `src/test/suite/compareSemanticDiffWithArtifacts.test.ts` (parsed-document
    contract, one identity pass, one schedule evaluation, all facts-union
    states, and public `.result` compatibility).
  - `src/test/suite/semanticDiffPresentationArtifacts.test.ts` (pure artifact
    builder, context identity, and existing error-union tests), plus focused
    updates to
    `src/test/suite/semanticDiffScheduleImpact.test.ts` (new exhaustive
    contract/property tests), plus focused updates to
    `src/test/suite/compareSemanticDiff.test.ts`,
    `src/test/suite/semanticDiffSchedule.test.ts`, and
    `src/test/suite/semanticDiffContracts.test.ts`.
- First Replanning delta paths covered by the separate owner decision and
  recorded Human Approval:
  - `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`: carry
    the already computed `SemanticDiffScheduleStatus` only for
    `calendar-selection` and `closed-day-substitution` decisions, while
    retaining each existing reason code.
  - `src/application/semantic-diff/semanticDiffScheduleImpact.ts`: classify
    `missing-context` from that carried status and preserve the existing
    reason code/detail without a second evaluation.
  - `src/test/suite/semanticDiffScheduleRules.test.ts`: prove that calendar
    selection and closed-day substitution retain `missing-context`, `invalid`,
    and `unsupported` statuses from the same projection.
  - `src/test/suite/semanticDiffScheduleImpact.test.ts`: prove that identical
    calendar reason codes retain distinct issue kinds and that no recalculation
    or result-contract change is introduced.
    No change to `src/domain/services/semantic-diff/semanticDiffScheduleTypes.ts`
    is required; its existing `SemanticDiffScheduleStatus` union is reused.
- Latest second-Replanning delta paths covered by the independent review and
  Human Approval recorded above:
  - `src/domain/services/semantic-diff/semanticDiffScheduleRules.ts`: retain
    both before/after valid-no-runs metadata from the same evaluation pass,
    while keeping the existing after-side compatibility projection used by
    `compareScheduleDiff` and restricting the status-carrier contract to
    calendar-selection and closed-day-substitution decisions.
  - `src/application/semantic-diff/semanticDiffScheduleImpact.ts`: consume
    per-side no-run metadata without empty-array inference; apply carried
    status only to the two calendar reasons; exclude ambiguous candidate-root
    issues; group issue ordinals by issue kind; and resolve duplicate,
    changed-time, count-mismatch, and root-scope one-sided effects against
    exact upstream `runChanges` references.
  - `src/test/suite/semanticDiffScheduleRules.test.ts`: cover both-side
    valid-no-runs preservation, status-carrier reason scoping, legacy
    `missing-start-time` mapping, and a real missing-context fixture.
  - `src/test/suite/semanticDiffScheduleImpact.test.ts`: cover duplicate
    changed-time runs, count mismatches, shuffled upstream `runChanges`,
    candidate-root issue exclusion, issue-kind ordinal grouping, root-scope
    reference resolution, missing-reference fail-closed behavior, and the
    complete status/no-run matrix.
  - `src/test/suite/semanticDiffScheduleCalendar.test.ts`: preserve the
    predecessor's existing after-side zero-run confirmation behavior while
    proving that the new before/after evaluation metadata is additive and
    evaluation-only.
- Third targeted Replanning paths (independently reviewed, Human Approved, and
  committed in focused plan/replan commit `11615026`):
  `src/domain/services/semantic-diff/semanticDiffScheduleDiffer.ts`,
  `src/application/semantic-diff/semanticDiffScheduleImpact.ts`,
  `src/test/suite/semanticDiffScheduleRules.test.ts`,
  `src/test/suite/semanticDiffScheduleImpact.test.ts`,
  `src/test/suite/compareSemanticDiffWithArtifacts.test.ts`, and
  `src/test/suite/semanticDiffScheduleCalendar.test.ts`, plus
  `docs/specs/features/schedule-impact-calendar/SPECS.md`. The domain differ
  change is internal; the application/test changes prove source-unit
  isolation, deterministic duplicate pairing, real upstream references, and
  unchanged public result/report/JSON boundaries. The authorized
  feature-author has prepared and validated the normative source-unit pairing
  clarification in SPECS.
- Third targeted Replanning delta (reviewed `Ready` with no Findings, Human
  Approved, and committed in focused plan/replan commit `11615026`): the real
  upstream differ and the sidecar must share a minimal internal pairing
  contract. `compareScheduleRuns` groups by canonical source-unit path, exact
  date, and rule; sorts each side by exact time and stable source facts;
  pairs the minimum duplicate count by ordinal; emits one changed-time row for
  each paired time difference; and emits only the unmatched added/removed
  extras. Equal duplicate runs remain distinct and unchanged. The final
  decision order is an explicit locale-neutral comparator over source identity,
  date, rule, effect kind, times, and ordinal. The contract is internal to
  `semanticDiffScheduleDiffer.ts`; `SemanticDiffScheduleRunChange`, its IDs,
  and the public result/report/JSON remain unchanged.
  The sidecar builder derives a private composite source-unit key from the
  exact/fingerprint-confirmed identity decision ID plus canonical source path
  for matched sides, or from side plus exact source `unitId` and path for a
  one-sided source; date and rule are additional key components. It never
  pairs nested units merely because date/rule match, and this key is not
  exposed in the public result/report/JSON or sidecar run DTO.
  Duplicate equal records receive stable consecutive ordinals after sorting by
  exact time and source facts; shuffled input and duplicate/count-mismatch
  cases must produce the same timeline and rule order. Source references are
  resolved one-to-one against the actual `runChanges` emitted by that differ;
  no synthetic changed-time row, sidecar alias, or guessed occurrence is
  accepted.
- Acceptance: root inclusion uses only the closed predicate; the full
  root/non-root correspondence matrix yields both-root pairs, one-sided
  `removed-root-scope`/`added-root-scope` entries, ordinary one-sided
  `removed`/`added` roots, non-root exclusion, and separate ambiguous
  candidates. Root rename/move retains a pair, while scope-transition
  counterpart paths and `identityDecisionId` stay metadata and create no
  cross-side run pairing. All four side outcomes, supported
  runs, issues, all effects, duplicate equal runs/issues/changed times,
  shuffled inputs, exact composite source-change references, valid
  added/removed and changed-time same-effect sharing, cross-effect reference
  rejection, invalid/empty/not-requested periods, and no-recalculation spies
  pass. The internal contract invokes identity comparison and schedule
  evaluation once each, and the artifact builder performs no re-evaluation.
  Existing `compareSemanticDiff(input)` `.result` behavior and
  `{ result, summary }` context/result/JSON snapshots remain unchanged.
  The first replan's status carrier is now narrowed by contract: the sidecar
  consults carried projection status only for `calendar-selection` and
  `closed-day-substitution`, retaining each reason/detail while distinguishing
  `missing-context`, `invalid`, and `unsupported`. Legacy mappings for all
  other reasons remain unchanged, including `missing-start-time` →
  `uncalculated`, even if the predecessor carries a projection status. The
  predecessor preserves both before and after valid-no-runs metadata through
  the same evaluation pass; the existing after-side result/confirmation view
  remains compatible. The sidecar consumes only this authoritative per-side
  metadata and must not infer it from reason codes, details, empty runs, or a
  second schedule calculation.
  Duplicate runs are paired by stable side-array occurrence and duplicate
  changed-time/count-mismatch effects resolve one-to-one by complete effect
  signature to upstream `runChanges` composites. Missing eligible references
  fail closed; no sidecar ID or guessed ordinal is accepted. Ambiguous
  candidate-root issues are excluded before root ownership and do not affect
  counts. Issue ordinals are grouped by `issueKind`. Root-scope metadata never
  creates a cross-side run pair, but every real one-sided effect uses the same
  exact upstream reference rule as other added/removed effects; the scope
  transition itself never receives a synthetic reference.
- The upstream differ contract is part of this Slice 1 replan: duplicate
  equal runs are not deduplicated; duplicate/count-mismatch groups pair by
  source-unit identity/date/rule and stable ordinal; each paired time change
  is emitted as one `changed-time` decision; and unmatched records alone emit
  `added`/`removed`. Different rules or nested source units cannot be paired
  by date alone. The sidecar consumes those real rows and resolves every
  eligible effect by the exact `(id, occurrenceOrdinal)` composite. Public
  `SemanticDiffResult`, report, JSON version 1, and `runChanges` shape remain
  unchanged.
- Sidecar source identity is explicit and deterministic: for matched sides the
  pairing key uses the exact/fingerprint-confirmed identity-decision key plus
  canonical source path; for one-sided units it uses side plus exact `unitId`
  and path. Exact date and rule are additional key components. Duplicate
  records are paired only within that key, and nested units with equal
  date/rule cannot cross-pair. Focused detail, timeline, and rule assertions
  are updated to the approved locale-neutral comparator order. The prepared
  normative `SPECS.md` duplicate-pairing sentence now uses
  source-unit-identity/date/rule grouping while retaining root/side ownership,
  duplicate ordinals, and deterministic handling. This clarification is
  prepared and validated by the authorized feature-author; no code,
  result/report/JSON, or schedule meaning is broadened.
- The exact normative rule is: within each root and side, retain duplicate
  runs and group them by source-unit identity, date, and rule; sort by exact
  time and stable source facts; assign consecutive ordinals; pair before and
  after records only when source identity/date/rule/ordinal agree; classify
  equal times as unchanged, differing times as changed-time, and unmatched
  records as added/removed. Root and side ownership remains authoritative,
  and identity/pairing/order remains locale- and timezone-independent.
- Validation: exact-key/union/foreign-reference tests;
  `ScheduleProjectionFacts` not-requested-without-period,
  invalid-period-with-issues, and evaluated before/after/correspondence
  fixtures; unavailable/available mapping and exactly-one
  `buildSemanticDiffOutputContext(result)` spy; UTF-8 length-prefix
  collision tests with delimiters and supplementary Unicode; occurrence and
  duplicate pairing properties; root/candidate/root-scope correspondence
  matrices; counterpart metadata and no-cross-side-pairing fixtures;
  period/outcome/issue matrices; collision-free issue target-key fixtures;
  stable run-change `(id, occurrenceOrdinal)` resolution; valid added/removed
  one-side-plus-timeline and changed-time before/after-plus-timeline
  shared-reference fixtures; cross-effect duplicate rejection; stable ordering
  under shuffled input; internal-contract one-identity/one-schedule-pass,
  public `.result` compatibility, pure builder/context-identity, existing
  error-union, and no-recalculation tests; application architecture and
  focused compiled tests after implementation. The latest replan adds
  predecessor fixtures proving both-side valid-no-runs metadata in one pass,
  reason-scoped status propagation, and the correct missing-context paths:
  missing explicit calendar source, missing containing group, incomplete and
  invalid calendar context, and genuinely unsupported calendar/substitution
  input. Sidecar fixtures must retain each reason code while distinguishing
  `missing-context`, `invalid`, and `unsupported`, preserve
  `missing-start-time` as `uncalculated`, exclude candidate-root issues,
  group duplicate issue ordinals by issue kind, resolve duplicate/count-mismatch
  changed-time references against shuffled upstream rows, and resolve real
  one-sided scope-transition effects without synthetic references. Existing
  result/report/JSON compatibility tests must remain green. Until the revised
  implementation is approved and these checks are rerun successfully, this
  plan records no new validation result.
- The third replan adds direct `compareScheduleRuns` fixtures proving that
  duplicate/count-mismatch inputs produce real changed-time plus unmatched
  rows, that rule changes do not cross-pair, and that shuffled inputs preserve
  the approved decision order. Sidecar fixtures prove source-unit identity
  isolation for nested units and deterministic duplicate pairing. The
  `compareSemanticDiffWithArtifacts.test.ts` end-to-end fixture must invoke
  the real comparison path, inspect its emitted `runChanges`, build the
  sidecar, and assert exact references for each effect; synthetic
  hand-authored changed-time rows are insufficient. Focused expectations must
  match the approved detail/timeline/rule comparator order. The scoped tests
  and compile/quality checks now pass, with their current results recorded in
  the implementation evidence below.
- Documentation validation confirms that `SPECS.md` contains the
  source-unit-identity/date/rule rule above and that its root/side, duplicate,
  deterministic-order, and public-contract constraints remain intact. The
  authorized feature-author prepared and validated this clarification.
- Production Readiness: one identity comparison and one schedule evaluation,
  followed by one pure artifact projection, explicit
  validation before exposure, no localized or host-time ordering, no schedule
  recalculation, no candidate merge, no silent truncation, exact composite
  references for every non-unchanged effect, explicit effect-scoped sharing,
  collision-free issue target keys, candidate-root issue exclusion, and no
  sensitive content or host handles in the sidecar. A duplicate/count
  mismatch or missing upstream row fails closed rather than weakening the
  reference contract. The differ's duplicate pairing is deterministic and
  internal, and the sidecar's source-unit key prevents nested-unit leakage
  without widening any public DTO or schedule meaning.
- Approval Boundary: only the application comparison-artifact contract,
  `buildSemanticDiffPresentationArtifactsFromComparison({ result,
scheduleProjectionFacts })`, its exactly-one output-context call, the internal
  `compareScheduleRuns` differ grouping/pairing contract, sidecar projection
  and validation, the named pure application/domain tests above, and the
  exact normative duplicate-pairing clarification in
  `docs/specs/features/schedule-impact-calendar/SPECS.md`. The authorized
  feature-author has prepared and validated the SPECS clarification. The
  differ refinement is evaluation-only and must keep
  `SemanticDiffScheduleRunChange` and its `runChanges` mapping unchanged.
  `SemanticDiffOutputContext` remains exactly immutable `{ result, summary }`; a
  predecessor schedule/result/run-change/report/JSON change, a new
  command-level builder call or wiring change, new schedule meaning, or
  different candidate/root/scope-transition policy requires Replanning with
  that owner.
- Replanning approval boundary: the first status-carrier delta remains covered
  by the earlier Human Approval and focused commit `6622953f`; the second
  same-pass before/after metadata, reason-scoped status, duplicate/reference,
  candidate exclusion, ordinal, fixture, and root-scope reconciliation delta
  remains covered by Human Approval and focused commit `ebf8bf3d`. The third
  differ/source-identity/order/E2E plus normative-SPECS delta has final
  independent `plan-reviewer` `Ready` review with no Findings and Main's
  automatic Human Approval recorded for its exact paths. Its focused
  plan/replan commit `11615026` is complete. Implementation review is `Ready`
  with no Findings and Completion Approval is recorded; the focused completion
  commit remains pending.
- Dependencies: completion-committed `schedule-semantics-expansion`,
  `semantic-diff-structured-outputs`, and the predecessor's stable parsed
  `CompareSemanticDiffInput`, result/context, and
  `BuildSemanticDiffReportDataInput` parser-error contracts; the sidecar
  consumes their facts but does not modify them. To preserve status without
  recalculation, the predecessor evaluation must expose the already computed
  `SemanticDiffScheduleStatus` only as a supported carrier for
  `calendar-selection` and `closed-day-substitution`, plus the additive
  `zeroRunCandidatesBySide` valid-no-runs metadata for both sides from that
  same pass. The existing
  after-side compatibility projection remains available to
  `compareScheduleDiff`; `SemanticDiffResult`, reports, JSON, and public
  `.result` remain unchanged. If the predecessor cannot provide both side
  facts without a second evaluation or a public-schema change, stop and
  return that owner decision to Main.
  The third replan also depends on the existing domain differ owner exposing
  duplicate pairing through the internal `compareScheduleRuns` decision
  contract. The differ may refine only its internal grouping/order/pairing;
  `compareScheduleDiff` continues to map the same decision union to the
  unchanged `scheduleComparison.runChanges` DTO. If satisfying the real
  duplicate/count-mismatch output requires changing that public DTO, report,
  JSON, or a second schedule evaluation, stop for a new owner decision.
  The additive
  `BuildSemanticDiffPresentationArtifactsInput` source-text input type is
  introduced by Slice 2 for the workflow predecessor contract; it is not
  required for this pure application slice. The workflow dependency is not
  required for this pure application slice.
- Risks: second schedule pass, context/sidecar identity drift, unstable
  duplicate ordinals, duplicate/count-mismatch reference aliasing,
  wrong effect-scoped sharing, false zero-run, candidate-root leakage,
  non-root inclusion, incorrect root-scope metadata, path collision, sidecar
  reference repair, or losing the distinction between an unsupported calendar
  rule and a missing calendar context. The status field and both-side no-run
  metadata must be copied from the existing projection decision path exactly
  once; any status inference, missing-reference fallback, or predecessor
  result/JSON exposure is out of scope and returns to Main. The exact-key,
  same-pass, foreign-reference, root/candidate/scope matrix, allowed-sharing,
  shuffled-input, issue-kind ordinal, legacy-reason, and status/no-run tests
  are the gate.
  New risks are false changed-time pairing caused by deduplicated or rule-blind
  differ groups, nested-unit cross-pairing caused by date/rule-only sidecar
  keys, and synthetic references that pass unit tests but do not match real
  upstream `runChanges`; the end-to-end fixture and deterministic-order
  assertions are required controls. Any public DTO, report/JSON,
  schedule-meaning, identity-policy, or normative-SPECS change outside this
  exact clarification returns to Main.
- Out of Scope: command caller/injection/wiring, calendar panel, Explorer
  action, webview, bootstrap registry/companion, webpack, package manifest,
  localization resources, telemetry, workflow integration, README/CHANGELOG,
  and public user documentation. The selected `SPECS.md` normative
  clarification is included as the narrow third-delta documentation scope.

### Slice 1 Implementation Evidence

- Status: Slice 1 implementation is complete in the working tree under
  approved third-replan commit `11615026`; independent implementation review
  is `Ready` with no Findings, Completion Approval is approved, and the focused
  completion commit is pending.
- Changed paths: the prior Slice 1 comparison-artifact and presentation
  builder paths, the evaluation-only schedule carrier, and the approved third
  delta paths including the internal differ, source-identity sidecar pairing,
  deterministic-order fixtures, and real end-to-end comparison fixture.
- Acceptance evidence: the internal comparison performs one identity pass and
  one schedule evaluation; the public `.result` and `{ result, summary }`
  context remain unchanged; and the pure builder projects available versus
  unavailable facts without recalculation. The sidecar retains closed-root
  correspondence, scoped roots, root-owned issues, explicit outcomes,
  duplicate-aware IDs and ordinals, and exact composite source references.
  Real differ fixtures prove duplicate/count-mismatch changed-time rows and
  unmatched extras. Nested source-unit fixtures prove no cross-pairing, and
  the end-to-end fixture resolves actual `runChanges` rows. Missing eligible
  references fail closed; candidate-root issues remain excluded; issue
  ordinals remain issue-kind scoped; and calendar status is reason-scoped.
- Validation completed for this implementation: `rtk pnpm run test:compile`;
  focused schedule/sidecar/artifact/calendar Mocha suites (67 passing);
  JSON/contract/schedule/Explorer pure regression Mocha suites (54 passing);
  report and host-bound Explorer regressions are covered by the desktop
  extension-host run (exit 0, with the existing macOS codesign warning);
  desktop and web webpack builds; and web extension-host tests (exit 0, with
  existing EPIPE/Premature-close stream-cleanup warnings).
  `rtk pnpm run qlty:check` passed with no issues; `rtk pnpm run qlty:smells`
  completed with advisory complexity/duplication findings only; markdown lint
  passed with 0 errors; and `git diff --check` passed.
- Compatibility and readiness: no manifest, command, bootstrap, Explorer,
  UI, telemetry, parser, Node-built-in, public result/report/JSON, or public
  action changes were made. Shared code remains host-neutral and browser-safe.
  Production readiness evidence covers deterministic source-local pairing,
  fail-closed reference validation, immutable facts, and no schedule
  recalculation. Independent implementation review is `Ready` with no
  Findings and Completion Approval is approved; only the focused completion
  commit remains pending.
- Unresolved risks: the focused completion commit remains pending; no Slice
  2/3, command, bootstrap, Explorer, public UI, or public documentation work
  is included. A public DTO/result/report/JSON, schedule-meaning,
  identity-policy, or scope change remains a Main-owned Replanning trigger.
- Recommended route: Main should route this approved, complete uncommitted
  Slice 1 diff and evidence to `approval-committer` for the focused completion
  commit. Slice 2 remains inactive until that commit is complete.

### Slice 2: Build The Internal Calendar Session And Transport Foundation

- Status: Planned and not active; blocked on the completion-committed Slice 1
  and the existing Explorer session creation contract.
- Scope: move the command caller, injected builder dependency, and bootstrap
  composition into this integration slice. The existing
  `BuildSemanticDiffReportDataInput` remains unchanged. The calendar-owned
  adapter uses the additive input type
  `BuildSemanticDiffPresentationArtifactsInput =
BuildSemanticDiffReportDataInput & { options?: Pick<CompareSemanticDiffOptions,
"scheduleComparisonPeriod"> }` for
  `createBuildSemanticDiffPresentationArtifacts(parser, compareWithArtifacts,
builder)`.
  The adapter parses before and after exactly once, preserves the existing
  side-specific parser-error union, and invokes comparison plus the pure
  builder once. When a period is selected, it forwards that same
  `SemanticDiffComparisonPeriod` value to
  `CompareSemanticDiffInput.options.scheduleComparisonPeriod`; when no period
  is selected, the command omits `options` and the adapter omits both
  `options` and `scheduleComparisonPeriod` from the comparison input. No
  `period`/`options.period` alias or `undefined` placeholder is allowed. The
  compare-success block invokes this injected adapter exactly once and hands
  both available and unavailable artifacts to the bootstrap calendar-owned
  `createScheduleAwareExplorerSession` companion. The companion always opens
  the normal Explorer once; only available `scheduleImpact` registers a sidecar
  and exposes the calendar action. Create the browser-safe
  calendar panel/transport and child-session registry; add the bootstrap-owned
  `ScheduleImpactSidecarRegistry` with `register(context, sidecar)`,
  `resolve(context)`, and `release(context)`. The companion always invokes
  `OpenSemanticDiffExplorer(context)` exactly once using the exact same context
  object; available impact owns register → Explorer session/panel creation →
  parent composite `onDidDispose` release, while unavailable impact skips
  registration/action and still returns the normal parent handle.
  Creation failure or cancellation rolls back registration and partial child
  resources. Child panel/session close destroys only child registry/epoch/action
  handles and retains the sidecar/context while the parent is alive. Enforce
  separate parent/child IDs,
  action/request correlation, registry and epoch ownership, immutable
  display-language inheritance, strict messages, per-message 8 MiB encoding
  limits, refresh/reopen/dispose behavior, and browser-safe mounting. This
  slice deliberately does not expose a public Explorer action or visible
  calendar UI.
- User / Domain Value: one comparison has one safe internal calendar
  destination whose malformed, stale, oversized, or late traffic cannot
  replace or resurrect facts.
- Cohesive Change Group: presentation VS Code calendar host/session/transport,
  browser-safe bridge, bootstrap composition, and lifecycle/transport tests.
- Planned paths and approval scope:
  - `src/bootstrap/extension/scheduleImpactSidecarRegistry.ts` (bootstrap-owned
    host-private registry API and exact context-identity lifecycle).
  - `src/presentation/vscode/webview/scheduleImpactCalendarPanel.ts`,
    `scheduleImpactCalendarSessionRegistry.ts`, and
    `scheduleImpactCalendarTransport.ts` (panel, registry, closed calendar
    envelope, byte-limit and epoch ownership).
  - `src/bootstrap/extension/createScheduleAwareExplorerSession.ts`
    (calendar-owned companion that opens the existing Explorer exactly once for
    either impact state; available path owns register → session/panel creation
    → parent composite `onDidDispose` release, unavailable path skips registry
    and action; atomic rollback and no child sidecar release).
  - `src/presentation/webview/editor/scheduleImpactCalendarBridge.ts` (plain
    browser-safe ready/refresh/host-message bridge only; no visible action or
    timeline yet).
  - `src/application/semantic-diff/buildSemanticDiffPresentationArtifacts.ts`
    (command-facing `createBuildSemanticDiffPresentationArtifacts` adapter
    with the additive `BuildSemanticDiffPresentationArtifactsInput` and
    exact comparison-forwarding contract over the existing parser/error union,
    plus the pure builder contract).
  - `src/presentation/vscode/commands/semanticDiffCommand.ts` (inject the
    command-facing adapter into the compare-success block and invoke it
    exactly once; delegate available lifecycle to the companion).
  - `src/bootstrap/extension/semanticDiffWiring.ts` (wire the injected
    builder, companion, private resolver, and parent/child lifecycle
    composition) and
    `src/bootstrap/extension/extensionDependencies.ts` (construct and inject
    the sole parser/comparison/pure-builder adapter, registry, and companion)
    and
    `src/test/suite/scheduleImpactSidecarRegistry.test.ts`, plus
    `src/test/suite/buildSemanticDiffPresentationArtifactsAdapter.test.ts`,
    plus
    `src/test/suite/semanticDiffCommandScheduleImpact.test.ts`, plus
    `src/test/suite/createScheduleAwareExplorerSession.test.ts`, plus
    `src/test/suite/scheduleImpactCalendarTransport.test.ts`,
    `src/test/suite/scheduleImpactCalendarSession.test.ts`,
    `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts`.
  - `package.json` and `src/test/suite/packageManifest.test.ts` are explicit
    no-change guard paths: no command, menu, activation event, custom editor,
    or engine change is permitted in Slice 2.
- Acceptance: the existing `BuildSemanticDiffReportDataInput` remains
  unchanged and the command-facing adapter accepts the additive
  `BuildSemanticDiffPresentationArtifactsInput =
BuildSemanticDiffReportDataInput & { options?: Pick<CompareSemanticDiffOptions,
"scheduleComparisonPeriod"> }`;
  the command omits `options` when no period is selected; the adapter omits
  `options` and `scheduleComparisonPeriod` from the comparison input in that
  case; and a selected period is forwarded as the same value under exactly
  `CompareSemanticDiffInput.options.scheduleComparisonPeriod`. It accepts no
  `period` or `options.period` alias and never sends an `undefined` placeholder.
  The adapter parses each source text once, invokes
  `compareSemanticDiffWithArtifacts` once and
  `buildSemanticDiffPresentationArtifactsFromComparison` once, while the
  compare-success block invokes the injected adapter exactly once. Parser
  failure/cancellation returns the existing error union and performs no
  registration. `not-requested` and `invalid` facts return
  `scheduleImpact.kind === "unavailable"`, preserve the invalid period in the
  existing result, and create no registry entry or calendar action. Evaluated
  facts return `kind === "available"`; both impact states are handed to
  `createScheduleAwareExplorerSession`, which invokes the existing injected
  `OpenSemanticDiffExplorer(context)` exactly once and receives
  `{ sessionId: string, panel: WebviewPanel, dispose(): void }`. Only the
  available path registers by exact context identity and exposes the calendar
  action; both paths attach one parent composite `onDidDispose` release for the
  normal Explorer handle. Comparison failure, cancellation, or session/panel
  creation failure never leaves a registration or partial child. Only parent
  Explorer disposal releases the sidecar; child close destroys only child
  registry/epoch/action handles. Parent-alive retained-artifact reopen resolves
  without recalculation, and late child work cannot mutate or resurrect a
  session.
  Host action resolution never sends the sidecar through the Explorer wire;
  parent/child IDs and calendar action/request IDs are
  distinct; owner registries enforce epochs; exact closed
  request/host/failure/close envelopes reject extra/missing/wrong/non-finite
  fields; every encoded calendar message
  is checked at and over 8 MiB; one open panel is reused; child disposal
  permits reopen with new identity; parent disposal cascades; stale and late
  work cannot affect a newer child; initial/refresh failure behavior preserves
  the specified snapshot semantics; no public action is available from the
  Explorer in this slice.
- Validation: registry register/resolve/release identity and failure/cancel
  matrix; exact adapter input-shape tests for omitted options, omitted period
  field, and selected-period forwarding by object identity to
  `CompareSemanticDiffInput.options.scheduleComparisonPeriod`; parser-
  before/after exactly-once, compare-once, pure-builder-once, and
  command-adapter-once call graph; side-specific parser-error preservation;
  facts-union unavailable/available
  mapping and invalid-result preservation; companion available and unavailable
  call-count tests proving exactly one `OpenSemanticDiffExplorer(context)` and
  a normal Explorer parent handle in both paths; available register → Explorer
  creation → panel `onDidDispose` parent release ordering; unavailable no
  registry/action; atomic rollback on creation failure/cancel; exact
  same-context Explorer creation; parent-only release; child close with
  retained sidecar/context; parent-alive reopen; and late-work tests; full
  envelope/error/parser matrix;
  action/parent/child/registry/epoch ownership; byte-limit
  exact-boundary tests for every message kind; reveal/reopen/new-identity/
  concurrent-session/disposal tests; immutable sidecar/context/display-language
  identity tests; browser-safe bridge and CSP checks; Explorer/report/source/
  Flow regressions; architecture, desktop/web, `rtk pnpm run qlty`, focused
  compiled tests, and build after implementation.
- Production Readiness: validate before mutation, release every child listener,
  child registry entry, epoch, and panel/action handle on child close; release
  the sidecar registry only on parent disposal; isolate child failure, reject
  partial/oversized payloads, suppress late posts/focus/recreation, preserve
  parent state, and use only VS Code `^1.75.0` and browser-safe APIs.
- Approval Boundary: only the listed command caller/injected
  `createBuildSemanticDiffPresentationArtifacts` adapter integration, including
  its additive `BuildSemanticDiffPresentationArtifactsInput` and
  `options.scheduleComparisonPeriod` forwarding/omission contract, pure
  application-builder dependency wiring, internal panel, child-session transport,
  bootstrap-owned sidecar registry,
  `createScheduleAwareExplorerSession` companion,
  `semanticDiffWiring.ts`/`extensionDependencies.ts`, bridge, parent-only
  release lifecycle, tests, and manifest no-change guard. The immutable
  `{ result, summary }`
  context and existing error-union wrapper output remain unchanged by
  predecessor code. No Explorer predecessor hook is added. A visible/public
  Explorer action, timeline/filter UI, new public command/contribution,
  persistent state, telemetry, workflow input/default, sidecar registry
  ownership/API change, or Explorer transport change requires Replanning.
- Dependencies: completion-committed Slice 1 and the existing Explorer host
  registry/session creation contract, including the injected
  `OpenSemanticDiffExplorer` dependency and concrete
  `SemanticDiffExplorerSessionHandle`; if the predecessor exposes a different
  symbol or handle shape, stop at the implementation gate and route Replanning
  before changing this boundary. No predecessor hook change is required.
  Its completed source-text/options adapter contract is consumed by the
  comparison workflow; Slice 2 itself does not depend on that workflow. Slice
  2 is not a user-visible feature and does not make the action reachable.
- Risks: parent/child identity collision, sidecar registry ownership inversion,
  context identity drift, duplicate builder invocation, registration after
  failure/cancel, non-atomic companion rollback, premature parent release,
  accidental child release, resurrection after disposal/reopen, stale request
  acceptance, byte-count mismatch, display-language override, or accidental
  manifest exposure.
  Call-graph, registry lifecycle, exact-envelope, identity, and limit matrices
  are the gate.
- Out of Scope: public Explorer action, candidate/root UI, timeline/filter/
  legend, React rendering, documentation, package contributions, Flow/source
  changes, persistence, and schedule calculation.

### Slice 3: Expose The Accessible Localized Schedule-Impact Timeline

- Status: Planned; blocked on completion-committed Slice 2,
  `semantic-diff-comparison-workflow`, a period-bearing context, and Human
  Approval. The public action remains hidden/disabled and the documented view
  is temporarily unreachable until the workflow dependency is complete.
- Scope: expose one additive `Schedule impact` action from the existing
  Explorer surface; resolve the host-private sidecar into a child calendar
  session; add localized accessible timeline/status sections, separate root
  outcome and run-state filters, explicit root-scope transition labels in the
  filters/legend without treating them as run states, candidate before/after
  display, bounded virtualization, desktop/web parity, webpack bundle wiring,
  and durable user documentation. Explorer's public message contract remains
  unchanged.
- User / Domain Value: reviewers can inspect exact supported schedule effects,
  valid no-runs, partial roots, explicit uncalculated issues, and ambiguous
  candidates in the selected period without confusing them or losing facts.
- Cohesive Change Group: Explorer action adapter, calendar React UI/model/
  accessibility, localization resources, webpack entry, integration/a11y/
  scale tests, and user-facing documentation.
- Planned paths and approval scope:
  - `src/presentation/webview/editor/scheduleImpactCalendar.tsx`,
    `src/presentation/webview/editor/scheduleImpactCalendar/`
    (`ScheduleImpactCalendarApp.tsx`, `scheduleImpactCalendarModel.ts`,
    `scheduleImpactCalendarAccessibility.ts`, and filter/focus helpers) for
    canonical timeline, candidate section, outcome/issue sections, filters,
    keyboard, announcements, high contrast, reflow, and virtualization.
  - `src/resource/i18n/scheduleImpactCalendar.ts`,
    `src/resource/i18n/scheduleImpactCalendar_en.ts`, and
    `src/resource/i18n/scheduleImpactCalendar_ja.ts` for labels, badges,
    errors, and English fallback; `displayLanguage` comes only from the
    immutable parent session.
  - `src/bootstrap/extension/semanticDiffWiring.ts` for the existing Explorer
    action adapter, period-bearing-context gate, and host-private sidecar
    resolution. No change to `semantic-diff-comparison-workflow` is planned in
    this feature; its completion commit is an explicit dependency.
    `webpack.config.js` for the additive `scheduleImpactCalendar` web entry.
    `package.json` remains unchanged and is checked by
    `src/test/suite/packageManifest.test.ts` for no command/menu/activation/
    custom-editor/engine drift.
  - `src/test/suite/scheduleImpactCalendarProjection.test.ts`,
    `src/test/suite/scheduleImpactCalendarView.test.tsx`,
    `src/test/suite/scheduleImpactCalendarAccessibility.test.tsx`,
    `src/test/suite/scheduleImpactCalendarLocalization.test.ts`, and
    `src/test/suite/semanticDiffExplorerScheduleImpact.test.ts` for projection,
    DOM/keyboard/a11y/locale/action/session/desktop-web coverage.
  - `docs/requirements/use-cases/uc-present-schedule-impact.md` (new durable
    use case), `docs/requirements/use-cases/README.md` (index), `README.md`,
    and `CHANGELOG.md` when externally observable behavior is delivered.
- Acceptance: with a completion-committed
  `semantic-diff-comparison-workflow` and period-bearing context, one action
  opens/reveals one child session without re-running. When the period is
  absent, the action is hidden or disabled and the documented view is
  temporarily unreachable; no registration or panel is created. After the
  workflow dependency is available, the action resolves the retained sidecar
  through the Slice 2 companion. Exact period, paths, IDs, side states,
  duplicate occurrences, candidate
  groups, composite source-change references, timeline effects, `Valid no
runs`, and `Uncalculated schedule portions` are rendered. Partial roots show
  both their supported timeline runs and issue section. Both-root pairs,
  root rename/move pairs, and one-sided `removed-root-scope`/
  `added-root-scope` transitions render with counterpart metadata and no
  cross-side run pairing. Root-outcome and run-state selectors are separate
  and conjunctive; scope-transition labels remain outside run-state options;
  global/visible totals and filter no-match remain correct. Immutable inherited
  `displayLanguage` selects Japanese or English and unknown locale falls back
  to English without changing sort/date/IDs. Empty, zero-only, mixed, invalid,
  malformed, stale, oversized, disposed, reopened, candidate-only, and
  10,000-entry cases have explicit accessible outcomes with no silent
  merge/truncation.
- Validation: pure projection/filter/ordering/ID-display tests; root
  correspondence matrix and scope-transition metadata fixtures; React DOM,
  keyboard/focus/live-region, root-outcome/run-state/scope-transition filter
  and legend tests, candidate and issue-section matrix including target-key
  collision fixtures; axe, forced colors,
  200%/400% reflow, reduced motion;
  virtualization threshold/20-row overscan/first-last/count tests; locale and
  timezone parity; workflow completion/period-bearing-context hidden-disabled
  and enabled-action tests; action/parent-child session/reopen/dispose/late tests;
  bundle/CSP/manifest and architecture checks; report/JSON/Flow/source/copy/
  schedule regressions; desktop and web suites; `rtk pnpm run qlty` and
  `rtk pnpm run lint:md`.
- Production Readiness: memoize projection/filtering, bound DOM to fewer than
  300 item nodes for the 10,000-entry fixed viewport, preserve stable IDs and
  exact counts/order, escape raw values, keep error snapshots isolated, clean
  up handles, avoid sensitive/new telemetry, and maintain VS Code `^1.75.0`
  desktop/web parity.
- Approval Boundary: only the additive Explorer action adapter, calendar
  webview/resources/bundle, named tests, use-case/index, README, and required
  CHANGELOG entry. A visual month/week grid, schedule meaning, JSON/report/
  Flow/source contract, new command or activation, comparison workflow input,
  persistence, telemetry, editing, or predecessor change requires Replanning.
- Dependencies: completion-committed Slice 2 and the completion-committed
  `semantic-diff-comparison-workflow`, with a period-bearing context supplied
  by that workflow. The action is intentionally hidden/disabled until the
  workflow dependency is complete and Slice 3 is implemented and approved;
  the documented view is temporarily unreachable before then. Slice 3 does
  not alter the Explorer contract; it adds only a host-private action
  integration. The Wave 4 roadmap entry already records this dependency before
  public delivery.
- Risks: action wiring drift, hidden focus, screen-reader gaps, locale leakage,
  root/run filter conflation, timezone conversion, large DOM, candidate
  misclassification, or stale child identity. A11y, locale, root/candidate,
  lifecycle, scale, and predecessor regression matrices are the gate.
- Out of Scope: schedule calculation, month/week grid, runtime history,
  external calendars, WebAPI comparison, Flow/source redesign, JSON/report
  changes, editing, persistence, new telemetry, and package contributions.

## Cross-Slice Approval And Production Readiness

- Implement, independently review, Completion-approve, and commit exactly one
  slice before starting the next. No slice is implementation-authorized by
  this replan alone.
- The dependency chain is strict: schedule/structured-output predecessor
  contracts → Slice 1 pure comparison artifacts/sidecar → Slice 2 command and
  bootstrap integration plus internal calendar foundation → completion-committed
  `semantic-diff-comparison-workflow` with period-bearing context → Slice 3
  public action and visible timeline. Slice 2 must not expose a user-reachable
  action; Slice 3 is the first public surface.
- Every slice preserves the existing Explorer public message union,
  immutable `SemanticDiffOutputContext` shape `{ result, summary }`, stable
  `scheduleComparison.runChanges` ID/order semantics, JSON version 1, report
  modes, Flow/source/viewer messages, VS Code `^1.75.0`, zero-exception
  architecture rules, JP1/AJS3 v13 limits, privacy, and desktop/web behavior.
- The internal application contract
  `compareSemanticDiffWithArtifacts(input: CompareSemanticDiffInput)` performs
  identity comparison and schedule evaluation once each and returns
  `{ result, scheduleProjectionFacts }`. `ScheduleProjectionFacts` is
  `not-requested` without a period, `invalid` with `{ period, issues }`, or
  `evaluated` with `{ period, before: { rootProjections, statuses, issues },
after: { rootProjections, statuses, issues }, correspondence }`. Existing
  `compareSemanticDiff(input)` remains the public `.result` wrapper. Slice 1's
  pure `buildSemanticDiffPresentationArtifactsFromComparison({ result,
  scheduleProjectionFacts })` calls `buildSemanticDiffOutputContext(result)`
  exactly once and creates `{ context, scheduleImpact }` without
  re-evaluation. In Slice 2, the existing
  `BuildSemanticDiffReportDataInput` remains unchanged and
  `createBuildSemanticDiffPresentationArtifacts(parser, compareWithArtifacts,
  builder)` accepts the additive
  `BuildSemanticDiffPresentationArtifactsInput =
  BuildSemanticDiffReportDataInput & { options?: Pick<CompareSemanticDiffOptions,
  "scheduleComparisonPeriod"> }`; it parses each source exactly once,
  forwards a selected period under the exact
  `options.scheduleComparisonPeriod` field, omits `options`/the field when no
  period is supplied, and is invoked by the
  compare-success block exactly once; the bootstrap-owned
  `createScheduleAwareExplorerSession` companion consumes both impact states
  and invokes `OpenSemanticDiffExplorer(context)` exactly once, returning
  `SemanticDiffExplorerSessionHandle` → parent composite `onDidDispose`
  release. Only available impact owns register/action; unavailable impact skips
  both while still returning the normal parent handle. Creation failure/cancel
  rolls back available registration and disposes normal/partial resources;
  child close never releases the sidecar; parent disposal does.
- Root correspondence remains the closed matrix: both-root pair,
  root-to-non-root `removed-root-scope`/`added-root-scope` one-sided metadata,
  non-root exclusion, rename/move pair, and separate ambiguous candidates.
  Scope-transition metadata never creates cross-side run pairing, and Slice 3
  filters/legend distinguish it from run-state effects.
- No calendar sidecar, transport, or UI path may import parser internals,
  infrastructure, Node built-ins, VS Code, or UI frameworks across the
  documented architecture boundaries. Concrete host construction remains in
  bootstrap/presentation adapters; webview consumes plain DTOs.
- All invalid references, malformed messages, stale IDs/epochs, oversized
  encoded messages, and unsupported/uncalculated facts fail closed without
  partial mutation. No locale, host clock, timezone, or browser locale may
  change facts or ordering.
- Replanning is required for any predecessor contract/JSON/report/Explorer
  message change, new schedule or risk meaning, new comparison input,
  candidate policy, root correspondence or scope-transition meaning,
  application wrapper output, sidecar registry ownership/API, action/command/
  contribution, persistence, external data, Flow/source redesign, visual
  calendar grid, or compatibility-floor increase.

## Traceability

- `TRACEABILITY.md` is required and maps CAL requirements to the three slices,
  concrete approval paths, tests, and durable documentation.
- The sidecar identity, composite source-change resolution, root matrix,
  internal artifact contract, and pure application builder are Slice 1-owned;
  command caller/injection, bootstrap registry, same-context Explorer
  resolution, companion atomic lifecycle, transport, and lifecycle are Slice
  2-owned; public action, workflow period gate, presentation, filters/legend,
  localization, and durable use-case documentation are Slice 3-owned. No
  requirement is left to an unassigned slice.

## Feature Exit

- Definition of Done status: Not started; all three slices require independent
  implementation review, Completion Approval, and focused commits.
- Durable documentation: `uc-present-schedule-impact.md` and its index entry
  must be complete when the feature becomes observable; README and CHANGELOG
  evaluation is recorded in Slice 3. `docs/specs/roadmap.md` already records
  the Wave 4 entry and the `semantic-diff-comparison-workflow` completion plus
  period-bearing-context dependency.
- Open risks: predecessor completion may expose insufficient complete side
  arrays or issue ownership; any such contract widening returns to Main for
  Replanning before implementation.

## Validation

- [x] The original plan and first Replanning package received independent
      `plan-reviewer` `Ready` verdicts with no Findings (historical evidence).
- [x] The latest second-Replanning package receives an independent
      `plan-reviewer` `Ready` verdict with no Findings.
- [x] Human Approval is recorded for the original Slice 1, first and second
      Replanning, and third targeted Replanning delta paths; the focused third
      plan/replan commit `11615026` is complete.
- [x] Slice 1 proves exact root/candidate selection, the full root/non-root
      correspondence matrix, `scopeTransition` metadata and no-cross-side
      pairing, one identity comparison and one schedule evaluation in
      `compareSemanticDiffWithArtifacts`, public `.result` compatibility, the
      `ScheduleProjectionFacts` not-requested/invalid/evaluated union, pure
      `buildSemanticDiffPresentationArtifactsFromComparison` artifact identity,
      exactly one `buildSemanticDiffOutputContext(result)` call, unchanged
      `{ result, summary }` context, complete outcome/issues,
      length-prefixed IDs, occurrence pairing, composite source-change
      resolution, issue target-key collision safety, allowed added/removed and
      changed-time same-effect shared references, cross-effect rejection, strict
      validation, and deterministic ordering. Slice 1 has no command caller or
      bootstrap wiring.
- [x] Third targeted Replanning delta received independent `plan-reviewer`
      `Ready` review with no Findings and Main's Human Approval for the exact
      differ, sidecar, focused-rule, focused-impact, end-to-end
      comparison-artifact, calendar, and normative-SPECS paths; its focused
      plan/replan commit is `11615026`.
- [x] Third delta proves the real `semanticDiffScheduleDiffer` preserves
      duplicate records, pairs duplicate/count-mismatch occurrences into real
      changed-time rows plus unmatched extras, groups by source identity/date/
      rule, and emits approved deterministic detail/timeline/rule order; the
      sidecar isolates nested source units and the end-to-end comparison path
      resolves every reference against its actual upstream `runChanges`.
- [x] Independent `implementation-reviewer` review of the exact completed
      Slice 1 paths returned `Ready` with no Findings, including public
      run-change ordering compatibility, source-aware pairing, exact
      references, report/JSON and Explorer regressions, and desktop/web
      validation evidence.
- [x] Main recorded automatic Completion Approval for Slice 1 on 2026-09-10
      in the current conversation under the user's no-findings instruction;
      the exact completion paths and evidence are recorded above, and the
      focused completion commit is eligible and pending.
- [ ] Slice 2 proves the additive
      `BuildSemanticDiffPresentationArtifactsInput` shape, omitted
      `options`/period-field behavior, and selected-period forwarding under
      `CompareSemanticDiffInput.options.scheduleComparisonPeriod`; it proves
      the parser/comparison/pure-builder command adapter and its injected
      command call are each exactly once, returning the existing
      parser-error union on failure/cancel; not-requested/invalid produce
      unavailable impact with no registry/action while invalid result output is
      preserved; evaluated produces available impact; the companion invokes
      `OpenSemanticDiffExplorer(context)` exactly once and returns the normal
      parent handle for both states; only available uses atomic register →
      Explorer creation → panel `onDidDispose` parent composite release,
      unavailable skips registry/action; rollback on creation failure/cancel;
      bootstrap
      registry register/resolve/release by exact context identity; parent-only
      sidecar release; child close handle/epoch disposal with retained
      sidecar/context; parent-alive reopen; late-work suppression; separate
      parent/child IDs and closed calendar transport; registry/epoch ownership;
      per-message 8 MiB enforcement; immutable language inheritance; and
      reopen/new identity while keeping the action unavailable.
- [ ] Slice 3 proves separate root-outcome/run-state filters, scope-transition
      filters/legend, partial/timeline/issue sections, candidate groups,
      English/Japanese/fallback resources, workflow completion and
      period-bearing-context hidden/disabled then enabled action behavior,
      accessible keyboard/desktop/web behavior, bounded rendering, and durable
      use-case/index/docs lint plus the corrected roadmap dependency.
- [x] Existing Semantic Diff result/context, JSON/report, Explorer, Flow,
      source, copy, schedule, and normal viewer regressions remain passing.
- [x] Risk-based validation for the current Slice 1 implementation completed:
      compile, focused 67-test Mocha run, JSON/contract/schedule/Explorer pure
      regression Mocha run (54 passing), report and host-bound Explorer
      coverage in the desktop extension-host run, desktop/web builds, and
      desktop/web extension-host tests. Desktop exited 0 with the existing
      macOS codesign warning; web exited 0 with existing EPIPE/Premature-close
      stream-cleanup warnings. `qlty:check` passed with no issues;
      `qlty:smells` completed with advisory complexity/duplication findings
      only; markdown lint passed with 0 errors; and `git diff --check` passed.
- [x] The authorized feature-author prepared and validated the `SPECS.md`
      source-unit-identity/date/rule normative pairing rule with preserved
      root/side semantics and deterministic duplicate handling.

## Notes

- Keep durable behavior and boundary decisions in `SPECS.md`; this replan is
  limited to implementation slices, approval boundaries, validation, and
  traceability in `TASKS.md` and `TRACEABILITY.md`.
- The sidecar's `sourceChangeRef` is a composite foreign reference to the
  predecessor's stable `scheduleComparison.runChanges` array; resolve by
  `(id, occurrenceOrdinal)` and never use a sidecar ID as a replacement or
  modify the predecessor schema to accommodate it. Shared references are
  valid only within one sidecar effect ID: one side run plus its added/removed
  timeline item, or before/after runs plus their changed-time timeline item;
  cross-effect reuse is rejected by the fixtures.
- Keep `SemanticDiffOutputContext` exactly immutable `{ result, summary }`.
  `compareSemanticDiffWithArtifacts(input: CompareSemanticDiffInput)` owns one
  identity comparison and one schedule evaluation and returns
  `{ result, scheduleProjectionFacts }`; the facts union explicitly represents
  not-requested, invalid, and evaluated states. The pure
  `buildSemanticDiffPresentationArtifactsFromComparison({ result,
scheduleProjectionFacts })` calls `buildSemanticDiffOutputContext(result)`
  once. Slice 2's `createBuildSemanticDiffPresentationArtifacts` adapter
  accepts the additive `BuildSemanticDiffPresentationArtifactsInput` type,
  omits `options`/the field when absent, forwards a selected period under the
  exact `options.scheduleComparisonPeriod` field, parses each source once,
  and the command calls it once, then
  `createScheduleAwareExplorerSession` owns registration,
  `OpenSemanticDiffExplorer(context)` and its concrete session handle, panel
  disposal subscription, and parent `onDidDispose` release. Failure/cancel
  must roll back atomically; child close retains the sidecar/context; reopen
  and late-work tests must prove reuse without recalculation.
- The public action remains hidden/disabled without a period-bearing context
  from the completion-committed `semantic-diff-comparison-workflow`. The Wave 4
  roadmap entry and its internal Calendar Slices 1–2 → workflow → public Slice
  3 dependency are already synchronized.
