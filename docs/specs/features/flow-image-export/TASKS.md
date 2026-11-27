# Feature Tasks: Flow Image Export

## Agent Brief

- Purpose: Save or copy the full active JP1/AJS flow with its current
  nested-jobnet expansion.
- Slice order: SVG save and source copy, followed by PNG save and image copy.
  The plan is approved. Begin Slice 1 after the planning commit succeeds.
- Read [requirements and acceptance](SPECS.md#requirements-and-acceptance),
  Slice 1 scope and validation, and [traceability](TRACEABILITY.md).
- Constraints: Preserve existing graph and CSV behavior. Desktop uses the
  VS Code save dialog. Web uses the browser download flow.

## Current state

- Lifecycle state: `PLAN_APPROVED`
- Next operation: Main commits the approved planning package before Slice 1.
- Gate evidence: Independent plan review returned `Ready` for the reviewed
  identity below. The human approved both exact slice boundaries.

Apply the [Lifecycle State Contract](../../README.md#lifecycle-state-contract).

## Native Stack References

- Layer 1: `codex/flow-image-export` to `main`, selected from base
  `80e5e5b18ac54db0fdf1525f53fc5a61783a74ba`. The PR, reviewed layer diff,
  completion commit, and exact-head checks are pending.
- Layer 2: planned `codex/flow-image-export-png` to
  `codex/flow-image-export`. Main verifies Layer 1's exact-current-head
  GitHub and applicable Cloud gates before creating the dependent branch
  or starting Slice 2. Its base is that verified predecessor commit.
  The branch, PR, layer identities, and exact-head checks are pending.
- Main publishes or updates each layer promptly after its independent Ready
  verdict, explicit Completion Approval, and focused completion commit.
  Layer 2 is the final integration head. The layers remain open for feature
  integration, with closure and explicit merge approval on final identities.
- Feature Exit propagates current usage to [README.md](../../../../README.md),
  save and clipboard behavior to
  [Explore Flow Graph](../../../requirements/use-cases/uc-explore-flow-graph.md),
  and both user-visible additions to [CHANGELOG.md](../../../../CHANGELOG.md).
  The exit proposal lists removal of this feature's `SPECS.md`, `TASKS.md`,
  and `TRACEABILITY.md`. No roadmap change is planned. Main records the
  closure review, approval, evidence, final head, and merge outcome on the PR.

Apply the [native stack contract](../../README.md#github-standard-stacked-pull-requests)
and [Durable Documentation Gate](../../README.md#durable-documentation-gate).

## Human Approval

- Status: Approved
- Approved at: approved in current conversation
- Approved scope: Slice 1 SVG save and SVG source copy, and Slice 2 PNG save
  and PNG image copy, under their reviewed acceptance, design, and validation.
- Approved paths: The exact product, validation-support, and slice-record
  paths in both boundaries below. The planning commit contains this
  feature's `SPECS.md`, `TASKS.md`, and `TRACEABILITY.md`.
- Review verdict: `Ready` from the independent plan reviewer.
- Reviewed plan: `9d97f17f451fa375e4ee13843223f2707340c45881769ab5373973fca7b810e1`.
- Review base: `80e5e5b18ac54db0fdf1525f53fc5a61783a74ba`.
- Review and validation evidence:
  `/private/tmp/ajsbutler-flow-image-desktop-review/manifest.json`.
- Planning commit: Main executes and records the staged check and result
  at the commit gate. Slice 2 also requires its predecessor gate.

Apply
[Human Approval](../../README.md#human-approval) and the
[approval-gated commit policy](../../README.md#approval-gated-commit-policy).

## Implementation Slices

### Slice 1: Save SVG and copy SVG source

- State: `PLANNED`. No predecessor slice.
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

Apply the [Evidence Contract](../../evidence.md#evidence-contract),
[Correction Loop](../../validation.md#correction-loop-for-deterministic-failures),
[Quality Contract](../../validation.md#quality-contract), and
[Solution Shape](../../architecture.md#solution-shape).

### Slice 2: Save PNG and copy an image

- State: `PLANNED`. Depends on the committed Slice 1 and its verified
  predecessor head gates described above.
- Scope and value: Save PNG and Copy image cover FE-02, FE-04, FE-06 and
  FE-07, adding a ready-to-paste raster image while keeping the SVG choices.
- Acceptance: One keyboard-operable action saves a PNG of the same graph and
  paint as SVG. A separate Copy image action writes one `image/png` item,
  which can be pasted into applications that accept images. Each action
  uses the full scope and expansion captured at activation. Desktop
  supports the same source-URI protection and destination handling as SVG,
  including for a JP1/AJS source with a `.png` suffix. Web uses a browser
  Blob download after rasterization, with one user action.
- Failures and risks: Rasterization, oversized input or output, absent
  image clipboard support, rejected clipboard writes, and host write
  failures receive localized feedback. Copy failures leave file save
  available. Only successful clipboard completion is reported as a copy.
  The browser may restrict downloads or clipboard delegation. It owns
  download progress and completion. Use SVG for diagrams beyond PNG
  bounds. Browser system font availability governs glyph appearance and
  clipboard consumers may re-encode the bytes.

#### Solution Shape for Slice 2

- The Flow Viewer webview owns rasterization. It uses Slice 1's exact
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
  using the matching nested frame capabilities. There is no second gesture
  or successful-download claim in the extension.
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
  The existing Flow action controller owns gesture, file and clipboard
  outcomes. The existing host filesystem adapter owns destination
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
- `src/test/support/flowImageDesktopSmoke.ts`
- `src/test/support/flowImageWebSmoke.ts`

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
- Host boundaries: Validate binary request shape, size, signature and
  dimensions. Check a disposed, Table, or Web panel cannot initiate the
  Desktop PNG save. Desktop wiring tests cover actual bytes at the
  filesystem boundary, dialog cancellation, provider URI, failure, both
  source extensions, and existing CSV-only telemetry. Confirm the Flow
  CSP delta preserves the other viewers' generated markup.
- Production Web clipboard and download: Extend the Layer 1 headless
  Chromium workbench driver to observe actual PNG download bytes, read
  back the actual clipboard MIME, and decode both images. Compare dimensions,
  same-scope expansion and visible content including rendered Japanese
  text, panel borders and off-viewport edges. Check no external asset
  requests. Retain the SVG cases. Exercise denied clipboard writes and
  continuing PNG file save in the Flow Contents integration suite.
- Production Desktop clipboard: Extend the Layer 1 smoke in stable and
  minimum 1.75.0. Click the actual Copy image action in the Flow Webview
  with trusted input, observing its confirmed-success status only after
  the real clipboard write resolves. In the live Desktop Webview read
  the system clipboard through its standard Clipboard API. Require an
  `image/png` item with a PNG signature and fixture dimensions matching
  the SVG copied in that host. This exercises Electron's actual read and
  sanitized-write policy. The test never observes clipboard data
  outside its own isolated session and fixture. Keep SVG copy coverage
  in both Desktop hosts and separate Web clipboard readback.
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
