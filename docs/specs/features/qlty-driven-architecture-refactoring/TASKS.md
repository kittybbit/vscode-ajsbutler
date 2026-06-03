# TASKS: qlty-driven-architecture-refactoring

## Record Rule

Keep only information needed for the next implementation decision or for
deciding whether a change must be reflected back into a use case. Do not keep a
complete work log, per-slice history, or validation transcript after it no
longer affects approval, risk, or use-case back-propagation.

Update `docs/specs/plans.md` only when the branch starts, stops, or changes an
active feature. Slice progress stays in this file.

## Current Status

- Active task:
  Slice-4-H viewer message routing dispatch cleanup is selected for approval.
- Runtime status:
  Slice-4-G schedule diagnostic helper decomposition is
  complete.
- Use-case reflection:
  None expected. Slice-4-H must preserve table/flow webview message routing,
  save validation, optional save-handler behavior, resource/ready/operation/
  navigation dispatch, panel disposal cleanup, and webview operation telemetry.

## Human Approval

- Status: Pending
- Approved at:
  none.
- Approved scope:
  none.

Implementation must not start while Status is Pending. Only clear human
approval can change Status to Approved.
`Approved at` records the approval result only, such as `none` or `approved in
current conversation`; do not copy the approval message.

## Active Tasks

- [x] Select Slice-4-G schedule diagnostic helper decomposition as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-G.
- [x] Implement Slice-4-G inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-H viewer message routing dispatch cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [ ] Record human approval for Slice-4-H.
- [ ] Implement Slice-4-H inside the approved scope.
- [ ] Run required validation.
- [ ] Reconfirm that use-case reflection is unnecessary.

## Validation Plan

- For the next code slice, run `rtk pnpm run qlty`, `rtk pnpm test`,
  `rtk pnpm run test:web`, and `rtk pnpm run build`.

## Approval-Sensitive Scope

Slice-4-H may decompose `createViewerMessageHandler` in
`src/extension/webview/viewerMessageRouting.ts` into smaller dispatch helpers
or an equivalent typed route table. The change must be behavior-preserving:
event type handling, the existing save error message, optional `onSave`
behavior, operation telemetry forwarding, navigation forwarding, ready/resource
dispatch, and panel disposal cleanup must remain unchanged.

Expected implementation files are limited to
`src/extension/webview/viewerMessageRouting.ts` and focused regression coverage
in `src/test/suite/viewerMessageRouting.test.ts` if needed. No generated
artifacts, package metadata, VS Code compatibility settings, parser behavior,
or webview UI components are in scope.

## Deferred Use-Case Backlog

- None.

Completed Slice-1, Slice-2, Slice-3, Slice-4-A, Slice-4-B, Slice-4-C,
Slice-4-D, Slice-4-E, Slice-4-F, and Slice-4-G refactors were
behavior-preserving and do not currently require use-case updates. The
`buildUnitListView.ts` / WebAPI DTO duplication finding is not a current
candidate because it appears to be DTO copy-shape similarity rather than shared
behavior. Remaining domain-unit duplication clusters should only be reopened
when they represent a stronger shared JP1/AJS business concept or use-case need
than getter-shape similarity alone.
