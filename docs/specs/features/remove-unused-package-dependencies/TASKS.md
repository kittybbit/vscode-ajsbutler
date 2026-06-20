# Feature Tasks: Remove Unused Package Dependencies

## Sync Rule

- Update this file in the same commit whenever a task is completed, re-scoped,
  or intentionally dropped.
- Update `docs/specs/plans.md` only when the branch starts, stops, or changes
  an active feature.
- Update `docs/specs/roadmap.md` when repository sequencing changes.
- Keep this file focused on current state only; do not retain historical logs,
  prior approvals, or long validation diaries once they stop being actionable.

## Current Task

- Status: Proposed
- Scope: investigate the next tooling-only removal set separately from
  packaging dependencies.
- Acceptance: confirm whether direct `@eslint/eslintrc`,
  `@typescript-eslint/eslint-plugin`, and `@typescript-eslint/parser` entries
  are redundant when `typescript-eslint` and `eslint` remain installed.
- Validation: record complete lint configuration and dependency-graph impact
  before requesting new implementation approval.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.
Only clear human approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the human approval message.

Reset this section back to Pending when the approved slice is complete and no
active implementation approval remains.

## Decision Notes

- A complete direct-dependency sweep covered source imports, implicit type
  loading, package scripts, webpack fallbacks and loaders, lint configuration,
  test runners, OpenAPI generation and Prism startup, VS Code packaging
  metadata, CI, and desktop/web entry points.
- The confirmed-unused `@types/glob`, `@types/react-router-dom`,
  `@types/react-window`, `@types/styled-components`, and `@types/uuid`
  declarations were removed without source or configuration changes.
- Retain `@types/vscode-webview`: it supplies the global
  `acquireVsCodeApi` declaration used by `bootstrapViewer.tsx`. Retain the
  remaining `@types` entries for Mocha globals, Node APIs, React, ReactDOM, and
  VS Code APIs.
- Retain apparent zero-import CLI packages whose binaries are used by scripts
  or generated tests: `@stoplight/prism-cli`, `antlr4ts-cli`, `npm-run-all`,
  `rimraf`, and `webpack-cli`.
- Retain `@emotion/react` and `@emotion/styled` as required MUI peer/runtime
  dependencies, and retain all webpack browser fallbacks.
- Follow-up tooling candidates are `@eslint/eslintrc`, the direct
  `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` entries.
  `@vscode/vsce` remains a separate packaging candidate.
- No new dependency removal is approved. Source, configuration, tests,
  generated artifacts, overrides, and `engines.vscode` remain out of scope.

## Use-Case Back-Propagation

- None. Dependency metadata changes do not alter observable behavior
  contracts.
