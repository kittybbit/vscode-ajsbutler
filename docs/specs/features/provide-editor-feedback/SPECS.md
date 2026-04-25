# SPECS: provide-editor-feedback

## Purpose

Define diagnostics and hover behavior for JP1/AJS editor feedback.

## Origin

Source use case: docs/requirements/use-cases/uc-provide-editor-feedback.md

## Acceptance Criteria

- Diagnostics and hover behavior are available in desktop and web hosts.
- Parser/application diagnostics stay decoupled from direct UI rendering.
- Tests preserve invalid-document diagnostics and parameter hover behavior.

## Implementation Notes

- Keep VS Code API usage near extension adapter boundaries.
