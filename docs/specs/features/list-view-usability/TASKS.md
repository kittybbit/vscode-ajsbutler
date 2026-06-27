# List View Usability Tasks

## Current Task

- Status: None
- Scope: Select and investigate the next list-view usability task.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while approval is pending.

## Decision Notes

- Completed list-view usability behavior now uses a flow-view-like fixed shell:
  the unit-list Header owns visible controls, the unit tree is a shared left
  pane, the table scrolls internally, WindowScroll is not exposed, and column
  selection opens from the Header.
- Completed list search is presentation-local and flow-style: it reuses the
  shared Header search field, removes the old key-specific table search mode,
  and moves next/previous results by selecting and revealing rows with stable
  `absolutePath`.
- Completed list-to-flow navigation keeps the existing `NAVIGATE` /
  `REVEAL_UNIT` contracts and can defer reveal delivery until a newly opened
  flow panel is ready.
- A shared domain/application search service remains deferred until
  `uc-search-domain-unification.md` has a separate approved slice.
- `engines.vscode` remains `^1.75.0`; the implementation must use browser-safe
  webview code and VS Code APIs available at that version.
- Manual desktop verification of row selection, tree selection/jump, Header
  controls, column selection, existing-flow focus, and first-open flow reveal
  remains a useful follow-up when an allowed VS Code host is available.

## Use-Case Back-Propagation

- No use-case back-propagation is required for the completed slice. Durable
  behavior is covered by this feature spec and the existing navigation and
  search-unification use cases.
