# Feature Specification: Flow Image Export

## Purpose

Let users save the active JP1/AJS jobnet flow as SVG or PNG for design
documents, incident reports, and reviews. Users can also copy the SVG source
as text or copy the PNG image for pasting. The Save and Copy icons each open
a format menu. Each export covers the full active graph and preserves the
current nested-jobnet expansion.

## Source

- The user's request to proceed with the flow image export proposal in
  [機能提案整理](https://chatgpt.com/c/6b06ed52-17a8-83e8-867a-586ae2c6cb07).
  The proposal recommends SVG before PNG and calls for evaluating large flows
  and font fidelity before adding PNG.
- The follow-up request adds clipboard actions analogous to those in List
  View and asks for PNG in a separate implementation slice.
- A later request replaces the format-specific toolbar controls with one
  Save icon and one Copy icon, each offering SVG and PNG.
- [Build Flow Graph](../../../requirements/use-cases/uc-build-flow-graph.md)
  and [Explore Flow Graph](../../../requirements/use-cases/uc-explore-flow-graph.md)
  define the existing graph content, placement, active scope, and expansion
  semantics used by the export.

## Requirements and acceptance

- **FE-01** A user with an available graph can save it as an `.svg` file
  through the Flow Viewer. Desktop uses the VS Code save dialog, and
  cancelling leaves existing files untouched. Web downloads the SVG using
  the browser's destination and prompt preferences. The viewer reports
  export failures it detects. Desktop reports write success only after the
  write succeeds. On Web, the browser owns download progress and completion.
- **FE-02** File and clipboard output include the full active flow scope,
  whether a root jobnet or an entered N or RC scope, even when pan or zoom
  places content outside the viewport. Output preserves the placement of units,
  their labels and relations, and the boundaries and visible contents of
  currently expanded jobnets. Collapsed jobnets stay collapsed and sibling
  scopes outside the active scope stay outside the image.
- **FE-03** The output is a standalone, noninteractive SVG that displays in a
  standard SVG viewer without VS Code or network resources. Unit labels with
  Japanese or XML-sensitive characters remain readable. The image contains
  the diagram and excludes viewer controls, search or Semantic Diff emphasis,
  and transient hover, selection, and focus styling.
- **FE-04** Export preserves the active scope, expansion, selection, and
  viewport in the viewer. Desktop rejects selection of the Flow Viewer's
  source definition as the destination before writing, with localized
  feedback and no success report. Users may choose writable locations
  offered by VS Code filesystem providers, including remote locations.
  The extension initiates no automatic upload, asset fetch, or export
  telemetry. CSV export and its telemetry retain their existing behavior.
- **FE-05** Copy SVG source puts the same standalone SVG markup on the
  clipboard as plain text. The viewer reports successful copy after the
  clipboard write resolves. If the host or browser blocks clipboard access,
  the viewer indicates that the copy is unavailable or failed. SVG save
  remains available when the graph can be exported.
- **FE-06** Save PNG produces a PNG file from the same diagram and layout
  as the SVG. Desktop prompts for a destination, applies the source
  protection in FE-04, and reports successful save only after writing.
  Web uses the browser's download preferences and completion handling.
  Diagrams exceeding the supported PNG dimensions or size, and failed
  rasterization or writes, give localized feedback. SVG remains available
  when the graph exceeds PNG limits.
- **FE-07** Copy image puts the rasterized diagram on the clipboard as
  `image/png` where image clipboard access is supported and allowed.
  It reports success only after the clipboard write resolves. Missing
  support, denied permission, rasterization failure, and oversize produce
  unavailable or failed feedback. PNG save remains available on supported
  browsers without image clipboard permission.
- **FE-08** The final Flow Viewer toolbar has two export controls, Save and
  Copy. Each opens a menu with localized SVG and PNG choices. The copy
  choices identify SVG source as text and PNG as an image. Users can open,
  navigate, select, and dismiss each menu with the keyboard. Escape returns
  focus to the invoking control. Opening and dismissing a menu preserve the
  graph and perform no export. Selecting a format captures the then-current
  graph and starts only the chosen operation. With an exportable graph,
  choosing a copy format with missing clipboard capability gives the
  corresponding localized unavailability feedback without generating output.
  The existing PNG busy gate applies independently of clipboard capability.
  An unavailable copy format leaves file save and other usable choices
  available.

## Decisions and impact

- The feature is a transient branch feature. The export uses the existing
  graph semantics and presentation geometry, including search-triggered
  expansion if that expansion is visible when the user exports.
- SVG save and source copy come first. PNG save and image copy reuse the
  same diagram representation and add no new JP1/AJS interpretation. The
  PNG layer introduces the two format menus and keeps both SVG workflows
  accessible through them.
- Validation needs a graph with content outside the viewport, nested expanded
  and collapsed jobnets, relation endpoints, Japanese and XML-sensitive
  labels, and a representative large graph. Cover save success, cancellation,
  and failure as well as desktop and web operation. Planning defines the
  size and font cases together with their evidence and expected results.
- The new save and copy workflows affect user-facing release notes and the durable
  Flow Viewer usage and behavior documentation. The current roadmap has
  no Flow Image Export entry.

## Compatibility

The feature supports the desktop and web extension under the existing
`engines.vscode` minimum. Clipboard access depends on the webview host,
browser features, and permission policy. Graph building, ordinary Flow
Viewer rendering and navigation, and Semantic Diff display continue to
follow their current contracts. Exported content and destinations are
excluded from telemetry.

## Non-goals

- Deferred proposal candidates include viewport-only export, export of
  search or Semantic Diff emphasis, and configurable export colors or themes.
- Graphs spanning multiple active scopes, editing the graph or source
  definition, and automatic export.
