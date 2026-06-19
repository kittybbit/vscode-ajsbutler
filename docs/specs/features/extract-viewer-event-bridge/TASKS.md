# Extract Viewer Event Bridge Tasks

## Current Task

- Status: Proposed
- Scope: no implementation task remains; review the feature for closure.
- Acceptance: confirm the viewer bridge boundary is documented and no active
  compatibility or routing risk remains.
- Validation: docs-only validation for any closure update.

## Human Approval

- Status: Pending
- Approved at: none
- Approved scope: none

Implementation must not start while Status is Pending.

## Decision Notes

- The presentation-local viewer bridge now owns callback registration,
  removal, message validation, and dispatch.
- `bootstrapViewer` retains VS Code API acquisition, global bridge exposure,
  browser listener installation, and React mounting.
- Focused tests cover valid dispatch, invalid messages, and callback removal.
- Desktop tests, web tests, production build, Qlty, and Markdown validation
  passed with no new compatibility risk.

## Use-Case Back-Propagation

- None required because observable viewer behavior and event contracts remain
  unchanged.
