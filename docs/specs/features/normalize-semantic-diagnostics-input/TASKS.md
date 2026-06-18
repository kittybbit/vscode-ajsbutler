# Normalize Semantic Diagnostics Input Tasks

## Current Task

- Status: Proposed
- Scope: no implementation task remains; review the feature for closure.
- Acceptance: confirm durable behavior is represented in the related use cases
  and no active risk or follow-up remains.
- Validation: docs-only validation for any closure update.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.

## Decision Notes

- Semantic diagnostic production modules now consume normalized AJS contracts.
- Parser syntax errors, hover, presentation mapping, diagnostic DTOs, and
  JP1/AJS3 version 13 diagnostic behavior remain unchanged.
- No unresolved desktop, web, or VS Code `^1.75.0` compatibility risk remains.

## Use-Case Back-Propagation

- Source-location preservation is recorded as a durable normalized-model rule
  in `uc-normalize-ajs-document.md`.
- Existing `uc-provide-editor-feedback.md` scenarios remain unchanged as
  regression contracts.
