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
  Slice-4-J viewer counterpart reveal wiring cleanup is selected for approval.
- Runtime status:
  Slice-4-I diagnostics registration event cleanup is complete.
- Use-case reflection:
  None expected. Slice-4-J must preserve table/flow viewer subscription
  creation, open command registration, cross-view navigation target resolution,
  existing counterpart-panel reveal behavior, reveal-unit message posting, and
  current no-op behavior when the counterpart panel is unavailable.

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
- [x] Record human approval for Slice-4-H.
- [x] Implement Slice-4-H inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-I diagnostics registration event cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [x] Record human approval for Slice-4-I.
- [x] Implement Slice-4-I inside the approved scope.
- [x] Run required validation.
- [x] Reconfirm that use-case reflection is unnecessary.
- [x] Select Slice-4-J viewer counterpart reveal wiring cleanup as the next
      candidate.
- [x] Record the behavior-preservation and use-case reflection decision.
- [x] Record the approval-sensitive implementation boundary.
- [ ] Record human approval for Slice-4-J.
- [ ] Implement Slice-4-J inside the approved scope.
- [ ] Run required validation.
- [ ] Reconfirm that use-case reflection is unnecessary.

## Validation Plan

- For the next code slice, run `rtk pnpm run qlty`, `rtk pnpm test`,
  `rtk pnpm run test:web`, and `rtk pnpm run build`.

## Approval-Sensitive Scope

Slice-4-J may decompose counterpart viewer reveal wiring in
`src/extension/bootstrap/viewerWiring.ts`, including replacing the
many-parameter `revealExistingCounterpartPanel` call shape with a small
request/dependency object or equivalent helper. The change must be
behavior-preserving: table and flow viewer subscriptions, `open.<viewType>`
command registration, target view type resolution, lookup of an existing panel
for the same document, `panel.reveal(panel.viewColumn)`, posting
`createRevealUnitEvent(absolutePath)`, and no-op behavior when no counterpart
factory or panel exists must remain unchanged.

Expected implementation files are limited to
`src/extension/bootstrap/viewerWiring.ts` and focused regression coverage in
`src/test/suite/viewerWiring.test.ts` if needed. No webview UI component,
application DTO, parser, generated artifact, package metadata, VS Code
compatibility setting, or command semantics change is in scope.

## Deferred Use-Case Backlog

- None.

Completed Slice-1, Slice-2, Slice-3, Slice-4-A, Slice-4-B, Slice-4-C,
Slice-4-D, Slice-4-E, Slice-4-F, Slice-4-G, Slice-4-H, and Slice-4-I refactors were
behavior-preserving and do not currently require use-case updates. The
`buildUnitListView.ts` / WebAPI DTO duplication finding is not a current
candidate because it appears to be DTO copy-shape similarity rather than shared
behavior. Remaining domain-unit duplication clusters should only be reopened
when they represent a stronger shared JP1/AJS business concept or use-case need
than getter-shape similarity alone.
