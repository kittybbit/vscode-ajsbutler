# Feature Tasks: Flow Image Export

## Agent Brief

- Purpose: Save or copy the full active JP1/AJS flow with its current
  nested-jobnet expansion.
- Slice order: SVG save and source copy, followed by PNG save and image copy.
  Slice 1 is committed and published. Slice 2 implementation is complete and
  awaits independent review.
- Read [requirements and acceptance](SPECS.md#requirements-and-acceptance),
  Slice 2 scope and validation, and [traceability](TRACEABILITY.md).
- Constraints: Preserve existing graph and CSV behavior. Desktop uses the
  VS Code save dialog. Web uses the browser download flow.

## Current state

- Lifecycle state: `SLICE_APPROVED`
- Active slice: Slice 2, PNG output and format menus for Save and Copy.
- Next operation: Commit the approved Slice 2 changes and publish the
  layer PR, then verify its exact-head gates.
- Gate evidence: Slice 1 is `SLICE_COMMITTED`. The approved Layer 1 head
  passed its predecessor gates. The reviewed and human-approved Slice 2
  action-module replan is committed as
  `eb037c72c499e986b315f0dd8792bdaf5d05fcbd`; its approval is recorded below.

Apply the [Lifecycle State Contract](../../README.md#lifecycle-state-contract).

## Native Stack References

- Layer 1: `codex/flow-image-export` to `main`, selected from base
  `80e5e5b18ac54db0fdf1525f53fc5a61783a74ba`. Main published
  [PR #354](https://github.com/kittybbit/vscode-ajsbutler/pull/354) at
  completion commit `dd22e4e9e4a21d7bb2be1c74ea18bacf3b0ef1ea`.
  At that exact head, Verify attempt 2, CodeQL, Qlty check and Qlty fmt
  passed, and the PR reported `CLEAN`. Verify attempt 1 had an intermittent
  failure in the unchanged bootstrap suite. Main's same-head evidence is
  `/private/tmp/ajsbutler-svg-completion-vavq0kzc/pr-verified.json`.
- Layer 2: Main created `codex/flow-image-export-png` from verified Layer 1
  head `dd22e4e9e4a21d7bb2be1c74ea18bacf3b0ef1ea`. The planned PR targets
  `codex/flow-image-export`. Slice 2's revised validation boundary was
  reviewed and approved. Main recorded that approval and committed the
  smoke-path replan as `d8fd31e77bec8d6a8652b43f7b7b8e7b9b302c78`.
  The approved format-menu replan was committed as
  `daaa9ee378864cb10004236796d2ab5d821da2ac`. That commit is the
  comparison base for the action-module replan. Main committed the reviewed
  action-module replan as
  `eb037c72c499e986b315f0dd8792bdaf5d05fcbd`. The renewed approval is
  recorded below. Independent implementation review, PR publication, and
  exact-head checks are pending.
- Main publishes or updates each layer promptly after its independent Ready
  verdict, explicit Completion Approval, and focused completion commit.
  Layer 2 is the final integration head. The layers remain open for feature
  integration, with closure and explicit merge approval on final identities.
- Feature Exit propagates the two-menu workflow to
  [README.md](../../../../README.md), save and clipboard behavior to
  [Explore Flow Graph](../../../requirements/use-cases/uc-explore-flow-graph.md),
  and both user-visible additions to [CHANGELOG.md](../../../../CHANGELOG.md).
  The exit proposal lists removal of this feature's `SPECS.md`, `TASKS.md`,
  and `TRACEABILITY.md`. No roadmap change is planned. Main records the
  closure review, approval, evidence, final head, and merge outcome on the PR.

Apply the [native stack contract](../../README.md#github-standard-stacked-pull-requests)
and [Durable Documentation Gate](../../README.md#durable-documentation-gate).

## Slice 2 Export Action Replan Human Approval

- Status: Approved
- Approved at: 2026-11-28, in the current conversation.
- Approved scope: Separate the existing export orchestration within Flow
  presentation under the reviewed Slice 2 requirements and validation.
- Approved paths: Add
  `src/presentation/webview/editor/ajsFlow/flowImageExportActions.ts` to
  the existing Slice 2 product boundary. Validation-support paths remain
  as previously approved.
- Review verdict: `Ready` from the independent plan reviewer.
- Reviewed plan: `31dbc778955ab8bf5ad280cf91a636ed039692a86163b887325c3b134afc51fb`.
- Review base: `daaa9ee378864cb10004236796d2ab5d821da2ac`.
- Review and validation evidence:
  `/private/tmp/ajsbutler-flow-png-actions-replan/manifest.json`.

## Slice 2 Format Menu Replan Human Approval

- Status: Approved
- Approved at: 2026-11-28, in the current conversation.
- Approved scope: Replace the two completed SVG toolbar buttons and the
  two PNG buttons in the pending candidate with one Save and one Copy
  button. Each opens SVG and PNG choices under FE-08.
- Approved paths: The Slice 2 product and validation-support boundary and
  this feature's planning documents in the format-menu replan commit
  `daaa9ee378864cb10004236796d2ab5d821da2ac`.
- Review verdict: `Ready` from the independent plan reviewer.
- Reviewed plan: `71ccf82e49f711b51843d31a512487d1ed2d8547ff3535cb6e034311fa4ebcee`.
- Review base: `d8fd31e77bec8d6a8652b43f7b7b8e7b9b302c78`.
- Review and validation evidence:
  `/private/tmp/ajsbutler-flow-png-format-menu-replan-r1/manifest.json`.

## Slice 2 Desktop Smoke Replan Human Approval

- Status: Approved
- Approved at: 2026-11-28, in the current conversation.
- Approved scope: The reviewed Slice 2 plan, adding the existing runner to
  stable and minimum Desktop PNG smoke validation.
- Approved paths: The Slice 2 boundary recorded in the smoke-path replan
  commit, with `src/test/runTest.ts` as the sole addition to the original
  validation-support paths.
- Review verdict: `Ready` from the independent plan reviewer.
- Reviewed plan: `65cf3794f16826743abaf65477a8f8b8ff4f3cc634ee0019a3aa82ceddbef0b5`.
- Review base: `dd22e4e9e4a21d7bb2be1c74ea18bacf3b0ef1ea`.
- Review and validation evidence:
  `/private/tmp/ajsbutler-flow-image-slice2-replan/manifest.json`.

## Original Plan Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 1 SVG save and SVG source copy, and Slice 2 PNG save
  and PNG image copy, under their reviewed acceptance, design, and validation.
- Approved paths: The exact product, validation-support, and slice-record
  paths recorded in the approved planning commit. The planning commit
  contains this feature's `SPECS.md`, `TASKS.md`, and `TRACEABILITY.md`.
- Review verdict: `Ready` from the independent plan reviewer.
- Reviewed plan: `9d97f17f451fa375e4ee13843223f2707340c45881769ab5373973fca7b810e1`.
- Review base: `80e5e5b18ac54db0fdf1525f53fc5a61783a74ba`.
- Review and validation evidence:
  `/private/tmp/ajsbutler-flow-image-desktop-review/manifest.json`.
- Planning commit: `c569202e9bb023e4f07320d92da417a5612b315d` by Main.
  The exact staged paths and `git diff --cached --check` passed.
  Slice 2 also requires its predecessor gate.

Apply
[Human Approval](../../README.md#human-approval) and the
[approval-gated commit policy](../../README.md#approval-gated-commit-policy).

## Slice 2 Completion Approval

- Status: Approved
- Approved at: 2026-11-28, in the current conversation.
- Approved scope: Commit and publish the exact reviewed Slice 2 implementation
  and records for the shared Save and Copy menus and PNG output.
- Review verdicts: Both independent implementation reviews returned
  `Ready` after correction. The second review covered the shared host,
  PNG protocol and Flow Webview CSP.
- Reviewed head: `eb037c72c499e986b315f0dd8792bdaf5d05fcbd`.
- Reviewed tracked patch:
  `d583c9a8a2cb0460cabb5076dd448b73a008251ae2bdf60c56508b5636ceae09`.
- Reviewed 22-file manifest:
  `1d1fda244a842a8fd159fc09c47b42da26df73e6b695d0e2f13528318ce2ab86`.
- Reviewed full worktree:
  `c034e8931bcc41157eeb3480acf74509c0d3cafd573087e352797329bdd45926`.
- Validation:
  `/private/tmp/flow-image-export-slice2/action-module-correction-final/correction-evidence.json`.

## Slice 1 Completion Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: The exact reviewed Slice 1 behavior, product paths,
  validation-support paths, and implementation records.
- Review verdicts: Both independent implementation reviewers returned
  `Ready` with no actionable findings. The second review covered the shared
  viewer contract and extension host.
- Reviewed head: `c569202e9bb023e4f07320d92da417a5612b315d`.
- Reviewed tracked patch:
  `75a9a4f338e000a40f1431197695e811c8200ca99ea843347828c708cb1341db`.
- Reviewed 22-path manifest:
  `a20e4597c9d3457bf19d47e5ca544fea2417ae14f2d90f28750b1b583ca24711`.
- Validation:
  `/private/tmp/flow-image-export-slice1/review-correction/implementation-evidence.json`.
- Commit and PR publication: Main committed
  `dd22e4e9e4a21d7bb2be1c74ea18bacf3b0ef1ea` and published
  [PR #354](https://github.com/kittybbit/vscode-ajsbutler/pull/354).

## Implementation Slices

### Slice 1: Save SVG and copy SVG source

- Lifecycle state: `SLICE_COMMITTED`. No predecessor slice.
- Scope and value: A usable SVG workflow covering FE-01 through FE-05 on
  Desktop and Web. Saving provides a reusable diagram, and copying its source
  provides the same content as plain text for reuse in SVG-aware tools.
- Acceptance: Localized, keyboard-operable save and copy actions are
  available for an active graph subject to their host capabilities.
  Each captures the graph at activation, including expanded panels, visible
  units and relations, even outside the viewport. The saved diagram is portable,
  uses a fixed light palette, and retains node labels with Japanese and
  XML-sensitive text. Scope, selected content, viewport, and expansion
  state do not change. Both host paths preserve the input definition. The
  browser receives the SVG bytes when download is initiated. Desktop writes
  only to the chosen SVG URI if it is distinct from the panel's source URI.
  Picking the source definition, including an existing source named with
  an `.svg` suffix, reports a localized error and leaves the file unchanged.
  Copy uses the exact same serialized SVG as Save. It reports success only
  after clipboard completion and gives feedback for unavailable or rejected
  writes. Neither action emits SVG telemetry or attributes SVG to CSV.
- Failures and risks: Disabled on missing or empty graph. Invalid export
  geometry and synchronous download setup errors yield localized feedback.
  Desktop reports a failed dialog or write without success; cancellation
  leaves files untouched. A valid Desktop destination can be on a writable
  remote provider selected by the user. Browser download completion and user
  cancellation are browser-owned. Browser or organization policies can
  block downloads and clipboard writes. Clipboard permission limits only
  the copy action.
  Font glyph appearance depends on available system fonts. A large-flow
  case checks completeness and size without a hardware-dependent threshold.

#### Solution Shape

- The Flow Viewer webview owns the export action and SVG representation.
  `FlowContents` passes the current rendered graph to its export helper
  at activation. The existing controller already supplies final
  expansion-adjusted positions, dimensions, panel decorations and relation
  endpoints. The helper filters synthetic panel-bound nodes from unit
  glyphs and uses the existing decoration rectangles for those panels.
  It uses only presentation fields needed by the image. It preserves graph
  positions without a second layout and reads no source definition,
  DOM screenshot, viewport transform, or interaction state.
- Use existing React Flow `getSmoothStepPath` with the node cards'
  right and left midpoint handles. Preserve ordinary direction and the
  start/end arrowheads of condition relations. Compute a padded SVG
  viewBox from unit and panel bounds, allowing for routing offset, stroke,
  and arrowhead extent. Draw panels behind paths and node cards. Reuse
  node-kind cues where they convey graph meaning. Include labels with a
  bounded text layout and Japanese-capable system fallbacks. Use native SVG
  elements with fixed local references and text-node serialization. Replace
  invalid XML code points safely. Avoid HTML, SVG animation, embedded
  assets, and external references. React Flow renders MUI HTML node cards
  and does not serialize this standalone image. The custom code supplies
  the SVG primitives and uses the existing library for curve geometry.
- The Flow Viewer uses the List View's gesture-local
  `navigator.clipboard.writeText` capability on Desktop and Web. Generate
  the SVG source synchronously at activation and call the clipboard API
  in that gesture. The Flow Viewer owns accessible localized status for
  confirmed success and unavailable or rejected writes. A missing Clipboard
  API or denied Webview clipboard policy leaves file save available. There is
  no host clipboard fallback or binary SVG clipboard representation.
- VS Code presentation sets an optional, validated Flow Viewer save mode
  (`dialog` or `download`) in the existing resource-state message using
  `vscode.env.uiKind`. The webview consumes it through the current resource
  context. Other viewers retain their existing resource shape. Browser
  downloads use a Blob URL during the explicit user gesture, remove the
  temporary anchor, and revoke the URL after the browser has taken it.
  There is no browser download response claimed by the extension and no
  change to the Content Security Policy.
- Desktop passes SVG text through the existing typed `SAVE` request and
  active-panel message boundary. At registration the VS Code router binds
  `document.uri` as the source argument to its panel save callback. It
  never takes the source identity from Webview input or from the currently
  active editor. Bootstrap routes the bound argument to the SVG saver for
  Desktop Flow panels, and keeps the CSV callback and its success-only
  telemetry behavior.
- The SVG saver uses `showSaveDialog` with an SVG filter and rejects an
  invalid extension or a destination matching the bound source before
  opening a write. Use URI components provided by VS Code without decoding
  twice. Compare provider URIs by normalized scheme and the provider's
  authority, path, query, and fragment. For `file`, ignore query and
  fragment, normalize dot segments and separators with `Uri.joinPath`,
  and compare the authority and path case-insensitively with NFC Unicode
  normalization to cover local case/normalization aliases. This can
  conservatively reject a case-only or normalization-only sibling on a
  filesystem that distinguishes it. Portable URI identity cannot resolve
  symlinks, hard links, or opaque aliases exposed by a provider.
- Rejecting the source shows localized feedback using the existing English
  and Japanese message resources without exposing source or destination
  paths. For an eligible selection, write UTF-8 via
  `workspace.fs.writeFile` to the dialog URI as-is, including writable
  remote-provider URIs selected explicitly by the user. Export does not
  initiate automatic upload, asset fetch, or export telemetry.
- The SVG helper owns translation from the existing rendering representation
  to portable bytes. The host adapter owns file selection, encoding, write
  errors, and notification. The browser branch owns initiating the download.
  There is no new port, shared layout abstraction, application/domain
  behavior, dependency, or telemetry event. The architecture dependency test
  checks imports and construction. Reviewers separately judge these owners,
  output sufficiency, custom SVG scope, and Qlty findings.
- Replan before adding another output format or compatibility mechanism, changing
  the relevant owners or contracts, or editing paths outside this boundary.

#### Proposed approval boundary

Product paths:

- `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`
- `src/presentation/webview/editor/ajsFlow/Header.tsx`
- `src/presentation/webview/editor/ajsFlow/flowSvgExport.ts` (new)
- `src/presentation/webview/viewerHostMessages.ts`
- `src/presentation/vscode/webview/messageHandlers.ts`
- `src/presentation/vscode/webview/viewerMessageRouting.ts`
- `src/bootstrap/extension/viewerWiring.ts`
- `src/resource/i18n/message_en.ts`
- `src/resource/i18n/message_ja.ts`

Validation-support paths:

- `src/test/suite/flowSvgExport.test.ts` (new)
- `src/test/suite/flowContentsIntegration.test.ts`
- `src/test/suite/viewerHostMessages.test.ts`
- `src/test/suite/viewerMessageRouting.test.ts`
- `src/test/suite/viewerWiring.test.ts`
- `src/test/runTest.ts`
- `src/test/runWebTest.ts`
- `src/test/support/flowImageDesktopSmoke.ts` (new)
- `src/test/support/flowImageWorkbench.ts` (new)
- `src/test/support/flowImageWebSmoke.ts` (new)
- `src/test/fixtures/flow-svg-web/flow-svg-fixture` (new)

Slice records: `docs/specs/features/flow-image-export/TASKS.md` and
`docs/specs/features/flow-image-export/TRACEABILITY.md`. Durable propagation
and feature-document removal are proposed under the separate Closure Approval.

Excluded from this layer: PNG, image clipboard, and binary transport.
Both layers exclude viewport-only output, search/Diff emphasis, theme
configuration, JP1/AJS parsing or expansion changes, export telemetry,
new dependencies, generated-output edits, and CI configuration edits.

#### Validation index

- Plan coverage: Discovery and document validation. Implementation results,
  independent review, approval, commit, and PR checks are pending.
- Geometry and image: Parse XML and assert full rendered scope, current
  panel extents, relation kinds/direction, clipping margin, stable output
  across interaction styling, safe structure, and Unicode label round-trip.
  Exercise a broad stable case with at least 1,000 rendered nodes and 999
  relations. Verify output counts and finite bounds and record size and time.
- Flow action: Extend the existing Flow Contents integration suite with active
  root and entered N/RC scope, nested expansion/collapse, content beyond the
  viewport, save payload, graph-state continuity, and error/availability
  checks. Verify keyboard activation, exact SVG text clipboard payload,
  localized success only on resolved copy, and missing/denied clipboard
  behavior with save still available. Keep existing navigation assertions.
- Desktop host: Extend real-host wiring fixtures to cover the selected
  SVG path, cancellation, write/dialog failures, UTF-8 bytes, and CSV
  success-only telemetry isolation. Open a temporary `.svg` definition in
  a Flow panel and return that URI from the save dialog. Assert the localized
  error, zero writes, no success notification or export telemetry, and
  unchanged source bytes. Cover normalized local variants and acceptance of
  a distinct writable provider URI. The message-routing test verifies the
  active panel's bound source URI reaches the save callback. Exercise
  invalid/missing save mode in the resource-state parser tests. Confirm
  baseline API availability and preserve the 1.75.0 Desktop smoke target.
- Desktop clipboard: Extend the existing Electron runner with a smoke
  driven by Playwright on both stable and minimum 1.75.0. Load the production
  extension in the normal Desktop workbench with the shared test definition.
  Open the Flow Viewer and use a trusted locator click on its SVG source
  copy action. Require the localized success status produced after the
  real Webview clipboard write resolves. In the live Webview read back
  the actual system clipboard text and verify standalone SVG with the
  fixture marker and expanded child. Use the original Electron
  permission policy for the positive check.
- Desktop driver: Reuse the existing runner target and downloaded executable.
  Keep its extension-host suite, then start a fresh instance on the
  virtual CI/test display with an ephemeral loopback Chromium debugger.
  Attach the existing Playwright Chromium client over CDP. The minimum
  host uses Electron 19, outside the supported range of Playwright's
  current Electron launcher. Use only the renderer driver. The shared
  fixture, native command palette, and real Webview selectors drive
  user actions. Use bounded waits and close the test process, endpoints
  and profile on exit. Use the isolated display's own clipboard.
- Web host: Extend the existing Web runner with a headless Chromium case
  using the public `@vscode/test-web` server API and the production Web
  extension. Open the fixture and Flow Viewer, match the SVG action in its
  real sandboxed webview, and capture the browser download. Assert filename
  and actual SVG bytes, with the Japanese label and visible expanded child.
  Copy SVG source from the same Webview and read back the same SVG text.
  Check the downloaded SVG renders in Chromium as XML with legible fitted
  labels, diagram bounds and no external requests. Keep the existing Web
  smoke and its minimum-version Desktop reuse.
- Final checks: Run `rtk pnpm test` through the existing headless or CI
  host runners (production build, type checks, stable Desktop,
  minimum Desktop, Web smoke, and Web download). Record the complete
  `architectureDependencyRules.test.ts` check separately. Run Markdown lint, link
  and structure checks, and `rtk git diff --check`. Capture full-repository
  Qlty baseline/final `check` and `smells` SARIF and the final
  `rtk pnpm run qlty` aggregate under the Quality Contract. Independent
  implementation review includes a second review for the shared resource
  contract and extension host surface.
- Plan evidence: `/private/tmp/ajsbutler-flow-image-desktop-review/manifest.json`.
  Retain implementation evidence outside analyzed inputs. Main records the
  independent verdicts, human approvals, and focused commits.

#### Slice 1 implementation record

- Result: `IMPLEMENTED`. The approved FE-01 through FE-05 behavior and
  boundary tests are complete. PNG save and image copy remain in Slice 2.
- Validation identity and detailed results:
  `/private/tmp/flow-image-export-slice1/review-correction/implementation-evidence.json`.
- Correction loop: Synthetic bounds panels are identified by their graph
  structure, so a real unit ending in `::nested-panel-bounds` and its relation
  remain exportable. SVG labels use Japanese-capable system font fallbacks and
  bounded visible text. Flow integration tests cover entered N and RC scopes,
  collapse, keyboard entry, active-scope save/copy, and selection/expansion
  continuity. Bounds are reduced iteratively, final dimensions are validated,
  and unexpected serialization failures return localized export feedback.
- Desktop: Stable 1.148.0 passed 1,060 tests, including the actual Flow Viewer
  clipboard/source-guard smoke. The first same-hash attempt had one unrelated
  existing 2-second table selection timeout; the same-hash retry passed all
  tests. Minimum 1.75.0 compatibility and the same trusted clipboard/source
  guard smoke passed. The Ubuntu 24.04 arm64, Node 24.21.0, Xvfb logs and
  matching 20 input hashes are recorded at
  `/private/tmp/ajsbutler-flow-linux.iaSExo/desktop-review-stable-retry.log`
  and `/private/tmp/ajsbutler-flow-linux.iaSExo/desktop-web-review-run-1.log`.
- Web: The headless runner passed. It verified keyboard-activated SVG save and
  copy, exact native text clipboard readback, unchanged viewport transform,
  valid rendered XML, visible wide Latin and Japanese label bounds, and no
  external requests. Production bundles and test compilation passed. Focused
  serializer tests passed 7/7; entered N/RC Flow Contents tests passed 2/2;
  architecture, Markdown lint, and `git diff --check` passed.
- Qlty: `qlty fmt`, `qlty check`, and changed-path `qlty smells` passed as an
  aggregate. The full-repository check has four baseline findings versus five
  at baseline; the 112 smell findings have an identical baseline inventory.
  Official analyzed-path inventories and SARIF are recorded under
  `/private/tmp/flow-image-export-slice1/review-correction/{baseline,final}`.
- Readiness: Independent implementation reviews are complete. See
  [Slice 1 Completion Approval](#slice-1-completion-approval) for the reviewed
  identity and human approval. Detailed validation and the initial retry
  evidence remain indexed above.

Apply the [Evidence Contract](../../evidence.md#evidence-contract),
[Correction Loop](../../validation.md#correction-loop-for-deterministic-failures),
[Quality Contract](../../validation.md#quality-contract), and
[Solution Shape](../../architecture.md#solution-shape).

### Slice 2: PNG output and shared export menus

- Lifecycle state: `SLICE_APPROVED`. Depends on Slice 1 at verified PR #354 head
  `dd22e4e9e4a21d7bb2be1c74ea18bacf3b0ef1ea`.
- Replan trigger: After simplification within the approved paths, the
  retained candidate's targeted Qlty scan reports file complexity of 74
  in `FlowContents.tsx`, above the threshold of 55, together with
  concentrated action complexity. The approved format-menu baseline
  has no corresponding finding. Add one Flow presentation module for
  export actions. The candidate remains uncommitted and is indexed
  separately from the documentation patch.
- Scope and value: Provide PNG save and image copy alongside the existing SVG
  operations, through one Save and one Copy icon in the final toolbar.
  Slice 2 covers FE-02, FE-04, and FE-06 through FE-08, and retains FE-01 and
  FE-05 behavior through the new entry points.
- Acceptance: Save offers SVG file and PNG file. Copy offers SVG source text
  and PNG image. SVG copy still writes plain text. PNG copy writes one
  `image/png` item. Opening and dismissing the menu leave the export and
  graph state untouched. The selected menu item captures the current scope
  and expansion. Keyboard navigation, selection, dismissal and focus
  return use the menu interaction. With an exportable graph, selecting
  either copy format can report missing clipboard capability without
  serializing or rasterizing the graph. A pending PNG operation disables
  PNG actions while preserving usable SVG actions. Desktop
  supports the same source-URI protection and destination handling as SVG,
  including for a JP1/AJS source with a `.png` suffix. Web uses a browser
  Blob download after rasterization, without another confirmation step
  after PNG selection.
- Failures and risks: Rasterization, oversized input or output, absent
  image clipboard support, rejected clipboard writes, and host write
  failures receive localized feedback. Copy failures leave file save
  available. Only successful clipboard completion is reported as a copy.
  The browser may restrict downloads or clipboard delegation. It owns
  download progress and completion. Use SVG for diagrams beyond PNG
  bounds. Browser system font availability governs glyph appearance and
  clipboard consumers may re-encode the bytes.

#### Solution Shape for Slice 2

- `Header.tsx` owns the two localized `IconButton` triggers and anchored
  MUI `Menu` and `MenuItem` choices. Use MUI focus, arrow navigation and
  dismissal. The triggers expose their names and menu expanded state.
  Close on selection, Escape or outside dismissal. Escape restores focus
  to the trigger. Graph readiness, save mode and the existing PNG in-flight
  guard determine which controls or choices are disabled. Keep both copy
  choices reachable with an exportable graph, subject to that PNG guard,
  even when the browser lacks one or both clipboard capabilities. Copy
  labels distinguish SVG source text from the PNG image.
- `FlowContents.tsx` provides the existing four action callbacks. Each
  menu item calls only its corresponding callback directly from selection.
  `FlowContents.tsx` captures the current graph there and retains panel
  state, PNG busy gating and callback wiring. Menu state carries the anchor
  and the operation only. Opening or dismissing a menu starts no export.
- `flowImageExportActions.ts` owns the four SVG and PNG save/copy operations
  in Flow presentation, including capability preflight, immediate clipboard
  and rasterization promise handoff, download reuse, and localized result
  reporting. The action functions reuse the serializers, status resources
  and host messages. Simplify duplicated work and separate capability,
  encoding, delivery and reporting branches by responsibility. Keep the
  selection gesture and existing promise/error behavior when delegating
  directly from `FlowContents.tsx`. Do not add a new layer boundary,
  action registry, generic export port or separate state owner.
- The selected copy callback checks its existing clipboard requirements before
  serializing the diagram or starting rasterization. SVG checks `writeText`.
  PNG checks `ClipboardItem` and `write`. Missing support reports the existing
  format-specific localized unavailable status without drawing, writing the
  clipboard, or saving a file. A denied write reports the corresponding
  localized failure. File save remains independent of both capabilities.
- `flowPngExport.ts` owns rasterization and codec limits.
  `flowSvgExport.ts` remains the diagram serializer. PNG uses Slice 1's exact
  standalone SVG representation and its padded dimensions at CSS-pixel
  scale. Reuse dimensions computed with the SVG instead of reconstructing
  the layout, generating a second rendering, or parsing untrusted XML.
  Decode a Blob of the produced SVG into an image and draw it to a 2D
  canvas. Encode with `canvas.toBlob` using `image/png`. Use only the
  existing fixed palette and system font fallback. No assets are fetched.
- Limit each canvas side to 8,192 pixels and area to 16,777,216 pixels
  (64 MiB of RGBA pixels per full-size surface). The decoded image plus
  canvas can therefore occupy up to 128 MiB of raw pixel storage, apart
  from browser codec and object overhead. Require finite positive sizes,
  round dimensions up, and reject over the limit before decode or allocation.
  Cap the encoded PNG at 32 MiB for both actions and before host parsing
  can schedule a save. Do not crop or silently scale the diagram. Allow
  one in-flight raster operation per panel. Revoke SVG and download object
  URLs, release canvas backing storage on all terminal paths, and avoid
  retaining full images in React state.
- The VS Code presentation uses the existing Flow bundle selection to add
  `blob:` only to this panel's `img-src`. The Flow Webview consumes this
  narrow permission for Blob decoding. The PNG requires neither a worker
  nor a network origin. Other viewers retain the original policy.
- PNG clipboard write starts within the explicit user gesture. When
  `ClipboardItem` and `navigator.clipboard.write` are present, immediately
  pass a promise-valued `image/png` entry that resolves after rasterization.
  Handle synchronous failure and rejection of either operation, avoiding
  orphaned rejected promises. Do not depend on a newer
  `ClipboardItem.supports` method or read clipboard contents in production.
  Test the missing and denied cases. Older VS Code-created Firefox Webviews
  do not delegate the clipboard capability. Permission-dependent actions
  show unavailable or failed status in those environments. File save is
  independent of clipboard support.
- Browser PNG save reuses the existing Flow Blob download action with a
  PNG name/MIME after encoding finishes. A Chromium discovery probe
  observed a successful Blob download after transient activation expired
  using the matching nested frame capabilities. The selected menu item
  starts the download path. The extension reports initiation failures
  it detects, and completion remains with the browser.
- Desktop gets a separate typed PNG save request with an `ArrayBuffer` in
  the existing viewer protocol, supported by the baseline's binary message
  transport. The host validates type, length, PNG signature, and valid
  bounded IHDR dimensions before initiating the Flow panel save. It never
  trusts a filename, destination, MIME, or format selector from the Webview.
  Only a live Flow panel in Desktop registers this save handler. Reuse the
  slice's source-bound format-aware host save behavior for both image file
  types. Send bytes to `workspace.fs.writeFile` without text conversion.
  Separate the new PNG request from the existing string save/CSV contract.
  No PNG content or save information enters telemetry.
- Solution boundaries: one rasterization helper owns the browser image
  decode/encode and limit checks. The message contract owns validation
  and a shared format-specific size limit used by webview and host.
  The Flow export action module owns file and clipboard orchestration.
  The Flow component owns selection-time graph capture and state. The
  existing host filesystem adapter owns destination
  selection and write. Browser and VS Code APIs supply the codec,
  clipboard, and filesystem transport. No application/domain port or
  renderer dependency is needed. The architecture test checks mechanical
  dependencies. Review checks scope and placement, limit enforcement,
  CSP containment, capability/error handling, and reusable Slice 1 geometry.
- Replan before changing output scope, introducing a dependency or a broader
  policy, or adding files beyond the exact boundary.

#### Proposed approval boundary for Slice 2

Product paths:

- `src/presentation/webview/editor/ajsFlow/FlowContents.tsx`
- `src/presentation/webview/editor/ajsFlow/Header.tsx`
- `src/presentation/webview/editor/ajsFlow/flowImageExportActions.ts` (new)
- `src/presentation/webview/editor/ajsFlow/flowSvgExport.ts`
- `src/presentation/webview/editor/ajsFlow/flowPngExport.ts` (new)
- `src/presentation/webview/viewerRequestMessages.ts`
- `src/presentation/vscode/webview/messageHandlers.ts`
- `src/presentation/vscode/webview/reactPanel.tsx`
- `src/presentation/vscode/webview/viewerMessageRouting.ts`
- `src/bootstrap/extension/viewerWiring.ts`
- `src/resource/i18n/message_en.ts`
- `src/resource/i18n/message_ja.ts`

Validation-support paths:

- `src/test/suite/flowContentsIntegration.test.ts`
- `src/test/suite/flowSvgExport.test.ts`
- `src/test/suite/flowPngExport.test.ts` (new)
- `src/test/suite/viewerRequestMessages.test.ts`
- `src/test/suite/viewerMessageRouting.test.ts`
- `src/test/suite/viewerWiring.test.ts`
- `src/test/suite/webSmoke.ts`
- `src/test/runTest.ts`
- `src/test/support/flowImageDesktopSmoke.ts`
- `src/test/support/flowImageWebSmoke.ts`

The export-action module is the only added product path. Existing integration,
codec, request-routing, and host smoke paths cover the change.

Slice records: `docs/specs/features/flow-image-export/TASKS.md` and
`docs/specs/features/flow-image-export/TRACEABILITY.md`. Use the separate
closure boundary above for the durable edits and feature-record removal.

#### Validation index for Slice 2

- Rasterization and safe failure: Focused tests cover dimensions at and
  beyond both side and area limits, malformed dimensions, encoded output
  cap, decode/encode failures, and cleanup. Verify output bounds using the
  Slice 1 graph geometry and keep SVG behavior unchanged.
- Actions: Verify both use the captured graph, copy initiates the clipboard
  operation before the rasterization promise settles, saves without
  clipboard when unsupported, keeps `image/png` as the sole clipboard
  MIME, and localizes progress and outcomes. Cover view-state conservation
  and overlapping activation while a raster operation is pending.
- Action module: Use existing boundary tests for the extracted operations
  and run targeted Qlty diagnostics on the Flow component and new module.
  The final official baseline comparison must show that the reported
  complexity findings are resolved and that no new or worsened findings
  appear on either path or elsewhere. Moving the same finding into the
  new path does not satisfy this test.
- Format menus: Flow Contents integration covers exactly two export
  triggers, both choices per menu, the difference between copying text
  and an image, no-graph availability, and busy PNG options with usable SVG
  siblings. Verify that opening and dismissing either menu causes no
  export or graph changes.
  Exercise Escape focus return, keyboard format selection, and routing
  exactly one operation using the graph at selection. Keep existing
  unrelated header controls and Flow behaviors covered by their checks.
- Missing copy capability: In Flow Contents integration, exercise SVG-only
  support, PNG-only support, and neither capability. Selecting a missing
  format reports its localized unavailable status without SVG serialization,
  PNG rasterization, or clipboard or file writes. The supported copy choice
  still works when present. Both Save choices remain usable when clipboard
  APIs are missing. Retain coverage for denied writes and their
  localized failure status.
- Host boundaries: Validate binary request shape, size, signature and
  dimensions. Check a disposed, Table, or Web panel cannot initiate the
  Desktop PNG save. Desktop wiring tests cover actual bytes at the
  filesystem boundary, dialog cancellation, provider URI, failure, both
  source extensions, and existing CSV-only telemetry. Confirm the Flow
  CSP delta preserves the other viewers' generated markup.
- Production Web clipboard and download: Extend the Layer 1 headless
  Chromium workbench driver to observe actual PNG download bytes, read
  back the actual clipboard MIME, and decode both images. Drive both
  menus with keyboard input and verify both formats for saving and copying.
  Compare dimensions,
  same-scope expansion and visible content including rendered Japanese
  text, panel borders and off-viewport edges. Check no external asset
  requests. Retain the SVG cases. Exercise denied clipboard writes and
  continuing PNG file save in the Flow Contents integration suite.
- Production Desktop clipboard: Extend the Layer 1 smoke in stable and
  minimum 1.75.0 through the existing renderer driver and
  `exerciseFlowClipboard` in `src/test/runTest.ts`. Use trusted input to
  select SVG and PNG from the actual Copy menu and exercise both Save
  menu items for source protection. Wait for PNG copy's
  confirmed-success status. Read back the actual `image/png` clipboard item
  and use the runner's `application.evaluate` bridge for native Electron
  image readback. Check the PNG signature and dimensions against the SVG
  copied in that host. Compare the decoded fixture pixels from both readers
  so a platform re-encode is acceptable. Retain the isolated test session,
  the existing extension-host handshake, SVG copy coverage in both Desktop
  hosts, and separate Web readback.
- Real Webview binary transport: Add a temporary script-enabled panel in
  the existing shared extension smoke entry. Have it send an `ArrayBuffer`
  containing a small valid PNG and assert byte-for-byte receipt at
  `onDidReceiveMessage`, including a timeout and disposal. Run this smoke in
  Web and minimum 1.75.0 Desktop; exercise the full save route in stable
  Desktop wiring tests. The production Desktop clipboard check above
  covers image clipboard permission and native readback.
- Final checks: Use the same full host/build, architecture, documentation,
  and Qlty Quality Contract as Slice 1 on the approved Layer 2 base and
  final patch. Independent implementation review includes a second
  reviewer for changed host, protocol and CSP surfaces. Record applicable
  exact-head GitHub/Cloud checks that gate Feature Exit.
- Evidence: Deployment, permission, or headless host limitations remain
  explicit if a required test cannot complete. Retain code and host evidence
  outside analyzed inputs and record the final layer identities and gate
  references in this plan and the PR.
  Export-action replan discovery and document validation are indexed at
  `/private/tmp/ajsbutler-flow-png-actions-replan/manifest.json`.
  The paused candidate is retained separately at
  `/private/tmp/flow-png-pre-controller-replan.zRHgXs`. Historical host logs
  record the round 3 Web and minimum Desktop passes and a subsequent stable
  Desktop test-only failure before a handshake correction. The final stable
  Desktop, minimum Desktop and Web results for this implementation identity
  are recorded below and bound to the approved replan under the Evidence
  Contract.

#### Slice 2 implementation record

- Result: `IMPLEMENTED`. FE-01 through FE-08 are implemented in Slice 2 and
  validated on Desktop and Web. The Save and Copy menus expose SVG and PNG
  choices; PNG save and image copy preserve active-scope behavior and leave
  SVG save and source copy available under their existing contracts.
- Implementation identity: Base and approved Layer 2 plan commit
  `eb037c72c499e986b315f0dd8792bdaf5d05fcbd`; reviewed action-module plan
  `31dbc778955ab8bf5ad280cf91a636ed039692a86163b887325c3b134afc51fb`.
  No implementation commit was created. The full-repository manifest for the
  immutable substantive source/test snapshot used by Qlty and host checks is
  `/private/tmp/flow-image-export-slice2/action-module-final-4/working-tree-content.json`
  (SHA-256
  `44d679cc186d1cbe29fd1591854b6a19f29ec92e6d44b32e82b2750e0195d466`).
  Its substantive tracked patch SHA-256 is
  `839e0d5fa2c41097feb70f2d05338ef9cdc0c4b4e9f0c98b0318ef5093baf474`;
  the source/test changed-path manifest is in the same evidence directory.
  The current full worktree includes a separately validated metadata-only
  update to `TASKS.md` and `TRACEABILITY.md`. The sidecar records its exact
  diff, per-file hashes, and combined current-manifest identity.
- Implemented Solution Shape: `Header.tsx` owns the two format menus.
  `FlowContents.tsx` captures the selected graph and owns PNG busy state.
  `flowImageExportActions.ts` owns the four Flow save and copy actions, their
  selection-gesture handoff, capability checks, downloads, and localized
  outcomes. `flowPngExport.ts` owns the bounded PNG codec and resource
  cleanup; the existing SVG serializer remains the shared diagram
  representation. The existing host protocol and filesystem adapter
  validate and save PNG bytes with the same source-URI protection as SVG.
  No layer or dependency boundary was added, and shared code remains
  browser-safe.
- Validation identity and detailed results:
  `/private/tmp/flow-image-export-slice2/action-module-implementation-evidence.json`.
  The corrected source/test snapshot inspected by official Qlty is
  `/private/tmp/flow-image-export-slice2/action-module-correction-final/working-tree-content.json`
  (SHA-256 `f26bfe1d98af08d660f1fef2e099b3575da9756952fc8e5c788f4ae3f241567c`).
  The current combined worktree identity and correction evidence are indexed
  in the linked sidecar. Baseline and final Qlty artifacts are under
  `/private/tmp/flow-image-export-slice2/action-module-baseline/` and
  `/private/tmp/flow-image-export-slice2/action-module-correction-final/`.
- Desktop and Web: One complete real-host run passed all lanes. Stable VS Code
  1.148.0 passed 1,072 tests, including the production Flow Web-kind denial,
  Desktop PNG save, actual image clipboard readback, and source protection.
  Minimum VS Code 1.75.0 passed the extension smoke and actual clipboard/
  source-protection check. Headless VS Code Web 1.148.0 passed the real Save
  and Copy menus, SVG and PNG downloads, image clipboard MIME/bytes, rendered
  dimensions/content, and no-external-request checks. Host log SHA-256 is
  `7ca085a9fcd03038a4843f20a5903630201edd9226d3f8d7103f89a0f8590b53`.
- Build and tests: Production webpack build and production/test TypeScript
  checks passed. The build completes with the existing webpack bundle-size
  recommendation warnings. Architecture dependency rules passed 17/17 and
  viewer request boundary tests passed 6/6. Markdown lint reported zero
  errors and `git diff --check` passed. The host run includes all changed
  Flow, routing, request, wiring, and smoke coverage.
- Qlty: The final `rtk pnpm run qlty` aggregate passed. Qlty 0.645.0 full
  `check` retained the same four baseline findings (status 1) across 641
  baseline and 644 final files. Full `smells` had 112 baseline and 110 final
  findings (status 0), with two baseline routing findings resolved and no new
  or worsened changed-path finding. Baseline/final structure and duplication
  inventories were 376 and 378 files. Official SARIF, inventories, raw logs,
  and snapshot hashes are retained under the linked evidence directories.
- Correction loop: The production PNG handler is now registered only for a
  Desktop Flow viewer; a valid PNG sent through actual Web-kind Flow wiring
  returns the safe unavailable status without opening a dialog or writing a
  file. Desktop save remains covered. PNG length and header are validated on
  the original byte range before copying; oversized buffers and views prove
  that `slice` is never called, while offset views copy exactly their accepted
  range and full buffers retain identity. The Slice 1 and Slice 2 record
  headings and the FE-04 traceability link now point to their correct records.
  A transient byte-range helper complexity finding was decomposed; final Qlty
  has no new finding on changed paths. Earlier failed host retries and the
  corrected Qlty log-permission retry remain in the evidence sidecar.
- Readiness: `SLICE_APPROVED` after both independent reviews and human
  [Slice 2 Completion Approval](#slice-2-completion-approval).
  The implementation commit, PR publication, and exact-head GitHub or Cloud
  gates follow that approval. Release documentation remains at Feature Exit
  as approved.
