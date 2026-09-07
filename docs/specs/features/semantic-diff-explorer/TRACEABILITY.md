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

The prior `Close` recommendation is superseded. The replan received final
independent `Ready` review, Human Approval, and focused commit `54ca4005`.
Slice 5 is complete and focused-committed as
`ee76722d0628d2d4e223f6faf13751a7a16a3a35`. The narrow Slice 6 path replan
was focused-committed as `1ede39bb`; Slice 6 is complete and focused-committed
as `6af753e7`. Slice 7 is complete and focused-committed as
`b7c537d3410b2a05fae0487df3fd92fbb6b8f484`. Full `qlty check` then reported
14 committed Slice 7 files as unformatted. Slice 7A completed its approved
formatter-only reconciliation and focused-committed as `c9b97b0d`. Slice 8
completed and focused-committed as
`792842b9d82dfa728f7742fc1ea1fb11e4623bc9`. Slice 9 then completed
independent review and focused commit
`52166c1aef52dca4510bf6e374ba0923317c7135`. The full qlty gate then
reported `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts` as
unformatted. Slice 9A completed its formatter-only implementation and
focused-committed as `d19a38ce` after final `Ready`/no-findings review and
automatic Completion Approval. Slice 10 completed and focused-committed as
`9acfb577` after final `Ready`/no-findings review and automatic Completion
Approval. Slice 11 completed and focused-committed as
`628cc9333ed10d540665cb23329a8e7e3c6af6df` after independent `Ready`/
no-findings review and automatic Completion Approval. Slice 12 then completed
and focused-committed as
`a7905e8fdd905c506627a83d6c86ed1246255298` after independent `Ready`/
no-findings review and automatic Completion Approval. Slice 13's narrow
canonical-theme replan received final independent plan review `Ready` with no
findings and Human Approval on 2026-09-08 under the trusted messages
`承認します。` and repeated `継続して。`; its focused replan commit is
eligible and pending. Implementation remains blocked until that commit. The
closure drafts remain excluded.

<!-- markdownlint-disable MD013 MD060 -->

| Replanned slice                                  | Gap or requirement                                                                | Planned evidence and affected boundary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------ | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Slice 5: MUI/WCAG Explorer surface               | EXP-11; EXP-9; CSP/theme/high-contrast/reflow/accessibility evidence              | `src/presentation/webview/shared/muiTheme.ts` is the canonical Slice-5-owned theme helper; `src/presentation/webview/semantic-diff/semanticDiffExplorerView.tsx`, `semanticDiffExplorer.tsx`, `semanticDiffExplorerLocalization.ts`, optional Explorer tree/state helpers, `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts` static CSP assertions, and `src/test/suite/semanticDiffExplorerDom.test.tsx`/`semanticDiffExplorerPanel.test.ts`; complete applicable WCAG 2.2 AA matrix plus explicit N/A rationale, including 200% text resize, 400%/320 CSS px reflow, numeric contrast/focus/target thresholds, 1.1.1/1.3.4/2.4.1/2.4.2/2.5.2/2.5.7/3.1.1/3.1.2/3.2.4, axe/manual, and desktop/web bundle evidence |
| Slice 6A: host identity evidence                 | EXP-3; immutable context/session lifecycle                                        | `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts` and `src/test/suite/semanticDiffExplorerPanel.test.ts`; exact `SemanticDiffOutputContext` object identity, retained registry context, emitted session ID, and no clone/rebuild proof                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Slice 6B: actual-session confirmation filter     | EXP-3; filter scenario; visible zero-match feedback                               | `src/presentation/webview/semantic-diff/semanticDiffExplorerTree.tsx` renders the approved stable row/group attributes; `src/test/suite/semanticDiffExplorerDom.test.tsx` sends `createSemanticDiffExplorerSessionMessage` with the 6A session ID to the actual App; exact `(data-record-kind,data-record-id,data-row-id)` tuples prove ordinary exclusion, confirmation retention, zero-match status, cards, and latent selection restore                                                                                                                                                                                                                                                                                             |
| Slice 7: application projection/transport smells | qlty findings in closed validators/projection/occurrence helpers                  | `semanticDiffExplorerMessages.ts`, `semanticDiffExplorerProjection.ts`, `semanticDiffRecordOccurrence.ts`; strict-union/property/focused regression suites                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Slice 7A: Slice 7 formatter reconciliation       | full qlty check found 14 committed Slice 7 paths unformatted                      | Exact 14 committed Slice 7 application/test paths listed in `TASKS.md`; mechanical-only diff review, full `rtk pnpm run qlty:check`, targeted smells, and Slice 7 message/projection/DOM/Flow regression evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Slice 8: source capture/parser smells            | qlty findings in source-index/capture/report-data composition                     | `AjsParserWithSourceIndexPort.ts`, `semanticDiffSourceCapture.ts`, `AntlrAjsParser.ts`, `buildSemanticDiffReportData.ts`; parser/capture/architecture/desktop-web suites                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Slice 9: Flow graph/highlight smells             | qlty findings in graph builders/highlight projection                              | `buildExpandedFlowGraph.ts`, `buildFlowGraph.ts`, `buildFlowGraphCore.ts`, `buildSemanticDiffFlowHighlights.ts`; graph IDs/order/large-fixture suites                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Slice 9A: Slice 9 formatter reconciliation       | full qlty check reports the committed Flow-highlight path as unformatted          | Exactly `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts`; formatter-only diff inspection, AST semantic equivalence, targeted smells, graph/highlight and normal Flow suites, and full qlty check with formatters                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Slice 10: Flow overlay/document/message smells   | qlty findings in overlay/document/viewer validation                               | `buildSemanticDiffFlowOverlay.ts`, `flowGraphDocument.ts`, `unitListDocument.ts`, `viewerHostMessages.ts`; exact-key/atomic-rejection/normal viewer suites                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Slice 11: Explorer host/action smells            | qlty findings in panel/registry/actions/command                                   | `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts`, `semanticDiffExplorerRegistry.ts`, `semanticDiffExplorerReportAction.ts`, `semanticDiffExplorerSourceAction.ts`, `src/presentation/vscode/commands/semanticDiffCommand.ts`; lifecycle/correlation/reveal/output/desktop suites                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Slice 12: Flow host/wiring smells                | qlty findings in bridge/bootstrap/viewer lifecycle                                | `src/presentation/vscode/semantic-diff/semanticDiffExplorerFlow.ts`, `src/bootstrap/extension/semanticDiffFlowViewerBridge.ts`, `src/bootstrap/extension/semanticDiffWiring.ts`, `src/bootstrap/extension/viewerWiring.ts`, `src/bootstrap/extension/extensionDependencies.ts`, `src/presentation/vscode/webview/ajsDocument.ts`; owner/readiness/architecture/desktop-web suites                                                                                                                                                                                                                                                                                                                                                      |
| Slice 13: Flow/shared MUI presentation smells    | qlty complexity/duplication in Flow components plus canonical theme API ownership | `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`, `FlowGraphCanvas.tsx`, `flowGraphView.ts`, `flowMiniMap.ts`, `nodes/AjsNode.tsx`, `src/presentation/webview/editor/ajsTable/TableContents.tsx`, and existing `src/presentation/webview/shared/muiTheme.ts`; adds only a backward-compatible mode-aware factory/options API while preserving `semanticDiffExplorerTheme`; Flow/table/Explorer DOM/axe/manual, focused theme, CSP, and bundle suites                                                                                                                                                                                                                                                                         |

<!-- markdownlint-enable MD013 MD060 -->

The fresh 2026-09-07 `rtk pnpm run qlty:smells` report is the baseline for
Slices 7-13. Remediation must make the report clean for the feature delta by
extracting cohesive helpers and preserving behavior; suppressions,
allowlists, threshold changes, and unverified metrics-only waivers are not
acceptable. The managed Chromium startup permission failure remains an
environment-owned validation risk whenever web smoke is attempted.

### Slice 5 Implementation Evidence (2026-09-07)

- Completion commit: `ee76722d0628d2d4e223f6faf13751a7a16a3a35`.
- Delivered the canonical MUI 7 theme and VS Code-token/forced-colors/focus/
  target-size policy in `src/presentation/webview/shared/muiTheme.ts`, then
  migrated only the Semantic Diff Explorer presentation surface and its
  presentation-only tree, keyboard, focus, host-message, and view-state
  helpers. Existing message DTOs, action IDs, session lifecycle, and webview
  entry points are unchanged.
- `semanticDiffExplorerDom.test.tsx` passes 11 focused tests, including axe
  structural checks, localized labels/facts, `確認が必要` filter behavior,
  keyboard parent/child semantics, latent selection restoration, 10,000-leaf
  virtualization, focus restoration, computed 4.5:1/3:1 contrast arithmetic,
  system-color forced-colors styles, focus/name-role-value/status contracts,
  and 200%/400%/320px responsive assertions.
  `semanticDiffExplorerPanel.test.ts` contains static nonce/CSP/no-remote-asset
  assertions; desktop test preparation, the production desktop/web bundles,
  and the compiled Electron runner (`node ./out/test/runTest.js`, exit 0)
  complete successfully. Targeted `qlty smells --no-snippets` is clean for all
  changed Explorer production files, with no suppressions or threshold edits.
- Manual computed contrast, real forced-colors, 200%/400% reflow, focus-
  obscured, screen-reader, and browser status-announcement rows remain
  reviewer/CI evidence. Managed Chromium was attempted but remains
  `blocked-before-execution` by the known host `bootstrap_check_in` permission
  failure; no browser pass is claimed.
- Full repository `qlty check --all --no-fix --no-formatters` reports four
  pre-existing unrelated findings: markdownlint MD041 in
  `.github/ISSUE_TEMPLATE/pull_request_template.md`, MD013 in `CHANGELOG.md`,
  one unused `ParamSymbol` in `src/application/unit-list/`, and one unused
  eslint-disable directive in `src/test/suite/index.ts`. Targeted Slice 5
  qlty check and smells remain clean; no unrelated baseline file was changed.

### Slice 6 Activation (2026-09-07)

- Slice 6 was the active implementation-approved slice after the Slice 5
  completion commit above. Its 6A host identity and 6B real
  `createSemanticDiffExplorerSessionMessage` → MUI App/DOM evidence are
  complete and committed as `6af753e7`; Slices 7-13 remain
  dependency-blocked.
- The narrow replan added
  `src/presentation/webview/semantic-diff/semanticDiffExplorerTree.tsx` to
  Slice 6's approved/cohesive scope without behavior, design, or slice-order
  change. The replan commit is `1ede39bb`.
- The required DOM contract is stable `data-row-id`, `data-record-kind`,
  `data-record-id`, and group `data-row-kind="group"`. Acceptance preserves
  canonical cards, removes ordinary leaves only under `確認が必要`, retains
  confirmation records and confirmation-required changes, exposes visible
  zero-match status, and restores latent selection in the same session.

### Slice 7 Activation (2026-09-07)

- Slice 7 was the sole active implementation-approved slice after Slice 6
  completion commit `6af753e7`. Its application projection, transport, and
  occurrence refactoring completed with independent `Ready`/no-findings
  review, automatic Completion Approval, and focused commit
  `b7c537d3410b2a05fae0487df3fd92fbb6b8f484`.
- The exact assigned qlty families were resolved without suppression,
  allowlisting, threshold changes, or configuration edits. Slice 7A addressed
  only the committed formatter output and focused-committed as `c9b97b0d`;
  Slice 8 completed and focused-committed as
  `792842b9d82dfa728f7742fc1ea1fb11e4623bc9`; Slice 9 then completed and
  focused-committed as
  `52166c1aef52dca4510bf6e374ba0923317c7135`; Slice 9A completed and focused-
  committed as `d19a38ce` after final `Ready`/no-findings review and automatic
  Completion Approval. Slice 10 completed and focused-committed as `9acfb577`
  after final `Ready`/no-findings review and automatic Completion Approval.
  Slice 11 is now active, and Slices 12-13
  remain dependency-blocked.

### Slice 7A Activation (2026-09-07)

- Slice 7A was the sole active approved replan, with focused plan commit
  `aa13b73e` present. Its formatter-only implementation is complete and
  focused-committed as `c9b97b0d`. The trigger was
  the full `rtk pnpm run qlty:check` result after Slice 7 commit
  `b7c537d3410b2a05fae0487df3fd92fbb6b8f484`, which reported exactly 14
  committed Slice 7 paths as unformatted by `prettier:fmt`.
- Scope is formatter-only and behavior-neutral. The exact paths are
  `src/application/semantic-diff/semanticDiffExplorerLeafGuards.ts`,
  `semanticDiffExplorerMessageParsers.ts`,
  `semanticDiffExplorerMessagePrimitives.ts`,
  `semanticDiffExplorerMessages.ts`, `semanticDiffExplorerProjection.ts`,
  `semanticDiffExplorerProjectionLeaves.ts`,
  `semanticDiffExplorerProjectionPaths.ts`,
  `semanticDiffExplorerProjectionSupport.ts`,
  `semanticDiffExplorerProjectionTree.ts`,
  `semanticDiffExplorerRecordGuards.ts`,
  `semanticDiffRecordOccurrence.ts`,
  `semanticDiffExplorerViewGuards.ts`,
  `src/test/suite/semanticDiffExplorerMessages.test.ts`, and
  `src/test/suite/semanticDiffExplorerProjection.test.ts` (the first 12
  application paths are under `src/application/semantic-diff/`).
- Required evidence was a mechanical-only diff review, full `rtk pnpm run
qlty:check` pass, targeted qlty smells, and Slice 7 message/projection/
  DOM/Flow tests. No suppression, exclusion, threshold, generated-ignore, or
  qlty configuration change is allowed. Final independent plan review is
  `Ready` with no findings; Human Approval was granted through the trusted
  user messages `承認します。` and `継続して。` on 2026-09-07.
- Exact approved replan commit paths were only
  `docs/specs/features/semantic-diff-explorer/TASKS.md` and
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`; that focused
  docs-only commit is `aa13b73e`. Formatter implementation commit
  `c9b97b0d` is recorded below. Slice 8 is now active; Slices 9-13 remain
  blocked.

### Slice 7A Implementation Evidence (2026-09-07)

- The repository formatter `qlty fmt` formatted exactly the 14 approved Slice
  7 application/test paths. Mechanical diff inspection found only import
  grouping, line wrapping, trailing-comma, and equivalent parenthesization
  changes; behavior, assertions, exports, DTO/message schemas, and qlty
  policy/configuration are unchanged.
- Full `qlty check --no-fix --no-formatters` passed with no issues. Targeted
  `qlty smells --no-snippets` analyzed the 14 paths cleanly. `rtk pnpm run
test:compile`, production desktop/web `rtk pnpm run build`, the focused
  messages/projection/DOM/Flow suites (42 passing), compiled desktop smoke
  (`node ./out/test/runTest.js`, exit 0), `rtk git diff --check`, and
  `rtk pnpm run lint:md` all passed.
- The six closure drafts remain untouched. Existing production bundle-size
  warnings are unchanged; no browser smoke result is inferred from the build.
  Slice 8 is now active and Slices 9-13 remain dependency-blocked.
- Implementation status: complete; independent implementation review is
  `Ready` with no findings, Completion Approval was automatic, and focused
  completion commit `c9b97b0d` is recorded.

### Slice 8 Activation (2026-09-07)

- Slice 8 was the sole active implementation-approved slice after Slice 7A
  completion commit `c9b97b0d` (following Slice 7 completion commit
  `b7c537d3410b2a05fae0487df3fd92fbb6b8f484`). Its scope was source capture,
  parser locator, and
  report-data composition refactoring only; same-pass capture, parser/source
  DTO behavior, ownership, errors, and the `AjsParserPort.parse(content)`
  compatibility seam remain fixed.
- Exact qlty assignments are preserved from the baseline: `AjsParserWithSourceIndexPort.ts`
  has `manyReturns=3`, `functionComplexity=4`, `totalComplexity=1`, and
  `complexBinary=4`; `semanticDiffSourceCapture.ts` has `manyReturns=3`,
  `functionComplexity=4`, `totalComplexity=1`, and `complexBinary=2`;
  `AntlrAjsParser.ts` has `functionComplexity=1`; and
  `buildSemanticDiffReportData.ts` has `functionComplexity=1`.
- Remediation used cohesive extraction only: no suppression, allowlist,
  threshold, generated-ignore, or qlty configuration change. Slice 8's
  completion commit is `792842b9d82dfa728f7742fc1ea1fb11e4623bc9`; Slice 9's
  focused completion commit is
  `52166c1aef52dca4510bf6e374ba0923317c7135`; Slice 9A completed and focused-
  committed as `d19a38ce` after final `Ready`/no-findings review and automatic
  Completion Approval. Slice 10 completed and focused-committed as `9acfb577`
  after final `Ready`/no-findings review and automatic Completion Approval.
  Slice 11 is now active, and Slices 12-13
  remain dependency-blocked.

### Slice 9 Activation (2026-09-07; completed)

- Slice 9 was the sole active implementation-approved slice after Slice 8
  completion commit `792842b9d82dfa728f7742fc1ea1fb11e4623bc9`. It completed
  with independent `Ready`/no-findings review, automatic Completion Approval,
  and focused commit `52166c1aef52dca4510bf6e374ba0923317c7135`. Its scope is
  Flow graph construction and semantic highlight projection only; formal IDs,
  duplicate ordinals, deterministic order, side mapping, relation-edge
  non-focusability, large-graph bounds, and ordinary Flow behavior remain
  fixed.
- Exact paths are `src/application/flow-graph/buildExpandedFlowGraph.ts`,
  `buildFlowGraph.ts`, `buildFlowGraphCore.ts`, and
  `buildSemanticDiffFlowHighlights.ts`, with the focused graph/use-case/
  highlight tests recorded in `TASKS.md`. Baseline qlty assignments are
  `buildExpandedFlowGraph.ts`: `manyParameters=1`,
  `functionComplexity=6`, `totalComplexity=1`; `buildFlowGraph.ts`:
  `functionComplexity=2`; `buildFlowGraphCore.ts`: zero assigned findings;
  and `buildSemanticDiffFlowHighlights.ts`: `manyParameters=2`,
  `functionComplexity=3`. Other rule families are zero for these files.
- Remediation used cohesive extraction only: no suppression, allowlist,
  threshold, generated-ignore, or qlty configuration change. The full qlty
  gate subsequently reported the committed
  `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts` as
  unformatted. Slice 9A completed and focused-committed as `d19a38ce` after
  final `Ready`/no-findings review and automatic Completion Approval. Slice 10
  completed and focused-committed as `9acfb577`; Slice 11 is now active and
  Slices 12-13 remain
  dependency-blocked.

### Slice 9A Activation (2026-09-08; completed)

- Slice 9A was the sole active narrow replan. It reconciled formatter output for
  exactly `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts`
  after the full qlty gate reported that committed path as unformatted.
  Slice 9's behavior, qlty baseline, tests, and focused completion commit
  `52166c1aef52dca4510bf6e374ba0923317c7135` remain preserved. Focused
  completion commit `d19a38ce` is recorded.
- The scope is formatter-only: mechanical diff review and AST semantic
  equivalence are required, with no runtime/test/schema/ID-order/qlty-policy/
  configuration/suppression change. Targeted smells, graph/highlight and
  normal Flow tests, and full `rtk pnpm run qlty:check` with formatters enabled
  are mandatory evidence.
- Final independent plan review returned `Ready` with no findings. Human
  Approval was granted on 2026-09-08 through the trusted user messages
  `承認します。` and `継続して。`. The exact approved replan paths are
  `docs/specs/features/semantic-diff-explorer/TASKS.md` and
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md` only. The
  formatter-only implementation was independently reviewed `Ready` with no
  findings, automatically completion-approved, and focused-committed as
  `d19a38ce`.

### Slice 9A Implementation Evidence (2026-09-08)

- Slice 9A implementation is complete within the approved formatter-only
  boundary; independent implementation review returned `Ready` with no
  findings and Completion Approval was automatic. Focused completion commit
  `d19a38ce` is recorded; no commit was created by this documentation update.
- The repository formatter changed exactly
  `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts`. The
  resulting diff is limited to wrapping the existing lazy fallback callback in
  `relationIdsForTarget`; no semantic source, test, export, DTO, ID, order,
  highlight, configuration, or qlty-policy change was made.
- AST semantic equivalence against the Slice 9 committed blob passed after
  normalizing away source positions, trivia, and parenthesized-expression
  wrappers. Targeted `qlty smells --no-snippets` returned zero findings; full
  `qlty check --no-fix` passed with formatters enabled; and `git diff --check`
  passed.
- Validation passed `pnpm run test:compile`, desktop test preparation, the
  compiled Electron runner (`node ./out/test/runTest.js`, exit 0), web test
  preparation, and the production desktop/web build. Existing production
  bundle-size warnings remain unchanged. Browser smoke is not claimed.
- The Slice 9 graph/highlight contracts remain preserved: formal Flow IDs,
  duplicate relation ordinals, canonical side mapping, relation-edge
  non-focusability, confirmation precedence, deterministic order, and
  ordinary Flow output are unchanged. No focused tests were edited; they
  remain validation-only as approved.
- Review package: the independent implementation reviewer verified the
  one-file mechanical diff, AST-equivalence output, targeted smells, full
  qlty formatter gate, and existing graph/highlight and normal Flow coverage.
  The review returned `Ready` with no findings; Completion Approval was
  automatic. Slice 10 is complete; Slice 11 may now activate. Slices 12-13
  remain blocked and the six closure drafts remain excluded and untouched.

### Slice 10 Activation (2026-09-08; completed)

- Slice 10 was the sole active implementation-approved slice after Slice 9A
  completion commit `d19a38ce` (with Slice 9 completion commit
  `52166c1aef52dca4510bf6e374ba0923317c7135`). It completed and focused-
  committed as `9acfb577` after independent `Ready`/no-findings review and
  automatic Completion Approval. Its exact
  application/presentation paths are
  `src/application/flow-graph/buildSemanticDiffFlowOverlay.ts`,
  `src/application/flow-graph/flowGraphDocument.ts`,
  `src/application/unit-list/unitListDocument.ts`, and
  `src/presentation/webview/viewerHostMessages.ts`, with focused coverage in
  `src/test/suite/flowGraphDocument.test.ts` and
  `src/test/suite/viewerHostMessages.test.ts`.
- Preserve strict message schemas and extra-key rejection, exact
  node/edge-membership and cross-kind validation, null/absent/replace/clear
  overlay semantics, atomic rejection before mutation, base-document safety,
  and normal Flow behavior without a semantic-diff overlay. No new wire
  variant, reason/detail field, renderer, host lifecycle, or UI behavior is
  authorized.
- The baseline qlty assignment is `buildSemanticDiffFlowOverlay.ts`:
  `manyParameters=1`, `functionComplexity=3`;
  `flowGraphDocument.ts`: `manyParameters=1`, `manyReturns=3`,
  `functionComplexity=8`, `totalComplexity=1`, `complexBinary=2`;
  `unitListDocument.ts`: zero baseline findings; and
  `viewerHostMessages.ts`: `functionComplexity=4`, `complexBinary=1`.
  Remediation must use cohesive extraction only, with no suppression,
  allowlist, threshold, generated-ignore, or qlty configuration change.
- Slice 11 is now the sole active implementation-approved slice. Slices 12-13
  remain dependency-blocked until Slice 11 is independently reviewed `Ready`
  with no findings and focused-committed; closure drafts remain excluded and
  untouched.

### Slice 10 Implementation Evidence (2026-09-08)

- Slice 10 implementation is complete within the approved Flow
  overlay/document/viewer-message boundary; independent review returned
  `Ready` with no findings, Completion Approval was automatic, and focused
  completion commit `9acfb577` is recorded. The public type/export
  surface remains in `flowGraphDocument.ts`; same-boundary helpers split
  projection, overlay parsing and membership, unit/tree reading, and document
  validation without changing the existing DTO contract. `unitListDocument.ts`
  remains unchanged because its baseline smell assignment was zero.
- `buildSemanticDiffFlowOverlay.ts` preserves formal node/edge IDs, duplicate
  relation ordinals, side-specific mapping, deterministic ordering, and
  relation-state projection while extracting tuple expansion and entry-copying
  helpers. Exact overlay and entry keys remain enforced, and node/edge
  cross-kind or stale/missing membership is rejected.
- `viewerHostMessages.ts` still accepts only the existing `{ type, data }`
  union for `resource`, `changeDocument`, and `revealUnit`. Explicit null,
  absent, and replacement overlay behavior remains intact; malformed,
  extra-key, non-plain, invalid-document, and invalid-navigation payloads are
  rejected atomically before viewer state mutation. No reason/detail fields or
  new response variant were added.
- Targeted `qlty smells --no-snippets` over all Slice 10 approved paths and
  same-boundary helpers returned zero findings. The full smell scan contains
  only pre-existing findings in later Slice 11-13 boundaries; `qlty check`
  returned no issues, qlty formatted every changed code path, and
  `git diff --check` passed. No qlty policy or suppression change was made.
- Validation passed `pnpm run test:compile`, desktop preparation and the
  compiled Electron runner (`node ./out/test/runTest.js`, exit 0), web
  preparation, and production desktop/web builds. Existing bundle-size
  warnings remain unchanged. The managed Chromium browser smoke remains
  blocked before test execution by
  `bootstrap_check_in ... Permission denied (1100)`; no browser-smoke pass is
  claimed.
- Compatibility and readiness remain unchanged: VS Code `^1.75.0`, desktop/web
  parity, ordinary Flow behavior, browser-safe transport, architecture
  boundaries, and telemetry privacy are preserved. The six closure drafts
  remain excluded and untouched. Slice 12 is the next approved route;
  conditional automatic Completion Approval applies only after its independent
  implementation review returns `Ready` with no findings.

### Slice 11 Activation (2026-09-08; completed)

- Slice 11 was the sole active implementation-approved slice after Slice 10
  focused completion commit `9acfb577`. Its exact host/action paths were
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerPanel.ts`,
  `semanticDiffExplorerRegistry.ts`, `semanticDiffExplorerReportAction.ts`,
  `semanticDiffExplorerSourceAction.ts`, and
  `src/presentation/vscode/commands/semanticDiffCommand.ts`, with focused
  existing panel, registry, report-action, source-action, and command tests.
- Preserve the one-argument opener, same-context report handoff, exact source
  reveal and current-source revalidation, session/action correlation,
  stale/disposed epochs, payload-size failure, context/action registry
  ownership, unregister-before-release ordering, four-mode output identity,
  display-failed mapping, idempotent disposal, and VS Code `^1.75.0` desktop
  behavior. No new command, wire variant, raw URI/content transport, Flow
  bridge, webview UI, or telemetry behavior is authorized.
- The baseline qlty assignment is `semanticDiffExplorerPanel.ts`:
  `manyParameters=3`, `manyReturns=2`, `functionComplexity=7`,
  `totalComplexity=1`, `complexBinary=1`, `nestedControlFlow=1`;
  `semanticDiffExplorerRegistry.ts`: `functionComplexity=1`;
  `semanticDiffExplorerReportAction.ts`: `manyReturns=1`,
  `functionComplexity=1`; `semanticDiffExplorerSourceAction.ts`:
  `manyReturns=2`, `functionComplexity=2`; and `semanticDiffCommand.ts`:
  `manyReturns=1`, `functionComplexity=4`, `totalComplexity=1`.
  Remediation must use cohesive extraction only, with no suppression,
  allowlist, threshold, generated-ignore, or qlty configuration change.
- Slice 11 is independently reviewed `Ready` with no findings, automatically
  completion-approved, and focused-committed as
  `628cc9333ed10d540665cb23329a8e7e3c6af6df`. Slice 12 then completed and
  focused-committed as `a7905e8fdd905c506627a83d6c86ed1246255298`; Slice 13 is
  now the sole active implementation-approved slice, and the closure drafts
  remain excluded and untouched.

### Slice 11 Implementation Evidence (2026-09-08)

- Slice 11 implementation was complete within the approved VS Code Explorer
  host/action boundary and passed independent implementation review. The
  public panel opener remains one-argument and still returns the host-only
  session handle. Panel installation, request validation/dispatch, transport,
  action routing, lifecycle disposal, report execution, source execution, and
  command step/read/selection/build helpers were extracted into same-boundary
  modules without introducing a new wire variant, command, UI, Flow bridge,
  telemetry event, or configuration path.
- The implementation preserves the exact immutable context handoff for report
  output, four-mode report identity, action/session correlation, strict record
  occurrence lookup, source document/version revalidation before and after
  reveal, stale/disposed epoch guards, fixed payload-size failures, and
  `display-failed` command mapping. Disposal remains idempotent and performs
  context/action unregister before source-lifetime release, including panel
  installation rollback and late completion paths.
- Targeted `pnpm exec qlty smells --no-snippets` over the five approved host
  files and all same-boundary extraction helpers returned zero findings. The
  full `pnpm exec qlty check` gate returned `No issues`; no suppression,
  allowlist, threshold, generated-ignore, or configuration change was made.
  The repository-wide smell report still contains only pre-existing findings
  in the out-of-scope Slice 12-13 boundaries.
- Validation passed `pnpm run test:compile`, `pnpm run build` (desktop and web
  production composition), the compiled desktop runner
  (`pnpm run test:desktop:run`, exit 0), the web runner
  (`pnpm run test:web:run`, exit 0 under the approved host escalation),
  `pnpm run lint:md`, and `git diff --check`. The web runner emitted transient
  stream-close warnings after browser smoke; no source failure was reported.
  Existing webpack bundle-size warnings remain unchanged. No focused tests
  were edited; the approved panel, registry, report-action, source-action,
  and command suites remain the regression evidence.
- Production-readiness evidence remains positive for VS Code `^1.75.0`,
  desktop/web parity, browser-safe transport, privacy, registry ownership,
  source lifetime, and telemetry boundaries. Closure drafts remain excluded
  and untouched. Slice 11's focused completion commit is
  `628cc9333ed10d540665cb23329a8e7e3c6af6df`; Slice 12 then completed and
  focused-committed as `a7905e8fdd905c506627a83d6c86ed1246255298`. Slice 13
  is now the sole approved route.

### Slice 12 Activation (2026-09-08; completed)

- Slice 12 was the sole implementation-approved active slice after Slice 11's
  focused completion commit `628cc9333ed10d540665cb23329a8e7e3c6af6df`.
  Its exact approved paths are
  `src/presentation/vscode/semantic-diff/semanticDiffExplorerFlow.ts`,
  `src/bootstrap/extension/semanticDiffFlowViewerBridge.ts`,
  `src/bootstrap/extension/semanticDiffWiring.ts`,
  `src/bootstrap/extension/viewerWiring.ts`,
  `src/bootstrap/extension/extensionDependencies.ts`, and
  `src/presentation/vscode/webview/ajsDocument.ts`.
- Focused evidence remains
  `src/test/suite/semanticDiffExplorerFlow.test.ts`,
  `src/test/suite/flowViewerController.test.ts`,
  `src/test/suite/flowViewerEffects.test.ts`,
  `src/test/suite/viewerWiring.test.ts`,
  `src/test/suite/AjsDocument.test.ts`, and
  `src/test/suite/architectureDependencyRules.test.ts`. Slice 13's Flow/
  shared-MUI presentation paths were then dependency-blocked; configuration
  and closure drafts remain excluded and untouched.
- The recorded qlty baseline is preserved: `semanticDiffExplorerFlow.ts`
  `P=1,R=5,F=7,T=1,B=1`; `semanticDiffFlowViewerBridge.ts` `F=3`;
  `semanticDiffWiring.ts` `P=1,R=1,F=2,B=1`; `viewerWiring.ts` `R=1,F=4`;
  `extensionDependencies.ts` `F=1`; and `ajsDocument.ts`
  `P=2,R=2,F=4`. Remediation is cohesive extraction only; no suppression,
  allowlist, threshold, generated-ignore, or qlty configuration change.
- Preserve the existing composition and lifecycle contracts: concrete
  infrastructure is constructed only in bootstrap; the Flow viewer bridge
  remains the single overlay owner with one overlay per URI; source-current
  checks, owner-token/operation guards, ready/focus/reveal, stale-source,
  supersession/late-clear, unregister-before-release, normal viewer wiring,
  and privacy-preserving parser performance telemetry remain unchanged.
  Desktop/web parity and browser-safe imports are mandatory. No new viewer
  message variant or architecture exception is authorized.
- Validation is the focused Flow host/wiring/viewer lifecycle suites,
  architecture dependency rules, desktop smoke, web preparation/build,
  targeted smells, full qlty check, and diff checks. These gates passed for
  Slice 12; Slice 13 is held pending its narrow plan review and focused replan
  commit, and closure drafts remain excluded and untouched.

### Slice 12 Implementation Evidence (2026-09-08)

- The approved Flow host/wiring boundary was implemented and focused-committed
  after independent review. Public Flow action types remain in
  `semanticDiffExplorerFlow.ts`; same-boundary helpers own target resolution,
  action preparation, overlay ownership, freshness checks, and post/reveal
  sequencing without adding a viewer message variant or architecture
  exception. The bootstrap-owned Flow bridge preserves ready/reveal/error
  behavior and panel/document identity.
- `semanticDiffWiring.ts` isolates source snapshots, source/document freshness,
  Flow opening, report providers, Explorer composition, and command
  registration. `viewerWiring.ts` preserves the shared WebviewStore, normal
  table/Flow factory lifecycle, pending reveal, navigation telemetry, and
  Flow bridge callbacks. `extensionDependencies.ts` retains
  application-catalog-only parser performance telemetry. `ajsDocument.ts`
  retains debounce, panel-disposal cancellation, callback disposal, and
  posted-document behavior through an internal lifecycle state object.
- Same-boundary extraction helpers are
  `semanticDiffExplorerFlowAction.ts`,
  `semanticDiffExplorerFlowActionPreparation.ts`,
  `semanticDiffExplorerFlowOverlayRegistry.ts`, and
  `semanticDiffExplorerFlowTargets.ts`. The focused Flow test updates registry
  calls to the cohesive options form and adds the reviewed stale-after-ready
  regression; no transport or UI contract changed.
- The implementation-review freshness finding is resolved: the Flow action
  passes its source-freshness guard into `openReadyFlowTarget`, which checks
  immediately after `panel.ready` before relation/target validation. A stale
  source therefore returns `flow-not-ready` even when the ready document also
  lacks the target; the existing final pre-overlay freshness guard remains.
  `semanticDiffExplorerFlow.test.ts` covers this stale-after-ready plus
  missing-target race and asserts no messages are posted.
- Targeted `pnpm exec qlty smells --no-snippets` over all six approved files,
  same-boundary helpers, and the focused Flow test returned zero findings.
  `pnpm exec qlty check` returned `No issues`; no suppression, allowlist,
  threshold, generated-ignore, configuration, or architecture exception was
  changed. Repository-wide smell output retains only pre-existing Flow
  webview findings outside this slice.
- Validation passed `rtk pnpm run test:compile`, desktop preparation and the
  compiled desktop runner (exit 0), web preparation, the escalated web runner
  (exit 0), production `rtk pnpm run build`, and `git diff --check`. The web
  runner emitted transient stream-close warnings after smoke; existing
  webpack bundle-size warnings remain unchanged. Every changed runtime,
  helper, and focused-test path was formatted with `qlty fmt`.
- Production-readiness remains positive for VS Code `^1.75.0`, desktop/web
  bundles, browser-safe imports, bootstrap-only concrete construction,
  one-overlay-per-URI ownership, owner/operation stale guards, source
  freshness, unregister-before-release, normal viewer wiring, and
  privacy-preserving telemetry. Independent review verified the
  lifecycle/concurrency matrix and shared WebviewStore identity. No unresolved
  scope or design change was discovered; focused completion commit
  `a7905e8fdd905c506627a83d6c86ed1246255298` is recorded.

### Slice 13 Activation — Plan Approved; Focused Replan Commit Pending (2026-09-08)

- Slice 13's narrow canonical-theme replan is plan-approved after Slice 12's
  focused completion commit `a7905e8fdd905c506627a83d6c86ed1246255298`.
  Independent plan review returned `Ready` with no findings and Human Approval
  was granted on 2026-09-08 under the trusted messages `承認します。` and
  repeated `継続して。`. The focused replan commit is eligible and pending;
  implementation remains blocked until it is present.
  Its exact webview implementation paths are
  `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`,
  `src/presentation/webview/editor/ajsFlow/FlowGraphCanvas.tsx`,
  `src/presentation/webview/editor/ajsFlow/flowGraphView.ts`,
  `src/presentation/webview/editor/ajsFlow/flowMiniMap.ts`,
  `src/presentation/webview/editor/ajsFlow/nodes/AjsNode.tsx`, and
  `src/presentation/webview/editor/ajsTable/TableContents.tsx`, plus the
  existing canonical theme path
  `src/presentation/webview/shared/muiTheme.ts`.
- The canonical MUI helper remains owned by Slice 5 at
  `src/presentation/webview/shared/muiTheme.ts`. The narrow replan authorizes
  only a backward-compatible `createSemanticDiffTheme(options)` factory with
  typed light/dark mode options for Flow/Table; the existing
  `semanticDiffExplorerTheme` export and behavior remain unchanged. Slice 13
  may not create a second theme, redefine tokens, or break its API. Explorer
  localization, `確認が必要` filtering,
  stable tree row/record attributes, latent selection restoration, cards,
  zero-match status, keyboard/focus behavior, and the WCAG 2.2 AA contract
  remain unchanged while Flow/table presentation smells are removed.
- Focused evidence remains `src/test/suite/flowGraphView.test.ts`,
  `src/test/suite/flowMiniMap.test.ts`,
  `src/test/suite/ajsTableGlobalFilter.test.ts`,
  `src/test/suite/ajsTableHeader.test.ts`,
  `src/test/suite/muiTheme.test.ts` (new focused factory/export tests),
  `src/test/suite/semanticDiffExplorerDom.test.tsx`, and
  `src/test/suite/architectureDependencyRules.test.ts`.
- The recorded qlty assignments are `FlowContents.tsx`:
  `R=2,F=3,T=1,D=1`; `FlowGraphCanvas.tsx`: `F=2`;
  `flowGraphView.ts`: `R=1,F=3`; `AjsNode.tsx`: `F=4`. No standalone
  baseline finding is recorded for `flowMiniMap.ts` or `TableContents.tsx`,
  but their touched-delta duplication/style checks remain mandatory. No
  suppression, allowlist, threshold, generated-ignore, or qlty configuration
  change is authorized. The new `muiTheme.ts` path has no historical baseline
  count and must be qlty-clean with the touched delta. Validation is the
  focused Flow component/view,
  Explorer DOM/axe, table regression, architecture dependency, manual
  keyboard/focus/forced-colors/contrast, target-size, reflow, status, and WCAG
  checks, MUI/Emotion bundle and static CSP smoke, desktop/web bundles and
  smoke, targeted qlty smells, full qlty check, and diff checks. Slice 13
  completion is the final implementation gate after the focused replan commit
  is present and implementation is independently reviewed. Aggregate human
  approval and Feature Exit approval remain pending. No implementation may
  start before the focused replan commit; its exact paths are only TASKS.md
  and TRACEABILITY.md.

### Slice 13 Theme API Replan Review and Human Approval (2026-09-08)

- Final independent plan review returned `Ready` with no findings.
- Human Approval was granted through the trusted messages `承認します。`
  and repeated `継続して。` for the narrow backward-compatible mode-aware
  canonical theme API replan.
- The approved plan extends only the existing
  `src/presentation/webview/shared/muiTheme.ts` with typed
  `createSemanticDiffTheme(options)` mode options, preserves the existing
  `semanticDiffExplorerTheme` export/API, and adds focused
  `src/test/suite/muiTheme.test.ts` coverage. No second theme, qlty
  suppression/configuration change, or broad design change is authorized.
- The focused replan commit is eligible and pending with exact paths only
  `docs/specs/features/semantic-diff-explorer/TASKS.md` and
  `docs/specs/features/semantic-diff-explorer/TRACEABILITY.md`. Slice 13
  implementation remains blocked until that commit; closure drafts remain
  excluded and untouched.

### Slice 6 Implementation Evidence (2026-09-07)

- Completion commit: `6af753e7`.
- 6A host identity is proven by `semanticDiffExplorerPanel.test.ts`: the
  registry entry and session retain the exact `SemanticDiffOutputContext`
  object, including its `result` and `summary`, and the emitted session
  message carries that session's ID and view model.
- 6B actual-session behavior is proven by `semanticDiffExplorerDom.test.tsx`,
  which sends `createSemanticDiffExplorerSessionMessage` with the host session
  ID to the real `SemanticDiffExplorerApp`. Exact record tuples show ordinary
  leaves disappear while confirmation records and confirmation-required
  changes remain; canonical cards are unchanged, zero-match feedback is
  visible, and latent selection returns after clearing the filter.
- Groups expose `data-row-kind="group"`; leaf rows expose stable
  `data-row-id`, `data-record-kind`, and `data-record-id` test hooks. No
  transport, summary, comparison, or accessibility role contract changed.
- Validation passed: `rtk pnpm run test:compile`, desktop and web test
  preparation, compiled Electron runner, focused qlty check, formatter check,
  and `rtk git diff --check`. The focused qlty smells run retains only the
  pre-existing projection/panel complexity findings assigned to later Slice
  7/11 decomposition; no suppressions or thresholds changed.
- Review follow-up: the zero-match assertion targets the explicit
  `p[role="status"]` so MUI summary output elements with implicit status roles
  cannot make the test ambiguous. Runtime and design are unchanged.
- Managed Chromium smoke remains `blocked-before-execution` because the host
  reports `bootstrap_check_in ... Permission denied (1100)`; desktop smoke
  and both production bundles pass, and no browser pass is claimed.
- Implementation feedback: record-level DOM tuples are necessary because
  canonical summary cards intentionally do not change when the tree filter
  changes. The existing projection predicate was correct; the apparent
  no-op was caused by relying on unchanged cards and lacking actual
  App/session-message record evidence. The identity test prevents the
  integration proof from silently using a cloned or rebuilt comparison
  context.

### Slice 7 Implementation Evidence (2026-09-07)

- Completion commit: `b7c537d3410b2a05fae0487df3fd92fbb6b8f484`.
- Slice 7 implementation is complete within the approved application-only
  boundary. `semanticDiffExplorerMessages.ts` now delegates strict primitives,
  record/leaf/view guards, request/reply/host parsers, and payload validation
  to cohesive browser-safe helpers. `semanticDiffExplorerProjection.ts` now
  delegates immutable cloning/action construction, path placement, tree
  ordering, and leaf/card construction to application helpers. The existing
  `semanticDiffRecordOccurrence.ts` lookup keeps source-order ordinals and
  fails closed for invalid occurrence inputs.
- The public entry points and transport schemas are unchanged. Exact keys,
  closed unions, branded session/action IDs, nullability, extra-key rejection,
  wrong-session/action/stale-request handling, malformed nested detail/risk/
  target validation, and the fixed 8 MiB UTF-8 limit remain covered by the
  existing message suite. Summary cards still consume only `context.summary`,
  deterministic UTF-16 tree ordering is retained, duplicate occurrences are
  carried through projection and host lookup, and confirmation filtering
  retains Slice 6's actual-session behavior.
- Validation passed: the focused compiled message/projection/DOM/Flow suites
  report 42 passing tests; `rtk pnpm run test:compile`, desktop/web test
  preparation, `rtk pnpm run build`, compiled Electron smoke (exit 0),
  `rtk git diff --check`, targeted `qlty smells --no-snippets` for all 13
  changed application paths, and `qlty check --no-fix --no-formatters` all
  pass. No qlty suppression, allowlist, threshold, generated-ignore, DTO,
  or configuration edit was introduced.
- The independent-review finding for prototype-looking dynamic-dispatch keys
  is resolved within the approved application boundary: record, leaf, view,
  projection-support, path, and tree lookup tables use `Map`, and focused
  regressions verify malformed target/card/message/leaf/path/side values with
  `toString`, `constructor`, and `__proto__` fail closed without throwing;
  relation-side property access also validates the closed side union first.
- The attempted Chromium web smoke is explicitly
  `blocked-before-execution`: the managed host fails at
  `bootstrap_check_in ... Permission denied (1100)` before the fixture starts.
  Web preparation/build and DOM/axe coverage pass; no browser-smoke success
  is claimed. VS Code `^1.75.0`, desktop/web composition, architecture
  boundaries, and telemetry privacy are unchanged.
- Implementation feedback: validator decomposition kept closed-union checks
  auditable without widening accepted payloads, while projection helpers keep
  source-order occurrence assignment ahead of presentation sorting and avoid
  re-aggregating cards. The independent reviewer should verify the exact
  entry-point/export compatibility and malformed-payload matrix before the
  pending automatic Completion Approval gate.

### Slice 8 Implementation Evidence (2026-09-07)

- Completion commit: `792842b9d82dfa728f7742fc1ea1fb11e4623bc9`.
- Slice 8 refactors the approved source-index/capture/parser/report-data
  boundaries only. The four approved entry points retain their public APIs;
  cohesive application helpers own closed source-index guards, strict lookup
  strategies, immutable freezing, capture validation, binding registry, and
  explicit state transitions. ANTLR range mapping and report-data parse/error
  steps are similarly extracted without moving parser or host types across
  the application boundary.
- Same-pass identity and fixed before-then-after capture remain unchanged.
  Both parser errors remain independently reported; capture order, extra-call,
  release, exact-context binding, borrowed registration, unregister-before-
  release cleanup, UTF-16/CRLF/Unicode ranges, duplicate paths/parameters,
  malformed lookup, and the `AjsParserPort.parse(content)` seam remain
  covered by the existing parser/capture/report tests.
- Validation passed `pnpm run test:compile`, the compiled desktop suite and
  Electron runner (exit 0), web preparation, production desktop/web builds,
  `qlty check --no-fix --no-formatters`, targeted `qlty smells --no-snippets`
  over all Slice 8 entry points/helpers (zero findings), and
  `git diff --check`. The existing production bundle-size warnings are
  unchanged. No qlty policy/configuration or suppression was edited.
- Compatibility impact is none by design: VS Code `^1.75.0`, desktop/web
  composition, architecture boundaries, browser-safe DTOs, normalized-domain
  behavior, and telemetry privacy remain unchanged. Browser smoke is not
  claimed for this application/parser slice; the known managed Chromium
  permission limitation remains a broader feature environment risk.
- Implementation feedback: the source-index and capture helpers must remain
  application-owned and imported type-only from the public contracts to avoid
  a parser/domain or host lifetime leak. The independent reviewer should
  verify the public export surface and the exact lifecycle/error-order matrix.
  Focused completion commit `792842b9d82dfa728f7742fc1ea1fb11e4623bc9` is
  recorded.
- Review follow-up: `qlty fmt` was applied only to the ten assigned Slice 8
  runtime paths: four source-index helpers, the capture facade, four capture
  helpers/registry/scope paths, and `AntlrAjsParser.ts`. The resulting diff is
  mechanical formatter output only. The final targeted smell scan is clean,
  `qlty check --no-fix --no-formatters` passes, and the parser/capture/report/
  architecture desktop suite plus desktop/web builds remain passing.

### Slice 9 Implementation Evidence (2026-09-08)

- Slice 9 implementation is complete within its approved Flow graph and
  semantic-highlight boundary; independent implementation review returned
  `Ready` with no findings, Completion Approval was automatic, and focused
  completion commit `52166c1aef52dca4510bf6e374ba0923317c7135` is recorded.
- `buildExpandedFlowGraph.ts` now separates request validation, ancestor
  collection, expanded node/edge appends, iterative expansion frames,
  containment frames, and sibling-impact constraints. `buildFlowGraph.ts`
  now isolates ancestor and scope validation. `buildSemanticDiffFlowHighlights.ts`
  now uses option objects and cohesive relation/change/confirmation projection
  helpers. `buildFlowGraphCore.ts` required no source change because it had no
  assigned baseline smell.
- The public graph/highlight behavior remains unchanged: formal IDs and
  duplicate ordinals remain generated at the same scope, canonical relation
  pairs resolve to concrete side-specific edges, relation targets do not gain
  node focusability, confirmation-required state still outranks change state,
  and expanded/nested/ordinary Flow traversal remains deterministic and
  bounded.
- Targeted `qlty smells --no-snippets` over all four approved production paths
  returned zero findings. The approved paths were formatted without changing
  qlty policy, and `git diff --check` passed. No suppression, allowlist,
  threshold relaxation, generated-ignore, or configuration edit was made.
- Validation passed `pnpm run test:compile`, desktop test preparation, the
  compiled Electron runner (`node ./out/test/runTest.js`, exit 0), web test
  preparation, and the production desktop/web build. Existing production
  bundle-size warnings remain unchanged; browser smoke was not claimed.
- Compatibility impact is none by design: VS Code `^1.75.0`, desktop/web
  bundles, application architecture, browser-safe DTOs, and telemetry remain
  unchanged. Slice 10 overlay/document/message paths, host/wiring, renderer,
  webview, and closure-draft documents remain outside this implementation.
- Review package: the independent implementation reviewer ran the existing
  graph, expanded-graph, graph-use-case, and semantic-diff-highlight suites
  and verified the Slice 4 ID/order/side-mapping contracts. The review
  returned `Ready` with no findings; Completion Approval was automatic.

## Replan Compatibility, Lifecycle, And Predecessor Traceability

<!-- markdownlint-disable MD013 MD060 -->

| Slice | Predecessor contract preserved                                                                              | Lifecycle/compatibility evidence and exact boundary                                                                                                                                                                                                                                                                                                                                                                              |
| ----- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5     | Slice 2's closed Explorer messages, tree roles, action IDs, and existing webview entry                      | `src/presentation/webview/shared/muiTheme.ts` is the sole MUI theme owner; `semanticDiffExplorerView.tsx`, `semanticDiffExplorer.tsx`, `semanticDiffExplorerLocalization.ts`, optional tree/state helpers, and `src/test/suite/semanticDiffExplorerDom.test.tsx` preserve DTO-only presentation; `semanticDiffExplorerPanel.test.ts` statically proves CSP; VS Code `^1.75.0`, desktop/web bundles, and no remote assets remain. |
| 6A    | Slice 3's exact immutable `SemanticDiffOutputContext` and Slice 2's session registry                        | `semanticDiffExplorerPanel.ts` plus `semanticDiffExplorerPanel.test.ts` prove same-object host handoff, borrowed registry identity, exact session ID, disposal epoch, and no clone/rebuild before message emission.                                                                                                                                                                                                              |
| 6B    | Slice 1's projection predicate and Slice 2's App/session-message contract                                   | `src/presentation/webview/semantic-diff/semanticDiffExplorerTree.tsx` renders stable `data-row-id`, `data-record-kind`, `data-record-id`, and group attributes; `semanticDiffExplorerDom.test.tsx` uses the exact host-emitted session ID and `createSemanticDiffExplorerSessionMessage`, with cards sourced from the retained summary.                                                                                          |
| 7     | Structured-output summary/result, risk reason union, strict browser-safe DTOs                               | `src/application/semantic-diff/semanticDiffExplorerMessages.ts`, `semanticDiffExplorerProjection.ts`, and `semanticDiffRecordOccurrence.ts` remain application-only and preserve extra-key rejection, nullability, IDs, payload limits, and O(n) filtering.                                                                                                                                                                      |
| 8     | Slice 3's `AjsParserWithSourceIndexPort`, same-pass capture, and existing `AjsParserPort.parse(content)`    | `src/application/parsing/AjsParserWithSourceIndexPort.ts`, `semanticDiffSourceCapture.ts`, `src/infrastructure/parser/AntlrAjsParser.ts`, and `buildSemanticDiffReportData.ts` retain normalized document/index identity, scoped ownership, parser-infrastructure ANTLR boundary, and desktop/web-safe application contracts.                                                                                                    |
| 9     | Slice 4's formal Flow node/edge IDs, canonical-pair mapping, deterministic order                            | `buildExpandedFlowGraph.ts`, `buildFlowGraph.ts`, `buildFlowGraphCore.ts`, and `buildSemanticDiffFlowHighlights.ts` preserve duplicate ordinal IDs, side-specific mapping, non-focusable relation edges, large-graph bounds, and existing Flow goldens.                                                                                                                                                                          |
| 9A    | Slice 9's committed Flow-highlight path must satisfy the repository formatter gate                          | Exactly `src/application/flow-graph/buildSemanticDiffFlowHighlights.ts`; formatter-only diff and AST semantic-equivalence evidence preserve all Slice 9 graph/highlight behavior, with targeted smells/tests and full qlty check required.                                                                                                                                                                                       |
| 10    | Slice 4's optional `semanticDiffOverlay` in existing `{ type, data }` viewer messages; held behind Slice 9A | `buildSemanticDiffFlowOverlay.ts`, `flowGraphDocument.ts`, `unitListDocument.ts`, and `viewerHostMessages.ts` preserve exact keys, absent/null/replace semantics, atomic rejection, base document clearing, and no new wire variant.                                                                                                                                                                                             |
| 11    | Slice 2/3 host actions, source-index lookup, report dispatcher, and one-argument opener                     | `semanticDiffExplorerPanel.ts`, `semanticDiffExplorerRegistry.ts`, `semanticDiffExplorerReportAction.ts`, `semanticDiffExplorerSourceAction.ts`, and `semanticDiffCommand.ts` preserve action/session brands, disposal order, current-source revalidation, four-mode output, and VS Code desktop behavior.                                                                                                                       |
| 12    | Slice 4 Flow readiness/reveal and ordinary viewer wiring; bootstrap composition rules                       | `semanticDiffExplorerFlow.ts`, `semanticDiffFlowViewerBridge.ts`, `src/bootstrap/extension/semanticDiffWiring.ts`, `viewerWiring.ts`, `extensionDependencies.ts`, and `ajsDocument.ts` preserve concrete dependency ownership in bootstrap, one overlay per URI, stale-owner guards, telemetry privacy, normal viewer lifecycle, and web-safe imports.                                                                           |
| 13    | Existing Flow/table accessibility and Slice 5's canonical MUI theme API                                     | `FlowContents.tsx`, `FlowGraphCanvas.tsx`, `flowGraphView.ts`, `flowMiniMap.ts`, `nodes/AjsNode.tsx`, and `TableContents.tsx` consume `src/presentation/webview/shared/muiTheme.ts`; no duplicate theme owner, parser/host import, renderer protocol, or Flow/table behavior change.                                                                                                                                             |

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
