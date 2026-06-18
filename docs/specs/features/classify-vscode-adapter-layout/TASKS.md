# Classify VS Code Adapter Layout Tasks

## Current Task

- Status: Proposed
- Scope: no implementation task remains; review the feature for closure.
- Acceptance: confirm the live architecture paths are documented and no active
  relocation risk or follow-up remains.
- Validation: docs-only validation for any closure update.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.

## Decision Notes

- All VS Code presentation modules now live under `src/presentation/vscode/`.
- Telemetry and credential implementations now live under infrastructure.
- Activation, dependency construction, lifecycle, and subscription assembly now
  live under `src/bootstrap/extension/`.
- The stable `src/extension.ts` desktop/web entry remains unchanged except for
  its bootstrap import path.
- The unreferenced case-only duplicate `TextEditorFinder.ts` was removed.
- No unresolved desktop, web, or VS Code `^1.75.0` compatibility risk remains.

## Use-Case Back-Propagation

- No use-case changes are required. Existing editor-feedback, telemetry,
  WebAPI import, and cross-view navigation scenarios remain regression
  contracts.
