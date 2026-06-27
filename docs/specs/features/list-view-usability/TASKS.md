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
- Completed selected-unit detail behavior uses a shared right-side detail pane
  component for list and flow viewers. The list table no longer exposes
  row-level definition-dialog or flow-graph cross-link buttons; those actions
  are available from the selected-unit detail pane.
- List detail selection uses stable `absolutePath` identity, resolves
  application-provided `UnitDefinitionDialogDto` only for the pane definition
  action, keeps the definition dialog inside the active theme provider, and
  avoids row-selection regressions by keeping table/selector rendering work
  bounded.
- A shared domain/application search service remains deferred until
  `uc-search-domain-unification.md` has a separate approved slice.
- `engines.vscode` remains `^1.75.0`; the implementation must use browser-safe
  webview code and VS Code APIs available at that version.
- Manual desktop verification of row selection latency, tree selection/jump,
  Header controls, column selection, pane close/collapse, definition-dialog
  action, and pane flow-graph navigation remains a useful follow-up when an
  allowed VS Code host is available.

## Use-Case Back-Propagation

- The detail-pane task is covered by `uc-show-unit-definition.md` because it
  reuses the existing application-provided definition DTO from a pane action.
  Revisit that use case only if implementation changes definition content,
  command generation, or table/flow definition parity.
- `uc-navigate-between-unit-list-and-flow-graph.md` remains the durable bridge
  contract; revisit it only if moving the list action from row icon to detail
  pane changes payloads, failure policy, or target-scope behavior.
