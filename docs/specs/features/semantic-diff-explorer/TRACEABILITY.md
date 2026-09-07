# Requirements Traceability: Semantic Diff Explorer

<!-- markdownlint-disable MD013 MD060 -->

| Use case / requirement                                         | SPECS.md section                                                                               | Implementation slice | Test or validation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EXP-1: successful file comparison opens one dedicated explorer | Requirements; Behavioral Scenarios; Session, Transport, And Lifecycle Contract                 | Slice 2              | One comparison-completion context identity, Explorer-default command/wiring, panel lifecycle, failure, desktop/web bundle tests                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| EXP-2: canonical summary and deterministic hierarchy           | Requirement EXP-2; Summary, Hierarchy, And Filter                                              | Slices 1-2           | `context.summary` sole-source spy, zero buckets, grouping/order, shuffled input, empty/mixed and 10,000-leaf tests                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| EXP-3: confirmation filter preserves immutable session         | Requirement EXP-3; Behavioral Scenarios; Summary, Hierarchy, And Filter                        | Slices 1-2, 6        | Projection filter/pruning plus actual host-session/DOM proof that ordinary record IDs disappear, confirmation records and confirmation-required changes remain, canonical cards stay unchanged, zero-match status is visible, and latent selection/context/session restore after repeated toggles                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| EXP-4: every upstream fact remains distinguishable             | Requirement EXP-4; Closed Target-Side And Relation Contract                                    | Slices 1-2           | All change/confirmation/unsupported/limitation/schedule variants, exhaustive five-kind and nine-reason side table, localization tests                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| EXP-5: exact side-specific source reveal                       | Requirement EXP-5; Source-Index Boundary                                                       | Slice 3              | Exact source-index DTO/range/unit-entry/parameter-occurrence shapes, runtime allocator namespace/membership and cross-brand validation, same-pass normalized-document/index identity, fixed private `lookup` union and `unit-missing` duplicate-ID outcome, ANTLR `unitAttribute`/`unitParameter` ranges, header fallback, UTF-16/CRLF/Unicode/duplicate/malformed, decoded `openTextDocument().getText()` revalidation including Shift_JIS/BOM, immutable Git provider, retained before/after snapshots, no-action-parse, stale/missing/unavailable/disposed tests                                                                                                                                                                                                           |
| EXP-6: reuse Flow and focus correct side/target                | Requirement EXP-6; Closed Target-Side And Relation Contract                                    | Slice 4              | Formal `(source,target,type,occurrenceOrdinal)` IDs, actual `FlowGraphNodeDto["id"]`/`FlowGraphEdgeDto["id"]` membership, duplicate canonical-pair mapping/remap and lowest-ordinal focus, before removed/after added-change, existing `changeDocument`/`revealUnit`/`ready` paths, nested scope, pre-ready revalidation, absent target, normal Flow, host tests                                                                                                                                                                                                                                                                                                                                                                                                              |
| EXP-7: Flow states preserve IDs and accessible labels          | Requirement EXP-7; Flow Accessibility And Detail Ownership                                     | Slice 4              | Exact optional `semanticDiffOverlay` keys/null/absent semantics, actual graph node/edge ID validator and cross-kind rejection, validator/subscription/controller/state propagation, explicit DTO/React Flow IDs, existing-message/no-new-variant check, duplicate-count `aria-live`, relation non-focusable DOM, pattern/legend, badge/name, axe, high-contrast/minimap tests                                                                                                                                                                                                                                                                                                                                                                                                 |
| EXP-8: same-session Markdown without implicit copy             | Requirement EXP-8; Session, Transport, And Lifecycle Contract                                  | Slice 2              | Common picker/`presentSemanticDiffOutput(context, mode)` call identity for all four modes, no recompare/reaggregate, provider, cache/disposal, explicit-copy regressions                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| EXP-9: keyboard, focus, announcements, high contrast           | Requirement EXP-9; Flow Accessibility And Detail Ownership                                     | Slices 2-5, 13       | Tree key matrix, roving/async focus, aria-live endpoint/state, immediate pre-source/pre-Flow validation, MUI focus/target-size/reflow/theme checks, `axe-core`, forced-colors, manual keyboard/contrast/reflow, and destination focus tests                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| EXP-10: read-only with no matching/edit/persistence            | Requirement EXP-10; Session, Transport, And Lifecycle Contract                                 | Slices 1-4           | Closed action union, pairwise-distinct source/session/action brands with runtime prefix/membership validation, actual `SemanticDiffResult.changes[].id`/`confirmationRequired[].id` membership for overlay IDs without a new allocator, Flow actual-ID/state-only optional augmentation, `error.detail.targetId` restricted to exact semantic unit ID or null, immutability, no save/edit/persisted-review-state tests                                                                                                                                                                                                                                                                                                                                                        |
| N-1: cards, filter, hierarchy, source jump                     | Origin; Requirements                                                                           | Slices 1-3           | Projection, Explorer DOM/a11y/scale, source navigation suites                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| E-4: tree-to-Flow and semantic states reuse Flow               | Origin; Requirements                                                                           | Slice 4              | `FlowGraphEdgeDto.id`/shared key with occurrence ordinal, seq/con duplicates and before/after graph builders, existing message/controller/renderer integration and Flow regressions                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Predecessor contracts are consumed intact                      | Architecture; Impact Analysis; Session, Transport, And Lifecycle Contract                      | Slices 1-4           | Imported context/summary/dispatcher, no-reconstruction spies, stable IDs/counts/reasons, unchanged `AjsParserPort` and current file output-context builder call shape, future calendar callback seam as an explicit post-approval integration, predecessor goldens                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| VS Code 1.75, architecture, desktop/web, privacy               | Compatibility; Architecture                                                                    | Slices 1-4           | Architecture, host registry ownership, strict messages, build, qlty, desktop/web, no type/content leakage                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Empty, malformed, stale, disposed, and large sessions          | Acceptance Criteria; Session, Transport, And Lifecycle Contract                                | Slices 1-4           | Empty/filter-empty, malformed/late, strict null/extra/error/correlation, 8 MiB oversized, stale decoded source, unavailable Flow, 10,000-leaf/large-overlay tests                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Closed transport and disposal lifecycle                        | Session, Transport, And Lifecycle Contract                                                     | Slices 1-4           | Explorer request/reply/host closed unions, exact keys/nulls, `SemanticDiffExplorerSessionId`/`SemanticDiffExplorerActionId`, async `OpenSemanticDiffExplorer(context): Promise<SemanticDiffExplorerSessionHandle>` with host-only `WebviewPanel`, Explorer-only 8 MiB bound, existing Flow `{type,data}` reuse, collecting→bound→registered→released scope states, borrowed registry references, unregister-before-release exactly-once disposal, direct release/stale epoch/partial registration/panel failure/cancellation/late completion, idempotent handle/panel disposal, one active overlay per Flow URI                                                                                                                                                               |
| Application source-index boundary                              | Source-Index Boundary; Architecture                                                            | Slice 3              | Exact source-index DTO/range/unit-entry/parameter-occurrence shapes, `AjsParserWithSourceIndexPort` and `ParseAjsWithSourceIndexResult`, scoped lookup/parser/bind/release state machine, allocator brands with runtime prefix/membership checks, same-pass parser/index producer, normalized `AjsUnit.id` mapping with duplicate-path→`unit-missing`, fixed lookup/failure union, ANTLR context/token derivation and header fallback, no URI/TextDocument/parser/domain leakage, exact finite-range/ordinal/malformed tests                                                                                                                                                                                                                                                  |
| Workflow capture and context binding                           | Session, Transport, And Lifecycle Contract; Architecture                                       | Slice 3              | Current file command scoped parser/output-context callback, future calendar callback seam without reverse dependency, begin with both immutable descriptors before builder, exactly two fixed-order enriched-parser calls with second-side continuation after first parser error, typed capture exception mapped to `source-capture-failed` without fake syntax errors, atomic bind to exact context identity, sole-owner/borrowed registry, unregister-before-release rollback, concurrent scope, disposal/stale outcome, one-argument async `OpenSemanticDiffExplorer(context)` resolving the exact host-only session handle, partial cleanup before reject mapped to current `display-failed`/future `explorer-open-failed`, Slice 2 no-op source hook attached by Slice 3 |
| Relation edge and reason-detail ownership                      | Closed Target-Side And Relation Contract; Flow Accessibility And Detail Ownership              | Slice 4              | CanonicalPair-to-all-formal side edge IDs, duplicate highlighting/lowest-ordinal focus/count announcement, IDs/state-only optional augmentation through existing messages, `context.result` lookup with existing change/confirmation IDs, missing-ID safe error, `error.detail.targetId` unit-ID-or-null mapping, no reason/detail wire fields, non-focusable relation DOM/axe tests                                                                                                                                                                                                                                                                                                                                                                                          |
| EXP-11: MUI design and WCAG 2.2 AA                             | Requirement EXP-11; WCAG 2.2 AA Explorer Matrix; Compatibility; Explorer Interaction And Scale | Slices 5, 13         | Canonical Slice-5-owned `muiTheme.ts`, MUI component/theme integration, static CSP assertions, desktop/web bundle smoke, applicable criteria 1.1.1/1.3.1/1.3.2/1.3.4/1.4.1/1.4.3/1.4.4/1.4.10/1.4.11/1.4.12/2.1.1/2.1.2/2.4.1/2.4.2/2.4.3/2.4.6/2.4.7/2.4.11/2.4.13/2.5.2/2.5.3/2.5.7/2.5.8/3.1.1/3.1.2/3.2.1/3.2.2/3.2.4/3.3.1/3.3.2/4.1.2/4.1.3 evidence, explicit N/A rationale, 4.5:1/3:1 text contrast, 3:1 non-text/focus contrast, 2 CSS-pixel focus perimeter, 24x24 AA floor/44x44 product target, 200% text resize, 400%/320 CSS px reflow, `axe-core`, and manual checks                                                                                                                                                                                           |
| qlty smell remediation without suppression                     | Acceptance Criteria; Architecture; Risk-Based Validation                                       | Slices 7-13          | Auditable qlty 0.500.0 baseline in `TASKS.md` (45 analyzed/31 finding files and exact family counts); fresh report is clean for every feature-delta file, including Slice-5 Explorer files and the new shared theme helper; no threshold relaxation, suppression, or allowlist                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Durable report/Flow/user docs reflect delivery                 | Impact Analysis; Acceptance                                                                    | Feature Exit         | Update report/Flow use cases, README, CHANGELOG; evaluate build-semantic-diff                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

<!-- markdownlint-enable MD013 MD060 -->

## Slice 1 Validation Result

Slice 1 implementation evidence (2026-09-06): `semanticDiffExplorerDto.ts`,
`semanticDiffExplorerProjection.ts`, `semanticDiffExplorerMessages.ts`, and
their focused pure tests implement the application projection and closed
transport boundary. The projection consumes the retained
`SemanticDiffOutputContext` and `context.summary` directly, retains one leaf
per upstream record, applies the exhaustive change/reason side table, orders
paths with a locale-neutral UTF-16 comparator, and filters without changing
cards or context identity. The transport parser rejects unknown or extra keys,
invalid correlation IDs, wrong sessions/actions, invalid success/failure
nullability, non-plain JSON values, and messages over the 8 MiB bound.

Validation passed: `rtk pnpm run test:compile`; the focused compiled Mocha
projection/message suite (15 tests); `rtk pnpm run qlty` (`qlty check` clean);
`rtk git diff --check`; and `rtk pnpm run build` (desktop and web bundles,
existing asset-size warnings only). The suite covers closed nested detail,
relation, warning, constraint, unsupported-reason, and schedule contracts;
immutable action lookup mutation attempts; card/tree/filter/root/target-side
invariants; dense-array rejection; candidate and uncalculated fixtures;
same-ID/different-fact deterministic tie-breaking; relationPair-side hierarchy
and duplicate/shuffled/UTF-16 fixtures; no-recalculation access; malformed host
session/failure/close messages; and a payload near the fixed 8 MiB bound. A
broader direct semantic-diff Mocha attempt was not used as a gate
because the repository's raw Node invocation does not configure its existing
`@resource/*` TypeScript path aliases; no existing runtime files were
changed. Independent implementation review was `Ready` with no findings;
Completion Approval was automatically approved under the explicit 2026-09-06
user policy, and the focused completion commit is
`e85d012a8cf475a7ae22fc1401c13a7dc91c82a2`. Aggregate final human approval
remains pending until all four slices are complete.

## Slice 2 Validation Result

Slice 2 implementation evidence (2026-09-07): the existing comparison command
and bootstrap wiring now open the dedicated Semantic Diff Explorer with the
single retained `SemanticDiffOutputContext`. The Explorer has separate
desktop/web bundle wiring, host-owned context and action registries, idempotent
panel disposal with unregister-before-release ordering, and a private no-op
source-lifetime hook reserved for Slice 3. The webview waits for its
session-ID-scoped `ready` request before receiving the session payload;
disposal epochs revalidate asynchronous Output work and posts. Its React
surface renders the summary cards and accessible hierarchical tree, supports
confirmation filtering, full parent/child keyboard navigation, localized
state/reason/detail labels, live announcements, high-contrast-safe labels,
and a `react-virtuoso` path that scrolls before focusing offscreen rows. An
initial nullable-correlation failure is rendered as an explicit status/live
announcement, the tree uses one container tab stop with
`aria-activedescendant`, and confirmation filtering preserves latent
selection while exposing a deterministic visible entry for keyboard focus;
`aria-selected` remains exclusive to the latent item and is restored when the
filter is cleared.
Output uses the shared picker and calls
`presentSemanticDiffOutput(context, mode)` for all four modes without
recomparison or reaggregation.

Validation passed: full `tsc --noEmit`, `rtk pnpm run test:compile`, and the
focused compiled DOM suite (`./node_modules/.bin/mocha --ui tdd
out/test/suite/semanticDiffExplorerDom.test.js`, 7/7) covering localized
change-kind/confirmation/unsupported-kind facts, initial host-failure status
and live announcement, single-tree-tab-stop focus, latent confirmation
selection and selected-state restoration, live keyboard selection
announcements, Virtuoso `scrollToIndex`, and offscreen focus restoration.
Focused compiled desktop tests also cover same-context four-mode Output
handoff/cancellation, exact registry identity and release, ready/session
handshake, strict correlation, nullable oversized initial-session failure,
panel lifecycle and supersession, and disposal during Output. `rtk pnpm run
qlty` passed (`qlty check` clean), as did `rtk git diff --check` and
`rtk pnpm run lint:md`. `rtk pnpm run build` produced desktop and web
production bundles (existing asset-size warnings only), and
`rtk pnpm run test:prepare:desktop` followed by the compiled desktop smoke
(`node ./out/test/runTest.js`) passed. Web development preparation passed with
`rtk pnpm run test:prepare:web`; the browser smoke launcher then failed before
test execution because Chromium terminated at
`bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer.94808:
Permission denied (1100)` and could not be killed (`EPERM`). This is an
environment-only validation risk, not a source failure; desktop jsdom/axe
coverage and both desktop/web bundle compilations provide the alternative
evidence. Source/Flow execution remains out of scope for Slice 2. Independent
implementation review was `Ready` with no findings, Completion Approval was
automatically approved under the explicit 2026-09-06 user policy, and the
focused completion commit is
`01349376da1a76fa0c91a0311b3ab1659f5dc521`. Aggregate final human approval
remains pending until all four slices are complete.

## Slice 3 Validation Result

Slice 3 implementation evidence (2026-09-07): the application now owns the
browser-safe source-index DTO/port and an explicit collecting→bound→registered
→released capture scope. The ANTLR adapter constructs the normalized document
and source index in one raw parse, retaining exact `unitAttribute` headers,
declaration-name ranges, and duplicate parameter-key occurrences with
UTF-16/CRLF/Unicode positions. The current file command supplies the scoped
parser to the existing report builder, binds the exact output context after
successful construction, and the VS Code host retains only opaque side
handles plus immutable decoded snapshots. Source actions use the retained
index and revalidate document text/version, session epoch, and scope activity
before reveal; panel disposal unregisters borrowed context/source entries
before releasing the capture exactly once.

Validation passed full TypeScript checks, compiled tests, the full desktop
extension runner, desktop and web production/build preparation, `qlty`,
markdown lint, and `git diff --check`. Focused coverage includes same-pass
identity and exactly-two-call/order behavior, exact enriched-index runtime
validation and capture-scope membership, parser-error continuation, content
mismatch/extra/post-release rejection, deep-frozen index/binding/host
snapshots, bind/release lifecycle, duplicate normalized IDs and parameter
occurrences, CRLF/Unicode ranges, strict scope-authoritative lookup including
foreign/unregistered indexes, direct-release invalidation, source-capture
registration/Explorer-open exception mapping to current-command
`display-failed`, and the retained-range source action with stale/pre-reveal
revalidation. Partial registration that inserts then throws now performs
idempotent `unregister` before `release`, and its stale registry lookup is
asserted absent. Panel creation rollback, ownership/disposal, and the existing
one-argument Explorer opener seam are covered as well. Direct web browser
smoke remains blocked before test execution by the managed Chromium
`bootstrap_check_in ... Permission denied (1100)` failure; this is an
environment-only risk, while the desktop runner and both bundles passed.
Independent implementation review was `Ready` with no findings. Slice 3
Completion Approval was automatically approved on 2026-09-07 under the
recorded user policy, and the focused completion commit is
`a25d674c67b3e6a9fb03c89a12a745a579bfd655`. Slices 1-4 are now complete;
their historical aggregate approval remains separate from the reopened
MUI/WCAG/filter/qlty replan below.

## Slice 4 Validation Result

Slice 4 implementation evidence (2026-09-07): existing Flow graph producers
now emit collision-free UTF-16 length-prefixed relation IDs with per-owner
occurrence ordinals, and semantic-diff mapping resolves actual before/after
node IDs plus every matching side-specific relation ID. The existing
`changeDocument`, `revealUnit`, and `ready`/`onReady` paths carry a validated
state-only `semanticDiffOverlay`; malformed, cross-kind, missing, stale, and
superseded overlays fail closed. The host adapter reuses `ViewerFactory`,
existing Flow scope/reveal behavior, and one-overlay-per-URI owner tokens.
Flow nodes and relations expose textual states, visible legend/patterns,
forced-colors/high-contrast styling, MiniMap colors, non-focusable relation
edges, and duplicate-relation `aria-live` announcements. No new Flow wire
variant, reason/detail field, renderer, layout, search, comparison, or
telemetry behavior was added.

Validation passed `rtk pnpm run test:compile`, `rtk pnpm run qlty` (`qlty check`
clean), `rtk git diff --check`, `rtk pnpm run build`, desktop/web production
preparation, and the desktop smoke launcher. Focused compiled tests passed for
formal IDs/duplicate mapping, Flow projection/non-focusable edges, semantic
highlight states, overlay validator and viewer-message round trips, Flow host
apply/reveal/revalidation, owner supersession/late clear, Flow accessibility
labels/MiniMap, and Explorer DOM/axe coverage (41 tests across the focused
runs). The representative expanded-graph use-case suite retains one
pre-existing node-order golden mismatch (the implementation's deterministic
order is unchanged by this slice); it is recorded for independent review and
was not broadened into a runtime change. Web browser smoke preparation passed,
but the launcher remains blocked before test execution by the managed
Chromium `bootstrap_check_in ... Permission denied (1100)` environment
failure. VS Code `^1.75.0`, desktop/web composition, architecture boundaries,
and telemetry privacy remain unchanged. The architecture dependency suite also
retains two pre-existing composition-root violations: the existing
`src/infrastructure/parser/AntlrAjsParser.ts` calls the source-index allocator
and `src/presentation/vscode/commands/semanticDiffCommand.ts` calls the source
handle allocator outside bootstrap; Slice 4 does not change either boundary.
Independent implementation review was `Ready` with no findings, Completion
Approval was automatically approved under the explicit 2026-09-06 user policy,
and the focused completion commit is
`aa972a293e34f645d3580fee6234d606e161602b`.

Finding remediation evidence (2026-09-07): nested expanded graph propagation,
all active formal duplicate relation IDs, lowest-ordinal Flow reveal,
host-private duplicate occurrence/target validation, source freshness checks,
latest-base clearing, and per-URI operation guards were added within the
approved Slice 4 boundary. The focused host/Flow/a11y run passed 25 tests;
the expanded-graph suite passed 8 tests with the same pre-existing node-order
golden mismatch. Flow state badges, tooltips, legend, and accessibility labels
now resolve through the active language resources.

P1 occurrence remediation evidence (2026-09-07): a shared application helper
assigns duplicate ordinals in source order before presentation sorting, and
the same ordinal plus exact target is carried through projection, panel
metadata, registry extraction, Flow action resolution, and canonical relation
lookup for changes, confirmations, and unsupported findings. The reversed
same-ID relation regression passed in the 35-test focused projection/Flow/
graph/highlight/host run. Final `rtk pnpm run build`, desktop/web preparation,
and desktop smoke passed; web smoke remains blocked before test execution by
the managed Chromium `bootstrap_check_in ... Permission denied (1100)`
environment failure. `rtk pnpm run qlty:check`, `rtk git diff --check`, and
`rtk pnpm run lint:md` also passed.

## Feature Exit Review (2026-09-07)

- All four implementation slices are complete, independently reviewed `Ready`
  with no findings, automatically completion-approved under the recorded user
  policy, and focused-committed:
  `e85d012a8cf475a7ae22fc1401c13a7dc91c82a2`,
  `01349376da1a76fa0c91a0311b3ab1659f5dc521`,
  `a25d674c67b3e6a9fb03c89a12a745a579bfd655`, and
  `aa972a293e34f645d3580fee6234d606e161602b`.
- EXP-1 through EXP-10, N-1, and E-4 acceptance is satisfied. The retained
  immutable comparison context, read-only explorer, exact source ranges,
  side-specific Flow mapping, accessible state, report handoff, strict
  transport, disposal, and large/malformed/stale handling are all covered by
  the slice evidence above.
- Required validation is complete for focused projection/transport/DOM/axe,
  source-index/capture, Flow/overlay/duplicate-ID, and host lifecycle suites;
  TypeScript checks, `rtk pnpm run test:compile`, `rtk pnpm run qlty:check`,
  build, desktop preparation and smoke, web preparation, Markdown lint, and
  diff checks passed. Direct Chromium web smoke remains blocked before test
  execution by the managed-environment
  `bootstrap_check_in ... Permission denied (1100)` failure; desktop smoke and
  both production bundles passed.
- Durable propagation passed the gate: the report and Flow use cases, both
  README product pages, `CHANGELOG.md`, and `docs/specs/roadmap.md` were
  updated. `uc-build-semantic-diff.md` and architecture/glossary/context
  documents were evaluated and require no update because their neutral
  comparison and boundary contracts remain current.
- Roadmap propagation is complete: the finished Wave 3 Explorer item is no
  longer listed as unfinished work, and the two repository-level verification
  follow-ups have explicit owners and entry conditions; remaining
  comparison-workflow and schedule entries are unchanged.
- Remaining risks are explicitly assigned follow-ups: managed Chromium smoke
  to the CI/host owner, the existing expanded-graph node-order golden mismatch
  to the Flow graph test owner, and the two Slice-3-originating composition-root
  violations to architecture/bootstrap maintainers. Both repository follow-ups
  are recorded in `docs/specs/roadmap.md`; no new design, scope, or
  compatibility decision is required to close this feature.
- Closure recommendation: `Close`.

This is a recommendation only. Aggregate human approval and explicit Closure
Approval remain pending. The proposed focused closure commit will contain the
durable paths `docs/requirements/use-cases/uc-present-semantic-diff-report.md`,
`docs/requirements/use-cases/uc-explore-flow-graph.md`, `README.md`,
`README.en.md`, `CHANGELOG.md`, and `docs/specs/roadmap.md`, plus removal of
the selected `docs/specs/features/semantic-diff-explorer/` folder.

## Replan Traceability (2026-09-07)

The prior `Close` recommendation is superseded. The following slices are
planned, not implemented, and require independent plan review plus Human
Approval before any runtime or test edits:

<!-- markdownlint-disable MD013 MD060 -->

| Replanned slice                                  | Gap or requirement                                                    | Planned evidence and affected boundary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------ | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Slice 5: MUI/WCAG Explorer surface               | EXP-11; EXP-9; CSP/theme/high-contrast/reflow/accessibility evidence  | `src/presentation/webview/shared/muiTheme.ts` is the canonical Slice-5-owned theme helper; `src/presentation/webview/semantic-diff/semanticDiffExplorerView.tsx`, `semanticDiffExplorer.tsx`, `semanticDiffExplorerLocalization.ts`, optional Explorer tree/state helpers, `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts` static CSP assertions, and `src/test/suite/semanticDiffExplorerDom.test.tsx`/`semanticDiffExplorerPanel.test.ts`; complete applicable WCAG 2.2 AA matrix plus explicit N/A rationale, including 200% text resize, 400%/320 CSS px reflow, numeric contrast/focus/target thresholds, 1.1.1/1.3.4/2.4.1/2.4.2/2.5.2/2.5.7/3.1.1/3.1.2/3.2.4, axe/manual, and desktop/web bundle evidence |
| Slice 6A: host identity evidence                 | EXP-3; immutable context/session lifecycle                            | `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts` and `src/test/suite/semanticDiffExplorerPanel.test.ts`; exact `SemanticDiffOutputContext` object identity, retained registry context, emitted session ID, and no clone/rebuild proof                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Slice 6B: actual-session confirmation filter     | EXP-3; filter scenario; visible zero-match feedback                   | `src/test/suite/semanticDiffExplorerDom.test.tsx` sends `createSemanticDiffExplorerSessionMessage` with the 6A session ID to the actual App; exact `(data-record-kind,data-record-id,data-row-id)` tuples prove ordinary exclusion, confirmation retention, zero-match status, cards, and latent selection restore                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Slice 7: application projection/transport smells | qlty findings in closed validators/projection/occurrence helpers      | `semanticDiffExplorerMessages.ts`, `semanticDiffExplorerProjection.ts`, `semanticDiffRecordOccurrence.ts`; strict-union/property/focused regression suites                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Slice 8: source capture/parser smells            | qlty findings in source-index/capture/report-data composition         | `AjsParserWithSourceIndexPort.ts`, `semanticDiffSourceCapture.ts`, `AntlrAjsParser.ts`, `buildSemanticDiffReportData.ts`; parser/capture/architecture/desktop-web suites                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Slice 9: Flow graph/highlight smells             | qlty findings in graph builders/highlight projection                  | `buildExpandedFlowGraph.ts`, `buildFlowGraph.ts`, `buildFlowGraphCore.ts`, `buildSemanticDiffFlowHighlights.ts`; graph IDs/order/large-fixture suites                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Slice 10: Flow overlay/document/message smells   | qlty findings in overlay/document/viewer validation                   | `buildSemanticDiffFlowOverlay.ts`, `flowGraphDocument.ts`, `unitListDocument.ts`, `viewerHostMessages.ts`; exact-key/atomic-rejection/normal viewer suites                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Slice 11: Explorer host/action smells            | qlty findings in panel/registry/actions/command                       | `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts`, `semanticDiffExplorerRegistry.ts`, `semanticDiffExplorerReportAction.ts`, `semanticDiffExplorerSourceAction.ts`, `src/presentation/vscode/commands/semanticDiffCommand.ts`; lifecycle/correlation/reveal/output/desktop suites                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Slice 12: Flow host/wiring smells                | qlty findings in bridge/bootstrap/viewer lifecycle                    | `src/presentation/vscode/semantic-diff/semanticDiffExplorerFlow.ts`, `src/bootstrap/extension/semanticDiffFlowViewerBridge.ts`, `src/bootstrap/extension/semanticDiffWiring.ts`, `src/bootstrap/extension/viewerWiring.ts`, `src/bootstrap/extension/extensionDependencies.ts`, `src/presentation/vscode/webview/ajsDocument.ts`; owner/readiness/architecture/desktop-web suites                                                                                                                                                                                                                                                                                                                                                      |
| Slice 13: Flow/shared MUI presentation smells    | qlty complexity/duplication in Flow components and shared theme paths | `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`, `FlowGraphCanvas.tsx`, `flowGraphView.ts`, `flowMiniMap.ts`, `nodes/AjsNode.tsx`, `src/presentation/webview/editor/ajsTable/TableContents.tsx`; consumes (does not own) `src/presentation/webview/shared/muiTheme.ts`; Flow/table DOM/axe/manual and bundle suites                                                                                                                                                                                                                                                                                                                                                                                                         |

<!-- markdownlint-enable MD013 MD060 -->

The fresh 2026-09-07 `rtk pnpm run qlty:smells` report is the baseline for
Slices 7-13. Remediation must make the report clean for the feature delta by
extracting cohesive helpers and preserving behavior; suppressions,
allowlists, threshold changes, and unverified metrics-only waivers are not
acceptable. The managed Chromium startup permission failure remains an
environment-owned validation risk whenever web smoke is attempted.

## Replan Compatibility, Lifecycle, And Predecessor Traceability

<!-- markdownlint-disable MD013 MD060 -->

| Slice | Predecessor contract preserved                                                                           | Lifecycle/compatibility evidence and exact boundary                                                                                                                                                                                                                                                                                                                                                                              |
| ----- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5     | Slice 2's closed Explorer messages, tree roles, action IDs, and existing webview entry                   | `src/presentation/webview/shared/muiTheme.ts` is the sole MUI theme owner; `semanticDiffExplorerView.tsx`, `semanticDiffExplorer.tsx`, `semanticDiffExplorerLocalization.ts`, optional tree/state helpers, and `src/test/suite/semanticDiffExplorerDom.test.tsx` preserve DTO-only presentation; `semanticDiffExplorerPanel.test.ts` statically proves CSP; VS Code `^1.75.0`, desktop/web bundles, and no remote assets remain. |
| 6A    | Slice 3's exact immutable `SemanticDiffOutputContext` and Slice 2's session registry                     | `semanticDiffExplorerPanel.ts` plus `semanticDiffExplorerPanel.test.ts` prove same-object host handoff, borrowed registry identity, exact session ID, disposal epoch, and no clone/rebuild before message emission.                                                                                                                                                                                                              |
| 6B    | Slice 1's projection predicate and Slice 2's App/session-message contract                                | `semanticDiffExplorerDom.test.tsx` uses the exact host-emitted session ID and `createSemanticDiffExplorerSessionMessage`; stable `data-row-id`, `data-record-kind`, and `data-record-id` are presentation test hooks only, with cards sourced from the retained summary.                                                                                                                                                         |
| 7     | Structured-output summary/result, risk reason union, strict browser-safe DTOs                            | `src/application/semantic-diff/semanticDiffExplorerMessages.ts`, `semanticDiffExplorerProjection.ts`, and `semanticDiffRecordOccurrence.ts` remain application-only and preserve extra-key rejection, nullability, IDs, payload limits, and O(n) filtering.                                                                                                                                                                      |
| 8     | Slice 3's `AjsParserWithSourceIndexPort`, same-pass capture, and existing `AjsParserPort.parse(content)` | `src/application/parsing/AjsParserWithSourceIndexPort.ts`, `semanticDiffSourceCapture.ts`, `src/infrastructure/parser/AntlrAjsParser.ts`, and `buildSemanticDiffReportData.ts` retain normalized document/index identity, scoped ownership, parser-infrastructure ANTLR boundary, and desktop/web-safe application contracts.                                                                                                    |
| 9     | Slice 4's formal Flow node/edge IDs, canonical-pair mapping, deterministic order                         | `buildExpandedFlowGraph.ts`, `buildFlowGraph.ts`, `buildFlowGraphCore.ts`, and `buildSemanticDiffFlowHighlights.ts` preserve duplicate ordinal IDs, side-specific mapping, non-focusable relation edges, large-graph bounds, and existing Flow goldens.                                                                                                                                                                          |
| 10    | Slice 4's optional `semanticDiffOverlay` in existing `{ type, data }` viewer messages                    | `buildSemanticDiffFlowOverlay.ts`, `flowGraphDocument.ts`, `unitListDocument.ts`, and `viewerHostMessages.ts` preserve exact keys, absent/null/replace semantics, atomic rejection, base document clearing, and no new wire variant.                                                                                                                                                                                             |
| 11    | Slice 2/3 host actions, source-index lookup, report dispatcher, and one-argument opener                  | `semanticDiffExplorerPanel.ts`, `semanticDiffExplorerRegistry.ts`, `semanticDiffExplorerReportAction.ts`, `semanticDiffExplorerSourceAction.ts`, and `semanticDiffCommand.ts` preserve action/session brands, disposal order, current-source revalidation, four-mode output, and VS Code desktop behavior.                                                                                                                       |
| 12    | Slice 4 Flow readiness/reveal and ordinary viewer wiring; bootstrap composition rules                    | `semanticDiffExplorerFlow.ts`, `semanticDiffFlowViewerBridge.ts`, `src/bootstrap/extension/semanticDiffWiring.ts`, `viewerWiring.ts`, `extensionDependencies.ts`, and `ajsDocument.ts` preserve concrete dependency ownership in bootstrap, one overlay per URI, stale-owner guards, telemetry privacy, normal viewer lifecycle, and web-safe imports.                                                                           |
| 13    | Existing Flow/table accessibility and Slice 5's canonical MUI theme API                                  | `FlowContents.tsx`, `FlowGraphCanvas.tsx`, `flowGraphView.ts`, `flowMiniMap.ts`, `nodes/AjsNode.tsx`, and `TableContents.tsx` consume `src/presentation/webview/shared/muiTheme.ts`; no duplicate theme owner, parser/host import, renderer protocol, or Flow/table behavior change.                                                                                                                                             |

<!-- markdownlint-enable MD013 MD060 -->

## Replan Validation Ownership And Environment Boundary

- Static CSP assertions are mandatory before browser claims. Desktop Electron/
  webview smoke is owned by the implementation reviewer after desktop test
  preparation and the compiled runner. Web preparation/build and bundle/CSP
  inspection are owned by the web bundle owner. Browser smoke is owned by the
  CI/permissive-host owner and is only `passed` when Chromium starts,
  `bootstrap_check_in` permission succeeds, and the actual same-session
  fixture runs; the known managed-host permission failure remains
  `blocked-before-execution` until that owner reruns it.
- The complete WCAG matrix in `SPECS.md` is the evidence index. Automated
  jsdom/axe evidence does not claim computed contrast or screen-reader
  behavior; manual light/dark/high-contrast/forced-colors, keyboard,
  focus-obscured, target-size, text-spacing, zoom/reflow, and status-message
  evidence is required for those rows. Primary controls target 44x44 CSS px;
  every smaller control records its allowed 24x24-floor exception.
- Closure-draft paths remain outside this replan: `CHANGELOG.md`, both
  READMEs, the two semantic-diff/Flow use cases, and `docs/specs/roadmap.md`.
  Only the three feature plan documents may be included in the replan commit;
  the historical Slices 1-4 approvals and prior `Close` recommendation are
  not active authorization.
