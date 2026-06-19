# Relocate React Webview Presentation Tasks

## Current Task

- Status: Proposed
- Scope: no implementation task remains; review the feature for closure.
- Acceptance: confirm the live presentation paths are documented and no active
  relocation risk remains.
- Validation: docs-only validation for any closure update.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.

## Decision Notes

- All 74 React webview modules now live under `src/presentation/webview/`.
- Table and flow webpack entries resolve the new paths, and the unused
  `@ui-component/*` TypeScript alias was removed.
- Desktop tests, web tests, production build, type compilation, Qlty, and
  Markdown validation passed after the relocation.
- No unresolved desktop, web, or VS Code `^1.75.0` compatibility risk remains.
- Qlty metrics found pre-existing presentation complexity. Any cleanup must be
  a separate feature; extracting viewer bridge routing is the first candidate.

## Use-Case Back-Propagation

- No behavioral scenario changed. The flow-graph presentation-owner path and
  live architecture/current-state paths were updated.
